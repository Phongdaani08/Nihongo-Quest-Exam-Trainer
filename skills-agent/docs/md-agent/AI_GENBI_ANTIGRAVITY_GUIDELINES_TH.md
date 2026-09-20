# กฎ ข้อห้าม และลักษณะการทำงานสำหรับ AI Agent (Antigravity) ในโปรเจกต์ AI_GenBI

ไฟล์นี้รวบรวมคำสั่ง ข้อห้าม กฎการทำงาน และวิเคราะห์ลักษณะนิสัยของผู้ใช้ จากบทสนทนาทั้งหมดระหว่างผู้ใช้กับ Antigravity ในโปรเจกต์ AI_GenBI จุดประสงค์เพื่อให้เซสชันถัดไปหรือ agent ตัวอื่นอ่านแล้วทำงานตามที่ผู้ใช้ต้องการทันที โดยไม่ต้องถามซ้ำและไม่ก่อปัญหาใหม่

---

## 0. วิธีใช้คู่มือนี้ในโปรเจกต์อื่น

คู่มือนี้ถูกเขียนให้สามารถ copy ไปใช้เป็น template สำหรับโปรเจกต์อื่นได้ เมื่อ AI หรือ agent อ่านไฟล์นี้ใน repo ใหม่ ควรแยกแยะ 2 ระดับ:

1. **หลักการทั่วไป (universal)** — ใช้ได้กับทุกโปรเจกต์ เช่น ห้ามแก้โค้ดโดยไม่สั่ง ต้องใช้ `todo_write` ติดตามงาน รันตรวจสอบก่อนจบงาน ไม่ commit secret ไม่กระทำการทำลายข้อมูล ไม่ใช้ emoji ถ้าไม่ได้รับขอ
2. **ตัวอย่างเฉพาะ (project-specific)** — ชื่อ repo `AI_GenBI`, path `C:\...`, ชื่อ `somboon-bng`, ตัวอย่างไฟล์/โค้ด เช่น `backend/src/agent/clarification.rs` หรือ `orchestrator.rs` ให้ถือเป็นตัวอย่างเท่านั้น ในโปรเจกต์ใหม่ให้แทนทีด้วยชื่อ lead dev, โครงสร้าง repo, conventions, และไฟล์จริงของ repo นั้น

ถ้าไฟล์นี้ถูกนำไปใช้ใน repo อื่น:
- ให้ AI นำหลักการร่วมไปปฏิบัติ
- ถามผู้ใช้ก่อนหากไม่แน่ใจว่าข้อไหนใช้ได้กับ repo ใหม่
- ไม่ตีความตัวอย่างจาก `AI_GenBI` ว่าเป็นคำสั่งเฉพาะของ repo ใหม่โดยอัตโนมัติ
- ถ้าผู้ใช้ไม่ได้บอกอะไร ให้ถือวิธีทำงานเดียวกัน แต่ปรับรายละเอียดให้เข้ากับ repo ปัจจุบัน

---

## 1. คำสั่งสูงสุดที่ต้องจำไว้ก่อนเสมอ

คำสั่งเฉพาะของผู้ใช้ในข้อความปัจจุบันมีลำดับความสำคัญสูงกว่ากฎทั่วไปหรือกฎอัตโนมัติจากระบบ ถ้าผู้ใช้บอกว่า "ห้ามแก้โค้ด" "เขียนได้แค่ไฟล์ .md" "ห้ามลบ" "หยุดก่อน" หรือคำสั่งเฉพาะใดๆ ให้หยุดและทำตามคำสั่งนั้นก่อนเสมอ

ตัวอย่างคำสั่งเฉพาะที่เคยเกิดขึ้น:
- ห้ามแก้ไขโค้ดในครั้งนี้ เขียนได้เฉพาะไฟล์ `.md` เท่านั้น
- ห้ามลบ/ห้ามดรอป database โดยไม่ได้รับอนุญาต
- ห้าม commit หรือ push ถ้าผู้ใช้ยังไม่สั่ง
- ห้ามสร้าง PR โดยอัตโนมัติ
- ห้ามแก้ไข `orchestrator.rs` หรือส่วนประกอบหลักโดยไม่ได้รับอนุญาต (ผู้ใช้เคยโกรธเพราะ agent แก้โค้ดแล้วทำให้ระบบพัง)

---

## 2. ข้อห้ามและขอบเขตที่ผู้ใช้กำหนด

ห้ามทำสิ่งต่อไปนี้โดยอัตโนมัติหรือโดยไม่ได้รับอนุญาตจากผู้ใช้:

### 2.1 ห้ามแก้ไขโค้ดโดยอัตโนมัติ
- ไม่แก้ไขไฟล์ `.rs`, `.ts`, `.tsx`, `.sql`, `.toml`, หรือไฟล์ config ใดๆ ถ้าผู้ใช้ไม่ได้สั่งให้แก้
- ไม่เพิ่มฟีเจอร์ ไม่รีแฟกเตอร์ และไม่แก้บั๊กโดยพละการ
- ถ้าผู้ใช้บอกให้หยุดหรือห้ามแก้โค้ด ให้หยุดทันที

