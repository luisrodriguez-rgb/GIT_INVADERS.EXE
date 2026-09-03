import { AudioEngine } from './AudioEngine';

export class SFX {
  private static noiseBuffer: AudioBuffer | null = null;

  /**
   * Pre-generates a 1-second white noise buffer for realistic procedural explosions
   */
  private static getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer || this.noiseBuffer.sampleRate !== ctx.sampleRate) {
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  /**
   * Synthesizes laser blaster sound
   */
  public static playLaser(type: 'player' | 'enemy' | 'boss' | 'beam'): void {
    const engine = AudioEngine.getInstance();
    const ctx = engine.getContext();
    const dest = engine.getSFXDestination();
    if (!ctx || !dest || engine.isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(dest);

    const now = ctx.currentTime;

    if (type === 'player') {
      // Crisp 80s arcade laser chirp (880Hz down to 180Hz)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'enemy') {
      // Slower, lower-pitched invader pulse (320Hz down to 90Hz)
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'boss') {
      // Deep ominous plasma shot (440Hz down to 50Hz)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'beam') {
      // Overdrive: GIT PUSH --FORCE super laser rumble
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.8);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.start(now);
      osc.stop(now + 0.86);
    }
  }

  /**
   * Synthesizes procedural explosion using filtered white noise + sub-bass punch
   */
  public static playExplosion(size: 'small' | 'medium' | 'boss'): void {
    const engine = AudioEngine.getInstance();
    const ctx = engine.getContext();
    const dest = engine.getSFXDestination();
    if (!ctx || !dest || engine.isMuted) return;

    const now = ctx.currentTime;
    const duration = size === 'boss' ? 1.2 : size === 'medium' ? 0.45 : 0.25;

    // 1. Noise channel (White noise with low-pass decay)
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(size === 'boss' ? 1200 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(size === 'boss' ? 0.7 : 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);

    noiseSource.start(now);
    noiseSource.stop(now + duration + 0.05);

    // 2. Sub-bass thump (oscillator drop)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(size === 'boss' ? 180 : 120, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + duration * 0.7);

    subGain.gain.setValueAtTime(size === 'boss' ? 0.6 : 0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);

    subOsc.connect(subGain);
    subGain.connect(dest);

    subOsc.start(now);
    subOsc.stop(now + duration * 0.75);
  }

  /**
   * Synthesizes metallic shield deflection ping
   */
  public static playShieldHit(): void {
    const engine = AudioEngine.getInstance();
    const ctx = engine.getContext();
    const dest = engine.getSFXDestination();
    if (!ctx || !dest || engine.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Synthesizes power-up pickup chime
   */
  public static playPowerup(): void {
    const engine = AudioEngine.getInstance();
    const ctx = engine.getContext();
    const dest = engine.getSFXDestination();
    if (!ctx || !dest || engine.isMuted) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const noteOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      noteOsc.type = 'triangle';
      noteOsc.frequency.setValueAtTime(freq, now + idx * 0.05);

      noteGain.gain.setValueAtTime(0.25, now + idx * 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

      noteOsc.connect(noteGain);
      noteGain.connect(dest);

      noteOsc.start(now + idx * 0.05);
      noteOsc.stop(now + idx * 0.05 + 0.16);
    });
  }

  /**
   * Synthesizes Boss Warning Alarm Siren
   */
  public static playBossWarning(): void {
    const engine = AudioEngine.getInstance();
    const ctx = engine.getContext();
    const dest = engine.getSFXDestination();
    if (!ctx || !dest || engine.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Modulate pitch between 440 and 660 Hz
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.25);
    osc.frequency.linearRampToValueAtTime(440, now + 0.5);
    osc.frequency.linearRampToValueAtTime(660, now + 0.75);
    osc.frequency.linearRampToValueAtTime(440, now + 1.0);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 1.15);
  }
}
