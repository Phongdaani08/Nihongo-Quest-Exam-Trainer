import React, { useState, useEffect } from 'react';
import { Timer, Infinity as InfinityIcon, CheckCircle2, ArrowRight, RotateCcw, Award, AlertCircle, Volume2 } from 'lucide-react';
import { playJapaneseAudio, playThaiAudio } from '../utils/speech';
import { fallbackVocabs, submitExamResult } from '../services/api';
import { allSection3Pool, VisualQuestionItem } from './VisualQAArena';

interface MockExamProps {
  initialMode?: 'timed_3min' | 'endless_infinite';
}

export const MockExamSimulator: React.FC<MockExamProps> = ({ initialMode = 'timed_3min' }) => {
  const [examMode, setExamMode] = useState<'timed_3min' | 'endless_infinite'>(initialMode);
  const [examState, setExamState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(180); // 3:00 minutes
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3>(1);

  // Section 1 State: Word Assembly Tokens
  const [selectedHobby] = useState<'manga' | 'dokusho' | 'eiga'>('manga');
  const [sec1Step, setSec1Step] = useState<number>(1);
  const [sec1Assembled, setSec1Assembled] = useState<Record<number, string[]>>({ 1: [], 2: [], 3: [], 4: [], 5: [] });
  const [sec1Done, setSec1Done] = useState<Record<number, boolean>>({ 1: false, 2: false, 3: false, 4: false, 5: false });
  const [sec1WrongAttempt, setSec1WrongAttempt] = useState<boolean>(false);

  // Section 2 State (Flash Vocab)
  const [sec2Items, setSec2Items] = useState<any[]>([]);
  const [sec2CurrentIndex, setSec2CurrentIndex] = useState<number>(0);
  const [sec2Answers, setSec2Answers] = useState<{ isCorrect: boolean; response: string; expected: string }[]>([]);
  const [sec2Feedback, setSec2Feedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);

  // Section 3 State (Visual Q&A)
  const [sec3Items, setSec3Items] = useState<VisualQuestionItem[]>([]);
  const [sec3CurrentIndex, setSec3CurrentIndex] = useState<number>(0);
  const [sec3Answers, setSec3Answers] = useState<{ isCorrect: boolean; response: string; expected: string }[]>([]);
  const [sec3Feedback, setSec3Feedback] = useState<{ isCorrect: boolean; selected: string; correct: string } | null>(null);

  // Endless Mode Statistics
  const [endlessStats, setEndlessStats] = useState<{ correct: number; total: number; streak: number }>({
    correct: 0,
    total: 0,
    streak: 0,
  });

  // Final Report for Timed Mode
  const [finalReport, setFinalReport] = useState<any>(null);

  // Countdown Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (examMode === 'timed_3min' && examState === 'running' && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            handleFinishTimedExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examMode, examState, timeLeftSeconds]);

  const sec1TokensConfig: Record<number, { title: string; romaji: string; tokens: string[] }> = {
    1: { title: '1. คำทักทาย', romaji: 'Hajimemashite.', tokens: ['Hajime', 'mashite'] },
    2: { title: '2. บอกชื่อ', romaji: 'Watashi wa Poom desu.', tokens: ['Watashi', 'wa', 'Poom', 'desu'] },
    3: { title: '3. สังกัด', romaji: 'Panyapiwatto keiei daigaku no gakusei desu.', tokens: ['Panyapiwatto', 'keiei daigaku', 'no', 'gakusei', 'desu'] },
    4: { title: '4. งานอดิเรก', romaji: `Shumi wa ${selectedHobby} desu.`, tokens: ['Shumi', 'wa', selectedHobby, 'desu'] },
    5: { title: '5. ปิดท้าย', romaji: 'Dōzo yoroshiku onegai itashimasu.', tokens: ['Dōzo', 'yoroshiku', 'onegai', 'itashimasu'] },
  };

  const handleStartExam = (mode: 'timed_3min' | 'endless_infinite' = examMode) => {
    setExamMode(mode);
    // Shuffle 5 random vocab for Section 2
    const shuffledVocab = [...fallbackVocabs].sort(() => 0.5 - Math.random());
    const picked5Vocab = shuffledVocab.slice(0, mode === 'endless_infinite' ? 50 : 5).map((v) => {
      const distractors = fallbackVocabs.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
      return { item: v, options: opts };
    });

    // Pick 1 of each of the 5 types for Section 3
    const shuffledSec3: VisualQuestionItem[] = [
      ...allSection3Pool.filter((q) => q.typeId === 1).sort(() => 0.5 - Math.random()).slice(0, mode === 'endless_infinite' ? 10 : 1),
      ...allSection3Pool.filter((q) => q.typeId === 2).sort(() => 0.5 - Math.random()).slice(0, mode === 'endless_infinite' ? 4 : 1),
      ...allSection3Pool.filter((q) => q.typeId === 3).sort(() => 0.5 - Math.random()).slice(0, mode === 'endless_infinite' ? 7 : 1),
      ...allSection3Pool.filter((q) => q.typeId === 4).sort(() => 0.5 - Math.random()).slice(0, mode === 'endless_infinite' ? 4 : 1),
      ...allSection3Pool.filter((q) => q.typeId === 5).sort(() => 0.5 - Math.random()).slice(0, mode === 'endless_infinite' ? 4 : 1),
    ].sort(() => 0.5 - Math.random());

    setSec2Items(picked5Vocab);
    setSec2CurrentIndex(0);
    setSec2Answers([]);
    setSec2Feedback(null);
    setSec3Items(shuffledSec3);
    setSec3CurrentIndex(0);
    setSec3Answers([]);
    setSec3Feedback(null);
    setSec1Assembled({ 1: [], 2: [], 3: [], 4: [], 5: [] });
    setSec1Done({ 1: false, 2: false, 3: false, 4: false, 5: false });
    setSec1WrongAttempt(false);
    setSec1Step(1);
    setTimeLeftSeconds(180);
    setCurrentSection(1);
    setExamState('running');
  };

  // Section 1 Token Add/Remove
  const handleAddTokenSec1 = (token: string) => {
    const current = sec1Assembled[sec1Step] || [];
    const updated = [...current, token];
    setSec1Assembled({ ...sec1Assembled, [sec1Step]: updated });
    setSec1WrongAttempt(false);

    const target = sec1TokensConfig[sec1Step].tokens.join(' ').toLowerCase();
    if (updated.join(' ').toLowerCase() === target) {
      setSec1Done({ ...sec1Done, [sec1Step]: true });
      playJapaneseAudio(sec1TokensConfig[sec1Step].romaji);
      if (sec1Step < 5) {
        setTimeout(() => setSec1Step((s) => s + 1), 600);
      }
    } else if (updated.length >= sec1TokensConfig[sec1Step].tokens.length) {
      // Wrong full sentence length
      setSec1WrongAttempt(true);
    }
  };

  const handleRemoveTokenSec1 = (idx: number) => {
    const current = sec1Assembled[sec1Step] || [];
    const updated = current.filter((_, i) => i !== idx);
    setSec1Assembled({ ...sec1Assembled, [sec1Step]: updated });
    setSec1Done({ ...sec1Done, [sec1Step]: false });
    setSec1WrongAttempt(false);
  };

  // Section 2 Answer
  const handleAnswerSec2 = (selectedRomaji: string) => {
    if (sec2Feedback) return;
    const current = sec2Items[sec2CurrentIndex];
    const isCorrect = selectedRomaji === current.item.word_romaji;
    const newAnswers = [...sec2Answers, { isCorrect, response: selectedRomaji, expected: current.item.word_romaji }];
    setSec2Answers(newAnswers);
    setSec2Feedback({ isCorrect, selected: selectedRomaji, correct: current.item.word_romaji });

    if (isCorrect) {
      playJapaneseAudio(current.item.word_kana);
      setEndlessStats((prev) => ({ correct: prev.correct + 1, total: prev.total + 1, streak: prev.streak + 1 }));
    } else {
      setEndlessStats((prev) => ({ ...prev, total: prev.total + 1, streak: 0 }));
      setTimeout(() => playJapaneseAudio(current.item.word_kana), 300);
    }
  };

  const handleNextSec2 = () => {
    setSec2Feedback(null);
    if (examMode === 'endless_infinite') {
      const nextIdx = (sec2CurrentIndex + 1) % sec2Items.length;
      setSec2CurrentIndex(nextIdx);
      playThaiAudio(sec2Items[nextIdx].item.meaning_th);
    } else {
      if (sec2CurrentIndex < 4) {
        setSec2CurrentIndex((prev) => prev + 1);
        playThaiAudio(sec2Items[sec2CurrentIndex + 1].item.meaning_th);
      } else {
        setCurrentSection(3);
        if (sec3Items.length > 0) {
          playJapaneseAudio(sec3Items[0].teacherQuestionKana);
        }
      }
    }
  };

  // Section 3 Answer
  const handleAnswerSec3 = (opt: { romaji: string; kana: string; isCorrect: boolean }) => {
    if (sec3Feedback) return;
    const current = sec3Items[sec3CurrentIndex];
    const isCorrect = opt.isCorrect;
    const newAnswers = [...sec3Answers, { isCorrect, response: opt.romaji, expected: current.correctAnswerRomaji }];
    setSec3Answers(newAnswers);
    setSec3Feedback({ isCorrect, selected: opt.romaji, correct: current.correctAnswerRomaji });

    if (isCorrect) {
      playJapaneseAudio(opt.kana);
      setEndlessStats((prev) => ({ correct: prev.correct + 1, total: prev.total + 1, streak: prev.streak + 1 }));
    } else {
      setEndlessStats((prev) => ({ ...prev, total: prev.total + 1, streak: 0 }));
      setTimeout(() => playJapaneseAudio(current.correctAnswerKana), 300);
    }
  };

  const handleNextSec3 = () => {
    setSec3Feedback(null);
    if (examMode === 'endless_infinite') {
      const nextIdx = (sec3CurrentIndex + 1) % sec3Items.length;
      setSec3CurrentIndex(nextIdx);
      playJapaneseAudio(sec3Items[nextIdx].teacherQuestionKana);
    } else {
      if (sec3CurrentIndex < 4) {
        setSec3CurrentIndex((prev) => prev + 1);
        playJapaneseAudio(sec3Items[sec3CurrentIndex + 1].teacherQuestionKana);
      } else {
        handleFinishTimedExam();
      }
    }
  };

  const handleFinishTimedExam = async (finalSec3Answers = sec3Answers) => {
    setExamState('finished');
    const score1 = Object.values(sec1Done).filter(Boolean).length;
    const score2 = sec2Answers.filter((a) => a.isCorrect).length;
    const score3 = finalSec3Answers.filter((a) => a.isCorrect).length;
    const total = score1 + score2 + score3;

    const report = {
      scoreSection1: score1,
      scoreSection2: score2,
      scoreSection3: score3,
      totalScore: total,
      timeUsed: 180 - timeLeftSeconds,
      passed: total >= 12,
    };
    setFinalReport(report);

    await submitExamResult({
      student_name: 'Poom',
      totalDurationSeconds: 180 - timeLeftSeconds,
      scoreSection1: score1,
      scoreSection2: score2,
      scoreSection3: score3,
      totalScore: total,
      evaluationSummary: total >= 12 ? 'EXCELLENT_PASS' : 'NEEDS_PRACTICE',
      attempts: [],
    });
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mode Selector & Status Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">
              {examMode === 'timed_3min' ? 'โหมดสอบจริงจำกัดเวลา (3 นาที)' : 'โหมดฝึกวนไม่จำกัด (Endless Infinity)'}
            </span>
            <span className="badge badge-ref">JN60101 Complete Trainer</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {examMode === 'timed_3min' ? '3-Minute Timed Mock Exam' : 'Endless Infinite Practice Arena'}
          </h2>
        </div>

        {/* Real-time Status / Timer */}
        {examState === 'running' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {examMode === 'timed_3min' ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: timeLeftSeconds <= 30 ? 'var(--danger-50)' : 'var(--bg-subtle)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-md)',
                border: timeLeftSeconds <= 30 ? '2px solid var(--danger-border)' : '1px solid var(--border-subtle)',
              }}>
                <Timer size={18} color={timeLeftSeconds <= 30 ? 'var(--danger-600)' : 'var(--text-main)'} />
                <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'monospace', color: timeLeftSeconds <= 30 ? 'var(--danger-600)' : 'var(--text-main)' }}>
                  {formatTimer(timeLeftSeconds)}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                <div>
                  คะแนนสะสม: <strong>{endlessStats.correct} / {endlessStats.total}</strong>
                </div>
                <div style={{ color: 'var(--warning-600)', fontWeight: 700 }}>
                  🔥 Streak: {endlessStats.streak}
                </div>
              </div>
            )}

            <button onClick={() => setExamState('idle')} className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              หยุดการฝึก
            </button>
          </div>
        )}
      </div>

      {/* IDLE SELECTION VIEW */}
      {examState === 'idle' && (
        <div className="card" style={{ padding: '40px 32px', backgroundColor: '#ffffff', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Award size={28} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
            เลือกรูปแบบการฝึกสอบที่ต้องการ
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '560px', margin: '0 auto 28px' }}>
            คุณสามารถเลือกสอบแบบจับเวลาเสมือนจริง 3 นาที หรือเลือกฝึกวนไปเรื่อยๆ โดยไม่จำกัดเวลา พร้อมสลับส่วนที่ 1, 2, 3 ได้อย่างอิสระตลอดเวลา
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
            <button
              onClick={() => handleStartExam('timed_3min')}
              className="card"
              style={{
                padding: '24px',
                textAlign: 'left',
                border: '2px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', marginBottom: '8px' }}>
                <Timer size={20} />
                <strong style={{ fontSize: '16px' }}>1. สอบจำลองจริง (3 นาที)</strong>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                จำลองเวลาสอบจริง 180 วินาที รันข้อสอบ 3 ส่วนต่อเนื่อง พร้อมประเมินคะแนนและจุดอ่อนหลังสอบเสร็จ
              </p>
            </button>

            <button
              onClick={() => handleStartExam('endless_infinite')}
              className="card"
              style={{
                padding: '24px',
                textAlign: 'left',
                border: '2px solid var(--border-subtle)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-600)', marginBottom: '8px' }}>
                <InfinityIcon size={20} />
                <strong style={{ fontSize: '16px' }}>2. ฝึกวนไม่จำกัด (Endless)</strong>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                ฝึกทำข้อสอบวนไปเรื่อยๆ ไม่มีหมดเวลา สามารถสลับไปซ้อมส่วนที่ 1, 2 หรือ 3 ได้ตลอดเวลาตามใจชอบ
              </p>
            </button>
          </div>
        </div>
      )}

      {/* RUNNING EXAM ARENA */}
      {examState === 'running' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* REAL-TIME SECTION SWITCHER BAR (Always Available During Exam!) */}
          <div className="card" style={{ padding: '12px 18px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                แถบเลือกส่วนที่กำลังสอบ (สลับได้ตลอดเวลา):
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 1, label: 'ส่วนที่ 1: แนะนำตัว (5 ท่อน)' },
                  { id: 2, label: 'ส่วนที่ 2: แปลไทย-ญี่ปุ่น' },
                  { id: 3, label: 'ส่วนที่ 3: ตอบภาพ 5 ข้อ' },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setCurrentSection(sec.id as any)}
                    className={currentSection === sec.id ? 'btn-primary' : 'btn-outline'}
                    style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 1: INTERACTIVE JIKO SHOKAI ARENA */}
          {currentSection === 1 && (
            <div className="card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-primary">ส่วนที่ 1: แนะนำตนเอง (เรียงประโยคให้ถูกต้อง)</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  สำเร็จแล้ว: {Object.values(sec1Done).filter(Boolean).length} / 5 ท่อน
                </span>
              </div>

              {/* Error Notice for Section 1 */}
              {sec1WrongAttempt && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--danger-50)',
                  border: '1.5px solid var(--danger-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--danger-600)',
                  fontSize: '13px',
                  fontWeight: 700,
                }}>
                  <AlertCircle size={18} />
                  ลำดับประโยคยังไม่ถูกต้อง! ต้องเรียงเป็น: {sec1TokensConfig[sec1Step].romaji}
                </div>
              )}

              {/* 5 Step Progress Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => { setSec1Step(stepNum); setSec1WrongAttempt(false); }}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      border: sec1Step === stepNum ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                      backgroundColor: sec1Done[stepNum] ? 'var(--success-50)' : sec1Step === stepNum ? 'var(--primary-50)' : 'var(--bg-surface)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                  >
                    ท่อนที่ {stepNum} {sec1Done[stepNum] && '✓'}
                  </button>
                ))}
              </div>

              {/* Word Assembly Drop Area */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: sec1Done[sec1Step] ? 'var(--success-50)' : 'var(--bg-subtle)',
                border: sec1Done[sec1Step] ? '2px solid var(--success-border)' : '2px dashed var(--border-strong)',
                minHeight: '70px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}>
                {(sec1Assembled[sec1Step] || []).length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    คลิกบล็อกคำศัพท์ด้านล่างเพื่อต่อประโยค...
                  </span>
                ) : (
                  sec1Assembled[sec1Step].map((tok, i) => (
                    <button
                      key={i}
                      onClick={() => handleRemoveTokenSec1(i)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700,
                        fontSize: '14px',
                      }}
                    >
                      {tok} ×
                    </button>
                  ))
                )}
              </div>

              {/* Word Tokens Scrambled */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {sec1TokensConfig[sec1Step].tokens.map((tok, idx) => {
                  const isUsed = (sec1Assembled[sec1Step] || []).includes(tok);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAddTokenSec1(tok)}
                      disabled={isUsed || sec1Done[sec1Step]}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-strong)',
                        backgroundColor: isUsed ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                        color: isUsed ? 'var(--text-faint)' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '14px',
                      }}
                    >
                      {tok}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => playJapaneseAudio(sec1TokensConfig[sec1Step].romaji)}
                  className="btn-outline"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  <Volume2 size={14} /> ฟังเฉลย
                </button>

                <button
                  onClick={() => setCurrentSection(2)}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  ไปส่วนที่ 2 (แปลไทย-ญี่ปุ่น) <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: SPEED FLASH TRANSLATE ARENA */}
          {currentSection === 2 && sec2Items[sec2CurrentIndex] && (
            <div className="card" style={{ padding: '36px', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-primary">ส่วนที่ 2: แปลไทยเป็นญี่ปุ่น</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ข้อที่ {sec2CurrentIndex + 1} {examMode === 'timed_3min' ? '/ 5' : '(วนต่อเนื่อง)'}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>ครูพูดภาษาไทยว่า:</div>
              <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px' }}>
                "{sec2Items[sec2CurrentIndex].item.meaning_th}"
              </div>

              {/* ERROR NOTIFICATION BANNER */}
              {sec2Feedback && !sec2Feedback.isCorrect && (
                <div style={{
                  maxWidth: '600px',
                  margin: '0 auto 16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--danger-50)',
                  border: '1.5px solid var(--danger-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--danger-600)',
                  fontSize: '14px',
                  fontWeight: 700,
                  textAlign: 'left',
                }}>
                  <AlertCircle size={20} />
                  <div>
                    ❌ ตอบผิด! คุณตอบ: "{sec2Feedback.selected}" $\rightarrow$ คำตอบที่ถูกต้องคือ: <strong>{sec2Feedback.correct}</strong>
                  </div>
                </div>
              )}

              {/* SUCCESS NOTIFICATION BANNER */}
              {sec2Feedback && sec2Feedback.isCorrect && (
                <div style={{
                  maxWidth: '600px',
                  margin: '0 auto 16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--success-50)',
                  border: '1.5px solid var(--success-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--success-600)',
                  fontSize: '14px',
                  fontWeight: 700,
                  textAlign: 'left',
                }}>
                  <CheckCircle2 size={20} />
                  <div>
                    ✓ ถูกต้อง! <strong>{sec2Feedback.correct}</strong> = {sec2Items[sec2CurrentIndex].item.meaning_th}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
                {sec2Items[sec2CurrentIndex].options.map((opt: any) => {
                  let btnBg = 'var(--bg-surface)';
                  let btnBorder = 'var(--border-strong)';
                  if (sec2Feedback) {
                    if (opt.word_romaji === sec2Feedback.correct) {
                      btnBg = 'var(--success-50)';
                      btnBorder = 'var(--success-border)';
                    } else if (opt.word_romaji === sec2Feedback.selected) {
                      btnBg = 'var(--danger-50)';
                      btnBorder = 'var(--danger-border)';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !sec2Feedback && handleAnswerSec2(opt.word_romaji)}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${btnBorder}`,
                        backgroundColor: btnBg,
                        fontSize: '15px',
                        fontWeight: 700,
                        textAlign: 'left',
                        cursor: sec2Feedback ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div>{opt.word_romaji}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>{opt.word_kana}</div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playJapaneseAudio(opt.word_kana);
                        }}
                        title="กดฟังเสียงอ่านภาษาญี่ปุ่น"
                        style={{
                          padding: '6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: '#ffffff',
                          color: 'var(--primary-700)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: '8px',
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {sec2Feedback && (
                <div style={{ marginTop: '20px' }}>
                  <button onClick={handleNextSec2} className="btn-primary" style={{ padding: '8px 24px' }}>
                    ข้อถัดไป <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: PURE VISUAL Q&A ARENA */}
          {currentSection === 3 && sec3Items[sec3CurrentIndex] && (
            <div className="card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span className="badge badge-primary">{sec3Items[sec3CurrentIndex].typeName}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ข้อที่ {sec3CurrentIndex + 1} {examMode === 'timed_3min' ? '/ 5' : '(วนต่อเนื่อง)'}
                </span>
              </div>

              {/* ERROR BANNER FOR SECTION 3 */}
              {sec3Feedback && !sec3Feedback.isCorrect && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--danger-50)',
                  border: '1.5px solid var(--danger-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--danger-600)',
                  fontSize: '14px',
                  fontWeight: 700,
                }}>
                  <AlertCircle size={20} />
                  <div>
                    ❌ ตอบผิด! ประโยคที่ถูกต้องคือ: <strong>{sec3Feedback.correct}</strong>
                  </div>
                </div>
              )}

              {/* SUCCESS BANNER FOR SECTION 3 */}
              {sec3Feedback && sec3Feedback.isCorrect && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--success-50)',
                  border: '1.5px solid var(--success-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--success-600)',
                  fontSize: '14px',
                  fontWeight: 700,
                }}>
                  <CheckCircle2 size={20} />
                  <div>
                    ✓ ถูกต้องสมบูรณ์แบบ!
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', alignItems: 'center' }}>
                {/* Clean Photo without Text */}
                <div style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                  minHeight: '260px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={sec3Items[sec3CurrentIndex].imageSrc}
                    alt="Visual prompt"
                    style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>

                {/* Question & Options */}
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>อาจารย์ชี้ภาพแล้วถามว่า:</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
                    "{sec3Items[sec3CurrentIndex].teacherQuestionRomaji}"
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sec3Items[sec3CurrentIndex].options.map((opt, idx) => {
                      let optBg = 'var(--bg-surface)';
                      let optBorder = 'var(--border-strong)';
                      if (sec3Feedback) {
                        if (opt.romaji === sec3Feedback.correct) {
                          optBg = 'var(--success-50)';
                          optBorder = 'var(--success-border)';
                        } else if (opt.romaji === sec3Feedback.selected) {
                          optBg = 'var(--danger-50)';
                          optBorder = 'var(--danger-border)';
                        }
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => !sec3Feedback && handleAnswerSec3(opt)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${optBorder}`,
                            backgroundColor: optBg,
                            textAlign: 'left',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: sec3Feedback ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div>{opt.romaji}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.kana}</div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playJapaneseAudio(opt.kana);
                            }}
                            title="กดฟังเสียงอ่านประโยคภาษาญี่ปุ่น"
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: '#ffffff',
                              color: 'var(--primary-700)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: '8px',
                            }}
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {sec3Feedback && (
                    <div style={{ marginTop: '16px' }}>
                      <button onClick={handleNextSec3} className="btn-primary" style={{ padding: '8px 20px' }}>
                        ข้อถัดไป <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINISHED VIEW (TIMED MODE REPORT) */}
      {examState === 'finished' && finalReport && (
        <div className="card" style={{ padding: '40px 32px', backgroundColor: '#ffffff', textAlign: 'center' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: finalReport.passed ? 'var(--success-50)' : 'var(--warning-50)',
            color: finalReport.passed ? 'var(--success-600)' : 'var(--warning-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            {finalReport.passed ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
            {finalReport.passed ? '🎉 ยินดีด้วย! คุณพร้อมสอบผ่านระดับคะแนนยอดเยี่ยม' : 'ต้องฝึกฝนเพิ่มเติมในบางส่วน!'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            เวลาที่ใช้ไป: {formatTimer(finalReport.timeUsed)} (จากเวลาเต็ม 3 นาที)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '680px', margin: '0 auto 28px' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1. แนะนำตัว</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{finalReport.scoreSection1} / 5</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2. แปลไทย-ญี่ปุ่น</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{finalReport.scoreSection2} / 5</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>3. ตอบภาพ 5 ข้อ</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{finalReport.scoreSection3} / 5</div>
            </div>
            <div style={{ padding: '14px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--primary-700)', fontWeight: 600 }}>คะแนนรวม</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary-700)' }}>
                {finalReport.totalScore} / 15
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => handleStartExam('timed_3min')} className="btn-primary" style={{ padding: '10px 24px' }}>
              <RotateCcw size={15} /> สอบจำลองใหม่อีกครั้ง
            </button>
            <button onClick={() => handleStartExam('endless_infinite')} className="btn-outline" style={{ padding: '10px 24px' }}>
              <InfinityIcon size={15} /> สลับไปฝึกวนไม่จำกัดเวลา
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
