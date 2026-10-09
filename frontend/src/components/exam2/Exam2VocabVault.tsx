import React, { useState } from 'react';
import { Search, Volume2, BookOpen, Layers, CheckCircle2, HelpCircle, Eye, EyeOff, Table2 } from 'lucide-react';
import { exam2VocabList } from '../../services/exam2Data';
import { playJapaneseAudio } from '../../utils/speech';

export const Exam2VocabVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'flashcard_drill' | 'master_tables'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<number | 0>(0);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);
  const [showAnswersGlobal, setShowAnswersGlobal] = useState<boolean>(true);

  // Flashcard Drill State
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());

  // Filtered Vocabularies
  const filteredVocabs = exam2VocabList.filter((v) => {
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

  const handleNextCard = () => {
    setIsFlipped(false);
    setDrillIndex((prev) => (prev + 1) % filteredVocabs.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setDrillIndex((prev) => (prev - 1 + filteredVocabs.length) % filteredVocabs.length);
  };

  const toggleKnownWord = (id: string) => {
    setKnownWords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentDrillWord = filteredVocabs[drillIndex] || filteredVocabs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">คลังคำศัพท์ & ไวยากรณ์ รอบที่ 2</span>
            <span className="badge badge-ref">บทที่ 3 (เวลา & สถานที่) + บทที่ 4 (การซื้อของ & ตัวเลข) รวม {exam2VocabList.length} คำศัพท์หลักสูตร</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            Exam #2 Vocabulary & Knowledge Vault (คลังความรู้ JN60101 บทที่ 3-4 ฉบับสมบูรณ์)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '2px' }}>
            รวบรวมคำศัพท์ครบ 100% จากสไลด์ PDF ทั้ง 2 บท พร้อมตารางสรุปข้อยกเว้นเสียงเวลา-นาที และระบบจำลองตัวเลข 100 ถึง 1 ล้าน
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowAnswersGlobal(!showAnswersGlobal)}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}
          >
            {showAnswersGlobal ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showAnswersGlobal ? 'ซ่อนคำแปล (Flashcard Mode)' : 'เปิดแสดงคำแปลทั้งหมด'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRomaji(!showRomaji)}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}
          >
            <span>{showRomaji ? 'ซ่อน Romaji' : 'แสดง Romaji'}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'cards' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'cards' ? 'var(--primary-50)' : 'var(--bg-surface)',
            color: activeTab === 'cards' ? 'var(--primary-700)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <BookOpen size={16} />
          <span>การ์ดคำศัพท์ทั้งหมด ({filteredVocabs.length}/{exam2VocabList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flashcard_drill')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'flashcard_drill' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'flashcard_drill' ? 'var(--primary-50)' : 'var(--bg-surface)',
            color: activeTab === 'flashcard_drill' ? 'var(--primary-700)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={16} />
          <span>ฝึกท่องจำ Flashcard Drill (จำได้ {knownWords.size}/{exam2VocabList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('master_tables')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'master_tables' ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'master_tables' ? 'var(--primary-50)' : 'var(--bg-surface)',
            color: activeTab === 'master_tables' ? 'var(--primary-700)' : 'var(--text-main)',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Table2 size={16} />
          <span>ตารางสรุปข้อยกเว้นเสียง & ไวยากรณ์ (Master Charts)</span>
        </button>
      </div>

      {/* 1. CARDS TAB VIEW */}
      {activeTab === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Bar */}
          <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '14px 18px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="ค้นหาคำศัพท์ (Romaji, คานะ, คันจิ, แปลไทย)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '13.5px',
                }}
              />
            </div>

            {/* Chapter Filter */}
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(Number(e.target.value))}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <option value={0}>📚 ทุกบท (บทที่ 3 และ 4)</option>
              <option value={3}>บทที่ 3: การคุยเรื่องเวลา & สถานที่</option>
              <option value={4}>บทที่ 4: การซื้อของ & ตัวเลข</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <option value="all">🏷️ ทุกหมวดหมู่</option>
              <option value="location">🏢 สถานที่ & ผังอาคาร (Ch.3)</option>
              <option value="demonstrative">👉 คำชี้ตำแหน่ง kore/sono/koko (Ch.3)</option>
              <option value="time">⏰ เวลา, โมง, นาที, ข้อยกเว้น (Ch.3)</option>
              <option value="activity">📅 กิจกรรม shigoto/kaigi/eiga (Ch.3)</option>
              <option value="shopping">🛍️ การซื้อของ & ร้านค้า (Ch.4)</option>
              <option value="electronics">📻 สินค้าไอที & อุปกรณ์ (Ch.4)</option>
              <option value="stationery">✉️ เครื่องเขียน tegami/kitte (Ch.4)</option>
              <option value="goods">👜 ของใช้ kaban/jisho/kasa (Ch.4)</option>
              <option value="number">🔢 ตัวเลข 100 - ล้านล้าน (Ch.4)</option>
              <option value="phrase">💬 สำนวน & คำช่วย kara/made/mo (Ch.3-4)</option>
              <option value="math">➗ ทศนิยม & เศษส่วน (Ch.4)</option>
            </select>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {filteredVocabs.map((vocab) => {
              const isKnown = knownWords.has(vocab.id);
              return (
                <div
                  key={vocab.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: isKnown ? '1.5px solid var(--color-success)' : '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    {/* Top Tag & Audio */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                        บทที่ {vocab.chapter_number} • {vocab.category}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => toggleKnownWord(vocab.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: isKnown ? 'var(--color-success)' : 'var(--text-muted)',
                          }}
                          title={isKnown ? 'จำได้แล้ว' : 'ทำเครื่องหมายว่าจำได้แล้ว'}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => playJapaneseAudio(vocab.word_kana || vocab.word_romaji)}
                          style={{
                            border: 'none',
                            background: 'var(--bg-app)',
                            cursor: 'pointer',
                            color: 'var(--primary-600)',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title="ฟังเสียงออกเสียงภาษาญี่ปุ่น"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Japanese Word */}
                    <div style={{ margin: '6px 0 10px 0' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {vocab.word_kana}
                      </div>
                      {vocab.word_kanji && (
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {vocab.word_kanji}
                        </div>
                      )}
                      {showRomaji && (
                        <div style={{ fontSize: '13.5px', color: 'var(--primary-600)', fontWeight: 600, marginTop: '2px' }}>
                          {vocab.word_romaji}
                        </div>
                      )}
                    </div>

                    {/* Thai Translation */}
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: showAnswersGlobal ? 'var(--bg-app)' : 'var(--border-subtle)',
                        borderLeft: '3px solid var(--primary-500)',
                        marginBottom: '10px',
                        minHeight: '36px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showAnswersGlobal ? (
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {vocab.meaning_th}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          (กดเปิดตาด้านบนเพื่อดูความหมาย)
                        </span>
                      )}
                    </div>

                    {/* Example Sentence */}
                    {vocab.example_jp && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>📝 {vocab.example_jp}</div>
                        {showAnswersGlobal && vocab.example_th && (
                          <div style={{ color: 'var(--text-muted)' }}>{vocab.example_th}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                    {vocab.textbook_ref}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. FLASHCARD DRILL TAB */}
      {activeTab === 'flashcard_drill' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
          {filteredVocabs.length > 0 ? (
            <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Progress & Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                <span>การ์ดที่ {drillIndex + 1} / {filteredVocabs.length}</span>
                <span>จำได้แล้ว: {knownWords.size} คำ</span>
              </div>

              {/* Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="card"
                style={{
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '36px 24px',
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  backgroundColor: isFlipped ? 'var(--primary-50)' : 'var(--bg-surface)',
                  border: isFlipped ? '2px solid var(--primary-400)' : '2px solid var(--border-subtle)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: '16px', left: '18px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                    บทที่ {currentDrillWord.chapter_number} • {currentDrillWord.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playJapaneseAudio(currentDrillWord.word_kana || currentDrillWord.word_romaji);
                  }}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '18px',
                    border: 'none',
                    background: 'var(--bg-app)',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Volume2 size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>ฟังเสียง</span>
                </button>

                {!isFlipped ? (
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                      {currentDrillWord.word_kana}
                    </div>
                    {currentDrillWord.word_kanji && (
                      <div style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                        {currentDrillWord.word_kanji}
                      </div>
                    )}
                    {showRomaji && (
                      <div style={{ fontSize: '16px', color: 'var(--primary-600)', fontWeight: 600 }}>
                        {currentDrillWord.word_romaji}
                      </div>
                    )}
                    <div style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <HelpCircle size={15} /> คลิกที่การ์ดเพื่อดูคำแปลเฉลย
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary-700)', marginBottom: '12px' }}>
                      {currentDrillWord.meaning_th}
                    </div>
                    {currentDrillWord.example_jp && (
                      <div style={{ marginTop: '16px', padding: '12px 18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', textAlign: 'left', fontSize: '13px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>📝 {currentDrillWord.example_jp}</div>
                        <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>{currentDrillWord.example_th}</div>
                      </div>
                    )}
                    <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      อ้างอิง: {currentDrillWord.textbook_ref}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={handlePrevCard} className="btn btn-secondary" style={{ flex: 1 }}>
                  ← ก่อนหน้า
                </button>

                <button
                  type="button"
                  onClick={() => toggleKnownWord(currentDrillWord.id)}
                  className={`btn ${knownWords.has(currentDrillWord.id) ? 'btn-success' : 'btn-secondary'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{knownWords.has(currentDrillWord.id) ? 'จำได้แล้ว ✓' : 'ทำเครื่องหมายว่าจำได้'}</span>
                </button>

                <button type="button" onClick={handleNextCard} className="btn btn-primary" style={{ flex: 1 }}>
                  ถัดไป →
                </button>
              </div>
            </div>
          ) : (
            <div>ไม่พบคำศัพท์ตามตัวกรอง</div>
          )}
        </div>
      )}

      {/* 3. MASTER CHARTS & GRAMMAR TABLES TAB */}
      {activeTab === 'master_tables' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Chart 1: Time Hours (1-12) */}
          <div className="card" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⏰ 1. ตารางบอกเวลาชั่วโมง 1-12 โมง (...ji) & ข้อยกเว้นเสียง
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              ระวังข้อสอบออกหลอก 4 โมง, 7 โมง, และ 9 โมง
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>เวลา</th>
                    <th style={{ padding: '10px 14px' }}>Romaji</th>
                    <th style={{ padding: '10px 14px' }}>Hiragana/Kanji</th>
                    <th style={{ padding: '10px 14px' }}>หมายเหตุ & จุดหลอกข้อสอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { t: '1:00', r: 'ichi-ji', k: 'いちじ (1時)', note: 'ปกติ' },
                    { t: '2:00', r: 'ni-ji', k: 'にじ (2時)', note: 'ปกติ' },
                    { t: '3:00', r: 'san-ji', k: 'さんじ (3時)', note: 'ปกติ' },
                    { t: '4:00', r: 'yo-ji ⭐', k: 'よじ (4時)', note: '⚠️ ข้อยกเว้น! ห้ามอ่าน yon-ji หรือ shi-ji', highlight: true },
                    { t: '5:00', r: 'go-ji', k: 'ごじ (5時)', note: 'ปกติ' },
                    { t: '6:00', r: 'roku-ji', k: 'ろくじ (6時)', note: 'ปกติ' },
                    { t: '7:00', r: 'shichi-ji ⭐', k: 'しちじ (7時)', note: '⚠️ นิยมออกเสียง shichi-ji (ไม่นิยม nana-ji)', highlight: true },
                    { t: '8:00', r: 'hachi-ji', k: 'はちじ (8時)', note: 'ปกติ' },
                    { t: '9:00', r: 'ku-ji ⭐', k: 'くじ (9時)', note: '⚠️ ข้อยกเว้น! ห้ามอ่าน kyū-ji เด็ดขาด', highlight: true },
                    { t: '10:00', r: 'jū-ji', k: 'じゅうじ (10時)', note: 'ปกติ' },
                    { t: '11:00', r: 'jūichi-ji', k: 'じゅういちじ (11時)', note: 'ปกติ' },
                    { t: '12:00', r: 'jūni-ji', k: 'じゅうにじ (12時)', note: 'ปกติ' },
                    { t: '0:00 (เที่ยงคืน)', r: 'rei-ji', k: 'れいじ (0時)', note: 'เที่ยงคืนตรง' },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: row.highlight ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                        fontWeight: row.highlight ? 700 : 400,
                      }}
                    >
                      <td style={{ padding: '10px 14px', color: 'var(--primary-600)', fontWeight: 700 }}>{row.t}</td>
                      <td style={{ padding: '10px 14px' }}>{row.r}</td>
                      <td style={{ padding: '10px 14px' }}>{row.k}</td>
                      <td style={{ padding: '10px 14px', color: row.highlight ? 'var(--color-danger)' : 'var(--text-muted)' }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart 2: Minutes (fun vs pun) */}
          <div className="card" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              ⏱️ 2. ตารางบอกนาที (...fun vs ...pun)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              การเปลี่ยนเสียงตามพยัญชนะต้น: 1, 3, 4, 6, 8, 10, 30 ใช้นาทีแบบเสียงกัก/กลม (ぷん pun)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '8px' }}>
                  🔴 กลุ่มเสียงกัก ...pun (ぷん)
                </h4>
                <ul style={{ fontSize: '13px', lineHeight: 1.8, paddingLeft: '20px', color: 'var(--text-main)' }}>
                  <li><strong>1 นาที:</strong> ip-pun (いっぷん)</li>
                  <li><strong>3 นาที:</strong> san-pun (さんぷん)</li>
                  <li><strong>4 นาที:</strong> yon-pun (よんぷん)</li>
                  <li><strong>6 นาที:</strong> rop-pun (ろっぷん) ⭐</li>
                  <li><strong>8 นาที:</strong> hap-pun (はっぷん) ⭐</li>
                  <li><strong>10 นาที:</strong> jup-pun (じゅっぷん) ⭐</li>
                  <li><strong>30 นาที:</strong> sanjup-pun (さんじゅっぷん) หรือ <strong>han (はん - ครึ่ง)</strong></li>
                </ul>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  🟢 กลุ่มเสียงปกติ ...fun (ふん)
                </h4>
                <ul style={{ fontSize: '13px', lineHeight: 1.8, paddingLeft: '20px', color: 'var(--text-main)' }}>
                  <li><strong>2 นาที:</strong> ni-fun (にふん)</li>
                  <li><strong>5 นาที:</strong> go-fun (ごふん)</li>
                  <li><strong>7 นาที:</strong> nana-fun (ななふん)</li>
                  <li><strong>9 นาที:</strong> kyū-fun (きゅうふん)</li>
                  <li><strong>15 นาที:</strong> jūgo-fun (じゅうごふん)</li>
                  <li><strong>45 นาที:</strong> yonjūgo-fun (よんじゅうごふん)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chart 3: Numbers (100 - 1,000,000,000,000) */}
          <div className="card" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
              💴 3. ตารางตัวเลข 100 ถึง 1 ล้านล้าน & ข้อยกเว้นเสียงเงินเยน
            </h3>
            <div style={{ overflowX: 'auto', marginTop: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-app)', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>ตัวเลข</th>
                    <th style={{ padding: '10px 14px' }}>Romaji</th>
                    <th style={{ padding: '10px 14px' }}>คานะ/คันจิ</th>
                    <th style={{ padding: '10px 14px' }}>กฎเสียงพิเศษ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: '100', r: 'hyaku', k: 'ひゃく (百)', rule: 'หลักร้อยปกติ' },
                    { n: '300', r: 'sanbyaku ⭐', k: 'さんびゃく (三百)', rule: '⚠️ เปลี่ยนเป็นเสียง byaku', h: true },
                    { n: '600', r: 'roppyaku ⭐', k: 'ろっぴゃく (六百)', rule: '⚠️ เสียงกัก roppyaku', h: true },
                    { n: '800', r: 'happyaku ⭐', k: 'はっぴゃく (八百)', rule: '⚠️ เสียงกัก happyaku', h: true },
                    { n: '1,000', r: 'sen', k: 'せん (千)', rule: 'หนึ่งพัน (ห้ามพูด ichi-sen)' },
                    { n: '3,000', r: 'sanzen ⭐', k: 'さんぜん (三千)', rule: '⚠️ เปลี่ยนเป็นเสียง zen', h: true },
                    { n: '8,000', r: 'hassen ⭐', k: 'はっせん (八千)', rule: '⚠️ เสียงกัก hassen', h: true },
                    { n: '10,000', r: 'ichi-man ⭐', k: 'いちまん (一万)', rule: '⚠️ ต้องใส่ ichi นำหน้า man เสมอ', h: true },
                    { n: '100,000', r: 'jū-man', k: 'じゅうまん (十万)', rule: 'สิบหมื่น = หนึ่งแสน' },
                    { n: '1,000,000', r: 'hyaku-man', k: 'ひゃくまん (百万)', rule: 'ร้อยหมื่น = หนึ่งล้าน' },
                    { n: '10,000,000', r: 'sen-man', k: 'せんまん (千万)', rule: 'พันหมื่น = สิบล้าน' },
                    { n: '100,000,000', r: 'ichi-oku', k: 'いちおく (一億)', rule: 'หนึ่งร้อยล้าน' },
                    { n: '1,000,000,000,000', r: 'it-chō', k: 'いっちょう (一兆)', rule: 'หนึ่งล้านล้าน' },
                  ].map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: item.h ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                        fontWeight: item.h ? 700 : 400,
                      }}
                    >
                      <td style={{ padding: '9px 14px', color: 'var(--primary-600)', fontWeight: 700 }}>{item.n}</td>
                      <td style={{ padding: '9px 14px' }}>{item.r}</td>
                      <td style={{ padding: '9px 14px' }}>{item.k}</td>
                      <td style={{ padding: '9px 14px', color: item.h ? 'var(--color-danger)' : 'var(--text-muted)' }}>{item.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart 4: Math Decimals & Fractions */}
          <div className="card" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              ➗ 4. การอ่านทศนิยม (ten) & เศษส่วน (bun no)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  จุดทศนิยม = ten (てん)
                </h4>
                <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-main)' }}>
                  <div>• <strong>0.7:</strong> rei ten nana (ศูนย์จุดเจ็ด)</div>
                  <div>• <strong>0.29:</strong> rei ten ni kyū (อ่านเลขเรียงตัว)</div>
                  <div>• <strong>0.538:</strong> rei ten go san hachi</div>
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  เศษส่วน = [ส่วน] bun no [เศษ]
                </h4>
                <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-main)' }}>
                  <div>• <strong>1/2:</strong> ni-bun no ichi (หนึ่งในสอง)</div>
                  <div>• <strong>1/4:</strong> yon-bun no ichi (หนึ่งในสี่)</div>
                  <div>• <strong>2/3:</strong> san-bun no ni (สองในสาม)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
