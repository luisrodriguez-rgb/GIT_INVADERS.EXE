import { Entity } from './Entity';

/**
 * Winged conflict splinter mini-drake spawned when a MergeConflict splits.
 */
export class ConflictFragment extends Entity {
  public branchName: string;
  public color: string;
  public scoreValue: number = 40;
  public hp: number = 1;
  private animTimer: number = 0;

  constructor(x: number, y: number, vx: number, branchName: string, color: string) {
    super(x, y, 24, 20);
    this.vx = vx;
    this.vy = 40;
    this.branchName = branchName;
    this.color = color;
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.animTimer += dt * 8;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < 10 || this.x + this.width > bounds.width - 10) {
      this.vx *= -1;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    const hw = this.width / 2;
    const hh = this.height / 2;
    const flap = Math.sin(this.animTimer) * 3;

    // Winged mini-drake silhouette
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.8);
    ctx.lineTo(hw * 0.95, -hh * 0.25 + flap);
    ctx.lineTo(hw * 0.55, hh * 0.6);
    ctx.lineTo(0, hh * 0.95);
    ctx.lineTo(-hw * 0.55, hh * 0.6);
    ctx.lineTo(-hw * 0.95, -hh * 0.25 + flap);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

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

/**
 * Two-headed split Chimera invader representing colliding Git branches (HEAD vs Branch).
 */
export class MergeConflict extends Entity {
  public hp: number = 60;
  public maxHp: number = 60;
  public scoreValue: number = 85;
  private animTime: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 42, 32);
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.animTime += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    const hw = this.width / 2;
    const hh = this.height / 2;
    const jitter = Math.sin(this.animTime * 14) * 1.4;

    // Left Half: Cyan Cyber-Drake Wing & Horned Head (HEAD)
    ctx.fillStyle = '#083344';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-2, -hh * 0.35);
    ctx.lineTo(-hw * 0.32, -hh * 0.95);
    ctx.lineTo(-hw * 1.0, -hh * 0.2 + jitter);
    ctx.lineTo(-hw * 0.72, hh * 0.72);
    ctx.lineTo(-2, hh * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Half: Magenta Cyber-Drake Wing & Horned Head (BRANCH)
    ctx.fillStyle = '#3b0764';
    ctx.strokeStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(2, -hh * 0.35);
    ctx.lineTo(hw * 0.32, -hh * 0.95);
    ctx.lineTo(hw * 1.0, -hh * 0.2 - jitter);
    ctx.lineTo(hw * 0.72, hh * 0.72);
    ctx.lineTo(2, hh * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chimera Eyes (Left & Right heads)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-hw * 0.36, -hh * 0.28, 2, 0, Math.PI * 2);
    ctx.arc(hw * 0.36, -hh * 0.28, 2, 0, Math.PI * 2);
    ctx.fill();

    // Crackling Golden Lightning Conflict Rift down the spine
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.95);
    ctx.lineTo(-3, -hh * 0.2);
    ctx.lineTo(3, hh * 0.2);
    ctx.lineTo(0, hh * 0.95);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // HP Bar
    const hpPct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(-hw, -hh - 6, this.width, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-hw, -hh - 6, this.width * hpPct, 3);

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

  public split(): [ConflictFragment, ConflictFragment] {
    const headFragment = new ConflictFragment(this.x - 6, this.y, -70, 'HEAD', '#00e5ff');
    const branchFragment = new ConflictFragment(this.x + this.width / 2 + 6, this.y, 70, 'BRCH', '#f43f5e');
    return [headFragment, branchFragment];
  }
}
