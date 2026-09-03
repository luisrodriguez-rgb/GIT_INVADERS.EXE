import { Entity } from './Entity';

export type ProjectileOwner = 'player' | 'enemy' | 'boss';
export type ProjectileType = 'laser' | 'beam' | 'bug_bomb' | 'plasma' | 'diagonal_laser';

export class Projectile extends Entity {
  public owner: ProjectileOwner;
  public type: ProjectileType;
  public damage: number;
  public color: string;
  public homingTargetX?: number;
  public pierceCount: number = 0;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    owner: ProjectileOwner,
    type: ProjectileType = 'laser',
    damage: number = 20,
    color: string = '#00e5ff',
    pierceCount: number = 0
  ) {
    const width = type === 'beam' ? 24 : type === 'plasma' ? 12 : 4;
    const height = type === 'beam' ? 48 : type === 'plasma' ? 12 : 14;
    super(x, y, width, height);

    this.vx = vx;
    this.vy = vy;
    this.owner = owner;
    this.type = type;
    this.damage = damage;
    this.color = color;
    this.pierceCount = pierceCount;
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    if (this.type === 'bug_bomb' && this.homingTargetX !== undefined) {
      // Gentle tracking towards target
      const dx = this.homingTargetX - this.centerX;
      this.vx += Math.sign(dx) * 70 * dt;
      this.vx = Math.max(-90, Math.min(90, this.vx));
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Out of bounds check
    if (this.y < -50 || this.y > bounds.height + 50 || this.x < -50 || this.x > bounds.width + 50) {
      this.isAlive = false;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    if (this.type === 'laser') {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // Core bright trail
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.x + 1, this.y + 2, this.width - 2, this.height - 4);
    } else if (this.type === 'beam') {
      // Massive Overdrive laser column
      const grad = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
      grad.addColorStop(0, 'rgba(255, 0, 128, 0.4)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(1, 'rgba(255, 0, 128, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else if (this.type === 'bug_bomb') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing outer ring
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (this.type === 'plasma') {
      const grad = ctx.createRadialGradient(this.centerX, this.centerY, 2, this.centerX, this.centerY, 6);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, this.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'diagonal_laser') {
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 0.05, this.y + this.vy * 0.05);
      ctx.stroke();
    }
    ctx.restore();
  }
}
