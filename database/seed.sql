-- Seed Data for Nihongo Quest Exam Trainer
-- Chapters 1 & 2 Complete Vocabulary & Question Bank (JN60101)

-- Insert Chapters
INSERT INTO chapters (id, chapter_number, title_th, title_jp, description) VALUES
('c1000000-0000-0000-0000-000000000001', 1, 'บทที่ 1 การแนะนำตนเอง', '第1課 自己紹介', 'การแนะนำตนเอง คำสรรพนาม อาชีพ สัญชาติ และไวยากรณ์พื้นฐาน N1 wa N2 desu'),
('c2000000-0000-0000-0000-000000000002', 2, 'บทที่ 2 การแลกนามบัตร', '第2課 名刺交換', 'การแลกนามบัตร คำชี้บ่งสิ่งของ kore/sore/are, kono/sono/ano, ตัวเลข, คำทับศัพท์ Katakana')
ON CONFLICT (chapter_number) DO NOTHING;

-- Insert Chapter 1 Vocabularies
INSERT INTO vocabularies (chapter_id, category, word_romaji, word_kana, word_kanji, meaning_th, example_jp, example_th, textbook_ref) VALUES
('c1000000-0000-0000-0000-000000000001', 'pronoun', 'watashi', 'わたし', '私', 'ฉัน / ตัวฉัน', 'Watashi wa Poom desu.', 'ฉันชื่อภูมิครับ', 'JN60101 Ch.1 p.5'),
('c1000000-0000-0000-0000-000000000001', 'pronoun', 'anata', 'あなた', '貴方', 'คุณ / ท่าน', 'Anata wa sensei desu.', 'คุณคืออาจารย์ครับ', 'JN60101 Ch.1 p.6'),
('c1000000-0000-0000-0000-000000000001', 'pronoun', 'anohito', 'あのひと', 'あの人', 'คนนั้น / เขาคนนั้น', 'Anohito wa dare desuka?', 'คนนั้นคือใครครับ?', 'JN60101 Ch.1 p.7'),
('c1000000-0000-0000-0000-000000000001', 'pronoun', 'donata', 'どなた', NULL, 'ท่านไหน (สุภาพกว่า dare)', 'Anohito wa donata desuka?', 'คนนั้นคือท่านใดครับ?', 'JN60101 Ch.1 p.75'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'sensei', 'せんせい', '先生', 'อาจารย์ / คุณครู', 'Anata wa sensei desu.', 'คุณคืออาจารย์', 'JN60101 Ch.1 p.8'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'gakusei', 'がくせい', '学生', 'นักเรียน / นักศึกษา', 'Watashi wa gakusei desu.', 'ฉันคือนักศึกษา', 'JN60101 Ch.1 p.9'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'kaishain', 'かいしゃいん', '会社員', 'พนักงานบริษัท', 'Yamada-san wa kaishain desu.', 'คุณยามาดะเป็นพนักงานบริษัท', 'JN60101 Ch.1 p.10'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'ginkōin', 'ぎんこういん', '銀行員', 'พนักงานธนาคาร', 'Anohito wa ginkōin desu.', 'คนนั้นคือพนักงานธนาคาร', 'JN60101 Ch.1 p.11'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'isha', 'いしゃ', '医者', 'แพทย์ / หมอ', 'Anohito wa isha desu.', 'คนนั้นคือคุณหมอ', 'JN60101 Ch.1 p.12'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'kenkyūsha', 'けんきゅうしゃ', '研究者', 'นักวิจัย', 'Sumisu-san wa kenkyūsha desu.', 'คุณสมิธเป็นนักวิจัย', 'JN60101 Ch.1 p.13'),
('c1000000-0000-0000-0000-000000000001', 'occupation', 'bengoshi', 'べんごし', '弁護士', 'ทนายความ', 'Sumisu-san wa bengoshi desu.', 'คุณสมิธเป็นทนายความ', 'JN60101 Ch.1 p.91'),
('c1000000-0000-0000-0000-000000000001', 'place', 'daigaku', 'だいがく', '大学', 'มหาวิทยาลัย', 'Panyapiwatto Keiei Daigaku', 'สถาบันการจัดการปัญญาภิวัฒน์', 'JN60101 Ch.1 p.71'),
('c1000000-0000-0000-0000-000000000001', 'place', 'byōin', 'びょういん', '病院', 'โรงพยาบาล', 'Kochira wa byōin desu.', 'ที่นี่คือโรงพยาบาล', 'JN60101 Ch.1 p.72'),
('c1000000-0000-0000-0000-000000000001', 'place', 'uketsuke', 'うけつけ', '受付', 'แผนกต้อนรับ / ประชาสัมพันธ์', 'Kochira wa uketsuke desu.', 'ที่นี่คือแผนกต้อนรับ', 'JN60101 Ch.1 p.73'),
('c1000000-0000-0000-0000-000000000001', 'country', 'Tai', 'タイ', NULL, 'ประเทศไทย', 'Anohito wa Tai kara kimashita.', 'คนนั้นมาจากประเทศไทย', 'JN60101 Ch.1 p.15'),
('c1000000-0000-0000-0000-000000000001', 'country', 'Nihon', 'にほん', '日本', 'ประเทศญี่ปุ่น', 'Anohito wa Nihon kara kimashita.', 'คนนั้นมาจากประเทศญี่ปุ่น', 'JN60101 Ch.1 p.16'),
('c1000000-0000-0000-0000-000000000001', 'country', 'Amerika', 'アメリカ', NULL, 'ประเทศสหรัฐอเมริกา', 'Anohito wa Amerika kara kimashita.', 'คนนั้นมาจากประเทศอเมริกา', 'JN60101 Ch.1 p.17'),
('c1000000-0000-0000-0000-000000000001', 'country', 'Chūgoku', 'ちゅうごく', '中国', 'ประเทศจีน', 'Anohito wa Chūgoku kara kimashita.', 'คนนั้นมาจากประเทศจีน', 'JN60101 Ch.1 p.18'),
('c1000000-0000-0000-0000-000000000001', 'hobby', 'manga', 'まんが', '漫画', 'การ์ตูน / มังงะ', 'Shumi wa manga desu.', 'งานอดิเรกคือการอ่านมังงะ', 'JN60101 Ch.1 p.105'),
('c1000000-0000-0000-0000-000000000001', 'hobby', 'dokusho', 'どくしょ', '読書', 'การอ่านหนังสือ', 'Shumi wa dokusho desu.', 'งานอดิเรกคือการอ่านหนังสือ', 'JN60101 Ch.1 p.105'),
('c1000000-0000-0000-0000-000000000001', 'hobby', 'eiga', 'えいが', '映画', 'ภาพยนตร์ / ดูหนัง', 'Shumi wa eiga desu.', 'งานอดิเรกคือการดูภาพยนตร์', 'JN60101 Ch.1 p.105'),
('c1000000-0000-0000-0000-000000000001', 'phrase', 'Hajimemashite', 'はじめまして', NULL, 'ยินดีที่ได้รู้จัก (ใช้ตอนเริ่มแรก)', 'Hajimemashite.', 'ยินดีที่ได้รู้จักครับ', 'JN60101 Ch.1 p.83'),
('c1000000-0000-0000-0000-000000000001', 'phrase', 'Dōzo yoroshiku onegai itashimasu', 'どうぞよろしくおねがいいたします', NULL, 'ขอฝากเนื้อฝากตัวด้วยครับ (สุภาพ)', 'Dōzo yoroshiku onegai itashimasu.', 'ขอฝากเนื้อฝากตัวด้วยครับ', 'JN60101 Ch.1 p.84');

