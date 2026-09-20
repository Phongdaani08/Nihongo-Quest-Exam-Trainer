from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta
from typing import Any

import boto3

from client_agent.config import AgentConfig, AgentSourceConfig
from client_agent.state import AgentState

LOG = logging.getLogger(__name__)

def fetch_aws_s3_usage_rows(
    *, config: AgentConfig, source: AgentSourceConfig, state: AgentState
) -> list[dict[str, Any]]:
    bucket_name = source.params.get("bucket_name")
    if not bucket_name:
        raise ValueError(f"source {source.name}: missing bucket_name parameter")

    try:
        cloudwatch = boto3.client('cloudwatch')
        now = datetime.now(timezone.utc)
        start_time = now - timedelta(days=2)

        response = cloudwatch.get_metric_data(
            MetricDataQueries=[{
                'Id': 's3size',
                'MetricStat': {
                    'Metric': {
                        'Namespace': 'AWS/S3',
                        'MetricName': 'BucketSizeBytes',
                        'Dimensions': [
                            {'Name': 'BucketName', 'Value': bucket_name},
                            {'Name': 'StorageType', 'Value': 'StandardStorage'}
                        ]
                    },
                    'Period': 86400,
                    'Stat': 'Average'
                }
            }],
            StartTime=start_time,
            EndTime=now
        )
        metric_results = response.get("MetricDataResults", [])
        if metric_results and metric_results[0].get("Values") and metric_results[0].get("Timestamps"):
            total_size = int(metric_results[0]["Values"][0])
            metric_time = metric_results[0]["Timestamps"][0]
            timestamp_str = metric_time.isoformat().replace("+00:00", "Z")
            
            LOG.info("Bucket %s size: %d bytes at %s (CloudWatch)", bucket_name, total_size, timestamp_str)
        else:
            total_size = 0
            timestamp_str = now.isoformat().replace("+00:00", "Z")
            LOG.info("Bucket %s size data not found, defaulting to 0", bucket_name)

        gb = total_size / (1024.0 * 1024.0 * 1024.0)
        return [{
            "timestamp": timestamp_str,
            "hostname": bucket_name,
            "gb": round(gb, 6)
        }]

    except Exception as exc:
        LOG.error("Failed to fetch S3 usage for %s: %s", bucket_name, exc)
        raise
