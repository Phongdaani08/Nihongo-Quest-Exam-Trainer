import React, { useState } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopBar } from './components/TopBar';

// Exam 1 Components
import { OverviewPortal } from './components/OverviewPortal';
import { JikoShokaiTrainer } from './components/JikoShokaiTrainer';
import { SpeedVocabTrainer } from './components/SpeedVocabTrainer';
import { VisualQAArena } from './components/VisualQAArena';
import { MockExamSimulator } from './components/MockExamSimulator';
import { VocabVault } from './components/VocabVault';

// Exam 2 Components
import { Exam2Dashboard } from './components/exam2/Exam2Dashboard';
import { Exam2VocabVault } from './components/exam2/Exam2VocabVault';
import { Exam2Part1VocabTrainer } from './components/exam2/Exam2Part1VocabTrainer';
import { Exam2MockSimulator } from './components/exam2/Exam2MockSimulator';
import { LocationNavigator } from './components/exam2/LocationNavigator';
import { ChronoClockMaster } from './components/exam2/ChronoClockMaster';
import { PhoneKeypadTrainer } from './components/exam2/PhoneKeypadTrainer';
import { CashierPriceQuest } from './components/exam2/CashierPriceQuest';
import { TimeBlockIntervalTrainer } from './components/exam2/TimeBlockIntervalTrainer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('exam2_dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Universal Navigation Sidebar & Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsedDesktop={isDesktopCollapsed}
      />

      {/* Main App Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Top Header Bar with Hamburger */}
        <TopBar
          activeTab={activeTab}
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isMobileSidebarOpen || !isDesktopCollapsed}
        />

        {/* Scrollable Content Container */}
        <main className="main-content-padding" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* Exam 2 Tabs */}
            {activeTab === 'exam2_dashboard' && <Exam2Dashboard onNavigate={setActiveTab} />}
            {activeTab === 'exam2_vocab_vault' && <Exam2VocabVault />}
            {activeTab === 'exam2_part1_vocab' && <Exam2Part1VocabTrainer />}
            {activeTab === 'exam2_mock' && <Exam2MockSimulator initialMode="timed_3min" key="e2_timed" />}
            {activeTab === 'exam2_endless' && <Exam2MockSimulator initialMode="endless_infinite" key="e2_endless" />}
            {activeTab === 'exam2_p1_location' && <LocationNavigator />}
            {activeTab === 'exam2_p2_clock' && <ChronoClockMaster />}
            {activeTab === 'exam2_p3_phone' && <PhoneKeypadTrainer />}
            {activeTab === 'exam2_p4_price' && <CashierPriceQuest />}
            {activeTab === 'exam2_p5_schedule' && <TimeBlockIntervalTrainer />}

            {/* Exam 1 Tabs */}
            {activeTab === 'overview' && <OverviewPortal onNavigate={setActiveTab} />}
            {activeTab === 'mock_exam' && <MockExamSimulator initialMode="timed_3min" key="timed" />}
            {activeTab === 'endless_practice' && <MockExamSimulator initialMode="endless_infinite" key="endless" />}
            {activeTab === 'jiko_shokai' && <JikoShokaiTrainer />}
            {activeTab === 'speed_vocab' && <SpeedVocabTrainer />}
            {activeTab === 'visual_qa' && <VisualQAArena />}
            {activeTab === 'vocab_vault' && <VocabVault />}
          </div>

          <footer
            style={{
              maxWidth: '1280px',
              margin: '40px auto 0',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            <p>
              <strong>Nihongo Quest Exam Trainer</strong> — พัฒนาขึ้นสำหรับการสอบวิชา JN60101 ภาษาญี่ปุ่นเพื่อการสื่อสาร 1 (PIM)
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '4px' }}>
              ครอบคลุมเนื้อหาบทที่ 1, 2, 3, และ 4 โดย อาจารย์ ดร.เอกนรินทร์ จิรชีวีวงศ์
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
