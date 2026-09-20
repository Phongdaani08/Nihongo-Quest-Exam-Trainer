import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Shuffle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Vocabulary } from '../types';
import { fetchVocabularies } from '../services/api';
import { playJapaneseAudio, playThaiAudio } from '../utils/speech';

export const SpeedVocabTrainer: React.FC = () => {
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | 0>(0); // 0 = All
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number; streak: number }>({ correct: 0, total: 0, streak: 0 });
  const [options, setOptions] = useState<Vocabulary[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Choice Reveal Mode (Instant vs Concealed Active Recall)
  const [choiceRevealMode, setChoiceRevealMode] = useState<'instant' | 'hidden'>(() => {
    return (localStorage.getItem('nihongo_endless_choice_mode') as 'instant' | 'hidden') || 'instant';
  });
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('nihongo_endless_choice_mode', choiceRevealMode);
  }, [choiceRevealMode]);

  useEffect(() => {
    loadVocabs();
  }, [selectedChapter, selectedCategory]);

  const loadVocabs = async () => {
    const data = await fetchVocabularies(
      selectedChapter === 0 ? undefined : selectedChapter,
      selectedCategory === 'all' ? undefined : selectedCategory
    );
    // Shuffle
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setVocabs(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedOptionId(null);
    setIsChoiceRevealed(false);
    if (shuffled.length > 0) {
      generateOptions(shuffled[0], shuffled);
    }
  };

  const generateOptions = (correctItem: Vocabulary, pool: Vocabulary[]) => {
    const distractors = pool.filter(v => v.id !== correctItem.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    const mixed = [correctItem, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(mixed);
  };

  const currentItem = vocabs[currentIndex];
  const selectedOptionObj = options.find(o => o.id === selectedOptionId);
  const isSelectedCorrect = selectedOptionId === currentItem?.id;

  const handleSelectOption = (option: Vocabulary) => {
    if (showAnswer) return;
    setSelectedOptionId(option.id);
    setShowAnswer(true);

    const isCorrect = option.id === currentItem.id;
    if (isCorrect) {
      playJapaneseAudio(option.word_kana);
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
        streak: prev.streak + 1,
      }));
    } else {
      setScore(prev => ({
        ...prev,
        total: prev.total + 1,
        streak: 0,
      }));
      // Play correct pronunciation for auditory learning
      setTimeout(() => playJapaneseAudio(currentItem.word_kana), 300);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % vocabs.length;
    setCurrentIndex(nextIndex);
    setShowAnswer(false);
    setSelectedOptionId(null);
    setIsChoiceRevealed(false);
    if (vocabs[nextIndex]) {
      generateOptions(vocabs[nextIndex], vocabs);
    }
  };

  const handleRestart = () => {
    setScore({ correct: 0, total: 0, streak: 0 });
    setIsChoiceRevealed(false);
    loadVocabs();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">ส่วนที่ 2 ของการสอบ (5 คะแนน)</span>
            <span className="badge badge-ref">รูปแบบ: ครูพูดไทย $\rightarrow$ เราตอบญี่ปุ่นทันที</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Flash Speed Translate (ฝึกแปลศัพท์ไทยเป็นญี่ปุ่น)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            ข้อสอบจะสุ่มคำศัพท์จากบทที่ 1 และ 2 ให้ตอบอย่างรวดเร็ว พร้อมระบบแจ้งเตือนเมื่อตอบผิด
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>คะแนนสะสม / สถิติต่อเนื่อง</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
              {score.correct} / {score.total} <span style={{ fontSize: '13px', color: 'var(--warning-600)', marginLeft: '6px' }}>🔥 Streak: {score.streak}</span>
            </div>
          </div>
          <button onClick={handleRestart} className="btn-outline" title="เริ่มใหม่">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 0, label: 'ทุกบท (Ch.1 + Ch.2)' },
            { id: 1, label: 'บทที่ 1: แนะนำตัว' },
            { id: 2, label: 'บทที่ 2: สิ่งของ & Katakana' },
          ].map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(ch.id)}
              className={selectedChapter === ch.id ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Choice Reveal Mode Switcher */}
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

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>หมวด:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '13px',
            }}
          >
            <option value="all">ทั้งหมด (ทุกหมวด {vocabs.length} คำ)</option>
            <option value="pronoun">สรรพนาม & บุคคล (Pronouns)</option>
            <option value="country">ประเทศ & สัญชาติ (Countries)</option>
            <option value="occupation">อาชีพ / สถานะ (Occupations)</option>
            <option value="place">สถานที่ & สถาบัน (Places)</option>
            <option value="demonstrative">คำชี้บ่ง (kore/sore/are/kono/sono/ano)</option>
            <option value="object">สิ่งของรอบตัว (Objects)</option>
            <option value="katakana">คำทับศัพท์ Katakana</option>
            <option value="number">ตัวเลข (0-10)</option>
            <option value="language">ภาษา (Eigo/Nihongo...)</option>
            <option value="phrase">สำนวนทักทาย & ตอบรับ (Phrases)</option>
          </select>

          <button onClick={loadVocabs} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
            <Shuffle size={14} /> สุ่มใหม่
          </button>
        </div>
      </div>

      {/* Main Flashcard Quiz Area */}
      {currentItem && (
        <div className="card" style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', minHeight: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span className="badge badge-primary">คำที่ {currentIndex + 1} จาก {vocabs.length}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge-ref">{currentItem.textbook_ref}</span>
              <span className="badge">บทที่ {currentItem.chapter_number || 1} • {currentItem.category}</span>
            </div>
          </div>

          {/* Teacher Thai Voice / Prompt */}
          <div style={{ margin: '16px 0 24px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
              ครูพูดภาษาไทยว่า:
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              "{currentItem.meaning_th}"
            </div>
            <button
              onClick={() => playThaiAudio(currentItem.meaning_th)}
              className="btn-outline"
              style={{ marginTop: '10px', padding: '6px 14px', fontSize: '12px' }}
            >
              <Volume2 size={14} /> ฟังเสียงครู (ไทย)
            </button>
          </div>

          {/* PROMINENT WRONG ANSWER NOTIFICATION */}
          {showAnswer && !isSelectedCorrect && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto 20px',
              padding: '14px 18px',
              backgroundColor: 'var(--danger-50)',
              border: '1.5px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
            }}>
              <AlertCircle size={24} color="var(--danger-600)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--danger-600)' }}>
                  ❌ ตอบผิด! คุณตอบว่า: "{selectedOptionObj?.word_romaji}"
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                  คำตอบภาษาญี่ปุ่นที่ถูกต้องคือ: <strong style={{ color: 'var(--primary-700)' }}>{currentItem.word_romaji}</strong> ({currentItem.word_kana})
                </div>
              </div>
            </div>
          )}

          {/* PROMINENT CORRECT ANSWER NOTIFICATION */}
          {showAnswer && isSelectedCorrect && (
            <div style={{
              maxWidth: '640px',
              margin: '0 auto 20px',
              padding: '14px 18px',
              backgroundColor: 'var(--success-50)',
              border: '1.5px solid var(--success-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
            }}>
              <CheckCircle2 size={24} color="var(--success-600)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--success-600)' }}>
                  ✓ ถูกต้องแม่นยำ!
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                  <strong>{currentItem.word_romaji}</strong> ({currentItem.word_kana}) = {currentItem.meaning_th}
                </div>
              </div>
            </div>
          )}

          {/* Active Recall Concealed Card OR 4 Answer Options */}
          {choiceRevealMode === 'hidden' && !isChoiceRevealed && !showAnswer ? (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
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
            <div className="choice-grid-4">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.id === currentItem.id;
                let btnStyle: React.CSSProperties = {
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                };

                if (showAnswer) {
                  if (isCorrect) {
                    btnStyle.backgroundColor = 'var(--success-50)';
                    btnStyle.borderColor = 'var(--success-border)';
                    btnStyle.color = 'var(--success-600)';
                  } else if (isSelected) {
                    btnStyle.backgroundColor = 'var(--danger-50)';
                    btnStyle.borderColor = 'var(--danger-border)';
                    btnStyle.color = 'var(--danger-600)';
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !showAnswer && handleSelectOption(opt)}
                    style={{
                      ...btnStyle,
                      cursor: showAnswer ? 'default' : 'pointer',
                    }}
                  >
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>
                        {opt.word_romaji}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {opt.word_kana} {opt.word_kanji ? `(${opt.word_kanji})` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                        }}
                      >
                        <Volume2 size={16} />
                      </button>

                      {showAnswer && isCorrect && <CheckCircle2 size={20} color="var(--success-600)" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle size={20} color="var(--danger-600)" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Answer Reveal & Next Button */}
          {showAnswer && (
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => playJapaneseAudio(currentItem.word_kana)}
                className="btn-outline"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <Volume2 size={15} />
                ฟังเสียงซ้ำ: <strong>{currentItem.word_romaji}</strong> ({currentItem.word_kana})
              </button>

              <button
                onClick={handleNext}
                className="btn-primary"
                style={{ padding: '8px 22px', fontSize: '13px' }}
              >
                ข้อถัดไป <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
