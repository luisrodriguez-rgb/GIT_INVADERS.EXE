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
    const hw = width * 0.55;
    const hh = height * 0.55;

    // 1. Silver-Titanium Multi-Strut Canopy Collar
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh - 3);
    ctx.lineTo(cx + hw + 2.5, cy + hh * 0.35);
    ctx.lineTo(cx + hw * 0.65, cy + hh + 1);
    ctx.lineTo(cx - hw * 0.65, cy + hh + 1);
    ctx.lineTo(cx - hw - 2.5, cy + hh * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Luminous Refractive Canopy Visor
    ShipMaterials.renderCockpitGlass(ctx, cx, cy, hw * 0.78, hh * 0.85, accentColor);

    // 3. Cross Frame Strut & Upper HUD Gleam
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.55, cy - hh * 0.15);
    ctx.lineTo(cx + hw * 0.55, cy - hh * 0.15);
    ctx.moveTo(cx, cy - hh * 0.85);
    ctx.lineTo(cx, cy + hh * 0.8);
    ctx.stroke();

    // 4. Dorsal Cockpit Avionics Core Glow
    const hudPulse = 0.65 + Math.sin(time * 4.0) * 0.3;
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = hudPulse;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.arc(cx, cy + 1, 2.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
