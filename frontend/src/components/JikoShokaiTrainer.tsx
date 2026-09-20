import React, { useState } from 'react';
import { Volume2, CheckCircle2, RotateCcw, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { playJapaneseAudio } from '../utils/speech';

interface JikoLineConfig {
  step: number;
  titleTh: string;
  romajiTarget: string;
  kanaTarget: string;
  meaningTh: string;
  audioText: string;
  refText: string;
  explanationTh: string;
  tokens: { id: string; text: string; correctIndex: number }[];
}

export const JikoShokaiTrainer: React.FC = () => {
  const [selectedHobby, setSelectedHobby] = useState<'manga' | 'dokusho' | 'eiga'>('manga');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [assembledTokens, setAssembledTokens] = useState<Record<number, string[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });
  const [stepStatus, setStepStatus] = useState<Record<number, 'idle' | 'correct' | 'wrong'>>({
    1: 'idle',
    2: 'idle',
    3: 'idle',
    4: 'idle',
    5: 'idle',
  });

  const hobbyConfig = {
    manga: { romaji: 'manga', kana: 'まんが', th: 'มังงะ / การ์ตูน' },
    dokusho: { romaji: 'dokusho', kana: 'どくしょ', th: 'การอ่านหนังสือ' },
    eiga: { romaji: 'eiga', kana: 'えいが', th: 'การดูภาพยนตร์' },
  };

  const lines: JikoLineConfig[] = [
    {
      step: 1,
      titleTh: 'ท่อนที่ 1: คำกล่าวทักทายเริ่มต้น',
      romajiTarget: 'Hajimemashite.',
      kanaTarget: 'はじめまして。',
      meaningTh: 'ยินดีที่ได้รู้จักครับ',
      audioText: 'はじめまして',
      refText: 'JN60101 Ch.1 p.83, 105',
      explanationTh: 'คำทักทาย "Hajimemashite" ใช้เมื่อพบกันและแนะนำตัวเป็นครั้งแรกสุด',
      tokens: [
        { id: 't1_1', text: 'Hajime', correctIndex: 0 },
        { id: 't1_2', text: 'mashite', correctIndex: 1 },
      ],
    },
    {
      step: 2,
      titleTh: 'ท่อนที่ 2: แนะนำชื่อตนเอง (Poom)',
      romajiTarget: 'Watashi wa Poom desu.',
      kanaTarget: 'わたし は ภูมิ です。',
      meaningTh: 'ผมชื่อภูมิครับ',
      audioText: 'わたしはプームです',
      refText: 'JN60101 Ch.1 p.5, 105',
      explanationTh: 'โครงสร้าง: Watashi (ประธาน) + wa (คำช่วยชี้หัวข้อ) + [ชื่อ] + desu (คือ/เป็น)',
      tokens: [
        { id: 't2_1', text: 'Watashi', correctIndex: 0 },
        { id: 't2_2', text: 'wa', correctIndex: 1 },
        { id: 't2_3', text: 'Poom', correctIndex: 2 },
        { id: 't2_4', text: 'desu', correctIndex: 3 },
      ],
    },
    {
      step: 3,
      titleTh: 'ท่อนที่ 3: สังกัดสถาบันการจัดการปัญญาภิวัฒน์',
      romajiTarget: 'Panyapiwatto keiei daigaku no gakusei desu.',
      kanaTarget: 'パンヤピワット けいえい だいがく の がくせい です。',
      meaningTh: 'เป็นนักศึกษาสถาบันการจัดการปัญญาภิวัฒน์ครับ',
      audioText: 'パンヤピワットけいえいだいがくのがくせいです',
      refText: 'JN60101 Ch.1 p.71, 105',
      explanationTh: 'โครงสร้าง: [ชื่อมหาวิทยาลัย] + no (ของ/สังกัด) + gakusei (นักศึกษา) + desu',
      tokens: [
        { id: 't3_1', text: 'Panyapiwatto', correctIndex: 0 },
        { id: 't3_2', text: 'keiei daigaku', correctIndex: 1 },
        { id: 't3_3', text: 'no', correctIndex: 2 },
        { id: 't3_4', text: 'gakusei', correctIndex: 3 },
        { id: 't3_5', text: 'desu', correctIndex: 4 },
      ],
    },
    {
      step: 4,
      titleTh: `ท่อนที่ 4: งานอดิเรก (${hobbyConfig[selectedHobby].th})`,
      romajiTarget: `Shumi wa ${selectedHobby} desu.`,
      kanaTarget: `しゅみ は ${hobbyConfig[selectedHobby].kana} です。`,
      meaningTh: `งานอดิเรกคือ${hobbyConfig[selectedHobby].th}ครับ`,
      audioText: `しゅみは${hobbyConfig[selectedHobby].kana}です`,
      refText: 'JN60101 Ch.1 p.105',
      explanationTh: 'โครงสร้าง: Shumi (งานอดิเรก) + wa + [manga/dokusho/eiga] + desu',
      tokens: [
        { id: 't4_1', text: 'Shumi', correctIndex: 0 },
        { id: 't4_2', text: 'wa', correctIndex: 1 },
        { id: 't4_3', text: selectedHobby, correctIndex: 2 },
        { id: 't4_4', text: 'desu', correctIndex: 3 },
      ],
    },
    {
      step: 5,
      titleTh: 'ท่อนที่ 5: กล่าวปิดท้าย ฝากเนื้อฝากตัว',
      romajiTarget: 'Dōzo yoroshiku onegai itashimasu.',
      kanaTarget: 'どうぞ よろしく おねがい いたします。',
      meaningTh: 'ขอฝากเนื้อฝากตัวด้วยครับ (แบบสุภาพ)',
      audioText: 'どうぞよろしくおねがいいたします',
      refText: 'JN60101 Ch.1 p.84, 105',
      explanationTh: 'Dōzo yoroshiku onegai itashimasu เป็นคำลงท้ายการแนะนำตัวเองแบบสุภาพมาตรฐาน',
      tokens: [
        { id: 't5_1', text: 'Dōzo', correctIndex: 0 },
        { id: 't5_2', text: 'yoroshiku', correctIndex: 1 },
        { id: 't5_3', text: 'onegai', correctIndex: 2 },
        { id: 't5_4', text: 'itashimasu', correctIndex: 3 },
      ],
    },
  ];

  const currentLine = lines.find(l => l.step === activeStep)!;
  const currentAssembled = assembledTokens[activeStep] || [];

  const handleAddToken = (tokenText: string) => {
    const updated = [...currentAssembled, tokenText];
    setAssembledTokens({ ...assembledTokens, [activeStep]: updated });
    setStepStatus({ ...stepStatus, [activeStep]: 'idle' });
  };

  const handleRemoveToken = (indexToRemove: number) => {
    const updated = currentAssembled.filter((_, idx) => idx !== indexToRemove);
    setAssembledTokens({ ...assembledTokens, [activeStep]: updated });
    setStepStatus({ ...stepStatus, [activeStep]: 'idle' });
  };

  const handleVerifyCurrentStep = () => {
    const assembledString = currentAssembled.join(' ').toLowerCase();
    const targetString = currentLine.tokens
      .slice()
      .sort((a, b) => a.correctIndex - b.correctIndex)
      .map(t => t.text.toLowerCase())
      .join(' ');

    if (assembledString === targetString) {
      setStepStatus({ ...stepStatus, [activeStep]: 'correct' });
      playJapaneseAudio(currentLine.audioText);
    } else {
      setStepStatus({ ...stepStatus, [activeStep]: 'wrong' });
    }
  };

  const handleResetStep = () => {
    setAssembledTokens({ ...assembledTokens, [activeStep]: [] });
    setStepStatus({ ...stepStatus, [activeStep]: 'idle' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">ส่วนที่ 1 ของการสอบ (5 คะแนน)</span>
            <span className="badge badge-ref">Interactive Grammar Puzzle</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>การสอบแนะนำตนเอง (Jiko Shōkai — 自己紹介)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            ฝึกต่อบล็อกคำศัพท์ให้ถูกต้องตามหลักไวยากรณ์ครบทั้ง 5 ท่อน พร้อมระบบแจ้งเตือนข้อผิดพลาด
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => playJapaneseAudio(lines.map(l => l.audioText).join('、 '))}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <Volume2 size={16} />
            ฟังเสียงตัวอย่างทั้ง 5 ท่อน
          </button>
        </div>
      </div>

      {/* Hobby Selector Bar */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>เลือกงานอดิเรกที่ต้องการใช้ในท่อนที่ 4:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['manga', 'dokusho', 'eiga'] as const).map(hobby => (
              <button
                key={hobby}
                onClick={() => setSelectedHobby(hobby)}
                className={selectedHobby === hobby ? 'btn-primary' : 'btn-outline'}
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                {hobbyConfig[hobby].romaji} ({hobbyConfig[hobby].th})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Tabs 1 - 5 */}
      <div className="step-progress-strip">
        {lines.map((l) => {
          const isDone = stepStatus[l.step] === 'correct';
          const isWrong = stepStatus[l.step] === 'wrong';
          const isActive = activeStep === l.step;
          return (
            <button
              key={l.step}
              onClick={() => setActiveStep(l.step)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: isWrong ? '2px solid var(--danger-600)' : isActive ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                backgroundColor: isDone ? 'var(--success-50)' : isWrong ? 'var(--danger-50)' : isActive ? 'var(--primary-50)' : 'var(--bg-surface)',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: isWrong ? 'var(--danger-600)' : isActive ? 'var(--primary-700)' : 'var(--text-muted)' }}>
                  ท่อนที่ {l.step}
                </span>
                {isDone && <CheckCircle2 size={15} color="var(--success-600)" />}
                {isWrong && <AlertCircle size={15} color="var(--danger-600)" />}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {l.romajiTarget.split(' ')[0]}...
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Assembly Arena */}
      <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-primary">{currentLine.titleTh}</span>
            <span className="badge-ref" style={{ marginLeft: '8px' }}>{currentLine.refText}</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            ความหมาย: <strong style={{ color: 'var(--text-main)' }}>{currentLine.meaningTh}</strong>
          </div>
        </div>

        {/* PROMINENT WRONG ANSWER NOTIFICATION BANNER */}
        {stepStatus[activeStep] === 'wrong' && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'var(--danger-50)',
            border: '1.5px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <AlertCircle size={22} color="var(--danger-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--danger-600)' }}>
                ❌ ลำดับไวยากรณ์ยังไม่ถูกต้อง!
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '4px' }}>
                คำอธิบาย: {currentLine.explanationTh}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                ลำดับที่ถูกต้อง: <strong>{currentLine.romajiTarget}</strong> ({currentLine.kanaTarget})
              </div>
            </div>
          </div>
        )}

        {/* PROMINENT SUCCESS BANNER */}
        {stepStatus[activeStep] === 'correct' && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'var(--success-50)',
            border: '1.5px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <CheckCircle2 size={22} color="var(--success-600)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--success-600)' }}>
                ✓ ถูกต้องสมบูรณ์แบบ!
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                "{currentLine.romajiTarget}" — {currentLine.kanaTarget}
              </div>
            </div>
          </div>
        )}

        {/* Assembled Sentence Box (Drop Zone) */}
        <div style={{
          minHeight: '80px',
          padding: '18px',
          border: stepStatus[activeStep] === 'correct'
            ? '2px solid var(--success-border)'
            : stepStatus[activeStep] === 'wrong'
            ? '2px solid var(--danger-border)'
            : '2px dashed var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: stepStatus[activeStep] === 'correct'
            ? 'var(--success-50)'
            : stepStatus[activeStep] === 'wrong'
            ? 'var(--danger-50)'
            : 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {currentAssembled.length === 0 ? (
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              คลิกบล็อกคำศัพท์ด้านล่างเพื่อจัดเรียงลำดับประโยคให้ถูกต้อง...
            </span>
          ) : (
            currentAssembled.map((token, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveToken(idx)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '15px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="คลิกเพื่อนำออก"
              >
                {token} <span style={{ color: 'var(--text-faint)', fontSize: '12px' }}>×</span>
              </button>
            ))
          )}
        </div>

        {/* Word Token Bank (Scrambled) */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
            บล็อกคำศัพท์ (คลิกเพื่อเลือกเรียง):
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentLine.tokens.map((token) => {
              const countInAssembled = currentAssembled.filter(t => t === token.text).length;
              const isUsed = countInAssembled > 0;
              return (
                <button
                  key={token.id}
                  onClick={() => handleAddToken(token.text)}
                  disabled={isUsed || stepStatus[activeStep] === 'correct'}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: isUsed ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                    color: isUsed ? 'var(--text-faint)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: isUsed ? 'default' : 'pointer',
                    boxShadow: isUsed ? 'none' : 'var(--shadow-sm)'
                  }}
                >
                  {token.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation & Feedback Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleVerifyCurrentStep}
              className="btn-primary"
              disabled={currentAssembled.length === 0 || stepStatus[activeStep] === 'correct'}
              style={{ padding: '10px 20px' }}
            >
              ตรวจคำตอบ
            </button>
            <button
              onClick={handleResetStep}
              className="btn-outline"
              style={{ padding: '10px 16px' }}
            >
              <RotateCcw size={15} /> ล้างคำตอบ
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => playJapaneseAudio(currentLine.audioText)}
              className="btn-outline"
              style={{ padding: '10px 16px', fontSize: '13px' }}
            >
              <Volume2 size={16} /> ฟังเสียงประโยคนี้
            </button>

            {activeStep < 5 && (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="btn-secondary"
                style={{ padding: '10px 18px' }}
              >
                ไปท่อนถัดไป <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recitation Script Box */}
      <div className="card" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
          สคริปต์ฉบับเต็มสำหรับท่องพูดสอบจริง (30 วินาที):
        </h3>
        <p style={{ fontSize: '16px', lineHeight: 1.8, fontWeight: 700, color: 'var(--primary-700)' }}>
          "Hajimemashite. Watashi wa Poom desu. Panyapiwatto keiei daigaku no gakusei desu. Shumi wa {selectedHobby} desu. Dōzo yoroshiku onegai itashimasu."
        </p>
      </div>
    </div>
  );
};
