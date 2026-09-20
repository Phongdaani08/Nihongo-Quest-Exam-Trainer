// Dual-Engine Audio Utility (Web Speech API + Google Cloud TTS HTML5 Audio Fallback)

let cachedVoices: SpeechSynthesisVoice[] = [];
let currentHtmlAudio: HTMLAudioElement | null = null;

// Pre-load and cache voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      cachedVoices = window.speechSynthesis.getVoices();
    } catch {
      cachedVoices = [];
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Fallback to Google Translate TTS audio via HTML5 Audio
 */
function playGoogleTTS(text: string, lang: 'ja' | 'th'): void {
  try {
    if (currentHtmlAudio) {
      currentHtmlAudio.pause();
      currentHtmlAudio.currentTime = 0;
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    const encoded = encodeURIComponent(cleanText);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`;
    
    currentHtmlAudio = new Audio(ttsUrl);
    currentHtmlAudio.playbackRate = lang === 'ja' ? 0.95 : 1.0;
    currentHtmlAudio.play().catch((err) => {
      console.warn('HTML5 TTS playback notice:', err);
    });
  } catch (err) {
    console.warn('Dual-Engine TTS fallback error:', err);
  }
}

/**
 * Play Japanese speech using Web Speech API with automatic Google TTS fallback
 */
export function playJapaneseAudio(text: string, rate: number = 0.9): void {
  if (!text) return;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playGoogleTTS(text, 'ja');
    return;
  }

  try {
    // 1. Queue Unlocker - Resume if browser paused speech synthesis
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    // 2. Prepare Utterance
    const utterance = new SpeechSynthesisUtterance(text);
    (window as any).__currentUtterance = utterance; // Prevent garbage collection bug in Chrome/Safari
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // 3. Find Japanese Voice
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.toLowerCase().startsWith('ja') || v.lang.includes('JP'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    let hasStarted = false;

    utterance.onstart = () => {
      hasStarted = true;
    };

    // 4. Fallback Trigger if speech synthesis errors out or fails to start
    utterance.onerror = () => {
      (window as any).__currentUtterance = null;
      playGoogleTTS(text, 'ja');
    };

    // Watchdog fallback if Chrome queue hangs silently for > 800ms
    const watchdog = setTimeout(() => {
      if (!hasStarted) {
        window.speechSynthesis.cancel();
        (window as any).__currentUtterance = null;
        playGoogleTTS(text, 'ja');
      }
    }, 800);

    utterance.onend = () => {
      clearTimeout(watchdog);
      (window as any).__currentUtterance = null;
    };

    // 5. Unlock queue & Speak
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  } catch {
    playGoogleTTS(text, 'ja');
  }
}

/**
 * Play Thai speech using Web Speech API with automatic Google TTS fallback
 */
export function playThaiAudio(text: string, rate: number = 1.0): void {
  if (!text) return;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    playGoogleTTS(text, 'th');
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    (window as any).__currentUtterance = utterance;
    utterance.lang = 'th-TH';
    utterance.rate = rate;

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const thVoice = voices.find(v => v.lang.toLowerCase().startsWith('th') || v.lang.includes('TH'));
    if (thVoice) {
      utterance.voice = thVoice;
    }

    let hasStarted = false;

    utterance.onstart = () => {
      hasStarted = true;
    };

    utterance.onerror = () => {
      (window as any).__currentUtterance = null;
      playGoogleTTS(text, 'th');
    };

    const watchdog = setTimeout(() => {
      if (!hasStarted) {
        window.speechSynthesis.cancel();
        (window as any).__currentUtterance = null;
        playGoogleTTS(text, 'th');
      }
    }, 800);

    utterance.onend = () => {
      clearTimeout(watchdog);
      (window as any).__currentUtterance = null;
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  } catch {
    playGoogleTTS(text, 'th');
  }
}
