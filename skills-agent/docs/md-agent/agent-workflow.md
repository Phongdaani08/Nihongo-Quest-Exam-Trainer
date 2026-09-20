# Workflow มาตรฐาน: ให้ AI Agent ทำงานแก้โค้ดอย่างปลอดภัย จนถึงขึ้นเว็บดูผลได้จริง

เป้าหมายสุดท้าย: **เมื่อกลับมาจากพักข้าว เว็บต้องเข้าดูได้ทันที เป็นเวอร์ชันล่าสุดที่แก้ไปจริง ไม่มี error ค้าง**

กฎเหล็ก: **ทุกขั้นตอนต้องรู้ก่อนว่า "จะเกิดอะไรขึ้น" และ "ทำไมต้องทำ" ก่อนรันคำสั่งเสมอ ห้ามรันคำสั่งที่ไม่เข้าใจผลกระทบ**

---

## Phase 0: กฎความปลอดภัยที่ต้องยึดตลอดทั้ง session

1. **ห้ามรันคำสั่งที่ทำลายข้อมูลโดยไม่มี backup ก่อน** — โดยเฉพาะ `git reset --hard`, `git push --force`, `docker system prune -a` (ลบ image ทั้งหมด)
2. **ทุกคำสั่ง git ที่เปลี่ยนแปลง history หรือ branch ต้องอธิบายก่อนรันว่า**: ทำอะไร, กระทบ branch ไหนบ้าง, ย้อนกลับได้ไหมถ้าพลาด
3. **ถ้าเจอ error ระหว่างทำ ให้หยุดทันที ห้ามข้ามไปขั้นต่อไป** — วิเคราะห์ error ก่อน แก้ให้ผ่านจริงๆ ค่อยไปต่อ ไม่ใช่ "เดี๋ยวค่อยว่ากัน"
4. **ทุกครั้งที่แก้โค้ดเสร็จ 1 ส่วน ต้องรันเทส/build ทดสอบก่อนไปทำส่วนถัดไป** ไม่ปล่อยให้ error สะสมพะรุงพะรังจนหาต้นตอไม่เจอ
5. **ห้าม merge/commit ทับงานของคนอื่นโดยไม่เช็ค conflict ก่อน** — ทุก merge ต้องอ่านว่าอะไร conflict บ้างก่อนตัดสินใจ resolve
6. **เก็บ log ทุกคำสั่งสำคัญที่รันไป** เพื่อ debug ย้อนหลังได้ถ้าเกิดปัญหา

---

## Phase 1: Sync branch อย่างปลอดภัย (ก่อนเริ่มแก้โค้ด)

สถานการณ์: มีงานค้างอยู่ใน branch ปัจจุบัน (ยังไม่ commit) และ branch `develop` มีโค้ดใหม่ที่ต้องดึงมารวมก่อนเริ่มงาน

### ขั้นที่ 1.1 — เช็คสถานะปัจจุบันก่อนทำอะไรทั้งสิ้น
```bash
git status
git branch --show-current
git log --oneline -5
```
**ทำไม**: ต้องรู้ก่อนว่าตอนนี้อยู่ branch ไหน มีไฟล์ค้างแก้ (uncommitted) กี่ไฟล์ ไม่งั้นขั้นตอนถัดไปเสี่ยงทำงานหาย

### ขั้นที่ 1.2 — Commit งานที่ทำค้างไว้ใน branch ปัจจุบันก่อน
```bash
git add -A
git commit -m "wip: บันทึกงานก่อน sync กับ develop"
```
**ทำไม**: ป้องกันงานที่แก้ไปแล้วหายระหว่างสลับ branch หรือ pull ถ้ามี uncommitted changes ค้างอยู่ Git อาจ block การสลับ branch หรือแย่กว่านั้นคือ merge ทับกันแบบไม่ตั้งใจ
**ผลกระทบ**: สร้าง commit ใหม่ใน branch ปัจจุบัน ย้อนกลับได้ด้วย `git reset --soft HEAD~1` ถ้าจำเป็น (ยังไม่ push ไปไหน ปลอดภัย)

### ขั้นที่ 1.3 — สลับไป develop แล้วดึงโค้ดล่าสุด
```bash
git checkout develop
git pull origin develop --rebase
```
**ทำไม**: ต้องได้โค้ด develop ล่าสุดจริงๆ ก่อนเอาไปรวมกับ branch งานของเรา ใช้ `--rebase` แทน merge ธรรมดาเพื่อให้ history ของ develop เป็นเส้นตรง สะอาด ไม่มี merge commit ปนเปื้อน
**ผลกระทบ**: ถ้า develop local มี commit ที่ diverge จาก remote (ไม่ควรมีถ้าไม่เคย commit ตรงนี้) อาจต้อง resolve conflict ตรงนี้ก่อน — ถ้าเกิด conflict ให้หยุดและแจ้งผู้ใช้ทันที ห้าม force push ทับ

