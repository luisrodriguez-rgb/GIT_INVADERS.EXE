import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

/**
 * Heavy armored legacy dreadnought with passive self-repair when uncontested.
 */
export class TechDebtJuggernaut extends Entity {
  public hp: number = 110;
  public maxHp: number = 110;
  public xpValue: number = 260;
  public debtLabel: string;
  public time: number = 0;
  public timeSinceHit: number = 0;

  constructor(x: number, y: number, debtLabel: string = 'LEGACY_TODO') {
    super(x, y, 48, 40);
    this.scoreValue = 260;
    this.debtLabel = debtLabel;
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.time += dt;
    this.timeSinceHit += dt;
    if (this.timeSinceHit > 2.0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + 3 * dt);
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawTechDebtJuggernaut(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.time,
      this.hp / this.maxHp,
      this.timeSinceHit > 2.0 && this.hp < this.maxHp,
      this.debtLabel
    );
  }

  public takeDamage(amount: number): boolean {
    this.timeSinceHit = 0;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isAlive = false;
      return true;
    }
    return false;
  }
}