### 2.2 ห้ามกระทำการเปลี่ยนแปลงระบบที่กลับคืนไม่ได้โดยไม่ขออนุญาต
- ห้าม `rm -rf`, ลบไฟล์ที่ไม่ได้สร้างเอง, ลบโฟลเดอร์
- ห้ามดรอป database หรือลบ schema/table/row จำนวนมาก
- ห้าม rewrite history ของ git (`push --force`, `rebase` ที่ทำให้คนอื่นเสียหาย)
- ห้าม checkout ทับของที่ยังไม่ได้ commit
- ห้ามส่งข้อความ/อีเมล/ชำระเงิน/เรียก API ที่มีผลต่อโลกภายนอก

### 2.3 ห้ามกระทำด้านความปลอดภัยที่เสี่ยง
- ห้ามค้นหา บันทึก หรือเปิดเผย credential, API key, token, password
- ห้าม commit secret ลง repository
- ห้ามปรับ security policy เพื่อ workaround ให้ build ผ่าน
- ช่วยงานด้านความปลอดภัยได้เฉพาะแบบป้องกัน เช่น ตรวจหาช่องโหว่, เขียน detection rule, เอกสารป้องกัน

### 2.4 ข้อจำกัดด้าน git
- ไม่อัปเดต git config (`user.name`, `user.email`)
- ไม่ใช้ flag `-i` (interactive)
- ไม่ `git push` ถ้าผู้ใช้ไม่ได้สั่ง
- ไม่ `git commit` ถ้าไม่มีการเปลี่ยนแปลง
- ถ้าจะ commit ให้เขียนข้อความเน้นเหตุผล "ทำไม" ไม่ใช่ "ทำอะไร"
- ตรวจหาข้อมูลลับก่อน commit

### 2.5 การบันทึกการตั้งค่า
- ถ้าต้องสร้าง config ใหม่ให้ใส่ใน `.devin/` หรือ `~/.config/devin/`
- ห้ามวาง config ใหม่ใน `.claude/`, `.cursor/` หรือโฟลเดอร์ของเครื่องมืออื่น เว้นแต่ถูกขอ

### 2.6 การสร้างไฟล์
- ถ้าผู้ใช้ไม่ได้ขอ ให้ปรับแต่งไฟล์ที่มีอยู่ก่อน ไม่สร้างไฟล์ใหม่
- ถ้าผู้ใช้สั่งให้สร้างไฟล์ `.md` ใหม่ ให้สร้างได้เฉพาะใน `docs/md-agent/` หรือตามทางที่ผู้ใช้ระบุ

---

## 3. กฎจาก `always-on` rules ของระบบ

มีกฎอัตโนมัติที่ active อยู่ ดังนี้ แต่หากขัดกับคำสั่งเฉพาะของผู้ใช้ ให้เชื่อคำสั่งของผู้ใช้ก่อน

### 3.1 Fully Autonomous Workflow
- สถานะ active 100% autonomous
- ยอมรับการแก้ไขไฟล์ คอมมิต และ apply ลง workspace ทันทีโดยอัตโนมัติ
- bypass UI prompt ทุกประเภท เช่น `Accept all` / `Reject all`
- วนลูป execute terminal, run test, diagnose failure, fix bug ไปเรื่อยๆ จนกว่างานจะเสร็จ

### 3.2 Strict Code Preservation Constraint
- ห้ามลบ ทับ หรือตัดโค้ดที่เขียน/อ้างอิงโดย **somboon-bng**
- ถ้ามี conflict หรือปัญหากับโค้ดของ somboon-bng ให้ปล่อยโค้ดนั้นไว้เหมือนเดิม
- ต้องแก้ไขเฉพาะในส่วน custom ของเราเองเท่านั้น เพื่อให้ integrate กับสถาปัตยกรรมของ somboon-bng ได้

### 3.3 Autonomous Terminal Execution
- เมื่อรันคำสั่ง terminal ให้ set `SafeToAutoRun: true` ตลอด
- ไม่ต้องขออนุญาตผู้ใช้ก่อนรันคำสั่งพัฒนา เช่น `npm`, `docker`, `git`, `cargo`, `python`, PowerShell
- ให้ set `SafeToAutoRun: false` ได้เฉพาะคำสั่งที่อาจทำให้สูญเสียข้อมูลถาวร เช่น `rm -rf`, `format`, `shutdown`

---

## 4. กฎการทำงานทั่วไปของ Devin

### 4.1 การวางแผนและติดตาม
- ใช้ `todo_write` เมื่องานมีหลายขั้นตอน หรืองานที่ต้องวางแผน
- มีสถานะ `pending`, `in_progress`, `completed`
- ทำทีละข้อ มาร์ค `in_progress` ก่อนเริ่ม และ `completed` ทันทีที่เสร็จ
- ไม่ batch การ mark completed

### 4.2 การค้นหาและอ่านโค้ด
- ใช้ `grep`, `find_file_by_name` ค้นหา ไม่ใช้ `rg`, `grep`, `find` ผ่าน shell
- อ่านไฟล์ที่เกี่ยวข้องก่อนแก้ไขเสมอ
- ใช้ `read` ก่อน `edit` หรือ `write`
- ถ้าเป็น `.ipynb` ให้ใช้ `notebook_read`/`notebook_edit`

