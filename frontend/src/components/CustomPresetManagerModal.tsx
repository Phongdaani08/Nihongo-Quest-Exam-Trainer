import React, { useState, useMemo } from 'react';
import { X, Search, Check, BookOpen, AlertCircle, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { fallbackVocabs } from '../services/api';
import { allSection3Pool } from './VisualQAArena';

export interface CustomPracticePreset {
  id: string;
  name: string;
  isCustom?: boolean;
  sec2VocabIds: string[];
  sec3QuestionIds?: string[];
  sec3TypeIds: number[];
  updatedAt?: string;
}

export const defaultPresets: CustomPracticePreset[] = [
  {
    id: 'preset_all',
    name: 'คลังข้อสอบทั้งหมด (73 คำศัพท์ & ภาพครบทุกข้อ)',
    isCustom: false,
    sec2VocabIds: fallbackVocabs.map((v) => v.id),
    sec3QuestionIds: allSection3Pool.map((q) => q.id),
    sec3TypeIds: [1, 2, 3, 4, 5],
  },
  {
    id: 'preset_ch1',
    name: 'เน้นบทที่ 1 (การแนะนำตัว อาชีพ สรรพนาม ประเทศ)',
    isCustom: false,
    sec2VocabIds: fallbackVocabs.filter((v) => v.chapter_number === 1).map((v) => v.id),
    sec3QuestionIds: allSection3Pool.filter((q) => q.typeId === 2 || q.typeId === 3 || q.typeId === 5).map((q) => q.id),
    sec3TypeIds: [2, 3, 5],
  },
  {
    id: 'preset_ch2',
    name: 'เน้นบทที่ 2 (สิ่งของ นามบัตร สถานที่ นิตยสาร)',
    isCustom: false,
    sec2VocabIds: fallbackVocabs.filter((v) => v.chapter_number === 2).map((v) => v.id),
    sec3QuestionIds: allSection3Pool.filter((q) => q.typeId === 1 || q.typeId === 4).map((q) => q.id),
    sec3TypeIds: [1, 4],
  },
];

interface PresetEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: CustomPracticePreset) => void;
  editingPreset: CustomPracticePreset | null;
}

