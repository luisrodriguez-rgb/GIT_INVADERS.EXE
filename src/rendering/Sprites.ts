/**
 * Vector and pixel sprite drawing routines for Canvas 2D
 * Zero image assets required. High-DPI crisp rendering.
 */

export class Sprites {
  /**
   * Draws the Compiler Player Ship
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
    glowColor: string = '#38bdf8'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    // Thruster engine glow
    const engineFlicker = 0.7 + Math.random() * 0.3;
    const gradient = ctx.createRadialGradient(0, height * 0.4, 2, 0, height * 0.6, 16);
    gradient.addColorStop(0, overdriveCharged ? '#ff007f' : glowColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, height * 0.45, 14 * engineFlicker, 0, Math.PI * 2);
    ctx.fill();

    // Ship Hull (Neon Delta Wing)
    ctx.lineWidth = 2;
    ctx.strokeStyle = overdriveCharged ? '#ff007f' : hullColor;
    ctx.fillStyle = '#0a192f';

    ctx.beginPath();
    ctx.moveTo(0, -height / 2); // Nose
    ctx.lineTo(width / 2, height / 2); // Right wingtip
    ctx.lineTo(width * 0.2, height * 0.3); // Right inner
    ctx.lineTo(0, height * 0.4); // Engine bay
    ctx.lineTo(-width * 0.2, height * 0.3); // Left inner
    ctx.lineTo(-width / 2, height / 2); // Left wingtip
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit / Compiler Core
    ctx.fillStyle = overdriveCharged ? '#ff007f' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(0, -height * 0.3);
    ctx.lineTo(width * 0.12, height * 0.05);
    ctx.lineTo(-width * 0.12, height * 0.05);
    ctx.closePath();
    ctx.fill();

    // Wing blasters
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-width * 0.45, height * 0.1, 3, 6);
    ctx.fillRect(width * 0.45 - 3, height * 0.1, 3, 6);

    // Stash Shield Aura
    if (hasShield) {
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
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
    maxShields: number
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

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

    // PR Merge icon badge (two dots connected by line)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-width * 0.15, -height * 0.1, 3, 0, Math.PI * 2);
    ctx.arc(width * 0.15, height * 0.1, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
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

    // Wing oscillation
    const wingAngle = Math.sin(time * 12) * 0.3;

    // Wings
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height * 0.2 + wingAngle * 8);
    ctx.lineTo(0, 0);
    ctx.lineTo(width / 2, -height * 0.2 - wingAngle * 8);
    ctx.stroke();

    // Bug Body
    ctx.fillStyle = '#7f1d1d';
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.35, height * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pulsing Hazard Core
    ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`;
    ctx.beginPath();
    ctx.arc(0, height * 0.08, 4 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws the Colossal CODE BOSS (sketion // core)
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

    // Phase 2/3: Rotating Plasma Shield Rings
    if (phase >= 2) {
      ctx.save();
      ctx.rotate(time * 1.5);
      ctx.strokeStyle = phase === 3 ? '#ef4444' : '#a855f7';
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.58, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Boss Main Hull (Command Carrier)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = phase === 3 ? '#ef4444' : coreColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, height * 0.45); // Central ventral prow
    ctx.lineTo(width * 0.38, height * 0.25);
    ctx.lineTo(width * 0.48, -height * 0.2); // Right wingtip
    ctx.lineTo(width * 0.25, -height * 0.45);
    ctx.lineTo(-width * 0.25, -height * 0.45);
    ctx.lineTo(-width * 0.48, -height * 0.2); // Left wingtip
    ctx.lineTo(-width * 0.38, height * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Central Core
    const corePulse = 0.8 + Math.sin(time * 6) * 0.25;
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 28 * corePulse);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.5, phase === 3 ? '#ff1744' : coreColor);
    coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 24 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Cannon turrets
    ctx.fillStyle = phase === 3 ? '#ef4444' : '#ffffff';
    ctx.fillRect(-width * 0.35, height * 0.15, 6, 12);
    ctx.fillRect(-width * 0.15, height * 0.3, 6, 14);
    ctx.fillRect(width * 0.15 - 6, height * 0.3, 6, 14);
    ctx.fillRect(width * 0.35 - 6, height * 0.15, 6, 12);

    ctx.restore();
  }
}