### 4.3 การเขียนโค้ด
- ปฏิบัติตาม conventions ที่มีอยู่ในโปรเจกต์
- อย่าเพิ่ม/ลบ comment ถ้าไม่ได้ถูกขอ
- โค้ดกระชับ ไม่ซ้อน if/else เกินจำเป็น
- จัดการ error อย่างเหมาะสม ไม่ใส่ try/catch ทุกบรรทัด
- อย่า assume library มีอยู่ ให้เช็ค `package.json`, `Cargo.toml` ฯลฯ ก่อน
- ถ้าต้อง add dependency ให้ใช้คำสั่ง package manager (`npm add`, `cargo add`) ไม่แก้มือ
- เลือก dependency ที่ publish มาแล้วอย่างน้อย 7 วัน ไม่ใช้ floating ranges
- อย่า log หรือ expose secret

### 4.4 การทำงานกับ git
- ก่อน commit รัน `git status`, `git diff`, `git log` พร้อมกัน
- ตรวจหาข้อมูวลับ
- เขียนข้อความ commit เน้น "ทำไม" ไม่ใช่ "ทำอะไร"
- ถ้า pre-commit hook แก้ไฟล์ ให้ stage ใหม่แล้ว commit อีกครั้ง

### 4.5 การตรวจสอบก่อนจบงาน
- รัน lint, typecheck, build, test ตามความเหมาะสม
- ถ้ามีคำสั่งตรวจสอบเฉพาะใน `AGENTS.md` ให้ทำตาม
- ถ้าเป็นการแก้บั๊กให้เขียน failing test ก่อน แล้วค่อยแก้

### 4.6 การสื่อสาร
- ตอบกระชับ ตรงประเด็น
- ไม่พยายามทำให้ตัวเองดูดีหรือสบายใจผู้ใช้เกินไป
- ถ้าไม่รู้ ให้บอกว่าไม่รู้ และหาข้อมูลก่อน
- ไม่ทายผลเวลาหรือ ETA
- อธิบายคำสั่งที่กำลังทำสั้นๆ
- ไม่ใช้ emoji ถ้าผู้ใช้ไม่ขอ
- ใช้ `<ref_file ... />` หรือ `<ref_snippet ... />` เมื่ออ้างอิงไฟล์หรือบรรทัดในโค้ด

### 4.7 การแก้ไขข้อผิดพลาด
- แก้ปัญหาให้เจอ root cause จริงๆ ไม่ใช่แก้ที่ปะทุ่น
- ลองหลายทางก่อนถามผู้ใช้
- ถ้าติดเรื่อง authentication, permission, config ให้ถามผู้ใช้ได้
- ถ้าพบว่าทำให้ข้อมูลสูญหาย ให้แจ้งผู้ใช้ทันที

---

## 5. บทเรียนจากบทสนทนาก่อนหน้าในโปรเจกต์ AI_GenBI

### 5.1 ปัญหาที่ผู้ใช้เคยพบ
- Agent แก้ไข `orchestrator.rs` โดยอัตโนมัติ ทำให้ agent chat ตอบคำทักท่า "สวัสดี" ไม่ได้
- สร้างบั๊กใหม่จากการแก้ไขโค้ดโดยไม่ได้รับอนุญาต
- ทำให้ผู้ใช้หงุดหงิดและต้อง revert กลับไป commit `c00853e`

### 5.2 คำสั่งที่เคยเกิดขึ้นในอดีต
- Revert branch `feat/chat-attachment-knowledge-ingestion` กลับไป commit `c00853e`
- Pull `develop` ล่าสุด และ merge เข้า feature branch
- แก้ conflict แล้วรัน pre-PR checks: lint, typecheck, `cargo check/test`
- แก้ไขปัญหา `DATABASE_URL` / `pg_hba.conf` / รหัสผ่าน `postgres`
- รัน Docker Compose บน `develop` เพื่อ setup สภาพแวดล้อมทดสอบ
- ระวังการดรอป `text2sql` database เพราะจะทำให้ผู้ใช้หาย
- สร้าง super admin `sp@uih.co.th` ด้วย `BOOTSTRAP_ADMIN_EMAIL`/`BOOTSTRAP_ADMIN_PASSWORD`
- ตรวจสอบ `model_deployments` และ `tenant_model_access` สำหรับ `deepseek.v3.1`

### 5.4 บทเรียนจากการแก้ไขเมนู Settings (superadmin-tenant-ai-models-ux)
- อย่า apply เงื่อนไขหรือ logic เดียวกันไปทั่วทุก `SettingsWorkspaceEntry` ถ้ายังไม่ได้วิเคราะห์ root cause ของแต่ละ entry
- ตรวจสอบก่อนเสมอว่า entry นั้นมี dual entry สำหรับ tenant scope หรือไม่ (เช่น `audit-logs`/`usage-analytics` มี `tenant-audit-logs`/`tenant-usage-analytics` แยกออกมาแล้ว ในขณะที่ `ai-models` ไม่มี จึงต้องให้ superadmin ที่มี active tenant เห็นใน Tenant Administration)
- ทำตามคำสั่นเฉพาะของผู้ใช้เท่านั้น ห้ามขยายขอบเขตการแก้ไปยัง entry อื่นที่ไม่ได้รับอนุญาต โดยเฉพาะเมนู grouping และ permission

### 5.3 สภาพแวดล้อมที่ใช้
- รัน Docker Compose บน `develop` สำหรับ backend/frontend
- ฐานข้อมูล PostgreSQL ชื่อ `text2sql`
- มีบริการ `llama-embedding` และ `llama-chat` (profile `local-chat`)
- ใช้งานบน Windows เครื่อง `C:\Users\admin\Downloads\My_New_Project\AI_GenBI`

