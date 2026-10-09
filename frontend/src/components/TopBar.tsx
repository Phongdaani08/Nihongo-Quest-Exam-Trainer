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
  // Exam 1 Metadata
  overview: {
    group: 'รอบที่ 1 (บทที่ 1-2)',
    title: 'ภาพรวม & สถิติ (Overview Portal)',
    description: 'ศูนย์รวมข้อมูลสรุปความพร้อม ผลการวิเคราะห์คะแนน และทางลัดเข้าสู่โหมดการสอบรอบที่ 1',
  },
  jiko_shokai: {
    group: 'รอบที่ 1: การฝึกซ้อม',
    title: 'ส่วนที่ 1: แนะนำตัว (Jiko-shokai)',
    description: 'ฝึกตอบคำถามแนะนำตัว 5 ข้อ (5 คะแนน) พร้อมเฉลยและระบบอ่านออกเสียง',
  },
  speed_vocab: {
    group: 'รอบที่ 1: การฝึกซ้อม',
    title: 'ส่วนที่ 2: ไวยากรณ์และรูปประโยค (Bunpou)',
    description: 'แปลไทยเป็นญี่ปุ่น 5 ข้อ (5 คะแนน) เน้นอนุภาค は, も, の, ครับ/ค่ะ',
  },
  visual_qa: {
    group: 'รอบที่ 1: การฝึกซ้อม',
    title: 'ส่วนที่ 3: คำศัพท์รูปภาพ (Goi & Visual Stimuli)',
    description: 'ทายคำศัพท์สิ่งของ บทที่ 1 และ 2 จากภาพจริง 5 ข้อ (5 คะแนน)',
  },
  vocab_vault: {
    group: 'คลังคำศัพท์รวม',
    title: 'คลังคำศัพท์ & รูปภาพประกอบ (Vocab Vault)',
    description: 'รวมคำศัพท์ 110+ รายการ บทที่ 1–4 สำหรับเตรียมสอบ PIM',
  },
  mock_exam: {
    group: 'รอบที่ 1: การสอบจำลอง',
    title: 'สอบจริงจับเวลา รอบที่ 1 (Mock Exam Simulator)',
    description: 'จำลองการสอบ 15 ข้อ จับเวลา 3 นาที (180 วินาที) เสมือนห้องสอบจริง',
  },
  endless_practice: {
    group: 'รอบที่ 1: การสอบจำลอง',
    title: 'โหมดฝึกซ้อมไม่จำกัดเวลา รอบที่ 1 (Endless Practice)',
    description: 'สุ่มโจทย์ฝึกทำอย่างต่อเนื่องโดยไม่มีตัวจับเวลา เพื่อฝึกฝนความแม่นยำ',
  },

  // Exam 2 Metadata
  exam2_dashboard: {
    group: 'รอบที่ 2 (บทที่ 3-4)',
    title: 'แดชบอร์ดรอบที่ 2 (Exam 2 Arena)',
    description: 'ศูนย์กลางฝึกฝนการสอบรอบที่ 2 ครอบคลุมคำศัพท์บทที่ 3-4 และ 5 รูปแบบคำถาม 15 คะแนนเต็ม',
  },
  exam2_vocab_vault: {
    group: 'รอบที่ 2: คลังคำศัพท์',
    title: 'คลังคำศัพท์ & ไวยากรณ์บทที่ 3-4 ฉบับสมบูรณ์ (Exam 2 Vocab Vault)',
    description: 'รวบรวมคำศัพท์ครบ 100% จากสไลด์ PDF ทั้งบทที่ 3 และ 4 พร้อม Flashcards และตารางสรุปข้อยกเว้นเสียง',
  },
  exam2_mock: {
    group: 'รอบที่ 2: การสอบจำลอง',
    title: 'สอบจริงจับเวลา รอบที่ 2 (Exam 2 Mock Simulator)',
    description: 'จำลองการสอบรอบที่ 2 จับเวลา 3:00 นาที (คำศัพท์ 5 ข้อ + ตอบคำถาม 10 ข้อ รวม 15 คะแนน)',
  },
  exam2_endless: {
    group: 'รอบที่ 2: การสอบจำลอง',
    title: 'ฝึกฝนไม่จำกัดเวลา รอบที่ 2 (Exam 2 Endless Practice)',
    description: 'สุ่มฝึกตอบคำถาม 5 รูปแบบรอบที่ 2 แบบต่อเนื่อง พร้อมตัวกรองเลือกฝึกเฉพาะหมวด',
  },
  exam2_part1_vocab: {
    group: 'รอบที่ 2: ส่วนที่ 1 (5 คะแนน)',
    title: 'ส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น (Part 1 Vocab Trainer)',
    description: 'ฝึกแปลคำศัพท์ภาษาไทยเป็นภาษาญี่ปุ่นตามข้อสอบจริง 5 คำ (5 คะแนน) สุ่มจากบทที่ 3 และ 4',
  },
  exam2_p1_location: {
    group: 'รอบที่ 2: มินิเกม',
    title: '1. มินิเกมสถานที่ (Location Navigator)',
    description: 'ฝึกโครงสร้าง Koko wa doko desuka? → Koko wa [สถานที่] desu. (2 ข้อ)',
  },
  exam2_p2_clock: {
    group: 'รอบที่ 2: มินิเกม',
    title: '2. มินิเกมบอกเวลา (Chrono Clock Master)',
    description: 'ฝึกโครงสร้าง Ima nan ji desuka? พร้อมหน้าปัดนาฬิกา Interactive และคำยกเว้น (2 ข้อ)',
  },
  exam2_p3_phone: {
    group: 'รอบที่ 2: มินิเกม',
    title: '3. มินิเกมเบอร์โทรศัพท์ (Phone Keypad Trainer)',
    description: 'ฝึกโครงสร้าง Anata no denwa bangō wa nan desuka? พร้อมแป้นโทรศัพท์และคำเชื่อม no (2 ข้อ)',
  },
  exam2_p4_price: {
    group: 'รอบที่ 2: มินิเกม',
    title: '4. มินิเกมป้ายราคา (Cashier Price Quest)',
    description: 'ฝึกโครงสร้าง Kore wa ikura desuka? → [ตัวเลขราคา] en desu. หลักร้อย พัน หมื่น แสน (2 ข้อ)',
  },
  exam2_p5_schedule: {
    group: 'รอบที่ 2: มินิเกม',
    title: '5. มินิเกมช่วงเวลา (Time-Block Interval Trainer)',
    description: 'ฝึกโครงสร้าง [กิจกรรม] wa nanji kara nanji made desuka? → ...kara ...made desu. (2 ข้อ)',
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
            className="mobile-only-btn btn-outline"
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
          className="mobile-hide"
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
