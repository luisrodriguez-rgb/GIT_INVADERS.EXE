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

  // Adaptive Memory & Player Behavioral Telemetry
  public playerHabits = {
    dodgeLeftDuration: 0,
    dodgeRightDuration: 0,
    centerDuration: 0,
    shieldActivationCount: 0,
    wasShieldActiveLastFrame: false,
  };
  public activeAdaptiveNotice: string | null = null;
  public noticeTimer: number = 0;
  private adaptiveCooldown: number = 4.0;
  private armorRegenTimer: number = 0;

  private time: number = 0;
  private attackTimer: number = 0;
  private specialAttackTimer: number = 0;
  private floatAngle: number = 0;

  constructor(x: number, y: number, blueprint: BossBlueprint) {
    super(x, y, 140, 80);
    this.blueprint = blueprint;

    // Multidimensional dimension: RUST HEAVY grants +25% base shield and armor capacity
    const isRust = blueprint.language.toLowerCase().includes('rust');
    const shieldBonus = isRust ? 1.25 : 1.0;

    this.maxHp = blueprint.maxHp;
    this.hp = blueprint.maxHp;
    this.maxShieldHp = Math.round(blueprint.shieldLayers * 150 * shieldBonus);
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
        this.shieldActive = true;
        this.shieldHp = Math.round(this.maxShieldHp * 0.5);
        SFX.playBossWarning();
      }
    });
  }

  /**
   * Tracks player behavior in real-time to train adaptive counter-measures.
   */
  public trackPlayer(playerX: number, playerShieldActive: boolean, arenaWidth: number, dt: number): void {
    const leftBound = arenaWidth * 0.35;
    const rightBound = arenaWidth * 0.65;

    if (playerX < leftBound) {
      this.playerHabits.dodgeLeftDuration += dt;
      this.playerHabits.dodgeRightDuration = Math.max(0, this.playerHabits.dodgeRightDuration - dt * 0.5);
    } else if (playerX > rightBound) {
      this.playerHabits.dodgeRightDuration += dt;
      this.playerHabits.dodgeLeftDuration = Math.max(0, this.playerHabits.dodgeLeftDuration - dt * 0.5);
    } else {
      this.playerHabits.centerDuration += dt;
    }

    if (playerShieldActive && !this.playerHabits.wasShieldActiveLastFrame) {
      this.playerHabits.shieldActivationCount++;
    }
    this.playerHabits.wasShieldActiveLastFrame = playerShieldActive;

    if (this.noticeTimer > 0) {
      this.noticeTimer -= dt;
      if (this.noticeTimer <= 0) {
        this.activeAdaptiveNotice = null;
      }
    }
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    this.time += dt;

    // Mutation dimension: OVERCLOCKED moves 40% faster
    const isOverclocked = this.blueprint.mutation === 'OVERCLOCKED';
    const speedMult = isOverclocked ? 1.6 : 1.2;
    this.floatAngle += dt * speedMult;

    // Multidimensional dimension: RUST HEAVY Armor Regeneration
    const isRust = this.blueprint.language.toLowerCase().includes('rust');
    if (isRust && this.isAlive) {
      this.armorRegenTimer += dt;
      if (this.armorRegenTimer >= 4.5) {
        this.armorRegenTimer = 0;
        if (this.shieldActive && this.shieldHp < this.maxShieldHp) {
          this.shieldHp = Math.min(this.maxShieldHp, this.shieldHp + 35);
        } else if (!this.shieldActive && this.hp < this.maxHp) {
          this.hp = Math.min(this.maxHp, this.hp + 20);
        }
      }
    }

    // Delegate to Finite State Machine
    this.stateMachine.update(dt, {
      hp: this.hp,
      maxHp: this.maxHp,
      currentPhase: this.currentPhase,
      x: this.x,
      y: this.y,
      shieldDestroyed: !this.shieldActive,
    });

    // Special archetype movement quirks: Quantum Dash for Rebase Phantom
    if (this.blueprint.archetype === 'rebase_phantom' && Math.sin(this.time * 2.2) > 0.95 && Math.random() < 0.2) {
      this.floatAngle += Math.PI * 0.65;
      SFX.playPowerup();
    }

    // Movement: Sweeping horizontal sinusoid modulated by state and mutation
    const horizRange = bounds.width * (isOverclocked ? 0.42 : 0.35);
    this.x = bounds.width / 2 - this.width / 2 + Math.sin(this.floatAngle) * horizRange;

    if (this.stateMachine.state !== 'ENTER') {
      this.y = 70 + Math.sin(this.floatAngle * 2) * 15;
    }

    this.attackTimer -= dt;
    this.specialAttackTimer -= dt;
    this.adaptiveCooldown -= dt;
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
    const isOverclocked = this.blueprint.mutation === 'OVERCLOCKED';
    const isTypeScript = this.blueprint.language.toLowerCase().includes('typescript');
    const isPython = this.blueprint.language.toLowerCase().includes('python');
    const isCorrupted = this.blueprint.mutation === 'CORRUPTED';
    const isForked = this.blueprint.mutation === 'FORKED';
    const isRecursive = this.blueprint.mutation === 'RECURSIVE';

    const baseFireRate = this.blueprint.fireRateSeconds * (isFrenzy ? 0.55 : this.currentPhase === 3 ? 0.65 : 1.0);
    const fireRate = isOverclocked ? baseFireRate * 0.75 : baseFireRate;
    this.attackTimer = fireRate;
    const bullets: Projectile[] = [];

    SFX.playLaser('boss');

    const archetype = this.blueprint.archetype || 'commit_core';
    const langColor = this.blueprint.languageColor || '#00e5ff';

    // ── ADAPTIVE MEMORY TACTICAL COUNTER-ATTACK ──────────────────────────
    if (this.adaptiveCooldown <= 0) {
      if (this.playerHabits.dodgeLeftDuration > 3.0) {
        // Player camps on left flank: Execute Left Flank Sweep
        this.activeAdaptiveNotice = 'ADAPTIVE AI // LEFT FLANK BIAS DETECTED // SWEEP ENGAGED';
        this.noticeTimer = 3.0;
        this.adaptiveCooldown = 6.5;
        this.playerHabits.dodgeLeftDuration = 0;
        for (let i = 0; i < 3; i++) {
          bullets.push(
            new Projectile(this.centerX, this.y + this.height, -180 - i * 40, 260, 'boss', 'diagonal_laser', 30, '#ff0055')
          );
        }
      } else if (this.playerHabits.dodgeRightDuration > 3.0) {
        // Player camps on right flank: Execute Right Flank Sweep
        this.activeAdaptiveNotice = 'ADAPTIVE AI // RIGHT FLANK BIAS DETECTED // SWEEP ENGAGED';
        this.noticeTimer = 3.0;
        this.adaptiveCooldown = 6.5;
        this.playerHabits.dodgeRightDuration = 0;
        for (let i = 0; i < 3; i++) {
          bullets.push(
            new Projectile(this.centerX, this.y + this.height, 180 + i * 40, 260, 'boss', 'diagonal_laser', 30, '#ff0055')
          );
        }
      } else if (this.playerHabits.centerDuration > 4.0) {
        // Player stays center: Deploy high-velocity Penetrating Orbital Lance
        this.activeAdaptiveNotice = 'ADAPTIVE AI // CENTER CAMPING DETECTED // ORBITAL LANCE ENGAGED';
        this.noticeTimer = 3.0;
        this.adaptiveCooldown = 6.5;
        this.playerHabits.centerDuration = 0;
        bullets.push(
          new Projectile(this.centerX - 10, this.y + this.height, 0, 380, 'boss', 'plasma', 45, '#ffd600'),
          new Projectile(this.centerX + 10, this.y + this.height, 0, 380, 'boss', 'plasma', 45, '#ffd600')
        );
      } else if (this.playerHabits.shieldActivationCount >= 2) {
        // Player abuses shield: EMP Disruption Pulse
        this.activeAdaptiveNotice = 'ADAPTIVE AI // SHIELD USAGE EXCEEDED // EMP PULSE ENGAGED';
        this.noticeTimer = 3.0;
        this.adaptiveCooldown = 7.5;
        this.playerHabits.shieldActivationCount = 0;
        for (let r = 0; r < 5; r++) {
          const angle = -0.5 + (r / 4) * 1.0;
          bullets.push(
            new Projectile(this.centerX, this.y + this.height, Math.sin(angle) * 200, 240, 'boss', 'plasma', 25, '#38bdf8')
          );
        }
      }
    }

    // ── CANONICAL ARCHETYPE PATTERNS WITH MULTIDIMENSIONAL INFLUENCE ────
    switch (archetype) {
      // 01. COMMIT CORE: Rapid Commit Storm + Radial History Pulse
      case 'commit_core': {
        const stormCount = isFrenzy ? 5 : 3;
        for (let i = 0; i < stormCount; i++) {
          const spread = (i - (stormCount - 1) / 2) * (isForked ? 70 : 45);
          const p = new Projectile(this.centerX - 5, this.y + this.height - 10, spread, 270, 'boss', 'plasma', 20, '#ff0055');
          if (isTypeScript) p.homingTargetX = playerX;
          bullets.push(p);
        }
        if (this.currentPhase >= 2 && Math.random() < 0.45) {
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
        bullets.push(
          new Projectile(this.x - 12, this.y + this.height * 0.6, 0, 240, 'boss', 'diagonal_laser', 30, '#00e5ff'),
          new Projectile(this.x + this.width + 8, this.y + this.height * 0.6, 0, 240, 'boss', 'diagonal_laser', 30, '#00e5ff')
        );
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
          const p = new Projectile(this.x + 20 + h * 30, this.y + this.height - 8, Math.sin(hAngle) * 140, 230, 'boss', 'plasma', 25, '#10b981');
          if (isTypeScript) p.homingTargetX = playerX;
          bullets.push(p);
        }
        break;
      }

      // 05. MERGE CONFLICT: Crossing Conflict Lasers (HEAD vs branch)
      case 'merge_conflict': {
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

    // Secondary Language Dimension: PYTHON HEAVY adds autonomous bug bomber
    if (isPython && Math.random() < 0.35) {
      const droneBomb = new Projectile(this.centerX, this.y + this.height, 0, 180, 'boss', 'bug_bomb', 25, '#22c55e');
      droneBomb.homingTargetX = playerX;
      bullets.push(droneBomb);
    }

    // Secondary Mutation Dimension: CORRUPTED adds chaotic ballistic distortion
    if (isCorrupted) {
      bullets.forEach((b, idx) => {
        b.vx += Math.sin(this.time * 6 + idx) * 45;
      });
    }

    // Secondary Mutation Dimension: RECURSIVE creates delayed echo trail
    if (isRecursive && Math.random() < 0.4) {
      bullets.push(
        new Projectile(this.centerX, this.y + this.height - 25, 0, 200, 'boss', 'plasma', 15, '#c084fc')
      );
    }

    return bullets;
  }

  public takeDamage(amount: number): boolean {
    // SECURED mutation deflects 20% incoming damage while shields remain active
    const isSecured = this.blueprint.mutation === 'SECURED';
    const effectiveAmount = (isSecured && this.shieldActive) ? amount * 0.8 : amount;

    if (this.shieldActive && this.shieldHp > 0) {
      this.shieldHp -= effectiveAmount;
      SFX.playShieldHit();
      if (this.shieldHp <= 0) {
        this.shieldActive = false;
        SFX.playExplosion('medium');
      }
      return false;
    }

    // LEGACY Mutation: History Rewind temporal slip on heavy damage
    const isLegacy = this.blueprint.mutation === 'LEGACY';
    if (isLegacy && effectiveAmount > 120 && Math.random() < 0.35) {
      this.floatAngle -= Math.PI * 0.45; // Rewind position
      SFX.playPowerup();
    }

    this.hp -= effectiveAmount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
      return true; // Boss defeated!
    }
    return false;
  }
}
