import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Sprites } from '../rendering/Sprites';
import { ShipComposer } from '../rendering/ShipComposer';
import { ShipDNAGenerator } from '../rendering/ships/ShipDNA';
import { SFX } from '../audio/SFX';
import { Store, ShipModel } from '../store/Store';

export interface ContrailPoint {
  lx: number;
  ly: number;
  rx: number;
  ry: number;
  alpha: number;
}

export class Player extends Entity {
  public speed: number = 380;
  public lives: number = 3;
  public maxLives: number = 3;
  public hasShield: boolean = false;
  public multiShotTimer: number = 0;
  public overdriveCharge: number = 0; // 0 to 100
  public isOverdriving: boolean = false;
  public overdriveTimer: number = 0;
  public invulnerableTimer: number = 0;

  // 2.5D Flight Kinematics & Maneuvers (Images 4, 5, 6, 7)
  public inputX: number = 0;
  public inputY: number = 0;
  public isBoosting: boolean = false;
  public rollAngle: number = 0;
  public pitchAngle: number = 0;
  public trailHistory: ContrailPoint[] = [];

  // Loop Acrobatics [C]
  public isLooping: boolean = false;
  public loopTimer: number = 0;
  public loopDuration: number = 0.75;
  public loopCooldown: number = 0;

  // Homing Missiles [F]
  public missileAmmo: number = 6;
  public maxMissileAmmo: number = 6;
  public missileRechargeTimer: number = 0;
  public missileCooldown: number = 0;

  // Store & Tech Tree Upgrades
  public quantumPiercing: boolean = false;
  public baseFireRate: number = 0.18;

  // 01 Cyber Falcon: BURST OVERCLOCK
  public falconOverclockTimer: number = 0;
  public falconCooldown: number = 0;

  // 02 Phantom Violet: GIT STASH
  public isStashed: boolean = false;
  public stashTimer: number = 0;
  public stashCooldown: number = 0;
  public stashFanPending: boolean = false;

  // 03 Merge Hammer / Solar Gold: MERGE SHIELD & BURST
  public mergeCharge: number = 0; // 0 to 100

  // 04 Branch Runner / Emerald Glitch: BRANCH SPLIT DRONES
  public branchDronesActive: boolean = false;
  public branchDronesTimer: number = 0;
  public branchCooldown: number = 0;

  // 05 Rebase-01 / Neon Overdrive: GIT REBASE DASH
  public isRebasing: boolean = false;
  public isRebaseDashing: boolean = false;
  public rebaseTimer: number = 0;
  public rebaseDashTimer: number = 0;
  public rebaseCooldown: number = 0;

  // 06 Quantum Wing / 08 Codebreaker / Procedural E cooldown
  public abilityECooldown: number = 0;

  // 07 Quantum Citadel: OCTO PROTOCOL DEFENSE DRONES
  public octoDronesCount: number = 0; // 0 to 8
  public octoCooldown: number = 0;
  public octoAngle: number = 0;

  // 09 Void Stalker: TEMPORAL RIFT
  public temporalRiftTimer: number = 0;
  public temporalRiftCooldown: number = 0;
  public ghostDecoy: { x: number; y: number; timer: number } | null = null;

  // 10 Solar Phoenix: SUPERNOVA NOVA
  public supernovaCooldown: number = 0;