### ขั้นที่ 1.4 — กลับมา branch ของเรา แล้ว merge develop เข้ามา
```bash
git checkout <ชื่อ-branch-ของเรา>
git merge develop
```
**ทำไม**: ใช้ `merge` ไม่ใช่ `rebase` ตรงจุดนี้ เพราะ branch งานของเรา**อาจเคย push ขึ้น remote ไปแล้ว** — การ rebase branch ที่ push ไปแล้วจะเปลี่ยน commit hash ทั้งหมด ทำให้ push กลับไปต้อง force push ซึ่งเสี่ยงทำลาย history ของคนอื่นที่ pull ไปแล้ว merge ปลอดภัยกว่าในสถานการณ์นี้
**ผลกระทบ**: ถ้ามี conflict จะหยุดตรงนี้ให้ resolve ทีละไฟล์ — **ห้ามใช้ `git checkout --theirs` หรือ `--ours` แบบเหมารวมทั้งหมด** ต้องอ่านทุกจุด conflict จริงๆ ว่าโค้ดทั้งสองฝั่งทำอะไร แล้วรวมให้ถูกต้องตาม logic ไม่ใช่เลือกทิ้งฝั่งใดฝั่งหนึ่งมั่วๆ

### ขั้นที่ 1.5 — ตรวจสอบหลัง merge ก่อนไปต่อ
```bash
git status
git diff develop --stat
```
เช็คเพิ่มเติมด้วยตา (ไม่ใช่แค่ git):
- **ไฟล์ config เปลี่ยนไหม** — เช็ค `.env`, `.env.example`, `docker-compose.yml`, `Dockerfile`, `package.json` (dependency ใหม่ที่ develop เพิ่มมา) ว่ามีอะไรเปลี่ยนที่ต้อง sync เพิ่ม เช่น environment variable ใหม่ที่ยังไม่มีในเครื่อง local
- **ถ้ามี dependency ใหม่** ต้องรัน `npm install` (หรือ `yarn install`) ใหม่ก่อน build
- **ถ้ามี database migration ใหม่จาก develop** ต้องรัน migration ก่อน ไม่งั้น backend อาจ error ตอน start

**เงื่อนไขหยุด**: ถ้า merge conflict ซับซ้อนเกินไป หรือไม่แน่ใจว่า resolve ถูกต้อง → **หยุดทันที ไม่เดาต่อ** แจ้งสรุปว่า conflict อยู่ตรงไหน มีตัวเลือกอะไรบ้าง ให้ผู้ใช้ตัดสินใจ

---

## Phase 2: ทำตามแผนแก้โค้ด (Implementation)

### กฎการทำงานระหว่าง phase นี้
1. ทำทีละหัวข้อ/ทีละไฟล์ตามลำดับความสำคัญที่วางแผนไว้ (สูงสุด → ต่ำสุด)
2. **แก้เสร็จ 1 จุด → ทดสอบทันที** ก่อนไปจุดถัดไป (รัน dev server ดูผล หรือรัน unit test ถ้ามี)
3. ถ้าแก้แล้ว build/compile ไม่ผ่าน → **หยุด แก้ error ให้ผ่านก่อน** ห้ามข้ามไปทำเรื่องอื่นแล้วปล่อย error ค้าง
4. ถ้าเจอจุดที่แผนเดิมไม่ครอบคลุม หรือพบว่าแผนขัดแย้งกับโค้ดจริง → หยุดและรายงาน ไม่เดาทำต่อเอง
5. Commit เป็นระยะๆ เมื่อแต่ละหัวข้อเสร็จสมบูรณ์และทดสอบผ่านแล้ว (ไม่ commit โค้ดที่ยัง error)

```bash
git add <ไฟล์ที่แก้เฉพาะจุดนี้>
git commit -m "fix: <อธิบายสั้นๆ ว่าแก้อะไร ทำไม>"
```

### เงื่อนไขหยุดทั้งหมดใน phase นี้
- Build fail / compile error → หยุด แก้ให้ผ่านก่อน
- Test fail (ถ้ามี automated test) → หยุด ตรวจว่าเป็นเพราะโค้ดที่แก้จริงๆ หรือ test เดิมต้องอัปเดตตาม
- พบว่าการแก้จุดหนึ่งกระทบไฟล์อื่นที่ไม่ได้อยู่ในแผน (regression) → หยุด ประเมินผลกระทบก่อนตัดสินใจแก้ต่อ

---

## Phase 3: Build + รัน Docker ให้เห็นผลจริง (ป้องกันปัญหา cache)

### ขั้นที่ 3.1 — ปิด container เดิมและล้างให้สะอาด
```bash
docker-compose down
```
**ทำไม**: ต้องไม่มี container เก่าค้างรันอยู่คู่กับตัวใหม่ ป้องกันไปเจอ port ชนหรือเปิดผิดตัว

