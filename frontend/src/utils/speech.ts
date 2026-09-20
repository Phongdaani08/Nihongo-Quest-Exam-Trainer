// Web Speech Synthesis Audio Utility for Japanese & Thai Pronunciation

export function playJapaneseAudio(text: string, rate: number = 0.9): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  try {
    // Resume speech engine if paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Find Japanese Voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.toLowerCase().includes('ja') || v.lang.includes('JP'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    (window as any).__currentUtterance = utterance;
    utterance.onend = () => {
      (window as any).__currentUtterance = null;
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}

export function playThaiAudio(text: string, rate: number = 1.0): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const thVoice = voices.find(v => v.lang.toLowerCase().includes('th') || v.lang.includes('TH'));
    if (thVoice) {
      utterance.voice = thVoice;
    }

    (window as any).__currentUtterance = utterance;
    utterance.onend = () => {
      (window as any).__currentUtterance = null;
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Thai speech synthesis error:', err);
  }
}
