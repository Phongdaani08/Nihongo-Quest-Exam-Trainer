// Bulletproof Dual-Engine Audio System (Direct Web Speech API + Google Cloud TTS Stream)

let currentAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Pre-warm Web Speech API Voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      // ignore
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Play Japanese audio pronunciation with zero-delay native TTS and Google Cloud fallback
 */
export function playJapaneseAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  // 1. Try Native Web Speech Synthesis first (works offline, instant response on iOS/Android/Desktop)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel(); // Stop previous utterance immediately

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.92; // Natural study pace
      utterance.pitch = 1.0;

      // Select best Japanese voice if available
      const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      const jaVoice = voices.find(
        (v) =>
          v.lang.replace('_', '-').startsWith('ja') ||
          v.name.includes('Japanese') ||
          v.name.includes('Kyoko') ||
          v.name.includes('Otoya')
      );
      if (jaVoice) {
        utterance.voice = jaVoice;
      }

      let hasSpoken = false;
      utterance.onstart = () => {
        hasSpoken = true;
      };

      utterance.onerror = (e) => {
        console.warn('Web Speech error, falling back to Google Cloud TTS:', e);
        if (!hasSpoken) {
          playGoogleCloudTTS(clean, 'ja');
        }
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (err) {
      console.warn('Web Speech exception, falling back to Google Cloud TTS:', err);
    }
  }

  // 2. Fallback: Google Cloud TTS Direct Stream
  playGoogleCloudTTS(clean, 'ja');
}

/**
 * Play Thai audio pronunciation
 */
export function playThaiAudio(text: string): void {
  const clean = text ? text.trim() : '';
  if (!clean) return;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      const thVoice = voices.find(
        (v) =>
          v.lang.replace('_', '-').startsWith('th') ||
          v.name.includes('Thai') ||
          v.name.includes('Kanya') ||
          v.name.includes('Narisa')
      );
      if (thVoice) {
        utterance.voice = thVoice;
      }

      let hasSpoken = false;
      utterance.onstart = () => {
        hasSpoken = true;
      };

      utterance.onerror = () => {
        if (!hasSpoken) {
          playGoogleCloudTTS(clean, 'th');
        }
      };

      window.speechSynthesis.speak(utterance);
      return;
    } catch (err) {
      console.warn('Web Speech exception, falling back to Google Cloud TTS:', err);
    }
  }

  playGoogleCloudTTS(clean, 'th');
}

/**
 * Direct Google Cloud TTS Stream Fallback
 */
function playGoogleCloudTTS(text: string, lang: 'ja' | 'th'): void {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(
      text
    )}`;

    const audio = new Audio(ttsUrl);
    currentAudio = audio;
    audio.playbackRate = lang === 'ja' ? 0.95 : 1.0;

    audio.play().catch((err) => {
      console.warn('Google Cloud TTS fallback playback failed:', err);
    });
  } catch (err) {
    console.error('TTS playback error:', err);
  }
}