---

## 6. วิเคราะห์ลักษณะนิสัยและความต้องการของผู้ใช้

### 6.1 บุคลิกภาพ
- ผู้ใช้เป็นคนกำหนดทิศทางชัดเจน ชอบควบคุมสถานการณ์
- ไม่ชอบ surprise หรือการกระทำที่เกินคำสั่ง
- หงุดหงิดและไม่พอใจเมื่อ agent แก้โค้ดโดยอัตโนมัติแล้วทำให้ระบบพัง
- ชอบความซื่อสัตย์ ตรงไปตรงมา ไม่ชอบคำตอบที่มั่วหรือดูดีเกินจริง
- ใส่ใจรายละเอียดและคุณภาพของงาน ต้องการ pre-PR checks

### 6.2 สไตล์การสื่อสาร
- สื่อสารเป็นภาษาไทย
- ใช้ภาษาที่ตรงประเด็น บางครั้งสั้น บางครั้งยาวและละเอียด
- ถ้าผู้ใช้ถามให้เขียนรายละเอียด ให้เขียนอย่างละเอียดและครบถ้วน
- ถ้าผู้ใช้สั่งห้ามทำอะไร ให้เชื่อคำสั่งนั้นโดยไม่ต้องโต้แย้ง

### 6.3 ความต้องการด้านเทคนิค
- ต้องการ stability มากกว่าฟีเจอร์ใหม่
- ต้องการระบบที่ test ผ่านก่อนจะ merge หรือ PR
- ต้องการสภาพแวดล้อม local ที่พร้อมทดสอบ
- ต้องการให้ agent ทำตามขั้นตอน ไม่กระโดดข้าม
- ต้องการเอกสารหรือบันทึกกฎเพื่อให้เซสชันถัดไปทำงานถูกต้อง

### 6.4 ข้อควรระวังพิเศษ
- ห้ามลบ/ทับ database หรือผู้ใช้ในระบบ
- ห้ามสร้างการเปลี่ยนแปลงโดยไม่ได้รับอนุญาต
- ถ้าจะทำอะไรที่มี risk สูง ให้หยุดถามก่อน
- ผู้ใช้จำบทสนทนาก่อนหน้าได้ดีและคาดหวังให้ agent จำ state ด้วย

---

## 7. สรุปสิ่งที่ต้องทำก่อนแก้ไขโค้ดทุกครั้ง

1. ตรวจสอบว่าผู้ใช้สั่งให้แก้โค้ดจริงหรือไม่ ถ้าไม่ใช่ ให้หยุด
2. สร้าง `todo_write` ถ้างานมีหลายขั้นตอน
3. ค้นหาและอ่านไฟล์ที่เกี่ยวข้อง
4. ทำความเข้าใจ conventions และ dependencies ในโปรเจกต์
5. ถ้าเป็นการแก้บั๊ก ให้เขียน failing test ก่อน (ถ้ามี infrastructure)
6. แก้ไขเฉพาะส่วนที่จำเป็น
7. รัน lint/typecheck/build/test ตามความเหมาะสม
8. ตรวจสอบไม่มี secret ถูก commit
9. ถ้าจะ commit ให้ทำตามขั้นตอน git ที่กำหนด
10. ถ้าไม่แน่ใจ หยุดถามผู้ใช้ก่อน

---

## 8. หมายเหตุสำคัญสำหรับเซสชันถัดไป

- ถ้าผู้ใช้บอกว่า "ห้ามแก้โค้ด" หรือ "ทำได้แค่ไฟล์ .md" ให้ทำตามทันที อย่าแก้ไขไฟล์โค้ด
- ถ้าผู้ใช้ให้สร้างเอกสาร ให้สร้างใน `docs/md-agent/` หรือตาม path ที่ระบุ
- อย่าลืม `Strict Code Preservation Constraint` สำหรับโค้ดของ `somboon-bng`
- อย่าลืม `Autonomous Terminal Execution` สำหรับคำสั่ง terminal แต่ยังคงหลีกเลี่ยงคำสั่งที่ทำลายข้อมูลถาวร
- คำสั่งเฉพาะของผู้ใช้ override กฎทั่วไปเสมอ

---

## 9. สไตล์การเขียนโค้ดตามแบบ somboon-bng และรูปแบบโค้ดทีดีในโปรเจกต์

หมายเหตุ: ตัวอย่างโค้ดทั้งหมดใน section นี้ถูกคัดลอก (copy-paste) มาจากไฟล์จริงของโปรเจกต์ต้นฉบับ วัตถุประสงค์เพื่อให้ AI หรือ agent ตัวอื่นเข้าใจรูปแบบการเขียนโค้ดทีดีโดยไม่ต้องเปิดไฟล์ต้นฉบับ ในโปรเจกต์อื่นไม่จำเป็นต้องมีไฟล์หรือ path เหล่านั้น ให้ใช้ตัวอย่างเป็นหลักและปรับให้เข้ากับ conventions ของ repo นั้น

---

### 9.1 โครงสร้างไฟล์

**หลักการ**: 1 ไฟล์ = 1 หน้าที เปิดด้วย module doc สั้นๆ แต่ครบถ้วน แล้วแบ่งส่วนด้วย section header เพื่อให้ scrol แล้วรู้ว่าอยู่ส่วนไหน

