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
import { ShipDNAGenerator } from './ships/ShipDNA';
import { CommitRenderer } from './enemies/CommitRenderer';
import { PRRenderer } from './enemies/PRRenderer';
import { IssueRenderer } from './enemies/IssueRenderer';
import { BranchRenderer } from './enemies/BranchRenderer';
import { SecurityRenderer } from './enemies/SecurityRenderer';
import { BossModularRenderer, BossModuleStatus } from './enemies/BossModularRenderer';

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
    const dna = ShipDNAGenerator.fromSkinId(shipId, hullColor, glowColor);

    ShipComposer.render(
      ctx,
      x + width / 2,
      y + height / 2,
      width,
      height,
      dna,
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
   * Draws Mystery Octocat (High-speed contributor reconnaissance vessel with holographic escorts)
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
    const hw = width / 2;
    const hh = height / 2;

    // 1. Glowing Orbital Aura
    const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, hw * 1.4);
    aura.addColorStop(0, `rgba(192, 132, 252, ${0.35 * pulse})`);
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, hw * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 2. Twin Orbiting Holographic Contributor Micro-Nodes
    for (let i = 0; i < 2; i++) {
      const a = time * 4.5 + i * Math.PI;
      const nx = Math.cos(a) * (hw * 1.15);
      const ny = Math.sin(a) * (hh * 0.9);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(nx, ny, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Lower Saucer Rim
    ctx.fillStyle = '#0f0c29';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 2, hw * 0.95, hh * 0.68, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 4. Upper Dome & Cyber-Cat Ears
    ctx.fillStyle = '#312e81';
    ctx.strokeStyle = '#e879f9';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.45, -hh * 0.35);
    ctx.lineTo(-hw * 0.52, -hh * 0.95);
    ctx.lineTo(-hw * 0.2, -hh * 0.55);
    ctx.lineTo(hw * 0.2, -hh * 0.55);
    ctx.lineTo(hw * 0.52, -hh * 0.95);
    ctx.lineTo(hw * 0.45, -hh * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 5. Octocat Visor & Glowing Eyes
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(0, -1, hw * 0.52, hh * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-hw * 0.18, -1, 2.2, 0, Math.PI * 2);
    ctx.arc(hw * 0.18, -1, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /**
   * Draws Hotfix Interceptor (Blazing Mecha-Hawk Fighter with swept metallic wings & talon cannons)
   */
  public static drawHotfixInterceptor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    hpRatio: number,
    patchTag: string = 'HOTFIX'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    const hw = width / 2;
    const hh = height / 2;
    ctx.translate(0, Math.sin(time * 9) * 1.5);

    // Dual Thruster Jets at Rear
    ctx.fillStyle = 'rgba(251, 146, 60, 0.72)';
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(s * hw * 0.25 - 2.5, -hh * 0.6);
      ctx.lineTo(s * hw * 0.25, -hh * (1.15 + Math.sin(time * 20) * 0.18));
      ctx.lineTo(s * hw * 0.25 + 2.5, -hh * 0.6);
      ctx.closePath();
      ctx.fill();
    }

    // Swept Mecha-Hawk Gull Wings (metallic orange/silver gradient)
    const wingGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    wingGrad.addColorStop(0, '#fed7aa');
    wingGrad.addColorStop(0.5, '#9a3412');
    wingGrad.addColorStop(1, '#431407');
    ctx.fillStyle = wingGrad;
    ctx.strokeStyle = '#fb923c';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, hh * 1.0);
    ctx.lineTo(hw * 0.34, hh * 0.15);
    ctx.lineTo(hw * 1.05, -hh * 0.15);
    ctx.lineTo(hw * 0.76, -hh * 0.72);
    ctx.lineTo(hw * 0.34, -hh * 0.45);
    ctx.lineTo(0, -hh * 0.78);
    ctx.lineTo(-hw * 0.34, -hh * 0.45);
    ctx.lineTo(-hw * 0.76, -hh * 0.72);
    ctx.lineTo(-hw * 1.05, -hh * 0.15);
    ctx.lineTo(-hw * 0.34, hh * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Forward Twin Talon Cannons
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-hw * 0.44, hh * 0.2, 3, hh * 0.62);
    ctx.fillRect(hw * 0.44 - 3, hh * 0.2, 3, hh * 0.62);

    // Hawk Canopy Visor
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(0, hh * 0.18, hw * 0.18, hh * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 6px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fdba74';
    ctx.textAlign = 'center';
    ctx.fillText(patchTag.slice(0, 8), 0, -hh - 4);

    if (hpRatio < 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-hw * 0.7, hh + 3, width * 0.7, 3);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-hw * 0.7, hh + 3, width * 0.7 * Math.max(0, hpRatio), 3);
    }
    ctx.restore();
  }

  /**
   * Draws Tech Debt Juggernaut (Horned Goliath Mecha-Beetle Siege Cruiser with pincer mandibles)
   */
  public static drawTechDebtJuggernaut(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    hpRatio: number,
    isRepairing: boolean,
    debtLabel: string = 'TECH DEBT'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    const hw = width / 2;
    const hh = height / 2;

    if (isRepairing) {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -time * 18;
      ctx.beginPath();
      ctx.arc(0, 0, hw * 1.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6 Heavy Articulated Beetle Legs
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    [-1, 1].forEach((dir) => {
      for (let i = 0; i < 3; i++) {
        const yOff = -hh * 0.35 + i * hh * 0.35;
        const wiggle = Math.sin(time * 8 + i * 1.4) * 2.5;
        ctx.beginPath();
        ctx.moveTo(dir * hw * 0.52, yOff);
        ctx.lineTo(dir * hw * 0.96, yOff - 3 + wiggle);
        ctx.lineTo(dir * hw * 1.08, yOff + 6 + wiggle);
        ctx.stroke();
      }
    });

    // Twin Massive Forward Crusher Mandibles (Horned Goliath Jaws)
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.3;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * hw * 0.25, hh * 0.55);
      ctx.lineTo(dir * hw * 0.48, hh * 1.02);
      ctx.lineTo(dir * hw * 0.14, hh * 0.85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Domed Segmented Bronze/Titanium Beetle Shell
    const shell = new Path2D();
    shell.moveTo(0, -hh * 0.92);
    shell.quadraticCurveTo(hw * 0.85, -hh * 0.65, hw * 0.78, hh * 0.35);
    shell.lineTo(hw * 0.42, hh * 0.72);
    shell.lineTo(-hw * 0.42, hh * 0.72);
    shell.lineTo(-hw * 0.78, hh * 0.35);
    shell.quadraticCurveTo(-hw * 0.85, -hh * 0.65, 0, -hh * 0.92);
    shell.closePath();

    const shellGrad = ctx.createRadialGradient(-hw * 0.2, -hh * 0.3, 2, 0, 0, hw);
    shellGrad.addColorStop(0, '#f59e0b');
    shellGrad.addColorStop(0.45, '#451a03');
    shellGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = shellGrad;
    ctx.fill(shell);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.stroke(shell);

    // Glowing Armor Split Seam & Crimson Compound Eyes
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.85);
    ctx.lineTo(0, hh * 0.62);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-hw * 0.28, hh * 0.42, 2.6, 0, Math.PI * 2);
    ctx.arc(hw * 0.28, hh * 0.42, 2.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 6px "JetBrains Mono", monospace';
    ctx.fillStyle = isRepairing ? '#fde047' : '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText(isRepairing ? 'REPAIRING' : 'JUGGERNAUT', 0, -hh - 5);

    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(-hw * 0.8, hh + 3, width * 0.8, 3.5);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-hw * 0.8, hh + 3, width * 0.8 * Math.max(0, hpRatio), 3.5);
    void debtLabel;
    ctx.restore();
  }

  /**
   * Draws Pipeline Turret (Armored Mecha-Scorpion Walker Platform with Twin Aiming Cannons)
   */
  public static drawPipelineTurret(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    aimAngle: number,
    hpRatio: number,
    stageName: string = 'CI/CD'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    const hw = width / 2;
    const hh = height / 2;

    // 4 Splayed Mecha-Walker Stabilizer Legs
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    [-1, 1].forEach((dx) => {
      [-1, 1].forEach((dy) => {
        ctx.beginPath();
        ctx.moveTo(dx * hw * 0.32, dy * hh * 0.28);
        ctx.lineTo(dx * hw * 0.82, dy * hh * 0.56);
        ctx.lineTo(dx * hw * 0.96, dy * hh * 0.88);
        ctx.stroke();

        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(dx * hw * 0.82, dy * hh * 0.56, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Stepped Armored Spider-Turret Carapace
    const hull = new Path2D();
    hull.moveTo(0, -hh * 0.72);
    hull.lineTo(hw * 0.62, -hh * 0.32);
    hull.lineTo(hw * 0.54, hh * 0.45);
    hull.lineTo(0, hh * 0.65);
    hull.lineTo(-hw * 0.54, hh * 0.45);
    hull.lineTo(-hw * 0.62, -hh * 0.32);
    hull.closePath();

    const grad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.35, '#0c4a6e');
    grad.addColorStop(1, '#082f49');
    ctx.fillStyle = grad;
    ctx.fill(hull);
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.6;
    ctx.stroke(hull);

    // Rotating Twin Plasma Barrels tracking Player
    ctx.save();
    ctx.rotate(aimAngle - Math.PI / 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.3;
    ctx.fillRect(-7, 2, 4, hh * 0.95);
    ctx.strokeRect(-7, 2, 4, hh * 0.95);
    ctx.fillRect(3, 2, 4, hh * 0.95);
    ctx.strokeRect(3, 2, 4, hh * 0.95);
    ctx.restore();

    // Glowing Laser Target Optic
    const blink = 0.7 + Math.sin(time * 7) * 0.3;
    ctx.fillStyle = `rgba(34, 211, 238, ${blink})`;
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 6px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7dd3fc';
    ctx.textAlign = 'center';
    ctx.fillText(stageName.slice(0, 6), 0, -hh - 5);

    if (hpRatio < 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-hw * 0.75, hh + 3, width * 0.75, 3);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-hw * 0.75, hh + 3, width * 0.75 * Math.max(0, hpRatio), 3);
    }
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
    chassisType: string = 'commit_core',
    modules?: BossModuleStatus
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
      chassisType,
      modules
    );
  }
}
