/**
 * GIT_INVADERS.EXE // PROCEDURAL SHIP COMPOSITION ENGINE
 * High-fidelity vector industrial design system.
 *
 * Orchestrates 11 specialized physical subsystems:
 * - ShipDNA (Parametric genome from stats and repos)
 * - ShipGeometry (Multi-family physical hull & wing sculptors)
 * - ShipMaterials (Brushed metal shaders, beveled armor plates, optical glass)
 * - ShipSurfaceDetails (Panel seams, vertex rivets, cooling vents, technical conduits)
 * - ShipCockpit (Titanium frame, canopy glass, interior HUD breathing glow)
 * - ShipEngines (Multi-stage nozzle housing, vectoring vanes, dual-layer plasma plumes)
 * - ShipWeapons (Hardpoints, heavy barrels, capacitor glow, recoil kicks)
 * - ShipLighting (Aviation navigation strobes, reactor back-bleed glow)
 * - ShipShield (Fresnel deflector bubble with rotating flux containment)
 * - ShipDamage (DamageMap discrete zones, fractures, kinetic electrical sparks)
 * - ShipAnimation (Banking roll on lateral velocity, idle hangar hover)
 *
 * Zero external image assets. 100% Canvas 2D + Path2D.
 */

import { RepositoryDNA } from '../github/Types';
import { DamageMap } from './ships/DamageMap';
import { ShipVisualDNA, ShipDNAGenerator, HullFamily, WingFamily, EngineFamily, WeaponFamily, MaterialFamily } from './ships/ShipDNA';
import { ShipGeometry } from './ships/ShipGeometry';
import { ShipMaterials } from './ships/ShipMaterials';
import { ShipSurfaceDetails } from './ships/ShipSurfaceDetails';
import { ShipEngines, EngineThrustState } from './ships/ShipEngines';
import { ShipWeapons } from './ships/ShipWeapons';
import { ShipCockpit } from './ships/ShipCockpit';
import { ShipLighting } from './ships/ShipLighting';
import { ShipShield } from './ships/ShipShield';
import { ShipDamage } from './ships/ShipDamage';
import { ShipAnimation, AnimationState } from './ships/ShipAnimation';

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

export interface ShipRenderOptions {
  lod?: number;         // 0: Full Hangar/Inspect details, 1: Fast 60fps combat
  vx?: number;          // Lateral velocity for banking roll
  isFiring?: boolean;   // Weapon firing recoil & muzzle flash
  isHovering?: boolean; // Idle hover breathing in hangar
}

export interface ComponentDiagnostics {
  leftWing: 'ONLINE' | 'DAMAGED' | 'CRITICAL';
  rightWing: 'ONLINE' | 'DAMAGED' | 'CRITICAL';
  reactor: 'STABLE' | 'HEATING' | 'OVERLOAD';
  shield: 'NOMINAL' | 'DISTORTED' | 'OFFLINE';
  thrusters: 'OPTIMAL' | 'DEGRADED' | 'OFFLINE';
  summary: string;
}

export class ShipComposer {
  private static cachedDamageMap: DamageMap = new DamageMap();

  public static getDiagnostics(hpRatio: number, hasShield: boolean): ComponentDiagnostics {
    if (hpRatio > 0.8) {
      return {
        leftWing: 'ONLINE',
        rightWing: 'ONLINE',
        reactor: 'STABLE',
        shield: hasShield ? 'NOMINAL' : 'OFFLINE',
        thrusters: 'OPTIMAL',
        summary: 'ALL SYSTEMS NOMINAL',
      };
    }
    if (hpRatio > 0.5) {
      return {
        leftWing: 'ONLINE',
        rightWing: 'DAMAGED',
        reactor: 'STABLE',
        shield: hasShield ? 'NOMINAL' : 'DISTORTED',
        thrusters: 'OPTIMAL',
        summary: 'RIGHT WING MINOR DAMAGE',
      };
    }
    if (hpRatio > 0.25) {
      return {
        leftWing: 'DAMAGED',
        rightWing: 'DAMAGED',
        reactor: 'HEATING',
        shield: hasShield ? 'DISTORTED' : 'OFFLINE',
        thrusters: 'DEGRADED',
        summary: 'STRUCTURAL COMPROMISE // REPAIR REQ',
      };
    }
    return {
      leftWing: 'CRITICAL',
      rightWing: 'CRITICAL',
      reactor: 'OVERLOAD',
      shield: 'OFFLINE',
      thrusters: 'OFFLINE',
      summary: 'CRITICAL HULL INTEGRITY // EJECT',
    };
  }

