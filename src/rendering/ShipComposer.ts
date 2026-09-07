/**
 * Layered Procedural Ship Composition System
 * Renders high-fidelity vector ships by layering hull plates, wings, cockpit,
 * engine vents, weapon hardpoints, glowing plasma cores, and damage fissures.
 * Each ship archetype possesses a radically distinct silhouette and geometry.
 * Zero external image assets.
 */

import { RepositoryDNA } from '../github/Types';

export type ShipArchetype =
  | 'delta'
  | 'stealth_needle'
  | 'hammerhead'
  | 'trimaran_fork'
  | 'arrow_interceptor'
  | 'quantum_boomerang'
  | 'octo_saucer'
  | 'dreadnought_x';

export interface ShipDNA {
  name: string;
  hullType: number;
  wingType: number;
  engineType: number;
  weaponType: number;
  armor: number;
  speed: number;
  fireRate: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  aggression: number;
}

export interface HullGeometry {
  noseSweep: number;
  waistIndent: number;
  platingPanels: number;
  primaryColor: string;
  accentColor: string;
  armorTint: string;
}

export interface WingGeometry {
  span: number;
  sweepAngle: number;
  wingtipCannons: boolean;
  stabilizerFins: boolean;
  accentStripeColor: string;
}

export interface CockpitGeometry {
  visorColor: string;
  glowIntensity: number;
  corePulseSpeed: number;
}

export interface EngineGeometry {
  nozzleCount: number;
  heatColor: string;
  trailColor: string;
  flickerRate: number;
}

export interface WeaponGeometry {
  hardpointPositions: { x: number; y: number }[];
  barrelLength: number;
  muzzleColor: string;
}

export interface ShipDesign {
  name: string;
  archetype: ShipArchetype;
  hull: HullGeometry;
  wings: WingGeometry;
  cockpit: CockpitGeometry;
  engines: EngineGeometry;
  weapons: WeaponGeometry;
}

export interface ShipRenderState {
  time: number;
  hpRatio: number;
  hasShield: boolean;
  isOverdrive: boolean;
  isThrusting: boolean;
}

export class ShipComposer {
  /**
   * Main render method that delegates to archetype-specific geometry builders
   */
  public static render(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    design: ShipDesign,
    state: ShipRenderState
  ): void {
    ctx.save();
    ctx.translate(centerX, centerY);

    const w2 = width / 2;
    const h2 = height / 2;
    const t = state.time;

    // 1. Engine exhaust & plasma flare
    this.renderEngines(ctx, w2, h2, design, state);

    // 2. Archetype-specific wings & outriggers
    this.renderWings(ctx, w2, h2, design, state);

    // 3. Archetype-specific central hull & composite plating
    this.renderHull(ctx, w2, h2, design, state);

    // 4. Weapon hardpoints & energy conduits
    this.renderWeapons(ctx, w2, h2, design, state);

    // 5. Cockpit & pilot reactor core
    this.renderCockpit(ctx, w2, h2, design, state);

    // 6. Navigation strobe lights
    this.renderNavLights(ctx, w2, h2, design, t);

    // 7. Damage layer (fissures, sparks & structural smoke when hp < 0.6)
    if (state.hpRatio < 0.6) {
      this.renderDamageLayer(ctx, w2, h2, state.hpRatio, t);
    }

    // 8. Kinetic Shield Bubble
    if (state.hasShield) {
      this.renderShieldBubble(ctx, w2, h2, t);
    }

    ctx.restore();
  }

