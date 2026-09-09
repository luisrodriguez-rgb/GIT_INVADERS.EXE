import { Entity } from './Entity';
import { Sprites } from '../rendering/Sprites';
import { SFX } from '../audio/SFX';

export class SecuritySentinel extends Entity {
  public hp: number = 80;
  public maxHp: number = 80;
  public scoreValue: number = 200;
  public xpValue: number = 200;
  public firewallActive: boolean = false;
  public firewallTimer: number = 0;
  public firewallDuration: number = 3.0;
  public firewallCooldown: number = 6.0;
  public time: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 44, 34);
    this.firewallTimer = 2.5 + Math.random() * 2.0;
  }

  public update(dt: number, _bounds: { width: number; height: number }): void {
    this.time += dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Firewall skill cycle
    this.firewallTimer -= dt;
    if (this.firewallActive) {
      if (this.firewallTimer <= 0) {
        this.firewallActive = false;
        this.firewallTimer = this.firewallCooldown;
      }
    } else {
      if (this.firewallTimer <= 0) {
        this.firewallActive = true;
        this.firewallTimer = this.firewallDuration;
        SFX.playShieldHit();
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawSecuritySentinel(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.time,
      this.firewallActive,
      this.hp / this.maxHp
    );
  }

  public takeDamage(amount: number): boolean {
    if (this.firewallActive) {
      SFX.playShieldHit();
      return false; // Firewall absorbs all incoming frontal blaster shots!
    }

    this.hp -= amount;
    if (this.hp <= 0) {
      this.isAlive = false;
      return true;
    }
    return false;
  }
}
