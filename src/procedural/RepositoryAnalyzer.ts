import {
  RepositoryDNA,
  RepositoryFingerprint,
  WhyReason,
  BossArchetypeData,
  MutationStack,
} from '../github/Types';

export class RepositoryAnalyzer {
  /**
   * Computes a 6-dimensional mathematical fingerprint from repository metrics.
   */
  public static computeFingerprint(dna: RepositoryDNA): RepositoryFingerprint {
    const langNames = dna.languages.map((l) => l.name.toLowerCase());
    const isLegacy = langNames.some((l) =>
      ['c', 'c++', 'assembly', 'fortran', 'makefile', 'cobol', 'pascal'].includes(l)
    );

    // 1. Activity (Commits velocity & density)
    const activity = Math.min(100, Math.round((dna.commits / 3000) * 100));

    // 2. Collaboration (PRs + Contributors fleet)
    const collaboration = Math.min(
      100,
      Math.round((dna.contributors / 15) * 50 + (dna.pullRequests / 50) * 50)
    );

    // 3. Complexity (Stack breadth + threat rating)
    const complexity = Math.min(
      100,
      Math.round(dna.languages.length * 18 + dna.threatLevel * 0.35)
    );

    // 4. Instability (Issue volume & friction)
    const instability = Math.min(
      100,
      Math.round((dna.issues / 45) * 75 + (dna.pullRequests > 30 ? 25 : 10))
    );

    // 5. Legacy (Historical depth & low-level languages)
    const legacy = Math.min(
      100,
      Math.round((isLegacy ? 60 : 15) + (dna.commits > 2000 ? 40 : (dna.commits / 2000) * 30))
    );

    // 6. Diversity (Language spread & distribution entropy)
    const diversity = Math.min(
      100,
      Math.round(dna.languages.length * 22 + (dna.languages[0]?.pct < 60 ? 30 : 10))
    );

    const summary = `${dna.name.toUpperCase()} // ACT:${activity}% COL:${collaboration}% CMP:${complexity}% INS:${instability}%`;

    return {
      activity,
      collaboration,
      complexity,
      instability,
      legacy,
      diversity,
      summary,
      whyReasons: [],
    };
  }

  /**
   * Synthesizes 3-5 causal why-reasons explaining how repository metrics shaped the boss.
   */
  public static generateWhyReasons(
    dna: RepositoryDNA,
    archetypeData: BossArchetypeData,
    mutationStack: MutationStack
  ): WhyReason[] {
    const reasons: WhyReason[] = [];

    // Reason 1: Archetype genesis
    if (archetypeData.archetype === 'commit_core') {
      reasons.push({
        metric: 'COMMIT DENSITY',
        value: `${dna.commits.toLocaleString()} COMMITS`,
        result: `${archetypeData.title} (High spawn rate & orbital drones)`,
        icon: '[#]',
      });
    } else if (archetypeData.archetype === 'the_fortress') {
      reasons.push({
        metric: 'REVIEW BARRIER',
        value: `${dna.pullRequests} PRs`,
        result: `${archetypeData.title} (Reinforced deflectors & armor)`,
        icon: '[#]',
      });
    } else if (archetypeData.archetype === 'issue_swarm') {
      reasons.push({
        metric: 'BUG VOLUME',
        value: `${dna.issues} ISSUES`,
        result: `${archetypeData.title} (Living swarm ballistic cluster)`,
        icon: '(!)',
      });
    } else if (archetypeData.archetype === 'dependency_hydra') {
      reasons.push({
        metric: 'DEPENDENCY GRAPH',
        value: `${dna.languages.length} MODULES`,
        result: `${archetypeData.title} (Interlocking damage links)`,
        icon: '<*>',
      });
    } else {
      reasons.push({
        metric: 'METRIC ANCHOR',
        value: `${dna.commits}c / ${dna.pullRequests}pr / ${dna.issues}iss`,
        result: `${archetypeData.title} (${archetypeData.specialStatName} ${archetypeData.specialStatValue}%)`,
        icon: '[*]',
      });
    }

    // Reason 2: Primary mutation genesis
    reasons.push({
      metric: 'THREAT VECTOR',
      value: `THREAT ${dna.threatLevel}%`,
      result: `PRIMARY: ${mutationStack.primary}`,
      icon: '<!>',
    });

    // Reason 3: Secondary mutation (if unlocked)
    if (mutationStack.secondary) {
      reasons.push({
        metric: 'SECONDARY PROTOCOL',
        value: `OVERLOAD > 65%`,
        result: `MUTATION: ${mutationStack.secondary} (${mutationStack.synergyTitle || 'DUAL SYNERGY'})`,
        icon: '[+]',
      });
    }

    // Reason 4: Language stack modifier
    const lang = dna.primaryLanguage;
    const isRust = lang.toLowerCase().includes('rust');
    const isPython = lang.toLowerCase().includes('python');
    const isTS = lang.toLowerCase().includes('type') || lang.toLowerCase().includes('script');

    const langTrait = isRust
      ? 'Zero-Cost Abstractions (+25% Armor Regen)'
      : isPython
      ? 'Subprocess Swarm (Support Drones)'
      : isTS
      ? 'Strict Typing (+15% Kinetic Tracking)'
      : 'Dynamic Runtime (+15% Fire Cadence)';

    reasons.push({
      metric: 'STACK DNA',
      value: `${lang.toUpperCase()} (${dna.languages[0]?.pct || 100}%)`,
      result: `${mutationStack.languageModifier} // ${langTrait}`,
      icon: '</>',
    });

    return reasons;
  }

  /**
   * Generates ASCII progress bar chart for terminal / modal visualization.
   */
  public static fingerprintToAscii(fp: RepositoryFingerprint): string[] {
    const makeBar = (val: number, len: number = 10): string => {
      const filled = Math.round((val / 100) * len);
      return '█'.repeat(filled) + '░'.repeat(Math.max(0, len - filled));
    };

    return [
      `ACTIVITY     [${makeBar(fp.activity)}] ${fp.activity.toString().padStart(3, ' ')}%`,
      `COLLABORATION[${makeBar(fp.collaboration)}] ${fp.collaboration.toString().padStart(3, ' ')}%`,
      `COMPLEXITY   [${makeBar(fp.complexity)}] ${fp.complexity.toString().padStart(3, ' ')}%`,
      `INSTABILITY  [${makeBar(fp.instability)}] ${fp.instability.toString().padStart(3, ' ')}%`,
      `LEGACY CODE  [${makeBar(fp.legacy)}] ${fp.legacy.toString().padStart(3, ' ')}%`,
      `DIVERSITY    [${makeBar(fp.diversity)}] ${fp.diversity.toString().padStart(3, ' ')}%`,
    ];
  }
}
