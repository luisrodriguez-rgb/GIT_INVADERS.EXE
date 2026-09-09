/**
 * GIT_INVADERS.EXE // ARMORED PULL REQUEST RENDERER
 * Heavy tactical cyber-cruiser:
 * - Multi-layer fortress plates with thermal stress fissures when damaged
 * - 4-quadrant segmented deflector shield rings with active neon glow
 * - Animated holographic PR billboard with scanning laser sweep
 * - Git branch merge node connection topology
 * - Dual heavy forward cannon barrels with energy conduits
 */

export class PRRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shields: number,
    maxShields: number,
    prNumber: number = 42,
    status: string = 'OPEN'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const isMerged = status === 'MERGED';
    const statusColor = isMerged
      ? '#10b981'
      : status === 'APPROVED'
      ? '#38bdf8'
      : status === 'REVIEW'
      ? '#fbbf24'
      : '#c084fc';

    const hw = width / 2;
    const hh = height / 2;
    const time = Date.now() * 0.003;

    // 1. Holographic PR Status Billboard with Animated Laser Scan
    ctx.save();
    const cardW = width * 1.05;
    const cardH = 11;
    const cardY = -hh - 10;

    // Background pill
    ctx.fillStyle = 'rgba(4, 10, 24, 0.88)';
    ctx.fillRect(-cardW / 2, cardY - cardH / 2, cardW, cardH);
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(-cardW / 2, cardY - cardH / 2, cardW, cardH);

    // Laser scanning sweep line
    const scanX = Math.sin(time * 4) * (cardW * 0.44);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(scanX, cardY - cardH / 2);
    ctx.lineTo(scanX, cardY + cardH / 2);
    ctx.stroke();

    // Billboard text
    ctx.font = 'bold 7px "JetBrains Mono", monospace';
    ctx.fillStyle = statusColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`<< PR #${prNumber} : ${status} >>`, 0, cardY);
    ctx.restore();

    // 2. 4-Quadrant Segmented Shield Ring
    if (shields > 0) {
      const shieldRadius = hw * 1.16;
      const arcLen = (Math.PI * 2) / 4;
      ctx.lineWidth = 2.4;

      for (let q = 0; q < 4; q++) {
        ctx.beginPath();
        const startA = q * arcLen + 0.18;
        const endA = (q + 1) * arcLen - 0.18;
        ctx.arc(0, 0, shieldRadius, startA, endA);

        if (q < shields) {
          ctx.strokeStyle = statusColor;
          ctx.shadowColor = statusColor;
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // 3. Forward Heavy Cannon Barrels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-hw * 0.45, hh * 0.4, 4, 10);
    ctx.fillRect(hw * 0.45 - 4, hh * 0.4, 4, 10);
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(-hw * 0.43, hh * 0.4 + 10, 1.5, 0, Math.PI * 2);
    ctx.arc(hw * 0.43, hh * 0.4 + 10, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Multi-layer Armored Diamond Cruiser Chassis
    // Layer 1: Dark structural base
    const baseHull = new Path2D();
    baseHull.moveTo(0, hh * 0.95);
    baseHull.lineTo(hw * 0.95, 0);
    baseHull.lineTo(hw * 0.65, -hh * 0.85);
    baseHull.lineTo(-hw * 0.65, -hh * 0.85);
    baseHull.lineTo(-hw * 0.95, 0);
    baseHull.closePath();

    ctx.fillStyle = isMerged ? '#021e17' : '#0d1222';
    ctx.fill(baseHull);
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 2.0;
    ctx.stroke(baseHull);

    // Layer 2: Raised Beveled Armor Plates (Port & Starboard Wings)
    const plateL = new Path2D();
    plateL.moveTo(-hw * 0.15, hh * 0.6);
    plateL.lineTo(-hw * 0.82, 0);
    plateL.lineTo(-hw * 0.55, -hh * 0.65);
    plateL.lineTo(-hw * 0.15, -hh * 0.35);
    plateL.closePath();

    ctx.fillStyle = isMerged ? '#064e3b' : '#1e1b4b';
    ctx.fill(plateL);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.stroke(plateL);

    const plateR = new Path2D();
    plateR.moveTo(hw * 0.15, hh * 0.6);
    plateR.lineTo(hw * 0.82, 0);
    plateR.lineTo(hw * 0.55, -hh * 0.65);
    plateR.lineTo(hw * 0.15, -hh * 0.35);
    plateR.closePath();

    ctx.fillStyle = isMerged ? '#064e3b' : '#1e1b4b';
    ctx.fill(plateR);
    ctx.stroke(plateR);

    // 5. Thermal Stress Fissures (When shields are damaged)
    if (shields < maxShields) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.6, -hh * 0.2);
      ctx.lineTo(-hw * 0.45, 0);
      ctx.lineTo(-hw * 0.35, -hh * 0.1);
      ctx.stroke();

      if (shields <= 1) {
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(hw * 0.5, -hh * 0.3);
        ctx.lineTo(hw * 0.35, 0);
        ctx.lineTo(hw * 0.55, hh * 0.2);
        ctx.stroke();
      }
    }

    // 6. Fastener Rivets
    const rivets = [
      { x: -hw * 0.5, y: -hh * 0.4 },
      { x: -hw * 0.65, y: 0 },
      { x: hw * 0.5, y: -hh * 0.4 },
      { x: hw * 0.65, y: 0 },
      { x: 0, y: hh * 0.75 },
    ];
    for (const r of rivets) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // 7. Git Topology Merge Branch Graphic (Central Core)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-hw * 0.22, -hh * 0.12, 3.2, 0, Math.PI * 2);
    ctx.arc(hw * 0.22, hh * 0.12, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Curved merge line
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.22, -hh * 0.12);
    ctx.quadraticCurveTo(0, 0, hw * 0.22, hh * 0.12);
    ctx.stroke();
    ctx.restore();

    // 8. Dual Heavy Thruster Blocks at Rear
    ctx.fillStyle = '#060d1a';
    ctx.fillRect(-hw * 0.4, -hh * 0.95, 6, 4);
    ctx.fillRect(hw * 0.4 - 6, -hh * 0.95, 6, 4);

    ctx.restore();
  }
}
