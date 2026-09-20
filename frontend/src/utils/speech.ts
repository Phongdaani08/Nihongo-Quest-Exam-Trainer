// High-Reliability Audio Player (Server-side MP3 Streamer + Web Speech API Fallback)

let currentAudio: HTMLAudioElement | null = null;

/**
 * Play Japanese audio pronunciation
 */
export function playJapaneseAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  try {
    // 1. Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // 2. Play high quality MP3 stream from Backend API
    const audioUrl = `/api/tts?text=${encodeURIComponent(clean)}&lang=ja`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.playbackRate = 0.95;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Backend TTS stream failed, attempting Web Speech fallback:', err);
        fallbackWebSpeech(clean, 'ja-JP');
      });
    }
  } catch (err) {
    console.warn('Audio player exception, attempting Web Speech fallback:', err);
    fallbackWebSpeech(clean, 'ja-JP');
  }
}

/**
 * Play Thai audio pronunciation
 */
export function playThaiAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audioUrl = `/api/tts?text=${encodeURIComponent(clean)}&lang=th`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.playbackRate = 1.0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Backend Thai TTS stream failed, attempting Web Speech fallback:', err);
        fallbackWebSpeech(clean, 'th-TH');
      });
    }
  } catch (err) {
    console.warn('Thai audio player exception, attempting Web Speech fallback:', err);
    fallbackWebSpeech(clean, 'th-TH');
  }
}

/**
 * Local browser fallback if server is unreachable
 */
function fallbackWebSpeech(text: string, lang: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.startsWith('ja') ? 0.9 : 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis fallback failed:', err);
  }
}
