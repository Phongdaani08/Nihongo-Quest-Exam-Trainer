# AI Gen BI — Agile/Scrum Backlog Breakdown (1-Month MVP Optimized)
### Epic → Story → Task (แยกตาม Track: Backend/AI-Core, Frontend, Design/UX-UI, Data-Infra/DevOps, QA)

---

## 0. รายการเครื่องมือและเทคโนโลยีหลักที่ใช้ (Tech Stack Specification)

เอกสารฉบับนี้จัดสรรโครงสร้างงานเพื่อรองรับการพัฒนาด้วยเทคโนโลยีดังต่อไปนี้:

* **Language & Core API**: Python 3.12 + FastAPI (httpx + Pydantic v2)
* **LLM Engine**: Qwen3.6-27B รันผ่าน Ollama ในเครื่อง, เรียกใช้งานผ่าน AsyncOpenAI Client
* **Agent Framework**: LangGraph + LangGraph PostgreSQL Checkpointer (State storage) + Conditional Edges (Prompt routing) + Bounded Retry (Reflection node)
* **Agentic RAG Core**:
  * **Document Parsing**: PyMuPDF4LLM (แปลง PDF เป็น Markdown โครงสร้างดี)
  * **Chunking**: Semantic chunking + Structure-aware chunking
  * **Dense Retrieval**: Qwen3-Embedding-0.6B (1024 Dim, 32K context) รันผ่าน TEI (Text Embeddings Inference) เชื่อมต่อด้วย httpx
  * **Sparse Retrieval**: FastEmbed BM25 + PyThaiNLP (newmm สำหรับภาษาไทย) + spaCy (สำหรับภาษาอังกฤษ)
  * **Reranker**: BGE-Reranker-V2-M3 รันผ่าน TEI เชื่อมต่อด้วย httpx
  * **Vector Store**: Qdrant (qdrant-client)
* **Database & Security**:
  * **Datasource DB**: PostgreSQL (SQLAlchemy + psycopg3 driver)
  * **Security**: Read-only adapters + SQLGlot Parser (สำหรับตรวจเช็คสิทธิ์และ SQL Injection)
  * **App/State Database**: PostgreSQL (สำหรับเก็บ Session, Chat History และ Agent Checkpointer)
* **Cache & Memory**: Redis server + redis-py client (สำหรับระบบ caching ข้อมูล)
* **Frontend (Next.js)**:
  * **Charts**: Apache ECharts + @ant-design/plots
  * **AI Visualization**: @antv/gpt-vis (สำหรับวาดกราฟจากคำอธิบาย AI)
  * **Grid & Layout**: react-grid-layout + @dnd-kit + zustand (State management)
  * **BI Table**: @antv/s2 (สำหรับทำ Pivot Table และ Data Grid)
  * **UI Library**: Ant Design (antd) + shadcn/ui
* **Observability & QA**:
  * **Observability**: Langfuse (สำหรับทำ Tracing & Monitor Agent)
  * **Testing**: pytest + pytest-asyncio + Testcontainers (สำหรับรัน Integration tests ของ DB/Qdrant/Redis)
* **Deployment**: Docker Compose

---

## 1. แนวคิดสถาปัตยกรรม Agentic RAG ในระบบนี้ (Agentic RAG Workflow)

ระบบนี้พัฒนาในลักษณะ **Agentic RAG** ภายในวงจร LangGraph:
1. **Agent** เป็นคนวิเคราะห์คำถามและตัดสินใจว่าจะดึงบริบทประเภทใดบ้างผ่านเครื่องมือสืบค้น
2. **Retrieval Tool Node** จะทำหน้าที่ค้นหาแบบไฮบริด (BM25 + Dense Qdrant) และส่งให้ Reranker คัดกรอง
3. **Evaluation Node / Self-Correction** จะประเมินว่าบริบทที่ดึงมามีความสอดคล้องและเพียงพอที่จะใช้เขียน SQL หรือไม่ หากข้อมูลไม่พอ Agent สามารถวนลูปสืบค้นใหม่ (Iterative Retrieval) หรือปรับคำค้นหา (Query Reformulation) ได้เองโดยอัตโนมัติ

---

## 2. สรุปภาพรวมจำนวนงานหลังยุบรวม (Backlog Summary)

| Track | Epic ทั้งหมด | Story ทั้งหมด (หลังยุบรวม) | Task ทั้งหมด |
|---|---|---|---|
| A. Backend / AI-Agent Core | 7 | 15 | 32 |
| B. Frontend / Next.js App | 4 | 7 | 16 |
| C. Design / UX-UI / Wireframe | 3 | 4 | 9 |
| D. Data Platform / DevOps / Infra | 3 | 5 | 10 |
| E. QA / Testing / Evaluation | 2 | 4 | 8 |
| **รวม** | **19** | **35** | **75** |

---

## TRACK A — Backend / AI-Agent Core (Python 3.12 / FastAPI / LangGraph)

