/**
 * GIT_INVADERS.EXE // SHIP DAMAGE
 * Visual realization of DamageMap degradation states:
 * - Scratches and plate fractures
 * - Kinetic electrical discharge sparks
 * - Trailing smoke plumes
 * - Critical alert strobing
 */

import { DamageMap, DamageZoneId } from './DamageMap';

export class ShipDamage {
  /**
   * Renders localized damage decals, fractures, and emergency sparks on the ship.
   */
  public static renderDamageOverlay(
    ctx: CanvasRenderingContext2D,
    damageMap: DamageMap,
    cx: number,
    cy: number,
    width: number,
    height: number,
    time: number
  ): void {
    ctx.save();

    // 1. Critical Red Warning Strobe (When core is below 25%)
    if (damageMap.zones.CORE.hp < 0.25) {
      const strobe = Math.sin(time * 16) > 0.1;
      if (strobe) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, width * 0.45, height * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Zone-specific fractures & sparks
    this.checkAndRenderZone(ctx, damageMap, 'LEFT_WING', cx - width * 0.35, cy + height * 0.1, time);
    this.checkAndRenderZone(ctx, damageMap, 'RIGHT_WING', cx + width * 0.35, cy + height * 0.1, time);
    this.checkAndRenderZone(ctx, damageMap, 'ENGINE_LEFT', cx - width * 0.18, cy + height * 0.38, time);
    this.checkAndRenderZone(ctx, damageMap, 'ENGINE_RIGHT', cx + width * 0.18, cy + height * 0.38, time);

    ctx.restore();
  }

  private static checkAndRenderZone(
    ctx: CanvasRenderingContext2D,
    damageMap: DamageMap,
    zoneId: DamageZoneId,
    zx: number,
    zy: number,
    time: number
  ): void {
    const zone = damageMap.zones[zoneId];
    if (!zone || zone.state === 'clean') return;

    // Scratches & Fractures
    if (zone.state === 'damaged' || zone.state === 'critical' || zone.state === 'destroyed') {
      ctx.beginPath();
      ctx.moveTo(zx - 3, zy - 2);
      ctx.lineTo(zx, zy + 2);
      ctx.lineTo(zx + 4, zy - 1);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(zx - 3, zy - 1.5);
      ctx.lineTo(zx, zy + 2.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Kinetic Sparks (for critical or destroyed zones)
    if (zone.state === 'critical' || zone.state === 'destroyed') {
      const sparkCount = 3;
      for (let i = 0; i < sparkCount; i++) {
        const offset = Math.sin(time * 30 + i * 2) * 5;
        const sparkY = zy + Math.cos(time * 25 + i * 3) * 4;
        ctx.beginPath();
        ctx.arc(zx + offset, sparkY, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ef4444';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
    }
  }
}
