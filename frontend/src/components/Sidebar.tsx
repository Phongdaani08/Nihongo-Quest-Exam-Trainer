import React from 'react';
import {
  LayoutDashboard,
  Timer,
  Infinity as InfinityIcon,
  Mic,
  Award,
  Image as ImageIcon,
  BookOpen,
  GraduationCap,
  LucideIcon
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'mock_exam'
  | 'endless_practice'
  | 'jiko_shokai'
  | 'speed_vocab'
  | 'visual_qa'
  | 'vocab_vault';

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

import { X } from 'lucide-react';

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
  const handleItemClick = (tab: TabType) => {
    setActiveTab(tab);
    if (onClose) {
      onClose();
    }
  };

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'ภาพรวมระบบ',
      groupCode: 'PORTAL',
      items: [
        {
          id: 'overview',
          label: 'ภาพรวม & สถิติ',
          subLabel: 'สรุปผล & ทางลัด',
          icon: LayoutDashboard,
          badge: 'Overview',
          badgeType: 'primary',
        },
      ],
    },
    {
      groupTitle: 'การสอบจำลอง',
      groupCode: 'EXAM SIMULATION',
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
      groupTitle: 'การฝึกซ้อมรายส่วน',
      groupCode: 'CURRICULUM & DRILLS',
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
          subLabel: '73+ รายการ (บทที่ 1–2)',
          icon: BookOpen,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile / Tablet Backdrop */}
      <div
        className={`app-sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Container */}
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
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              語
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '14.5px',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Nihongo Quest
              </div>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: 'var(--primary-600)',
                  marginTop: '1px',
                }}
              >
                JN60101 Exam Trainer
              </div>
            </div>
          </div>

          {/* Close button for Mobile / Drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="sidebar-close-btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
              }}
              title="ปิดเมนู"
            >
              <X size={16} />
            </button>
          )}
        </div>

      {/* Navigation Groups */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {navGroups.map((group) => (
          <div key={group.groupCode}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0 8px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{group.groupTitle}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      width: '100%',
                      textAlign: 'left',
                      backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                      color: isActive ? 'var(--primary-700)' : 'var(--text-main)',
                      border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                        color: isActive ? 'var(--primary-600)' : 'var(--text-muted)',
                        flexShrink: 0,
                        border: isActive ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)',
                      }}
                    >
                      <IconComponent size={15} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </div>
                      {item.subLabel && (
                        <div style={{ fontSize: '10.5px', color: isActive ? 'var(--primary-600)' : 'var(--text-muted)', marginTop: '2px' }}>
                          {item.subLabel}
                        </div>
                      )}
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: item.badgeType === 'primary' ? 'var(--primary-600)' : 'var(--success-600)',
                          color: '#ffffff',
                          flexShrink: 0,
                        }}
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

      {/* Footer / Academic Meta */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-app)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
          <GraduationCap size={14} color="var(--primary-600)" />
          <span>JN60101 ภาษาญี่ปุ่น 1</span>
        </div>
        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
          บทที่ 1 & 2 • อ.ดร.เอกนรินทร์
        </div>
      </div>
    </aside>
  </>
);
};
