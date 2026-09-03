/**
 * Strict TypeScript types for GIT_INVADERS.EXE
 * Decoupled data contracts ensuring the game engine never depends directly on GitHub API shape.
 */

export interface GitHubMetrics {
  totalCommits: number;
  pullRequests: number;
  openIssues: number;
  contributors: number;
  languages: string[];
  primaryLanguage: string;
  streakDays: number;
  recentActivityScore: number; // 0 - 100
  repoCount: number;
  stars: number;
}

export type FormationType = 'commit_grid' | 'delta_wing' | 'constellation_scatter' | 'flanking_helix';

export type ThreatLevelRating = 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'CHAOS_MAX';

export interface SampleCommit {
  sha: string;
  message: string;
  author: string;
}

export interface SamplePR {
  number: number;
  title: string;
  author: string;
}

export interface SampleIssue {
  number: number;
  title: string;
}

export interface BossPhaseConfig {
  phaseNumber: number;
  name: string;
  hpThresholdPercent: number; // e.g. 100, 65, 30
  attackPattern: 'salvo' | 'merge_matrix_lasers' | 'cicd_overdrive_bombers';
  speedMultiplier: number;
  description: string;
}

export interface BossBlueprint {
  repoName: string;
  coreName: string;
  language: string;
  languageColor: string;
  threatIndex: number; // 0 - 100
  maxHp: number;
  cannons: number;
  shieldLayers: number;
  fireRateSeconds: number;
  phases: BossPhaseConfig[];
  statsDisplay: {
    commits: number;
    contributors: number;
    pullRequests: number;
    issues: number;
    languagesCount: number;
  };
}

export interface NormalizedGameData {
  sourceType: 'profile' | 'repository' | 'chaos';
  targetIdentifier: string; // e.g. 'luisrodriguez-rgb' or 'luisrodriguez-rgb/sketion' or 'CHAOS // MATRIX'
  authorName: string;
  repoName: string;
  primaryLanguage: string;
  languageColor: string;

  // Normalized gameplay values (clamped and mathematically balanced)
  threatLevel: number; // 0 - 100
  threatRating: ThreatLevelRating;
  threatMultiplier: number; // 1.0x to 3.5x for score/XP

  totalWaves: number;
  waveFormations: FormationType[];

  // Enemy density ratios per wave
  prArmoredRatio: number; // 0.10 to 0.35
  issueBomberRatio: number; // 0.05 to 0.25
  enemySpeedBase: number; // Pixels per second
  enemyDropSpeed: number;

  // Code Boss configuration
  bossBlueprint: BossBlueprint;

  // Realistic sample data for terminal logs and particle text
  commits: SampleCommit[];
  pullRequests: SamplePR[];
  issues: SampleIssue[];
}

export type GameMode = 'profile' | 'repository' | 'chaos';
