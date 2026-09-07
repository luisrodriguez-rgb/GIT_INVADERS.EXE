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

    // Compact Tactical PR Code Badge (Single line to prevent row bleed)
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#c084fc';
    ctx.textAlign = 'center';
    ctx.fillText(`#PR ${prNumber}`, 0, -height / 2 - 6);

    // Segmented Shield Bar
    if (shields > 0) {
      const segW = 6;
      const segH = 2.5;
      const gap = 2;
      const totalW = maxShields * segW + (maxShields - 1) * gap;
      const startX = -totalW / 2;
      const barY = -height / 2 - 1;

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

    // Shield Halo (Strictly contained within cruiser footprint)
    if (shields > 0) {
      const shieldRatio = shields / maxShields;
      ctx.strokeStyle = shieldRatio > 0.6 ? '#c084fc' : '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.46, 0, Math.PI * 2);
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
   * Draws Procedural CODE BOSS with 5 Distinct Visual Chassis Archetypes:
   * 1. 'octo_destroyer': Octocat Mothership Carrier with mechanical tendrils & singularity core
   * 2. 'dreadnought_carrier': Heavy military battleship with dual railgun prows & engine bays
   * 3. 'quantum_citadel': Geometric diamond fortress with rotating orbital prism drones
   * 4. 'titan_skull': Biomechanical dread-skull with hydraulic mandibles & laser claws
   * 5. 'cyber_sentinel': Supersonic stealth interceptor flagship with plasma edge wings
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
    chassisType: string = 'octo_destroyer'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const isRage = phase >= 3;
    const primaryColor = isRage ? '#ff0055' : coreColor;
    const secondaryColor = isRage ? '#f43f5e' : '#a855f7';

    // Phase 2+: Universal Rotating Deflector Matrix
    if (phase >= 2) {
      ctx.save();
      ctx.rotate(time * 1.8);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.64, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    switch (chassisType) {
      // ==========================================
      // CHASSIS 1: OCTO DESTROYER (Flagship Mothership)
      // ==========================================
      case 'octo_destroyer': {
        // Swept Cyber Tendrils (6 lateral mechanical arms)
        [-1, 1].forEach((dir) => {
          [0.2, 0.4, 0.6].forEach((offset, idx) => {
            const wave = Math.sin(time * 3 + idx) * 8;
            ctx.strokeStyle = secondaryColor;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(dir * width * 0.2, -height * 0.1 + idx * 12);
            ctx.quadraticCurveTo(
              dir * (width * 0.45 + wave),
              height * 0.1 + idx * 10,
              dir * (width * 0.55 + wave * 1.2),
              height * 0.45 + idx * 6
            );
            ctx.stroke();
          });
        });

        // Main Octo Fuselage Hull
        ctx.fillStyle = '#060a14';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.4);
        ctx.lineTo(width * 0.35, height * 0.15);
        ctx.lineTo(width * 0.4, -height * 0.25);
        ctx.lineTo(width * 0.2, -height * 0.45);
        ctx.lineTo(0, -height * 0.35);
        ctx.lineTo(-width * 0.2, -height * 0.45);
        ctx.lineTo(-width * 0.4, -height * 0.25);
        ctx.lineTo(-width * 0.35, height * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pulsing Singularity Quantum Core
        const corePulse = 0.8 + Math.sin(time * 6) * 0.25;
        const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 24 * corePulse);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, primaryColor);
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 22 * corePulse, 0, Math.PI * 2);
        ctx.fill();

        // Dual Command Bridge Visors
        ctx.fillStyle = isRage ? '#ff0055' : '#38bdf8';
        ctx.fillRect(-width * 0.22, -height * 0.2, width * 0.16, 5);
        ctx.fillRect(width * 0.06, -height * 0.2, width * 0.16, 5);
        break;
      }

      // ==========================================
      // CHASSIS 2: DREADNOUGHT CARRIER (Heavy Battleship)
      // ==========================================
      case 'dreadnought_carrier': {
        // Dual Forward Railgun Prow Prongs
        ctx.fillStyle = '#0b1329';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;

        // Left Railgun Prong
        ctx.fillRect(-width * 0.38, -height * 0.4, width * 0.18, height * 0.85);
        ctx.strokeRect(-width * 0.38, -height * 0.4, width * 0.18, height * 0.85);
        // Right Railgun Prong
        ctx.fillRect(width * 0.2, -height * 0.4, width * 0.18, height * 0.85);
        ctx.strokeRect(width * 0.2, -height * 0.4, width * 0.18, height * 0.85);

        // Central Super-Structure
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.45);
        ctx.lineTo(width * 0.25, height * 0.2);
        ctx.lineTo(width * 0.2, -height * 0.3);
        ctx.lineTo(-width * 0.2, -height * 0.3);
        ctx.lineTo(-width * 0.25, height * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Railgun Plasma Conduits
        ctx.fillStyle = primaryColor;
        ctx.fillRect(-width * 0.32, -height * 0.35, 6, height * 0.7);
        ctx.fillRect(width * 0.26, -height * 0.35, 6, height * 0.7);

        // Glowing Engine Nacelles
        ctx.fillStyle = '#00f0ff';
        const thrustPulse = Math.sin(time * 12) * 4;
        ctx.fillRect(-width * 0.15, height * 0.45, 12, 10 + thrustPulse);
        ctx.fillRect(width * 0.05, height * 0.45, 12, 10 + thrustPulse);
        break;
      }

      // ==========================================
      // CHASSIS 3: QUANTUM CITADEL (Geometric Monolith)
      // ==========================================
      case 'quantum_citadel': {
        // Outer Rotating Diamond Lattice
        ctx.save();
        ctx.rotate(time * 1.2);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -height * 0.55);
        ctx.lineTo(width * 0.45, 0);
        ctx.lineTo(0, height * 0.55);
        ctx.lineTo(-width * 0.45, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Inner Counter-Rotating Hexagon
        ctx.save();
        ctx.rotate(-time * 1.5);
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const px = Math.cos(a) * (width * 0.28);
          const py = Math.sin(a) * (height * 0.32);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // 4 Orbiting Prism Drone Satellites
        for (let p = 0; p < 4; p++) {
          const prismAngle = time * 2.2 + (p * Math.PI) / 2;
          const px = Math.cos(prismAngle) * (width * 0.5);
          const py = Math.sin(prismAngle) * (height * 0.4);
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 1.5;
          ctx.fillRect(px - 5, py - 5, 10, 10);
          ctx.strokeRect(px - 5, py - 5, 10, 10);
        }

        // Central Monolithic Core
        ctx.fillStyle = '#0a0f1d';
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // ==========================================
      // CHASSIS 4: TITAN SKULL (Biomechanical Warlord)
      // ==========================================
      case 'titan_skull': {
        // Floating Articulated Laser Claws
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
          ctx.restore();
        });

        // Titan Skull Torso
        ctx.fillStyle = '#080d1a';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.45);
        ctx.lineTo(width * 0.3, height * 0.2);
        ctx.lineTo(width * 0.36, -height * 0.15);
        ctx.lineTo(width * 0.22, -height * 0.45);
        ctx.lineTo(-width * 0.22, -height * 0.45);
        ctx.lineTo(-width * 0.36, -height * 0.15);
        ctx.lineTo(-width * 0.3, height * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Skull Eye Visor Slits
        ctx.fillStyle = isRage ? '#ff0055' : '#38bdf8';
        [-1, 1].forEach((dir) => {
          ctx.beginPath();
          ctx.moveTo(dir * width * 0.18, -height * 0.15);
          ctx.lineTo(dir * width * 0.05, -height * 0.1);
          ctx.lineTo(dir * width * 0.15, -height * 0.05);
          ctx.closePath();
          ctx.fill();
        });

        // Pulsing Core
        const corePulse = 0.85 + Math.sin(time * 6) * 0.25;
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(0, height * 0.08, 16 * corePulse, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // ==========================================
      // CHASSIS 5: CYBER SENTINEL (Supersonic Interceptor)
      // ==========================================
      case 'cyber_sentinel':
      default: {
        // Forward-Swept Razor Wings
        ctx.fillStyle = '#050a17';
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(0, height * 0.4); // Tail
        ctx.lineTo(width * 0.48, height * 0.05); // Wingtip right
        ctx.lineTo(width * 0.35, -height * 0.35); // Leading edge
        ctx.lineTo(0, -height * 0.48); // Nose
        ctx.lineTo(-width * 0.35, -height * 0.35);
        ctx.lineTo(-width * 0.48, height * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Razor Plasma Edge Lines
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-width * 0.46, height * 0.03);
        ctx.lineTo(-width * 0.33, -height * 0.33);
        ctx.lineTo(0, -height * 0.45);
        ctx.lineTo(width * 0.33, -height * 0.33);
        ctx.lineTo(width * 0.46, height * 0.03);
        ctx.stroke();

        // Twin Stealth Cockpits
        ctx.fillStyle = isRage ? '#ff0055' : '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-width * 0.12, -height * 0.2);
        ctx.lineTo(-width * 0.06, -height * 0.05);
        ctx.lineTo(-width * 0.16, -height * 0.05);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width * 0.12, -height * 0.2);
        ctx.lineTo(width * 0.16, -height * 0.05);
        ctx.lineTo(width * 0.06, -height * 0.05);
        ctx.closePath();
        ctx.fill();

        // Quad Blaster Cannon Barrels
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-width * 0.3, height * 0.1, 5, 14);
        ctx.fillRect(-width * 0.12, height * 0.25, 5, 16);
        ctx.fillRect(width * 0.12 - 5, height * 0.25, 5, 16);
        ctx.fillRect(width * 0.3 - 5, height * 0.1, 5, 14);
        break;
      }
    }

    ctx.restore();
  }
}
