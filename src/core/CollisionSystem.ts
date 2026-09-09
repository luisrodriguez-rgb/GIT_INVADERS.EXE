import { Entity } from '../entities/Entity';
import { Projectile } from '../entities/Projectile';
import { Player } from '../entities/Player';
import { Bunker } from '../entities/Bunker';
import { Boss } from '../entities/Boss';
import { Invader } from '../entities/Invader';
import { ArmoredPR } from '../entities/ArmoredPR';
import { IssueBomber } from '../entities/IssueBomber';
import { MergeConflict, ConflictFragment } from '../entities/MergeConflict';
import { DependencyDrone } from '../entities/DependencyDrone';
import { BranchDrone } from '../entities/BranchDrone';
import { SecuritySentinel } from '../entities/SecuritySentinel';
import { ParticleSystem } from '../rendering/Particles';
import { CRTEffects } from '../rendering/CRT';
import { SFX } from '../audio/SFX';
import { GameState } from './GameState';

export class CollisionSystem {
  /**
   * Fast AABB bounding box collision check
   */
  public static checkAABB(a: Entity, b: Entity): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Main collision resolution step
   */
  public static resolve(
    player: Player,
    projectiles: Projectile[],
    enemies: Entity[],
    bunkers: Bunker[],
    boss: Boss | null,
    particles: ParticleSystem,
    crt: CRTEffects,
    gameState: GameState
  ): void {
    // 1. Projectiles vs Bunkers
    for (const proj of projectiles) {
      if (!proj.isAlive) continue;

      for (const bunker of bunkers) {
        if (bunker.checkImpact(proj.centerX, proj.centerY, proj.width / 2 + 2)) {
          proj.isAlive = false;
          particles.emitExplosion(proj.centerX, proj.centerY, '#10b981', 6);
          break;
        }
      }
    }

    // 2. Player Projectiles vs Enemies
    for (const proj of projectiles) {
      if (!proj.isAlive || proj.owner !== 'player') continue;

      // Check Boss first if present
      if (boss && boss.isAlive && this.checkAABB(proj, boss)) {
        if (proj.type !== 'beam') proj.isAlive = false;

        const bossDied = boss.takeDamage(proj.damage);
        particles.emitExplosion(proj.centerX, proj.centerY, boss.blueprint.languageColor, 12);
        particles.emitCodeFragments(proj.centerX, proj.centerY, boss.blueprint.languageColor, 4, 'boss');
        crt.addTrauma(0.15);

        if (bossDied) {
          SFX.playExplosion('boss');
          particles.emitExplosion(boss.centerX, boss.centerY, '#ff007f', 60);
          particles.emitCodeFragments(boss.centerX, boss.centerY, '#ff007f', 16, 'boss');
          particles.emitDebris(boss.centerX, boss.centerY, '#ff007f', 12);
          particles.emitText(boss.centerX, boss.centerY, `BOSS PURGED! +1500 XP`, '#ff007f');
          crt.addTrauma(0.8);
          crt.triggerFlash('rgba(255, 0, 128, 0.5)', 0.2);
          gameState.addScore(1500);
        }
        continue;
      }

      // Check standard enemies
      for (const enemy of enemies) {
        if (!enemy.isAlive) continue;

        if (this.checkAABB(proj, enemy)) {
          if (proj.type !== 'beam') {
            if (proj.pierceCount > 0) {
              proj.pierceCount--;
            } else {
              proj.isAlive = false;
            }
          }

          if (enemy instanceof ArmoredPR) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, '#a855f7', 14);
            particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#c084fc', 4, 'pr');

            if (destroyed) {
              SFX.playExplosion('medium');
              gameState.addScore(enemy.scoreValue);
              gameState.prsMerged++;
              gameState.incrementStreak();
              player.addOverdriveCharge(15);
              particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#a855f7', 8, 'pr');
              particles.emitDebris(enemy.centerX, enemy.centerY, '#c084fc', 6);
              particles.emitText(enemy.centerX, enemy.centerY, `MERGED PR #${enemy.prNumber}!`, '#a855f7');
              crt.addTrauma(0.12);

              // Apply Power-up
              if (enemy.powerUpDrop === 'multi_shot') {
                player.multiShotTimer = 7.0;
                particles.emitText(player.centerX, player.y - 20, 'DUAL LASERS ACTIVATED', '#38bdf8');
                SFX.playPowerup();
              } else if (enemy.powerUpDrop === 'stash_shield') {
                player.hasShield = true;
                particles.emitText(player.centerX, player.y - 20, 'GIT STASH SHIELD UP', '#10b981');
                SFX.playPowerup();
              }
            }
          } else if (enemy instanceof IssueBomber) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, '#ef4444', 16);
            particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#ef4444', 4, 'issue');

            if (destroyed) {
              SFX.playExplosion('medium');
              gameState.addScore(enemy.scoreValue);
              gameState.issuesClosed++;
              gameState.incrementStreak();
              player.addOverdriveCharge(10);
              particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#ef4444', 7, 'issue');
              particles.emitDebris(enemy.centerX, enemy.centerY, '#ef4444', 5);
              particles.emitText(enemy.centerX, enemy.centerY, `FIXED #${enemy.issueNumber}!`, '#ef4444');
              crt.addTrauma(0.1);
            }
          } else if (enemy instanceof Invader) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, enemy.color, 10);
            particles.emitCodeFragments(enemy.centerX, enemy.centerY, enemy.color, 3, 'commit');

            if (destroyed) {
              SFX.playExplosion('small');
              gameState.addScore(enemy.scoreValue);
              gameState.commitsPurged++;
              gameState.incrementStreak();
              player.addOverdriveCharge(5);
              particles.emitCodeFragments(enemy.centerX, enemy.centerY, enemy.color, 5, 'commit');
              particles.emitText(enemy.centerX, enemy.centerY, `${enemy.commitSha} +25 XP`, enemy.color);
            }
          } else if (enemy instanceof MergeConflict) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, '#fbbf24', 12);
            particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#00e5ff', 3, 'commit');

            if (destroyed) {
              SFX.playExplosion('medium');
              gameState.addScore(enemy.scoreValue);
              gameState.incrementStreak();
              player.addOverdriveCharge(8);
              particles.emitText(enemy.centerX, enemy.centerY, 'CONFLICT: HEAD vs BRANCH!', '#fbbf24');
              const [f1, f2] = enemy.split();
              enemies.push(f1, f2);
            }
          } else if (enemy instanceof ConflictFragment) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, enemy.color, 8);

            if (destroyed) {
              SFX.playExplosion('small');
              gameState.addScore(enemy.scoreValue);
              gameState.incrementStreak();
              particles.emitText(enemy.centerX, enemy.centerY, `${enemy.branchName} RESOLVED`, enemy.color);
            }
          } else if (enemy instanceof DependencyDrone) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, '#38bdf8', 10);

            if (destroyed) {
              SFX.playExplosion(enemy.isRoot ? 'medium' : 'small');
              gameState.addScore(enemy.scoreValue);
              gameState.incrementStreak();

              if (enemy.isRoot) {
                particles.emitText(enemy.centerX, enemy.centerY, 'DEPENDENCY CHAIN BROKEN!', '#f59e0b');
                for (const child of enemy.children) {
                  if (child.isAlive) {
                    child.isAlive = false;
                    particles.emitExplosion(child.centerX, child.centerY, '#38bdf8', 12);
                    gameState.addScore(child.scoreValue);
                  }
                }
              }
            }
          } else if (enemy instanceof BranchDrone) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, '#a855f7', 12);
            particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#c084fc', 3, 'commit');

            if (destroyed) {
              if (!enemy.isChild && !enemy.isSplit) {
                enemy.isSplit = true;
                const b1 = new BranchDrone(enemy.x - 14, enemy.y, `${enemy.branchName}-α`, true);
                const b2 = new BranchDrone(enemy.x + 14, enemy.y, `${enemy.branchName}-β`, true);
                b1.vx = -40;
                b2.vx = 40;
                enemies.push(b1, b2);
                particles.emitText(enemy.centerX, enemy.centerY, 'BRANCH SPLIT! // 2 SUB-THREADS', '#a855f7');
                SFX.playExplosion('small');
                gameState.addScore(enemy.scoreValue);
                gameState.incrementStreak();
                player.addOverdriveCharge(8);
              } else {
                SFX.playExplosion('small');
                gameState.addScore(enemy.scoreValue);
                gameState.incrementStreak();
                player.addOverdriveCharge(4);
                particles.emitText(enemy.centerX, enemy.centerY, `${enemy.branchName} MERGED`, '#a855f7');
              }
            }
          } else if (enemy instanceof SecuritySentinel) {
            const destroyed = enemy.takeDamage(proj.damage);
            if (enemy.firewallActive) {
              particles.emitExplosion(enemy.centerX, enemy.centerY, '#10b981', 8);
              particles.emitText(enemy.centerX, enemy.y - 12, 'FIREWALL BLOCKED!', '#10b981');
            } else {
              particles.emitExplosion(enemy.centerX, enemy.centerY, '#10b981', 14);
              particles.emitCodeFragments(enemy.centerX, enemy.centerY, '#10b981', 4, 'commit');

              if (destroyed) {
                SFX.playExplosion('medium');
                gameState.addScore(enemy.scoreValue);
                gameState.incrementStreak();
                player.addOverdriveCharge(15);
                particles.emitText(enemy.centerX, enemy.centerY, 'SECURITY BYPASS // +200 XP', '#10b981');
                particles.emitDebris(enemy.centerX, enemy.centerY, '#10b981', 6);
                crt.addTrauma(0.12);
              }
            }
          }
          break;
        }
      }
    }

    // 3. Enemy / Boss Projectiles vs Player
    for (const proj of projectiles) {
      if (!proj.isAlive || proj.owner === 'player') continue;

      if (this.checkAABB(proj, player)) {
        if (player.isStashed) {
          // Phantom Violet: bullets pass clean through during STASH phase
          continue;
        }

        proj.isAlive = false;
        particles.emitExplosion(proj.centerX, proj.centerY, '#ff0055', 18);
        const lostLife = player.hit();

        if (lostLife) {
          SFX.playExplosion('medium');
          crt.addTrauma(0.6);
          crt.triggerFlash('rgba(255, 0, 0, 0.4)', 0.15);
          gameState.resetStreak();
        }
      }
    }

    // 4. Enemy Bodies reaching Player
    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;

      if (this.checkAABB(enemy, player)) {
        if (player.isRebaseDashing) {
          // Rebase-01 hyper-dash penetrates through hostiles
          enemy.isAlive = false;
          particles.emitExplosion(enemy.centerX, enemy.centerY, '#ff0055', 20);
          particles.emitText(enemy.centerX, enemy.centerY, 'REBASE PIERCE // 150 DMG', '#ff0055');
          SFX.playExplosion('small');
          gameState.addScore(enemy.scoreValue);
          continue;
        }

        if (player.isStashed) {
          continue;
        }

        enemy.isAlive = false;
        player.hit();
        SFX.playExplosion('medium');
        crt.addTrauma(0.6);
        gameState.resetStreak();
      }
    }
  }
}
