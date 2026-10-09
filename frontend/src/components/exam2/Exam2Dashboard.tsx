import React from 'react';
import {
  Timer,
  Infinity as InfinityIcon,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Building2,
  Clock,
  Phone,
  Tag,
  Calendar
} from 'lucide-react';
import { TabType } from '../Sidebar';

interface Exam2DashboardProps {
  onNavigate: (tab: TabType) => void;
}

export const Exam2Dashboard: React.FC<Exam2DashboardProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Institutional Academic Header Banner (Identical to OverviewPortal.tsx) */}
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
              PIM Academic Assessment Portal (Exam 2)
            </span>
            <span className="badge badge-ref">JN60101 ภาษาญี่ปุ่นเพื่อการสื่อสาร 1</span>
            <span className="badge badge-ref">การสอบครั้งที่ 2 (บทที่ 3 & 4) รวม 15 คะแนนเต็ม</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-600)', fontSize: '12px', fontWeight: 600 }}>
            <CheckCircle2 size={14} />
            <span>ระบบประเมินผลรอบที่ 2 พร้อมใช้งาน 100%</span>
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
            ศูนย์ฝึกเตรียมสอบวัดผลรอบที่ 2 (บทที่ 3-4 Assessment & Mastery Hub)
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            ระบบจำลองการสอบปากเปล่าตามโครงสร้างข้อสอบจริง 2 ส่วน (15 ข้อ / 15 คะแนน / 3 นาที): ส่วนที่ 1 คำศัพท์ ไทย → ญี่ปุ่น (5 คำ) และส่วนที่ 2 ตอบคำถาม 5 รูปแบบ (10 ข้อ) พร้อมคลังคำศัพท์และตารางข้อยกเว้นเสียง
          </p>
        </div>
      </div>

      {/* 3 Main Assessment Tracks (Balanced 3-Column Enterprise Grid - Identical to OverviewPortal.tsx) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Track 1: Official Timed Exam */}
        <div
          onClick={() => onNavigate('exam2_mock')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-500)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--primary-border)',
                }}
              >
                <Timer size={22} color="var(--primary-600)" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px' }}>15 ข้อ / 3:00 นาที</span>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              1. โหมดสอบจริงจับเวลา (Timed Mock Exam)
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              จำลองบรรยากาศสอบสัมภาษณ์จริง 15 ข้อ จับเวลา 180 วินาที คำนวณคะแนนและตัดเกรดอิงตามเกณฑ์ทางการ
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontSize: '13px', fontWeight: 700 }}>
            <span>เข้าห้องสอบจำลอง</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Track 2: Endless Practice Mode */}
        <div
          onClick={() => onNavigate('exam2_endless')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--indigo-500)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--indigo-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--indigo-200)',
                }}
              >
                <InfinityIcon size={22} color="#6366f1" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px', backgroundColor: 'var(--indigo-50)', color: '#6366f1' }}>
                พรีเซ็ตกำหนดเอง
              </span>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              2. โหมดฝึกซ้อมไม่จำกัดเวลา (Endless Practice)
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              ฝึกซ้อมแบบไร้ความกดดัน พร้อมระบบ Preset Manager เลือกเฉพาะคำศัพท์หรือ 5 รูปแบบคำถามที่ต้องการเน้น
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontSize: '13px', fontWeight: 700 }}>
            <span>เข้าสู่โหมดฝึกซ้อมไม่จำกัดเวลา</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Track 3: Vocabulary & Master Tables Vault */}
        <div
          onClick={() => onNavigate('exam2_vocab_vault')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-success)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <BookOpen size={22} color="var(--color-success)" />
              </div>
              <span className="badge badge-success" style={{ fontSize: '11px' }}>78 คำศัพท์ + ตาราง</span>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              3. คลังคำศัพท์ & ไวยากรณ์รอบ 2 (Vocab Vault)
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              รวมคำศัพท์ครบ 100% จากสไลด์ PDF ทั้งบท 3 และ 4, Flashcards ท่องจำ, และตารางสรุปข้อยกเว้นเวลา-นาที-เงินเยน
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontSize: '13px', fontWeight: 700 }}>
            <span>เปิดคลังคำศัพท์ & ไวยากรณ์</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* 2 Core Assessment Sections (Part 1 & Part 2 Drills) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
              🎯 คลังฝึกซ้อมเจาะลึก 2 ส่วนหลักของการสอบ (Exam 2 Core Sections)
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              ฝึกทำโจทย์แยกตามแต่ละส่วนของการสอบจริง 15 คะแนน
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {/* Section 1 Card */}
          <div
            onClick={() => onNavigate('exam2_part1_vocab')}
            className="card"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--primary-300)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-primary">ส่วนที่ 1 ของการสอบ</span>
                <span className="badge badge-ref">5 คะแนนเต็ม</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
                📝 ส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น (Part 1 Vocab Trainer)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                ฝึกแปลความหมายภาษาไทยเป็นภาษาญี่ปุ่น 5 คำ สุ่มจากบทที่ 3 และ 4 พร้อมโหมดซ่อนชอยส์ Active Recall และระบบจับเวลา
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontSize: '13px', fontWeight: 700 }}>
              <span>เข้าสู่การฝึกคำศัพท์ส่วนที่ 1</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Section 2 Card */}
          <div
            onClick={() => onNavigate('exam2_p1_location')}
            className="card"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--indigo-300)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-primary" style={{ backgroundColor: 'var(--indigo-50)', color: '#6366f1' }}>ส่วนที่ 2 ของการสอบ</span>
                <span className="badge badge-ref">10 คะแนนเต็ม (5 รูปแบบ x 2 ข้อ)</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
                🎮 ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ (5 Pattern Simulators)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                ตอบคำถาม 5 รูปแบบ: 1. สถานที่, 2. บอกเวลา (นาฬิกา SVG), 3. เบอร์โทรศัพท์, 4. ป้ายราคา (POS แคชเชียร์), 5. ช่วงเวลาทำงาน
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontSize: '13px', fontWeight: 700 }}>
              <span>เข้าสู่มินิเกมตอบคำถาม 5 รูปแบบ</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Jump: 5 Question Pattern Mini-Games */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
          🕹️ ทางลัดเข้าสู่มินิเกม 5 รูปแบบคำถาม (Arcade Drills)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { id: 'exam2_p1_location', title: '1. สถานที่', sub: 'Koko wa doko desuka', icon: Building2, color: 'var(--primary-600)' },
            { id: 'exam2_p2_clock', title: '2. บอกเวลา', sub: 'Ima nan ji desuka', icon: Clock, color: '#6366f1' },
            { id: 'exam2_p3_phone', title: '3. เบอร์โทรศัพท์', sub: 'Denwa bangō wa nan desuka', icon: Phone, color: '#10b981' },
            { id: 'exam2_p4_price', title: '4. ป้ายราคา', sub: 'Kore wa ikura desuka', icon: Tag, color: '#f59e0b' },
            { id: 'exam2_p5_schedule', title: '5. ช่วงเวลา', sub: 'Kara...made desu', icon: Calendar, color: '#f43f5e' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id as TabType)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={item.color} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-main)' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
