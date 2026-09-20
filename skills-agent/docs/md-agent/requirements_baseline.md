# Requirements Baseline ล่าสุด

## 1. ภาพรวมผลิตภัณฑ์
- GenBI เป็น Internal Web Application สำหรับ Conversational Analytics
- ผู้ใช้ถามคำถามด้วยภาษาไทยหรือภาษาอังกฤษ
- รองรับ Text-to-SQL chat ในไทย/อังกฤษสำหรับ data source ต่อ query
- ระบบแปลงคำถามเป็น SQL
- ระบบรัน SQL กับแหล่งข้อมูลที่ได้รับอนุญาต
- ผลลัพธ์ถูกแปลงเป็น Table, KPI, Chart และ Dashboard
- รองรับคำถามต่อเนื่องโดยใช้ Conversation Context
- ต้องแสดง SQL ที่นำไปดำเนินการจริงให้ผู้ใช้ตรวจสอบได้
- ถ้า LLM ไม่มั่นใจหรือคำถามผิดพลาดต้องแจ้งผู้ใช้ตรงๆ และไม่ให้ผลลัพธ์เป็นตัวเลขที่เดาขึ้นมาเอง

### North Star Metric
- Time-to-Insight < 8 วินาที สำหรับ query ระดับกลาง (join ไม่เกิน 3 ตาราง, ข้อมูลไม่เกิน 50M แถวหลัง filter)

## User Journey หลัก (Happy Path)
- 01 เปิดแชท
  - เลือก data source ที่ผูกไว้ (เช่น "Sales DW")
- 02 พิมพ์คำถาม
  - "ยอดขายแยกตามภาคเดือนนี้"
- 03 ระบบ generate SQL
  - ใช้ semantic layer + LLM
- 04 render chart ในแชท
  - เลือก chart type อัตโนมัติ
- 05 กด Share
  - ได้ URL คัดลอกส่งต่อได้

## 2. ผู้ใช้และ Permission
- ผู้ใช้ต้อง Login ก่อนใช้ Chat และ Query Function
- ระบบต้องรองรับการสมัครผ่าน email หรือ OAuth (Google) ตามนโยบายองค์กร
- ระบบต้องรองรับ multi-tenant workspace
- ระบบมีบทบาทพื้นฐานเริ่มต้น 4 บทบาท (Admin, Data Analyst, Business Analyst, User) และต้องรองรับการสร้างบทบาทแบบกำหนดเอง (Custom Roles) เพิ่มเติมได้
- Administrator เป็นผู้สร้างบัญชี User
- ไม่มี Open Self-registration
- Administrator กำหนด Initial Workspace Owner
- Owner เพิ่ม User ที่มีบัญชีแล้วเข้า Workspace หรือ Dashboard
- Owner กำหนด Editor หรือ Viewer Permission
- Owner ไม่สามารถให้สิทธิ์ Administrator
- Editor สามารถแก้ไข Dashboard ตาม Permission ที่ได้รับ
- Viewer สามารถดู Dashboard และดำเนินการที่ได้รับอนุญาต
- Public Viewer ดูได้เฉพาะ Dashboard ที่แชร์และไม่สามารถสร้าง Query ใหม่
- Permission ต้องบังคับใช้ทั้งใน UI, API, Retrieval และ Query Execution

## 2.1 Auth & Authorization Matrix
| Action | Owner | Editor | Viewer | Public link |
|---|---|---|---|---|
| ถามคำถามในแชท | ✓ | ✓ | ✓ | ✗ |
| Pin chart เป็น dashboard | ✓ | ✓ | ✗ | ✗ |
| ดู dashboard | ✓ | ✓ | ✓ | ✓ |
| แก้ไข data source connection | ✓ | ✗ | ✗ | ✗ |
| สร้าง/เพิกถอน share link | ✓ | ✓ | ✗ | ✗ |
| export CSV | ✓ | ✓ | ✓ | ตาม allow_export |

