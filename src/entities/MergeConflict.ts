import { Entity } from './Entity';

export class ConflictFragment extends Entity {
  public branchName: string;
  public color: string;
  public scoreValue: number = 40;
  public hp: number = 1;
  private animTimer: number = 0;

  constructor(x: number, y: number, vx: number, branchName: string, color: string) {
    super(x, y, 22, 18);
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
    ctx.strokeStyle = this.color;
    ctx.fillStyle = `${this.color}22`;
    ctx.lineWidth = 1.5;

    // Diamond fragment
    ctx.beginPath();
    ctx.moveTo(this.centerX, this.y);
    ctx.lineTo(this.x + this.width, this.centerY);
    ctx.lineTo(this.centerX, this.y + this.height);
    ctx.lineTo(this.x, this.centerY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.branchName.substring(0, 4), this.centerX, this.centerY + 2.5);

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

export class MergeConflict extends Entity {
  public hp: number = 60;
  public maxHp: number = 60;
  public scoreValue: number = 85;
  private animTime: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 40, 26);
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.animTime += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    const w2 = this.width / 2;

    // Left half: Cyan (<<<<<<< HEAD)
    ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(this.x, this.y, w2, this.height);
    ctx.fill();
    ctx.stroke();

    // Right half: Violet (>>>>>>> branch)
    ctx.fillStyle = 'rgba(192, 132, 252, 0.2)';
    ctx.strokeStyle = '#c084fc';
    ctx.beginPath();
    ctx.rect(this.x + w2, this.y, w2, this.height);
    ctx.fill();
    ctx.stroke();

    // Divider line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + w2, this.y);
    ctx.lineTo(this.x + w2, this.y + this.height);
    ctx.stroke();

    // Text labels
    ctx.fillStyle = '#00e5ff';
    ctx.font = '700 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('<<', this.x + w2 * 0.5, this.centerY + 2.5);

    ctx.fillStyle = '#c084fc';
    ctx.fillText('>>', this.x + w2 * 1.5, this.centerY + 2.5);

    // HP Bar
    const hpPct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.x, this.y - 5, this.width, 3);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(this.x, this.y - 5, this.width * hpPct, 3);

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

  /**
   * Generates two fragmented entities when defeated
   */
  public split(): [ConflictFragment, ConflictFragment] {
    const headFragment = new ConflictFragment(this.x - 6, this.y, -70, 'HEAD', '#00e5ff');
    const branchFragment = new ConflictFragment(this.x + this.width / 2 + 6, this.y, 70, 'BRCH', '#c084fc');
    return [headFragment, branchFragment];
  }
}