  private shootCooldown: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 62, 60);
    this.applyStoreUpgrades();
  }

  public get activeSkin(): ShipModel {
    const store = Store.getInstance();
    if (store.useProceduralShip && store.activeProceduralDNA) {
      const dna = store.activeProceduralDNA;
      const armor = Math.min(100, Math.max(40, dna.pullRequests * 2 + 40));
      const speed = Math.min(100, Math.max(50, Math.round(50 + (dna.commits / 200) * 15)));
      const fireRate = Math.min(100, Math.max(55, Math.round(55 + dna.threatLevel * 0.4)));
      const shield = Math.min(100, Math.max(40, dna.contributors * 6 + 35));
      return {
        id: `procedural_${dna.id}`,
        name: `DNA // ${dna.name.toUpperCase()}`,
        classTag: `Procedural | ${dna.primaryLanguage}`,
        hullColor: dna.accentColor || '#00e5ff',
        glowColor: dna.languages[0]?.color || '#38bdf8',
        cost: 0,
        unlocked: true,
        stats: { armor, speed, fireRate, shield },
        ability: {
          id: 'dna_overload',
          name: 'DNA OVERLOAD',
          triggerKey: 'E',
          description: 'Descarga vectorial calibrada al genoma del repositorio.',
          mechanic: 'Salva cuántica procedural',
        },
        description: `Nave generada desde ${dna.name}`,
      };
    }
    return store.getActiveSkin();
  }

  public applyStoreUpgrades(): void {
    const store = Store.getInstance();
    const prof = store.profile;
    const skin = this.activeSkin;

    // 1. Dynamic speed calculation from ship stats and thrusters
    const baseSpeed = 260 + (skin.stats.speed / 100) * 195;
    this.speed = baseSpeed * (1 + (prof.thrusterLevel - 1) * 0.12);

    // 2. Dynamic fire cadence from ship fireRate and overclock
    const baseCooldown = 0.30 - (skin.stats.fireRate / 100) * 0.19;
    this.baseFireRate = Math.max(0.06, baseCooldown * (1 - (prof.fireRateLevel - 1) * 0.1));

    // 3. Armor resilience determines max lives
    this.maxLives = skin.stats.armor >= 80 ? 4 : 3;
    if (this.lives > this.maxLives) this.lives = this.maxLives;

    // 4. Shield capacity
    if (skin.stats.shield >= 50 || prof.startingShield) {
      this.hasShield = true;
    }

    // 5. Quantum Pierce: Quantum Wing has it passive, or store upgrade
    this.quantumPiercing = prof.quantumPiercing || skin.id === 'quantum_wing';
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.multiShotTimer > 0) this.multiShotTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

    // Tactical & Maneuver cooldowns
    if (this.loopCooldown > 0) this.loopCooldown -= dt;
    if (this.missileCooldown > 0) this.missileCooldown -= dt;
    if (this.falconCooldown > 0) this.falconCooldown -= dt;
    if (this.stashCooldown > 0) this.stashCooldown -= dt;
    if (this.branchCooldown > 0) this.branchCooldown -= dt;
    if (this.rebaseCooldown > 0) this.rebaseCooldown -= dt;
    if (this.octoCooldown > 0) this.octoCooldown -= dt;
    if (this.temporalRiftCooldown > 0) this.temporalRiftCooldown -= dt;
    if (this.supernovaCooldown > 0) this.supernovaCooldown -= dt;
    if (this.abilityECooldown > 0) this.abilityECooldown -= dt;

    // Missile Auto-Recharge (1 missile every 2.5s up to 6)
    if (this.missileAmmo < this.maxMissileAmmo) {
      this.missileRechargeTimer += dt;
      if (this.missileRechargeTimer >= 2.5) {
        this.missileRechargeTimer = 0;
        this.missileAmmo++;
      }
    } else {
      this.missileRechargeTimer = 0;
    }

    // Loop maneuver timer
    if (this.isLooping) {
      this.loopTimer -= dt;
      if (this.loopTimer <= 0) {
        this.isLooping = false;
      }
    }

    // Falcon Overclock timer
    if (this.falconOverclockTimer > 0) {
      this.falconOverclockTimer -= dt;
    }

    // Phantom Violet: Stash duration & exit dagger fan trigger
    if (this.isStashed) {
      this.stashTimer -= dt;
      if (this.stashTimer <= 0) {
        this.isStashed = false;
        this.invulnerableTimer = 0.6;
        this.stashFanPending = true;
      }
    }

    // Void Stalker: Temporal Rift duration & decoy clone
    if (this.temporalRiftTimer > 0) {
      this.temporalRiftTimer -= dt;
    }
    if (this.ghostDecoy) {
      this.ghostDecoy.timer -= dt;
      if (this.ghostDecoy.timer <= 0) {
        this.ghostDecoy = null;
      }
    }

    // Branch Runner: Drones duration
    if (this.branchDronesActive) {
      this.branchDronesTimer -= dt;
      if (this.branchDronesTimer <= 0) {
        this.branchDronesActive = false;
      }
    }

    // Rebase-01: Slow-mo and Dash
    if (this.isRebasing) {
      this.rebaseTimer -= dt;
      if (this.rebaseTimer <= 0) {
        this.isRebasing = false;
      }
    }
    if (this.isRebaseDashing) {
      this.rebaseDashTimer -= dt;
      if (this.rebaseDashTimer <= 0) {
        this.isRebaseDashing = false;
      }
    }

    // Octo-Core / Quantum Citadel: Drones rotation
    if (this.octoDronesCount > 0) {
      this.octoAngle += dt * 3.2;
    }

    // Overdrive timer
    if (this.isOverdriving) {
      this.overdriveTimer -= dt;
      if (this.overdriveTimer <= 0) {
        this.isOverdriving = false;
      }
    }

    // 2D/2.5D Flight Kinematics with smooth inertia & boost
    const boostMult = this.isBoosting ? 1.38 : 1.0;
    const dashMult = this.isRebaseDashing ? 2.6 : 1.0;
    const targetVx = this.inputX * this.speed * boostMult * dashMult;
    const targetVy = this.inputY * (this.speed * 0.72) * boostMult;

    const accel = 14.0 * dt;
    this.vx += (targetVx - this.vx) * Math.min(1, accel);
    this.vy += (targetVy - this.vy) * Math.min(1, accel);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Smooth banking roll & longitudinal pitch
    const targetRoll = Math.max(-0.28, Math.min(0.28, (this.vx / 420) * 0.24));
    this.rollAngle += (targetRoll - this.rollAngle) * Math.min(1, 12 * dt);
    const targetPitch = Math.max(-0.15, Math.min(0.15, (this.vy / 300) * 0.12));
    this.pitchAngle += (targetPitch - this.pitchAngle) * Math.min(1, 12 * dt);

    // Clamp inside tactical flight corridor (2.5D movement freedom)
    const minY = Math.max(bounds.height * 0.48, 250);
    const maxY = bounds.height - this.height - 52;
    this.x = Math.max(10, Math.min(bounds.width - this.width - 10, this.x));
    this.y = Math.max(minY, Math.min(maxY, this.y));

    // Update Wingtip Contrails (Images 4, 5, 6, 7)
    const wingSpan = this.width * 0.46;
    const wingY = this.centerY + this.height * 0.34;
    const bankDrop = Math.sin(this.rollAngle) * 7;
    this.trailHistory.push({
      lx: this.centerX - wingSpan * Math.cos(this.rollAngle),
      ly: wingY - bankDrop,
      rx: this.centerX + wingSpan * Math.cos(this.rollAngle),
      ry: wingY + bankDrop,
      alpha: this.isBoosting || this.isLooping ? 0.85 : 0.45,
    });
    const maxTrail = this.isBoosting || this.isLooping ? 26 : 16;
    while (this.trailHistory.length > maxTrail) {
      this.trailHistory.shift();
    }
    for (const pt of this.trailHistory) {
      pt.ly += (this.isBoosting ? 95 : 52) * dt;
      pt.ry += (this.isBoosting ? 95 : 52) * dt;
      pt.alpha *= Math.pow(0.22, dt);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    const skin = this.activeSkin;
    const store = Store.getInstance();

    // 0. Wingtip Contrails Ribbon (Images 4, 5, 6, 7)
    if (this.trailHistory.length > 1) {
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 1; i < this.trailHistory.length; i++) {
        const p0 = this.trailHistory[i - 1];
        const p1 = this.trailHistory[i];
        const ratio = i / this.trailHistory.length;
        const alpha = Math.min(1, ratio * p1.alpha);

        ctx.strokeStyle = this.isBoosting
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(224, 242, 254, ${alpha * 0.72})`;
        ctx.lineWidth = (this.isBoosting ? 2.6 : 1.6) * ratio;

        ctx.beginPath();
        ctx.moveTo(p0.lx, p0.ly);
        ctx.lineTo(p1.lx, p1.ly);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p0.rx, p0.ry);
        ctx.lineTo(p1.rx, p1.ry);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Void Stalker Holographic Decoy Shadow Clone
    if (this.ghostDecoy) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, (this.ghostDecoy.timer / 2.2) * 0.45);
      Sprites.drawPlayer(
        ctx,
        this.ghostDecoy.x,
        this.ghostDecoy.y,
        this.width,
        this.height,
        false,
        false,
        '#ef4444',
        '#f59e0b',
        Date.now() * 0.003,
        1.0,
        false,
        skin.id,
        0,
        false,
        1
      );
      ctx.restore();
    }

    // Altitude Drop Shadow beneath ship (Images 5 & 6)
    ctx.save();
    const loopLift = this.isLooping
      ? Math.sin((1 - this.loopTimer / this.loopDuration) * Math.PI) * 26
      : 0;
    ctx.translate(this.centerX + 18 + loopLift * 0.4, this.centerY + 24 + loopLift * 0.6);
    ctx.rotate(this.rollAngle);
    ctx.scale(0.82, 0.75);
    ctx.fillStyle = 'rgba(2, 6, 16, 0.36)';
    ctx.beginPath();
    ctx.moveTo(0, -this.height * 0.5);
    ctx.lineTo(this.width * 0.48, this.height * 0.42);
    ctx.lineTo(0, this.height * 0.25);
    ctx.lineTo(-this.width * 0.48, this.height * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Phantom Violet Stash Shimmer / Invulnerability Flash
    if (this.isStashed) {
      ctx.globalAlpha = 0.38 + Math.sin(Date.now() * 0.02) * 0.2;
    } else if (this.invulnerableTimer > 0 && !this.isLooping) {
      ctx.globalAlpha = Math.floor(this.invulnerableTimer * 10) % 2 === 0 ? 0.4 : 0.88;
    }

    // Loop Acrobatics Transform (Scale & Pitch Flip)
    if (this.isLooping) {
      const progress = 1 - this.loopTimer / this.loopDuration;
      const scale = 1 + Math.sin(progress * Math.PI) * 0.58;
      const flipY = Math.cos(progress * Math.PI * 2);
      ctx.translate(this.centerX, this.centerY);
      ctx.scale(scale, scale * (Math.abs(flipY) * 0.65 + 0.35));
      ctx.rotate(progress * Math.PI * 2);
      ctx.translate(-this.centerX, -this.centerY);
    }

    // 1. Render Branch Runner support drones
    if (this.branchDronesActive) {
      this.renderBranchDrones(ctx);
    }

    // 2. Render Octo-Core / Quantum Citadel orbital defense drones
    if (this.octoDronesCount > 0) {
      this.renderOctoDrones(ctx);
    }

    // 3. Render Main Ship (Supporting Procedural DNA Ship or Catalog Ship)
    const isThrusting = Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10 || this.isBoosting;
    const isFiring = this.shootCooldown > this.baseFireRate * 0.55;
    if (store.useProceduralShip && store.activeProceduralDNA) {
      const dna = store.activeProceduralDNA;
      const visualDna = ShipDNAGenerator.fromRepository(dna.name, dna.accentColor, dna.threatLevel);
      ShipComposer.render(
        ctx,
        this.centerX,
        this.centerY,
        this.width,
        this.height,
        visualDna,
        {
          time: Date.now() * 0.003,
          hpRatio: this.lives / this.maxLives,
          hasShield: this.hasShield,
          isOverdrive: this.overdriveCharge >= 100 || this.isOverdriving || this.isBoosting,
          isThrusting,
        },
        {
          lod: 1,
          vx: this.vx,
          isFiring,
          isHovering: false,
        }
      );
    } else {
      Sprites.drawPlayer(
        ctx,
        this.x,
        this.y,
        this.width,
        this.height,
        this.hasShield,
        this.overdriveCharge >= 100 || this.isOverdriving || this.isBoosting,
        skin.hullColor,
        skin.glowColor,
        Date.now() * 0.003,
        this.lives / this.maxLives,
        isThrusting,
        skin.id,
        this.vx,
        isFiring,
        1
      );
    }

    // 4. Render Solar Gold / Merge Hammer Frontal Kinetic Shield Arc
    if (skin.id === 'merge_hammer' || skin.id === 'solar_gold') {
      this.renderMergeShieldArc(ctx);
    }

    // 5. Ability HUD Overlays
    if (this.isStashed) {
      ctx.fillStyle = '#c084fc';
      ctx.font = '700 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`STASH ACTIVE [${this.stashTimer.toFixed(1)}s]`, this.centerX, this.y - 12);
    } else if (this.temporalRiftTimer > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`TEMPORAL RIFT [${this.temporalRiftTimer.toFixed(1)}s]`, this.centerX, this.y - 12);
    }

    ctx.restore();
  }

  private renderBranchDrones(ctx: CanvasRenderingContext2D): void {
    const t = Date.now() * 0.005;
    const droneOffsets = [-32, this.width + 12];

    droneOffsets.forEach((ox) => {
      const dx = this.x + ox;
      const dy = this.y + 6 + Math.sin(t + ox) * 3;

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.centerY);
      ctx.lineTo(dx + 8, dy + 8);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(dx + 8, dy);
      ctx.lineTo(dx + 16, dy + 12);
      ctx.lineTo(dx + 8, dy + 10);
      ctx.lineTo(dx, dy + 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect(dx + 6, dy + 11, 4, 5);
    });
  }

  private renderOctoDrones(ctx: CanvasRenderingContext2D): void {
    const r = 46;
    for (let i = 0; i < this.octoDronesCount; i++) {
      const a = this.octoAngle + (i * Math.PI * 2) / this.octoDronesCount;
      const ox = this.centerX + Math.cos(a) * r;
      const oy = this.centerY + Math.sin(a) * (r * 0.65);

      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ox, oy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderMergeShieldArc(ctx: CanvasRenderingContext2D): void {
    const isReady = this.mergeCharge >= 40;
    const isMax = this.mergeCharge >= 100;
    ctx.save();
    ctx.strokeStyle = isMax ? '#fbbf24' : isReady ? '#f59e0b' : 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = isMax ? 3.5 : 2.2;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = isMax ? 12 : 4;

    ctx.beginPath();
    ctx.arc(this.centerX, this.y + 12, 34, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    if (isReady) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 8.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`MERGE ${this.mergeCharge}% [E]`, this.centerX, this.y - 12);
    }
    ctx.restore();
  }

  public tryShoot(): Projectile[] {
    if (this.shootCooldown > 0 || !this.isAlive) return [];

    const overclockMult = this.falconOverclockTimer > 0 ? 0.6 : 1.0;
    this.shootCooldown = this.baseFireRate * overclockMult;
    SFX.playLaser('player');

    const bullets: Projectile[] = [];
    const skin = this.activeSkin;
    const bulletColor = skin.glowColor;
    const pierce = this.quantumPiercing ? 99 : 0;

    // Ultimate: Force Push Overdrive Beam
    if (this.isOverdriving) {
      SFX.playLaser('beam');
      bullets.push(
        new Projectile(this.centerX - 14, this.y - 48, 0, -860, 'player', 'beam', 140, '#ff007f', 99)
      );
      return bullets;
    }

    // 02 Phantom Violet: fires phantom daggers even while stashed!
    if (this.isStashed) {
      bullets.push(
        new Projectile(this.centerX - 2, this.y - 12, 0, -720, 'player', 'rail_slug', 28, '#c084fc', 1)
      );
      return bullets;
    }

    // 01 Cyber Falcon: COMPILER BURST (3-round precision plasma burst)
    if (skin.id === 'compiler_delta' || skin.id === 'cyan' || skin.id === 'cyber_falcon') {
      bullets.push(
        new Projectile(this.centerX - 10, this.y - 12, -18, -680, 'player', 'laser', 24, bulletColor, pierce),
        new Projectile(this.centerX - 2, this.y - 14, 0, -720, 'player', 'laser', 28, bulletColor, pierce),
        new Projectile(this.centerX + 6, this.y - 12, 18, -680, 'player', 'laser', 24, bulletColor, pierce)
      );
    }
    // 03 Solar Gold: Twin heavy armor-piercing cannons
    else if (skin.id === 'solar_gold' || skin.id === 'merge_hammer') {
      bullets.push(
        new Projectile(this.x + 8, this.y - 10, 0, -610, 'player', 'plasma', 38, '#fbbf24', pierce),
        new Projectile(this.x + this.width - 14, this.y - 10, 0, -610, 'player', 'plasma', 38, '#fbbf24', pierce)
      );
    }
    // 04 Emerald Glitch: Asymmetric bifurcated shots (+ drones if active)
    else if (skin.id === 'emerald_glitch' || skin.id === 'branch_runner') {
      bullets.push(
        new Projectile(this.centerX - 6, this.y - 12, -24, -670, 'player', 'laser', 26, '#10b981', pierce),
        new Projectile(this.centerX + 4, this.y - 12, 24, -670, 'player', 'laser', 26, '#a3e635', pierce)
      );
    }
    // 05 Neon Overdrive: High-cadence twin nitro blasters
    else if (skin.id === 'neon_overdrive' || skin.id === 'rebase_01') {
      bullets.push(
        new Projectile(this.centerX - 8, this.y - 12, -12, -760, 'player', 'laser', 24, '#ff0055', pierce),
        new Projectile(this.centerX + 4, this.y - 12, 12, -760, 'player', 'laser', 24, '#ff7700', pierce)
      );
    }
    // 06 Quantum Wing: Dual parallel piercing Quantum Lances from detached wing pods
    else if (skin.id === 'quantum_wing') {
      bullets.push(
        new Projectile(this.x + 2, this.y - 16, 0, -780, 'player', 'quantum_lance', 34, '#06b6d4', 99),
        new Projectile(this.x + this.width - 8, this.y - 16, 0, -780, 'player', 'quantum_lance', 34, '#6366f1', 99)
      );
    }
    // 07 Quantum Citadel: Triple orbital fan spread
    else if (skin.id === 'quantum_citadel' || skin.id === 'octo_core') {
      bullets.push(
        new Projectile(this.centerX - 2, this.y - 14, 0, -680, 'player', 'laser', 26, '#38bdf8', pierce),
        new Projectile(this.x + 4, this.y - 8, -45, -650, 'player', 'laser', 22, '#e2e8f0', pierce),
        new Projectile(this.x + this.width - 8, this.y - 8, 45, -650, 'player', 'laser', 22, '#e2e8f0', pierce)
      );
    }
    // 08 Codebreaker // X: Quad X-Wing Heavy Cannon array
    else if (skin.id === 'codebreaker_x') {
      bullets.push(
        new Projectile(this.x, this.y - 8, -32, -700, 'player', 'laser', 26, '#ec4899', pierce),
        new Projectile(this.centerX - 10, this.y - 14, -6, -730, 'player', 'laser', 28, '#10b981', pierce),
        new Projectile(this.centerX + 6, this.y - 14, 6, -730, 'player', 'laser', 28, '#10b981', pierce),
        new Projectile(this.x + this.width - 4, this.y - 8, 32, -700, 'player', 'laser', 26, '#ec4899', pierce)
      );
    }
    // 09 Void Stalker: High-velocity twin crimson rail slugs
    else if (skin.id === 'hyper_void' || skin.id === 'void_stalker') {
      bullets.push(
        new Projectile(this.centerX - 11, this.y - 16, -8, -820, 'player', 'rail_slug', 34, '#ef4444', Math.max(1, pierce)),
        new Projectile(this.centerX + 5, this.y - 16, 8, -820, 'player', 'rail_slug', 34, '#f59e0b', Math.max(1, pierce))
      );
    }
    // 10 Solar Phoenix: Triple solar fire plumage spread
    else if (skin.id === 'solar_flare' || skin.id === 'solar_phoenix') {
      bullets.push(
        new Projectile(this.centerX - 3, this.y - 14, 0, -720, 'player', 'plasma', 30, '#facc15', pierce),
        new Projectile(this.x + 6, this.y - 8, -65, -670, 'player', 'laser', 24, '#ea580c', pierce),
        new Projectile(this.x + this.width - 10, this.y - 8, 65, -670, 'player', 'laser', 24, '#ea580c', pierce)
      );
    }
    // 11 Aegis Valkyrie: Converging twin orbital plasma + central rail slug
    else if (skin.id === 'aegis_valkyrie') {
      bullets.push(
        new Projectile(this.x + 4, this.y - 10, 26, -710, 'player', 'plasma', 26, '#38bdf8', pierce),
        new Projectile(this.centerX - 3, this.y - 16, 0, -800, 'player', 'rail_slug', 32, '#facc15', Math.max(1, pierce)),
        new Projectile(this.x + this.width - 10, this.y - 10, -26, -710, 'player', 'plasma', 26, '#38bdf8', pierce)
      );
    }
    // 12 Chrono Seraph: 3-beam harmonic quantum lance spread
    else if (skin.id === 'chrono_seraph') {
      bullets.push(
        new Projectile(this.centerX - 14, this.y - 14, -40, -780, 'player', 'quantum_lance', 28, '#c084fc', 99),
        new Projectile(this.centerX - 2, this.y - 18, 0, -820, 'player', 'quantum_lance', 32, '#22d3ee', 99),
        new Projectile(this.centerX + 10, this.y - 14, 40, -780, 'player', 'quantum_lance', 28, '#c084fc', 99)
      );
    }
    // 13 Obsidian Hydra: 5-stream venom plasma arc
    else if (skin.id === 'obsidian_hydra') {
      for (const vxOffset of [-75, -35, 0, 35, 75]) {
        bullets.push(
          new Projectile(this.centerX - 3, this.y - 12, vxOffset, -690, 'player', 'plasma', 20, '#10b981', pierce)
        );
      }
    }
    // 14 Starforge Omega: Twin heavy rail slugs + central plasma lance
    else if (skin.id === 'starforge_omega') {
      bullets.push(
        new Projectile(this.x + 2, this.y - 14, -8, -820, 'player', 'rail_slug', 34, '#f97316', Math.max(2, pierce)),
        new Projectile(this.centerX - 3, this.y - 18, 0, -840, 'player', 'quantum_lance', 40, '#38bdf8', 99),
        new Projectile(this.x + this.width - 8, this.y - 14, 8, -820, 'player', 'rail_slug', 34, '#f97316', Math.max(2, pierce))
      );
    }
    // Procedural DNA Ship or fallback
    else {
      bullets.push(
        new Projectile(this.centerX - 8, this.y - 12, -16, -680, 'player', 'laser', 26, bulletColor, pierce),
        new Projectile(this.centerX + 4, this.y - 12, 16, -680, 'player', 'laser', 26, bulletColor, pierce)
      );
    }

    // Branch Runner Drones mirror fire!
    if (this.branchDronesActive) {
      bullets.push(
        new Projectile(this.x - 24, this.y + 6, -12, -650, 'player', 'laser', 20, '#34d399', pierce),
        new Projectile(this.x + this.width + 12, this.y + 6, 12, -650, 'player', 'laser', 20, '#34d399', pierce)
      );
    }

    // Multi-shot power-up adds bonus side lasers
    if (this.multiShotTimer > 0) {
      bullets.push(
        new Projectile(this.x + 2, this.y - 8, -55, -620, 'player', 'laser', 22, '#38bdf8', pierce),
        new Projectile(this.x + this.width - 6, this.y - 8, 55, -620, 'player', 'laser', 22, '#38bdf8', pierce)
      );
    }

    return bullets;
  }

  /**
   * Checks if Phantom Violet exited Stash and emits a 5-dagger fan
   */
  public consumeStashExitBurst(): Projectile[] {
    if (!this.stashFanPending) return [];
    this.stashFanPending = false;
    SFX.playLaser('beam');
    const fan: Projectile[] = [];
    for (let i = -2; i <= 2; i++) {
      fan.push(
        new Projectile(this.centerX - 3, this.y - 14, i * 85, -720, 'player', 'rail_slug', 32, '#c084fc', 1)
      );
    }
    return fan;
  }

  /**
   * Flight Maneuver [C]: 360-degree Evasive Loop
   */
  public triggerLoop(): boolean {
    if (this.isLooping || this.loopCooldown > 0 || !this.isAlive) return false;
    this.isLooping = true;
    this.loopTimer = this.loopDuration;
    this.loopCooldown = 3.5;
    this.invulnerableTimer = Math.max(this.invulnerableTimer, this.loopDuration + 0.15);
    SFX.playPowerup();
    return true;
  }

  /**
   * Flight Weapon [F]: Fires 2 Homing Missiles toward the locked target
   */
  public fireHomingMissiles(target: Entity | null, fallbackX: number, fallbackY: number): Projectile[] {
    if (this.missileAmmo <= 0 || this.missileCooldown > 0 || !this.isAlive) return [];
    this.missileAmmo = Math.max(0, this.missileAmmo - 2);
    this.missileCooldown = 0.45;
    SFX.playLaser('beam');

    const mLeft = new Projectile(this.x - 2, this.y, -135, -320, 'player', 'homing_missile', 55, '#ef4444', 0);
    const mRight = new Projectile(this.x + this.width - 6, this.y, 135, -320, 'player', 'homing_missile', 55, '#ef4444', 0);

    mLeft.targetEntity = target;
    mLeft.homingTargetX = target ? target.centerX : fallbackX;
    mLeft.homingTargetY = target ? target.centerY : fallbackY;

    mRight.targetEntity = target;
    mRight.homingTargetX = target ? target.centerX : fallbackX;
    mRight.homingTargetY = target ? target.centerY : fallbackY;

    return [mLeft, mRight];
  }

  /**
   * Tactical Ability Trigger: E Key
   * Dispatches every ship's exclusive capability
   */
  public triggerAbilityE(boundsWidth: number = 900): { type: string; projectiles?: Projectile[] } | null {
    const skin = this.activeSkin;

    // 01 Cyber Falcon: COMPILER OVERCLOCK
    if (skin.id === 'cyber_falcon' || skin.id === 'compiler_delta' || skin.id === 'cyan') {
      if (this.falconCooldown <= 0) {
        this.falconOverclockTimer = 4.0;
        this.falconCooldown = 10.0;
        SFX.playPowerup();
        return { type: 'falcon_overclock' };
      }
    }

    // 02 Phantom Violet: GIT STASH
    if (skin.id === 'phantom_violet' || skin.id === 'purple') {
      if (this.stashCooldown <= 0 && !this.isStashed) {
        this.isStashed = true;
        this.stashTimer = 3.5;
        this.stashCooldown = 12.0;
        SFX.playPowerup();
        return { type: 'stash_active' };
      }
    }

    // 03 Solar Gold / Merge Hammer: MERGE BURST
    if (skin.id === 'merge_hammer' || skin.id === 'solar_gold') {
      if (this.mergeCharge >= 40) {
        const powerFactor = this.mergeCharge / 100;
        this.mergeCharge = 0;
        SFX.playExplosion('medium');
        const shockwave = new Projectile(
          this.centerX - 50,
          this.y - 25,
          0,
          -580,
          'player',
          'beam',
          Math.round(120 + 90 * powerFactor),
          '#fbbf24',
          99
        );
        return { type: 'merge_burst', projectiles: [shockwave] };
      }
    }

    // 04 Emerald Glitch / Branch Runner: BRANCH SPLIT
    if (skin.id === 'branch_runner' || skin.id === 'emerald_glitch') {
      if (this.branchCooldown <= 0 && !this.branchDronesActive) {
        this.branchDronesActive = true;
        this.branchDronesTimer = 5.5;
        this.branchCooldown = 13.0;
        SFX.playPowerup();
        return { type: 'branch_split' };
      }
    }

    // 05 Neon Overdrive: HYPER REBASE DASH
    if (skin.id === 'neon_overdrive' || skin.id === 'rebase_01') {
      if (this.rebaseCooldown <= 0 && !this.isRebasing) {
        this.isRebasing = true;
        this.isRebaseDashing = true;
        this.rebaseTimer = 2.4;
        this.rebaseDashTimer = 0.48;
        this.rebaseCooldown = 9.0;
        this.invulnerableTimer = 1.2;
        SFX.playLaser('beam');
        return { type: 'rebase_dash' };
      }
    }

    // 06 Quantum Wing: QUANTUM PIERCE SALVO
    if (skin.id === 'quantum_wing') {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 8.0;
        SFX.playLaser('beam');
        const projs = [-1, 0, 1].map(
          (i) =>
            new Projectile(
              this.centerX - 3 + i * 16,
              this.y - 22,
              i * 35,
              -840,
              'player',
              'quantum_lance',
              60,
              '#06b6d4',
              99
            )
        );
        return { type: 'quantum_salvo', projectiles: projs };
      }
    }

    // 07 Quantum Citadel: OCTO PROTOCOL (Fixed skin ID check!)
    if (skin.id === 'quantum_citadel' || skin.id === 'octo_core') {
      if (this.octoCooldown <= 0) {
        this.octoDronesCount = 8;
        this.octoCooldown = 16.0;
        SFX.playPowerup();
        return { type: 'octo_protocol' };
      }
    }

    // 08 Codebreaker // X: CONCENTRATED KERNEL LANCE
    if (skin.id === 'codebreaker_x') {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 9.5;
        SFX.playLaser('beam');
        const beam = new Projectile(this.centerX - 12, this.y - 46, 0, -860, 'player', 'beam', 120, '#ec4899', 99);
        return { type: 'codebreaker_lance', projectiles: [beam] };
      }
    }

    // 09 Void Stalker: TEMPORAL RIFT (80% bullet slow-mo + teleport + rail salvo)
    if (skin.id === 'hyper_void' || skin.id === 'void_stalker') {
      if (this.temporalRiftCooldown <= 0) {
        this.temporalRiftTimer = 4.0;
        this.temporalRiftCooldown = 11.0;
        this.ghostDecoy = { x: this.x, y: this.y, timer: 2.2 };
        this.invulnerableTimer = Math.max(this.invulnerableTimer, 1.0);
        // Blink across to opposite flank safely
        this.x = Math.max(24, Math.min(boundsWidth - this.width - 24, boundsWidth - this.x - this.width));
        SFX.playPowerup();
        const slugs = [
          new Projectile(this.centerX - 10, this.y - 18, -15, -860, 'player', 'rail_slug', 65, '#ef4444', 3),
          new Projectile(this.centerX + 4, this.y - 18, 15, -860, 'player', 'rail_slug', 65, '#f59e0b', 3),
        ];
        return { type: 'temporal_rift', projectiles: slugs };
      }
    }

    // 10 Solar Phoenix: SUPERNOVA NOVA (360° plasma blast wave + radial embers)
    if (skin.id === 'solar_flare' || skin.id === 'solar_phoenix') {
      if (this.supernovaCooldown <= 0) {
        this.supernovaCooldown = 11.0;
        this.invulnerableTimer = Math.max(this.invulnerableTimer, 1.2);
        SFX.playExplosion('boss');
        const projs: Projectile[] = [
          new Projectile(this.centerX - 14, this.centerY - 14, 0, 0, 'player', 'supernova_wave', 110, '#facc15', 99),
        ];
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          projs.push(
            new Projectile(
              this.centerX - 6,
              this.centerY - 6,
              Math.cos(a) * 460,
              Math.sin(a) * 460,
              'player',
              'plasma',
              42,
              i % 2 === 0 ? '#ea580c' : '#facc15',
              2
            )
          );
        }
        return { type: 'supernova_nova', projectiles: projs };
      }
    }

    // 11 Aegis Valkyrie: VALKYRIE AEGIS (Reflector shield + 4 free homing micro-missiles)
    if (skin.id === 'aegis_valkyrie') {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 11.0;
        this.hasShield = true;
        this.invulnerableTimer = Math.max(this.invulnerableTimer, 3.5);
        SFX.playPowerup();
        const projs = [-1.5, -0.5, 0.5, 1.5].map((idx) => {
          const m = new Projectile(this.centerX - 4, this.y - 12, idx * 115, -360, 'player', 'homing_missile', 48, '#facc15', 0);
          m.homingTargetX = this.centerX + idx * 90;
          m.homingTargetY = 80;
          return m;
        });
        return { type: 'valkyrie_aegis', projectiles: projs };
      }
    }

    // 12 Chrono Seraph: SERAPH HALO (360° singularity pulse + 6 quantum lances + overclock)
    if (skin.id === 'chrono_seraph') {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 10.5;
        this.falconOverclockTimer = Math.max(this.falconOverclockTimer, 2.5);
        SFX.playLaser('beam');
        const projs: Projectile[] = [
          new Projectile(this.centerX - 14, this.centerY - 14, 0, 0, 'player', 'supernova_wave', 80, '#22d3ee', 99),
        ];
        for (const spread of [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]) {
          projs.push(
            new Projectile(this.centerX - 3, this.y - 18, spread * 55, -820, 'player', 'quantum_lance', 44, '#c084fc', 99)
          );
        }
        return { type: 'seraph_halo', projectiles: projs };
      }
    }

    // 13 Obsidian Hydra: HYDRA BARRAGE (4 homing missiles + 3 heavy acid plasma spheres)
    if (skin.id === 'obsidian_hydra') {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 9.5;
        SFX.playExplosion('medium');
        const projs: Projectile[] = [-1, 0, 1].map(
          (i) => new Projectile(this.centerX - 4, this.y - 16, i * 95, -620, 'player', 'plasma', 55, '#10b981', 2)
        );
        for (const idx of [-1.5, -0.5, 0.5, 1.5]) {
          const m = new Projectile(this.centerX - 4, this.y - 8, idx * 140, -340, 'player', 'homing_missile', 50, '#34d399', 0);
          m.homingTargetX = this.centerX + idx * 100;
          m.homingTargetY = 90;
          projs.push(m);
        }
        return { type: 'hydra_barrage', projectiles: projs };
      }
    }

    // 14 Starforge Omega: OMEGA RAILSTORM (Center mega-beam + 2 flanking quantum lances + +3 missiles)
    if (skin.id === 'starforge_omega') {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 11.0;
        this.missileAmmo = Math.min(this.maxMissileAmmo, this.missileAmmo + 3);
        SFX.playLaser('beam');
        const projs = [
          new Projectile(this.centerX - 12, this.y - 46, 0, -880, 'player', 'beam', 135, '#f97316', 99),
          new Projectile(this.x + 2, this.y - 20, -24, -840, 'player', 'quantum_lance', 56, '#38bdf8', 99),
          new Projectile(this.x + this.width - 8, this.y - 20, 24, -840, 'player', 'quantum_lance', 56, '#38bdf8', 99),
        ];
        return { type: 'omega_railstorm', projectiles: projs };
      }
    }

    // Procedural DNA Ship: DNA OVERLOAD
    if (skin.id.startsWith('procedural_')) {
      if (this.abilityECooldown <= 0) {
        this.abilityECooldown = 9.0;
        SFX.playLaser('beam');
        const projs = [-2, -1, 0, 1, 2].map(
          (i) =>
            new Projectile(
              this.centerX - 3,
              this.y - 16,
              i * 65,
              -760,
              'player',
              'quantum_lance',
              36,
              skin.glowColor,
              2
            )
        );
        return { type: 'dna_overload', projectiles: projs };
      }
    }

    // Fallback: Default Stash Shield if unlocked via store
    if (Store.getInstance().profile.startingShield && !this.hasShield) {
      this.hasShield = true;
      SFX.playPowerup();
      return { type: 'shield_up' };
    }

    return null;
  }

  /**
   * Tactical Ability Trigger: Q Key
   * Dispatches Rebase dash or slow-mo
   */
  public triggerAbilityQ(): boolean {
    const skin = this.activeSkin;

    // 05 Rebase-01: GIT REBASE DASH
    if (skin.id === 'rebase_01' || skin.id === 'neon_overdrive') {
      if (this.rebaseCooldown <= 0 && !this.isRebasing) {
        this.isRebasing = true;
        this.isRebaseDashing = true;
        this.rebaseTimer = 2.4;
        this.rebaseDashTimer = 0.48;
        this.rebaseCooldown = 9.0;
        this.invulnerableTimer = 1.2;
        SFX.playLaser('beam');
        return true;
      }
    }

    // Fallback: Store unlocked Rebase slow-mo
    if (Store.getInstance().profile.rebaseSlowMoUnlocked) {
      if (this.rebaseCooldown <= 0 && !this.isRebasing) {
        this.isRebasing = true;
        this.rebaseTimer = 3.5;
        this.rebaseCooldown = 14.0;
        SFX.playLaser('beam');
        return true;
      }
    }

    return false;
  }

  /**
   * Tactical Ability Trigger: SHIFT Key
   * 08 Codebreaker // X & Overdrive: FORCE PUSH
   */
  public activateOverdrive(): boolean {
    if (this.overdriveCharge >= 100 && !this.isOverdriving) {
      this.isOverdriving = true;
      this.overdriveTimer = 3.5;
      this.overdriveCharge = 0;
      this.invulnerableTimer = 3.5;
      SFX.playLaser('beam');
      return true;
    }
    return false;
  }

  public addOverdriveCharge(amount: number): void {
    if (!this.isOverdriving) {
      this.overdriveCharge = Math.min(100, this.overdriveCharge + amount);
    }
  }

  public absorbMergeHit(): void {
    this.mergeCharge = Math.min(100, this.mergeCharge + 35);
  }

  public hit(): boolean {
    // 1. Invulnerable states (Loop, Overdrive, Stash)
    if (this.invulnerableTimer > 0 || this.isOverdriving || this.isStashed || this.isLooping) {
      return false;
    }

    // 2. Octo-Core / Quantum Citadel: Drones intercept bullet first!
    if (this.octoDronesCount > 0) {
      this.octoDronesCount--;
      this.invulnerableTimer = 0.45;
      SFX.playShieldHit();
      return false;
    }

    // 3. Merge Hammer / Solar Gold: Front shield absorbs impacts and charges kinetic wave
    if (this.activeSkin.id === 'merge_hammer' || this.activeSkin.id === 'solar_gold') {
      if (this.mergeCharge < 100) {
        this.absorbMergeHit();
        this.invulnerableTimer = 0.55;
        SFX.playShieldHit();
        return false;
      }
    }

    // 4. Kinetic Shield bubble
    if (this.hasShield) {
      this.hasShield = false;
      this.invulnerableTimer = 1.0;
      SFX.playShieldHit();
      return false;
    }

    // 5. Life lost
    this.lives--;
    this.invulnerableTimer = 2.0;
    if (this.lives <= 0) {
      this.isAlive = false;
    }
    return true;
  }

  public reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.inputX = 0;
    this.inputY = 0;
    this.isBoosting = false;
    this.rollAngle = 0;
    this.pitchAngle = 0;
    this.trailHistory = [];
    this.isLooping = false;
    this.loopTimer = 0;
    this.loopCooldown = 0;
    this.missileAmmo = this.maxMissileAmmo;
    this.missileRechargeTimer = 0;
    this.missileCooldown = 0;
    this.isAlive = true;
    this.hasShield = false;
    this.multiShotTimer = 0;
    this.overdriveCharge = 0;
    this.isOverdriving = false;
    this.falconOverclockTimer = 0;
    this.falconCooldown = 0;
    this.isStashed = false;
    this.stashTimer = 0;
    this.stashCooldown = 0;
    this.stashFanPending = false;
    this.mergeCharge = 0;
    this.branchDronesActive = false;
    this.branchDronesTimer = 0;
    this.branchCooldown = 0;
    this.isRebasing = false;
    this.isRebaseDashing = false;
    this.rebaseTimer = 0;
    this.rebaseDashTimer = 0;
    this.rebaseCooldown = 0;
    this.abilityECooldown = 0;
    this.octoDronesCount = 0;
    this.octoCooldown = 0;
    this.temporalRiftTimer = 0;
    this.temporalRiftCooldown = 0;
    this.ghostDecoy = null;
    this.supernovaCooldown = 0;
    this.invulnerableTimer = 1.5;
    this.applyStoreUpgrades();
    this.lives = this.maxLives;
  }
}
