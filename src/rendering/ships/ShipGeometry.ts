/**
 * GIT_INVADERS.EXE // SHIP GEOMETRY ENGINE
 * Sculptor of industrial physical anatomy across 8 RADICALLY DISTINCT families:
 *
 * 1. Delta Interceptor (Cyber Falcon): Arrowhead delta with forward canards & wingtip pods
 * 2. Ramjet Dragster (Neon Overdrive): Needle nose, flared air scoops, 45° fins, massive turbine bay
 * 3. Forward Swept (Phantom Violet): Switchblade with wings sweeping forward, faceted stealth canopy
 * 4. Quantum Trimaran (Quantum Wing): 3 disconnected hulls, levitating magnetic outriggers, empty gap
 * 5. Hammerhead Ram (Solar Gold): Massive T-shaped blunt battering ram prow, heavy 8-bolt matrix
 * 6. X-Dreadnought (Codebreaker // X): Aggressive 4-wing "X" cross-frame with stepped bridge tower
 * 7. Fractal Asymmetric (Emerald Glitch): Completely asymmetrical shard wings, floating glitch data core
 * 8. Toroidal Ring (Quantum Citadel): 360° circular composite ring with rotating orbital pods & void
 *
 * All rendered via Canvas 2D + Path2D with multi-layer depth & optical shading.
 */

import { ShipVisualDNA } from './ShipDNA';
import { ShipMaterials } from './ShipMaterials';
import { ShipSurfaceDetails } from './ShipSurfaceDetails';

export class ShipGeometry {
  public static renderShipHull(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    ctx.save();
    const hw = w / 2;
    const hh = h / 2;

    switch (dna.hullFamily) {
      case 'ramjet_dragster':
        this.renderRamjetDragster(ctx, hw, hh, dna, time);
        break;

      case 'forward_swept':
      case 'needle':
        this.renderForwardSwept(ctx, hw, hh, dna, time);
        break;

      case 'quantum_trimaran':
        this.renderQuantumTrimaran(ctx, hw, hh, dna, time);
        break;

      case 'hammerhead_ram':
        this.renderHammerheadRam(ctx, hw, hh, dna, time);
        break;

      case 'x_dreadnought':
      case 'dreadnought':
        this.renderXDreadnought(ctx, hw, hh, dna, time);
        break;

      case 'fractal_asymmetric':
      case 'fractal':
        this.renderFractalAsymmetric(ctx, hw, hh, dna, time);
        break;

      case 'toroidal_ring':
      case 'ring':
        this.renderToroidalRing(ctx, hw, hh, dna, time);
        break;

      case 'stealth_dagger':
        this.renderStealthDagger(ctx, hw, hh, dna, time);
        break;

      case 'phoenix_swept':
        this.renderPhoenixSwept(ctx, hw, hh, dna, time);
        break;

      case 'delta_interceptor':
      case 'delta':
      default:
        this.renderDeltaInterceptor(ctx, hw, hh, dna, time);
        break;
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------
     1. DELTA INTERCEPTOR (Cyber Falcon)
     Classic Arrowhead Fighter: Forward canards, swept wings, wingtip pods
     ------------------------------------------------------------------ */
  private static renderDeltaInterceptor(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number
  ): void {
    // Layer 0: Dark under-wing chassis
    const chassis = new Path2D();
    chassis.moveTo(0, -hh * 0.7);
    chassis.lineTo(hw * 0.96, hh * 0.78);
    chassis.lineTo(hw * 0.5, hh * 0.65);
    chassis.lineTo(-hw * 0.5, hh * 0.65);
    chassis.lineTo(-hw * 0.96, hh * 0.78);
    chassis.closePath();
    ctx.fillStyle = '#020610';
    ctx.fill(chassis);

    // Layer 1: Main Swept Wings & Fuselage
    const mainHull = new Path2D();
    mainHull.moveTo(0, -hh * 0.98);
    mainHull.lineTo(hw * 0.85, hh * 0.68);
    mainHull.lineTo(hw * 0.45, hh * 0.52);
    mainHull.lineTo(hw * 0.22, hh * 0.82);
    mainHull.lineTo(-hw * 0.22, hh * 0.82);
    mainHull.lineTo(-hw * 0.45, hh * 0.52);
    mainHull.lineTo(-hw * 0.85, hh * 0.68);
    mainHull.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, mainHull, 0, 0, hw * 2, hh * 2, dna);

    // Layer 2: Aerodynamic Forward Canards
    const canards = new Path2D();
    canards.moveTo(0, -hh * 0.82);
    canards.lineTo(hw * 0.46, -hh * 0.38);
    canards.lineTo(hw * 0.22, -hh * 0.26);
    canards.lineTo(-hw * 0.22, -hh * 0.26);
    canards.lineTo(-hw * 0.46, -hh * 0.38);
    canards.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, canards, dna.secondaryAccentColor, dna.plateThickness * 0.9, dna.plateFillColor);

    // Layer 3: Raised Dorsal Spine Armor
    const dorsalSpine = new Path2D();
    dorsalSpine.moveTo(0, -hh * 0.9);
    dorsalSpine.lineTo(hw * 0.2, hh * 0.25);
    dorsalSpine.lineTo(hw * 0.14, hh * 0.65);
    dorsalSpine.lineTo(-hw * 0.14, hh * 0.65);
    dorsalSpine.lineTo(-hw * 0.2, hh * 0.25);
    dorsalSpine.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, dorsalSpine, dna.accentColor, dna.plateThickness, dna.plateFillColor);

