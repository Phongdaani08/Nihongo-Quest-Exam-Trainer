from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import json

from client_agent.utils import atomic_write_json


@dataclass
class AgentState:
    installation_id: str | None = None
    token: str | None = None
    organization_id: str | None = None
    project_id: str | None = None
    client_id: str | None = None
    source_system: str | None = None
    schema_version: str | None = None
    last_server_time_seen: str | None = None
    last_heartbeat_at: str | None = None
    last_attempted_batch_at: str | None = None
    last_successful_batch_at: str | None = None
    source_high_watermark_at: str | None = None
    server_ack_high_watermark_at: str | None = None
    last_sync_error_code: str | None = None
    last_sync_error_message: str | None = None
    last_connection_health: str | None = None
    last_sync_health: str | None = None
    last_clock_health: str | None = None
    last_clock_skew_ms: int | None = None
    source_checkpoints: dict[str, str] | None = None
    source_counters: dict[str, dict[str, float]] | None = None
    source_statuses: dict[str, dict[str, Any]] | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "AgentState":
        data = {key: value.get(key) for key in cls.__dataclass_fields__}
        if not isinstance(data.get("source_checkpoints"), dict):
            data["source_checkpoints"] = {}
        if not isinstance(data.get("source_counters"), dict):
            data["source_counters"] = {}
        if not isinstance(data.get("source_statuses"), dict):
            data["source_statuses"] = {}
        return cls(**data)


class AgentStateStore:
    def __init__(self, path: str | Path):
        self.path = Path(path)

    def load(self) -> AgentState:
        if not self.path.is_file():
            return AgentState()
        data = json.loads(self.path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            raise ValueError(f"Agent state file must contain an object: {self.path}")
        return AgentState.from_dict(data)

    def save(self, state: AgentState) -> None:
        atomic_write_json(self.path, state.to_dict())
