import { Vocabulary } from '../types';

export interface Exam2Option {
  textRomaji: string;
  textKana: string;
  meaningTh: string;
  isCorrect: boolean;
}

export interface Exam2QuestionItem {
  id: string;
  patternId: 1 | 2 | 3 | 4 | 5;
  patternTitle: string;
  promptRomaji?: string;
  promptJp: string;
  promptTh: string;
  imageSrc?: string;
  imageTitle?: string;
  targetAnswerRomaji: string;
  targetAnswerKana: string;
  meaningTh: string;
  options: Exam2Option[];
  visualType: 'location' | 'clock' | 'phone' | 'price' | 'schedule';
  visualData: any;
  explanationTh: string;
}

// ==========================================
// CHAPTER 3 & CHAPTER 4 100% COMPLETE VOCABULARY LIST
// Extracted directly from JN60101 Textbook & Exam 2 Spec
// ==========================================
export const exam2VocabList: Vocabulary[] = [
  // --- CHAPTER 3: LOCATIONS (สถานที่ & ผังอาคาร) ---
  { id: 'c3_01', chapter_number: 3, category: 'location', word_romaji: 'kyōshitsu', word_kana: 'きょうしつ', word_kanji: '教室', meaning_th: 'ห้องเรียน', example_jp: 'Koko wa kyōshitsu desu.', example_th: 'ที่นี่คือห้องเรียน', textbook_ref: 'JN60101 Ch.3 p.7' },
  { id: 'c3_02', chapter_number: 3, category: 'location', word_romaji: 'kaigishitsu', word_kana: 'かいぎしつ', word_kanji: '会議室', meaning_th: 'ห้องประชุม', example_jp: 'Koko wa kaigishitsu desu.', example_th: 'ที่นี่คือห้องประชุม', textbook_ref: 'JN60101 Ch.3 p.8' },
  { id: 'c3_03', chapter_number: 3, category: 'location', word_romaji: 'shokudō', word_kana: 'しょくどう', word_kanji: '食堂', meaning_th: 'โรงอาหาร', example_jp: 'Koko wa shokudō desu.', example_th: 'ที่นี่คือโรงอาหาร', textbook_ref: 'JN60101 Ch.3 p.9' },
  { id: 'c3_04', chapter_number: 3, category: 'location', word_romaji: 'uketsuke', word_kana: 'うけつけ', word_kanji: '受付', meaning_th: 'แผนกต้อนรับ / ประชาสัมพันธ์', example_jp: 'Koko wa uketsuke desu.', example_th: 'ที่นี่คือแผนกต้อนรับ', textbook_ref: 'JN60101 Ch.3 p.10' },
  { id: 'c3_05', chapter_number: 3, category: 'location', word_romaji: 'jimusho', word_kana: 'じむしょ', word_kanji: '事務所', meaning_th: 'สำนักงาน / ออฟฟิศ', example_jp: 'Koko wa jimusho desu.', example_th: 'ที่นี่คือสำนักงาน', textbook_ref: 'JN60101 Ch.3 p.11' },
  { id: 'c3_06', chapter_number: 3, category: 'location', word_romaji: 'depāto', word_kana: 'デパート', word_kanji: null, meaning_th: 'ห้างสรรพสินค้า', example_jp: 'Depāto wa 10-ji kara desu.', example_th: 'ห้างสรรพสินค้าเปิด 10 โมง', textbook_ref: 'JN60101 Ch.3 p.12' },
  { id: 'c3_07', chapter_number: 3, category: 'location', word_romaji: 'sūpā', word_kana: 'スーパー', word_kanji: null, meaning_th: 'ซูเปอร์มาร์เก็ต', example_jp: 'Sūpā wa 9-ji made desu.', example_th: 'ซูเปอร์มาร์เก็ตเปิดถึง 3 ทุ่ม', textbook_ref: 'JN60101 Ch.3 p.13' },
  { id: 'c3_08', chapter_number: 3, category: 'location', word_romaji: 'resutoran', word_kana: 'レストラン', word_kanji: null, meaning_th: 'ร้านอาหาร', example_jp: 'Koko wa resutoran desu.', example_th: 'ที่นี่คือร้านอาหาร', textbook_ref: 'JN60101 Ch.3 p.14' },
  { id: 'c3_09', chapter_number: 3, category: 'location', word_romaji: 'yūbinkyoku', word_kana: 'ゆうびんきょく', word_kanji: '郵便局', meaning_th: 'ที่ทำการไปรษณีย์', example_jp: 'Yūbinkyoku wa 9-ji kara desu.', example_th: 'ไปรษณีย์เปิดตั้งแต่ 9 โมง', textbook_ref: 'JN60101 Ch.3 p.15' },
  { id: 'c3_10', chapter_number: 3, category: 'location', word_romaji: 'furonto', word_kana: 'フロント', word_kanji: null, meaning_th: 'ฟรอนต์ / แผนกต้อนรับโรงแรม', example_jp: 'Koko wa furonto desu.', example_th: 'ที่นี่คือเคาน์เตอร์ฟรอนต์', textbook_ref: 'JN60101 Ch.3 p.16' },
  { id: 'c3_11', chapter_number: 3, category: 'location', word_romaji: 'pūru', word_kana: 'プール', word_kanji: null, meaning_th: 'สระว่ายน้ำ', example_jp: 'Koko wa pūru desu.', example_th: 'ที่นี่คือสระว่ายน้ำ', textbook_ref: 'JN60101 Ch.3 p.17' },
  { id: 'c3_12', chapter_number: 3, category: 'location', word_romaji: 'jimu', word_kana: 'ジム', word_kanji: null, meaning_th: 'ฟิตเนส / โรงยิม', example_jp: 'Koko wa jimu desu.', example_th: 'ที่นี่คือฟิตเนส', textbook_ref: 'JN60101 Ch.3 p.18' },
  { id: 'c3_13', chapter_number: 3, category: 'location', word_romaji: 'otearai', word_kana: 'おてあらい', word_kanji: 'お手洗い', meaning_th: 'ห้องน้ำ (สุภาพ)', example_jp: 'Otearai wa doko desuka?', example_th: 'ห้องน้ำอยู่ที่ไหนครับ?', textbook_ref: 'JN60101 Ch.3 p.24' },
  { id: 'c3_13b', chapter_number: 3, category: 'location', word_romaji: 'ginkō', word_kana: 'ぎんこう', word_kanji: '銀行', meaning_th: 'ธนาคาร', example_jp: 'Ginkō wa 9-ji kara desu.', example_th: 'ธนาคารเปิด 9 โมง', textbook_ref: 'JN60101 Ch.3 p.55' },
  { id: 'c3_13c', chapter_number: 3, category: 'location', word_romaji: 'Rondon', word_kana: 'ロンドン', word_kanji: null, meaning_th: 'กรุงลอนดอน (อังกฤษ)', example_jp: 'Rondon wa ima nan-ji desuka?', example_th: 'ตอนนี้ที่ลอนดอนกี่โมงแล้ว?', textbook_ref: 'JN60101 Ch.3 p.59' },

  // --- CHAPTER 3: DEMONSTRATIVES & DIRECTIONS (คำชี้ตำแหน่ง & ทิศทาง) ---
  { id: 'c3_14', chapter_number: 3, category: 'demonstrative', word_romaji: 'koko', word_kana: 'ここ', word_kanji: null, meaning_th: 'ที่นี่ (ใกล้ผู้พูด)', example_jp: 'Koko wa doko desuka?', example_th: 'ที่นี่คือที่ไหน?', textbook_ref: 'JN60101 Ch.3 p.5' },
  { id: 'c3_15', chapter_number: 3, category: 'demonstrative', word_romaji: 'soko', word_kana: 'そこ', word_kanji: null, meaning_th: 'ที่นั่น (ใกล้ผู้ฟัง)', example_jp: 'Soko wa jimusho desu.', example_th: 'ที่นั่นคือสำนักงาน', textbook_ref: 'JN60101 Ch.3 p.5' },
  { id: 'c3_16', chapter_number: 3, category: 'demonstrative', word_romaji: 'asoko', word_kana: 'あそこ', word_kanji: null, meaning_th: 'ที่โน่น (ไกลทั้งสองฝ่าย)', example_jp: 'Asoko wa shokudō desu.', example_th: 'ที่โน่นคือโรงอาหาร', textbook_ref: 'JN60101 Ch.3 p.5' },
  { id: 'c3_17', chapter_number: 3, category: 'demonstrative', word_romaji: 'kochira', word_kana: 'こちら', word_kanji: null, meaning_th: 'ทางนี้ / ด้านนี้ (สุภาพ)', example_jp: 'Kochira wa uketsuke desu.', example_th: 'ทางนี้คือแผนกต้อนรับ', textbook_ref: 'JN60101 Ch.3 p.6' },
  { id: 'c3_18', chapter_number: 3, category: 'demonstrative', word_romaji: 'sochira', word_kana: 'そちら', word_kanji: null, meaning_th: 'ทางนั้น / ด้านนั้น (สุภาพ)', example_jp: 'Sochira wa denwa desu.', example_th: 'ทางนั้นคือโทรศัพท์', textbook_ref: 'JN60101 Ch.3 p.6' },
  { id: 'c3_19', chapter_number: 3, category: 'demonstrative', word_romaji: 'achira', word_kana: 'あちら', word_kanji: null, meaning_th: 'ทางโน้น / ด้านโน้น (สุภาพ)', example_jp: 'Achira wa kaigishitsu desu.', example_th: 'ทางโน้นคือห้องประชุม', textbook_ref: 'JN60101 Ch.3 p.6' },
  { id: 'c3_19a', chapter_number: 3, category: 'demonstrative', word_romaji: 'kore', word_kana: 'これ', word_kanji: null, meaning_th: 'สิ่งนี้ / อันนี้ (อยู่ใกล้ผู้พูด)', example_jp: 'Kore wa nan desuka?', example_th: 'นี่คืออะไร?', textbook_ref: 'JN60101 Ch.3 p.3' },
  { id: 'c3_19b', chapter_number: 3, category: 'demonstrative', word_romaji: 'sore', word_kana: 'それ', word_kanji: null, meaning_th: 'สิ่งนั้น / อันนั้น (อยู่ใกล้ผู้ฟัง)', example_jp: 'Sore o misete kudasai.', example_th: 'ขอดูอันนั้นหน่อยครับ', textbook_ref: 'JN60101 Ch.3 p.3' },
  { id: 'c3_19c', chapter_number: 3, category: 'demonstrative', word_romaji: 'are', word_kana: 'あれ', word_kanji: null, meaning_th: 'สิ่งโน้น / อันโน้น (อยู่ไกลทั้งสองฝ่าย)', example_jp: 'Are wa nan desuka?', example_th: 'โน่นคืออะไร?', textbook_ref: 'JN60101 Ch.3 p.3' },
  { id: 'c3_19d', chapter_number: 3, category: 'demonstrative', word_romaji: 'kono (+ Noun)', word_kana: 'この (+ 名詞)', word_kanji: null, meaning_th: '...นี้ (ขยายคำนาม เช่น kono ringo = แอปเปิ้ลผลนี้)', example_jp: 'Kono ringo', example_th: 'แอปเปิ้ลผลนี้', textbook_ref: 'JN60101 Ch.3 p.4' },
  { id: 'c3_19e', chapter_number: 3, category: 'demonstrative', word_romaji: 'sono (+ Noun)', word_kana: 'その (+ 名詞)', word_kanji: null, meaning_th: '...นั้น (ขยายคำนาม เช่น sono ringo = แอปเปิ้ลผลนั้น)', example_jp: 'Sono ringo', example_th: 'แอปเปิ้ลผลนั้น', textbook_ref: 'JN60101 Ch.3 p.4' },
  { id: 'c3_19f', chapter_number: 3, category: 'demonstrative', word_romaji: 'ano (+ Noun)', word_kana: 'あの (+ 名詞)', word_kanji: null, meaning_th: '...โน้น (ขยายคำนาม เช่น ano hito = คนโน้น)', example_jp: 'Ano ringo', example_th: 'แอปเปิ้ลผลโน้น', textbook_ref: 'JN60101 Ch.3 p.4' },

  // --- CHAPTER 3: TIME & HOURS (เวลา & นาฬิกา) ---
  { id: 'c3_20', chapter_number: 3, category: 'time', word_romaji: 'ima', word_kana: 'いま', word_kanji: '今', meaning_th: 'ตอนนี้ / ขณะนี้', example_jp: 'Ima nanji desuka?', example_th: 'ตอนนี้กี่โมงแล้ว?', textbook_ref: 'JN60101 Ch.3 p.25' },
  { id: 'c3_21', chapter_number: 3, category: 'time', word_romaji: 'nan-ji', word_kana: 'なんじ', word_kanji: '何時', meaning_th: 'กี่โมง / เวลาเท่าไหร่', example_jp: 'Ima nan-ji desuka?', example_th: 'ตอนนี้กี่โมงแล้ว?', textbook_ref: 'JN60101 Ch.3 p.26' },
  { id: 'c3_22', chapter_number: 3, category: 'time', word_romaji: '..ji', word_kana: '〜じ', word_kanji: '〜時', meaning_th: '...โมง / นาฬิกา (ต่อท้ายตัวเลขบอกชั่วโมง)', example_jp: '3-ji desu.', example_th: '3 โมงครับ', textbook_ref: 'JN60101 Ch.3 p.27' },
  { id: 'c3_23', chapter_number: 3, category: 'time', word_romaji: '..fun / pun', word_kana: '〜ふん / 〜ぷん', word_kanji: '〜分', meaning_th: '...นาที', example_jp: '15-fun desu.', example_th: '15 นาที', textbook_ref: 'JN60101 Ch.3 p.28' },
  { id: 'c3_24', chapter_number: 3, category: 'time', word_romaji: 'han', word_kana: 'はん', word_kanji: '半', meaning_th: 'ครึ่ง / 30 นาที', example_jp: '4-ji han desu.', example_th: '4 โมงครึ่ง', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_25', chapter_number: 3, category: 'time', word_romaji: 'gozen', word_kana: 'ごぜん', word_kanji: '午前', meaning_th: 'ช่วงเช้า / a.m.', example_jp: 'Gozen 9-ji desu.', example_th: '9 โมงเช้า', textbook_ref: 'JN60101 Ch.3 p.34' },
  { id: 'c3_26', chapter_number: 3, category: 'time', word_romaji: 'gogo', word_kana: 'ごご', word_kanji: '午後', meaning_th: 'ช่วงบ่าย-ค่ำ / p.m.', example_jp: 'Gogo 5-ji desu.', example_th: '5 โมงเย็น', textbook_ref: 'JN60101 Ch.3 p.35' },
  { id: 'c3_26a', chapter_number: 3, category: 'time', word_romaji: 'yo-ji', word_kana: 'よじ', word_kanji: '4時', meaning_th: '4 โมง / 4 นาฬิกา (ข้อยกเว้นเสียง ห้ามอ่าน yon-ji / shi-ji)', example_jp: 'Ima yo-ji desu.', example_th: 'ตอนนี้ 4 โมงครับ', textbook_ref: 'JN60101 Ch.3 p.45' },
  { id: 'c3_26b', chapter_number: 3, category: 'time', word_romaji: 'ku-ji', word_kana: 'くじ', word_kanji: '9時', meaning_th: '9 โมง / 9 นาฬิกา (ข้อยกเว้นเสียง ห้ามอ่าน kyū-ji)', example_jp: 'Ima ku-ji desu.', example_th: 'ตอนนี้ 9 โมงครับ', textbook_ref: 'JN60101 Ch.3 p.45' },
  { id: 'c3_26c', chapter_number: 3, category: 'time', word_romaji: 'shichi-ji', word_kana: 'しちじ', word_kanji: '7時', meaning_th: '7 โมง / 7 นาฬิกา (นิยมอ่าน shichi-ji)', example_jp: 'Ima shichi-ji desu.', example_th: 'ตอนนี้ 7 โมงครับ', textbook_ref: 'JN60101 Ch.3 p.45' },
  { id: 'c3_26d', chapter_number: 3, category: 'time', word_romaji: 'rei-ji', word_kana: 'れいじ', word_kanji: '0時', meaning_th: 'เที่ยงคืนตรง / 0 นาฬิกา', example_jp: 'Rei-ji desu.', example_th: 'เที่ยงคืนตรงครับ', textbook_ref: 'JN60101 Ch.3 p.46' },
  { id: 'c3_26e', chapter_number: 3, category: 'time', word_romaji: 'ip-pun', word_kana: 'いっぷん', word_kanji: '1分', meaning_th: '1 นาที', example_jp: '1-pun', example_th: '1 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26e_2', chapter_number: 3, category: 'time', word_romaji: 'ni-fun', word_kana: 'にふん', word_kanji: '2分', meaning_th: '2 นาที', example_jp: '2-fun', example_th: '2 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26f', chapter_number: 3, category: 'time', word_romaji: 'san-pun', word_kana: 'さんぷん', word_kanji: '3分', meaning_th: '3 นาที', example_jp: '3-pun', example_th: '3 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26g', chapter_number: 3, category: 'time', word_romaji: 'yon-pun', word_kana: 'よんぷん', word_kanji: '4分', meaning_th: '4 นาที', example_jp: '4-pun', example_th: '4 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26g_2', chapter_number: 3, category: 'time', word_romaji: 'go-fun', word_kana: 'ごふん', word_kanji: '5分', meaning_th: '5 นาที', example_jp: '5-fun', example_th: '5 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26h', chapter_number: 3, category: 'time', word_romaji: 'rop-pun', word_kana: 'ろっぷん', word_kanji: '6分', meaning_th: '6 นาที', example_jp: '6-pun', example_th: '6 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26h_2', chapter_number: 3, category: 'time', word_romaji: 'nana-fun', word_kana: 'ななふん', word_kanji: '7分', meaning_th: '7 นาที', example_jp: '7-fun', example_th: '7 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26i', chapter_number: 3, category: 'time', word_romaji: 'hap-pun', word_kana: 'はっぷん', word_kanji: '8分', meaning_th: '8 นาที', example_jp: '8-pun', example_th: '8 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26i_2', chapter_number: 3, category: 'time', word_romaji: 'kyū-fun', word_kana: 'きゅうふん', word_kanji: '9分', meaning_th: '9 นาที', example_jp: '9-fun', example_th: '9 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },
  { id: 'c3_26j', chapter_number: 3, category: 'time', word_romaji: 'jup-pun', word_kana: 'じゅっぷん', word_kanji: '10分', meaning_th: '10 นาที', example_jp: '10-pun', example_th: '10 นาที', textbook_ref: 'JN60101 Ch.3 p.47' },

  // --- CHAPTER 3: ACTIVITIES & PEOPLE (กิจกรรม & บุคคล) ---
  { id: 'c3_27', chapter_number: 3, category: 'activity', word_romaji: 'shigoto', word_kana: 'しごと', word_kanji: '仕事', meaning_th: 'งาน / การทำงาน', example_jp: 'Shigoto wa 9-ji kara 5-ji made desu.', example_th: 'งานเริ่ม 9 โมงถึง 5 โมงเย็น', textbook_ref: 'JN60101 Ch.3 p.19' },
  { id: 'c3_28', chapter_number: 3, category: 'activity', word_romaji: 'kaigi', word_kana: 'かいぎ', word_kanji: '会議', meaning_th: 'การประชุม', example_jp: 'Kaigi wa 1-ji kara 3-ji made desu.', example_th: 'การประชุมเริ่มบ่ายโมงถึงบ่ายสาม', textbook_ref: 'JN60101 Ch.3 p.20' },
  { id: 'c3_29', chapter_number: 3, category: 'activity', word_romaji: 'hiruyasumi', word_kana: 'ひるやすみ', word_kanji: '昼休み', meaning_th: 'พักกลางวัน', example_jp: 'Hiruyasumi wa 12-ji kara 1-ji made desu.', example_th: 'พักกลางวันเที่ยงถึงบ่ายโมง', textbook_ref: 'JN60101 Ch.3 p.21' },
  { id: 'c3_30', chapter_number: 3, category: 'activity', word_romaji: 'pātī', word_kana: 'パーティー', word_kanji: null, meaning_th: 'งานเลี้ยง / ปาร์ตี้', example_jp: 'Pātī wa 7-ji kara desu.', example_th: 'ปาร์ตี้เริ่ม 1 ทุ่ม', textbook_ref: 'JN60101 Ch.3 p.22' },
  { id: 'c3_31', chapter_number: 3, category: 'activity', word_romaji: 'eiga', word_kana: 'えいが', word_kanji: '映画', meaning_th: 'ภาพยนตร์ / หนัง', example_jp: 'Eiga wa 4-ji kara 6-ji made desu.', example_th: 'หนังเริ่ม 4 โมงถึง 6 โมงเย็น', textbook_ref: 'JN60101 Ch.3 p.23' },
  { id: 'c3_31a', chapter_number: 3, category: 'people', word_romaji: 'onna no hito', word_kana: 'おんなのひと', word_kanji: '女の人', meaning_th: 'ผู้หญิง', example_jp: 'Ano onna no hito wa dare desuka?', example_th: 'ผู้หญิงคนนั้นคือใคร?', textbook_ref: 'JN60101 Ch.3 p.29' },
  { id: 'c3_31b', chapter_number: 3, category: 'people', word_romaji: 'otoko no hito', word_kana: 'おとこのひと', word_kanji: '男の人', meaning_th: 'ผู้ชาย', example_jp: 'Ano otoko no hito wa Tanaka-san desu.', example_th: 'ผู้ชายคนนั้นคือคุณทานากะ', textbook_ref: 'JN60101 Ch.3 p.30' },

  // --- CHAPTER 3: PARTICLES & TIME ADVERBS (คำช่วย & สำนวนบอกเวลา) ---
  { id: 'c3_32', chapter_number: 3, category: 'phrase', word_romaji: '..kara', word_kana: '〜から', word_kanji: null, meaning_th: 'ตั้งแต่... / จาก...', example_jp: '9-ji kara', example_th: 'ตั้งแต่ 9 โมง', textbook_ref: 'JN60101 Ch.3 p.31' },
  { id: 'c3_33', chapter_number: 3, category: 'phrase', word_romaji: '..made', word_kana: '〜まで', word_kanji: null, meaning_th: 'ถึง...', example_jp: '5-ji made', example_th: 'ถึง 5 โมง', textbook_ref: 'JN60101 Ch.3 p.32' },
  { id: 'c3_34', chapter_number: 3, category: 'phrase', word_romaji: '..kara..made', word_kana: '〜から〜まで', word_kanji: null, meaning_th: 'ตั้งแต่...ถึง...', example_jp: '9-ji kara 5-ji made desu.', example_th: 'ตั้งแต่ 9 โมงถึง 5 โมงเย็น', textbook_ref: 'JN60101 Ch.3 p.33' },
  { id: 'c3_35', chapter_number: 3, category: 'phrase', word_romaji: 'dō itashimashite', word_kana: 'どういたしまして', word_kanji: null, meaning_th: 'ไม่เป็นไร (ตอบรับคำขอบคุณ)', example_jp: 'Dō itashimashite.', example_th: 'ไม่เป็นไรครับ', textbook_ref: 'JN60101 Ch.3 p.36' },
  { id: 'c3_36', chapter_number: 3, category: 'phrase', word_romaji: 'chōdo', word_kana: 'ちょうど', word_kanji: null, meaning_th: '...ตรง / พอดีเป๊ะ', example_jp: 'Chōdo 4-ji desu.', example_th: '4 โมงตรงพอดี', textbook_ref: 'JN60101 Ch.3 p.49' },
  { id: 'c3_37', chapter_number: 3, category: 'phrase', word_romaji: 'daitai', word_kana: 'だいたい', word_kanji: '大体', meaning_th: 'ประมาณ / ราวๆ', example_jp: 'Daitai 1-ji desu.', example_th: 'ประมาณบ่ายโมง', textbook_ref: 'JN60101 Ch.3 p.50' },
  { id: 'c3_38', chapter_number: 3, category: 'phrase', word_romaji: 'mō sugu', word_kana: 'もうすぐ', word_kanji: null, meaning_th: 'กำลังจะ...', example_jp: 'Mō sugu 3-ji desu.', example_th: 'กำลังจะบ่าย 3 โมงแล้ว', textbook_ref: 'JN60101 Ch.3 p.51' },
  { id: 'c3_39', chapter_number: 3, category: 'phrase', word_romaji: 'sugi', word_kana: 'すぎ', word_kanji: '過ぎ', meaning_th: '...โมงกว่า', example_jp: '2-ji sugi desu.', example_th: 'บ่าย 2 โมงกว่า', textbook_ref: 'JN60101 Ch.3 p.52' },

  // --- CHAPTER 4: SHOPPING & GOODS (การซื้อของ, สินค้า & อุปกรณ์) ---
  { id: 'c4_01', chapter_number: 4, category: 'shopping', word_romaji: 'hito', word_kana: 'ひと', word_kanji: '人', meaning_th: 'คน / บุคคล', example_jp: 'Ano hito wa dare desuka?', example_th: 'คนนั้นคือใคร?', textbook_ref: 'JN60101 Ch.4 p.3' },
  { id: 'c4_01b', chapter_number: 4, category: 'shopping', word_romaji: '-jin', word_kana: '〜じん', word_kanji: '〜人', meaning_th: 'ชาว... / คนสัญชาติ... (ต่อท้ายชื่อประเทศ เช่น Nihon-jin)', example_jp: 'Nihon-jin desu.', example_th: 'เป็นคนญี่ปุ่นครับ', textbook_ref: 'JN60101 Ch.4 p.4' },
  { id: 'c4_02', chapter_number: 4, category: 'shopping', word_romaji: 'mise', word_kana: 'みせ', word_kanji: '店', meaning_th: 'ร้านค้า', example_jp: 'Mise wa doko desuka?', example_th: 'ร้านค้าอยู่ที่ไหน?', textbook_ref: 'JN60101 Ch.4 p.5' },
  { id: 'c4_02b', chapter_number: 4, category: 'shopping', word_romaji: 'mise no hito', word_kana: 'みせのひと', word_kanji: '店の人', meaning_th: 'พนักงานร้าน / คนขายของ', example_jp: 'Mise no hito ni kikimasu.', example_th: 'ถามพนักงานร้าน', textbook_ref: 'JN60101 Ch.4 p.47' },
  { id: 'c4_03', chapter_number: 4, category: 'currency', word_romaji: '..en', word_kana: '〜えん', word_kanji: '〜円', meaning_th: '...เยน (สกุลเงินญี่ปุ่น)', example_jp: '3,000 en desu.', example_th: '3,000 เยนครับ', textbook_ref: 'JN60101 Ch.4 p.6' },
  { id: 'c4_04', chapter_number: 4, category: 'electronics', word_romaji: 'terebi', word_kana: 'テレビ', word_kanji: null, meaning_th: 'โทรทัศน์ / ทีวี', example_jp: 'Terebi wa 50,000 en desu.', example_th: 'ทีวีราคา 50,000 เยน', textbook_ref: 'JN60101 Ch.4 p.7' },
  { id: 'c4_05', chapter_number: 4, category: 'electronics', word_romaji: 'rajio', word_kana: 'ラジオ', word_kanji: null, meaning_th: 'วิทยุ', example_jp: 'Kore wa rajio desu.', example_th: 'นี่คือวิทยุ', textbook_ref: 'JN60101 Ch.4 p.8' },
  { id: 'c4_06', chapter_number: 4, category: 'electronics', word_romaji: 'konpyūtā / pasokon', word_kana: 'コンピューター / パソコン', word_kanji: null, meaning_th: 'คอมพิวเตอร์ / พีซี', example_jp: 'Pasokon wa ikura desuka?', example_th: 'คอมพิวเตอร์ราคาเท่าไหร่?', textbook_ref: 'JN60101 Ch.4 p.9' },
  { id: 'c4_07', chapter_number: 4, category: 'electronics', word_romaji: 'kamera / dejikame', word_kana: 'カメラ / デジカメ', word_kanji: null, meaning_th: 'กล้องถ่ายรูป / กล้องดิจิทัล', example_jp: 'Kamera o misete kudasai.', example_th: 'ขอดูกล้องถ่ายรูปหน่อยครับ', textbook_ref: 'JN60101 Ch.4 p.10' },
  { id: 'c4_08', chapter_number: 4, category: 'electronics', word_romaji: 'bideo kamera', word_kana: 'ビデオカメラ', word_kanji: null, meaning_th: 'กล้องวิดีโอ', example_jp: 'Bideo kamera wa 80,000 en desu.', example_th: 'กล้องวิดีโอราคา 80,000 เยน', textbook_ref: 'JN60101 Ch.4 p.11' },
  { id: 'c4_09', chapter_number: 4, category: 'electronics', word_romaji: 'CD purēyā', word_kana: 'CDプレーヤー', word_kanji: null, meaning_th: 'เครื่องเล่นซีดี', example_jp: 'CD purēyā wa 15,000 en desu.', example_th: 'เครื่องเล่นซีดีราคา 15,000 เยน', textbook_ref: 'JN60101 Ch.4 p.12' },
  { id: 'c4_10', chapter_number: 4, category: 'stationery', word_romaji: 'tegami', word_kana: 'てがみ', word_kanji: '手紙', meaning_th: 'จดหมาย', example_jp: 'Tegami o kakimasu.', example_th: 'เขียนจดหมาย', textbook_ref: 'JN60101 Ch.4 p.13' },
  { id: 'c4_11', chapter_number: 4, category: 'stationery', word_romaji: 'kitte', word_kana: 'きって', word_kanji: '切手', meaning_th: 'แสตมป์', example_jp: 'Kitte wa 80 en desu.', example_th: 'แสตมป์ราคา 80 เยน', textbook_ref: 'JN60101 Ch.4 p.14' },
  { id: 'c4_12', chapter_number: 4, category: 'stationery', word_romaji: 'fūtō', word_kana: 'ふうとう', word_kanji: '封筒', meaning_th: 'ซองจดหมาย', example_jp: 'Fūtō wa 100 en desu.', example_th: 'ซองจดหมายราคา 100 เยน', textbook_ref: 'JN60101 Ch.4 p.15' },
  { id: 'c4_13', chapter_number: 4, category: 'goods', word_romaji: 'kaban', word_kana: 'かばん', word_kanji: '鞄', meaning_th: 'กระเป๋า', example_jp: 'Kaban wa 3,000 en desu.', example_th: 'กระเป๋าราคา 3,000 เยน', textbook_ref: 'JN60101 Ch.4 p.18' },
  { id: 'c4_14', chapter_number: 4, category: 'goods', word_romaji: 'jisho', word_kana: 'じしょ', word_kanji: '辞書', meaning_th: 'พจนานุกรม', example_jp: 'Kono jisho wa 4,500 en desu.', example_th: 'พจนานุกรมเล่มนี้ราคา 4,500 เยน', textbook_ref: 'JN60101 Ch.4 p.18' },
  { id: 'c4_15', chapter_number: 4, category: 'goods', word_romaji: 'zasshi', word_kana: 'ざっし', word_kanji: '雑誌', meaning_th: 'นิตยสาร', example_jp: 'Zasshi wa 800 en desu.', example_th: 'นิตยสารราคา 800 เยน', textbook_ref: 'JN60101 Ch.4 p.46' },
  { id: 'c4_15b', chapter_number: 4, category: 'goods', word_romaji: 'kasa', word_kana: 'かさ', word_kanji: '傘', meaning_th: 'ร่ม', example_jp: 'Kore wa watashi no kasa dewa arimasen.', example_th: 'นี่ไม่ใช่ร่มของฉัน', textbook_ref: 'JN60101 Ch.4 p.42' },
  { id: 'c4_15c', chapter_number: 4, category: 'goods', word_romaji: 'kōhī', word_kana: 'コーヒー', word_kanji: null, meaning_th: 'กาแฟ', example_jp: 'Kōhī wa 120 en desu.', example_th: 'กาแฟราคา 120 เยน', textbook_ref: 'JN60101 Ch.4 p.44' },
  { id: 'c4_16', chapter_number: 4, category: 'payment', word_romaji: 'kādo', word_kana: 'カード', word_kanji: null, meaning_th: 'บัตรเครดิต', example_jp: 'Kādo demo ii desuka?', example_th: 'ใช้บัตรเครดิตได้ไหมครับ?', textbook_ref: 'JN60101 Ch.4 p.51' },

  // --- CHAPTER 4: SHOPPING PHRASES & PARTICLE MO (สำนวนการซื้อของ & คำช่วย) ---
  { id: 'c4_17', chapter_number: 4, category: 'phrase', word_romaji: 'ikura desuka', word_kana: 'いくらですか', word_kanji: '幾らですか', meaning_th: 'ราคาเท่าไหร่ครับ/ค่ะ', example_jp: 'Kore wa ikura desuka?', example_th: 'นี่ราคาเท่าไหร่ครับ?', textbook_ref: 'JN60101 Ch.4 p.17' },
  { id: 'c4_18', chapter_number: 4, category: 'phrase', word_romaji: '..o misete kudasai', word_kana: '〜をみせてください', word_kanji: '〜を見せてください', meaning_th: 'ขอดู...หน่อยครับ/ค่ะ', example_jp: 'Sore o misete kudasai.', example_th: 'ขอดูอันนั้นหน่อยครับ', textbook_ref: 'JN60101 Ch.4 p.19' },
  { id: 'c4_19', chapter_number: 4, category: 'phrase', word_romaji: '..o kudasai', word_kana: '〜をください', word_kanji: null, meaning_th: 'ขอรับ... / เอาอันนี้ครับ', example_jp: 'Ja, kore o kudasai.', example_th: 'งั้นเอาอันนี้ครับ', textbook_ref: 'JN60101 Ch.4 p.21' },
  { id: 'c4_20', chapter_number: 4, category: 'phrase', word_romaji: 'Irasshaimase', word_kana: 'いらっしゃいませ', word_kanji: null, meaning_th: 'ยินดีต้อนรับ (เสียงทักทายเมื่อลูกค้าเข้าร้าน)', example_jp: 'Irasshaimase!', example_th: 'ยินดีต้อนรับครับ!', textbook_ref: 'JN60101 Ch.4 p.23' },
  { id: 'c4_21', chapter_number: 4, category: 'phrase', word_romaji: 'ja', word_kana: 'じゃ', word_kanji: null, meaning_th: 'งั้น / ถ้าอย่างนั้น', example_jp: 'Ja, sore o kudasai.', example_th: 'งั้นเอาอันนั้นครับ', textbook_ref: 'JN60101 Ch.4 p.16' },
  { id: 'c4_22', chapter_number: 4, category: 'phrase', word_romaji: 'mo', word_kana: 'も', word_kanji: null, meaning_th: 'ด้วยเหมือนกัน / ก็...ด้วย', example_jp: 'Kore mo 3,000 en desu.', example_th: 'อันนี้ก็ 3,000 เยนเหมือนกัน', textbook_ref: 'JN60101 Ch.4 p.42' },
  { id: 'c4_23', chapter_number: 4, category: 'phrase', word_romaji: 'demo ii desuka', word_kana: '〜でもいいですか', word_kanji: null, meaning_th: '...ได้ไหมครับ / สะดวกไหม', example_jp: 'Kādo demo ii desuka?', example_th: 'ใช้บัตรเครดิตได้ไหมครับ?', textbook_ref: 'JN60101 Ch.4 p.51' },
  { id: 'c4_24', chapter_number: 4, category: 'phrase', word_romaji: 'hai, kekkō desu', word_kana: 'はい、けっこうです', word_kanji: 'はい、結構です', meaning_th: 'ได้ครับ / ตกลงครับ / ไม่มีปัญหา', example_jp: 'Hai, kekkō desu.', example_th: 'ได้ครับ ใช้บัตรได้ครับ', textbook_ref: 'JN60101 Ch.4 p.51' },
  { id: 'c4_24b', chapter_number: 4, category: 'phrase', word_romaji: 'dōzo', word_kana: 'どうぞ', word_kanji: null, meaning_th: 'เชิญครับ / นี่ครับ', example_jp: 'Hai, dōzo.', example_th: 'ครับ เชิญดูได้เลยครับ', textbook_ref: 'JN60101 Ch.4 p.50' },
  { id: 'c4_24c', chapter_number: 4, category: 'phrase', word_romaji: 'dōmo arigatō', word_kana: 'どうもありがとう', word_kanji: null, meaning_th: 'ขอบคุณมากครับ/ค่ะ', example_jp: 'Dōmo arigatō gozaimasu.', example_th: 'ขอบพระคุณเป็นอย่างยิ่งครับ', textbook_ref: 'JN60101 Ch.4 p.50' },

  // --- CHAPTER 4: NUMBERS & LARGE UNITS (ตัวเลขและหลักหน่วยเงิน 100 - 1 ล้านล้าน) ---
  { id: 'c4_25', chapter_number: 4, category: 'number', word_romaji: 'hyaku', word_kana: 'ひゃく', word_kanji: '百', meaning_th: 'หนึ่งร้อย (100)', example_jp: '100 en', example_th: '100 เยน', textbook_ref: 'JN60101 Ch.4 p.27' },
  { id: 'c4_26', chapter_number: 4, category: 'number', word_romaji: 'sanbyaku', word_kana: 'さんびゃく', word_kanji: '三百', meaning_th: 'สามร้อย (300) [เสียงเพี้ยน sanbyaku]', example_jp: '300 en', example_th: '300 เยน', textbook_ref: 'JN60101 Ch.4 p.27' },
  { id: 'c4_27', chapter_number: 4, category: 'number', word_romaji: 'roppyaku', word_kana: 'ろっぴゃく', word_kanji: '六百', meaning_th: 'หกร้อย (600) [เสียงกัก roppyaku]', example_jp: '600 en', example_th: '600 เยน', textbook_ref: 'JN60101 Ch.4 p.27' },
  { id: 'c4_28', chapter_number: 4, category: 'number', word_romaji: 'happyaku', word_kana: 'はっぴゃく', word_kanji: '八百', meaning_th: 'แปดร้อย (800) [เสียงกัก happyaku]', example_jp: '800 en', example_th: '800 เยน', textbook_ref: 'JN60101 Ch.4 p.27' },
  { id: 'c4_29', chapter_number: 4, category: 'number', word_romaji: 'sen', word_kana: 'せん', word_kanji: '千', meaning_th: 'หนึ่งพัน (1,000)', example_jp: '1,000 en', example_th: '1,000 เยน', textbook_ref: 'JN60101 Ch.4 p.29' },
  { id: 'c4_30', chapter_number: 4, category: 'number', word_romaji: 'sanzen', word_kana: 'さんぜん', word_kanji: '三千', meaning_th: 'สามพัน (3,000) [เสียงขุ่น sanzen]', example_jp: '3,000 en', example_th: '3,000 เยน', textbook_ref: 'JN60101 Ch.4 p.30' },
  { id: 'c4_31', chapter_number: 4, category: 'number', word_romaji: 'hassen', word_kana: 'はっせん', word_kanji: '八千', meaning_th: 'แปดพัน (8,000) [เสียงกัก hassen]', example_jp: '8,000 en', example_th: '8,000 เยน', textbook_ref: 'JN60101 Ch.4 p.30' },
  { id: 'c4_32', chapter_number: 4, category: 'number', word_romaji: 'ichi man', word_kana: 'いちまん', word_kanji: '一万', meaning_th: 'หนึ่งหมื่น (10,000) [ต้องใส่ ichi man ห้ามพูด man เฉยๆ]', example_jp: '10,000 en', example_th: '10,000 เยน', textbook_ref: 'JN60101 Ch.4 p.32' },
  { id: 'c4_33', chapter_number: 4, category: 'number', word_romaji: 'jū man', word_kana: 'じゅうまん', word_kanji: '十万', meaning_th: 'หนึ่งแสน (100,000)', example_jp: '100,000 en', example_th: '100,000 เยน', textbook_ref: 'JN60101 Ch.4 p.35' },
  { id: 'c4_34', chapter_number: 4, category: 'number', word_romaji: 'hyaku man', word_kana: 'ひゃくまん', word_kanji: '百万', meaning_th: 'หนึ่งล้าน (1,000,000)', example_jp: '1,000,000 en', example_th: '1,000,000 เยน', textbook_ref: 'JN60101 Ch.4 p.36' },
  { id: 'c4_34a', chapter_number: 4, category: 'number', word_romaji: 'sen man', word_kana: 'せんまん', word_kanji: '千万', meaning_th: 'สิบล้าน (10,000,000)', example_jp: '10,000,000 en', example_th: '10,000,000 เยน', textbook_ref: 'JN60101 Ch.4 p.39' },
  { id: 'c4_34b', chapter_number: 4, category: 'number', word_romaji: 'ichi oku', word_kana: 'いちおく', word_kanji: '一億', meaning_th: 'หนึ่งร้อยล้าน (100,000,000)', example_jp: '100,000,000 en', example_th: '100 ล้านเยน', textbook_ref: 'JN60101 Ch.4 p.39' },
  { id: 'c4_34c', chapter_number: 4, category: 'number', word_romaji: 'jū oku', word_kana: 'じゅうおく', word_kanji: '十億', meaning_th: 'หนึ่งพันล้าน (1,000,000,000)', example_jp: '1,000,000,000 en', example_th: 'พันล้านเยน', textbook_ref: 'JN60101 Ch.4 p.39' },
  { id: 'c4_34d', chapter_number: 4, category: 'number', word_romaji: 'hyaku oku', word_kana: 'ひゃくおく', word_kanji: '百億', meaning_th: 'หนึ่งหมื่นล้าน (10,000,000,000)', example_jp: '10,000,000,000 en', example_th: 'หมื่นล้านเยน', textbook_ref: 'JN60101 Ch.4 p.39' },
  { id: 'c4_34e', chapter_number: 4, category: 'number', word_romaji: 'sen oku', word_kana: 'せんおく', word_kanji: '千億', meaning_th: 'หนึ่งแสนล้าน (100,000,000,000)', example_jp: '100,000,000,000 en', example_th: 'แสนล้านเยน', textbook_ref: 'JN60101 Ch.4 p.39' },
  { id: 'c4_34f', chapter_number: 4, category: 'number', word_romaji: 'it-chō', word_kana: 'いっちょう', word_kanji: '一兆', meaning_th: 'หนึ่งล้านล้าน (1,000,000,000,000)', example_jp: '1,000,000,000,000 en', example_th: 'ล้านล้านเยน', textbook_ref: 'JN60101 Ch.4 p.39' },

  // --- CHAPTER 4: DECIMALS & FRACTIONS (ทศนิยม & เศษส่วน) ---
  { id: 'c4_35', chapter_number: 4, category: 'math', word_romaji: 'ten', word_kana: 'てん', word_kanji: '点', meaning_th: 'จุด (จุดทศนิยม decimal point)', example_jp: 'rei ten nana (0.7)', example_th: 'ศูนย์จุดเจ็ด', textbook_ref: 'JN60101 Ch.4 p.40' },
  { id: 'c4_36', chapter_number: 4, category: 'math', word_romaji: 'bun no', word_kana: 'ぶんの', word_kanji: '分の', meaning_th: 'ส่วน (เศษส่วน fractions: ส่วน bun no เศษ)', example_jp: 'ni-bun no ichi (1/2)', example_th: 'หนึ่งในสอง (ครึ่งหนึ่ง)', textbook_ref: 'JN60101 Ch.4 p.41' },
  { id: 'c4_37', chapter_number: 4, category: 'math', word_romaji: 'san-bun no ni', word_kana: 'さんぶんのに', word_kanji: '三分之二', meaning_th: 'สองในสาม (2/3)', example_jp: 'san-bun no ni', example_th: 'สองในสามส่วน', textbook_ref: 'JN60101 Ch.4 p.41' },
  { id: 'c4_38', chapter_number: 4, category: 'math', word_romaji: 'yon-bun no ichi', word_kana: 'よんぶんのいち', word_kanji: '四分の一', meaning_th: 'หนึ่งในสี่ (1/4)', example_jp: 'yon-bun no ichi', example_th: 'หนึ่งในสี่ส่วน', textbook_ref: 'JN60101 Ch.4 p.41' },
];

// ==========================================
// 5 PATTERNS QUESTION GENERATORS & MASTER POOL
// ==========================================

// Pattern 1: Locations (Koko wa doko desuka?)
export const exam2LocationQuestions: Exam2QuestionItem[] = [
  {
    id: 'e2_p1_01',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/kyoushitsu.jpg',
    imageTitle: 'ห้องเรียน (Kyōshitsu)',
    targetAnswerRomaji: 'Koko wa kyōshitsu desu.',
    targetAnswerKana: 'ここ は きょうしつ です。',
    meaningTh: 'ที่นี่คือห้องเรียน',
    options: [
      { textRomaji: 'Koko wa kyōshitsu desu.', textKana: 'ここ は きょうしつ です。', meaningTh: 'ที่นี่คือห้องเรียน', isCorrect: true },
      { textRomaji: 'Koko wa shokudō desu.', textKana: 'ここ は しょくどう です。', meaningTh: 'ที่นี่คือโรงอาหาร', isCorrect: false },
      { textRomaji: 'Koko wa kaigishitsu desu.', textKana: 'ここ は かいぎしつ です。', meaningTh: 'ที่นี่คือห้องประชุม', isCorrect: false },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'kyōshitsu', nameTh: 'ห้องเรียน', imageSrc: '/assets/images/exam2/locations/kyoushitsu.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพห้องเรียนแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa kyōshitsu desu." (ห้องเรียน = きょうしつ)',
  },
  {
    id: 'e2_p1_02',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/kaigishitsu.jpg',
    imageTitle: 'ห้องประชุม (Kaigishitsu)',
    targetAnswerRomaji: 'Koko wa kaigishitsu desu.',
    targetAnswerKana: 'ここ は かいぎしつ です。',
    meaningTh: 'ที่นี่คือห้องประชุม',
    options: [
      { textRomaji: 'Koko wa kaigishitsu desu.', textKana: 'ここ は かいぎしつ です。', meaningTh: 'ที่นี่คือห้องประชุม', isCorrect: true },
      { textRomaji: 'Koko wa kyōshitsu desu.', textKana: 'ここ は きょうしつ です。', meaningTh: 'ที่นี่คือห้องเรียน', isCorrect: false },
      { textRomaji: 'Koko wa uketsuke desu.', textKana: 'ここ は うけつけ です。', meaningTh: 'ที่นี่คือแผนกต้อนรับ', isCorrect: false },
      { textRomaji: 'Koko wa furonto desu.', textKana: 'ここ は フロント です。', meaningTh: 'ที่นี่คือฟรอนต์', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'kaigishitsu', nameTh: 'ห้องประชุม', imageSrc: '/assets/images/exam2/locations/kaigishitsu.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพห้องประชุมแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa kaigishitsu desu." (ห้องประชุม = かいぎしつ)',
  },
  {
    id: 'e2_p1_03',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/shokudou.jpg',
    imageTitle: 'โรงอาหาร (Shokudō)',
    targetAnswerRomaji: 'Koko wa shokudō desu.',
    targetAnswerKana: 'ここ は しょくどう です。',
    meaningTh: 'ที่นี่คือโรงอาหาร',
    options: [
      { textRomaji: 'Koko wa shokudō desu.', textKana: 'ここ は しょくどう です。', meaningTh: 'ที่นี่คือโรงอาหาร', isCorrect: true },
      { textRomaji: 'Koko wa resutoran desu.', textKana: 'ここ は レストラン です。', meaningTh: 'ที่นี่คือร้านอาหาร', isCorrect: false },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
      { textRomaji: 'Koko wa sūpā desu.', textKana: 'ここ は スーパー です。', meaningTh: 'ที่นี่คือซูเปอร์มาร์เก็ต', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'shokudō', nameTh: 'โรงอาหาร', imageSrc: '/assets/images/exam2/locations/shokudou.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพโรงอาหารแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa shokudō desu." (โรงอาหาร = しょくどう)',
  },
  {
    id: 'e2_p1_04',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/uketsuke.jpg',
    imageTitle: 'แผนกต้อนรับ (Uketsuke)',
    targetAnswerRomaji: 'Koko wa uketsuke desu.',
    targetAnswerKana: 'ここ は うけつけ です。',
    meaningTh: 'ที่นี่คือแผนกต้อนรับ',
    options: [
      { textRomaji: 'Koko wa uketsuke desu.', textKana: 'ここ は うけつけ です。', meaningTh: 'ที่นี่คือแผนกต้อนรับ', isCorrect: true },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
      { textRomaji: 'Koko wa furonto desu.', textKana: 'ここ は フロント です。', meaningTh: 'ที่นี่คือฟรอนต์', isCorrect: false },
      { textRomaji: 'Koko wa kaigishitsu desu.', textKana: 'ここ は かいぎしつ です。', meaningTh: 'ที่นี่คือห้องประชุม', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'uketsuke', nameTh: 'แผนกต้อนรับ', imageSrc: '/assets/images/exam2/locations/uketsuke.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพแผนกต้อนรับ/ประชาสัมพันธ์แล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa uketsuke desu." (แผนกต้อนรับ = うけつけ)',
  },
  {
    id: 'e2_p1_05',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/jimusho.jpg',
    imageTitle: 'สำนักงาน / ออฟฟิศ (Jimusho)',
    targetAnswerRomaji: 'Koko wa jimusho desu.',
    targetAnswerKana: 'ここ は じむしょ です。',
    meaningTh: 'ที่นี่คือสำนักงาน',
    options: [
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: true },
      { textRomaji: 'Koko wa kyōshitsu desu.', textKana: 'ここ は きょうしつ です。', meaningTh: 'ที่นี่คือห้องเรียน', isCorrect: false },
      { textRomaji: 'Koko wa kaigishitsu desu.', textKana: 'ここ は かいぎしつ です。', meaningTh: 'ที่นี่คือห้องประชุม', isCorrect: false },
      { textRomaji: 'Koko wa uketsuke desu.', textKana: 'ここ は うけつけ です。', meaningTh: 'ที่นี่คือแผนกต้อนรับ', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'jimusho', nameTh: 'สำนักงาน', imageSrc: '/assets/images/exam2/locations/jimusho.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพออฟฟิศแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa jimusho desu." (สำนักงาน = じむしょ)',
  },
  {
    id: 'e2_p1_06',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/depaato.jpg',
    imageTitle: 'ห้างสรรพสินค้า (Depāto)',
    targetAnswerRomaji: 'Koko wa depāto desu.',
    targetAnswerKana: 'ここ は デパート です。',
    meaningTh: 'ที่นี่คือห้างสรรพสินค้า',
    options: [
      { textRomaji: 'Koko wa depāto desu.', textKana: 'ここ は デパート です。', meaningTh: 'ที่นี่คือห้างสรรพสินค้า', isCorrect: true },
      { textRomaji: 'Koko wa sūpā desu.', textKana: 'ここ は スーパー です。', meaningTh: 'ที่นี่คือซูเปอร์มาร์เก็ต', isCorrect: false },
      { textRomaji: 'Koko wa mise desu.', textKana: 'ここ は みせ です。', meaningTh: 'ที่นี่คือร้านค้า', isCorrect: false },
      { textRomaji: 'Koko wa yūbinkyoku desu.', textKana: 'ここ は ゆうびんきょく です。', meaningTh: 'ที่นี่คือที่ทำการไปรษณีย์', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'depāto', nameTh: 'ห้างสรรพสินค้า', imageSrc: '/assets/images/exam2/locations/depaato.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพห้างสรรพสินค้าแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa depāto desu." (ห้างสรรพสินค้า = デパート)',
  },
  {
    id: 'e2_p1_07',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/suupaa.jpg',
    imageTitle: 'ซูเปอร์มาร์เก็ต (Sūpā)',
    targetAnswerRomaji: 'Koko wa sūpā desu.',
    targetAnswerKana: 'ここ は スーパー です。',
    meaningTh: 'ที่นี่คือซูเปอร์มาร์เก็ต',
    options: [
      { textRomaji: 'Koko wa sūpā desu.', textKana: 'ここ は スーパー です。', meaningTh: 'ที่นี่คือซูเปอร์มาร์เก็ต', isCorrect: true },
      { textRomaji: 'Koko wa depāto desu.', textKana: 'ここ は デパート です。', meaningTh: 'ที่นี่คือห้างสรรพสินค้า', isCorrect: false },
      { textRomaji: 'Koko wa mise desu.', textKana: 'ここ は みせ です。', meaningTh: 'ที่นี่คือร้านค้า', isCorrect: false },
      { textRomaji: 'Koko wa resutoran desu.', textKana: 'ここ は レストラン です。', meaningTh: 'ที่นี่คือร้านอาหาร', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'sūpā', nameTh: 'ซูเปอร์มาร์เก็ต', imageSrc: '/assets/images/exam2/locations/suupaa.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพซูเปอร์มาร์เก็ตแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa sūpā desu." (ซูเปอร์มาร์เก็ต = スーパー)',
  },
  {
    id: 'e2_p1_08',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/resutoran.jpg',
    imageTitle: 'ร้านอาหาร (Resutoran)',
    targetAnswerRomaji: 'Koko wa resutoran desu.',
    targetAnswerKana: 'ここ は レストラン です。',
    meaningTh: 'ที่นี่คือร้านอาหาร',
    options: [
      { textRomaji: 'Koko wa resutoran desu.', textKana: 'ここ は レストラン です。', meaningTh: 'ที่นี่คือร้านอาหาร', isCorrect: true },
      { textRomaji: 'Koko wa shokudō desu.', textKana: 'ここ は しょくどう です。', meaningTh: 'ที่นี่คือโรงอาหาร', isCorrect: false },
      { textRomaji: 'Koko wa furonto desu.', textKana: 'ここ は フロント です。', meaningTh: 'ที่นี่คือฟรอนต์', isCorrect: false },
      { textRomaji: 'Koko wa sūpā desu.', textKana: 'ここ は スーパー です。', meaningTh: 'ที่นี่คือซูเปอร์มาร์เก็ต', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'resutoran', nameTh: 'ร้านอาหาร', imageSrc: '/assets/images/exam2/locations/resutoran.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพร้านอาหารแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa resutoran desu." (ร้านอาหาร = レストラン)',
  },
  {
    id: 'e2_p1_09',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/yuubinkyoku.jpg',
    imageTitle: 'ที่ทำการไปรษณีย์ (Yūbinkyoku)',
    targetAnswerRomaji: 'Koko wa yūbinkyoku desu.',
    targetAnswerKana: 'ここ は ゆうびんきょく です。',
    meaningTh: 'ที่นี่คือที่ทำการไปรษณีย์',
    options: [
      { textRomaji: 'Koko wa yūbinkyoku desu.', textKana: 'ここ は ゆうびんきょく です。', meaningTh: 'ที่นี่คือที่ทำการไปรษณีย์', isCorrect: true },
      { textRomaji: 'Koko wa ginkō desu.', textKana: 'ここ は ぎんこう です。', meaningTh: 'ที่นี่คือธนาคาร', isCorrect: false },
      { textRomaji: 'Koko wa depāto desu.', textKana: 'ここ は デパート です。', meaningTh: 'ที่นี่คือห้างสรรพสินค้า', isCorrect: false },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'yūbinkyoku', nameTh: 'ที่ทำการไปรษณีย์', imageSrc: '/assets/images/exam2/locations/yuubinkyoku.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพที่ทำการไปรษณีย์แล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa yūbinkyoku desu." (ที่ทำการไปรษณีย์ = ゆうびんきょく)',
  },
  {
    id: 'e2_p1_10',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/furonto.jpg',
    imageTitle: 'ฟรอนต์โรงแรม (Furonto)',
    targetAnswerRomaji: 'Koko wa furonto desu.',
    targetAnswerKana: 'ここ は フロント です。',
    meaningTh: 'ที่นี่คือเคาน์เตอร์ฟรอนต์',
    options: [
      { textRomaji: 'Koko wa furonto desu.', textKana: 'ここ は フロント です。', meaningTh: 'ที่นี่คือเคาน์เตอร์ฟรอนต์', isCorrect: true },
      { textRomaji: 'Koko wa uketsuke desu.', textKana: 'ここ は うけつけ です。', meaningTh: 'ที่นี่คือแผนกต้อนรับ', isCorrect: false },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
      { textRomaji: 'Koko wa resutoran desu.', textKana: 'ここ は レストラン です。', meaningTh: 'ที่นี่คือร้านอาหาร', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'furonto', nameTh: 'ฟรอนต์โรงแรม', imageSrc: '/assets/images/exam2/locations/furonto.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพฟรอนต์โรงแรมแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa furonto desu." (ฟรอนต์ = フロント)',
  },
  {
    id: 'e2_p1_11',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/puuru.jpg',
    imageTitle: 'สระว่ายน้ำ (Pūru)',
    targetAnswerRomaji: 'Koko wa pūru desu.',
    targetAnswerKana: 'ここ は プール です。',
    meaningTh: 'ที่นี่คือสระว่ายน้ำ',
    options: [
      { textRomaji: 'Koko wa pūru desu.', textKana: 'ここ は プール です。', meaningTh: 'ที่นี่คือสระว่ายน้ำ', isCorrect: true },
      { textRomaji: 'Koko wa jimu desu.', textKana: 'ここ は ジム です。', meaningTh: 'ที่นี่คือฟิตเนส', isCorrect: false },
      { textRomaji: 'Koko wa shokudō desu.', textKana: 'ここ は しょくどう です。', meaningTh: 'ที่นี่คือโรงอาหาร', isCorrect: false },
      { textRomaji: 'Koko wa kyōshitsu desu.', textKana: 'ここ は きょうしつ です。', meaningTh: 'ที่นี่คือห้องเรียน', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'pūru', nameTh: 'สระว่ายน้ำ', imageSrc: '/assets/images/exam2/locations/puuru.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพสระว่ายน้ำแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa pūru desu." (สระว่ายน้ำ = プール)',
  },
  {
    id: 'e2_p1_12',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/jimu.jpg',
    imageTitle: 'ฟิตเนส / ยิม (Jimu)',
    targetAnswerRomaji: 'Koko wa jimu desu.',
    targetAnswerKana: 'ここ は ジム です。',
    meaningTh: 'ที่นี่คือฟิตเนส',
    options: [
      { textRomaji: 'Koko wa jimu desu.', textKana: 'ここ は ジム です。', meaningTh: 'ที่นี่คือฟิตเนส', isCorrect: true },
      { textRomaji: 'Koko wa pūru desu.', textKana: 'ここ は プール です。', meaningTh: 'ที่นี่คือสระว่ายน้ำ', isCorrect: false },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
      { textRomaji: 'Koko wa kaigishitsu desu.', textKana: 'ここ は かいぎしつ です。', meaningTh: 'ที่นี่คือห้องประชุม', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'jimu', nameTh: 'ฟิตเนส', imageSrc: '/assets/images/exam2/locations/jimu.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพฟิตเนสแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa jimu desu." (ฟิตเนส = ジム)',
  },
  {
    id: 'e2_p1_13',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/otearai.jpg',
    imageTitle: 'ห้องน้ำ (Otearai)',
    targetAnswerRomaji: 'Koko wa otearai desu.',
    targetAnswerKana: 'ここ は おてあらい です。',
    meaningTh: 'ที่นี่คือห้องน้ำ',
    options: [
      { textRomaji: 'Koko wa otearai desu.', textKana: 'ここ は おてあらい です。', meaningTh: 'ที่นี่คือห้องน้ำ', isCorrect: true },
      { textRomaji: 'Koko wa kyōshitsu desu.', textKana: 'ここ は きょうしつ です。', meaningTh: 'ที่นี่คือห้องเรียน', isCorrect: false },
      { textRomaji: 'Koko wa uketsuke desu.', textKana: 'ここ は うけつけ です。', meaningTh: 'ที่นี่คือแผนกต้อนรับ', isCorrect: false },
      { textRomaji: 'Koko wa jimusho desu.', textKana: 'ここ は じむしょ です。', meaningTh: 'ที่นี่คือสำนักงาน', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'otearai', nameTh: 'ห้องน้ำ', imageSrc: '/assets/images/exam2/locations/otearai.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพห้องน้ำแล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa otearai desu." (ห้องน้ำ = おてあらい)',
  },
  {
    id: 'e2_p1_14',
    patternId: 1,
    patternTitle: '1. สถานที่ (Locations)',
    promptRomaji: 'Koko wa doko desuka?',
    promptJp: 'Koko wa doko desuka?',
    promptTh: 'อาจารย์ชี้ภาพสถานที่แล้วถามว่า:',
    imageSrc: '/assets/images/exam2/locations/mise.jpg',
    imageTitle: 'ร้านค้า (Mise)',
    targetAnswerRomaji: 'Koko wa mise desu.',
    targetAnswerKana: 'ここ は みせ です。',
    meaningTh: 'ที่นี่คือร้านค้า',
    options: [
      { textRomaji: 'Koko wa mise desu.', textKana: 'ここ は みせ です。', meaningTh: 'ที่นี่คือร้านค้า', isCorrect: true },
      { textRomaji: 'Koko wa depāto desu.', textKana: 'ここ は デパート です。', meaningTh: 'ที่นี่คือห้างสรรพสินค้า', isCorrect: false },
      { textRomaji: 'Koko wa sūpā desu.', textKana: 'ここ は スーパー です。', meaningTh: 'ที่นี่คือซูเปอร์มาร์เก็ต', isCorrect: false },
      { textRomaji: 'Koko wa resutoran desu.', textKana: 'ここ は レストラン です。', meaningTh: 'ที่นี่คือร้านอาหาร', isCorrect: false },
    ],
    visualType: 'location',
    visualData: { locationKey: 'mise', nameTh: 'ร้านค้า', imageSrc: '/assets/images/exam2/locations/mise.jpg' },
    explanationTh: 'อาจารย์ชี้ภาพร้านค้า (บทที่ 4) แล้วถาม "Koko wa doko desuka?" ให้ตอบ "Koko wa mise desu." (ร้านค้า = みせ)',
  },
];

// Pattern 2: Telling Time (Ima nan ji desuka?)
// Comprehensive 24-hour generator covering all 5-minute intervals on earth (00:00 to 23:55 = 288 questions)
function generateAllClockQuestions(): Exam2QuestionItem[] {
  interface HourDef {
    romaji: string;
    kana: string;
    thai: string;
    distractorHourRomaji: string;
    distractorHourKana: string;
    distractorNote: string;
    isSpecial?: boolean;
  }

  interface MinuteDef {
    romaji: string;
    kana: string;
    thai: string;
    distractorMinuteRomaji: string;
    distractorMinuteKana: string;
    distractorNote: string;
    isSpecial?: boolean;
  }

  const hourData: Record<number, HourDef> = {
    1: { romaji: 'ichi-ji', kana: 'いちじ', thai: '1 โมง', distractorHourRomaji: 'ni-ji', distractorHourKana: 'にじ', distractorNote: 'ni-ji (ผิดชั่วโมง)' },
    2: { romaji: 'ni-ji', kana: 'にじ', thai: '2 โมง', distractorHourRomaji: 'san-ji', distractorHourKana: 'さんじ', distractorNote: 'san-ji (ผิดชั่วโมง)' },
    3: { romaji: 'san-ji', kana: 'さんじ', thai: '3 โมง', distractorHourRomaji: 'yo-ji', distractorHourKana: 'よじ', distractorNote: 'yo-ji (ผิดชั่วโมง)' },
    4: { romaji: 'yo-ji', kana: 'よじ', thai: '4 โมง', distractorHourRomaji: 'yon-ji', distractorHourKana: 'よんじ', distractorNote: 'yon-ji (ผิด 4 โมงต้อง yo-ji ห้ามใช้ yon-ji หรือ shi-ji)', isSpecial: true },
    5: { romaji: 'go-ji', kana: 'ごじ', thai: '5 โมง', distractorHourRomaji: 'roku-ji', distractorHourKana: 'ろくじ', distractorNote: 'roku-ji (ผิดชั่วโมง)' },
    6: { romaji: 'roku-ji', kana: 'ろくじ', thai: '6 โมง', distractorHourRomaji: 'shichi-ji', distractorHourKana: 'しちじ', distractorNote: 'shichi-ji (ผิดชั่วโมง)' },
    7: { romaji: 'shichi-ji', kana: 'しちじ', thai: '7 โมง', distractorHourRomaji: 'nana-ji', distractorHourKana: 'ななじ', distractorNote: 'nana-ji (ผิด บอกเวลานิยม shichi-ji)', isSpecial: true },
    8: { romaji: 'hachi-ji', kana: 'はちじ', thai: '8 โมง', distractorHourRomaji: 'ku-ji', distractorHourKana: 'くじ', distractorNote: 'ku-ji (ผิดชั่วโมง)' },
    9: { romaji: 'ku-ji', kana: 'くじ', thai: '9 โมง', distractorHourRomaji: 'kyū-ji', distractorHourKana: 'きゅうじ', distractorNote: 'kyū-ji (ผิด 9 โมงต้อง ku-ji ห้ามใช้ kyū-ji)', isSpecial: true },
    10: { romaji: 'jū-ji', kana: 'じゅうじ', thai: '10 โมง', distractorHourRomaji: 'jūichi-ji', distractorHourKana: 'じゅういちじ', distractorNote: 'jūichi-ji (ผิดชั่วโมง)' },
    11: { romaji: 'jūichi-ji', kana: 'じゅういちじ', thai: '11 โมง', distractorHourRomaji: 'jūni-ji', distractorHourKana: 'じゅうにじ', distractorNote: 'jūni-ji (ผิดชั่วโมง)' },
    12: { romaji: 'jūni-ji', kana: 'じゅうにじ', thai: '12 โมง', distractorHourRomaji: 'ichi-ji', distractorHourKana: 'いちじ', distractorNote: 'ichi-ji (ผิดชั่วโมง)' },
  };

  const minuteData: Record<number, MinuteDef> = {
    0: { romaji: '', kana: '', thai: 'ตรง', distractorMinuteRomaji: 'han', distractorMinuteKana: 'はん', distractorNote: 'มี han เกินมา (นี่คือเวลาตรง)' },
    5: { romaji: 'go-fun', kana: 'ごふん', thai: '5 นาที', distractorMinuteRomaji: 'go-pun', distractorMinuteKana: 'ごぷん', distractorNote: 'go-pun (ผิด 5 นาทีต้อง fun)' },
    10: { romaji: 'jup-pun', kana: 'じゅっぷん', thai: '10 นาที', distractorMinuteRomaji: 'jū-fun', distractorMinuteKana: 'じゅうふん', distractorNote: 'jū-fun (ผิด 10 นาทีเป็นเสียงกัก jup-pun)', isSpecial: true },
    15: { romaji: 'jūgo-fun', kana: 'じゅうごふん', thai: '15 นาที', distractorMinuteRomaji: 'jūgo-pun', distractorMinuteKana: 'じゅうごぷん', distractorNote: 'jūgo-pun (ผิด 15 นาทีต้อง fun)' },
    20: { romaji: 'nijup-pun', kana: 'にじゅっぷん', thai: '20 นาที', distractorMinuteRomaji: 'nijū-fun', distractorMinuteKana: 'にじゅうふん', distractorNote: 'nijū-fun (ผิด 20 นาทีเป็นเสียงกัก nijup-pun)', isSpecial: true },
    25: { romaji: 'nijūgo-fun', kana: 'にじゅうごふん', thai: '25 นาที', distractorMinuteRomaji: 'nijūgo-pun', distractorMinuteKana: 'にじゅうごぷん', distractorNote: 'nijūgo-pun (ผิด 25 นาทีต้อง fun)' },
    30: { romaji: 'han', kana: 'はん', thai: '30 นาที (ครึ่ง)', distractorMinuteRomaji: 'sanjū-fun', distractorMinuteKana: 'さんじゅうふん', distractorNote: 'sanjū-fun (ผิด 30 นาทีต้องใช้ han)', isSpecial: true },
    35: { romaji: 'sanjūgo-fun', kana: 'さんじゅうごふん', thai: '35 นาที', distractorMinuteRomaji: 'sanjūgo-pun', distractorMinuteKana: 'さんじゅうごぷん', distractorNote: 'sanjūgo-pun (ผิด 35 นาทีต้อง fun)' },
    40: { romaji: 'yonjup-pun', kana: 'よんじゅっぷん', thai: '40 นาที', distractorMinuteRomaji: 'yonjū-fun', distractorMinuteKana: 'よんじゅうふん', distractorNote: 'yonjū-fun (ผิด 40 นาทีเป็นเสียงกัก yonjup-pun)', isSpecial: true },
    45: { romaji: 'yonjū gofun', kana: 'よんじゅうごふん', thai: '45 นาที', distractorMinuteRomaji: 'yonjū gopun', distractorMinuteKana: 'よんじゅうごぷん', distractorNote: 'yonjū gopun (ผิด 45 นาทีต้อง gofun)' },
    50: { romaji: 'gojup-pun', kana: 'ごじゅっぷん', thai: '50 นาที', distractorMinuteRomaji: 'gojū-fun', distractorMinuteKana: 'ごじゅうふん', distractorNote: 'gojū-fun (ผิด 50 นาทีเป็นเสียงกัก gojup-pun)', isSpecial: true },
    55: { romaji: 'gojūgo-fun', kana: 'ごじゅうごふん', thai: '55 นาที', distractorMinuteRomaji: 'gojūgo-pun', distractorMinuteKana: 'ごじゅうごぷん', distractorNote: 'gojūgo-pun (ผิด 55 นาทีต้อง fun)' },
  };

  const getThaiTime = (h24: number, m: number): string => {
    let base = '';
    if (h24 === 0) base = 'เที่ยงคืน';
    else if (h24 >= 1 && h24 <= 5) base = `ตี ${h24}`;
    else if (h24 >= 6 && h24 <= 11) base = `${h24} โมงเช้า`;
    else if (h24 === 12) base = 'เที่ยงวัน';
    else if (h24 === 13) base = 'บ่ายโมง';
    else if (h24 >= 14 && h24 <= 15) base = `บ่าย ${h24 - 12} โมง`;
    else if (h24 === 16) base = 'บ่าย 4 โมง (16.00 น.)';
    else if (h24 >= 17 && h24 <= 18) base = `${h24 - 12} โมงเย็น`;
    else base = `${h24 - 18} ทุ่ม`;

    if (m === 0) return `${base}ตรง`;
    if (m === 30) return `${base}ครึ่ง`;
    return `${base} ${m} นาที`;
  };

  const shuffle = <T>(arr: T[], seed: number): T[] => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  const items: Exam2QuestionItem[] = [];
  let idCount = 1;

  for (const period of ['gozen', 'gogo'] as const) {
    const isGozen = period === 'gozen';
    const periodKana = isGozen ? 'ごぜん' : 'ごご';
    const oppPeriod = isGozen ? 'gogo' : 'gozen';
    const oppPeriodKana = isGozen ? 'ごご' : 'ごぜん';

    for (let h = 1; h <= 12; h++) {
      for (let m = 0; m < 60; m += 5) {
        const hObj = hourData[h];
        const mObj = minuteData[m];

        let h24: number;
        if (isGozen) {
          h24 = h === 12 ? 0 : h;
        } else {
          h24 = h === 12 ? 12 : h + 12;
        }

        const hhStr = String(h24).padStart(2, '0');
        const mmStr = String(m).padStart(2, '0');
        const display = `${hhStr}.${mmStr}`;
        const timeDisplay = `${display} น.`;
        const timeString = `${hhStr}:${mmStr}`;
        const thaiDesc = getThaiTime(h24, m);

        const timePartRomaji = mObj.romaji ? `${hObj.romaji} ${mObj.romaji}` : hObj.romaji;
        const timePartKana = mObj.kana ? `${hObj.kana} ${mObj.kana}` : hObj.kana;

        const targetRomaji = `Ima ${period} ${timePartRomaji} desu.`;
        const targetKana = `いま ${periodKana} ${timePartKana} です。`;

        const optCorrect: Exam2Option = {
          textRomaji: targetRomaji,
          textKana: targetKana,
          meaningTh: `ตอนนี้ ${thaiDesc} (${timeDisplay}) ถูกต้อง`,
          isCorrect: true,
        };

        const optWrongPeriod: Exam2Option = {
          textRomaji: `Ima ${oppPeriod} ${timePartRomaji} desu.`,
          textKana: `いま ${oppPeriodKana} ${timePartKana} です。`,
          meaningTh: `${oppPeriod} (ผิด ${timeDisplay} คือช่วง ${isGozen ? 'เช้า gozen' : 'บ่าย-ค่ำ gogo'})`,
          isCorrect: false,
        };

        const d2HourRomaji = mObj.romaji ? `${hObj.distractorHourRomaji} ${mObj.romaji}` : hObj.distractorHourRomaji;
        const d2HourKana = mObj.kana ? `${hObj.distractorHourKana} ${mObj.kana}` : hObj.distractorHourKana;
        const optWrongHour: Exam2Option = {
          textRomaji: `Ima ${period} ${d2HourRomaji} desu.`,
          textKana: `いま ${periodKana} ${d2HourKana} です。`,
          meaningTh: hObj.distractorNote,
          isCorrect: false,
        };

        const d3MinuteRomaji = `${hObj.romaji} ${mObj.distractorMinuteRomaji}`.trim();
        const d3MinuteKana = `${hObj.kana} ${mObj.distractorMinuteKana}`.trim();
        const optWrongMinute: Exam2Option = {
          textRomaji: `Ima ${period} ${d3MinuteRomaji} desu.`,
          textKana: `いま ${periodKana} ${d3MinuteKana} です。`,
          meaningTh: mObj.distractorNote,
          isCorrect: false,
        };

        const seed = (isGozen ? 0 : 500) + h * 20 + m;
        const options = shuffle([optCorrect, optWrongPeriod, optWrongHour, optWrongMinute], seed);

        let explanation = `เวลา ${timeDisplay} (${thaiDesc}): ใช้ "${period}" ตามด้วยชั่วโมง "${hObj.romaji}"`;
        if (mObj.romaji) explanation += ` และนาที "${mObj.romaji}"`;
        explanation += ` → "${targetRomaji}"`;

        if (timeDisplay === '16.30 น.') {
          explanation = '⭐ ตัวอย่างสไลด์ข้อสอบจริงหน้า 6: 16.30 น. (ช่วงบ่าย-เย็น) ต้องตอบ "Ima gogo yo-ji han desu." (4 โมงยกเว้นเสียงเป็น yo-ji และ 30 นาทีคือ han)';
        } else if (timeDisplay === '09.45 น.') {
          explanation = '⭐ ตัวอย่างสไลด์ข้อสอบจริงหน้า 6: 09.45 น. (ช่วงเช้า) ต้องตอบ "Ima gozen ku-ji yonjū gofun desu." (9 โมงยกเว้นเสียงเป็น ku-ji และ 45 นาทีคือ yonjū gofun)';
        } else if (timeDisplay === '21.00 น.') {
          explanation = '⭐ ตามสไลด์บทที่ 3 หน้า 48 ระบุ: Gogo ku-ji = 21.00 น. (3 ทุ่ม) และ 9 โมงต้อง ku-ji เท่านั้น';
        } else if (timeDisplay === '09.00 น.') {
          explanation = '⭐ ตามสไลด์บทที่ 3 หน้า 48: Gozen ku-ji = 09.00 น. (9 โมงเช้า)';
        }

        const id = `e2_p2_${String(idCount++).padStart(3, '0')}`;
        items.push({
          id,
          patternId: 2,
          patternTitle: '2. บอกเวลา (Telling Time)',
          promptRomaji: 'Ima nan ji desuka?',
          promptJp: 'いま なんじ ですか。',
          promptTh: `อาจารย์ถามเวลาจากป้าย/หน้าจอข้อสอบ (${timeDisplay})`,
          targetAnswerRomaji: targetRomaji,
          targetAnswerKana: targetKana,
          meaningTh: `ตอนนี้ ${thaiDesc} (${timeDisplay}) ครับ/ค่ะ`,
          options,
          visualType: 'clock',
          visualData: {
            hour: h24,
            minute: m,
            period,
            display,
            timeDisplay,
            timeString,
            isSpecial: Boolean(hObj.isSpecial || mObj.isSpecial || timeDisplay === '16.30 น.' || timeDisplay === '09.45 น.'),
          },
          explanationTh: explanation,
        });
      }
    }
  }

  // Fully shuffle all 288 clock questions across 24 hours using Fisher-Yates algorithm
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const exam2ClockQuestions: Exam2QuestionItem[] = generateAllClockQuestions();

// Pattern 3: Phone Numbers (Anata no denwa bango wa nan desuka?)
export const exam2PhoneQuestions: Exam2QuestionItem[] = [
  {
    id: 'e2_p3_01',
    patternId: 3,
    patternTitle: '3. เบอร์โทรศัพท์ (Phone Numbers)',
    promptRomaji: 'Anata no denwa bangō wa nan desuka?',
    promptJp: 'あなた の でんわばんごう は なん ですか。',
    promptTh: 'อาจารย์ถามเบอร์โทรศัพท์ 081-234-5678 ให้ตอบเป็นประโยคที่ถูกต้อง',
    targetAnswerRomaji: 'Zero hachi ichi no ni san yon no go roku nana hachi desu.',
    targetAnswerKana: 'ゼロ はち いち の に さん よん の ご ろく なな はち です。',
    meaningTh: '081-234-5678 ครับ (ใช้คำช่วย no แทนขีด - และลงท้าย desu.)',
    options: [
      { textRomaji: 'Zero hachi ichi no ni san yon no go roku nana hachi desu.', textKana: 'ゼロ はち いち の に さん よん の ご ろく なな はち です。', meaningTh: '081-234-5678 desu.', isCorrect: true },
      { textRomaji: 'Zero hachi ichi ni san yon go roku nana hachi desu.', textKana: 'ゼロ はち いち に さん よん ご ろく なな はち です。', meaningTh: 'ขาดคำช่วย no', isCorrect: false },
      { textRomaji: 'Zero hachi ichi kara ni san yon made desu.', textKana: 'ゼロ はち いち から に さん よん まで です。', meaningTh: 'ใช้ kara/made ผิดบริบท', isCorrect: false },
      { textRomaji: 'Zero hachi ichi no ni san yon no go roku nana hachi.', textKana: 'ゼロ はち いち の に さん よん の ご ろく なな はち。', meaningTh: 'ขาด desu ท้ายประโยค', isCorrect: false },
    ],
    visualType: 'phone',
    visualData: { phoneDisplay: '081-234-5678', parts: ['081', '234', '5678'] },
    explanationTh: '⭐ กฎการบอกเบอร์โทรศัพท์: อ่านตัวเลขเรียงทีละตัว เครื่องหมายยัติภังค์ (-) ให้ออกเสียงเชื่อมด้วย "no" (の) และต้องลงท้ายด้วย "desu."',
  },
  {
    id: 'e2_p3_02',
    patternId: 3,
    patternTitle: '3. เบอร์โทรศัพท์ (Phone Numbers)',
    promptRomaji: 'Anata no denwa bangō wa nan desuka?',
    promptJp: 'あなた の でんわばんごう は なん ですか。',
    promptTh: 'อาจารย์ถามเบอร์โทรศัพท์ 090-7423-9105 ให้ตอบเป็นประโยคที่ถูกต้อง',
    targetAnswerRomaji: 'Zero kyū zero no nana yon ni san no kyū ichi zero go desu.',
    targetAnswerKana: 'ゼロ きゅう ゼロ の なな よん に さん の きゅう いち ゼロ ご です。',
    meaningTh: '090-7423-9105 ครับ',
    options: [
      { textRomaji: 'Zero kyū zero no nana yon ni san no kyū ichi zero go desu.', textKana: 'ゼロ きゅう ゼロ の なな よん に さん の きゅう いち ゼロ ご です。', meaningTh: '090-7423-9105 desu.', isCorrect: true },
      { textRomaji: 'Zero kyū zero nana yon ni san kyū ichi zero go desu.', textKana: 'ゼロ きゅう ゼロ なな よん に さん きゅう いち ゼロ ご です。', meaningTh: 'ขาดคำช่วย no', isCorrect: false },
      { textRomaji: 'Zero ku zero no nana shi ni san no ku ichi rei go desu.', textKana: 'ゼロ く ゼロ の なな し に さん の く いち れい ご です。', meaningTh: 'อ่านเลข 9 เป็น ku ผิดบริบทเบอร์โทร', isCorrect: false },
      { textRomaji: 'Zero kyū zero no nana yon ni san no kyū ichi zero go da.', textKana: 'ゼロ きゅう ゼロ の なな よん に さん の きゅう いち ゼロ ご だ。', meaningTh: 'ลงท้าย da ไม่สุภาพ', isCorrect: false },
    ],
    visualType: 'phone',
    visualData: { phoneDisplay: '090-7423-9105', parts: ['090', '7423', '9105'] },
    explanationTh: 'เบอร์ 090-7423-9105 ให้อ่าน 0 เป็น zero หรือ rei, เลข 9 เป็น kyū และมีคำช่วย "no" คั่น 2 ตำแหน่ง',
  },
];

// Pattern 4: Prices & Shopping (Kore wa ikura desuka?)
export const exam2PriceQuestions: Exam2QuestionItem[] = [
  {
    id: 'e2_p4_01',
    patternId: 4,
    patternTitle: '4. ราคาสินค้า (Prices & Shopping)',
    promptRomaji: 'Kore wa ikura desuka?',
    promptJp: 'これ は いくら ですか。',
    promptTh: 'อาจารย์ชี้กระเป๋าราคา ¥3,800 แล้วถามราคา',
    targetAnswerRomaji: 'Sanzen happyaku-en desu.',
    targetAnswerKana: 'さんぜん はっぴゃく えん です。',
    meaningTh: 'ราคา 3,800 เยนครับ (ระวังเสียงขุ่น sanzen และเสียงกัก happyaku)',
    options: [
      { textRomaji: 'Sanzen happyaku-en desu.', textKana: 'さんぜん はっぴゃく えん です。', meaningTh: '3,800 เยน', isCorrect: true },
      { textRomaji: 'Sansenk hachihyaku-en desu.', textKana: 'さんせん はちひゃく えん です。', meaningTh: 'sansenk / hachihyaku (ผิดเสียงยกเว้น)', isCorrect: false },
      { textRomaji: 'Sanbyaku hassen-en desu.', textKana: 'さんびゃく はっせん えん です。', meaningTh: 'สลับหลักร้อยกับพัน', isCorrect: false },
      { textRomaji: 'Sanzen happyaku-en dewa arimasen.', textKana: 'さんぜん はっぴゃく えん では ありません。', meaningTh: 'เป็นประโยคปฏิเสธ', isCorrect: false },
    ],
    visualType: 'price',
    visualData: { item: 'กระเป๋า (kaban)', price: 3800, currency: '¥' },
    explanationTh: '⭐ 3,000 ออกเสียงว่า "sanzen" (さんぜん) และ 800 ออกเสียงว่า "happyaku" (はっぴゃく) รวมกันเป็น "Sanzen happyaku-en desu."',
  },
  {
    id: 'e2_p4_02',
    patternId: 4,
    patternTitle: '4. ราคาสินค้า (Prices & Shopping)',
    promptRomaji: 'Kore wa ikura desuka?',
    promptJp: 'これ は いくら ですか。',
    promptTh: 'อาจารย์ชี้กล้องถ่ายรูปราคา ¥18,600 แล้วถามราคา',
    targetAnswerRomaji: 'Ichi-man hassen roppyaku-en desu.',
    targetAnswerKana: 'いちまん はっせん ろっぴゃく えん です。',
    meaningTh: 'ราคา 18,600 เยนครับ (ระวัง ichi-man, hassen, roppyaku)',
    options: [
      { textRomaji: 'Ichi-man hassen roppyaku-en desu.', textKana: 'いちまん はっせん ろっぴゃく えん です。', meaningTh: '18,600 เยน', isCorrect: true },
      { textRomaji: 'Man hachi-sen roku-hyaku-en desu.', textKana: 'まん はちせん ろくひゃく えん です。', meaningTh: 'ขาด ichi หน้า man และผิดเสียงยกเว้น', isCorrect: false },
      { textRomaji: 'Jūhachi-sen roppyaku-en desu.', textKana: 'じゅうはちせん ろっぴゃく えん です。', meaningTh: 'ญี่ปุ่นไม่นับ 18-sen ต้องนับเป็น man', isCorrect: false },
      { textRomaji: 'Ichi-man hassen roku-hyaku-en desu.', textKana: 'いちまん はっせん ろくひゃく えん です。', meaningTh: 'roku-hyaku (ผิดเสียง ต้องเป็น roppyaku)', isCorrect: false },
    ],
    visualType: 'price',
    visualData: { item: 'กล้องดิจิทัล (dejikame)', price: 18600, currency: '¥' },
    explanationTh: '⭐ หลักหมื่น 10,000 ต้องมี "ichi-man" (ห้ามพูด man เฉยๆ), 8,000 คือ "hassen", 600 คือ "roppyaku"',
  },
  {
    id: 'e2_p4_03',
    patternId: 4,
    patternTitle: '4. ราคาสินค้า (Prices & Shopping)',
    promptRomaji: 'Kore wa ikura desuka?',
    promptJp: 'これ は いくら ですか。',
    promptTh: 'อาจารย์ชี้โทรทัศน์ราคา ¥50,000 แล้วถามราคา',
    targetAnswerRomaji: 'Go-man-en desu.',
    targetAnswerKana: 'ごまん えん です。',
    meaningTh: 'ราคา 50,000 เยนครับ',
    options: [
      { textRomaji: 'Go-man-en desu.', textKana: 'ごまん えん です。', meaningTh: '50,000 เยน', isCorrect: true },
      { textRomaji: 'Gojū-sen-en desu.', textKana: 'ごじゅうせん えん です。', meaningTh: 'gojū-sen (ผิด ต้องนับหลัก man)', isCorrect: false },
      { textRomaji: 'Go-sen-en desu.', textKana: 'ごせん えん です。', meaningTh: '5,000 เยน', isCorrect: false },
      { textRomaji: 'Gojū-man-en desu.', textKana: 'ごじゅうまん えん です。', meaningTh: '500,000 เยน', isCorrect: false },
    ],
    visualType: 'price',
    visualData: { item: 'โทรทัศน์ (terebi)', price: 50000, currency: '¥' },
    explanationTh: '50,000 เยนคือ 5 หมื่น ออกเสียงว่า "Go-man-en desu." (ごまんえんです)',
  },
];

// Pattern 5: Time Intervals (Shigoto wa nanji kara nanji made desuka?)
export const exam2ScheduleQuestions: Exam2QuestionItem[] = [
  {
    id: 'e2_p5_01',
    patternId: 5,
    patternTitle: '5. ช่วงเวลาทำงาน / การประชุม (Time Intervals)',
    promptRomaji: 'Shigoto wa nanji kara nanji made desuka?',
    promptJp: 'しごと は なんじ から なんじ まで ですか。',
    promptTh: 'อาจารย์ถามว่างานเริ่มกี่โมงถึงกี่โมง (9.00 - 17.00 น.)',
    targetAnswerRomaji: 'Gozen ku-ji kara gogo go-ji made desu.',
    targetAnswerKana: 'ごぜん くじ から ごご ごじ まで です。',
    meaningTh: 'ตั้งแต่ 9 โมงเช้า ถึง 5 โมงเย็นครับ (Gozen ku-ji kara gogo go-ji made desu.)',
    options: [
      { textRomaji: 'Gozen ku-ji kara gogo go-ji made desu.', textKana: 'ごぜん くじ から ごご ごじ まで です。', meaningTh: '9 โมงเช้า ถึง 5 โมงเย็น (ถูกต้องตามสไลด์ข้อสอบ)', isCorrect: true },
      { textRomaji: 'Gozen kyū-ji kara gogo go-ji made desu.', textKana: 'ごぜん きゅうじ から ごご ごじ まで です。', meaningTh: 'kyū-ji (ผิด 9 โมงต้อง ku-ji)', isCorrect: false },
      { textRomaji: 'Gogo go-ji kara gozen ku-ji made desu.', textKana: 'ごご ごじ から ごぜん くじ まで です。', meaningTh: 'สลับเวลาเริ่มต้นกับสิ้นสุด', isCorrect: false },
      { textRomaji: 'Ku-ji kara go-ji made desu.', textKana: 'くじ から ごじ まで です。', meaningTh: 'ขาด gozen และ gogo', isCorrect: false },
    ],
    visualType: 'schedule',
    visualData: { activity: 'shigoto (งาน)', activityTh: 'งาน (Shigoto)', startTime: '9.00', endTime: '17.00', timeRangeDisplay: '9.00 – 17.00 น.', startJp: 'gozen ku-ji', endJp: 'gogo go-ji' },
    explanationTh: '⭐ สไลด์ข้อสอบจริงหน้า 9: 9.00 – 17.00 น. ตอบ "Gozen ku-ji kara gogo go-ji made desu." (9 โมงเช้า = gozen ku-ji, 5 โมงเย็น = gogo go-ji)',
  },
  {
    id: 'e2_p5_02',
    patternId: 5,
    patternTitle: '5. ช่วงเวลาทำงาน / การประชุม (Time Intervals)',
    promptRomaji: 'Shigoto wa nanji kara nanji made desuka?',
    promptJp: 'しごと は なんじ から なんじ まで ですか。',
    promptTh: 'อาจารย์ถามว่างานเริ่มกี่โมงถึงกี่โมง (10.00 - 15.00 น.)',
    targetAnswerRomaji: 'Gozen jū-ji kara gogo san-ji made desu.',
    targetAnswerKana: 'ごぜん じゅうじ から ごご さんじ まで です。',
    meaningTh: 'ตั้งแต่ 10 โมงเช้า ถึง บ่าย 3 โมงครับ (Gozen jū-ji kara gogo san-ji made desu.)',
    options: [
      { textRomaji: 'Gozen jū-ji kara gogo san-ji made desu.', textKana: 'ごぜん じゅうじ から ごご さんじ まで です。', meaningTh: '10 โมงเช้า ถึง บ่าย 3 โมง (ถูกต้องตามสไลด์ข้อสอบ)', isCorrect: true },
      { textRomaji: 'Gogo san-ji kara gozen jū-ji made desu.', textKana: 'ごご さんじ から ごぜん じゅうじ まで です。', meaningTh: 'สลับเวลาเริ่มต้นกับสิ้นสุด', isCorrect: false },
      { textRomaji: 'Gozen jū-ji to gogo san-ji desu.', textKana: 'ごぜん じゅうじ と ごご さんじ です。', meaningTh: 'ใช้ to แทน kara/made', isCorrect: false },
      { textRomaji: 'Gogo jū-ji kara gogo san-ji made desu.', textKana: 'ごご じゅうじ から ごご さんじ まで です。', meaningTh: 'ผิด 10.00 น. ต้องเป็น gozen', isCorrect: false },
    ],
    visualType: 'schedule',
    visualData: { activity: 'shigoto (งาน)', activityTh: 'งาน (Shigoto)', startTime: '10.00', endTime: '15.00', timeRangeDisplay: '10.00 – 15.00 น.', startJp: 'gozen jū-ji', endJp: 'gogo san-ji' },
    explanationTh: '⭐ สไลด์ข้อสอบจริงหน้า 9: 10.00 – 15.00 น. ตอบ "Gozen jū-ji kara gogo san-ji made desu."',
  },
  {
    id: 'e2_p5_03',
    patternId: 5,
    patternTitle: '5. ช่วงเวลาทำงาน / การประชุม (Time Intervals)',
    promptRomaji: 'Kaigi wa nanji kara nanji made desuka?',
    promptJp: 'かいぎ は なんじ から なんじ まで ですか。',
    promptTh: 'อาจารย์ถามว่าการประชุมเริ่มกี่โมงถึงกี่โมง (13.00 - 15.30 น.)',
    targetAnswerRomaji: 'Gogo ichi-ji kara gogo san-ji han made desu.',
    targetAnswerKana: 'ごご いちじ から ごご さんじ はん まで です。',
    meaningTh: 'ตั้งแต่บ่าย 1 โมง ถึง บ่าย 3 โมงครึ่งครับ',
    options: [
      { textRomaji: 'Gogo ichi-ji kara gogo san-ji han made desu.', textKana: 'ごご いちじ から ごご さんじ はん まで です。', meaningTh: 'บ่าย 1 โมง ถึง บ่าย 3 โมงครึ่ง ถูกต้อง', isCorrect: true },
      { textRomaji: 'Gozen ichi-ji kara gogo san-ji han made desu.', textKana: 'ごぜん いちじ から ごご さんじ はん まで です。', meaningTh: 'gozen (ผิด 13.00 น. คือช่วงบ่าย gogo)', isCorrect: false },
      { textRomaji: 'Gogo ichi-ji made gogo san-ji han kara desu.', textKana: 'ごご いちじ まで ごご さんじ はん から です。', meaningTh: 'สลับคำช่วย kara กับ made', isCorrect: false },
      { textRomaji: 'Jūsan-ji kara jūgo-ji han made desu.', textKana: 'じゅうさんじ から じゅうごじ はん まで です。', meaningTh: 'ภาษาพูดนิยมใช้ระบบ 12 ชม.', isCorrect: false },
    ],
    visualType: 'schedule',
    visualData: { activity: 'kaigi (การประชุม)', activityTh: 'การประชุม (Kaigi)', startTime: '13.00', endTime: '15.30', timeRangeDisplay: '13.00 – 15.30 น.', startJp: 'gogo ichi-ji', endJp: 'gogo san-ji han' },
    explanationTh: '13.00 - 15.30 น. ช่วงบ่าย = "Gogo ichi-ji kara gogo san-ji han made desu."',
  },
  {
    id: 'e2_p5_04',
    patternId: 5,
    patternTitle: '5. ช่วงเวลาทำงาน / การประชุม (Time Intervals)',
    promptRomaji: 'Hiruyasumi wa nanji kara nanji made desuka?',
    promptJp: 'ひるやすみ は なんじ から なんじ まで ですか。',
    promptTh: 'อาจารย์ถามเวลาพักกลางวัน (12.00 - 13.00 น.)',
    targetAnswerRomaji: 'Jūni-ji kara gogo ichi-ji made desu.',
    targetAnswerKana: 'じゅうにじ から ごご いちじ まで です。',
    meaningTh: 'ตั้งแต่เที่ยง 12:00 ถึง บ่าย 1:00 ครับ',
    options: [
      { textRomaji: 'Jūni-ji kara gogo ichi-ji made desu.', textKana: 'じゅうにじ から ごご いちじ まで です。', meaningTh: 'เที่ยง ถึง บ่ายโมง ถูกต้อง', isCorrect: true },
      { textRomaji: 'Jūni-ji kara gogo ni-ji made desu.', textKana: 'じゅうにじ から ごご にじ まで です。', meaningTh: 'ถึงบ่าย 2 โมง (ผิดเวลา)', isCorrect: false },
      { textRomaji: 'Jūni-ji to gogo ichi-ji desu.', textKana: 'じゅうにじ と ごご いちじ です。', meaningTh: 'ขาด kara / made', isCorrect: false },
      { textRomaji: 'Gogo ichi-ji kara jūni-ji made desu.', textKana: 'ごご いちじ から じゅうにじ まで です。', meaningTh: 'สลับเวลา', isCorrect: false },
    ],
    visualType: 'schedule',
    visualData: { activity: 'hiruyasumi (พักกลางวัน)', activityTh: 'พักกลางวัน (Hiruyasumi)', startTime: '12.00', endTime: '13.00', timeRangeDisplay: '12.00 – 13.00 น.', startJp: 'jūni-ji', endJp: 'gogo ichi-ji' },
    explanationTh: 'พักกลางวัน 12:00 ถึง 13:00 ตอบ "Jūni-ji kara gogo ichi-ji made desu."',
  },
];

// Master pool combining all questions
export const allExam2QuestionsPool: Exam2QuestionItem[] = [
  ...exam2LocationQuestions,
  ...exam2ClockQuestions,
  ...exam2PhoneQuestions,
  ...exam2PriceQuestions,
  ...exam2ScheduleQuestions,
];
