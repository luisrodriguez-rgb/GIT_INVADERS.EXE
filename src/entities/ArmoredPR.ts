import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';
import { SFX } from '../audio/SFX';

export type PowerUpType = 'multi_shot' | 'stash_shield' | 'xp_boost';

export class ArmoredPR extends Entity {
  public prNumber: number;
  public prTitle: string;
  public author: string;
  public shields: number = 3;
  public maxShields: number = 3;
  public scoreValue: number = 150;
  public xpValue: number = 150;
  public powerUpDrop: PowerUpType;

  constructor(
    x: number,
    y: number,
    prNumber: number = 1,
    prTitle: string = 'PR: Update branch',
    author: string = 'dev'
  ) {
    super(x, y, 36, 28);
    this.prNumber = prNumber;
    this.prTitle = prTitle;
    this.author = author;

    const drops: PowerUpType[] = ['multi_shot', 'stash_shield', 'xp_boost'];
    this.powerUpDrop = drops[Math.floor(Math.random() * drops.length)];
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawArmoredPR(ctx, this.x, this.y, this.width, this.height, this.shields, this.maxShields);
  }

  public takeDamage(amount: number): boolean {
    if (this.shields > 1) {
      this.shields--;
      SFX.playShieldHit();
      return false; // Still shielded
    }

    this.shields = 0;
    this.isAlive = false;
    return true; // Destroyed
  }
}
