/**
 * GIT_INVADERS.EXE // BRANCH DRONE RENDERER
 * High-speed variable-geometry switchblade drone:
 * - Variable sweep wing prongs (splay wide during attack, fold sleek during flight)
 * - Dual diverging afterburner thrusters with particle spark emissions
 * - Central git-checkout nexus with luminous lineage commit dots
 * - Cyan & amber telemetry markers
 */

export class BranchRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    animFrame: number,
    color: string = '#38bdf8'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const hw = width / 2;
    const hh = height / 2;
    const isFrameB = animFrame % 2 !== 0;
    // Variable wing sweep spread
    const tineSpread = isFrameB ? 1.15 : 0.9;
    const sweepAngle = isFrameB ? 0.22 : 0;

    // 1. Dual Diverging Thruster Exhausts with Spark FX
    const plumeLen = 9 + (isFrameB ? 4 : 0);
    const thrusterGrad = ctx.createLinearGradient(0, hh * 0.55, 0, hh * 0.55 + plumeLen);
    thrusterGrad.addColorStop(0, color);
    thrusterGrad.addColorStop(0.5, color);
    thrusterGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = thrusterGrad;
    ctx.fillRect(-hw * 0.55, hh * 0.55, 3.5, plumeLen);
    ctx.fillRect(hw * 0.55 - 3.5, hh * 0.55, 3.5, plumeLen);

    // Afterburner sparks
    if (isFrameB) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-hw * 0.52, hh * 0.55 + plumeLen + 2, 2, 2);
      ctx.fillRect(hw * 0.52 - 2, hh * 0.55 + plumeLen + 2, 2, 2);
    }

    // 2. Variable-Geometry Forked Wings (Twin Switchblades)
    // Left Wing Prong
    ctx.save();
    ctx.rotate(-sweepAngle);
    const wingL = new Path2D();
    wingL.moveTo(-hw * 0.18, -hh * 0.9);
    wingL.lineTo(-hw * 1.05 * tineSpread, -hh * 0.2);
    wingL.lineTo(-hw * 0.65, hh * 0.65);
    wingL.lineTo(-hw * 0.15, hh * 0.35);
    wingL.closePath();

    ctx.fillStyle = '#071626';
    ctx.fill(wingL);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.stroke(wingL);
    ctx.restore();

    // Right Wing Prong
    ctx.save();
    ctx.rotate(sweepAngle);
    const wingR = new Path2D();
    wingR.moveTo(hw * 0.18, -hh * 0.9);
    wingR.lineTo(hw * 1.05 * tineSpread, -hh * 0.2);
    wingR.lineTo(hw * 0.65, hh * 0.65);
    wingR.lineTo(hw * 0.15, hh * 0.35);
    wingR.closePath();

    ctx.fillStyle = '#071626';
    ctx.fill(wingR);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.stroke(wingR);
    ctx.restore();

    // 3. Central Fork Nexus (Bridge between branch tines)
    const nexus = new Path2D();
    nexus.moveTo(0, -hh * 0.4);
    nexus.lineTo(hw * 0.32, hh * 0.1);
    nexus.lineTo(0, hh * 0.6);
    nexus.lineTo(-hw * 0.32, hh * 0.1);
    nexus.closePath();

    ctx.fillStyle = '#0f2947';
    ctx.fill(nexus);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.4;
    ctx.stroke(nexus);

    // 4. Git Branch Nodes & Lineage Line
    ctx.fillStyle = '#ffffff';
    const dots = [
      { x: 0, y: -hh * 0.1 },
      { x: -hw * 0.48 * tineSpread, y: 0 },
      { x: hw * 0.48 * tineSpread, y: 0 },
    ];
    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -hh * 0.1);
    ctx.lineTo(-hw * 0.48 * tineSpread, 0);
    ctx.moveTo(0, -hh * 0.1);
    ctx.lineTo(hw * 0.48 * tineSpread, 0);
    ctx.stroke();

    ctx.restore();
  }
}
