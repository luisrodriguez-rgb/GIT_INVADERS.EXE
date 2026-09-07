import { Entity } from './Entity';

export class DependencyDrone extends Entity {
  public hp: number = 25;
  public maxHp: number = 25;
  public scoreValue: number = 35;
  public isRoot: boolean = false;
  public parent?: DependencyDrone;
  public children: DependencyDrone[] = [];
  public pkgName: string;
  private animTimer: number = 0;

  constructor(x: number, y: number, pkgName: string, isRoot: boolean = false) {
    super(x, y, 26, 22);
    this.pkgName = pkgName;
    this.isRoot = isRoot;
    if (isRoot) {
      this.hp = 50;
      this.maxHp = 50;
      this.scoreValue = 75;
      this.width = 32;
      this.height = 26;
    }
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.animTimer += dt * 5;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    // 1. Draw dependency connection line to parent node
    if (this.parent && this.parent.isAlive) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.centerY);
      ctx.lineTo(this.parent.centerX, this.parent.centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Drone Node (Hexagon / Package Box)
    const color = this.isRoot ? '#f59e0b' : '#38bdf8';
    ctx.strokeStyle = color;
    ctx.fillStyle = `${color}22`;
    ctx.lineWidth = this.isRoot ? 2 : 1.2;

    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();

    // Package cross lines
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.moveTo(this.x + this.width, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.stroke();

    // Center pulse
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.isRoot ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Node label
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 6.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.pkgName, this.centerX, this.y - 3);

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