### Epic A1: Data Source Connectivity, Auto-Introspection & Security Guard [MVP]
เชื่อมต่อฐานข้อมูลปลายทาง ดึงข้อมูลโครงสร้าง และระบบความปลอดภัยป้องกันการโจมตี SQL

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A1.1**: ระบบต่อฐานข้อมูลและแกะโครงสร้างอัตโนมัติ (Database Connection & Schema Introspection) | SQLAlchemy + psycopg3 | **T-A1.1.1**: Setup Connection Pool | ออกแบบและเขียนตัวจัดการ Connection Pool ของ PostgreSQL โดยรองรับการดึงค่า Config แบบ Dynamic จาก App DB และจัดการเก็บ Credential อย่างปลอดภัยผ่าน Environment variables / Secret manager |
| | | **T-A1.1.2**: Metadata Registry & API | เขียน Schema และ CRUD API เพื่อจัดเก็บประวัติและค่าการเชื่อมต่อของแต่ละ Datasource ลงใน App/State Database |
| | | **T-A1.1.3**: Automated Schema Introspection | พัฒนาระบบสำรวจ Metadata ต้นทางเพื่อแกะรายชื่อตาราง คอลัมน์ ประเภทข้อมูล คำอธิบาย (Comments) พร้อมดึงคีย์ PK/FK และสุ่มข้อมูลตัวอย่าง (Sample Rows) 3-5 แถวต่อตาราง เพื่อบันทึกเป็นบริบทให้ระบบ RAG |
| **S-A1.2**: ระบบความปลอดภัยและการดักกรองคำสั่ง SQL (Read-Only Guard & AST Parsing) | psycopg3 + SQLGlot | **T-A1.2.1**: Driver-level Read-Only | เขียน Guard สกัดกั้นคำสั่งประเภทเขียนหรือลบข้อมูล (DML/DDL เช่น INSERT, UPDATE, DELETE, DROP) ในระดับ Adapter และทดสอบสิทธิ์ระดับ Database User |
| | | **T-A1.2.2**: SQLGlot Validation & Dialect Checker | นำ SQLGlot มาแปลงคำสั่งเป็น AST (Abstract Syntax Tree) เพื่อวิเคราะห์หา Pattern การโจมตี (SQL Injection) และตรวจสอบ Dialect ให้ตรงกับ DB ต้นทาง |
| | | **T-A1.2.3**: Query Execution Resource Guard | ตั้งค่า Timeout สูงสุดในการคิวรีข้อมูล (Statement Timeout) และกำหนดการจำกัดจำนวนแถวผลลัพธ์ (Row Limit) เพื่อป้องกันเซิร์ฟเวอร์ค้างเมื่อตอบสนองคิวรีขนาดใหญ่ |

---

### Epic A2: Agentic RAG — Ingestion & PDF Processing Pipeline [MVP]
นำเข้า DDL, Business Glossary และไฟล์เอกสาร PDF เข้าสู่ระบบเพื่อทำ Vector Index

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A2.1**: ท่อส่งข้อมูลเอกสารและดัชนีคลังความรู้ (Document & Knowledge Base Ingestion Pipeline) | PyMuPDF4LLM + Qdrant (qdrant-client) + TEI + httpx | **T-A2.1.1**: PDF Text & Table Extractor | ใช้ PyMuPDF4LLM แกะคู่มืออธิบายตารางของลูกค้า แปลงเป็น Markdown ที่มีโครงสร้างตาราง ย่อหน้า และหัวข้อชัดเจน |
| | | **T-A2.1.2**: Semantic & Structure-aware Chunking | เขียนตรรกะตัดแบ่งข้อมูลเอกสาร (Chunking) โดยคำนึงถึงหัวข้อเนื้อหา (Semantic) และแบ่งตารางข้อมูลโดยรักษาแถว/คอลัมน์ไม่ให้ขาดตอน (Structure-aware) |
| | | **T-A2.1.3**: Embeddings Service Client | เขียน HTTP client ด้วย httpx เชื่อมกับ TEI เพื่อนำข้อความส่งไปแปลงเป็นเวกเตอร์ขนาด 1024 มิติด้วย Qwen3-Embedding-0.6B รองรับ context ได้สูงสุด 32K tokens |
| | | **T-A2.1.4**: Qdrant Vector Storage Sync | สร้าง Collection ใน Qdrant รองรับมิติ 1024 และเขียนระบบ Upsert เวกเตอร์พร้อมเก็บ Payload Metadata (เช่น datasource_id, table_name, chunk_type) |
| | | **T-A2.1.5**: Glossary & Few-shot Pairs Manager | เขียนระบบบันทึกและจัดการคำศัพท์เฉพาะทาง (Glossary) และคู่อันดับคำถาม-SQL ที่มนุษย์ยืนยันว่าถูกต้อง เพื่อป้อนเป็นตัวอย่าง Few-shot ให้ Agent |
| **S-A2.2**: ระบบอัปเดตข้อมูลโครงสร้างฐานข้อมูลอัตโนมัติ (Automated Knowledge Sync & Refresh) | Python 3.12 | **T-A2.2.1**: Schema Drift & Auto Re-embedding | พัฒนาระบบเปรียบเทียบความต่าง (Diff) ของโครงสร้าง DB และสั่งอัปเดตข้อมูลเวกเตอร์ใน Qdrant เฉพาะส่วนที่มีการเปลี่ยนแปลงโดยอัตโนมัติ (ขยายไปทำใน **[Phase 2]**) |

---

