/**
 * GIT_INVADERS.EXE // SECURITY SENTINEL RENDERER
 * Aegis cybersecurity bastion:
 * - Heavy octagonal ballistic fortress hull with hazard warning chevrons
 * - Animated cryptographic padlock that articulates when discharging firewall
 * - Electric crackling hexagonal firewall barrier perimeter
 * - Dual defense turret blisters and perimeter sensors
 */

export class SecurityRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    time: number,
    isShieldActive: boolean = true
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const hw = width / 2;
    const hh = height / 2;
    const alertPulse = 0.85 + Math.sin(time * 8) * 0.15;
    const amberColor = '#f59e0b';

    // 1. Crackling Hexagonal Firewall Barrier
    if (isShieldActive) {
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([7, 5]);
      ctx.lineDashOffset = -time * 18;

      const hexRadius = hw * 1.28;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * hexRadius;
        const hy = Math.sin(a) * hexRadius;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Electric sparks along firewall nodes
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * hexRadius;
        const hy = Math.sin(a) * hexRadius;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Heavy Octagonal Fortress Plating
    const fortress = new Path2D();
    fortress.moveTo(-hw * 0.42, -hh * 0.92);
    fortress.lineTo(hw * 0.42, -hh * 0.92);
    fortress.lineTo(hw * 0.94, -hh * 0.4);
    fortress.lineTo(hw * 0.94, hh * 0.4);
    fortress.lineTo(hw * 0.42, hh * 0.92);
    fortress.lineTo(-hw * 0.42, hh * 0.92);
    fortress.lineTo(-hw * 0.94, hh * 0.4);
    fortress.lineTo(-hw * 0.94, -hh * 0.4);
    fortress.closePath();

    ctx.fillStyle = '#170f05';
    ctx.fill(fortress);
    ctx.strokeStyle = amberColor;
    ctx.lineWidth = 2.2;
    ctx.stroke(fortress);

    // 3. Hazard Warning Chevrons (Black & Amber slashes on side armor)
    ctx.save();
    ctx.beginPath();
    ctx.rect(-hw * 0.88, -hh * 0.25, hw * 0.2, hh * 0.5);
    ctx.rect(hw * 0.68, -hh * 0.25, hw * 0.2, hh * 0.5);
    ctx.clip();
    for (let i = -15; i < 30; i += 6) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-hw + i, -hh);
      ctx.lineTo(-hw + i + 6, hh);
      ctx.moveTo(hw * 0.6 + i, -hh);
      ctx.lineTo(hw * 0.6 + i + 6, hh);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Inner Beveled Aegis Core Plate
    const innerPlate = new Path2D();
    innerPlate.moveTo(-hw * 0.28, -hh * 0.65);
    innerPlate.lineTo(hw * 0.28, -hh * 0.65);
    innerPlate.lineTo(hw * 0.65, -hh * 0.25);
    innerPlate.lineTo(hw * 0.65, hh * 0.25);
    innerPlate.lineTo(hw * 0.28, hh * 0.65);
    innerPlate.lineTo(-hw * 0.28, hh * 0.65);
    innerPlate.lineTo(-hw * 0.65, hh * 0.25);
    innerPlate.lineTo(-hw * 0.65, -hh * 0.25);
    innerPlate.closePath();

    ctx.fillStyle = '#291b07';
    ctx.fill(innerPlate);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.0;
    ctx.stroke(innerPlate);

    // 5. Articulated Cryptographic Padlock
    ctx.save();
    const isUnlocked = isShieldActive && Math.sin(time * 6) > 0.7;
    const shackleLift = isUnlocked ? -3 : 0;

    // Padlock Body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5, 0, 10, 8);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(-5, 0, 10, 8);

    // Shackle Arch
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -1 + shackleLift, 4, Math.PI, isUnlocked ? Math.PI * 1.8 : 0);
    ctx.stroke();

    // Glowing Keyhole
    ctx.fillStyle = amberColor;
    ctx.beginPath();
    ctx.arc(0, 3, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-0.8, 3.5, 1.6, 3);
    ctx.restore();

    // 6. Perimeter Sensor Beacons
    ctx.save();
    ctx.shadowColor = amberColor;
    ctx.shadowBlur = 8;
    ctx.fillStyle = amberColor;
    const sensors = [
      { x: -hw * 0.55, y: -hh * 0.55 },
      { x: hw * 0.55, y: -hh * 0.55 },
      { x: -hw * 0.55, y: hh * 0.55 },
      { x: hw * 0.55, y: hh * 0.55 },
    ];
    for (const s of sensors) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.8 * alertPulse, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.restore();
  }
}
