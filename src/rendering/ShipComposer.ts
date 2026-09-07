/**
 * Layered Procedural Ship Composition System
 * Renders high-fidelity vector ships by layering hull plates, wings, cockpit,
 * engine vents, weapon hardpoints, glowing plasma cores, and damage fissures.
 * Zero external image assets.
 */

import { RepositoryDNA } from '../github/Types';

export interface ShipDNA {
  name: string;
  hullType: number; // 0: Delta, 1: Diamond/Cruiser, 2: Interceptor, 3: Heavy Bastion
  wingType: number; // 0: Swept, 1: Forward-swept, 2: Bi-wing, 3: Heavy Stabilizers
  engineType: number; // 1, 2, or 3 nozzles
  weaponType: number; // 0: Dual blasters, 1: Quad hardpoints, 2: Heavy wingtip cannons
  armor: number; // Plating index (1-6)
  speed: number; // Agility multiplier
  fireRate: number; // Attack cadence
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  aggression: number;
}

export interface HullGeometry {
  noseSweep: number; // 0.1 to 0.5 (sharpness of nose)
  waistIndent: number; // 0.1 to 0.4 (inward pinch)
  platingPanels: number; // Number of armor segments
  primaryColor: string;
  accentColor: string;
  armorTint: string;
}

export interface WingGeometry {
  span: number; // Wing width ratio
  sweepAngle: number; // Backward sweep
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
  nozzleCount: number; // 1, 2, or 3
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
  hull: HullGeometry;
  wings: WingGeometry;
  cockpit: CockpitGeometry;
  engines: EngineGeometry;
  weapons: WeaponGeometry;
}

export interface ShipRenderState {
  time: number;
  hpRatio: number; // 0.0 to 1.0
  hasShield: boolean;
  isOverdrive: boolean;
  isThrusting: boolean;
}

