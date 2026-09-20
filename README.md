# Nihongo Quest Exam Trainer

An enterprise-grade Japanese oral and visual examination preparation platform tailored for the **Panyapiwat Institute of Management (PIM)** course **JN60101 (Chapters 1 & 2)**, instructed by Dr. Eknarin Jiracheewiwong.

---

## 1. Overview

**Nihongo Quest Exam Trainer** is a specialized web application engineered to prepare students for the 3-minute oral and visual examination. The platform features strict timing controls, real-time auditory synthesis, interactive word assembly puzzles, speed vocabulary flashcards, and image-based question-and-answer modules adhering to Japanese grammatical structures.

### Examination Blueprint (3-Minute Oral Exam)

| Section | Score | Description | Structure & Rules |
| :--- | :--- | :--- | :--- |
| **Section 1: Jiko Shōkai** | 5 Points | Self-Introduction | 5 fixed lines: Greeting, Name, University/Faculty, Hobby (Manga/Dokusho/Eiga), Closing statement. |
| **Section 2: Speed Translation** | 5 Points | Thai to Japanese Flash Translation | Instant oral/written response to randomly selected Chapter 1 & 2 vocabulary terms. |
| **Section 3: Visual Q&A** | 5 Points | Visual Stimulus Grammar Q&A | Answering 5 structured visual questions based on images of objects, nationalities, occupations, and locations. |

---

## 2. Key Features

- **Standard 3-Minute Exam Simulator**: Realistic countdown timer matching the official examination format.
- **Endless Infinite Practice Mode**: Unconstrained practice sessions with immediate section switching.
- **Real-Time Section Switcher**: Rapidly navigate between Section 1, Section 2, Section 3, or the full simulator.
- **Instant Error Feedback & Explanations**: Immediate high-contrast alert notifications detailing the exact error and the correct grammatical target.
- **Interactive Jiko Shōkai Token Puzzle**: Word-unscramble training system with native speech pronunciation.
- **Clean Visual Assets**: Pure cropped photographic stimuli with zero text spoilers or label leaks.
- **Comprehensive Vocabulary Vault**: Complete 73+ vocabulary repository covering Chapters 1 and 2 with Kanji, Hiragana/Katakana, Romaji, and Thai definitions.

---

## 3. Technology Stack & Architecture

```
nihongo-quest-exam-trainer/
├── backend/                  # Node.js + Express + TypeScript API Service
│   ├── src/
│   │   ├── config/           # Database pool & connection configuration
│   │   ├── controllers/      # Request handlers for vocab, questions, sessions
│   │   ├── routes/           # RESTful API route definitions
│   │   ├── services/         # Database interaction services
│   │   └── server.ts         # Express entry point
│   ├── Dockerfile            # Multi-stage production container build
│   └── package.json
│
├── frontend/                 # React 18 + Vite + TypeScript Application
│   ├── src/
│   │   ├── components/       # UI modules (Header, JikoShokai, SpeedVocab, VisualQA, Vault)
│   │   ├── services/         # API integration client with local fallback support
│   │   ├── utils/            # Web Speech API synthesis utilities
│   │   └── App.tsx           # Main application state and layout
│   ├── public/assets/images/ # Pure cropped visual stimuli (no text overlays)
│   ├── Dockerfile            # Production Nginx container build
│   └── package.json
│
├── database/                 # PostgreSQL Schema & Seed Scripts
│   ├── init.sql              # Relational DDL (chapters, vocabularies, exam_questions, sessions)
│   └── seed.sql              # Complete Chapter 1 & 2 dataset
│
└── docker-compose.yml        # Orchestration for PostgreSQL, Backend, and Frontend
```

---

## 4. Prerequisites

Ensure the following tools are installed on your host system:

- **Docker** (version 24.0 or higher) & **Docker Compose** (v2.0 or higher)
- *Alternatively, for local bare-metal execution:*
  - **Node.js** (v18.0.0 or higher)
  - **npm** (v9.0.0 or higher)
  - **PostgreSQL** (v15 or higher)

---

## 5. Installation & Execution

### Method A: Docker Compose (Recommended for Production)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Phongdaani08/Nihongo-Quest-Exam-Trainer.git
   cd Nihongo-Quest-Exam-Trainer
   ```

2. **Launch all services:**
   ```bash
   docker compose up -d --build
   ```

3. **Access the application:**
   - **Frontend UI:** `http://localhost:3000`
   - **Backend API:** `http://localhost:5001/api`
   - **Backend Health Check:** `http://localhost:5001/health`
   - **PostgreSQL Database:** `localhost:5432` (Database: `nihongo_quest`, User: `postgres`)

4. **Shutdown services:**
   ```bash
   docker compose down
   ```

---

### Method B: Manual Local Development

#### 1. Database Setup
Ensure PostgreSQL is running locally, then execute:
```bash
psql -U postgres -d postgres -c "CREATE DATABASE nihongo_quest;"
psql -U postgres -d nihongo_quest -f database/init.sql
psql -U postgres -d nihongo_quest -f database/seed.sql
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```
*The backend service will listen on `http://localhost:5001`.*

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run preview -- --port 3000
```
*The frontend application will be available at `http://localhost:3000`.*

---

## 6. API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | System health check and uptime verification |
| `/api/vocabularies` | `GET` | Retrieve vocabulary list (supports `?chapter=1\|2` and `?category=...`) |
| `/api/questions` | `GET` | Retrieve exam questions pool (supports `?section=1\|2\|3`) |
| `/api/sessions` | `POST` | Record an exam session result and score breakdown |
| `/api/sessions` | `GET` | Fetch previous session history and performance logs |

---

## 7. Section 3 Grammar Formats

Section 3 enforces 5 standard grammatical structures based on the official textbook curriculum:

1. **Object Identification:**
   - Prompt: `Kore wa nan desuka?`
   - Target: `Kore wa [Noun] desu.`
2. **Country of Origin (Thai, Nihon, Amerika, Chuugoku):**
   - Prompt: `Anohito wa doko kara kimashitaka?`
   - Target: `Anohito wa [Country] kara kimashita.`
3. **Occupation Identification:**
   - Prompt: `Anohito wa dare desuka?`
   - Target: `Anohito wa [Occupation] desu.`
4. **Magazine Topic Classification:**
   - Prompt: `Kore wa nan no zasshi desuka?`
   - Target: `Kore wa [Topic] no zasshi desu.`
5. **Location Identification:**
   - Prompt: `Kochira wa nan desuka?`
   - Target: `Kochira wa [Location] desu.`

---

## 8. Academic Attribution & Course Alignment

- **Institution**: Panyapiwat Institute of Management (PIM)
- **Course**: JN60101 Japanese Language 1
- **Curriculum References**: *Minna no Nihongo 1* & PIM Internal Course Slides (Chapters 1 & 2)
- **Instructor**: Dr. Eknarin Jiracheewiwong

---

## 9. License

This project is licensed under the MIT License.
