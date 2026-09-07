import {
  GitHubMetrics,
  NormalizedGameData,
  BossBlueprint,
  FormationType,
  ThreatLevelRating,
  SampleCommit,
  SamplePR,
  SampleIssue,
} from './Types';

/**
 * Maps popular programming languages to retro cyber/arcade hex colors
 */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#00e5ff',
  JavaScript: '#ffd600',
  Python: '#00ff66',
  Rust: '#ff7043',
  Go: '#29b6f6',
  HTML: '#ff5252',
  CSS: '#7c4dff',
  C: '#b0bec5',
  'C++': '#ec407a',
  Java: '#ff9100',
  Ruby: '#ff1744',
  PHP: '#7e57c2',
  Swift: '#ff6d00',
  Kotlin: '#ab47bc',
  Shell: '#69f0ae',
  Unknown: '#00e5ff',
};

export class DataNormalizer {
  /**
   * Clamps a value between min and max
   */
  private static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Logarithmic scaling utility
   */
  private static logScale(value: number, refValue: number, minOut: number, maxOut: number): number {
    if (value <= 0) return minOut;
    const factor = Math.min(1, Math.log1p(value) / Math.log1p(refValue));
    return minOut + factor * (maxOut - minOut);
  }

  /**
   * Calculates Threat Level (0-100) and rating category
   */
  public static calculateThreat(metrics: GitHubMetrics): { level: number; rating: ThreatLevelRating; multiplier: number } {
    // Weighted formula combining commits, streaks, PRs, and issues
    const commitScore = Math.min(40, (Math.log1p(metrics.totalCommits) / Math.log1p(5000)) * 40);
    const prScore = Math.min(25, (Math.log1p(metrics.pullRequests) / Math.log1p(150)) * 25);
    const streakScore = Math.min(20, (metrics.streakDays / 30) * 20);
    const issueScore = Math.min(15, (Math.log1p(metrics.openIssues) / Math.log1p(100)) * 15);

    const rawLevel = Math.round(commitScore + prScore + streakScore + issueScore);
    const level = this.clamp(rawLevel, 15, 100);

    let rating: ThreatLevelRating = 'LOW';
    if (level >= 90) rating = 'CHAOS_MAX';
    else if (level >= 75) rating = 'CRITICAL';
    else if (level >= 55) rating = 'HIGH';
    else if (level >= 38) rating = 'ELEVATED';
    else if (level >= 25) rating = 'GUARDED';

    // Multiplier for score / XP
    const multiplier = Number((1.0 + (level / 100) * 2.5).toFixed(2));

    return { level, rating, multiplier };
  }

  /**
   * Generates procedural formation sequence based on metrics
   */
  public static determineFormations(waveCount: number, metrics: GitHubMetrics): FormationType[] {
    const formations: FormationType[] = [];
    const pool: FormationType[] = ['grid'];

    if (metrics.totalCommits > 50 || metrics.pullRequests > 5) {
      pool.push('v_chevron');
    }
    if (metrics.openIssues > 5 || metrics.contributors > 2) {
      pool.push('diamond');
    }
    if (metrics.streakDays > 3 || metrics.totalCommits > 120) {
      pool.push('swarm');
    }
    if (metrics.pullRequests > 15 || metrics.recentActivityScore > 50) {
      pool.push('pincer');
    }

    for (let i = 0; i < waveCount; i++) {
      if (i === 0) {
        formations.push('grid'); // Wave 1 always clean classic Space Invaders grid
      } else {
        formations.push(pool[i % pool.length]);
      }
    }

    return formations;
  }

