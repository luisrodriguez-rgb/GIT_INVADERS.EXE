/**
 * GIT_INVADERS.EXE // BOSS MODULAR RENDERER 2.0
 * Ultra-high fidelity multi-module boss leviathans with destructible anatomy and curated color signatures:
 *
 * 01. The Commit Core: Dual contra-rotating gears, 8-10 orbiting drones, floating commit tags, </> reactor
 * 02. The Fortress: 4 orbital deflector pylons, flak cannon turrets, missile pods with hazard stripes, PR shield
 * 03. The Issue Swarm: 6 undulating bio-tentacles, dripping venom, orbiting bug mites, cyclops radar eye
 * 04. The Dependency Hydra: 5 articulated serpentine dragon necks, scale plates, razor fangs, plasma breath
 * 05. The Merge Conflict: Split dual-chassis (Cyan HEAD / Magenta Branch), conflict lightning rift =======
 * 06. The Contributor Overlord: Octocat bridge with cyber-ears & glowing eyes, 6 mechanical arms, docking bays
 * 07. The Branchlord: 3-tier fractal golden angel wings, lineage commit nodes, royal diamond crown
 * 08. The Rebase Phantom: Obsidian stealth dagger, 3 RGB chromatic afterimages, tracking laser sight
 * 09. The Security Sentinel: Cyber-aegis dreadnought, hazard chevrons, rotating padlock cipher rings, firewall shields
 * 10. The Code Abyss: Gravitational black hole singularity, dual accretion disks, floating syntax runes, polar jets
 */

export interface BossPalette {
  primary: string;
  secondary: string;
  accent: string;
  hullDark: string;
  coreGlow: string;
}

export interface BossModuleStatus {
  leftAlive: boolean;
  rightAlive: boolean;
  auxAlive: boolean;
  leftRatio: number;
  rightRatio: number;
  auxRatio: number;
}

export const ARCHETYPE_PALETTES: Record<string, BossPalette> = {
  commit_core: {
    primary: '#00e5ff',
    secondary: '#22c55e',
    accent: '#facc15',
    hullDark: '#08101e',
    coreGlow: '#00e5ff',
  },
  the_fortress: {
    primary: '#38bdf8',
    secondary: '#f59e0b',
    accent: '#ef4444',
    hullDark: '#081326',
    coreGlow: '#38bdf8',
  },
  issue_swarm: {
    primary: '#ef4444',
    secondary: '#84cc16',
    accent: '#a855f7',
    hullDark: '#1a050d',
    coreGlow: '#ef4444',
  },
  dependency_hydra: {
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    hullDark: '#04170f',
    coreGlow: '#10b981',
  },
  merge_conflict: {
    primary: '#00e5ff',
    secondary: '#ff0055',
    accent: '#facc15',
    hullDark: '#120716',
    coreGlow: '#facc15',
  },
  merge_behemoth: {
    primary: '#00e5ff',
    secondary: '#ff0055',
    accent: '#facc15',
    hullDark: '#120716',
    coreGlow: '#facc15',
  },
  contributor_overlord: {
    primary: '#6366f1',
    secondary: '#fbbf24',
    accent: '#22c55e',
    hullDark: '#080b18',
    coreGlow: '#6366f1',
  },
  octo_destroyer: {
    primary: '#6366f1',
    secondary: '#fbbf24',
    accent: '#22c55e',
    hullDark: '#080b18',
    coreGlow: '#6366f1',
  },
  branchlord: {
    primary: '#eab308',
    secondary: '#10b981',
    accent: '#a855f7',
    hullDark: '#1a1608',
    coreGlow: '#eab308',
  },
  quantum_citadel: {
    primary: '#eab308',
    secondary: '#10b981',
    accent: '#a855f7',
    hullDark: '#1a1608',
    coreGlow: '#eab308',
  },
  rebase_phantom: {
    primary: '#f43f5e',
    secondary: '#00f5ff',
    accent: '#ffffff',
    hullDark: '#09090d',
    coreGlow: '#f43f5e',
  },
  rebase_titan: {
    primary: '#f43f5e',
    secondary: '#00f5ff',
    accent: '#ffffff',
    hullDark: '#09090d',
    coreGlow: '#f43f5e',
  },
  security_sentinel: {
    primary: '#0284c7',
    secondary: '#facc15',
    accent: '#ef4444',
    hullDark: '#061220',
    coreGlow: '#0284c7',
  },
  dreadnought_carrier: {
    primary: '#0284c7',
    secondary: '#facc15',
    accent: '#ef4444',
    hullDark: '#061220',
    coreGlow: '#0284c7',
  },
  code_abyss: {
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#38bdf8',
    hullDark: '#05020a',
    coreGlow: '#a855f7',
  },
  titan_skull: {
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#38bdf8',
    hullDark: '#05020a',
    coreGlow: '#a855f7',
  },
};

