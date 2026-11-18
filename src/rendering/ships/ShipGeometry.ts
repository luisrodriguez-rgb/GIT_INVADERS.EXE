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
  private static withZLayer(
    ctx: CanvasRenderingContext2D,
    bankAngle: number,
    zHeight: number,
    drawFn: () => void
  ): void {
    ctx.save();
    ctx.translate(-bankAngle * zHeight, -Math.abs(bankAngle) * zHeight * 0.12);
    drawFn();
    ctx.restore();
  }

  public static renderShipHull(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    ctx.save();
    const hw = w / 2;
    const hh = h / 2;

    switch (dna.hullFamily) {
      case 'ramjet_dragster':
        this.renderRamjetDragster(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'forward_swept':
      case 'needle':
        this.renderForwardSwept(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'quantum_trimaran':
        this.renderQuantumTrimaran(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'hammerhead_ram':
        this.renderHammerheadRam(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'x_dreadnought':
      case 'dreadnought':
        this.renderXDreadnought(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'fractal_asymmetric':
      case 'fractal':
        this.renderFractalAsymmetric(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'toroidal_ring':
      case 'ring':
        this.renderToroidalRing(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'stealth_dagger':
        this.renderStealthDagger(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'phoenix_swept':
        this.renderPhoenixSwept(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'valkyrie_swept':
        this.renderValkyrieSwept(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'seraph_wings':
        this.renderSeraphWings(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'hydra_tri_hull':
        this.renderHydraTriHull(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'starforge_cruiser':
        this.renderStarforgeCruiser(ctx, hw, hh, dna, time, bankAngle);
        break;

      case 'delta_interceptor':
      case 'delta':
      default:
        this.renderDeltaInterceptor(ctx, hw, hh, dna, time, bankAngle);
        break;
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------
     1. DELTA INTERCEPTOR (Cyber Falcon - Image 1 Hero Craft)
     Multi-tier ceramic/titanium delta wing plating, glowing plasma ducts,
     forward aerodynamic canards, twin turbine cowls & dorsal spine.
     ------------------------------------------------------------------ */
  private static renderDeltaInterceptor(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number,
    bankAngle: number = 0
  ): void {
    // Z = -6: Under-wing Dark Titanium Sub-Frame & Side Winglet Spoilers
    this.withZLayer(ctx, bankAngle, -6, () => {
      const chassis = new Path2D();
      chassis.moveTo(0, -hh * 0.85);
      chassis.lineTo(hw * 1.06, hh * 0.78);
      chassis.lineTo(hw * 0.48, hh * 0.72);
      chassis.lineTo(hw * 0.34, hh * 0.94);
      chassis.lineTo(-hw * 0.34, hh * 0.94);
      chassis.lineTo(-hw * 0.48, hh * 0.72);
      chassis.lineTo(-hw * 1.06, hh * 0.78);
      chassis.closePath();
      ctx.fillStyle = '#0f172a';
      ctx.fill(chassis);
      ctx.strokeStyle = dna.accentColor;
      ctx.lineWidth = 1.4;
      ctx.stroke(chassis);
    });

    // Z = 0: Swept Steel Main Delta Wings & Illuminated Cyan Channels
    this.withZLayer(ctx, bankAngle, 0, () => {
      const mainHull = new Path2D();
      mainHull.moveTo(0, -hh * 1.04);
      mainHull.lineTo(hw * 0.98, hh * 0.68);
      mainHull.lineTo(hw * 0.56, hh * 0.6);
      mainHull.lineTo(hw * 0.28, hh * 0.88);
      mainHull.lineTo(-hw * 0.28, hh * 0.88);
      mainHull.lineTo(-hw * 0.56, hh * 0.6);
      mainHull.lineTo(-hw * 0.98, hh * 0.68);
      mainHull.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, mainHull, 0, 0, hw * 2, hh * 2, dna);

      ctx.save();
      ctx.strokeStyle = dna.accentColor;
      ctx.shadowColor = dna.accentColor;
      ctx.shadowBlur = 9;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.3, -hh * 0.08);
      ctx.lineTo(-hw * 0.84, hh * 0.54);
      ctx.moveTo(hw * 0.3, -hh * 0.08);
      ctx.lineTo(hw * 0.84, hh * 0.54);
      ctx.stroke();
      ctx.restore();
    });

    // Z = +5: Bright Pearl-Silver Segmented Armor Wing Plates & Forward Intakes (Image 1 Hero Look)
    this.withZLayer(ctx, bankAngle, 5, () => {
      for (const s of [-1, 1]) {
        const wingArmor = new Path2D();
        wingArmor.moveTo(s * hw * 0.16, -hh * 0.45);
        wingArmor.lineTo(s * hw * 0.78, hh * 0.44);
        wingArmor.lineTo(s * hw * 0.44, hh * 0.54);
        wingArmor.lineTo(s * hw * 0.22, hh * 0.06);
        wingArmor.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, wingArmor, dna.accentColor, dna.plateThickness * 1.15, '#cbd5e1');

        // Forward boom shoulder nacelle
        const shoulderPod = new Path2D();
        shoulderPod.moveTo(s * hw * 0.14, -hh * 0.82);
        shoulderPod.lineTo(s * hw * 0.42, -hh * 0.34);
        shoulderPod.lineTo(s * hw * 0.26, -hh * 0.16);
        shoulderPod.lineTo(s * hw * 0.12, -hh * 0.34);
        shoulderPod.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, shoulderPod, '#ffffff', 1.5, '#e2e8f0');
      }
    });

    // Z = +9: Bright Metallic Dorsal Fuselage Spine & Turbine Cowls
    this.withZLayer(ctx, bankAngle, 9, () => {
      const dorsalSpine = new Path2D();
      dorsalSpine.moveTo(0, -hh * 1.02);
      dorsalSpine.lineTo(hw * 0.22, hh * 0.2);
      dorsalSpine.lineTo(hw * 0.16, hh * 0.74);
      dorsalSpine.lineTo(-hw * 0.16, hh * 0.74);
      dorsalSpine.lineTo(-hw * 0.22, hh * 0.2);
      dorsalSpine.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, dorsalSpine, dna.accentColor, dna.plateThickness * 1.25, '#94a3b8');

      ShipSurfaceDetails.drawPanelSeam(ctx, -hw * 0.68, hh * 0.42, -hw * 0.22, hh * 0.12);
      ShipSurfaceDetails.drawPanelSeam(ctx, hw * 0.68, hh * 0.42, hw * 0.22, hh * 0.12);
      ShipSurfaceDetails.drawCoolingVents(ctx, 0, hh * 0.48, hw * 0.24, 3);
      ShipSurfaceDetails.drawRivets(ctx, [
        { x: -hw * 0.32, y: hh * 0.32 },
        { x: hw * 0.32, y: hh * 0.32 },
        { x: -hw * 0.12, y: hh * 0.58 },
        { x: hw * 0.12, y: hh * 0.58 },
      ]);
    });
  }

  /* ------------------------------------------------------------------
     2. RAMJET DRAGSTER (Neon Overdrive)
     Twin-Nacelle Catamaran Speedster with open central air-tunnel, chrome/crimson pods & giant nozzle
     ------------------------------------------------------------------ */
  private static renderRamjetDragster(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number,
    bankAngle: number = 0
  ): void {
    // Z = -5: Giant Overdrive Rear Fusion Ring
    this.withZLayer(ctx, bankAngle, -5, () => {
      ctx.beginPath();
      ctx.arc(0, hh * 0.68, hw * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = '#4c0519';
      ctx.fill();
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 2.6;
      ctx.stroke();
    });

    // Z = 0: Swept Catamaran Bridge & Flared Dragster Rear Fins
    this.withZLayer(ctx, bankAngle, 0, () => {
      const rearSpan = new Path2D();
      rearSpan.moveTo(-hw * 0.5, hh * 0.05);
      rearSpan.lineTo(hw * 0.5, hh * 0.05);
      rearSpan.lineTo(hw * 1.02, hh * 0.56);
      rearSpan.lineTo(hw * 0.78, hh * 0.86);
      rearSpan.lineTo(hw * 0.3, hh * 0.65);
      rearSpan.lineTo(-hw * 0.3, hh * 0.65);
      rearSpan.lineTo(-hw * 0.78, hh * 0.86);
      rearSpan.lineTo(-hw * 1.02, hh * 0.56);
      rearSpan.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, rearSpan, 0, hh * 0.3, hw * 2, hh * 0.9, dna);
    });

    // Z = +5: Twin Extended Side Ramjet Nacelles (Open Central Gap)
    this.withZLayer(ctx, bankAngle, 5, () => {
      for (const s of [-1, 1]) {
        const pod = new Path2D();
        pod.moveTo(s * hw * 0.34, -hh * 1.06);
        pod.lineTo(s * hw * 0.58, -hh * 0.45);
        pod.lineTo(s * hw * 0.52, hh * 0.72);
        pod.lineTo(s * hw * 0.24, hh * 0.58);
        pod.lineTo(s * hw * 0.22, -hh * 0.42);
        pod.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, pod, dna.accentColor, 1.8, '#e11d48');
      }
    });

    // Z = +9: Central Aft Needle Cockpit & Fuel Conduit
    this.withZLayer(ctx, bankAngle, 9, () => {
      const needle = new Path2D();
      needle.moveTo(0, -hh * 0.65);
      needle.lineTo(hw * 0.16, hh * 0.1);
      needle.lineTo(hw * 0.2, hh * 0.62);
      needle.lineTo(-hw * 0.2, hh * 0.62);
      needle.lineTo(-hw * 0.16, hh * 0.1);
      needle.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, needle, '#fde047', dna.plateThickness, '#f1f5f9');
    });
  }

  /* ------------------------------------------------------------------
     3. FORWARD SWEPT SWITCHBLADE (Phantom Violet)
     Crescent Bat-Wing SU-47 Stealth craft with twin forward scythe blades & twin tail booms
     ------------------------------------------------------------------ */
  private static renderForwardSwept(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number,
    bankAngle: number = 0
  ): void {
    // Z = -5: Twin Diverging Stealth Tail Booms
    this.withZLayer(ctx, bankAngle, -5, () => {
      for (const s of [-1, 1]) {
        const boom = new Path2D();
        boom.moveTo(s * hw * 0.18, hh * 0.1);
        boom.lineTo(s * hw * 0.48, hh * 0.92);
        boom.lineTo(s * hw * 0.24, hh * 0.92);
        boom.lineTo(s * hw * 0.08, hh * 0.45);
        boom.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, boom, '#00f5ff', 1.4, '#3b0764');
      }
    });

    // Z = 0: Sweeping Crescent Bat-Wings
    this.withZLayer(ctx, bankAngle, 0, () => {
      const forwardWings = new Path2D();
      forwardWings.moveTo(0, -hh * 0.25);
      forwardWings.lineTo(hw * 1.06, -hh * 0.72);
      forwardWings.lineTo(hw * 0.92, hh * 0.12);
      forwardWings.lineTo(hw * 0.34, hh * 0.56);
      forwardWings.lineTo(0, hh * 0.35);
      forwardWings.lineTo(-hw * 0.34, hh * 0.56);
      forwardWings.lineTo(-hw * 0.92, hh * 0.12);
      forwardWings.lineTo(-hw * 1.06, -hh * 0.72);
      forwardWings.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, forwardWings, 0, 0, hw * 2.2, hh * 1.6, dna);
    });

    // Z = +5: Bright Violet-Silver Faceted Stealth Armor
    this.withZLayer(ctx, bankAngle, 5, () => {
      for (const s of [-1, 1]) {
        const facet = new Path2D();
        facet.moveTo(0, -hh * 0.85);
        facet.lineTo(s * hw * 0.42, -hh * 0.28);
        facet.lineTo(s * hw * 0.76, -hh * 0.52);
        facet.lineTo(s * hw * 0.28, hh * 0.25);
        facet.lineTo(0, hh * 0.42);
        facet.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, facet, dna.accentColor, 1.6, '#8b5cf6');
      }
    });

    // Z = +9: Central Stealth Dagger Spine
    this.withZLayer(ctx, bankAngle, 9, () => {
      const spine = new Path2D();
      spine.moveTo(0, -hh * 1.02);
      spine.lineTo(hw * 0.12, -hh * 0.12);
      spine.lineTo(hw * 0.1, hh * 0.56);
      spine.lineTo(-hw * 0.1, hh * 0.56);
      spine.lineTo(-hw * 0.12, -hh * 0.12);
      spine.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, spine, '#00f5ff', dna.plateThickness, '#e9d5ff');
    });
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
    time: number,
    bankAngle: number = 0
  ): void {
    const floatL = Math.sin(time * 3.5) * 2;
    const floatR = Math.sin(time * 3.5 + Math.PI) * 2;

    // Z = 0: Quantum Magnetic Flux Arcs & Outrigger Wings
    this.withZLayer(ctx, bankAngle, 0, () => {
      ctx.strokeStyle = dna.accentColor;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 4]);
      ctx.lineDashOffset = -time * 18;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.2, floatL);
      ctx.lineTo(-hw * 0.48, floatL);
      ctx.moveTo(hw * 0.2, floatR);
      ctx.lineTo(hw * 0.48, floatR);
      ctx.stroke();
      ctx.setLineDash([]);

      // Left Outrigger Wing
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
      ctx.beginPath();
      ctx.arc(0, 0, hw * 0.16, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Right Outrigger Wing
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
    });

    // Z = +8: Central Levitating Quantum Capsule & Singularity Orb
    this.withZLayer(ctx, bankAngle, 8, () => {
      const centerPod = new Path2D();
      centerPod.moveTo(0, -hh * 0.9);
      centerPod.lineTo(hw * 0.25, -hh * 0.35);
      centerPod.lineTo(hw * 0.22, hh * 0.52);
      centerPod.lineTo(0, hh * 0.75);
      centerPod.lineTo(-hw * 0.22, hh * 0.52);
      centerPod.lineTo(-hw * 0.25, -hh * 0.35);
      centerPod.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, centerPod, 0, 0, hw * 0.6, hh * 1.5, dna);
      ShipMaterials.drawBeveledArmorPlate(ctx, centerPod, dna.accentColor, dna.plateThickness * 1.2, dna.plateFillColor);

      ctx.shadowColor = dna.accentColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ------------------------------------------------------------------
     5. HAMMERHEAD RAM (Solar Gold)
     Broad-Shouldered Golden Siege Juggernaut with spiked T-ram prow & twin shoulder cannons
     ------------------------------------------------------------------ */
  private static renderHammerheadRam(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number,
    bankAngle: number = 0
  ): void {
    // Z = -5: Heavy Fortress Chassis
    this.withZLayer(ctx, bankAngle, -5, () => {
      const chassis = new Path2D();
      chassis.moveTo(-hw * 0.92, -hh * 0.5);
      chassis.lineTo(hw * 0.92, -hh * 0.5);
      chassis.lineTo(hw * 0.78, hh * 0.86);
      chassis.lineTo(-hw * 0.78, hh * 0.86);
      chassis.closePath();
      ctx.fillStyle = '#451a03';
      ctx.fill(chassis);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.4;
      ctx.stroke(chassis);
    });

    // Z = 0: Stepped Golden Fortress Hull & Side Thruster Sponsons
    this.withZLayer(ctx, bankAngle, 0, () => {
      const aftHull = new Path2D();
      aftHull.moveTo(-hw * 0.48, -hh * 0.4);
      aftHull.lineTo(hw * 0.48, -hh * 0.4);
      aftHull.lineTo(hw * 0.84, hh * 0.15);
      aftHull.lineTo(hw * 0.68, hh * 0.78);
      aftHull.lineTo(-hw * 0.68, hh * 0.78);
      aftHull.lineTo(-hw * 0.84, hh * 0.15);
      aftHull.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, aftHull, 0, 0, hw * 1.6, hh * 1.6, dna);

      ShipSurfaceDetails.drawCoolingVents(ctx, -hw * 0.4, hh * 0.38, hw * 0.22, 4);
      ShipSurfaceDetails.drawCoolingVents(ctx, 0, hh * 0.42, hw * 0.22, 4);
      ShipSurfaceDetails.drawCoolingVents(ctx, hw * 0.4, hh * 0.38, hw * 0.22, 4);
    });

    // Z = +6: Twin Heavy Shoulder Siege Cannons + Spiked T-Ram Bumper
    this.withZLayer(ctx, bankAngle, 6, () => {
      const hammerhead = new Path2D();
      hammerhead.moveTo(-hw * 0.98, -hh * 0.96);
      hammerhead.lineTo(-hw * 0.65, -hh * 1.06);
      hammerhead.lineTo(-hw * 0.4, -hh * 0.92);
      hammerhead.lineTo(hw * 0.4, -hh * 0.92);
      hammerhead.lineTo(hw * 0.65, -hh * 1.06);
      hammerhead.lineTo(hw * 0.98, -hh * 0.96);
      hammerhead.lineTo(hw * 0.94, -hh * 0.56);
      hammerhead.lineTo(hw * 0.35, -hh * 0.56);
      hammerhead.lineTo(hw * 0.32, -hh * 0.36);
      hammerhead.lineTo(-hw * 0.32, -hh * 0.36);
      hammerhead.lineTo(-hw * 0.35, -hh * 0.56);
      hammerhead.lineTo(-hw * 0.94, -hh * 0.56);
      hammerhead.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, hammerhead, '#fde047', dna.plateThickness * 1.4, '#f59e0b');
    });

    // Z = +9.5: Reactive Gold Shield Bar & 8-Bolt Matrix
    this.withZLayer(ctx, bankAngle, 9.5, () => {
      const shockPlate = new Path2D();
      shockPlate.rect(-hw * 0.65, -hh * 0.88, hw * 1.3, hh * 0.18);
      ShipMaterials.drawBeveledArmorPlate(ctx, shockPlate, '#ffffff', dna.plateThickness, '#fbbf24');

      ShipSurfaceDetails.drawRivets(ctx, [
        { x: -hw * 0.85, y: -hh * 0.72 },
        { x: -hw * 0.6, y: -hh * 0.72 },
        { x: -hw * 0.3, y: -hh * 0.72 },
        { x: -hw * 0.1, y: -hh * 0.72 },
        { x: hw * 0.1, y: -hh * 0.72 },
        { x: hw * 0.3, y: -hh * 0.72 },
        { x: hw * 0.6, y: -hh * 0.72 },
        { x: hw * 0.85, y: -hh * 0.72 },
      ]);
    });
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
    _time: number,
    bankAngle: number = 0
  ): void {
    // Z = -4: Heavy Cross-frame Core Underbody
    this.withZLayer(ctx, bankAngle, -4, () => {
      const crossFrame = new Path2D();
      crossFrame.moveTo(0, -hh * 0.6);
      crossFrame.lineTo(hw * 1.02, -hh * 0.85);
      crossFrame.lineTo(hw * 0.55, -hh * 0.2);
      crossFrame.lineTo(hw * 0.98, hh * 0.72);
      crossFrame.lineTo(hw * 0.35, hh * 0.55);
      crossFrame.lineTo(0, hh * 0.85);
      crossFrame.lineTo(-hw * 0.35, hh * 0.55);
      crossFrame.lineTo(-hw * 0.98, hh * 0.72);
      crossFrame.lineTo(-hw * 0.55, -hh * 0.2);
      crossFrame.lineTo(-hw * 1.02, -hh * 0.85);
      crossFrame.closePath();
      ctx.fillStyle = '#0a0514';
      ctx.fill(crossFrame);
      ShipMaterials.fillIndustrialMetal(ctx, crossFrame, 0, 0, hw * 2.2, hh * 2, dna);
    });

    // Z = +3: Upper & Lower Divergent X-Wings
    this.withZLayer(ctx, bankAngle, 3, () => {
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
    });

    // Z = +9: Stepped Dreadnought Bridge Superstructure
    this.withZLayer(ctx, bankAngle, 9, () => {
      const bridgeTower = new Path2D();
      bridgeTower.moveTo(0, -hh * 0.78);
      bridgeTower.lineTo(hw * 0.24, -hh * 0.1);
      bridgeTower.lineTo(hw * 0.18, hh * 0.55);
      bridgeTower.lineTo(-hw * 0.18, hh * 0.55);
      bridgeTower.lineTo(-hw * 0.24, -hh * 0.1);
      bridgeTower.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, bridgeTower, dna.tertiaryDecalColor, dna.plateThickness * 1.3, dna.plateFillColor);

      ShipSurfaceDetails.drawPanelSeam(ctx, -hw * 0.5, -hh * 0.4, hw * 0.5, hh * 0.4);
      ShipSurfaceDetails.drawPanelSeam(ctx, -hw * 0.5, hh * 0.4, hw * 0.5, -hh * 0.4);
    });
  }

  /* ------------------------------------------------------------------
     7. FRACTAL ASYMMETRIC (Emerald Glitch)
     Biomechanical Scythe-Mantis Fighter with dual forward harvesting claws & glitch bio-core
     ------------------------------------------------------------------ */
  private static renderFractalAsymmetric(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    // Z = -2: Scythe-Mantis Forward Harvesting Blades
    this.withZLayer(ctx, bankAngle, -2, () => {
      for (const s of [-1, 1]) {
        const claw = new Path2D();
        claw.moveTo(s * hw * 0.22, -hh * 0.15);
        claw.quadraticCurveTo(s * hw * 1.12, -hh * 0.65, s * hw * 0.62, -hh * 1.06);
        claw.quadraticCurveTo(s * hw * 0.68, -hh * 0.45, s * hw * 0.34, hh * 0.25);
        claw.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, claw, dna.secondaryAccentColor, 1.5, '#065f46');
      }
    });

    // Z = +3: Asymmetrical Emerald Carapace Wing Shards
    this.withZLayer(ctx, bankAngle, 3, () => {
      const leftShard = new Path2D();
      leftShard.moveTo(-hw * 0.12, -hh * 0.52);
      leftShard.lineTo(-hw * 0.96, -hh * 0.1);
      leftShard.lineTo(-hw * 0.88, hh * 0.52);
      leftShard.lineTo(-hw * 0.48, hh * 0.35);
      leftShard.lineTo(-hw * 0.58, hh * 0.86);
      leftShard.lineTo(-hw * 0.2, hh * 0.64);
      leftShard.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, leftShard, dna.accentColor, dna.plateThickness, '#10b981');

      const rightShard = new Path2D();
      rightShard.moveTo(hw * 0.12, -hh * 0.52);
      rightShard.lineTo(hw * 0.82, -hh * 0.32);
      rightShard.lineTo(hw * 0.92, hh * 0.22);
      rightShard.lineTo(hw * 0.55, hh * 0.72);
      rightShard.lineTo(hw * 0.2, hh * 0.56);
      rightShard.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, rightShard, '#a3e635', dna.plateThickness, '#047857');
    });

    // Z = +9: Levitating Hexagonal Bio-Glitch Core & Conduits
    this.withZLayer(ctx, bankAngle, 9, () => {
      const hexOffset = Math.sin(time * 5) * 3;
      const hexCore = new Path2D();
      const hexR = hw * 0.24;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * hexR;
        const hy = -hh * 0.15 + hexOffset + Math.sin(a) * hexR;
        if (i === 0) hexCore.moveTo(hx, hy);
        else hexCore.lineTo(hx, hy);
      }
      hexCore.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, hexCore, '#fde047', dna.plateThickness * 1.2, '#a7f3d0');

      ShipSurfaceDetails.drawEnergyConduit(ctx, -hw * 0.45, -hh * 0.1, 0, 0, -hw * 0.2, -hh * 0.2, dna.accentColor);
      ShipSurfaceDetails.drawEnergyConduit(ctx, hw * 0.45, hh * 0.1, 0, 0, hw * 0.2, hh * 0.2, '#34d399');
    });
  }

  /* ------------------------------------------------------------------
     8. TOROIDAL RING (Quantum Citadel)
     Multi-tier Orbital Ring Carrier with bright brushed-steel ring, cross-spokes & defense nodes
     ------------------------------------------------------------------ */
  private static renderToroidalRing(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    const outerR = hw * 0.92;
    const innerR = hw * 0.52;

    // Z = -3: 4 Heavy Armored Cross-Spokes
    this.withZLayer(ctx, bankAngle, -3, () => {
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4.2;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
        ctx.lineTo(Math.cos(a) * hw * 0.22, Math.sin(a) * hw * 0.22);
        ctx.stroke();
      }
    });

    // Z = +3: Bright Brushed-Steel Circular Carrier Ring & 4 Rotating Node Pods
    this.withZLayer(ctx, bankAngle, 3, () => {
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.arc(0, 0, innerR, 0, Math.PI * 2, true);
      const ringGrad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
      ringGrad.addColorStop(0, '#bfdbfe');
      ringGrad.addColorStop(0.5, '#2563eb');
      ringGrad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = ringGrad;
      ctx.fill();

      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + time * 0.9;
        const nx = Math.cos(angle) * (outerR + innerR) * 0.5;
        const ny = Math.sin(angle) * (outerR + innerR) * 0.5;

        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    });

    // Z = +9: Forward Bridge Crest + Spherical Citadel Hub
    this.withZLayer(ctx, bankAngle, 9, () => {
      const centralHub = new Path2D();
      centralHub.arc(0, 0, hw * 0.3, 0, Math.PI * 2);
      ShipMaterials.drawBeveledArmorPlate(ctx, centralHub, '#60a5fa', dna.plateThickness, '#e2e8f0');
    });
  }

  /* ------------------------------------------------------------------
     9. STEALTH DAGGER (Void Stalker - S-09)
     3-Pronged Trident Assassin Fighter with titanium-crimson prongs & glowing eye optic
     ------------------------------------------------------------------ */
  private static renderStealthDagger(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    _time: number,
    bankAngle: number = 0
  ): void {
    // Z = -5: Stealth Swept Sub-Wings
    this.withZLayer(ctx, bankAngle, -5, () => {
      const underChassis = new Path2D();
      underChassis.moveTo(0, -hh * 0.85);
      underChassis.lineTo(hw * 0.96, hh * 0.15);
      underChassis.lineTo(hw * 0.54, hh * 0.78);
      underChassis.lineTo(0, hh * 0.56);
      underChassis.lineTo(-hw * 0.54, hh * 0.78);
      underChassis.lineTo(-hw * 0.96, hh * 0.15);
      underChassis.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, underChassis, 0, 0, hw * 2, hh * 2, dna);
    });

    // Z = +4: Twin Outer Trident Forward Stiletto Prongs
    this.withZLayer(ctx, bankAngle, 4, () => {
      for (const s of [-1, 1]) {
        const prong = new Path2D();
        prong.moveTo(s * hw * 0.44, -hh * 0.96);
        prong.lineTo(s * hw * 0.82, -hh * 0.25);
        prong.lineTo(s * hw * 0.56, hh * 0.42);
        prong.lineTo(s * hw * 0.24, hh * 0.25);
        prong.lineTo(s * hw * 0.32, -hh * 0.48);
        prong.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, prong, '#f59e0b', dna.plateThickness * 1.25, '#991b1b');
      }
    });

    // Z = +9: Central Razor Assassin Lance & Crimson Core Optic
    this.withZLayer(ctx, bankAngle, 9, () => {
      const assassinSpine = new Path2D();
      assassinSpine.moveTo(0, -hh * 1.15);
      assassinSpine.lineTo(hw * 0.18, -hh * 0.2);
      assassinSpine.lineTo(hw * 0.15, hh * 0.72);
      assassinSpine.lineTo(-hw * 0.15, hh * 0.72);
      assassinSpine.lineTo(-hw * 0.18, -hh * 0.2);
      assassinSpine.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, assassinSpine, '#ef4444', dna.plateThickness, '#e4e4e7');

      ctx.strokeStyle = dna.accentColor;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = dna.accentColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -hh * 1.05);
      ctx.lineTo(0, hh * 0.52);
      ctx.stroke();
    });
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
    time: number,
    bankAngle: number = 0
  ): void {
    // Z = -5: Solar Thermal Corona Aura
    this.withZLayer(ctx, bankAngle, -5, () => {
      const pulse = 0.85 + Math.sin(time * 5.5) * 0.15;
      const auraGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, hw * 1.25);
      auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.28)');
      auraGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.14)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, hw * 1.2 * pulse, 0, Math.PI * 2);
      ctx.fill();
    });

    // Z = 0: Triple Stepped Avian Plumage Wings
    this.withZLayer(ctx, bankAngle, 0, () => {
      const featherWings = new Path2D();
      featherWings.moveTo(0, -hh * 0.92);
      featherWings.lineTo(hw * 0.32, -hh * 0.25);
      featherWings.lineTo(hw * 1.05, hh * 0.05);
      featherWings.lineTo(hw * 0.82, hh * 0.22);
      featherWings.lineTo(hw * 0.95, hh * 0.48);
      featherWings.lineTo(hw * 0.68, hh * 0.58);
      featherWings.lineTo(hw * 0.75, hh * 0.82);
      featherWings.lineTo(hw * 0.42, hh * 0.68);
      featherWings.lineTo(0, hh * 0.78);
      featherWings.lineTo(-hw * 0.42, hh * 0.68);
      featherWings.lineTo(-hw * 0.75, hh * 0.82);
      featherWings.lineTo(-hw * 0.68, hh * 0.58);
      featherWings.lineTo(-hw * 0.95, hh * 0.48);
      featherWings.lineTo(-hw * 0.82, hh * 0.22);
      featherWings.lineTo(-hw * 1.05, hh * 0.05);
      featherWings.lineTo(-hw * 0.32, -hh * 0.25);
      featherWings.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, featherWings, 0, 0, hw * 2, hh * 2, dna);
    });

    // Z = +5: Radiant Solar Plumage Canards
    this.withZLayer(ctx, bankAngle, 5, () => {
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
    });

    // Z = +9: Central Fusion Sun-Heart Fuselage & Blazing Core
    this.withZLayer(ctx, bankAngle, 9, () => {
      const solarCore = new Path2D();
      solarCore.moveTo(0, -hh * 0.98);
      solarCore.lineTo(hw * 0.2, -hh * 0.15);
      solarCore.lineTo(hw * 0.16, hh * 0.72);
      solarCore.lineTo(-hw * 0.16, hh * 0.72);
      solarCore.lineTo(-hw * 0.2, -hh * 0.15);
      solarCore.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, solarCore, dna.accentColor, dna.plateThickness * 1.4, '#4a1f09');

      const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, hw * 0.22);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, '#facc15');
      coreGrad.addColorStop(0.8, '#ea580c');
      coreGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, hw * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ShipSurfaceDetails.drawEnergyConduit(ctx, -hw * 0.24, hh * 0.2, -hw * 0.52, hh * 0.5, -hw * 0.38, hh * 0.32, dna.tertiaryDecalColor);
      ShipSurfaceDetails.drawEnergyConduit(ctx, hw * 0.24, hh * 0.2, hw * 0.52, hh * 0.5, hw * 0.38, hh * 0.32, dna.tertiaryDecalColor);
    });
  }

  /* ------------------------------------------------------------------
     11. VALKYRIE SWEPT (Aegis Valkyrie - S-11)
     Variable-sweep M-wing Mecha Valkyrie with twin shoulder missile pods & paladin armor.
     ------------------------------------------------------------------ */
  private static renderValkyrieSwept(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    // Z = -6: Twin Tail Fins & Dorsal Energy Ring
    this.withZLayer(ctx, bankAngle, -6, () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.48)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);
      ctx.lineDashOffset = -time * 18;
      ctx.beginPath();
      ctx.arc(0, hh * 0.08, hw * 0.88, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      ctx.restore();

      for (const s of [-1, 1]) {
        const tail = new Path2D();
        tail.moveTo(s * hw * 0.16, hh * 0.35);
        tail.lineTo(s * hw * 0.42, hh * 0.96);
        tail.lineTo(s * hw * 0.12, hh * 0.82);
        tail.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, tail, dna.secondaryAccentColor, 1.4, '#1e3a5f');
      }
    });

    // Z = 0: M-Wing Inverted Gull Swept Wings (Distinctive jagged gull silhouette)
    this.withZLayer(ctx, bankAngle, 0, () => {
      const mWings = new Path2D();
      mWings.moveTo(0, -hh * 1.06);
      mWings.lineTo(hw * 0.22, -hh * 0.35);
      mWings.lineTo(hw * 0.56, -hh * 0.52); // Gull Elbow Peak
      mWings.lineTo(hw * 1.04, hh * 0.32);
      mWings.lineTo(hw * 0.84, hh * 0.78);
      mWings.lineTo(hw * 0.44, hh * 0.35);
      mWings.lineTo(0, hh * 0.65);
      mWings.lineTo(-hw * 0.44, hh * 0.35);
      mWings.lineTo(-hw * 0.84, hh * 0.78);
      mWings.lineTo(-hw * 1.04, hh * 0.32);
      mWings.lineTo(-hw * 0.56, -hh * 0.52);
      mWings.lineTo(-hw * 0.22, -hh * 0.35);
      mWings.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, mWings, 0, 0, hw * 2, hh * 2, dna);
    });

    // Z = +5: Twin Shoulder Missile Pods & Golden Shield Vanes
    this.withZLayer(ctx, bankAngle, 5, () => {
      for (const s of [-1, 1]) {
        const pod = new Path2D();
        pod.rect(s * hw * 0.48 - (s < 0 ? hw * 0.16 : 0), -hh * 0.48, hw * 0.16, hh * 0.58);
        ShipMaterials.drawBeveledArmorPlate(ctx, pod, dna.secondaryAccentColor, 1.5, '#f1f5f9');

        ctx.fillStyle = dna.tertiaryDecalColor;
        ctx.beginPath();
        ctx.arc(s * hw * 0.56, -hh * 0.42, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Z = +9: White/Gold Paladin Nose Fuselage
    this.withZLayer(ctx, bankAngle, 9, () => {
      const crest = new Path2D();
      crest.moveTo(0, -hh * 1.02);
      crest.lineTo(hw * 0.18, -hh * 0.08);
      crest.lineTo(hw * 0.12, hh * 0.72);
      crest.lineTo(-hw * 0.12, hh * 0.72);
      crest.lineTo(-hw * 0.18, -hh * 0.08);
      crest.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, crest, dna.secondaryAccentColor, dna.plateThickness * 1.3, '#e2e8f0');
    });
  }

  /* ------------------------------------------------------------------
     12. SERAPH WINGS (Chrono Seraph - S-12)
     6 Detached Floating Crystal Pinion Feathers orbiting a glowing Halo & Diamond Core.
     ------------------------------------------------------------------ */
  private static renderSeraphWings(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    // Z = -6: Celestial Halo Ring Behind Craft
    this.withZLayer(ctx, bankAngle, -6, () => {
      ctx.save();
      ctx.rotate(time * 1.1);
      ctx.strokeStyle = dna.secondaryAccentColor;
      ctx.lineWidth = 2.6;
      ctx.shadowColor = dna.secondaryAccentColor;
      ctx.shadowBlur = 12;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.arc(0, hh * 0.04, hw * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Z = 0..+4: 6 Detached Floating Feather Blades (visible sky gap around core!)
    this.withZLayer(ctx, bankAngle, 2, () => {
      for (const s of [-1, 1]) {
        for (let tier = 0; tier < 3; tier++) {
          const flutter = Math.sin(time * 4.5 + tier * 1.1) * 2.5;
          const innerX = s * (hw * 0.34 + tier * hw * 0.04);
          const outerX = s * (hw * (1.06 - tier * 0.14));
          const yTop = -hh * 0.38 + tier * hh * 0.32 + flutter;

          const feather = new Path2D();
          feather.moveTo(innerX, yTop + hh * 0.08);
          feather.lineTo(outerX, yTop - hh * 0.22);
          feather.lineTo(outerX * 0.86, yTop + hh * 0.18);
          feather.lineTo(innerX, yTop + hh * 0.22);
          feather.closePath();
          ShipMaterials.drawBeveledArmorPlate(
            ctx,
            feather,
            tier === 0 ? dna.secondaryAccentColor : dna.accentColor,
            1.6,
            tier === 1 ? '#a855f7' : '#e9d5ff'
          );
        }
      }
    });

    // Z = +8: Slender Vertical Seraph Diamond Lance Fuselage
    this.withZLayer(ctx, bankAngle, 8, () => {
      const lance = new Path2D();
      lance.moveTo(0, -hh * 1.12);
      lance.lineTo(hw * 0.22, -hh * 0.15);
      lance.lineTo(hw * 0.16, hh * 0.82);
      lance.lineTo(0, hh * 0.96);
      lance.lineTo(-hw * 0.16, hh * 0.82);
      lance.lineTo(-hw * 0.22, -hh * 0.15);
      lance.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, lance, '#22d3ee', dna.plateThickness * 1.2, '#f5d0fe');

      const g = ctx.createRadialGradient(0, -hh * 0.08, 1, 0, -hh * 0.08, hw * 0.24);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.5, dna.secondaryAccentColor);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, -hh * 0.08, hw * 0.24, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ------------------------------------------------------------------
     13. HYDRA TRI-HULL (Obsidian Hydra - S-13)
     3-Headed Biomechanical Dragon Gunship with fanged wing prows & emerald scales.
     ------------------------------------------------------------------ */
  private static renderHydraTriHull(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    // Z = -5: Heavy Bio-Chassis Wing Crossbar
    this.withZLayer(ctx, bankAngle, -5, () => {
      const chassis = new Path2D();
      chassis.moveTo(-hw * 0.88, -hh * 0.1);
      chassis.lineTo(hw * 0.88, -hh * 0.1);
      chassis.lineTo(hw * 0.72, hh * 0.72);
      chassis.lineTo(-hw * 0.72, hh * 0.72);
      chassis.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, chassis, 0, 0, hw * 2, hh * 2, dna);
    });

    // Z = 0: Swept Scaled Bat-Dragon Wings
    this.withZLayer(ctx, bankAngle, 0, () => {
      for (const s of [-1, 1]) {
        const wing = new Path2D();
        wing.moveTo(s * hw * 0.18, -hh * 0.2);
        wing.lineTo(s * hw * 1.05, -hh * 0.28);
        wing.lineTo(s * hw * 0.92, hh * 0.35);
        wing.lineTo(s * hw * 0.62, hh * 0.85);
        wing.lineTo(s * hw * 0.24, hh * 0.45);
        wing.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, wing, dna.accentColor, 1.8, '#047857');
      }
    });

    // Z = +6: Left & Right Dragon Serpent Heads Thrusting Forward
    this.withZLayer(ctx, bankAngle, 6, () => {
      const sway = Math.sin(time * 5) * 1.8;
      for (const s of [-1, 1]) {
        // Long neck prow
        const head = new Path2D();
        head.moveTo(s * hw * 0.52, -hh * 0.96 + sway * s);
        head.lineTo(s * hw * 0.68, -hh * 0.42);
        head.lineTo(s * hw * 0.56, hh * 0.24);
        head.lineTo(s * hw * 0.34, hh * 0.15);
        head.lineTo(s * hw * 0.38, -hh * 0.45);
        head.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, head, dna.secondaryAccentColor, 1.6, '#10b981');

        // Dragon glowing eye
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(s * hw * 0.52, -hh * 0.62 + sway * s, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Z = +10: Central Alpha Hydra Head & Venom Core
    this.withZLayer(ctx, bankAngle, 10, () => {
      const centerHead = new Path2D();
      centerHead.moveTo(0, -hh * 1.12);
      centerHead.lineTo(hw * 0.22, -hh * 0.38);
      centerHead.lineTo(hw * 0.16, hh * 0.72);
      centerHead.lineTo(-hw * 0.16, hh * 0.72);
      centerHead.lineTo(-hw * 0.22, -hh * 0.38);
      centerHead.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, centerHead, '#a3e635', 1.8, '#34d399');
    });
  }

  /* ------------------------------------------------------------------
     14. STARFORGE CRUISER (Starforge Omega - S-14)
     Distinct U-Shaped Open-Bow Railgun Dreadnought with plasma lightning arc.
     ------------------------------------------------------------------ */
  private static renderStarforgeCruiser(
    ctx: CanvasRenderingContext2D,
    hw: number,
    hh: number,
    dna: ShipVisualDNA,
    time: number,
    bankAngle: number = 0
  ): void {
    // Z = -4: Rear Battleship Stern Cross-Hull (No center nose spire—open U-gap at bow!)
    this.withZLayer(ctx, bankAngle, -4, () => {
      const stern = new Path2D();
      stern.moveTo(-hw * 0.96, hh * 0.08);
      stern.lineTo(hw * 0.96, hh * 0.08);
      stern.lineTo(hw * 0.82, hh * 0.86);
      stern.lineTo(hw * 0.28, hh * 0.72);
      stern.lineTo(-hw * 0.28, hh * 0.72);
      stern.lineTo(-hw * 0.82, hh * 0.86);
      stern.closePath();
      ShipMaterials.fillIndustrialMetal(ctx, stern, 0, 0, hw * 2, hh * 2, dna);
    });

    // Z = +3: Massive Forward-Protruding Twin Magnetic Railgun Arms
    this.withZLayer(ctx, bankAngle, 3, () => {
      for (const s of [-1, 1]) {
        const arm = new Path2D();
        arm.moveTo(s * hw * 0.32, -hh * 1.08);
        arm.lineTo(s * hw * 0.62, -hh * 0.82);
        arm.lineTo(s * hw * 0.76, hh * 0.56);
        arm.lineTo(s * hw * 0.32, hh * 0.56);
        arm.closePath();
        ShipMaterials.drawBeveledArmorPlate(ctx, arm, dna.accentColor, dna.plateThickness * 1.35, '#ea580c');

        // Glowing blue inner coil strips lining the railgap
        ctx.fillStyle = dna.secondaryAccentColor;
        ctx.fillRect(s < 0 ? -hw * 0.36 : hw * 0.3, -hh * 0.88, 3, hh * 0.82);
      }
    });

    // Z = +9: Set-back Aft Command Bridge + Arcing Bow Plasma Bridge
    this.withZLayer(ctx, bankAngle, 9, () => {
      const bridge = new Path2D();
      bridge.moveTo(0, -hh * 0.16);
      bridge.lineTo(hw * 0.28, hh * 0.25);
      bridge.lineTo(hw * 0.22, hh * 0.76);
      bridge.lineTo(-hw * 0.22, hh * 0.76);
      bridge.lineTo(-hw * 0.28, hh * 0.25);
      bridge.closePath();
      ShipMaterials.drawBeveledArmorPlate(ctx, bridge, '#fde047', dna.plateThickness * 1.4, '#f1f5f9');

      // Animated high-voltage lightning arc between the open U-prongs
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.34, -hh * 0.84);
      ctx.lineTo(-hw * 0.12, -hh * (0.92 + Math.sin(time * 22) * 0.08));
      ctx.lineTo(hw * 0.12, -hh * (0.78 + Math.cos(time * 18) * 0.08));
      ctx.lineTo(hw * 0.34, -hh * 0.84);
      ctx.stroke();
    });
  }
}