### Epic A3: Agentic RAG — Hybrid Retrieval & Reranking Tool [MVP]
การค้นหาบริบทที่ดีที่สุดผ่านระบบแบบลูกผสมเพื่อเสิร์ฟให้ Agent เรียกใช้งาน

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A3.1**: เครื่องมือค้นหาบริบทแบบลูกผสม (Hybrid Search Engine) | FastEmbed BM25 + Qdrant + PyThaiNLP + spaCy | **T-A3.1.1**: Sparse Search Engine | ตั้งค่า FastEmbed BM25 ในเครื่อง พร้อมนำ PyThaiNLP (newmm) มาใช้ตัดคำภาษาไทย และ spaCy สำหรับภาษาอังกฤษ เพื่อทำคำดัชนีสืบค้นคำหลัก |
| | | **T-A3.1.2**: Dense Vector Search Client | เขียนฟังก์ชันแปลงคำถามผู้ใช้เป็นเวกเตอร์แล้วส่งไปค้นหาแบบใกล้เคียงใน Qdrant พร้อมฟิลเตอร์ตาม metadata ของฐานข้อมูลปลายทาง |
| | | **T-A3.1.3**: RRF Score Fusion | พัฒนาระบบผสานคะแนนจาก Sparse และ Dense Search เข้าด้วยกันโดยใช้อัลกอริทึม Reciprocal Rank Fusion (RRF) และจูนค่าพารามิเตอร์ให้สอดคล้องกัน |
| **S-A3.2**: ระบบจัดลำดับใหม่และการวัดผลลัพธ์ RAG (Reranking & Retrieval Evaluator) | BGE-Reranker-V2-M3 + TEI | **T-A3.2.1**: TEI Reranking Service | เขียน client เชื่อมต่อ TEI เพื่อส่งคำถามคู่กับข้อความไปรัน BGE-Reranker-V2-M3 แล้วคัดเลือกเอาเฉพาะบริบทที่คะแนนความสัมพันธ์ผ่านเกณฑ์ (ขยายไปทำใน **[Phase 2]**) |
| | | **T-A3.2.2**: Retrieval Quality Benchmarking | พัฒนาสคริปต์ส่งคำถามจากชุดทดสอบ (Golden Dataset) ยิงตรวจเช็คค่าความแม่นยำในการเรียกกลับข้อมูล (Recall@K) ของระบบ RAG (ขยายไปทำใน **[Phase 2]**) |
| **S-A3.3**: ตัวประมวลผลการค้นหาคืนข้อมูลสำหรับ Agent (LangGraph Retrieval Tool) | LangGraph | **T-A3.3.1**: LangGraph Agentic Search Tool | เขียน Tool Wrapper ครอบระบบสืบค้นเพื่อให้ AI Node ใน LangGraph สามารถเรียกใช้งาน ค้นหาข้อมูลเพิ่ม ค้นซ้ำ หรือแก้ไขคำค้นหาได้ระหว่างตัดสินใจรันงาน |

---

### Epic A4: NL2SQL & LangGraph Agentic Orchestration [MVP]
ตัวเชื่อมต่อหลักที่คุมทิศทางการทำงาน วางแผน ตรวจสอบ และเขียน SQL/กราฟ

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A4.1**: โครงข่ายตัดสินใจและสร้างคำสั่ง (LangGraph Agentic Execution Pipeline) | LangGraph + Qwen3.6-27B + AsyncOpenAI | **T-A4.1.1**: Shared State & Graph Entry | ออกแบบ Pydantic model สำหรับใช้แชร์ข้อมูลระหว่าง Node ของ LangGraph (State) และตั้งค่าเส้นเชื่อมโยง (Edges) ควบคุมจุดเริ่ม-จุดจบ |
| | | **T-A4.1.2**: Intent Router Node | เขียน Prompt และ Node ตรวจสอบวัตถุประสงค์ (Router) ด้วย Conditional Edges เพื่อระบุว่าต้องไปเขียน SQL, คุยทั่วไป หรือวิเคราะห์แผนภูมิ |
| | | **T-A4.1.3**: SQL Generation Node | ออกแบบ Prompt Template ที่ประมวลบริบทจาก RAG (Schema, Glossary, Few-shot) แล้วส่งต่อให้ Qwen3.6-27B เพื่อเขียนคำสั่ง SQL |
| **S-A4.2**: วงจรตรวจสอบความถูกต้องและรูปแบบการแสดงผล (Reflection, Validation & Chart Recommendation) | LangGraph nodes | **T-A4.2.1**: Self-Correction & Bounded Retry | พัฒนา Node ทดลองรัน SQL ใน DB จำลองเพื่อหา syntax error หากเจอปัญหา จะส่งรายละเอียด Error ส่งกลับไปหา Node สร้าง SQL เพื่อสั่งให้ซ่อมแซมตัวเอง (จำกัดการรันซ้ำ 2 ครั้ง) |
| | | **T-A4.2.2**: Visualizer Suggester Node | พัฒนาตรรกะประเมินขนาดและคุณสมบัติของข้อมูลผลลัพธ์ (Data structure & types) เพื่อเสนอแนะการเขียนสเปคกราฟในรูปแบบ JSON Chart Spec ส่งให้ฝั่ง Frontend |
| **S-A4.3**: การเก็บรักษาข้อมูลธุรกรรมประโยคและบริบทแชต (Persistent State & Checkpointing) | LangGraph PostgreSQL Checkpointer | **T-A4.3.1**: PostgreSQL Checkpointer Integration | ติดตั้งโครงสร้างตาราง Checkpointer ใน PostgreSQL App DB เพื่อให้ระบบจำสถานะระหว่าง Turn การคุยและกู้คืนหลังเซิร์ฟเวอร์เกิดรีสตาร์ท |
| | | **T-A4.3.2**: Multi-turn Context Logic | พัฒนาระบบประมวลผลข้อความย้อนหลัง (Conversation History) เพื่อรองรับกรณีผู้ใช้พิมพ์ถามคำถามสืบเนื่องจากข้อความก่อนหน้า (ขยายไปทำใน **[Phase 2]**) |

