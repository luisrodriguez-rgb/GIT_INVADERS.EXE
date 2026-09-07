import { BossBlueprint, BossPhaseConfig, RepositoryDNA } from '../github/Types';

export interface NormalizedBossMetrics {
  activityIntensity: number; // Commits normalized (0.0 to 1.0)
  collaborationComplexity: number; // PRs normalized (0.0 to 1.0)
  instability: number; // Issues normalized (0.0 to 1.0)
  swarmPotential: number; // Contributors normalized (0.0 to 1.0)
  visualIdentity: string; // Primary language color hex
  attackTempo: number; // Firing cadence interval (seconds)
}

export class BossGenerator {
  /**
   * Normalizes raw repository metrics into balanced gameplay dynamics:
   * Commits -> activityIntensity -> Scale / HP pool
   * PRs -> collaborationComplexity -> Shield deflector layers
   * Issues -> instability -> Cannon batteries & projectile cadence
   * Contributors -> swarmPotential -> Drone swarm spawn rate
   * Languages -> visualIdentity -> Palette & phase styling
   * Threat Level -> attackTempo -> Combat speed & aggression
   */
  public static calculateMetrics(dna: RepositoryDNA): NormalizedBossMetrics {
    const primaryLang = dna.languages[0] || { name: 'TypeScript', color: '#38bdf8', pct: 100 };
    return {
      activityIntensity: Math.min(1.0, Math.log1p(dna.commits) / Math.log1p(3000)),
      collaborationComplexity: Math.min(1.0, Math.log1p(dna.pullRequests) / Math.log1p(100)),
      instability: Math.min(1.0, Math.log1p(dna.issues) / Math.log1p(80)),
      swarmPotential: Math.min(1.0, dna.contributors / 15),
      visualIdentity: primaryLang.color,
      attackTempo: Math.max(0.65, Number((2.2 - (dna.threatLevel / 100) * 1.2).toFixed(2))),
    };
  }

  /**
   * Generates a fully procedural BossBlueprint directly from Repository DNA.
   */
  public static generateFromDNA(dna: RepositoryDNA): BossBlueprint {
    const metrics = this.calculateMetrics(dna);
    const baseHp = Math.round(180 + metrics.activityIntensity * 1200);
    const shieldLayers = Math.max(1, Math.min(4, Math.round(1 + metrics.collaborationComplexity * 3)));
    const cannons = Math.max(2, Math.min(6, Math.round(2 + metrics.instability * 4)));
    const fireRateSeconds = metrics.attackTempo;

    const primaryLang = dna.languages[0] || { name: 'TypeScript', color: '#38bdf8', pct: 100 };

    const phases: BossPhaseConfig[] = [
      {
        phaseNumber: 1,
        name: 'CORE BREACH',
        hpThresholdPercent: 100,
        attackPattern: 'salvo',
        speedMultiplier: 1.0,
        description: 'Standard laser cannons and defensive patrol trajectory.',
      },
      {
        phaseNumber: 2,
        name: 'DEPENDENCY HELL',
        hpThresholdPercent: 65,
        attackPattern: 'merge_matrix_lasers',
        speedMultiplier: 1.25,
        description: 'Rotating deflector shield matrices and cross-fire lasers.',
      },
      {
        phaseNumber: 3,
        name: 'MERGE CONFLICT',
        hpThresholdPercent: 35,
        attackPattern: 'cicd_overdrive_bombers',
        speedMultiplier: 1.5,
        description: 'Overdrive red core with cluster bombs and erratic tracking.',
      },
      {
        phaseNumber: 4,
        name: 'FINAL PUSH',
        hpThresholdPercent: 15,
        attackPattern: 'cicd_overdrive_bombers',
        speedMultiplier: 1.8,
        description: 'Desperation bullet curtain and maximum thrust velocity.',
      },
    ];

    // Derive boss chassis archetype
    let chassisType: 'titan_skull' | 'dreadnought_carrier' | 'octo_destroyer' | 'quantum_citadel' | 'cyber_sentinel' = 'octo_destroyer';
    const nameLower = dna.name.toLowerCase();
    if (nameLower.includes('citadel') || dna.languages.length >= 4) {
      chassisType = 'quantum_citadel';
    } else if (dna.commits > 400 || dna.pullRequests > 25) {
      chassisType = 'dreadnought_carrier';
    } else if (dna.issues > 15 || dna.threatLevel >= 80) {
      chassisType = 'titan_skull';
    } else if (nameLower.includes('sketion') || nameLower.includes('git') || dna.contributors >= 3) {
      chassisType = 'octo_destroyer';
    } else {
      chassisType = 'cyber_sentinel';
    }

    return {
      repoName: dna.name,
      coreName: `${dna.name.toUpperCase()} CORE`,
      language: primaryLang.name,
      languageColor: primaryLang.color,
      chassisType,
      threatIndex: dna.threatLevel,
      maxHp: baseHp,
      cannons,
      shieldLayers,
      fireRateSeconds,
      phases,
      statsDisplay: {
        commits: dna.commits,
        contributors: dna.contributors,
        pullRequests: dna.pullRequests,
        issues: dna.issues,
        languagesCount: dna.languages.length,
      },
    };
  }
}
