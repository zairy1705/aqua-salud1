// CLORAGUA - Interactive Web Audio Synthesizer & Game Sound Engine
// Supports arcade feedback, subtle hover chirps, water drop synthesizer,
// and real-time Tropical Calypso BGM synthesizer.

class GameSoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    try {
      const saved = localStorage.getItem('cloragua_game_sound_enabled');
      if (saved !== null) {
        this.isMuted = saved === 'false';
      }
    } catch {
      this.isMuted = false;
    }
  }

  getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  subscribe(callback: (muted: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isMuted);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isMuted);
      } catch (e) {
        console.error(e);
      }
    });
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('cloragua_game_sound_enabled', String(!muted));
    } catch {}
    this.notify();
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  toggleSound(): boolean {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    if (!nextMuted) {
      this.playCoin();
    }
    return !nextMuted;
  }

  // Classic retro coin chime (double pitch)
  playCoin(spread = 0.05, vol = 0.18) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const mult = 1 + (Math.random() - 0.5) * spread;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77 * mult, t);
      osc.frequency.setValueAtTime(1318.51 * mult, t + 0.075);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.setValueAtTime(vol, t + 0.075);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.33);
    } catch {}
  }

  // Downward blip / pop
  playBlip(spread = 0.1, vol = 0.16) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const startFreq = 880 * (1 + (Math.random() - 0.5) * spread);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.1);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch {}
  }

  // Upward jump sound
  playJump(vol = 0.15) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(640, t + 0.14);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {}
  }

  // Power-up ascending 4-tone chord
  playPowerUp(vol = 0.16) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.055);
        gain.gain.setValueAtTime(vol, t + i * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.055 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + i * 0.055);
        osc.stop(t + i * 0.055 + 0.19);
      });
    } catch {}
  }

  // Quick UI Select chirp
  playMenuSelect(vol = 0.14) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(1600, t + 0.04);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {}
  }

  // Subtle clean hover chirp for buttons
  playHoverChirp(vol = 0.035) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(1700, t + 0.03);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch {}
  }

  // Realistic water droplet splash sound
  playWaterDrop(vol = 0.15) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 300, t);
      osc.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 400, t + 0.08);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    } catch {}
  }

  // Context-sensitive arcade sound based on button label
  playRandomVideoGameSound(el?: HTMLElement | null) {
    if (this.isMuted) return;
    const txt = (el?.textContent || '').toLowerCase();
    if (
      txt.includes('calcular') ||
      txt.includes('guardar') ||
      txt.includes('completar') ||
      txt.includes('registrar') ||
      txt.includes('dosis') ||
      txt.includes('dosificar')
    ) {
      this.playCoin(0.08, 0.2);
    } else if (
      txt.includes('calibrar') ||
      txt.includes('escanear') ||
      txt.includes('nuevo') ||
      txt.includes('foto')
    ) {
      this.playPowerUp(0.16);
    } else if (
      txt.includes('cambiar') ||
      txt.includes('cuenta') ||
      txt.includes('saludar') ||
      txt.includes('abrir')
    ) {
      this.playJump(0.15);
    } else {
      const rnd = Math.random();
      if (rnd < 0.45) {
        this.playCoin(0.12, 0.16);
      } else if (rnd < 0.75) {
        this.playMenuSelect(0.18);
      } else {
        this.playBlip(0.1, 0.16);
      }
    }
  }

  setupGlobalListeners() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Helper to find closest interactive element
    const findInteractive = (target: EventTarget | null): HTMLElement | null => {
      let curr = target as HTMLElement | null;
      let depth = 0;
      while (curr && depth < 6 && curr !== document.body) {
        if (
          curr.tagName === 'BUTTON' ||
          curr.getAttribute('role') === 'button' ||
          curr.classList?.contains('btn') ||
          (curr.tagName === 'A' && curr.getAttribute('href')) ||
          (curr.tagName === 'INPUT' &&
            ['button', 'submit', 'checkbox', 'radio'].includes(
              curr.getAttribute('type') || ''
            ))
        ) {
          return curr;
        }
        curr = curr.parentElement;
        depth++;
      }
      return null;
    };

    // Pointer down click sound on all interactive buttons
    window.addEventListener(
      'pointerdown',
      (e) => {
        this.getContext(); // unlock AudioContext on user gesture
        const interactive = findInteractive(e.target);
        if (interactive) {
          this.playRandomVideoGameSound(interactive);
        }
      },
      { capture: true, passive: true }
    );

    // Mouseover / hover subtle chirp on all buttons
    let lastHoverTime = 0;
    window.addEventListener(
      'mouseover',
      (e) => {
        const now = Date.now();
        if (now - lastHoverTime < 70) return; // debounce
        const interactive = findInteractive(e.target);
        if (interactive) {
          lastHoverTime = now;
          this.playHoverChirp(0.035);
        }
      },
      { capture: true, passive: true }
    );
  }
}

export const soundService = new GameSoundService();

// ==========================================
// TROPICAL CALYPSO BGM SYNTHESIZER
// ==========================================

