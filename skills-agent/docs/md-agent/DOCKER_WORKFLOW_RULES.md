# Docker Workflow Rules & AI Automation Protocol

This document serves as the authoritative reference for AI agents operating on this codebase.

## Objective
Enable short user prompts like `"รัน docker"`, `"รันระบบ"`, or `"up docker"` while ensuring the AI assistant autonomously determines the correct, optimal Docker Compose command based on recent repository changes.

## AI Operating Protocol

### Step 1: Automatic Change Detection
Before issuing Docker commands, the AI inspects `git status` to categorize recent edits:

1. **Category A: Application Source Code**
   - Target files: `frontend/src/**/*`, `backend/src/**/*`, `backend/migrations/*.sql`, `shared/`
   - Command: `docker compose up -d --build --force-recreate`

2. **Category B: Environment & Build Arguments**
   - Target files: `.env`, `NEXT_PUBLIC_*`
   - Command: `docker compose build --no-cache frontend && docker compose up -d --force-recreate`

3. **Category C: AI Model Weights & Configurations**
   - Target files: `models/`, `LLAMA_*` settings in `.env`
   - Command: `docker compose up -d --build --force-recreate llama-chat llama-embedding`

4. **Category D: Data Warehousing / ETL Pipeline**
   - Target files: `datasources/zabbix-billing/`
   - Command: `docker compose --profile etl up -d --build`

### Step 2: Persistent Storage Protection
- Volume deletion flags (`-v` or `--volumes`) are strictly prohibited unless explicitly requested by the human user.
- Databases (`postgres-backend`, `zabbix-billing-db`, `redis`) must maintain data persistence across all re-deployments.

### Step 3: Health Verification
- Confirm `http://localhost:3000` returns HTTP 200.
- Confirm `http://localhost:9080/health` returns HTTP 200.
