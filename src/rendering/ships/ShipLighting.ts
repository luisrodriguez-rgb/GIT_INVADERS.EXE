/**
 * GIT_INVADERS.EXE // SHIP LIGHTING
 * 2D visual lighting system:
 * - Aviation navigation strobes (Red port, Green starboard)
 * - Anti-collision white flashes
 * - Engine reactor back-bleed glow
 */

import { ShipMaterials } from './ShipMaterials';

export class ShipLighting {
  /**
   * Renders standard aviation / sci-fi wingtip navigation beacons.
   */
  public static renderNavLights(
    ctx: CanvasRenderingContext2D,
    leftX: number,
    leftY: number,
    rightX: number,
    rightY: number,
    time: number
  ): void {
    const isLit = Math.sin(time * 8) > 0;
    if (!isLit) return;

    ShipMaterials.withAdditiveBlend(ctx, () => {
      // Port Light (Red)
      ctx.beginPath();
      ctx.arc(leftX, leftY, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Starboard Light (Green)
      ctx.beginPath();
      ctx.arc(rightX, rightY, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 6;
      ctx.fill();
    });
  }

  /**
   * Casts reactor ambient light on the engine surround.
   */
  public static renderReactorAmbient(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    color: string
  ): void {
    ShipMaterials.withAdditiveBlend(ctx, () => {
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.25;
      ctx.fill();
    });
  }
}
