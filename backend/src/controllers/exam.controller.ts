import { Request, Response } from 'express';
import { ExamService } from '../services/exam.service.js';

export class ExamController {
  static async getQuestions(req: Request, res: Response) {
    try {
      const section = req.query.section ? parseInt(req.query.section as string, 10) : undefined;
      const questions = await ExamService.getQuestionsBySection(section);
      res.json({ success: true, count: questions.length, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async startSession(req: Request, res: Response) {
    try {
      const { student_name } = req.body;
      const session = await ExamService.createExamSession(student_name || 'Poom');
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async submitSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { totalDurationSeconds, scoreSection1, scoreSection2, scoreSection3, totalScore, evaluationSummary, attempts } = req.body;
      
      const updatedSession = await ExamService.submitExamSession(id, {
        totalDurationSeconds: totalDurationSeconds || 0,
        scoreSection1: scoreSection1 || 0,
        scoreSection2: scoreSection2 || 0,
        scoreSection3: scoreSection3 || 0,
        totalScore: totalScore || 0,
        evaluationSummary: evaluationSummary || '',
        attempts: attempts || [],
      });

      res.json({ success: true, data: updatedSession });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getSessionReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const report = await ExamService.getExamSessionById(id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Session not found' });
      }
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getRecentSessions(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const sessions = await ExamService.getRecentSessions(limit);
      res.json({ success: true, count: sessions.length, data: sessions });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  static async getExamStats(_req: Request, res: Response) {
    try {
      const stats = await ExamService.getExamStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}
