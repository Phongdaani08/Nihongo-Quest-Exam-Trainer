from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd

from src.billing.credit_engine import cpu_core_minutes_to_cpu_hours

from client_agent.config import AgentConfig
from client_agent.state import AgentState
from client_agent.spool import write_spool_events
from client_agent.utils import normalize_iso

DEFAULT_CPU_PCT_INTERVAL_SEC = 60
DEFAULT_CREDIT_EXCLUDE_SUBSTR = (
    "vm.memory",
    "vm.disk",
    "vm.net",
    "powerstate",
    "inf.ip",
    "metric.get",
    "disk.get",
    "total.disk",
    "net.if.in",
    "net.if.out",
    "uptime",
    "boottime",
    "localtime",
    "system.localtime",
    "system.uname",
    "proc.",
    "disk.io",
    "disk.read",
    "disk.write",
    "bytes.in",
    "bytes.out",
    "traffic",
    "octets",
    "bandwidth",
    "interface.",
    "net.bytes",
)


@dataclass
class ZabbixImportResult:
    spool_file: Path
    event_count: int
    source_high_watermark_at: str | None


def import_zabbix_parquet_to_spool(
    *,
    config: AgentConfig,
    state: AgentState,
    history_path: str | Path,
    items_path: str | Path,
    hosts_path: str | Path,
    max_events: int | None = None,
    cpu_pct_interval_sec: int = DEFAULT_CPU_PCT_INTERVAL_SEC,
) -> ZabbixImportResult:
    history = _read_parquet(history_path, required=True, label="history")
    items = _read_parquet(items_path, required=True, label="items")
    hosts = _read_parquet(hosts_path, required=False, label="hosts")

    events = _build_usage_events(
        history=history,
        items=items,
        hosts=hosts,
        watermark_after=state.server_ack_high_watermark_at,
        cpu_pct_interval_sec=cpu_pct_interval_sec,
    )
    if max_events is not None:
        events = events[: max(1, int(max_events))]
    if not events:
        raise ValueError("No new billable Zabbix events found after checkpoint filtering")

    watermark = events[-1]["event_time"]
    spool_path = write_spool_events(
        spool_dir=config.spool_dir,
        source_name="zabbix_parquet",
        events=events,
        source_high_watermark_at=watermark,
        file_stem="zabbix-import",
    )
    return ZabbixImportResult(
        spool_file=spool_path,
        event_count=len(events),
        source_high_watermark_at=watermark,
    )


