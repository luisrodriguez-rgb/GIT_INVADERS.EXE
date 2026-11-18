import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

/**
 * Orbital CI/CD defense platform that tracks and rotates twin barrels toward the player.
 */
export class PipelineTurret extends Entity {
  public hp: number = 65;
  public maxHp: number = 65;
  public xpValue: number = 220;
  public stageName: string;
  public targetX: number = 400;
  public aimAngle: number = Math.PI / 2;
  public time: number = 0;

  constructor(x: number, y: number, stageName: string = 'CI/CD_BUILD') {
    super(x, y, 40, 36);
    this.scoreValue = 220;
    this.stageName = stageName;
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.time += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const desiredAngle = Math.atan2(320, this.targetX - this.centerX);
    this.aimAngle += (desiredAngle - this.aimAngle) * Math.min(1, 6 * dt);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawPipelineTurret(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.time,
      this.aimAngle,
      this.hp / this.maxHp,
      this.stageName
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