**ตัวอย่าง module doc ของ Rust** จาก `backend/src/agent/clarification.rs:1-17`
```rust
/// Clarification Flow (T4.1 / FR-26)
///
/// Before generating SQL, the agent may detect that the user's question is
/// ambiguous (e.g. "show me sales" when multiple date ranges or regions are
/// possible).  This module provides:
///
///   1. `needs_clarification()` — asks the LLM whether the question is
///      unambiguous given the retrieved schema context.  Returns a list of
///      clarifying questions when ambiguity is detected.
///
///   2. `ClarificationRequest` — the SSE event emitted to the frontend so
///      the UI can render a question-and-answer widget before the agent
///      continues.
```

**ตัวอย่าง module doc ของ TypeScript** จาก `frontend/src/features/dashboard/components/DashboardAIChat.tsx:1-19`
```typescript
'use client';

/**
 * DashboardAIChat
 *
 * A floating chat panel embedded inside the dashboard sidebar that lets
 * users type natural-language instructions to adjust the live dashboard.
 *
 * Examples:
 *   "Change the revenue chart to a line chart"
 *   "Make all charts blue"
 *   ...
 */
```

**ตัวอย่าง module doc ของ Python** จาก `docs/client_agent/__init__.py:1`
```python
"""Universal Billing client-installed ingest agent."""
```

---

### 9.2 การจัด section ภายในไฟล์

**Rust / TypeScript**: ใช้ comment แบบ `// ── ชื่อ section ─────────────────────────────────────`

จาก `frontend/src/features/catalog/catalog-service.ts:40`
```typescript
// ── API calls ─────────────────────────────────────────────────────────────────
```

จาก `backend/src/db/bigquery.rs:35`
```rust
// ── Service-account key shape ─────────────────────────────────────────────────
```

**Python**: ไม่ใช้เส้น section แต่คั่นด้วย 2 บรรทัดว่างระหว่าง top-level functions/classes

---

### 9.3 การเรียง import / use

**Rust**: std / external / `crate::` จาก `backend/src/api/tenants.rs:1-11`
```rust
use axum::{
    extract::{Path, State},
    Json,
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
...
use crate::{api::auth::PlatformAdminUser, error::AppError, AppState};
```

**TypeScript**: external libraries ก่อน แล้วค่อย internal `@/...` จาก `useAvailableDataSources.ts:1-5`
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/features/auth/components/SessionProvider'
import { authorizationScopeKey } from '@/features/auth/services/active-role-resources'
```

**Python**: `__future__` ก่อน แล้ว stdlib → third-party → internal จาก `docs/client_agent/source_runtime.py:1-11`
```python
from __future__ import annotations

import logging
from copy import deepcopy
from typing import Any

from client_agent.config import AgentConfig, AgentSourceConfig
from client_agent.mapping import determine_source_high_watermark, map_rows_to_usage_events
from client_agent.spool import write_spool_events
from client_agent.state import AgentState
from client_agent.utils import max_iso, utc_now_iso
```

---

### 9.4 Naming conventions

| ภาษา | ฟังก์ชัน/ตัวแปร | struct/class/interface | ค่าคงที |
|---|---|---|---|
| Rust | `snake_case` | `PascalCase` | `SCREAMING_SNAKE_CASE` |
| TypeScript | `camelCase` | `PascalCase` | `SCREAMING_SNAKE_CASE` |
| Python | `snake_case` | `PascalCase` | `SCREAMING_SNAKE_CASE` |

**ชื่อต้องอธิบายตัวเอง** เช่น `normalize_slug`, `validate_max_users`, `tenant_user_can_manage_dashboards_subject_to_dashboard_acl`

---

### 9.5 Rust patterns

**Doc comment แบบ `///` กับ derive เรียงลำดับ `Debug, Clone, Serialize, Deserialize`**
จาก `backend/src/agent/clarification.rs:26-33`
```rust
/// A single clarifying question with optional answer choices.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClarifyingQuestion {
    pub id: String,
    pub question: String,
    /// Optional pre-defined choices (e.g. ["Last 7 days", ...])
    pub choices: Vec<String>,
}
```

**`#[serde(rename)]` สำหรับ JSON field ทีไม่ตรง Rust naming**
จาก `backend/src/db/bigquery.rs:46-54`
```rust
#[derive(Deserialize)]
struct BqQueryResponse {
    #[serde(rename = "jobComplete")]
    job_complete: Option<bool>,
    #[serde(rename = "jobReference")]
    job_reference: Option<BqJobRef>,
    ...
}
```

**Error handling: `Result` + `?`, `map_err`, `ok_or_else`**
จาก `backend/src/db/bigquery.rs:103-115`
```rust
pub async fn connect(cfg: &DatabaseConnectionConfig) -> Result<Self, DbError> {
    let raw = cfg.connection_string.expose_secret();
    let parsed = url::Url::parse(raw)
        .map_err(|e| DbError::Sqlx(sqlx::Error::Configuration(e.to_string().into())))?;
    ...
}
```

