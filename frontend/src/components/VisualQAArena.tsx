import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Shuffle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { playJapaneseAudio } from '../utils/speech';

export interface VisualQuestionItem {
  id: string;
  typeId: 1 | 2 | 3 | 4 | 5;
  typeName: string;
  teacherQuestionRomaji: string;
  teacherQuestionKana: string;
  teacherQuestionTh: string;
  imageSrc: string;
  imageTitle: string;
  correctAnswerRomaji: string;
  correctAnswerKana: string;
  correctAnswerTh: string;
  templateFormat: string;
  textbookRef: string;
  options: { romaji: string; kana: string; isCorrect: boolean }[];
}

export const allSection3Pool: VisualQuestionItem[] = [
  // --- TYPE 1: OBJECTS & KATAKANA (Kore wa nan desuka?) ---
  {
    id: 'vq_obj_chair',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/chair.jpg',
    imageTitle: 'เก้าอี้ (Isu)',
    correctAnswerRomaji: 'Kore wa isu desu.',
    correctAnswerKana: 'これはいすです。',
    correctAnswerTh: 'นี่คือเก้าอี้ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.24',
    options: [
      { romaji: 'Kore wa isu desu.', kana: 'これはいすです。', isCorrect: true },
      { romaji: 'Kore wa tsukue desu.', kana: 'これはつくえです。', isCorrect: false },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
      { romaji: 'Kore wa kaban desu.', kana: 'これはかばんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_desk',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/desk.jpg',
    imageTitle: 'โต๊ะ (Tsukue)',
    correctAnswerRomaji: 'Kore wa tsukue desu.',
    correctAnswerKana: 'これはつくえです。',
    correctAnswerTh: 'นี่คือโต๊ะครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.23',
    options: [
      { romaji: 'Kore wa tsukue desu.', kana: 'これはつくえです。', isCorrect: true },
      { romaji: 'Kore wa isu desu.', kana: 'これはいすです。', isCorrect: false },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa kasa desu.', kana: 'これはかさです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_book',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/book.jpg',
    imageTitle: 'หนังสือ (Hon)',
    correctAnswerRomaji: 'Kore wa hon desu.',
    correctAnswerKana: 'これはほんです。',
    correctAnswerTh: 'นี่คือหนังสือครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.10',
    options: [
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: true },
      { romaji: 'Kore wa jisho desu.', kana: 'これはじしょです。', isCorrect: false },
      { romaji: 'Kore wa shinbun desu.', kana: 'これはしんぶんです。', isCorrect: false },
      { romaji: 'Kore wa techō desu.', kana: 'これはてちょうです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_dictionary',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/dictionary.jpg',
    imageTitle: 'พจนานุกรม (Jisho)',
    correctAnswerRomaji: 'Kore wa jisho desu.',
    correctAnswerKana: 'これはじしょです。',
    correctAnswerTh: 'นี่คือพจนานุกรมครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.11',
    options: [
      { romaji: 'Kore wa jisho desu.', kana: 'これはじしょです。', isCorrect: true },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
      { romaji: 'Kore wa nōto desu.', kana: 'これはノートです。', isCorrect: false },
      { romaji: 'Kore wa zasshi desu.', kana: 'これはざっしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_bag',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/bag.jpg',
    imageTitle: 'กระเป๋า (Kaban)',
    correctAnswerRomaji: 'Kore wa kaban desu.',
    correctAnswerKana: 'これはかばんです。',
    correctAnswerTh: 'นี่คือกระเป๋าครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.21',
    options: [
      { romaji: 'Kore wa kaban desu.', kana: 'これはかばんです。', isCorrect: true },
      { romaji: 'Kore wa kasa desu.', kana: 'これはかさです。', isCorrect: false },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa kagi desu.', kana: 'これはかぎです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_clock',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/clock.jpg',
    imageTitle: 'นาฬิกา (Tokei)',
    correctAnswerRomaji: 'Kore wa tokei desu.',
    correctAnswerKana: 'これはとけいです。',
    correctAnswerTh: 'นี่คือนาฬิกาครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.18',
    options: [
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: true },
      { romaji: 'Kore wa keitai desu.', kana: 'これはけいたいです。', isCorrect: false },
      { romaji: 'Kore wa kagi desu.', kana: 'これはかぎです。', isCorrect: false },
      { romaji: 'Kore wa enpitsu desu.', kana: 'これはえんぴつです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_umbrella',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/umbrella.jpg',
    imageTitle: 'ร่ม (Kasa)',
    correctAnswerRomaji: 'Kore wa kasa desu.',
    correctAnswerKana: 'これはかさです。',
    correctAnswerTh: 'นี่คือร่มครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.20',
    options: [
      { romaji: 'Kore wa kasa desu.', kana: 'これはかさです。', isCorrect: true },
      { romaji: 'Kore wa kaban desu.', kana: 'これはかばんです。', isCorrect: false },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa isu desu.', kana: 'これはいすです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_pen',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/ballpoint_pen.jpg',
    imageTitle: 'ปากกาลูกลื่น (Bōrupen)',
    correctAnswerRomaji: 'Kore wa bōrupen desu.',
    correctAnswerKana: 'これはボールペンです。',
    correctAnswerTh: 'นี่คือปากกาลูกลื่นครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.47',
    options: [
      { romaji: 'Kore wa bōrupen desu.', kana: 'これはボールペンです。', isCorrect: true },
      { romaji: 'Kore wa enpitsu desu.', kana: 'これはえんぴつです。', isCorrect: false },
      { romaji: 'Kore wa shāpu penshiru desu.', kana: 'これはシャープペンシルです。', isCorrect: false },
      { romaji: 'Kore wa nōto desu.', kana: 'これはノートです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_pencil',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/pencil.jpg',
    imageTitle: 'ดินสอ (Enpitsu)',
    correctAnswerRomaji: 'Kore wa enpitsu desu.',
    correctAnswerKana: 'これはえんぴつです。',
    correctAnswerTh: 'นี่คือดินสอครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.16',
    options: [
      { romaji: 'Kore wa enpitsu desu.', kana: 'これはえんぴつです。', isCorrect: true },
      { romaji: 'Kore wa bōrupen desu.', kana: 'これはボールペンです。', isCorrect: false },
      { romaji: 'Kore wa kagi desu.', kana: 'これはかぎです。', isCorrect: false },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_mech_pencil',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/mechanical_pencil.jpg',
    imageTitle: 'ดินสอกด (Shāpu penshiru)',
    correctAnswerRomaji: 'Kore wa shāpu penshiru desu.',
    correctAnswerKana: 'これはシャープペンシルです。',
    correctAnswerTh: 'นี่คือดินสอกดครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.48',
    options: [
      { romaji: 'Kore wa shāpu penshiru desu.', kana: 'これはシャープペンシルです。', isCorrect: true },
      { romaji: 'Kore wa enpitsu desu.', kana: 'これはえんぴつです。', isCorrect: false },
      { romaji: 'Kore wa bōrupen desu.', kana: 'これはボールペンです。', isCorrect: false },
      { romaji: 'Kore wa kagi desu.', kana: 'これはかぎです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_notebook',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/notebook.jpg',
    imageTitle: 'สมุดโน้ต (Nōto)',
    correctAnswerRomaji: 'Kore wa nōto desu.',
    correctAnswerKana: 'これはノートです。',
    correctAnswerTh: 'นี่คือสมุดโน้ตครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.44',
    options: [
      { romaji: 'Kore wa nōto desu.', kana: 'これはノートです。', isCorrect: true },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
      { romaji: 'Kore wa techō desu.', kana: 'これはてちょうです。', isCorrect: false },
      { romaji: 'Kore wa zasshi desu.', kana: 'これはざっしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_magazine',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/magazine.jpg',
    imageTitle: 'นิตยสาร (Zasshi)',
    correctAnswerRomaji: 'Kore wa zasshi desu.',
    correctAnswerKana: 'これはざっしです。',
    correctAnswerTh: 'นี่คือนิตยสารครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.12',
    options: [
      { romaji: 'Kore wa zasshi desu.', kana: 'これはざっしです。', isCorrect: true },
      { romaji: 'Kore wa shinbun desu.', kana: 'これはしんぶんです。', isCorrect: false },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
      { romaji: 'Kore wa jisho desu.', kana: 'これはじしょです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_newspaper',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/newspaper.jpg',
    imageTitle: 'หนังสือพิมพ์ (Shinbun)',
    correctAnswerRomaji: 'Kore wa shinbun desu.',
    correctAnswerKana: 'これはしんぶんです。',
    correctAnswerTh: 'นี่คือหนังสือพิมพ์ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.13',
    options: [
      { romaji: 'Kore wa shinbun desu.', kana: 'これはしんぶんです。', isCorrect: true },
      { romaji: 'Kore wa zasshi desu.', kana: 'これはざっしです。', isCorrect: false },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
      { romaji: 'Kore wa techō desu.', kana: 'これはてちょうです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_pocketbook',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/pocketbook.jpg',
    imageTitle: 'สมุดพก / สมุดบันทึก (Techō)',
    correctAnswerRomaji: 'Kore wa techō desu.',
    correctAnswerKana: 'これはてちょうです。',
    correctAnswerTh: 'นี่คือสมุดพกครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.14',
    options: [
      { romaji: 'Kore wa techō desu.', kana: 'これはてちょうです。', isCorrect: true },
      { romaji: 'Kore wa nōto desu.', kana: 'これはノートです。', isCorrect: false },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
      { romaji: 'Kore wa meishi desu.', kana: 'これはめいしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_meishi',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/meishi.jpg',
    imageTitle: 'นามบัตร (Meishi)',
    correctAnswerRomaji: 'Kore wa meishi desu.',
    correctAnswerKana: 'これはめいしです。',
    correctAnswerTh: 'นี่คือนามบัตรครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.15, 57',
    options: [
      { romaji: 'Kore wa meishi desu.', kana: 'これはめいしです。', isCorrect: true },
      { romaji: 'Kore wa kādo desu.', kana: 'これはカードです。', isCorrect: false },
      { romaji: 'Kore wa techō desu.', kana: 'これはてちょうです。', isCorrect: false },
      { romaji: 'Kore wa chizu desu.', kana: 'これはちずです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_card',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/card.jpg',
    imageTitle: 'การ์ด / บัตร (Kādo)',
    correctAnswerRomaji: 'Kore wa kādo desu.',
    correctAnswerKana: 'これはカードです。',
    correctAnswerTh: 'นี่คือการ์ด/บัตรครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.45',
    options: [
      { romaji: 'Kore wa kādo desu.', kana: 'これはカードです。', isCorrect: true },
      { romaji: 'Kore wa meishi desu.', kana: 'これはめいしです。', isCorrect: false },
      { romaji: 'Kore wa terehon kādo desu.', kana: 'これはテレホンカードです。', isCorrect: false },
      { romaji: 'Kore wa nōto desu.', kana: 'これはノートです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_tel_card',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/telephone_card.jpg',
    imageTitle: 'บัตรโทรศัพท์ (Terehon kādo)',
    correctAnswerRomaji: 'Kore wa terehon kādo desu.',
    correctAnswerKana: 'これはテレホンカードです。',
    correctAnswerTh: 'นี่คือบัตรโทรศัพท์ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.46',
    options: [
      { romaji: 'Kore wa terehon kādo desu.', kana: 'これはテレホンカードです。', isCorrect: true },
      { romaji: 'Kore wa kādo desu.', kana: 'これはカードです。', isCorrect: false },
      { romaji: 'Kore wa meishi desu.', kana: 'これはめいしです。', isCorrect: false },
      { romaji: 'Kore wa keitai desu.', kana: 'これはけいたいです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_key',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/key.jpg',
    imageTitle: 'กุญแจ (Kagi)',
    correctAnswerRomaji: 'Kore wa kagi desu.',
    correctAnswerKana: 'これはかぎです。',
    correctAnswerTh: 'นี่คือกุญแจครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.17',
    options: [
      { romaji: 'Kore wa kagi desu.', kana: 'これはかぎです。', isCorrect: true },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa kasa desu.', kana: 'これはかさです。', isCorrect: false },
      { romaji: 'Kore wa keitai desu.', kana: 'これはけいたいです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_phone',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/phone.jpg',
    imageTitle: 'โทรศัพท์มือถือ (Keitai)',
    correctAnswerRomaji: 'Kore wa keitai desu.',
    correctAnswerKana: 'これはけいたいです。',
    correctAnswerTh: 'นี่คือโทรศัพท์มือถือครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.19',
    options: [
      { romaji: 'Kore wa keitai desu.', kana: 'これはけいたいです。', isCorrect: true },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa rajio desu.', kana: 'これはラジオです。', isCorrect: false },
      { romaji: 'Kore wa kamera desu.', kana: 'これはカメラです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_tv',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/television.jpg',
    imageTitle: 'โทรทัศน์ / ทีวี (Terebi)',
    correctAnswerRomaji: 'Kore wa terebi desu.',
    correctAnswerKana: 'これはテレビです。',
    correctAnswerTh: 'นี่คือโทรทัศน์ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.49',
    options: [
      { romaji: 'Kore wa terebi desu.', kana: 'これはテレビです。', isCorrect: true },
      { romaji: 'Kore wa rajio desu.', kana: 'これはラジオです。', isCorrect: false },
      { romaji: 'Kore wa konpyūtā desu.', kana: 'これはコンピューターです。', isCorrect: false },
      { romaji: 'Kore wa kamera desu.', kana: 'これはカメラです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_radio',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/radio.jpg',
    imageTitle: 'วิทยุ (Rajio)',
    correctAnswerRomaji: 'Kore wa rajio desu.',
    correctAnswerKana: 'これはラジオです。',
    correctAnswerTh: 'นี่คือวิทยุครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.50',
    options: [
      { romaji: 'Kore wa rajio desu.', kana: 'これはラジオです。', isCorrect: true },
      { romaji: 'Kore wa terebi desu.', kana: 'これはテレビです。', isCorrect: false },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa keitai desu.', kana: 'これはけいたいです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_camera',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/camera.jpg',
    imageTitle: 'กล้องถ่ายรูป (Kamera)',
    correctAnswerRomaji: 'Kore wa kamera desu.',
    correctAnswerKana: 'これはカメラです。',
    correctAnswerTh: 'นี่คือกล้องถ่ายรูปครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.51',
    options: [
      { romaji: 'Kore wa kamera desu.', kana: 'これはカメラです。', isCorrect: true },
      { romaji: 'Kore wa keitai desu.', kana: 'これはけいたいです。', isCorrect: false },
      { romaji: 'Kore wa terebi desu.', kana: 'これはテレビです。', isCorrect: false },
      { romaji: 'Kore wa konpyūtā desu.', kana: 'これはコンピューターです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_computer',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/computer.jpg',
    imageTitle: 'คอมพิวเตอร์ (Konpyūtā)',
    correctAnswerRomaji: 'Kore wa konpyūtā desu.',
    correctAnswerKana: 'これはコンピューターです。',
    correctAnswerTh: 'นี่คือคอมพิวเตอร์ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.52',
    options: [
      { romaji: 'Kore wa konpyūtā desu.', kana: 'これはコンピューターです。', isCorrect: true },
      { romaji: 'Kore wa terebi desu.', kana: 'これはテレビです。', isCorrect: false },
      { romaji: 'Kore wa kamera desu.', kana: 'これはカメラです。', isCorrect: false },
      { romaji: 'Kore wa nōto desu.', kana: 'これはノートです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_chocolate',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/chocolate.jpg',
    imageTitle: 'ช็อกโกแลต (Chokorēto)',
    correctAnswerRomaji: 'Kore wa chokorēto desu.',
    correctAnswerKana: 'これはチョコレートです。',
    correctAnswerTh: 'นี่คือช็อกโกแลตครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.53',
    options: [
      { romaji: 'Kore wa chokorēto desu.', kana: 'これはチョコレートです。', isCorrect: true },
      { romaji: 'Kore wa kōhī desu.', kana: 'これはコーヒーです。', isCorrect: false },
      { romaji: 'Kore wa kādo desu.', kana: 'これはカードです。', isCorrect: false },
      { romaji: 'Kore wa hon desu.', kana: 'これはほんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_coffee',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/coffee.jpg',
    imageTitle: 'กาแฟ (Kōhī)',
    correctAnswerRomaji: 'Kore wa kōhī desu.',
    correctAnswerKana: 'これはコーヒーです。',
    correctAnswerTh: 'นี่คือกาแฟครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.54',
    options: [
      { romaji: 'Kore wa kōhī desu.', kana: 'これはコーヒーです。', isCorrect: true },
      { romaji: 'Kore wa chokorēto desu.', kana: 'これはチョコレートです。', isCorrect: false },
      { romaji: 'Kore wa kaban desu.', kana: 'これはかばんです。', isCorrect: false },
      { romaji: 'Kore wa kasa desu.', kana: 'これはかさです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_car',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/car.jpg',
    imageTitle: 'รถยนต์ (Jidōsha / Kuruma)',
    correctAnswerRomaji: 'Kore wa jidōsha desu.',
    correctAnswerKana: 'これはじどうしゃです。',
    correctAnswerTh: 'นี่คือรถยนต์ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.2 p.22',
    options: [
      { romaji: 'Kore wa jidōsha desu.', kana: 'これはじどうしゃです。', isCorrect: true },
      { romaji: 'Kore wa tokei desu.', kana: 'これはとけいです。', isCorrect: false },
      { romaji: 'Kore wa tsukue desu.', kana: 'これはつくえです。', isCorrect: false },
      { romaji: 'Kore wa kaban desu.', kana: 'これはかばんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_ao',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคือสีอะไรครับ?',
    imageSrc: '/assets/images/clean/ao.jpg',
    imageTitle: 'สีฟ้า / สีน้ำเงิน (Ao)',
    correctAnswerRomaji: 'Kore wa ao desu.',
    correctAnswerKana: 'これはあおです。',
    correctAnswerTh: 'นี่คือสีฟ้าครับ',
    templateFormat: 'Kore wa [สี] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa ao desu.', kana: 'これはあおです。', isCorrect: true },
      { romaji: 'Kore wa aka desu.', kana: 'これはあかです。', isCorrect: false },
      { romaji: 'Kore wa kuro desu.', kana: 'これはくろです。', isCorrect: false },
      { romaji: 'Kore wa shiro desu.', kana: 'これはしろです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_aka',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคือสีอะไรครับ?',
    imageSrc: '/assets/images/clean/aka.jpg',
    imageTitle: 'สีแดง (Aka)',
    correctAnswerRomaji: 'Kore wa aka desu.',
    correctAnswerKana: 'これはあかです。',
    correctAnswerTh: 'นี่คือสีแดงครับ',
    templateFormat: 'Kore wa [สี] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa aka desu.', kana: 'これはあかです。', isCorrect: true },
      { romaji: 'Kore wa ao desu.', kana: 'これはあおです。', isCorrect: false },
      { romaji: 'Kore wa kiiro desu.', kana: 'これはきいろです。', isCorrect: false },
      { romaji: 'Kore wa midori desu.', kana: 'これはみどりです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_sushi',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/sushi.jpg',
    imageTitle: 'ซูชิ (Sushi)',
    correctAnswerRomaji: 'Kore wa sushi desu.',
    correctAnswerKana: 'これはすしです。',
    correctAnswerTh: 'นี่คือซูชิครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa sushi desu.', kana: 'これはすしです。', isCorrect: true },
      { romaji: 'Kore wa tako desu.', kana: 'これはたこです。', isCorrect: false },
      { romaji: 'Kore wa ika desu.', kana: 'これはいかです。', isCorrect: false },
      { romaji: 'Kore wa pan desu.', kana: 'これはパンです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_ichi',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคือเลข/จำนวนอะไรครับ?',
    imageSrc: '/assets/images/clean/ichi.jpg',
    imageTitle: 'หนึ่ง (Ichi)',
    correctAnswerRomaji: 'Kore wa ichi desu.',
    correctAnswerKana: 'これはいちです。',
    correctAnswerTh: 'นี่คือเลขหนึ่งครับ',
    templateFormat: 'Kore wa [ตัวเลข] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa ichi desu.', kana: 'これはいちです。', isCorrect: true },
      { romaji: 'Kore wa ni desu.', kana: 'これはにです。', isCorrect: false },
      { romaji: 'Kore wa san desu.', kana: 'これはさんです。', isCorrect: false },
      { romaji: 'Kore wa yon desu.', kana: 'これはよんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_tako',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคือสัตว์/อาหารอะไรครับ?',
    imageSrc: '/assets/images/clean/tako.jpg',
    imageTitle: 'ปลาหมึกยักษ์ (Tako)',
    correctAnswerRomaji: 'Kore wa tako desu.',
    correctAnswerKana: 'これはたこです。',
    correctAnswerTh: 'นี่คือปลาหมึกยักษ์ครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa tako desu.', kana: 'これはたこです。', isCorrect: true },
      { romaji: 'Kore wa ika desu.', kana: 'これはいかです。', isCorrect: false },
      { romaji: 'Kore wa sushi desu.', kana: 'これはすしです。', isCorrect: false },
      { romaji: 'Kore wa kani desu.', kana: 'これはかにおです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_ike',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/ike.jpg',
    imageTitle: 'สระน้ำ / บึง (Ike)',
    correctAnswerRomaji: 'Kore wa ike desu.',
    correctAnswerKana: 'これはいけです。',
    correctAnswerTh: 'นี่คือสระน้ำครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa ike desu.', kana: 'これはいけです。', isCorrect: true },
      { romaji: 'Kore wa kawa desu.', kana: 'これはかわです。', isCorrect: false },
      { romaji: 'Kore wa umi desu.', kana: 'これはうみです。', isCorrect: false },
      { romaji: 'Kore wa yama desu.', kana: 'これはやまです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_kao',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออวัยวะส่วนใดครับ?',
    imageSrc: '/assets/images/clean/kao.jpg',
    imageTitle: 'ใบหน้า (Kao)',
    correctAnswerRomaji: 'Kore wa kao desu.',
    correctAnswerKana: 'これはかおです。',
    correctAnswerTh: 'นี่คือใบหน้าครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa kao desu.', kana: 'これはかおです。', isCorrect: true },
      { romaji: 'Kore wa me desu.', kana: 'これはめです。', isCorrect: false },
      { romaji: 'Kore wa te desu.', kana: 'これはてです。', isCorrect: false },
      { romaji: 'Kore wa mimi desu.', kana: 'これはみみです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_ika',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคือสัตว์/อาหารอะไรครับ?',
    imageSrc: '/assets/images/clean/ika.jpg',
    imageTitle: 'ปลาหมึกกล้วย (Ika)',
    correctAnswerRomaji: 'Kore wa ika desu.',
    correctAnswerKana: 'これはいかです。',
    correctAnswerTh: 'นี่คือปลาหมึกกล้วยครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.12',
    options: [
      { romaji: 'Kore wa ika desu.', kana: 'これはいかです。', isCorrect: true },
      { romaji: 'Kore wa tako desu.', kana: 'これはたこです。', isCorrect: false },
      { romaji: 'Kore wa sushi desu.', kana: 'これはすしです。', isCorrect: false },
      { romaji: 'Kore wa sakana desu.', kana: 'これはさかなです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_kage',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/kage.jpg',
    imageTitle: 'เงา (Kage)',
    correctAnswerRomaji: 'Kore wa kage desu.',
    correctAnswerKana: 'これはかげです。',
    correctAnswerTh: 'นี่คือเงาครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.14',
    options: [
      { romaji: 'Kore wa kage desu.', kana: 'これはかげです。', isCorrect: true },
      { romaji: 'Kore wa kao desu.', kana: 'これはかおです。', isCorrect: false },
      { romaji: 'Kore wa kasa desu.', kana: 'これはかさです。', isCorrect: false },
      { romaji: 'Kore wa kaze desu.', kana: 'これはかぜです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_obj_pan',
    typeId: 1,
    typeName: 'แบบที่ 1: ถามสิ่งของ (Objects)',
    teacherQuestionRomaji: 'Kore wa nan desuka?',
    teacherQuestionKana: 'これ は なん ですか？',
    teacherQuestionTh: 'นี่/นั่นคืออะไรครับ?',
    imageSrc: '/assets/images/clean/pan.jpg',
    imageTitle: 'ขนมปัง (Pan)',
    correctAnswerRomaji: 'Kore wa pan desu.',
    correctAnswerKana: 'これはパンです。',
    correctAnswerTh: 'นี่คือขนมปังครับ',
    templateFormat: 'Kore wa [สิ่งของ] desu.',
    textbookRef: 'JN60101 Ch.1 p.14',
    options: [
      { romaji: 'Kore wa pan desu.', kana: 'これはパンです。', isCorrect: true },
      { romaji: 'Kore wa sushi desu.', kana: 'これはすしです。', isCorrect: false },
      { romaji: 'Kore wa chokorēto desu.', kana: 'これはチョコレートです。', isCorrect: false },
      { romaji: 'Kore wa kōhī desu.', kana: 'これはコーヒーです。', isCorrect: false },
    ],
  },

  // --- TYPE 2: 4 COUNTRIES (Anohito wa doko kara kimashitaka?) ---
  {
    id: 'vq_country_usa',
    typeId: 2,
    typeName: 'แบบที่ 2: ถามประเทศ (4 ประเทศ)',
    teacherQuestionRomaji: 'Anohito wa doko kara kimashitaka?',
    teacherQuestionKana: 'あのひと は どこ から きましたか？',
    teacherQuestionTh: 'คนนั้นมาจากประเทศไหนครับ?',
    imageSrc: '/assets/images/clean/flag_usa.png',
    imageTitle: 'ประเทศสหรัฐอเมริกา (Amerika)',
    correctAnswerRomaji: 'Anohito wa Amerika kara kimashita.',
    correctAnswerKana: 'あのひとはアメリカからきました。',
    correctAnswerTh: 'คนนั้นมาจากประเทศอเมริกาครับ',
    templateFormat: 'Anohito wa [ประเทศ] kara kimashita.',
    textbookRef: 'JN60101 Ch.1 p.86-88',
    options: [
      { romaji: 'Anohito wa Amerika kara kimashita.', kana: 'あのひとはアメリカからきました。', isCorrect: true },
      { romaji: 'Anohito wa Nihon kara kimashita.', kana: 'あのひとはにほんからきました。', isCorrect: false },
      { romaji: 'Anohito wa Tai kara kimashita.', kana: 'あのひとはタイからきました。', isCorrect: false },
      { romaji: 'Anohito wa Chūgoku kara kimashita.', kana: 'あのひとはちゅうごくからきました。', isCorrect: false },
    ],
  },
  {
    id: 'vq_country_china',
    typeId: 2,
    typeName: 'แบบที่ 2: ถามประเทศ (4 ประเทศ)',
    teacherQuestionRomaji: 'Anohito wa doko kara kimashitaka?',
    teacherQuestionKana: 'あのひと は どこ から きましたか？',
    teacherQuestionTh: 'คนนั้นมาจากประเทศไหนครับ?',
    imageSrc: '/assets/images/clean/flag_china.png',
    imageTitle: 'ประเทศจีน (Chūgoku)',
    correctAnswerRomaji: 'Anohito wa Chūgoku kara kimashita.',
    correctAnswerKana: 'あのひとはちゅうごくからきました。',
    correctAnswerTh: 'คนนั้นมาจากประเทศจีนครับ',
    templateFormat: 'Anohito wa [ประเทศ] kara kimashita.',
    textbookRef: 'JN60101 Ch.1 p.86-88',
    options: [
      { romaji: 'Anohito wa Chūgoku kara kimashita.', kana: 'あのひとはちゅうごくからきました。', isCorrect: true },
      { romaji: 'Anohito wa Nihon kara kimashita.', kana: 'あのひとはにほんからきました。', isCorrect: false },
      { romaji: 'Anohito wa Amerika kara kimashita.', kana: 'あのひとはアメリカからきました。', isCorrect: false },
      { romaji: 'Anohito wa Tai kara kimashita.', kana: 'あのひとはタイからきました。', isCorrect: false },
    ],
  },
  {
    id: 'vq_country_japan',
    typeId: 2,
    typeName: 'แบบที่ 2: ถามประเทศ (4 ประเทศ)',
    teacherQuestionRomaji: 'Anohito wa doko kara kimashitaka?',
    teacherQuestionKana: 'あのひと は どこ から きましたか？',
    teacherQuestionTh: 'คนนั้นมาจากประเทศไหนครับ?',
    imageSrc: '/assets/images/clean/flag_japan.png',
    imageTitle: 'ประเทศญี่ปุ่น (Nihon)',
    correctAnswerRomaji: 'Anohito wa Nihon kara kimashita.',
    correctAnswerKana: 'あのひとはにほんからきました。',
    correctAnswerTh: 'คนนั้นมาจากประเทศญี่ปุ่นครับ',
    templateFormat: 'Anohito wa [ประเทศ] kara kimashita.',
    textbookRef: 'JN60101 Ch.1 p.86-88',
    options: [
      { romaji: 'Anohito wa Nihon kara kimashita.', kana: 'あのひとはにほんからきました。', isCorrect: true },
      { romaji: 'Anohito wa Tai kara kimashita.', kana: 'あのひとはタイからきました。', isCorrect: false },
      { romaji: 'Anohito wa Amerika kara kimashita.', kana: 'あのひとはアメリカからきました。', isCorrect: false },
      { romaji: 'Anohito wa Chūgoku kara kimashita.', kana: 'あのひとはちゅうごくからきました。', isCorrect: false },
    ],
  },
  {
    id: 'vq_country_thailand',
    typeId: 2,
    typeName: 'แบบที่ 2: ถามประเทศ (4 ประเทศ)',
    teacherQuestionRomaji: 'Anohito wa doko kara kimashitaka?',
    teacherQuestionKana: 'あのひと は どこ から きましたか？',
    teacherQuestionTh: 'คนนั้นมาจากประเทศไหนครับ?',
    imageSrc: '/assets/images/clean/flag_thailand.jpg',
    imageTitle: 'ประเทศไทย (Tai)',
    correctAnswerRomaji: 'Anohito wa Tai kara kimashita.',
    correctAnswerKana: 'あのひとはタイからきました。',
    correctAnswerTh: 'คนนั้นมาจากประเทศไทยครับ',
    templateFormat: 'Anohito wa [ประเทศ] kara kimashita.',
    textbookRef: 'JN60101 Ch.1 p.86-88',
    options: [
      { romaji: 'Anohito wa Tai kara kimashita.', kana: 'あのひとはタイからきました。', isCorrect: true },
      { romaji: 'Anohito wa Nihon kara kimashita.', kana: 'あのひとはにほんからきました。', isCorrect: false },
      { romaji: 'Anohito wa Amerika kara kimashita.', kana: 'あのひとはアメリカからきました。', isCorrect: false },
      { romaji: 'Anohito wa Chūgoku kara kimashita.', kana: 'あのひとはちゅうごくからきました。', isCorrect: false },
    ],
  },

  // --- TYPE 3: OCCUPATIONS (Anohito wa dare desuka?) ---
  {
    id: 'vq_occ_teacher',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/teacher.jpg',
    imageTitle: 'อาจารย์ (Sensei)',
    correctAnswerRomaji: 'Anohito wa sensei desu.',
    correctAnswerKana: 'あのひとはせんせいです。',
    correctAnswerTh: 'คนนั้นคืออาจารย์ครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.62',
    options: [
      { romaji: 'Anohito wa sensei desu.', kana: 'あのひとはせんせいです。', isCorrect: true },
      { romaji: 'Anohito wa gakusei desu.', kana: 'あのひとはがくせいです。', isCorrect: false },
      { romaji: 'Anohito wa isha desu.', kana: 'あのひとはいしゃです。', isCorrect: false },
      { romaji: 'Anohito wa ginkōin desu.', kana: 'あのひとはぎんこういんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_student',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/student.jpg',
    imageTitle: 'นักเรียน / นักศึกษา (Gakusei)',
    correctAnswerRomaji: 'Anohito wa gakusei desu.',
    correctAnswerKana: 'あのひとはがくせいです。',
    correctAnswerTh: 'คนนั้นคือนักศึกษาครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.63',
    options: [
      { romaji: 'Anohito wa gakusei desu.', kana: 'あのひとはがくせいです。', isCorrect: true },
      { romaji: 'Anohito wa sensei desu.', kana: 'あのひとはせんせいです。', isCorrect: false },
      { romaji: 'Anohito wa kaishain desu.', kana: 'あのひとはかいしゃいんです。', isCorrect: false },
      { romaji: 'Anohito wa enjinia desu.', kana: 'あのひとはエンジニアです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_doctor',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/doctor.jpg',
    imageTitle: 'แพทย์ / หมอ (Isha)',
    correctAnswerRomaji: 'Anohito wa isha desu.',
    correctAnswerKana: 'あのひとはいしゃです。',
    correctAnswerTh: 'คนนั้นคือคุณหมอครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.66',
    options: [
      { romaji: 'Anohito wa isha desu.', kana: 'あのひとはいしゃです。', isCorrect: true },
      { romaji: 'Anohito wa hisho desu.', kana: 'あのひとはひしょです。', isCorrect: false },
      { romaji: 'Anohito wa bengoshi desu.', kana: 'あのひとはべんごしです。', isCorrect: false },
      { romaji: 'Anohito wa sensei desu.', kana: 'あのひとはせんせいです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_engineer',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/engineer.jpg',
    imageTitle: 'วิศวกร (Enjinia)',
    correctAnswerRomaji: 'Anohito wa enjinia desu.',
    correctAnswerKana: 'あのひとはエンジニアです。',
    correctAnswerTh: 'คนนั้นคือวิศวกรครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.70',
    options: [
      { romaji: 'Anohito wa enjinia desu.', kana: 'あのひとはエンジニアです。', isCorrect: true },
      { romaji: 'Anohito wa kenkyūsha desu.', kana: 'あのひとはけんきゅうしゃです。', isCorrect: false },
      { romaji: 'Anohito wa kaishain desu.', kana: 'あのひとはかいしゃいんです。', isCorrect: false },
      { romaji: 'Anohito wa ginkōin desu.', kana: 'あのひとはぎんこういんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_company_employee',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/company_employee.jpg',
    imageTitle: 'พนักงานบริษัท (Kaishain)',
    correctAnswerRomaji: 'Anohito wa kaishain desu.',
    correctAnswerKana: 'あのひとはかいしゃいんです。',
    correctAnswerTh: 'คนนั้นคือพนักงานบริษัทครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.64',
    options: [
      { romaji: 'Anohito wa kaishain desu.', kana: 'あのひとはかいしゃいんです。', isCorrect: true },
      { romaji: 'Anohito wa ginkōin desu.', kana: 'あのひとはぎんこういんです。', isCorrect: false },
      { romaji: 'Anohito wa hisho desu.', kana: 'あのひとはひしょです。', isCorrect: false },
      { romaji: 'Anohito wa gakusei desu.', kana: 'あのひとはがくせいです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_researcher',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/researcher.jpg',
    imageTitle: 'นักวิจัย (Kenkyūsha)',
    correctAnswerRomaji: 'Anohito wa kenkyūsha desu.',
    correctAnswerKana: 'あのひとはけんきゅうしゃです。',
    correctAnswerTh: 'คนนั้นคือนักวิจัยครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.68',
    options: [
      { romaji: 'Anohito wa kenkyūsha desu.', kana: 'あのひとはけんきゅうしゃです。', isCorrect: true },
      { romaji: 'Anohito wa enjinia desu.', kana: 'あのひとはエンジニアです。', isCorrect: false },
      { romaji: 'Anohito wa isha desu.', kana: 'あのひとはいしゃです。', isCorrect: false },
      { romaji: 'Anohito wa sensei desu.', kana: 'あのひとはせんせいです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_banker',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/banker.jpg',
    imageTitle: 'พนักงานธนาคาร (Ginkōin)',
    correctAnswerRomaji: 'Anohito wa ginkōin desu.',
    correctAnswerKana: 'あのひとはぎんこういんです。',
    correctAnswerTh: 'คนนั้นคือพนักงานธนาคารครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.65',
    options: [
      { romaji: 'Anohito wa ginkōin desu.', kana: 'あのひとはぎんこういんです。', isCorrect: true },
      { romaji: 'Anohito wa kaishain desu.', kana: 'あのひとはかいしゃいんです。', isCorrect: false },
      { romaji: 'Anohito wa hisho desu.', kana: 'あのひとはひしょです。', isCorrect: false },
      { romaji: 'Anohito wa bengoshi desu.', kana: 'あのひとはべんごしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_lawyer',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/lawyer.jpg',
    imageTitle: 'ทนายความ (Bengoshi)',
    correctAnswerRomaji: 'Anohito wa bengoshi desu.',
    correctAnswerKana: 'あのひとはべんごしです。',
    correctAnswerTh: 'คนนั้นคือทนายความครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.69',
    options: [
      { romaji: 'Anohito wa bengoshi desu.', kana: 'あのひとはべんごしです。', isCorrect: true },
      { romaji: 'Anohito wa isha desu.', kana: 'あのひとはいしゃです。', isCorrect: false },
      { romaji: 'Anohito wa kenkyūsha desu.', kana: 'あのひとはけんきゅうしゃです。', isCorrect: false },
      { romaji: 'Anohito wa hisho desu.', kana: 'あのひとはひしょです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_occ_secretary',
    typeId: 3,
    typeName: 'แบบที่ 3: ถามอาชีพ / บุคคล (Occupations)',
    teacherQuestionRomaji: 'Anohito wa dare desuka?',
    teacherQuestionKana: 'あのひと は だれ ですか？',
    teacherQuestionTh: 'คนนั้นคือใครครับ?',
    imageSrc: '/assets/images/clean/secretary.jpg',
    imageTitle: 'เลขานุการ (Hisho)',
    correctAnswerRomaji: 'Anohito wa hisho desu.',
    correctAnswerKana: 'あのひとはひしょです。',
    correctAnswerTh: 'คนนั้นคือเลขานุการครับ',
    templateFormat: 'Anohito wa [อาชีพ] desu.',
    textbookRef: 'JN60101 Ch.1 p.67',
    options: [
      { romaji: 'Anohito wa hisho desu.', kana: 'あのひとはひしょです。', isCorrect: true },
      { romaji: 'Anohito wa kaishain desu.', kana: 'あのひとはかいしゃいんです。', isCorrect: false },
      { romaji: 'Anohito wa ginkōin desu.', kana: 'あのひとはぎんこういんです。', isCorrect: false },
      { romaji: 'Anohito wa sensei desu.', kana: 'あのひとはせんせいです。', isCorrect: false },
    ],
  },

  // --- TYPE 4: MAGAZINES (Nan no zasshi desuka?) ---
  {
    id: 'vq_mag_car',
    typeId: 4,
    typeName: 'แบบที่ 4: ถามเกี่ยวกับนิตยสาร (Magazines)',
    teacherQuestionRomaji: 'Kore wa nan no zasshi desuka?',
    teacherQuestionKana: 'これ は なん の ざっし ですか？',
    teacherQuestionTh: 'นี่คือนิตยสารเกี่ยวกับอะไรครับ?',
    imageSrc: '/assets/images/clean/magazine_car.jpg',
    imageTitle: 'นิตยสารรถยนต์ (Jidōsha no zasshi)',
    correctAnswerRomaji: 'Kore wa jidōsha no zasshi desu.',
    correctAnswerKana: 'これはじどうしゃのざっしです。',
    correctAnswerTh: 'นี่คือนิตยสารรถยนต์ครับ',
    templateFormat: 'Kore wa [หัวข้อ] no zasshi desu.',
    textbookRef: 'JN60101 Ch.2 p.76, 78',
    options: [
      { romaji: 'Kore wa jidōsha no zasshi desu.', kana: 'これはじどうしゃのざっしです。', isCorrect: true },
      { romaji: 'Kore wa nihongo no zasshi desu.', kana: 'これはにほんごのざっしです。', isCorrect: false },
      { romaji: 'Kore wa eigo no zasshi desu.', kana: 'これはえいごのざっしです。', isCorrect: false },
      { romaji: 'Kore wa konpyūtā no zasshi desu.', kana: 'これはコンピューターのざっしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_mag_japanese',
    typeId: 4,
    typeName: 'แบบที่ 4: ถามเกี่ยวกับนิตยสาร (Magazines)',
    teacherQuestionRomaji: 'Kore wa nan no zasshi desuka?',
    teacherQuestionKana: 'これ は なん の ざっし ですか？',
    teacherQuestionTh: 'นี่คือนิตยสารเกี่ยวกับอะไรครับ?',
    imageSrc: '/assets/images/clean/magazine_japanese.jpg',
    imageTitle: 'นิตยสารภาษาญี่ปุ่น (Nihongo no zasshi)',
    correctAnswerRomaji: 'Kore wa nihongo no zasshi desu.',
    correctAnswerKana: 'これはにほんごのざっしです。',
    correctAnswerTh: 'นี่คือนิตยสารภาษาญี่ปุ่นครับ',
    templateFormat: 'Kore wa [หัวข้อ] no zasshi desu.',
    textbookRef: 'JN60101 Ch.2 p.12, 28',
    options: [
      { romaji: 'Kore wa nihongo no zasshi desu.', kana: 'これはにほんごのざっしです。', isCorrect: true },
      { romaji: 'Kore wa eigo no zasshi desu.', kana: 'これはえいごのざっしです。', isCorrect: false },
      { romaji: 'Kore wa jidōsha no zasshi desu.', kana: 'これはじどうしゃのざっしです。', isCorrect: false },
      { romaji: 'Kore wa kamera no zasshi desu.', kana: 'これはカメラのざっしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_mag_english',
    typeId: 4,
    typeName: 'แบบที่ 4: ถามเกี่ยวกับนิตยสาร (Magazines)',
    teacherQuestionRomaji: 'Kore wa nan no zasshi desuka?',
    teacherQuestionKana: 'これ は なん の ざっし ですか？',
    teacherQuestionTh: 'นี่คือนิตยสารเกี่ยวกับอะไรครับ?',
    imageSrc: '/assets/images/clean/magazine_english.jpg',
    imageTitle: 'นิตยสารภาษาอังกฤษ (Eigo no zasshi)',
    correctAnswerRomaji: 'Kore wa eigo no zasshi desu.',
    correctAnswerKana: 'これはえいごのざっしです。',
    correctAnswerTh: 'นี่คือนิตยสารภาษาอังกฤษครับ',
    templateFormat: 'Kore wa [หัวข้อ] no zasshi desu.',
    textbookRef: 'JN60101 Ch.2 p.76',
    options: [
      { romaji: 'Kore wa eigo no zasshi desu.', kana: 'これはえいごのざっしです。', isCorrect: true },
      { romaji: 'Kore wa nihongo no zasshi desu.', kana: 'これはにほんごのざっしです。', isCorrect: false },
      { romaji: 'Kore wa jidōsha no zasshi desu.', kana: 'これはじどうしゃのざっしです。', isCorrect: false },
      { romaji: 'Kore wa konpyūtā no zasshi desu.', kana: 'これはコンピューターのざっしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_mag_camera',
    typeId: 4,
    typeName: 'แบบที่ 4: ถามเกี่ยวกับนิตยสาร (Magazines)',
    teacherQuestionRomaji: 'Kore wa nan no zasshi desuka?',
    teacherQuestionKana: 'これ は なん の ざっし ですか？',
    teacherQuestionTh: 'นี่คือนิตยสารเกี่ยวกับอะไรครับ?',
    imageSrc: '/assets/images/clean/camera.jpg',
    imageTitle: 'นิตยสารกล้อง (Kamera no zasshi)',
    correctAnswerRomaji: 'Kore wa kamera no zasshi desu.',
    correctAnswerKana: 'これはカメラのざっしです。',
    correctAnswerTh: 'นี่คือนิตยสารกล้องครับ',
    templateFormat: 'Kore wa [หัวข้อ] no zasshi desu.',
    textbookRef: 'JN60101 Ch.2 p.51, 78',
    options: [
      { romaji: 'Kore wa kamera no zasshi desu.', kana: 'これはカメラのざっしです。', isCorrect: true },
      { romaji: 'Kore wa jidōsha no zasshi desu.', kana: 'これはじどうしゃのざっしです。', isCorrect: false },
      { romaji: 'Kore wa eigo no zasshi desu.', kana: 'これはえいごのざっしです。', isCorrect: false },
      { romaji: 'Kore wa konpyūtā no zasshi desu.', kana: 'これはコンピューターのざっしです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_mag_computer',
    typeId: 4,
    typeName: 'แบบที่ 4: ถามเกี่ยวกับนิตยสาร (Magazines)',
    teacherQuestionRomaji: 'Kore wa nan no zasshi desuka?',
    teacherQuestionKana: 'これ は なん の ざっし ですか？',
    teacherQuestionTh: 'นี่คือนิตยสารเกี่ยวกับอะไรครับ?',
    imageSrc: '/assets/images/clean/computer.jpg',
    imageTitle: 'นิตยสารคอมพิวเตอร์ (Konpyūtā no zasshi)',
    correctAnswerRomaji: 'Kore wa konpyūtā no zasshi desu.',
    correctAnswerKana: 'これはコンピューターのざっしです。',
    correctAnswerTh: 'นี่คือนิตยสารคอมพิวเตอร์ครับ',
    templateFormat: 'Kore wa [หัวข้อ] no zasshi desu.',
    textbookRef: 'JN60101 Ch.2 p.52, 78',
    options: [
      { romaji: 'Kore wa konpyūtā no zasshi desu.', kana: 'これはコンピューターのざっしです。', isCorrect: true },
      { romaji: 'Kore wa jidōsha no zasshi desu.', kana: 'これはじどうしゃのざっしです。', isCorrect: false },
      { romaji: 'Kore wa eigo no zasshi desu.', kana: 'これはえいごのざっしです。', isCorrect: false },
      { romaji: 'Kore wa kamera no zasshi desu.', kana: 'これはカメラのざっしです。', isCorrect: false },
    ],
  },

  // --- TYPE 5: LOCATIONS & FACILITIES (Kochira wa nan desuka?) ---
  {
    id: 'vq_loc_hospital',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสถานที่ / จุดบริการ (Locations)',
    teacherQuestionRomaji: 'Kochira wa nan desuka?',
    teacherQuestionKana: 'こちら は なん ですか？',
    teacherQuestionTh: 'ที่นี่คืออะไรครับ?',
    imageSrc: '/assets/images/clean/hospital.jpg',
    imageTitle: 'โรงพยาบาล (Byōin)',
    correctAnswerRomaji: 'Kochira wa byōin desu.',
    correctAnswerKana: 'こちらはびょういんです。',
    correctAnswerTh: 'ที่นี่คือโรงพยาบาลครับ',
    templateFormat: 'Kochira wa [สถานที่] desu.',
    textbookRef: 'JN60101 Ch.1 p.72',
    options: [
      { romaji: 'Kochira wa byōin desu.', kana: 'こちらはびょういんです。', isCorrect: true },
      { romaji: 'Kochira wa daigaku desu.', kana: 'こちらはだいがくです。', isCorrect: false },
      { romaji: 'Kochira wa uketsuke desu.', kana: 'こちらはうけつけです。', isCorrect: false },
      { romaji: 'Kochira wa kaisha desu.', kana: 'こちらはかいしゃです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_loc_university',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสถานที่ / จุดบริการ (Locations)',
    teacherQuestionRomaji: 'Kochira wa nan desuka?',
    teacherQuestionKana: 'こちら は なん ですか？',
    teacherQuestionTh: 'ที่นี่คืออะไรครับ?',
    imageSrc: '/assets/images/clean/university.jpg',
    imageTitle: 'มหาวิทยาลัย (Daigaku)',
    correctAnswerRomaji: 'Kochira wa daigaku desu.',
    correctAnswerKana: 'こちらはだいがくです。',
    correctAnswerTh: 'ที่นี่คือมหาวิทยาลัยครับ',
    templateFormat: 'Kochira wa [สถานที่] desu.',
    textbookRef: 'JN60101 Ch.1 p.71',
    options: [
      { romaji: 'Kochira wa daigaku desu.', kana: 'こちらはだいがくです。', isCorrect: true },
      { romaji: 'Kochira wa byōin desu.', kana: 'こちらはびょういんです。', isCorrect: false },
      { romaji: 'Kochira wa uketsuke desu.', kana: 'こちらはうけつけです。', isCorrect: false },
      { romaji: 'Kochira wa kaisha desu.', kana: 'こちらはかいしゃです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_loc_reception',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสถานที่ / จุดบริการ (Locations)',
    teacherQuestionRomaji: 'Kochira wa nan desuka?',
    teacherQuestionKana: 'こちら は なん ですか？',
    teacherQuestionTh: 'ที่นี่คืออะไรครับ?',
    imageSrc: '/assets/images/clean/reception.jpg',
    imageTitle: 'แผนกต้อนรับ / ประชาสัมพันธ์ (Uketsuke)',
    correctAnswerRomaji: 'Kochira wa uketsuke desu.',
    correctAnswerKana: 'こちらはうけつけです。',
    correctAnswerTh: 'ที่นี่คือแผนกต้อนรับครับ',
    templateFormat: 'Kochira wa [สถานที่] desu.',
    textbookRef: 'JN60101 Ch.1 p.73',
    options: [
      { romaji: 'Kochira wa uketsuke desu.', kana: 'こちらはうけつけです。', isCorrect: true },
      { romaji: 'Kochira wa byōin desu.', kana: 'こちらはびょういんです。', isCorrect: false },
      { romaji: 'Kochira wa daigaku desu.', kana: 'こちらはだいがくです。', isCorrect: false },
      { romaji: 'Kochira wa kaisha desu.', kana: 'こちらはかいしゃです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_loc_company',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสถานที่ / จุดบริการ (Locations)',
    teacherQuestionRomaji: 'Kochira wa nan desuka?',
    teacherQuestionKana: 'こちら は なん ですか？',
    teacherQuestionTh: 'ที่นี่คืออะไรครับ?',
    imageSrc: '/assets/images/clean/company.jpg',
    imageTitle: 'บริษัท (Kaisha)',
    correctAnswerRomaji: 'Kochira wa kaisha desu.',
    correctAnswerKana: 'こちらはかいしゃです。',
    correctAnswerTh: 'ที่นี่คือบริษัทครับ',
    templateFormat: 'Kochira wa [สถานที่] desu.',
    textbookRef: 'JN60101 Ch.1 p.74, Ch.2 p.77',
    options: [
      { romaji: 'Kochira wa kaisha desu.', kana: 'こちらはかいしゃです。', isCorrect: true },
      { romaji: 'Kochira wa daigaku desu.', kana: 'こちらはだいがくです。', isCorrect: false },
      { romaji: 'Kochira wa byōin desu.', kana: 'こちらはびょういんです。', isCorrect: false },
      { romaji: 'Kochira wa uketsuke desu.', kana: 'こちらはうけつけです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_loc_abc_fuzu',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสถานที่ (Locations & Places)',
    teacherQuestionRomaji: 'Kochira wa doko desuka?',
    teacherQuestionKana: 'こちら は どこ ですか？',
    teacherQuestionTh: 'ที่นี่คือสถานที่ใดครับ?',
    imageSrc: '/assets/images/clean/abc_fuzu.jpg',
    imageTitle: 'บริษัทอาหาร ABC Foods',
    correctAnswerRomaji: 'Kochira wa ABC fūzu desu.',
    correctAnswerKana: 'こちらはABCフーズです。',
    correctAnswerTh: 'ที่นี่คือบริษัทอาหาร ABC Foods ครับ',
    templateFormat: 'Kochira wa [สถานที่] desu.',
    textbookRef: 'JN60101 Ch.1 p.89',
    options: [
      { romaji: 'Kochira wa ABC fūzu desu.', kana: 'こちらはABCフーズです。', isCorrect: true },
      { romaji: 'Kochira wa Nozomi depāto desu.', kana: 'こちらのぞみデパートです。', isCorrect: false },
      { romaji: 'Kochira wa Fuji denki desu.', kana: 'こちらはふじでんきです。', isCorrect: false },
      { romaji: 'Kochira wa daigaku desu.', kana: 'こちらはだいがくです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_loc_nozomi',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสถานที่ (Locations & Places)',
    teacherQuestionRomaji: 'Kochira wa doko desuka?',
    teacherQuestionKana: 'こちら は どこ ですか？',
    teacherQuestionTh: 'ที่นี่คือสถานที่ใดครับ?',
    imageSrc: '/assets/images/clean/nozomi_depato.jpg',
    imageTitle: 'ห้างสรรพสินค้าโนโซมิ (Nozomi depāto)',
    correctAnswerRomaji: 'Kochira wa Nozomi depāto desu.',
    correctAnswerKana: 'こちらはのぞみデパートです。',
    correctAnswerTh: 'ที่นี่คือห้างสรรพสินค้าโนโซมิครับ',
    templateFormat: 'Kochira wa [สถานที่] desu.',
    textbookRef: 'JN60101 Ch.1 p.89',
    options: [
      { romaji: 'Kochira wa Nozomi depāto desu.', kana: 'こちらのぞみデパートです。', isCorrect: true },
      { romaji: 'Kochira wa ABC fūzu desu.', kana: 'こちらはABCフーズです。', isCorrect: false },
      { romaji: 'Kochira wa byōin desu.', kana: 'こちらはびょういんです。', isCorrect: false },
      { romaji: 'Kochira wa ginkō desu.', kana: 'こちらはぎんこうです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_phrase_shitsurei',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสำนวน / สถานการณ์ (Conversations & Phrases)',
    teacherQuestionRomaji: 'Shitsurei desuga, o-namae wa?',
    teacherQuestionKana: 'しつれいですが、おなまえは？',
    teacherQuestionTh: 'ขอประทานโทษครับแต่ว่า... ขอทราบชื่อด้วยครับ?',
    imageSrc: '/assets/images/clean/shitsurei_desuga.jpg',
    imageTitle: 'ขอประทานโทษครับแต่ว่า... (Shitsurei desuga)',
    correctAnswerRomaji: 'Shitsurei desuga, o-namae wa?',
    correctAnswerKana: 'しつれいですが、おなまえは？',
    correctAnswerTh: 'ขอโทษครับแต่ว่า... ขอทราบชื่อหน่อยครับ',
    templateFormat: 'Shitsurei desuga, [ประโยค]',
    textbookRef: 'JN60101 Ch.1 p.81',
    options: [
      { romaji: 'Shitsurei desuga, o-namae wa?', kana: 'しつれいですが、おなまえは？', isCorrect: true },
      { romaji: 'Hajimemashite.', kana: 'はじめまして。', isCorrect: false },
      { romaji: 'Dōzo yoroshiku.', kana: 'どうぞよろしく。', isCorrect: false },
      { romaji: 'Arigatō gozaimasu.', kana: 'ありがとうございます。', isCorrect: false },
    ],
  },
  {
    id: 'vq_phrase_onamae',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสำนวน / สถานการณ์ (Conversations & Phrases)',
    teacherQuestionRomaji: 'O-namae wa?',
    teacherQuestionKana: 'おなまえは？',
    teacherQuestionTh: 'ขอทราบชื่อด้วยครับ?',
    imageSrc: '/assets/images/clean/onamae_wa.jpg',
    imageTitle: 'ขอทราบชื่อด้วยครับ (O-namae wa?)',
    correctAnswerRomaji: 'O-namae wa?',
    correctAnswerKana: 'おなまえは？',
    correctAnswerTh: 'ขอทราบชื่อหน่อยครับ / ชื่ออะไรครับ?',
    templateFormat: 'O-namae wa [?]',
    textbookRef: 'JN60101 Ch.1 p.82',
    options: [
      { romaji: 'O-namae wa?', kana: 'おなまえは？', isCorrect: true },
      { romaji: 'O-genki desuka?', kana: 'おげんきですか？', isCorrect: false },
      { romaji: 'O-ikutsu desuka?', kana: 'おいくつですか？', isCorrect: false },
      { romaji: 'Doko kara kimashitaka?', kana: 'どこからきましたか？', isCorrect: false },
    ],
  },
  {
    id: 'vq_phrase_kochira',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสำนวน / สถานการณ์ (Conversations & Phrases)',
    teacherQuestionRomaji: 'Kochira wa Takahashi-san desu.',
    teacherQuestionKana: 'こちらはたかはしさんです。',
    teacherQuestionTh: 'ทางนี้คือคุณทาคาฮาชิครับ (การแนะนำผู้อื่น)',
    imageSrc: '/assets/images/clean/kochira_san.jpg',
    imageTitle: 'ทางนี้คือคุณ... (Kochira wa ...-san desu)',
    correctAnswerRomaji: 'Kochira wa Takahashi-san desu.',
    correctAnswerKana: 'こちらはたかはしさんです。',
    correctAnswerTh: 'ทางนี้คือคุณทาคาฮาชิครับ',
    templateFormat: 'Kochira wa [ชื่อคน]-san desu.',
    textbookRef: 'JN60101 Ch.1 p.85',
    options: [
      { romaji: 'Kochira wa Takahashi-san desu.', kana: 'こちらはたかはしさんです。', isCorrect: true },
      { romaji: 'Watashi wa Takahashi desu.', kana: 'わたしはたかはしです。', isCorrect: false },
      { romaji: 'Anata wa Takahashi-san desuka?', kana: 'あなたはたかはしさんですか？', isCorrect: false },
      { romaji: 'Anohito wa Takahashi-san desu.', kana: 'あのひとはたかはしさんです。', isCorrect: false },
    ],
  },
  {
    id: 'vq_phrase_karakimashita',
    typeId: 5,
    typeName: 'แบบที่ 5: ถามสำนวน / สถานการณ์ (Conversations & Phrases)',
    teacherQuestionRomaji: 'Tai kara kimashita.',
    teacherQuestionKana: 'タイからきました。',
    teacherQuestionTh: 'มาจากประเทศไทยครับ (การบอกถิ่นที่มา)',
    imageSrc: '/assets/images/clean/karakimashita.jpg',
    imageTitle: 'มาจาก... (... kara kimashita)',
    correctAnswerRomaji: 'Tai kara kimashita.',
    correctAnswerKana: 'タイからきました。',
    correctAnswerTh: 'มาจากประเทศไทยครับ',
    templateFormat: '[สถานที่] kara kimashita.',
    textbookRef: 'JN60101 Ch.1 p.86',
    options: [
      { romaji: 'Tai kara kimashita.', kana: 'タイからきました。', isCorrect: true },
      { romaji: 'Tai e ikimasu.', kana: 'タイへいきます。', isCorrect: false },
      { romaji: 'Tai ni imasu.', kana: 'タイにいます。', isCorrect: false },
      { romaji: 'Tai-jin desu.', kana: 'タイじんです。', isCorrect: false },
    ],
  },
];

export const VisualQAArena: React.FC = () => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<number | 0>(0); // 0 = all
  const [pool, setPool] = useState<VisualQuestionItem[]>(allSection3Pool);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [stats, setStats] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Choice Reveal Mode (Instant vs Concealed Active Recall)
  const [choiceRevealMode, setChoiceRevealMode] = useState<'instant' | 'hidden'>(() => {
    return (localStorage.getItem('nihongo_endless_choice_mode') as 'instant' | 'hidden') || 'instant';
  });
  const [isChoiceRevealed, setIsChoiceRevealed] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('nihongo_endless_choice_mode', choiceRevealMode);
  }, [choiceRevealMode]);

  const handleFilterType = (typeId: number) => {
    setSelectedTypeFilter(typeId);
    const filtered = typeId === 0 ? allSection3Pool : allSection3Pool.filter(q => q.typeId === typeId);
    setPool(filtered);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setIsChoiceRevealed(false);
  };

  const handleShuffle = () => {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setPool(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setIsChoiceRevealed(false);
  };

  const currentQ = pool[currentIndex] || allSection3Pool[0];
  const isSelectedCorrect = selectedOption !== null && currentQ.options[selectedOption]?.isCorrect;
  const selectedOptionObj = selectedOption !== null ? currentQ.options[selectedOption] : null;

  const handleSelectOption = (idx: number) => {
    if (showAnswer) return;
    setSelectedOption(idx);
    setShowAnswer(true);

    const isCorrect = currentQ.options[idx].isCorrect;
    if (isCorrect) {
      playJapaneseAudio(currentQ.options[idx].kana);
      setStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      // Play correct answer after delay
      setTimeout(() => playJapaneseAudio(currentQ.correctAnswerKana), 300);
    }
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % pool.length);
    setSelectedOption(null);
    setShowAnswer(false);
    setIsChoiceRevealed(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-primary">ส่วนที่ 3 ของการสอบ</span>
            <span className="badge badge-ref">Pure Photos (รูปภาพเพียวๆ ไม่มีตัวหนังสือเฉลย)</span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Visual Q&A Arena (ถาม-ตอบตรงภาพ 5 รูปแบบ)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
            ฝึกตอบคำถามตาม 5 แพทเทิร์นของอาจารย์ พร้อมระบบแจ้งเตือนข้อผิดพลาดและเสียงเฉลย
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Choice Reveal Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>ตัวเลือก:</span>
            <button
              onClick={() => { setChoiceRevealMode('instant'); setIsChoiceRevealed(false); }}
              className={choiceRevealMode === 'instant' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '3px 8px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
              title="แสดงตัวเลือก 4 ชอยส์ทันที"
            >
              <Eye size={11} /> แสดงชอยส์ทันที
            </button>
            <button
              onClick={() => { setChoiceRevealMode('hidden'); setIsChoiceRevealed(false); }}
              className={choiceRevealMode === 'hidden' ? 'btn-primary' : 'btn-outline'}
              style={{ padding: '3px 8px', fontSize: '11px', borderRadius: 'var(--radius-sm)' }}
              title="ซ่อนตัวเลือกเพื่อฝึกนึกคำตอบปากเปล่าก่อน"
            >
              <EyeOff size={11} /> ซ่อนชอยส์ฝึกจำ
            </button>
          </div>

          <div style={{ textAlign: 'right', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-muted)' }}>ความแม่นยำ: </span>
            <strong>{stats.correct} / {stats.total}</strong>
          </div>
          <button onClick={handleShuffle} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
            <Shuffle size={14} /> สุ่มโจทย์ใหม่
          </button>
        </div>
      </div>

      {/* 5-Type Filter Toolbar */}
      <div className="category-filter-grid">
        {[
          { id: 0, label: 'ทั้งหมด (รวม 5 แบบ)' },
          { id: 1, label: '1. สิ่งของ (Kore wa nan...)' },
          { id: 2, label: '2. 4 ประเทศ (Anohito wa doko...)' },
          { id: 3, label: '3. อาชีพ (Anohito wa dare...)' },
          { id: 4, label: '4. นิตยสาร (Nan no zasshi...)' },
          { id: 5, label: '5. สถานที่ (Kochira wa nan...)' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => handleFilterType(t.id)}
            style={{
              padding: '10px 8px',
              borderRadius: 'var(--radius-md)',
              border: selectedTypeFilter === t.id ? '2px solid var(--primary-600)' : '1px solid var(--border-subtle)',
              backgroundColor: selectedTypeFilter === t.id ? 'var(--primary-50)' : 'var(--bg-surface)',
              fontWeight: selectedTypeFilter === t.id ? 700 : 500,
              fontSize: '12px',
              textAlign: 'center',
              color: selectedTypeFilter === t.id ? 'var(--primary-700)' : 'var(--text-main)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Question Display Arena */}
      <div className="card" style={{ padding: '28px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">{currentQ.typeName}</span>
            <span className="badge-ref">{currentQ.textbookRef}</span>
            <span className="badge">ข้อที่ {currentIndex + 1} / {pool.length}</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            โครงสร้างคำตอบ: <strong style={{ color: 'var(--text-main)' }}>{currentQ.templateFormat}</strong>
          </div>
        </div>

        {/* PROMINENT WRONG ANSWER NOTIFICATION BANNER */}
        {showAnswer && !isSelectedCorrect && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'var(--danger-50)',
            border: '1.5px solid var(--danger-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <AlertCircle size={24} color="var(--danger-600)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--danger-600)' }}>
                ❌ ตอบผิด! คุณเลือก: "{selectedOptionObj?.romaji}"
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                อาจารย์ถาม: <em>"{currentQ.teacherQuestionRomaji}"</em> $\rightarrow$ คำตอบที่ถูกต้องคือ: <strong style={{ color: 'var(--primary-700)' }}>{currentQ.correctAnswerRomaji}</strong> ({currentQ.correctAnswerTh})
              </div>
            </div>
          </div>
        )}

        {/* PROMINENT CORRECT ANSWER NOTIFICATION BANNER */}
        {showAnswer && isSelectedCorrect && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: 'var(--success-50)',
            border: '1.5px solid var(--success-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <CheckCircle2 size={24} color="var(--success-600)" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--success-600)' }}>
                ✓ ถูกต้องตามรูปแบบที่อาจารย์กำหนด!
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px' }}>
                "{currentQ.correctAnswerRomaji}" ({currentQ.correctAnswerKana})
              </div>
            </div>
          </div>
        )}

        <div className="visual-qa-grid">
          {/* Left: Pure Photo without Any Text/Spoilers */}
          <div style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            boxShadow: 'var(--shadow-sm)',
            padding: '16px'
          }}>
            <img
              src={currentQ.imageSrc}
              alt="Question item"
              style={{
                maxWidth: '100%',
                maxHeight: '270px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)'
              }}
            />
          </div>

          {/* Right: Teacher Spoken Question & Multiple Choice Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Teacher Audio Question Box */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--primary-600)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2px' }}>
                อาจารย์ชี้รูปภาพแล้วถามว่า:
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                "{currentQ.teacherQuestionRomaji}"
              </div>
              <div style={{ fontSize: '14px', color: 'var(--primary-700)', marginTop: '2px' }}>
                {currentQ.teacherQuestionKana}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                ความหมาย: {currentQ.teacherQuestionTh}
              </div>
              <button
                onClick={() => playJapaneseAudio(currentQ.teacherQuestionKana)}
                className="btn-outline"
                style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px' }}
              >
                <Volume2 size={14} /> ฟังเสียงคำถาม
              </button>
            </div>

            {/* Concealed Active Recall Card OR Multiple Choice Answers */}
            {choiceRevealMode === 'hidden' && !isChoiceRevealed && !showAnswer ? (
              <div
                onClick={() => setIsChoiceRevealed(true)}
                style={{
                  padding: '32px 20px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  minHeight: '220px',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-300)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  <EyeOff size={13} color="var(--primary-600)" />
                  <span>ฝึกตอบปากเปล่า (Active Recall)</span>
                </div>

                <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
                  ดูภาพแล้วลองตอบอาจารย์เป็นภาษาญี่ปุ่นออกเสียงด้วยตนเอง
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsChoiceRevealed(true);
                  }}
                  className="btn-primary"
                  style={{
                    padding: '10px 24px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 2px 8px rgba(0, 82, 204, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px',
                  }}
                >
                  <Eye size={16} /> แตะเพื่อแสดงตัวเลือก (4 ชอยส์)
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  เลือกประโยคคำตอบที่ถูกต้อง:
                </div>
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let optStyle: React.CSSProperties = {
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  };

                  if (showAnswer) {
                    if (opt.isCorrect) {
                      optStyle.backgroundColor = 'var(--success-50)';
                      optStyle.borderColor = 'var(--success-border)';
                      optStyle.color = 'var(--success-600)';
                    } else if (isSelected) {
                      optStyle.backgroundColor = 'var(--danger-50)';
                      optStyle.borderColor = 'var(--danger-border)';
                      optStyle.color = 'var(--danger-600)';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => !showAnswer && handleSelectOption(optIdx)}
                      style={{
                        ...optStyle,
                        cursor: showAnswer ? 'default' : 'pointer',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px' }}>{opt.romaji}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{opt.kana}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playJapaneseAudio(opt.kana);
                          }}
                          title="กดฟังเสียงอ่านประโยคภาษาญี่ปุ่น"
                          style={{
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            color: 'var(--primary-700)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Volume2 size={16} />
                        </button>

                        {showAnswer && opt.isCorrect && <CheckCircle2 size={18} color="var(--success-600)" />}
                        {showAnswer && isSelected && !opt.isCorrect && <XCircle size={18} color="var(--danger-600)" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Answer Control Action Bar */}
            {showAnswer && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  onClick={() => playJapaneseAudio(currentQ.correctAnswerKana)}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  <Volume2 size={15} /> ฟังเสียงคำตอบที่ถูก
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '13px' }}
                >
                  ข้อถัดไป <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