let calypsoAudioCtx: AudioContext | null = null;
let calypsoMasterGain: GainNode | null = null;
let isCalypsoActive = false;
let calypsoIntervalId: number | null = null;
let calypsoStep = 0;
let calypsoNextNoteTime = 0;
let calypsoVolume = 0.35;

const calypsoSubscribers = new Set<
  (playing: boolean, volume: number, step: number) => void
>();

function notifyCalypsoSubscribers() {
  calypsoSubscribers.forEach((cb) => {
    try {
      cb(isCalypsoActive, calypsoVolume, calypsoStep);
    } catch (e) {
      console.error(e);
    }
  });
}

export function subscribeCalypso(
  cb: (playing: boolean, volume: number, step: number) => void
): () => void {
  calypsoSubscribers.add(cb);
  cb(isCalypsoActive, calypsoVolume, calypsoStep);
  return () => {
    calypsoSubscribers.delete(cb);
  };
}

function getCalypsoContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!calypsoAudioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      calypsoAudioCtx = new AudioCtx();
    }
  }
  if (calypsoAudioCtx && calypsoAudioCtx.state === 'suspended') {
    calypsoAudioCtx.resume().catch(() => {});
  }
  return calypsoAudioCtx;
}

function getCalypsoMasterGain(ctx: AudioContext): GainNode {
  if (!calypsoMasterGain) {
    calypsoMasterGain = ctx.createGain();
    calypsoMasterGain.gain.setValueAtTime(calypsoVolume, ctx.currentTime);
    calypsoMasterGain.connect(ctx.destination);
  }
  return calypsoMasterGain;
}

// Steel Pan Voice (bright tropical lead)
function playSteelPanVoice(ctx: AudioContext, freq: number, time: number, dur = 0.35) {
  if (freq <= 0) return;
  const master = getCalypsoMasterGain(ctx);
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2.76, time); // harmonic shimmer

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq * 1.8, time);
  filter.Q.value = 2.4;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.25, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(dur * 1.1, 0.45));

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.5);
  osc2.stop(time + 0.5);
}

// Marimba Voice (warm percussive melody)
function playMarimbaVoice(ctx: AudioContext, freq: number, time: number, dur = 0.15) {
  if (freq <= 0) return;
  const master = getCalypsoMasterGain(ctx);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 0.75, time);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.6, time + 0.05);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq * 1.3, time);
  filter.Q.value = 3.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.18, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.max(0.08, dur));

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc.start(time);
  osc.stop(time + 0.2);
}

// Kalimba / Glockenspiel bell accent
function playKalimbaVoice(ctx: AudioContext, freq: number, time: number, dur = 0.4) {
  if (freq <= 0) return;
  const master = getCalypsoMasterGain(ctx);
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 3, time);

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(800, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.14, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.max(dur, 0.35));

  const osc2Gain = ctx.createGain();
  osc2Gain.gain.setValueAtTime(0.04, time);
  osc2Gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);

  osc1.connect(filter);
  osc2.connect(osc2Gain);
  osc2Gain.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.5);
  osc2.stop(time + 0.5);
}

// Upright Acoustic Bass line
function playBassVoice(ctx: AudioContext, freq: number, time: number, dur = 0.26) {
  if (freq <= 0) return;
  const master = getCalypsoMasterGain(ctx);
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, time);
  filter.Q.value = 1.2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(0.28, time + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + Math.max(0.15, dur));

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc.start(time);
  osc.stop(time + 0.35);
}

// Latin Conga percussions (open & closed tones)
function playCongaVoice(ctx: AudioContext, time: number, highTone = false) {
  const master = getCalypsoMasterGain(ctx);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  const startF = highTone ? 460 : 310;
  const endF = highTone ? 210 : 130;
  osc.frequency.setValueAtTime(startF, time);
  osc.frequency.exponentialRampToValueAtTime(endF, time + 0.05);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(highTone ? 600 : 380, time);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(highTone ? 0.2 : 0.24, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + (highTone ? 0.075 : 0.095));

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc.start(time);
  osc.stop(time + 0.12);
}

// Shaker / Hi-hat groove
function playShakerVoice(ctx: AudioContext, time: number, accent = false) {
  const master = getCalypsoMasterGain(ctx);
  const bufferSize = Math.floor(ctx.sampleRate * 0.035);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(accent ? 7200 : 5800, time);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(accent ? 0.12 : 0.06, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + (accent ? 0.045 : 0.03));

  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  source.start(time);
  source.stop(time + 0.05);
}

// Musical Frequencies (Notes)
const C3 = 130.81,
  D3 = 146.83,
  F3 = 174.61,
  G3 = 196.0,
  A3 = 220.0,
  C4 = 261.63,
  D4 = 293.66,
  E4 = 329.63,
  G4 = 392.0,
  A4 = 440.0,
  B4 = 493.88,
  C5 = 523.25,
  D5 = 587.33,
  E5 = 659.25,
  G5 = 783.99;

