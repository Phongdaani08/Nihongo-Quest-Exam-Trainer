import { Request, Response } from 'express';
import { VocabService } from '../services/vocab.service.js';

export class VocabController {
  static async getVocabularies(req: Request, res: Response) {
    try {
      const chapter = req.query.chapter ? parseInt(req.query.chapter as string, 10) : undefined;
      const category = req.query.category ? (req.query.category as string) : undefined;
      const vocabs = await VocabService.getAllVocabularies(chapter, category);
      res.json({ success: true, count: vocabs.length, data: vocabs });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await VocabService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getChapters(req: Request, res: Response) {
    try {
      const chapters = await VocabService.getChapters();
      res.json({ success: true, data: chapters });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}