## 3. Administrator
- Administrator สร้างและบริหาร User
- Administrator สามารถสร้างบทบาทใหม่ได้ (Create New Role) และมีสิทธิ์แก้ไขการกำหนดค่าสิทธิ์ของแต่ละบทบาท (Permission Matrix) ได้อย่างยืดหยุ่น โดยสิทธิ์การจัดการบทบาทนี้เป็นของ Administrator เท่านั้น
- Administrator กำหนด Initial Owner
- Administrator บริหาร Datasource Configuration
- Administrator ต้องมีหน้าตาที่แสดงการใช้งานของ User ว่าใช้อะไรไปเท่าไหร่
- Administrator ลงทะเบียนและเปิดใช้ Local LLM
- Administrator ลงทะเบียน External AI Provider
- Administrator กำหนด Model และ Provider Allowlist
- Administrator Monitor การใช้งานของ User
- ระบบต้องมี Audit Log สำหรับกิจกรรมสำคัญ
- Administrator Monitoring ต้องไม่ข้าม Data Access Policy
- ขอบเขตการดู Prompt, SQL และ Result Content ยังต้องกำหนด

## 4. แหล่งข้อมูล
- องค์กรมี Data Warehouse อยู่แล้ว
- GenBI ไม่ต้องสร้างหรือบริหาร Data Warehouse
- GenBI เชื่อม Data Warehouse แบบ Read-only
- GenBI เชื่อม PostgreSQL Datasource แบบ Read-only
- Data Warehouse และ PostgreSQL เชื่อมผ่าน Datasource Adapter
- Connector ต้องรองรับ Connection Test, Schema Introspection และ Query Execution
- Datasource PostgreSQL ต้องแยกจาก Application PostgreSQL
- Application PostgreSQL ใช้เก็บข้อมูลภายในของ GenBI
- GenBI ไม่แก้ไขหรือลบข้อมูลใน Datasource

## 5. Knowledge Ingestion และ Agentic RAG
- GenBI มี Internal Knowledge Ingestion Pipeline
- Pipeline รองรับ Schema, Metadata, Business Glossary, Metric, Join, Verified SQL และเอกสาร
- Pipeline รองรับ Parse, Normalize, Chunk, Embed, Index, Update, Delete และ Re-index
- ต้องรองรับ Schema Version และ Schema Drift
- ใช้ Dense และ Sparse Retrieval
- รองรับ Metadata Filtering, Rank Fusion และ Reranking
- ใช้ Vector Database สำหรับข้อมูลความรู้
- ไม่ควรนำ Transaction Data หรือ PII ทั้งหมดเข้า Vector Database โดยอัตโนมัติ
- Agentic RAG ต้องสร้าง Context ที่เหมาะสมสำหรับ Text-to-SQL

## 6. Local LLM
- รองรับ Local LLM หลายโมเดล
- Administrator ลงทะเบียน เปิดใช้ และปิดใช้โมเดลได้
- ผู้ใช้เลือกได้เฉพาะโมเดลที่ได้รับอนุญาต
- ผู้ใช้สามารถเลือกโมเดล AI ตัวอื่นๆ ที่ได้รับอนุญาตได้
- สามารถกำหนด Default Model ได้
- Local Model ต้องผ่าน Compatibility และ Evaluation ก่อนใช้จริง
- Local LLM ทำงานภายใต้ข้อจำกัด CPU, RAM และ Disk
- Infrastructure ปัจจุบันไม่มี GPU

## 7. External AI Provider
- รองรับ External AI Provider ได้หลายราย
- ไม่จำกัดเฉพาะ OpenAI, Gemini หรือ Anthropic Claude
- Provider เชื่อมผ่าน LLM Provider Adapter
- Provider ที่ใช้ Protocol ร่วมกันสามารถใช้ Generic Adapter
- Provider ที่มี API เฉพาะต้องมี Provider-specific Adapter
- Adapter ต้องแปลง Request, Response, Error และ Structured Output เป็น Contract กลาง
- การเพิ่ม Provider ต้องไม่ทำให้ต้องแก้ Core Agent Workflow