-- Insert Chapter 2 Vocabularies
INSERT INTO vocabularies (chapter_id, category, word_romaji, word_kana, word_kanji, meaning_th, example_jp, example_th, textbook_ref) VALUES
('c2000000-0000-0000-0000-000000000002', 'demonstrative', 'kore', 'これ', NULL, 'นี่ / สิ่งนี้ (ใกล้ตัวผู้พูด)', 'Kore wa nan desuka?', 'นี่คืออะไร?', 'JN60101 Ch.2 p.3'),
('c2000000-0000-0000-0000-000000000002', 'demonstrative', 'sore', 'それ', NULL, 'นั่น / สิ่งนั้น (ใกล้ตัวผู้ฟัง)', 'Sore wa hon desu.', 'นั่นคือหนังสือ', 'JN60101 Ch.2 p.3'),
('c2000000-0000-0000-0000-000000000002', 'demonstrative', 'are', 'あれ', NULL, 'โน่น / สิ่งโน้น (ไกลทั้งคู่)', 'Are wa shinbun desuka?', 'โน่นคือหนังสือพิมพ์ใช่ไหม?', 'JN60101 Ch.2 p.3'),
('c2000000-0000-0000-0000-000000000002', 'object', 'hon', 'ほん', '本', 'หนังสือ', 'Kore wa hon desu.', 'นี่คือหนังสือ', 'JN60101 Ch.2 p.10'),
('c2000000-0000-0000-0000-000000000002', 'object', 'jisho', 'じしょ', '辞書', 'พจนานุกรม', 'Kore wa jisho desu.', 'นี่คือพจนานุกรม', 'JN60101 Ch.2 p.11'),
('c2000000-0000-0000-0000-000000000002', 'object', 'zasshi', 'ざっし', '雑誌', 'นิตยสาร', 'Kore wa nihongo no zasshi desu.', 'นี่คือนิตยสารภาษาญี่ปุ่น', 'JN60101 Ch.2 p.12'),
('c2000000-0000-0000-0000-000000000002', 'object', 'shinbun', 'しんぶん', '新聞', 'หนังสือพิมพ์', 'Sore wa shinbun desu.', 'นั่นคือหนังสือพิมพ์', 'JN60101 Ch.2 p.13'),
('c2000000-0000-0000-0000-000000000002', 'object', 'techō', 'てちょう', '手帳', 'สมุดบันทึกพกพา', 'Kore wa techō desu.', 'นี่คือสมุดบันทึกพกพา', 'JN60101 Ch.2 p.14'),
('c2000000-0000-0000-0000-000000000002', 'object', 'enpitsu', 'えんぴつ', '鉛筆', 'ดินสอ', 'Kore wa enpitsu desu.', 'นี่คือดินสอ', 'JN60101 Ch.2 p.16'),
('c2000000-0000-0000-0000-000000000002', 'object', 'kagi', 'かぎ', '鍵', 'กุญแจ', 'Kore wa kagi desu.', 'นี่คือกุญแจ', 'JN60101 Ch.2 p.17'),
('c2000000-0000-0000-0000-000000000002', 'object', 'tokei', 'とけい', '時計', 'นาฬิกา', 'Kore wa tokei desu.', 'นี่คือนาฬิกา', 'JN60101 Ch.2 p.18'),
('c2000000-0000-0000-0000-000000000002', 'object', 'keitai', 'けいたい', '携帯', 'โทรศัพท์มือถือ', 'Kore wa keitai desu.', 'นี่คือโทรศัพท์มือถือ', 'JN60101 Ch.2 p.19'),
('c2000000-0000-0000-0000-000000000002', 'object', 'kasa', 'かさ', '傘', 'ร่ม', 'Kore wa Sasaki-san no kasa desu.', 'นี่คือร่มของคุณซาซากิ', 'JN60101 Ch.2 p.20'),
('c2000000-0000-0000-0000-000000000002', 'object', 'kaban', 'かばん', '鞄', 'กระเป๋า', 'Kore wa kaban desu.', 'นี่คือกระเป๋า', 'JN60101 Ch.2 p.21'),
('c2000000-0000-0000-0000-000000000002', 'object', 'jidōsha', 'じどうしゃ', '自動車', 'รถยนต์', 'Kore wa jidōsha no hon desu.', 'นี่คือหนังสือเกี่ยวกับรถยนต์', 'JN60101 Ch.2 p.22'),
('c2000000-0000-0000-0000-000000000002', 'object', 'tsukue', 'つくえ', '机', 'โต๊ะ', 'Kore wa tsukue desu.', 'นี่คือโต๊ะ', 'JN60101 Ch.2 p.23'),
('c2000000-0000-0000-0000-000000000002', 'object', 'isu', 'いす', '椅子', 'เก้าอี้', 'Kore wa isu desu.', 'นี่คือเก้าอี้', 'JN60101 Ch.2 p.24'),
('c2000000-0000-0000-0000-000000000002', 'object', 'meishi', 'めいし', '名刺', 'นามบัตร', 'Kore wa meishi desu.', 'นี่คือนามบัตร', 'JN60101 Ch.2 p.57'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Nōto', 'ノート', NULL, 'สมุดจด', 'Kore wa nōto desu.', 'นี่คือสมุดจด', 'JN60101 Ch.2 p.44'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Kādo', 'カード', NULL, 'การ์ด / บัตร', 'Kore wa kādo desu.', 'นี่คือบัตร', 'JN60101 Ch.2 p.45'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Bōru pen', 'ボールペン', NULL, 'ปากกาลูกลื่น', 'Kore wa bōru pen desu.', 'นี่คือปากกาลูกลื่น', 'JN60101 Ch.2 p.47'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Shāpu penshiru', 'シャープペンシル', NULL, 'ดินสอกด', 'Kore wa shāpu penshiru desu.', 'นี่คือดินสอกด', 'JN60101 Ch.2 p.48'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Terebi', 'テレビ', NULL, 'โทรทัศน์ / ทีวี', 'Kore wa terebi desu.', 'นี่คือโทรทัศน์', 'JN60101 Ch.2 p.49'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Rajio', 'ラジオ', NULL, 'วิทยุ', 'Kore wa rajio desu.', 'นี่คือวิทยุ', 'JN60101 Ch.2 p.50'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Kamera', 'カメラ', NULL, 'กล้องถ่ายรูป', 'Kore wa kamera desu.', 'นี่คือกล้องถ่ายรูป', 'JN60101 Ch.2 p.51'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Konpyūtā', 'コンピューター', NULL, 'คอมพิวเตอร์', 'Kore wa konpyūtā desu.', 'นี่คือคอมพิวเตอร์', 'JN60101 Ch.2 p.52'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Chokorēto', 'チョコレート', NULL, 'ช็อกโกแลต', 'Kore wa chokorēto desu.', 'นี่คือช็อกโกแลต', 'JN60101 Ch.2 p.53'),
('c2000000-0000-0000-0000-000000000002', 'katakana', 'Kōhī', 'コーヒー', NULL, 'กาแฟ', 'Kore wa kōhī desu.', 'นี่คือกาแฟ', 'JN60101 Ch.2 p.54'),
('c2000000-0000-0000-0000-000000000002', 'phrase', 'Kore kara o-sewa ni narimasu', 'これからおせわになります', NULL, 'จากนี้ไปขอความกรุณาด้วยครับ', 'Kore kara o-sewa ni narimasu.', 'จากนี้ไปขอความกรุณาด้วยครับ', 'JN60101 Ch.2 p.39'),
('c2000000-0000-0000-0000-000000000002', 'phrase', 'Dōzo', 'どうぞ', NULL, 'เชิญ / นี่ครับ', 'Dōzo.', 'เชิญครับ / นี่ครับ', 'JN60101 Ch.2 p.40');

-- Insert Exact Exam Questions (All 3 Sections)
-- Section 1: Self-Introduction Lines
INSERT INTO exam_questions (chapter_id, section_number, question_type, prompt_text_th, prompt_text_jp, teacher_question, target_answer_pattern, expected_answer_romaji, expected_answer_kana, image_asset_path, textbook_ref, hint_th) VALUES
('c1000000-0000-0000-0000-000000000001', 1, 'jiko_shokai', 'ท่อนที่ 1: คำกล่าวทักทายเริ่มต้นแนะนำตัว', '1. はじめの挨拶', 'Jiko shōkai o dōzo', 'Hajimemashite', 'Hajimemashite', 'はじめまして', NULL, 'JN60101 Ch.1 p.105', 'ยินดีที่ได้รู้จักครับ'),
('c1000000-0000-0000-0000-000000000001', 1, 'jiko_shokai', 'ท่อนที่ 2: บอกชื่อตนเอง (Poom)', '2. 名前', 'O-namae wa?', 'Watashi wa [Name] desu', 'Watashi wa Poom desu', 'わたしはภูมิです', NULL, 'JN60101 Ch.1 p.105', 'ฉันชื่อภูมิครับ'),
('c1000000-0000-0000-0000-000000000001', 1, 'jiko_shokai', 'ท่อนที่ 3: บอกสังกัดสถาบันปัญญาภิวัฒน์', '3. 所属', 'Doko no gakusei desuka?', 'Panyapiwatto keiei daigaku no gakusei desu', 'Panyapiwatto keiei daigaku no gakusei desu', 'パンヤピワットけいえいだいがくのがくせいです', NULL, 'JN60101 Ch.1 p.105', 'เป็นนักศึกษาสถาบันการจัดการปัญญาภิวัฒน์ครับ'),
('c1000000-0000-0000-0000-000000000001', 1, 'jiko_shokai', 'ท่อนที่ 4: บอกงานอดิเรก (มังงะ / อ่านหนังสือ / ดูหนัง)', '4. 趣味', 'Shumi wa nan desuka?', 'Shumi wa [manga / dokusho / eiga] desu', 'Shumi wa manga desu', 'しゅみはまんがです', NULL, 'JN60101 Ch.1 p.105', 'งานอดิเรกคือมังงะครับ (เลือก manga / dokusho / eiga)'),
('c1000000-0000-0000-0000-000000000001', 1, 'jiko_shokai', 'ท่อนที่ 5: กล่าวจบการแนะนำตัว ฝากเนื้อฝากตัว', '5. 締めの挨拶', NULL, 'Dōzo yoroshiku onegai itashimasu', 'Dōzo yoroshiku onegai itashimasu', 'どうぞよろしくおねがいいたします', NULL, 'JN60101 Ch.1 p.105', 'ขอฝากเนื้อฝากตัวด้วยครับ');

-- Section 3: Exact 5 Picture Question Patterns
INSERT INTO exam_questions (chapter_id, section_number, question_type, prompt_text_th, prompt_text_jp, teacher_question, target_answer_pattern, expected_answer_romaji, expected_answer_kana, image_asset_path, textbook_ref, hint_th) VALUES
('c2000000-0000-0000-0000-000000000002', 3, 'visual_object', 'ข้อที่ 1 (สิ่งของ): ครูถามว่าสิ่งนี้คืออะไร?', 'これ は なん ですか？', 'Kore wa nan desuka?', 'Kore wa [Object] desu.', 'Kore wa isu desu.', 'これはいすです。', '/assets/images/chair.png', 'JN60101 Ch.2 p.24', 'ตอบ: Kore wa isu desu. (นี่คือเก้าอี้)'),
('c1000000-0000-0000-0000-000000000001', 3, 'visual_country', 'ข้อที่ 2 (4 ประเทศ): ครูถามว่าคนนั้นมาจากประเทศอะไร? (ญี่ปุ่น)', 'あのひと は どこ から きましたか？', 'Anohito wa doko kara kimashitaka?', 'Anohito wa [Country] kara kimashita.', 'Anohito wa Nihon kara kimashita.', 'あのひとはにほんからきました。', '/assets/images/flag_japan.png', 'JN60101 Ch.1 p.86', 'ตอบ: Anohito wa Nihon kara kimashita. (มาจากประเทศญี่ปุ่น)'),
('c1000000-0000-0000-0000-000000000001', 3, 'visual_occupation', 'ข้อที่ 3 (อาชีพ/บุคคล): ครูถามว่าคนนั้นคือใคร/ทำอาชีพอะไร? (พนักงานธนาคาร)', 'あのひと は だれ ですか？', 'Anohito wa dare desuka?', 'Anohito wa [Occupation] desu.', 'Anohito wa ginkōin desu.', 'あのひとはぎんこういんです。', '/assets/images/banker.png', 'JN60101 Ch.1 p.11', 'ตอบ: Anohito wa ginkōin desu. (คนนั้นคือพนักงานธนาคาร)'),
('c2000000-0000-0000-0000-000000000002', 3, 'visual_magazine', 'ข้อที่ 4 (นิตยสาร): ครูถามว่านิตยสารนี้เกี่ยวกับอะไร? (ภาษาญี่ปุ่น)', 'これ は なん の ざっし ですか？', 'Kore wa nan no zasshi desuka?', 'Kore wa [Topic] no zasshi desu.', 'Kore wa nihongo no zasshi desu.', 'これはにほんごのざっしです。', '/assets/images/magazine_japanese.png', 'JN60101 Ch.2 p.78', 'ตอบ: Kore wa nihongo no zasshi desu. (นี่คือนิตยสารภาษาญี่ปุ่น)'),
('c1000000-0000-0000-0000-000000000001', 3, 'visual_location', 'ข้อที่ 5 (สถานที่/จุดบริการ): ครูถามว่าที่นี่คืออะไร? (แผนกต้อนรับ)', 'こちら は なん ですか？', 'Kochira wa nan desuka?', 'Kochira wa [Location] desu.', 'Kochira wa uketsuke desu.', 'こちらはうけつけです。', '/assets/images/reception.png', 'JN60101 Ch.1 p.73', 'ตอบ: Kochira wa uketsuke desu. (ที่นี่คือแผนกต้อนรับ/ประชาสัมพันธ์)');
