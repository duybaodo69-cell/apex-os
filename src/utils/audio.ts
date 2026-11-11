/**
 * APEX: Executive RPG Execution OS
 * Procedural Web Audio API Sound Synthesizer
 *
 * File target: src/utils/audio.ts
 *
 * Zero-asset sound generator utilizing standard Web Audio API.
 * Requires no external audio files or network bandwidth.
 * Designed with Dark Executive / Bloomberg Terminal aesthetics.
 */

let sharedAudioContext: AudioContext | null = null;
let soundEnabled = true;

/**
 * Configure global sound toggle (mute/unmute).
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/**
 * Check if global sound is currently enabled.
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Safely retrieve or lazily instantiate the shared AudioContext.
 * Handles server-side rendering (SSR) and environments without Web Audio support.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioCtxClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioCtxClass) return null;

  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new AudioCtxClass();
    } catch {
      return null;
    }
  }

  return sharedAudioContext;
}

/**
 * Pre-warm or resume the AudioContext on user interaction to satisfy browser autoplay policies.
 */
export async function initAudio(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }

  return ctx.state === 'running';
}

/**
 * Helper to synthesize an individual procedural tone with exponential gain envelope.
 */
function playProceduralTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  peakGain: number = 0.15,
  waveType: OscillatorType = 'sine'
): void {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, startTime);

    // Initial silent point (never ramp from or to absolute 0 with exponential ramps)
    gain.gain.setValueAtTime(0.0001, startTime);

    // Smooth attack ramp (3ms) to avoid click/pop artifact
    const attackTime = Math.min(0.004, duration * 0.1);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(peakGain, 0.0001),
      startTime + attackTime
    );

    // Exponential decay to silent floor
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);

    // Disconnect nodes upon finish to prevent memory retention
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Safe no-op on teardown
      }
    };
  } catch {
    // Graceful error boundary for unsupported audio operations
  }
}

/**
 * Ensure AudioContext is in running state before dispatching sounds.
 */
async function prepareContext(): Promise<AudioContext | null> {
  if (!soundEnabled) return null;

  const ctx = getAudioContext();
  if (!ctx) return null;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }

  return ctx;
}

/**
 * Play a celebratory multi-tone ascending arpeggio on Level-Up or Boss Victory.
 * Frequencies: C5 -> E5 -> G5 -> B5 -> C6 resolution with harmonic shimmer.
 */
export async function playLevelUp(): Promise<void> {
  const ctx = await prepareContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.14, gain: 0.15 }, // C5
    { freq: 659.25, time: 0.08, dur: 0.14, gain: 0.16 }, // E5
    { freq: 783.99, time: 0.16, dur: 0.15, gain: 0.17 }, // G5
    { freq: 987.77, time: 0.24, dur: 0.16, gain: 0.18 }, // B5
    { freq: 1046.5, time: 0.32, dur: 0.45, gain: 0.22 }, // C6
  ];

  for (const note of notes) {
    // Primary fundamental tone
    playProceduralTone(
      ctx,
      note.freq,
      now + note.time,
      note.dur,
      note.gain,
      'sine'
    );
    // Harmonizing triangle overtone for executive warmth
    playProceduralTone(
      ctx,
      note.freq * 2,
      now + note.time,
      note.dur * 0.65,
      note.gain * 0.25,
      'triangle'
    );
  }
}

/**
 * Play a clear resonant chime / bell tone when a deep-work timer finishes.
 * Model: Boardroom tubular bell with dual harmonic overtones.
 */
export async function playTimerFinish(): Promise<void> {
  const ctx = await prepareContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Fundamental: 880 Hz (A5), long resonant decay (1.8s)
  playProceduralTone(ctx, 880, now, 1.8, 0.22, 'sine');

  // Harmonic overtone: 1760 Hz (A6), medium decay (1.0s)
  playProceduralTone(ctx, 1760, now, 1.0, 0.08, 'sine');

  // Inharmonic bell chime: 2420 Hz (metallic bell strike), fast decay (0.5s)
  playProceduralTone(ctx, 2420, now, 0.5, 0.04, 'sine');
}

/**
 * Play a subtle high-frequency crisp click on button interaction or tab navigation.
 * Model: Mechanical Bloomberg keyboard switch click.
 */
export async function playClick(): Promise<void> {
  const ctx = await prepareContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Transient downward pitch sweep from 2400 Hz down to 600 Hz over 15ms
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

    // Sharp, low-amplitude envelope (total 20ms duration)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Safe no-op
      }
    };
  } catch {
    // Safe error boundary
  }
}

/**
 * Play a low Bloomberg warning buzz/beep (e.g., Rule of 3 limit hit, invalid input).
 * Model: Terminal risk alert dual-pulse.
 */
export async function playAlert(): Promise<void> {
  const ctx = await prepareContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Pulse 1: 220 Hz (A3), 90ms duration
  playProceduralTone(ctx, 220, now, 0.09, 0.14, 'triangle');

  // Pulse 2: 174.61 Hz (F3), 120ms duration
  playProceduralTone(ctx, 174.61, now + 0.12, 0.12, 0.14, 'triangle');
}

/**
 * Internal helper for testing: resets the shared AudioContext instance.
 */
export function _resetAudioContextForTesting(): void {
  sharedAudioContext = null;
}
