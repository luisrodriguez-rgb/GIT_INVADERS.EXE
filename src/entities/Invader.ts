import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

export class Invader extends Entity {
  public commitSha: string;
  public message: string;
  public author: string;
  public hp: number = 30;
  public maxHp: number = 30;
  public scoreValue: number = 25;
  public xpValue: number = 25;
  public color: string;
  public animFrame: number = 0;

  constructor(
    x: number,
    y: number,
    commitSha: string = '0x00',
    message: string = 'feat: commit',
    author: string = 'dev',
    color: string = '#00ff66'
  ) {
    super(x, y, 28, 22);
    this.commitSha = commitSha;
    this.message = message;
    this.author = author;
    this.color = color;
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawCommitInvader(ctx, this.x, this.y, this.width, this.height, this.animFrame, this.color, this.commitSha);
  }

  public takeDamage(amount: number): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isAlive = false;
      return true; // Destroyed
    }
    return false;
  }
}
