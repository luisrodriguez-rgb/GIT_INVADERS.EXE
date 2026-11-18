/**
 * GIT_INVADERS.EXE // SECURITY SENTINEL RENDERER (Aegis Mecha-Golem Bastion)
 * Structured Mecha-Guardian matching Boss #9 anatomy:
 * - Horned armored guardian helmet with glowing visor optic
 * - Heavy steel chest core with hazard chevrons
 * - Twin floating hexagonal energy-shield gauntlets on flanks
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
    const pulse = 0.85 + Math.sin(time * 7) * 0.15;
    const skyColor = '#38bdf8';
    const goldColor = '#f59e0b';

    // 1. Twin Floating Hexagonal Gauntlet Shields (left & right shoulders)
    [-1, 1].forEach((dir) => {
      const gx = dir * hw * 0.88;
      const gy = Math.sin(time * 4 + dir) * 2.5;
      ctx.save();
      ctx.fillStyle = isShieldActive ? 'rgba(56, 189, 248, 0.28)' : 'rgba(100, 116, 139, 0.25)';
      ctx.strokeStyle = isShieldActive ? skyColor : '#64748b';
      ctx.lineWidth = 1.6;
      if (isShieldActive) {
        ctx.shadowColor = skyColor;
        ctx.shadowBlur = 7;
      }
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const px = gx + Math.cos(a) * (hw * 0.38);
        const py = gy + Math.sin(a) * (hh * 0.52);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner shield rune
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, gy - hh * 0.25);
      ctx.lineTo(gx + dir * 3, gy);
      ctx.lineTo(gx, gy + hh * 0.25);
      ctx.stroke();
      ctx.restore();
    });

    // 2. Armored Golem Torso & Pauldrons
    const torso = new Path2D();
    torso.moveTo(-hw * 0.52, -hh * 0.55);
    torso.lineTo(hw * 0.52, -hh * 0.55);
    torso.lineTo(hw * 0.68, -hh * 0.1);
    torso.lineTo(hw * 0.44, hh * 0.82);
    torso.lineTo(-hw * 0.44, hh * 0.82);
    torso.lineTo(-hw * 0.68, -hh * 0.1);
    torso.closePath();

    const grad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    grad.addColorStop(0, '#334155');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fill(torso);
    ctx.strokeStyle = isShieldActive ? skyColor : goldColor;
    ctx.lineWidth = 1.8;
    ctx.stroke(torso);

    // 3. Horned Mecha Helmet & Visor
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.28, -hh * 0.52);
    ctx.lineTo(-hw * 0.42, -hh * 1.02);
    ctx.lineTo(-hw * 0.12, -hh * 0.78);
    ctx.lineTo(hw * 0.12, -hh * 0.78);
    ctx.lineTo(hw * 0.42, -hh * 1.02);
    ctx.lineTo(hw * 0.28, -hh * 0.52);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Golem Eye Visor
    ctx.fillStyle = isShieldActive ? skyColor : '#ef4444';
    ctx.fillRect(-hw * 0.18, -hh * 0.64, hw * 0.36, 3);

    // 4. Central Chest Padlock Core
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-4, hh * 0.02, 8, 6.5);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, hh * 0.02, 3.2, Math.PI, 0);
    ctx.stroke();

    ctx.fillStyle = goldColor;
    ctx.beginPath();
    ctx.arc(0, hh * 0.2, 1.5 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
