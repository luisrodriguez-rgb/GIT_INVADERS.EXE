import { Entity } from './Entity';

/**
 * Biomechanical cyber-cephalopod / jellyfish dependency carrier with tentacles and spore nodes.
 */
export class DependencyDrone extends Entity {
  public hp: number = 25;
  public maxHp: number = 25;
  public scoreValue: number = 35;
  public isRoot: boolean = false;
  public parent?: DependencyDrone;
  public children: DependencyDrone[] = [];
  public pkgName: string;
  public orbitAngle: number = 0;
  public orbitRadius: number = 18;
  public orbitSpeed: number = 1.8;
  public animTimer: number = 0;

  constructor(x: number, y: number, pkgName: string, isRoot: boolean = false, orbitPhase: number = 0) {
    super(x, y, 22, 18);
    this.pkgName = pkgName;
    this.isRoot = isRoot;
    this.orbitAngle = orbitPhase;
    if (isRoot) {
      this.hp = 50;
      this.maxHp = 50;
      this.scoreValue = 75;
      this.width = 34;
      this.height = 28;
    }
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.animTimer += dt * 4.5;

    if (this.parent && this.parent.isAlive) {
      this.orbitAngle += dt * this.orbitSpeed;
      this.x = this.parent.centerX + Math.cos(this.orbitAngle) * this.orbitRadius - this.width / 2;
      this.y = this.parent.centerY + Math.sin(this.orbitAngle) * (this.orbitRadius * 0.65) - this.height / 2;
    } else {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    // 1. Bio-cable tether to root organism
    if (this.parent && this.parent.isAlive) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.centerY);
      ctx.lineTo(this.parent.centerX, this.parent.centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.translate(this.centerX, this.centerY);
    const hw = this.width / 2;
    const hh = this.height / 2;
    const color = this.isRoot ? '#10b981' : '#38bdf8';
    const accent = this.isRoot ? '#facc15' : '#a855f7';

    // 2. Undulating Biomechanical Tentacles
    const tentacleCount = this.isRoot ? 4 : 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = this.isRoot ? 1.8 : 1.2;
    for (let i = 0; i < tentacleCount; i++) {
      const tx = -hw * 0.48 + (i / Math.max(1, tentacleCount - 1)) * hw * 0.96;
      const sway = Math.sin(this.animTimer + i * 1.4) * 4;
      ctx.beginPath();
      ctx.moveTo(tx, hh * 0.15);
      ctx.quadraticCurveTo(tx + sway, hh * 0.65, tx - sway * 0.7, hh * 1.05);
      ctx.stroke();

      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(tx - sway * 0.7, hh * 1.05, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Domed Cephalopod Carapace Bell
    const bell = new Path2D();
    bell.moveTo(-hw * 0.88, hh * 0.15);
    bell.quadraticCurveTo(-hw * 0.7, -hh * 0.92, 0, -hh * 0.92);
    bell.quadraticCurveTo(hw * 0.7, -hh * 0.92, hw * 0.88, hh * 0.15);
    bell.lineTo(hw * 0.45, hh * 0.35);
    bell.lineTo(-hw * 0.45, hh * 0.35);
    bell.closePath();

    const domeGrad = ctx.createRadialGradient(0, -hh * 0.3, 1, 0, 0, hw);
    domeGrad.addColorStop(0, this.isRoot ? '#34d399' : '#7dd3fc');
    domeGrad.addColorStop(0.55, this.isRoot ? '#064e3b' : '#0c4a6e');
    domeGrad.addColorStop(1, '#020617');
    ctx.fillStyle = domeGrad;
    ctx.fill(bell);
    ctx.strokeStyle = color;
    ctx.lineWidth = this.isRoot ? 1.8 : 1.2;
    ctx.stroke(bell);

    // 4. Twin Alien Predator Eyes & Core Synapse
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.28, -hh * 0.1, 2.2, 1.4, -0.3, 0, Math.PI * 2);
    ctx.ellipse(hw * 0.28, -hh * 0.1, 2.2, 1.4, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Compact label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.pkgName.slice(0, 8), 0, -hh - 3);

    ctx.restore();
  }

  public takeDamage(amount: number): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isAlive = false;
      return true;
    }
    return false;
  }
}
