# Smart Docker Execution & Deployment Rules for AI Assistants

This rule defines how AI assistants must handle Docker deployment commands when the user requests short directives like `"รัน docker"`, `"รันระบบ"`, `"up docker"`, or `"deploy"`.

## 1. Automatic Inspection before Running Docker
When the user asks to run Docker, the AI MUST inspect recent file changes (`git status` / diff) and choose the correct execution strategy automatically:

### Execution Matrix

| Condition / Files Modified | Smart Command to Execute | Rationale |
| :--- | :--- | :--- |
| **Standard Code Changes** (`frontend/src/**/*`, `backend/src/**/*`, `migrations/`, etc.) | `docker compose up -d --build --force-recreate` | Ensures container layers are recreated with updated binaries without dropping volumes. |
| **Frontend `.env` Changes** (`.env`, `NEXT_PUBLIC_*`) | `docker compose build --no-cache frontend && docker compose up -d --force-recreate` | Forces Next.js build-time static variables to update without hitting stale cache. |
| **Local AI Models Changed** (`models/`, `LLAMA_*` in `.env`) | `docker compose up -d --build --force-recreate llama-chat llama-embedding` | Recreates model container bindings since llama.cpp containers do not use build triggers. |
| **ETL / Seed Data Changed** (`datasources/zabbix-billing/`) | `docker compose --profile etl up -d --build` | Enables the optional `etl` Docker Compose profile. |

---

## 2. Safety Rules (Database Protection)
- **STRICTLY PROHIBITED**: `docker compose down -v` or any volume deletion flags.
- Databases (`postgres-backend`, `zabbix-billing-db`, `redis`) MUST maintain their persistent volume data at all times.

---

## 3. Verification & Timing
After starting Docker:
1. Check HTTP status code 200 on `http://localhost:3000` and `http://localhost:9080/health`.
2. Report the result clearly to the user along with build timing if requested.