**SQL raw string กับ `.bind()`**
จาก `backend/src/api/tenants.rs:171-189`
```rust
async fn fetch_tenant(pool: &sqlx::PgPool, id: Uuid) -> Result<TenantSummary, AppError> {
    let row = sqlx::query(
        r#"
        SELECT t.id, t.name, t.slug, ...
        FROM tenants t
        LEFT JOIN tenant_memberships tm ON tm.tenant_id = t.id
        WHERE t.id = $1
        GROUP BY t.id
        "#,
    )
    .bind(id)
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Other(anyhow::anyhow!(e)))?
    .ok_or_else(|| AppError::NotFound(format!("tenant {id}")))?;
```

**Validation helper ชัดเจน**
จาก `backend/src/api/tenants.rs:136-151`
```rust
fn normalize_slug(value: &str) -> Result<String, AppError> {
    let slug = value.trim().to_ascii_lowercase();
    if slug.len() < 2
        || slug.len() > 100
        || !slug.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '-')
        || slug.starts_with('-')
        || slug.ends_with('-')
    {
        return Err(AppError::BadRequest(
            "slug must use 2-100 lowercase letters, numbers, or hyphens".to_string(),
        ));
    }
    Ok(slug)
}
```

---

### 9.6 TypeScript / React patterns

**`use client` แล้วตามด้วย imports**
```typescript
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Send, ... } from 'lucide-react';
```

**Interface สำหรับ props ใช้ `...Props`**
จาก `DashboardAIChat.tsx:34-42`
```typescript
export interface DashboardAIChatProps {
  panels: FullChartPanel[];
  kpis: KpiItem[];
  accent: string;
  onApply: (panels: FullChartPanel[], kpis: KpiItem[], accent: string) => void;
  /** Called when the user wants to undo the last AI change */
  onUndo?: () => void;
  canUndo?: boolean;
}
```

**Inline section comments ใน JSX**
```tsx
{/* ── header ── */}
<button ... />
{/* ── chat history ── */}
<div ... />
```

**Zustand store**
จาก `frontend/src/features/ai-models/stores/models.store.ts:68-73`
```typescript
export const useModelsStore = create<ModelsState>()((set, get) => ({
  models: [],
  activeChatModel: '',
  activePresenterModel: '',
  authorizationScope: null,
  ...
}));
```

**Hook ใช้ cleanup + `satisfies`**
จาก `useAvailableDataSources.ts:83-91`
```typescript
return {
  data_sources: payload as DataSourceSummary[],
  unavailable_reason:
    payload.length === 0 ? 'not_ready_or_offline' : null,
} satisfies AvailableDataSourcesResponse
```

---

### 9.7 Python patterns

**`from __future__ import annotations` บรรทัดแรกเสมอ**
```python
from __future__ import annotations
```

**Module logger**
```python
LOG = logging.getLogger(__name__)
```

**Type hints กับ keyword-only args `*`**
จาก `docs/client_agent/source_runtime.py:15-21`
```python
def poll_source_to_spool(
    *,
    config: AgentConfig,
    source: AgentSourceConfig,
    state: AgentState,
    max_events: int | None = None,
) -> dict[str, Any]:
```

**`@dataclass` สำหรับ state/config**
จาก `docs/client_agent/state.py:12-35`
```python
@dataclass
class AgentState:
    installation_id: str | None = None
    token: str | None = None
    organization_id: str | None = None
    ...
```

**Error handling ด้วย `raise ... from exc`**
จาก `docs/client_agent/api.py:93-94`
```python
except requests.RequestException as exc:
    raise ApiError(f"{method} {path} failed: {exc}") from exc
```

**Logging ใช้ %s ไม่ใช้ f-string**
จาก `docs/client_agent/agent.py:54`
```python
LOG.info("registered installation %s", self.state.installation_id)
```

**Validation ด้วย list comprehension + missing check**
จาก `docs/client_agent/spool.py:175-179`
```python
missing = [
    field for field in REQUIRED_EVENT_FIELDS if field not in event or event[field] in (None, "")
]
if missing:
    raise ValueError(f"{source_name} missing required event fields: {', '.join(missing)}")
```

**`json.dumps` ใช้ `indent=2, sort_keys=True`**
จาก `docs/client_agent/utils.py:61`
```python
json.dumps(payload, indent=2, sort_keys=True)
```

**`pathlib.Path` กับ `expanduser().resolve()`**
จาก `docs/client_agent/config.py:87`
```python
config_path = Path(path).expanduser().resolve()
```



---

#### ตัวอย่างไฟล์ .py ทังไฟล์ (copy จากต้นฉบับ)

**ไฟล์ 1: `docs/client_agent/state.py` (dataclass + store)**

```python
from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import json

from client_agent.utils import atomic_write_json


@dataclass
class AgentState:
    installation_id: str | None = None
    token: str | None = None
    organization_id: str | None = None
    project_id: str | None = None
    client_id: str | None = None
    source_system: str | None = None
    schema_version: str | None = None
    last_server_time_seen: str | None = None
    last_heartbeat_at: str | None = None
    last_attempted_batch_at: str | None = None
    last_successful_batch_at: str | None = None
    source_high_watermark_at: str | None = None
    server_ack_high_watermark_at: str | None = None
    last_sync_error_code: str | None = None
    last_sync_error_message: str | None = None
    last_connection_health: str | None = None
    last_sync_health: str | None = None
    last_clock_health: str | None = None
    last_clock_skew_ms: int | None = None
    source_checkpoints: dict[str, str] | None = None
    source_counters: dict[str, dict[str, float]] | None = None
    source_statuses: dict[str, dict[str, Any]] | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "AgentState":
        data = {key: value.get(key) for key in cls.__dataclass_fields__}
        if not isinstance(data.get("source_checkpoints"), dict):
            data["source_checkpoints"] = {}
        if not isinstance(data.get("source_counters"), dict):
            data["source_counters"] = {}
        if not isinstance(data.get("source_statuses"), dict):
            data["source_statuses"] = {}
        return cls(**data)


class AgentStateStore:
    def __init__(self, path: str | Path):
        self.path = Path(path)

    def load(self) -> AgentState:
        if not self.path.is_file():
            return AgentState()
        data = json.loads(self.path.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            raise ValueError(f"Agent state file must contain an object: {self.path}")
        return AgentState.from_dict(data)

    def save(self, state: AgentState) -> None:
        atomic_write_json(self.path, state.to_dict())

```

