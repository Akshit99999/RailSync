// Synthesizes the iconic 4-tone Indian Railways station announcement chime
// Tones: G4 (392Hz) -> C5 (523.25Hz) -> D5 (587.33Hz) -> G5 (783.99Hz)
// Uses native Web Audio API - no external mp3 assets required.

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

export function playRailwayChime() {
  if (typeof window === 'undefined' || !isAudioEnabled()) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

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
  } catch (err) {
    console.warn('Audio chime playback omitted:', err);
  }
}
