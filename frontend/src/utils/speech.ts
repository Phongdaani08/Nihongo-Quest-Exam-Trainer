// High-Reliability Audio Engine for Native Japanese & Thai Speech

let currentAudio: HTMLAudioElement | null = null;

// Map of common Romaji syllables to Hiragana
const romajiMap: Record<string, string> = {
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  tsu: 'つ', shi: 'し', chi: 'ち', fyu: 'ふ',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', n: 'ん',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お'
};

/**
 * Clean text and convert Romaji to Kana if Roman characters are detected
 */
export function ensureJapaneseKana(text: string): string {
  if (!text) return '';
  // Strip annotations like (+ Noun), (~100), bracketed text
  let cleaned = text.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
  
  // If text already contains Japanese Kana/Kanji (Hiragana: \u3040-\u309F, Katakana: \u30A0-\u30FF, Kanji: \u4E00-\u9FAF)
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(cleaned)) {
    return cleaned;
  }

  // Convert Romaji to Hiragana phonetically
  let rom = cleaned.toLowerCase()
    .replace(/ō/g, 'ou')
    .replace(/ū/g, 'uu')
    .replace(/ā/g, 'aa')
    .replace(/ī/g, 'ii')
    .replace(/ē/g, 'ee')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Replace double consonants with sokuon (っ)
  rom = rom.replace(/([kstpcz])\1/g, 'っ$1');

  let result = '';
  let i = 0;
  while (i < rom.length) {
    if (rom[i] === ' ' || rom[i] === 'っ') {
      result += rom[i];
      i++;
      continue;
    }

    // Try 3-letter syllable
    const s3 = rom.substring(i, i + 3);
    if (romajiMap[s3]) {
      result += romajiMap[s3];
      i += 3;
      continue;
    }

    // Try 2-letter syllable
    const s2 = rom.substring(i, i + 2);
    if (romajiMap[s2]) {
      result += romajiMap[s2];
      i += 2;
      continue;
    }

    // Try 1-letter syllable
    const s1 = rom.substring(i, i + 1);
    if (romajiMap[s1]) {
      result += romajiMap[s1];
      i += 1;
      continue;
    }

    result += rom[i];
    i++;
  }

  return result || cleaned;
}

/**
 * Play Japanese audio pronunciation with authentic native Japanese voice
 */
export function playJapaneseAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  const kana = ensureJapaneseKana(clean);
  const directGoogleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(kana)}`;

  playAudioStream(directGoogleUrl, kana, 'ja-JP');
}

/**
 * Play Thai audio pronunciation
 */
export function playThaiAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  // Clean English helper notes from Thai prompt
  const cleanThai = clean.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
  const directGoogleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=th&client=tw-ob&q=${encodeURIComponent(cleanThai)}`;

  playAudioStream(directGoogleUrl, cleanThai, 'th-TH');
}

/**
 * Plays audio stream with instant Web Speech fallback
 */
function playAudioStream(url: string, rawText: string, fallbackLang: string): void {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    currentAudio = audio;
    audio.playbackRate = fallbackLang.startsWith('ja') ? 0.95 : 1.0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        fallbackWebSpeech(rawText, fallbackLang);
      });
    }
  } catch (err) {
    fallbackWebSpeech(rawText, fallbackLang);
  }
}

/**
 * Browser-native Web Speech fallback using authentic native voices
 */
function fallbackWebSpeech(text: string, lang: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.startsWith('ja') ? 0.9 : 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (lang.startsWith('ja')) {
        const jaVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('ja') ||
            v.name.includes('Kyoko') ||
            v.name.includes('Otoya') ||
            v.name.includes('Hattori') ||
            v.name.includes('Japanese') ||
            v.name.includes('日本語')
        );
        if (jaVoice) utterance.voice = jaVoice;
      } else if (lang.startsWith('th')) {
        const thVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('th') ||
            v.name.includes('Kanya') ||
            v.name.includes('Narisa') ||
            v.name.includes('Thai') ||
            v.name.includes('ไทย')
        );
        if (thVoice) utterance.voice = thVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Web Speech fallback failed:', err);
  }
}
