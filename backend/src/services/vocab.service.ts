import { pool } from '../config/database.js';
import { Vocabulary, Chapter } from '../types/index.js';

export class VocabService {
  static async getAllVocabularies(chapterNumber?: number, category?: string): Promise<Vocabulary[]> {
    try {
      let query = `
        SELECT v.*, c.chapter_number
        FROM vocabularies v
        LEFT JOIN chapters c ON v.chapter_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (chapterNumber) {
        params.push(chapterNumber);
        query += ` AND c.chapter_number = $${params.length}`;
      }

      if (category) {
        params.push(category);
        query += ` AND v.category = $${params.length}`;
      }

      query += ` ORDER BY v.created_at ASC, v.word_romaji ASC`;
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching vocabularies from DB:', error);
      return [];
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const result = await pool.query(`SELECT DISTINCT category FROM vocabularies ORDER BY category ASC`);
      return result.rows.map(r => r.category);
    } catch (error) {
      console.error('Error fetching categories from DB:', error);
      return ['object', 'occupation', 'country', 'place', 'katakana', 'phrase', 'demonstrative'];
    }
  }

  static async getChapters(): Promise<Chapter[]> {
    try {
      const result = await pool.query(`SELECT * FROM chapters ORDER BY chapter_number ASC`);
      return result.rows;
    } catch (error) {
      console.error('Error fetching chapters from DB:', error);
      return [];
    }
  }
}
