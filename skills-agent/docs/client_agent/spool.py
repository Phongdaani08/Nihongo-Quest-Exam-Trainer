from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import json
import shutil

from client_agent.utils import atomic_write_json, ensure_directory, max_iso, normalize_iso, sha256_hex, utc_now

REQUIRED_EVENT_FIELDS = (
    "event_id",
    "event_time",
    "meter_key",
    "service_id",
    "resource_id",
    "usage_quantity",
    "billing_unit",
    "ingest_source",
)


@dataclass
class SpoolBatch:
    path: Path
    events: list[dict[str, Any]]
    source_high_watermark_at: str | None
    source_name: str | None
    payload_hash: str
    batch_id: str
    idempotency_key: str
    raw_bytes: int

    @property
    def event_count(self) -> int:
        return len(self.events)


def discover_spool_files(spool_dir: str | Path) -> list[Path]:
    root = Path(spool_dir)
    files = [path for path in root.iterdir() if path.is_file(
    ) and path.suffix.lower() in {".json", ".jsonl"}]
    return sorted(files, key=lambda item: (item.stat().st_mtime, item.name))


def load_spool_batch(path: str | Path) -> SpoolBatch:
    spool_path = Path(path)
    raw_bytes = spool_path.read_bytes()
    payload_hash = sha256_hex(raw_bytes)
    events: list[dict[str, Any]]
    source_high_watermark_at: str | None = None
    source_name: str | None = None

    if spool_path.suffix.lower() == ".jsonl":
        events = []
        for index, line in enumerate(raw_bytes.decode("utf-8").splitlines(), start=1):
            text = line.strip()
            if not text:
                continue
            try:
                event = json.loads(text)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{spool_path.name}:{index} is not valid JSON") from exc
            events.append(_validate_event(event, spool_path.name))
    else:
        try:
            decoded = json.loads(raw_bytes.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError(f"{spool_path.name} is not valid JSON") from exc
        if isinstance(decoded, list):
            events = [_validate_event(item, spool_path.name)
                      for item in decoded]
        elif isinstance(decoded, dict):
            if "events" in decoded:
                raw_events = decoded.get("events")
                if not isinstance(raw_events, list):
                    raise ValueError(
                        f"{spool_path.name} events must be a list")
                events = [_validate_event(item, spool_path.name)
                          for item in raw_events]
                source_high_watermark_at = normalize_iso(
                    decoded.get("source_high_watermark_at"))
                source_name = str(decoded.get(
                    "source_name", "")).strip() or None
            else:
                events = [_validate_event(decoded, spool_path.name)]
        else:
            raise ValueError(
                f"{spool_path.name} must contain an object, events wrapper, or array")

    if not events:
        raise ValueError(f"{spool_path.name} does not contain any events")

    if source_high_watermark_at is None:
        for event in events:
            source_high_watermark_at = max_iso(
                source_high_watermark_at,
                normalize_iso(str(event.get("usage_end_at")
                              or event.get("event_time"))),
            )

    fingerprint = sha256_hex(f"{spool_path.name}\n{payload_hash}")
    return SpoolBatch(
        path=spool_path,
        events=events,
        source_high_watermark_at=source_high_watermark_at,
        source_name=source_name,
        payload_hash=payload_hash,
        batch_id=f"batch-{fingerprint[:24]}",
        idempotency_key=fingerprint,
        raw_bytes=len(raw_bytes),
    )


def archive_spool_file(batch: SpoolBatch, archive_dir: str | Path) -> Path:
    return _move_with_timestamp(batch.path, Path(archive_dir), None)


def quarantine_spool_file(
    batch: SpoolBatch | None,
    failed_dir: str | Path,
    reason: str,
    response_payload: dict[str, Any] | None = None,
    source_path: str | Path | None = None,
) -> Path:
    original = Path(
        source_path) if source_path is not None else batch.path if batch is not None else None
    if original is None:
        raise ValueError("source_path is required when batch is not provided")
    moved = _move_with_timestamp(original, Path(failed_dir), ".meta.json")
    meta = {
        "moved_at": utc_now().isoformat().replace("+00:00", "Z"),
        "reason": reason,
        "response": response_payload or None,
        "event_count": batch.event_count if batch is not None else None,
        "source_high_watermark_at": batch.source_high_watermark_at if batch is not None else None,
    }
    atomic_write_json(moved.with_suffix(moved.suffix + ".meta.json"), meta)
    return moved


def pending_queue_count(spool_dir: str | Path) -> int:
    return len(discover_spool_files(spool_dir))


def write_spool_events(
    *,
    spool_dir: str | Path,
    source_name: str,
    events: list[dict[str, Any]],
    source_high_watermark_at: str | None,
    file_stem: str,
) -> Path:
    if not events:
        raise ValueError("events must not be empty")
    root = ensure_directory(Path(spool_dir))
    stamp = utc_now().strftime("%Y%m%dT%H%M%SZ")
    fingerprint = sha256_hex(f"{source_name}\n{source_high_watermark_at or ''}\n{json.dumps(events, sort_keys=True)}")[:10]
    path = root / f"{file_stem}-{stamp}-{fingerprint}.json"
    atomic_write_json(
        path,
        {
            "source_name": source_name,
            "source_high_watermark_at": source_high_watermark_at,
            "events": events,
        },
    )
    return path


def _validate_event(raw: Any, source_name: str) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError(f"{source_name} contains a non-object event")
    event = {str(key): value for key, value in raw.items()}
    missing = [
        field for field in REQUIRED_EVENT_FIELDS if field not in event or event[field] in (None, "")]
    if missing:
        raise ValueError(f"{source_name} missing required event fields: {', '.join(missing)}")
    normalize_iso(str(event["event_time"]))
    if "usage_start_at" in event and event["usage_start_at"] not in (None, ""):
        normalize_iso(str(event["usage_start_at"]))
    if "usage_end_at" in event and event["usage_end_at"] not in (None, ""):
        normalize_iso(str(event["usage_end_at"]))
    usage_quantity = float(event["usage_quantity"])
    if usage_quantity < 0:
        raise ValueError(f"{source_name} usage_quantity must be non-negative")
    event["usage_quantity"] = usage_quantity
    if "unit_price" in event and event["unit_price"] not in (None, ""):
        event["unit_price"] = float(event["unit_price"])
    if "discount_pct" in event and event["discount_pct"] not in (None, ""):
        event["discount_pct"] = float(event["discount_pct"])
    if "stream_seq" in event and event["stream_seq"] not in (None, ""):
        event["stream_seq"] = int(event["stream_seq"])
    return event


def _move_with_timestamp(path: Path, dest_dir: Path, sidecar_suffix: str | None) -> Path:
    ensure_directory(dest_dir)
    stamp = utc_now().strftime("%Y%m%dT%H%M%SZ")
    dest = dest_dir / f"{stamp}-{path.name}"
    if dest.exists():
        dest = dest_dir / f"{stamp}-{sha256_hex(path.name)[:8]}-{path.name}"
    moved = Path(shutil.move(str(path), str(dest)))
    if sidecar_suffix:
        ensure_directory(moved.parent)
    return moved