---

### Epic A5: Memory, Caching & Session Management [MVP]
จัดการเก็บประวัติการสนทนาและแคชข้อมูลเพื่อลดการเข้าถึง LLM ซ้ำ

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A5.1**: ระบบบริหารเซสชันและข้อมูลการแชท (Session & Chat History Management) | PostgreSQL + SQLAlchemy | **T-A5.1.1**: Database Chat Storage Schema | เขียนตารางจัดเก็บรายการ Sessions และ Messages พร้อมสร้าง Repository Class เพื่อให้สามารถดึงข้อมูลประวัติการแชทแบบเรียงลำดับเวลาได้รวดเร็ว |
| | | **T-A5.1.2**: Session Control APIs | สร้างกลุ่ม FastAPI Endpoints สำหรับบริการข้อมูลการแชท เช่น ดึงประวัติแชทเก่า สร้างประวัติแชทใหม่ และลบข้อมูลการสนทนา |
| **S-A5.2**: ระบบจัดเก็บแคชประสิทธิภาพสูงเพื่อลดภาระเซิร์ฟเวอร์ (Redis Caching Service) | Redis + redis-py | **T-A5.2.1**: Metadata & Query Result Cache | พัฒนาระบบแคชข้อมูลด้วย Redis (เช่น แคชค่า Schema DB ปลายทาง และผลลัพธ์ของคิวรีที่ถามซ้ำ) พร้อมตั้งนโยบายการเคลียร์แคช (TTL/Invalidation) |

---

### Epic A6: Local LLM Integration [MVP]
ตัวประสานจัดการรันและรับส่งข้อมูลกับโมเดลภายในเครื่อง

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A6.1**: ระบบการเชื่อมต่อและสั่งการโมเดลประมวลผล (LLM Serving & API Client) | Ollama + AsyncOpenAI | **T-A6.1.1**: Ollama Server Configuration | ตั้งค่า Ollama บนสภาพแวดล้อมระบบหลักเพื่อให้บริการโมเดล Qwen3.6-27B ในเครื่อง และทำความสอดคล้องกับพารามิเตอร์การทำงาน |
| | | **T-A6.1.2**: Async Client & Stream Client | เขียน Wrapper ครอบ AsyncOpenAI Client เพื่อสั่งการโมเดลแบบ Async และดึงคำตอบแบบค่อย ๆ ไหลมาเรื่อย ๆ (SSE Stream) พร้อมระบบคุม Timeout |
| | | **T-A6.1.3**: Prompt Template File Manager | พัฒนาตัวจัดการเทมเพลตคำสั่ง (Prompt) ในโฟลเดอร์ที่เป็นระบบ สามารถดึงไปใช้งานได้ทันทีและรอบรับระบบสองภาษา (ไทย/อังกฤษ) |
| | | **T-A6.1.4**: Token Usage & Cost Logger | เขียนระบบดักนับปริมาณ Token และบันทึกเวลาความหน่วง (Latency) ของแต่ละ Request ที่ยิงส่งโมเดลลงในระบบฐานข้อมูล (ขยายไปทำใน **[Phase 2]**) |

---

### Epic A7: API Layer & Backend Services [MVP]
สร้าง Endpoint บริการรับและแสดงผลข้อมูล

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-A7.1**: โครงสร้างการเชื่อมต่อข้อมูลและการแชร์สิทธิ์ (API Infrastructure & Endpoints) | FastAPI + Pydantic + JWT | **T-A7.1.1**: API Scaffold & Global Errors | วางโครงสร้างโฟลเดอร์ FastAPI Router, Service และทำระบบดักจับ Error กลาง คืนค่าในรูปแบบ JSON Schema มาตรฐานของแอป |
| | | **T-A7.1.2**: Streaming Chat SSE Endpoint | พัฒนา Endpoint ส่งข้อมูลแบบ Server-Sent Events (SSE) คลื่นข้อมูลการพิมพ์คำตอบของ AI และสถานะการประมวลผลของ LangGraph Node |
| | | **T-A7.1.3**: Authentication Middleware | พัฒนาระบบล็อกอินแบบ JWT ตรวจสิทธิ์การใช้งาน และเขียนสิทธิ์ห้ามเข้าถึงข้าม Datasource ของผู้ใช้แต่ละกลุ่ม |
| | | **T-A7.1.4**: Datasource & Dashboard CRUD APIs | พัฒนา API สำหรับสร้าง อ่าน อัปเดต ลบ ข้อมูลการเชื่อมต่อฐานข้อมูล และโครงสร้างข้อมูลการจัดวางบอร์ด Dashboard |
| | | **T-A7.1.5**: System Data Dictionary Doc | จัดทำคู่มือข้อมูลระบบ (Data Dictionary) อธิบายตารางระบบภายใน, สร้างคู่มือและตัวอย่างไฟล์ Glossary สำหรับทำ RAG และอัปเดต OpenAPI (S-A7.5) |

