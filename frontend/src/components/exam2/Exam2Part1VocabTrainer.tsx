import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Shuffle,
  Eye,
  EyeOff,
  Flame,
  Award,
  Timer
} from 'lucide-react';
import { Vocabulary } from '../../types';
import { exam2VocabList } from '../../services/exam2Data';
import { playJapaneseAudio } from '../../utils/speech';

export const Exam2Part1VocabTrainer: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<number | 0>(0); // 0 = All (Ch.3 + Ch.4)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [drillMode, setDrillMode] = useState<'speed_5' | 'endless'>('speed_5');

  const [questionPool, setQuestionPool] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<Vocabulary[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Flashcard / Concealed Choice State
  const [choiceRevealMode, setChoiceRevealMode] = useState<'instant' | 'hidden'>('hidden');
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(false);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);

  // Scoring
  const [score, setScore] = useState<{ correct: number; total: number; streak: number }>({
    correct: 0,
    total: 0,
    streak: 0,
  });
  const [examFinished, setExamFinished] = useState<boolean>(false);

  // Timer for Speed 5 Mode
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    initSession();
  }, [selectedChapter, selectedCategory, drillMode]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !examFinished) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, examFinished]);

  const initSession = () => {
    let filtered = exam2VocabList.filter((v) => {
      if (selectedChapter !== 0 && v.chapter_number !== selectedChapter) return false;
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      return true;
    });

    if (filtered.length === 0) filtered = [...exam2VocabList];

    // Shuffle
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const finalPool = drillMode === 'speed_5' ? shuffled.slice(0, 5) : shuffled;

    setQuestionPool(finalPool);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedOptionId(null);
    setIsChoiceRevealed(choiceRevealMode === 'instant');
    setExamFinished(false);
    setScore({ correct: 0, total: 0, streak: 0 });
    setTimerSeconds(0);
    setIsTimerRunning(true);

    if (finalPool.length > 0) {
      generateOptions(finalPool[0], exam2VocabList);
    }
  };

  const generateOptions = (correctItem: Vocabulary, pool: Vocabulary[]) => {
    const distractors = pool
      .filter((v) => v.id !== correctItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const mixed = [correctItem, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(mixed);
  };

  const currentItem = questionPool[currentIndex];

  const handleSelectOption = (option: Vocabulary) => {
    if (showAnswer || examFinished) return;
    setSelectedOptionId(option.id);
    setShowAnswer(true);

    const isCorrect = option.id === currentItem.id;
    if (isCorrect) {
      playJapaneseAudio(option.word_kana || option.word_romaji);
      setScore((prev) => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
        streak: prev.streak + 1,
      }));
    } else {
      setScore((prev) => ({
        ...prev,
        total: prev.total + 1,
        streak: 0,
      }));
      setTimeout(() => playJapaneseAudio(currentItem.word_kana || currentItem.word_romaji), 200);
    }
  };

  const handleNext = () => {
    if (drillMode === 'speed_5' && currentIndex === questionPool.length - 1) {
      setExamFinished(true);
      setIsTimerRunning(false);
      return;
    }

    const nextIndex = (currentIndex + 1) % questionPool.length;
    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    setSelectedOptionId(null);
    setIsChoiceRevealed(choiceRevealMode === 'instant');

    if (questionPool[nextIndex]) {
      generateOptions(questionPool[nextIndex], exam2VocabList);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">ส่วนที่ 1 ของการสอบจริง (5 คะแนน)</span>
            <span className="badge badge-ref">คำศัพท์ ไทย → ญี่ปุ่น (สุ่มจากบทที่ 3 และ 4)</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            Part 1: Thai → Japanese Vocabulary Trainer (การทดสอบคำศัพท์ส่วนที่ 1)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '2px' }}>
            อาจารย์จะบอกความหมายภาษาไทย ผู้สอบต้องตอบเป็นคำศัพท์ภาษาญี่ปุ่น (Romaji/Kana) ให้ถูกต้องและรวดเร็ว
          </p>
        </div>

        {/* Global Action Controls */}
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

      {/* Filter & Mode Toolbar */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '12px 18px' }}>
        {/* Left: Mode Switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setDrillMode('speed_5')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: drillMode === 'speed_5' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
              backgroundColor: drillMode === 'speed_5' ? 'var(--primary-50)' : 'var(--bg-app)',
              color: drillMode === 'speed_5' ? 'var(--primary-700)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Timer size={15} />
            <span>โหมดจำลองสอบจริง (5 คำ = 5 คะแนน)</span>
          </button>

          <button
            type="button"
            onClick={() => setDrillMode('endless')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: drillMode === 'endless' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
              backgroundColor: drillMode === 'endless' ? 'var(--primary-50)' : 'var(--bg-app)',
              color: drillMode === 'endless' ? 'var(--primary-700)' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Shuffle size={15} />
            <span>โหมดฝึกวนไม่จำกัดข้อ (Endless)</span>
          </button>
        </div>

        {/* Right: Chapter & Category Filters */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-main)',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            <option value={0}>📚 ทั้งบทที่ 3 และ 4</option>
            <option value={3}>บทที่ 3: เวลา & สถานที่</option>
            <option value={4}>บทที่ 4: การซื้อของ & ตัวเลข</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-main)',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            <option value="all">🏷️ ทุกหมวดหมู่</option>
            <option value="location">🏢 สถานที่ (Ch.3)</option>
            <option value="demonstrative">👉 คำชี้ตำแหน่ง (Ch.3)</option>
            <option value="time">⏰ เวลา & นาฬิกา (Ch.3)</option>
            <option value="activity">📅 กิจกรรม (Ch.3)</option>
            <option value="shopping">🛍️ สินค้า & ร้านค้า (Ch.4)</option>
            <option value="electronics">📻 อุปกรณ์ไอที (Ch.4)</option>
            <option value="stationery">✉️ เครื่องเขียน (Ch.4)</option>
            <option value="goods">👜 ของใช้ (Ch.4)</option>
            <option value="number">🔢 ตัวเลข (Ch.4)</option>
            <option value="phrase">💬 สำนวน & คำช่วย</option>
          </select>

          <button
            type="button"
            onClick={initSession}
            className="btn btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            title="สุ่มชุดคำถามใหม่"
          >
            <RotateCcw size={14} /> รีเซ็ต
          </button>
        </div>
      </div>

      {/* Main Interactive Play Area */}
      {!examFinished ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
          {/* Question Card */}
          <div
            className="card"
            style={{
              padding: '36px 28px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
              position: 'relative',
              border: '2px solid var(--border-subtle)',
            }}
          >
            {/* Top Bar: Progress & Streaks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-primary">
                  ข้อที่ {currentIndex + 1} {drillMode === 'speed_5' ? `/ 5` : `(สุ่มต่อเนื่อง)`}
                </span>
                <span className="badge badge-ref">
                  บทที่ {currentItem?.chapter_number} • {currentItem?.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
                {drillMode === 'speed_5' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-600)', fontWeight: 700 }}>
                    <Timer size={16} />
                    <span>{timerSeconds} วินาที</span>
                  </div>
                )}
                {score.streak > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)', fontWeight: 700 }}>
                    <Flame size={16} />
                    <span>Streak x{score.streak}</span>
                  </div>
                )}
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  คะแนน: {score.correct}/{score.total}
                </div>
              </div>
            </div>

            {/* Prompt Display: Thai Meaning Prominent */}
            <div style={{ margin: '20px 0 28px 0' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.5px' }}>
                อาจารย์ถามความหมายภาษาไทย:
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
                  border: '1.5px solid var(--border-subtle)',
                  minWidth: '280px',
                }}
              >
                "{currentItem?.meaning_th}"
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '10px' }}>
                คำศัพท์ภาษาญี่ปุ่นข้อนี้คือคำว่าอะไร?
              </div>
            </div>

            {/* Active Recall Button (If Hidden) */}
            {choiceRevealMode === 'hidden' && !isChoiceRevealed && !showAnswer && (
              <div style={{ margin: '20px 0' }}>
                <button
                  type="button"
                  onClick={() => setIsChoiceRevealed(true)}
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Eye size={18} />
                  <span>นึกคำตอบในใจแล้ว คลิกเพื่อเปิดดูชอยส์</span>
                </button>
              </div>
            )}

            {/* Choices Grid */}
            {(isChoiceRevealed || showAnswer) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
                {options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.id === currentItem.id;

                  let btnBg = 'var(--bg-app)';
                  let btnBorder = '1.5px solid var(--border-subtle)';
                  let btnColor = 'var(--text-main)';

                  if (showAnswer) {
                    if (isCorrect) {
                      btnBg = 'rgba(16, 185, 129, 0.12)';
                      btnBorder = '2px solid var(--color-success)';
                      btnColor = 'var(--color-success)';
                    } else if (isSelected && !isCorrect) {
                      btnBg = 'rgba(239, 68, 68, 0.12)';
                      btnBorder = '2px solid var(--color-danger)';
                      btnColor = 'var(--color-danger)';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={showAnswer}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: btnBg,
                        border: btnBorder,
                        color: btnColor,
                        cursor: showAnswer ? 'default' : 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800 }}>{opt.word_kana}</span>
                        <span style={{ fontSize: '12px', opacity: 0.6 }}>#{idx + 1}</span>
                      </div>
                      {opt.word_kanji && (
                        <div style={{ fontSize: '12.5px', opacity: 0.8, fontWeight: 600 }}>{opt.word_kanji}</div>
                      )}
                      {showRomaji && (
                        <div style={{ fontSize: '13.5px', color: 'var(--primary-600)', fontWeight: 600 }}>
                          {opt.word_romaji}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Answer Explanation & Audio */}
            {showAnswer && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: selectedOptionId === currentItem.id ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1.5px solid ${selectedOptionId === currentItem.id ? 'var(--color-success)' : 'var(--color-danger)'}`,
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '15px' }}>
                    {selectedOptionId === currentItem.id ? (
                      <>
                        <CheckCircle2 size={18} color="var(--color-success)" />
                        <span style={{ color: 'var(--color-success)' }}>ถูกต้อง! (+1 คะแนน)</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} color="var(--color-danger)" />
                        <span style={{ color: 'var(--color-danger)' }}>ยังไม่ถูกต้อง</span>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: '13.5px', marginTop: '4px', color: 'var(--text-main)' }}>
                    คำตอบที่ถูกต้องคือ: <strong>{currentItem.word_kana}</strong> ({currentItem.word_romaji})
                  </div>
                  {currentItem.example_jp && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      ตัวอย่าง: {currentItem.example_jp} ({currentItem.example_th})
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => playJapaneseAudio(currentItem.word_kana || currentItem.word_romaji)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Volume2 size={16} /> ฟังเสียง
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>{drillMode === 'speed_5' && currentIndex === questionPool.length - 1 ? 'ดูสรุปผล' : 'ข้อถัดไป'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Summary Scorecard for Speed 5 Mode */
        <div className="card" style={{ maxWidth: '560px', margin: '20px auto', padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Award size={36} color="var(--primary-600)" />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
            ผลการทดสอบส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
            การสอบจริงส่วนที่ 1 คิดเป็น 5 คะแนนเต็ม
          </p>

          <div style={{ padding: '20px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-app)', marginBottom: '24px' }}>
            <div style={{ fontSize: '42px', fontWeight: 900, color: score.correct >= 4 ? 'var(--color-success)' : 'var(--primary-600)' }}>
              {score.correct} / 5
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              ใช้เวลาทั้งหมด: <strong>{timerSeconds} วินาที</strong> (เฉลี่ย {(timerSeconds / 5).toFixed(1)} วินาที/ข้อ)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={initSession}
              className="btn btn-primary"
              style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} /> ทำการทดสอบอีกครั้ง (สุ่ม 5 คำใหม่)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
