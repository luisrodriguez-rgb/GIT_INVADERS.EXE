/**
 * GIT_INVADERS.EXE // SHIP SURFACE DETAILS
 * Renders mechanical secondary detail:
 * - Panel seams with ambient occlusion
 * - Heavy industrial rivets & structural bolts
 * - Heat dissipation grilles & cooling vents
 * - Energy conduit cables
 * - Serial numbers & caution hazard markings
 */

export class ShipSurfaceDetails {
  /**
   * Draws realistic panel seams with 1px dark groove and a faint 0.5px highlight edge.
   */
  public static drawPanelSeam(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): void {
    ctx.save();
    // 1. Dark seam groove
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. Faint edge highlight
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 1);
    ctx.lineTo(x2, y2 + 1);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draws industrial structural rivets at discrete coordinates.
   */
  public static drawRivets(
    ctx: CanvasRenderingContext2D,
    points: Array<{ x: number; y: number }>
  ): void {
    ctx.save();
    for (const pt of points) {
      // Outer rim
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#020610';
      ctx.fill();

      // Metallic center pin
      ctx.beginPath();
      ctx.arc(pt.x - 0.3, pt.y - 0.3, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Draws a heat dissipation vent / cooling grille.
   */
  public static drawCoolingVents(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    slatCount: number = 3
  ): void {
    ctx.save();
    const spacing = 2.5;
    const halfW = width / 2;
    const startY = cy - (slatCount * spacing) / 2;

    for (let i = 0; i < slatCount; i++) {
      const y = startY + i * spacing;
      ctx.beginPath();
      ctx.moveTo(cx - halfW, y);
      ctx.lineTo(cx + halfW, y);
      ctx.strokeStyle = '#02050d';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - halfW, y + 0.8);
      ctx.lineTo(cx + halfW, y + 0.8);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Draws an industrial warning hazard stripe or technical serial marking.
   */
  public static drawTechnicalLabel(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string = '#64748b'
  ): void {
    ctx.save();
    ctx.font = '700 4px "JetBrains Mono", monospace';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /**
   * Draws flexible high-voltage energy conduit cables across hardpoints.
   */
  public static drawEnergyConduit(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    ctrlX: number,
    ctrlY: number,
    accentColor: string = '#00e5ff'
  ): void {
    ctx.save();
    // Cable rubber outer
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    ctx.strokeStyle = '#050b14';
    ctx.lineWidth = 2.0;
    ctx.stroke();

    // Pulse core
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 0.8;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 3;
    ctx.stroke();
    ctx.restore();
  }
}
