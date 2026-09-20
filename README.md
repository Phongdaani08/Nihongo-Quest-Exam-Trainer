# Nihongo Quest Exam Trainer

ระบบจำลองและฝึกฝนการสอบวัดผลภาษาญี่ปุ่น (การสอบพูดและตอบคำถามจากภาพ) สำหรับนักศึกษา**สถาบันการจัดการปัญญาภิวัฒน์ (PIM)** ในรายวิชา **JN60101 ภาษาญี่ปุ่น 1 (บทที่ 1 และ บทที่ 2)** ผู้สอน: อาจารย์ ดร.เอกนรินทร์ จิรชีวีวงศ์

---

## 1. ภาพรวมของระบบ (Overview)

**Nihongo Quest Exam Trainer** ถูกพัฒนาขึ้นเพื่อเป็นเครื่องมือช่วยเตรียมความพร้อมสำหรับการสอบปากเปล่าแบบจับเวลา 3 นาที (3-Minute Oral & Visual Exam) โดยจำลองรูปแบบการสอบเสมือนจริง ทั้งการแนะนำตนเอง (Jiko Shōkai), การแปลคำศัพท์แบบ Flash Translation และการตอบคำถามไวยากรณ์จากภาพสิ่งของ อาชีพ สัญชาติ และสถานที่

### โครงสร้างและเกณฑ์การสอบจริง (3 นาที 15 คะแนน)

| ส่วนการสอบ | คะแนน | คำอธิบาย | รายละเอียดและโครงสร้างคำตอบ |
| :--- | :--- | :--- | :--- |
| **ส่วนที่ 1: การแนะนำตนเอง (Jiko Shōkai)** | 5 คะแนน | แนะนำตัวตามลำดับ 5 ท่อน | 1. `Hajimemashite.`<br>2. `Watashi wa Poom desu.`<br>3. `Panyapiwatto keiei daigaku no gakusei desu.`<br>4. `Shumi wa manga/dokusho/eiga desu.`<br>5. `Douzo yoroshiku onegai itashimasu.` |
| **ส่วนที่ 2: แปลคำศัพท์ฉับพลัน (Speed Translation)** | 5 คะแนน | อาจารย์พูดภาษาไทย $\rightarrow$ นักศึกษาตอบภาษาญี่ปุ่น | สุ่มทดสอบคำศัพท์จากบทที่ 1 และ บทที่ 2 โดยตอบทั้งคำศัพท์และเสียงอ่านที่ถูกต้อง |
| **ส่วนที่ 3: ตอบคำถามจากรูปภาพ (Visual Q&A)** | 5 คะแนน | ตอบคำถามตามโครงสร้างไวยากรณ์ 5 รูปแบบ | 1. **สิ่งของ:** `Kore wa nan desuka?` $\rightarrow$ `Kore wa [คำนาม] desu.`<br>2. **ประเทศที่มา:** `Anohito wa doko kara kimashitaka?` $\rightarrow$ `Anohito wa [ประเทศ] kara kimashita.` *(เจาะจง 4 ประเทศ: Thai, Nihon, Amerika, Chuugoku)*<br>3. **อาชีพ:** `Anohito wa dare desuka?` $\rightarrow$ `Anohito wa [อาชีพ] desu.`<br>4. **นิตยสาร:** `Kore wa nan no zasshi desuka?` $\rightarrow$ `Kore wa [หัวข้อ] no zasshi desu.`<br>5. **สถานที่:** `Kochira wa nan desuka?` $\rightarrow$ `Kochira wa [สถานที่] desu.` |

---

## 2. คุณสมบัติเด่นของระบบ (Key Features)

