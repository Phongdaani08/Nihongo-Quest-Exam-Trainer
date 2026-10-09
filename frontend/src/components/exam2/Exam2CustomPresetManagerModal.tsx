import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Check,
  BookOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Clock,
  Phone,
  Tag,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import {
  exam2VocabList,
  allExam2QuestionsPool,
  Exam2QuestionItem
} from '../../services/exam2Data';

export interface Exam2PracticePreset {
  id: string;
  name: string;
  isCustom?: boolean;
  part1VocabIds: string[];
  part2PatternIds: number[];
  part2QuestionIds?: string[];
  updatedAt?: string;
}

export const defaultExam2Presets: Exam2PracticePreset[] = [
  {
    id: 'preset_e2_all',
    name: '🌟 คลังข้อสอบรอบที่ 2 ทั้งหมด (คำศัพท์ 78 คำ + 5 รูปแบบคำถามครบทุกข้อ)',
    isCustom: false,
    part1VocabIds: exam2VocabList.map((v) => v.id),
    part2PatternIds: [1, 2, 3, 4, 5],
    part2QuestionIds: allExam2QuestionsPool.map((q) => q.id),
  },
  {
    id: 'preset_e2_part1_only',
    name: '🎯 เจาะลึกส่วนที่ 1: คำศัพท์ ไทย → ญี่ปุ่น (5 คะแนนเต็ม)',
    isCustom: false,
    part1VocabIds: exam2VocabList.map((v) => v.id),
    part2PatternIds: [],
    part2QuestionIds: [],
  },
  {
    id: 'preset_e2_part2_only',
    name: '🎮 เจาะลึกส่วนที่ 2: ตอบคำถาม 5 รูปแบบ (10 คะแนนเต็ม)',
    isCustom: false,
    part1VocabIds: [],
    part2PatternIds: [1, 2, 3, 4, 5],
    part2QuestionIds: allExam2QuestionsPool.map((q) => q.id),
  },
  {
    id: 'preset_e2_locations',
    name: '🏢 เน้นสถานที่ & ผังอาคาร (Koko wa doko desuka)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.category === 'location' || v.category === 'demonstrative').map((v) => v.id),
    part2PatternIds: [1],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 1).map((q) => q.id),
  },
  {
    id: 'preset_e2_time',
    name: '⏰ เน้นเวลา & นาฬิกา (Ima nan ji desuka + ข้อยกเว้น yo-ji/ku-ji/han)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.category === 'time').map((v) => v.id),
    part2PatternIds: [2],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 2).map((q) => q.id),
  },
  {
    id: 'preset_e2_phone',
    name: '📞 เน้นเบอร์โทรศัพท์ (Denwa bangō + คำช่วย no)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.category === 'number' || v.category === 'math').map((v) => v.id),
    part2PatternIds: [3],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 3).map((q) => q.id),
  },
  {
    id: 'preset_e2_price',
    name: '🛍️ เน้นการซื้อของ & ป้ายราคา (Kore wa ikura desuka + 100 ถึง 100,000 เยน)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.category === 'shopping' || v.category === 'goods' || v.category === 'electronics' || v.category === 'currency' || v.category === 'number').map((v) => v.id),
    part2PatternIds: [4],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 4).map((q) => q.id),
  },
  {
    id: 'preset_e2_schedule',
    name: '📅 เน้นช่วงเวลาทำงาน & การประชุม (Kara...made desu)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.category === 'activity' || v.category === 'phrase').map((v) => v.id),
    part2PatternIds: [5],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 5).map((q) => q.id),
  },
  {
    id: 'preset_e2_ch3',
    name: '📚 รวมเฉพาะบทที่ 3 (เวลา, สถานที่, ผังอาคาร, กิจกรรม)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.chapter_number === 3).map((v) => v.id),
    part2PatternIds: [1, 2, 5],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 1 || q.patternId === 2 || q.patternId === 5).map((q) => q.id),
  },
  {
    id: 'preset_e2_ch4',
    name: '🛒 รวมเฉพาะบทที่ 4 (การซื้อของ, สินค้า, ตัวเลข 100 ถึงล้านล้าน)',
    isCustom: false,
    part1VocabIds: exam2VocabList.filter((v) => v.chapter_number === 4).map((v) => v.id),
    part2PatternIds: [3, 4],
    part2QuestionIds: allExam2QuestionsPool.filter((q) => q.patternId === 3 || q.patternId === 4).map((q) => q.id),
  },
];

interface Exam2PresetEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: Exam2PracticePreset) => void;
  editingPreset: Exam2PracticePreset | null;
}