    // Panel Seams & Rivets
    ShipSurfaceDetails.drawPanelSeam(ctx, -hw * 0.68, hh * 0.42, -hw * 0.22, hh * 0.12);
    ShipSurfaceDetails.drawPanelSeam(ctx, hw * 0.68, hh * 0.42, hw * 0.22, hh * 0.12);
    ShipSurfaceDetails.drawCoolingVents(ctx, 0, hh * 0.48, hw * 0.24, 3);

    ShipSurfaceDetails.drawRivets(ctx, [
      { x: -hw * 0.32, y: hh * 0.32 },
      { x: hw * 0.32, y: hh * 0.32 },
      { x: -hw * 0.12, y: hh * 0.58 },
      { x: hw * 0.12, y: hh * 0.58 },
    ]);
  }

  /* ------------------------------------------------------------------
     2. RAMJET DRAGSTER (Neon Overdrive)
     Needle nose, flared wide air scoops, twin 45° vertical fins, huge turbine
     ------------------------------------------------------------------ */
  private static renderRamjetDragster(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number
  ): void {
    // Layer 0: Giant Rear Turbine Housing Ring (Protruding Base)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, hh * 0.62, hw * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = '#060205';
    ctx.fill();
    ctx.strokeStyle = dna.accentColor;
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();

    // Layer 1: Flared Air Scoop Ramjet Wings
    const flaredWings = new Path2D();
    flaredWings.moveTo(-hw * 0.12, -hh * 0.2);
    flaredWings.lineTo(hw * 0.12, -hh * 0.2);
    flaredWings.lineTo(hw * 0.98, hh * 0.52);
    flaredWings.lineTo(hw * 0.72, hh * 0.82);
    flaredWings.lineTo(hw * 0.28, hh * 0.68);
    flaredWings.lineTo(-hw * 0.28, hh * 0.68);
    flaredWings.lineTo(-hw * 0.72, hh * 0.82);
    flaredWings.lineTo(-hw * 0.98, hh * 0.52);
    flaredWings.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, flaredWings, 0, hh * 0.3, hw * 2, hh * 0.9, dna);

    // Layer 2: Twin 45° Canted Vertical Stabilizer Fins
    const finL = new Path2D();
    finL.moveTo(-hw * 0.55, hh * 0.15);
    finL.lineTo(-hw * 0.82, hh * 0.68);
    finL.lineTo(-hw * 0.62, hh * 0.75);
    finL.lineTo(-hw * 0.45, hh * 0.35);
    finL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, finL, dna.secondaryAccentColor, dna.plateThickness * 1.1, dna.plateFillColor);

    const finR = new Path2D();
    finR.moveTo(hw * 0.55, hh * 0.15);
    finR.lineTo(hw * 0.82, hh * 0.68);
    finR.lineTo(hw * 0.62, hh * 0.75);
    finR.lineTo(hw * 0.45, hh * 0.35);
    finR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, finR, dna.secondaryAccentColor, dna.plateThickness * 1.1, dna.plateFillColor);

    // Layer 3: Ultra-slender Needle Fuselage
    const needleSpine = new Path2D();
    needleSpine.moveTo(0, -hh * 1.05); // Piercing sharp nose probe
    needleSpine.lineTo(hw * 0.14, -hh * 0.1);
    needleSpine.lineTo(hw * 0.22, hh * 0.58);
    needleSpine.lineTo(-hw * 0.22, hh * 0.58);
    needleSpine.lineTo(-hw * 0.14, -hh * 0.1);
    needleSpine.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, needleSpine, dna.accentColor, dna.plateThickness, dna.plateFillColor);

    // Air Intake Vents (Bilateral black scoops)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-hw * 0.42, hh * 0.18, hw * 0.14, hh * 0.22);
    ctx.fillRect(hw * 0.28, hh * 0.18, hw * 0.14, hh * 0.22);

    // Exposed high-pressure thermal conduit pipes
    ShipSurfaceDetails.drawEnergyConduit(ctx, -hw * 0.2, -hh * 0.1, -hw * 0.35, hh * 0.45, -hw * 0.28, hh * 0.2, dna.accentColor);
    ShipSurfaceDetails.drawEnergyConduit(ctx, hw * 0.2, -hh * 0.1, hw * 0.35, hh * 0.45, hw * 0.28, hh * 0.2, dna.accentColor);
  }

  /* ------------------------------------------------------------------
     3. FORWARD SWEPT SWITCHBLADE (Phantom Violet)
     Inverted wings sweeping FORWARD (SU-47 style), faceted stealth canopy
     ------------------------------------------------------------------ */
  private static renderForwardSwept(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number
  ): void {
    // Layer 0: Stealth underbody chassis
    const underChassis = new Path2D();
    underChassis.moveTo(0, -hh * 0.9);
    underChassis.lineTo(hw * 0.95, -hh * 0.25);
    underChassis.lineTo(hw * 0.88, hh * 0.4);
    underChassis.lineTo(hw * 0.25, hh * 0.85);
    underChassis.lineTo(-hw * 0.25, hh * 0.85);
    underChassis.lineTo(-hw * 0.88, hh * 0.4);
    underChassis.lineTo(-hw * 0.95, -hh * 0.25);
    underChassis.closePath();
    ctx.fillStyle = '#06030c';
    ctx.fill(underChassis);

    // Layer 1: Inverted Forward-Swept Wings (Leading edges point forward towards nose!)
    const forwardWings = new Path2D();
    forwardWings.moveTo(0, -hh * 0.35);
    forwardWings.lineTo(hw * 1.05, -hh * 0.38); // Reaching far forward!
    forwardWings.lineTo(hw * 0.95, hh * 0.15);
    forwardWings.lineTo(hw * 0.3, hh * 0.65);
    forwardWings.lineTo(-hw * 0.3, hh * 0.65);
    forwardWings.lineTo(-hw * 0.95, hh * 0.15);
    forwardWings.lineTo(-hw * 1.05, -hh * 0.38);
    forwardWings.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, forwardWings, 0, 0, hw * 2.2, hh * 1.6, dna);

    // Layer 2: Faceted Stealth Diamond Armor Plates (Radar absorption facets)
    const facetL = new Path2D();
    facetL.moveTo(0, -hh * 0.78);
    facetL.lineTo(-hw * 0.35, -hh * 0.3);
    facetL.lineTo(-hw * 0.22, hh * 0.35);
    facetL.lineTo(0, hh * 0.48);
    facetL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, facetL, dna.accentColor, dna.plateThickness * 0.85, dna.plateFillColor);

    const facetR = new Path2D();
    facetR.moveTo(0, -hh * 0.78);
    facetR.lineTo(hw * 0.35, -hh * 0.3);
    facetR.lineTo(hw * 0.22, hh * 0.35);
    facetR.lineTo(0, hh * 0.48);
    facetR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, facetR, dna.accentColor, dna.plateThickness * 0.85, dna.plateFillColor);

    // Layer 3: Central Recessed Keel
    const spine = new Path2D();
    spine.moveTo(0, -hh * 0.95);
    spine.lineTo(hw * 0.08, -hh * 0.2);
    spine.lineTo(hw * 0.08, hh * 0.65);
    spine.lineTo(-hw * 0.08, hh * 0.65);
    spine.lineTo(-hw * 0.08, -hh * 0.2);
    spine.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, spine, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    // Recessed Ion Slit Vent outlines at rear
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-hw * 0.22, hh * 0.62, hw * 0.12, 4);
    ctx.strokeRect(hw * 0.1, hh * 0.62, hw * 0.12, 4);
  }

  /* ------------------------------------------------------------------
     4. QUANTUM TRIMARAN (Quantum Wing)
     3 Disconnected Hulls: Central floating pod + 2 hovering magnetic wings
     ------------------------------------------------------------------ */
  private static renderQuantumTrimaran(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    // Levitation oscillation offset
    const floatL = Math.sin(time * 3.5) * 2;
    const floatR = Math.sin(time * 3.5 + Math.PI) * 2;

    // 1. Quantum Magnetic Flux Arcs in the EMPTY GAP between hulls
    ctx.save();
    ctx.strokeStyle = dna.accentColor;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([3, 4]);
    ctx.lineDashOffset = -time * 18;

    // Left magnetic connection beam
    ctx.beginPath();
    ctx.moveTo(-hw * 0.2, floatL);
    ctx.lineTo(-hw * 0.48, floatL);
    ctx.stroke();

    // Right magnetic connection beam
    ctx.beginPath();
    ctx.moveTo(hw * 0.2, floatR);
    ctx.lineTo(hw * 0.48, floatR);
    ctx.stroke();
    ctx.restore();

    // 2. Left Detached Floating Outrigger Wing
    ctx.save();
    ctx.translate(-hw * 0.66, floatL);
    const outriggerL = new Path2D();
    outriggerL.moveTo(-hw * 0.45, -hh * 0.15);
    outriggerL.lineTo(-hw * 0.88, -hh * 0.42);
    outriggerL.lineTo(-hw * 0.98, -hh * 0.28);
    outriggerL.lineTo(-hw * 0.75, hh * 0.72);
    outriggerL.lineTo(-hw * 0.58, hh * 0.72);
    outriggerL.lineTo(-hw * 0.98, hh * 0.52);
    outriggerL.lineTo(-hw * 0.52, -hh * 0.08);
    outriggerL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, outriggerL, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    // Magnetic containment ring on outrigger
    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.16, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // 3. Right Detached Floating Outrigger Wing
    ctx.save();
    ctx.translate(hw * 0.66, floatR);
    const outriggerR = new Path2D();
    outriggerR.moveTo(hw * 0.45, -hh * 0.15);
    outriggerR.lineTo(hw * 0.88, -hh * 0.42);
    outriggerR.lineTo(hw * 0.98, -hh * 0.28);
    outriggerR.lineTo(hw * 0.75, hh * 0.72);
    outriggerR.lineTo(hw * 0.58, hh * 0.72);
    outriggerR.lineTo(hw * 0.98, hh * 0.52);
    outriggerR.lineTo(hw * 0.52, -hh * 0.08);
    outriggerR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, outriggerR, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.16, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // 4. Central Levitating Quantum Capsule (Pod)
    const centerPod = new Path2D();
    centerPod.moveTo(0, -hh * 0.88);
    centerPod.lineTo(hw * 0.25, -hh * 0.35);
    centerPod.lineTo(hw * 0.22, hh * 0.52);
    centerPod.lineTo(0, hh * 0.75);
    centerPod.lineTo(-hw * 0.22, hh * 0.52);
    centerPod.lineTo(-hw * 0.25, -hh * 0.35);
    centerPod.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, centerPod, 0, 0, hw * 0.6, hh * 1.5, dna);
    ShipMaterials.drawBeveledArmorPlate(ctx, centerPod, dna.accentColor, dna.plateThickness * 1.2, dna.plateFillColor);

    // Central Singularity Quantum Orb
    ctx.save();
    ctx.shadowColor = dna.accentColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ------------------------------------------------------------------
     5. HAMMERHEAD RAM (Solar Gold)
     Heavy T-shaped blunt battering ram bumper, massive bolt matrix
     ------------------------------------------------------------------ */
  private static renderHammerheadRam(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number
  ): void {
    // Layer 0: Heavy Sub-chassis Body
    const chassis = new Path2D();
    chassis.moveTo(-hw * 0.9, -hh * 0.5);
    chassis.lineTo(hw * 0.9, -hh * 0.5);
    chassis.lineTo(hw * 0.75, hh * 0.85);
    chassis.lineTo(-hw * 0.75, hh * 0.85);
    chassis.closePath();
    ctx.fillStyle = '#140c04';
    ctx.fill(chassis);

    // Layer 1: Sloped Fortress Fuselage (Aft Hull)
    const aftHull = new Path2D();
    aftHull.moveTo(-hw * 0.45, -hh * 0.4);
    aftHull.lineTo(hw * 0.45, -hh * 0.4);
    aftHull.lineTo(hw * 0.7, hh * 0.75);
    aftHull.lineTo(-hw * 0.7, hh * 0.75);
    aftHull.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, aftHull, 0, 0, hw * 1.5, hh * 1.5, dna);

    // Layer 2: Massive Frontal T-Shaped Battering Ram Bumper
    const hammerhead = new Path2D();
    hammerhead.moveTo(-hw * 0.95, -hh * 0.95);
    hammerhead.lineTo(hw * 0.95, -hh * 0.95);
    hammerhead.lineTo(hw * 0.92, -hh * 0.58);
    hammerhead.lineTo(hw * 0.35, -hh * 0.58);
    hammerhead.lineTo(hw * 0.32, -hh * 0.38);
    hammerhead.lineTo(-hw * 0.32, -hh * 0.38);
    hammerhead.lineTo(-hw * 0.35, -hh * 0.58);
    hammerhead.lineTo(-hw * 0.92, -hh * 0.58);
    hammerhead.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, hammerhead, dna.accentColor, dna.plateThickness * 1.4, dna.plateFillColor);

    // Heavy Kinetic Shock Buffer Plate
    const shockPlate = new Path2D();
    shockPlate.rect(-hw * 0.65, -hh * 0.92, hw * 1.3, hh * 0.18);
    ShipMaterials.drawBeveledArmorPlate(ctx, shockPlate, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    // Heavy 8-Bolt Industrial Rivet Matrix on Front Bumper
    ShipSurfaceDetails.drawRivets(ctx, [
      { x: -hw * 0.85, y: -hh * 0.75 },
      { x: -hw * 0.6, y: -hh * 0.75 },
      { x: -hw * 0.3, y: -hh * 0.75 },
      { x: -hw * 0.1, y: -hh * 0.75 },
      { x: hw * 0.1, y: -hh * 0.75 },
      { x: hw * 0.3, y: -hh * 0.75 },
      { x: hw * 0.6, y: -hh * 0.75 },
      { x: hw * 0.85, y: -hh * 0.75 },
    ]);

    // Triple Cooling Vents for the 3 Heavy Thrusters
    ShipSurfaceDetails.drawCoolingVents(ctx, -hw * 0.4, hh * 0.38, hw * 0.22, 4);
    ShipSurfaceDetails.drawCoolingVents(ctx, 0, hh * 0.42, hw * 0.22, 4);
    ShipSurfaceDetails.drawCoolingVents(ctx, hw * 0.4, hh * 0.38, hw * 0.22, 4);
  }

  /* ------------------------------------------------------------------
     6. X-DREADNOUGHT (Codebreaker // X)
     Aggressive 4-Wing "X" Cross-frame with stepped bridge tower
     ------------------------------------------------------------------ */
  private static renderXDreadnought(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number
  ): void {
    // Layer 0: Heavy Cross-frame Core Underbody
    const crossFrame = new Path2D();
    // 4 Wing Points forming an aggressive X
    crossFrame.moveTo(0, -hh * 0.6);
    crossFrame.lineTo(hw * 1.02, -hh * 0.85); // Upper Right
    crossFrame.lineTo(hw * 0.55, -hh * 0.2);
    crossFrame.lineTo(hw * 0.98, hh * 0.72);   // Lower Right
    crossFrame.lineTo(hw * 0.35, hh * 0.55);
    crossFrame.lineTo(0, hh * 0.85);
    crossFrame.lineTo(-hw * 0.35, hh * 0.55);
    crossFrame.lineTo(-hw * 0.98, hh * 0.72);  // Lower Left
    crossFrame.lineTo(-hw * 0.55, -hh * 0.2);
    crossFrame.lineTo(-hw * 1.02, -hh * 0.85); // Upper Left
    crossFrame.closePath();
    ctx.fillStyle = '#0a0514';
    ctx.fill(crossFrame);
    ShipMaterials.fillIndustrialMetal(ctx, crossFrame, 0, 0, hw * 2.2, hh * 2, dna);

    // Layer 1: Forward Weapon Pylons (Upper X-Prongs)
    const upperWingL = new Path2D();
    upperWingL.moveTo(0, -hh * 0.4);
    upperWingL.lineTo(-hw * 0.98, -hh * 0.85);
    upperWingL.lineTo(-hw * 0.72, -hh * 0.45);
    upperWingL.lineTo(-hw * 0.3, -hh * 0.15);
    upperWingL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, upperWingL, dna.accentColor, dna.plateThickness, dna.plateFillColor);

    const upperWingR = new Path2D();
    upperWingR.moveTo(0, -hh * 0.4);
    upperWingR.lineTo(hw * 0.98, -hh * 0.85);
    upperWingR.lineTo(hw * 0.72, -hh * 0.45);
    upperWingR.lineTo(hw * 0.3, -hh * 0.15);
    upperWingR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, upperWingR, dna.accentColor, dna.plateThickness, dna.plateFillColor);

    // Lower Divergent Wings (Downward / Forward Sweep)
    const lowerWingL = new Path2D();
    lowerWingL.moveTo(0, hh * 0.2);
    lowerWingL.lineTo(-hw * 0.92, hh * 0.78);
    lowerWingL.lineTo(-hw * 0.65, hh * 0.88);
    lowerWingL.lineTo(-hw * 0.25, hh * 0.45);
    lowerWingL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, lowerWingL, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    const lowerWingR = new Path2D();
    lowerWingR.moveTo(0, hh * 0.2);
    lowerWingR.lineTo(hw * 0.92, hh * 0.78);
    lowerWingR.lineTo(hw * 0.65, hh * 0.88);
    lowerWingR.lineTo(hw * 0.25, hh * 0.45);
    lowerWingR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, lowerWingR, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    // Layer 2: Stepped Dreadnought Bridge Superstructure
    const bridgeTower = new Path2D();
    bridgeTower.moveTo(0, -hh * 0.75);
    bridgeTower.lineTo(hw * 0.24, -hh * 0.1);
    bridgeTower.lineTo(hw * 0.18, hh * 0.55);
    bridgeTower.lineTo(-hw * 0.18, hh * 0.55);
    bridgeTower.lineTo(-hw * 0.24, -hh * 0.1);
    bridgeTower.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, bridgeTower, dna.tertiaryDecalColor, dna.plateThickness * 1.3, dna.plateFillColor);

    // Cross structural seam lines
    ShipSurfaceDetails.drawPanelSeam(ctx, -hw * 0.5, -hh * 0.4, hw * 0.5, hh * 0.4);
    ShipSurfaceDetails.drawPanelSeam(ctx, -hw * 0.5, hh * 0.4, hw * 0.5, -hh * 0.4);
  }

  /* ------------------------------------------------------------------
     7. FRACTAL ASYMMETRIC (Emerald Glitch)
     Completely asymmetrical polygon shards, split razor fins, glitch node
     ------------------------------------------------------------------ */
  private static renderFractalAsymmetric(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    // Left Wing: Elongated Double-Stepped Razor Blade
    const leftShard = new Path2D();
    leftShard.moveTo(-hw * 0.12, -hh * 0.5);
    leftShard.lineTo(-hw * 0.96, -hh * 0.15);
    leftShard.lineTo(-hw * 0.88, hh * 0.45);
    leftShard.lineTo(-hw * 0.48, hh * 0.32);
    leftShard.lineTo(-hw * 0.55, hh * 0.82);
    leftShard.lineTo(-hw * 0.22, hh * 0.65);
    leftShard.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, leftShard, dna.accentColor, dna.plateThickness, dna.plateFillColor);

    // Right Wing: Shorter, blunter, housing heavy radar / weapon pod
    const rightShard = new Path2D();
    rightShard.moveTo(hw * 0.12, -hh * 0.5);
    rightShard.lineTo(hw * 0.75, -hh * 0.35);
    rightShard.lineTo(hw * 0.85, hh * 0.15);
    rightShard.lineTo(hw * 0.55, hh * 0.62);
    rightShard.lineTo(hw * 0.22, hh * 0.55);
    rightShard.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, rightShard, dna.secondaryAccentColor, dna.plateThickness, dna.plateFillColor);

    // Layer 2: Levitating Hexagonal Glitch Data Core
    const hexOffset = Math.sin(time * 5) * 5;
    const hexCore = new Path2D();
    const hexR = hw * 0.22;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const hx = Math.cos(a) * hexR;
      const hy = -hh * 0.15 + hexOffset + Math.sin(a) * hexR;
      if (i === 0) hexCore.moveTo(hx, hy);
      else hexCore.lineTo(hx, hy);
    }
    hexCore.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, hexCore, dna.tertiaryDecalColor, dna.plateThickness * 1.2, dna.plateFillColor);

    // Glowing Neon Energy Conduit Bridges
    ShipSurfaceDetails.drawEnergyConduit(ctx, -hw * 0.45, -hh * 0.1, 0, 0, -hw * 0.2, -hh * 0.2, dna.accentColor);
    ShipSurfaceDetails.drawEnergyConduit(ctx, hw * 0.45, hh * 0.1, 0, 0, hw * 0.2, hh * 0.2, '#34d399');
  }

  /* ------------------------------------------------------------------
     8. TOROIDAL RING (Quantum Citadel)
     Full 360° circular composite ring, 4 rotating orbital pods & void
     ------------------------------------------------------------------ */
  private static renderToroidalRing(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    const outerR = hw * 0.88;
    const innerR = hw * 0.52;

    // Layer 1: Toroidal Circular Composite Ring (Hollow Center Void)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, outerR, 0, Math.PI * 2);
    ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
    ctx.fillStyle = '#08162b';
    ctx.fill();

    ctx.strokeStyle = dna.accentColor;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Inner rim stroke
    ctx.beginPath();
    ctx.arc(0, 0, innerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Layer 2: 4 Rotating Magnetic Orbital Stabilizer Pods
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + time * 0.9;
      const nx = Math.cos(angle) * (outerR + innerR) * 0.5;
      const ny = Math.sin(angle) * (outerR + innerR) * 0.5;

      ctx.beginPath();
      ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    // Layer 3: Radial Struts connecting Ring to Center Hub
    ctx.save();
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
      ctx.lineTo(Math.cos(a) * hw * 0.28, Math.sin(a) * hw * 0.28);
      ctx.stroke();
    }
    ctx.restore();

    // Layer 4: Central Spherical Command Hub
    const centralHub = new Path2D();
    centralHub.arc(0, 0, hw * 0.28, 0, Math.PI * 2);
    ShipMaterials.fillIndustrialMetal(ctx, centralHub, 0, 0, hw * 0.6, hw * 0.6, dna);
    ShipMaterials.drawBeveledArmorPlate(ctx, centralHub, dna.accentColor, dna.plateThickness, dna.plateFillColor);
  }

  /* ------------------------------------------------------------------
     9. STEALTH DAGGER (Void Stalker - S-09)
     Faceted assassin needle: Ultra-narrow stiletto fuselage, dual forward
     razor switchblade sponsons, stealth carbon facets & crimson laser optic.
     ------------------------------------------------------------------ */
  private static renderStealthDagger(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    // Layer 0: Stealth Carbon Underchassis (Narrow faceted silhouette)
    const underChassis = new Path2D();
    underChassis.moveTo(0, -hh * 1.15); // Razor stiletto needle nose
    underChassis.lineTo(hw * 0.18, -hh * 0.4);
    underChassis.lineTo(hw * 0.85, -hh * 0.1); // Outward dagger wingtip
    underChassis.lineTo(hw * 0.52, hh * 0.35);
    underChassis.lineTo(hw * 0.28, hh * 0.85); // Dual rear stiletto tail
    underChassis.lineTo(0, hh * 0.6);
    underChassis.lineTo(-hw * 0.28, hh * 0.85);
    underChassis.lineTo(-hw * 0.52, hh * 0.35);
    underChassis.lineTo(-hw * 0.85, -hh * 0.1);
    underChassis.lineTo(-hw * 0.18, -hh * 0.4);
    underChassis.closePath();
    ctx.fillStyle = '#020306';
    ctx.fill(underChassis);

    // Layer 1: Main Obsidian Faceted Body
    const mainHull = new Path2D();
    mainHull.moveTo(0, -hh * 1.12);
    mainHull.lineTo(hw * 0.14, -hh * 0.38);
    mainHull.lineTo(hw * 0.76, -hh * 0.08);
    mainHull.lineTo(hw * 0.46, hh * 0.3);
    mainHull.lineTo(hw * 0.22, hh * 0.8);
    mainHull.lineTo(0, hh * 0.56);
    mainHull.lineTo(-hw * 0.22, hh * 0.8);
    mainHull.lineTo(-hw * 0.46, hh * 0.3);
    mainHull.lineTo(-hw * 0.76, -hh * 0.08);
    mainHull.lineTo(-hw * 0.14, -hh * 0.38);
    mainHull.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, mainHull, 0, 0, hw * 2, hh * 2, dna);

    // Layer 2: Dual Forward-Reaching Razor Assassin Daggers
    const daggerL = new Path2D();
    daggerL.moveTo(-hw * 0.14, -hh * 0.35);
    daggerL.lineTo(-hw * 0.72, -hh * 0.65); // Reaches far forward!
    daggerL.lineTo(-hw * 0.6, -hh * 0.05);
    daggerL.lineTo(-hw * 0.22, hh * 0.1);
    daggerL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, daggerL, dna.secondaryAccentColor, dna.plateThickness * 1.3, '#181b2a');

    const daggerR = new Path2D();
    daggerR.moveTo(hw * 0.14, -hh * 0.35);
    daggerR.lineTo(hw * 0.72, -hh * 0.65); // Reaches far forward!
    daggerR.lineTo(hw * 0.6, -hh * 0.05);
    daggerR.lineTo(hw * 0.22, hh * 0.1);
    daggerR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, daggerR, dna.secondaryAccentColor, dna.plateThickness * 1.3, '#181b2a');

    // Layer 3: Central Crimson Assassin Spine & Optical Slit
    const assassinSpine = new Path2D();
    assassinSpine.moveTo(0, -hh * 1.14);
    assassinSpine.lineTo(hw * 0.09, -hh * 0.2);
    assassinSpine.lineTo(hw * 0.12, hh * 0.62);
    assassinSpine.lineTo(-hw * 0.12, hh * 0.62);
    assassinSpine.lineTo(-hw * 0.09, -hh * 0.2);
    assassinSpine.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, assassinSpine, dna.accentColor, dna.plateThickness, '#0f0814');

    // Glowing Laser Target Line down the needle
    ctx.save();
    ctx.strokeStyle = dna.accentColor;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = dna.accentColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 1.15);
    ctx.lineTo(0, hh * 0.45);
    ctx.stroke();

    // Crosshair Sensor Slit
    ctx.beginPath();
    ctx.moveTo(-hw * 0.15, -hh * 0.1);
    ctx.lineTo(hw * 0.15, -hh * 0.1);
    ctx.stroke();
    ctx.restore();
  }

  /* ------------------------------------------------------------------
     10. PHOENIX SWEPT (Solar Phoenix - S-10)
     Majestic Avian Plumage: 3-tiered swept solar wings, radiant plume
     canards, central fusion sun core, and thermal plasma flares.
     ------------------------------------------------------------------ */
  private static renderPhoenixSwept(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number
  ): void {
    // Layer 0: Solar Thermal Corona Aura
    ctx.save();
    const pulse = 0.85 + Math.sin(time * 5.5) * 0.15;
    const auraGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, hw * 1.25);
    auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.28)');
    auraGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.14)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, hw * 1.2 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Layer 1: Triple Stepped Avian Plumage Wings
    const featherWings = new Path2D();
    featherWings.moveTo(0, -hh * 0.92);
    featherWings.lineTo(hw * 0.32, -hh * 0.25);
    // Tier 1 Feather (Upper Wingtip)
    featherWings.lineTo(hw * 1.05, hh * 0.05);
    featherWings.lineTo(hw * 0.82, hh * 0.22);
    // Tier 2 Feather (Mid Flap)
    featherWings.lineTo(hw * 0.95, hh * 0.48);
    featherWings.lineTo(hw * 0.68, hh * 0.58);
    // Tier 3 Feather (Inner Flap)
    featherWings.lineTo(hw * 0.75, hh * 0.82);
    featherWings.lineTo(hw * 0.42, hh * 0.68);
    featherWings.lineTo(0, hh * 0.78);
    // Left Wing (Symmetric)
    featherWings.lineTo(-hw * 0.42, hh * 0.68);
    featherWings.lineTo(-hw * 0.75, hh * 0.82);
    featherWings.lineTo(-hw * 0.68, hh * 0.58);
    featherWings.lineTo(-hw * 0.95, hh * 0.48);
    featherWings.lineTo(-hw * 0.82, hh * 0.22);
    featherWings.lineTo(-hw * 1.05, hh * 0.05);
    featherWings.lineTo(-hw * 0.32, -hh * 0.25);
    featherWings.closePath();
    ShipMaterials.fillIndustrialMetal(ctx, featherWings, 0, 0, hw * 2, hh * 2, dna);

    // Layer 2: Radiant Solar Plumage Canards (Wings of fire)
    const canardsL = new Path2D();
    canardsL.moveTo(-hw * 0.12, -hh * 0.75);
    canardsL.lineTo(-hw * 0.62, -hh * 0.28);
    canardsL.lineTo(-hw * 0.38, hh * 0.02);
    canardsL.lineTo(-hw * 0.1, -hh * 0.15);
    canardsL.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, canardsL, dna.secondaryAccentColor, dna.plateThickness * 1.2, '#381606');

    const canardsR = new Path2D();
    canardsR.moveTo(hw * 0.12, -hh * 0.75);
    canardsR.lineTo(hw * 0.62, -hh * 0.28);
    canardsR.lineTo(hw * 0.38, hh * 0.02);
    canardsR.lineTo(hw * 0.1, -hh * 0.15);
    canardsR.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, canardsR, dna.secondaryAccentColor, dna.plateThickness * 1.2, '#381606');

    // Layer 3: Central Fusion Sun-Heart Fuselage
    const solarCore = new Path2D();
    solarCore.moveTo(0, -hh * 0.98);
    solarCore.lineTo(hw * 0.2, -hh * 0.15);
    solarCore.lineTo(hw * 0.16, hh * 0.72);
    solarCore.lineTo(-hw * 0.16, hh * 0.72);
    solarCore.lineTo(-hw * 0.2, -hh * 0.15);
    solarCore.closePath();
    ShipMaterials.drawBeveledArmorPlate(ctx, solarCore, dna.accentColor, dna.plateThickness * 1.4, '#4a1f09');

    // Blazing Core Glow (Center fusion orb)
    ctx.save();
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, hw * 0.22);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, '#facc15');
    coreGrad.addColorStop(0.8, '#ea580c');
    coreGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, hw * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Dual Radiator Energy Arcs
    ShipSurfaceDetails.drawEnergyConduit(ctx, -hw * 0.24, hh * 0.2, -hw * 0.52, hh * 0.5, -hw * 0.38, hh * 0.32, dna.tertiaryDecalColor);
    ShipSurfaceDetails.drawEnergyConduit(ctx, hw * 0.24, hh * 0.2, hw * 0.52, hh * 0.5, hw * 0.38, hh * 0.32, dna.tertiaryDecalColor);
  }
}
