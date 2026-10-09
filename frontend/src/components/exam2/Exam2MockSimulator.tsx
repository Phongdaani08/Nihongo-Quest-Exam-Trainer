import React, { useState, useEffect, useMemo } from 'react';
import {
  Timer,
  Infinity as InfinityIcon,
  RotateCcw,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';
import { playJapaneseAudio } from '../../utils/speech';
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
  Exam2PresetManagerModal
} from './Exam2CustomPresetManagerModal';

interface Exam2MockProps {
  initialMode?: 'timed_3min' | 'endless_infinite';
}

export const Exam2MockSimulator: React.FC<Exam2MockProps> = ({ initialMode = 'timed_3min' }) => {
  const [examMode, setExamMode] = useState<'timed_3min' | 'endless_infinite'>(initialMode);
  const [examState, setExamState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(180); // 3:00 minutes
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);

  // Custom Presets State & LocalStorage
  const [customPresets, setCustomPresets] = useState<Exam2PracticePreset[]>(() => {
    try {
      const saved = localStorage.getItem('nihongo_exam2_custom_presets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [activePresetId, setActivePresetId] = useState<string>('preset_e2_all');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);

  // Question Quantity for Endless Mode: 5, 10, 15, 20, 30, or 0 (Endless)
  const [questionQuantity, setQuestionQuantity] = useState<number>(15);

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
  const [choiceRevealMode, setChoiceRevealMode] = useState<'instant' | 'hidden'>('instant');
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(true);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);

  // Endless statistics
  const [endlessStats, setEndlessStats] = useState<{ correct: number; total: number; streak: number }>({
    correct: 0,
    total: 0,
    streak: 0,
  });

  const allPresets = useMemo(() => [...defaultExam2Presets, ...customPresets], [customPresets]);
  const activePreset = useMemo(() => {
    return allPresets.find((p) => p.id === activePresetId) || defaultExam2Presets[0];
  }, [allPresets, activePresetId]);

  const handleSaveCustomPresets = (updated: Exam2PracticePreset[]) => {
    setCustomPresets(updated);
    try {
      localStorage.setItem('nihongo_exam2_custom_presets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
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

    // Filter Vocabularies based on active preset
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

    // Section 1 generation
    let sec1Count = 5;
    if (mode === 'endless_infinite') {
      if (activePreset.part2PatternIds.length === 0 && activePreset.part2QuestionIds?.length === 0) {
        sec1Count = questionQuantity === 0 ? 50 : questionQuantity;
      } else if (vocabPool.length > 0) {
        sec1Count = questionQuantity === 0 ? 30 : Math.ceil(questionQuantity / 3);
      } else {
        sec1Count = 0;
      }
    }

    const shuffledVocab = [...vocabPool].sort(() => 0.5 - Math.random());
    const pickedSec1 = shuffledVocab.slice(0, sec1Count).map((v) => {
      const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
      return { item: v, options: opts };
    });

    // Section 2 generation
    let pickedSec2: Exam2QuestionItem[] = [];
    if (mode === 'timed_3min') {
      // Strictly 2 questions from each of 5 Patterns = 10 questions
      const p1 = [...exam2LocationQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p2 = [...exam2ClockQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p3 = [...exam2PhoneQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p4 = [...exam2PriceQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p5 = [...exam2ScheduleQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      pickedSec2 = [...p1, ...p2, ...p3, ...p4, ...p5];
    } else {
      let sec2Count = questionQuantity === 0 ? questionsPool.length : Math.max(1, questionQuantity - pickedSec1.length);
      pickedSec2 = [...questionsPool].sort(() => 0.5 - Math.random()).slice(0, sec2Count);
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
      playJapaneseAudio(current.item.word_romaji);
    }

    setTimeout(() => {
      setSec1Feedback(null);
      setIsChoiceRevealed(choiceRevealMode === 'instant');
      if (sec1Index + 1 < sec1Items.length) {
        setSec1Index((prev) => prev + 1);
      } else {
        if (sec2Items.length > 0) {
          setCurrentSection(2);
        } else {
          handleFinishExam();
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
      playJapaneseAudio(current.targetAnswerRomaji);
    }

    setTimeout(() => {
      setSec2Feedback(null);
      setIsChoiceRevealed(choiceRevealMode === 'instant');
      if (sec2Index + 1 < sec2Items.length) {
        setSec2Index((prev) => prev + 1);
      } else {
        handleFinishExam();
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
      {/* Preset Manager Modal */}
      <Exam2PresetManagerModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        activePresetId={activePresetId}
        onSelectPreset={(id) => setActivePresetId(id)}
        customPresets={customPresets}
        onSaveCustomPresets={handleSaveCustomPresets}
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

      {/* 1. IDLE STATE: Mode & Preset Configuration */}
      {examState === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Preset & Filters Bar (Endless Mode) */}
          {examMode === 'endless_infinite' && (
            <div className="card" style={{ backgroundColor: 'var(--bg-surface)', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={18} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                    เลือกชุดฝึกซ้อม (Practice Preset) & กำหนดจำนวนข้อ
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <SlidersHorizontal size={14} /> จัดการชุดฝึกซ้อม (Preset Manager)
                </button>
              </div>

              {/* Preset Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {allPresets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActivePresetId(preset.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isActive ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: isActive ? 'var(--primary-50)' : 'var(--bg-app)',
                        color: isActive ? 'var(--primary-700)' : 'var(--text-main)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>

              {/* Question Quantity Picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>จำนวนข้อที่ต้องการฝึก:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { label: '5 ข้อ', val: 5 },
                    { label: '10 ข้อ', val: 10 },
                    { label: '15 ข้อ (Mock)', val: 15 },
                    { label: '20 ข้อ', val: 20 },
                    { label: '30 ข้อ', val: 30 },
                    { label: 'ไม่จำกัด (Endless)', val: 0 },
                  ].map((qty) => (
                    <button
                      key={qty.val}
                      type="button"
                      onClick={() => setQuestionQuantity(qty.val)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: questionQuantity === qty.val ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: questionQuantity === qty.val ? 'var(--primary-600)' : 'var(--bg-app)',
                        color: questionQuantity === qty.val ? '#ffffff' : 'var(--text-main)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {qty.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mode Selector Hero */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Timed Mode Card */}
            <div
              className="card"
              style={{
                padding: '32px',
                backgroundColor: 'var(--bg-surface)',
                border: examMode === 'timed_3min' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Timer size={28} color="var(--primary-600)" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                  โหมดสอบจริงจับเวลา (Timed 3 Mins)
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                  จำลองการสอบ 15 ข้อ จับเวลานับถอยหลัง 3:00 นาที (180 วินาที) ข้อสอบสุ่มตรงตามสัดส่วนข้อสอบจริง (ส่วน 1 = 5 ข้อ, ส่วน 2 = 10 ข้อ)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '20px' }}>
                  <div>• ส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น (5 ข้อ)</div>
                  <div>• ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ x 2 ข้อ (10 ข้อ)</div>
                  <div>• ตัวจับเวลานับถอยหลัง 180 วินาที</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartExam('timed_3min')}
                className="btn btn-primary"
                style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Timer size={18} /> เริ่มสอบจริงจับเวลา (15 ข้อ / 3 นาที)
              </button>
            </div>

            {/* Endless Mode Card */}
            <div
              className="card"
              style={{
                padding: '32px',
                backgroundColor: 'var(--bg-surface)',
                border: examMode === 'endless_infinite' ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--indigo-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <InfinityIcon size={28} color="#6366f1" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                  โหมดฝึกซ้อมไม่จำกัดเวลา (Endless Practice)
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                  ฝึกทำซ้ำจนคล่องแคล่วโดยไม่มีตัวจับเวลากดดัน สามารถเลือกพรีเซ็ตเฉพาะเรื่องที่อยากเน้น เช่น สถานที่, เวลา, เบอร์โทร หรือ ป้ายราคา
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '20px' }}>
                  <div>• พรีเซ็ตที่เลือก: <strong>{activePreset.name}</strong></div>
                  <div>• จำนวนข้อ: <strong>{questionQuantity === 0 ? 'ไม่จำกัด (Endless)' : `${questionQuantity} ข้อ`}</strong></div>
                  <div>• ระบบ Streak สะสมความถูกต้องต่อเนื่อง</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartExam('endless_infinite')}
                className="btn btn-secondary"
                style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <InfinityIcon size={18} /> เริ่มฝึกซ้อมตามพรีเซ็ตที่เลือก
              </button>
            </div>
          </div>
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
                {currentSection === 1
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
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                อาจารย์ถามคำศัพท์ภาษาไทย (5 คะแนน):
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  padding: '16px 24px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  display: 'inline-block',
                  marginBottom: '24px',
                }}
              >
                "{sec1Items[sec1Index].item.meaning_th}"
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
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                {sec2Items[sec2Index].promptJp}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-app)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ส่วนที่ 1 (คำศัพท์)</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary-600)', marginTop: '4px' }}>
                {scoreSec1} / {sec1Items.length}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-app)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ส่วนที่ 2 (5 รูปแบบ)</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--indigo-600)', marginTop: '4px' }}>
                {scoreSec2} / {sec2Items.length}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', backgroundColor: totalScore >= 12 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>คะแนนรวม</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: totalScore >= 12 ? 'var(--color-success)' : 'var(--color-danger)', marginTop: '4px' }}>
                {totalScore} / {totalPossible}
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