---

## TRACK B — Frontend / Next.js Application (React / Next.js / CSS)

### Epic B1: Chat & Conversational Query UI [MVP]
หน้าจออินเตอร์เฟซหลักสำหรับพิมพ์สนทนาเรื่องข้อมูล

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-B1.1**: หน้าจอสนทนาและแสดงผลการดึงข้อมูล (Chat Interface & Query Display Engine) | Next.js + antd / shadcn | **T-B1.1.1**: Chat UI & SSE Stream Integration | สร้างคอมโพเนนต์กล่องแชท แรนเดอร์ข้อความ Markdown จาก AI และดึงสตรีม SSE แสดงผลตามเวลาจริง พร้อมแผงระบุสถานะประมวลผลของ Agent |
| | | **T-B1.1.2**: SQL Syntax Highlighter Panel | พัฒนาแผงแสดงโค้ด SQL ที่ AI แนะนำ พร้อมปุ่ม Toggle ปิดเปิด และ Syntax Highlight แยกสีโค้ดให้สะดวกต่อการตรวจสอบ |
| | | **T-B1.1.3**: Paginated Data Grid Table | ออกแบบตารางนำเสนอผลลัพธ์ข้อมูลที่ได้จากการคิวรี รองรับการแบ่งหน้า (Pagination) และการกดคลิกเรียงลำดับแถว (Sorting) |
| | | **T-B1.1.4**: Sidebar History Panel | พัฒนาแถบรายชื่อกลุ่มการสนทนาย้อนหลัง สามารถกดเลือกสลับคุย หรือสั่งลบห้องแชตเก่าทิ้งได้ทันที |

---

### Epic B2: BI Visualization Rendering Engine [MVP]
ระบบแปลภาษาจาก AI มาเรนเดอร์เป็นภาพวิเคราะห์เชิงธุรกิจ

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-B2.1**: ตัวจัดแสดงแผนภูมิวิเคราะห์เชิงธุรกิจอัตโนมัติ (Chart Visualization Engine) | @antv/gpt-vis + @ant-design/plots + Apache ECharts | **T-B2.1.1**: AntV GPT-Vis Interpreter Component | พัฒนาคอมโพเนนต์รับข้อมูล JSON Spec จาก API เพื่อนำมาวาดแผนภูมิกราฟผ่าน @antv/gpt-vis โดยอัตโนมัติ |
| | | **T-B2.1.2**: Standard Plot Widgets | พัฒนากลุ่มกราฟพื้นฐานด้วย @ant-design/plots เช่น กราฟเส้น กราฟแท่ง แผนภูมิรูปวงกลม ให้ดึงสีและสไตล์ตาม Design Token ขององค์กร |
| | | **T-B2.1.3**: Apache ECharts Custom Wrapper | พัฒนากล่องเรียกใช้งาน Apache ECharts สำหรับวิเคราะห์เชิงลึก เช่น แผนภูมิกระจาย (Scatter) และแผนภูมิความร้อน (Heatmap) (ขยายไปทำใน **[Phase 2]**) |
| | | **T-B2.1.4**: Dashboard PDF/PNG Exporter | พัฒนาปุ่มและตรรกะสำหรับดาวน์โหลดข้อมูลบอร์ดให้ออกมาเป็นไฟล์รูปภาพ (PNG) หรือสรุปเป็นรายงานไฟล์เอกสาร (PDF) (ขยายไปทำใน **[Phase 2]**) |

---

### Epic B3: Interactive Dashboard Builder [MVP]
ส่วนการจัดการ Dashboard นำเสนอแผนภูมิหลายชิ้น

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-B3.1**: แคนวาสแดชบอร์ดและการจัดเก็บสถานะบอร์ด (Dashboard Layout Canvas & Grid Control) | react-grid-layout + @dnd-kit + zustand | **T-B3.1.1**: Drag & Drop Grid Canvas | พัฒนาบอร์ด Grid ด้วย react-grid-layout + @dnd-kit ให้สามารถลากกล่องวิเคราะห์ขยับสลับตำแหน่งได้อิสระและย่อขยายกล่องได้ |
| | | **T-B3.1.2**: Dashboard Layout Zustand Store | ตั้งค่า Zustand จัดเก็บพิกัดของ Widget ทุกตัวเพื่อกู้คืน Layout ได้รวดเร็ว พร้อมระบบทำพิกัดย้อนกลับ (Undo/Redo) |
| | | **T-B3.1.3**: Widget library Containers | ออกแบบกล่องครอบแผ่นข้อมูล (Chart Container, Table Container, KPI Card Container) และเมนูสำหรับตั้งชื่อ แก้ไข ตั้งค่าภายใน Widget |
| | | **T-B3.1.4**: Save & Share Layout APIs | พัฒนาส่วนการบันทึกการจัดแต่งลงฐานข้อมูล และระบบผลิต Link สาธารณะเพื่อแชร์สิทธิ์การเข้าชมแดชบอร์ดให้ทีมงานร่วมงานได้ |

