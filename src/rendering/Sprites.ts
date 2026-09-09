/**
 * GIT_INVADERS.EXE // SPRITE ORCHESTRATION PIPELINE
 * Central graphic dispatcher for ships, invaders, and modular boss leviathans.
 * Delegating to specialized industrial procedural renderers:
 * - ShipComposer (Modular 11-subsystem player ship renderer)
 * - CommitRenderer (Symmetrical drone with panel grooves and SHA stamp)
 * - PRRenderer (Armored diamond cruiser with 4-quadrant shield ring)
 * - IssueRenderer (Biomechanical arachnid drone with articulated leg servos)
 * - BranchRenderer (Forked switchblade geometry with dual diverging thrusters)
 * - SecurityRenderer (Fortress cybersecurity bastion with cryptographic padlock)
 * - BossModularRenderer (Multi-module leviathans with phase transformations)
 */

import { ShipComposer, ShipDesign } from './ShipComposer';
import { CommitRenderer } from './enemies/CommitRenderer';
import { PRRenderer } from './enemies/PRRenderer';
import { IssueRenderer } from './enemies/IssueRenderer';
import { BranchRenderer } from './enemies/BranchRenderer';
import { SecurityRenderer } from './enemies/SecurityRenderer';
import { BossModularRenderer } from './enemies/BossModularRenderer';

export class Sprites {
  /**
   * Draws the Player Ship with Layered Procedural Geometry & Secondary Motion
   */
  public static drawPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    hasShield: boolean,
    overdriveCharged: boolean,
    hullColor: string = '#00e5ff',
    glowColor: string = '#38bdf8',
    time: number = 0,
    hpRatio: number = 1.0,
    isThrusting: boolean = false,
    shipId: string = 'compiler_delta',
    vx: number = 0,
    isFiring: boolean = false,
    lod: number = 1
  ): void {
    const baseDesign = ShipComposer.createPreset(shipId);
    const design: ShipDesign = {
      ...baseDesign,
      hull: {
        ...baseDesign.hull,
        primaryColor: hullColor || baseDesign.hull.primaryColor,
        accentColor: glowColor || baseDesign.hull.accentColor,
      },
    };

    ShipComposer.render(
      ctx,
      x + width / 2,
      y + height / 2,
      width,
      height,
      design,
      {
        time: time || Date.now() * 0.003,
        hpRatio,
        hasShield,
        isOverdrive: overdriveCharged,
        isThrusting,
      },
      {
        lod,
        vx,
        isFiring,
        isHovering: lod === 0,
      }
    );
  }

  /**
   * Draws Basic Commit Invader (Modular drone with central commit node, stabilizers & floating SHA tag)
   */
  public static drawCommitInvader(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    animFrame: number,
    color: string = '#00ff66',
    commitSha: string = '7f3a2c'
  ): void {
    CommitRenderer.render(ctx, x, y, width, height, animFrame, color, commitSha);
  }

  /**
   * Draws Armored Pull Request Invader (Heavy cyber cruiser with 4-quadrant segmented shield & status badge)
   */
  public static drawArmoredPR(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shields: number,
    maxShields: number,
    prNumber: number = 42,
    status: string = 'OPEN'
  ): void {
    PRRenderer.render(ctx, x, y, width, height, shields, maxShields, prNumber, status);
  }

  /**
   * Draws Issue Bug Bomber (Biomechanical arachnid drone with animated legs, red eye & targeting reticle)
   */
  public static drawIssueBomber(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    isDiving: boolean = false
  ): void {
    IssueRenderer.render(ctx, x, y, width, height, time, isDiving);
  }

  /**
   * Draws Branch Drone (Forked bifurcated switchblade drone)
   */
  public static drawBranchDrone(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    isChild: boolean = false,
    branchName: string = 'feat/split'
  ): void {
    const animFrame = Math.floor(time * 6);
    BranchRenderer.render(ctx, x, y, width, height, animFrame, isChild ? '#38bdf8' : '#fbbf24');

    if (!isChild) {
      ctx.save();
      ctx.font = 'bold 6.5px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(branchName.slice(0, 10), x + width / 2, y - 5);
      ctx.restore();
    }
  }

  /**
   * Draws Security Sentinel (Heavy cyber tank with digital padlock & deployable firewall barricade)
   */
  public static drawSecuritySentinel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    firewallActive: boolean,
    hpRatio: number = 1.0
  ): void {
    SecurityRenderer.render(ctx, x, y, width, height, time, firewallActive);

    // Deployable Firewall Laser Barricade
    if (firewallActive) {
      ctx.save();
      const wallW = width * 1.5;
      const wallY = y + height + 6;
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - wallW / 2, wallY);
      ctx.lineTo(x + width / 2 + wallW / 2, wallY);
      ctx.stroke();

      // Firewall label
      ctx.font = 'bold 7px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('[ FIREWALL ACTIVE ]', x + width / 2, wallY + 11);
      ctx.restore();
    }
  }

  /**
   * Draws Mystery Octocat (High-speed contributor reconnaissance vessel)
   */
  public static drawMysteryOctocat(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const pulse = 0.85 + Math.sin(time * 8) * 0.15;

    // Glowing Orbital Aura
    ctx.fillStyle = `rgba(168, 85, 247, ${0.15 * pulse})`;
    ctx.beginPath();
    ctx.arc(0, 0, width * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // Streamlined Carrier Hull
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.45, height * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Octocat Silhouette Icon in Center
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 8;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('(=^..^=)', 0, 0);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /**
   * Draws Procedural CODE BOSS with Multi-Module Destructible Anatomy & Phase Transformations
   */
  public static drawBoss(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    phase: number,
    time: number,
    coreColor: string = '#00e5ff',
    chassisType: string = 'commit_core'
  ): void {
    BossModularRenderer.render(
      ctx,
      x,
      y,
      width,
      height,
      phase,
      time,
      coreColor,
      chassisType
    );
  }
}
