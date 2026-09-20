from __future__ import annotations

import re
from typing import Any

from client_agent.config import AgentSourceConfig
from client_agent.utils import max_iso, normalize_iso, sha256_hex

_TEMPLATE_RE = re.compile(r"\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}")
_UNIT_FACTORS = {
    ("cpu_minute", "cpu_hour"): 1.0 / 60.0,
    ("cpu_second", "cpu_hour"): 1.0 / 3600.0,
    ("minute", "hour"): 1.0 / 60.0,
    ("second", "hour"): 1.0 / 3600.0,
    ("ms", "second"): 1.0 / 1000.0,
    ("byte", "kb"): 1.0 / 1024.0,
    ("byte", "mb"): 1.0 / (1024.0 * 1024.0),
    ("byte", "gb"): 1.0 / (1024.0 * 1024.0 * 1024.0),
}


CANONICAL_REQUIRED_FIELDS = (
    "event_time",
    "meter_key",
    "service_id",
    "resource_id",
    "usage_quantity",
    "billing_unit",
    "ingest_source",
)


def map_rows_to_usage_events(
    *,
    source: AgentSourceConfig,
    rows: list[dict[str, Any]],
    counter_state: dict[str, float] | None = None,
) -> list[dict[str, Any]]:
    mapped = [map_row_to_usage_event(source=source, row=row) for row in rows]
    pattern = source.mapping.pattern
    if pattern == "direct_event":
        return mapped
    if pattern == "counter_delta":
        return _counter_delta_events(source=source, events=mapped, counter_state=counter_state or {})
    raise ValueError(f"Unsupported mapping pattern: {pattern}")


def map_row_to_usage_event(*, source: AgentSourceConfig, row: dict[str, Any]) -> dict[str, Any]:
    event: dict[str, Any] = {}
    for key, spec in source.mapping.fields.items():
        value = evaluate_mapping_spec(spec, row)
        if key == "event_time":
            value = normalize_iso(str(value)) if value not in (None, "") else None
        event[key] = value
    dimensions = {key: evaluate_mapping_spec(spec, row) for key, spec in source.mapping.dimensions.items()}
    event["dimensions"] = dimensions
    if not event.get("ingest_source"):
        event["ingest_source"] = source.source_system
    for field in CANONICAL_REQUIRED_FIELDS:
        if event.get(field) in (None, ""):
            raise ValueError(f"source {source.name}: mapped event is missing required field {field}")
    event["usage_quantity"] = float(event["usage_quantity"])
    if event["usage_quantity"] < 0:
        raise ValueError(f"source {source.name}: usage_quantity must be non-negative")
    if event.get("unit_price") not in (None, ""):
        event["unit_price"] = float(event["unit_price"])
    if event.get("discount_pct") not in (None, ""):
        event["discount_pct"] = float(event["discount_pct"])
    if event.get("stream_seq") not in (None, ""):
        event["stream_seq"] = int(event["stream_seq"])
    if not event.get("event_id"):
        event["event_id"] = derive_event_id(source.name, event)
    return event