---

### Epic B4: Advanced BI Data Grid [MVP]
การจัดการตารางรายงานเชิงลึกเพื่อการตัดสินใจ

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-B4.1**: ตารางสรุปเชิงลึกและตกแต่งเงื่อนไขวิเคราะห์ (Advanced BI Pivot Grid) | @antv/s2 | **T-B4.1.1**: S2 Pivot Grid Integration | ตั้งค่าคอมโพเนนต์ตารางสรุปข้อมูลด้วย @antv/s2 รองรับฟังก์ชันการแจกแจงมุมมองระดับลึก (Drill-down) บนหัวข้อ และระบบ Virtual Scroll |
| | | **T-B4.1.2**: Conditional Formatting & Filters | เขียนระบบการระบายสีเฉพาะตารางตามเงื่อนไข (เช่น ค่าติดลบเป็นแถบสีแดง) และฟิลเตอร์ระดับคอลัมน์ของข้อมูลภายในตารางวิเคราะห์ |

---

## TRACK C — Design / UX-UI / Wireframe (งาน Figma & Prototype)

### Epic C1: UX Research & System Navigation Design [MVP]
ทำความเข้าใจผู้ใช้และวางระบบการนำทาง

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-C1.1**: การออกแบบเส้นทางการใช้งานผู้ใช้ (System Navigation & UX Research) | Figma | **T-C1.1.1**: User Flow & Sitemap Diagram | ออกแบบผังเส้นทางพฤติกรรมผู้ใช้ตั้งแต่เข้าใช้งาน เชื่อมต่อข้อมูล สอบถาม จนนำรายงานไปแสดงบอร์ด พร้อมทำภาพสลักสิทธิ์ทิศทาง Sitemap ของระบบทั้งหมด |

---

### Epic C2: Wireframe & Low-fidelity Prototype [MVP]
วางผังภาพรวมหน้าจอแบบไม่มีสีสันเพื่อตกลงรายละเอียด

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-C2.1**: ภาพร่างสัดส่วนและการเชื่อมโยงข้อมูลเบื้องต้น (Interface Wireframes & Interaction Prototype) | Figma | **T-C2.1.1**: Chat Screen Wireframe | ออกแบบโครงร่างหน้าต่างช่องพิมพ์คุย แผงข้อความประวัติแชท และสัดส่วนปุ่มเปิดดูข้อความ SQL |
| | | **T-C2.1.2**: Dashboard Grid Wireframe | ออกแบบร่างหน้าต่าง Dashboard Builder หน้าจัดการ Widget และปุ่มคำสั่งควบคุมการเซฟข้อมูล |
| | | **T-C2.1.3**: Datasource Settings Wireframe | ออกแบบร่างหน้าต่างเชื่อมต่อกรอกที่อยู่ไอพี DB และกล่องแสดงผลตรวจผลการต่อล้มเหลว/สำเร็จ |
| | | **T-C2.1.4**: Interactive low-fi prototype | ทำโปรโตไทป์จำลองขยับทิศทางหน้าจอได้เพื่อให้คนทดสอบหน้าหน้าต่างใช้งานก่อนเริ่มขั้นตอนการพิมพ์งานโค้ด (ขยายไปทำใน **[Phase 2]**) |

---

### Epic C3: UI Visual Design System & High-fidelity Mockups [MVP]
ออกแบบสไตล์ที่สวยงามพร้อมระบบแชร์ข้อมูลและคู่มือผู้ใช้งาน

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-C3.1**: การออกแบบความสวยงามหน้าตาและการใช้งานระบบ (Visual Design System & Handoff Mockups) | Figma | **T-C3.1.1**: Design Tokens & Typography | กำหนดชุดสีอ้างอิง ระบบฟอนต์ การจัดตำแหน่งมุมกล่อง และระยะห่างที่ตรงกับ Antd/Shadcn |
| | | **T-C3.1.2**: High-fidelity UI Components | ออกแบบชุดหน้าต่างการส่งประวัติแชต การจัดเรียง Widget กราฟ สัญลักษณ์การ์ด KPI ให้มีความสวยงาม ทันสมัย แบบพรีเมียม |
| | | **T-C3.1.3**: Mockups & Developer Handoff | สร้างแบบจำลองหน้าจอความละเอียดสูง (Mockup) ของทุกหน้าหลัก และส่งมอบแบบด้วยระบบ Figma Dev Mode |
| | | **T-C3.1.4**: User Manual & Walkthrough Video | จัดเขียนคู่มือวิธีใช้ระบบ (User Manual) และจัดถ่ายทำคลิปสั้น ๆ (Screen Recording) แนะนำวิธีใช้แอปพลิเคชัน (S-C3.5) |

---

## TRACK D — Data Platform / DevOps / Infra

