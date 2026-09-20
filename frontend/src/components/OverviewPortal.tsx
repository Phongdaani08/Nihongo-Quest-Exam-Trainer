import React from 'react';
import {
  Timer,
  Infinity as InfinityIcon,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { TabType } from './Sidebar';

interface OverviewPortalProps {
  onNavigate: (tab: TabType) => void;
}

export const OverviewPortal: React.FC<OverviewPortalProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Institutional Academic Header Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Top Meta Badges & Course Identifier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-text)',
                border: '1px solid var(--primary-border)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <GraduationCap size={14} color="var(--primary-600)" />
              PIM Academic Assessment Portal
            </span>
            <span className="badge badge-ref">JN60101 ภาษาญี่ปุ่นเพื่อการสื่อสาร 1</span>
            <span className="badge badge-ref">บทที่ 1 & 2 (อ.ดร.เอกนรินทร์)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-600)', fontSize: '12px', fontWeight: 600 }}>
            <CheckCircle2 size={14} />
            <span>ระบบประเมินผลพร้อมใช้งาน 100%</span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              margin: '0 0 6px 0',
              lineHeight: 1.3,
            }}
          >
            ศูนย์ฝึกเตรียมสอบวัดผลรายวิชาภาษาญี่ปุ่น (Assessment & Mastery Hub)
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            ระบบจำลองการสอบปากเปล่าและคำศัพท์ตามโครงสร้างข้อสอบจริง 3 ส่วน (15 ข้อ / 15 คะแนน) พร้อมคลังภาพแท้ 48 ภาพ และระบบวิเคราะห์จุดอ่อนอัตโนมัติ
          </p>
        </div>
      </div>

      {/* 3 Main Assessment Tracks (Balanced 3-Column Enterprise Grid) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Track 1: Official Timed Exam */}
        <div
          onClick={() => onNavigate('mock_exam')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--primary-border)',
            backgroundColor: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.borderColor = 'var(--primary-600)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.borderColor = 'var(--primary-border)';
          }}
        >
          {/* Top Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                }}
              >
                <Timer size={22} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-text)',
                  border: '1px solid var(--primary-border)',
                }}
              >
                15 ข้อ / 3 นาที
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              1. สอบจริงจับเวลา
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              จำลองสถานการณ์ห้องสอบ 15 ข้อ 180 วินาที รัน 3 ส่วนต่อเนื่อง ประเมินเกณฑ์ผ่าน 80% (12/15) พร้อมสรุปจุดอ่อน
            </p>
          </div>

          {/* Action Footer */}
          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>เกณฑ์ผ่าน: 12 ข้อ</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontSize: '12.5px', fontWeight: 700 }}>
              <span>เข้าห้องสอบ</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Track 2: Endless Practice */}
        <div
          onClick={() => onNavigate('endless_practice')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--success-border)',
            backgroundColor: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.borderColor = 'var(--success-600)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.borderColor = 'var(--success-border)';
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--success-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)',
                }}
              >
                <InfinityIcon size={22} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--success-50)',
                  color: 'var(--success-text)',
                  border: '1px solid var(--success-border)',
                }}
              >
                ไม่จำกัดเวลา
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              2. ฝึกซ้อมไม่จำกัดเวลา
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              สุ่มโจทย์ฝึกทำวนซ้ำอย่างอิสระ มีเฉลยและเสียงอ่านทันที เหมาะสำหรับทบทวนและฝึกความแม่นยำก่อนสอบจริง
            </p>
          </div>

          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>สะสม Streak</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-600)', fontSize: '12.5px', fontWeight: 700 }}>
              <span>เริ่มฝึกซ้อม</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Track 3: Vocab Vault & Visual Gallery */}
        <div
          onClick={() => onNavigate('vocab_vault')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-strong)',
            backgroundColor: 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.borderColor = 'var(--primary-600)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.borderColor = 'var(--border-strong)';
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-strong)',
                }}
              >
                <BookOpen size={22} color="var(--primary-600)" />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                130 ศัพท์ • 48 ภาพ
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              3. คลังคำศัพท์ & รูปภาพ
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              รวบรวมคำศัพท์บทที่ 1–2 ครบทุกหมวดหมู่ พร้อมแกลเลอรีภาพข้อสอบ 48 ภาพ และระบบเสียงอ่านออกเสียง 2 สำเนียง
            </p>
          </div>

          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>ดูศัพท์ & ภาพ</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '12.5px', fontWeight: 700 }}>
              <span>เปิดคลังความรู้</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Blueprint & 3-Section Quick Launcher */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
              โครงสร้างข้อสอบรายส่วน (Curriculum Blueprint & Drills)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              เลือกฝึกซ้อมเฉพาะส่วนเพื่อปิดจุดอ่อนได้อย่างรวดเร็ว
            </p>
          </div>
          <span className="badge badge-primary" style={{ fontSize: '11px' }}>
            <ShieldCheck size={12} /> เกณฑ์รวม: 15 ข้อ (15 คะแนน)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {/* Section 1 Launcher */}
          <button
            onClick={() => onNavigate('jiko_shokai')}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Mic size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>ส่วนที่ 1: แนะนำตัว</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>5 ข้อ (5 คะแนน) • Jiko-shokai</div>
              </div>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </button>

          {/* Section 2 Launcher */}
          <button
            onClick={() => onNavigate('speed_vocab')}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--warning-50)',
                  color: 'var(--warning-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>ส่วนที่ 2: ไวยากรณ์</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>5 ข้อ (5 คะแนน) • แปลไทย-ญี่ปุ่น</div>
              </div>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </button>

          {/* Section 3 Launcher */}
          <button
            onClick={() => onNavigate('visual_qa')}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--success-50)',
                  color: 'var(--success-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ImageIcon size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>ส่วนที่ 3: คำศัพท์รูปภาพ</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>5 ข้อ (5 คะแนน) • 48 ภาพจริง</div>
              </div>
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {/* Full Analytics Performance Dashboard */}
      <div>
        <AnalyticsDashboard />
      </div>
    </div>
  );
};
