from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta
from typing import Any

import boto3

from client_agent.config import AgentConfig, AgentSourceConfig
from client_agent.state import AgentState

LOG = logging.getLogger(__name__)


TARGET_METRIC = "UnblendedCost"  

GROUP_BY_CONFIG = [
    {"Type": "DIMENSION", "Key": "LINKED_ACCOUNT", "Result_Name": "account_id"},
    {"Type": "DIMENSION", "Key": "SERVICE", "Result_Name": "service"}
]

FILTER_SERVICES = ["Amazon Simple Storage Service", "Amazon Elastic Compute Cloud - Compute"]

SERVICE_MAP = {
    "Amazon Simple Storage Service": "aws_s3",
    "Amazon Elastic Compute Cloud - Compute": "aws_ec2"
}

def fetch_aws_cost_explorer_rows(
    *, config: AgentConfig, source: AgentSourceConfig, state: AgentState
) -> list[dict[str, Any]]:
    try:
        ce = boto3.client("ce", region_name="us-east-1")

        checkpoint = None
        if state and state.source_checkpoints:
            checkpoint = state.source_checkpoints.get(source.name)

        now = datetime.now(timezone.utc)
        today_str = now.strftime("%Y-%m-%d")

        if checkpoint:
            start_str = checkpoint[:10]
            LOG.info("Source %s: Found checkpoint. Fetching cost starting from %s", source.name, start_str)
        else:
            start_date = now.date() - timedelta(days=30)
            start_str = start_date.strftime("%Y-%m-%d")
            LOG.info("Source %s: No checkpoint found. Fetching cost starting from 30 days ago (%s)", source.name, start_str)

        if start_str == today_str:
            start_date = now.date() - timedelta(days=1)
            start_str = start_date.strftime("%Y-%m-%d")

        LOG.info("Querying AWS Cost Explorer from %s to %s (Granularity=DAILY)", start_str, today_str)

        active_groupby = list(GROUP_BY_CONFIG)
        has_service_group = any(item["Key"] == "SERVICE" for item in active_groupby)
        if len(FILTER_SERVICES) > 1 and not has_service_group:
            active_groupby.append({"Type": "DIMENSION", "Key": "SERVICE", "Result_Name": "service"})

        response = ce.get_cost_and_usage(
            TimePeriod={
                "Start": start_str,
                "End": today_str
            },
            Granularity="DAILY",
            Metrics=[TARGET_METRIC], 
            Filter={
                "Dimensions": {
                    "Key": "SERVICE",
                    "Values": FILTER_SERVICES
                }
            },
            GroupBy=[
                {"Type": item["Type"], "Key": item["Key"]}
                for item in active_groupby
            ]
        )

        rows = []
        for result in response.get("ResultsByTime", []):
            start_date = result.get("TimePeriod", {}).get("Start")
            timestamp_str = f"{start_date}T00:00:00Z"
            for group in result.get("Groups", []):
                row_data = {}
                keys = group.get("Keys", [])
                for index, item in enumerate(active_groupby):
                    result_name = item["Result_Name"]
                    raw_val = keys[index] if index < len(keys) else "Unknown"
                    if result_name == "service":
                        row_data[result_name] = SERVICE_MAP.get(raw_val, raw_val.lower().replace(" ", "_"))
                    else:
                        row_data[result_name] = raw_val

                metrics = group.get("Metrics", {})
                target_cost_data = metrics.get(TARGET_METRIC, {})
                amount = float(target_cost_data.get("Amount", 0.0))
                unit = target_cost_data.get("Unit", "USD")

                row_data["start_date"] = timestamp_str
                row_data["cost"] = amount
                row_data["unit"] = unit
 
                if "service" not in row_data:
                    default_srv = FILTER_SERVICES[0] if FILTER_SERVICES else "Amazon Simple Storage Service"
                    row_data["service"] = SERVICE_MAP.get(default_srv, default_srv.lower().replace(" ", "_"))
                
                rows.append(row_data)

        LOG.info("Successfully fetched %d daily cost rows from Cost Explorer", len(rows))
        return rows

    except Exception as exc:
        LOG.error("Failed to fetch S3 cost from Cost Explorer: %s", exc)
        raise
