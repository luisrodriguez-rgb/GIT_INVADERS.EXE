/**
 * GIT_INVADERS.EXE // SHIP COCKPIT
 * Multi-layer pilot cockpit & fusion core housing:
 * - Reinforced titanium frame with latches
 * - Refractive canopy glass
 * - Pulsing HUD avionics
 * - Internal reactor core
 */

import { ShipMaterials } from './ShipMaterials';

export class ShipCockpit {
  public static renderCockpit(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number,
    accentColor: string,
    time: number
  ): void {
    ctx.save();

    // 1. Titanium Frame Base Outer
    ctx.beginPath();
    ctx.moveTo(cx, cy - height / 2 - 2);
    ctx.lineTo(cx + width / 2 + 2, cy + height / 2);
    ctx.lineTo(cx - width / 2 - 2, cy + height / 2);
    ctx.closePath();
    ctx.fillStyle = '#060d18';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Glass Canopy with Optical Refraction
    ShipMaterials.renderCockpitGlass(ctx, cx, cy, width / 2, height / 2, 'rgba(0, 229, 255, 0.35)');

    // 3. Interior HUD Glow (Subtle 2Hz breathing light)
    const hudPulse = 0.5 + Math.sin(time * 3.5) * 0.3;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy + 1, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = hudPulse;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();

    // 4. Canopy Top Frame Latch
    ctx.beginPath();
    ctx.moveTo(cx - 2, cy - height / 2);
    ctx.lineTo(cx + 2, cy - height / 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}