- **โหมดจำลองการสอบ 3 นาที (Timed Exam Simulator):** จับเวลาถอยหลัง 3 นาทีแบบสมจริง พร้อมสรุปคะแนนแยกแต่ละส่วน
- **โหมดฝึกฝนไร้ขีดจำกัด (Endless Infinite Practice):** ฝึกซ้อมวนซ้ำได้ไม่จำกัดรอบเพื่อความแม่นยำ
- **แถบสลับส่วนการสอบทันที (Live Section Switcher):** สลับฝึกเฉพาะส่วนที่ 1, ส่วนที่ 2 หรือ ส่วนที่ 3 ได้ตลอดเวลา
- **ระบบแจ้งเตือนข้อผิดพลาดทันที (Instant Error Alerts & Explanations):** แสดงกล่องแจ้งเตือนสีแดงทันทีเมื่อตอบผิด พร้อมเปรียบเทียบสิ่งที่คุณตอบกับคำตอบและไวยากรณ์ที่ถูกต้อง
- **พัซเซิลเรียงประโยค Jiko Shōkai:** ฝึกเรียงคำศัพท์ตามลำดับไวยากรณ์พร้อมระบบออกเสียงภาษาญี่ปุ่น (Speech Synthesis)
- **รูปภาพ Clean คุณภาพสูง:** สกัดเฉพาะภาพวัตถุและบุคคล **ไม่มีตัวอักษร Romaji หรือคำแปลภาษาไทยติดมาเฉลย**
- **คลังคำศัพท์สมบูรณ์ 100% (Vocab Vault):** รวบรวมคำศัพท์ครบถ้วน 73+ รายการจากบทที่ 1-2 พร้อมระบบค้นหาและแยกหมวดหมู่

---

## 3. สถาปัตยกรรมระบบ (System Architecture)

```
Nihongo-Quest-Exam-Trainer/
├── backend/                  # RESTful API Service (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/           # การเชื่อมต่อฐานข้อมูล PostgreSQL
│   │   ├── controllers/      # ตัวจัดการ Business Logic (คำศัพท์, ข้อสอบ, ประวัติคะแนน)
│   │   ├── routes/           # กำหนดเส้นทาง API Endpoint
│   │   ├── services/         # ฟังก์ชันการสืบค้นและบันทึกข้อมูล
│   │   └── server.ts         # ไฟล์เริ่มต้นระบบ Backend
│   ├── Dockerfile            # Multi-stage Docker build สำหรับ Production
│   └── package.json
│
├── frontend/                 # Web Application (React 18 + Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # คอมโพเนนต์ UI (Header, JikoShokai, SpeedVocab, VisualQA, Vault)
│   │   ├── services/         # ตัวเชื่อมต่อ API พร้อม Fallback ออฟไลน์
│   │   ├── utils/            # ฟังก์ชันช่วยสังเคราะห์เสียงพูดภาษาญี่ปุ่นและไทย
│   │   └── App.tsx           # หน้าจอหลักและการควบคุมสถานะ
│   ├── public/assets/images/ # รูปภาพประกอบโจทย์ที่ผ่านการ Clean ไร้เฉลย
│   ├── Dockerfile            # Docker build ร่วมกับ Nginx Server
│   └── package.json
│
├── database/                 # PostgreSQL Database Scripts
│   ├── init.sql              # สคริปต์สร้างตารางฐานข้อมูล Relational Schema
│   └── seed.sql              # ข้อมูลตั้งต้น คำศัพท์และโจทย์ข้อสอบทั้งหมด
│
└── docker-compose.yml        # ตัวควบคุม Container Orchestration ทั้งระบบ
```

---

## 4. ความต้องการของระบบ (Prerequisites)

- **Docker** (เวอร์ชัน 24.0 ขึ้นไป) และ **Docker Compose** (เวอร์ชัน 2.0 ขึ้นไป)
- *หรือหากต้องการรันแบบ Bare-metal บนเครื่องโดยตรง:*
  - **Node.js** (เวอร์ชัน 18.0 ขึ้นไป)
  - **npm** (เวอร์ชัน 9.0 ขึ้นไป)
  - **PostgreSQL** (เวอร์ชัน 15 ขึ้นไป)

---

## 5. วิธีการติดตั้งและรันระบบ (Installation & Running)

### วิธีที่ 1: รันด้วย Docker Compose (แนะนำ)

1. **Clone Repository ลงมาที่เครื่อง:**
   ```bash
   git clone https://github.com/Phongdaani08/Nihongo-Quest-Exam-Trainer.git
   cd Nihongo-Quest-Exam-Trainer
   ```

2. **สั่ง Build และเปิดการทำงานของ Service ทั้งหมด:**
   ```bash
   docker compose up -d --build
   ```

