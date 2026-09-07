import { ShipComposer, ShipDesign } from './ShipComposer';

export class Sprites {
  /**
   * Draws the Compiler Player Ship with Layered Procedural Geometry
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
    shipId: string = 'compiler_delta'
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
      }
    );
  }

  /**
   * Draws Basic Commit Invader (Traditional retro pixel silhouette with animated limbs)
   */
  public static drawCommitInvader(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    animFrame: number,
    color: string = '#00ff66'
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;

    // Classic 8x8 matrix pixel invader
    const pixelW = width / 8;
    const pixelH = height / 8;

    const frameA = [
      '  ████  ',
      ' ██████ ',
      '████████',
      '██ ██ ██',
      '████████',
      '  █  █  ',
      ' █ ██ █ ',
      '█ █  █ █',
    ];

    const frameB = [
      '  ████  ',
      ' ██████ ',
      '████████',
      '██ ██ ██',
      '████████',
      ' █ ██ █ ',
      '█      █',
      ' █    █ ',
    ];

    const currentFrame = animFrame % 2 === 0 ? frameA : frameB;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentFrame[r][c] === '█') {
          ctx.fillRect(c * pixelW, r * pixelH, pixelW + 0.5, pixelH + 0.5);
        }
      }
    }

    ctx.restore();
  }

  /**
   * Draws Armored Pull Request Invader (Heavy cyber cruiser with visible shield ring)
   */
  public static drawArmoredPR(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shields: number,
    maxShields: number,
    prNumber: number = 428,
    status: string = 'OPEN'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    // Tactical PR Code Card above ship
    ctx.font = 'bold 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a855f7';
    ctx.textAlign = 'center';
    ctx.fillText(`<< PR #${prNumber} >>`, 0, -height / 2 - 14);

    // Status pill
    ctx.fillStyle = status === 'MERGED' ? '#10b981' : '#38bdf8';
    ctx.fillText(`STATUS: ${status}`, 0, -height / 2 - 7);

    // Segmented Shield Bar
    if (shields > 0) {
      const segW = 6;
      const segH = 2.5;
      const gap = 2;
      const totalW = maxShields * segW + (maxShields - 1) * gap;
      const startX = -totalW / 2;
      const barY = -height / 2 - 2;

      for (let s = 0; s < maxShields; s++) {
        if (s < shields) {
          ctx.fillStyle = shields > 1 ? '#c084fc' : '#ec4899';
          ctx.fillRect(startX + s * (segW + gap), barY, segW, segH);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(startX + s * (segW + gap), barY, segW, segH);
        }
      }
    }

    // Shield Halo
    if (shields > 0) {
      const shieldRatio = shields / maxShields;
      ctx.strokeStyle = shieldRatio > 0.6 ? '#c084fc' : '#ec4899';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.65, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Heavy Diamond Cruiser
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, height / 2); // Front prow
    ctx.lineTo(width / 2, 0);
    ctx.lineTo(width * 0.35, -height / 2);
    ctx.lineTo(-width * 0.35, -height / 2);
    ctx.lineTo(-width / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // PR Merge icon badge (two nodes connected by branch line)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-width * 0.15, -height * 0.1, 3, 0, Math.PI * 2);
    ctx.arc(width * 0.15, height * 0.1, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width * 0.15, -height * 0.1);
    ctx.lineTo(width * 0.15, height * 0.1);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws Issue Bomber (Erratic flying bug with pulsing red core)
   */
  public static drawIssueBomber(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const pulse = 0.8 + Math.sin(time * 8) * 0.2;
    const wingAngle = Math.sin(time * 14) * 0.35;

    // Wings
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height * 0.2 + wingAngle * 9);
    ctx.lineTo(0, 0);
    ctx.lineTo(width / 2, -height * 0.2 - wingAngle * 9);
    ctx.stroke();

    // Bug Body
    ctx.fillStyle = '#450a0a';
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.35, height * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pulsing Hazard Core
    ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
    ctx.beginPath();
    ctx.arc(0, height * 0.08, 4.5 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws the Colossal CODE BOSS (Titan Sketion Core matching Reference Panel 3)
   */
  public static drawBoss(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    phase: number,
    time: number,
    coreColor: string = '#00e5ff'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const isRage = phase >= 3;
    const primaryColor = isRage ? '#ff0055' : coreColor;
    const secondaryColor = isRage ? '#f43f5e' : '#a855f7';

    // Phase 2+: Deflector Energy Matrix
    if (phase >= 2) {
      ctx.save();
      ctx.rotate(time * 1.8);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Floating Articulated Claws (Left and Right)
    const clawBob = Math.sin(time * 4) * 6;
    [-1, 1].forEach((dir) => {
      ctx.save();
      ctx.translate(dir * width * 0.52, clawBob);
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -height * 0.3);
      ctx.lineTo(dir * 18, -height * 0.1);
      ctx.lineTo(dir * 12, height * 0.35);
      ctx.lineTo(0, height * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Energy conduit on claw
      ctx.fillStyle = primaryColor;
      ctx.fillRect(dir * 2, -height * 0.1, 4, 16);
      ctx.restore();
    });

    // Boss Main Torso / Titan Skull
    ctx.fillStyle = '#080d1a';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, height * 0.45); // Jaw
    ctx.lineTo(width * 0.3, height * 0.2);
    ctx.lineTo(width * 0.36, -height * 0.15); // Cheek
    ctx.lineTo(width * 0.22, -height * 0.45); // Brow
    ctx.lineTo(-width * 0.22, -height * 0.45);
    ctx.lineTo(-width * 0.36, -height * 0.15);
    ctx.lineTo(-width * 0.3, height * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Skull Eye Visor Slits
    ctx.fillStyle = isRage ? '#ff0055' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-width * 0.18, -height * 0.15);
    ctx.lineTo(-width * 0.05, -height * 0.1);
    ctx.lineTo(-width * 0.15, -height * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width * 0.18, -height * 0.15);
    ctx.lineTo(width * 0.05, -height * 0.1);
    ctx.lineTo(width * 0.15, -height * 0.05);
    ctx.closePath();
    ctx.fill();

    // Glowing Central Reactor Core
    const corePulse = 0.85 + Math.sin(time * 6) * 0.25;
    const coreGrad = ctx.createRadialGradient(0, height * 0.08, 3, 0, height * 0.08, 22 * corePulse);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.5, primaryColor);
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, height * 0.08, 20 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Quad heavy cannons
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-width * 0.25, height * 0.18, 6, 14);
    ctx.fillRect(-width * 0.1, height * 0.32, 6, 16);
    ctx.fillRect(width * 0.1 - 6, height * 0.32, 6, 16);
    ctx.fillRect(width * 0.25 - 6, height * 0.18, 6, 14);

    ctx.restore();
  }
}
