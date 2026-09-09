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
  public static render(
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

    const palette = ARCHETYPE_PALETTES[chassisType] || ARCHETYPE_PALETTES.commit_core;
    const isRage = phase >= 3;
    const primaryColor = isRage ? '#ff0055' : (coreColor !== '#00e5ff' ? coreColor : palette.primary);
    const secondaryColor = isRage ? '#ff7700' : palette.secondary;
    const accentColor = isRage ? '#ffffff' : palette.accent;
    const hullDark = palette.hullDark;

    const hw = width / 2;
    const hh = height / 2;

    // Phase 3 Rage Overdrive: Thermal screen vibration jitter
    if (isRage) {
      const jitterX = (Math.random() - 0.5) * 2.8;
      const jitterY = (Math.random() - 0.5) * 2.8;
      ctx.translate(jitterX, jitterY);
    }

    // 1. Universal Rotating Deflector Matrix (Phase 2+)
    if (phase >= 2) {
      ctx.save();
      const rotSpeed = isRage ? 3.8 : 2.0;
      ctx.rotate(time * rotSpeed);
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = isRage ? 3.5 : 2.5;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.64, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating deflection nodes with energy halos
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const nx = Math.cos(a) * width * 0.64;
        const ny = Math.sin(a) * width * 0.64;

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

    // 2. Chassis-Specific Anatomical Assemblies
    switch (chassisType) {
      case 'the_fortress':
        this.renderTheFortress(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'issue_swarm':
        this.renderIssueSwarm(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'dependency_hydra':
        this.renderDependencyHydra(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'merge_conflict':
      case 'merge_behemoth':
        this.renderMergeConflict(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'contributor_overlord':
      case 'octo_destroyer':
        this.renderContributorOverlord(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'branchlord':
      case 'quantum_citadel':
        this.renderBranchlord(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'rebase_phantom':
      case 'rebase_titan':
        this.renderRebasePhantom(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'security_sentinel':
      case 'dreadnought_carrier':
        this.renderSecuritySentinel(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'code_abyss':
      case 'titan_skull':
        this.renderCodeAbyss(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
      case 'commit_core':
      default:
        this.renderCommitCore(ctx, hw, hh, phase, time, primaryColor, secondaryColor, accentColor, hullDark, isRage);
        break;
    }

    // 3. Phase 3 Rage: High-Voltage Electrical Discharge Arcs
    if (isRage) {
      this.renderElectricalArcs(ctx, hw, hh, time);
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
    const coreY = hh * 0.32;

    for (let h = 0; h < headCount; h++) {
      const spreadRatio = (h - (headCount - 1) / 2) / ((headCount - 1) / 2);
      const baseAngle = -Math.PI / 2 + spreadRatio * 0.95;
      const slither = Math.sin(time * 3 + h * 1.3) * 11;
      const hDist = hw * 2 * (0.38 + Math.abs(spreadRatio) * 0.08);
      const hx = Math.cos(baseAngle) * hDist + slither * 0.6;
      const hy = Math.sin(baseAngle) * (hh * 0.9) + Math.cos(time * 2.2 + h) * 6 - 8;
      headCoords.push({ x: hx, y: hy, angle: baseAngle, idx: h });

      const segments = 7;
      for (let s = 1; s <= segments; s++) {
        const tSeg = s / segments;
        const segX = coreX + (hx - coreX) * tSeg + Math.sin(time * 3 + h * 1.5 + s * 0.7) * (6 * Math.sin(tSeg * Math.PI));
        const segY = coreY + (hy - coreY) * tSeg - (1 - tSeg) * 8;
        const segSize = 5 + (1 - tSeg) * 4;

        if (s > 1) {
          const prevTSeg = (s - 1) / segments;
          const prevX = coreX + (hx - coreX) * prevTSeg + Math.sin(time * 3 + h * 1.5 + (s - 1) * 0.7) * (6 * Math.sin(prevTSeg * Math.PI));
          const prevY = coreY + (hy - coreY) * prevTSeg - (1 - prevTSeg) * 8;

          ctx.strokeStyle = h % 2 === 0 ? primaryColor : secondaryColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(segX, segY);
          ctx.stroke();
        }

        ctx.fillStyle = hullDark;
        ctx.strokeStyle = h % 2 === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(segX, segY, segSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Central Hydra Root Carapace
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(coreX, coreY + hh * 0.65);
    ctx.lineTo(coreX + hw * 0.45, coreY + hh * 0.2);
    ctx.lineTo(coreX + hw * 0.34, coreY - hh * 0.4);
    ctx.lineTo(coreX - hw * 0.34, coreY - hh * 0.4);
    ctx.lineTo(coreX - hw * 0.45, coreY + hh * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const corePulse = 0.85 + Math.sin(time * 5) * 0.2;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 19 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Render 5 Dragon Heads with Razor Fangs & Plasma Glow
    headCoords.forEach(({ x: hx, y: hy, angle, idx }) => {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(angle + Math.PI / 2 + Math.sin(time * 2 + idx) * 0.15);

      const headScale = idx === 2 ? 1.2 : 0.98;
      ctx.scale(headScale, headScale);

      // Skull Armor
      ctx.fillStyle = hullDark;
      ctx.strokeStyle = idx % 2 === 0 ? primaryColor : secondaryColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -17);
      ctx.lineTo(10, -9);
      ctx.lineTo(12, 7);
      ctx.lineTo(0, 11);
      ctx.lineTo(-12, 7);
      ctx.lineTo(-10, -9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dragon Eyes (Glowing Accent Amber)
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(-5, -4, 2, 0, Math.PI * 2);
      ctx.arc(5, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Plasma Breath Node
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -13, 3, 0, Math.PI * 2);
      ctx.fill();

      // Razor Fangs
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-5, -7);
      ctx.lineTo(-3, -13);
      ctx.lineTo(-1, -7);
      ctx.moveTo(1, -7);
      ctx.lineTo(3, -13);
      ctx.lineTo(5, -7);
      ctx.fill();

      ctx.restore();
    });
  }

  /* ----------------------------------------------------
     05. THE MERGE CONFLICT
     ---------------------------------------------------- */
  private static renderMergeConflict(
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
    const splitOffset = Math.sin(time * 4) * 5;

    // LEFT HALF: HEAD (Cyan)
    ctx.save();
    ctx.translate(-splitOffset, 0);
    ctx.fillStyle = '#041b24';
    ctx.strokeStyle = primaryColor; // Cyan
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-4, -hh * 0.88);
    ctx.lineTo(-hw * 0.7, -hh * 0.4);
    ctx.lineTo(-hw * 0.98, hh * 0.3);
    ctx.lineTo(-hw * 0.5, hh * 0.85);
    ctx.lineTo(-4, hh * 0.65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('<<<< HEAD', -14, 0);
    ctx.restore();

    // RIGHT HALF: BRANCH (Magenta/Crimson)
    ctx.save();
    ctx.translate(splitOffset, 0);
    ctx.fillStyle = '#260611';
    ctx.strokeStyle = secondaryColor; // Crimson
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(4, -hh * 0.88);
    ctx.lineTo(hw * 0.7, -hh * 0.4);
    ctx.lineTo(hw * 0.98, hh * 0.3);
    ctx.lineTo(hw * 0.5, hh * 0.85);
    ctx.lineTo(4, hh * 0.65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = secondaryColor;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('branch >>>>', 14, 0);
    ctx.restore();

    // Central Electric Lightning Rift: ======= (Accent Gold)
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.85);
    const steps = 8;
    for (let s = 1; s <= steps; s++) {
      const sy = -hh * 0.85 + (hh * 1.65 * s) / steps;
      const sx = (Math.random() - 0.5) * 8;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Conflict Label in center
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('=======', 0, -hh * 0.4);
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
     07. THE BRANCHLORD
     ---------------------------------------------------- */
  private static renderBranchlord(
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
    // Multi-tier Fractal Angel Wings
    const branchLayers = 3;
    for (let l = 1; l <= branchLayers; l++) {
      const lWave = Math.sin(time * 3 + l) * 5;
      const lSpan = hw * 2 * (0.28 + l * 0.09);
      const lDepth = hh * 2 * (0.12 + l * 0.1);
      ctx.strokeStyle = l % 2 === 0 ? primaryColor : secondaryColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-lSpan, lDepth + lWave);
      ctx.lineTo(0, -hh * 0.72);
      ctx.lineTo(lSpan, lDepth + lWave);
      ctx.stroke();

      // Branch Lineage Emitter Nodes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-lSpan - 3, lDepth + lWave - 3, 6, 6);
      ctx.fillRect(lSpan - 3, lDepth + lWave - 3, 6, 6);
    }

    // Diamond Command Pod
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.9);
    ctx.lineTo(hw * 0.46, 0);
    ctx.lineTo(0, hh * 0.9);
    ctx.lineTo(-hw * 0.46, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Core
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ----------------------------------------------------
     08. THE REBASE PHANTOM
     ---------------------------------------------------- */
  private static renderRebasePhantom(
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
    // 3 RGB Chromatic Afterimages (Echo Shadows)
    const echoes = [
      { offset: -6, color: 'rgba(0, 245, 255, 0.25)' }, // Cyan
      { offset: 6, color: 'rgba(244, 63, 94, 0.25)' },  // Crimson
      { offset: 0, color: 'rgba(168, 85, 247, 0.2)' },  // Violet
    ];

    echoes.forEach(({ offset, color }, g) => {
      ctx.save();
      const gOffset = offset + Math.sin(time * 8 + g) * 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0 + gOffset, hh * 0.9);
      ctx.lineTo(hw * 0.9 + gOffset, -hh * 0.25);
      ctx.lineTo(hw * 0.36 + gOffset, -hh * 0.65);
      ctx.lineTo(0 + gOffset, -hh * 0.98);
      ctx.lineTo(-hw * 0.36 + gOffset, -hh * 0.65);
      ctx.lineTo(-hw * 0.9 + gOffset, -hh * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Razor-Sharp Obsidian Hull
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(0, hh * 0.92);
    ctx.lineTo(hw * 0.9, -hh * 0.25);
    ctx.lineTo(hw * 0.36, -hh * 0.65);
    ctx.lineTo(0, -hh * 0.98);
    ctx.lineTo(-hw * 0.36, -hh * 0.65);
    ctx.lineTo(-hw * 0.9, -hh * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Laser Sight Line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.85);
    ctx.lineTo(0, hh * 0.78);
    ctx.stroke();

    // Crosshair Sight reticle
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(-hw * 0.08, -hh * 0.18, hw * 0.16, 5);
  }

  /* ----------------------------------------------------
     09. THE SECURITY SENTINEL
     ---------------------------------------------------- */
  private static renderSecuritySentinel(
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
    // 4 Orbiting Hexagonal Firewalls with Laser Fences
    for (let s = 0; s < 4; s++) {
      const sAngle = time * 1.8 + (s * Math.PI * 2) / 4;
      const sx = Math.cos(sAngle) * (hw * 1.08);
      const sy = Math.sin(sAngle) * (hh * 0.82);
      ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        const hx = sx + Math.cos(ha) * 12;
        const hy = sy + Math.sin(ha) * 12;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Heavy Cyber-Aegis Hull
    ctx.fillStyle = hullDark;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, hh * 0.9);
    ctx.lineTo(hw * 0.78, hh * 0.38);
    ctx.lineTo(hw * 0.86, -hh * 0.62);
    ctx.lineTo(0, -hh * 0.86);
    ctx.lineTo(-hw * 0.86, -hh * 0.62);
    ctx.lineTo(-hw * 0.78, hh * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hazard Chevrons (Secondary Gold)
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(dir * hw * 0.3, hh * 0.2);
      ctx.lineTo(dir * hw * 0.5, hh * 0.45);
      ctx.stroke();
    });

    // Animated Rotating Padlock Cipher Emblem
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2.4;
    ctx.strokeRect(-12, -8, 24, 20);
    ctx.beginPath();
    ctx.arc(0, -8, 8, Math.PI, Math.PI * 2);
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
