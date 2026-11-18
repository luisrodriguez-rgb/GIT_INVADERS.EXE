import { Entity } from './Entity';

export type ProjectileOwner = 'player' | 'enemy' | 'boss';
export type ProjectileType =
  | 'laser'
  | 'beam'
  | 'bug_bomb'
  | 'plasma'
  | 'diagonal_laser'
  | 'homing_missile'
  | 'supernova_wave'
  | 'rail_slug'
  | 'quantum_lance';

export class Projectile extends Entity {
  public owner: ProjectileOwner;
  public type: ProjectileType;
  public damage: number;
  public color: string;
  public homingTargetX?: number;
  public homingTargetY?: number;
  public targetEntity?: Entity | null;
  public pierceCount: number = 0;

  // Missile / Wave motion helpers
  private trail: Array<{ x: number; y: number }> = [];
  private age: number = 0;
  public waveRadius: number = 14;
  public maxWaveRadius: number = 210;

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
    const width =
      type === 'beam'
        ? 24
        : type === 'plasma'
        ? 12
        : type === 'homing_missile'
        ? 8
        : type === 'rail_slug'
        ? 6
        : type === 'quantum_lance'
        ? 6
        : type === 'supernova_wave'
        ? 28
        : 4;
    const height =
      type === 'beam'
        ? 48
        : type === 'plasma'
        ? 12
        : type === 'homing_missile'
        ? 16
        : type === 'rail_slug'
        ? 22
        : type === 'quantum_lance'
        ? 24
        : type === 'supernova_wave'
        ? 28
        : 14;
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
    this.age += dt;

    if (this.type === 'bug_bomb' && this.homingTargetX !== undefined) {
      // Gentle tracking towards target
      const dx = this.homingTargetX - this.centerX;
      this.vx += Math.sign(dx) * 70 * dt;
      this.vx = Math.max(-90, Math.min(90, this.vx));
    } else if (this.type === 'homing_missile') {
      if (this.targetEntity && this.targetEntity.isAlive) {
        this.homingTargetX = this.targetEntity.centerX;
        this.homingTargetY = this.targetEntity.centerY;
      }

      if (this.homingTargetX !== undefined && this.homingTargetY !== undefined) {
        const dx = this.homingTargetX - this.centerX;
        const dy = this.homingTargetY - this.centerY;
        const desiredAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(this.vy, this.vx);
        let diff = desiredAngle - currentAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        const maxTurn = 6.8 * dt;
        const nextAngle = currentAngle + Math.max(-maxTurn, Math.min(maxTurn, diff));
        const speed = Math.min(540, Math.hypot(this.vx, this.vy) + 180 * dt);
        this.vx = Math.cos(nextAngle) * speed;
        this.vy = Math.sin(nextAngle) * speed;
      }

      this.trail.push({ x: this.centerX, y: this.centerY });
      if (this.trail.length > 14) {
        this.trail.shift();
      }
    } else if (this.type === 'supernova_wave') {
      const cx = this.centerX;
      const cy = this.centerY;
      this.waveRadius += 420 * dt;
      this.width = this.waveRadius * 2;
      this.height = this.waveRadius * 2;
      this.x = cx - this.waveRadius;
      this.y = cy - this.waveRadius;
      if (this.waveRadius >= this.maxWaveRadius) {
        this.isAlive = false;
      }
      return;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Out of bounds check
    if (this.y < -70 || this.y > bounds.height + 70 || this.x < -70 || this.x > bounds.width + 70) {
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
      ctx.fillRect(this.x + 1, this.y + 2, Math.max(1, this.width - 2), Math.max(2, this.height - 4));
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
      const grad = ctx.createRadialGradient(this.centerX, this.centerY, 2, this.centerX, this.centerY, 7);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, this.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'diagonal_laser') {
      ctx.strokeStyle = this.color || '#a855f7';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 0.05, this.y + this.vy * 0.05);
      ctx.stroke();
    } else if (this.type === 'homing_missile') {
      // Smoke & heat contrail
      if (this.trail.length > 1) {
        for (let i = 1; i < this.trail.length; i++) {
          const t0 = this.trail[i - 1];
          const t1 = this.trail[i];
          const alpha = (i / this.trail.length) * 0.65;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1.5 + (i / this.trail.length) * 2.5;
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          ctx.lineTo(t1.x, t1.y);
          ctx.stroke();
        }
      }

      const angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
      ctx.translate(this.centerX, this.centerY);
      ctx.rotate(angle);

      // Flame exhaust
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-2.5, 6);
      ctx.lineTo(0, 14 + Math.sin(this.age * 40) * 3);
      ctx.lineTo(2.5, 6);
      ctx.closePath();
      ctx.fill();

      // White missile fuselage
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-2.5, -5, 5, 11);

      // Crimson warhead tip
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(3, -5);
      ctx.lineTo(-3, -5);
      ctx.closePath();
      ctx.fill();

      // Side fins
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-4.5, 2, 9, 3);
    } else if (this.type === 'supernova_wave') {
      const progress = Math.min(1, this.waveRadius / this.maxWaveRadius);
      const alpha = Math.max(0, 1 - progress);
      ctx.globalCompositeOperation = 'lighter';
      const grad = ctx.createRadialGradient(
        this.centerX,
        this.centerY,
        Math.max(1, this.waveRadius * 0.5),
        this.centerX,
        this.centerY,
        this.waveRadius
      );
      grad.addColorStop(0, 'rgba(250, 204, 21, 0)');
      grad.addColorStop(0.7, `rgba(249, 115, 22, ${0.45 * alpha})`);
      grad.addColorStop(0.92, `rgba(255, 255, 255, ${0.85 * alpha})`);
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.waveRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(250, 204, 21, ${0.9 * alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.waveRadius * 0.96, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'rail_slug') {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height * 0.65);
      ctx.lineTo(this.centerX, this.y + this.height);
      ctx.lineTo(this.x, this.y + this.height * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.centerX - 1, this.y + 3, 2, this.height - 8);
    } else if (this.type === 'quantum_lance') {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = '#e0e7ff';
      ctx.fillRect(this.x + 1.5, this.y + 2, Math.max(1, this.width - 3), this.height - 4);
    }
    ctx.restore();
  }
}