### Epic D1: Containerization, Deployment & Manuals [MVP]
สร้างความสามารถในการติดตั้งและเรียกใช้งานทุกเครื่องมือผ่านระบบ Docker

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-D1.1**: สภาพแวดล้อมจำลองระบบและการติดตั้ง (Containerized Deployment & Automation) | Docker Compose + GitHub Actions | **T-D1.1.1**: Multi-service Docker compose | เขียน Dockerfile ของ API Server (FastAPI) และ Next.js พร้อมทำ docker-compose.yml คุม FastAPI, Next.js, PostgreSQL, Redis, Qdrant, TEI Embeddings, TEI Reranker, และ Ollama |
| | | **T-D1.1.2**: Environment Config Template | จัดทำไฟล์แม่แบบการตั้งค่าค่าเริ่มต้น `.env.template` แยกการตั้งค่า Dev/Staging/Production |
| | | **T-D1.1.3**: CI/CD Pipelines | เขียนสคริปต์ตรวจเช็คความปลอดภัยของโค้ดและรัน build อัตโนมัติใน GitHub Actions ทุกครั้งที่อัปเดตงาน |
| | | **T-D1.1.4**: Deployment manual & Troubleshooting | เขียนคู่มือติดตั้งระบบ (Deployment Manual) วิธีรัน Docker-compose บน Windows/Linux และวิธีแก้ปัญหาเชื่อมต่อเบื้องต้น (S-D1.4) |

---

### Epic D2: Monitoring & Observability [MVP]
ติดตั้งระบบติดตามดูพฤติกรรม LLM และประสิทธิภาพ

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-D2.1**: การจัดการและตรวจพฤติกรรมการทำงานโมเดลและแอปพลิเคชัน (Agent Tracing & Monitoring) | Langfuse + Python 3.12 | **T-D2.1.1**: Langfuse Tracing Integration | ติดตั้ง SDK ของ Langfuse ในโค้ด LangGraph เพื่อตรวจเช็คความหน่วงของโหนด RAG/LLM/Reflection และจำนวน Token ที่ถูกใช้งาน |
| | | **T-D2.1.2**: Application Logger Framework | เขียนโมดูลจัดการ Logging ของ FastAPI บันทึกพฤติกรรมการเรียกใช้งาน API และตรวจเช็คจุดผิดพลาดกลางของแอป (Error stack) |

---

### Epic D3: Database & Cache Infrastructure [MVP]
จัดเตรียมฐานข้อมูลและแคชเพื่อใช้งานร่วมกับแอปพลิเคชัน

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-D3.1**: ระบบโครงสร้างการจัดการฐานข้อมูลส่วนตัวของแอป (Database & Cache Services Setup) | PostgreSQL + Redis | **T-D3.1.1**: Application Database Schema Setup | สร้างตารางประวัติผู้ใช้ เซสชันสนทนา ของ PostgreSQL ใน App DB และเขียนสคริปต์การทำ Migration ของข้อมูลโครงสร้างแอป |
| | | **T-D3.1.2**: Redis caching config limits | วางระบบความปลอดภัยการใช้ RAM ของตัว Redis container ใน Docker Compose ป้องกันไม่ให้กินแรมระบบจนล่ม |

---

## TRACK E — QA / Testing / Evaluation (Cross-cutting)

### Epic E1: Core System Testing Framework [MVP]
วางระบบทฤษฎีทดสอบเพื่อความเสถียรของแอปพลิเคชัน

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-E1.1**: โครงสร้างการทดสอบระบบหลังบ้าน (Backend Testing Framework) | pytest + pytest-asyncio + Testcontainers | **T-E1.1.1**: Backend Unit & Async Tests | เขียน Unit test ตรวจเช็คความถูกต้องของการทำงานประมวลผลคำสั่ง SQLGlot ตรรกะ Router และความสอดคล้องข้อมูล Node |
| | | **T-E1.1.2**: Database Integration Tests via Testcontainers | ใช้ Testcontainers ยิงลอนช์ตู้ Docker Ephemeral ของ PostgreSQL/Qdrant/Redis จำลองยิงคำสั่ง RAG คัดค้น และล้างตู้อัตโนมัติในสคริปต์ |
| | | **T-E1.1.3**: Frontend Component Testing | เขียนการทดสอบ Component UI และการแสดงผล Next.js ด้วย React Testing Library (ขยายไปทำใน **[Phase 2]**) |

---

### Epic E2: AI Quality & SQL Accuracy Evaluation [MVP]
การทดสอบวัดคุณภาพของคำตอบและการแปลงภาษาของปัญญาประดิษฐ์

| Story | เทคโนโลยีที่เกี่ยวข้อง | Task | คำอธิบาย (Description) |
|---|---|---|---|
| **S-E2.1**: ระบบตรวจสอบคุณภาพของปัญญาประดิษฐ์ (AI Generation Quality Evaluation) | Python 3.12 | **T-E2.1.1**: SQL Execution Accuracy Evaluator | จัดเตรียมข้อมูลทดสอบ Golden Dataset (คำถาม 30-50 ข้อ + SQL จริง) และเขียนสคริปต์รันคำถามเพื่อนำ SQL ที่ได้จาก Agent ไปประเมินกับคำสั่งจริงโดยเช็คโครงสร้างและจำนวนผลลัพธ์ข้อมูล (Execution Accuracy) |
| | | **T-E2.1.2**: RAG Retrieval Evaluator | เขียนสคริปต์ตรวจความถูกต้องในการดึงเนื้อหาจาก Qdrant มายัง Prompt ว่าคืนตารางข้อมูลที่มีความเกี่ยวข้องครบถ้วนหรือไม่ (ขยายไปทำใน **[Phase 2]**) |
| | | **T-E2.1.3**: AI Security Red-Teaming | เขียนสคริปต์ทดสอบการยิง Prompt Injection พยายามแฮก AI ให้ล้างฐานข้อมูล หรือพยายามเขียนคำสั่ง SQL ให้หลุดพ้นจาก Read-only (ขยายไปทำใน **[Phase 2]**) |

