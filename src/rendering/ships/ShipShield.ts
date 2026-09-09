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

    // 1. Outer Fresnel Atmospheric Rim
    const grad = ctx.createRadialGradient(cx, cy, radiusX * 0.5, cx, cy, radiusX);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.01)');
    grad.addColorStop(0.75, 'rgba(0, 229, 255, 0.08)');
    grad.addColorStop(0.95, `rgba(0, 229, 255, ${0.35 + shieldHitFlash * 0.4})`);
    grad.addColorStop(1, 'rgba(0, 229, 255, 0.65)');

    ctx.beginPath();
    ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Glowing Boundary Ring
    ctx.beginPath();
    ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.2 + shieldHitFlash * 1.5;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8 + shieldHitFlash * 10;
    ctx.stroke();

    // 3. Rotating Flux Containment Band (Dotted equator)
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = -time * 20;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radiusX * 0.96, radiusY * 0.4, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}