// Melodic patterns (64 steps loop, 16th notes @ 120 BPM)
const LEAD_MELODY = [
  G4, 0, C5, 0, E5, 0, D5, C5, A4, 0, G4, 0, E4, 0, G4, 0,
  A4, 0, C5, 0, D5, 0, C5, 0, G4, E4, D4, C4, D4, 0, 0, 0,
  E5, 0, G5, 0, E5, 0, D5, C5, D5, 0, E5, 0, C5, 0, A4, 0,
  C5, 0, G4, 0, A4, 0, B4, G4, C5, 0, C5, 0, 0, 0, 0, 0,
];

const BASS_PATTERN = [
  C3, 0, 0, C3, 0, 0, G3, 0, C3, 0, 0, C3, 0, 0, G3, 0,
  F3, 0, 0, F3, 0, 0, C3, 0, G3, 0, 0, G3, 0, 0, C3, 0,
  C3, 0, 0, C3, 0, 0, A3, 0, D3, 0, 0, D3, 0, 0, G3, 0,
  G3, 0, 0, G3, 0, 0, G3, 0, C3, 0, 0, C3, 0, 0, C3, 0,
];

const MARIMBA_COUNTER = [
  0, E4, 0, G4, 0, C5, 0, 0, 0, D4, 0, A4, 0, G4, 0, 0,
  0, G4, 0, C5, 0, E5, 0, 0, 0, A4, 0, G4, 0, E4, 0, 0,
];

const BELL_ACCENTS = [
  C5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, G5, 0, 0, 0,
  E5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, C5, 0, 0, 0,
];

const CONGA_PATTERN = [
  1, 0, 2, 0, 1, 2, 0, 2, 2, 0, 1, 0, 2, 1, 2, 0,
  1, 0, 2, 0, 1, 2, 0, 2, 2, 0, 1, 0, 2, 2, 1, 2,
];

function scheduleCalypsoTick() {
  if (!isCalypsoActive) return;
  const ctx = getCalypsoContext();
  if (!ctx) return;

  const secondsPerBeat = 60 / 120 / 4; // 16th note at 120 BPM = 0.125s
  const lookahead = 0.12;

  while (calypsoNextNoteTime < ctx.currentTime + lookahead) {
    const step32 = calypsoStep % 32;
    const step64 = calypsoStep % 64;

    // Shakers on every 16th with accents
    const isShakerAccent = step32 % 4 === 2 || step32 % 8 === 0;
    playShakerVoice(ctx, calypsoNextNoteTime, isShakerAccent);

    // Congas
    const congaHit = CONGA_PATTERN[step32];
    if (congaHit === 1) playCongaVoice(ctx, calypsoNextNoteTime, false);
    if (congaHit === 2) playCongaVoice(ctx, calypsoNextNoteTime, true);

    // Bass line
    const bassNote = BASS_PATTERN[step64];
    if (bassNote > 0) playBassVoice(ctx, bassNote, calypsoNextNoteTime, secondsPerBeat * 1.8);

    // Marimba counter melody
    const marimbaNote = MARIMBA_COUNTER[step32];
    if (marimbaNote > 0) playMarimbaVoice(ctx, marimbaNote, calypsoNextNoteTime, secondsPerBeat * 1.2);

    // Steel Pan lead melody
    const leadNote = LEAD_MELODY[step64];
    if (leadNote > 0) playSteelPanVoice(ctx, leadNote, calypsoNextNoteTime, secondsPerBeat * 1.6);

    // Bell chime highlights
    const bellNote = BELL_ACCENTS[step32];
    if (bellNote > 0) playKalimbaVoice(ctx, bellNote, calypsoNextNoteTime, secondsPerBeat * 2.5);

    calypsoNextNoteTime += secondsPerBeat;
    calypsoStep++;
    notifyCalypsoSubscribers();
  }
}

export function startCalypso() {
  const ctx = getCalypsoContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  isCalypsoActive = true;
  calypsoNextNoteTime = ctx.currentTime + 0.05;
  calypsoStep = 0;
  if (calypsoIntervalId !== null) clearInterval(calypsoIntervalId);
  calypsoIntervalId = window.setInterval(scheduleCalypsoTick, 35);
  notifyCalypsoSubscribers();
}

export function stopCalypso() {
  isCalypsoActive = false;
  if (calypsoIntervalId !== null) {
    clearInterval(calypsoIntervalId);
    calypsoIntervalId = null;
  }
  notifyCalypsoSubscribers();
}

export function toggleCalypso(): boolean {
  if (isCalypsoActive) {
    stopCalypso();
  } else {
    startCalypso();
  }
  return isCalypsoActive;
}

export function setCalypsoVolume(vol: number) {
  calypsoVolume = Math.max(0, Math.min(1, vol));
  if (calypsoMasterGain && calypsoAudioCtx) {
    calypsoMasterGain.gain.setValueAtTime(calypsoVolume, calypsoAudioCtx.currentTime);
  }
  notifyCalypsoSubscribers();
}

export function getCalypsoVolume(): number {
  return calypsoVolume;
}

export function isCalypsoPlaying(): boolean {
  return isCalypsoActive;
}
