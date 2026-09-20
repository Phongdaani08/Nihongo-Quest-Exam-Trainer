## Build + รัน Docker ให้เห็นผลจริง (ป้องกันปัญหา cache)

### ขั้นที่ 3.1 — ปิด container เดิมและล้างให้สะอาด
```bash
docker-compose down
```
**ทำไม**: ต้องไม่มี container เก่าค้างรันอยู่คู่กับตัวใหม่ ป้องกันไปเจอ port ชนหรือเปิดผิดตัว

### ขั้นที่ 3.1.1 — ตรวจสอบว่าไม่มี Container ค้างอยู่

```bash
docker ps -a
```

เช็คว่า:
- ไม่มี container ของ project เดิมอยู่ในสถานะ `Up`
- ถ้ามี container ที่ไม่เกี่ยวข้องให้ตรวจสอบก่อนลบ
- หากมี orphan container ให้ใช้

```bash
docker compose down --remove-orphans
```

**ทำไม**:
บางครั้ง Docker Compose จะเหลือ orphan container หรือ network จาก compose file เวอร์ชันก่อน ทำให้รันผิด service หรือเกิดปัญหา network ซ้ำซ้อน

### ขั้นที่ 3.2 — Build ใหม่แบบไม่ใช้ cache
```bash
docker-compose build --no-cache
```
**ทำไม**: บังคับให้ Docker compile source code ใหม่ทั้งหมด ตัดปัญหา layer cache ค้างเวอร์ชันเก่าที่เจอปัญหาบ่อยตามที่ระบุไว้ก่อนหน้า
**หมายเหตุ**: ขั้นตอนนี้ช้ากว่าปกติเพราะไม่ใช้ cache แต่จำเป็นเพื่อความชัวร์ 100% หลัง merge/แก้โค้ดใหญ่

### ขั้นที่ 3.2.1 — ตรวจสอบว่า Build สำเร็จครบทุก Service

ตรวจสอบว่า:

- ทุก service ขึ้น `Successfully built`
- ไม่มี error ระหว่าง build
- ไม่มี package install fail
- ไม่มี dependency resolution fail
- ไม่มี build warning ที่ทำให้ image ใช้งานไม่ได้

**เงื่อนไขหยุด**

หากมี service ใด build ไม่สำเร็จ

> หยุดทันที
> ห้ามไปขั้นตอน Start Container
> วิเคราะห์ build log และแก้ให้ build ผ่านก่อน

### ขั้นที่ 3.3 — Start container ใหม่
```bash
docker-compose up -d --force-recreate
```
**ทำไม**: `--force-recreate` บังคับสร้าง container ใหม่จาก image ที่เพิ่ง build แม้ config จะดูเหมือนไม่เปลี่ยนก็ตาม ป้องกัน Docker Compose ฉลาดเกินไปแล้วใช้ container เดิม

### ขั้นที่ 3.3.1 — ตรวจสอบสถานะ Container

```bash
docker compose ps
```

เช็คว่า:

- ทุก service เป็น `Up`
- ไม่มี `Restarting`
- ไม่มี `Exited`
- ถ้ามี Health Check ให้สถานะเป็น `healthy`

**เงื่อนไขหยุด**

หาก service ใด Restarting หรือ Exited

> หยุดทันที
> ตรวจสอบ log ก่อนทำขั้นตอนถัดไป

### ขั้นที่ 3.3.2 — ตรวจสอบ Health Check (ถ้ามี)

```bash
docker inspect <container-name>
```

หรือ

```bash
docker compose ps
```

เช็คว่า

- Status = Healthy

ไม่ใช่เพียง

- Up

**ทำไม**

Container ที่เป็น `Up` ไม่ได้แปลว่า Application พร้อมใช้งานเสมอไป

เช่น

- Database ยังเชื่อมไม่ได้
- Backend ยังโหลดไม่เสร็จ
- Service อยู่ใน Crash Loop

### ขั้นที่ 3.4 — ยืนยันว่า Container ใช้ Image ล่าสุดจริง

```bash
docker compose images
docker compose ps
```

เช็คว่า:

- Container ใช้ image ล่าสุดที่เพิ่ง build
- Image ID ตรงกับ image ล่าสุด
- ไม่มีการรัน image เก่าค้างอยู่

**ทำไม**

`docker images` แสดงเพียงรายการ image ทั้งหมด แต่ไม่ได้ยืนยันว่า container ที่กำลังรันใช้ image ใดจริง

### ขั้นที่ 3.5 — เช็ค log ว่า start สำเร็จ ไม่มี error
```bash
docker-compose logs --tail=100
```
ดูว่า:
- Backend/frontend server start สำเร็จ ไม่มี error stack trace
- ไม่มี error เรื่อง missing environment variable, database connection fail, port ชนกัน

**เงื่อนไขหยุด**: ถ้า log มี error ระหว่าง start → **หยุดทันที ห้ามถือว่างานเสร็จ** วิเคราะห์ error จาก log ก่อน แก้ให้ start ผ่านสะอาดจริงๆ

### ขั้นที่ 3.5.1 — ตรวจสอบการเชื่อมต่อ Service สำคัญ

ตรวจสอบจาก log ว่า

- Database Connected
- Redis Connected (ถ้ามี)
- Vector Database Connected (ถ้ามี)
- Message Queue Connected (ถ้ามี)
- Environment Variables โหลดครบ
- Migration สำเร็จ (ถ้ามี)

