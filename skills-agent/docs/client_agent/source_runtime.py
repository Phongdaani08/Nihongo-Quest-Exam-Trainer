from __future__ import annotations

import logging
from copy import deepcopy
from typing import Any

from client_agent.config import AgentConfig, AgentSourceConfig
from client_agent.mapping import determine_source_high_watermark, map_rows_to_usage_events
from client_agent.spool import write_spool_events
from client_agent.state import AgentState
from client_agent.utils import max_iso, utc_now_iso

LOG = logging.getLogger(__name__)

def poll_source_to_spool(
    *,
    config: AgentConfig,
    source: AgentSourceConfig,
    state: AgentState,
    max_events: int | None = None,
) -> dict[str, Any]:
    if not source.enabled:
        _set_source_status(
            state,
            source.name,
            {
                "kind": source.kind,
                "health": "disabled",
                "lastPollAt": utc_now_iso(),
            },
        )
        return {"source": source.name, "skipped": True, "reason": "disabled"}
    rows = _fetch_rows(config=config, source=source, state=state)
    if not rows:
        _set_source_status(
            state,
            source.name,
            {
                "kind": source.kind,
                "health": "idle",
                "lastPollAt": utc_now_iso(),
                "lastSuccessAt": utc_now_iso(),
                "lastRowCount": 0,
                "lastEventCount": 0,
                "lastSourceWatermarkAt": state.source_checkpoints.get(source.name) if state.source_checkpoints else None,
                "lastCheckpointAt": state.source_checkpoints.get(source.name) if state.source_checkpoints else None,
                "lastError": None,
            },
        )
        return {"source": source.name, "spool_file": None, "row_count": 0, "event_count": 0}

    counter_state = _ensure_counter_state(state, source.name)
    events = map_rows_to_usage_events(source=source, rows=rows, counter_state=counter_state)
    import json
    LOG.info(json.dumps(events, indent=4))
    
    if max_events is not None:
        events = events[: max(1, int(max_events))]
    if not events:
        watermark = determine_source_high_watermark(rows, source.cursor.column if source.cursor else None)
        _set_source_status(
            state,
            source.name,
            {
                "kind": source.kind,
                "health": "idle",
                "lastPollAt": utc_now_iso(),
                "lastSuccessAt": utc_now_iso(),
                "lastRowCount": len(rows),
                "lastEventCount": 0,
                "lastSourceWatermarkAt": watermark,
                "lastCheckpointAt": state.source_checkpoints.get(source.name) if state.source_checkpoints else None,
                "lastError": None,
            },
        )
        return {"source": source.name, "spool_file": None, "row_count": len(rows), "event_count": 0}

    watermark = determine_source_high_watermark(rows, source.cursor.column if source.cursor else None)
    spool_file = write_spool_events(
        spool_dir=config.spool_dir,
        source_name=source.name,
        events=events,
        source_high_watermark_at=watermark,
        file_stem=f"{source.kind}-{source.name}",
    )
    _set_source_status(
        state,
        source.name,
        {
            "kind": source.kind,
            "health": "healthy",
            "lastPollAt": utc_now_iso(),
            "lastSuccessAt": utc_now_iso(),
            "lastRowCount": len(rows),
            "lastEventCount": len(events),
            "lastSourceWatermarkAt": watermark,
            "lastCheckpointAt": state.source_checkpoints.get(source.name) if state.source_checkpoints else None,
            "lastSpoolFile": str(spool_file),
            "lastError": None,
        },
    )
    return {
        "source": source.name,
        "spool_file": str(spool_file),
        "row_count": len(rows),
        "event_count": len(events),
        "source_high_watermark_at": watermark,
    }

def poll_configured_sources(
    *,
    config: AgentConfig,
    state: AgentState,
    names: list[str] | None = None,
    max_events: int | None = None,
) -> list[dict[str, Any]]:
    wanted = set(names or [])
    results: list[dict[str, Any]] = []
    for source in config.sources:
        if wanted and source.name not in wanted:
            continue    
        try:
            results.append(poll_source_to_spool(config=config, source=source, state=state, max_events=max_events))
        except Exception as exc:
            LOG.warning("source %s failed: %s", source.name, exc)
            _set_source_status(
                state,
                source.name,
                {
                    "kind": source.kind,
                    "health": "error",
                    "lastPollAt": utc_now_iso(),
                    "lastError": str(exc),
                    "lastCheckpointAt": state.source_checkpoints.get(source.name) if state.source_checkpoints else None,
                },
            )
            results.append({"source": source.name, "error": str(exc)})
    return results


def preview_source_data(
    *,
    config: AgentConfig,
    source: AgentSourceConfig,
    state: AgentState,
    max_rows: int = 5,
    max_events: int = 5,
) -> dict[str, Any]:
    rows = _fetch_rows(config=config, source=source, state=state)
    preview_rows = rows[: max(0, max_rows)]
    raw_counters = state.source_counters or {}
    counter_state = deepcopy(raw_counters.get(source.name) or {})
    events = map_rows_to_usage_events(source=source, rows=preview_rows, counter_state=counter_state)
    watermark = determine_source_high_watermark(rows, source.cursor.column if source.cursor else None)
    return {
        "source": source.name,
        "kind": source.kind,
        "row_count": len(rows),
        "preview_row_count": len(preview_rows),
        "event_count_from_preview_rows": len(events[: max(0, max_events)]),
        "source_high_watermark_at": watermark,
        "rows": preview_rows,
        "events": events[: max(0, max_events)],
    }

def _fetch_rows(*, config: AgentConfig, source: AgentSourceConfig, state: AgentState) -> list[dict[str, Any]]:
    if source.kind == "sql":
        from client_agent.sources.sql import fetch_sql_rows
        return fetch_sql_rows(config=config, source=source, state=state)
    if source.kind == "http_json":
        from client_agent.sources.http_json import fetch_http_json_rows
        return fetch_http_json_rows(config=config, source=source, state=state)
    if source.kind == "aws_s3_usage":
        from client_agent.sources.aws_s3_usage import fetch_aws_s3_usage_rows
        test = fetch_aws_s3_usage_rows(config=config, source=source, state=state)
        return test
    if source.kind == "aws_cost_explorer":
        from client_agent.sources.aws_cost_explorer import fetch_aws_cost_explorer_rows
        return fetch_aws_cost_explorer_rows(config=config, source=source, state=state)
        
    raise ValueError(f"Unsupported source kind: {source.kind}")

def _ensure_counter_state(state: AgentState, source_name: str) -> dict[str, float]:
    if state.source_counters is None:
        state.source_counters = {}
    raw = state.source_counters.get(source_name)
    if not isinstance(raw, dict):
        raw = {}
        state.source_counters[source_name] = raw
    normalized: dict[str, float] = {}
    for key, value in raw.items():
        try:
            normalized[str(key)] = float(value)
        except Exception:
            continue
    state.source_counters[source_name] = normalized
    return normalized


def _set_source_status(state: AgentState, source_name: str, payload: dict[str, Any]) -> None:
    if state.source_statuses is None:
        state.source_statuses = {}
    current = dict(state.source_statuses.get(source_name) or {})
    current.update({key: value for key, value in payload.items() if value is not None})
    checkpoint = current.get("lastCheckpointAt")
    source_watermark = current.get("lastSourceWatermarkAt")
    if checkpoint or source_watermark:
        current["latestWatermarkAt"] = max_iso(
            str(checkpoint) if checkpoint not in (None, "") else None,
            str(source_watermark) if source_watermark not in (None, "") else None,
        )
    state.source_statuses[source_name] = current
