import { Entity } from './Entity';
import { Projectile } from './Projectile';
import { Sprites } from '../rendering/Sprites';
import { SFX } from '../audio/SFX';
import { Store } from '../store/Store';

export class Player extends Entity {
  public speed: number = 380;
  public lives: number = 3;
  public hasShield: boolean = false;
  public multiShotTimer: number = 0;
  public overdriveCharge: number = 0; // 0 to 100
  public isOverdriving: boolean = false;
  public overdriveTimer: number = 0;
  public invulnerableTimer: number = 0;

  // Store Upgrades
  public quantumPiercing: boolean = false;
  public baseFireRate: number = 0.18;

  // Tactical Powers
  public isRebasing: boolean = false;
  public rebaseTimer: number = 0;
  public rebaseCooldown: number = 0; // In seconds
  public stashCooldown: number = 0;

  private shootCooldown: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 44, 34);
    this.applyStoreUpgrades();
  }

  public applyStoreUpgrades(): void {
    const store = Store.getInstance();
    const prof = store.profile;

    // Upgraded speed
    this.speed = 380 * (1 + (prof.thrusterLevel - 1) * 0.15);

    // Upgraded fire rate (cooldown reduction)
    this.baseFireRate = Math.max(0.08, 0.18 * (1 - (prof.fireRateLevel - 1) * 0.12));

    this.quantumPiercing = prof.quantumPiercing;

    if (prof.startingShield && !this.hasShield) {
      this.hasShield = true;
    }
  }

  public update(dt: number, bounds: { width: number; height: number }): void {
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.multiShotTimer > 0) this.multiShotTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

    if (this.rebaseCooldown > 0) this.rebaseCooldown -= dt;
    if (this.stashCooldown > 0) this.stashCooldown -= dt;

    if (this.isRebasing) {
      this.rebaseTimer -= dt;
      if (this.rebaseTimer <= 0) {
        this.isRebasing = false;
      }
    }

    if (this.isOverdriving) {
      this.overdriveTimer -= dt;
      if (this.overdriveTimer <= 0) {
        this.isOverdriving = false;
      }
    }

    this.x += this.vx * dt;
    // Keep clamped inside screen boundaries
    this.x = Math.max(10, Math.min(bounds.width - this.width - 10, this.x));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    // Holographic shimmer during invulnerability instead of vanishing
    if (this.invulnerableTimer > 0) {
      ctx.globalAlpha = Math.floor(this.invulnerableTimer * 10) % 2 === 0 ? 0.45 : 0.9;
    }

    const activeSkin = Store.getInstance().getActiveSkin();

    Sprites.drawPlayer(
      ctx,
      this.x,
      this.y,
      this.width,
      this.height,
      this.hasShield,
      this.overdriveCharge >= 100 || this.isOverdriving,
      activeSkin.hullColor,
      activeSkin.glowColor,
      Date.now() * 0.003,
      this.lives / 3,
      Math.abs(this.vx) > 10
    );
    ctx.restore();
  }

  public tryShoot(): Projectile[] {
    if (this.shootCooldown > 0 || !this.isAlive) return [];

    this.shootCooldown = this.baseFireRate;
    SFX.playLaser('player');

    const bullets: Projectile[] = [];
    const activeSkin = Store.getInstance().getActiveSkin();
    const bulletColor = activeSkin.glowColor;
    const pierce = this.quantumPiercing ? 1 : 0;

    if (this.isOverdriving) {
      SFX.playLaser('beam');
      // Giant central beam
      bullets.push(
        new Projectile(this.centerX - 12, this.y - 48, 0, -850, 'player', 'beam', 120, '#ff007f', 99)
      );
      return bullets;
    }

    if (this.multiShotTimer > 0) {
      // Dual wing blasters
      bullets.push(
        new Projectile(this.x + 4, this.y - 10, -30, -600, 'player', 'laser', 35, bulletColor, pierce),
        new Projectile(this.x + this.width - 8, this.y - 10, 30, -600, 'player', 'laser', 35, bulletColor, pierce)
      );
    } else {
      // Standard centered blaster
      bullets.push(
        new Projectile(this.centerX - 2, this.y - 12, 0, -650, 'player', 'laser', 30, bulletColor, pierce)
      );
    }

    return bullets;
  }

  /**
   * Tactical Power [Q]: GIT REBASE -i (Slow-Motion 4 seconds)
   */
  public activateRebaseSlowMo(): boolean {
    const store = Store.getInstance();
    if (!store.profile.rebaseSlowMoUnlocked) return false;

    if (this.rebaseCooldown <= 0 && !this.isRebasing) {
      this.isRebasing = true;
      this.rebaseTimer = 4.0;
      this.rebaseCooldown = 15.0; // 15s cooldown
      SFX.playLaser('beam');
      return true;
    }
    return false;
  }

  /**
   * Tactical Power [E]: GIT STASH (Emergency Shield)
   */
  public activateStashShield(): boolean {
    if (this.stashCooldown <= 0 && !this.hasShield) {
      this.hasShield = true;
      this.stashCooldown = 20.0; // 20s cooldown
      SFX.playPowerup();
      return true;
    }
    return false;
  }

  /**
   * Tactical Power [SHIFT]: GIT PUSH --FORCE (Overdrive Beam)
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

  public hit(): boolean {
    if (this.invulnerableTimer > 0 || this.isOverdriving) return false;

    if (this.hasShield) {
      this.hasShield = false;
      this.invulnerableTimer = 1.0;
      SFX.playShieldHit();
      return false; // Shield absorbed hit
    }

    this.lives--;
    this.invulnerableTimer = 2.0;
    if (this.lives <= 0) {
      this.isAlive = false;
    }
    return true; // Life lost
  }

  public reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.lives = 3;
    this.isAlive = true;
    this.hasShield = false;
    this.multiShotTimer = 0;
    this.overdriveCharge = 0;
    this.isOverdriving = false;
    this.isRebasing = false;
    this.rebaseTimer = 0;
    this.rebaseCooldown = 0;
    this.stashCooldown = 0;
    this.invulnerableTimer = 1.5;
    this.applyStoreUpgrades();
  }
}
