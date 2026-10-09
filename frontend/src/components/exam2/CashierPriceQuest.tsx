import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowRight,
  HelpCircle,
  Tag,
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { playJapaneseAudio } from '../../utils/speech';
import { exam2PriceQuestions, Exam2QuestionItem } from '../../services/exam2Data';

export const CashierPriceQuest: React.FC = () => {
  const [questions] = useState<Exam2QuestionItem[]>(exam2PriceQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(true);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const currentQ = questions[currentIndex];

  const handleSelectOption = (textRomaji: string) => {
    if (isAnswered) return;
    setSelectedOption(textRomaji);
    setIsAnswered(true);

    const isCorrect = textRomaji === currentQ.targetAnswerRomaji;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect) {
      playJapaneseAudio(currentQ.targetAnswerRomaji);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">การสอบรอบที่ 2 (บทที่ 4)</span>
            <span className="badge badge-ref">รูปแบบที่ 4 (2 ข้อ / 2 คะแนน)</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>🏷️ Cashier Price Quest (ป้ายราคา & การซื้อของ)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            ฝึกถาม-ตอบราคาด้วยโครงสร้าง: <strong style={{ color: 'var(--primary-600)' }}>Kore wa ikura desuka?</strong> → <strong>[ตัวเลขราคา] en desu.</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setIsChoiceRevealed(prev => !prev)}
            className="btn-outline"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            {isChoiceRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
            {isChoiceRevealed ? 'ซ่อนตัวเลือก (Flashcard)' : 'เปิดดูตัวเลือก'}
          </button>

          <button onClick={handleReset} className="btn-outline" style={{ padding: '8px 14px', fontSize: '12px' }}>
            <RotateCcw size={15} /> รีเซ็ต
          </button>
        </div>
      </div>

      {/* Number Rules Cheat-Sheet */}
      <div className="card" style={{ padding: '14px 20px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertTriangle size={16} color="var(--warning-600)" />
          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>จุดจำตัวเลขยกเว้นออกสอบบ่อย (Irregular Numbers):</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px' }}>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            300 = <strong style={{ color: 'var(--primary-700)' }}>sanbyaku</strong> (เสียงกัก/เพี้ยน)
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            600 = <strong style={{ color: 'var(--primary-700)' }}>roppyaku</strong>
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            800 = <strong style={{ color: 'var(--primary-700)' }}>happyaku</strong>
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            3,000 = <strong style={{ color: 'var(--primary-700)' }}>sanzen</strong>
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            8,000 = <strong style={{ color: 'var(--primary-700)' }}>hassen</strong>
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            10,000 = <strong style={{ color: 'var(--primary-700)' }}>ichi man</strong> (ต้องมี ichi นำหน้า)
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Left Column: POS Cashier Screen & Price Tag */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
            <span className="badge badge-primary" style={{ fontSize: '12px' }}>
              ข้อที่ {currentIndex + 1} / {questions.length}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              คะแนนสะสม: <strong style={{ color: 'var(--primary-600)' }}>{score.correct}</strong> / {score.total}
            </span>
          </div>

          {/* POS Display Box */}
          <div style={{
            width: '100%',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-strong)',
            padding: '24px 20px',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-primary" style={{ fontSize: '13px' }}>
                สินค้า: {currentQ.visualData.itemTh} ({currentQ.visualData.itemRomaji})
              </span>
              <Receipt size={20} color="var(--text-muted)" />
            </div>

            {/* Big Price Tag */}
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--primary-500)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Tag size={16} color="var(--primary-600)" /> ป้ายราคา (Price Tag):
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--primary-700)', letterSpacing: '0.04em' }}>
                ¥{Number(currentQ.visualData.price).toLocaleString()}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>
                ({Number(currentQ.visualData.price).toLocaleString()} เยน)
              </span>
            </div>
          </div>

          {/* Teacher Question Prompt */}
          <div style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>คำถามจากอาจารย์:</p>
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
              "{currentQ.promptJp}"
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              ({currentQ.promptTh})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => playJapaneseAudio(currentQ.promptJp)}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <Volume2 size={16} /> ฟังเสียงคำถาม
            </button>
            <button
              onClick={() => playJapaneseAudio(currentQ.targetAnswerRomaji)}
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <Volume2 size={16} /> ฟังเสียงคำตอบ
            </button>
          </div>
        </div>

        {/* Right Column: Choices & Breakdown */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--primary-600)" /> เลือกคำตอบราคาที่ถูกต้อง:
            </h3>

            {!isChoiceRevealed && !isAnswered ? (
              <div style={{
                padding: '36px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '2px dashed var(--border-strong)',
                marginBottom: '16px'
              }}>
                <EyeOff size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>โหมด Flashcard (ซ่อนตัวเลือก)</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  ลองแปลงตัวเลขราคาเป็นภาษาญี่ปุ่นลงท้ายด้วย "en desu." ก่อนเปิดเฉลย
                </p>
                <button onClick={() => setIsAnswered(true)} className="btn-primary" style={{ padding: '8px 18px' }}>
                  เปิดดูเฉลยคำตอบ
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt.textRomaji;
                  const showCorrect = isAnswered && opt.isCorrect;
                  const showWrong = isAnswered && isSelected && !opt.isCorrect;

                  let borderColor = 'var(--border-subtle)';
                  let bgColor = 'var(--bg-surface)';
                  if (showCorrect) {
                    borderColor = 'var(--success-border)';
                    bgColor = 'var(--success-50)';
                  } else if (showWrong) {
                    borderColor = 'var(--danger-border)';
                    bgColor = 'var(--danger-50)';
                  } else if (isSelected) {
                    borderColor = 'var(--primary-600)';
                    bgColor = 'var(--primary-50)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.textRomaji)}
                      disabled={isAnswered}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${borderColor}`,
                        backgroundColor: bgColor,
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: isAnswered ? 'default' : 'pointer',
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

                      {showCorrect && <CheckCircle2 size={20} color="var(--success-600)" />}
                      {showWrong && <XCircle size={20} color="var(--danger-600)" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation Box */}
            {isAnswered && (
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <HelpCircle size={15} color="var(--primary-600)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-700)' }}>คำอธิบายหลักการอ่านเลข:</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {currentQ.explanationTh}
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {isAnswered && (
            <button onClick={handleNextQuestion} className="btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
              ข้อถัดไป <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
