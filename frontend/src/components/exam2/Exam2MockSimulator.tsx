import React, { useState, useEffect, useMemo } from 'react';
import {
  Timer,
  Infinity as InfinityIcon,
  RotateCcw,
  Eye,
  EyeOff,
  Flame,
  Award,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { playJapaneseAudio, playThaiAudio } from '../../utils/speech';
import {
  exam2VocabList,
  exam2LocationQuestions,
  exam2ClockQuestions,
  exam2PhoneQuestions,
  exam2PriceQuestions,
  exam2ScheduleQuestions,
  allExam2QuestionsPool,
  Exam2QuestionItem
} from '../../services/exam2Data';
import { Vocabulary } from '../../types';
import {
  Exam2PracticePreset,
  defaultExam2Presets,
  Exam2PresetEditorModal
} from './Exam2CustomPresetManagerModal';

interface Exam2MockProps {
  initialMode?: 'timed_3min' | 'endless_infinite';
}

export const Exam2MockSimulator: React.FC<Exam2MockProps> = ({ initialMode = 'timed_3min' }) => {
  const [examMode, setExamMode] = useState<'timed_3min' | 'endless_infinite'>(initialMode);
  const [examState, setExamState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(180); // 3:00 minutes
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);
  const [loopRound, setLoopRound] = useState<number>(1);

  // Practice Scope Setting: 'all' (ทั้ง 2 ส่วน) | 'part1_only' (เฉพาะคำศัพท์) | 'part2_only' (เฉพาะตอบคำถาม)
  const [practiceScope, setPracticeScope] = useState<'all' | 'part1_only' | 'part2_only'>(() => {
    return (localStorage.getItem('nihongo_exam2_practice_scope') as any) || 'all';
  });

  // Custom Presets State & LocalStorage
  const [presets, setPresets] = useState<Exam2PracticePreset[]>(() => {
    try {
      const saved = localStorage.getItem('nihongo_exam2_custom_presets');
      return saved ? JSON.parse(saved) : defaultExam2Presets;
    } catch (e) {
      return defaultExam2Presets;
    }
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem('nihongo_exam2_active_preset_id') || 'preset_e2_all';
  });

  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [editingPreset, setEditingPreset] = useState<Exam2PracticePreset | null>(null);

  // Question Quantity for Endless Mode: 5, 10, 15, 20, 30, or 0 (Endless All Words in Preset)
  const [questionQuantity, setQuestionQuantity] = useState<number>(0);

  // Section 1: Vocab Words (Thai -> Japanese)
  const [sec1Items, setSec1Items] = useState<{ item: Vocabulary; options: Vocabulary[] }[]>([]);
  const [sec1Index, setSec1Index] = useState<number>(0);
  const [sec1Answers, setSec1Answers] = useState<{ isCorrect: boolean; response: string; expected: string }[]>([]);
  const [sec1Feedback, setSec1Feedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);

  // Section 2: Questions (5 Patterns)
  const [sec2Items, setSec2Items] = useState<Exam2QuestionItem[]>([]);
  const [sec2Index, setSec2Index] = useState<number>(0);
  const [sec2Answers, setSec2Answers] = useState<{ isCorrect: boolean; response: string; expected: string }[]>([]);
  const [sec2Feedback, setSec2Feedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);

  // Choice reveal toggle (Flashcard Active Recall)
  const [choiceRevealMode, setChoiceRevealMode] = useState<'instant' | 'hidden'>(() => {
    return (localStorage.getItem('nihongo_exam2_choice_mode') as 'instant' | 'hidden') || 'instant';
  });
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(true);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);

  // Endless statistics
  const [endlessStats, setEndlessStats] = useState<{ correct: number; total: number; streak: number }>({
    correct: 0,
    total: 0,
    streak: 0,
  });

  useEffect(() => {
    localStorage.setItem('nihongo_exam2_custom_presets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('nihongo_exam2_active_preset_id', activePresetId);
  }, [activePresetId]);

  useEffect(() => {
    localStorage.setItem('nihongo_exam2_choice_mode', choiceRevealMode);
  }, [choiceRevealMode]);

  useEffect(() => {
    localStorage.setItem('nihongo_exam2_practice_scope', practiceScope);
  }, [practiceScope]);

  const activePreset = useMemo(() => {
    return presets.find((p) => p.id === activePresetId) || defaultExam2Presets[0];
  }, [presets, activePresetId]);

  // Auto-play Thai Audio when Section 1 Thai prompt appears
  useEffect(() => {
    if (examState === 'running' && currentSection === 1 && sec1Items[sec1Index]) {
      playThaiAudio(sec1Items[sec1Index].item.meaning_th);
    }
  }, [examState, currentSection, sec1Index, sec1Items]);

  // Handlers for Preset Management
  const handleOpenCreatePreset = () => {
    setEditingPreset(null);
    setIsPresetModalOpen(true);
  };

  const handleOpenEditPreset = (preset: Exam2PracticePreset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPreset(preset);
    setIsPresetModalOpen(true);
  };

  const handleSavePreset = (savedPreset: Exam2PracticePreset) => {
    setPresets((prev) => {
      const exists = prev.some((p) => p.id === savedPreset.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPreset.id ? savedPreset : p));
      } else {
        return [...prev, savedPreset];
      }
    });
    setActivePresetId(savedPreset.id);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('คุณต้องการลบชุดฝึกซ้อมนี้ใช่หรือไม่?')) {
      setPresets((prev) => prev.filter((p) => p.id !== id));
      if (activePresetId === id) {
        setActivePresetId('preset_e2_all');
      }
    }
  };

  // Countdown timer for 3-minute exam
  useEffect(() => {
    let interval: any = null;
    if (examMode === 'timed_3min' && examState === 'running' && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((t) => {
          if (t <= 1) {
            handleFinishExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examMode, examState, timeLeftSeconds]);

  const handleStartExam = (mode: 'timed_3min' | 'endless_infinite' = examMode) => {
    setExamMode(mode);
    setLoopRound(1);

    // Filter Vocabularies based on active preset (Uses all selected words in preset)
    let vocabPool = exam2VocabList.filter((v) => activePreset.part1VocabIds.includes(v.id));
    if (vocabPool.length === 0) vocabPool = [...exam2VocabList];

    // Filter Questions based on active preset
    let questionsPool = allExam2QuestionsPool.filter((q) => {
      if (activePreset.part2QuestionIds && activePreset.part2QuestionIds.length > 0) {
        return activePreset.part2QuestionIds.includes(q.id);
      }
      return activePreset.part2PatternIds.includes(q.patternId);
    });
    if (questionsPool.length === 0 && activePreset.part2PatternIds.length > 0) {
      questionsPool = allExam2QuestionsPool.filter((q) => activePreset.part2PatternIds.includes(q.patternId));
    }
    if (questionsPool.length === 0 && activePreset.part1VocabIds.length === 0) {
      questionsPool = [...allExam2QuestionsPool];
    }

    let pickedSec1: { item: Vocabulary; options: Vocabulary[] }[] = [];
    let pickedSec2: Exam2QuestionItem[] = [];

    if (mode === 'timed_3min') {
      // Official Timed Exam: 5 Part 1 Vocab + 10 Part 2 Questions (2 from each pattern) = 15 total
      const shuffledVocab = [...vocabPool].sort(() => 0.5 - Math.random());
      pickedSec1 = shuffledVocab.slice(0, 5).map((v) => {
        const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
        const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
        return { item: v, options: opts };
      });

      const p1 = [...exam2LocationQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p2 = [...exam2ClockQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p3 = [...exam2PhoneQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p4 = [...exam2PriceQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p5 = [...exam2ScheduleQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      pickedSec2 = [...p1, ...p2, ...p3, ...p4, ...p5];
    } else {
      // Endless Infinite: Exact full count of words selected in the preset, randomly shuffled
      if (practiceScope === 'part1_only') {
        const shuffledVocab = [...vocabPool].sort(() => 0.5 - Math.random());
        const count = questionQuantity === 0 ? shuffledVocab.length : Math.min(questionQuantity, shuffledVocab.length);
        pickedSec1 = shuffledVocab.slice(0, count).map((v) => {
          const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
          const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
          return { item: v, options: opts };
        });
        pickedSec2 = [];
      } else if (practiceScope === 'part2_only') {
        const shuffledQuestions = [...questionsPool].sort(() => 0.5 - Math.random());
        const count = questionQuantity === 0 ? shuffledQuestions.length : Math.min(questionQuantity, shuffledQuestions.length);
        pickedSec1 = [];
        pickedSec2 = shuffledQuestions.slice(0, count);
      } else {
        // Both Part 1 & Part 2: All words in preset + All questions in preset
        const shuffledVocab = [...vocabPool].sort(() => 0.5 - Math.random());
        const sec1Count = questionQuantity === 0 ? shuffledVocab.length : Math.max(1, Math.round(questionQuantity / 3));
        pickedSec1 = shuffledVocab.slice(0, sec1Count).map((v) => {
          const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
          const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
          return { item: v, options: opts };
        });

        const shuffledQuestions = [...questionsPool].sort(() => 0.5 - Math.random());
        const sec2Count = questionQuantity === 0 ? shuffledQuestions.length : Math.max(1, questionQuantity - sec1Count);
        pickedSec2 = shuffledQuestions.slice(0, sec2Count);
      }
    }

    setSec1Items(pickedSec1);
    setSec1Index(0);
    setSec1Answers([]);
    setSec1Feedback(null);

    setSec2Items(pickedSec2);
    setSec2Index(0);
    setSec2Answers([]);
    setSec2Feedback(null);

    setTimeLeftSeconds(180);
    setCurrentSection(pickedSec1.length > 0 ? 1 : 2);
    setIsChoiceRevealed(choiceRevealMode === 'instant');
    setExamState('running');
  };

  const handleAnswerSec1 = (selectedRomaji: string) => {
    if (sec1Feedback) return;
    const current = sec1Items[sec1Index];
    const isCorrect = selectedRomaji === current.item.word_romaji;
    const newAnswers = [...sec1Answers, { isCorrect, response: selectedRomaji, expected: current.item.word_romaji }];
    setSec1Answers(newAnswers);
    setSec1Feedback({ isCorrect, selected: selectedRomaji, correct: current.item.word_romaji });

    if (examMode === 'endless_infinite') {
      setEndlessStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: isCorrect ? prev.streak + 1 : 0,
      }));
    }

    if (isCorrect) {
      playJapaneseAudio(current.item.word_kana || current.item.word_romaji);
    }

    setTimeout(() => {
      setSec1Feedback(null);
      setIsChoiceRevealed(choiceRevealMode === 'instant');
      if (sec1Index + 1 < sec1Items.length) {
        setSec1Index((prev) => prev + 1);
      } else {
        // Reached the end of Section 1
        if (examMode === 'endless_infinite') {
          if (practiceScope === 'part1_only' || sec2Items.length === 0) {
            // Endless Continuous Loop: Reshuffle all words in preset and loop seamlessly forever!
            let vocabPool = exam2VocabList.filter((v) => activePreset.part1VocabIds.includes(v.id));
            if (vocabPool.length === 0) vocabPool = [...exam2VocabList];
            const reshuffled = [...vocabPool].sort(() => 0.5 - Math.random()).map((v) => {
              const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
              const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
              return { item: v, options: opts };
            });
            setSec1Items(reshuffled);
            setSec1Index(0);
            setLoopRound((prev) => prev + 1);
          } else {
            setCurrentSection(2);
            setSec2Index(0);
          }
        } else {
          if (sec2Items.length > 0) {
            setCurrentSection(2);
          } else {
            handleFinishExam();
          }
        }
      }
    }, 450);
  };

  const handleAnswerSec2 = (optionIndex: number) => {
    if (sec2Feedback) return;
    const current = sec2Items[sec2Index];
    const chosenOption = current.options[optionIndex];
    const isCorrect = chosenOption.isCorrect;

    const newAnswers = [
      ...sec2Answers,
      { isCorrect, response: chosenOption.textRomaji, expected: current.targetAnswerRomaji },
    ];
    setSec2Answers(newAnswers);
    setSec2Feedback({ isCorrect, selected: chosenOption.textRomaji, correct: current.targetAnswerRomaji });

    if (examMode === 'endless_infinite') {
      setEndlessStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: isCorrect ? prev.streak + 1 : 0,
      }));
    }

    if (isCorrect) {
      playJapaneseAudio(current.targetAnswerKana || current.promptJp);
    }

    setTimeout(() => {
      setSec2Feedback(null);
      setIsChoiceRevealed(choiceRevealMode === 'instant');
      if (sec2Index + 1 < sec2Items.length) {
        setSec2Index((prev) => prev + 1);
      } else {
        // Reached the end of Section 2
        if (examMode === 'endless_infinite') {
          if (practiceScope === 'part2_only' || sec1Items.length === 0) {
            // Endless Continuous Loop: Reshuffle questions and loop seamlessly!
            let questionsPool = allExam2QuestionsPool.filter((q) => {
              if (activePreset.part2QuestionIds && activePreset.part2QuestionIds.length > 0) {
                return activePreset.part2QuestionIds.includes(q.id);
              }
              return activePreset.part2PatternIds.includes(q.patternId);
            });
            if (questionsPool.length === 0) questionsPool = [...allExam2QuestionsPool];
            const reshuffled = [...questionsPool].sort(() => 0.5 - Math.random());
            setSec2Items(reshuffled);
            setSec2Index(0);
            setLoopRound((prev) => prev + 1);
          } else {
            // Both mode: Loop back to reshuffled Section 1
            let vocabPool = exam2VocabList.filter((v) => activePreset.part1VocabIds.includes(v.id));
            if (vocabPool.length === 0) vocabPool = [...exam2VocabList];
            const reshuffledSec1 = [...vocabPool].sort(() => 0.5 - Math.random()).map((v) => {
              const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
              const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
              return { item: v, options: opts };
            });
            let questionsPool = allExam2QuestionsPool.filter((q) => activePreset.part2PatternIds.includes(q.patternId));
            if (questionsPool.length === 0) questionsPool = [...allExam2QuestionsPool];
            const reshuffledSec2 = [...questionsPool].sort(() => 0.5 - Math.random());

            setSec1Items(reshuffledSec1);
            setSec2Items(reshuffledSec2);
            setCurrentSection(1);
            setSec1Index(0);
            setLoopRound((prev) => prev + 1);
          }
        } else {
          handleFinishExam();
        }
      }
    }, 450);
  };

  const handleFinishExam = () => {
    setExamState('finished');
  };

  const scoreSec1 = sec1Answers.filter((a) => a.isCorrect).length;
  const scoreSec2 = sec2Answers.filter((a) => a.isCorrect).length;
  const totalScore = scoreSec1 + scoreSec2;
  const totalPossible = sec1Items.length + sec2Items.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Preset Editor Modal */}
      <Exam2PresetEditorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSave={handleSavePreset}
        editingPreset={editingPreset}
      />

      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">JN60101 การสอบครั้งที่ 2</span>
            <span className="badge badge-ref">บทที่ 3 และ 4 (15 คะแนนเต็ม)</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            {examMode === 'timed_3min' ? '⏱️ ห้องสอบจำลองจับเวลา 3:00 นาที (Mock Exam Simulator)' : '♾️ โหมดฝึกซ้อมไม่จำกัดเวลา (Endless Practice)'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '2px' }}>
            ส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น (5 คะแนน) + ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ (10 คะแนน)
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              const nextMode = choiceRevealMode === 'instant' ? 'hidden' : 'instant';
              setChoiceRevealMode(nextMode);
              setIsChoiceRevealed(nextMode === 'instant');
            }}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}
          >
            {choiceRevealMode === 'hidden' ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{choiceRevealMode === 'hidden' ? 'โหมดซ่อนชอยส์ (Active Recall)' : 'โหมดแสดงชอยส์ทันที'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRomaji(!showRomaji)}
            className="btn btn-secondary"
            style={{ fontSize: '12.5px' }}
          >
            {showRomaji ? 'ซ่อน Romaji' : 'แสดง Romaji'}
          </button>
        </div>
      </div>

      {/* 1. IDLE STATE: Endless Presets Table & Mode Configuration */}
      {examState === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Endless Configuration Card */}
          {examMode === 'endless_infinite' && (
            <div className="card" style={{ backgroundColor: 'var(--bg-surface)', padding: '24px' }}>
              {/* Ready Status Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="var(--color-success)" />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-success)' }}>
                      ระบบพร้อมเริ่มสุ่มโจทย์ฝึกทำทันที
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      เลือกพรีเซ็ตด้านล่าง แล้วคลิกปุ่มเริ่มฝึกซ้อมเพื่อเข้าสู่สนามสอบ
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--color-success)', fontWeight: 700 }}>
                  คะแนนปัจจุบัน: {endlessStats.correct} / {endlessStats.total}
                </div>
              </div>

              {/* Choice Visibility Mode Setting */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={15} color="var(--primary-600)" />
                  <span>รูปแบบการแสดงตัวเลือก (Active Recall vs Instant):</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setChoiceRevealMode('instant')}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: choiceRevealMode === 'instant' ? '2px solid var(--primary-600)' : '1px solid var(--border-strong)',
                      backgroundColor: choiceRevealMode === 'instant' ? 'var(--primary-50)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: choiceRevealMode === 'instant' ? 'var(--primary-700)' : 'var(--text-main)' }}>
                      <Eye size={15} /> แสดงชอยส์ทันที (Default)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      แสดงโจทย์พร้อมตัวเลือกคำตอบทันทีเมื่อเริ่มแต่ละข้อ
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChoiceRevealMode('hidden')}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: choiceRevealMode === 'hidden' ? '2px solid var(--color-success)' : '1px solid var(--border-strong)',
                      backgroundColor: choiceRevealMode === 'hidden' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: choiceRevealMode === 'hidden' ? 'var(--color-success)' : 'var(--text-main)' }}>
                      <EyeOff size={15} /> ซ่อนชอยส์ฝึกจำปากเปล่า (Active Recall)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      ซ่อนตัวเลือกไว้ก่อน เพื่อฝึกนึกคำศัพท์และตอบในใจก่อนคลิกเปิดดู
                    </div>
                  </button>
                </div>
              </div>

              {/* Practice Scope Selector (Part 1 vs Part 2 vs Both) */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SlidersHorizontal size={15} color="var(--primary-600)" />
                  <span>ขอบเขตส่วนข้อสอบที่ต้องการฝึก (Practice Section Scope):</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setPracticeScope('all')}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: practiceScope === 'all' ? '2px solid var(--primary-600)' : '1px solid var(--border-strong)',
                      backgroundColor: practiceScope === 'all' ? 'var(--primary-50)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: practiceScope === 'all' ? 'var(--primary-700)' : 'var(--text-main)' }}>
                      🌟 ทั้งสองส่วน (ครบ 15 คะแนน)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      ฝึกสุ่มคำศัพท์ส่วนที่ 1 แล้วต่อด้วยคำถาม 5 รูปแบบส่วนที่ 2
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPracticeScope('part1_only')}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: practiceScope === 'part1_only' ? '2px solid #8b5cf6' : '1px solid var(--border-strong)',
                      backgroundColor: practiceScope === 'part1_only' ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: practiceScope === 'part1_only' ? '#7c3aed' : 'var(--text-main)' }}>
                      📝 เฉพาะส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      ฝึกเฉพาะการแปลคำศัพท์บทที่ 3 และ 4 ตามคำศัพท์ที่เลือกในพรีเซ็ต
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPracticeScope('part2_only')}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: practiceScope === 'part2_only' ? '2px solid #0284c7' : '1px solid var(--border-strong)',
                      backgroundColor: practiceScope === 'part2_only' ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: practiceScope === 'part2_only' ? '#0284c7' : 'var(--text-main)' }}>
                      🎮 เฉพาะส่วนที่ 2: ตอบคำถาม 5 รูปแบบ
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      ฝึกเฉพาะคำถามสถานที่, เวลา, เบอร์โทร, ราคา, ช่วงเวลา
                    </div>
                  </button>
                </div>
              </div>

              {/* Question Quantity Setting */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                  จำนวนข้อที่ต้องการฝึกในแต่ละรอบ:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: '5 ข้อ', val: 5 },
                    { label: '10 ข้อ', val: 10 },
                    { label: '15 ข้อ (Mock เต็ม)', val: 15 },
                    { label: '20 ข้อ', val: 20 },
                    { label: '30 ข้อ', val: 30 },
                    { label: 'ไม่จำกัด (Endless)', val: 0 },
                  ].map((qty) => (
                    <button
                      key={qty.val}
                      type="button"
                      onClick={() => setQuestionQuantity(qty.val)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: questionQuantity === qty.val ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: questionQuantity === qty.val ? 'var(--primary-600)' : 'var(--bg-app)',
                        color: questionQuantity === qty.val ? '#ffffff' : 'var(--text-main)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {qty.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM PRESETS & VOCABULARY SELECTION TABLE (IDENTICAL TO EXAM 1) */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={16} color="var(--primary-600)" />
                      <span>เลือกคำศัพท์ / ข้อสอบที่ต้องการฝึก (Custom Practice Presets รอบที่ 2)</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      เลือกชุดคำศัพท์บทที่ 3-4 หรือเลือก 5 รูปแบบคำถามที่ต้องการเน้นฝึกซ้อม ระบบจะสุ่มเฉพาะรายการที่กำหนด
                    </p>
                  </div>

                  {/* CREATE NEW PRESET BUTTON */}
                  <button
                    type="button"
                    onClick={handleOpenCreatePreset}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-md)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Plus size={16} /> สร้างพรีเซ็ตใหม่
                  </button>
                </div>

                {/* PRESETS TABLE */}
                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    overflowX: 'auto',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '65px', textAlign: 'center' }}>
                          เลือกใช้
                        </th>
                        <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '100px' }}>
                          ประเภท
                        </th>
                        <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', minWidth: '220px' }}>
                          ชื่อชุดพรีเซ็ต
                        </th>
                        <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '110px', textAlign: 'center' }}>
                          คำศัพท์ส่วน 1
                        </th>
                        <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', minWidth: '220px' }}>
                          ส่วนที่ 2: 5 รูปแบบคำถาม
                        </th>
                        <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '90px', textAlign: 'center' }}>
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {presets.map((preset) => {
                        const isActive = activePresetId === preset.id;
                        const matchedVocabs = exam2VocabList.filter((v) => preset.part1VocabIds.includes(v.id));
                        const previewVocabs = matchedVocabs.slice(0, 3);
                        const remainingVocab = matchedVocabs.length - 3;

                        const patternNames: Record<number, string> = {
                          1: 'สถานที่',
                          2: 'บอกเวลา',
                          3: 'เบอร์โทร',
                          4: 'ป้ายราคา',
                          5: 'ช่วงเวลา',
                        };

                        return (
                          <tr
                            key={preset.id}
                            onClick={() => {
                              setActivePresetId(preset.id);
                              if (preset.part1VocabIds.length > 0 && preset.part2PatternIds.length === 0) {
                                setPracticeScope('part1_only');
                              } else if (preset.part1VocabIds.length === 0 && preset.part2PatternIds.length > 0) {
                                setPracticeScope('part2_only');
                              }
                            }}
                            style={{
                              borderBottom: '1px solid var(--border-subtle)',
                              backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            {/* Radio selector */}
                            <td style={{ padding: '14px 10px', verticalAlign: 'middle', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    border: isActive ? '5.5px solid var(--primary-600)' : '1.5px solid var(--border-strong)',
                                    backgroundColor: 'var(--bg-surface)',
                                    boxSizing: 'border-box',
                                  }}
                                />
                              </div>
                            </td>

                            {/* Type Badge */}
                            <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                              {preset.isCustom ? (
                                <span className="badge badge-ref" style={{ fontSize: '11px' }}>กำหนดเอง</span>
                              ) : (
                                <span className="badge badge-primary" style={{ fontSize: '11px' }}>ระบบ</span>
                              )}
                            </td>

                            {/* Preset Name */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <div style={{ fontWeight: 800, color: isActive ? 'var(--primary-700)' : 'var(--text-main)', fontSize: '13.5px' }}>
                                {preset.name}
                              </div>
                            </td>

                            {/* Part 1 Vocabs Count & Preview */}
                            <td style={{ padding: '14px 12px', verticalAlign: 'middle', textAlign: 'center' }}>
                              <div style={{ fontWeight: 700, color: 'var(--primary-600)', marginBottom: '4px' }}>
                                {matchedVocabs.length} คำ
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                                {previewVocabs.map((v) => (
                                  <span key={v.id} style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
                                    {v.word_romaji}
                                  </span>
                                ))}
                                {remainingVocab > 0 && (
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+{remainingVocab}</span>
                                )}
                              </div>
                            </td>

                            {/* Part 2 Patterns */}
                            <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {preset.part2PatternIds.map((pId) => (
                                  <span key={pId} className="badge badge-primary" style={{ fontSize: '10.5px' }}>
                                    {patternNames[pId] || `รูปแบบ ${pId}`}
                                  </span>
                                ))}
                                {preset.part2PatternIds.length === 0 && (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(เน้นเฉพาะคำศัพท์)</span>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 12px', verticalAlign: 'middle', textAlign: 'center' }}>
                              {preset.isCustom ? (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={(e) => handleOpenEditPreset(preset, e)}
                                    className="btn btn-secondary"
                                    style={{ padding: '5px 8px' }}
                                    title="แก้ไขพรีเซ็ต"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeletePreset(preset.id, e)}
                                    className="btn btn-secondary"
                                    style={{ padding: '5px 8px', color: 'var(--color-danger)' }}
                                    title="ลบพรีเซ็ต"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>พรีเซ็ตหลัก</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Start Endless Button */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleStartExam('endless_infinite')}
                  className="btn btn-primary"
                  style={{ padding: '14px 36px', fontSize: '15px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <InfinityIcon size={20} /> เริ่มฝึกซ้อมตามชุดที่เลือก ({activePreset.name})
                </button>
              </div>
            </div>
          )}

          {/* Timed Mode Card (When Mode is timed_3min) */}
          {examMode === 'timed_3min' && (
            <div
              className="card"
              style={{
                padding: '36px',
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--primary-600)',
                maxWidth: '680px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Timer size={32} color="var(--primary-600)" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>
                ห้องสอบจำลองจับเวลา 3:00 นาที (Mock Exam Simulator)
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                ข้อสอบ 15 ข้อเต็มตรงตามระเบียบการสอบจริง:
                <br />
                • <strong>ส่วนที่ 1 (5 ข้อ = 5 คะแนน):</strong> คำศัพท์ ไทย → ญี่ปุ่น
                <br />
                • <strong>ส่วนที่ 2 (10 ข้อ = 10 คะแนน):</strong> ตอบคำถาม 5 รูปแบบ รูปแบบละ 2 ข้อพอดี
              </p>

              <button
                type="button"
                onClick={() => handleStartExam('timed_3min')}
                className="btn btn-primary"
                style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Timer size={18} /> เข้าสู่ห้องสอบจำลองจับเวลา 3 นาที
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. RUNNING STATE: Live Questions Arena */}
      {examState === 'running' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Stats Bar */}
          <div
            className="card"
            style={{
              padding: '14px 20px',
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-primary">
                {currentSection === 1 ? 'ส่วนที่ 1: คำศัพท์' : 'ส่วนที่ 2: ตอบคำถาม'}
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: 700 }}>
                {examMode === 'endless_infinite'
                  ? currentSection === 1
                    ? `คำที่ ${sec1Index + 1} / ${sec1Items.length} (สุ่มทั้งหมด ${sec1Items.length} คำในพรีเซ็ต) • รอบที่ ${loopRound}`
                    : `ข้อที่ ${sec2Index + 1} / ${sec2Items.length} (สุ่มทั้งหมด ${sec2Items.length} ข้อในพรีเซ็ต) • รอบที่ ${loopRound}`
                  : currentSection === 1
                  ? `ข้อที่ ${sec1Index + 1} / ${sec1Items.length}`
                  : `ข้อที่ ${sec2Index + 1 + sec1Items.length} / ${sec1Items.length + sec2Items.length}`}
              </span>
              <span className="badge badge-ref" style={{ fontSize: '11px' }}>
                {activePreset.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {examMode === 'timed_3min' ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '16px',
                    fontWeight: 900,
                    color: timeLeftSeconds < 30 ? 'var(--color-danger)' : 'var(--primary-600)',
                  }}
                >
                  <Timer size={18} />
                  <span>
                    {Math.floor(timeLeftSeconds / 60)}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  {endlessStats.streak > 1 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)', fontWeight: 700 }}>
                      <Flame size={16} /> Streak x{endlessStats.streak}
                    </span>
                  )}
                  <span>ถูก {endlessStats.correct}/{endlessStats.total}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setExamState('idle')}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                ออกจากห้องสอบ
              </button>
            </div>
          </div>

          {/* Section 1 Card */}
          {currentSection === 1 && sec1Items[sec1Index] && (
            <div
              className="card"
              style={{
                padding: '36px 28px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center',
                maxWidth: '820px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
                อาจารย์ถามคำศัพท์ภาษาไทย (5 คะแนน):
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '30px',
                    fontWeight: 900,
                    color: 'var(--text-main)',
                    padding: '16px 28px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-app)',
                    display: 'inline-block',
                  }}
                >
                  "{sec1Items[sec1Index].item.meaning_th}"
                </div>

                <button
                  type="button"
                  onClick={() => playThaiAudio(sec1Items[sec1Index].item.meaning_th)}
                  className="btn btn-secondary"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  title="กดเพื่อฟังเสียงภาษาไทยซ้ำ"
                >
                  <Volume2 size={20} color="var(--primary-600)" />
                </button>
              </div>

              {/* Active Recall Toggle (If Hidden) */}
              {choiceRevealMode === 'hidden' && !isChoiceRevealed && !sec1Feedback && (
                <div style={{ margin: '10px 0 20px 0' }}>
                  <button
                    type="button"
                    onClick={() => setIsChoiceRevealed(true)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', fontSize: '13.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Eye size={16} /> นึกคำตอบในใจแล้ว คลิกเพื่อดูชอยส์
                  </button>
                </div>
              )}

              {/* Choices Grid */}
              {(isChoiceRevealed || sec1Feedback) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {sec1Items[sec1Index].options.map((opt) => {
                    const isSelected = sec1Feedback?.selected === opt.word_romaji;
                    const isCorrect = opt.word_romaji === sec1Items[sec1Index].item.word_romaji;

                    let btnBg = 'var(--bg-app)';
                    let btnBorder = '1.5px solid var(--border-subtle)';
                    let btnColor = 'var(--text-main)';

                    if (sec1Feedback) {
                      if (isCorrect) {
                        btnBg = 'rgba(16, 185, 129, 0.15)';
                        btnBorder = '2px solid var(--color-success)';
                        btnColor = 'var(--color-success)';
                      } else if (isSelected && !isCorrect) {
                        btnBg = 'rgba(239, 68, 68, 0.15)';
                        btnBorder = '2px solid var(--color-danger)';
                        btnColor = 'var(--color-danger)';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={!!sec1Feedback}
                        onClick={() => handleAnswerSec1(opt.word_romaji)}
                        style={{
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: btnBg,
                          border: btnBorder,
                          color: btnColor,
                          textAlign: 'left',
                          cursor: sec1Feedback ? 'default' : 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '18px', fontWeight: 800 }}>{opt.word_kana}</div>
                        {opt.word_kanji && (
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>{opt.word_kanji}</div>
                        )}
                        {showRomaji && (
                          <div style={{ fontSize: '13px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            {opt.word_romaji}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 2 Card */}
          {currentSection === 2 && sec2Items[sec2Index] && (
            <div
              className="card"
              style={{
                padding: '36px 28px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
                maxWidth: '860px',
                margin: '0 auto',
                width: '100%',
              }}
            >
              {/* Question Header & Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-primary">{sec2Items[sec2Index].patternTitle}</span>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{sec2Items[sec2Index].promptTh}</span>
              </div>

              {/* Japanese Question Prompt */}
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  padding: '18px 24px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <span>{sec2Items[sec2Index].promptJp}</span>
                <button
                  type="button"
                  onClick={() => playJapaneseAudio(sec2Items[sec2Index].promptJp)}
                  className="btn btn-secondary"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  title="ฟังเสียงคำถามภาษาญี่ปุ่น"
                >
                  <Volume2 size={18} color="var(--primary-600)" />
                </button>
              </div>

              {/* Active Recall Toggle (If Hidden) */}
              {choiceRevealMode === 'hidden' && !isChoiceRevealed && !sec2Feedback && (
                <div style={{ textAlign: 'center', margin: '10px 0 20px 0' }}>
                  <button
                    type="button"
                    onClick={() => setIsChoiceRevealed(true)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', fontSize: '13.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Eye size={16} /> นึกคำตอบในใจแล้ว คลิกเพื่อดูชอยส์
                  </button>
                </div>
              )}

              {/* Choices List */}
              {(isChoiceRevealed || sec2Feedback) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sec2Items[sec2Index].options.map((opt, idx) => {
                    const isSelected = sec2Feedback?.selected === opt.textRomaji;
                    const isCorrect = opt.isCorrect;

                    let btnBg = 'var(--bg-app)';
                    let btnBorder = '1.5px solid var(--border-subtle)';
                    let btnColor = 'var(--text-main)';

                    if (sec2Feedback) {
                      if (isCorrect) {
                        btnBg = 'rgba(16, 185, 129, 0.15)';
                        btnBorder = '2px solid var(--color-success)';
                        btnColor = 'var(--color-success)';
                      } else if (isSelected && !isCorrect) {
                        btnBg = 'rgba(239, 68, 68, 0.15)';
                        btnBorder = '2px solid var(--color-danger)';
                        btnColor = 'var(--color-danger)';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!!sec2Feedback}
                        onClick={() => handleAnswerSec2(idx)}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: btnBg,
                          border: btnBorder,
                          color: btnColor,
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: sec2Feedback ? 'default' : 'pointer',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '15.5px', fontWeight: 800 }}>{opt.textKana}</div>
                          {showRomaji && (
                            <div style={{ fontSize: '13px', color: 'var(--primary-600)', fontWeight: 600, marginTop: '2px' }}>
                              {opt.textRomaji}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                          {opt.meaningTh}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation Note */}
              {sec2Feedback && (
                <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  💡 {sec2Items[sec2Index].explanationTh}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. FINISHED STATE: Score Summary */}
      {examState === 'finished' && (
        <div className="card" style={{ maxWidth: '640px', margin: '20px auto', padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Award size={36} color="var(--primary-600)" />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>
            สรุปผลคะแนนการสอบรอบที่ 2
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px' }}>
            ชุดข้อสอบ: <strong>{activePreset.name}</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: sec1Items.length > 0 && sec2Items.length > 0 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {sec1Items.length > 0 && (
              <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-app)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ส่วนที่ 1 (คำศัพท์ ไทย → ญี่ปุ่น)</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary-600)', marginTop: '4px' }}>
                  {scoreSec1} / {sec1Items.length}
                </div>
              </div>
            )}

            {sec2Items.length > 0 && (
              <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-app)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ส่วนที่ 2 (ตอบคำถาม 5 รูปแบบ)</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--indigo-600)', marginTop: '4px' }}>
                  {scoreSec2} / {sec2Items.length}
                </div>
              </div>
            )}

            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: totalScore === totalPossible ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>คะแนนรวมที่ได้</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: totalScore === totalPossible ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px' }}>
                {totalScore} / {totalPossible} ({Math.round((totalScore / Math.max(1, totalPossible)) * 100)}%)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleStartExam(examMode)}
              className="btn btn-primary"
              style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} /> ทำการสอบอีกครั้ง
            </button>
            <button
              type="button"
              onClick={() => setExamState('idle')}
              className="btn btn-secondary"
              style={{ padding: '12px 20px' }}
            >
              เปลี่ยนโหมด / พรีเซ็ต
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
