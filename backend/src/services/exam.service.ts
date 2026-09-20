import { pool } from '../config/database.js';
import { ExamQuestion, ExamSession, ExamAttempt } from '../types/index.js';

export class ExamService {
  static async getQuestionsBySection(sectionNumber?: number): Promise<ExamQuestion[]> {
    try {
      let query = `
        SELECT q.*, c.chapter_number
        FROM exam_questions q
        LEFT JOIN chapters c ON q.chapter_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (sectionNumber) {
        params.push(sectionNumber);
        query += ` AND q.section_number = $${params.length}`;
      }

      query += ` ORDER BY q.section_number ASC, q.created_at ASC`;
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching exam questions from DB:', error);
      return [];
    }
  }

  static async createExamSession(studentName: string = 'Poom'): Promise<ExamSession> {
    const query = `
      INSERT INTO exam_sessions (student_name, started_at)
      VALUES ($1, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const result = await pool.query(query, [studentName]);
    return result.rows[0];
  }

  static async submitExamSession(
    sessionId: string,
    payload: {
      totalDurationSeconds: number;
      scoreSection1: number;
      scoreSection2: number;
      scoreSection3: number;
      totalScore: number;
      evaluationSummary: string;
      attempts: ExamAttempt[];
    }
  ): Promise<ExamSession> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateSessionQuery = `
        UPDATE exam_sessions
        SET completed_at = CURRENT_TIMESTAMP,
            total_duration_seconds = $1,
            score_section_1 = $2,
            score_section_2 = $3,
            score_section_3 = $4,
            total_score = $5,
            evaluation_summary = $6
        WHERE id = $7
        RETURNING *
      `;
      const sessionResult = await client.query(updateSessionQuery, [
        payload.totalDurationSeconds,
        payload.scoreSection1,
        payload.scoreSection2,
        payload.scoreSection3,
        payload.totalScore,
        payload.evaluationSummary,
        sessionId,
      ]);

      if (payload.attempts && payload.attempts.length > 0) {
        for (const attempt of payload.attempts) {
          await client.query(
            `INSERT INTO exam_attempts (session_id, question_id, user_response, is_correct, response_time_ms)
             VALUES ($1, $2, $3, $4, $5)`,
            [sessionId, attempt.question_id, attempt.user_response, attempt.is_correct, attempt.response_time_ms]
          );
        }
      }

      await client.query('COMMIT');
      return sessionResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getExamSessionById(sessionId: string): Promise<{ session: ExamSession; attempts: ExamAttempt[] } | null> {
    const sessionRes = await pool.query(`SELECT * FROM exam_sessions WHERE id = $1`, [sessionId]);
    if (sessionRes.rows.length === 0) return null;

    const attemptsRes = await pool.query(
      `SELECT a.*, q.prompt_text_th, q.teacher_question, q.expected_answer_romaji, q.textbook_ref
       FROM exam_attempts a
       LEFT JOIN exam_questions q ON a.question_id = q.id
       WHERE a.session_id = $1
       ORDER BY a.created_at ASC`,
      [sessionId]
    );

    return {
      session: sessionRes.rows[0],
      attempts: attemptsRes.rows,
    };
  }

  static async getRecentSessions(limit: number = 20): Promise<ExamSession[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM exam_sessions WHERE completed_at IS NOT NULL ORDER BY completed_at DESC LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch {
      return [];
    }
  }

  static async getExamStats(): Promise<any> {
    try {
      const statsRes = await pool.query(`
        SELECT 
          COUNT(*)::int as total_attempts,
          COALESCE(AVG(total_score), 0)::float as avg_total_score,
          COALESCE(AVG(score_section_1), 0)::float as avg_section_1,
          COALESCE(AVG(score_section_2), 0)::float as avg_section_2,
          COALESCE(AVG(score_section_3), 0)::float as avg_section_3,
          COALESCE(AVG(total_duration_seconds), 0)::float as avg_duration_seconds,
          COUNT(CASE WHEN total_score >= 12 THEN 1 END)::int as pass_count,
          COUNT(CASE WHEN total_score = 15 THEN 1 END)::int as perfect_count
        FROM exam_sessions 
        WHERE completed_at IS NOT NULL
      `);

      const trendRes = await pool.query(`
        SELECT 
          id,
          student_name,
          score_section_1,
          score_section_2,
          score_section_3,
          total_score,
          total_duration_seconds,
          completed_at
        FROM exam_sessions
        WHERE completed_at IS NOT NULL
        ORDER BY completed_at ASC
        LIMIT 30
      `);

      const stats = statsRes.rows[0] || {
        total_attempts: 0,
        avg_total_score: 0,
        avg_section_1: 0,
        avg_section_2: 0,
        avg_section_3: 0,
        avg_duration_seconds: 0,
        pass_count: 0,
        perfect_count: 0
      };

      const passRate = stats.total_attempts > 0 
        ? Math.round((stats.pass_count / stats.total_attempts) * 100) 
        : 0;

      return {
        ...stats,
        pass_rate: passRate,
        score_trend: trendRes.rows,
      };
    } catch (error) {
      console.error('Error computing exam stats from DB:', error);
      return {
        total_attempts: 0,
        avg_total_score: 0,
        avg_section_1: 0,
        avg_section_2: 0,
        avg_section_3: 0,
        avg_duration_seconds: 0,
        pass_count: 0,
        perfect_count: 0,
        pass_rate: 0,
        score_trend: [],
      };
    }
  }
}