  /**
   * Normalizes raw metrics into balanced Boss Blueprint
   */
  public static generateBossBlueprint(
    repoName: string,
    metrics: GitHubMetrics,
    threatLevel: number
  ): BossBlueprint {
    const lang = metrics.primaryLanguage || 'TypeScript';
    const langColor = LANGUAGE_COLORS[lang] || '#00e5ff';

    // Boss HP: 1,000 to 3,400 HP (mathematically bounded)
    const maxHp = Math.round(this.logScale(metrics.totalCommits, 4000, 1000, 3400));

    // Cannons: 2 to 6 cannons
    const cannons = this.clamp(Math.round(2 + Math.log2(metrics.contributors + 1)), 2, 6);

    // Shield layers: 1 to 4 layers
    const shieldLayers = this.clamp(Math.floor(Math.sqrt(metrics.pullRequests) * 0.7), 1, 4);

    // Fire rate in seconds (faster for higher threat)
    const fireRateSeconds = Number(this.clamp(2.2 - (threatLevel / 100) * 1.1, 0.9, 2.2).toFixed(2));

    let chassisType: 'titan_skull' | 'dreadnought_carrier' | 'octo_destroyer' | 'quantum_citadel' | 'cyber_sentinel' = 'octo_destroyer';
    const repoLower = repoName.toLowerCase();
    if (repoLower.includes('citadel') || metrics.languages.length >= 4) {
      chassisType = 'quantum_citadel';
    } else if (metrics.totalCommits > 300 || metrics.pullRequests > 20) {
      chassisType = 'dreadnought_carrier';
    } else if (metrics.openIssues > 10 || threatLevel >= 75) {
      chassisType = 'titan_skull';
    } else if (repoLower.includes('sketion') || repoLower.includes('git') || metrics.contributors >= 3) {
      chassisType = 'octo_destroyer';
    } else {
      chassisType = 'cyber_sentinel';
    }

    return {
      repoName,
      coreName: `${repoName.toUpperCase()} // CORE`,
      language: lang,
      languageColor: langColor,
      chassisType,
      threatIndex: threatLevel,
      maxHp,
      cannons,
      shieldLayers,
      fireRateSeconds,
      phases: [
        {
          phaseNumber: 1,
          name: 'STAGING CORE',
          hpThresholdPercent: 100,
          attackPattern: 'salvo',
          speedMultiplier: 1.0,
          description: 'Frontal plasma bursts with cadence calibrated to repository commits.',
        },
        {
          phaseNumber: 2,
          name: 'MERGE CONFLICT MATRIX',
          hpThresholdPercent: 65,
          attackPattern: 'merge_matrix_lasers',
          speedMultiplier: 1.35,
          description: 'PR shield rotation activated. Diagonal intersecting laser grid deployed.',
        },
        {
          phaseNumber: 3,
          name: 'CI/CD PIPELINE OVERDRIVE',
          hpThresholdPercent: 30,
          attackPattern: 'cicd_overdrive_bombers',
          speedMultiplier: 1.75,
          description: 'Terminal alert: Rapid dive-bombing bug swarms and bullet spray.',
        },
      ],
      statsDisplay: {
        commits: metrics.totalCommits,
        contributors: metrics.contributors,
        pullRequests: metrics.pullRequests,
        issues: metrics.openIssues,
        languagesCount: Math.max(1, metrics.languages.length),
      },
    };
  }

  /**
   * Main normalizer transforming raw input into game-ready NormalizedGameData
   */
  public static normalize(
    sourceType: 'profile' | 'repository' | 'chaos' | 'citadel',
    targetIdentifier: string,
    authorName: string,
    repoName: string,
    metrics: GitHubMetrics,
    sampleCommits: SampleCommit[] = [],
    samplePRs: SamplePR[] = [],
    sampleIssues: SampleIssue[] = []
  ): NormalizedGameData {
    const threat = this.calculateThreat(metrics);
    const totalWaves = sourceType === 'chaos' ? 6 : sourceType === 'citadel' ? 4 : Math.min(5, Math.max(3, metrics.repoCount || 4));
    const formations = this.determineFormations(totalWaves, metrics);
    const bossBlueprint = this.generateBossBlueprint(repoName, metrics, threat.level);

    // Enemy composition ratios
    const prArmoredRatio = Number(
      this.clamp(0.12 + (metrics.pullRequests / (metrics.pullRequests + 40)) * 0.22, 0.12, 0.34).toFixed(2)
    );
    const issueBomberRatio = Number(
      this.clamp(0.06 + (metrics.openIssues / (metrics.openIssues + 50)) * 0.18, 0.06, 0.24).toFixed(2)
    );

    // Movement speeds (pixels per second)
    const enemySpeedBase = Math.round(this.clamp(55 + (threat.level / 100) * 45, 55, 100));
    const enemyDropSpeed = Math.round(this.clamp(14 + (threat.level / 100) * 12, 14, 26));

    const lang = metrics.primaryLanguage || 'TypeScript';
    const langColor = LANGUAGE_COLORS[lang] || '#00e5ff';

    return {
      sourceType,
      targetIdentifier,
      authorName,
      repoName,
      primaryLanguage: lang,
      languageColor: langColor,
      threatLevel: threat.level,
      threatRating: threat.rating,
      threatMultiplier: threat.multiplier,
      totalWaves,
      waveFormations: formations,
      prArmoredRatio,
      issueBomberRatio,
      enemySpeedBase,
      enemyDropSpeed,
      bossBlueprint,
      commits: sampleCommits,
      pullRequests: samplePRs,
      issues: sampleIssues,
    };
  }
}