def evaluate_mapping_spec(spec: Any, row: dict[str, Any]) -> Any:
    if spec is None:
        return None
    if isinstance(spec, (int, float, bool)):
        return spec
    if isinstance(spec, dict):
        if "field" in spec:
            return row.get(str(spec["field"]))
        if "literal" in spec:
            return spec["literal"]
        if "coalesce" in spec:
            for item in spec["coalesce"]:
                resolved = evaluate_mapping_spec(item, row)
                if resolved not in (None, ""):
                    return resolved
            return None
        if "template" in spec:
            return _render_template(str(spec["template"]), row)
        if "concat" in spec:
            return "".join("" if part is None else str(part) for part in (evaluate_mapping_spec(item, row) for item in spec["concat"]))
        if "strip" in spec:
            value = evaluate_mapping_spec(spec["strip"], row)
            return None if value is None else str(value).strip()
        if "lower" in spec:
            value = evaluate_mapping_spec(spec["lower"], row)
            return None if value is None else str(value).lower()
        if "upper" in spec:
            value = evaluate_mapping_spec(spec["upper"], row)
            return None if value is None else str(value).upper()
        if "to_float" in spec:
            value = evaluate_mapping_spec(spec["to_float"], row)
            return None if value in (None, "") else float(value)
        if "to_int" in spec:
            value = evaluate_mapping_spec(spec["to_int"], row)
            return None if value in (None, "") else int(float(value))
        if "round" in spec:
            round_spec = spec["round"]
            if not isinstance(round_spec, dict):
                raise ValueError("round spec must be an object with value and optional digits")
            value = evaluate_mapping_spec(round_spec.get("value"), row)
            if value in (None, ""):
                return None
            digits = int(round_spec.get("digits", 0))
            return round(float(value), digits)
        if "multiply" in spec:
            factors = spec["multiply"]
            if not isinstance(factors, list) or not factors:
                raise ValueError("multiply spec must be a non-empty list")
            product = 1.0
            for item in factors:
                value = evaluate_mapping_spec(item, row)
                product *= float(value)
            return product
        if "divide" in spec:
            divide_spec = spec["divide"]
            if not isinstance(divide_spec, dict):
                raise ValueError("divide spec must be an object with value and by")
            value = evaluate_mapping_spec(divide_spec.get("value"), row)
            divisor = evaluate_mapping_spec(divide_spec.get("by"), row)
            if value in (None, "") or divisor in (None, ""):
                return None
            return float(value) / float(divisor)
        if "regex_extract" in spec:
            regex_spec = spec["regex_extract"]
            if not isinstance(regex_spec, dict):
                raise ValueError("regex_extract spec must be an object")
            value = evaluate_mapping_spec(regex_spec.get("value"), row)
            if value in (None, ""):
                return regex_spec.get("default")
            pattern = str(regex_spec.get("pattern", ""))
            if not pattern:
                raise ValueError("regex_extract.pattern is required")
            flags = re.I if regex_spec.get("ignore_case") else 0
            match = re.search(pattern, str(value), flags)
            if not match:
                return regex_spec.get("default")
            group = int(regex_spec.get("group", 1))
            return match.group(group)
        if "parse_datetime" in spec:
            parse_spec = spec["parse_datetime"]
            if isinstance(parse_spec, dict):
                value = evaluate_mapping_spec(parse_spec.get("value"), row)
            else:
                value = evaluate_mapping_spec(parse_spec, row)
            if value in (None, ""):
                return None
            return normalize_iso(str(value))
        if "normalize_unit" in spec:
            unit_spec = spec["normalize_unit"]
            if not isinstance(unit_spec, dict):
                raise ValueError("normalize_unit spec must be an object")
            value = evaluate_mapping_spec(unit_spec.get("value"), row)
            from_unit = str(evaluate_mapping_spec(unit_spec.get("from"), row) if "from" in unit_spec else unit_spec.get("from_unit", "")).strip().lower()
            to_unit = str(evaluate_mapping_spec(unit_spec.get("to"), row) if "to" in unit_spec else unit_spec.get("to_unit", "")).strip().lower()
            if value in (None, ""):
                return None
            return normalize_unit_value(float(value), from_unit=from_unit, to_unit=to_unit)
        raise ValueError(f"Unsupported mapping object: {spec}")
    if isinstance(spec, list):
        return [evaluate_mapping_spec(item, row) for item in spec]
    if not isinstance(spec, str):
        return spec

    text = spec.strip()
    if not text:
        return ""
    if (text.startswith("'") and text.endswith("'")) or (text.startswith('"') and text.endswith('"')):
        return text[1:-1]
    if "{{" in text and "}}" in text:
        return _render_template(text, row)
    if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", text):
        if text not in row:
            raise KeyError(f"row field not found for mapping: {text}")
        return row[text]
    return text


def derive_event_id(source_name: str, event: dict[str, Any]) -> str:
    base = "\n".join(
        [
            source_name,
            str(event.get("event_time") or ""),
            str(event.get("tenant_id") or ""),
            str(event.get("service_id") or ""),
            str(event.get("resource_id") or ""),
            str(event.get("meter_key") or ""),
            str(event.get("billing_unit") or ""),
            str(event.get("usage_quantity") or ""),
        ]
    )
    return f"{source_name}-{sha256_hex(base)[:24]}"


def determine_source_high_watermark(rows: list[dict[str, Any]], cursor_column: str | None) -> str | None:
    watermark: str | None = None
    if not cursor_column:
        return None
    for row in rows:
        value = row.get(cursor_column)
        if value in (None, ""):
            continue
        watermark = max_iso(watermark, normalize_iso(str(value)))
    return watermark


def _counter_delta_events(
    *,
    source: AgentSourceConfig,
    events: list[dict[str, Any]],
    counter_state: dict[str, float],
) -> list[dict[str, Any]]:
    emitted: list[dict[str, Any]] = []
    for event in sorted(events, key=lambda item: str(item.get("event_time") or "")):
        counter_key = "|".join(
            [
                str(event.get("tenant_id") or ""),
                str(event.get("service_id") or ""),
                str(event.get("resource_id") or ""),
                str(event.get("meter_key") or ""),
                str(event.get("billing_unit") or ""),
            ]
        )
        current_total = float(event["usage_quantity"])
        previous_total = counter_state.get(counter_key)
        counter_state[counter_key] = current_total
        if previous_total is None:
            continue
        delta = current_total - previous_total
        if delta <= 0:
            continue
        next_event = dict(event)
        next_event["usage_quantity"] = round(delta, 6)
        next_event["event_id"] = derive_event_id(f"{source.name}-delta", next_event)
        emitted.append(next_event)
    return emitted


def _render_template(template: str, row: dict[str, Any]) -> str:
    return _TEMPLATE_RE.sub(lambda match: "" if row.get(match.group(1)) is None else str(row.get(match.group(1))), template)


def normalize_unit_value(value: float, *, from_unit: str, to_unit: str) -> float:
    if not from_unit or not to_unit or from_unit == to_unit:
        return value
    factor = _UNIT_FACTORS.get((from_unit, to_unit))
    if factor is None:
        raise ValueError(f"Unsupported unit conversion: {from_unit} -> {to_unit}")
    return value * factor