export class BossModularRenderer {
  private static fillArmoredGrad(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    hullDark: string,
    primaryColor: string
  ): CanvasGradient {
    const grad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    grad.addColorStop(0, primaryColor + '38');
    grad.addColorStop(0.28, hullDark);
    grad.addColorStop(0.75, '#050814');
    grad.addColorStop(1, primaryColor + '22');
    return grad;
  }

  public static render(
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
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const palette = ARCHETYPE_PALETTES[chassisType] || ARCHETYPE_PALETTES.commit_core;
    const isPhase3Plus = phase >= 3;
    const isFinalPush = phase >= 4;
    const primaryColor = isFinalPush
      ? '#ff0055'
      : isPhase3Plus
      ? '#f43f5e'
      : coreColor !== '#00e5ff'
      ? coreColor
      : palette.primary;
    const secondaryColor = isFinalPush ? '#ffd600' : isPhase3Plus ? '#ff7700' : palette.secondary;
    const accentColor = isFinalPush ? '#ffffff' : palette.accent;
    const hullDark = palette.hullDark;

    const hw = width / 2;
    const hh = height / 2;

    // Phase 3-4 Rage Overdrive: Thermal jitter & aura bloom
    if (isPhase3Plus) {
      const amp = isFinalPush ? 3.5 : 1.8;
      const jitterX = (Math.random() - 0.5) * amp;
      const jitterY = (Math.random() - 0.5) * amp;
      ctx.translate(jitterX, jitterY);

      ctx.save();
      const rageGrad = ctx.createRadialGradient(0, 0, hw * 0.2, 0, 0, hw * 1.15);
      rageGrad.addColorStop(0, isFinalPush ? 'rgba(255, 0, 85, 0.25)' : 'rgba(244, 63, 94, 0.14)');
      rageGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rageGrad;
      ctx.beginPath();
      ctx.arc(0, 0, hw * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 1. Universal Rotating Deflector Matrix (Phase 2+) & Outer Critical Ring (Phase 4)
    if (phase >= 2) {
      ctx.save();
      const rotSpeed = isFinalPush ? 4.5 : isPhase3Plus ? 3.2 : 1.8;
      ctx.rotate(time * rotSpeed);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = isFinalPush ? 3.5 : 2.4;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.62, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const nx = Math.cos(a) * width * 0.62;
        const ny = Math.sin(a) * width * 0.62;
        ctx.fillStyle = primaryColor;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }

    if (isFinalPush) {
      ctx.save();
      ctx.rotate(-time * 3.0);
      ctx.strokeStyle = 'rgba(255, 214, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Chassis-Specific Anatomical Assemblies
    switch (chassisType) {
      case 'the_fortress':
        this.renderTheFortress(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'issue_swarm':
        this.renderIssueSwarm(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'dependency_hydra':
        this.renderDependencyHydra(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'merge_conflict':
      case 'merge_behemoth':
        this.renderMergeConflict(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'contributor_overlord':
      case 'octo_destroyer':
        this.renderContributorOverlord(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'branchlord':
      case 'quantum_citadel':
        this.renderBranchlord(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'rebase_phantom':
      case 'rebase_titan':
        this.renderRebasePhantom(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'security_sentinel':
      case 'dreadnought_carrier':
        this.renderSecuritySentinel(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'code_abyss':
      case 'titan_skull':
        this.renderCodeAbyss(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
      case 'commit_core':
      default:
        this.renderCommitCore(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isPhase3Plus);
        break;
    }

    // 3. Multi-Layer Armored Cyber Pylon Claws / Destructible Sub-Modules (Image 3 style!)
    if (modules) {
      this.renderSubModules(ctx, hw, hh, time, primaryColor, secondaryColor, hullDark, modules);
    }

    // 4. Phase 3-4 Rage: High-Voltage Electrical Discharge Arcs
    if (isPhase3Plus) {
      this.renderElectricalArcs(ctx, hw, hh, time);
    }

    ctx.restore();
  }

  private static renderSubModules(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    hullDark: string,
    modules: BossModuleStatus
  ): void {
    const drawClawPod = (dir: -1 | 1, alive: boolean, ratio: number) => {
      const px = dir * hw * 0.94;
      const py = Math.sin(time * 2.5 + dir) * 4;
      ctx.save();
      // Articulated shoulder strut
      ctx.strokeStyle = alive ? secondaryColor : '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dir * hw * 0.45, -hh * 0.1);
      ctx.lineTo(px, py);
      ctx.stroke();

      if (alive) {
        // Heavy Armored Claw Pylon
        ctx.fillStyle = this.fillArmoredGrad(ctx, 18, 22, hullDark, primaryColor);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py - 18);
        ctx.lineTo(px + dir * 16, py - 6);
        ctx.lineTo(px + dir * 12, py + 18);
        ctx.lineTo(px - dir * 6, py + 24);
        ctx.lineTo(px - dir * 12, py + 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing emitter eye inside claw
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px + dir * 3, py + 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Compact module integrity bar above claw
        const bw = 24;
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(px - bw / 2, py - 26, bw, 3);
        ctx.fillStyle = ratio > 0.5 ? '#38bdf8' : '#f59e0b';
        ctx.fillRect(px - bw / 2, py - 26, bw * Math.max(0, ratio), 3);
      } else {
        // Destroyed charred pylon stump with flickering sparks
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.2;
        ctx.fillRect(px - 6, py - 6, 12, 12);
        ctx.strokeRect(px - 6, py - 6, 12, 12);
        if (Math.sin(time * 24 + dir) > 0.3) {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(px + (Math.random() - 0.5) * 10, py + (Math.random() - 0.5) * 10, 2.5, 2.5);
        }
      }
      ctx.restore();
    };

    drawClawPod(-1, modules.leftAlive, modules.leftRatio);
    drawClawPod(1, modules.rightAlive, modules.rightRatio);

    // Dorsal Aux Shield Node
    const ay = -hh * 0.92;
    ctx.save();
    if (modules.auxAlive) {
      ctx.fillStyle = hullDark;
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, ay - 10);
      ctx.lineTo(14, ay);
      ctx.lineTo(0, ay + 10);
      ctx.lineTo(-14, ay);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const bw = 28;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(-bw / 2, ay - 16, bw, 3);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-bw / 2, ay - 16, bw * Math.max(0, modules.auxRatio), 3);
    } else {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-7, ay - 4, 14, 8);
    }
    ctx.restore();
  }

  /* ----------------------------------------------------
     01. THE COMMIT CORE
     ---------------------------------------------------- */
  private static renderCommitCore(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    hullDark: string,
    isRage: boolean
  ): void {
    // 1. Outer Rotating Gear Armature
    ctx.save();
    ctx.rotate(time * (isRage ? 2.0 : 0.9));
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    const teeth = 12;
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const r1 = hw * 0.88;
      const r2 = hw * 1.05;
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a + 0.1) * r2, Math.sin(a + 0.1) * r2);
      ctx.lineTo(Math.cos(a + 0.2) * r2, Math.sin(a + 0.2) * r2);
      ctx.lineTo(Math.cos(a + 0.3) * r1, Math.sin(a + 0.3) * r1);
    }
    ctx.closePath();
    ctx.fillStyle = hullDark;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 2. Contra-Rotating Inner Gear (Secondary Color)
    ctx.save();
    ctx.rotate(-time * (isRage ? 2.2 : 1.1));
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    const innerTeeth = 8;
    for (let i = 0; i < innerTeeth; i++) {
      const a = (i / innerTeeth) * Math.PI * 2;
      const r1 = hw * 0.65;
      const r2 = hw * 0.76;
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a + 0.15) * r2, Math.sin(a + 0.15) * r2);
      ctx.lineTo(Math.cos(a + 0.25) * r2, Math.sin(a + 0.25) * r2);
      ctx.lineTo(Math.cos(a + 0.4) * r1, Math.sin(a + 0.4) * r1);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 3. Floating Orbiting Commit Tags (HEAD, main, sha:7f3a)
    const tags = ['HEAD', 'main', '7f3a2c', 'v2.0'];
    tags.forEach((tag, idx) => {
      const a = time * 1.5 + (idx * Math.PI * 2) / tags.length;
      const tx = Math.cos(a) * (hw * 0.95);
      const ty = Math.sin(a) * (hh * 0.95);
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(tag, tx, ty);
    });

    // 4. Orbiting Commit Drones with laser connection lines
    const droneCount = isRage ? 10 : 8;
    for (let i = 0; i < droneCount; i++) {
      const a = time * (isRage ? 3.6 : 2.2) + (i * Math.PI * 2) / droneCount;
      const cx = Math.cos(a) * (hw * 1.15);
      const cy = Math.sin(a) * (hh * 1.05);

      ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 229, 255, 0.3)' : 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 5. Heavy Concentric Reactor Housing
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.52, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 6. Pulsing Fusion Reactor Core
    const pulse = 0.85 + Math.sin(time * 6) * 0.22;
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 24 * pulse);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, primaryColor);
    grad.addColorStop(0.8, secondaryColor);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 22 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Reactor Core Monospace Glyph: </>
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('</>', 0, 1);
  }

  /* ----------------------------------------------------
     02. THE FORTRESS
     ---------------------------------------------------- */
  private static renderTheFortress(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    hullDark: string,
    isRage: boolean
  ): void {
    // 4 Deployable Orbital Deflector Pylons with Rotating Pods
    const pylonOffsets = [
      [-hw * 1.05, -hh * 0.72],
      [hw * 1.05, -hh * 0.72],
      [-hw * 1.15, hh * 0.52],
      [hw * 1.15, hh * 0.52],
    ];
    pylonOffsets.forEach(([px, py], pIdx) => {
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Pylon Pod with animated rotating radar
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Flak Cannon Turret barrel pointing downwards
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py + 14);
      ctx.stroke();
    });

    // Massive Heavy Armor Fortress Hull
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, hh * 0.94);
    ctx.lineTo(hw * 0.86, hh * 0.45);
    ctx.lineTo(hw * 0.98, -hh * 0.38);
    ctx.lineTo(hw * 0.62, -hh * 0.9);
    ctx.lineTo(-hw * 0.62, -hh * 0.9);
    ctx.lineTo(-hw * 0.98, -hh * 0.38);
    ctx.lineTo(-hw * 0.86, hh * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Missile Pod Sponsons with Hazard Stripes (Secondary Amber)
    [-hw * 0.7, hw * 0.5].forEach((mx) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(mx, -hh * 0.4, hw * 0.2, hh * 0.35);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mx, -hh * 0.4, hw * 0.2, hh * 0.35);

      // Warning Chevron Hatch
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(mx + 4, -hh * 0.35, hw * 0.2 - 8, 3);
    });

    // Central PR Hex Shield
    ctx.fillStyle = '#0f2942';
    ctx.strokeStyle = primaryColor;
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

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PR', 0, 1);
  }

