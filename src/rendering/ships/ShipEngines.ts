/**
 * GIT_INVADERS.EXE // SHIP ENGINES
 * Complex multi-stage propulsion assembly:
 * - Mechanical nozzle housing & thrust vectoring vanes
 * - Dual-layer plasma plume (pure white core + colored high-energy envelope)
 * - State engine: IDLE, ACCELERATE, BOOST, DAMAGE, SHUTDOWN
 */

import { ShipMaterials } from './ShipMaterials';

export type EngineThrustState = 'IDLE' | 'ACCELERATE' | 'BOOST' | 'DAMAGE' | 'SHUTDOWN';

export class ShipEngines {
  /**
   * Renders complete engine assembly at given emitter coordinates.
   */
  public static renderThruster(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    state: EngineThrustState,
    glowColor: string,
    time: number
  ): void {
    if (state === 'SHUTDOWN') return;

    // 1. Mechanical Housing & Nozzle Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#060d1a';
    ctx.fill();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Nozzle interior chamber
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#020610';
    ctx.fill();

    // Thrust vectoring vanes (2 cross vanes)
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.7, y);
    ctx.lineTo(x + radius * 0.7, y);
    ctx.moveTo(x, y - radius * 0.7);
    ctx.lineTo(x, y + radius * 0.7);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();

    // 2. Dynamic Plume Calculations
    let length = 14;
    let width = radius * 1.4;
    let coreAlpha = 0.9;
    let flicker = Math.sin(time * 25) * 0.15;

    switch (state) {
      case 'IDLE':
        length = 10 + Math.sin(time * 6) * 2.5;
        width = radius * 1.1;
        coreAlpha = 0.75 + Math.sin(time * 6) * 0.15;
        break;
      case 'ACCELERATE':
        length = 22 + Math.sin(time * 35) * 4;
        width = radius * 1.5;
        coreAlpha = 0.95;
        break;
      case 'BOOST':
        length = 36 + Math.sin(time * 50) * 6;
        width = radius * 1.9;
        coreAlpha = 1.0;
        flicker *= 1.5;
        break;
      case 'DAMAGE':
        // Unstable sputtering flame
        if (Math.sin(time * 18) > 0.4) return; // Cut-out micro stalls
        length = 12 + Math.sin(time * 40) * 8;
        width = radius * 1.2;
        coreAlpha = 0.6;
        break;
    }

    // 3. Multi-layer Additive Plasma Rendering
    ShipMaterials.withAdditiveBlend(ctx, () => {
      // Outer Plasma Envelope (Tear-drop flame)
      const flameGrad = ctx.createLinearGradient(x, y, x, y + length);
      flameGrad.addColorStop(0, glowColor);
      flameGrad.addColorStop(0.45, glowColor);
      flameGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.moveTo(x - width / 2, y + 2);
      ctx.quadraticCurveTo(x - width * 0.4, y + length * 0.6, x, y + length);
      ctx.quadraticCurveTo(x + width * 0.4, y + length * 0.6, x + width / 2, y + 2);
      ctx.closePath();

      ctx.fillStyle = flameGrad;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.fill();

      // Hyper-dense Inner White Core
      const coreLength = length * 0.55;
      const coreWidth = width * 0.45;

      const coreGrad = ctx.createLinearGradient(x, y, x, y + coreLength);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)');
      coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(x - coreWidth / 2, y + 2);
      ctx.quadraticCurveTo(x - coreWidth * 0.3, y + coreLength * 0.5, x, y + coreLength);
      ctx.quadraticCurveTo(x + coreWidth * 0.3, y + coreLength * 0.5, x + coreWidth / 2, y + 2);
      ctx.closePath();

      ctx.fillStyle = coreGrad;
      ctx.globalAlpha = coreAlpha;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.fill();
    });
  }
}
