import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Entity } from '../entities/Entity';
import { Bunker } from '../entities/Bunker';
import { Boss } from '../entities/Boss';
import { ParticleSystem } from './Particles';
import { CRTEffects } from './CRT';
import { ZoneEnvironmentRenderer, ViewMode, ZoneId } from './ZoneEnvironmentRenderer';

export class Renderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public width: number = 800;
  public height: number = 640;
  public zoneRenderer: ZoneEnvironmentRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D canvas context');
    this.ctx = context;

    this.zoneRenderer = new ZoneEnvironmentRenderer();
    this.resize();
  }

  public toggleViewMode(): ViewMode {
    return this.zoneRenderer.toggleViewMode();
  }

  public cycleZone(): ZoneId {
    return this.zoneRenderer.cycleZone();
  }

  public get viewMode(): ViewMode {
    return this.zoneRenderer.viewMode;
  }

  public resize(): void {
    const parent = this.canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      if (rect.width > 300 && rect.height > 300) {
        this.width = Math.round(rect.width);
        this.height = Math.round(rect.height);
      } else {
        this.width = 1100;
        this.height = 640;
      }
    } else {
      this.width = 1100;
      this.height = 640;
    }

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  public updateStars(dt: number, waveIndex: number = 1, isBossFight: boolean = false, isBoosting: boolean = false): void {
    this.zoneRenderer.update(dt, waveIndex, isBossFight, isBoosting);
  }

  public render(
    player: Player,
    enemies: Entity[],
    projectiles: Projectile[],
    bunkers: Bunker[],
    boss: Boss | null,
    particles: ParticleSystem,
    crt: CRTEffects,
    shake: { offsetX: number; offsetY: number; rotation: number },
    lockedTarget: Entity | null = null
  ): void {
    this.ctx.save();

    // Screen Shake Transform
    if (shake.offsetX !== 0 || shake.offsetY !== 0 || shake.rotation !== 0) {
      this.ctx.translate(this.width / 2 + shake.offsetX, this.height / 2 + shake.offsetY);
      this.ctx.rotate(shake.rotation);
      this.ctx.translate(-this.width / 2, -this.height / 2);
    }

    // 1. Multi-layer 2.5D Zone Background (Archipelago, Cyber Grid, Nebula, Core Horizon)
    const playerNormX = this.width > 0 ? player.centerX / this.width : 0.5;
    this.zoneRenderer.render(this.ctx, this.width, this.height, playerNormX);

    // 2. Bunkers
    for (const bunker of bunkers) {
      bunker.render(this.ctx);
    }

    // 3. Code Boss (if active)
    if (boss && boss.isAlive) {
      boss.render(this.ctx);
    }

    // 4. Enemies
    for (const enemy of enemies) {
      enemy.render(this.ctx);
    }

    // 5. Target-Lock Red Brackets (Images 4 & 7)
    if (lockedTarget && lockedTarget.isAlive) {
      this.renderTargetLockReticle(lockedTarget, player);
    }

    // 6. Player
    player.render(this.ctx);

    // 7. Projectiles
    for (const proj of projectiles) {
      proj.render(this.ctx);
    }

    // 8. Particles
    particles.render(this.ctx);

    // 9. Post-processing CRT & Hit flash
    crt.renderPost(this.ctx, this.width, this.height);

    this.ctx.restore();
  }

  private renderTargetLockReticle(target: Entity, player: Player): void {
    const ctx = this.ctx;
    ctx.save();
    const pad = 7;
    const x1 = target.x - pad;
    const y1 = target.y - pad;
    const x2 = target.x + target.width + pad;
    const y2 = target.y + target.height + pad;
    const len = 8;

    const pulse = 0.75 + Math.sin(Date.now() * 0.012) * 0.25;
    ctx.strokeStyle = `rgba(239, 68, 68, ${pulse})`;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;

    // 4 Corner Lock Brackets [ ]
    ctx.beginPath();
    // Top-left
    ctx.moveTo(x1, y1 + len);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1 + len, y1);
    // Top-right
    ctx.moveTo(x2 - len, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y1 + len);
    // Bottom-right
    ctx.moveTo(x2, y2 - len);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - len, y2);
    // Bottom-left
    ctx.moveTo(x1 + len, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y2 - len);
    ctx.stroke();

    // Target Lock Distance HUD tag
    const dist = Math.round(Math.hypot(target.centerX - player.centerX, target.centerY - player.centerY));
    ctx.font = '800 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText(`LOCK // ${dist}M`, target.centerX, y2 + 10);
    ctx.restore();
  }
}
