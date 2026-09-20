from __future__ import annotations

import logging
import time
from pathlib import Path
from typing import Any

from client_agent.api import ApiError, ClientIngestApi
from client_agent.config import AgentConfig
from client_agent.spool import (
    SpoolBatch,
    archive_spool_file,
    discover_spool_files,
    load_spool_batch,
    pending_queue_count,
    quarantine_spool_file,
)
from client_agent.source_runtime import poll_configured_sources
from client_agent.source_runtime import preview_source_data
from client_agent.state import AgentState, AgentStateStore
from client_agent.utils import max_iso, normalize_iso, utc_now_iso
import json

LOG = logging.getLogger(__name__)


class ClientIngestAgent:
    def __init__(self, config: AgentConfig):
        self.config = config
        self.state_store = AgentStateStore(config.state_file)
        self.state = self.state_store.load()
        if self.state.source_checkpoints is None:
            self.state.source_checkpoints = {}
        if self.state.source_counters is None:
            self.state.source_counters = {}
        if self.state.source_statuses is None:
            self.state.source_statuses = {}
        self.api = ClientIngestApi(config, token=self.state.token)

    def ensure_registered(self) -> AgentState:
        if self.state.installation_id and self.state.token:
            return self.state
        payload = self.api.register_installation()
        self.state.installation_id = str(payload["installation_id"])
        self.state.token = str(payload["token"])
        self.state.organization_id = _none_if_null(
            payload.get("organization_id"))
        self.state.project_id = _none_if_null(payload.get("project_id"))
        self.state.client_id = self.config.client_id
        self.state.source_system = self.config.source_system
        self.state.schema_version = self.config.schema_version
        self._persist_state(clear_error=True)
        self.api = ClientIngestApi(self.config, token=self.state.token)
        LOG.info("registered installation %s", self.state.installation_id)
        return self.state

    def status_snapshot(self) -> dict[str, Any]:
        pending = discover_spool_files(self.config.spool_dir)
        failed = list(Path(self.config.failed_dir).glob("*.json*"))
        return {
            "installation_id": self.state.installation_id,
            "client_id": self.config.client_id,
            "source_system": self.config.source_system,
            "schema_version": self.config.schema_version,
            "pending_files": len(pending),
            "failed_files": len(failed),
            "state_file": str(self.config.state_file),
            "spool_dir": str(self.config.spool_dir),
            "archive_dir": str(self.config.archive_dir),
            "failed_dir": str(self.config.failed_dir),
            "last_server_time_seen": self.state.last_server_time_seen,
            "last_successful_batch_at": self.state.last_successful_batch_at,
            "server_ack_high_watermark_at": self.state.server_ack_high_watermark_at,
            "last_sync_error_code": self.state.last_sync_error_code,
            "last_sync_error_message": self.state.last_sync_error_message,
            "source_checkpoints": self.state.source_checkpoints or {},
            "source_statuses": self.state.source_statuses or {},
            "configured_sources": [source.name for source in self.config.sources],
        }

    def poll_sources(self, names: list[str] | None = None, *, max_events: int | None = None) -> list[dict[str, Any]]:
        results = poll_configured_sources(
            config=self.config, state=self.state, names=names, max_events=max_events)
        self._persist_state(clear_error=False)

        return results

    def preview_source(self, name: str, *, max_rows: int = 5, max_events: int = 5) -> dict[str, Any]:
        for source in self.config.sources:
            if source.name == name:
                return preview_source_data(config=self.config, source=source, state=self.state, max_rows=max_rows, max_events=max_events)
        raise ValueError(f"Configured source not found: {name}")

    def send_heartbeat(self, *, force_status: str | None = None) -> dict[str, Any]:
        self.ensure_registered()
        pending = pending_queue_count(self.config.spool_dir)
        payload = {
            "installation_id": self.state.installation_id,
            "heartbeat_at": utc_now_iso(),
            "agent_time": utc_now_iso(),
            "last_server_time_seen": self.state.last_server_time_seen,
            "agent_version": self.config.agent_version,
            "schema_version": self.config.schema_version,
            "status": force_status or self._derive_agent_status(pending),
            "source_high_watermark_at": self.state.source_high_watermark_at,
            "last_successful_batch_at": self.state.last_successful_batch_at,
            "last_attempted_batch_at": self.state.last_attempted_batch_at,
            "next_planned_sync_at": self._next_planned_sync_at(),
            "sync_interval_sec": self.config.sync_interval_sec,
            "pending_queue_count": pending,
            "last_sync_error_code": self.state.last_sync_error_code,
            "last_sync_error_message": self.state.last_sync_error_message,
            "payload": {
                "spool_dir": str(self.config.spool_dir),
                "archive_dir": str(self.config.archive_dir),
                "failed_dir": str(self.config.failed_dir),
                "source_checkpoints": self.state.source_checkpoints or {},
                "source_statuses": self.state.source_statuses or {},
            },
        }
        response = self.api.send_heartbeat(payload)
        self.state.last_heartbeat_at = payload["heartbeat_at"]
        self.state.last_server_time_seen = _none_if_null(
            response.get("server_time"))
        self.state.last_connection_health = _none_if_null(
            response.get("connection_health"))
        self.state.last_sync_health = _none_if_null(
            response.get("sync_health"))
        self.state.last_clock_health = _none_if_null(
            response.get("clock_health"))
        self.state.last_clock_skew_ms = _as_int(response.get("clock_skew_ms"))
        self.state.server_ack_high_watermark_at = max_iso(
            self.state.server_ack_high_watermark_at,
            _none_if_null(response.get("accepted_through")),
        )
        self._persist_state(clear_error=False)
        return response

    def flush_pending(self, max_files: int | None = None) -> list[dict[str, Any]]:
        self.ensure_registered()
        pending = discover_spool_files(self.config.spool_dir)
        results: list[dict[str, Any]] = []
        limit = max_files or self.config.batch_max_files
        for path in pending[:limit]:
            try:
                results.append(self._process_spool_file(path))
            except Exception as exc:
                LOG.warning("failed to process %s: %s", path.name, exc)
                results.append({"file": path.name, "error": str(exc)})
        print(json.dumps(results, indent=2))
        return results

    def run_forever(self) -> None:
        LOG.info("starting client ingest agent loop")
        next_heartbeat = 0.0
        next_sync = 0.0
        while True:
            now = time.monotonic()
            try:
                self.ensure_registered()
                if now >= next_sync:
                    if self.config.sources:
                        self.poll_sources()
                    self.flush_pending()
                    next_sync = now + self.config.sync_interval_sec
                if now >= next_heartbeat:
                    self.send_heartbeat()
                    next_heartbeat = now + self.config.heartbeat_interval_sec
            except ApiError as exc:
                self._set_error("api_error", str(exc))
                LOG.warning("agent API error: %s", exc)
            except Exception as exc:  # pragma: no cover - defensive loop guard
                self._set_error("agent_runtime_error", str(exc))
                LOG.exception("agent loop failed")
            time.sleep(self.config.loop_sleep_sec)

    def _process_spool_file(self, path: Path) -> dict[str, Any]:
        batch: SpoolBatch | None = None
        try:
            batch = load_spool_batch(path)
        except Exception as exc:
            quarantine_spool_file(
                None, self.config.failed_dir, str(exc), source_path=path)
            self._set_error("spool_decode_error", str(exc))
            raise

        self.state.source_high_watermark_at = max_iso(
            self.state.source_high_watermark_at,
            batch.source_high_watermark_at,
        )
        self.state.last_attempted_batch_at = utc_now_iso()
        self._persist_state(clear_error=False)

        payload = {
            "installation_id": self.state.installation_id,
            "batch_id": batch.batch_id,
            "idempotency_key": batch.idempotency_key,
            "schema_version": self.config.schema_version,
            "sent_at": utc_now_iso(),
            "source_high_watermark_at": batch.source_high_watermark_at,
            "payload_hash": batch.payload_hash,
            "events": batch.events,
        }
        try:
            response, status_code = self.api.submit_batch(payload)
        except ApiError as exc:
            self._set_error("ingest_api_error", str(exc))
            raise

        status = str(response.get("status", "")).strip()
        self.state.last_attempted_batch_at = _none_if_null(
            response.get("received_at")) or self.state.last_attempted_batch_at
        self.state.last_server_time_seen = max_iso(
            self.state.last_server_time_seen,
            _none_if_null(response.get("received_at")),
        )
        self.state.last_clock_skew_ms = _as_int(response.get("clock_skew_ms"))
        self.state.source_high_watermark_at = max_iso(
            self.state.source_high_watermark_at,
            _none_if_null(response.get("source_high_watermark_at")
                          ) or batch.source_high_watermark_at,
        )
        self.state.server_ack_high_watermark_at = max_iso(
            self.state.server_ack_high_watermark_at,
            _none_if_null(response.get("accepted_through")),
        )

        if status_code == 409 or status in {"accepted", "duplicate"}:
            archive_spool_file(batch, self.config.archive_dir)
            self.state.last_successful_batch_at = _none_if_null(
                response.get("received_at")) or utc_now_iso()
            if batch.source_name and batch.source_high_watermark_at:
                checkpoints = self.state.source_checkpoints or {}
                checkpoints[batch.source_name] = max_iso(checkpoints.get(
                    batch.source_name), batch.source_high_watermark_at) or batch.source_high_watermark_at
                self.state.source_checkpoints = checkpoints
                statuses = self.state.source_statuses or {}
                status_entry = dict(statuses.get(batch.source_name) or {})
                status_entry["lastCheckpointAt"] = checkpoints[batch.source_name]
                status_entry["lastAckedAt"] = self.state.last_successful_batch_at
                status_entry["health"] = "healthy"
                statuses[batch.source_name] = status_entry
                self.state.source_statuses = statuses
            self._persist_state(clear_error=True)
        elif status in {"partially_accepted", "rejected"}:
            quarantine_spool_file(
                batch, self.config.failed_dir, status, response_payload=response)
            self._set_error(
                "batch_rejected" if status == "rejected" else "batch_partially_accepted",
                str(response.get("error_summary") or status),
            )
        else:
            archive_spool_file(batch, self.config.archive_dir)
            self.state.last_successful_batch_at = _none_if_null(
                response.get("received_at")) or utc_now_iso()
            self._persist_state(clear_error=True)
        return response

    def _derive_agent_status(self, pending_count: int) -> str:
        if self.state.last_sync_error_code:
            return "warning"
        if pending_count > 0:
            return "warning"
        return "ok"

    def _next_planned_sync_at(self) -> str:
        base = normalize_iso(utc_now_iso())
        return normalize_iso(
            time.strftime(
                "%Y-%m-%dT%H:%M:%SZ",
                time.gmtime(time.time() + self.config.sync_interval_sec),
            )
        ) or base or utc_now_iso()

    def _set_error(self, code: str, message: str) -> None:
        self.state.last_sync_error_code = code
        self.state.last_sync_error_message = message[:1000]
        self._persist_state(clear_error=False)

    def _persist_state(self, *, clear_error: bool) -> None:
        if clear_error:
            self.state.last_sync_error_code = None
            self.state.last_sync_error_message = None
        self.state_store.save(self.state)


def _as_int(value: Any) -> int | None:
    if value in (None, ""):
        return None
    return int(value)


def _none_if_null(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return None if not text or text.lower() == "null" else text
