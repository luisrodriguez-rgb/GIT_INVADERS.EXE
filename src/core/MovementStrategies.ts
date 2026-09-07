/**
 * AI Movement Strategies for GIT_INVADERS.EXE
 * Modular flight physics and attack patterns for diverse enemy archetypes:
 * 1. FormationMovement: Synchronized grid step-and-drop
 * 2. ZigZagMovement: Sinusoidal lateral oscillation for agile bugs
 * 3. DiveAttack: High-velocity kamikaze intercept swoop targeting player
 * 4. TrackingAttack: Continuous angular vector steering toward player
 * 5. OrbitMovement: Concentric circular trajectory for dependency nodes & satellites
 * 6. SwarmMovement: Parametric multi-phase flocking fluctuation
 */

export interface MovementContext {
  x: number;
  y: number;
  width: number;
  height: number;
  originX: number;
  originY: number;
  timeAlive: number;
  phaseOffset: number;
  targetX?: number;
  targetY?: number;
  bounds: { width: number; height: number };
}

export interface MovementResult {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type MovementStrategyType =
  | 'formation'
  | 'zigzag'
  | 'dive'
  | 'tracking'
  | 'orbit'
  | 'swarm';

export class MovementStrategies {
  /**
   * 1. FormationMovement: Synchronized grid pacing.
   * Standard Space Invaders lateral march with edge drop.
   */
  public static formation(
    ctx: MovementContext,
    gridDirection: number,
    gridSpeed: number,
    dt: number
  ): MovementResult {
    const vx = gridSpeed * gridDirection;
    return {
      x: ctx.x + vx * dt,
      y: ctx.y,
      vx,
      vy: 0,
    };
  }

  /**
   * 2. ZigZagMovement: Sinusoidal lateral oscillation for agile bug bombers.
   */
  public static zigzag(
    ctx: MovementContext,
    amplitude: number = 38,
    frequency: number = 3.2,
    descentSpeed: number = 18,
    dt: number
  ): MovementResult {
    const time = ctx.timeAlive + ctx.phaseOffset;
    const offsetX = Math.sin(time * frequency) * amplitude;
    const targetX = ctx.originX + offsetX;
    const vx = Math.cos(time * frequency) * amplitude * frequency;
    const vy = descentSpeed;

    return {
      x: targetX,
      y: ctx.y + vy * dt,
      vx,
      vy,
    };
  }

  /**
   * 3. DiveAttack: High-speed swoop toward player's exact coordinates with arcing return loop.
   */
  public static dive(
    ctx: MovementContext,
    playerX: number,
    playerY: number,
    progress: number, // 0.0 to 1.0 (dive cycle)
    speed: number = 260,
    dt: number
  ): MovementResult {
    // Hermite / Bezier swoop from origin -> player position -> loop recovery back to formation
    const t = Math.min(1.0, Math.max(0.0, progress));

    if (t < 0.55) {
      // Phase 1: Swoop down toward target
      const subT = t / 0.55;
      const arcFactor = Math.sin(subT * Math.PI) * 55;
      const targetX = ctx.originX + (playerX - ctx.originX) * subT + (ctx.phaseOffset > 0 ? arcFactor : -arcFactor);
      const targetY = ctx.originY + (playerY - ctx.originY) * Math.pow(subT, 1.4);

      const vx = (targetX - ctx.x) / Math.max(0.01, dt);
      const vy = speed;

      return {
        x: targetX,
        y: targetY,
        vx,
        vy,
      };
    } else {
      // Phase 2: Arc upward back toward formation slot
      const subT = (t - 0.55) / 0.45;
      const returnX = playerX + (ctx.originX - playerX) * subT;
      const returnY = playerY + (ctx.originY - playerY) * Math.sin(subT * Math.PI * 0.5);

      return {
        x: returnX,
        y: returnY,
        vx: (returnX - ctx.x) / Math.max(0.01, dt),
        vy: -speed * 0.75,
      };
    }
  }

  /**
   * 4. TrackingAttack: Continuous angular vector pursuit toward the player.
   */
  public static tracking(
    ctx: MovementContext,
    playerX: number,
    playerY: number,
    speed: number = 140,
    turnRate: number = 2.8,
    currentVx: number = 0,
    currentVy: number = 60,
    dt: number
  ): MovementResult {
    const dx = playerX - ctx.x;
    const dy = playerY - ctx.y;
    const targetAngle = Math.atan2(dy, dx);
    const currentAngle = Math.atan2(currentVy, currentVx);

    let angleDiff = targetAngle - currentAngle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

    const maxTurn = turnRate * dt;
    const newAngle = currentAngle + Math.max(-maxTurn, Math.min(maxTurn, angleDiff));

    const vx = Math.cos(newAngle) * speed;
    const vy = Math.sin(newAngle) * speed;

    return {
      x: ctx.x + vx * dt,
      y: ctx.y + vy * dt,
      vx,
      vy,
    };
  }

  /**
   * 5. OrbitMovement: Concentric circular trajectory for satellites and dependency drones.
   */
  public static orbit(
    ctx: MovementContext,
    anchorX: number,
    anchorY: number,
    radius: number = 32,
    orbitSpeed: number = 2.0,
    dt: number
  ): MovementResult {
    const angle = (ctx.timeAlive * orbitSpeed + ctx.phaseOffset) % (Math.PI * 2);
    const targetX = anchorX + Math.cos(angle) * radius;
    const targetY = anchorY + Math.sin(angle) * radius * 0.75; // Elliptical 3D perspective

    const vx = -Math.sin(angle) * radius * orbitSpeed;
    const vy = Math.cos(angle) * radius * orbitSpeed * 0.75;

    return {
      x: targetX,
      y: targetY,
      vx,
      vy,
    };
  }

  /**
   * 6. SwarmMovement: Parametric multi-phase flocking fluctuation (Lissajous curve).
   */
  public static swarm(
    ctx: MovementContext,
    baseX: number,
    baseY: number,
    dt: number
  ): MovementResult {
    const t = ctx.timeAlive * 1.8 + ctx.phaseOffset;
    // 3:2 Lissajous harmonic knot
    const waveX = Math.sin(t * 1.5) * 44 + Math.sin(t * 0.5) * 20;
    const waveY = Math.cos(t * 1.0) * 24 + Math.sin(t * 2.2) * 12;

    const targetX = baseX + waveX;
    const targetY = baseY + waveY;

    const vx = (targetX - ctx.x) / Math.max(0.01, dt);
    const vy = (targetY - ctx.y) / Math.max(0.01, dt);

    return {
      x: targetX,
      y: targetY,
      vx,
      vy,
    };
  }
}
