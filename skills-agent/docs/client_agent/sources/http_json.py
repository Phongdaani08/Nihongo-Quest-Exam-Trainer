from __future__ import annotations

from typing import Any

import requests

from client_agent.config import AgentConfig, AgentSourceConfig
from client_agent.state import AgentState

def fetch_http_json_rows(*, config: AgentConfig, source: AgentSourceConfig, state: AgentState) -> list[dict[str, Any]]:
    if not source.endpoint:
        raise ValueError(f"source {source.name}: endpoint is required")
    params = dict(source.params)

    cursor_value = _source_cursor_value(state, source, state.server_ack_high_watermark_at)
    if source.cursor and cursor_value:
        params[source.cursor.param_name or "cursor"] = cursor_value
    response = requests.request(
        method=source.method,
        url=source.endpoint,
        headers=source.headers,
        params=params,
        timeout=source.timeout_sec or config.request_timeout_sec,
        verify=config.verify_tls,
    )
    response.raise_for_status()
    payload = response.json()
    rows = _extract_array(payload, source.array_path)
    if not isinstance(rows, list):
        raise ValueError(f"source {source.name}: extracted payload is not a list")
    normalized: list[dict[str, Any]] = []
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError(f"source {source.name}: HTTP row must be an object")
        normalized.append({str(key): value for key, value in row.items()})
    return normalized


def _extract_array(payload: Any, array_path: str | None) -> Any:
    if array_path is None or not array_path.strip():
        return payload
    current = payload
    for part in array_path.split("."):
        if not isinstance(current, dict):
            raise ValueError(f"array_path step {part} expected an object")
        current = current.get(part)
    return current


def _source_cursor_value(state: AgentState, source: AgentSourceConfig, fallback: str | None) -> str | None:
    checkpoints = state.source_checkpoints or {}
    value = checkpoints.get(source.name)
    if value not in (None, ""):
        return str(value)
    if source.cursor and source.cursor.initial not in (None, ""):
        return str(source.cursor.initial)
    return fallback