---

## 3. แผนการดำเนินงานรายสัปดาห์ระยะเวลา 1 เดือน (4-Week Execution Schedule)

* **สัปดาห์ที่ 1: Foundation, DB Schema & UI Wireframe (Sprint 1)**
  * **Design**: ออกแบบโครงร่างหน้าตาแชต แดชบอร์ด และหน้าเชื่อมต่อ Datasource (C2.1.1 - C2.1.3)
  * **Backend**: วางโครง FastAPI (T-A7.1.1), ทำสคริปต์เชื่อมต่อ PostgreSQL และวิเคราะห์แกะ Schema (T-A1.1.1, T-A1.1.3) พร้อมวางระบบความปลอดภัยและ parse คำสั่ง SQL ด้วย SQLGlot (T-A1.2.1, T-A1.2.2, T-A1.2.3)
  * **Infra**: เขียน Docker Compose รันสภาพแวดล้อมทั้งหมด (PostgreSQL, Qdrant, TEI, Redis) (T-D1.1.1, T-D1.1.2, T-D3.1.1)
* **สัปดาห์ที่ 2: Ingestion, Agentic RAG Setup & Frontend Layout (Sprint 2)**
  * **Backend/RAG**: พัฒนาเครื่องมือแกะคู่มือด้วย PyMuPDF4LLM และ Semantic Chunker (T-A2.1.1 - T-A2.1.3), ส่งเข้า TEI เพื่อสร้างเวกเตอร์ (Embedding) ลง Qdrant (T-A2.1.4), จัดการคลังคำศัพท์และคู่คำถามคำตอบ (T-A2.1.5)
  * **Retrieval Core**: พัฒนาระบบ Hybrid Search (FastEmbed BM25 + Qdrant Dense) และระบบ Reranker ผ่าน TEI (T-A3.1.1 - T-A3.1.3) ห่อหุ้มในรูป Tool ให้ Agent เรียกใช้ (T-A3.3.1)
  * **Frontend**: เซ็ตโปรเจกต์ Next.js, วาดหน้าจอแชต และรับข้อมูลสตรีมมิ่ง (T-B1.1.1, T-B1.1.2, T-B1.1.4)
* **สัปดาห์ที่ 3: LangGraph Agent Orchestration, Grid & Visuals (Sprint 3)**
  * **Backend/Agent**: พัฒนา LangGraph State, Prompt Router และ Node สำหรับเจน SQL (T-A4.1.1 - T-A4.1.3), พัฒนาระบบแก้คำสั่ง SQL พังอัตโนมัติ (Reflection & Bounded Retry - T-A4.2.1) พร้อมตรรกะเสนอแนะแผนภูมิ (T-A4.2.2), ปิดท้ายด้วยประวัติการแชท (PostgreSQL Checkpointer - T-A4.3.1, T-A5.1.1, T-A5.1.2)
  * **Frontend**: ปรับแต่งหน้า Dashboard Grid แบบขยับตำแหน่งและย่อขยายได้ (react-grid-layout + @dnd-kit + Zustand) (T-B3.1.1 - T-B3.1.4), เรนเดอร์กราฟวิเคราะห์ (@antv/gpt-vis, @ant-design/plots) (T-B2.1.1, T-B2.1.2) และตารางแสดงข้อมูล (T-B1.1.3)
  * **Infra/Observability**: เชื่อมต่อระบบ Langfuse Tracing ตรวจเช็กระบบ Agent (T-D2.1.1)
* **สัปดาห์ที่ 4: Advanced Grid, Documentation, QA & Evaluation (Sprint 4)**
  * **Backend/Frontend**: ทำความสามารถตารางระดับลึก Pivot Table ด้วย @antv/s2 และตัวควบคุม Caching Redis (T-A5.2.1, T-B4.1.1, T-B4.1.2)
  * **QA/Testing**: เขียนและรันชุดประเมิน SQL Accuracy (T-E2.1.1), Unit Tests (T-E1.1.1) และรันระบบผ่านตู้คอนเทนเนอร์ชั่วคราว (Testcontainers - T-E1.1.2)
  * **Documentation**: จัดทำคู่มือผู้ใช้ (User Manual), ระบบสารบัญข้อมูลภายใน (Data Dictionary) และคู่มือติดตั้งระบบ (Deployment Manual) ให้เสร็จสมบูรณ์ (T-A7.1.5, T-C3.1.4, T-D1.1.4)
  * **Deployment**: เปิดระบบใช้งาน (Production Launch) ผ่าน Docker Compose (T-D1.1.3)
