# ไฟล์ทีเกี่ยวข้องกับผู้เขียน somboon-bng ในโปรเจกต์ AI_GenBI

ไฟล์นี้รวบรวมรายการไฟล์ที git ระบุว่า `somboon-bng` เป็นผู้สร้างหรือแก้ไข ใช้อ้างอิงเพื่อป้องกันการลบ/ทับโค้ดของท่านนี้

## ผู้เขียน somboon-bng ใน git history

จากการตรวจสอบ `git log` พบว่า `somboon-bng` มี 2 อีเมล์ในประวัติ commit:

- `somboon-bng <somboon_p@brainergy.digital>`
- `somboon-bng <zanhcpe@gmail.com>`

## ไฟล์ที somboon-bng สร้างขึ้นใหม่ทั้งไฟล์ (`--diff-filter=A`)

คำสั่งทีใช้ตรวจสอบ:

```
git log --author=somboon-bng --diff-filter=A --pretty=format:"" --name-only | Sort-Object -Unique
```

พบทั้งหมด 89 ไฟล์:

- `.env.production.example`
- `.gitattributes`
- `.github/workflows/compose-ci.yml`
- `backend/migrations/0005_data_source_onboarding.sql`
- `backend/migrations/0006_bge_m3_embedding.sql`
- `backend/migrations/0007_all_provider_kinds.sql`
- `backend/migrations/0008_multi_tenancy.sql`
- `backend/migrations/0009_tenant_control_plane.sql`
- `backend/migrations/0010_tenant_security_scope.sql`
- `backend/migrations/0022_workspace_hierarchy.sql`
- `backend/migrations/0023_byok_provider_keys.sql`
- `backend/migrations/0024_google_oauth.sql`
- `backend/migrations/0025_dashboard_layout.sql`
- `backend/migrations/0055_tenant_membership_safeguard.sql`
- `backend/migrations/0056_trigger_recreation_safeguards.sql`
- `backend/src/agent/clarification.rs`
- `backend/src/agent/sql_repair.rs`
- `backend/src/api/adjust_dashboard.rs`
- `backend/src/api/analytics.rs`
- `backend/src/api/byok.rs`
- `backend/src/api/models.rs`
- `backend/src/api/oauth.rs`
- `backend/src/api/roles.rs`
- `backend/src/api/tenant_policy.rs`
- `backend/src/api/tenants.rs`
- `backend/src/api/workspaces.rs`
- `backend/src/crypto.rs`
- `backend/src/db/bigquery.rs`
- `backend/src/db/clickhouse.rs`
- `backend/src/db/elasticsearch.rs`
- `backend/src/db/guardrails.rs`
- `backend/src/db/http_sql.rs`
- `backend/src/db/influxdb.rs`
- `backend/src/db/mongodb.rs`
- `backend/src/db/mssql.rs`
- `backend/src/db/object_store.rs`
- `backend/src/db/profiler.rs`
- `backend/src/db/snowflake.rs`
- `backend/src/llm/traced.rs`
- `backend/src/rag/profiler.rs`
- `backend/src/telemetry.rs`
- `datasources/zabbix-billing/.dockerignore`
- `datasources/zabbix-billing/data_dictionary.yaml`
- `datasources/zabbix-billing/Dockerfile`
- `datasources/zabbix-billing/load.py`
- `datasources/zabbix-billing/README.md`
- `datasources/zabbix-billing/requirements.txt`
- `datasources/zabbix-billing/seed/zabbix_billing_20260717.tar.gz`
- `docker-compose.production.yml`
- `docs/local-chat-ai-gateway.md`
- `docs/PRODUCTION_RUNBOOK.md`
- `frontend/src/app/(main)/catalog/page.tsx`
- `frontend/src/app/(main)/super-admin/tenants/[id]/page.tsx`
- `frontend/src/app/(main)/super-admin/tenants/page.tsx`
- `frontend/src/components/ChatQueryChart.tsx`
- `frontend/src/components/ui/charts/ChartColorPalette.tsx`
- `frontend/src/components/ui/charts/chart-themes.ts`
- `frontend/src/features/catalog/CatalogPage.tsx`
- `frontend/src/features/catalog/catalog-service.ts`
- `frontend/src/features/chat/components/ClarificationWidget.tsx`
- `frontend/src/features/chat/hooks/useAvailableDataSources.ts`
- `frontend/src/features/chat/utils/queryResultDashboard.ts`
- `frontend/src/features/dashboard/components/DashboardAIChat.tsx`
- `frontend/src/features/dashboard/components/DashboardGrid.tsx`
- `frontend/src/features/dashboard/services/auto-chart-select.ts`
- `frontend/src/features/dashboard/services/csv-export.ts`
- `frontend/src/features/dashboard/services/dashboard-ai-adjuster.ts`
- `frontend/src/features/data-sources/hooks/useRoles.ts`
- `frontend/src/features/data-sources/repositories/ApiDataSourceRepository.ts`
- `frontend/src/features/knowledge-base/hooks/useKnowledgeBase.ts`
- `frontend/src/features/knowledge-base/hooks/useKnowledgeItems.ts`
- `frontend/src/features/tenants/components/TenantControlPage.tsx`
- `frontend/src/features/tenants/components/TenantManagementPage.tsx`
- `frontend/src/features/workspaces/services/workspace-service.ts`
- `models/bge-m3-Q4_K_M.gguf`
- `models/bge-m3-q8_0.gguf`
- `models/README.md`
- `ops/backup-postgres.sh`
- `ops/bootstrap-local-prod.sh`
- `ops/deploy-production-vms.sh`
- `ops/docker-compose.bootstrap.app.yml`
- `ops/docker-compose.production.app.yml`
- `ops/docker-compose.production.data.yml`
- `ops/litellm.config.yaml`
- `ops/provision-billing-reader.sh`
- `ops/rsync-ssh-wrapper.sh`
- `ops/smoke-test.sh`
- `ops/validate-production-env.sh`
- `SECURITY.md`

## ไฟล์ที somboon-bng เคยแก้ไขผ่าน commit (รวม add/modify/delete)

คำสั่งทีใช้ตรวจสอบ:

```
git log --author=somboon-bng --pretty=format:"" --name-only | Sort-Object -Unique
```

พบทั้งหมด 223 ไฟล์ ซึ่งรวมถึง 89 ไฟล์ทีสร้างใหม่ด้านบน บวกกับไฟล์อื่นๆ ทีถูกแก้ไขผ่าน commit ของท่าน

## หมายเหตุ

- รายการนี้คัดจาก git history โดยใช้ชื่่อผู้เขียน `somboon-bng` ไม่จำกัดอีเมล์
- ไฟล์ทีอยู่ในรายการ `--diff-filter=A` คือไฟล์ที `somboon-bng` เป็นคนเพิ่มเข้ามาใหม่ทีละไฟล์
- ถ้าต้องการป้องกันการแก้ไข ให้เน้นไฟล์ในรายการ 89 ไฟล์นี้เป็นหลัก