### ขั้นที่ 3.2 — Build ใหม่แบบไม่ใช้ cache
```bash
docker-compose build --no-cache
```
**ทำไม**: บังคับให้ Docker compile source code ใหม่ทั้งหมด ตัดปัญหา layer cache ค้างเวอร์ชันเก่าที่เจอปัญหาบ่อยตามที่ระบุไว้ก่อนหน้า
**หมายเหตุ**: ขั้นตอนนี้ช้ากว่าปกติเพราะไม่ใช้ cache แต่จำเป็นเพื่อความชัวร์ 100% หลัง merge/แก้โค้ดใหญ่

### ขั้นที่ 3.3 — Start container ใหม่
```bash
docker-compose up -d --force-recreate
```
**ทำไม**: `--force-recreate` บังคับสร้าง container ใหม่จาก image ที่เพิ่ง build แม้ config จะดูเหมือนไม่เปลี่ยนก็ตาม ป้องกัน Docker Compose ฉลาดเกินไปแล้วใช้ container เดิม

### ขั้นที่ 3.4 — ยืนยันว่า container รันจาก image ล่าสุดจริง
```bash
docker images | head -5
docker ps
```
เช็คว่า:
- Timestamp ของ image ล่าสุดตรงกับเวลาที่เพิ่ง build (ไม่ใช่ image เก่าจากเมื่อวาน)
- Container ที่รันอยู่ใช้ image ID ตรงกับ image ล่าสุดที่ build ไป

### ขั้นที่ 3.5 — เช็ค log ว่า start สำเร็จ ไม่มี error
```bash
docker-compose logs --tail=100
```
ดูว่า:
- Backend/frontend server start สำเร็จ ไม่มี error stack trace
- ไม่มี error เรื่อง missing environment variable, database connection fail, port ชนกัน

**เงื่อนไขหยุด**: ถ้า log มี error ระหว่าง start → **หยุดทันที ห้ามถือว่างานเสร็จ** วิเคราะห์ error จาก log ก่อน แก้ให้ start ผ่านสะอาดจริงๆ

---

## Phase 4: ยืนยันขั้นสุดท้ายว่าเว็บพร้อมใช้งานจริง

Checklist ก่อนถือว่า "เสร็จพร้อมให้เปิดดู":

1. `docker ps` — container ทุกตัวสถานะ `Up` ไม่มี `Restarting` หรือ `Exited`
2. เปิดเว็บผ่าน `curl -I http://localhost:3000` (หรือพอร์ตที่ใช้จริง) เช็คว่าได้ HTTP 200 ไม่ใช่ error 500/502/504
3. เปิดเบราว์เซอร์จริง เข้าหน้าเว็บ **hard refresh** (`Ctrl+Shift+R`) เพื่อตัดปัญหา browser cache ฝั่ง client ออกจากสมการ
4. ตรวจสอบด้วยตาว่า**ฟีเจอร์ที่เพิ่งแก้แสดงผลตามที่ตั้งใจจริง** (เช่น ถ้าแก้ markdown rendering ให้เช็คว่าตัวหนา/list render ถูกต้องแล้วจริงๆ ไม่ใช่แค่เว็บเปิดได้)
5. เปิด DevTools → Console เช็คว่าไม่มี JavaScript error สีแดงค้างอยู่
6. เปิด DevTools → Network เช็คว่าไฟล์ JS/CSS ที่โหลดมาเป็นเวอร์ชันล่าสุด (ถ้ามี content hash ในชื่อไฟล์ ให้ตรงกับ build ล่าสุด)

### ถ้าครบทุกข้อ → สรุปให้ผู้ใช้ว่า
- Sync กับ develop สำเร็จ, merge conflict (ถ้ามี) แก้ยังไง
- รายการที่แก้ไปทั้งหมดตามแผน พร้อมสถานะแต่ละข้อ (เสร็จ/ติดปัญหา)
- ยืนยันว่าเว็บเข้าดูได้แล้วที่ URL ไหน เวอร์ชันล่าสุดจริง ทดสอบผ่านครบตาม checklist

### ถ้าไม่ครบ → ห้ามสรุปว่า "เสร็จแล้ว"
รายงานตามจริงว่าติดอยู่ขั้นไหน สาเหตุคืออะไร รอการตัดสินใจจากผู้ใช้ก่อนทำต่อ

---

## สรุปลำดับคำสั่งทั้งหมด (Quick reference)

```bash
# Phase 1: Sync
git status
git add -A && git commit -m "wip: บันทึกงานก่อน sync กับ develop"
git checkout develop
git pull origin develop --rebase
git checkout <branch-ของเรา>
git merge develop
# → resolve conflict ถ้ามี, เช็ค config/dependency ใหม่

# Phase 2: ทำตามแผน (ทีละจุด + ทดสอบ + commit เป็นระยะ)

# Phase 3: Docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d --force-recreate
docker images | head -5
docker ps
docker-compose logs --tail=100

# Phase 4: ยืนยันผล
curl -I http://localhost:3000
# → เปิดเบราว์เซอร์ hard refresh, เช็ค DevTools Console/Network
```
