import { FormationType, NormalizedGameData, WaveDNA, RepositoryDNA } from '../github/Types';

export interface EnemySpawnPoint {
  x: number;
  y: number;
  type: 'commit' | 'pr' | 'issue' | 'conflict' | 'dependency' | 'branch' | 'security';
  strategy?: 'formation' | 'zigzag' | 'dive' | 'tracking' | 'orbit' | 'swarm';
  phaseOffset?: number;
}

export interface LanguageGameplayModifiers {
  speedMultiplier: number;
  hasDroneSupport: boolean;
  armorBonus: number;
  bunkerIntegrityRatio: number;
  primaryLanguage: string;
}

export class WaveGenerator {
  public static getLanguageModifiers(primaryLang: string): LanguageGameplayModifiers {
    const l = (primaryLang || '').toLowerCase();
    const isScript = l.includes('javascript') || l.includes('typescript') || l.includes('js') || l.includes('ts');
    const isPython = l.includes('python');
    const isCompiled = l.includes('c++') || l.includes('rust') || l.includes('c');
    const isWebMarkup = l.includes('html') || l.includes('css');

    return {
      speedMultiplier: isScript ? 1.15 : 1.0,
      hasDroneSupport: isPython,
      armorBonus: isCompiled ? 1 : 0,
      bunkerIntegrityRatio: isWebMarkup ? 1.3 : 1.0,
      primaryLanguage: primaryLang || 'TypeScript',
    };
  }