## 8. BYOK และค่า API
- External Provider ใช้ Bring Your Own API Key
- ผู้ใช้หรือองค์กรจัดเตรียม Credential เอง
- Provider เรียกเก็บค่าบริการจากเจ้าของ Credential โดยตรง
- GenBI ไม่จ่าย ไม่สำรองจ่าย และไม่เรียกเก็บเงินแทน Provider
- GenBI ไม่จำหน่าย Token
- GenBI ทำหน้าที่จัดเตรียม Adapter และเชื่อมต่อ API
- Credential ต้องจัดเก็บแบบเข้ารหัส
- Credential ต้องไม่ปรากฏใน Log หรือ Error Message
- ระบบสามารถบันทึก Usage Metadata ให้เจ้าของ Credential ตรวจสอบ
- ห้ามส่งข้อมูลไป External Provider หากไม่ผ่านนโยบายองค์กร
- ห้าม Automatic Fallback ไป External Provider โดยไม่ได้รับอนุญาต

## 9. Text-to-SQL
- SQL ต้องสร้างตาม Dialect ของ Datasource
- รองรับ Text-to-SQL chat โดยใช้ data source เดียวต่อครั้ง
- SQL Generation ต้องใช้ Schema และ Semantic Context
- รองรับ Semantic layer UI editor แบบเต็มรูปแบบ
- รองรับ Clarification เมื่อคำถามกำกวม
- รองรับ SQL Repair จาก Database Error
- Retry ต้องมีจำนวนรอบสูงสุด
- LLM Output ต้องเป็น Structured Output ที่ตรวจสอบได้
- Text-to-SQL ต้องใช้ semantic layer/metadata management เป็น context หลักแทนการอ่าน raw schema ตรงๆ
- Semantic layer ต้องรองรับการกำหนด business metric, dimension, join relationship ผ่าน YAML หรือ UI เพื่อช่วยลด hallucination ของ SQL
- ระบบต้องมี self-heal retry เมื่อ SQL execution error โดยส่ง error message กลับให้ LLM แก้ไขสูงสุด 2 รอบก่อน fallback เป็นข้อความขอโทษพร้อมเหตุผล
- ระบบต้องบันทึก Model, Provider และ Prompt Version ที่ใช้
- ระบบต้องจัดการข้อผิดพลาดและสถานะการทำงาน (Error Categories & Terminal Workflow States) โดยแบ่งกลุ่มข้อผิดพลาดออกเป็น 5 กลุ่มหลัก (User Intent/Semantic Errors, AI/Generation Errors, Security/Policy Violations, External System Errors, Performance & Constraints Violations)
- ระบบต้องรองรับกรณีสุดวิสัย (Edge Cases) ของคำสั่ง SQL และจบการทำงานด้วยสถานะสิ้นสุด (Terminal States) ใน LangGraph ที่ระบุผลลัพธ์ที่ชัดเจน ได้แก่:
  - `SUCCESS`: ดึงข้อมูลสำเร็จ (ช่วง 1 ถึง 49,999 แถว) และสร้างกราฟได้ตามปกติ
  - `PARTIAL_SUCCESS`: ดึงข้อมูลได้ครบ 50,000 แถวแรก (ชนขีดจำกัดสูงสุด) และส่ง Warning Flag ไปแสดง Banner แจ้งเตือนผู้ใช้บนหน้าจอ
  - `EMPTY_RESULT`: รัน SQL ผ่านสำเร็จแต่ไม่มีข้อมูล (0 แถว) ระบบจะส่งไปที่หน้าจอ Empty State เฉพาะเพื่อป้องกันบั๊กหน้าจอขาว (White Screen of Death)
  - `QUERY_TIMEOUT`: คำสั่ง SQL ใช้เวลารันนานเกิน 15 วินาที ระบบจะตัดการทำงาน (Cancel/Abort) และส่งหน้าจอ Timeout Error เพื่อแนะนำผู้ใช้ให้ระบุเงื่อนไขกรองข้อมูลให้แคบลง
  - `CLARIFICATION_NEEDED`: คำถามกำกวมเกินกว่าจะดึงข้อมูลได้ โดยระบบจะหยุดรอคำชี้แจงจากผู้ใช้
  - `MAX_RETRIES_EXCEEDED`: แก้ไข SQL ครบ 2 รอบแล้วตามสเปคแต่ยังไม่ผ่าน หยุดและแจ้งให้ปรับ Prompt
  - `ABORTED_BY_SECURITY`: ตรวจจับได้ว่า Query ผิดกฎความปลอดภัย ระบบจะหยุดรันทันที บันทึกลง Audit Log และแจ้งเตือนผู้ใช้
  - `SYSTEM_FAILURE`: เกิดข้อผิดพลาดเชิงระบบภายนอก (เช่น Database ลูกค้าล่ม หรือ API Provider ขัดข้องที่ไม่ใช่การ Timeout ของคำสั่ง) โดยไม่ต้องส่งให้ LLM ซ่อมคำสั่ง

