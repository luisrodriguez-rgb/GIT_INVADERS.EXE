import { NormalizedGameData } from '../github/Types';
import { Invader } from '../entities/Invader';
import { ArmoredPR } from '../entities/ArmoredPR';
import { IssueBomber } from '../entities/IssueBomber';
import { MergeConflict } from '../entities/MergeConflict';
import { DependencyDrone } from '../entities/DependencyDrone';
import { BranchDrone } from '../entities/BranchDrone';
import { SecuritySentinel } from '../entities/SecuritySentinel';
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
        const child1 = new DependencyDrone(pt.x, pt.y, `${pkg}-core`, false, 0);
        const child2 = new DependencyDrone(pt.x, pt.y, `${pkg}-types`, false, Math.PI);
        child1.parent = root;
        child2.parent = root;
        root.children.push(child1, child2);
        entities.push(root, child1, child2);
      } else if (pt.type === 'branch') {
        const branchList = gameData.branches && gameData.branches.length > 0 ? gameData.branches : ['feat/auth', 'refactor/core', 'fix/pipeline', 'feat/stream'];
        const branchName = branchList[depIdx % branchList.length];
        depIdx++;
        entities.push(new BranchDrone(pt.x, pt.y, branchName, false));
      } else if (pt.type === 'security') {
        entities.push(new SecuritySentinel(pt.x, pt.y));
      } else {
        // Standard Commit Invader with rich semantic git coloration
        const commit = gameData.commits[commitIdx % Math.max(1, gameData.commits.length)] || {
          sha: `0x${(commitIdx + 10).toString(16)}`,
          message: `feat: commit patch ${commitIdx + 1}`,
          author: gameData.authorName,
        };
        commitIdx++;

        // Diverse semantic color assignment (no boring monochrome repeats)
        let commitColor = gameData.languageColor;
        const msg = (commit.message || '').toLowerCase();
        if (msg.includes('fix') || msg.includes('hotfix') || msg.includes('bug') || msg.includes('patch')) {
          commitColor = '#ff0055'; // Hotfix Crimson
        } else if (msg.includes('merge') || msg.includes('rebase') || msg.includes('pr')) {
          commitColor = '#f59e0b'; // Merge Amber
        } else if (msg.includes('feat') || msg.includes('feature') || msg.includes('add')) {
          commitColor = '#00e5ff'; // Feature Cyan
        } else if (msg.includes('refactor') || msg.includes('perf') || msg.includes('core')) {
          commitColor = '#10b981'; // Performance Emerald
        } else if (msg.includes('docs') || msg.includes('chore') || msg.includes('style') || msg.includes('test')) {
          commitColor = '#a855f7'; // Test/Chore Violet
        } else {
          const paletteCycle = ['#00e5ff', '#10b981', '#f59e0b', '#a855f7', '#ff0055', '#38bdf8'];
          commitColor = paletteCycle[commitIdx % paletteCycle.length];
        }

        entities.push(
          new Invader(pt.x, pt.y, commit.sha, commit.message, commit.author, commitColor)
        );
      }
    });

    return entities;
  }
}