export const Exam2PresetEditorModal: React.FC<Exam2PresetEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2'>('part1');
  const [name, setName] = useState<string>('');
  const [selectedVocabIds, setSelectedVocabIds] = useState<string[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [expandedPatterns, setExpandedPatterns] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  // Filters for Part 1
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'romaji_asc' | 'meaning_asc'>('default');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingPreset) {
      setName(editingPreset.name);
      setSelectedVocabIds([...editingPreset.part1VocabIds]);
      if (editingPreset.part2QuestionIds && editingPreset.part2QuestionIds.length > 0) {
        setSelectedQuestionIds([...editingPreset.part2QuestionIds]);
      } else {
        const matched = allExam2QuestionsPool
          .filter((q) => editingPreset.part2PatternIds.includes(q.patternId))
          .map((q) => q.id);
        setSelectedQuestionIds(matched);
      }
    } else {
      setName('ชุดฝึกซ้อมรอบที่ 2 กำหนดเอง #' + (Math.floor(Math.random() * 900) + 100));
      setSelectedVocabIds(exam2VocabList.slice(0, 20).map((v) => v.id));
      setSelectedQuestionIds(allExam2QuestionsPool.map((q) => q.id));
    }
    setErrorMsg(null);
  }, [editingPreset, isOpen]);

  const categories = useMemo(() => {
    return Array.from(new Set(exam2VocabList.map((v) => v.category)));
  }, []);

  const filteredVocabs = useMemo(() => {
    return exam2VocabList
      .filter((item) => {
        if (selectedChapter !== 'all' && item.chapter_number?.toString() !== selectedChapter) return false;
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            item.word_romaji.toLowerCase().includes(q) ||
            item.word_kana.toLowerCase().includes(q) ||
            item.meaning_th.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'romaji_asc') return a.word_romaji.localeCompare(b.word_romaji);
        if (sortBy === 'meaning_asc') return a.meaning_th.localeCompare(b.meaning_th);
        return 0;
      });
  }, [searchQuery, selectedChapter, selectedCategory, sortBy]);

  const toggleVocab = (id: string) => {
    setSelectedVocabIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllVisibleVocabs = () => {
    const visibleIds = filteredVocabs.map((v) => v.id);
    const newSet = new Set([...selectedVocabIds, ...visibleIds]);
    setSelectedVocabIds(Array.from(newSet));
  };

  const deselectAllVisibleVocabs = () => {
    const visibleIds = new Set(filteredVocabs.map((v) => v.id));
    setSelectedVocabIds((prev) => prev.filter((id) => !visibleIds.has(id)));
  };

  const toggleQuestion = (qId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((x) => x !== qId) : [...prev, qId]
    );
  };

  const toggleAllInPattern = (patternId: number, select: boolean) => {
    const patternQIds = allExam2QuestionsPool.filter((q) => q.patternId === patternId).map((q) => q.id);
    if (select) {
      const newSet = new Set([...selectedQuestionIds, ...patternQIds]);
      setSelectedQuestionIds(Array.from(newSet));
    } else {
      const pSet = new Set(patternQIds);
      setSelectedQuestionIds((prev) => prev.filter((id) => !pSet.has(id)));
    }
  };

  const toggleAccordion = (patternId: number) => {
    setExpandedPatterns((prev) => ({ ...prev, [patternId]: !prev[patternId] }));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('กรุณาตั้งชื่อพรีเซ็ต');
      return;
    }
    if (selectedVocabIds.length === 0 && selectedQuestionIds.length === 0) {
      setErrorMsg('กรุณาเลือกคำศัพท์หรือคำถามอย่างน้อย 1 รายการ');
      return;
    }

    const selectedPatterns = Array.from(
      new Set(
        allExam2QuestionsPool
          .filter((q) => selectedQuestionIds.includes(q.id))
          .map((q) => q.patternId)
      )
    );

    const preset: Exam2PracticePreset = {
      id: editingPreset ? editingPreset.id : `preset_custom_e2_${Date.now()}`,
      name: name.trim(),
      isCustom: true,
      part1VocabIds: selectedVocabIds,
      part2PatternIds: selectedPatterns,
      part2QuestionIds: selectedQuestionIds,
      updatedAt: new Date().toISOString(),
    };

    onSave(preset);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">Exam 2 Preset Studio</span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                {editingPreset ? '✏️ แก้ไขชุดฝึกซ้อมรอบที่ 2' : '✨ สร้างชุดฝึกซ้อมรอบที่ 2 ใหม่'}
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              เลือกคำศัพท์ส่วนที่ 1 และรูปแบบคำถามส่วนที่ 2 เพื่อสร้างชุดข้อสอบฝึกซ้อมในแบบของคุณ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Name Input Bar */}
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            ชื่อชุดฝึกซ้อม (Preset Name) <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="เช่น ชุดเน้นคำศัพท์บทที่ 3 + ถามเวลาและป้ายราคา"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          />
          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', fontSize: '12px', marginTop: '6px' }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px', backgroundColor: 'var(--bg-surface)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('part1')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'part1' ? '2.5px solid var(--primary-600)' : '2.5px solid transparent',
              color: activeTab === 'part1' ? 'var(--primary-700)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '13.5px',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BookOpen size={16} />
            <span>ส่วนที่ 1: คำศัพท์ ({selectedVocabIds.length}/{exam2VocabList.length} คำ)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('part2')}
            style={{
              padding: '12px 18px',
              borderBottom: activeTab === 'part2' ? '2.5px solid var(--primary-600)' : '2.5px solid transparent',
              color: activeTab === 'part2' ? 'var(--primary-700)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '13.5px',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} />
            <span>ส่วนที่ 2: ตอบคำถาม 5 รูปแบบ ({selectedQuestionIds.length}/{allExam2QuestionsPool.length} ข้อ)</span>
          </button>
        </div>

        {/* Tab 1: Part 1 Vocab Picker */}
        {activeTab === 'part1' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Filter Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="ค้นหาคำศัพท์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    fontSize: '12.5px',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}
              >
                <option value="all">📚 ทุกบท (บท 3 & 4)</option>
                <option value="3">บทที่ 3 (เวลา & สถานที่)</option>
                <option value="4">บทที่ 4 (การซื้อของ & ตัวเลข)</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}
              >
                <option value="all">🏷️ ทุกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}
              >
                <option value="default">เรียงตามบทเรียน</option>
                <option value="romaji_asc">A-Z Romaji</option>
                <option value="meaning_asc">ก-ฮ ความหมาย</option>
              </select>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" onClick={selectAllVisibleVocabs} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '11.5px' }}>
                  เลือกทั้งหมด
                </button>
                <button type="button" onClick={deselectAllVisibleVocabs} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '11.5px' }}>
                  ล้างการเลือก
                </button>
              </div>
            </div>

            {/* Vocab Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
              {filteredVocabs.map((vocab) => {
                const isSelected = selectedVocabIds.includes(vocab.id);
                return (
                  <div
                    key={vocab.id}
                    onClick={() => toggleVocab(vocab.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--bg-app)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isSelected ? '1.5px solid var(--primary-600)' : '1.5px solid var(--border-strong)',
                        backgroundColor: isSelected ? 'var(--primary-600)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <Check size={13} color="#ffffff" />}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {vocab.word_kana} ({vocab.word_romaji})
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {vocab.meaning_th}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Part 2 Question Patterns Picker */}
        {activeTab === 'part2' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 1, title: '🏢 รูปแบบที่ 1: สถานที่ (Koko wa doko desuka)', icon: Building2, color: 'var(--primary-600)' },
              { id: 2, title: '⏰ รูปแบบที่ 2: บอกเวลา (Ima nan ji desuka)', icon: Clock, color: '#6366f1' },
              { id: 3, title: '📞 รูปแบบที่ 3: เบอร์โทรศัพท์ (Denwa bangō wa nan desuka)', icon: Phone, color: '#10b981' },
              { id: 4, title: '🏷️ รูปแบบที่ 4: ป้ายราคา (Kore wa ikura desuka)', icon: Tag, color: '#f59e0b' },
              { id: 5, title: '📅 รูปแบบที่ 5: ช่วงเวลา (Kara...made desu)', icon: Calendar, color: '#f43f5e' },
            ].map((pattern) => {
              const questionsInPattern = allExam2QuestionsPool.filter((q) => q.patternId === pattern.id);
              const selectedCount = questionsInPattern.filter((q) => selectedQuestionIds.includes(q.id)).length;
              const isAllSelected = selectedCount === questionsInPattern.length;
              const isExpanded = !!expandedPatterns[pattern.id];
              const Icon = pattern.icon;

              return (
                <div
                  key={pattern.id}
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Pattern Accordion Header */}
                  <div
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-surface)',
                      borderBottom: isExpanded ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        onClick={() => toggleAllInPattern(pattern.id, !isAllSelected)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: isAllSelected ? '2px solid var(--primary-600)' : '2px solid var(--border-strong)',
                          backgroundColor: isAllSelected ? 'var(--primary-600)' : selectedCount > 0 ? 'var(--primary-100)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {isAllSelected && <Check size={14} color="#ffffff" />}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={18} color={pattern.color} />
                        <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>
                          {pattern.title}
                        </span>
                        <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                          เลือก {selectedCount}/{questionsInPattern.length} ข้อ
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAccordion(pattern.id)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Accordion Questions List */}
                  {isExpanded && (
                    <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {questionsInPattern.map((q: Exam2QuestionItem) => {
                        const isQSelected = selectedQuestionIds.includes(q.id);
                        return (
                          <div
                            key={q.id}
                            onClick={() => toggleQuestion(q.id)}
                            style={{
                              padding: '10px 14px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: isQSelected ? 'var(--bg-surface)' : 'transparent',
                              border: isQSelected ? '1px solid var(--primary-400)' : '1px solid transparent',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                border: isQSelected ? '1.5px solid var(--primary-600)' : '1.5px solid var(--border-strong)',
                                backgroundColor: isQSelected ? 'var(--primary-600)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {isQSelected && <Check size={11} color="#ffffff" />}
                            </div>

                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                                {q.promptJp}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                เฉลย: <strong>{q.targetAnswerRomaji}</strong> — {q.meaningTh}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            รวมที่เลือก: <strong>{selectedVocabIds.length} คำศัพท์</strong> + <strong>{selectedQuestionIds.length} ข้อคำถาม</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              ยกเลิก
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary" style={{ padding: '8px 22px' }}>
              บันทึกพรีเซ็ต
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PRESET MANAGER MODAL (View, Edit, Create, Delete Presets)
// ==========================================
interface Exam2PresetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  customPresets: Exam2PracticePreset[];
  onSaveCustomPresets: (presets: Exam2PracticePreset[]) => void;
}

export const Exam2PresetManagerModal: React.FC<Exam2PresetManagerModalProps> = ({
  isOpen,
  onClose,
  activePresetId,
  onSelectPreset,
  customPresets,
  onSaveCustomPresets,
}) => {
  const [editingPreset, setEditingPreset] = useState<Exam2PracticePreset | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const allPresets = [...defaultExam2Presets, ...customPresets];

  const handleCreateNew = () => {
    setEditingPreset(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (preset: Exam2PracticePreset) => {
    setEditingPreset(preset);
    setIsEditorOpen(true);
  };

  const handleDelete = (presetId: string) => {
    if (confirm('คุณต้องการลบชุดฝึกซ้อมนี้ใช่หรือไม่?')) {
      const updated = customPresets.filter((p) => p.id !== presetId);
      onSaveCustomPresets(updated);
      if (activePresetId === presetId) {
        onSelectPreset('preset_e2_all');
      }
    }
  };

  const handleSavePreset = (savedPreset: Exam2PracticePreset) => {
    const exists = customPresets.some((p) => p.id === savedPreset.id);
    let updated: Exam2PracticePreset[];
    if (exists) {
      updated = customPresets.map((p) => (p.id === savedPreset.id ? savedPreset : p));
    } else {
      updated = [...customPresets, savedPreset];
    }
    onSaveCustomPresets(updated);
    onSelectPreset(savedPreset.id);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div
          className="card"
          style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                🎛️ จัดการชุดฝึกซ้อมรอบที่ 2 (Practice Preset Manager)
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                เลือกชุดโจทย์มาตรฐาน หรือสร้างชุดโจทย์เฉพาะหมวดหมู่ที่คุณต้องการเน้นย้ำ
              </p>
            </div>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%' }}>
              <X size={18} />
            </button>
          </div>

          {/* List of Presets */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                รายการชุดฝึกซ้อมทั้งหมด ({allPresets.length} ชุด)
              </span>
              <button
                type="button"
                onClick={handleCreateNew}
                className="btn btn-primary"
                style={{ padding: '7px 14px', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={15} /> สร้างชุดฝึกซ้อมใหม่
              </button>
            </div>

            {allPresets.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-lg)',
                    border: isActive ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--primary-50)' : 'var(--bg-app)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--text-main)' }}>
                        {preset.name}
                      </span>
                      {preset.isCustom ? (
                        <span className="badge badge-ref" style={{ fontSize: '10.5px' }}>สร้างเอง</span>
                      ) : (
                        <span className="badge badge-primary" style={{ fontSize: '10.5px' }}>ระบบ</span>
                      )}
                      {isActive && (
                        <span className="badge badge-success" style={{ fontSize: '10.5px' }}>กำลังใช้งาน</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      คำศัพท์: <strong>{preset.part1VocabIds.length} คำ</strong> • คำถาม 5 รูปแบบ: <strong>{preset.part2QuestionIds?.length || preset.part2PatternIds.length * 2} ข้อ</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPreset(preset.id);
                          onClose();
                        }}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12.5px' }}
                      >
                        เลือกใช้
                      </button>
                    ) : (
                      <span style={{ fontSize: '12.5px', color: 'var(--color-success)', fontWeight: 700, padding: '6px 10px' }}>
                        ✓ ใช้งานอยู่
                      </span>
                    )}

                    {preset.isCustom && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(preset)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px' }}
                          title="แก้ไข"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(preset.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', color: 'var(--color-danger)' }}
                          title="ลบ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', textAlign: 'right' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>

      <Exam2PresetEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSavePreset}
        editingPreset={editingPreset}
      />
    </>
  );
};
