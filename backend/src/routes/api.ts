import { Router } from 'express';
import { VocabController } from '../controllers/vocab.controller.js';
import { ExamController } from '../controllers/exam.controller.js';

export const router = Router();

// Vocabulary & Curriculum
router.get('/vocabularies', VocabController.getVocabularies);
router.get('/categories', VocabController.getCategories);
router.get('/chapters', VocabController.getChapters);

// Exam & Question Bank
router.get('/exam/questions', ExamController.getQuestions);
router.post('/exam/sessions/start', ExamController.startSession);
router.post('/exam/sessions/:id/submit', ExamController.submitSession);
router.get('/exam/sessions/:id/report', ExamController.getSessionReport);
router.get('/exam/sessions', ExamController.getRecentSessions);
