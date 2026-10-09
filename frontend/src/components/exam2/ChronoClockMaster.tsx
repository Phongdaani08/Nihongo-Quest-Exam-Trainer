import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
  Clock,
  ArrowRight,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { playJapaneseAudio } from '../../utils/speech';
import { exam2ClockQuestions, Exam2QuestionItem } from '../../services/exam2Data';

export const ChronoClockMaster: React.FC = () => {
  const [questions] = useState<Exam2QuestionItem[]>(exam2ClockQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(true);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const currentQ = questions[currentIndex];
  const { hour, minute, period } = currentQ.visualData;

  // Calculate angles for analog clock hands
  const minuteAngle = minute * 6; // 360 / 60 = 6 deg per minute
  const hourAngle = (hour % 12) * 30 + (minute / 60) * 30; // 360 / 12 = 30 deg per hour

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
            <span className="badge badge-primary">การสอบรอบที่ 2 (บทที่ 3)</span>
            <span className="badge badge-ref">รูปแบบที่ 2 (2 ข้อ / 2 คะแนน)</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>⏰ Chrono Clock Master (บอกเวลา)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            ฝึกถาม-ตอบเวลาด้วยโครงสร้าง: <strong style={{ color: 'var(--primary-600)' }}>Ima nan ji desuka?</strong> → <strong>Ima [gozen/gogo] [ชั่วโมง]-ji [นาที]-fun/pun [han] desu.</strong>
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

      {/* Irregular Time Cheat-Sheet Strip */}
      <div className="card" style={{ padding: '14px 20px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <AlertTriangle size={16} color="var(--warning-600)" />
          <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>จุดระวังข้อยกเว้นออกสอบบ่อย (Irregularities):</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px' }}>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            4 โมง: <strong style={{ color: 'var(--primary-700)' }}>yo-ji</strong> (ห้าม yon-ji)
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            7 โมง: <strong style={{ color: 'var(--primary-700)' }}>shichi-ji</strong>
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            9 โมง: <strong style={{ color: 'var(--primary-700)' }}>ku-ji</strong> (ห้าม kyū-ji)
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            30 นาที: <strong style={{ color: 'var(--primary-700)' }}>han</strong> หรือ <strong style={{ color: 'var(--primary-700)' }}>sanjup-pun</strong>
          </span>
          <span className="badge" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-strong)' }}>
            นาทีเสียงกัก (pun): <strong>1 (ip-pun), 3 (san-pun), 6 (rop-pun), 8 (hap-pun), 10 (jup-pun)</strong>
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Left Column: Interactive Analog Clock & Digital Time Display */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
            <span className="badge badge-primary" style={{ fontSize: '12px' }}>
              ข้อที่ {currentIndex + 1} / {questions.length}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              คะแนนสะสม: <strong style={{ color: 'var(--primary-600)' }}>{score.correct}</strong> / {score.total}
            </span>
          </div>

          {/* SVG Analog Clock */}
          <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '16px' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Outer dial */}
              <circle cx="100" cy="100" r="92" fill="var(--bg-subtle)" stroke="var(--border-strong)" strokeWidth="4" />
              <circle cx="100" cy="100" r="84" fill="var(--bg-surface)" stroke="var(--border-subtle)" strokeWidth="1" />

              {/* Clock Numbers 1-12 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                const angle = (num * 30 - 90) * (Math.PI / 180);
                const x = 100 + 68 * Math.cos(angle);
                const y = 100 + 68 * Math.sin(angle) + 4;
                return (
                  <text
                    key={num}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill="var(--text-main)"
                    fontSize="13"
                    fontWeight="700"
                  >
                    {num}
                  </text>
                );
              })}

              {/* Hour Hand */}
              <line
                x1="100"
                y1="100"
                x2={100 + 44 * Math.sin((hourAngle * Math.PI) / 180)}
                y2={100 - 44 * Math.cos((hourAngle * Math.PI) / 180)}
                stroke="var(--primary-600)"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Minute Hand */}
              <line
                x1="100"
                y1="100"
                x2={100 + 64 * Math.sin((minuteAngle * Math.PI) / 180)}
                y2={100 - 64 * Math.cos((minuteAngle * Math.PI) / 180)}
                stroke="var(--text-main)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Center Pin */}
              <circle cx="100" cy="100" r="6" fill="var(--primary-600)" />
            </svg>
          </div>

          {/* Digital Time Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1.5px solid var(--border-strong)',
            marginBottom: '16px'
          }}>
            <Clock size={16} color="var(--primary-600)" />
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.05em' }}>
              {currentQ.visualData.display} น. ({period === 'gozen' ? 'ช่วงเช้า a.m.' : 'ช่วงบ่าย-ค่ำ p.m.'})
            </span>
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

        {/* Right Column: Choices & Feedback */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--primary-600)" /> เลือกคำตอบเวลาที่ถูกต้อง:
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
                  ฝึกพูดเวลาตามภาพนาฬิกาออกมาก่อน แล้วคลิกปุ่มด้านล่างเพื่อตรวจคำตอบ
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
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-700)' }}>ข้อควรจำทางไวยากรณ์:</span>
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