  /**
   * Main render method. Supports both classic ShipDesign and modern ShipVisualDNA.
   */
  public static render(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    designOrDna: ShipDesign | ShipVisualDNA,
    state: ShipRenderState,
    options: ShipRenderOptions = {}
  ): void {
    // 1. Resolve to parametric ShipVisualDNA
    const dna: ShipVisualDNA = this.resolveVisualDNA(designOrDna);
    const lod = options.lod ?? 1;
    const time = state.time;
    const halfW = width / 2;
    const halfH = height / 2;

    ctx.save();

    // 2. Secondary Motion & Banking Roll Animation
    const isHovering = options.isHovering ?? (lod === 0);
    const recoilOffset = options.isFiring ? 2.5 : 0;
    const anim = ShipAnimation.calculate(
      options.vx ?? 0,
      time,
      isHovering,
      recoilOffset,
      recoilOffset
    );
    ShipAnimation.applyTransform(ctx, centerX, centerY, anim);

    // 3. Engine Propulsion Assembly (Back Layer)
    let thrustState: EngineThrustState = 'IDLE';
    if (state.hpRatio < 0.25) {
      thrustState = 'DAMAGE';
    } else if (state.isOverdrive) {
      thrustState = 'BOOST';
    } else if (state.isThrusting) {
      thrustState = 'ACCELERATE';
    }

    this.renderEngineAssembly(ctx, halfW, halfH, dna, thrustState, time, lod);

    // 4. Physical Hull & Wings (Middle Layer - Geometry, Materials, Bevels)
    ShipGeometry.renderShipHull(ctx, width, height, dna, time);

    // 5. Macro / Micro Surface Details (LOD 0)
    if (lod === 0) {
      this.renderShowcaseDecals(ctx, halfW, halfH, dna, time);
    }

    // 6. Weapon Hardpoints & Cannons
    this.renderWeaponAssembly(ctx, halfW, halfH, dna, options.isFiring ?? false);

    // 7. Pilot Canopy & Fusion Reactor Core
    ShipCockpit.renderCockpit(
      ctx,
      0,
      -halfH * 0.12,
      halfW * 0.34,
      halfH * 0.44,
      dna.accentColor,
      time
    );

    // 8. Navigation Strobe Beacons
    ShipLighting.renderNavLights(
      ctx,
      -halfW * 0.82,
      halfH * 0.58,
      halfW * 0.82,
      halfH * 0.58,
      time
    );

    // 9. Localized Physical Damage Layer (when HP degraded)
    if (state.hpRatio < 0.85) {
      this.cachedDamageMap.updateFromGlobalHealth(state.hpRatio);
      ShipDamage.renderDamageOverlay(
        ctx,
        this.cachedDamageMap,
        0,
        0,
        width,
        height,
        time
      );
    }

    // 10. Kinetic Fresnel Deflector Shield
    if (state.hasShield) {
      ShipShield.renderDeflector(
        ctx,
        0,
        0,
        halfW * 1.18,
        halfH * 1.15,
        time
      );
    }

    ctx.restore();
  }