export const PresetEditorModal: React.FC<PresetEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'sec2' | 'sec3'>('sec2');
  const [name, setName] = useState<string>('');
  const [selectedVocabIds, setSelectedVocabIds] = useState<string[]>([]);
  const [selectedSec3QuestionIds, setSelectedSec3QuestionIds] = useState<string[]>([]);
  const [expandedSec3Types, setExpandedSec3Types] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  // Search, Filter & Sort for Section 2
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'romaji_asc' | 'meaning_asc'>('default');

  // Error validation message
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (editingPreset) {
      setName(editingPreset.name);
      setSelectedVocabIds([...editingPreset.sec2VocabIds]);
      if (editingPreset.sec3QuestionIds && editingPreset.sec3QuestionIds.length > 0) {
        setSelectedSec3QuestionIds([...editingPreset.sec3QuestionIds]);
      } else {
        // Fallback: select all items belonging to the preset's sec3TypeIds
        const matchedQIds = allSection3Pool
          .filter((q) => editingPreset.sec3TypeIds.includes(q.typeId))
          .map((q) => q.id);
        setSelectedSec3QuestionIds(matchedQIds);
      }
    } else {
      setName('ชุดฝึกซ้อมกำหนดเอง #' + (Math.floor(Math.random() * 900) + 100));
      setSelectedVocabIds(fallbackVocabs.slice(0, 15).map((v) => v.id));
      setSelectedSec3QuestionIds(allSection3Pool.map((q) => q.id));
    }
    setErrorMsg(null);
  }, [editingPreset, isOpen]);

  // Categories list for Section 2
  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(fallbackVocabs.map((v) => v.category)));
    return cats;
  }, []);

  // Filtered & Sorted Vocabs
  const filteredVocabs = useMemo(() => {
    return fallbackVocabs
      .filter((item) => {
        if (selectedChapter !== 'all' && item.chapter_number?.toString() !== selectedChapter) {
          return false;
        }
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchRomaji = item.word_romaji.toLowerCase().includes(q);
          const matchKana = item.word_kana.toLowerCase().includes(q);
          const matchMeaning = item.meaning_th.toLowerCase().includes(q);
          return matchRomaji || matchKana || matchMeaning;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'romaji_asc') return a.word_romaji.localeCompare(b.word_romaji);
        if (sortBy === 'meaning_asc') return a.meaning_th.localeCompare(b.meaning_th);
        return 0; // Default textbook order
      });
  }, [searchQuery, selectedChapter, selectedCategory, sortBy]);

  // Toggle single vocab
  const toggleVocab = (id: string) => {
    setSelectedVocabIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk select visible vocabs
  const selectAllVisibleVocabs = () => {
    const visibleIds = filteredVocabs.map((v) => v.id);
    const newSet = new Set([...selectedVocabIds, ...visibleIds]);
    setSelectedVocabIds(Array.from(newSet));
  };

  // Bulk deselect visible vocabs
  const deselectAllVisibleVocabs = () => {
    const visibleIds = new Set(filteredVocabs.map((v) => v.id));
    setSelectedVocabIds((prev) => prev.filter((id) => !visibleIds.has(id)));
  };

  // Toggle single Section 3 question item
  const toggleSec3Question = (qId: string) => {
    setSelectedSec3QuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((x) => x !== qId) : [...prev, qId]
    );
  };

  // Toggle all items in a Section 3 type
  const toggleAllInSec3Type = (typeId: number, select: boolean) => {
    const typeQIds = allSection3Pool.filter((q) => q.typeId === typeId).map((q) => q.id);
    if (select) {
      const newSet = new Set([...selectedSec3QuestionIds, ...typeQIds]);
      setSelectedSec3QuestionIds(Array.from(newSet));
    } else {
      const typeSet = new Set(typeQIds);
      setSelectedSec3QuestionIds((prev) => prev.filter((id) => !typeSet.has(id)));
    }
  };

  // Toggle accordion expand
  const toggleAccordion = (typeId: number) => {
    setExpandedSec3Types((prev) => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  // Handle Save
  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('กรุณาตั้งชื่อพรีเซ็ต');
      return;
    }
    if (selectedVocabIds.length < 2) {
      setErrorMsg('กรุณาเลือกคำศัพท์ในส่วนที่ 2 อย่างน้อย 2 คำ');
      return;
    }
    if (selectedSec3QuestionIds.length < 1) {
      setErrorMsg('กรุณาเลือกภาพคำถามในส่วนที่ 3 อย่างน้อย 1 ข้อ');
      return;
    }

    // Determine which types are included based on selected question IDs
    const includedTypes = Array.from(
      new Set(
        allSection3Pool
          .filter((q) => selectedSec3QuestionIds.includes(q.id))
          .map((q) => q.typeId)
      )
    );

    const newPreset: CustomPracticePreset = {
      id: editingPreset ? editingPreset.id : `preset_custom_${Date.now()}`,
      name: name.trim(),
      isCustom: true,
      sec2VocabIds: selectedVocabIds,
      sec3QuestionIds: selectedSec3QuestionIds,
      sec3TypeIds: includedTypes,
      updatedAt: new Date().toISOString(),
    };

    onSave(newPreset);
    onClose();
  };

  if (!isOpen) return null;

  const sec3TypesMetadata = [
    {
      id: 1,
      title: 'แบบที่ 1: ถามสิ่งของ (Objects)',
      subtitle: 'Kore wa nan desuka?',
      desc: 'เก้าอี้, โต๊ะ, หนังสือ, นิตยสาร, พจนานุกรม, กระเป๋า, นาฬิกา, ร่ม, ดินสอ, กุญแจ, โทรศัพท์, หนังสือพิมพ์, สมุดพก',
    },
    {
      id: 2,
      title: 'แบบที่ 2: ถามประเทศ (Countries)',
      subtitle: 'Anohito wa doko kara kimashitaka?',
      desc: 'ธงชาติและประเทศ: ญี่ปุ่น (Nihon), ไทย (Tai), สหรัฐอเมริกา (Amerika), จีน (Chūgoku)',
    },
    {
      id: 3,
      title: 'แบบที่ 3: ทายอาชีพ (Occupations)',
      subtitle: 'Anohito wa dare desuka?',
      desc: 'พนักงานธนาคาร, อาจารย์, นักศึกษา, แพทย์, ทนายความ, พนักงานบริษัท, นักวิจัย',
    },
    {
      id: 4,
      title: 'แบบที่ 4: ถามประเภทนิตยสาร (Magazine Topics)',
      subtitle: 'Kore wa nan no zasshi desuka?',
      desc: 'นิตยสารภาษาญี่ปุ่น, นิตยสารรถยนต์',
    },
    {
      id: 5,
      title: 'แบบที่ 5: ถามสถานที่/จุดบริการ (Locations)',
      subtitle: 'Kochira wa nan desuka?',
      desc: 'แผนกต้อนรับ/ประชาสัมพันธ์, มหาวิทยาลัย, โรงพยาบาล',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {editingPreset ? 'แก้ไขชุดข้อสอบพรีเซ็ต' : 'สร้างชุดข้อสอบพรีเซ็ตใหม่'}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              กำหนดคำศัพท์และภาพข้อสอบแต่ละข้อที่ต้องการฝึกใน Endless Mode
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* PRESET NAME INPUT */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            ชื่อชุดพรีเซ็ต (Preset Name):
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น คำศัพท์บทที่ 1 ที่ยังจำไม่แม่น, เน้นถามสิ่งของและสถานที่..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600,
              outline: 'none',
            }}
          />
        </div>

        {/* TABS SELECTOR */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px', backgroundColor: 'var(--bg-surface)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('sec2')}
            style={{
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 700,
              color: activeTab === 'sec2' ? 'var(--primary-600)' : 'var(--text-muted)',
              borderBottom: activeTab === 'sec2' ? '2px solid var(--primary-600)' : '2px solid transparent',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BookOpen size={16} />
            <span>ส่วนที่ 2: คำศัพท์แปลไทย-ญี่ปุ่น</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'sec2' ? 'var(--primary-100)' : 'var(--bg-subtle)',
                color: activeTab === 'sec2' ? 'var(--primary-700)' : 'var(--text-muted)',
                fontWeight: 700,
              }}
            >
              เลือกแล้ว {selectedVocabIds.length}/{fallbackVocabs.length} คำ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sec3')}
            style={{
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 700,
              color: activeTab === 'sec3' ? 'var(--primary-600)' : 'var(--text-muted)',
              borderBottom: activeTab === 'sec3' ? '2px solid var(--primary-600)' : '2px solid transparent',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ImageIcon size={16} />
            <span>ส่วนที่ 3: ชี้ภาพตอบคำถาม (เลือกรายภาพ)</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: activeTab === 'sec3' ? 'var(--primary-100)' : 'var(--bg-subtle)',
                color: activeTab === 'sec3' ? 'var(--primary-700)' : 'var(--text-muted)',
                fontWeight: 700,
              }}
            >
              เลือกแล้ว {selectedSec3QuestionIds.length}/{allSection3Pool.length} ข้อ
            </span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', backgroundColor: 'var(--bg-app)' }}>
          {/* TAB 1: SECTION 2 VOCABULARIES */}
          {activeTab === 'sec2' && (
            <div>
              {/* FILTERS & SEARCH TOOLBAR */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {/* Search */}
                <div style={{ flex: '1 1 200px', position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="พิมพ์ค้นหาคำศัพท์ / ความหมาย..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Chapter Dropdown */}
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="all">ทุกบทเรียน (Ch.1 & Ch.2)</option>
                  <option value="1">บทที่ 1 (การแนะนำตัว)</option>
                  <option value="2">บทที่ 2 (การแลกนามบัตร)</option>
                </select>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                    textTransform: 'capitalize',
                  }}
                >
                  <option value="all">ทุกหมวดหมู่ (All Categories)</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      หมวด: {cat}
                    </option>
                  ))}
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="default">เรียงตามบทเรียน (Default)</option>
                  <option value="romaji_asc">เรียงตาม Romaji (A-Z)</option>
                  <option value="meaning_asc">เรียงตามความหมายไทย</option>
                </select>
              </div>

              {/* ACTION BAR & STATS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  แสดง {filteredVocabs.length} คำ (เลือกไว้ทั้งหมด {selectedVocabIds.length}/{fallbackVocabs.length} คำ)
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={selectAllVisibleVocabs}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--primary-300)',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      cursor: 'pointer',
                    }}
                  >
                    + เลือกทั้งหมดที่แสดง ({filteredVocabs.length})
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllVisibleVocabs}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    ล้างการเลือกที่แสดง
                  </button>
                </div>
              </div>

              {/* VOCABULARY CHECKBOX GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                {filteredVocabs.map((v) => {
                  const isChecked = selectedVocabIds.includes(v.id);
                  return (
                    <div
                      key={v.id}
                      onClick={() => toggleVocab(v.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isChecked ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                        backgroundColor: isChecked ? 'var(--primary-50)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                            {v.word_romaji}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            ({v.word_kana})
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.meaning_th}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Ch.{v.chapter_number}
                          </span>
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {v.category}
                          </span>
                        </div>
                      </div>

                      {/* Custom Checkbox Pill */}
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: isChecked ? '2px solid var(--primary-600)' : '2px solid var(--border-strong)',
                          backgroundColor: isChecked ? 'var(--primary-600)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          flexShrink: 0,
                        }}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SECTION 3 GRANULAR IMAGE & VOCABULARY ACCORDIONS */}
          {activeTab === 'sec3' && (
            <div>
              <div style={{ marginBottom: '16px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                เลือกภาพคำถามที่ต้องการฝึกซ้อมในแต่ละรูปแบบ สามารถกดขยายเพื่อติ๊กเลือกคำศัพท์และภาพเฉพาะข้อได้:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sec3TypesMetadata.map((t) => {
                  const typeQuestions = allSection3Pool.filter((q) => q.typeId === t.id);
                  const selectedInTypeCount = typeQuestions.filter((q) => selectedSec3QuestionIds.includes(q.id)).length;
                  const isAllSelected = selectedInTypeCount === typeQuestions.length;
                  const isExpanded = !!expandedSec3Types[t.id];

                  return (
                    <div
                      key={t.id}
                      style={{
                        borderRadius: 'var(--radius-md)',
                        border: selectedInTypeCount > 0 ? '1.5px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        overflow: 'hidden',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* ACCORDION HEADER */}
                      <div
                        style={{
                          padding: '14px 18px',
                          backgroundColor: selectedInTypeCount > 0 ? 'var(--primary-50)' : 'var(--bg-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleAccordion(t.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)' }}>
                                {t.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  backgroundColor: selectedInTypeCount > 0 ? 'var(--primary-200)' : 'var(--bg-surface)',
                                  color: selectedInTypeCount > 0 ? 'var(--primary-800)' : 'var(--text-muted)',
                                  fontWeight: 700,
                                }}
                              >
                                เลือกแล้ว {selectedInTypeCount} / {typeQuestions.length} ข้อ
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              อาจารย์ถาม: <strong style={{ color: 'var(--primary-700)' }}>"{t.subtitle}"</strong>
                            </div>
                          </div>
                        </div>

                        {/* Actions in header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => toggleAllInSec3Type(t.id, !isAllSelected)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-subtle)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                            }}
                          >
                            {isAllSelected ? 'ล้างการเลือกในหมวดนี้' : '+ เลือกทั้งหมดในหมวดนี้'}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleAccordion(t.id)}
                            style={{
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* ACCORDION CONTENT: ITEM CHECKBOX GRID */}
                      {isExpanded && (
                        <div style={{ padding: '14px 18px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                            {typeQuestions.map((q) => {
                              const isChecked = selectedSec3QuestionIds.includes(q.id);
                              return (
                                <div
                                  key={q.id}
                                  onClick={() => toggleSec3Question(q.id)}
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: isChecked ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                                    backgroundColor: isChecked ? 'var(--primary-50)' : 'var(--bg-app)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                                    <div
                                      style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '6px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid var(--border-subtle)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                      }}
                                    >
                                      <img src={q.imageSrc} alt={q.imageTitle} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    </div>

                                    <div style={{ minWidth: 0, flex: 1 }}>
                                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {q.imageTitle}
                                      </div>
                                      <div style={{ fontSize: '11.5px', color: 'var(--primary-700)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {q.correctAnswerRomaji}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Custom Checkbox Pill */}
                                  <div
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '5px',
                                      border: isChecked ? '2px solid var(--primary-600)' : '2px solid var(--border-strong)',
                                      backgroundColor: isChecked ? 'var(--primary-600)' : 'transparent',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#ffffff',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {isChecked && <Check size={12} strokeWidth={3} />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ERROR MESSAGE NOTIFICATION */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--danger-50)',
              borderTop: '1px solid var(--danger-border)',
              color: 'var(--danger-600)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            * สุ่มคำศัพท์และภาพเฉพาะที่เลือกไว้เมื่อเริ่มการฝึกซ้อม Endless Practice
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              style={{
                padding: '9px 22px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13.5px',
                fontWeight: 700,
              }}
            >
              บันทึกชุดพรีเซ็ต
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
