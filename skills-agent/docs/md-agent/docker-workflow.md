# Rule: Smart Docker Execution Workflow

Whenever the user asks to run Docker (e.g., "รัน docker", "รันระบบ", "up docker"), automatically follow the execution matrix in `DOCKER_WORKFLOW_RULES.md`:

1. Analyze changed files first (`git status`).
2. Run smart command:
   - For code changes: `docker compose up -d --build --force-recreate`
   - For `.env` changes: `docker compose build --no-cache frontend && docker compose up -d --force-recreate`
   - For AI model changes: `docker compose up -d --build --force-recreate llama-chat llama-embedding`
3. NEVER run `docker compose down -v` (database volumes must be preserved).
4. Verify HTTP 200 health check on `http://localhost:3000`.
