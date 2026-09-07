import { FormationType, NormalizedGameData } from '../github/Types';

export interface EnemySpawnPoint {
  x: number;
  y: number;
  type: 'commit' | 'pr' | 'issue';
}

export interface LanguageGameplayModifiers {
  speedMultiplier: number; // e.g., 1.15 for JavaScript / TypeScript
  hasDroneSupport: boolean; // e.g., true for Python
  armorBonus: number; // e.g., +1 for C++ / Rust
  bunkerIntegrityRatio: number; // e.g., 1.3 for HTML / CSS
  primaryLanguage: string;
}

export class WaveGenerator {
  /**
   * Translates the repository tech stack directly into gameplay dynamics:
   * JavaScript / TypeScript -> Speed & projectile cadence boost
   * Python -> Contributor drone swarm escort
   * C++ / Rust -> Armored hulls and kinetic shield reinforcement
   * HTML / CSS -> Fortified defensive bunker structures
   */
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
   * Generates procedural formation positions for a wave based on repo activity
   */
  public static generateWavePositions(
    formation: FormationType,
    gameData: NormalizedGameData,
    bounds: { width: number; height: number }
  ): EnemySpawnPoint[] {
    const points: EnemySpawnPoint[] = [];
    const centerX = bounds.width / 2;

    switch (formation) {
      case 'delta_wing': {
        // Pyramid / Delta Wing formation
        const rows = 5;
        const spacingX = 44;
        const spacingY = 38;
        const startY = 70;

        for (let r = 0; r < rows; r++) {
          const countInRow = r * 2 + 3;
          const startX = centerX - ((countInRow - 1) * spacingX) / 2;

          for (let c = 0; c < countInRow; c++) {
            const x = startX + c * spacingX;
            const y = startY + r * spacingY;
            let type: 'commit' | 'pr' | 'issue' = 'commit';

            // Flanks are Armored PRs, center are Issues
            if (c === 0 || c === countInRow - 1) {
              type = 'pr';
            } else if (r === 0 || (r === 1 && c === 2)) {
              type = 'issue';
            }

            points.push({ x, y, type });
          }
        }
        break;
      }

      case 'constellation_scatter': {
        // Multi-cluster celestial constellation
        const clusters = 4;
        const perCluster = 6;
        const clusterCenters = [
          { x: bounds.width * 0.25, y: 90 },
          { x: bounds.width * 0.75, y: 90 },
          { x: bounds.width * 0.4, y: 170 },
          { x: bounds.width * 0.6, y: 170 },
        ];

        clusterCenters.forEach((center, cIdx) => {
          for (let i = 0; i < perCluster; i++) {
            const angle = (i / perCluster) * Math.PI * 2;
            const radius = 32 + (i % 2) * 16;
            const x = center.x + Math.cos(angle) * radius;
            const y = center.y + Math.sin(angle) * radius;

            const type = i === 0 ? 'pr' : i === 1 ? 'issue' : 'commit';
            points.push({ x, y, type });
          }
        });
        break;
      }

      case 'flanking_helix': {
        // Two heavy armored wings advancing on flanks with central core
        const rows = 6;
        const leftWingX = bounds.width * 0.2;
        const rightWingX = bounds.width * 0.8;
        const startY = 70;

        for (let r = 0; r < rows; r++) {
          const y = startY + r * 36;
          // Left wing
          points.push({ x: leftWingX - 25, y, type: 'pr' });
          points.push({ x: leftWingX + 25, y, type: 'commit' });

          // Right wing
          points.push({ x: rightWingX - 25, y, type: 'commit' });
          points.push({ x: rightWingX + 25, y, type: 'pr' });

          // Central issue bugs
          if (r % 2 === 0) {
            points.push({ x: centerX - 30, y: y + 10, type: 'issue' });
            points.push({ x: centerX + 30, y: y + 10, type: 'issue' });
          }
        }
        break;
      }

      case 'commit_grid':
      default: {
        // Classic Clean Space Invaders Grid (5 rows x 10 cols)
        const cols = 10;
        const rows = 5;
        const spacingX = 46;
        const spacingY = 36;
        const startX = centerX - ((cols - 1) * spacingX) / 2;
        const startY = 70;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = startX + c * spacingX;
            const y = startY + r * spacingY;

            let type: 'commit' | 'pr' | 'issue' = 'commit';
            if (r === 0) {
              type = 'issue'; // Top row: Bug Bombers
            } else if (r === 1) {
              type = 'pr'; // Row 2: Armored PRs
            }

            points.push({ x, y, type });
          }
        }
        break;
      }
    }

    return points;
  }
}
