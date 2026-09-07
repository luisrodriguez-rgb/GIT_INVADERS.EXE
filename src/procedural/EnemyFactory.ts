import { NormalizedGameData } from '../github/Types';
import { Invader } from '../entities/Invader';
import { ArmoredPR } from '../entities/ArmoredPR';
import { IssueBomber } from '../entities/IssueBomber';
import { MergeConflict } from '../entities/MergeConflict';
import { DependencyDrone } from '../entities/DependencyDrone';
import { Entity } from '../entities/Entity';
import { WaveGenerator } from './WaveGenerator';

export class EnemyFactory {
  public static createWave(
    waveIndex: number,
    gameData: NormalizedGameData,
    bounds: { width: number; height: number }
  ): Entity[] {
    const formation = gameData.waveFormations[waveIndex % gameData.waveFormations.length];
    const spawnPoints = WaveGenerator.generateWavePositions(formation, gameData, bounds);

    const entities: Entity[] = [];
    let commitIdx = 0;
    let prIdx = 0;
    let issueIdx = 0;
    let depIdx = 0;

    spawnPoints.forEach((pt) => {
      if (pt.type === 'pr') {
        const pr = gameData.pullRequests[prIdx % Math.max(1, gameData.pullRequests.length)] || {
          number: prIdx + 1,
          title: `PR #${prIdx + 1}: Automated Dependency Update`,
          author: gameData.authorName,
        };
        prIdx++;
        entities.push(new ArmoredPR(pt.x, pt.y, pr.number, pr.title, pr.author));
      } else if (pt.type === 'issue') {
        const issue = gameData.issues[issueIdx % Math.max(1, gameData.issues.length)] || {
          number: issueIdx + 1,
          title: `Issue #${issueIdx + 1}: Memory Leak in render pass`,
        };
        issueIdx++;
        entities.push(new IssueBomber(pt.x, pt.y, issue.number, issue.title));
      } else if (pt.type === 'conflict') {
        entities.push(new MergeConflict(pt.x, pt.y));
      } else if (pt.type === 'dependency') {
        const pkgNames = ['lodash', 'vite', 'typescript', 'axios', 'rxjs', 'react', 'zod'];
        const pkg = pkgNames[depIdx % pkgNames.length];
        depIdx++;
        const root = new DependencyDrone(pt.x, pt.y, pkg, true);
        const child1 = new DependencyDrone(pt.x - 18, pt.y + 24, `${pkg}-core`, false);
        const child2 = new DependencyDrone(pt.x + 18, pt.y + 24, `${pkg}-types`, false);
        child1.parent = root;
        child2.parent = root;
        root.children.push(child1, child2);
        entities.push(root, child1, child2);
      } else {
        // Standard Commit Invader
        const commit = gameData.commits[commitIdx % Math.max(1, gameData.commits.length)] || {
          sha: `0x${(commitIdx + 10).toString(16)}`,
          message: `feat: commit patch ${commitIdx + 1}`,
          author: gameData.authorName,
        };
        commitIdx++;
        entities.push(
          new Invader(pt.x, pt.y, commit.sha, commit.message, commit.author, gameData.languageColor)
        );
      }
    });

    return entities;
  }
}
