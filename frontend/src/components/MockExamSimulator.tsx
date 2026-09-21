import React, { useState, useEffect } from 'react';
import { Timer, Infinity as InfinityIcon, CheckCircle2, ArrowRight, RotateCcw, AlertCircle, Volume2, Play, ShieldCheck, Sparkles, Eye, EyeOff, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { playJapaneseAudio, playThaiAudio } from '../utils/speech';
import { fallbackVocabs, submitExamResult } from '../services/api';
import { allSection3Pool, VisualQuestionItem } from './VisualQAArena';
import { CustomPracticePreset, defaultPresets, PresetEditorModal } from './CustomPresetManagerModal';

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

  // Endless Mode: Choice Visibility Setting ('instant' | 'hidden')
  const [choiceRevealMode, setChoiceRevealMode] = useState<'instant' | 'hidden'>(() => {
    return (localStorage.getItem('nihongo_endless_choice_mode') as any) || 'instant';
  });
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(false);

  // Endless Mode: Custom Scope Presets
  const [presets, setPresets] = useState<CustomPracticePreset[]>(() => {
    const saved = localStorage.getItem('nihongo_custom_practice_presets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse custom presets', e);
      }
    }
    return defaultPresets;
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem('nihongo_active_preset_id') || 'preset_all';
  });

  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [editingPreset, setEditingPreset] = useState<CustomPracticePreset | null>(null);
  const [hoveredVocabPresetId, setHoveredVocabPresetId] = useState<string | null>(null);
  const [hoveredSec3PresetId, setHoveredSec3PresetId] = useState<string | null>(null);
  const [sec3PatternFilter, setSec3PatternFilter] = useState<number>(0);

  const handleFilterSec3Pattern = (typeId: number) => {
    setSec3PatternFilter(typeId);
    const filtered = (typeId === 0 ? allSection3Pool : allSection3Pool.filter((q) => q.typeId === typeId)).sort(
      () => 0.5 - Math.random()
    );
    setSec3Items(filtered);
    setSec3CurrentIndex(0);
    setSec3Feedback(null);
    setIsChoiceRevealed(false);
  };

  useEffect(() => {
    localStorage.setItem('nihongo_endless_choice_mode', choiceRevealMode);
  }, [choiceRevealMode]);

  useEffect(() => {
    localStorage.setItem('nihongo_custom_practice_presets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('nihongo_active_preset_id', activePresetId);
  }, [activePresetId]);

  // Handlers for Preset Management
  const handleOpenCreatePreset = () => {
    setEditingPreset(null);
    setIsPresetModalOpen(true);
  };

  const handleOpenEditPreset = (preset: CustomPracticePreset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPreset(preset);
    setIsPresetModalOpen(true);
  };

  const handleSavePreset = (preset: CustomPracticePreset) => {
    setPresets((prev) => {
      const exists = prev.some((p) => p.id === preset.id);
      if (exists) {
        return prev.map((p) => (p.id === preset.id ? preset : p));
      } else {
        return [...prev, preset];
      }
    });
    setActivePresetId(preset.id);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresets((prev) => prev.filter((p) => p.id !== id));
    if (activePresetId === id) {
      setActivePresetId('preset_all');
    }
  };

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

    const activePreset = presets.find((p) => p.id === activePresetId) || defaultPresets[0];

    // Section 2: Pick from active preset's vocabulary list (if in Endless Mode)
    const activeVocabs = fallbackVocabs.filter((v) =>
      mode === 'endless_infinite' && activePreset.sec2VocabIds && activePreset.sec2VocabIds.length > 0
        ? activePreset.sec2VocabIds.includes(v.id)
        : true
    );
    const poolSec2 = activeVocabs.length >= 2 ? activeVocabs : fallbackVocabs;
    const shuffledVocab = [...poolSec2].sort(() => 0.5 - Math.random());
    const picked5Vocab = shuffledVocab.slice(0, mode === 'endless_infinite' ? 50 : 5).map((v) => {
      const distractors = fallbackVocabs.filter((x) => x.id !== v.id).sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [v, ...distractors].sort(() => 0.5 - Math.random());
      return { item: v, options: opts };
    });

    // Section 3: In Timed Mode (3-minute exam), strictly guarantee 1 question from each of the 5 Types in sequence!
    let shuffledSec3: VisualQuestionItem[] = [];
    if (mode === 'timed_3min') {
      const type1Pool = allSection3Pool.filter((q) => q.typeId === 1);
      const type2Pool = allSection3Pool.filter((q) => q.typeId === 2);
      const type3Pool = allSection3Pool.filter((q) => q.typeId === 3);
      const type4Pool = allSection3Pool.filter((q) => q.typeId === 4);
      const type5Pool = allSection3Pool.filter((q) => q.typeId === 5);

      const q1 = type1Pool[Math.floor(Math.random() * type1Pool.length)] || allSection3Pool[0];
      const q2 = type2Pool[Math.floor(Math.random() * type2Pool.length)] || allSection3Pool[1];
      const q3 = type3Pool[Math.floor(Math.random() * type3Pool.length)] || allSection3Pool[2];
      const q4 = type4Pool[Math.floor(Math.random() * type4Pool.length)] || allSection3Pool[3];
      const q5 = type5Pool[Math.floor(Math.random() * type5Pool.length)] || allSection3Pool[4];

      shuffledSec3 = [q1, q2, q3, q4, q5];
    } else {
      // Endless mode or custom presets
      const activeSec3QuestionIds =
        activePreset.sec3QuestionIds && activePreset.sec3QuestionIds.length > 0
          ? activePreset.sec3QuestionIds
          : allSection3Pool
              .filter((q) => (activePreset.sec3TypeIds || [1, 2, 3, 4, 5]).includes(q.typeId))
              .map((q) => q.id);

      const sec3PoolFiltered = allSection3Pool.filter((q) => activeSec3QuestionIds.includes(q.id));
      const activeSec3Pool = sec3PoolFiltered.length > 0 ? sec3PoolFiltered : allSection3Pool;
      shuffledSec3 = [...activeSec3Pool].sort(() => 0.5 - Math.random());
    }

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
    setIsChoiceRevealed(false);
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
    setIsChoiceRevealed(false);
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
    setIsChoiceRevealed(false);
    if (examMode === 'endless_infinite') {
      const nextIdx = (sec3CurrentIndex + 1) % sec3Items.length;
      if (nextIdx === 0) {
        // Re-shuffle for endless variety
        const reshuffled = [...sec3Items].sort(() => 0.5 - Math.random());
        setSec3Items(reshuffled);
      }
      setSec3CurrentIndex(nextIdx);
      if (sec3Items[nextIdx]) {
        playJapaneseAudio(sec3Items[nextIdx].teacherQuestionKana);
      }
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
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
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

      {/* IDLE VIEW: DEDICATED FOR TIMED 3-MIN EXAM */}
      {examState === 'idle' && examMode === 'timed_3min' && (
        <div className="card" style={{ padding: '36px 32px', backgroundColor: 'var(--bg-surface)', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--primary-border)',
                flexShrink: 0,
              }}
            >
              <Timer size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-primary">โหมดสอบทางการ</span>
                <span className="badge badge-ref">JN60101 PIM</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                ห้องสอบจำลองจับเวลาเสมือนจริง 3 นาที (Timed Mock Exam)
              </h3>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            จำลองสถานการณ์การสอบปากเปล่าและภาพจริง 15 ข้อ เวลาถอยหลัง 180 วินาที เมื่อกดปุ่มเริ่มสอบ ระบบจะเริ่มนับเวลาทันทีและแสดงข้อสอบชุดที่ 1
          </p>

          {/* Exam Structure Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '4px' }}>ส่วนที่ 1: แนะนำตัว</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>5 ข้อ (5 คะแนน)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>เรียงประโยค Jiko-shokai</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '4px' }}>ส่วนที่ 2: ไวยากรณ์</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>5 ข้อ (5 คะแนน)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>แปลไทย-ญี่ปุ่น Flash Vocab</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '4px' }}>ส่วนที่ 3: ตอบคำถามภาพ</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>5 ข้อ (5 คะแนน)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Visual Q&A จากภาพจริง</div>
            </div>
          </div>

          {/* Rules & Pass Mark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--primary-50)', borderRadius: '8px', border: '1px solid var(--primary-border)', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--primary-600)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-700)' }}>เกณฑ์การประเมินผลผ่าน: 12 / 15 คะแนน (80%)</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>เวลาทั้งหมด: 3 นาที (180 วินาที) • สลับข้ามส่วนได้ตลอดเวลา</div>
              </div>
            </div>

            <button
              onClick={() => playJapaneseAudio('はじめまして。よろしくおねがいします。')}
              className="btn-outline"
              style={{ fontSize: '12px', padding: '6px 10px', backgroundColor: 'var(--bg-surface)' }}
            >
              <Volume2 size={13} color="var(--primary-600)" />
              <span>ทดสอบเสียงก่อนสอบ</span>
            </button>
          </div>

          {/* Primary Action Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => handleStartExam('timed_3min')}
              className="btn-primary"
              style={{
                width: '100%',
                maxWidth: '360px',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: 800,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Play size={18} />
              <span>เริ่มทำข้อสอบจับเวลา 3 นาที</span>
            </button>
            <p style={{ fontSize: '11.5px', color: 'var(--text-faint)', marginTop: '8px' }}>
              เมื่อคลิกเริ่มสอบ เวลา 03:00 จะเริ่มนับถอยหลังทันที
            </p>
          </div>
        </div>
      )}

      {/* IDLE VIEW: DEDICATED FOR ENDLESS PRACTICE */}
      {examState === 'idle' && examMode === 'endless_infinite' && (
        <div className="card" style={{ padding: '36px 32px', backgroundColor: 'var(--bg-surface)', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--success-50)',
                color: 'var(--success-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--success-border)',
                flexShrink: 0,
              }}
            >
              <InfinityIcon size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-success">โหมดฝึกซ้อมไม่จำกัดเวลา</span>
                <span className="badge badge-ref">Endless Continuous Practice</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                โหมดฝึกซ้อมวนซ้ำต่อเนื่อง (Endless Practice Arena)
              </h3>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            ฝึกทำข้อสอบสุ่มวนไปเรื่อยๆ โดยไม่มีเวลาจำกัด สามารถฝึกซ้อมจนเกิดความคุ้นเคยและแม่นยำ พร้อมระบบเฉลยและเสียงอ่านภาษาญี่ปุ่น/ไทยทุกข้อ
          </p>

          {/* Features Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success-600)', marginBottom: '4px' }}>ไร้แรงกดดันเรื่องเวลา</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>ไม่จำกัดเวลา</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>คิดและทบทวนได้เต็มที่</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success-600)', marginBottom: '4px' }}>สุ่มโจทย์รอบด้าน</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>73+ คำศัพท์ & ภาพ</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>ครอบคลุมบทที่ 1 & 2</div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success-600)', marginBottom: '4px' }}>ระบบเก็บสถิติ</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>Streak & Accuracy</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>วัดความต่อเนื่อง</div>
            </div>
          </div>

          {/* Status Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--success-50)', borderRadius: '8px', border: '1px solid var(--success-border)', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="var(--success-600)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--success-700)' }}>ระบบพร้อมเริ่มสุ่มโจทย์ฝึกทำทันที</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>คลิกเริ่มเพื่อเข้าสู่คำถามข้อที่ 1 และสามารถสลับส่วนที่ 1, 2, 3 ได้อิสระ</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--success-700)', fontWeight: 600 }}>
              คะแนนปัจจุบัน: {endlessStats.correct} / {endlessStats.total}
            </div>
          </div>

          {/* Choice Visibility Mode Setting (Only for Sec 2 & 3 in Endless) */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={15} color="var(--primary-600)" />
              <span>รูปแบบการแสดงตัวเลือก (เฉพาะส่วนที่ 2 และ 3):</span>
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
                  boxShadow: choiceRevealMode === 'instant' ? '0 0 0 1px var(--primary-600)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: choiceRevealMode === 'instant' ? 'var(--primary-700)' : 'var(--text-main)' }}>
                  <Eye size={15} /> แสดงชอยส์ทันที (Default)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  แสดงโจทย์พร้อม 4 ตัวเลือกทันทีเมื่อเริ่มแต่ละข้อ
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChoiceRevealMode('hidden')}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: choiceRevealMode === 'hidden' ? '2px solid var(--success-600)' : '1px solid var(--border-strong)',
                  backgroundColor: choiceRevealMode === 'hidden' ? 'var(--success-50)' : 'var(--bg-surface)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: choiceRevealMode === 'hidden' ? '0 0 0 1px var(--success-600)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13.5px', color: choiceRevealMode === 'hidden' ? 'var(--success-700)' : 'var(--text-main)' }}>
                  <EyeOff size={15} /> ซ่อนชอยส์ฝึกจำปากเปล่า (Oral Drill)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  ซ่อนตัวเลือกไว้ก่อน เพื่อฝึกนึกและพูดด้วยตนเองก่อนเปิดดู
                </div>
              </button>
            </div>
          </div>

          {/* CUSTOM PRESETS & VOCABULARY SELECTION TABLE */}
          <div style={{ marginBottom: '28px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} color="var(--primary-600)" />
                  <span>เลือกคำศัพท์ / ข้อสอบที่ต้องการฝึก (Custom Practice Presets)</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  เลือกชุดคำศัพท์หรือภาพสถานการณ์ที่ต้องการเน้นฝึกซ้อม ระบบจะสุ่มเฉพาะรายการที่กำหนดไว้
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreatePreset}
                className="btn-primary"
                style={{
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={15} /> สร้างพรีเซ็ตใหม่
              </button>
            </div>

            {/* PRESETS TABLE */}
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                overflow: 'visible',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '65px', textAlign: 'center' }}>
                      เลือกใช้
                    </th>
                    <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '110px' }}>
                      ประเภท
                    </th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', minWidth: '200px' }}>
                      ชื่อชุดพรีเซ็ต
                    </th>
                    <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '90px', textAlign: 'center' }}>
                      จำนวนคำ
                    </th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', minWidth: '260px' }}>
                      ส่วนที่ 2: คำศัพท์ (ชี้เมาส์ดู)
                    </th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-secondary)', width: '220px' }}>
                      ส่วนที่ 3: ภาพคำถาม
                    </th>
                    <th style={{ padding: '12px', fontWeight: 700, color: 'var(--text-secondary)', width: '80px', textAlign: 'center' }}>
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((preset) => {
                    const isActive = activePresetId === preset.id;
                    const matchedVocabs = fallbackVocabs.filter((v) => preset.sec2VocabIds.includes(v.id));
                    const previewVocabs = matchedVocabs.slice(0, 4);
                    const remainingVocabCount = matchedVocabs.length - 4;

                    // Section 3 item count
                    const sec3QCount = preset.sec3QuestionIds && preset.sec3QuestionIds.length > 0
                      ? preset.sec3QuestionIds.length
                      : allSection3Pool.filter((q) => (preset.sec3TypeIds || []).includes(q.typeId)).length;

                    const sec3TypesMap: Record<number, string> = {
                      1: 'ถามสิ่งของ',
                      2: 'ถามประเทศ',
                      3: 'ถามอาชีพ',
                      4: 'ถามนิตยสาร',
                      5: 'ถามสถานที่',
                    };

                    return (
                      <tr
                        key={preset.id}
                        onClick={() => setActivePresetId(preset.id)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        {/* SELECT RADIO */}
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

                        {/* PRESET TYPE BADGE */}
                        <td style={{ padding: '14px 12px', verticalAlign: 'middle' }}>
                          {!preset.isCustom ? (
                            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontWeight: 700, display: 'inline-block' }}>
                              ระบบ (Default)
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--success-50)', border: '1px solid var(--success-border)', color: 'var(--success-700)', fontWeight: 700, display: 'inline-block' }}>
                              กำหนดเอง
                            </span>
                          )}
                        </td>

                        {/* PRESET NAME */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                          <div style={{ fontWeight: 700, color: isActive ? 'var(--primary-700)' : 'var(--text-main)', fontSize: '13.5px', lineHeight: 1.4 }}>
                            {preset.name}
                          </div>
                        </td>

                        {/* VOCABULARY COUNT COLUMN */}
                        <td style={{ padding: '14px 12px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)' }}>
                            {matchedVocabs.length} คำ
                          </span>
                        </td>

                        {/* SECTION 2 VOCAB HOVER PREVIEW */}
                        <td
                          style={{ padding: '14px 16px', verticalAlign: 'middle', position: 'relative' }}
                          onMouseEnter={() => setHoveredVocabPresetId(preset.id)}
                          onMouseLeave={() => setHoveredVocabPresetId(null)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {previewVocabs.map((v) => (
                              <span
                                key={v.id}
                                style={{
                                  fontSize: '11.5px',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--bg-app)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-main)',
                                }}
                              >
                                {v.word_romaji}
                              </span>
                            ))}
                            {remainingVocabCount > 0 && (
                              <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 700, backgroundColor: 'var(--primary-100)', padding: '2px 7px', borderRadius: '4px' }}>
                                +{remainingVocabCount} คำ
                              </span>
                            )}
                          </div>

                          {/* INTERACTIVE HOVER SCROLLABLE POPOVER (Section 2) */}
                          {hoveredVocabPresetId === preset.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={() => setHoveredVocabPresetId(preset.id)}
                              onMouseLeave={() => setHoveredVocabPresetId(null)}
                              style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 4px)',
                                left: '0',
                                zIndex: 9999,
                                width: '340px',
                                maxHeight: '240px',
                                overflowY: 'auto',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1.5px solid var(--border-strong)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22)',
                                padding: '12px 14px',
                                pointerEvents: 'auto',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>
                                  รายการคำศัพท์ทั้งหมด ({matchedVocabs.length} คำ):
                                </span>
                                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>เลื่อนเพื่อดูทั้งหมด</span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {matchedVocabs.map((v, i) => (
                                  <div key={v.id} style={{ fontSize: '11.5px', display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '2px 0', borderBottom: '1px dotted var(--border-subtle)' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                                      {i + 1}. {v.word_romaji} <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 400 }}>({v.word_kana})</span>
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', textAlign: 'right', fontSize: '11.5px' }}>
                                      {v.meaning_th}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* SECTION 3 VISUAL TYPES HOVER PREVIEW */}
                        <td
                          style={{ padding: '12px 14px', verticalAlign: 'middle', position: 'relative' }}
                          onMouseEnter={() => setHoveredSec3PresetId(preset.id)}
                          onMouseLeave={() => setHoveredSec3PresetId(null)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                              {sec3QCount} ข้อ
                            </span>
                            {preset.sec3TypeIds.slice(0, 2).map((tId) => (
                              <span
                                key={tId}
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--bg-app)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-main)',
                                }}
                              >
                                {sec3TypesMap[tId]}
                              </span>
                            ))}
                            {preset.sec3TypeIds.length > 2 && (
                              <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 700, backgroundColor: 'var(--primary-100)', padding: '2px 6px', borderRadius: '4px' }}>
                                +{preset.sec3TypeIds.length - 2}
                              </span>
                            )}
                          </div>

                          {/* INTERACTIVE HOVER SCROLLABLE POPOVER (Section 3) */}
                          {hoveredSec3PresetId === preset.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={() => setHoveredSec3PresetId(preset.id)}
                              onMouseLeave={() => setHoveredSec3PresetId(null)}
                              style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 4px)',
                                left: '0',
                                zIndex: 9999,
                                width: '280px',
                                maxHeight: '220px',
                                overflowY: 'auto',
                                backgroundColor: 'var(--bg-surface)',
                                border: '1.5px solid var(--border-strong)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22)',
                                padding: '12px 14px',
                                pointerEvents: 'auto',
                              }}
                            >
                              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', paddingBottom: '4px', borderBottom: '1px solid var(--border-subtle)' }}>
                                รูปแบบภาพคำถามในพรีเซ็ต ({sec3QCount} ข้อ):
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {preset.sec3TypeIds.map((tId) => (
                                  <div key={tId} style={{ fontSize: '11.5px', color: 'var(--text-main)', fontWeight: 600 }}>
                                    ✓ {sec3TypesMap[tId]}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '12px 10px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditPreset(preset, e)}
                              title="แก้ไขคำศัพท์และสถานการณ์ในพรีเซ็ตนี้"
                              style={{
                                padding: '5px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-surface)',
                                color: 'var(--primary-700)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Edit2 size={13} />
                            </button>

                            {preset.isCustom && (
                              <button
                                type="button"
                                onClick={(e) => handleDeletePreset(preset.id, e)}
                                title="ลบพรีเซ็ตนี้"
                                style={{
                                  padding: '5px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--border-subtle)',
                                  backgroundColor: 'var(--bg-surface)',
                                  color: 'var(--danger-600)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Primary Action Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => handleStartExam('endless_infinite')}
              style={{
                width: '100%',
                maxWidth: '360px',
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: 800,
                borderRadius: '8px',
                backgroundColor: 'var(--success-600)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#15803d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--success-600)'; }}
            >
              <Play size={18} />
              <span>เริ่มต้นการฝึกซ้อมต่อเนื่อง</span>
            </button>
            <p style={{ fontSize: '11.5px', color: 'var(--text-faint)', marginTop: '8px' }}>
              สามารถหยุดหรือเปลี่ยนส่วนได้ตลอดเวลาขณะทำแบบฝึกหัด
            </p>
          </div>
        </div>
      )}

      {/* RUNNING EXAM ARENA */}
      {examState === 'running' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* REAL-TIME SECTION SWITCHER BAR (Always Available During Exam!) */}
          <div className="card" style={{ padding: '12px 18px', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  แถบเลือกส่วนที่กำลังสอบ:
                </span>

                <div className="exam-section-switcher">
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

              {/* Endless Quick Mode Switcher */}
              {examMode === 'endless_infinite' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ตัวเลือก:</span>
                  <button
                    onClick={() => { setChoiceRevealMode('instant'); setIsChoiceRevealed(false); }}
                    className={choiceRevealMode === 'instant' ? 'btn-primary' : 'btn-outline'}
                    style={{ padding: '3px 8px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                    title="แสดงตัวเลือก 4 ชอยส์ทันที"
                  >
                    <Eye size={11} /> แสดงชอยส์ทันที
                  </button>
                  <button
                    onClick={() => { setChoiceRevealMode('hidden'); setIsChoiceRevealed(false); }}
                    className={choiceRevealMode === 'hidden' ? 'btn-primary' : 'btn-outline'}
                    style={{ padding: '3px 8px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
                    title="ซ่อนตัวเลือกเพื่อฝึกนึกคำตอบปากเปล่าก่อน"
                  >
                    <EyeOff size={11} /> ซ่อนชอยส์ฝึกจำ
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 1: INTERACTIVE JIKO SHOKAI ARENA */}
          {currentSection === 1 && (
            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
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
              <div className="step-progress-strip" style={{ marginBottom: '20px' }}>
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
                        backgroundColor: 'var(--bg-surface)',
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
            <div className="card" style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
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

              {/* CONCEALED ORAL DRILL PROMPT (If hidden mode active and choice not yet revealed) */}
              {examMode === 'endless_infinite' && choiceRevealMode === 'hidden' && !isChoiceRevealed && !sec2Feedback ? (
                <div style={{ maxWidth: '600px', margin: '0 auto 16px' }}>
                  <div
                    onClick={() => setIsChoiceRevealed(true)}
                    style={{
                      padding: '32px 24px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-300)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}>
                      <EyeOff size={13} color="var(--primary-600)" />
                      <span>ฝึกตอบปากเปล่า (Active Recall)</span>
                    </div>

                    <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '380px', lineHeight: 1.5 }}>
                      นึกคำศัพท์ภาษาญี่ปุ่นและออกเสียงด้วยตนเองก่อนเปิดดูตัวเลือก
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChoiceRevealed(true);
                      }}
                      className="btn-primary"
                      style={{
                        padding: '10px 24px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 2px 8px rgba(0, 82, 204, 0.15)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '4px',
                      }}
                    >
                      <Eye size={16} /> แตะเพื่อแสดงตัวเลือก (4 ชอยส์)
                    </button>
                  </div>
                </div>
              ) : (
                <>
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

                  <div className="choice-grid-4">
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
                              backgroundColor: 'var(--bg-surface)',
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
                </>
              )}

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* ENDLESS MODE: 5-PATTERN QUESTION SELECTOR */}
              {examMode === 'endless_infinite' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '8px',
                }}>
                  {[
                    { id: 0, title: '🔀 รวม 5 แบบ', romaji: 'All Patterns', desc: 'สุ่มทุกหมวด' },
                    { id: 1, title: 'แบบที่ 1: ถามสิ่งของ', romaji: '"Kore wa nan desuka?"', desc: 'สิ่งของ & Katakana' },
                    { id: 2, title: 'แบบที่ 2: ถาม 4 ประเทศ', romaji: '"Anohito wa doko kara kimashitaka?"', desc: 'ไทย 🇹🇭, ญี่ปุ่น 🇯🇵, อเมริกา 🇺🇸, จีน 🇨🇳' },
                    { id: 3, title: 'แบบที่ 3: ถามอาชีพ/บุคคล', romaji: '"Anohito wa dare desuka?"', desc: 'ถามบุคคล & อาชีพ' },
                    { id: 4, title: 'แบบที่ 4: ถามนิตยสาร', romaji: '"Kore wa nan no zasshi desuka?"', desc: 'นิตยสาร 5 หมวด' },
                    { id: 5, title: 'แบบที่ 5: ถามสถานที่', romaji: '"Kochira wa nan desuka?"', desc: 'สถานที่ & องค์กร' },
                  ].map((p) => {
                    const isSelected = sec3PatternFilter === p.id;
                    const count = p.id === 0 ? allSection3Pool.length : allSection3Pool.filter((q) => q.typeId === p.id).length;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleFilterSec3Pattern(p.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--bg-surface)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          boxShadow: isSelected ? '0 0 0 1px var(--primary-600), 0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '12.5px',
                            fontWeight: 800,
                            color: isSelected ? 'var(--primary-700)' : 'var(--text-main)',
                          }}>
                            {p.title}
                          </span>
                          <span style={{
                            fontSize: '10.5px',
                            padding: '1px 6px',
                            borderRadius: '999px',
                            backgroundColor: isSelected ? 'var(--primary-600)' : 'var(--bg-subtle)',
                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            fontWeight: 700,
                          }}>
                            {count} ข้อ
                          </span>
                        </div>
                        <div style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: isSelected ? 'var(--primary-600)' : 'var(--text-main)',
                          fontFamily: 'monospace, sans-serif',
                        }}>
                          {p.romaji}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {p.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span className="badge badge-primary">{sec3Items[sec3CurrentIndex].typeName}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    ข้อที่ {sec3CurrentIndex + 1} {examMode === 'timed_3min' ? '/ 5' : `(${sec3Items.length} ข้อวนต่อเนื่อง)`}
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

              <div className="visual-qa-grid">
                {/* Clean Photo without Text */}
                <div style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface)',
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

                  {examMode === 'endless_infinite' && choiceRevealMode === 'hidden' && !isChoiceRevealed && !sec3Feedback ? (
                    <div
                      onClick={() => setIsChoiceRevealed(true)}
                      style={{
                        padding: '32px 20px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        minHeight: '220px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary-300)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}>
                        <EyeOff size={13} color="var(--primary-600)" />
                        <span>ฝึกตอบปากเปล่า (Active Recall)</span>
                      </div>

                      <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
                        ดูภาพแล้วลองตอบอาจารย์เป็นภาษาญี่ปุ่นออกเสียงด้วยตนเอง
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsChoiceRevealed(true);
                        }}
                        className="btn-primary"
                        style={{
                          padding: '10px 22px',
                          fontSize: '13.5px',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-md)',
                          boxShadow: '0 2px 8px rgba(0, 82, 204, 0.15)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px',
                        }}
                      >
                        <Eye size={16} /> แตะเพื่อแสดงตัวเลือก (4 ชอยส์)
                      </button>
                    </div>
                  ) : (
                    <>
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
                                  backgroundColor: 'var(--bg-surface)',
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
                    </>
                  )}
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      )}

      {/* FINISHED VIEW (TIMED MODE REPORT) */}
      {examState === 'finished' && finalReport && (
        <div className="card" style={{ padding: '40px 32px', backgroundColor: 'var(--bg-surface)', textAlign: 'center' }}>
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

      {/* CUSTOM SCOPE PRESET EDITOR MODAL */}
      <PresetEditorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSave={handleSavePreset}
        editingPreset={editingPreset}
      />
    </div>
  );
};
