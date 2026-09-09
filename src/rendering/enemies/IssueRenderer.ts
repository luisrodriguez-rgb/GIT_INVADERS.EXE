/**
 * GIT_INVADERS.EXE // ISSUE BOMBER RENDERER
 * Menacing biomechanical cyber-wasp drone:
 * - 6 articulated robotic legs (3 per side) with 3 mechanical linkages
 * - Glowing compound cyber-eyes with hexagonal sub-pixels
 * - Forward red laser targeting beam projected when diving
 * - Acidic plasma stinger with drop hazard warning
 * - Segmented chitinous abdomen with chiseled carapace plates
 */

export class IssueRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    isDiving: boolean = false
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const hw = width / 2;
    const hh = height / 2;
    const stingerPulse = 0.85 + Math.sin(time * 12) * 0.2;

    // 1. Tactical Target Acquisition Laser & Reticle (when diving)
    if (isDiving) {
      ctx.save();
      // Forward projected laser line down towards player
      const laserGrad = ctx.createLinearGradient(0, hh * 0.5, 0, hh * 4);
      laserGrad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
      laserGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.4)');
      laserGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.strokeStyle = laserGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, hh * 0.5);
      ctx.lineTo(0, hh * 4.5);
      ctx.stroke();

      // Outer reticle circle
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, hw * 1.35, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(-hw * 1.5, 0);
      ctx.lineTo(-hw * 0.95, 0);
      ctx.moveTo(hw * 0.95, 0);
      ctx.lineTo(hw * 1.5, 0);
      ctx.moveTo(0, -hh * 1.5);
      ctx.lineTo(0, -hh * 0.95);
      ctx.moveTo(0, hh * 0.95);
      ctx.lineTo(0, hh * 1.5);
      ctx.stroke();

      // Warning text
      ctx.font = 'bold 6.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('! TARGET LOCK !', 0, -hh * 1.6);
      ctx.restore();
    }

    // 2. 6 Articulated Mechanical Legs (3 on left, 3 on right, with 3 joints each!)
    ctx.save();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;

    [-1, 1].forEach((dir) => {
      for (let leg = 0; leg < 3; leg++) {
        const legPhase = Math.sin(time * 16 + leg * 1.8) * 5;
        const rootY = -hh * 0.35 + leg * (hh * 0.35);

        // Joint 1: Coxa -> Joint 2: Femur -> Joint 3: Tibia
        const coxaX = dir * hw * 0.25;
        const femurX = dir * (hw * 0.65 + Math.abs(leg - 1) * 2);
        const femurY = rootY - hh * 0.2 + legPhase;
        const tibiaX = dir * (hw * 1.1 + leg * 3);
        const tibiaY = rootY + hh * 0.15 + legPhase * 1.2;

        ctx.beginPath();
        ctx.moveTo(coxaX, rootY);
        ctx.lineTo(femurX, femurY);
        ctx.lineTo(tibiaX, tibiaY);
        ctx.stroke();

        // Knee joint servos
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(femurX, femurY, 1.8, 0, Math.PI * 2);
        ctx.arc(tibiaX, tibiaY, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();

    // 3. Segmented Biomechanical Carapace Body
    // Abdomen Upper Shell
    const abdomen = new Path2D();
    abdomen.moveTo(0, -hh * 0.9);
    abdomen.lineTo(hw * 0.45, -hh * 0.4);
    abdomen.lineTo(hw * 0.35, hh * 0.2);
    abdomen.lineTo(-hw * 0.35, hh * 0.2);
    abdomen.lineTo(-hw * 0.45, -hh * 0.4);
    abdomen.closePath();

    ctx.fillStyle = '#1a0610';
    ctx.fill(abdomen);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.8;
    ctx.stroke(abdomen);

    // Stinger Thorax (Lower segment)
    const stinger = new Path2D();
    stinger.moveTo(-hw * 0.3, hh * 0.2);
    stinger.lineTo(hw * 0.3, hh * 0.2);
    stinger.lineTo(hw * 0.14, hh * 0.75);
    stinger.lineTo(0, hh * 0.96);
    stinger.lineTo(-hw * 0.14, hh * 0.75);
    stinger.closePath();

    ctx.fillStyle = '#2d0614';
    ctx.fill(stinger);
    ctx.stroke(stinger);

    // 4. Acidic Plasma Stinger Droplet Tip
    ctx.save();
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(0, hh * 0.94, 3.2 * stingerPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Faceted Compound Cyber-Eyes (Hexagonal sub-pixels)
    ctx.save();
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 6;

    // Center visor
    ctx.beginPath();
    ctx.arc(0, -hh * 0.2, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Left lateral facet
    ctx.beginPath();
    ctx.arc(-hw * 0.2, -hh * 0.4, 2.0, 0, Math.PI * 2);
    ctx.fill();

    // Right lateral facet
    ctx.beginPath();
    ctx.arc(hw * 0.2, -hh * 0.4, 2.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
}
