import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { BossBlueprint } from '../github/Types';
import { Sprites } from '../rendering/Sprites';
import { SFX } from '../audio/SFX';
import { BossStateMachine } from '../systems/BossStateMachine';

export class Boss extends Entity {
  public blueprint: BossBlueprint;
  public hp: number;
  public maxHp: number;
  public currentPhase: number = 1;
  public shieldActive: boolean = false;
  public shieldHp: number = 0;
  public maxShieldHp: number = 0;
  public stateMachine: BossStateMachine;

  private time: number = 0;
  private attackTimer: number = 0;
  private specialAttackTimer: number = 0;
  private floatAngle: number = 0;

  constructor(x: number, y: number, blueprint: BossBlueprint) {
    super(x, y, 140, 80);
    this.blueprint = blueprint;
    this.maxHp = blueprint.maxHp;
    this.hp = blueprint.maxHp;
    this.maxShieldHp = blueprint.shieldLayers * 150;
    this.shieldHp = this.maxShieldHp;
    this.attackTimer = 1.0;
    this.stateMachine = new BossStateMachine('ENTER');

    this.stateMachine.onStateChange((prev, next) => {
      if (next === 'PHASE_2') {
        this.currentPhase = 2;
        this.shieldActive = true;
        SFX.playBossWarning();
      } else if (next === 'CRITICAL' || next === 'ENRAGED') {
        this.currentPhase = 3;
        SFX.playBossWarning();
      }
    });
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.time += dt;
    this.floatAngle += dt * 1.2;

    // Delegate to Finite State Machine
    this.stateMachine.update(dt, {
      hp: this.hp,
      maxHp: this.maxHp,
      currentPhase: this.currentPhase,
      x: this.x,
      y: this.y,
      shieldDestroyed: !this.shieldActive,
    });

    // Movement: Sweeping horizontal sinusoid modulated by state
    const isEnraged = this.stateMachine.state === 'ENRAGED' || this.stateMachine.state === 'CRITICAL';
    const speed = 110 * (isEnraged ? 1.6 : 1.0);
    this.x = bounds.width / 2 - this.width / 2 + Math.sin(this.floatAngle) * (bounds.width * 0.35);

    if (this.stateMachine.state !== 'ENTER') {
      this.y = 70 + Math.sin(this.floatAngle * 2) * 15;
    }

    this.attackTimer -= dt;
    this.specialAttackTimer -= dt;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    Sprites.drawBoss(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.currentPhase,
      this.time,
      this.blueprint.languageColor,
      this.blueprint.chassisType || 'octo_destroyer'
    );
  }

  public tryAttack(playerX: number): Projectile[] {
    if (this.attackTimer > 0 || !this.isAlive || this.stateMachine.state === 'ENTER' || this.stateMachine.state === 'DESTROYED') {
      return [];
    }

    const isFrenzy = this.stateMachine.state === 'CRITICAL' || this.stateMachine.state === 'ENRAGED';
    const fireRate = this.blueprint.fireRateSeconds * (isFrenzy ? 0.55 : this.currentPhase === 3 ? 0.65 : 1.0);
    this.attackTimer = fireRate;
    const bullets: Projectile[] = [];

    SFX.playLaser('boss');

    // Standard Cannon Salvo (number of cannons based on contributors)
    const cannonCount = this.blueprint.cannons;
    const spacing = this.width / (cannonCount + 1);

    for (let i = 1; i <= cannonCount; i++) {
      const cx = this.x + i * spacing;
      bullets.push(
        new Projectile(cx - 6, this.y + this.height - 10, 0, 260, 'boss', 'plasma', 25, this.blueprint.languageColor)
      );
    }

    // Phase 2 / Matrix Attack: Merge Conflict Matrix (Diagonal crossing lasers)
    if ((this.currentPhase >= 2 || this.stateMachine.state === 'PHASE_2') && Math.random() < 0.6) {
      bullets.push(
        new Projectile(this.centerX, this.y + this.height, -160, 220, 'boss', 'diagonal_laser', 30, '#a855f7'),
        new Projectile(this.centerX, this.y + this.height, 160, 220, 'boss', 'diagonal_laser', 30, '#a855f7')
      );
    }

    // Phase 3 / Critical Attack: CI/CD Pipeline Overdrive (Tracking bug bombs & cluster curtain)
    if (isFrenzy || (this.currentPhase === 3 && Math.random() < 0.7)) {
      const bomb = new Projectile(this.centerX - 5, this.y + this.height, 0, 190, 'boss', 'bug_bomb', 35, '#ef4444');
      bomb.homingTargetX = playerX;
      bullets.push(bomb);

      if (this.stateMachine.state === 'CRITICAL' && Math.random() < 0.4) {
        // Lateral cluster burst
        bullets.push(
          new Projectile(this.x + 10, this.y + this.height, -90, 210, 'boss', 'plasma', 20, '#ff0055'),
          new Projectile(this.x + this.width - 10, this.y + this.height, 90, 210, 'boss', 'plasma', 20, '#ff0055')
        );
      }
    }

    return bullets;
  }

  public takeDamage(amount: number): boolean {
    if (this.shieldActive && this.shieldHp > 0) {
      this.shieldHp -= amount;
      SFX.playShieldHit();
      if (this.shieldHp <= 0) {
        this.shieldActive = false;
        SFX.playExplosion('medium');
      }
      return false;
    }

    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
      return true; // Boss defeated!
    }
    return false;
  }
}
