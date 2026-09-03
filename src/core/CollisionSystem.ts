import { Entity } from '../entities/Entity';
import { Projectile } from '../entities/Projectile';
import { Player } from '../entities/Player';
import { Bunker } from '../entities/Bunker';
import { Boss } from '../entities/Boss';
import { Invader } from '../entities/Invader';
import { ArmoredPR } from '../entities/ArmoredPR';
import { IssueBomber } from '../entities/IssueBomber';
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
        crt.addTrauma(0.15);

        if (bossDied) {
          SFX.playExplosion('boss');
          particles.emitExplosion(boss.centerX, boss.centerY, '#ff007f', 60);
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

            if (destroyed) {
              SFX.playExplosion('medium');
              gameState.addScore(enemy.scoreValue);
              gameState.prsMerged++;
              gameState.incrementStreak();
              player.addOverdriveCharge(15);
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

            if (destroyed) {
              SFX.playExplosion('medium');
              gameState.addScore(enemy.scoreValue);
              gameState.issuesClosed++;
              gameState.incrementStreak();
              player.addOverdriveCharge(10);
              particles.emitText(enemy.centerX, enemy.centerY, `FIXED #${enemy.issueNumber}!`, '#ef4444');
              crt.addTrauma(0.1);
            }
          } else if (enemy instanceof Invader) {
            const destroyed = enemy.takeDamage(proj.damage);
            particles.emitExplosion(enemy.centerX, enemy.centerY, enemy.color, 10);

            if (destroyed) {
              SFX.playExplosion('small');
              gameState.addScore(enemy.scoreValue);
              gameState.commitsPurged++;
              gameState.incrementStreak();
              player.addOverdriveCharge(5);
              particles.emitText(enemy.centerX, enemy.centerY, `${enemy.commitSha} +25 XP`, enemy.color);
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
        enemy.isAlive = false;
        player.hit();
        SFX.playExplosion('medium');
        crt.addTrauma(0.6);
        gameState.resetStreak();
      }
    }
  }
}