  /* ----------------------------------------------------
     03. THE ISSUE SWARM
     ---------------------------------------------------- */
  private static renderIssueSwarm(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    hullDark: string,
    isRage: boolean
  ): void {
    // 6 Articulated Undulating Bio-Tentacles (Secondary Toxic Lime)
    [-1, 1].forEach((dir) => {
      for (let tIdx = 0; tIdx < 3; tIdx++) {
        const wave = Math.sin(time * 4.5 + tIdx * 1.5) * 14;
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 3.2 - tIdx * 0.6;
        ctx.beginPath();
        ctx.moveTo(dir * hw * 0.36, -hh * 0.2 + tIdx * 14);
        ctx.bezierCurveTo(
          dir * (hw * 0.85 + wave),
          hh * 0.2 + tIdx * 10,
          dir * (hw * 1.05 - wave),
          hh * 0.8 + tIdx * 8,
          dir * (hw * 1.25 + wave * 1.3),
          hh * 1.0 + tIdx * 12
        );
        ctx.stroke();

        // Venom Stinger Tips
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(dir * (hw * 1.25 + wave * 1.3), hh * 1.0 + tIdx * 12, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Dripping Acid Droplets
    for (let d = 0; d < 3; d++) {
      const dropY = ((time * 120 + d * 60) % (hh * 1.5)) - hh * 0.2;
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc((d - 1) * 20, dropY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central Bio-Carapace
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.65, hh * 0.74, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Compound Insectoid Micro-Eyes
    [-1, 1].forEach((dir) => {
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(dir * hw * 0.35, -hh * 0.3, 4, 0, Math.PI * 2);
      ctx.arc(dir * hw * 0.42, -hh * 0.15, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Orbiting Bug Mites
    for (let b = 0; b < 6; b++) {
      const bAngle = time * 3.4 + (b * Math.PI * 2) / 6;
      const bx = Math.cos(bAngle) * (hw * 0.94);
      const by = Math.sin(bAngle) * (hh * 0.78);
      ctx.fillStyle = accentColor;
      ctx.fillRect(bx - 3, by - 3, 6, 6);
    }

    // Cyclops Bio-Eye with Radar Sweep Line
    ctx.fillStyle = '#090111';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Rotating Radar Sweep
    ctx.save();
    ctx.rotate(time * 4);
    ctx.strokeStyle = 'rgba(255, 0, 85, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    ctx.restore();

    // Pupil
    const eyePupil = Math.sin(time * 5) * 4;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(eyePupil, 0, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ----------------------------------------------------
     04. THE DEPENDENCY HYDRA
     ---------------------------------------------------- */
  private static renderDependencyHydra(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    hullDark: string,
    isRage: boolean
  ): void {
    const headCount = 5;
    const headCoords: { x: number; y: number; angle: number; idx: number }[] = [];
    const coreX = 0;
    const coreY = hh * 0.36;

    for (let h = 0; h < headCount; h++) {
      const spreadRatio = (h - (headCount - 1) / 2) / ((headCount - 1) / 2);
      const baseAngle = -Math.PI / 2 + spreadRatio * 1.05;
      const slither = Math.sin(time * 3 + h * 1.3) * 8;
      // Keep all 5 articulated hydra heads cleanly inside the canvas frame & portrait box
      const hx = spreadRatio * (hw * 0.72) + slither * 0.45;
      const hy = -hh * 0.46 + Math.abs(spreadRatio) * (hh * 0.26) + Math.cos(time * 2.2 + h) * 4;
      headCoords.push({ x: hx, y: hy, angle: baseAngle, idx: h });

      const segments = 6;
      for (let s = 1; s <= segments; s++) {
        const tSeg = s / segments;
        const segX =
          coreX +
          (hx - coreX) * tSeg +
          Math.sin(time * 3 + h * 1.5 + s * 0.7) * (5 * Math.sin(tSeg * Math.PI));
        const segY = coreY + (hy - coreY) * tSeg - Math.sin(tSeg * Math.PI) * 6;
        const segSize = 4 + (1 - tSeg) * 3.5;

        if (s > 1) {
          const prevTSeg = (s - 1) / segments;
          const prevX =
            coreX +
            (hx - coreX) * prevTSeg +
            Math.sin(time * 3 + h * 1.5 + (s - 1) * 0.7) * (5 * Math.sin(prevTSeg * Math.PI));
          const prevY = coreY + (hy - coreY) * prevTSeg - Math.sin(prevTSeg * Math.PI) * 6;

          ctx.strokeStyle = h % 2 === 0 ? primaryColor : secondaryColor;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(segX, segY);
          ctx.stroke();
        }

        ctx.fillStyle = hullDark;
        ctx.strokeStyle = h % 2 === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(segX, segY, segSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Central Hydra Root Carapace
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(coreX, coreY + hh * 0.42);
    ctx.lineTo(coreX + hw * 0.36, coreY + hh * 0.14);
    ctx.lineTo(coreX + hw * 0.28, coreY - hh * 0.28);
    ctx.lineTo(coreX - hw * 0.28, coreY - hh * 0.28);
    ctx.lineTo(coreX - hw * 0.36, coreY + hh * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const corePulse = 0.85 + Math.sin(time * 5) * 0.2;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 12 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Render 5 Forward-Facing Dragon Heads with Razor Fangs & Plasma Glow
    headCoords.forEach(({ x: hx, y: hy, idx }) => {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate((idx - 2) * 0.22 + Math.sin(time * 2 + idx) * 0.1);

      const headScale = idx === 2 ? 1.08 : 0.88;
      ctx.scale(headScale, headScale);

      // Dragon Skull & Jaw Facing Forward
      ctx.fillStyle = '#064e3b';
      ctx.strokeStyle = idx % 2 === 0 ? primaryColor : secondaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(10, -4);
      ctx.lineTo(7, 8);
      ctx.lineTo(0, 12);
      ctx.lineTo(-7, 8);
      ctx.lineTo(-10, -4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dragon Eyes (Glowing Accent Amber)
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(-4, 0, 1.9, 0, Math.PI * 2);
      ctx.arc(4, 0, 1.9, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Throat Plasma Node
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 6, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Forward Razor Fangs
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-4, 7);
      ctx.lineTo(-2, 12);
      ctx.moveTo(4, 7);
      ctx.lineTo(2, 12);
      ctx.stroke();

      if (isRage && Math.sin(time * 10 + idx) > 0.3) {
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 14, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  /* ----------------------------------------------------
     05. THE MERGE CONFLICT (Split Dual-Mecha Leviathan - Image 2 #5)
     ---------------------------------------------------- */
  private static renderMergeConflict(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    _phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    _hullDark: string,
    _isRage: boolean
  ): void {
    const splitOffset = Math.sin(time * 4) * 4;

    // LEFT CHASSIS HALF: CYAN CYBER-LEVIATHAN ARMOR (HEAD)
    ctx.save();
    ctx.translate(-splitOffset, 0);
    const leftGrad = ctx.createLinearGradient(-hw, -hh, 0, hh);
    leftGrad.addColorStop(0, '#bae6fd');
    leftGrad.addColorStop(0.45, '#0369a1');
    leftGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = leftGrad;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-4, -hh * 0.72);
    ctx.lineTo(-hw * 0.35, -hh * 0.96);
    ctx.lineTo(-hw * 0.98, -hh * 0.36);
    ctx.lineTo(-hw * 1.04, hh * 0.25);
    ctx.lineTo(-hw * 0.56, hh * 0.88);
    ctx.lineTo(-4, hh * 0.74);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left Horned Wing Blade & Glowing Visor Eye
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.25, -hh * 0.25);
    ctx.lineTo(-hw * 0.68, -hh * 0.45);
    ctx.lineTo(-hw * 0.55, hh * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.28, -hh * 0.05, 5, 2.8, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // RIGHT CHASSIS HALF: CRIMSON/MAGENTA CYBER-LEVIATHAN ARMOR (BRANCH)
    ctx.save();
    ctx.translate(splitOffset, 0);
    const rightGrad = ctx.createLinearGradient(0, -hh, hw, hh);
    rightGrad.addColorStop(0, '#fecdd3');
    rightGrad.addColorStop(0.45, '#be123c');
    rightGrad.addColorStop(1, '#4c0519');
    ctx.fillStyle = rightGrad;
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(4, -hh * 0.72);
    ctx.lineTo(hw * 0.35, -hh * 0.96);
    ctx.lineTo(hw * 0.98, -hh * 0.36);
    ctx.lineTo(hw * 1.04, hh * 0.25);
    ctx.lineTo(hw * 0.56, hh * 0.88);
    ctx.lineTo(4, hh * 0.74);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(hw * 0.25, -hh * 0.25);
    ctx.lineTo(hw * 0.68, -hh * 0.45);
    ctx.lineTo(hw * 0.55, hh * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(hw * 0.28, -hh * 0.05, 5, 2.8, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Central High-Voltage Lightning Rift + Conflict Core
    ctx.save();
    ctx.strokeStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.95);
    for (let s = 1; s <= 8; s++) {
      const sy = -hh * 0.95 + (hh * 1.9 * s) / 8;
      const sx = Math.sin(time * 24 + s * 2.1) * 5;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    ctx.fillStyle = '#020617';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, hh * 0.08, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('<>', 0, hh * 0.08);
    ctx.restore();
  }

  /* ----------------------------------------------------
     06. THE CONTRIBUTOR OVERLORD
     ---------------------------------------------------- */
  private static renderContributorOverlord(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    hullDark: string,
    isRage: boolean
  ): void {
    // 6 Swept Mechanical Carrier Arms
    [-1, 1].forEach((dir) => {
      [0.2, 0.4, 0.6].forEach((offset, idx) => {
        const wave = Math.sin(time * 3.2 + idx) * 9;
        ctx.strokeStyle = secondaryColor; // Star Gold
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(dir * hw * 0.4, -hh * 0.2 + idx * 12);
        ctx.quadraticCurveTo(
          dir * (hw * 0.92 + wave),
          hh * 0.2 + idx * 10,
          dir * (hw * 1.12 + wave * 1.2),
          hh * 0.9 + idx * 6
        );
        ctx.stroke();
      });
    });

    // Octo Carrier Hull
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor; // Octo Indigo
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(0, hh * 0.82);
    ctx.lineTo(hw * 0.72, hh * 0.3);
    ctx.lineTo(hw * 0.82, -hh * 0.5);
    ctx.lineTo(hw * 0.42, -hh * 0.92);
    ctx.lineTo(0, -hh * 0.72);
    ctx.lineTo(-hw * 0.42, -hh * 0.92);
    ctx.lineTo(-hw * 0.82, -hh * 0.5);
    ctx.lineTo(-hw * 0.72, hh * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Octocat Cyber-Ears on Bridge
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    // Left Ear
    ctx.beginPath();
    ctx.moveTo(-hw * 0.18, -hh * 0.72);
    ctx.lineTo(-hw * 0.28, -hh * 0.95);
    ctx.lineTo(-hw * 0.08, -hh * 0.76);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Right Ear
    ctx.beginPath();
    ctx.moveTo(hw * 0.18, -hh * 0.72);
    ctx.lineTo(hw * 0.28, -hh * 0.95);
    ctx.lineTo(hw * 0.08, -hh * 0.76);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Singularity Command Core
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Cat Eyes (Blinks periodically)
    const isBlink = Math.sin(time * 3) > 0.94;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    if (!isBlink) {
      ctx.ellipse(-8, -4, 3, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(8, -4, 3, 5, 0, 0, Math.PI * 2);
    } else {
      ctx.rect(-11, -4, 6, 2);
      ctx.rect(5, -4, 6, 2);
    }
    ctx.fill();
  }

  /* ----------------------------------------------------
     07. THE BRANCHLORD (6-Winged Mecha-Archangel - Image 2 #7)
     ---------------------------------------------------- */
  private static renderBranchlord(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    _phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    _hullDark: string,
    _isRage: boolean
  ): void {
    // 6 Solid Beveled Armor-Feather Wings fanned on Left & Right
    [-1, 1].forEach((dir) => {
      for (let tier = 0; tier < 3; tier++) {
        const flap = Math.sin(time * 3.5 + tier * 0.9) * 3;
        const yOff = -hh * 0.35 + tier * hh * 0.34;
        const span = hw * (1.12 - tier * 0.16);
        const wing = new Path2D();
        wing.moveTo(dir * hw * 0.2, yOff);
        wing.lineTo(dir * span, yOff - hh * 0.28 + flap);
        wing.lineTo(dir * (span * 0.82), yOff + hh * 0.22 + flap);
        wing.lineTo(dir * hw * 0.24, yOff + hh * 0.18);
        wing.closePath();

        const wGrad = ctx.createLinearGradient(0, yOff - 10, dir * span, yOff + 10);
        wGrad.addColorStop(0, '#475569');
        wGrad.addColorStop(0.55, tier % 2 === 0 ? primaryColor : secondaryColor);
        wGrad.addColorStop(1, '#fef08a');
        ctx.fillStyle = wGrad;
        ctx.fill(wing);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.3;
        ctx.stroke(wing);
      }
    });

    // Armored Archangel Fuselage & Crowned Helm
    const hull = new Path2D();
    hull.moveTo(0, -hh * 0.98);
    hull.lineTo(hw * 0.36, -hh * 0.28);
    hull.lineTo(hw * 0.28, hh * 0.65);
    hull.lineTo(0, hh * 0.94);
    hull.lineTo(-hw * 0.28, hh * 0.65);
    hull.lineTo(-hw * 0.36, -hh * 0.28);
    hull.closePath();
    ctx.fillStyle = this.fillArmoredGrad(ctx, hw * 0.4, hh, '#1a1608', primaryColor);
    ctx.fill(hull);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.4;
    ctx.stroke(hull);

    // Emerald / Gold Core Heart
    ctx.fillStyle = secondaryColor;
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, hh * 0.05, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(0, hh * 0.05, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /* ----------------------------------------------------
     08. THE REBASE PHANTOM (Swept Stealth Leviathan - Image 2 #8)
     ---------------------------------------------------- */
  private static renderRebasePhantom(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    _phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    _accentColor: string,
    _hullDark: string,
    _isRage: boolean
  ): void {
    // 3 RGB Chromatic Afterimages
    const echoes = [
      { offset: -7, color: 'rgba(0, 245, 255, 0.22)' },
      { offset: 7, color: 'rgba(244, 63, 94, 0.22)' },
      { offset: 0, color: 'rgba(168, 85, 247, 0.18)' },
    ];
    echoes.forEach(({ offset, color }, g) => {
      const gx = offset + Math.sin(time * 8 + g) * 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(gx, -hh * 0.96);
      ctx.lineTo(gx + hw * 1.05, -hh * 0.15);
      ctx.lineTo(gx + hw * 0.62, hh * 0.52);
      ctx.lineTo(gx, hh * 0.94);
      ctx.lineTo(gx - hw * 0.62, hh * 0.52);
      ctx.lineTo(gx - hw * 1.05, -hh * 0.15);
      ctx.closePath();
      ctx.fill();
    });

    // Multi-plate Obsidian/Crimson Gull-Wing Stealth Armor
    const mainHull = new Path2D();
    mainHull.moveTo(0, -hh * 0.96);
    mainHull.lineTo(hw * 0.34, -hh * 0.42);
    mainHull.lineTo(hw * 1.05, -hh * 0.15);
    mainHull.lineTo(hw * 0.82, hh * 0.36);
    mainHull.lineTo(hw * 0.42, hh * 0.22);
    mainHull.lineTo(0, hh * 0.94);
    mainHull.lineTo(-hw * 0.42, hh * 0.22);
    mainHull.lineTo(-hw * 0.82, hh * 0.36);
    mainHull.lineTo(-hw * 1.05, -hh * 0.15);
    mainHull.lineTo(-hw * 0.34, -hh * 0.42);
    mainHull.closePath();

    const hullGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    hullGrad.addColorStop(0, '#475569');
    hullGrad.addColorStop(0.5, '#09090d');
    hullGrad.addColorStop(1, '#3b0718');
    ctx.fillStyle = hullGrad;
    ctx.fill(mainHull);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.6;
    ctx.stroke(mainHull);

    // Glowing Crimson Wing Scythe Stripes & Central Diamond Eye
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1.6;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(s * hw * 0.24, -hh * 0.15);
      ctx.lineTo(s * hw * 0.85, hh * 0.18);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.28);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, hh * 0.28);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /* ----------------------------------------------------
     09. THE SECURITY SENTINEL (Colossal Cyber-Aegis Guardian - Image 2 #9)
     ---------------------------------------------------- */
  private static renderSecuritySentinel(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    _phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    _accentColor: string,
    hullDark: string,
    _isRage: boolean
  ): void {
    // 1. Two Massive Flanking Hexagonal Energy-Shield Gauntlets (Left & Right Arms)
    [-1, 1].forEach((dir) => {
      const gx = dir * hw * 0.86;
      const gy = hh * 0.08 + Math.sin(time * 3 + dir) * 3;
      const shR = hw * 0.42;

      const sGrad = ctx.createRadialGradient(gx, gy, 4, gx, gy, shR);
      sGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      sGrad.addColorStop(0.65, 'rgba(2, 132, 199, 0.28)');
      sGrad.addColorStop(1, 'rgba(14, 165, 233, 0.08)');
      ctx.fillStyle = sGrad;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 9;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        const hx = gx + Math.cos(ha) * shR;
        const hy = gy + Math.sin(ha) * (shR * 0.92);
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 2. Heavy Mecha-Guardian Torso & Pauldrons
    const torso = new Path2D();
    torso.moveTo(0, -hh * 0.92);
    torso.lineTo(hw * 0.36, -hh * 0.72);
    torso.lineTo(hw * 0.62, -hh * 0.28);
    torso.lineTo(hw * 0.48, hh * 0.78);
    torso.lineTo(0, hh * 0.96);
    torso.lineTo(-hw * 0.48, hh * 0.78);
    torso.lineTo(-hw * 0.62, -hh * 0.28);
    torso.lineTo(-hw * 0.36, -hh * 0.72);
    torso.closePath();

    ctx.fillStyle = this.fillArmoredGrad(ctx, hw * 0.65, hh, hullDark, primaryColor);
    ctx.fill(torso);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.8;
    ctx.stroke(torso);

    // 3. Horned Guardian Visor Head
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.18, -hh * 0.76);
    ctx.lineTo(-hw * 0.28, -hh * 1.06);
    ctx.lineTo(0, -hh * 0.88);
    ctx.lineTo(hw * 0.28, -hh * 1.06);
    ctx.lineTo(hw * 0.18, -hh * 0.76);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-hw * 0.14, -hh * 0.7, hw * 0.28, 4);

    // 4. Illuminated Chest Padlock Cipher Core
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2.4;
    ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
    ctx.fillRect(-13, -6, 26, 20);
    ctx.strokeRect(-13, -6, 26, 20);
    ctx.beginPath();
    ctx.arc(0, -6, 8, Math.PI, Math.PI * 2);
    ctx.stroke();
  }

  /* ----------------------------------------------------
     10. THE CODE ABYSS
     ---------------------------------------------------- */
  private static renderCodeAbyss(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    phase: number,
    time: number,
    primaryColor: string,
    secondaryColor: string,
    accentColor: string,
    hullDark: string,
    isRage: boolean
  ): void {
    // Swirling Gravitational Matter Accretion Disk (Dual Counter-Rotating)
    ctx.save();
    ctx.rotate(time * 1.5);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, hw * 1.08, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(-time * 2.5);
    ctx.strokeStyle = secondaryColor;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.85, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Floating Shattered Syntax Runes Orbiting into the Singularity
    const frags = ['404', '{}', 'null', 'NaN', 'SIGSEGV', 'VOID'];
    frags.forEach((txt, idx) => {
      const fAngle = time * 2.0 + (idx * Math.PI * 2) / frags.length;
      const fx = Math.cos(fAngle) * (hw * 0.95);
      const fy = Math.sin(fAngle) * (hh * 0.75);
      ctx.fillStyle = secondaryColor;
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(txt, fx, fy);
    });

    // Singularity Black Hole Void
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner Singularity Event Horizon Glow (Accent Cyan Jet)
    const singPulse = 0.85 + Math.sin(time * 8) * 0.25;
    const singGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 20 * singPulse);
    singGrad.addColorStop(0, '#ffffff');
    singGrad.addColorStop(0.5, secondaryColor);
    singGrad.addColorStop(1, '#000000');
    ctx.fillStyle = singGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 18 * singPulse, 0, Math.PI * 2);
    ctx.fill();

    // Polar Relativistic Plasma Jets
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -hw * 0.6);
    ctx.lineTo(0, -hh * 1.2);
    ctx.moveTo(0, hw * 0.6);
    ctx.lineTo(0, hh * 1.2);
    ctx.stroke();
  }

  /* ----------------------------------------------------
     ELECTRICAL ARCS (PHASE 3 RAGE)
     ---------------------------------------------------- */
  private static renderElectricalArcs(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    time: number
  ): void {
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 12;

    for (let arc = 0; arc < 4; arc++) {
      const startAngle = Math.random() * Math.PI * 2;
      const rStart = hw * 0.28;
      const rEnd = hw * 1.05;

      let cx = Math.cos(startAngle) * rStart;
      let cy = Math.sin(startAngle) * rStart;

      ctx.beginPath();
      ctx.moveTo(cx, cy);

      const segments = 5;
      for (let s = 1; s <= segments; s++) {
        const segDist = rStart + ((rEnd - rStart) * s) / segments;
        const jitter = (Math.random() - 0.5) * 16;
        cx = Math.cos(startAngle) * segDist + jitter;
        cy = Math.sin(startAngle) * segDist + jitter;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}