  /* ----------------------------------------------------
     1. ENGINE PLUMES & THRUSTERS
     ---------------------------------------------------- */
  private static renderEngines(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    design: ShipDesign,
    state: ShipRenderState
  ): void {
    const engines = design.engines;
    const archetype = design.archetype;
    ctx.save();

    const flicker = 0.8 + Math.sin(state.time * engines.flickerRate) * 0.2 + (Math.random() * 0.1 - 0.05);
    const thrustLen = state.isThrusting ? h2 * 1.1 : h2 * 0.6;

    let nozzleOffsets: number[] = [];
    let plumeWidth = w2 * 0.12;

    switch (archetype) {
      case 'arrow_interceptor':
        // Massive single central afterburner rocket
        nozzleOffsets = [0];
        plumeWidth = w2 * 0.32;
        break;

      case 'hammerhead':
        // 3 wide heavy industrial thrusters
        nozzleOffsets = [-w2 * 0.36, 0, w2 * 0.36];
        plumeWidth = w2 * 0.18;
        break;

      case 'trimaran_fork':
        // 3 engines: 1 center, 2 on outriggers
        nozzleOffsets = [-w2 * 0.65, 0, w2 * 0.65];
        plumeWidth = w2 * 0.14;
        break;

      case 'dreadnought_x':
        // 4 quad-thruster block
        nozzleOffsets = [-w2 * 0.38, -w2 * 0.14, w2 * 0.14, w2 * 0.38];
        plumeWidth = w2 * 0.1;
        break;

      case 'octo_saucer':
        // 4 radial exhaust fan
        nozzleOffsets = [-w2 * 0.3, -w2 * 0.1, w2 * 0.1, w2 * 0.3];
        plumeWidth = w2 * 0.12;
        break;

      case 'stealth_needle':
        // Twin narrow ion slits
        nozzleOffsets = [-w2 * 0.12, w2 * 0.12];
        plumeWidth = w2 * 0.07;
        break;

      case 'quantum_boomerang':
        // Asymmetric twin nozzles
        nozzleOffsets = [-w2 * 0.3, w2 * 0.18];
        plumeWidth = w2 * 0.13;
        break;

      case 'delta':
      default:
        nozzleOffsets = [-w2 * 0.22, w2 * 0.22];
        plumeWidth = w2 * 0.13;
        break;
    }

    nozzleOffsets.forEach((nx) => {
      const grad = ctx.createRadialGradient(nx, h2 * 0.55, 2, nx, h2 * 0.55 + thrustLen * flicker, plumeWidth * 2.2);
      grad.addColorStop(0, state.isOverdrive ? '#ff007f' : '#ffffff');
      grad.addColorStop(0.3, state.isOverdrive ? '#ff0055' : engines.heatColor);
      grad.addColorStop(0.7, engines.trailColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(nx, h2 * 0.55 + thrustLen * flicker * 0.5, plumeWidth, thrustLen * flicker * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // White-hot core needle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(nx, h2 * 0.5 + thrustLen * 0.22, plumeWidth * 0.3, thrustLen * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /* ----------------------------------------------------
     2. WINGS & AERODYNAMIC STRUCTURES (ARCHETYPE-SPECIFIC)
     ---------------------------------------------------- */
  private static renderWings(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    design: ShipDesign,
    state: ShipRenderState
  ): void {
    const { wings, hull, archetype } = design;
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = state.isOverdrive ? '#ff007f' : hull.accentColor;
    ctx.fillStyle = '#0a1324';

    switch (archetype) {
      /* ARCHETYPE 1: STEALTH NEEDLE (Phantom Violet) - FORWARD SWEPT KNIFE WINGS */
      case 'stealth_needle': {
        const span = w2 * 1.35;
        [-1, 1].forEach((dir) => {
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.12), h2 * 0.25); // Wing root starts back
          ctx.lineTo(dir * span, -h2 * 0.1); // Sweeps aggressively FORWARD!
          ctx.lineTo(dir * (span * 0.88), -h2 * 0.22); // Forward needle winglet
          ctx.lineTo(dir * (w2 * 0.15), -h2 * 0.05); // Leading edge meets fuselage
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Violet razor stripe
          ctx.strokeStyle = '#e9d5ff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.2), 0);
          ctx.lineTo(dir * (span * 0.95), -h2 * 0.12);
          ctx.stroke();
        });
        break;
      }

      /* ARCHETYPE 2: HAMMERHEAD (Merge Hammer) - HEAVY SIDE ARMOR SPONSONS */
      case 'hammerhead': {
        [-1, 1].forEach((dir) => {
          // Heavy armored lateral sponsons / weapon pods
          ctx.fillStyle = '#1e1b18';
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.45), -h2 * 0.6);
          ctx.lineTo(dir * (w2 * 0.95), -h2 * 0.4);
          ctx.lineTo(dir * (w2 * 0.95), h2 * 0.35);
          ctx.lineTo(dir * (w2 * 0.5), h2 * 0.45);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Sponson armor plates
          ctx.fillStyle = hull.primaryColor;
          ctx.fillRect(dir * (w2 * 0.65) - (dir > 0 ? 0 : w2 * 0.25), -h2 * 0.2, w2 * 0.25, h2 * 0.4);

          // Kinetic coil stripes
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.5), -h2 * 0.1);
          ctx.lineTo(dir * (w2 * 0.9), -h2 * 0.1);
          ctx.moveTo(dir * (w2 * 0.5), h2 * 0.15);
          ctx.lineTo(dir * (w2 * 0.9), h2 * 0.15);
          ctx.stroke();
        });
        break;
      }

      /* ARCHETYPE 3: TRIMARAN FORK (Branch Runner) - OUTRIGGER HULLS & CONNECTING PYLONS */
      case 'trimaran_fork': {
        [-1, 1].forEach((dir) => {
          // Reinforced structural bridge struts
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(dir > 0 ? w2 * 0.15 : -w2 * 0.7, -h2 * 0.1, w2 * 0.55, h2 * 0.18);
          ctx.strokeRect(dir > 0 ? w2 * 0.15 : -w2 * 0.7, -h2 * 0.1, w2 * 0.55, h2 * 0.18);

          // Left & Right Distinct Outrigger Pod Hulls
          const ox = dir * (w2 * 0.68);
          ctx.fillStyle = '#052e16';
          ctx.beginPath();
          ctx.moveTo(ox, -h2 * 0.75); // Sharp outrigger nose
          ctx.lineTo(ox + dir * (w2 * 0.16), -h2 * 0.3);
          ctx.lineTo(ox + dir * (w2 * 0.16), h2 * 0.42);
          ctx.lineTo(ox - dir * (w2 * 0.12), h2 * 0.42);
          ctx.lineTo(ox - dir * (w2 * 0.12), -h2 * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Outrigger vertical winglets
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(ox + dir * (w2 * 0.16), -h2 * 0.1);
          ctx.lineTo(ox + dir * (w2 * 0.28), -h2 * 0.25);
          ctx.lineTo(ox + dir * (w2 * 0.28), h2 * 0.2);
          ctx.lineTo(ox + dir * (w2 * 0.16), h2 * 0.35);
          ctx.stroke();
        });
        break;
      }

      /* ARCHETYPE 4: ARROW INTERCEPTOR (Rebase-01) - HIGH-SWEEP DELTA WITH CANARDS */
      case 'arrow_interceptor': {
        const span = w2 * 1.15;
        [-1, 1].forEach((dir) => {
          // Forward Canard fins (near nose!)
          ctx.fillStyle = '#880022';
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.12), -h2 * 0.6);
          ctx.lineTo(dir * (w2 * 0.45), -h2 * 0.45);
          ctx.lineTo(dir * (w2 * 0.15), -h2 * 0.35);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Main Swept Knife Wings
          ctx.fillStyle = '#18040a';
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.2), -h2 * 0.1);
          ctx.lineTo(dir * span, h2 * 0.35);
          ctx.lineTo(dir * (span * 0.8), h2 * 0.48);
          ctx.lineTo(dir * (w2 * 0.25), h2 * 0.42);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Red neon racing stripe
          ctx.strokeStyle = '#ff0055';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.25), 0);
          ctx.lineTo(dir * (span * 0.85), h2 * 0.36);
          ctx.stroke();
        });
        break;
      }

      /* ARCHETYPE 5: QUANTUM BOOMERANG (Quantum Wing) - ASYMMETRIC SCYTHE WITH FLOATING NODES */
      case 'quantum_boomerang': {
        // Left Wing: Long curving forward scythe
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-w2 * 0.18, -h2 * 0.1);
        ctx.quadraticCurveTo(-w2 * 0.8, -h2 * 0.3, -w2 * 1.35, -h2 * 0.05); // Sweeps forward
        ctx.lineTo(-w2 * 1.15, h2 * 0.2);
        ctx.lineTo(-w2 * 0.25, h2 * 0.38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Wing: Shorter stabilizer with hollow quantum resonance ring
        ctx.beginPath();
        ctx.moveTo(w2 * 0.18, -h2 * 0.05);
        ctx.lineTo(w2 * 0.85, h2 * 0.15);
        ctx.lineTo(w2 * 0.7, h2 * 0.42);
        ctx.lineTo(w2 * 0.22, h2 * 0.38);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Hollow Quantum Ring
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w2 * 0.55, h2 * 0.22, w2 * 0.16, 0, Math.PI * 2);
        ctx.stroke();

        // Floating Quantum Crystals at Wingtips with electric arc
        const arcFlicker = Math.sin(state.time * 20);
        [-1, 1].forEach((dir) => {
          const fx = dir < 0 ? -w2 * 1.45 : w2 * 0.98;
          const fy = dir < 0 ? -h2 * 0.08 : h2 * 0.15;

          // Glowing detached crystal diamond
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.moveTo(fx, fy - 6);
          ctx.lineTo(fx + 4, fy);
          ctx.lineTo(fx, fy + 6);
          ctx.lineTo(fx - 4, fy);
          ctx.closePath();
          ctx.fill();

          // Electric suspension arc
          if (arcFlicker > 0) {
            ctx.strokeStyle = '#a5f3fc';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dir < 0 ? -w2 * 1.3 : w2 * 0.85, fy);
            ctx.lineTo(fx + (Math.random() * 4 - 2), fy + (Math.random() * 4 - 2));
            ctx.stroke();
          }
        });
        break;
      }

      /* ARCHETYPE 6: OCTO SAUCER (Octo-Core) - 8 ARTICULATED CYBER PINCERS */
      case 'octo_saucer': {
        const angles = [
          -Math.PI * 0.75, -Math.PI * 0.5, -Math.PI * 0.25, 0,
          Math.PI * 0.25, Math.PI * 0.5, Math.PI * 0.75, Math.PI
        ];

        angles.forEach((ang) => {
          const r1 = w2 * 0.38;
          const r2 = w2 * 0.85;
          const r3 = w2 * 1.05;

          const x1 = Math.cos(ang) * r1;
          const y1 = Math.sin(ang) * (r1 * 0.8);
          const x2 = Math.cos(ang) * r2;
          const y2 = Math.sin(ang) * (r2 * 0.8);
          const x3 = Math.cos(ang + 0.1) * r3;
          const y3 = Math.sin(ang + 0.1) * (r3 * 0.8);

          // Pincer segment
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.stroke();

          // Joint LED nodes
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }

      /* ARCHETYPE 7: DREADNOUGHT X (Codebreaker // X) - 4-WINGED X-WING BLADES */
      case 'dreadnought_x': {
        [-1, 1].forEach((dir) => {
          // Upper X-Wing Blade (Sweeps forward & outward)
          ctx.fillStyle = '#1e1035';
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.25), -h2 * 0.2);
          ctx.lineTo(dir * (w2 * 1.1), -h2 * 0.65); // Upper wingtip
          ctx.lineTo(dir * (w2 * 0.95), -h2 * 0.45);
          ctx.lineTo(dir * (w2 * 0.3), -h2 * 0.05);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Lower X-Wing Blade (Sweeps backward & outward)
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.28), h2 * 0.05);
          ctx.lineTo(dir * (w2 * 1.2), h2 * 0.55); // Lower wingtip
          ctx.lineTo(dir * (w2 * 1.05), h2 * 0.68);
          ctx.lineTo(dir * (w2 * 0.32), h2 * 0.4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Heavy dreadnought armor pylon
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(dir * (w2 * 0.4) - (dir > 0 ? 0 : w2 * 0.1), -h2 * 0.15, w2 * 0.1, h2 * 0.45);
        });
        break;
      }

      /* ARCHETYPE 8: DELTA (Compiler Delta) - CLASSIC SLEEK CLIPPED DELTA WING */
      case 'delta':
      default: {
        const span = w2 * wings.span;
        const sweep = h2 * wings.sweepAngle;

        [-1, 1].forEach((dir) => {
          ctx.beginPath();
          ctx.moveTo(dir * (w2 * 0.18), -h2 * 0.1);
          ctx.lineTo(dir * span, sweep);
          ctx.lineTo(dir * (span * 0.88), sweep + h2 * 0.22);
          ctx.lineTo(dir * (w2 * 0.28), h2 * 0.4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Wing Telemetry Stripe
          ctx.strokeStyle = wings.accentStripeColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(dir * (span * 0.5), sweep * 0.5);
          ctx.lineTo(dir * (span * 0.85), sweep * 0.88);
          ctx.stroke();
        });
        break;
      }
    }

    ctx.restore();
  }

  /* ----------------------------------------------------
     3. CENTRAL HULL & COMPOSITE PLATING (ARCHETYPE-SPECIFIC)
     ---------------------------------------------------- */
  private static renderHull(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    design: ShipDesign,
    state: ShipRenderState
  ): void {
    const { hull, archetype } = design;
    ctx.save();
    ctx.fillStyle = '#050914';
    ctx.strokeStyle = state.isOverdrive ? '#ff007f' : hull.primaryColor;
    ctx.lineWidth = 2;

    switch (archetype) {
      /* ARCHETYPE 1: STEALTH NEEDLE - ULTRA SLENDER FACETED FUSELAGE */
      case 'stealth_needle': {
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 1.15); // Razor-sharp needle nose
        ctx.lineTo(w2 * 0.12, -h2 * 0.4);
        ctx.lineTo(w2 * 0.15, h2 * 0.1);
        ctx.lineTo(w2 * 0.18, h2 * 0.48);
        ctx.lineTo(-w2 * 0.18, h2 * 0.48);
        ctx.lineTo(-w2 * 0.15, h2 * 0.1);
        ctx.lineTo(-w2 * 0.12, -h2 * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Longitudinal spine
        ctx.strokeStyle = hull.accentColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 1.05);
        ctx.lineTo(0, h2 * 0.42);
        ctx.stroke();
        break;
      }

      /* ARCHETYPE 2: HAMMERHEAD - MASSIVE BROAD SIEGE BATTERING RAM */
      case 'hammerhead': {
        ctx.beginPath();
        // Front is NOT pointed: broad armored horizontal prow!
        ctx.moveTo(-w2 * 0.65, -h2 * 0.7);
        ctx.lineTo(w2 * 0.65, -h2 * 0.7); // Wide prow
        ctx.lineTo(w2 * 0.55, -h2 * 0.3);
        ctx.lineTo(w2 * 0.48, h2 * 0.48);
        ctx.lineTo(-w2 * 0.48, h2 * 0.48);
        ctx.lineTo(-w2 * 0.55, -h2 * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Frontal Battering Ram Teeth
        ctx.fillStyle = hull.primaryColor;
        for (let i = -2; i <= 2; i++) {
          ctx.fillRect(i * (w2 * 0.22) - 4, -h2 * 0.8, 8, h2 * 0.12);
        }

        // Heavy armor cross-plates
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-w2 * 0.45, -h2 * 0.1);
        ctx.lineTo(w2 * 0.45, -h2 * 0.1);
        ctx.moveTo(-w2 * 0.4, h2 * 0.2);
        ctx.lineTo(w2 * 0.4, h2 * 0.2);
        ctx.stroke();
        break;
      }

      /* ARCHETYPE 3: TRIMARAN FORK - SLENDER CENTER POD */
      case 'trimaran_fork': {
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 0.88);
        ctx.lineTo(w2 * 0.16, -h2 * 0.3);
        ctx.lineTo(w2 * 0.18, h2 * 0.42);
        ctx.lineTo(-w2 * 0.18, h2 * 0.42);
        ctx.lineTo(-w2 * 0.16, -h2 * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Center spine
        ctx.strokeStyle = hull.accentColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 0.75);
        ctx.lineTo(0, h2 * 0.3);
        ctx.stroke();
        break;
      }

      /* ARCHETYPE 4: ARROW INTERCEPTOR - DART WITH MASSIVE EXHAUST FLANGE */
      case 'arrow_interceptor': {
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 1.1); // Needle tip
        ctx.lineTo(w2 * 0.1, -h2 * 0.5);
        ctx.lineTo(w2 * 0.15, 0);
        ctx.lineTo(w2 * 0.32, h2 * 0.48); // Flairs out into engine bell
        ctx.lineTo(-w2 * 0.32, h2 * 0.48);
        ctx.lineTo(-w2 * 0.15, 0);
        ctx.lineTo(-w2 * 0.1, -h2 * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pitot tube needle probe
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 1.1);
        ctx.lineTo(0, -h2 * 1.3);
        ctx.stroke();
        break;
      }

      /* ARCHETYPE 5: QUANTUM BOOMERANG - ASYMMETRIC WARPING HULL */
      case 'quantum_boomerang': {
        ctx.beginPath();
        ctx.moveTo(-w2 * 0.08, -h2 * 0.95);
        ctx.lineTo(w2 * 0.22, -h2 * 0.2);
        ctx.lineTo(w2 * 0.25, h2 * 0.42);
        ctx.lineTo(-w2 * 0.28, h2 * 0.42);
        ctx.lineTo(-w2 * 0.25, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Asymmetric energy fracture
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-w2 * 0.05, -h2 * 0.8);
        ctx.lineTo(-w2 * 0.15, -h2 * 0.2);
        ctx.lineTo(w2 * 0.05, h2 * 0.2);
        ctx.stroke();
        break;
      }

      /* ARCHETYPE 6: OCTO SAUCER - CIRCULAR ARMORED DISC CORE */
      case 'octo_saucer': {
        // Main circular citadel disc
        ctx.beginPath();
        ctx.arc(0, 0, w2 * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner concentric armor ring
        ctx.strokeStyle = hull.accentColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, w2 * 0.28, 0, Math.PI * 2);
        ctx.stroke();

        // Radial armor spokes
        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * (w2 * 0.28), Math.sin(ang) * (w2 * 0.28));
          ctx.lineTo(Math.cos(ang) * (w2 * 0.42), Math.sin(ang) * (w2 * 0.42));
          ctx.stroke();
        }
        break;
      }

      /* ARCHETYPE 7: DREADNOUGHT X - HEAVY BRACKETED BASTION HULL */
      case 'dreadnought_x': {
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 0.95);
        ctx.lineTo(w2 * 0.22, -h2 * 0.5);
        ctx.lineTo(w2 * 0.32, -h2 * 0.1);
        ctx.lineTo(w2 * 0.28, h2 * 0.2);
        ctx.lineTo(w2 * 0.38, h2 * 0.5);
        ctx.lineTo(-w2 * 0.38, h2 * 0.5);
        ctx.lineTo(-w2 * 0.28, h2 * 0.2);
        ctx.lineTo(-w2 * 0.32, -h2 * 0.1);
        ctx.lineTo(-w2 * 0.22, -h2 * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dual heavy armored shoulder plates
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(-w2 * 0.25, -h2 * 0.3, w2 * 0.5, h2 * 0.4);
        ctx.strokeRect(-w2 * 0.25, -h2 * 0.3, w2 * 0.5, h2 * 0.4);
        break;
      }

      /* ARCHETYPE 8: DELTA - CLASSIC RAZOR DELTA WEDGE */
      case 'delta':
      default: {
        ctx.beginPath();
        ctx.moveTo(0, -h2);
        ctx.lineTo(w2 * 0.28, -h2 * 0.2);
        ctx.lineTo(w2 * 0.22, h2 * 0.2);
        ctx.lineTo(w2 * 0.32, h2 * 0.48);
        ctx.lineTo(-w2 * 0.32, h2 * 0.48);
        ctx.lineTo(-w2 * 0.22, h2 * 0.2);
        ctx.lineTo(-w2 * 0.28, -h2 * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Central Dorsal Spine
        ctx.strokeStyle = state.isOverdrive ? '#ff007f' : hull.accentColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 0.85);
        ctx.lineTo(0, h2 * 0.35);
        ctx.stroke();
        break;
      }
    }

    ctx.restore();
  }

  /* ----------------------------------------------------
     4. WEAPON HARDPOINTS & CANNONS
     ---------------------------------------------------- */
  private static renderWeapons(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    design: ShipDesign,
    state: ShipRenderState
  ): void {
    const { weapons, archetype } = design;
    ctx.save();

    let hardpoints = weapons.hardpointPositions;
    let bLen = weapons.barrelLength;

    if (archetype === 'hammerhead') {
      // 4 heavy siege barrels protruding past the prow
      hardpoints = [
        { x: -0.6, y: -0.6 },
        { x: 0.6, y: -0.6 },
        { x: -0.3, y: -0.7 },
        { x: 0.3, y: -0.7 },
      ];
      bLen = 14;
    } else if (archetype === 'dreadnought_x') {
      // 6 cannons on all wingtips + shoulders
      hardpoints = [
        { x: -1.05, y: -0.6 },
        { x: 1.05, y: -0.6 },
        { x: -1.15, y: 0.5 },
        { x: 1.15, y: 0.5 },
        { x: -0.22, y: -0.4 },
        { x: 0.22, y: -0.4 },
      ];
      bLen = 12;
    }

    hardpoints.forEach((hp) => {
      const wx = hp.x * w2;
      const wy = hp.y * h2;

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = state.isOverdrive ? '#ff007f' : weapons.muzzleColor;
      ctx.lineWidth = 1.2;

      ctx.fillRect(wx - 2, wy - bLen, 4, bLen);
      ctx.strokeRect(wx - 2, wy - bLen, 4, bLen);

      // Energy conduit dot
      ctx.fillStyle = state.isOverdrive ? '#ff007f' : weapons.muzzleColor;
      ctx.beginPath();
      ctx.arc(wx, wy - bLen, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /* ----------------------------------------------------
     5. COCKPIT & PILOT REACTOR
     ---------------------------------------------------- */
  private static renderCockpit(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    design: ShipDesign,
    state: ShipRenderState
  ): void {
    const { cockpit, archetype } = design;
    const pulse = 0.8 + Math.sin(state.time * cockpit.corePulseSpeed) * 0.2;
    ctx.save();
    ctx.fillStyle = state.isOverdrive ? '#ff007f' : cockpit.visorColor;

    switch (archetype) {
      case 'octo_saucer': {
        // Spherical Octocat eye core in center
        ctx.beginPath();
        ctx.arc(0, 0, w2 * 0.16, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing reticle ring
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, w2 * 0.1 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 'hammerhead': {
        // Heavily armored horizontal visor slit
        ctx.fillRect(-w2 * 0.22, -h2 * 0.15, w2 * 0.44, h2 * 0.08);
        ctx.strokeStyle = '#ffd600';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-w2 * 0.22, -h2 * 0.15, w2 * 0.44, h2 * 0.08);
        break;
      }

      case 'stealth_needle': {
        // Ultra-narrow diamond slit
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 0.55);
        ctx.lineTo(w2 * 0.06, -h2 * 0.15);
        ctx.lineTo(0, 0);
        ctx.lineTo(-w2 * 0.06, -h2 * 0.15);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'arrow_interceptor': {
        // Long streamlined teardrop bubble
        ctx.beginPath();
        ctx.ellipse(0, -h2 * 0.2, w2 * 0.08, h2 * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'delta':
      default: {
        // Classic diamond canopy
        ctx.beginPath();
        ctx.moveTo(0, -h2 * 0.45);
        ctx.lineTo(w2 * 0.14, -h2 * 0.05);
        ctx.lineTo(0, h2 * 0.08);
        ctx.lineTo(-w2 * 0.14, -h2 * 0.05);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  /* ----------------------------------------------------
     6. NAVIGATION STROBES
     ---------------------------------------------------- */
  private static renderNavLights(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    design: ShipDesign,
    time: number
  ): void {
    const blink = Math.sin(time * 8) > 0.3 ? 1.0 : 0.1;
    ctx.save();
    ctx.globalAlpha = blink;

    const lx = w2 * (design.wings.span * 0.9);
    const ly = h2 * 0.2;

    // Port light (Red)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-lx, ly, 2, 0, Math.PI * 2);
    ctx.fill();

    // Starboard light (Green)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(lx, ly, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ----------------------------------------------------
     7. DAMAGE LAYER
     ---------------------------------------------------- */
  private static renderDamageLayer(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    hpRatio: number,
    time: number
  ): void {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;

    // Structural fissure 1
    ctx.beginPath();
    ctx.moveTo(-w2 * 0.15, -h2 * 0.1);
    ctx.lineTo(-w2 * 0.05, 0);
    ctx.lineTo(-w2 * 0.2, h2 * 0.2);
    ctx.stroke();

    // Electric sparks when critical (HP < 0.3)
    if (hpRatio < 0.3 && Math.sin(time * 30) > 0.5) {
      ctx.fillStyle = '#ffd600';
      ctx.beginPath();
      ctx.arc(-w2 * 0.05 + Math.random() * 6 - 3, Math.random() * 6 - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* ----------------------------------------------------
     8. SHIELD BUBBLE
     ---------------------------------------------------- */
  private static renderShieldBubble(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    time: number
  ): void {
    ctx.save();
    const shieldRadius = Math.max(w2, h2) * 1.25;
    const pulse = 0.85 + Math.sin(time * 4) * 0.15;

    // Fresnel glow bubble
    const grad = ctx.createRadialGradient(0, 0, shieldRadius * 0.5, 0, 0, shieldRadius);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    grad.addColorStop(0.75, 'rgba(0, 229, 255, 0.08)');
    grad.addColorStop(1, `rgba(0, 229, 255, ${0.4 * pulse})`);

    ctx.fillStyle = grad;
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.7 * pulse})`;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /* ----------------------------------------------------
     PRESETS FACTORY - 8 RADICALLY DISTINCT DESIGNS
     ---------------------------------------------------- */
  public static createPreset(skinId: string): ShipDesign {
    switch (skinId) {
      case 'compiler_delta':
      case 'cyan':
        return {
          name: 'COMPILER DELTA',
          archetype: 'delta',
          hull: {
            noseSweep: 0.28,
            waistIndent: 0.2,
            platingPanels: 6,
            primaryColor: '#00e5ff',
            accentColor: '#38bdf8',
            armorTint: '#0369a1',
          },
          wings: {
            span: 1.15,
            sweepAngle: 0.55,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#7dd3fc',
          },
          cockpit: {
            visorColor: '#0c4a6e',
            glowIntensity: 1.0,
            corePulseSpeed: 4,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#00e5ff',
            trailColor: '#0284c7',
            flickerRate: 14,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.5, y: 0.18 },
              { x: 0.5, y: 0.18 },
            ],
            barrelLength: 8,
            muzzleColor: '#00e5ff',
          },
        };

      case 'phantom_violet':
      case 'purple':
        return {
          name: 'PHANTOM VIOLET',
          archetype: 'stealth_needle',
          hull: {
            noseSweep: 0.46,
            waistIndent: 0.12,
            platingPanels: 3,
            primaryColor: '#c084fc',
            accentColor: '#a855f7',
            armorTint: '#3b0764',
          },
          wings: {
            span: 1.35,
            sweepAngle: -0.35, // Forward-swept switchblade!
            wingtipCannons: false,
            stabilizerFins: true,
            accentStripeColor: '#e9d5ff',
          },
          cockpit: {
            visorColor: '#1e1b4b',
            glowIntensity: 0.7,
            corePulseSpeed: 2,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#a855f7',
            trailColor: '#581c87',
            flickerRate: 8,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.3, y: 0.05 },
              { x: 0.3, y: 0.05 },
            ],
            barrelLength: 6,
            muzzleColor: '#c084fc',
          },
        };

      case 'merge_hammer':
      case 'solar_gold':
        return {
          name: 'MERGE HAMMER',
          archetype: 'hammerhead',
          hull: {
            noseSweep: 0.1,
            waistIndent: 0.05,
            platingPanels: 8,
            primaryColor: '#fbbf24',
            accentColor: '#f59e0b',
            armorTint: '#78350f',
          },
          wings: {
            span: 0.85,
            sweepAngle: 0.2,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#fde047',
          },
          cockpit: {
            visorColor: '#451a03',
            glowIntensity: 1.2,
            corePulseSpeed: 3,
          },
          engines: {
            nozzleCount: 3,
            heatColor: '#f59e0b',
            trailColor: '#b45309',
            flickerRate: 16,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.6, y: -0.6 },
              { x: 0.6, y: -0.6 },
              { x: -0.3, y: -0.7 },
              { x: 0.3, y: -0.7 },
            ],
            barrelLength: 14,
            muzzleColor: '#f59e0b',
          },
        };

      case 'branch_runner':
      case 'emerald_glitch':
        return {
          name: 'BRANCH RUNNER',
          archetype: 'trimaran_fork',
          hull: {
            noseSweep: 0.35,
            waistIndent: 0.25,
            platingPanels: 5,
            primaryColor: '#10b981',
            accentColor: '#34d399',
            armorTint: '#064e3b',
          },
          wings: {
            span: 1.25,
            sweepAngle: 0.45,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#6ee7b7',
          },
          cockpit: {
            visorColor: '#022c22',
            glowIntensity: 1.1,
            corePulseSpeed: 5,
          },
          engines: {
            nozzleCount: 3,
            heatColor: '#10b981',
            trailColor: '#047857',
            flickerRate: 15,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.68, y: -0.2 },
              { x: 0.68, y: -0.2 },
            ],
            barrelLength: 10,
            muzzleColor: '#34d399',
          },
        };

      case 'rebase_01':
      case 'neon_overdrive':
        return {
          name: 'REBASE-01',
          archetype: 'arrow_interceptor',
          hull: {
            noseSweep: 0.55,
            waistIndent: 0.35,
            platingPanels: 4,
            primaryColor: '#ff0055',
            accentColor: '#ff3366',
            armorTint: '#880022',
          },
          wings: {
            span: 1.15,
            sweepAngle: 0.78,
            wingtipCannons: false,
            stabilizerFins: true,
            accentStripeColor: '#00e5ff',
          },
          cockpit: {
            visorColor: '#00e5ff',
            glowIntensity: 1.4,
            corePulseSpeed: 8,
          },
          engines: {
            nozzleCount: 1, // Monster center afterburner
            heatColor: '#ff0055',
            trailColor: '#00e5ff',
            flickerRate: 22,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.24, y: -0.1 },
              { x: 0.24, y: -0.1 },
            ],
            barrelLength: 12,
            muzzleColor: '#ff0055',
          },
        };

      case 'quantum_wing':
        return {
          name: 'QUANTUM WING',
          archetype: 'quantum_boomerang',
          hull: {
            noseSweep: 0.4,
            waistIndent: 0.22,
            platingPanels: 6,
            primaryColor: '#22d3ee',
            accentColor: '#6366f1',
            armorTint: '#1e1b4b',
          },
          wings: {
            span: 1.4,
            sweepAngle: 0.5,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#818cf8',
          },
          cockpit: {
            visorColor: '#4f46e5',
            glowIntensity: 1.5,
            corePulseSpeed: 6,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#22d3ee',
            trailColor: '#4f46e5',
            flickerRate: 18,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.85, y: 0.1 },
              { x: 0.65, y: 0.2 },
            ],
            barrelLength: 10,
            muzzleColor: '#22d3ee',
          },
        };

      case 'octo_core':
        return {
          name: 'OCTO-CORE',
          archetype: 'octo_saucer',
          hull: {
            noseSweep: 0.2,
            waistIndent: 0.1,
            platingPanels: 8,
            primaryColor: '#38bdf8',
            accentColor: '#0284c7',
            armorTint: '#0c4a6e',
          },
          wings: {
            span: 1.25,
            sweepAngle: 0.4,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#7dd3fc',
          },
          cockpit: {
            visorColor: '#0369a1',
            glowIntensity: 1.3,
            corePulseSpeed: 4,
          },
          engines: {
            nozzleCount: 4,
            heatColor: '#38bdf8',
            trailColor: '#075985',
            flickerRate: 14,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.5, y: -0.2 },
              { x: 0.5, y: -0.2 },
              { x: -0.3, y: 0.2 },
              { x: 0.3, y: 0.2 },
            ],
            barrelLength: 8,
            muzzleColor: '#38bdf8',
          },
        };

      case 'codebreaker_x':
      case 'quantum_citadel':
        return {
          name: 'CODEBREAKER // X',
          archetype: 'dreadnought_x',
          hull: {
            noseSweep: 0.4,
            waistIndent: 0.25,
            platingPanels: 8,
            primaryColor: '#a855f7',
            accentColor: '#c084fc',
            armorTint: '#2e1065',
          },
          wings: {
            span: 1.45,
            sweepAngle: 0.7,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#e879f9',
          },
          cockpit: {
            visorColor: '#180828',
            glowIntensity: 1.4,
            corePulseSpeed: 5,
          },
          engines: {
            nozzleCount: 4,
            heatColor: '#a855f7',
            trailColor: '#c084fc',
            flickerRate: 20,
          },
          weapons: {
            hardpointPositions: [
              { x: -1.05, y: -0.6 },
              { x: 1.05, y: -0.6 },
              { x: -1.15, y: 0.5 },
              { x: 1.15, y: 0.5 },
              { x: -0.22, y: -0.4 },
              { x: 0.22, y: -0.4 },
            ],
            barrelLength: 13,
            muzzleColor: '#e879f9',
          },
        };

      default:
        return ShipComposer.createPreset('compiler_delta');
    }
  }

  /**
   * Translates a mathematical ShipDNA contract directly into vector ShipDesign geometry
   */
  public static createFromDNA(dna: ShipDNA): ShipDesign {
    const sweepAngles = [0.55, 0.68, 0.45, 0.75];
    const spanMultipliers = [0.95, 1.1, 1.25, 1.35];

    const archetypes: ShipArchetype[] = [
      'delta',
      'stealth_needle',
      'hammerhead',
      'trimaran_fork',
      'arrow_interceptor',
      'quantum_boomerang',
      'octo_saucer',
      'dreadnought_x',
    ];

    const archetype = archetypes[(dna.hullType + dna.wingType) % archetypes.length];

    return {
      name: dna.name,
      archetype,
      hull: {
        noseSweep: 0.25 + (dna.hullType % 4) * 0.06,
        waistIndent: 0.18 + (dna.hullType % 3) * 0.05,
        platingPanels: Math.min(8, Math.max(3, dna.armor)),
        primaryColor: dna.primaryColor,
        accentColor: dna.secondaryColor,
        armorTint: dna.accentColor,
      },
      wings: {
        span: spanMultipliers[dna.wingType % spanMultipliers.length],
        sweepAngle: sweepAngles[dna.wingType % sweepAngles.length],
        wingtipCannons: dna.weaponType >= 1,
        stabilizerFins: dna.hullType % 2 === 0,
        accentStripeColor: dna.secondaryColor,
      },
      cockpit: {
        visorColor: dna.secondaryColor,
        glowIntensity: 1.0 + (dna.aggression / 100) * 0.5,
        corePulseSpeed: 3 + Math.floor((dna.fireRate / 100) * 5),
      },
      engines: {
        nozzleCount: Math.min(3, Math.max(1, dna.engineType)),
        heatColor: dna.primaryColor,
        trailColor: dna.accentColor,
        flickerRate: 12 + Math.floor((dna.speed / 100) * 8),
      },
      weapons: {
        hardpointPositions:
          dna.weaponType === 1
            ? [
                { x: -0.65, y: 0.2 },
                { x: 0.65, y: 0.2 },
                { x: -0.3, y: 0.05 },
                { x: 0.3, y: 0.05 },
              ]
            : [
                { x: -0.5, y: 0.18 },
                { x: 0.5, y: 0.18 },
              ],
        barrelLength: 6 + Math.min(6, dna.weaponType * 3),
        muzzleColor: dna.primaryColor,
      },
    };
  }

  /**
   * Generates mathematical ShipDNA from repository telemetry
   */
  public static generateShipDNAFromRepo(dna: RepositoryDNA): ShipDNA {
    const hullType = (dna.commits + dna.pullRequests) % 4;
    const wingType = (dna.issues + dna.contributors) % 4;
    const engineType = Math.min(3, Math.max(1, (dna.contributors % 3) + 1));
    const weaponType = dna.threatLevel > 60 ? 1 : 0;
    const armor = Math.min(6, Math.max(2, Math.floor(dna.pullRequests / 5) + 2));
    const speed = Math.min(100, Math.max(40, Math.round(50 + (dna.commits / 200) * 20)));
    const fireRate = Math.min(100, Math.max(50, Math.round(60 + (dna.threatLevel / 100) * 35)));

    const primaryColor = dna.accentColor || '#00e5ff';
    const secondaryColor = dna.languages[0]?.color || '#38bdf8';
    const accentColor = dna.languages[1]?.color || '#0369a1';

    return {
      name: `${dna.name.toUpperCase()} INTERCEPTOR`,
      hullType,
      wingType,
      engineType,
      weaponType,
      armor,
      speed,
      fireRate,
      primaryColor,
      secondaryColor,
      accentColor,
      aggression: dna.threatLevel,
    };
  }

  /**
   * Seamless end-to-end pipeline: Repository DNA -> Ship DNA -> ShipDesign
   */
  public static generateFromRepoDNA(dna: RepositoryDNA): ShipDesign {
    const shipDna = this.generateShipDNAFromRepo(dna);
    return this.createFromDNA(shipDna);
  }
}
