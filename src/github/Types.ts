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

export type FormationType =
  | 'grid'
  | 'v_chevron'
  | 'diamond'
  | 'swarm'
  | 'pincer'
  | 'commit_grid'
  | 'delta_wing'
  | 'constellation_scatter'
  | 'flanking_helix';

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

export type BossArchetype =
  | 'commit_core'
  | 'the_fortress'
  | 'issue_swarm'
  | 'dependency_hydra'
  | 'merge_conflict'
  | 'contributor_overlord'
  | 'branchlord'
  | 'rebase_phantom'
  | 'security_sentinel'
  | 'code_abyss';

export type BossMutation =
  | 'OVERCLOCKED'
  | 'RECURSIVE'
  | 'CORRUPTED'
  | 'FORKED'
  | 'UNSTABLE'
  | 'SECURED'
  | 'LEGACY'
  | 'DISTRIBUTED';

export type SecondaryMutation =
  | 'STEALTH'
  | 'REGENERATIVE'
  | 'ADAPTIVE'
  | 'VOLATILE'
  | 'CRYSTALLIZED';

export interface MutationStack {
  primary: BossMutation;
  secondary?: SecondaryMutation;
  languageModifier: string;
  synergyTitle?: string;
  compositeTitle: string;
}

export interface WhyReason {
  metric: string;
  value: string;
  result: string;
  icon?: string;
}

export interface RepositoryFingerprint {
  activity: number;       // 0 - 100
  collaboration: number;  // 0 - 100
  complexity: number;     // 0 - 100
  instability: number;    // 0 - 100
  legacy: number;         // 0 - 100
  diversity: number;      // 0 - 100
  summary: string;
  whyReasons: WhyReason[];
}

export interface BossCodexEntry {
  archetype: BossArchetype;
  title: string;
  codeNumber: string;
  seed: string;
  mutation: BossMutation;
  secondaryMutation?: SecondaryMutation;
  language: string;
  repoName: string;
  defeatedAt: number;
  threatLevel: number;
}

export interface RepositoryArtifact {
  repoId: string;
  name: string;
  bonusXpPct: number;
  bonusPerk: string;
  unlockedAt: number;
  flavorText: string;
}

export interface CombatMemory {
  attacksUsed: number;
  playerPositions: number[];
  playerPositionBias: 'left' | 'center' | 'right';
  shieldUsageCount: number;
  damageTakenByPlayer: number;
  successfulCounters: number;
  learningPhase: 'observing' | 'pattern_detected' | 'counter_preparing' | 'counter_active';
  phaseTimer: number;
  telemetryLines: string[];
}

export interface BossAbility {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BossArchetypeData {
  archetype: BossArchetype;
  codeNumber: string;
  title: string;
  canonicalRepo: string;
  profileDescription: string;
  specialStatName: string;
  specialStatValue: number;
  baseHpRating: number;
  shieldRating: number;
  attackRating: number;
  speedRating: number;
  abilities: BossAbility[];
  conceptQuote: string;
  finalPhaseName: string;
}

export interface BehaviorMatrixEntry {
  visual: string;
  combat: string;
  spawn: string;
  audio: string;
}

export interface AudioDNA {
  bpm: number;
  baseFrequency: number;
  detune: number;
  distortion: boolean;
  density: number;
  rhythmComplexity: number;
  glitchIntensity: number;
  scaleType?: string;
  aggression?: number;
}

export interface BossGenome {
  seed: string; // Deterministic 6-char hex string (e.g. 8F4A91)
  hull: string;
  weapon: string;
  movement: string;
  shield: string;
  spawn: string;
  phases: number;
  audioBpm: number;
  audioDetuneCents: number;
  audioDistortion: boolean;
  audioDna?: AudioDNA;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  ratings: {
    threat: number;
    complexity: number;
    swarm: number;
    armor: number;
    attack: number;
  };
  behaviorMatrix: BehaviorMatrixEntry;
}

export interface MissionDirective {
  id: string;
  waveTarget: 'W1' | 'W2' | 'W3' | 'BOSS';
  title: string;
  description: string;
  rewardText: string;
  isCompleted: boolean;
}

export interface MissionReward {
  id: string;
  name: string;
  type: 'currency' | 'perk' | 'artifact' | 'badge';
  value: string;
  icon: string;
  description: string;
}

export interface BossBlueprint {
  repoName: string;
  coreName: string;
  language: string;
  languageColor: string;
  archetype: BossArchetype;
  mutation?: BossMutation;
  secondaryMutation?: SecondaryMutation;
  mutationStack?: MutationStack;
  modifierTitle?: string;
  archetypeData: BossArchetypeData;
  genome: BossGenome;
  audioDna?: AudioDNA;
  directives: MissionDirective[];
  rewards: MissionReward[];
  fingerprint?: RepositoryFingerprint;
  whyReasons?: WhyReason[];
  chassisType?: 'titan_skull' | 'dreadnought_carrier' | 'octo_destroyer' | 'quantum_citadel' | 'cyber_sentinel' | BossArchetype;
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
  sourceType: 'profile' | 'repository' | 'chaos' | 'citadel';
  targetIdentifier: string; // e.g. 'luisrodriguez-rgb' or 'luisrodriguez-rgb/sketion' or 'CODEBASE.UNIVERSE'
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
  branches?: string[];
}

export interface LanguageBar {
  name: string;
  pct: number;
  color: string;
}

export interface RepositoryDNA {
  id: string;
  name: string;
  author: string;
  description: string;
  commits: number;
  pullRequests: number;
  issues: number;
  contributors: number;
  threatLevel: number;
  threatRating: ThreatLevelRating;
  languages: LanguageBar[];
  primaryLanguage: string;
  accentColor: string;
  bossCoreName: string;
}

export interface WaveDNA {
  totalWaves: number;
  formations: FormationType[];
  speedBase: number;
  dropSpeed: number;
  prRatio: number;
  issueRatio: number;
  conflictRatio: number;
  dependencyRatio: number;
  formationName?: string;
  rationale?: string;
}

export interface GameDNA {
  version: string;
  seed: string;
  repository: RepositoryDNA;
  ship: {
    hullType: number;
    wingType: number;
    engineType: number;
    armor: number;
    speed: number;
    fireRate: number;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  waves: WaveDNA;
  boss: BossBlueprint;
  audio: AudioDNA;
}

export type GameMode = 'profile' | 'repository' | 'chaos' | 'citadel';
