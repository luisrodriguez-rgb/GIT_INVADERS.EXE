/**
 * GIT_INVADERS.EXE // SHIP ANIMATION
 * Computes and applies secondary motion transforms:
 * - Banking roll (lateral tilt on strafing movement)
 * - Idle breathing hover on vertical plane
 * - Weapon recoil kickback recovery
 */

export interface AnimationState {
  rollAngle: number;       // Radians (-0.15 to +0.15)
  hoverOffsetY: number;    // Pixels (-2 to +2)
  recoilLeft: number;      // Pixels (0 to 4)
  recoilRight: number;     // Pixels (0 to 4)
}

export class ShipAnimation {
  /**
   * Calculates dynamic animation state based on movement velocity and time.
   */
  public static calculate(
    vx: number,
    time: number,
    isHovering: boolean = true,
    recoilLeft: number = 0,
    recoilRight: number = 0
  ): AnimationState {
    // 1. Banking Roll: Tilts ship proportionally to horizontal velocity
    const targetRoll = Math.max(-0.15, Math.min(0.15, (vx / 300) * 0.15));

    // 2. Subtle Idle Hover (1.8 Hz floating motion in Hangar)
    const hoverOffsetY = isHovering ? Math.sin(time * 2.2) * 2.2 : 0;

    return {
      rollAngle: targetRoll,
      hoverOffsetY,
      recoilLeft,
      recoilRight,
    };
  }

  /**
   * Applies secondary motion transform to the rendering context.
   */
  public static applyTransform(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    anim: AnimationState
  ): void {
    ctx.translate(cx, cy + anim.hoverOffsetY);
    if (anim.rollAngle !== 0) {
      ctx.rotate(anim.rollAngle);
    }
  }
}
