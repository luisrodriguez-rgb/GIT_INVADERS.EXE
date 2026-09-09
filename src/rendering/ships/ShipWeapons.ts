/**
 * GIT_INVADERS.EXE // SHIP WEAPONS
 * Anatomical weapon systems:
 * - Hardpoints with mounting bolts
 * - Dual/quad heavy barrels with heat-sink fins
 * - Energy capacitor glow
 * - Dynamic recoil & muzzle flash bloom
 */

import { ShipMaterials } from './ShipMaterials';

export class ShipWeapons {
  /**
   * Renders a cannon hardpoint assembly.
   */
  public static renderCannon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    barrelLength: number = 10,
    recoilOffset: number = 0,
    capacitorColor: string = '#00e5ff',
    isFiring: boolean = false
  ): void {
    ctx.save();
    const effectiveY = y + recoilOffset;

    // 1. Hardpoint Mounting Block
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(x - 3, effectiveY, 6, 6);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 3, effectiveY, 6, 6);

    // 2. Heavy Gun Barrel
    const barrelGrad = ctx.createLinearGradient(x - 1.5, effectiveY, x + 1.5, effectiveY);
    barrelGrad.addColorStop(0, '#0f172a');
    barrelGrad.addColorStop(0.5, '#475569');
    barrelGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = barrelGrad;
    ctx.fillRect(x - 1.5, effectiveY - barrelLength, 3, barrelLength);

    // Heat-sink cooling fins (2 tiny ridges)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - 2.5, effectiveY - barrelLength * 0.4);
    ctx.lineTo(x + 2.5, effectiveY - barrelLength * 0.4);
    ctx.moveTo(x - 2.5, effectiveY - barrelLength * 0.7);
    ctx.lineTo(x + 2.5, effectiveY - barrelLength * 0.7);
    ctx.stroke();

    // 3. Energy Capacitor Core (Small high-intensity pip)
    ctx.beginPath();
    ctx.arc(x, effectiveY + 3, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = capacitorColor;
    ctx.shadowColor = capacitorColor;
    ctx.shadowBlur = 4;
    ctx.fill();

    // 4. Muzzle Flash (Additive bloom when firing)
    if (isFiring) {
      ShipMaterials.withAdditiveBlend(ctx, () => {
        const muzzleY = effectiveY - barrelLength;
        const flashGrad = ctx.createRadialGradient(x, muzzleY, 1, x, muzzleY, 9);
        flashGrad.addColorStop(0, '#ffffff');
        flashGrad.addColorStop(0.4, capacitorColor);
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(x, muzzleY, 9, 0, Math.PI * 2);
        ctx.fillStyle = flashGrad;
        ctx.fill();
      });
    }

    ctx.restore();
  }
}