## 10. SQL Safety
- SQL ต้องถูก Parse เป็น AST
- อนุญาตเฉพาะ Read Operation
- ปฏิเสธ INSERT, UPDATE, DELETE, DROP, ALTER, CREATE และ TRUNCATE
- บังคับ Schema, Table และ Column Allowlist
- บังคับ Permission ก่อน Retrieval และ Query Execution
- ใช้ Read-only Database Credential
- บังคับ Row Limit โดยค่าเริ่มต้นสูงสุด 50,000 แถว
- บังคับ Query Timeout โดยค่าเริ่มต้น 15 วินาที
- รองรับ PII Masking หรือ Redaction
- Query ที่มีความเสี่ยงสูงควรผ่าน Complexity หรือ Cost Check

## 11. Non-Functional Requirements
- Response time สำหรับคำถามแชทแบบปกติ: p50 < 4s, p95 < 10s
- Chart render time หลังได้ผลลัพธ์ query < 300ms
- Concurrent users ต่อ workspace (v1.0) ≥ 200
- Concurrent shared dashboard viewers ≥ 1,000
- Uptime ของ API/Web ≥ 99.5%
- LLM token spend ต้องมี cap, log ทุก request, และ alert เมื่อเกิน budget
- Credential ของ data source ต้องเข้ารหัสด้วย AES-256 ที่ rest และเก็บ key แยกใน secrets manager
- Portability: deploy ได้ทั้ง self-host ด้วย docker-compose และ cloud ด้วย Kubernetes
- Accessibility: web app ต้องเป็นไปตาม WCAG AA
- i18n: UI และคำถามรองรับ ไทย / อังกฤษ

## 11. Dashboard
- ระบบวิเคราะห์ Data Type, Dimension, Measure และ Cardinality
- ระบบเลือก Chart Type จากลักษณะผลลัพธ์
- รองรับ SQL transparency panel
- รองรับ Table, KPI, Line, Bar, Pie, Area และ Scatter
- รองรับการเปลี่ยน Chart Type โดยไม่ต้องรัน query ใหม่
- DashboardSpec ต้องผ่าน Deterministic Validation
- ผู้ใช้ดู Raw Data คู่กับ Chart ได้
- รองรับ comment บน dashboard เพื่อ collaboration และ discussion บน widget
- รองรับการคลิกจุดบนกราฟเพื่อต่อยอดคำถามหรือ drill-down วิเคราะห์ต่อได้
- รองรับ Drill-down อัตโนมัติแบบหลายชั้น
- รองรับ CSV Export ตาม Permission
- ผู้ใช้ Pin Chart ไปยัง Dashboard ได้
- รองรับ Dashboard Layout และ Filter
- Dashboard มี URL เฉพาะ
- รองรับ Permission-based Sharing
- รองรับ Public Link ตามนโยบายองค์กร
- Public Link เป็น Read-only และห้ามเปิดทางให้สร้าง SQL query ใหม่ — แสดงเฉพาะผลลัพธ์ที่ cache/snapshot ไว้แล้ว ผู้ดูแบบ public พิมพ์คำถามใหม่ในแชทไม่ได้ (ต้อง login) เพื่อป้องกันการยิง query โดยไม่จำกัดผ่านลิงก์สาธารณะ
- Owner สามารถเพิกถอน Share Link ได้
- รองรับ Embedding SDK สำหรับฝัง dashboard ในเว็บอื่น
- รองรับ Multi-source join ข้าม data source
- รองรับ Fine-grained row-level security
- รองรับ Plugin marketplace สำหรับ custom chart

