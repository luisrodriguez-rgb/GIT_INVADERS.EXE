import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Entity } from '../entities/Entity';
import { Bunker } from '../entities/Bunker';
import { Boss } from '../entities/Boss';
import { ParticleSystem } from './Particles';
import { CRTEffects } from './CRT';
import { ThemeManager } from '../themes/ThemeManager';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

export class Renderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public width: number = 800;
  public height: number = 640;

  private stars: Star[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D canvas context');
    this.ctx = context;

    this.initStars();
    this.resize();
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

  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 640,
        size: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 40 + 15,
        brightness: Math.random() * 0.7 + 0.3,
      });
    }
  }

  public updateStars(dt: number): void {
    for (const star of this.stars) {
      star.y += star.speed * dt;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }
  }

  public render(
    player: Player,
    enemies: Entity[],
    projectiles: Projectile[],
    bunkers: Bunker[],
    boss: Boss | null,
    particles: ParticleSystem,
    crt: CRTEffects,
    shake: { offsetX: number; offsetY: number; rotation: number }
  ): void {
    this.ctx.save();

    // Screen Shake Transform
    if (shake.offsetX !== 0 || shake.offsetY !== 0 || shake.rotation !== 0) {
      this.ctx.translate(this.width / 2 + shake.offsetX, this.height / 2 + shake.offsetY);
      this.ctx.rotate(shake.rotation);
      this.ctx.translate(-this.width / 2, -this.height / 2);
    }

    // 1. Deep Space Void Background
    this.ctx.fillStyle = ThemeManager.getInstance().currentTheme.bgScreen;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Stars
    for (const star of this.stars) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // 3. Faint cyber coordinate grid lines
    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 80) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 80) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // 4. Bunkers
    for (const bunker of bunkers) {
      bunker.render(this.ctx);
    }

    // 5. Code Boss (if active)
    if (boss && boss.isAlive) {
      boss.render(this.ctx);
    }

    // 6. Enemies
    for (const enemy of enemies) {
      enemy.render(this.ctx);
    }

    // 7. Player
    player.render(this.ctx);

    // 8. Projectiles
    for (const proj of projectiles) {
      proj.render(this.ctx);
    }

    // 9. Particles
    particles.render(this.ctx);

    // 10. Post-processing CRT & Hit flash
    crt.renderPost(this.ctx, this.width, this.height);

    this.ctx.restore();
  }
}
