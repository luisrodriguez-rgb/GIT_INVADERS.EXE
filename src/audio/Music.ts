import { AudioEngine } from './AudioEngine';
import { BossGenome } from '../github/Types';

export class Music {
  private static isPlaying: boolean = false;
  private static intervalId: number | null = null;
  private static currentStep: number = 0;
  private static bpm: number = 116;
  private static detuneCents: number = 0;
  private static hasDistortion: boolean = false;
  private static isDistributed: boolean = false;

  // 16-step bassline pattern in D Minor (frequencies in Hz)
  // D2 (73.4), D2, F2 (87.3), D2, G2 (98.0), D2, A2 (110.0), C3 (130.8)
  private static readonly BASS_PATTERN = [
    73.42, 73.42, 87.31, 73.42, 98.0, 73.42, 110.0, 130.81,
    73.42, 73.42, 110.0, 98.0, 87.31, 73.42, 65.41, 73.42,
  ];

  public static setBpm(newBpm: number): void {
    this.bpm = Math.max(90, Math.min(170, newBpm));
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  /**
   * Adapts the procedural audio synthesizer in real-time according to Boss DNA.
   */
  public static applyBossGenome(genome: BossGenome): void {
    this.bpm = genome.audioBpm || 128;
    this.detuneCents = genome.audioDetuneCents || 0;
    this.hasDistortion = !!genome.audioDistortion;
    this.isDistributed = genome.seed.length > 0 && genome.hull.includes('DISTRIBUTED');

    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  public static resetToStandard(): void {
    this.bpm = 116;
    this.detuneCents = 0;
    this.hasDistortion = false;
    this.isDistributed = false;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  public static start(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;

    const stepDurationMs = (60 / this.bpm / 2) * 1000; // 16th notes
    this.intervalId = window.setInterval(() => {
      this.playStep();
    }, stepDurationMs);
  }

  public static stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
  }

  private static playStep(): void {
    const engine = AudioEngine.getInstance();
    const ctx = engine.getContext();
    const dest = engine.getMusicDestination();
    if (!ctx || !dest || engine.isMuted || !this.isPlaying) return;

    const freq = this.BASS_PATTERN[this.currentStep % this.BASS_PATTERN.length];
    const step = this.currentStep++;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Synthwave / Cyberpunk bass pluck
    osc.type = this.hasDistortion ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    if (this.detuneCents !== 0) {
      osc.detune.setValueAtTime(this.detuneCents, now);
    }

    filter.type = 'lowpass';
    const filterFreq = this.hasDistortion ? 580 : 320;
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.frequency.exponentialRampToValueAtTime(70, now + 0.16);
    filter.Q.setValueAtTime(this.hasDistortion ? 8 : 4, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.19);

    // Syncopated high-frequency cyber hat for polyrhythmic / high-bpm Bosses
    if ((this.isDistributed || this.bpm >= 140) && step % 2 === 1) {
      const noiseOsc = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      noiseOsc.type = 'triangle';
      noiseOsc.frequency.setValueAtTime(1400, now);
      noiseGain.gain.setValueAtTime(0.04, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      noiseOsc.connect(noiseGain);
      noiseGain.connect(dest);
      noiseOsc.start(now);
      noiseOsc.stop(now + 0.06);
    }
  }
}
