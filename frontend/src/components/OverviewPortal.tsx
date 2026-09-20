import React from 'react';
import { Timer, Infinity as InfinityIcon, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { TabType } from './Sidebar';

interface OverviewPortalProps {
  onNavigate: (tab: TabType) => void;
}

export const OverviewPortal: React.FC<OverviewPortalProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome & Mode Selection Header */}
      <div
        className="card"
        style={{
          padding: '28px 32px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} />
              Nihongo Quest Exam Trainer
            </span>
            <span className="badge badge-ref">JN60101 PIM (บทที่ 1 & 2)</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            เลือกรูปแบบการฝึกสอบที่ต้องการ
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            คุณสามารถเลือกสอบแบบจับเวลาเสมือนจริง 3 นาที หรือเลือกฝึกวนไปเรื่อยๆ โดยไม่จำกัดเวลา พร้อมสลับส่วนที่ 1, 2, 3 ได้อย่างอิสระตลอดเวลา
          </p>

          {/* 3 Quick Launch Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Card 1: Timed Exam */}
            <button
              onClick={() => onNavigate('mock_exam')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid var(--primary-border)',
                backgroundColor: 'var(--primary-50)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Timer size={20} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-600)', color: '#ffffff' }}>
                  3 นาที
                </span>
              </div>
              <strong style={{ fontSize: '15px', color: 'var(--primary-text)', marginBottom: '4px' }}>
                1. สอบจริงจับเวลา
              </strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                15 ข้อ / 180 วินาที รัน 3 ส่วนต่อเนื่อง ประเมินคะแนนและจุดอ่อนหลังสอบ
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-600)', fontSize: '12px', fontWeight: 700 }}>
                <span>เข้าสู่ห้องสอบ</span>
                <ArrowRight size={14} />
              </div>
            </button>

            {/* Card 2: Endless Practice */}
            <button
              onClick={() => onNavigate('endless_practice')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid var(--success-border)',
                backgroundColor: 'var(--success-50)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--success-600)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <InfinityIcon size={20} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--success-600)', color: '#ffffff' }}>
                  ไม่จำกัดเวลา
                </span>
              </div>
              <strong style={{ fontSize: '15px', color: 'var(--success-text)', marginBottom: '4px' }}>
                2. ฝึกวนไม่จำกัดเวลา
              </strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                สุ่มโจทย์ฝึกทำซ้ำต่อเนื่อง มีเฉลยและเสียงอ่าน สะสม Streak ความแม่นยำ
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-600)', fontSize: '12px', fontWeight: 700 }}>
                <span>เริ่มฝึกซ้อม</span>
                <ArrowRight size={14} />
              </div>
            </button>

            {/* Card 3: Drills & Vault */}
            <button
              onClick={() => onNavigate('vocab_vault')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '20px',
                borderRadius: '10px',
                border: '2px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-strong)',
                  }}
                >
                  <BookOpen size={20} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                  73+ คำศัพท์
                </span>
              </div>
              <strong style={{ fontSize: '15px', color: 'var(--text-main)', marginBottom: '4px' }}>
                3. คลังคำศัพท์ & การฝึกรายส่วน
              </strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                ทบทวนศัพท์ บทที่ 1 & 2 รูปภาพ และซ้อมแยกเฉพาะส่วนที่ 1, 2, 3
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontSize: '12px', fontWeight: 700 }}>
                <span>เปิดคลังคำศัพท์</span>
                <ArrowRight size={14} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <div>
        <AnalyticsDashboard />
      </div>
    </div>
  );
};