**ไฟล์ 2: `docs/client_agent/utils.py` (utility helpers)**

```python
from __future__ import annotations

import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_now_iso() -> str:
    return utc_now().isoformat().replace("+00:00", "Z")


def normalize_iso(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    dt = datetime.fromisoformat(text)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def max_iso(left: str | None, right: str | None) -> str | None:
    left_norm = normalize_iso(left)
    right_norm = normalize_iso(right)
    if left_norm is None:
        return right_norm
    if right_norm is None:
        return left_norm
    return left_norm if left_norm >= right_norm else right_norm


def sha256_hex(value: bytes | str) -> str:
    raw = value.encode("utf-8") if isinstance(value, str) else value
    return hashlib.sha256(raw).hexdigest()


def ensure_directory(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def atomic_write_text(path: Path, text: str) -> None:
    ensure_directory(path.parent)
    tmp = path.with_name(f".{path.name}.tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)


def atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    atomic_write_text(path, json.dumps(payload, indent=2, sort_keys=True))


def expand_env(obj: Any) -> Any:
    if isinstance(obj, str):
        return os.path.expandvars(obj)
    if isinstance(obj, list):
        return [expand_env(item) for item in obj]
    if isinstance(obj, dict):
        return {str(key): expand_env(val) for key, val in obj.items()}
    return obj

```

---

### 9.8 SQL / Shell / Markdown patterns

**SQL migration ใช้ `IF NOT EXISTS`**
จาก `backend/migrations/0005_data_source_onboarding.sql:1-21`
```sql
ALTER TABLE database_connections
    ADD COLUMN IF NOT EXISTS onboarding_status TEXT NOT NULL DEFAULT 'ready',
    ADD COLUMN IF NOT EXISTS onboarding_error TEXT,
    ...

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'database_connections_onboarding_status_check'
    ) THEN
        ALTER TABLE database_connections
            ADD CONSTRAINT database_connections_onboarding_status_check
            CHECK (onboarding_status IN ('testing', 'scanning', 'indexing', 'ready', 'failed'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS database_connections_onboarding_status_idx
    ON database_connections (onboarding_status);
```

**Bash script เปิดด้วย `set -euo pipefail`**
จาก `ops/validate-production-env.sh:1-4`
```bash
#!/usr/bin/env bash
set -euo pipefail

env_file="${1:-.env.production}"
```

---

### 9.9 ข้อควรหลีกเลี่ยง (อย่าเขียนแบบนี้)

- ไม่เขียน `return test` หลัง assign ตัวแปรกลางฟังก์ชัน ควร `return fetch_xxx(...)` ตรงๆ
- ไม่ทิ้ง `import` กลางฟังก์ชัน (ยกเว้นความจำเป็นจริงๆ เช่น optional dependency)
- ไม่เขียนบรรทัดเดียวยาวเกิน 100-120 ตัวอักษร (เช่น Tailwind className ยาว)
- ไม่ทิ้ง trailing spaces
- ไม่ใช้ f-string ใน `LOG.xxx` ใช้ `%s` formatting
- ไม่เขียน `unwrap()` หรือ `.unwrap()` ใน Rust test โดยไม่อธิบาย context
- ไม่ import wildcard `*` ยกเว้นกรณีพิเศษเช่น `__future__`

---

### 9.10 วิธีอัปเดตส่วนนี้ในอนาคต

เมื่อ `somboon-bng` หรือทีมเพิ่มไฟล์ใหม่ ให้รัน:
```bash
git log --author=somboon-bng --diff-filter=A --pretty=format:"" --name-only | Sort-Object -Unique
```

แล้วอ่านไฟล์ใหม่เพิ่มรายการตัวอย่างใน section นี้ พร้อมอัปเดต `last_analyzed_commit` ด้านบน

---

## 10. บทเรียนจากเซสชันล่าสุด (feature/reset-password-requirements-ui + แก้ hydration)