  /**
   * Generates procedural formation positions for a wave based on repo activity.
   * Enforces generous horizontal and vertical spacing so hitboxes, shield halos,
   * and text labels never collide or overlap.
   */
  public static generateWavePositions(
    formation: FormationType,
    _gameData: NormalizedGameData,
    bounds: { width: number; height: number }
  ): EnemySpawnPoint[] {
    const points: EnemySpawnPoint[] = [];
    const centerX = bounds.width / 2;

    switch (formation) {
      // 1. V_CHEVRON / DELTA_WING: Inverted V-formation, PR cruisers on flanks, bugs vanguard
      case 'v_chevron':
      case 'delta_wing': {
        const rows = 5;
        const spacingX = 56;
        const spacingY = 50;
        const startY = 70;

        for (let r = 0; r < rows; r++) {
          const countInRow = r * 2 + 2;
          const startX = centerX - ((countInRow - 1) * spacingX) / 2;

          for (let c = 0; c < countInRow; c++) {
            const x = startX + c * spacingX;
            const y = startY + r * spacingY;

            let type: 'commit' | 'pr' | 'issue' = 'commit';
            let strategy: 'formation' | 'zigzag' | 'dive' = 'formation';

            if (c === 0 || c === countInRow - 1) {
              // Outer flanks: Heavy Armored PR cruisers
              type = 'pr';
              strategy = 'formation';
            } else if (r === 0 || (r === 1 && (c === 1 || c === 2))) {
              // Vanguard tip: Agile Bug Bombers
              type = 'issue';
              strategy = 'dive';
            }

            points.push({
              x,
              y,
              type,
              strategy,
              phaseOffset: c * 0.4 + r * 0.6,
            });
          }
        }
        break;
      }

      // 2. DIAMOND: Concentric diamond with heavy escort in center
      case 'diamond': {
        const diamondRows = [2, 4, 6, 4, 2];
        const spacingX = 58;
        const spacingY = 50;
        const startY = 65;

        diamondRows.forEach((count, r) => {
          const startX = centerX - ((count - 1) * spacingX) / 2;
          const y = startY + r * spacingY;

          for (let c = 0; c < count; c++) {
            const x = startX + c * spacingX;
            let type: 'commit' | 'pr' | 'issue' | 'conflict' = 'commit';
            let strategy: 'formation' | 'zigzag' | 'dive' = 'formation';

            // Top and bottom apex: Bug Bombers
            if (r === 0 || r === 4) {
              type = 'issue';
              strategy = 'zigzag';
            } else if (r === 2) {
              // Center row: Armored PRs and Conflicts
              if (c === 2 || c === 3) {
                type = 'conflict';
              } else if (c === 1 || c === 4) {
                type = 'pr';
              }
            } else if ((r === 1 || r === 3) && (c === 0 || c === count - 1)) {
              type = 'pr';
            }

            points.push({
              x,
              y,
              type,
              strategy,
              phaseOffset: r * 0.5 + c * 0.3,
            });
          }
        });
        break;
      }

      // 3. SWARM / CONSTELLATION: Dispersed orbital celestial clusters
      case 'swarm':
      case 'constellation_scatter': {
        const clusterCenters = [
          { x: bounds.width * 0.24, y: 95 },
          { x: bounds.width * 0.76, y: 95 },
          { x: bounds.width * 0.5, y: 175 },
        ];

        clusterCenters.forEach((center, cIdx) => {
          const perCluster = 7;
          // Generous radial radius to prevent any clumping
          const radius = 54;

          for (let i = 0; i < perCluster; i++) {
            const angle = (i / perCluster) * Math.PI * 2 + (cIdx * Math.PI) / 3;
            const x = center.x + Math.cos(angle) * radius;
            const y = center.y + Math.sin(angle) * (radius * 0.72);

            let type: 'commit' | 'pr' | 'issue' = 'commit';
            if (i === 0) {
              type = 'pr';
            } else if (i === 1 || i === 4) {
              type = 'issue';
            }

            points.push({
              x,
              y,
              type,
              strategy: 'swarm',
              phaseOffset: cIdx * 1.5 + i * 0.7,
            });
          }
        });
        break;
      }

      // 4. PINCER / FLANKING_HELIX: Dual armored columns on flanks with rapid bugs center
      case 'pincer':
      case 'flanking_helix': {
        const rows = 5;
        const leftWingX = bounds.width * 0.22;
        const rightWingX = bounds.width * 0.78;
        const startY = 70;
        const spacingY = 50;

        for (let r = 0; r < rows; r++) {
          const y = startY + r * spacingY;

          // Left Armored Column
          points.push({
            x: leftWingX - 28,
            y,
            type: r % 2 === 0 ? 'pr' : 'commit',
            strategy: 'formation',
            phaseOffset: r * 0.4,
          });
          points.push({
            x: leftWingX + 28,
            y,
            type: 'commit',
            strategy: 'formation',
            phaseOffset: r * 0.4 + 0.2,
          });

          // Right Armored Column
          points.push({
            x: rightWingX - 28,
            y,
            type: 'commit',
            strategy: 'formation',
            phaseOffset: r * 0.4 + 0.3,
          });
          points.push({
            x: rightWingX + 28,
            y,
            type: r % 2 === 0 ? 'pr' : 'commit',
            strategy: 'formation',
            phaseOffset: r * 0.4 + 0.5,
          });

          // Central Pincer bug advance
          if (r < 3) {
            points.push({
              x: centerX - 32,
              y: y + 20,
              type: 'issue',
              strategy: 'dive',
              phaseOffset: r * 0.8,
            });
            points.push({
              x: centerX + 32,
              y: y + 20,
              type: 'issue',
              strategy: 'dive',
              phaseOffset: r * 0.8 + 0.4,
            });
          }
        }
        break;
      }

      // 5. GRID / COMMIT_GRID: Classic Space Invaders with generous tactical spacing
      case 'grid':
      case 'commit_grid':
      default: {
        const cols = 8;
        const rows = 5;
        const spacingX = 66;
        const spacingY = 54;
        const startX = centerX - ((cols - 1) * spacingX) / 2;
        const startY = 68;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * spacingX;
            const y = startY + r * spacingY;

            let type: 'commit' | 'pr' | 'issue' | 'conflict' | 'dependency' | 'branch' | 'security' = 'commit';
            let strategy: 'formation' | 'zigzag' | 'dive' = 'formation';

            if (r === 0) {
              // Row 0: Agile vanguard bug bombers & branch drones
              if (c === 2 || c === 5) {
                type = 'issue';
                strategy = 'zigzag';
              } else if (c === 0 || c === 7) {
                type = 'branch';
              } else if (c === 3 || c === 4) {
                type = 'conflict';
              }
            } else if (r === 1) {
              // Row 1: Heavy Armored PR Cruisers at flanks and Security Sentinel in center
              if (c === 1 || c === 6) {
                type = 'pr';
              } else if (c === 3 || c === 4) {
                type = 'security';
              } else {
                type = 'commit';
              }
            } else {
              // Rows 2, 3, 4: Clean, uniform Space Invaders commit rows
              type = 'commit';
            }

            points.push({
              x,
              y,
              type,
              strategy,
              phaseOffset: r * 0.3 + c * 0.15,
            });
          }
        }
        break;
      }
    }

    return points;
  }

  /**
   * Synthesizes procedural WaveDNA directly from Repository DNA.
   */
  public static deriveWaveDNA(dna: RepositoryDNA): WaveDNA {
    const formations: FormationType[] = ['grid', 'v_chevron', 'swarm'];
    if (dna.pullRequests > 30) formations[1] = 'diamond';
    if (dna.threatLevel >= 80) formations[2] = 'pincer';

    const speedBase = Math.round(50 + (dna.threatLevel / 100) * 45);
    const dropSpeed = Math.round(18 + (dna.threatLevel / 100) * 16);
    const prRatio = Number(Math.min(0.35, Math.max(0.08, dna.pullRequests / 150)).toFixed(2));
    const issueRatio = Number(Math.min(0.30, Math.max(0.05, dna.issues / 120)).toFixed(2));
    const conflictRatio = dna.threatLevel >= 70 ? 0.15 : 0.05;
    const dependencyRatio = Math.min(0.25, (dna.languages.length * 0.04));

    const rationale = `WAVES CALIBRATED: ${dna.commits} COMMITS (SPEED ${speedBase}PX/S) // ${dna.pullRequests} PRS (ARMOR ${(prRatio * 100).toFixed(0)}%) // ${dna.issues} ISSUES (BOMBERS ${(issueRatio * 100).toFixed(0)}%)`;

    return {
      totalWaves: 3,
      formations,
      speedBase,
      dropSpeed,
      prRatio,
      issueRatio,
      conflictRatio,
      dependencyRatio,
      formationName: formations[1].toUpperCase(),
      rationale,
    };
  }
}
