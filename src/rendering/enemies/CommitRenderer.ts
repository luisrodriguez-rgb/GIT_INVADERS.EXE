/**
 * GIT_INVADERS.EXE // COMMIT INVADER RENDERER
 * Modular tactical cyber-drone with tier variations:
 * - Regular Commit (Hexagonal drone with twin stabilizer fins)
 * - Merge Commit (Dual-core interlaced nodes with git branch connector)
 * - Hotfix Commit (Heavy angular crimson chassis with reinforced prow)
 * - Holographic #SHA chip badge with dark glass container
 * - High-intensity commit reactor node
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
    const finAngle = isFrameB ? 0.35 : -0.12;
    const hw = width / 2;
    const hh = height / 2;

    const isHotfix = color.includes('ef4444') || color.includes('ff0055');
    const isMerge = color.includes('38bdf8') || color.includes('00e5ff');

    // 1. Holographic #SHA Tag Chip (Clean glass pill badge)
    ctx.save();
    const shaText = `#${commitSha.slice(0, 5)}`;
    ctx.font = 'bold 6.5px "JetBrains Mono", monospace';
    const tagW = 32;
    const tagH = 9;
    const tagY = -hh * 1.35;

    ctx.fillStyle = 'rgba(4, 10, 20, 0.85)';
    ctx.fillRect(-tagW / 2, tagY - tagH / 2, tagW, tagH);
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-tagW / 2, tagY - tagH / 2, tagW, tagH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shaText, 0, tagY);
    ctx.restore();

    // 2. Dual Micro Ion Thruster Plumes
    const plumeLen = 7 + (isFrameB ? 3 : 0);
    const thrusterGrad = ctx.createLinearGradient(0, hh * 0.7, 0, hh * 0.7 + plumeLen);
    thrusterGrad.addColorStop(0, color);
    thrusterGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = thrusterGrad;
    ctx.fillRect(-hw * 0.35, hh * 0.65, 3.5, plumeLen);
    ctx.fillRect(hw * 0.35 - 3.5, hh * 0.65, 3.5, plumeLen);

    // Thruster Nozzle Housings
    ctx.fillStyle = '#06121e';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillRect(-hw * 0.42, hh * 0.52, 5, 4);
    ctx.strokeRect(-hw * 0.42, hh * 0.52, 5, 4);
    ctx.fillRect(hw * 0.42 - 5, hh * 0.52, 5, 4);
    ctx.strokeRect(hw * 0.42 - 5, hh * 0.52, 5, 4);

    // 3. Articulated Stabilizer Fins (Angular Mechanical Brackets)
    ctx.save();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = color;

    // Port Fin
    ctx.beginPath();
    ctx.moveTo(-hw * 0.42, -hh * 0.15);
    ctx.lineTo(-hw * 0.96, hh * 0.45 + finAngle * 8);
    ctx.lineTo(-hw * 0.38, hh * 0.65);
    ctx.stroke();

    // Port Pivot Joint
    ctx.beginPath();
    ctx.arc(-hw * 0.42, -hh * 0.15, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.stroke();

    // Starboard Fin
    ctx.beginPath();
    ctx.moveTo(hw * 0.42, -hh * 0.15);
    ctx.lineTo(hw * 0.96, hh * 0.45 + finAngle * 8);
    ctx.lineTo(hw * 0.38, hh * 0.65);
    ctx.stroke();

    // Starboard Pivot Joint
    ctx.beginPath();
    ctx.arc(hw * 0.42, -hh * 0.15, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 4. Variant-Specific Drone Hull
    if (isMerge) {
      // DUAL-CORE MERGE DRONE
      const mergeHull = new Path2D();
      mergeHull.moveTo(0, -hh * 0.9);
      mergeHull.lineTo(hw * 0.65, -hh * 0.2);
      mergeHull.lineTo(hw * 0.45, hh * 0.65);
      mergeHull.lineTo(0, hh * 0.45);
      mergeHull.lineTo(-hw * 0.45, hh * 0.65);
      mergeHull.lineTo(-hw * 0.65, -hh * 0.2);
      mergeHull.closePath();

      ctx.fillStyle = '#061a29';
      ctx.fill(mergeHull);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.stroke(mergeHull);

      // Dual Interconnected Branch Nodes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-hw * 0.2, 0, 3, 0, Math.PI * 2);
      ctx.arc(hw * 0.2, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      // Connector line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-hw * 0.2, 0);
      ctx.lineTo(hw * 0.2, 0);
      ctx.stroke();
    } else if (isHotfix) {
      // HEAVY ANGULAR HOTFIX DRONE
      const hotfixHull = new Path2D();
      hotfixHull.moveTo(0, -hh * 1.0);
      hotfixHull.lineTo(hw * 0.65, hh * 0.2);
      hotfixHull.lineTo(hw * 0.35, hh * 0.7);
      hotfixHull.lineTo(-hw * 0.35, hh * 0.7);
      hotfixHull.lineTo(-hw * 0.65, hh * 0.2);
      hotfixHull.closePath();

      ctx.fillStyle = '#260a12';
      ctx.fill(hotfixHull);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.0;
      ctx.stroke(hotfixHull);

      // Emergency Hazard Crosshair
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -hh * 0.4);
      ctx.lineTo(0, hh * 0.4);
      ctx.moveTo(-hw * 0.25, 0);
      ctx.lineTo(hw * 0.25, 0);
      ctx.stroke();
    } else {
      // STANDARD HEXAGONAL COMMIT CHASSIS
      const hexPath = new Path2D();
      hexPath.moveTo(0, -hh * 0.95);
      hexPath.lineTo(hw * 0.65, -hh * 0.35);
      hexPath.lineTo(hw * 0.55, hh * 0.65);
      hexPath.lineTo(0, hh * 0.9);
      hexPath.lineTo(-hw * 0.55, hh * 0.65);
      hexPath.lineTo(-hw * 0.65, -hh * 0.35);
      hexPath.closePath();

      ctx.fillStyle = '#03140c';
      ctx.fill(hexPath);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.stroke(hexPath);

      // Inner plate with ambient occlusion
      const innerHex = new Path2D();
      innerHex.moveTo(0, -hh * 0.7);
      innerHex.lineTo(hw * 0.45, -hh * 0.25);
      innerHex.lineTo(hw * 0.38, hh * 0.48);
      innerHex.lineTo(0, hh * 0.65);
      innerHex.lineTo(-hw * 0.38, hh * 0.48);
      innerHex.lineTo(-hw * 0.45, -hh * 0.25);
      innerHex.closePath();

      ctx.fillStyle = '#062817';
      ctx.fill(innerHex);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1;
      ctx.stroke(innerHex);

      // Central Commit Node Reactor
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.globalAlpha = 0.6;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}
