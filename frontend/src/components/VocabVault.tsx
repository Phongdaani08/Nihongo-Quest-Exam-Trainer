import React, { useState } from 'react';
import { Search, Volume2, Image as ImageIcon, BookOpen } from 'lucide-react';
import { fallbackVocabs } from '../services/api';
import { allSection3Pool } from './VisualQAArena';
import { playJapaneseAudio } from '../utils/speech';

export const VocabVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vocabs' | 'visual_gallery'>('vocabs');

  // Vocabs Tab Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | 0>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyWithImages, setOnlyWithImages] = useState<boolean>(false);

  // Visual Gallery Filters
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<number | 0>(0);
  const [visualSearchTerm, setVisualSearchTerm] = useState('');

  // Filtered Vocabularies
  const filteredVocabs = fallbackVocabs.filter((v) => {
    if (selectedChapter !== 0 && v.chapter_number !== selectedChapter) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (onlyWithImages && !v.image_url) return false;
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

  // Filtered Visual Questions
  const filteredVisualQuestions = allSection3Pool.filter((q) => {
    if (selectedTypeFilter !== 0 && q.typeId !== selectedTypeFilter) return false;
    if (visualSearchTerm) {
      const s = visualSearchTerm.toLowerCase();
      return (
        q.imageTitle.toLowerCase().includes(s) ||
        q.teacherQuestionRomaji.toLowerCase().includes(s) ||
        q.correctAnswerRomaji.toLowerCase().includes(s) ||
        q.correctAnswerTh.toLowerCase().includes(s) ||
        q.textbookRef.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalVocabsWithImages = fallbackVocabs.filter((v) => !!v.image_url).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">คลังคำศัพท์ & คลังภาพข้อสอบจริง</span>
            <span className="badge badge-ref">รวม 130 คำศัพท์ และ 48 ภาพจริงจากสไลด์ PDF</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            Textbook Vocabulary & Visual Vault (คลังความรู้ JN60101 ฉบับสมบูรณ์)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '2px' }}>
            ค้นหาคำศัพท์ คำทับศัพท์ Katakana และคลังภาพประกอบข้อสอบจริงตรงตามสไลด์ อ.ดร.เอกนรินทร์ จิรชีวีวงศ์
          </p>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('vocabs')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'vocabs' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'vocabs' ? 'var(--primary-50)' : 'var(--bg-surface)',
            color: activeTab === 'vocabs' ? 'var(--primary-700)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={16} />
          <span>คลังคำศัพท์หลักสูตร ({fallbackVocabs.length} คำ)</span>
          <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
            มีภาพ {totalVocabsWithImages} คำ
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visual_gallery')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'visual_gallery' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'visual_gallery' ? 'var(--primary-50)' : 'var(--bg-surface)',
            color: activeTab === 'visual_gallery' ? 'var(--primary-700)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
        >
          <ImageIcon size={16} />
          <span>คลังภาพข้อสอบจริง 5 รูปแบบ ({allSection3Pool.length} ภาพ)</span>
          <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--success-50)', color: 'var(--success-700)', fontWeight: 700 }}>
            PDF 100%
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VOCABULARIES WITH IMAGE PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'vocabs' && (
        <>
          {/* Search & Filters Toolbar */}
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
                  fontSize: '13.5px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                <option value="number">ตัวเลข (0-10)</option>
                <option value="language">ภาษา</option>
              </select>

              <button
                type="button"
                onClick={() => setOnlyWithImages(!onlyWithImages)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: onlyWithImages ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                  backgroundColor: onlyWithImages ? 'var(--primary-50)' : 'var(--bg-surface)',
                  color: onlyWithImages ? 'var(--primary-700)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ImageIcon size={14} />
                <span>เฉพาะคำที่มีรูปภาพ ({totalVocabsWithImages})</span>
              </button>
            </div>
          </div>

          {/* Vocab Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredVocabs.map((vocab) => (
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
                  overflow: 'hidden',
                }}
              >
                <div>
                  {/* Top Metadata Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge">บทที่ {vocab.chapter_number} • {vocab.category}</span>
                    <span className="badge-ref">{vocab.textbook_ref}</span>
                  </div>

                  {/* Image Thumbnail Preview (If Available) */}
                  {vocab.image_url ? (
                    <div
                      style={{
                        width: '100%',
                        height: '140px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        marginBottom: '12px',
                        padding: '6px',
                      }}
                    >
                      <img
                        src={vocab.image_url}
                        alt={vocab.word_romaji}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  ) : null}

                  {/* Word Romaji, Kana & Kanji */}
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-700)', letterSpacing: '-0.01em' }}>
                    {vocab.word_romaji}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '2px', fontWeight: 600 }}>
                    {vocab.word_kana} {vocab.word_kanji ? `(${vocab.word_kanji})` : ''}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    ความหมาย: <strong>{vocab.meaning_th}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {vocab.example_jp ? `${vocab.example_jp}` : ''}
                  </div>
                  <button
                    onClick={() => playJapaneseAudio(vocab.word_kana)}
                    className="btn-outline"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    title="กดฟังเสียงอ่านภาษาญี่ปุ่น"
                  >
                    <Volume2 size={14} /> ฟังเสียง
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VISUAL QUESTIONS & EXAM GALLERY (48 REAL IMAGES) */}
      {/* ========================================================================= */}
      {activeTab === 'visual_gallery' && (
        <>
          {/* Visual Gallery Filters */}
          <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อภาพ, คำถาม, หรือคำตอบ..."
                  value={visualSearchTerm}
                  onChange={(e) => setVisualSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13.5px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                แสดง {filteredVisualQuestions.length} / {allSection3Pool.length} ภาพ
              </div>
            </div>

            {/* 5-Type Filter Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {[
                { id: 0, label: 'ทั้งหมด (48 ภาพ)' },
                { id: 1, label: '1. สิ่งของ & Katakana (26 ภาพ)' },
                { id: 2, label: '2. 4 ประเทศ (4 ภาพ)' },
                { id: 3, label: '3. อาชีพ & บุคคล (9 ภาพ)' },
                { id: 4, label: '4. นิตยสาร (5 ภาพ)' },
                { id: 5, label: '5. สถานที่ & บริษัท (4 ภาพ)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTypeFilter(t.id)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedTypeFilter === t.id ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedTypeFilter === t.id ? 'var(--primary-50)' : 'var(--bg-surface)',
                    color: selectedTypeFilter === t.id ? 'var(--primary-700)' : 'var(--text-main)',
                    fontWeight: selectedTypeFilter === t.id ? 700 : 500,
                    fontSize: '11.5px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Gallery Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {filteredVisualQuestions.map((q) => (
              <div
                key={q.id}
                className="card"
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-primary">{q.typeName}</span>
                    <span className="badge-ref">{q.textbookRef}</span>
                  </div>

                  {/* Clean Real Photo Container */}
                  <div
                    style={{
                      width: '100%',
                      height: '180px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '10px',
                      marginBottom: '12px',
                    }}
                  >
                    <img
                      src={q.imageSrc}
                      alt={q.imageTitle}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px',
                      }}
                    />
                  </div>

                  {/* Item Title */}
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {q.imageTitle}
                  </div>

                  {/* Teacher Spoken Question Box */}
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--primary-600)',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>อาจารย์ถามว่า:</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                      "{q.teacherQuestionRomaji}"
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--primary-700)' }}>{q.teacherQuestionKana}</div>
                  </div>

                  {/* Target Answer */}
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'var(--success-50)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--success-600)',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: 'var(--success-700)', fontWeight: 600 }}>ประโยคคำตอบที่ถูกต้อง:</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {q.correctAnswerRomaji}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      {q.correctAnswerKana} ({q.correctAnswerTh})
                    </div>
                  </div>
                </div>

                {/* Footer Audio Actions */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => playJapaneseAudio(q.teacherQuestionKana)}
                    className="btn-outline"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                  >
                    <Volume2 size={13} /> ฟังคำถาม
                  </button>

                  <button
                    type="button"
                    onClick={() => playJapaneseAudio(q.correctAnswerKana)}
                    className="btn-primary"
                    style={{ padding: '5px 12px', fontSize: '12px' }}
                  >
                    <Volume2 size={13} /> ฟังคำตอบที่ถูก
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
