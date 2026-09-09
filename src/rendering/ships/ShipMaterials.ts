/**
 * GIT_INVADERS.EXE // SHIP MATERIALS
 * Procedural optical shader and material responses for Canvas 2D:
 * - Industrial brushed metal with shadow / mid / highlight / specular
 * - High-refraction canopy glass
 * - High-energy plasma with additive composition
 * - Ceramic composite armor plates with ambient occlusion
 */

import { ShipVisualDNA } from './ShipDNA';

export class ShipMaterials {
  /**
   * Fills a structural polygon with industrial metal shading:
   * Ambient occlusion shadow + mid-tone gradient + specular highlight edge.
   */
  public static fillIndustrialMetal(
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    x: number,
    y: number,
    w: number,
    h: number,
    dna: ShipVisualDNA
  ): void {
    ctx.save();

    // 1. Deep Base Ambient Shadow
    const grad = ctx.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
    grad.addColorStop(0, dna.hullHighlightColor);
    grad.addColorStop(0.35, dna.hullBaseColor);
    grad.addColorStop(0.85, dna.hullShadowColor);
    grad.addColorStop(1, '#000000');

    ctx.fillStyle = grad;
    ctx.fill(path);

    // 2. Specular Bevel Line (Subtle top/left highlight)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = dna.bevelWidth;
    ctx.stroke(path);

    // 3. Inner shadow stroke for depth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.lineWidth = 1;
    ctx.stroke(path);

    ctx.restore();
  }

  /**
   * Fills an armor plate with bevels (custom plate base + bright upper bevel + lower shadow).
   */
  public static drawBeveledArmorPlate(
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    accentColor: string = '#00e5ff',
    thickness: number = 2,
    plateFillColor: string = '#0a1628'
  ): void {
    ctx.save();

    // Main plate fill with custom material base
    ctx.fillStyle = plateFillColor;
    ctx.fill(path);

    // Upper highlight rim (light source reflection)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = thickness * 0.75;
    ctx.stroke(path);

    // Accent edge trace (5% neon rule)
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 4;
    ctx.stroke(path);

    ctx.restore();
  }

  /**
   * Fills a dual-tone contrast plate (e.g. secondary accent stripe + base armor plate)
   */
  public static drawTwoToneArmorPlate(
    ctx: CanvasRenderingContext2D,
    path: Path2D,
    primaryColor: string,
    secondaryColor: string,
    baseColor: string = '#0a1628',
    thickness: number = 2
  ): void {
    ctx.save();
    ctx.fillStyle = baseColor;
    ctx.fill(path);

    // Dual-tone border highlight
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = thickness;
    ctx.stroke(path);

    // Secondary accent inner line
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1;
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 3;
    ctx.stroke(path);

    ctx.restore();
  }

  /**
   * Renders high-tech multi-layer canopy glass:
   * Tinted dark base + HUD grid glow + diagonal white specular slash.
   */
  public static renderCockpitGlass(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    tintColor: string = 'rgba(0, 229, 255, 0.4)'
  ): void {
    ctx.save();

    // 1. Interior darkness with core back-glow
    const bgGrad = ctx.createRadialGradient(cx, cy + 2, 1, cx, cy, h);
    bgGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    bgGrad.addColorStop(0.8, 'rgba(2, 8, 18, 0.98)');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Glass tint
    const glassGrad = ctx.createLinearGradient(cx - w, cy - h, cx + w, cy + h);
    glassGrad.addColorStop(0, tintColor);
    glassGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    glassGrad.addColorStop(1, tintColor);
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Diagonal Specular Highlight Slash (Simulates curved reflective glass)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(cx - w - 2, cy - h - 2);
    ctx.lineTo(cx + w + 2, cy + h + 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx - w * 0.35, cy - h * 0.35, w * 0.3, h * 0.25, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    ctx.restore();

    // 4. Canopy structural frame rim
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, h, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Additive plasma blend for high-energy emitters (lasers, engines, reactors).
   */
  public static withAdditiveBlend(ctx: CanvasRenderingContext2D, drawFn: () => void): void {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawFn();
    ctx.restore();
  }
}
