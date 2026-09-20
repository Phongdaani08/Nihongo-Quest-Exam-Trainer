import React from 'react';
import { Timer, Mic, Award, Image, BookOpen, Volume2, CheckCircle2, Infinity as InfinityIcon } from 'lucide-react';
import { playJapaneseAudio } from '../utils/speech';

interface HeaderProps {
  activeTab: 'mock_exam' | 'endless_practice' | 'jiko_shokai' | 'speed_vocab' | 'visual_qa' | 'vocab_vault';
  setActiveTab: (tab: 'mock_exam' | 'endless_practice' | 'jiko_shokai' | 'speed_vocab' | 'visual_qa' | 'vocab_vault') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-600)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px',
            flexShrink: 0
          }}>
            語
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Nihongo Quest
              </span>
              <span className="badge badge-primary" style={{ fontSize: '11px' }}>JN60101 Trainer</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ระบบฝึกสอบปากเปล่า & ภาพ 3 นาที (บทที่ 1–2 PIM)
            </p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-app)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('mock_exam')}
            className={activeTab === 'mock_exam' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <Timer size={14} />
            สอบจริง (3 นาที)
          </button>

          <button
            onClick={() => setActiveTab('endless_practice')}
            className={activeTab === 'endless_practice' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <InfinityIcon size={14} />
            ฝึกวนไม่จำกัดเวลา (Endless)
          </button>

          <button
            onClick={() => setActiveTab('jiko_shokai')}
            className={activeTab === 'jiko_shokai' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <Mic size={14} />
            ส่วนที่ 1: แนะนำตัว (5 คะแนน)
          </button>

          <button
            onClick={() => setActiveTab('speed_vocab')}
            className={activeTab === 'speed_vocab' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <Award size={14} />
            ส่วนที่ 2: แปลไทย-ญี่ปุ่น (5 คะแนน)
          </button>

          <button
            onClick={() => setActiveTab('visual_qa')}
            className={activeTab === 'visual_qa' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <Image size={14} />
            ส่วนที่ 3: ตอบภาพ 5 ข้อ
          </button>

          <button
            onClick={() => setActiveTab('vocab_vault')}
            className={activeTab === 'vocab_vault' ? 'btn-primary' : 'btn-outline'}
            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
          >
            <BookOpen size={14} />
            คลังศัพท์
          </button>
        </nav>

        {/* Right Tools & User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => playJapaneseAudio('はじめまして。わたしはプームです。')}
            className="btn-outline"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title="ทดสอบระบบเสียง"
          >
            <Volume2 size={14} />
            ทดสอบเสียง
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontWeight: 600
          }}>
            <CheckCircle2 size={14} color="var(--success-600)" />
            <span>ผู้สอบ: Poom</span>
          </div>
        </div>
      </div>
    </header>
  );
};