### 10.1 ลำดับการทำงานที่ผู้ใช้ต้องการบ่อย
1. เริ่มงานใหม่: `git stash` working tree เดิม → `checkout develop` → `pull --rebase` → สร้าง feature branch ใหม่
2. อ่านกฎก่อนเริ่ม: `.windsurfrules` + `docs/skills/*` + `AI_GENBI_DEVIN_GUIDELINES_TH.md` ทุกครั้ง
3. วางแผนด้วย `todo_write` ถ้ามีหลายขั้นตอน
4. วิเคราะห์ก่อนแก้: ถ้าผู้ใช้ไม่ได้สั่ง "แก้เลย" ให้วิเคราะห์อย่างเดียว
5. แก้เฉพาะที่จำเป็น: ไม่สร้างไฟล์ใหม่โดยไม่ได้รับขอ
6. ตรวจสอบก่อนส่งมอบ: `npm run typecheck`, `npm run lint`, `npx vitest run`, `npm audit`, `docker compose build` + `up -d`
7. `commit` ลง feature branch ด้วยข้อความเน้น "ทำไม"
8. ไม่ `push`/`PR` โดยอัตโนมัติ เว้นแต่ผู้ใช้สั่งชัดเจน
9. สรุปผล: branch, commits, CI status, docker status

### 10.2 คำสั่ง/ข้อความที่ผู้ใช้ใช้บ่อย
- "ห้ามแก้โค้ดนะ" → วิเคราะห์เท่านั้น ไม่แตะโค้ด
- "วิเคราะห์ให้อีกรอบให้มั่นใจ 100%" → ใช้ `debug-mantra` ทุกขั้นตอน พร้อมหลักฐาน
- "ช่วยอธิบายภาษาคน" → อธิบายเป็นภาษาไทยง่าย ๆ เปรียบเทียบเป็นอุปมา
- "จริงไหม" → ตอบตรง ๆ พร้อมหลักฐาน
- "แก้เลย" → ลงมือแก้ทันที แล้วรัน CI
- "รัน lint และ ci git ให้ตรวจผ่านด้วยแบบที่เคยทำ" → frontend CI + docker ตามเดิม
- "ต้องเป็นบร้าน xxx ที่พร้อม PR แต่ห้าม PR" → ตรวจ branch/commit/CI ไม่ push/PR
- "อ่าน .windsurfrules ทุกครั้ง" → อ่านตอนเริ่มเซสชันและปฏิบัติตามเอง

### 10.3 ปัญหาที่เจอและวิธีแก้
- **ResetPasswordCard requirements เป็นสแตติก**: เปลี่ยนเป็น live circle checklist เหมือน `ChangePasswordCard` โดยเพิ่ม `passwordChecks` และ render แบบ dynamic ใน `ResetPasswordCard.tsx`
- **Login hydration mismatch**: `useState` อ่าน `localStorage` ตอน render ทำให้ SSR กับ client ไม่ตรงกัน แก้โดยตั้งค่า default แล้วอ่าน `localStorage` ใน `useEffect` หลัง mount
- **"auth.ts เป็น dead code" ที่เข้าใจผิด**: `authOptions` ถูกใช้จริงใน `app/api/auth/[...nextauth]/route.ts` ไม่ใช่ dead code
- **"Remember me" กับรหัสผ่าน autofill**: ระบบจำเฉพาะ email รหัสผ่านที่เติมมาจาก browser password manager ไม่ใช่จาก `rememberMe`
- **PowerShell กับ `$(cat <<'EOF')` ทำให้ commit ล้มเหลว**: ใช้ `git commit -m "..."` ธรรมดา
- **Docker build แสดง exit 1 จาก stderr แต่สำเร็จ**: ตรวจสอบ `docker compose ps` หรือข้อความสรุป ไม่ใช่ exit code อย่างเดียว
- **Backend CI failures จาก develop**: `model_deployments.rs` (somboon-bng) และ `query_artifacts.rs`/`chat_clarification.rs` (jang) เป็นปัญหาเดิมใน develop ไม่แก้โดยอัตโนมัติ

### 10.4 วิธีคิดและหลักการทำงานที่ควรใช้
- อ่าน `.windsurfrules` และ skills ก่อนทุกงาน ไม่ต้องรอผู้ใช้บอก
- ใช้ `todo_write` ติดตามสถานะ
- ใช้ `debug-mantra` เมื่อมีบัค, `scrutinize` เมื่อตรวจแผน, `qwenchance` คอยไม่ให้คิดวน
- ถ้า user ถาม "ควรแก้ไหม" ให้แนะนำ แต่รอ "แก้เลย" ก่อนลงมือ
- อธิบาย technical debt ด้วยภาษาคนเมื่อถูกขอ
- อ้างอิง `file:line` เสมอ
- เคารพ code ownership ของ somboon-bng และแยก branch ไม่แตะ develop โดยตรง

### 10.5 วิเคราะห์นิสัยผู้ใช้จากเซสชันนี้
- ระมัดระวังและชอบควบคุมสถานการณ์ ไม่ชอบ surprise
- ชอบถาม "จริงไหม" และ "มั่นใจ 100%" เพื่อตรวจสอบก่อนตัดสินใจ
- ต้องการให้ agent ฉลาดขึ้นเอง อ่านกฎเองทุกครั้ง ไม่ต้องเตือน
- ใช้ "ห้ามแก้โค้ด" เป็น boundary ชัดเจน ต้องเชื่องทันที
- ชอบคำอธิบายละเอียดแต่กระชับ เป็นภาษาไทย
- ให้คุณค่ากับการตรวจสอบก่อนส่งมอบ (CI, docker)
- ต้องการสร้างเอกสาร/knowledge ทับซ้อน (skills, guidelines) เพื่อให้เซสชันถัดไปดีขึ้น
- ไม่ชอบให้ agent ผลักดัน agenda ของตัวเอง ต้องทำตามคำสั่งผู้ใช้เท่านั้น

