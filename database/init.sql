-- Nihongo Quest Exam Trainer Database Schema
-- Target: PostgreSQL 16
-- Clean relational design with audit timestamps and indexing

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_number INT NOT NULL UNIQUE,
    title_th VARCHAR(255) NOT NULL,
    title_jp VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vocabulary Bank Table
CREATE TABLE IF NOT EXISTS vocabularies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'object', 'occupation', 'country', 'place', 'katakana', 'number', 'pronoun', 'phrase'
    word_romaji VARCHAR(255) NOT NULL,
    word_kana VARCHAR(255) NOT NULL,
    word_kanji VARCHAR(255),
    meaning_th VARCHAR(255) NOT NULL,
    example_jp TEXT,
    example_th TEXT,
    textbook_ref VARCHAR(100) NOT NULL, -- e.g. 'JN60101 Ch.1 p.71'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vocab_category ON vocabularies(category);
CREATE INDEX IF NOT EXISTS idx_vocab_chapter ON vocabularies(chapter_id);

-- 3. Exam Question Bank Table
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
    section_number INT NOT NULL, -- 1: Jiko Shōkai, 2: Quick Flash Translate, 3: Visual Q&A
    question_type VARCHAR(100) NOT NULL, -- 'jiko_shokai', 'speed_vocab', 'visual_object', 'visual_country', 'visual_occupation', 'visual_magazine', 'visual_location'
    prompt_text_th VARCHAR(255) NOT NULL,
    prompt_text_jp VARCHAR(255),
    teacher_question VARCHAR(255), -- The exact question spoken by teacher (e.g. 'Kore wa nan desuka?')
    target_answer_pattern VARCHAR(255) NOT NULL, -- e.g. 'Kore wa [X] desu.'
    expected_answer_romaji VARCHAR(255) NOT NULL,
    expected_answer_kana VARCHAR(255) NOT NULL,
    image_asset_path VARCHAR(255),
    textbook_ref VARCHAR(100) NOT NULL,
    hint_th VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_question_section ON exam_questions(section_number);
CREATE INDEX IF NOT EXISTS idx_question_type ON exam_questions(question_type);

-- 4. Exam Sessions Table
CREATE TABLE IF NOT EXISTS exam_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(100) NOT NULL DEFAULT 'Poom',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_duration_seconds INT DEFAULT 0,
    score_section_1 NUMERIC(4, 2) DEFAULT 0.00,
    score_section_2 NUMERIC(4, 2) DEFAULT 0.00,
    score_section_3 NUMERIC(4, 2) DEFAULT 0.00,
    total_score NUMERIC(5, 2) DEFAULT 0.00,
    evaluation_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Exam Question Attempt Logs Table
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
    user_response TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    response_time_ms INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attempt_session ON exam_attempts(session_id);
