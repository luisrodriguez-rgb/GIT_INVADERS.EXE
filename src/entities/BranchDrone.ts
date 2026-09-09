import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';

export class BranchDrone extends Entity {
  public branchName: string;
  public scoreValue: number = 90;
  public xpValue: number = 90;
  public hp: number = 40;
  public maxHp: number = 40;
  public isSplit: boolean = false;
  public time: number = 0;
  public isChild: boolean = false;

  constructor(
    x: number,
    y: number,
    branchName: string = 'feat/diverge',
    isChild: boolean = false
  ) {
    super(x, y, isChild ? 22 : 32, isChild ? 18 : 24);
    this.branchName = branchName;
    this.isChild = isChild;
    if (isChild) {
      this.hp = 20;
      this.maxHp = 20;
      this.scoreValue = 45;
      this.xpValue = 45;
    }
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.time += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawBranchDrone(ctx, this.x, this.y, this.width, this.height, this.time, this.isChild, this.branchName);
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
