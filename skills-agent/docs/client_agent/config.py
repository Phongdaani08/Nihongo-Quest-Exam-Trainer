from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

from client_agent.utils import ensure_directory, expand_env


class ConfigValidationError(ValueError):
    def __init__(self, errors: list[str]):
        self.errors = errors
        message = "Configuration validation failed:\n" + "\n".join(f"- {item}" for item in errors)
        super().__init__(message)


@dataclass
class AgentSourceCursorConfig:
    column: str
    kind: str = "timestamp"
    param_name: str | None = None
    tie_breaker: str | None = None
    initial: str | None = None


@dataclass
class AgentSourceMappingConfig:
    pattern: str
    fields: dict[str, Any]
    dimensions: dict[str, Any]


@dataclass
class AgentSourceConfig:
    name: str
    kind: str
    enabled: bool
    source_system: str
    driver: str | None
    dsn: str | None
    dsn_env: str | None
    query: str | None
    fetch_limit: int | None
    endpoint: str | None
    method: str
    headers: dict[str, str]
    params: dict[str, Any]
    array_path: str | None
    timeout_sec: int | None
    cursor: AgentSourceCursorConfig | None
    mapping: AgentSourceMappingConfig


@dataclass
class AgentConfig:
    config_path: Path
    api_base_url: str
    request_timeout_sec: int
    verify_tls: bool
    registration_token: str | None
    client_id: str
    organization_id: str | None
    project_id: str | None
    external_org_id: str | None
    external_project_id: str | None
    source_system: str
    schema_version: str
    display_name: str
    billing_plan_id: str | None
    allowed_meters: list[str]
    metadata: dict[str, Any]
    agent_version: str
    heartbeat_interval_sec: int
    sync_interval_sec: int
    loop_sleep_sec: int
    batch_max_files: int
    spool_dir: Path
    archive_dir: Path
    failed_dir: Path
    state_file: Path
    sources: list[AgentSourceConfig] = field(default_factory=list)

    @classmethod
    def load(cls, path: str | Path, *, create_dirs: bool = True) -> "AgentConfig":
        config_path = Path(path).expanduser().resolve()
        if not config_path.is_file():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        raw = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}
        if not isinstance(raw, dict):
            raise ValueError("Config root must be a mapping")
        expanded = expand_env(raw)
        return cls.from_mapping(expanded, config_path=config_path, create_dirs=create_dirs)

    @classmethod
    def validate_file(cls, path: str | Path) -> "AgentConfig":
        config_path = Path(path).expanduser().resolve()
        if not config_path.is_file():
            raise FileNotFoundError(f"Config file not found: {config_path}")
        raw = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}
        if not isinstance(raw, dict):
            raise ValueError("Config root must be a mapping")
        expanded = expand_env(raw)
        return cls.from_mapping(expanded, config_path=config_path, create_dirs=False)

    @classmethod
    def from_mapping(cls, expanded: dict[str, Any], *, config_path: Path, create_dirs: bool) -> "AgentConfig":
        server = cls._mapping(expanded.get("server"), "server")
        installation = cls._mapping(expanded.get("installation"), "installation")
        agent = cls._mapping(expanded.get("agent"), "agent")
        storage = cls._mapping(expanded.get("storage"), "storage")
        raw_sources = expanded.get("sources") or []
        errors: list[str] = []


        api_base_url = str(server.get("api_base_url", "")).rstrip("/")
        if not api_base_url:
            errors.append("server.api_base_url is required")

        client_id = str(installation.get("client_id", "")).strip()
        source_system = str(installation.get("source_system", "")).strip()
        schema_version = str(installation.get("schema_version", "")).strip()
        display_name = str(installation.get("display_name", "")).strip()
        if not client_id:
            errors.append("installation.client_id is required")
        if not source_system:
            errors.append("installation.source_system is required")
        if not schema_version:
            errors.append("installation.schema_version is required")
        if not display_name:
            errors.append("installation.display_name is required")

        def resolve_path(value: str, default_name: str) -> Path:
            text = str(value).strip() if value is not None else ""
            if not text:
                text = default_name
            p = Path(text).expanduser()
            if not p.is_absolute():
                p = (config_path.parent / p).resolve()
            return p
        spool_dir = resolve_path(storage.get("spool_dir"), "spool")
        archive_dir = resolve_path(storage.get("archive_dir"), "archive")
        failed_dir = resolve_path(storage.get("failed_dir"), "failed")
        state_file = resolve_path(storage.get("state_file"), "state/agent-state.json")

        metadata = installation.get("metadata") or {}
        if not isinstance(metadata, dict):
            errors.append("installation.metadata must be a mapping")
            metadata = {}

        allowed_meters = installation.get("allowed_meters") or []
        if not isinstance(allowed_meters, list):
            errors.append("installation.allowed_meters must be a list")
            allowed_meters = []

        if not isinstance(raw_sources, list):
            errors.append("sources must be a list")
            raw_sources = []

        sources: list[AgentSourceConfig] = []
        for index, item in enumerate(raw_sources):
            try:
                sources.append(cls._parse_source(item, config_path=config_path, installation=installation, index=index))
            except ConfigValidationError as exc:
                errors.extend(exc.errors)
            except ValueError as exc:
                errors.append(str(exc))

        request_timeout_sec = cls._coerce_int(server.get("request_timeout_sec", 30), "server.request_timeout_sec", minimum=1, errors=errors, default=30)
        heartbeat_interval_sec = cls._coerce_int(agent.get("heartbeat_interval_sec", 60), "agent.heartbeat_interval_sec", minimum=10, errors=errors, default=60)
        sync_interval_sec = cls._coerce_int(agent.get("sync_interval_sec", 30), "agent.sync_interval_sec", minimum=5, errors=errors, default=30)
        loop_sleep_sec = cls._coerce_int(agent.get("loop_sleep_sec", 5), "agent.loop_sleep_sec", minimum=1, errors=errors, default=5)
        batch_max_files = cls._coerce_int(agent.get("batch_max_files", 10), "agent.batch_max_files", minimum=1, errors=errors, default=10)

        if errors:
            raise ConfigValidationError(errors)

        if create_dirs:
            ensure_directory(spool_dir)
            ensure_directory(archive_dir)
            ensure_directory(failed_dir)
            ensure_directory(state_file.parent)

        return cls(
            config_path=config_path,
            api_base_url=api_base_url,
            request_timeout_sec=request_timeout_sec,
            verify_tls=bool(server.get("verify_tls", True)),
            registration_token=cls._optional_str(server.get("registration_token")),
            client_id=client_id,
            organization_id=cls._optional_str(installation.get("organization_id")),
            project_id=cls._optional_str(installation.get("project_id")),
            external_org_id=cls._optional_str(installation.get("external_org_id")),
            external_project_id=cls._optional_str(installation.get("external_project_id")),
            source_system=source_system,
            schema_version=schema_version,
            display_name=display_name,
            billing_plan_id=cls._optional_str(installation.get("billing_plan_id")),
            allowed_meters=[str(item).strip() for item in allowed_meters if str(item).strip()],
            metadata=metadata,
            agent_version=str(agent.get("agent_version", "0.1.0")).strip() or "0.1.0",
            heartbeat_interval_sec=heartbeat_interval_sec,
            sync_interval_sec=sync_interval_sec,
            loop_sleep_sec=loop_sleep_sec,
            batch_max_files=batch_max_files,
            spool_dir=spool_dir,
            archive_dir=archive_dir,
            failed_dir=failed_dir,
            state_file=state_file,
            sources=sources,
        )

    @staticmethod
    def _mapping(value: Any, name: str) -> dict[str, Any]:
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise ValueError(f"{name} section must be a mapping")
        return value

    @staticmethod
    def _optional_str(value: Any) -> str | None:
        if value is None:
            return None
        text = str(value).strip()
        return text or None

    @classmethod
    def _parse_source(
        cls,
        value: Any,
        *,
        config_path: Path,
        installation: dict[str, Any],
        index: int,
    ) -> AgentSourceConfig:
        source = cls._mapping(value, f"sources[{index}]")
        name = str(source.get("name", "")).strip()
        kind = str(source.get("kind", "")).strip().lower()
        errors: list[str] = []
        if not name:
            errors.append(f"sources[{index}].name is required")
        if kind not in {"sql", "http_json", "aws_s3_usage", "aws_cost_explorer"}:
            errors.append(f"sources[{index}] kind must be sql, http_json, aws_s3_usage, or aws_cost_explorer")
        source_label = name or f"sources[{index}]"

        mapping_raw = cls._mapping(source.get("mapping"), f"{source_label} mapping")
        pattern = str(mapping_raw.get("pattern", "direct_event")).strip() or "direct_event"
        if pattern not in {"direct_event", "counter_delta"}:
            errors.append(f"{source_label}: unsupported mapping.pattern {pattern}")
        fields = cls._mapping(mapping_raw.get("fields"), f"{source_label} mapping.fields")
        dimensions = cls._mapping(mapping_raw.get("dimensions"), f"{source_label} mapping.dimensions")
        if "event_time" not in fields:
            errors.append(f"{source_label}: mapping.fields.event_time is required")
        if "meter_key" not in fields:
            errors.append(f"{source_label}: mapping.fields.meter_key is required")
        if "service_id" not in fields:
            errors.append(f"{source_label}: mapping.fields.service_id is required")
        if "resource_id" not in fields:
            errors.append(f"{source_label}: mapping.fields.resource_id is required")
        if "usage_quantity" not in fields:
            errors.append(f"{source_label}: mapping.fields.usage_quantity is required")
        if "billing_unit" not in fields:
            errors.append(f"{source_label}: mapping.fields.billing_unit is required")

        cursor_value = source.get("cursor")
        cursor: AgentSourceCursorConfig | None = None
        if cursor_value is not None:
            cursor_raw = cls._mapping(cursor_value, f"{source_label} cursor")
            column = str(cursor_raw.get("column", "")).strip()
            if not column:
                errors.append(f"{source_label}: cursor.column is required when cursor is configured")
            cursor = AgentSourceCursorConfig(
                column=column,
                kind=str(cursor_raw.get("kind", "timestamp")).strip() or "timestamp",
                param_name=cls._optional_str(cursor_raw.get("param_name")),
                tie_breaker=cls._optional_str(cursor_raw.get("tie_breaker")),
                initial=cls._optional_str(cursor_raw.get("initial")),
            )
            if cursor.kind not in {"timestamp", "numeric", "string"}:
                errors.append(f"{source_label}: cursor.kind must be timestamp, numeric, or string")

        headers = cls._mapping(source.get("headers"), f"{source_label} headers")
        params = cls._mapping(source.get("params"), f"{source_label} params")
        source_system = cls._optional_str(source.get("source_system")) or str(installation.get("source_system", "")).strip()
        if not source_system:
            errors.append(f"{source_label}: source_system is required")

        driver = cls._optional_str(source.get("driver"))
        query = cls._optional_str(source.get("query"))
        endpoint = cls._optional_str(source.get("endpoint"))
        dsn = cls._optional_str(source.get("dsn"))
        dsn_env = cls._optional_str(source.get("dsn_env"))
        fetch_limit = cls._coerce_int(source.get("fetch_limit"), f"{source_label}.fetch_limit", minimum=1, errors=errors, default=None)
        timeout_sec = cls._coerce_int(source.get("timeout_sec"), f"{source_label}.timeout_sec", minimum=1, errors=errors, default=None)
        if kind == "sql":
            if driver not in {"sqlite", "postgres", "postgresql", "mysql"}:
                errors.append(f"{source_label}: sql driver must be sqlite, postgres, postgresql, or mysql")
            if not query:
                errors.append(f"{source_label}: query is required for sql sources")
            if not dsn and not dsn_env:
                errors.append(f"{source_label}: dsn or dsn_env is required for sql sources")
        if kind == "http_json":
            if not endpoint:
                errors.append(f"{source_label}: endpoint is required for http_json sources")
            elif not endpoint.lower().startswith(("http://", "https://")):
                errors.append(f"{source_label}: endpoint must start with http:// or https://")
        if kind == "aws_s3_usage":
            if not params.get("bucket_name"):
                errors.append(f"{source_label}: params.bucket_name is required for aws_s3_usage sources")
        if errors:
            raise ConfigValidationError(errors)

        return AgentSourceConfig(
            name=name,
            kind=kind,
            enabled=bool(source.get("enabled", True)),
            source_system=source_system,
            driver=driver,
            dsn=dsn,
            dsn_env=dsn_env,
            query=query,
            fetch_limit=fetch_limit,
            endpoint=endpoint,
            method=str(source.get("method", "GET")).strip().upper() or "GET",
            headers={str(key): str(val) for key, val in headers.items()},
            params=params,
            array_path=cls._optional_str(source.get("array_path")),
            timeout_sec=timeout_sec,
            cursor=cursor,
            mapping=AgentSourceMappingConfig(pattern=pattern, fields=fields, dimensions=dimensions),
        )

    @staticmethod
    def _coerce_int(
        value: Any,
        field_name: str,
        *,
        minimum: int,
        errors: list[str],
        default: int | None,
    ) -> int | None:
        if value in (None, ""):
            return default
        try:
            number = int(value)
        except Exception:
            errors.append(f"{field_name} must be an integer")
            return default
        if number < minimum:
            errors.append(f"{field_name} must be >= {minimum}")
            return default
        return number