3. **เข้าใช้งานระบบผ่าน Browser:**
   - **ระบบเว็บแอปพลิเคชัน (Frontend):** `http://localhost:3000`
   - **ระบบ API (Backend):** `http://localhost:5001/api`
   - **การตรวจสอบสถานะ (Health Check):** `http://localhost:5001/health`
   - **ฐานข้อมูล PostgreSQL:** `localhost:5432` (Database: `nihongo_quest`, User: `postgres`)

4. **คำสั่งหยุดการทำงานของระบบ:**
   ```bash
   docker compose down
   ```

---

### วิธีที่ 2: รันแบบแยกส่วนบนเครื่อง (Local Development)

#### 1. ติดตั้งและตั้งค่าฐานข้อมูล (Database Setup)
```bash
psql -U postgres -d postgres -c "CREATE DATABASE nihongo_quest;"
psql -U postgres -d nihongo_quest -f database/init.sql
psql -U postgres -d nihongo_quest -f database/seed.sql
```

#### 2. รันระบบ Backend
```bash
cd backend
npm install
npm run build
npm start
```
*Backend จะพร้อมให้บริการที่พอร์ต `http://localhost:5001`*

#### 3. รันระบบ Frontend
```bash
cd frontend
npm install
npm run build
npm run preview -- --port 3000
```
*เข้าใช้งานหน้าเว็บได้ที่ `http://localhost:3000`*

---

## 6. รายการ API Endpoints (API Reference)

| เมธอด (Method) | เส้นทาง (Endpoint) | รายละเอียด |
| :--- | :--- | :--- |
| `GET` | `/health` | ตรวจสอบสถานะการทำงานและ Uptime ของ Server |
| `GET` | `/api/vocabularies` | ดึงรายการคำศัพท์ทั้งหมด (รองรับ Query `?chapter=1\|2` และ `?category=...`) |
| `GET` | `/api/questions` | ดึงคลังข้อสอบ (รองรับ Query `?section=1\|2\|3`) |
| `POST` | `/api/sessions` | บันทึกผลคะแนนและประวัติการสอบ |
| `GET` | `/api/sessions` | ดึงประวัติและสถิติการสอบย้อนหลัง |

---

## 7. โครงสร้างไวยากรณ์ข้อสอบส่วนที่ 3 (Section 3 Patterns)

1. **ถามสิ่งของ:**
   - ประโยคคำถาม: `Kore wa nan desuka?`
   - โครงสร้างคำตอบ: `Kore wa [คำนามสิ่งของ] desu.`
2. **ถามประเทศที่มา (ไทย, ญี่ปุ่น, อเมริกา, จีน):**
   - ประโยคคำถาม: `Anohito wa doko kara kimashitaka?`
   - โครงสร้างคำตอบ: `Anohito wa [ชื่อประเทศ] kara kimashita.`
3. **ถามอาชีพ:**
   - ประโยคคำถาม: `Anohito wa dare desuka?`
   - โครงสร้างคำตอบ: `Anohito wa [ชื่ออาชีพ] desu.`
4. **ถามหัวข้อนิตยสาร:**
   - ประโยคคำถาม: `Kore wa nan no zasshi desuka?`
   - โครงสร้างคำตอบ: `Kore wa [หัวข้อ/ประเภท] no zasshi desu.`
5. **ถามสถานที่:**
   - ประโยคคำถาม: `Kochira wa nan desuka?`
   - โครงสร้างคำตอบ: `Kochira wa [ชื่อสถานที่] desu.`

---

## 8. แหล่งอ้างอิงทางวิชาการ (Academic Attribution)

- **สถาบันการศึกษา:** สถาบันการจัดการปัญญาภิวัฒน์ (Panyapiwat Institute of Management - PIM)
- **รหัสวิชา:** JN60101 ภาษาญี่ปุ่น 1 (Japanese Language 1)
- **เอกสารและสไลด์ประกอบการสอน:** *Minna no Nihongo 1* และเอกสารบทเรียนประจำหลักสูตร บทที่ 1-2
- **อาจารย์ผู้สอน:** ดร.เอกนรินทร์ จิรชีวีวงศ์

---

## 9. ลิขสิทธิ์การใช้งาน (License)

โปรเจกต์นี้เผยแพร่ภายใต้ใบอนุญาต **MIT License**