export class ShipComposer {
  /**
   * Main render method that composes all layers sequentially
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

    // 1. Engine exhaust & plasma flare (Behind ship)
    this.renderEngines(ctx, w2, h2, design.engines, state);

    // 2. Wing structure & stabilizers
    this.renderWings(ctx, w2, h2, design.wings, design.hull, state);

    // 3. Central armored hull & composite plating
    this.renderHull(ctx, w2, h2, design.hull, state);

    // 4. Weapon hardpoints & energy conduits
    this.renderWeapons(ctx, w2, h2, design.weapons, design.hull, state);

    // 5. Cockpit & pilot reactor core
    this.renderCockpit(ctx, w2, h2, design.cockpit, state);

    // 6. Navigation strobe lights
    this.renderNavLights(ctx, w2, h2, design.hull, t);

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

  private static renderEngines(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    engines: EngineGeometry,
    state: ShipRenderState
  ): void {
    const flicker = 0.8 + Math.sin(state.time * engines.flickerRate) * 0.2 + (Math.random() * 0.1 - 0.05);
    const thrustLen = state.isThrusting ? h2 * 0.95 : h2 * 0.55;
    const nozzleOffsets =
      engines.nozzleCount === 1 ? [0] : engines.nozzleCount === 3 ? [-w2 * 0.25, 0, w2 * 0.25] : [-w2 * 0.22, w2 * 0.22];

    nozzleOffsets.forEach((nx) => {
      // Glow plume
      const grad = ctx.createRadialGradient(nx, h2 * 0.6, 2, nx, h2 * 0.6 + thrustLen * flicker, w2 * 0.25);
      grad.addColorStop(0, state.isOverdrive ? '#ff007f' : '#ffffff');
      grad.addColorStop(0.3, state.isOverdrive ? '#ff0055' : engines.heatColor);
      grad.addColorStop(0.7, engines.trailColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(nx, h2 * 0.6 + (thrustLen * flicker) / 2, w2 * 0.16, thrustLen * flicker, 0, 0, Math.PI * 2);
      ctx.fill();

      // Mechanical nozzle bell
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.fillRect(nx - 4, h2 * 0.45, 8, 6);
      ctx.strokeRect(nx - 4, h2 * 0.45, 8, 6);
    });
  }

  private static renderWings(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    wings: WingGeometry,
    hull: HullGeometry,
    state: ShipRenderState
  ): void {
    const span = w2 * wings.span;
    const sweep = h2 * wings.sweepAngle;

    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = state.isOverdrive ? '#ff007f' : hull.accentColor;
    ctx.fillStyle = '#0a1324';

    // Left & Right Wings
    [-1, 1].forEach((dir) => {
      ctx.beginPath();
      ctx.moveTo(dir * (w2 * 0.18), -h2 * 0.1);
      ctx.lineTo(dir * span, sweep); // Wingtip
      ctx.lineTo(dir * (span * 0.88), sweep + h2 * 0.22); // Outer edge
      ctx.lineTo(dir * (w2 * 0.28), h2 * 0.4); // Trailing edge
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

      // Wingtip Blasters
      if (wings.wingtipCannons) {
        ctx.fillStyle = state.isOverdrive ? '#ff007f' : hull.primaryColor;
        ctx.fillRect(dir * span - 1.5, sweep - 6, 3, 10);
      }
    });
    ctx.restore();
  }

  private static renderHull(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    hull: HullGeometry,
    state: ShipRenderState
  ): void {
    ctx.save();
    ctx.fillStyle = '#050914';
    ctx.strokeStyle = state.isOverdrive ? '#ff007f' : hull.primaryColor;
    ctx.lineWidth = 2;

    // Outer Hull Contour
    ctx.beginPath();
    ctx.moveTo(0, -h2); // Nose
    ctx.lineTo(w2 * 0.35, -h2 * 0.3); // Upper shoulder
    ctx.lineTo(w2 * 0.28, h2 * 0.2); // Mid fuselage
    ctx.lineTo(w2 * 0.38, h2 * 0.48); // Engine bay bracket
    ctx.lineTo(-w2 * 0.38, h2 * 0.48);
    ctx.lineTo(-w2 * 0.28, h2 * 0.2);
    ctx.lineTo(-w2 * 0.35, -h2 * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Armor Panelling Ribs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w2 * 0.18, -h2 * 0.2);
    ctx.lineTo(w2 * 0.18, -h2 * 0.2);
    ctx.moveTo(-w2 * 0.22, h2 * 0.1);
    ctx.lineTo(w2 * 0.22, h2 * 0.1);
    ctx.stroke();

    // Central Dorsal Spine
    ctx.strokeStyle = state.isOverdrive ? '#ff007f' : hull.accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -h2 * 0.85);
    ctx.lineTo(0, h2 * 0.35);
    ctx.stroke();

    ctx.restore();
  }

  private static renderWeapons(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    weapons: WeaponGeometry,
    hull: HullGeometry,
    state: ShipRenderState
  ): void {
    ctx.save();
    weapons.hardpointPositions.forEach((hp) => {
      const wx = hp.x * w2;
      const wy = hp.y * h2;

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = state.isOverdrive ? '#ff007f' : weapons.muzzleColor;
      ctx.lineWidth = 1.2;

      ctx.fillRect(wx - 2, wy - weapons.barrelLength, 4, weapons.barrelLength);
      ctx.strokeRect(wx - 2, wy - weapons.barrelLength, 4, weapons.barrelLength);

      // Energy conduit dot
      ctx.fillStyle = state.isOverdrive ? '#ff007f' : weapons.muzzleColor;
      ctx.beginPath();
      ctx.arc(wx, wy - weapons.barrelLength, 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  private static renderCockpit(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    cockpit: CockpitGeometry,
    state: ShipRenderState
  ): void {
    const pulse = 0.8 + Math.sin(state.time * cockpit.corePulseSpeed) * 0.2;

    ctx.save();
    // Canopy Glass
    ctx.fillStyle = state.isOverdrive ? '#ff007f' : cockpit.visorColor;
    ctx.beginPath();
    ctx.moveTo(0, -h2 * 0.45);
    ctx.lineTo(w2 * 0.14, -h2 * 0.05);
    ctx.lineTo(0, h2 * 0.08);
    ctx.lineTo(-w2 * 0.14, -h2 * 0.05);
    ctx.closePath();
    ctx.fill();

    // Specular canopy glare
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6 * pulse;
    ctx.beginPath();
    ctx.moveTo(-w2 * 0.08, -h2 * 0.32);
    ctx.lineTo(w2 * 0.04, -h2 * 0.1);
    ctx.stroke();

    ctx.restore();
  }

  private static renderNavLights(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    hull: HullGeometry,
    time: number
  ): void {
    const blink = Math.sin(time * 8) > 0.3 ? 1.0 : 0.1;
    ctx.save();
    ctx.globalAlpha = blink;

    // Port light (Red)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-w2 * 0.85, h2 * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Starboard light (Green)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(w2 * 0.85, h2 * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private static renderDamageLayer(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    hpRatio: number,
    time: number
  ): void {
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;

    // Structural fissure lines
    ctx.beginPath();
    ctx.moveTo(-w2 * 0.15, -h2 * 0.1);
    ctx.lineTo(-w2 * 0.05, h2 * 0.15);
    ctx.lineTo(-w2 * 0.18, h2 * 0.3);
    ctx.stroke();

    if (hpRatio < 0.3) {
      // Critical damage secondary fissure
      ctx.beginPath();
      ctx.moveTo(w2 * 0.1, -h2 * 0.25);
      ctx.lineTo(w2 * 0.22, 0);
      ctx.stroke();

      // Micro-spark emission
      if (Math.sin(time * 30) > 0.4) {
        ctx.fillStyle = '#ffd600';
        ctx.beginPath();
        ctx.arc(-w2 * 0.05, h2 * 0.15, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private static renderShieldBubble(
    ctx: CanvasRenderingContext2D,
    w2: number,
    h2: number,
    time: number
  ): void {
    ctx.save();
    const radius = Math.max(w2, h2) * 1.18;
    const pulse = Math.sin(time * 6) * 0.08;

    // Hexagonal / Radial shield halo
    const grad = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius * (1 + pulse));
    grad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    grad.addColorStop(0.85, 'rgba(0, 229, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.8)');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, radius * (1 + pulse), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Generates a procedural ShipDesign from a seed string or skin ID
   */
  public static createPreset(skinId: string): ShipDesign {
    switch (skinId) {
      case 'phantom_violet':
        return {
          name: 'PHANTOM VIOLET',
          hull: {
            noseSweep: 0.35,
            waistIndent: 0.25,
            platingPanels: 4,
            primaryColor: '#c084fc',
            accentColor: '#a855f7',
            armorTint: '#581c87',
          },
          wings: {
            span: 1.15,
            sweepAngle: 0.65,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#f472b6',
          },
          cockpit: {
            visorColor: '#f43f5e',
            glowIntensity: 1.2,
            corePulseSpeed: 5,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#a855f7',
            trailColor: '#7c3aed',
            flickerRate: 14,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.6, y: 0.2 },
              { x: 0.6, y: 0.2 },
            ],
            barrelLength: 8,
            muzzleColor: '#c084fc',
          },
        };

