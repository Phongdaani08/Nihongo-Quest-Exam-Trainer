// High-Reliability Audio Engine for Vercel Serverless + Web Speech Fallback

let currentAudio: HTMLAudioElement | null = null;

/**
 * Play Japanese audio pronunciation via Vercel Serverless MP3 stream
 */
export function playJapaneseAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  playAudioStream(`/api/tts?text=${encodeURIComponent(clean)}&lang=ja`, clean, 'ja-JP');
}

/**
 * Play Thai audio pronunciation via Vercel Serverless MP3 stream
 */
export function playThaiAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  playAudioStream(`/api/tts?text=${encodeURIComponent(clean)}&lang=th`, clean, 'th-TH');
}

/**
 * Plays audio with error catching and seamless Web Speech fallback
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
      playPromise.catch((err) => {
        console.warn('Serverless MP3 play failed, falling back to Web Speech:', err);
        fallbackWebSpeech(rawText, fallbackLang);
      });
    }
  } catch (err) {
    console.warn('Audio construction exception, falling back to Web Speech:', err);
    fallbackWebSpeech(rawText, fallbackLang);
  }
}

/**
 * Browser-native Web Speech fallback
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
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Web Speech fallback failed:', err);
  }
}
