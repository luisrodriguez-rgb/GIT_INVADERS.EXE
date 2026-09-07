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
   * Draws Procedural CODE BOSS with 10 Distinct Visual Chassis Archetypes:
   * 01. 'commit_core': Circular mechanical ring with </> reactor & orbiting commit drones
   * 02. 'the_fortress': Bulky PR armor fortress with 4 orbital deflector plates
   * 03. 'issue_swarm': Living bio-mechanical swarm with articulated tentacles & bug drones
   * 04. 'dependency_hydra': Emerald multi-head hydra with linked dependency node conduits
   * 05. 'merge_conflict': Split dual-color ship (cyan HEAD / red branch) with diff divider
   * 06. 'contributor_overlord': Star carrier with Octocat command core & fleet docking bays
   * 07. 'branchlord': Fractal multi-winged golden delta interceptor with branch vanes
   * 08. 'rebase_phantom': Stealth obsidian-crimson needle dagger with glitch afterimages
   * 09. 'security_sentinel': Cyber-aegis dreadnought with digital padlock & hexagonal firewalls
   * 10. 'code_abyss': Gravitational singularity vortex with event horizon & code debris
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
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const isRage = phase >= 3;
    const primaryColor = isRage ? '#ff0055' : coreColor;
    const secondaryColor = isRage ? '#f43f5e' : '#a855f7';

    // Universal Rotating Deflector Matrix for Phase 2+
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
      // 01. THE COMMIT CORE
      // ==========================================
      case 'commit_core': {
        // Outer rotating gear armature
        ctx.save();
        ctx.rotate(time * 0.9);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const teeth = 12;
        for (let i = 0; i < teeth; i++) {
          const a = (i / teeth) * Math.PI * 2;
          const r1 = width * 0.44;
          const r2 = width * 0.52;
          ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.lineTo(Math.cos(a + 0.1) * r2, Math.sin(a + 0.1) * r2);
          ctx.lineTo(Math.cos(a + 0.2) * r2, Math.sin(a + 0.2) * r2);
          ctx.lineTo(Math.cos(a + 0.3) * r1, Math.sin(a + 0.3) * r1);
        }
        ctx.closePath();
        ctx.fillStyle = '#0a0d18';
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 8 Orbiting Commit Drones
        for (let i = 0; i < 8; i++) {
          const a = time * 2.2 + (i * Math.PI * 2) / 8;
          const cx = Math.cos(a) * (width * 0.56);
          const cy = Math.sin(a) * (height * 0.52);
          ctx.fillStyle = i % 2 === 0 ? '#ff0055' : '#00e5ff';
          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Concentric Reactor Housing
        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pulsing Central Reactor
        const pulse = 0.85 + Math.sin(time * 6) * 0.2;
        const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 22 * pulse);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#ff0055');
        grad.addColorStop(1, '#3b0764');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, 20 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Reactor Symbol: </>
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('</>', 0, 1);
        break;
      }

      // ==========================================
      // 02. THE FORTRESS
      // ==========================================
      case 'the_fortress': {
        // 4 Deployable Orbital Deflector Pylons
        const pylonOffsets = [
          [-width * 0.52, -height * 0.35],
          [width * 0.52, -height * 0.35],
          [-width * 0.56, height * 0.25],
          [width * 0.56, height * 0.25],
        ];
        pylonOffsets.forEach(([px, py]) => {
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(px, py);
          ctx.stroke();

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();
        });

        // Heavy Armor Fortress Hull
        ctx.fillStyle = '#081326';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.46);
        ctx.lineTo(width * 0.42, height * 0.22);
        ctx.lineTo(width * 0.48, -height * 0.18);
        ctx.lineTo(width * 0.3, -height * 0.44);
        ctx.lineTo(-width * 0.3, -height * 0.44);
        ctx.lineTo(-width * 0.48, -height * 0.18);
        ctx.lineTo(-width * 0.42, height * 0.22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Central PR Hex Shield
        ctx.fillStyle = '#0f2942';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
          const hx = Math.cos(a) * 26;
          const hy = Math.sin(a) * 26;
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // PR Emblem
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PR', 0, 1);
        break;
      }

      // ==========================================
      // 03. THE ISSUE SWARM
      // ==========================================
      case 'issue_swarm': {
        // 6 Articulated Undulating Bio-Tentacles
        [-1, 1].forEach((dir) => {
          for (let tIdx = 0; tIdx < 3; tIdx++) {
            const wave = Math.sin(time * 4 + tIdx * 1.5) * 12;
            ctx.strokeStyle = secondaryColor;
            ctx.lineWidth = 3 - tIdx * 0.6;
            ctx.beginPath();
            ctx.moveTo(dir * width * 0.18, -height * 0.1 + tIdx * 14);
            ctx.bezierCurveTo(
              dir * (width * 0.42 + wave),
              height * 0.1 + tIdx * 10,
              dir * (width * 0.52 - wave),
              height * 0.4 + tIdx * 8,
              dir * (width * 0.62 + wave * 1.3),
              height * 0.5 + tIdx * 12
            );
            ctx.stroke();

            // Tentacle tip orb
            ctx.fillStyle = '#ff007f';
            ctx.beginPath();
            ctx.arc(dir * (width * 0.62 + wave * 1.3), height * 0.5 + tIdx * 12, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Living Chitin Central Bio-Carapace
        ctx.fillStyle = '#1e082b';
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.32, height * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 6 Orbiting Bug Mites
        for (let b = 0; b < 6; b++) {
          const bAngle = time * 3.2 + (b * Math.PI * 2) / 6;
          const bx = Math.cos(bAngle) * (width * 0.46);
          const by = Math.sin(bAngle) * (height * 0.38);
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(bx - 3, by - 3, 6, 6);
        }

        // Pulsing Cyclops Bio-Eye
        const eyePupil = Math.sin(time * 5) * 3;
        ctx.fillStyle = '#090111';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(eyePupil, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // ==========================================
      // 04. THE DEPENDENCY HYDRA
      // ==========================================
      case 'dependency_hydra': {
        const headCount = 4;
        const headCoords: [number, number][] = [];

        // Compute Head Coordinates
        for (let h = 0; h < headCount; h++) {
          const hAngle = -Math.PI * 0.75 + (h / (headCount - 1)) * Math.PI * 0.9;
          const hWave = Math.sin(time * 2.5 + h * 1.2) * 8;
          const hx = Math.cos(hAngle) * (width * 0.44) + hWave;
          const hy = Math.sin(hAngle) * (height * 0.4) - 8;
          headCoords.push([hx, hy]);

          // Glowing Dependency Conduits linking Core to Head
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, height * 0.1);
          ctx.lineTo(hx, hy);
          ctx.stroke();
        }

        // Central Dependency Nexus
        ctx.fillStyle = '#062015';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.42);
        ctx.lineTo(width * 0.22, height * 0.1);
        ctx.lineTo(width * 0.18, -height * 0.25);
        ctx.lineTo(-width * 0.18, -height * 0.25);
        ctx.lineTo(-width * 0.22, height * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Render Hydra Head Pods
        headCoords.forEach(([hx, hy], idx) => {
          ctx.fillStyle = '#04170e';
          ctx.strokeStyle = idx % 2 === 0 ? '#10b981' : '#38bdf8';
          ctx.lineWidth = 2;
          ctx.fillRect(hx - 12, hy - 10, 24, 20);
          ctx.strokeRect(hx - 12, hy - 10, 24, 20);

          // Head Sensor Node
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(hx, hy, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }

      // ==========================================
      // 05. THE MERGE CONFLICT
      // ==========================================
      case 'merge_conflict': {
        const splitOffset = Math.sin(time * 4) * 4;

        // LEFT HALF: HEAD (Cyan)
        ctx.save();
        ctx.translate(-splitOffset, 0);
        ctx.fillStyle = '#041b24';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-3, -height * 0.44);
        ctx.lineTo(-width * 0.34, -height * 0.2);
        ctx.lineTo(-width * 0.48, height * 0.15);
        ctx.lineTo(-width * 0.24, height * 0.42);
        ctx.lineTo(-3, height * 0.32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText('<<<< HEAD', -12, 0);
        ctx.restore();

        // RIGHT HALF: BRANCH (Red/Magenta)
        ctx.save();
        ctx.translate(splitOffset, 0);
        ctx.fillStyle = '#260611';
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(3, -height * 0.44);
        ctx.lineTo(width * 0.34, -height * 0.2);
        ctx.lineTo(width * 0.48, height * 0.15);
        ctx.lineTo(width * 0.24, height * 0.42);
        ctx.lineTo(3, height * 0.32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ff0055';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('branch >>>>', 12, 0);
        ctx.restore();

        // Central Divider: =======
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -height * 0.42);
        ctx.lineTo(0, height * 0.38);
        ctx.stroke();
        break;
      }

      // ==========================================
      // 06. THE CONTRIBUTOR OVERLORD
      // ==========================================
      case 'contributor_overlord':
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
      // 07. THE BRANCHLORD
      // ==========================================
      case 'branchlord':
      case 'quantum_citadel': {
        // Multi-Layered Fractal Branch Wings
        const branchLayers = 3;
        for (let l = 1; l <= branchLayers; l++) {
          const lWave = Math.sin(time * 3 + l) * 5;
          const lSpan = width * (0.28 + l * 0.09);
          const lDepth = height * (0.12 + l * 0.1);
          ctx.strokeStyle = l % 2 === 0 ? '#facc15' : '#10b981';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(-lSpan, lDepth + lWave);
          ctx.lineTo(0, -height * 0.35);
          ctx.lineTo(lSpan, lDepth + lWave);
          ctx.stroke();

          // Branch Node Emitters
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-lSpan - 3, lDepth + lWave - 3, 6, 6);
          ctx.fillRect(lSpan - 3, lDepth + lWave - 3, 6, 6);
        }

        // Diamond Central Command Pod
        ctx.fillStyle = '#1c1917';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -height * 0.44);
        ctx.lineTo(width * 0.22, 0);
        ctx.lineTo(0, height * 0.44);
        ctx.lineTo(-width * 0.22, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pulsing Golden Core
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // ==========================================
      // 08. THE REBASE PHANTOM
      // ==========================================
      case 'rebase_phantom': {
        // Speed Glitch Afterimage Trail
        ctx.save();
        ctx.globalAlpha = 0.35;
        const trailOffset = Math.sin(time * 8) * 8;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(0 + trailOffset, height * 0.45);
        ctx.lineTo(width * 0.46 + trailOffset, -height * 0.15);
        ctx.lineTo(0 + trailOffset, -height * 0.48);
        ctx.lineTo(-width * 0.46 + trailOffset, -height * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Razor-Sharp Needle Interceptor Hull
        ctx.fillStyle = '#08080a';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.45); // Needle tail
        ctx.lineTo(width * 0.44, -height * 0.12); // Starboard razor
        ctx.lineTo(width * 0.18, -height * 0.32);
        ctx.lineTo(0, -height * 0.48); // Nose probe
        ctx.lineTo(-width * 0.18, -height * 0.32);
        ctx.lineTo(-width * 0.44, -height * 0.12); // Port razor
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Crimson Spine Conduits
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -height * 0.42);
        ctx.lineTo(0, height * 0.38);
        ctx.stroke();

        // Cockpit Slit
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(-width * 0.08, -height * 0.18, width * 0.16, 5);
        break;
      }

      // ==========================================
      // 09. THE SECURITY SENTINEL
      // ==========================================
      case 'security_sentinel':
      case 'dreadnought_carrier': {
        // 4 Orbiting Hexagonal Firewall Deflectors
        for (let s = 0; s < 4; s++) {
          const sAngle = time * 1.6 + (s * Math.PI * 2) / 4;
          const sx = Math.cos(sAngle) * (width * 0.52);
          const sy = Math.sin(sAngle) * (height * 0.38);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let h = 0; h < 6; h++) {
            const ha = (h / 6) * Math.PI * 2;
            const hx = sx + Math.cos(ha) * 11;
            const hy = sy + Math.sin(ha) * 11;
            if (h === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Heavy Cyber-Aegis Hull
        ctx.fillStyle = '#071220';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.44);
        ctx.lineTo(width * 0.38, height * 0.18);
        ctx.lineTo(width * 0.42, -height * 0.3);
        ctx.lineTo(0, -height * 0.42);
        ctx.lineTo(-width * 0.42, -height * 0.3);
        ctx.lineTo(-width * 0.38, height * 0.18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Digital Lock Visor
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(-10, -8, 20, 18);
        ctx.beginPath();
        ctx.arc(0, -8, 7, Math.PI, Math.PI * 2);
        ctx.stroke();
        break;
      }

      // ==========================================
      // 10. THE CODE ABYSS
      // ==========================================
      case 'code_abyss':
      case 'titan_skull':
      default: {
        // Swirling Gravitational Matter Accretion Disk
        ctx.save();
        ctx.rotate(time * 1.5);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.52, 0, Math.PI * 2);
        ctx.stroke();

        ctx.rotate(-time * 2.5);
        ctx.strokeStyle = '#ff007f';
        ctx.setLineDash([12, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Floating shattered code fragments
        const frags = ['404', '{}', 'null', 'NaN'];
        frags.forEach((txt, idx) => {
          const fAngle = time * 2.0 + (idx * Math.PI * 2) / frags.length;
          const fx = Math.cos(fAngle) * (width * 0.45);
          const fy = Math.sin(fAngle) * (height * 0.36);
          ctx.fillStyle = '#e879f9';
          ctx.font = '10px monospace';
          ctx.fillText(txt, fx, fy);
        });

        // Singularity Black Hole Void
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner Singularity Core
        const singPulse = 0.85 + Math.sin(time * 8) * 0.25;
        const singGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 18 * singPulse);
        singGrad.addColorStop(0, '#ffffff');
        singGrad.addColorStop(0.5, '#ec4899');
        singGrad.addColorStop(1, '#000000');
        ctx.fillStyle = singGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 16 * singPulse, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }
}
