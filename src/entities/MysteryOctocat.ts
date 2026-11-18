import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

export class MysteryOctocat extends Entity {
  public hp: number = 45;
  public maxHp: number = 45;
  public scoreValue: number = 500;
  public xpValue: number = 500;
  public time: number = 0;

  constructor(x: number, y: number, vx: number) {
    super(x, y, 52, 30);
    this.vx = vx;
    this.vy = 0;
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.time += dt;
    this.x += this.vx * dt;
    this.y += Math.sin(this.time * 4) * 24 * dt;

    if ((this.vx > 0 && this.x > bounds.width + 70) || (this.vx < 0 && this.x + this.width < -70)) {
      this.isAlive = false;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawMysteryOctocat(ctx, this.x, this.y, this.width, this.height, this.time);
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