**เงื่อนไขหยุด**

หาก service dependency ใดเชื่อมต่อไม่สำเร็จ

> หยุดทันที
> วิเคราะห์ log และแก้ไขก่อนเปิดใช้งาน



---

## Phase 4: ยืนยันขั้นสุดท้ายว่าเว็บพร้อมใช้งานจริง


Checklist ก่อนถือว่า "เสร็จพร้อมให้เปิดดู":

1. `docker ps` — container ทุกตัวสถานะ `Up` ไม่มี `Restarting` หรือ `Exited`

### ขั้นที่ 4.0 — ตรวจสอบ Health Endpoint (ถ้ามี)

```bash
curl http://localhost:3000/api/health
```

หรือ

```bash
curl http://localhost:3000/health
```

เช็คว่า

- Status = OK
- Database Connected
- Dependencies Ready

**ทำไม**

Health Endpoint ยืนยันว่า Application พร้อมให้บริการจริง ไม่ใช่เพียง Web Server เปิดได้

2. เปิดเว็บผ่าน `curl -I http://localhost:3000` (หรือพอร์ตที่ใช้จริง) เช็คว่าได้ HTTP 200 ไม่ใช่ error 500/502/504

### ขั้นที่ 4.1.1 — ตรวจสอบ API หลัก

ทดสอบ Endpoint สำคัญ เช่น

- Login API
- Session API
- Dashboard API
- Feature API ที่เพิ่งแก้

เช็คว่า

- Response Status ถูกต้อง
- ไม่มี HTTP 500
- ไม่มี Timeout
- Response ตรงตามที่คาดหวัง

**เงื่อนไขหยุด**

หาก API สำคัญทำงานผิด

> หยุดทันที
> วิเคราะห์ Backend Log ก่อนดำเนินการต่อ

3. เปิดเบราว์เซอร์จริง เข้าหน้าเว็บ **hard refresh** (`Ctrl+Shift+R`) เพื่อตัดปัญหา browser cache ฝั่ง client ออกจากสมการ

### ขั้นที่ 4.3.1 — ตรวจสอบ Functional Test

ตรวจสอบ Feature ที่เกี่ยวข้องกับงานที่เพิ่งแก้ เช่น

- Login
- Logout
- Dashboard
- Sidebar
- Markdown Rendering
- Chat
- File Upload
- Search
- Permission
- API Response

ยืนยันว่า

- Feature ทำงานถูกต้อง
- ไม่มี Regression
- ผลลัพธ์ตรงตาม Requirement

4. ตรวจสอบด้วยตาว่า**ฟีเจอร์ที่เพิ่งแก้แสดงผลตามที่ตั้งใจจริง** (เช่น ถ้าแก้ markdown rendering ให้เช็คว่าตัวหนา/list render ถูกต้องแล้วจริงๆ ไม่ใช่แค่เว็บเปิดได้)
5. เปิด DevTools → Console เช็คว่าไม่มี JavaScript error สีแดงค้างอยู่

### ขั้นที่ 4.5.1 — ตรวจสอบ Browser Network

ตรวจสอบว่า

- API ไม่มี HTTP 500
- API ไม่มี HTTP 404
- API ไม่มี Timeout
- Static Assets โหลดครบ
- JS Bundle เป็นเวอร์ชันล่าสุด
- CSS โหลดครบ


6. เปิด DevTools → Network เช็คว่าไฟล์ JS/CSS ที่โหลดมาเป็นเวอร์ชันล่าสุด (ถ้ามี content hash ในชื่อไฟล์ ให้ตรงกับ build ล่าสุด)

### ขั้นที่ 4.6 — ตรวจสอบ Migration (ถ้ามี)

ตรวจสอบว่า

- Database Schema เป็นเวอร์ชันล่าสุด
- Migration สำเร็จ
- ไม่มี Pending Migration
- ไม่มี Migration Error

หาก Migration ไม่สำเร็จ

> หยุดทันที
> แก้ไขก่อนถือว่าระบบพร้อมใช้งาน

### ถ้าครบทุกข้อ → สรุปให้ผู้ใช้ว่า
- รายการที่แก้ไปทั้งหมดตามแผน พร้อมสถานะแต่ละข้อ (เสร็จ/ติดปัญหา)
- ยืนยันว่าเว็บเข้าดูได้แล้วที่ URL ไหน เวอร์ชันล่าสุดจริง ทดสอบผ่านครบตาม checklist

### ถ้าไม่ครบ → ห้ามสรุปว่า "เสร็จแล้ว"
รายงานตามจริงว่าติดอยู่ขั้นไหน สาเหตุคืออะไร รอการตัดสินใจจากผู้ใช้ก่อนทำต่อ

---

## Rollback Plan (กรณี Deploy ไม่สำเร็จ)

หากพบปัญหาระหว่าง Build, Start หรือ Validation

ห้ามดำเนินการต่อโดยเด็ดขาด

ให้ระบุ

- ขั้นตอนที่ล้มเหลว
- สาเหตุที่พบ
- Log ที่เกี่ยวข้อง
- แนวทางแก้ไข

หากเป็นระบบ Production

ให้ Rollback ไปยัง Image หรือ Version ล่าสุดที่ผ่านการทดสอบแล้วก่อนเปิดใช้งานอีกครั้ง

**เป้าหมาย**

ห้ามปล่อยระบบที่ยังไม่ผ่าน Validation หรือมี Error ค้างอยู่เข้าสู่ผู้ใช้งาน