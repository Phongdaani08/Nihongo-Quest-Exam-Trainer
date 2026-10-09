import React, { useState, useEffect } from 'react';
import {
  Timer,
  Infinity as InfinityIcon,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
  Clock,
  Phone,
  Tag,
  Calendar
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

interface Exam2MockProps {
  initialMode?: 'timed_3min' | 'endless_infinite';
}

export const Exam2MockSimulator: React.FC<Exam2MockProps> = ({ initialMode = 'timed_3min' }) => {
  const [examMode, setExamMode] = useState<'timed_3min' | 'endless_infinite'>(initialMode);
  const [examState, setExamState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(180); // 3:00 minutes
  const [currentSection, setCurrentSection] = useState<1 | 2>(1);

  // Section 1: 5 Vocab Words (Thai -> Japanese)
  const [sec1Items, setSec1Items] = useState<{ item: Vocabulary; options: Vocabulary[] }[]>([]);
  const [sec1Index, setSec1Index] = useState<number>(0);
  const [sec1Answers, setSec1Answers] = useState<{ isCorrect: boolean; response: string; expected: string }[]>([]);
  const [sec1Feedback, setSec1Feedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);

  // Section 2: 10 Questions (5 Patterns x 2 Questions each)
  const [sec2Items, setSec2Items] = useState<Exam2QuestionItem[]>([]);
  const [sec2Index, setSec2Index] = useState<number>(0);
  const [sec2Answers, setSec2Answers] = useState<{ isCorrect: boolean; response: string; expected: string }[]>([]);
  const [sec2Feedback, setSec2Feedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);

  // Choice reveal toggle
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(true);

  // Endless pattern filter
  const [selectedPatternFilter, setSelectedPatternFilter] = useState<number>(0); // 0 = all

  // Endless statistics
  const [endlessStats, setEndlessStats] = useState<{ correct: number; total: number; streak: number }>({
    correct: 0,
    total: 0,
    streak: 0
  });

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

    // Section 1: Pick 5 random Chapter 3 & 4 vocabularies
    const shuffledVocab = [...exam2VocabList].sort(() => 0.5 - Math.random());
    const picked5Vocab = shuffledVocab.slice(0, mode === 'endless_infinite' ? 50 : 5).map((v) => {
      const distractors = exam2VocabList.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
      return { item: v, options: opts };
    });

    // Section 2: In Timed Mode, pick strictly 2 questions from each of the 5 Patterns (10 questions total)
    let picked10Questions: Exam2QuestionItem[] = [];
    if (mode === 'timed_3min') {
      const p1 = [...exam2LocationQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p2 = [...exam2ClockQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p3 = [...exam2PhoneQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p4 = [...exam2PriceQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      const p5 = [...exam2ScheduleQuestions].sort(() => 0.5 - Math.random()).slice(0, 2);
      picked10Questions = [...p1, ...p2, ...p3, ...p4, ...p5];
    } else {
      let pool = allExam2QuestionsPool;
      if (selectedPatternFilter > 0) {
        pool = allExam2QuestionsPool.filter(q => q.patternId === selectedPatternFilter);
      }
      picked10Questions = [...pool].sort(() => 0.5 - Math.random());
    }

    setSec1Items(picked5Vocab);
    setSec1Index(0);
    setSec1Answers([]);
    setSec1Feedback(null);

    setSec2Items(picked10Questions);
    setSec2Index(0);
    setSec2Answers([]);
    setSec2Feedback(null);

    setTimeLeftSeconds(180);
    setCurrentSection(1);
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
      setEndlessStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: isCorrect ? prev.streak + 1 : 0
      }));
    }

    if (isCorrect) {
      playJapaneseAudio(current.item.word_romaji);
    }

    setTimeout(() => {
      setSec1Feedback(null);
      if (sec1Index + 1 < sec1Items.length) {
        setSec1Index(prev => prev + 1);
      } else {
        // Move to Section 2
        setCurrentSection(2);
      }
    }, 900);
  };

  const handleAnswerSec2 = (selectedRomaji: string) => {
    if (sec2Feedback) return;
    const current = sec2Items[sec2Index];
    const isCorrect = selectedRomaji === current.targetAnswerRomaji;
    const newAnswers = [...sec2Answers, { isCorrect, response: selectedRomaji, expected: current.targetAnswerRomaji }];
    setSec2Answers(newAnswers);
    setSec2Feedback({ isCorrect, selected: selectedRomaji, correct: current.targetAnswerRomaji });

    if (examMode === 'endless_infinite') {
      setEndlessStats(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: isCorrect ? prev.streak + 1 : 0
      }));
    }

    if (isCorrect) {
      playJapaneseAudio(current.targetAnswerRomaji);
    }

    setTimeout(() => {
      setSec2Feedback(null);
      if (sec2Index + 1 < sec2Items.length) {
        setSec2Index(prev => prev + 1);
      } else {
        handleFinishExam();
      }
    }, 1100);
  };

  const handleFinishExam = () => {
    setExamState('finished');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const score1 = sec1Answers.filter(a => a.isCorrect).length;
  const score2 = sec2Answers.filter(a => a.isCorrect).length;
  const totalScore = score1 + score2;
  const isPassed = totalScore >= 12;

  // Render Pattern Icon
  const renderPatternBadge = (patternId: number) => {
    switch (patternId) {
      case 1: return <span className="badge badge-primary"><Building2 size={12} /> 1. สถานที่ (Koko wa doko)</span>;
      case 2: return <span className="badge badge-primary"><Clock size={12} /> 2. บอกเวลา (Ima nan ji)</span>;
      case 3: return <span className="badge badge-primary"><Phone size={12} /> 3. เบอร์โทร (Denwa bangō)</span>;
      case 4: return <span className="badge badge-primary"><Tag size={12} /> 4. ป้ายราคา (Ikura desuka)</span>;
      case 5: return <span className="badge badge-primary"><Calendar size={12} /> 5. ช่วงเวลา (Kara...made)</span>;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">การสอบครั้งที่ 2 (บทที่ 3-4)</span>
            <span className="badge badge-ref">คะแนนเต็ม 15 คะแนน</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {examMode === 'timed_3min' ? '⏱️ สอบจริงจำลองจับเวลา (3:00 นาที)' : '♾️ โหมดฝึกฝนไม่จำกัดเวลา (Endless Mode)'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            ส่วนที่ 1: แปลคำศัพท์บทที่ 3-4 (5 คะแนน) + ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ (10 คะแนน)
          </p>
        </div>

        {examState === 'running' && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setIsChoiceRevealed(prev => !prev)}
              className="btn-outline"
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              {isChoiceRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
              {isChoiceRevealed ? 'ซ่อนตัวเลือก (Flashcard)' : 'เปิดดูตัวเลือก'}
            </button>

            {examMode === 'timed_3min' ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: timeLeftSeconds <= 30 ? 'var(--danger-50)' : 'var(--bg-subtle)',
                border: timeLeftSeconds <= 30 ? '2px solid var(--danger-border)' : '1px solid var(--border-strong)',
                color: timeLeftSeconds <= 30 ? 'var(--danger-600)' : 'var(--text-main)',
                fontWeight: 800,
                fontSize: '16px'
              }}>
                <Timer size={18} className={timeLeftSeconds <= 30 ? 'animate-pulse' : ''} />
                {formatTimer(timeLeftSeconds)}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-strong)',
                fontSize: '13px',
                fontWeight: 700
              }}>
                <InfinityIcon size={16} color="var(--primary-600)" />
                ถูก: {endlessStats.correct}/{endlessStats.total} (Streak: {endlessStats.streak} 🔥)
              </div>
            )}
          </div>
        )}
      </div>

      {/* IDLE STATE */}
      {examState === 'idle' && (
        <div className="card" style={{ padding: '40px 32px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid var(--primary-200)'
          }}>
            <ShieldCheck size={36} color="var(--primary-600)" />
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
            ระบบจำลองการสอบรอบที่ 2 (JN60101 บทที่ 3 - 4)
          </h3>
          <p style={{ maxWidth: '640px', margin: '0 auto 28px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            การสอบประกอบด้วย <strong>คำศัพท์ 5 ข้อ</strong> (ไทย → ญี่ปุ่น) และ <strong>ตอบคำถาม 10 ข้อ</strong> (5 รูปแบบคำถามอย่างละ 2 ข้อ ครบถ้วนตามเกณฑ์อาจารย์)
          </p>

          {/* Quick Pattern Filter for Endless */}
          {examMode === 'endless_infinite' && (
            <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>เลือกเฉพาะหมวดคำถามที่ต้องการฝึกซ้ำ:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => setSelectedPatternFilter(0)}
                  className={selectedPatternFilter === 0 ? 'btn-primary' : 'btn-outline'}
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  ทั้งหมด (All 5 Patterns)
                </button>
                {[
                  { id: 1, name: '1. สถานที่' },
                  { id: 2, name: '2. บอกเวลา' },
                  { id: 3, name: '3. เบอร์โทร' },
                  { id: 4, name: '4. ป้ายราคา' },
                  { id: 5, name: '5. ช่วงเวลา' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatternFilter(p.id)}
                    className={selectedPatternFilter === p.id ? 'btn-primary' : 'btn-outline'}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              onClick={() => handleStartExam('timed_3min')}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              <Timer size={18} /> เริ่มสอบจำลอง 3 นาที (15 คะแนน)
            </button>
            <button
              onClick={() => handleStartExam('endless_infinite')}
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '15px' }}
            >
              <InfinityIcon size={18} /> โหมดฝึกซ้อมไม่จำกัดเวลา
            </button>
          </div>
        </div>
      )}

      {/* RUNNING STATE */}
      {examState === 'running' && (
        <div>
          {/* Section 1: Vocab Flash Translation */}
          {currentSection === 1 && sec1Items[sec1Index] && (
            <div className="card" style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span className="badge badge-primary">
                  ส่วนที่ 1: แปลคำศัพท์บทที่ 3-4 (ข้อที่ {sec1Index + 1} / {sec1Items.length})
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ความก้าวหน้า: {sec1Answers.length} / {sec1Items.length} คำ
                </span>
              </div>

              <div style={{
                padding: '28px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-strong)',
                marginBottom: '28px'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>แปลคำศัพท์ภาษาไทยเป็นภาษาญี่ปุ่น:</span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>
                  "{sec1Items[sec1Index].item.meaning_th}"
                </div>
              </div>

              {/* Choices */}
              {!isChoiceRevealed && !sec1Feedback ? (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-strong)' }}>
                  <EyeOff size={28} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>นึกคำศัพท์ในใจแล้วกดดูชอยส์</p>
                  <button onClick={() => setIsChoiceRevealed(true)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }}>
                    เปิดดูชอยส์
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {sec1Items[sec1Index].options.map((opt, idx) => {
                    const isSelected = sec1Feedback && sec1Feedback.selected === opt.word_romaji;
                    const isCorrect = sec1Feedback && opt.word_romaji === sec1Items[sec1Index].item.word_romaji;
                    const isWrong = sec1Feedback && isSelected && !isCorrect;

                    let borderColor = 'var(--border-subtle)';
                    let bgColor = 'var(--bg-surface)';
                    if (isCorrect) {
                      borderColor = 'var(--success-border)';
                      bgColor = 'var(--success-50)';
                    } else if (isWrong) {
                      borderColor = 'var(--danger-border)';
                      bgColor = 'var(--danger-50)';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSec1(opt.word_romaji)}
                        disabled={!!sec1Feedback}
                        style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${borderColor}`,
                          backgroundColor: bgColor,
                          fontSize: '16px',
                          fontWeight: 700,
                          cursor: sec1Feedback ? 'default' : 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>{opt.word_romaji}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                          {opt.word_kana}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 2: 10 Questions 5 Patterns */}
          {currentSection === 2 && sec2Items[sec2Index] && (
            <div className="card" style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge badge-primary">
                    ส่วนที่ 2: ตอบคำถาม (ข้อที่ {sec2Index + 1} / {sec2Items.length})
                  </span>
                  {renderPatternBadge(sec2Items[sec2Index].patternId)}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ความก้าวหน้า: {sec2Answers.length} / {sec2Items.length} ข้อ
                </span>
              </div>

              {/* Prompt Canvas */}
              <div style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-strong)',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>อาจารย์ถามว่า:</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  "{sec2Items[sec2Index].promptJp}"
                </div>
                <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: 700, marginTop: '4px' }}>
                  ({sec2Items[sec2Index].promptTh})
                </div>
              </div>

              {/* Choices */}
              {!isChoiceRevealed && !sec2Feedback ? (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-strong)' }}>
                  <EyeOff size={28} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>นึกประโยคคำตอบในใจแล้วกดดูชอยส์</p>
                  <button onClick={() => setIsChoiceRevealed(true)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '12px' }}>
                    เปิดดูชอยส์
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sec2Items[sec2Index].options.map((opt, idx) => {
                    const isSelected = sec2Feedback && sec2Feedback.selected === opt.textRomaji;
                    const isCorrect = sec2Feedback && opt.isCorrect;
                    const isWrong = sec2Feedback && isSelected && !opt.isCorrect;

                    let borderColor = 'var(--border-subtle)';
                    let bgColor = 'var(--bg-surface)';
                    if (isCorrect) {
                      borderColor = 'var(--success-border)';
                      bgColor = 'var(--success-50)';
                    } else if (isWrong) {
                      borderColor = 'var(--danger-border)';
                      bgColor = 'var(--danger-50)';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSec2(opt.textRomaji)}
                        disabled={!!sec2Feedback}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${borderColor}`,
                          backgroundColor: bgColor,
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: sec2Feedback ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {opt.textRomaji}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {opt.textKana} ({opt.meaningTh})
                          </div>
                        </div>

                        {isCorrect && <CheckCircle2 size={20} color="var(--success-600)" />}
                        {isWrong && <XCircle size={20} color="var(--danger-600)" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FINISHED SUMMARY STATE */}
      {examState === 'finished' && (
        <div className="card" style={{ padding: '40px 32px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: isPassed ? 'var(--success-50)' : 'var(--danger-50)',
            border: `2px solid ${isPassed ? 'var(--success-border)' : 'var(--danger-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            {isPassed ? (
              <CheckCircle2 size={44} color="var(--success-600)" />
            ) : (
              <AlertCircle size={44} color="var(--danger-600)" />
            )}
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
            {isPassed ? '🎉 ยินดีด้วย! ผ่านเกณฑ์การสอบรอบที่ 2' : '💪 ยังไม่ผ่านเกณฑ์ พยายามใหม่อีกนิดครับ!'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            คะแนนรวมของคุณคือ <strong style={{ fontSize: '22px', color: isPassed ? 'var(--success-600)' : 'var(--danger-600)' }}>{totalScore}</strong> / 15 คะแนน
          </p>

          {/* Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '600px', margin: '0 auto 28px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ส่วนที่ 1: แปลคำศัพท์</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {score1} / 5
              </div>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {score2} / 10
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => handleStartExam(examMode)} className="btn-primary" style={{ padding: '12px 24px' }}>
              <RotateCcw size={16} /> ทำข้อสอบใหม่อีกรอบ
            </button>
            <button onClick={() => setExamState('idle')} className="btn-outline" style={{ padding: '12px 20px' }}>
              กลับสู่หน้าหลักการสอบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
