import React, { useState } from 'react';
import { Header } from './components/Header';
import { JikoShokaiTrainer } from './components/JikoShokaiTrainer';
import { SpeedVocabTrainer } from './components/SpeedVocabTrainer';
import { VisualQAArena } from './components/VisualQAArena';
import { MockExamSimulator } from './components/MockExamSimulator';
import { VocabVault } from './components/VocabVault';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mock_exam' | 'endless_practice' | 'jiko_shokai' | 'speed_vocab' | 'visual_qa' | 'vocab_vault'>('mock_exam');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, padding: '24px 0 60px' }}>
        <div className="container">
          {activeTab === 'mock_exam' && <MockExamSimulator initialMode="timed_3min" key="timed" />}
          {activeTab === 'endless_practice' && <MockExamSimulator initialMode="endless_infinite" key="endless" />}
          {activeTab === 'jiko_shokai' && <JikoShokaiTrainer />}
          {activeTab === 'speed_vocab' && <SpeedVocabTrainer />}
          {activeTab === 'visual_qa' && <VisualQAArena />}
          {activeTab === 'vocab_vault' && <VocabVault />}
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '20px 0',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}>
        <div className="container">
          <p>
            <strong>Nihongo Quest Exam Trainer</strong> — พัฒนาขึ้นสำหรับการสอบวิชา JN60101 ภาษาญี่ปุ่นเพื่อการสื่อสาร 1 (PIM)
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '4px' }}>
            แหล่งอ้างอิง: เอกสารประกอบการสอน บทที่ 1 และ บทที่ 2 โดย อาจารย์ ดร.เอกนรินทร์ จิรชีวีวงศ์
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
