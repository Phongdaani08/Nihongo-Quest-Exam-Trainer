export interface Chapter {
  id: string;
  chapter_number: number;
  title_th: string;
  title_jp: string;
  description: string;
}

export interface Vocabulary {
  id: string;
  chapter_id?: string;
  chapter_number?: number;
  category: string;
  word_romaji: string;
  word_kana: string;
  word_kanji: string | null;
  meaning_th: string;
  example_jp: string | null;
  example_th: string | null;
  textbook_ref: string;
}

export interface ExamQuestion {
  id: string;
  chapter_id?: string;
  chapter_number?: number;
  section_number: number;
  question_type: string;
  prompt_text_th: string;
  prompt_text_jp: string | null;
  teacher_question: string | null;
  target_answer_pattern: string;
  expected_answer_romaji: string;
  expected_answer_kana: string;
  image_asset_path: string | null;
  textbook_ref: string;
  hint_th: string | null;
}

export interface ExamSession {
  id: string;
  student_name: string;
  started_at: string;
  completed_at: string | null;
  total_duration_seconds: number;
  score_section_1: number;
  score_section_2: number;
  score_section_3: number;
  total_score: number;
  evaluation_summary: string | null;
}

export interface ExamAttempt {
  question_id: string;
  user_response: string;
  is_correct: boolean;
  response_time_ms: number;
}