def _build_usage_events(
    *,
    history: pd.DataFrame,
    items: pd.DataFrame,
    hosts: pd.DataFrame,
    watermark_after: str | None,
    cpu_pct_interval_sec: int,
) -> list[dict[str, Any]]:
    required_hist = {"itemid", "clock", "value"}
    required_items = {"itemid"}
    missing_hist = sorted(required_hist - set(history.columns))
    missing_items = sorted(required_items - set(items.columns))
    if missing_hist:
        raise ValueError(f"Zabbix history parquet missing columns: {', '.join(missing_hist)}")
    if missing_items:
        raise ValueError(f"Zabbix items parquet missing columns: {', '.join(missing_items)}")

    h = history.copy()
    h["itemid"] = h["itemid"].astype(str)
    h["clock"] = pd.to_numeric(h["clock"], errors="coerce")
    h = h.dropna(subset=["clock"])
    h["clock"] = h["clock"].astype("int64")
    if "ns" not in h.columns:
        h["ns"] = 0
    else:
        h["ns"] = pd.to_numeric(h["ns"], errors="coerce").fillna(0).astype("int64")
    h["_ts"] = pd.to_datetime(h["clock"], unit="s", utc=True)

    it = items.copy()
    it["itemid"] = it["itemid"].astype(str)
    it["hostid"] = it["hostid"].astype(str) if "hostid" in it.columns else "unknown"
    it["item_name"] = (it["name"] if "name" in it.columns else it["itemid"]).astype(str)
    it["item_key"] = (it["key_"] if "key_" in it.columns else it["itemid"]).astype(str)
    it["units"] = (it["units"] if "units" in it.columns else "").astype(str)
    it["value_type"] = pd.to_numeric(it["value_type"], errors="coerce").fillna(-1).astype(int) if "value_type" in it.columns else -1
    it["lastvalue"] = (it["lastvalue"] if "lastvalue" in it.columns else "").astype(str)
    slim = it[["itemid", "hostid", "item_name", "item_key", "units", "value_type", "lastvalue"]]

    merged = h.merge(slim, on="itemid", how="left")
    merged["hostid"] = merged["hostid"].fillna("unknown").astype(str)
    merged["item_name"] = merged["item_name"].fillna(merged["itemid"]).astype(str)
    merged["item_key"] = merged["item_key"].fillna(merged["itemid"]).astype(str)
    merged["value_type"] = pd.to_numeric(merged["value_type"], errors="coerce").fillna(-1).astype(int)

    host_names = {"unknown": "Unknown host"}
    if not hosts.empty and "hostid" in hosts.columns:
        ho = hosts.copy()
        ho["hostid"] = ho["hostid"].astype(str)
        disp = ho["name"].astype(str) if "name" in ho.columns else ho["hostid"]
        host_names.update(dict(zip(ho["hostid"], disp)))

    merged["host_name"] = merged["hostid"].map(lambda x: host_names.get(x, x))
    numeric_value = pd.to_numeric(merged["value"], errors="coerce")
    is_num = merged["value_type"].isin([0, 3])
    merged["_qty"] = numeric_value.abs().where(is_num & numeric_value.notna(), 0.0)

    cpu_num = it[it["item_key"].str.lower().str.contains("nutanix.vm.cpu.num", na=False)].copy()
    cpu_num["last_num"] = pd.to_numeric(cpu_num["lastvalue"], errors="coerce")
    cpu_num = cpu_num.dropna(subset=["last_num"])
    cpu_cores_by_host = cpu_num.groupby("hostid", as_index=True)["last_num"].max().to_dict() if not cpu_num.empty else {}

    cpu_key = merged["item_key"].astype(str).str.lower()
    is_cpu_pct_key = cpu_key.str.contains("nutanix.vm.cpu.usage.perf", na=False)
    if is_cpu_pct_key.any():
        pct = pd.to_numeric(merged.loc[is_cpu_pct_key, "value"], errors="coerce").clip(lower=0.0, upper=100.0).fillna(0.0)
        hostids = merged.loc[is_cpu_pct_key, "hostid"].astype(str)
        cores = hostids.map(lambda hid: float(cpu_cores_by_host.get(hid, 1.0))).astype("float64")
        cores = cores.where(cores > 0, 1.0)
        interval_min = float(max(1, int(cpu_pct_interval_sec))) / 60.0
        merged.loc[is_cpu_pct_key, "_qty"] = ((pct / 100.0) * cores * interval_min).astype("float64")

    excluded = merged["item_key"].astype(str).map(_item_key_excluded_from_credits)
    merged.loc[excluded, "_qty"] = 0.0
    merged["_cpu_hours"] = merged["_qty"].map(cpu_core_minutes_to_cpu_hours).astype("float64")
    merged = merged[merged["_cpu_hours"] > 0].copy()
    if merged.empty:
        return []

    if watermark_after:
        after_ts = pd.Timestamp(normalize_iso(watermark_after))
        merged = merged[merged["_ts"] > after_ts]
    if merged.empty:
        return []

    merged = merged.sort_values(["_ts", "hostid", "itemid", "ns"], ascending=True)
    events: list[dict[str, Any]] = []
    for row in merged.to_dict(orient="records"):
        ts = pd.Timestamp(row["_ts"])
        event_time = ts.to_pydatetime().isoformat().replace("+00:00", "Z")
        hostid = str(row["hostid"])
        itemid = str(row["itemid"])
        ns = int(row.get("ns", 0) or 0)
        item_key = str(row["item_key"])
        item_name = str(row["item_name"])
        host_name = str(row["host_name"])
        cpu_hours = float(row["_cpu_hours"])
        event_id = f"{hostid}|{itemid}|{int(row['clock'])}|{ns}"
        events.append(
            {
                "event_id": event_id,
                "event_time": event_time,
                "tenant_id": hostid,
                "meter_key": "cpu_hour",
                "service_id": item_key[:120] or "zabbix_metric",
                "resource_id": host_name[:200] or hostid,
                "usage_quantity": round(cpu_hours, 6),
                "billing_unit": "cpu_hour",
                "ingest_source": "zabbix",
                "pricing_model": "metric_aggregate",
                "status": "measured",
                "stream_seq": ns,
                "dimensions": {
                    "hostid": hostid,
                    "host_name": host_name,
                    "itemid": itemid,
                    "item_name": item_name,
                    "item_key": item_key,
                    "source_units": str(row.get("units", "") or ""),
                },
            }
        )
    return events


def _read_parquet(path: str | Path, *, required: bool, label: str) -> pd.DataFrame:
    file_path = Path(path).expanduser().resolve()
    if not file_path.is_file():
        if required:
            raise FileNotFoundError(f"Zabbix {label} parquet not found: {file_path}")
        return pd.DataFrame()
    return pd.read_parquet(file_path)


def _item_key_excluded_from_credits(key: str) -> bool:
    lowered = str(key or "").lower()
    return any(part in lowered for part in DEFAULT_CREDIT_EXCLUDE_SUBSTR)
