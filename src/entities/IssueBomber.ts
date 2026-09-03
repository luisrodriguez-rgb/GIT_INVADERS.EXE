import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

export class IssueBomber extends Entity {
  public issueNumber: number;
  public issueTitle: string;
  public scoreValue: number = 80;
  public xpValue: number = 80;
  public isDiving: boolean = false;
  private time: number = 0;
  private diveTimer: number = 0;
  private originalY: number;

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
    this.diveTimer = 4.0 + Math.random() * 8.0;
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.time += dt;

    if (!this.isDiving) {
      this.diveTimer -= dt;
      if (this.diveTimer <= 0) {
        this.isDiving = true;
        this.vy = 160;
        this.vx = (Math.random() - 0.5) * 120;
      } else {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        return;
      }
    }

    // Diving motion
    this.x += (this.vx + Math.sin(this.time * 6) * 140) * dt;
    this.y += this.vy * dt;

    // Reset loop if off bottom
    if (this.y > bounds.height + 20) {
      this.y = -30;
      this.isDiving = false;
      this.vy = 0;
      this.diveTimer = 6.0 + Math.random() * 10.0;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawIssueBomber(ctx, this.x, this.y, this.width, this.height, this.time);
  }

  public takeDamage(_amount: number): boolean {
    this.isAlive = false;
    return true; // Single hit kills bomber bug
  }
}
