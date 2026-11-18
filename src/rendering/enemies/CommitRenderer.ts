/**
 * GIT_INVADERS.EXE // COMMIT INVADER RENDERER (Articulated Cyber-Creature Invaders)
 * Structured Space-Invader bio-mechanical alien ships replacing flat boxes:
 * - Standard Alien Cyber-Scout: Armored crab-carapace, twin articulated pincer claws, glowing eyes & 4 legs
 * - Merge Alien Twin-Core: Twin horned cyber-mantis interceptor with bifurcated blades
 * - Hotfix Crimson Hornet: Fanged bio-interceptor with swept razor wings
 */

export class CommitRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    animFrame: number,
    color: string = '#00ff66',
    commitSha: string = '7f3a2c'
  ): void {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    const isFrameB = animFrame % 2 !== 0;
    const hw = width / 2;
    const hh = height / 2;

    const isHotfix = color.includes('ef4444') || color.includes('ff0055');
    const isMerge = color.includes('38bdf8') || color.includes('00e5ff');

    // 1. Subtle SHA Tag above invader (clean, unobtrusive)
    ctx.save();
    ctx.font = 'bold 6px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.78)';
    ctx.textAlign = 'center';
    ctx.fillText(`#${commitSha.slice(0, 5)}`, 0, -hh - 3);
    ctx.restore();

    // 2. Articulated Alien Legs / Claw Pincers (animate up/down per frame)
    const legLift = isFrameB ? -3 : 3;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    [-1, 1].forEach((dir) => {
      // Upper pincer claw
      ctx.beginPath();
      ctx.moveTo(dir * hw * 0.46, -hh * 0.15);
      ctx.lineTo(dir * hw * 0.96, -hh * 0.55 + legLift);
      ctx.lineTo(dir * hw * 0.78, -hh * 0.85 + legLift);
      ctx.stroke();

      // Outer articulated leg
      ctx.beginPath();
      ctx.moveTo(dir * hw * 0.48, hh * 0.25);
      ctx.lineTo(dir * hw * 0.92, hh * 0.55 - legLift);
      ctx.lineTo(dir * hw * 0.72, hh * 0.92 - legLift);
      ctx.stroke();

      // Inner leg
      ctx.beginPath();
      ctx.moveTo(dir * hw * 0.24, hh * 0.45);
      ctx.lineTo(dir * hw * 0.36, hh * 0.9 + legLift * 0.6);
      ctx.stroke();
    });

    // 3. Structured Bio-Mechanical Alien Carapace Body
    if (isMerge) {
      // Twin-Horned Cyber Mantis Silhouette
      const hull = new Path2D();
      hull.moveTo(0, -hh * 0.45);
      hull.lineTo(hw * 0.38, -hh * 0.95);
      hull.lineTo(hw * 0.68, -hh * 0.2);
      hull.lineTo(hw * 0.45, hh * 0.68);
      hull.lineTo(0, hh * 0.42);
      hull.lineTo(-hw * 0.45, hh * 0.68);
      hull.lineTo(-hw * 0.68, -hh * 0.2);
      hull.lineTo(-hw * 0.38, -hh * 0.95);
      hull.closePath();
      ctx.fillStyle = '#0c2d48';
      ctx.fill(hull);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.stroke(hull);
    } else if (isHotfix) {
      // Fanged Crimson Alien Hornet
      const hull = new Path2D();
      hull.moveTo(0, -hh * 0.92);
      hull.lineTo(hw * 0.72, -hh * 0.15);
      hull.lineTo(hw * 0.52, hh * 0.55);
      hull.lineTo(hw * 0.18, hh * 0.85);
      hull.lineTo(0, hh * 0.52);
      hull.lineTo(-hw * 0.18, hh * 0.85);
      hull.lineTo(-hw * 0.52, hh * 0.55);
      hull.lineTo(-hw * 0.72, -hh * 0.15);
      hull.closePath();
      ctx.fillStyle = '#3b0a18';
      ctx.fill(hull);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;
      ctx.stroke(hull);
    } else {
      // Classic Dome-Backed Alien Crab Invader
      const dome = new Path2D();
      dome.moveTo(-hw * 0.66, hh * 0.15);
      dome.quadraticCurveTo(-hw * 0.62, -hh * 0.88, 0, -hh * 0.88);
      dome.quadraticCurveTo(hw * 0.62, -hh * 0.88, hw * 0.66, hh * 0.15);
      dome.lineTo(hw * 0.42, hh * 0.64);
      dome.lineTo(-hw * 0.42, hh * 0.64);
      dome.closePath();

      const grad = ctx.createLinearGradient(0, -hh, 0, hh);
      grad.addColorStop(0, '#334155');
      grad.addColorStop(0.6, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fill(dome);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;
      ctx.stroke(dome);
    }

    // 4. Twin Glowing Predator Eyes + Central Reactor Crest
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.24, -hh * 0.08, 2.8, 1.8, 0.25, 0, Math.PI * 2);
    ctx.ellipse(hw * 0.24, -hh * 0.08, 2.8, 1.8, -0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, hh * 0.24, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
