import React, { useState } from 'react';
import {
  LayoutDashboard,
  Timer,
  Infinity as InfinityIcon,
  Mic,
  Award,
  Image as ImageIcon,
  BookOpen,
  GraduationCap,
  Building2,
  Clock,
  Phone,
  Tag,
  Calendar,
  Sparkles,
  LucideIcon,
  X
} from 'lucide-react';

export type TabType =
  // Exam 1 Tabs
  | 'overview'
  | 'mock_exam'
  | 'endless_practice'
  | 'jiko_shokai'
  | 'speed_vocab'
  | 'visual_qa'
  | 'vocab_vault'
  // Exam 2 Tabs
  | 'exam2_dashboard'
  | 'exam2_vocab_vault'
  | 'exam2_mock'
  | 'exam2_endless'
  | 'exam2_part1_vocab'
  | 'exam2_p1_location'
  | 'exam2_p2_clock'
  | 'exam2_p3_phone'
  | 'exam2_p4_price'
  | 'exam2_p5_schedule';

interface NavItem {
  id: TabType;
  label: string;
  subLabel?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'muted';
}

interface NavGroup {
  groupTitle: string;
  groupCode: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsedDesktop?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen = false,
  onClose,
  isCollapsedDesktop = false,
}) => {
  const [selectedExamRound, setSelectedExamRound] = useState<1 | 2>(2); // Default to active Exam 2

  const handleItemClick = (tab: TabType) => {
    setActiveTab(tab);
    if (onClose) {
      onClose();
    }
  };

  const handleRoundChange = (round: 1 | 2) => {
    setSelectedExamRound(round);
    if (round === 2) {
      setActiveTab('exam2_dashboard');
    } else {
      setActiveTab('overview');
    }
  };

  // Navigation items for Exam 2
  const exam2NavGroups: NavGroup[] = [
    {
      groupTitle: 'ภาพรวม & คลังความรู้รอบที่ 2',
      groupCode: 'EXAM 2 PORTAL',
      items: [
        {
          id: 'exam2_dashboard',
          label: 'แดชบอร์ดรอบที่ 2',
          subLabel: 'สรุปโครงสร้าง 15 คะแนน',
          icon: LayoutDashboard,
          badge: 'บทที่ 3-4',
          badgeType: 'primary',
        },
        {
          id: 'exam2_vocab_vault',
          label: 'คลังคำศัพท์ & ไวยากรณ์',
          subLabel: 'Flashcards & ตารางข้อยกเว้น',
          icon: BookOpen,
          badge: 'ครบ 100%',
          badgeType: 'success',
        },
      ],
    },
    {
      groupTitle: 'การสอบจำลองรอบที่ 2 (15 คะแนนเต็ม)',
      groupCode: 'SIMULATION ARENA',
      items: [
        {
          id: 'exam2_mock',
          label: 'สอบจริงจับเวลา',
          subLabel: 'ส่วน 1 (5 ข้อ) + ส่วน 2 (10 ข้อ) / 3 นาที',
          icon: Timer,
          badge: '3 นาที',
          badgeType: 'primary',
        },
        {
          id: 'exam2_endless',
          label: 'ฝึกวนไม่จำกัดเวลา',
          subLabel: 'เลือกฝึกเฉพาะส่วนได้',
          icon: InfinityIcon,
        },
      ],
    },
    {
      groupTitle: 'ส่วนที่ 1: คำศัพท์ (5 คะแนน)',
      groupCode: 'PART 1 VOCAB',
      items: [
        {
          id: 'exam2_part1_vocab',
          label: 'คำศัพท์ ไทย → ญี่ปุ่น',
          subLabel: 'สุ่ม 5 คำบทที่ 3-4 (Speed/Endless)',
          icon: Award,
          badge: '5 คะแนน',
          badgeType: 'primary',
        },
      ],
    },
    {
      groupTitle: 'ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ (10 คะแนน)',
      groupCode: 'PART 2 PATTERNS',
      items: [
        {
          id: 'exam2_p1_location',
          label: 'รูปแบบ 1: สถานที่ (Locations)',
          subLabel: 'Koko wa doko desuka',
          icon: Building2,
          badge: '2 ข้อ',
          badgeType: 'muted',
        },
        {
          id: 'exam2_p2_clock',
          label: 'รูปแบบ 2: บอกเวลา (Clock Time)',
          subLabel: 'Ima nan ji desuka',
          icon: Clock,
          badge: '2 ข้อ',
          badgeType: 'muted',
        },
        {
          id: 'exam2_p3_phone',
          label: 'รูปแบบ 3: เบอร์โทร (Phone)',
          subLabel: 'Denwa bangō wa nan desuka',
          icon: Phone,
          badge: '2 ข้อ',
          badgeType: 'muted',
        },
        {
          id: 'exam2_p4_price',
          label: 'รูปแบบ 4: ป้ายราคา (Price Tags)',
          subLabel: 'Kore wa ikura desuka',
          icon: Tag,
          badge: '2 ข้อ',
          badgeType: 'muted',
        },
        {
          id: 'exam2_p5_schedule',
          label: 'รูปแบบ 5: ช่วงเวลา (Intervals)',
          subLabel: 'Kara...made desu',
          icon: Calendar,
          badge: '2 ข้อ',
          badgeType: 'muted',
        },
      ],
    },
  ];

  // Navigation items for Exam 1 (Archived)
  const exam1NavGroups: NavGroup[] = [
    {
      groupTitle: 'ภาพรวมระบบรอบที่ 1',
      groupCode: 'EXAM 1 PORTAL',
      items: [
        {
          id: 'overview',
          label: 'ภาพรวม & สถิติ',
          subLabel: 'สรุปผล & ทางลัด',
          icon: LayoutDashboard,
          badge: 'บทที่ 1-2',
          badgeType: 'primary',
        },
      ],
    },
    {
      groupTitle: 'การสอบจำลองรอบที่ 1',
      groupCode: 'EXAM 1 SIMULATION',
      items: [
        {
          id: 'mock_exam',
          label: 'สอบจริงจับเวลา',
          subLabel: '15 ข้อ / 3 นาที',
          icon: Timer,
          badge: '3 นาที',
          badgeType: 'primary',
        },
        {
          id: 'endless_practice',
          label: 'ฝึกวนไม่จำกัดเวลา',
          subLabel: 'ทำซ้ำจนคล่อง',
          icon: InfinityIcon,
        },
      ],
    },
    {
      groupTitle: 'การฝึกซ้อมรายส่วนรอบที่ 1',
      groupCode: 'EXAM 1 DRILLS',
      items: [
        {
          id: 'jiko_shokai',
          label: 'ส่วนที่ 1: แนะนำตัว',
          subLabel: '5 ข้อ (5 คะแนน)',
          icon: Mic,
        },
        {
          id: 'speed_vocab',
          label: 'ส่วนที่ 2: ไวยากรณ์',
          subLabel: 'แปลไทย-ญี่ปุ่น (5 ข้อ)',
          icon: Award,
        },
        {
          id: 'visual_qa',
          label: 'ส่วนที่ 3: คำศัพท์รูปภาพ',
          subLabel: 'ตอบจากภาพ (5 ข้อ)',
          icon: ImageIcon,
        },
        {
          id: 'vocab_vault',
          label: 'คลังคำศัพท์ & รูปภาพ',
          subLabel: 'บทที่ 1–4 รวมครบถ้วน',
          icon: BookOpen,
        },
      ],
    },
  ];

  const activeNavGroups = selectedExamRound === 2 ? exam2NavGroups : exam1NavGroups;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`app-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar */}
      <aside
        className={`app-sidebar-container ${isOpen ? 'open' : ''} ${
          isCollapsedDesktop ? 'collapsed-desktop' : ''
        }`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '18px 16px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                backgroundColor: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '18px',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}
            >
              日
            </div>
            {!isCollapsedDesktop && (
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  Nihongo Quest
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  JN60101 Exam Trainer (PIM)
                </div>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {isOpen && (
            <button
              onClick={onClose}
              className="btn-outline"
              style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
              aria-label="ปิดเมนู"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Exam Round Selector (Enterprise Segmented Control) */}
        {!isCollapsedDesktop && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              เลือกรอบการสอบ (Exam Round)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => handleRoundChange(2)}
                style={{
                  padding: '6px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 800,
                  textAlign: 'center',
                  backgroundColor: selectedExamRound === 2 ? 'var(--primary-600)' : 'transparent',
                  color: selectedExamRound === 2 ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} /> รอบ 2 (บท 3-4)
              </button>
              <button
                onClick={() => handleRoundChange(1)}
                style={{
                  padding: '6px 4px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textAlign: 'center',
                  backgroundColor: selectedExamRound === 1 ? 'var(--primary-600)' : 'transparent',
                  color: selectedExamRound === 1 ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                รอบ 1 (บท 1-2)
              </button>
            </div>
          </div>
        )}

        {/* Nav Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {activeNavGroups.map((group, groupIdx) => (
            <div key={groupIdx} style={{ marginBottom: '18px' }}>
              {!isCollapsedDesktop && (
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '4px 10px 6px',
                  }}
                >
                  {group.groupTitle}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsedDesktop ? 'center' : 'space-between',
                        width: '100%',
                        padding: isCollapsedDesktop ? '10px 0' : '9px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                        color: isActive ? 'var(--primary-700)' : 'var(--text-main)',
                        border: isActive ? '1px solid var(--primary-200)' : '1px solid transparent',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      title={item.label}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <Icon size={18} color={isActive ? 'var(--primary-600)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                        {!isCollapsedDesktop && (
                          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <div>{item.label}</div>
                            {item.subLabel && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {item.subLabel}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {!isCollapsedDesktop && item.badge && (
                        <span
                          className={`badge ${item.badgeType === 'primary' ? 'badge-primary' : 'badge-ref'}`}
                          style={{ fontSize: '10px', padding: '2px 6px', flexShrink: 0 }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Profile / Level Status */}
        {!isCollapsedDesktop && (
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="var(--primary-600)" />
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                ผู้สอบ: กลุ่ม 1.2-1
              </div>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '10px' }}>
              PIM JN60101
            </span>
          </div>
        )}
      </aside>
    </>
  );
};
