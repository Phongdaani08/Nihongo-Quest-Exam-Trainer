import React, { useState } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewPortal } from './components/OverviewPortal';
import { JikoShokaiTrainer } from './components/JikoShokaiTrainer';
import { SpeedVocabTrainer } from './components/SpeedVocabTrainer';
import { VisualQAArena } from './components/VisualQAArena';
import { MockExamSimulator } from './components/MockExamSimulator';
import { VocabVault } from './components/VocabVault';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    // Check if on mobile/tablet (<= 1024px) or desktop
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
              แหล่งอ้างอิง: เอกสารประกอบการสอน บทที่ 1 และ บทที่ 2 โดย อาจารย์ ดร.เอกนรินทร์ จิรชีวีวงศ์
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
