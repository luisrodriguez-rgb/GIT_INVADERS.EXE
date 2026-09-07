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

    // Special archetype movement quirks
    if (this.blueprint.archetype === 'rebase_phantom' && Math.sin(this.time * 2.2) > 0.95 && Math.random() < 0.2) {
      // Quantum Dash: Instant teleportation across arena
      this.floatAngle += Math.PI * 0.65;
      SFX.playPowerup();
    }

    // Movement: Sweeping horizontal sinusoid modulated by state
    const isEnraged = this.stateMachine.state === 'ENRAGED' || this.stateMachine.state === 'CRITICAL';
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
      this.blueprint.archetype || this.blueprint.chassisType || 'commit_core'
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

    const archetype = this.blueprint.archetype || 'commit_core';
    const langColor = this.blueprint.languageColor || '#00e5ff';

    switch (archetype) {
      // 01. COMMIT CORE: Rapid Commit Storm + Radial History Pulse
      case 'commit_core': {
        const stormCount = isFrenzy ? 5 : 3;
        for (let i = 0; i < stormCount; i++) {
          const spread = (i - (stormCount - 1) / 2) * 45;
          bullets.push(
            new Projectile(this.centerX - 5, this.y + this.height - 10, spread, 270, 'boss', 'plasma', 20, '#ff0055')
          );
        }
        if (this.currentPhase >= 2 && Math.random() < 0.45) {
          // History Pulse ring
          for (let r = 0; r < 6; r++) {
            const angle = (r / 6) * Math.PI * 2;
            bullets.push(
              new Projectile(this.centerX, this.centerY, Math.cos(angle) * 180, Math.sin(angle) * 180, 'boss', 'plasma', 18, '#ffd600')
            );
          }
        }
        break;
      }

      // 02. THE FORTRESS: PR Turrets + Deflector Beams
      case 'the_fortress': {
        // Dual flanking PR turrets
        bullets.push(
          new Projectile(this.x - 12, this.y + this.height * 0.6, 0, 240, 'boss', 'diagonal_laser', 30, '#00e5ff'),
          new Projectile(this.x + this.width + 8, this.y + this.height * 0.6, 0, 240, 'boss', 'diagonal_laser', 30, '#00e5ff')
        );
        // Central heavy cannon
        bullets.push(
          new Projectile(this.centerX - 6, this.y + this.height, 0, 280, 'boss', 'plasma', 35, '#38bdf8')
        );
        break;
      }

      // 03. ISSUE SWARM: Homing Bug Bombs + Tentacle Swarm
      case 'issue_swarm': {
        const bomb = new Projectile(this.centerX - 6, this.y + this.height, 0, 190, 'boss', 'bug_bomb', 35, '#ef4444');
        bomb.homingTargetX = playerX;
        bullets.push(bomb);

        // Tentacle scatter
        [-1, 1].forEach((dir) => {
          bullets.push(
            new Projectile(this.centerX + dir * 35, this.y + this.height - 5, dir * 120, 220, 'boss', 'plasma', 20, '#a855f7')
          );
        });
        break;
      }

      // 04. DEPENDENCY HYDRA: Simultaneous Multi-Head Volley
      case 'dependency_hydra': {
        for (let h = 0; h < 4; h++) {
          const hAngle = -0.3 + (h / 3) * 0.6;
          bullets.push(
            new Projectile(this.x + 20 + h * 30, this.y + this.height - 8, Math.sin(hAngle) * 140, 230, 'boss', 'plasma', 25, '#10b981')
          );
        }
        break;
      }

      // 05. MERGE CONFLICT: Crossing Conflict Lasers (HEAD vs branch)
      case 'merge_conflict': {
        // Cyan beam from HEAD (left), Red beam from branch (right)
        bullets.push(
          new Projectile(this.x + 15, this.y + this.height - 5, 140, 220, 'boss', 'diagonal_laser', 30, '#00e5ff'),
          new Projectile(this.x + this.width - 15, this.y + this.height - 5, -140, 220, 'boss', 'diagonal_laser', 30, '#ff0055')
        );
        break;
      }

      // 06. CONTRIBUTOR OVERLORD: Community Fleet Salvo
      case 'contributor_overlord': {
        const count = 5;
        const spacing = this.width / (count + 1);
        for (let i = 1; i <= count; i++) {
          bullets.push(
            new Projectile(this.x + i * spacing - 4, this.y + this.height - 5, 0, 250, 'boss', 'plasma', 25, '#c084fc')
          );
        }
        break;
      }

      // 07. BRANCHLORD: Branching Trajectory Lasers
      case 'branchlord': {
        bullets.push(
          new Projectile(this.centerX, this.y + this.height, 0, 260, 'boss', 'diagonal_laser', 30, '#fbbf24'),
          new Projectile(this.centerX, this.y + this.height, -160, 230, 'boss', 'diagonal_laser', 25, '#10b981'),
          new Projectile(this.centerX, this.y + this.height, 160, 230, 'boss', 'diagonal_laser', 25, '#10b981')
        );
        break;
      }

      // 08. REBASE PHANTOM: Heavy Legacy Projectiles
      case 'rebase_phantom': {
        bullets.push(
          new Projectile(this.centerX - 10, this.y + this.height, 0, 310, 'boss', 'plasma', 45, '#ef4444')
        );
        if (Math.random() < 0.5) {
          bullets.push(
            new Projectile(this.x + 10, this.y + this.height - 10, -80, 260, 'boss', 'plasma', 25, '#ff0055'),
            new Projectile(this.x + this.width - 10, this.y + this.height - 10, 80, 260, 'boss', 'plasma', 25, '#ff0055')
          );
        }
        break;
      }

      // 09. SECURITY SENTINEL: Tri-Bursts & Encryption Laser
      case 'security_sentinel': {
        bullets.push(
          new Projectile(this.centerX - 12, this.y + this.height, -50, 270, 'boss', 'diagonal_laser', 30, '#38bdf8'),
          new Projectile(this.centerX, this.y + this.height, 0, 290, 'boss', 'plasma', 35, '#0284c7'),
          new Projectile(this.centerX + 12, this.y + this.height, 50, 270, 'boss', 'diagonal_laser', 30, '#38bdf8')
        );
        break;
      }

      // 10. CODE ABYSS: Singularity Distortion Pulse
      case 'code_abyss':
      default: {
        const bomb = new Projectile(this.centerX - 6, this.y + this.height, 0, 200, 'boss', 'bug_bomb', 40, '#ff007f');
        bomb.homingTargetX = playerX;
        bullets.push(bomb);

        bullets.push(
          new Projectile(this.centerX, this.y + this.height, -150, 220, 'boss', 'diagonal_laser', 30, '#a855f7'),
          new Projectile(this.centerX, this.y + this.height, 150, 220, 'boss', 'diagonal_laser', 30, '#a855f7')
        );
        break;
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
