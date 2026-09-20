import React from 'react';
import { Volume2, CheckCircle2, User, Sun, Moon, Menu } from 'lucide-react';
import { playJapaneseAudio } from '../utils/speech';
import { useTheme } from '../utils/theme';
import { TabType } from './Sidebar';

interface TopBarProps {
  activeTab: TabType;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const TAB_METADATA: Record<TabType, { group: string; title: string; description: string }> = {
  overview: {
    group: 'ภาพรวมระบบ',
    title: 'ภาพรวม & สถิติ (Overview Portal)',
    description: 'ศูนย์รวมข้อมูลสรุปความพร้อม ผลการวิเคราะห์คะแนน และทางลัดเข้าสู่โหมดการสอบ',
  },
  jiko_shokai: {
    group: 'การฝึกซ้อมรายส่วน',
    title: 'ส่วนที่ 1: แนะนำตัว (Jiko-shokai)',
    description: 'ฝึกตอบคำถามแนะนำตัว 5 ข้อ (5 คะแนน) พร้อมเฉลยและระบบอ่านออกเสียง',
  },
  speed_vocab: {
    group: 'การฝึกซ้อมรายส่วน',
    title: 'ส่วนที่ 2: ไวยากรณ์และรูปประโยค (Bunpou)',
    description: 'แปลไทยเป็นญี่ปุ่น 5 ข้อ (5 คะแนน) เน้นอนุภาค は, も, の, ครับ/ค่ะ',
  },
  visual_qa: {
    group: 'การฝึกซ้อมรายส่วน',
    title: 'ส่วนที่ 3: คำศัพท์รูปภาพ (Goi & Visual Stimuli)',
    description: 'ทายคำศัพท์สิ่งของ บทที่ 1 และ 2 จากภาพจริง 5 ข้อ (5 คะแนน)',
  },
  vocab_vault: {
    group: 'การฝึกซ้อมรายส่วน',
    title: 'คลังคำศัพท์ & รูปภาพประกอบ (Vocab Vault)',
    description: 'รวมคำศัพท์ 73+ รายการ บทที่ 1 และ 2 สำหรับเตรียมสอบ PIM',
  },
  mock_exam: {
    group: 'การสอบจำลอง',
    title: 'สอบจริงจับเวลา (Mock Exam Simulator)',
    description: 'จำลองการสอบ 15 ข้อ จับเวลา 3 นาที (180 วินาที) เสมือนห้องสอบจริง',
  },
  endless_practice: {
    group: 'การสอบจำลอง',
    title: 'โหมดฝึกซ้อมไม่จำกัดเวลา (Endless Practice)',
    description: 'สุ่มโจทย์ฝึกทำอย่างต่อเนื่องโดยไม่มีตัวจับเวลา เพื่อฝึกฝนความแม่นยำ',
  },
};

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onToggleSidebar }) => {
  const [theme, toggleTheme] = useTheme();

  const currentMeta = TAB_METADATA[activeTab] || {
    group: 'ระบบ',
    title: 'Nihongo Quest',
    description: 'ระบบเตรียมสอบวิชาภาษาญี่ปุ่น 1',
  };

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)',
        gap: '12px',
      }}
    >
      {/* Left: Hamburger Menu Button & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn-outline"
            style={{
              padding: '6px 9px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-main)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-surface)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="เปิด/ปิดแถบเมนู (Menu)"
          >
            <Menu size={16} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>เมนู</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', display: 'none' }}>
            {currentMeta.group}
          </span>
          <span
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentMeta.title}
          </span>
        </div>
      </div>

      {/* Right Action Tools & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-outline"
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-main)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
          }}
          title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง (Light Mode)' : 'เปลี่ยนเป็นธีมมืด (Dark Mode)'}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={13} color="var(--warning-600)" />
              <span>โหมดสว่าง</span>
            </>
          ) : (
            <>
              <Moon size={13} color="var(--primary-600)" />
              <span>โหมดมืด</span>
            </>
          )}
        </button>

        {/* Audio Test Button */}
        <button
          onClick={() => playJapaneseAudio('はじめまして。わたしはプームです。')}
          className="btn-outline"
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-main)',
            border: '1px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
          }}
          title="ทดสอบระบบเสียง Dual-Engine TTS"
        >
          <Volume2 size={13} color="var(--primary-600)" />
          <span>ทดสอบเสียง</span>
        </button>

        {/* Candidate Profile Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
          }}
        >
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--primary-border)',
            }}
          >
            <User size={12} />
          </div>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Poom</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-600)', fontWeight: 600, fontSize: '11px' }}>
            <CheckCircle2 size={12} />
            <span>พร้อมสอบ</span>
          </div>
        </div>
      </div>
    </header>
  );
};
