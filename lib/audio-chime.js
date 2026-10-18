// Synthesizes the iconic 4-tone Indian Railways station announcement chime
// Tones: G4 (392Hz) -> C5 (523.25Hz) -> D5 (587.33Hz) -> G5 (783.99Hz)
// Uses native Web Audio API + Web Speech API for bilingual announcements - no external mp3 assets required.

let audioCtx = null;
let soundEnabled = true;

export function isAudioEnabled() {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('railsync_audio_enabled');
  if (stored !== null) return stored === 'true';
  return true;
}

export function toggleAudio() {
  if (typeof window === 'undefined') return false;
  const current = isAudioEnabled();
  const next = !current;
  localStorage.setItem('railsync_audio_enabled', String(next));
  soundEnabled = next;
  return next;
}

export function playRailwayChime(onComplete) {
  if (typeof window === 'undefined' || !isAudioEnabled()) {
    if (onComplete) onComplete();
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      if (onComplete) onComplete();
      return;
    }

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const notes = [
      { freq: 392.00, time: 0.00, dur: 0.35 }, // G4
      { freq: 523.25, time: 0.35, dur: 0.35 }, // C5
      { freq: 587.33, time: 0.70, dur: 0.35 }, // D5
      { freq: 783.99, time: 1.05, dur: 0.70 }, // G5 (sustained)
    ];

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.22, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    notes.forEach((note) => {
      const startTime = audioCtx.currentTime + note.time;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Sine wave with bell-like envelope
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, startTime);

      // Bell envelope: instant attack, exponential decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.8, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + note.dur);
    });

    if (onComplete) {
      setTimeout(onComplete, 1750);
    }
  } catch (err) {
    console.warn('Audio chime playback omitted:', err);
    if (onComplete) onComplete();
  }
}

/**
 * Recreates authentic Indian Railways public address voice announcement.
 * Uses the browser native Web Speech API (speechSynthesis).
 */
export function announceTrain({
  trainNumber = '12952',
  trainName = 'Tejas Rajdhani Express',
  origin = 'New Delhi',
  destination = 'Mumbai Central',
  platform = '1',
  language = 'hi' // 'hi' | 'en' | 'both'
}) {
  if (typeof window === 'undefined' || !isAudioEnabled() || !window.speechSynthesis) return;

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  // Play iconic 4-tone chime first, then trigger voice announcement
  playRailwayChime(() => {
    try {
      const voices = window.speechSynthesis.getVoices();

      const speakHindi = (cb) => {
        const text = `यात्री कृपया ध्यान दें। गाड़ी संख्या ${trainNumber.split('').join(' ')}, ${origin} से चलकर ${destination} को जाने वाली, प्लेटफार्म नंबर ${platform} पर आ रही है।`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
        if (hiVoice) utterance.voice = hiVoice;

        if (cb) utterance.onend = cb;
        window.speechSynthesis.speak(utterance);
      };

      const speakEnglish = () => {
        const text = `May I have your attention please. Train number ${trainNumber.split('').join(' ')}, ${trainName}, from ${origin} to ${destination}, is arriving on platform number ${platform}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.92;
        utterance.pitch = 1.0;

        const enVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en'));
        if (enVoice) utterance.voice = enVoice;

        window.speechSynthesis.speak(utterance);
      };

      if (language === 'hi') {
        speakHindi();
      } else if (language === 'en') {
        speakEnglish();
      } else {
        // Both: Hindi first, then English
        speakHindi(() => {
          setTimeout(speakEnglish, 600);
        });
      }
    } catch (e) {
      console.warn('Speech synthesis notification failed:', e);
    }
  });
}