## System Architecture
┌──────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                              │
│   Next.js App  —  Chat UI · Dashboard Canvas · Shared Dashboard Viewer    │
└───────────────┬───────────────────────────────────────────┬──────────────┘
                │ HTTPS (REST/SSE)                          │ WSS (realtime)
                ▼                                            ▼
┌──────────────────────────────┐               ┌──────────────────────────────┐
│   Next.js BFF (Route Handlers)│               │   Realtime Gateway (FastAPI  │
│   - Session / NextAuth        │               │   WebSocket + Redis Pub/Sub) │
│   - Proxy to AI Core API      │               │                              │
│   - Public dashboard SSR      │               └───────────────┬───────────┘
└───────────────┬───────────────┘                               │
                │ internal REST                                 │
                ▼                                                │
┌──────────────────────────────────────────────────────────────┴───────────┐
│                         AI CORE SERVICE (FastAPI)                         │
│  ┌─────────────┐  ┌─────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │ Chat Service │→ │ LangGraph Pipeline│→ │ SQL Validator  │→ │ Query Exec│ │
│  │ (context mgr)│  │ (clarify→gen→fix)│  │ (SQLGlot guard)│  │ (adapters)│ │
│  └─────────────┘  └─────────────────┘  └────────────────┘  └─────┬─────┘ │
│           │                  │                                    │       │
│           ▼                  ▼                                    ▼       │
│  ┌─────────────┐   ┌──────────────────┐                 ┌────────────────┐│
│  │ Semantic     │   │  LLM Provider     │                 │ Chart Selector ││
│  │ Layer Store  │   │  (Claude/OpenAI)  │                 │ + Cache (Redis)││
│  └─────────────┘   └──────────────────┘                 └────────────────┘│
└───────────────────────────┬───────────────────────────────────┬───────────┘
                            │                                    │
                            ▼                                    ▼
                ┌──────────────────────┐            ┌──────────────────────────┐
                │   App Database (PG)   │            │   Customer Data Sources   │
                │ users · dashboards ·  │            │ Postgres · Snowflake ·   │
                │ chats · share links   │            │ BigQuery (READ-ONLY role)│
                └──────────────────────┘            └──────────────────────────┘

## 12. Refresh และ Cache
- Realtime ของ GenBI หมายถึง Near-realtime
- Query Result สามารถ Cache ใน Redis
- Cache TTL เริ่มต้น 60 วินาทีและปรับได้
- Dashboard Refresh เริ่มต้นทุก 5 นาทีและปรับได้
- รองรับ Manual Refresh
- รองรับ WebSocket และ Polling Fallback
- Conversation History แบบถาวรต้องเก็บใน PostgreSQL

## 13. Monitoring และ Evaluation
- Administrator ดู Login, Last Active และ Usage Metadata ได้
- Monitor Model, Provider, Query Count, Status, Error และ Latency
- Monitor Dashboard Creation, Sharing และ Export Event
- รองรับ Scheduled report (ส่งสรุปทาง email/Slack)
- รองรับ Alerting บน metric threshold
- บันทึก Validation Failure และ Repair Attempt
- มี Golden Evaluation Dataset ที่ Data Analyst ตรวจสอบแล้ว
- Evaluation Dataset ใช้สำหรับ Test ไม่ใช่ Fine-tuning
- วัด Execution Accuracy, Valid SQL Rate และ Chart Accuracy
- การเปลี่ยน Model, Prompt, Retrieval หรือ Workflow ต้องผ่าน Regression Test
- Log และ Trace ต้องมี Retention และ Redaction Policy

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| LLM เดา Column ผิด | ใช้ Semantic layer เป็น context หลักและมี Retry/repair loop เมื่อ SQL execution error |
| Query หนักทำฐานข้อมูลล่ม | บังคับ Row limit, Query timeout และ Cache สำหรับผลลัพธ์ที่ซ้ำ/ซ้ำๆ |
| ปัญหา Public link รั่วไหล | ใช้ Read-only snapshot และไม่อนุญาตให้สร้าง query ใหม่ผ่าน Public link |
| Cost ของ API บานปลาย | ใช้ Cache, Limit token และมี budget/usage cap สำหรับทุก request |
