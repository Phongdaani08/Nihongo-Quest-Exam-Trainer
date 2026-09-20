import React, { useState } from 'react';
import { Search, Volume2 } from 'lucide-react';
import { fallbackVocabs } from '../services/api';
import { playJapaneseAudio } from '../utils/speech';

export const VocabVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | 0>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = fallbackVocabs.filter(v => {
    if (selectedChapter !== 0 && v.chapter_number !== selectedChapter) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        v.word_romaji.toLowerCase().includes(q) ||
        v.word_kana.includes(q) ||
        v.meaning_th.toLowerCase().includes(q) ||
        (v.word_kanji && v.word_kanji.includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">คลังคำศัพท์ & อ้างอิงสไลด์ PDF</span>
            <span className="badge badge-ref">รวม {fallbackVocabs.length} คำ จากบทที่ 1 และ 2</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
            Textbook Vocabulary Vault (คลังคำศัพท์หลักสูตร JN60101)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
            ค้นหาคำศัพท์ คำทับศัพท์ Katakana พร้อมเลขหน้าอ้างอิงตรงจากสไลด์อาจารย์ ดร.เอกนรินทร์
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="ค้นหา Romaji, คานะ, คันจิ, หรือความหมายภาษาไทย..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(parseInt(e.target.value, 10))}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '13px',
            }}
          >
            <option value={0}>ทุกบท (Chapters 1 & 2)</option>
            <option value={1}>บทที่ 1: แนะนำตนเอง</option>
            <option value={2}>บทที่ 2: การแลกนามบัตร</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              fontSize: '13px',
            }}
          >
            <option value="all">ทุกหมวด (All Categories)</option>
            <option value="object">สิ่งของรอบตัว</option>
            <option value="katakana">คำทับศัพท์ Katakana</option>
            <option value="occupation">อาชีพ / บุคคล</option>
            <option value="place">สถานที่ / สถาบัน</option>
            <option value="country">ประเทศ (4 ประเทศ)</option>
            <option value="demonstrative">คำชี้บ่ง (kore/sore/are)</option>
            <option value="phrase">สำนวนทักทาย</option>
          </select>
        </div>
      </div>

      {/* Vocab Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {filtered.map((vocab) => (
          <div
            key={vocab.id}
            className="card"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge">บทที่ {vocab.chapter_number} • {vocab.category}</span>
                <span className="badge-ref">{vocab.textbook_ref}</span>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-700)' }}>
                {vocab.word_romaji}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '2px' }}>
                {vocab.word_kana} {vocab.word_kanji ? `(${vocab.word_kanji})` : ''}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                ความหมาย: {vocab.meaning_th}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                {vocab.example_jp ? `ตัวอย่าง: ${vocab.example_jp}` : ''}
              </div>
              <button
                onClick={() => playJapaneseAudio(vocab.word_kana)}
                className="btn-outline"
                style={{ padding: '4px 8px', fontSize: '12px' }}
                title="ฟังเสียง"
              >
                <Volume2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
