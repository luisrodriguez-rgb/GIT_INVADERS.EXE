import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

export class IssueBomber extends Entity {
  public issueNumber: number;
  public issueTitle: string;
  public scoreValue: number = 80;
  public xpValue: number = 80;
  public targetPlayerX: number = 0;
  public targetPlayerY: number = 0;
  public startDiveX: number = 0;
  public diveProgress: number = 0;
  public originalY: number = 0;
  public diveTimer: number = 0;
  public isDiving: boolean = false;
  public time: number = 0;

  constructor(
    x: number,
    y: number,
    issueNumber: number = 1,
    issueTitle: string = 'Issue: Memory leak'
  ) {
    super(x, y, 26, 24);
    this.issueNumber = issueNumber;
    this.issueTitle = issueTitle;
    this.originalY = y;
    this.diveTimer = 3.5 + Math.random() * 6.0;
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.time += dt;

    if (!this.isDiving) {
      this.diveTimer -= dt;
      if (this.diveTimer <= 0) {
        this.isDiving = true;
        this.startDiveX = this.x;
        this.diveProgress = 0;
        this.vy = 210;
        this.vx = (this.targetPlayerX - this.x) * 0.8;
      } else {
        // High agility sinusoidal jitter while in formation
        this.x += this.vx * dt + Math.sin(this.time * 4) * 8 * dt;
        this.y += this.vy * dt;
        return;
      }
    }

    // Diving motion: Acrobatic swoop targeting player position
    this.diveProgress += dt * 0.75;
    const swoopOffset = Math.sin(this.diveProgress * Math.PI) * 45;
    this.x += (this.vx + swoopOffset) * dt;
    this.y += this.vy * dt;

    // Reset loop if off bottom
    if (this.y > bounds.height + 25) {
      this.y = -35;
      this.x = Math.max(30, Math.min(bounds.width - 50, this.startDiveX));
      this.isDiving = false;
      this.vy = 0;
      this.diveTimer = 5.0 + Math.random() * 8.0;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawIssueBomber(ctx, this.x, this.y, this.width, this.height, this.time, this.isDiving);
  }

  public takeDamage(_amount: number): boolean {
    this.isAlive = false;
    return true; // Single hit kills bomber bug
  }
}