  /**
   * Renders high-end inspect showcase for Hangar and Boss Codex
   */
  public static renderShowcase(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    skinId: string,
    time: number = Date.now() * 0.003
  ): void {
    ctx.save();

    // 1. Sci-Fi Tech Pedestal Grid
    const pedestalRadius = size * 0.52;
    ctx.save();
    ctx.translate(cx, cy + size * 0.22);
    ctx.scale(1, 0.32);

    // Outer ring
    ctx.beginPath();
    ctx.arc(0, 0, pedestalRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dotted calibration ring
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = -time * 12;
    ctx.beginPath();
    ctx.arc(0, 0, pedestalRadius * 0.82, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Radial spokes
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + time * 0.15;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * pedestalRadius, Math.sin(angle) * pedestalRadius);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Render Ship in LOD 0 (Maximum fidelity)
    const dna = ShipDNAGenerator.fromSkinId(skinId);
    this.render(
      ctx,
      cx,
      cy,
      size,
      size,
      dna,
      {
        time,
        hpRatio: 1.0,
        hasShield: false,
        isOverdrive: false,
        isThrusting: false,
      },
      {
        lod: 0,
        vx: 0,
        isHovering: true,
      }
    );

    ctx.restore();
  }

  /* ----------------------------------------------------
     INTERNAL SUBSYSTEM PLACEMENT & ORCHESTRATION
     ---------------------------------------------------- */

  private static renderEngineAssembly(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    state: EngineThrustState,
    time: number,
    lod: number
  ): void {
    const radius = dna.engineRadius;
    const glow = dna.engineGlowColor;

    // Optional reactor ambient glow on rear deck
    if (lod === 0) {
      ShipLighting.renderReactorAmbient(ctx, 0, hh * 0.5, hw * 0.7, glow);
    }

    switch (dna.engineFamily) {
      case 'singular_afterburner':
        ShipEngines.renderThruster(ctx, 0, hh * 0.78, radius * 1.5, state, glow, time);
        break;

      case 'heavy_thruster':
        // 3 wide heavy industrial thrusters
        ShipEngines.renderThruster(ctx, -hw * 0.38, hh * 0.75, radius, state, glow, time);
        ShipEngines.renderThruster(ctx, 0, hh * 0.8, radius * 1.2, state, glow, time);
        ShipEngines.renderThruster(ctx, hw * 0.38, hh * 0.75, radius, state, glow, time);
        break;

      case 'quad_plasma':
        // 4 quad-thruster block
        ShipEngines.renderThruster(ctx, -hw * 0.42, hh * 0.72, radius * 0.85, state, glow, time);
        ShipEngines.renderThruster(ctx, -hw * 0.16, hh * 0.76, radius * 0.85, state, glow, time);
        ShipEngines.renderThruster(ctx, hw * 0.16, hh * 0.76, radius * 0.85, state, glow, time);
        ShipEngines.renderThruster(ctx, hw * 0.42, hh * 0.72, radius * 0.85, state, glow, time);
        break;

      case 'warp_ring':
        if (dna.hullFamily === 'quantum_trimaran') {
          // Outrigger thrusters on the floating wings
          ShipEngines.renderThruster(ctx, -hw * 0.66, hh * 0.65, radius, state, glow, time);
          ShipEngines.renderThruster(ctx, hw * 0.66, hh * 0.65, radius, state, glow, time);
        } else {
          ShipEngines.renderThruster(ctx, -hw * 0.32, hh * 0.65, radius, state, glow, time);
          ShipEngines.renderThruster(ctx, hw * 0.32, hh * 0.65, radius, state, glow, time);
        }
        break;

      case 'twin_ion':
      default:
        // Twin precision ion thrusters
        ShipEngines.renderThruster(ctx, -hw * 0.28, hh * 0.72, radius, state, glow, time);
        ShipEngines.renderThruster(ctx, hw * 0.28, hh * 0.72, radius, state, glow, time);
        break;
    }
  }

  private static renderWeaponAssembly(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    isFiring: boolean
  ): void {
    const barrelLen = dna.weaponFamily === 'heavy_cannon' ? 14 : 9;
    const recoil = isFiring ? 3 : 0;

    switch (dna.weaponFamily) {
      case 'heavy_cannon':
        // Heavy hardpoints mounted on inner wing roots
        ShipWeapons.renderCannon(ctx, -hw * 0.45, hh * 0.15, barrelLen, recoil, dna.accentColor, isFiring);
        ShipWeapons.renderCannon(ctx, hw * 0.45, hh * 0.15, barrelLen, recoil, dna.accentColor, isFiring);
        break;

      case 'plasma_spread':
      case 'distributed_array':
        // Quad cannons: 2 wingtips, 2 fuselage
        ShipWeapons.renderCannon(ctx, -hw * 0.78, hh * 0.45, barrelLen * 0.8, recoil, dna.accentColor, isFiring);
        ShipWeapons.renderCannon(ctx, hw * 0.78, hh * 0.45, barrelLen * 0.8, recoil, dna.accentColor, isFiring);
        ShipWeapons.renderCannon(ctx, -hw * 0.32, hh * 0.05, barrelLen, recoil, dna.accentColor, isFiring);
        ShipWeapons.renderCannon(ctx, hw * 0.32, hh * 0.05, barrelLen, recoil, dna.accentColor, isFiring);
        break;

      case 'quantum_beam':
        if (dna.hullFamily === 'quantum_trimaran') {
          // Outrigger beam emitters
          ShipWeapons.renderCannon(ctx, -hw * 0.66, -hh * 0.4, barrelLen, recoil, dna.accentColor, isFiring);
          ShipWeapons.renderCannon(ctx, hw * 0.66, -hh * 0.4, barrelLen, recoil, dna.accentColor, isFiring);
        } else {
          ShipWeapons.renderCannon(ctx, -hw * 0.65, hh * 0.35, barrelLen, recoil, dna.accentColor, isFiring);
          ShipWeapons.renderCannon(ctx, hw * 0.65, hh * 0.35, barrelLen, recoil, dna.accentColor, isFiring);
        }
        break;

      case 'dual_laser':
      default:
        // Twin wingtip precision cannons
        ShipWeapons.renderCannon(ctx, -hw * 0.62, hh * 0.32, barrelLen, recoil, dna.accentColor, isFiring);
        ShipWeapons.renderCannon(ctx, hw * 0.62, hh * 0.32, barrelLen, recoil, dna.accentColor, isFiring);
        break;
    }
  }

  private static renderShowcaseDecals(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    ctx.save();

    // 1. Subtle Technical Typography Decal (Corner outer margin, never obstructing spine/canopy)
    ctx.font = 'bold 4.5px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.textAlign = 'left';
    ctx.fillText(`${dna.name.slice(0, 12)} // MK.VII`, -hw * 0.92, hh * 0.9);

    // 2. Hazard warning striping on starboard wing
    ctx.save();
    ctx.beginPath();
    ctx.rect(hw * 0.45, hh * 0.42, hw * 0.25, 3);
    ctx.clip();
    for (let i = -10; i < 30; i += 6) {
      ctx.beginPath();
      ctx.moveTo(hw * 0.45 + i, hh * 0.42);
      ctx.lineTo(hw * 0.45 + i + 4, hh * 0.42 + 3);
      ctx.strokeStyle = dna.accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();

    // 3. Reactor diagnostic status pip
    ctx.beginPath();
    ctx.arc(0, hh * 0.25, 2, 0, Math.PI * 2);
    ctx.fillStyle = Math.sin(time * 6) > 0 ? '#10b981' : '#059669';
    ctx.fill();

    ctx.restore();
  }

  /**
   * Resolves incoming input (ShipDesign or ShipVisualDNA) into a standardized ShipVisualDNA
   */
  private static resolveVisualDNA(designOrDna: ShipDesign | ShipVisualDNA): ShipVisualDNA {
    if ('hullFamily' in designOrDna) {
      return designOrDna as ShipVisualDNA;
    }

    const design = designOrDna as ShipDesign;
    const nameKey = (design.name || '').toLowerCase().replace(/[\s\/\-]+/g, '_');
    const fromId = ShipDNAGenerator.fromSkinId(nameKey, design.hull?.primaryColor, design.hull?.accentColor);
    if (fromId.id !== 'cyber_falcon' || nameKey.includes('cyber') || nameKey.includes('falcon') || nameKey.includes('compiler')) {
      return fromId;
    }

    // Archetype fallback mapping
    let hullFamily: HullFamily = 'delta_interceptor';
    let wingFamily: WingFamily = 'delta_wings';
    let engineFamily: EngineFamily = 'twin_ion';

    switch (design.archetype) {
      case 'arrow_interceptor':
        hullFamily = 'ramjet_dragster';
        wingFamily = 'flared_dragster';
        engineFamily = 'singular_afterburner';
        break;
      case 'stealth_needle':
        hullFamily = 'forward_swept';
        wingFamily = 'forward_switchblade';
        engineFamily = 'twin_ion';
        break;
      case 'trimaran_fork':
        hullFamily = 'quantum_trimaran';
        wingFamily = 'detached_magnetic';
        engineFamily = 'warp_ring';
        break;
      case 'hammerhead':
        hullFamily = 'hammerhead_ram';
        wingFamily = 'heavy_prow';
        engineFamily = 'heavy_thruster';
        break;
      case 'dreadnought_x':
        hullFamily = 'x_dreadnought';
        wingFamily = 'quad_x';
        engineFamily = 'quad_plasma';
        break;
      case 'octo_saucer':
        hullFamily = 'toroidal_ring';
        wingFamily = 'orbital_ring';
        engineFamily = 'quad_plasma';
        break;
      case 'quantum_boomerang':
        hullFamily = 'fractal_asymmetric';
        wingFamily = 'fractal_shards';
        engineFamily = 'warp_ring';
        break;
      case 'delta':
      default:
        hullFamily = 'delta_interceptor';
        wingFamily = 'delta_wings';
        engineFamily = 'twin_ion';
        break;
    }

    return {
      id: nameKey || 'proc_custom',
      name: design.name || 'CUSTOM CRAFT',
      hullFamily,
      wingFamily,
      engineFamily,
      weaponFamily: 'dual_laser',
      materialFamily: 'titanium_brushed',
      plateThickness: 2.0,
      bevelWidth: 1.4,
      wingSweep: 0.6,
      engineCount: design.engines?.nozzleCount ?? 2,
      engineRadius: 4.5,
      weaponCount: 2,
      rivetDensity: 3,
      hullBaseColor: '#081426',
      hullHighlightColor: design.hull?.accentColor || '#1e3a5f',
      hullShadowColor: '#02060f',
      plateFillColor: '#0c1a2e',
      accentColor: design.hull?.primaryColor || '#00e5ff',
      secondaryAccentColor: design.hull?.accentColor || '#38bdf8',
      tertiaryDecalColor: '#f59e0b',
      engineGlowColor: design.engines?.heatColor || '#00e5ff',
      cockpitGlassColor: 'rgba(0, 229, 255, 0.25)',
      cockpitRefractColor: '#ffffff',
    };
  }

  /* ----------------------------------------------------
     FACTORY & GENERATORS (BACKWARD COMPATIBILITY)
     ---------------------------------------------------- */

  public static createPreset(skinId: string): ShipDesign {
    const dna = ShipDNAGenerator.fromSkinId(skinId);
    let arch: ShipArchetype = 'delta';
    if (dna.hullFamily === 'needle') arch = 'stealth_needle';
    else if (dna.hullFamily === 'dreadnought') arch = 'dreadnought_x';
    else if (dna.hullFamily === 'ring') arch = 'octo_saucer';
    else if (dna.hullFamily === 'fractal') arch = 'quantum_boomerang';

    return {
      name: dna.name,
      archetype: arch,
      hull: {
        noseSweep: 0.28,
        waistIndent: 0.2,
        platingPanels: 6,
        primaryColor: dna.accentColor,
        accentColor: dna.hullHighlightColor,
        armorTint: dna.hullBaseColor,
      },
      wings: {
        span: 1.15,
        sweepAngle: 0.55,
        wingtipCannons: true,
        stabilizerFins: true,
        accentStripeColor: dna.accentColor,
      },
      cockpit: {
        visorColor: '#0c4a6e',
        glowIntensity: 1.0,
        corePulseSpeed: 4,
      },
      engines: {
        nozzleCount: dna.engineCount,
        heatColor: dna.engineGlowColor,
        trailColor: dna.accentColor,
        flickerRate: 14,
      },
      weapons: {
        hardpointPositions: [
          { x: -0.5, y: 0.18 },
          { x: 0.5, y: 0.18 },
        ],
        barrelLength: 8,
        muzzleColor: dna.accentColor,
      },
    };
  }

  public static createFromDNA(dna: ShipDNA): ShipDesign {
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
        noseSweep: 0.28,
        waistIndent: 0.2,
        platingPanels: 6,
        primaryColor: dna.primaryColor,
        accentColor: dna.secondaryColor,
        armorTint: dna.accentColor,
      },
      wings: {
        span: 1.15,
        sweepAngle: 0.55,
        wingtipCannons: dna.weaponType >= 1,
        stabilizerFins: true,
        accentStripeColor: dna.secondaryColor,
      },
      cockpit: {
        visorColor: dna.secondaryColor,
        glowIntensity: 1.0,
        corePulseSpeed: 4,
      },
      engines: {
        nozzleCount: Math.min(3, Math.max(1, dna.engineType)),
        heatColor: dna.primaryColor,
        trailColor: dna.accentColor,
        flickerRate: 14,
      },
      weapons: {
        hardpointPositions: [
          { x: -0.5, y: 0.18 },
          { x: 0.5, y: 0.18 },
        ],
        barrelLength: 8,
        muzzleColor: dna.primaryColor,
      },
    };
  }

