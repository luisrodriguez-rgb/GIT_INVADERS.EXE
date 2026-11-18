import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

/**
 * Agile sinusoidal interceptor representing emergency hotfix deployments.
 */
export class HotfixInterceptor extends Entity {
  public hp: number = 35;
  public maxHp: number = 35;
  public xpValue: number = 180;
  public patchTag: string;
  public phaseOffset: number;
  public time: number = 0;

  constructor(x: number, y: number, patchTag: string = 'hotfix/v2', phaseOffset: number = 0) {
    super(x, y, 38, 30);
    this.scoreValue = 180;
    this.patchTag = patchTag;
    this.phaseOffset = phaseOffset;
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.time += dt;
    const strafeVel = Math.cos(this.time * 4.2 + this.phaseOffset) * 52;
    this.x += (this.vx + strafeVel) * dt;
    this.y += this.vy * dt;
    this.x = Math.max(8, Math.min(bounds.width - this.width - 8, this.x));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawHotfixInterceptor(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.time,
      this.hp / this.maxHp,
      this.patchTag
    );
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
