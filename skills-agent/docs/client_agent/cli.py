from __future__ import annotations

import argparse
import json
import logging
import shutil
import sys
from pathlib import Path

from client_agent.agent import ClientIngestAgent
from client_agent.config import AgentConfig, ConfigValidationError


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Universal Billing client ingest agent")
    parser.add_argument(
        "--config",
        default="/etc/universal-billing-client-agent/config.yaml",
        help="Path to agent config YAML",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        help="Python log level (DEBUG, INFO, WARNING, ERROR)",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("register", help="Register the installation and persist the bearer token")
    sub.add_parser("heartbeat", help="Send one heartbeat immediately")

    flush = sub.add_parser("flush", help="Flush pending spool files")
    flush.add_argument("--max-files", type=int, default=None, help="Maximum pending files to flush")

    run = sub.add_parser("run", help="Run the agent loop")
    run.add_argument("--once", action="store_true", help="Run one flush + heartbeat cycle and exit")

    enqueue = sub.add_parser("enqueue-file", help="Copy or move a json/jsonl file into the pending spool")
    enqueue.add_argument("source", help="Path to source JSON/JSONL payload")
    enqueue.add_argument("--move", action="store_true", help="Move instead of copy")

    zbx = sub.add_parser("import-zabbix-parquet", help="Convert Zabbix parquet snapshots into one pending spool batch")
    zbx.add_argument("--history", required=True, help="Path to zabbix_history.parquet")
    zbx.add_argument("--items", required=True, help="Path to zabbix_items.parquet")
    zbx.add_argument("--hosts", required=True, help="Path to zabbix_hosts.parquet")
    zbx.add_argument("--max-events", type=int, default=None, help="Maximum usage events to emit into the spool file")
    zbx.add_argument(
        "--cpu-pct-interval-sec",
        type=int,
        default=60,
        help="Sampling interval for nutanix.vm.cpu.usage.perf percent metrics",
    )

    poll_source = sub.add_parser("poll-source", help="Poll one configured SQL/HTTP source and write a spool batch")
    poll_source.add_argument("--name", required=True, help="Configured source name")
    poll_source.add_argument("--max-events", type=int, default=None, help="Maximum events to emit into the spool file")

    poll_sources = sub.add_parser("poll-sources", help="Poll all configured SQL/HTTP sources and write spool batches")
    poll_sources.add_argument("--names", default="", help="Comma-separated subset of source names")
    poll_sources.add_argument("--max-events", type=int, default=None, help="Maximum events per source")

    preview = sub.add_parser("preview-source", help="Fetch and preview raw rows plus mapped usage events without writing a spool file")
    preview.add_argument("--name", required=True, help="Configured source name")
    preview.add_argument("--max-rows", type=int, default=5, help="Maximum source rows to preview")
    preview.add_argument("--max-events", type=int, default=5, help="Maximum mapped events to preview")

    sub.add_parser("validate-config", help="Validate the config file and print a deployment-friendly summary")
    sub.add_parser("status", help="Print local state and queue summary")
    return parser


def _normalize_global_options(argv: list[str]) -> list[str]:
    normalized: list[str] = []
    deferred: list[str] = []
    index = 0
    while index < len(argv):
        token = argv[index]
        if token in {"--config", "--log-level"}:
            deferred.append(token)
            if index + 1 < len(argv):
                deferred.append(argv[index + 1])
                index += 2
                continue
        normalized.append(token)
        index += 1
    return deferred + normalized


def main(argv: list[str] | None = None) -> int:
    argv = _normalize_global_options(list(argv) if argv is not None else sys.argv[1:])
    parser = build_parser()
    args = parser.parse_args(argv)
    logging.basicConfig(
        level=getattr(logging, str(args.log_level).upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )

    if args.command == "validate-config":
        try:
            config = AgentConfig.validate_file(args.config)
        except ConfigValidationError as exc:
            print(str(exc))
            return 2
        print(
            json.dumps(
                {
                    "ok": True,
                    "config_path": str(config.config_path),
                    "sources": [source.name for source in config.sources],
                    "spool_dir": str(config.spool_dir),
                    "state_file": str(config.state_file),
                },
                indent=2,
            )
        )
        return 0

    if args.command == "preview-source":
        try:
            config = AgentConfig.load(args.config, create_dirs=False)
        except ConfigValidationError as exc:
            print(str(exc))
            return 2
        agent = ClientIngestAgent(config)
        print(json.dumps(agent.preview_source(args.name, max_rows=args.max_rows, max_events=args.max_events), indent=2))
        return 0

    try:
        config = AgentConfig.load(args.config)
    except ConfigValidationError as exc:
        print(str(exc))
        return 2
    agent = ClientIngestAgent(config)

    if args.command == "register":
        state = agent.ensure_registered()
        print(json.dumps({"installation_id": state.installation_id, "client_id": config.client_id}, indent=2))
        return 0

    if args.command == "heartbeat":
        print(json.dumps(agent.send_heartbeat(), indent=2))
        return 0

    if args.command == "flush":
        print(json.dumps(agent.flush_pending(max_files=args.max_files), indent=2))
        return 0

    if args.command == "status":
        print(json.dumps(agent.status_snapshot(), indent=2))
        return 0

    if args.command == "poll-source":
        print(json.dumps(agent.poll_sources([args.name], max_events=args.max_events), indent=2))
        return 0

    if args.command == "poll-sources":
        names = [item.strip() for item in str(args.names).split(",") if item.strip()]
        print(json.dumps(agent.poll_sources(names or None, max_events=args.max_events), indent=2))
        return 0

    if args.command == "enqueue-file":
        src = Path(args.source).expanduser().resolve()
        if not src.is_file():
            raise SystemExit(f"Source file not found: {src}")
        dest = config.spool_dir / src.name
        if dest.exists():
            raise SystemExit(f"Destination already exists: {dest}")
        if args.move:
            shutil.move(str(src), str(dest))
        else:
            shutil.copy2(src, dest)
        print(json.dumps({"queued": str(dest)}, indent=2))
        return 0

    if args.command == "import-zabbix-parquet":
        from client_agent.sources.zabbix_parquet import import_zabbix_parquet_to_spool

        result = import_zabbix_parquet_to_spool(
            config=config,
            state=agent.state,
            history_path=args.history,
            items_path=args.items,
            hosts_path=args.hosts,
            max_events=args.max_events,
            cpu_pct_interval_sec=args.cpu_pct_interval_sec,
        )
        print(
            json.dumps(
                {
                    "spool_file": str(result.spool_file),
                    "event_count": result.event_count,
                    "source_high_watermark_at": result.source_high_watermark_at,
                },
                indent=2,
            )
        )
        return 0

    if args.command == "run":
        if args.once:
            agent.ensure_registered()
            if config.sources:
                polled = agent.poll_sources()
            else:
                polled = []
            flushed = agent.flush_pending()
            heartbeat = agent.send_heartbeat()
            print(json.dumps({"polled": polled, "flushed": flushed, "heartbeat": heartbeat}, indent=2))
            return 0
        agent.run_forever()
        return 0

    parser.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main())
