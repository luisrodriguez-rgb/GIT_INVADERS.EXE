import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Sprites } from '../rendering/Sprites';
import { SFX } from '../audio/SFX';
import { Store, ShipModel } from '../store/Store';

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

  // Store & Tech Tree Upgrades
  public quantumPiercing: boolean = false;
  public baseFireRate: number = 0.18;

  // 02 Phantom Violet: GIT STASH
  public isStashed: boolean = false;
  public stashTimer: number = 0;
  public stashCooldown: number = 0;

  // 03 Merge Hammer: MERGE SHIELD & BURST
  public mergeCharge: number = 0; // 0 to 100

  // 04 Branch Runner: BRANCH SPLIT DRONES
  public branchDronesActive: boolean = false;
  public branchDronesTimer: number = 0;
  public branchCooldown: number = 0;

  // 05 Rebase-01: GIT REBASE DASH
  public isRebasing: boolean = false;
  public isRebaseDashing: boolean = false;
  public rebaseTimer: number = 0;
  public rebaseDashTimer: number = 0;
  public rebaseCooldown: number = 0;

  // 07 Octo-Core: OCTO PROTOCOL DEFENSE DRONES
  public octoDronesCount: number = 0; // 0 to 8
  public octoCooldown: number = 0;
  public octoAngle: number = 0;

  private shootCooldown: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 46, 36);
    this.applyStoreUpgrades();
  }

  public get activeSkin(): ShipModel {
    return Store.getInstance().getActiveSkin();
  }

  public applyStoreUpgrades(): void {
    const store = Store.getInstance();
    const prof = store.profile;
    const skin = store.getActiveSkin();

    // 1. Dynamic speed calculation from ship stats and thrusters
    const baseSpeed = 240 + (skin.stats.speed / 100) * 190;
    this.speed = baseSpeed * (1 + (prof.thrusterLevel - 1) * 0.12);

    // 2. Dynamic fire cadence from ship fireRate and overclock
    const baseCooldown = 0.32 - (skin.stats.fireRate / 100) * 0.20;
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

    // Tactical cooldowns
    if (this.stashCooldown > 0) this.stashCooldown -= dt;
    if (this.branchCooldown > 0) this.branchCooldown -= dt;
    if (this.rebaseCooldown > 0) this.rebaseCooldown -= dt;
    if (this.octoCooldown > 0) this.octoCooldown -= dt;

    // Phantom Violet: Stash duration
    if (this.isStashed) {
      this.stashTimer -= dt;
      if (this.stashTimer <= 0) {
        this.isStashed = false;
        this.invulnerableTimer = 0.5;
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

    // Octo-Core: Drones rotation
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

    // Velocity integration (Dash speed bonus)
    const moveMultiplier = this.isRebaseDashing ? 2.6 : 1.0;
    this.x += this.vx * moveMultiplier * dt;

    // Screen boundary clamping
    this.x = Math.max(10, Math.min(bounds.width - this.width - 10, this.x));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    const skin = this.activeSkin;

    // Phantom Violet Stash Shimmer: Semi-transparent phase outline
    if (this.isStashed) {
      ctx.globalAlpha = 0.35 + Math.sin(Date.now() * 0.02) * 0.2;
    } else if (this.invulnerableTimer > 0) {
      ctx.globalAlpha = Math.floor(this.invulnerableTimer * 10) % 2 === 0 ? 0.4 : 0.85;
    }

    // 1. Render Branch Runner support drones
    if (this.branchDronesActive) {
      this.renderBranchDrones(ctx);
    }

    // 2. Render Octo-Core orbital defense drones
    if (this.octoDronesCount > 0) {
      this.renderOctoDrones(ctx);
    }

    // 3. Render Main Ship with its exact custom vector geometry
    Sprites.drawPlayer(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.hasShield,
      this.overdriveCharge >= 100 || this.isOverdriving,
      skin.hullColor,
      skin.glowColor,
      Date.now() * 0.003,
      this.lives / this.maxLives,
      Math.abs(this.vx) > 10,
      skin.id,
      this.vx,
      this.shootCooldown > (this.baseFireRate * 0.6),
      1
    );

    // 4. Render Merge Hammer Frontal Kinetic Shield Arc
    if (skin.id === 'merge_hammer') {
      this.renderMergeShieldArc(ctx);
    }

    // 5. Ability HUD Overlays
    if (this.isStashed) {
      ctx.fillStyle = '#c084fc';
      ctx.font = '700 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`STASH ACTIVE [${this.stashTimer.toFixed(1)}s]`, this.centerX, this.y - 12);
    }

    ctx.restore();
  }

  private renderBranchDrones(ctx: CanvasRenderingContext2D): void {
    const t = Date.now() * 0.005;
    const droneOffsets = [-32, this.width + 12];

    droneOffsets.forEach((ox) => {
      const dx = this.x + ox;
      const dy = this.y + 6 + Math.sin(t + ox) * 3;

      // Laser tether line to mother ship
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.centerX, this.centerY);
      ctx.lineTo(dx + 8, dy + 8);
      ctx.stroke();

      // Drone body
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

      // Thruster flame
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect(dx + 6, dy + 11, 4, 5);
    });
  }

  private renderOctoDrones(ctx: CanvasRenderingContext2D): void {
    const r = 44;
    for (let i = 0; i < this.octoDronesCount; i++) {
      const a = this.octoAngle + (i * Math.PI * 2) / this.octoDronesCount;
      const ox = this.centerX + Math.cos(a) * r;
      const oy = this.centerY + Math.sin(a) * (r * 0.65);

      // Micro drone energy orb
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Drone core white spike
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ox, oy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderMergeShieldArc(ctx: CanvasRenderingContext2D): void {
    const isReady = this.mergeCharge >= 100;
    ctx.save();
    ctx.strokeStyle = isReady ? '#fbbf24' : 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = isReady ? 3.5 : 2;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = isReady ? 12 : 4;

    ctx.beginPath();
    ctx.arc(this.centerX, this.y + 12, 32, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    if (isReady) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 8.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MERGE READY [E]', this.centerX, this.y - 12);
    }
    ctx.restore();
  }

  public tryShoot(): Projectile[] {
    if (this.shootCooldown > 0 || !this.isAlive) return [];

    // Phantom Violet Mechanic: Cannot shoot while stashed!
    if (this.isStashed) return [];

    this.shootCooldown = this.baseFireRate;
    SFX.playLaser('player');

    const bullets: Projectile[] = [];
    const skin = this.activeSkin;
    const bulletColor = skin.glowColor;
    const pierce = this.quantumPiercing ? 99 : 0;

    // Ultimate: Force Push Overdrive Beam
    if (this.isOverdriving) {
      SFX.playLaser('beam');
      bullets.push(
        new Projectile(this.centerX - 14, this.y - 48, 0, -850, 'player', 'beam', 140, '#ff007f', 99)
      );
      return bullets;
    }

    // 01 Compiler Delta Mechanic: COMPILER BURST (3-round precision plasma burst)
    if (skin.id === 'compiler_delta' || skin.id === 'cyan' || skin.id === 'cyber_falcon') {
      bullets.push(
        new Projectile(this.centerX - 10, this.y - 12, -18, -680, 'player', 'laser', 24, bulletColor, pierce),
        new Projectile(this.centerX - 2, this.y - 14, 0, -720, 'player', 'laser', 28, bulletColor, pierce),
        new Projectile(this.centerX + 6, this.y - 12, 18, -680, 'player', 'laser', 24, bulletColor, pierce)
      );
    }
    // 04 Branch Runner Mechanic: Dual support drones mirror weapon fire
    else if (this.branchDronesActive) {
      bullets.push(
        new Projectile(this.centerX - 2, this.y - 12, 0, -660, 'player', 'laser', 30, bulletColor, pierce),
        new Projectile(this.x - 24, this.y + 6, -10, -640, 'player', 'laser', 20, '#34d399', pierce),
        new Projectile(this.x + this.width + 12, this.y + 6, 10, -640, 'player', 'laser', 20, '#34d399', pierce)
      );
    }
    // Multi-shot power-up active
    else if (this.multiShotTimer > 0) {
      bullets.push(
        new Projectile(this.x + 4, this.y - 10, -30, -600, 'player', 'laser', 35, bulletColor, pierce),
        new Projectile(this.x + this.width - 8, this.y - 10, 30, -600, 'player', 'laser', 35, bulletColor, pierce)
      );
    }
    // Standard weapon fire
    else {
      bullets.push(
        new Projectile(this.centerX - 2, this.y - 12, 0, -650, 'player', 'laser', 30, bulletColor, pierce)
      );
    }

    return bullets;
  }

  /**
   * Tactical Ability Trigger: E Key
   * Dispatches the active ship's unique capability
   */
  public triggerAbilityE(): { type: string; projectile?: Projectile } | null {
    const skin = this.activeSkin;

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

    // 03 Merge Hammer: MERGE BURST
    if (skin.id === 'merge_hammer' || skin.id === 'solar_gold') {
      if (this.mergeCharge >= 100) {
        this.mergeCharge = 0;
        SFX.playExplosion('medium');
        const shockwave = new Projectile(
          this.centerX - 50,
          this.y - 25,
          0,
          -550,
          'player',
          'beam',
          160,
          '#fbbf24',
          99
        );
        return { type: 'merge_burst', projectile: shockwave };
      }
    }

    // 04 Branch Runner: BRANCH SPLIT
    if (skin.id === 'branch_runner' || skin.id === 'emerald_glitch') {
      if (this.branchCooldown <= 0 && !this.branchDronesActive) {
        this.branchDronesActive = true;
        this.branchDronesTimer = 5.0;
        this.branchCooldown = 15.0;
        SFX.playPowerup();
        return { type: 'branch_split' };
      }
    }

    // 07 Octo-Core: OCTO PROTOCOL
    if (skin.id === 'octo_core') {
      if (this.octoCooldown <= 0) {
        this.octoDronesCount = 8;
        this.octoCooldown = 20.0;
        SFX.playPowerup();
        return { type: 'octo_protocol' };
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
        this.rebaseTimer = 2.0;
        this.rebaseDashTimer = 0.4;
        this.rebaseCooldown = 10.0;
        this.invulnerableTimer = 1.0;
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
    // 1. Invulnerable states
    if (this.invulnerableTimer > 0 || this.isOverdriving || this.isStashed) {
      return false;
    }

    // 2. Octo-Core: Drones intercept bullet first!
    if (this.octoDronesCount > 0) {
      this.octoDronesCount--;
      this.invulnerableTimer = 0.45;
      SFX.playShieldHit();
      return false; // Intercepted by orbital drone!
    }

    // 3. Merge Hammer: Front shield absorbs impacts and charges kinetic wave
    if (this.activeSkin.id === 'merge_hammer' || this.activeSkin.id === 'solar_gold') {
      this.absorbMergeHit();
      this.invulnerableTimer = 0.55;
      SFX.playShieldHit();
      return false; // Absorbed into kinetic battery!
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
    this.isAlive = true;
    this.hasShield = false;
    this.multiShotTimer = 0;
    this.overdriveCharge = 0;
    this.isOverdriving = false;
    this.isStashed = false;
    this.stashTimer = 0;
    this.stashCooldown = 0;
    this.mergeCharge = 0;
    this.branchDronesActive = false;
    this.branchDronesTimer = 0;
    this.branchCooldown = 0;
    this.isRebasing = false;
    this.isRebaseDashing = false;
    this.rebaseTimer = 0;
    this.rebaseDashTimer = 0;
    this.rebaseCooldown = 0;
    this.octoDronesCount = 0;
    this.octoCooldown = 0;
    this.invulnerableTimer = 1.5;
    this.applyStoreUpgrades();
    this.lives = this.maxLives;
  }
}
