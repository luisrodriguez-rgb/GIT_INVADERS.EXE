/**
 * GIT_INVADERS.EXE // SHIP SHIELD
 * Fresnel deflector bubble with containment rings and impact rippling.
 */

import { ShipMaterials } from './ShipMaterials';

export class ShipShield {
  public static renderDeflector(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    time: number,
    shieldHitFlash: number = 0
  ): void {
    ctx.save();

    // Subtle non-obscuring wingtip hexagonal deflector arc so ship armor remains crystal clear
    ctx.globalAlpha = 0.34 + shieldHitFlash * 0.35;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6 + shieldHitFlash * 1.2;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 6 + shieldHitFlash * 8;

    ctx.setLineDash([12, 8]);
    ctx.lineDashOffset = -time * 24;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
      const hx = cx + Math.cos(a) * radiusX * 1.06;
      const hy = cy + Math.sin(a) * radiusY * 1.04;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();

    // Forward nose bumper arc
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.72)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy - radiusY * 0.12, radiusX * 0.86, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();

    ctx.restore();
  }
}