  public static generateShipDNAFromRepo(dna: RepositoryDNA): ShipDNA {
    const hullType = (dna.commits + dna.pullRequests) % 4;
    const wingType = (dna.issues + dna.contributors) % 4;
    const engineType = Math.min(3, Math.max(1, (dna.contributors % 3) + 1));
    const weaponType = dna.threatLevel > 60 ? 1 : 0;
    const armor = Math.min(6, Math.max(2, Math.floor(dna.pullRequests / 5) + 2));
    const speed = Math.min(100, Math.max(40, Math.round(50 + (dna.commits / 200) * 20)));
    const fireRate = Math.min(100, Math.max(50, Math.round(60 + (dna.threatLevel / 100) * 35)));

    return {
      name: `${dna.name.toUpperCase()} INTERCEPTOR`,
      hullType,
      wingType,
      engineType,
      weaponType,
      armor,
      speed,
      fireRate,
      primaryColor: dna.accentColor || '#00e5ff',
      secondaryColor: dna.languages[0]?.color || '#38bdf8',
      accentColor: dna.languages[1]?.color || '#0369a1',
      aggression: dna.threatLevel,
    };
  }

  public static generateFromRepoDNA(dna: RepositoryDNA): ShipDesign {
    const shipDna = this.generateShipDNAFromRepo(dna);
    return this.createFromDNA(shipDna);
  }
}
