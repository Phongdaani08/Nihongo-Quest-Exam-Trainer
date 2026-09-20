from __future__ import annotations

import os
import re
import sqlite3
from pathlib import Path
from typing import Any

from client_agent.config import AgentConfig, AgentSourceConfig
from client_agent.state import AgentState


def fetch_sql_rows(*, config: AgentConfig, source: AgentSourceConfig, state: AgentState) -> list[dict[str, Any]]:
    if not source.query:
        raise ValueError(f"source {source.name}: query is required")
    driver = (source.driver or "sqlite").strip().lower()
    cursor_value = _source_cursor_value(state, source, state.server_ack_high_watermark_at)
    params = {"cursor": cursor_value, "limit": source.fetch_limit}

    if driver == "sqlite":
        dsn = _resolve_sql_dsn(source)
        return _fetch_sqlite_rows(dsn=dsn, query=source.query, params=params)
    if driver in {"postgres", "postgresql"}:
        dsn = _resolve_sql_dsn(source)
        return _fetch_postgres_rows(dsn=dsn, query=source.query, params=params)
    if driver == "mysql":
        dsn = _resolve_sql_dsn(source)
        return _fetch_mysql_rows(dsn=dsn, query=source.query, params=params)
    raise ValueError(f"source {source.name}: unsupported SQL driver {driver}")


def _fetch_sqlite_rows(*, dsn: str, query: str, params: dict[str, Any]) -> list[dict[str, Any]]:
    path = Path(dsn).expanduser().resolve()
    conn = sqlite3.connect(str(path))
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def _fetch_postgres_rows(*, dsn: str, query: str, params: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        import psycopg
        from psycopg.rows import dict_row
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError("psycopg is required for postgres SQL sources") from exc

    rewritten, ordered = _rewrite_named_query_for_postgres(query, params)
    with psycopg.connect(dsn, row_factory=dict_row) as conn:
        with conn.cursor() as cur:
            cur.execute(rewritten, ordered)
            rows = cur.fetchall()
    return [dict(row) for row in rows]


def _fetch_mysql_rows(*, dsn: str, query: str, params: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        import pymysql
        from pymysql.cursors import DictCursor
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError("PyMySQL is required for mysql SQL sources") from exc

    connect_args = _parse_mysql_dsn(dsn)
    rewritten, ordered = _rewrite_named_query_for_positional(query, params, placeholder="%s")
    conn = pymysql.connect(cursorclass=DictCursor, **connect_args)
    try:
        with conn.cursor() as cur:
            cur.execute(rewritten, ordered)
            rows = cur.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def _rewrite_named_query_for_postgres(query: str, params: dict[str, Any]) -> tuple[str, list[Any]]:
    return _rewrite_named_query_for_positional(query, params, placeholder="%s")


def _rewrite_named_query_for_positional(query: str, params: dict[str, Any], *, placeholder: str) -> tuple[str, list[Any]]:
    ordered: list[Any] = []

    def replace(match: re.Match[str]) -> str:
        name = match.group(1)
        ordered.append(params.get(name))
        return placeholder

    rewritten = re.sub(r":([A-Za-z_][A-Za-z0-9_]*)", replace, query)
    return rewritten, ordered


def _resolve_sql_dsn(source: AgentSourceConfig) -> str:
    if source.dsn:
        return source.dsn
    if source.dsn_env:
        value = os.environ.get(source.dsn_env, "").strip()
        if value:
            return value
    raise ValueError(f"source {source.name}: dsn or dsn_env is required")


def _source_cursor_value(state: AgentState, source: AgentSourceConfig, fallback: str | None) -> str | None:
    checkpoints = state.source_checkpoints or {}
    value = checkpoints.get(source.name)
    if value not in (None, ""):
        return str(value)
    if source.cursor and source.cursor.initial not in (None, ""):
        return str(source.cursor.initial)
    return fallback


def _parse_mysql_dsn(dsn: str) -> dict[str, Any]:
    from urllib.parse import parse_qs, unquote, urlparse

    parsed = urlparse(dsn)
    if parsed.scheme.lower() not in {"mysql", "mysql+pymysql"}:
        raise ValueError("MySQL DSN must start with mysql:// or mysql+pymysql://")
    query = parse_qs(parsed.query)
    args: dict[str, Any] = {
        "host": parsed.hostname or "127.0.0.1",
        "port": parsed.port or 3306,
        "user": unquote(parsed.username or ""),
        "password": unquote(parsed.password or ""),
        "database": parsed.path.lstrip("/") or None,
        "charset": query.get("charset", ["utf8mb4"])[0],
        "autocommit": True,
    }
    return args
