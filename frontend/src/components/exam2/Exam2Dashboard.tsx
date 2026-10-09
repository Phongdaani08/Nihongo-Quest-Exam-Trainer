import React from 'react';
import {
  Timer,
  Infinity as InfinityIcon,
  Building2,
  Clock,
  Phone,
  Tag,
  Calendar,
  BookOpen,
  Award,
  ArrowRight
} from 'lucide-react';
import { TabType } from '../Sidebar';

interface Exam2DashboardProps {
  onNavigate: (tab: TabType) => void;
}

export const Exam2Dashboard: React.FC<Exam2DashboardProps> = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome Banner */}
      <div
        className="card"
        style={{
          padding: '32px',
          backgroundColor: 'var(--bg-surface)',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-primary">JN60101 ภาษาญี่ปุ่นเพื่อการสื่อสาร 1</span>
            <span className="badge badge-ref">การสอบครั้งที่ 2 (บทที่ 3 - 4) รวม 15 คะแนนเต็ม</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
            ยินดีต้อนรับสู่ศูนย์ฝึกซ้อมการสอบรอบที่ 2 (Exam 2 Arena)
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            ข้อสอบจริงแบ่งเป็น 2 ส่วนหลัก รวม <strong>15 คะแนน (เวลาสอบ 3:00 นาที)</strong>:
            <br />
            • <strong>ส่วนที่ 1 (5 คะแนน):</strong> คำศัพท์ ไทย → ญี่ปุ่น 5 คำ
            <br />
            • <strong>ส่วนที่ 2 (10 คะแนน):</strong> ตอบคำถาม 5 รูปแบบ รูปแบบละ 2 ข้อ (รวม 10 ข้อ)
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('exam2_mock')}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Timer size={18} /> เริ่มสอบจำลอง 3 นาที (15 ข้อเต็ม)
            </button>
            <button
              onClick={() => onNavigate('exam2_endless')}
              className="btn btn-secondary"
              style={{ padding: '12px 20px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <InfinityIcon size={18} /> ฝึกทำซ้ำไม่จำกัดเวลา (Endless)
            </button>
            <button
              onClick={() => onNavigate('exam2_vocab_vault')}
              className="btn btn-secondary"
              style={{ padding: '12px 20px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <BookOpen size={18} /> คลังคำศัพท์ & ตารางสรุป (ครบ 100%)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1 HIGHLIGHT: Part 1 Vocab Trainer */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary" style={{ fontSize: '12px' }}>ส่วนที่ 1 ของการสอบ</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>🎯 ส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น (5 คำ = 5 คะแนน)</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              อาจารย์จะบอกความหมายภาษาไทย ผู้สอบต้องตอบเป็นภาษาญี่ปุ่นให้ถูกต้องและรวดเร็ว
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '28px',
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--primary-400)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ flex: '1 1 420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} color="var(--primary-700)" />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
                  Part 1 Vocab Trainer (ไทย → ญี่ปุ่น)
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ครอบคลุมคำศัพท์บทที่ 3 และ 4 ครบ 75+ คำ
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              มีระบบ <strong>Active Recall (ซ่อนชอยส์)</strong> ให้นึกคำตอบภาษาญี่ปุ่นในใจก่อนเปิดดูชอยส์ พร้อมตัวจับเวลาและระบบเสียงอ่านภาษาญี่ปุ่น
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => onNavigate('exam2_part1_vocab')}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              เข้าสู่ห้องฝึกคำศัพท์ส่วนที่ 1 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: 5 Mini-Games Arcade Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary" style={{ fontSize: '12px' }}>ส่วนที่ 2 ของการสอบ</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>🎮 ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ (10 คำถาม = 10 คะแนน)</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              5 รูปแบบคำถาม ออกสอบรูปแบบละ 2 ข้อพอดี เลือกฝึกเจาะลึกเฉพาะหมวดได้ตามต้องการ
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Card 1: Locations */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1.5px solid var(--primary-200)' }}>
                <Building2 size={24} color="var(--primary-600)" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px', marginBottom: '6px' }}>รูปแบบที่ 1 (2 ข้อ)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>🏢 1. สถานที่ (Locations)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                โครงสร้าง: <strong>Koko wa doko desuka?</strong> → ตอบชื่อสถานที่ (ห้องเรียน, ห้องประชุม, ไปรษณีย์ ฯลฯ)
              </p>
            </div>
            <button
              onClick={() => onNavigate('exam2_p1_location')}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              เข้าสู่มินิเกมสถานที่ <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 2: Telling Time */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--indigo-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1.5px solid var(--indigo-200)' }}>
                <Clock size={24} color="#6366f1" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px', marginBottom: '6px' }}>รูปแบบที่ 2 (2 ข้อ)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>⏰ 2. บอกเวลา (Clock Time)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                โครงสร้าง: <strong>Ima nan ji desuka?</strong> → หน้าปัดนาฬิกา ฝึกชั่วโมง/นาที และคำยกเว้น (yo-ji, ku-ji, han)
              </p>
            </div>
            <button
              onClick={() => onNavigate('exam2_p2_clock')}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              เข้าสู่มินิเกมบอกเวลา <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 3: Phone Number */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--emerald-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1.5px solid var(--emerald-200)' }}>
                <Phone size={24} color="#10b981" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px', marginBottom: '6px' }}>รูปแบบที่ 3 (2 ข้อ)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>📞 3. เบอร์โทรศัพท์ (Phone Number)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                โครงสร้าง: <strong>Anata no denwa bangō wa nan desuka?</strong> → แป้นโทรศัพท์และคำเชื่อม <strong>no</strong>
              </p>
            </div>
            <button
              onClick={() => onNavigate('exam2_p3_phone')}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              เข้าสู่มินิเกมเบอร์โทร <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 4: Price Tag */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--amber-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1.5px solid var(--amber-200)' }}>
                <Tag size={24} color="#f59e0b" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px', marginBottom: '6px' }}>รูปแบบที่ 4 (2 ข้อ)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>🏷️ 4. ป้ายราคา (Price Tags)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                โครงสร้าง: <strong>Kore wa ikura desuka?</strong> → แคชเชียร์ป้ายราคา 100 - 100,000 เยน (sanzen, hassen, man)
              </p>
            </div>
            <button
              onClick={() => onNavigate('exam2_p4_price')}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              เข้าสู่มินิเกมป้ายราคา <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 5: Schedule Interval */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--rose-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1.5px solid var(--rose-200)' }}>
                <Calendar size={24} color="#f43f5e" />
              </div>
              <span className="badge badge-primary" style={{ fontSize: '11px', marginBottom: '6px' }}>รูปแบบที่ 5 (2 ข้อ)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>📅 5. ช่วงเวลา (Time Intervals)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                โครงสร้าง: <strong>Shigoto wa nanji kara nanji made desuka?</strong> → ตารางเวลา <strong>...kara ...made desu</strong>
              </p>
            </div>
            <button
              onClick={() => onNavigate('exam2_p5_schedule')}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              เข้าสู่มินิเกมช่วงเวลา <ArrowRight size={15} />
            </button>
          </div>

          {/* Card 6: Vocab Vault & Master Tables */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)', border: '1.5px solid var(--primary-300)' }}>
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1.5px solid var(--primary-400)' }}>
                <BookOpen size={24} color="var(--primary-700)" />
              </div>
              <span className="badge badge-success" style={{ fontSize: '11px', marginBottom: '6px' }}>คลังคำศัพท์ครบ 100%</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>📖 คลังคำศัพท์ & ไวยากรณ์ (บท 3-4)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                รวบรวมคำศัพท์ครบทุกคำจาก PDF, Flashcards ฝึกท่องจำ พร้อมตารางสรุปข้อยกเว้นเสียงเวลา, นาที และเงินเยน
              </p>
            </div>
            <button
              onClick={() => onNavigate('exam2_vocab_vault')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              เปิดคลังคำศัพท์ & ไวยากรณ์ <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