      case 'solar_gold':
        return {
          name: 'SOLAR GOLD',
          hull: {
            noseSweep: 0.28,
            waistIndent: 0.2,
            platingPanels: 5,
            primaryColor: '#fbbf24',
            accentColor: '#f59e0b',
            armorTint: '#78350f',
          },
          wings: {
            span: 1.05,
            sweepAngle: 0.55,
            wingtipCannons: true,
            stabilizerFins: false,
            accentStripeColor: '#fef08a',
          },
          cockpit: {
            visorColor: '#38bdf8',
            glowIntensity: 1.1,
            corePulseSpeed: 4,
          },
          engines: {
            nozzleCount: 3,
            heatColor: '#fbbf24',
            trailColor: '#ea580c',
            flickerRate: 16,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.45, y: 0.15 },
              { x: 0.45, y: 0.15 },
            ],
            barrelLength: 10,
            muzzleColor: '#fbbf24',
          },
        };

      case 'emerald_glitch':
        return {
          name: 'EMERALD GLITCH',
          hull: {
            noseSweep: 0.42,
            waistIndent: 0.3,
            platingPanels: 6,
            primaryColor: '#10b981',
            accentColor: '#059669',
            armorTint: '#064e3b',
          },
          wings: {
            span: 1.22,
            sweepAngle: 0.72,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#34d399',
          },
          cockpit: {
            visorColor: '#10b981',
            glowIntensity: 1.3,
            corePulseSpeed: 6,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#34d399',
            trailColor: '#059669',
            flickerRate: 18,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.7, y: 0.25 },
              { x: 0.7, y: 0.25 },
            ],
            barrelLength: 7,
            muzzleColor: '#10b981',
          },
        };

      case 'neon_overdrive':
        return {
          name: 'NEON OVERDRIVE',
          hull: {
            noseSweep: 0.48,
            waistIndent: 0.35,
            platingPanels: 6,
            primaryColor: '#ff007f',
            accentColor: '#ff5500',
            armorTint: '#880033',
          },
          wings: {
            span: 1.3,
            sweepAngle: 0.78,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#ff00aa',
          },
          cockpit: {
            visorColor: '#ff007f',
            glowIntensity: 1.4,
            corePulseSpeed: 7,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#ff007f',
            trailColor: '#ff5500',
            flickerRate: 20,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.65, y: 0.2 },
              { x: 0.65, y: 0.2 },
              { x: -0.3, y: -0.1 },
              { x: 0.3, y: -0.1 },
            ],
            barrelLength: 9,
            muzzleColor: '#ff007f',
          },
        };

      case 'quantum_citadel':
        return {
          name: 'QUANTUM CITADEL',
          hull: {
            noseSweep: 0.22,
            waistIndent: 0.15,
            platingPanels: 8,
            primaryColor: '#6366f1',
            accentColor: '#22d3ee',
            armorTint: '#312e81',
          },
          wings: {
            span: 1.35,
            sweepAngle: 0.42,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#818cf8',
          },
          cockpit: {
            visorColor: '#22d3ee',
            glowIntensity: 1.25,
            corePulseSpeed: 3,
          },
          engines: {
            nozzleCount: 3,
            heatColor: '#818cf8',
            trailColor: '#3730a3',
            flickerRate: 15,
          },
          weapons: {
            hardpointPositions: [
              { x: -0.75, y: 0.25 },
              { x: 0.75, y: 0.25 },
              { x: -0.4, y: 0.1 },
              { x: 0.4, y: 0.1 },
            ],
            barrelLength: 12,
            muzzleColor: '#22d3ee',
          },
        };

      default:
        // Default: CYBER FALCON / COMPILER DELTA
        return {
          name: 'CYBER FALCON',
          hull: {
            noseSweep: 0.32,
            waistIndent: 0.22,
            platingPanels: 4,
            primaryColor: '#00e5ff',
            accentColor: '#0284c7',
            armorTint: '#0369a1',
          },
          wings: {
            span: 1.0,
            sweepAngle: 0.58,
            wingtipCannons: true,
            stabilizerFins: true,
            accentStripeColor: '#38bdf8',
          },
          cockpit: {
            visorColor: '#38bdf8',
            glowIntensity: 1.0,
            corePulseSpeed: 4,
          },
          engines: {
            nozzleCount: 2,
            heatColor: '#00e5ff',
            trailColor: '#0369a1',
            flickerRate: 12,
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
    }
  }

  /**
   * Translates a mathematical ShipDNA contract directly into vector ShipDesign geometry
   */
  public static createFromDNA(dna: ShipDNA): ShipDesign {
    const sweepAngles = [0.55, 0.68, 0.45, 0.75];
    const spanMultipliers = [0.95, 1.1, 1.25, 1.35];

    return {
      name: dna.name,
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
