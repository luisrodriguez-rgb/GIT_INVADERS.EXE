/**
 * Behavioral Movement Strategy Patterns
 * Decouples entity movement logic from entity renderers.
 */

export interface IMovable {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

export interface MovementStrategy {
  readonly name: string;
  update(entity: IMovable, dt: number, target?: { x: number; y: number }): void;
}

/**
 * Classic Grid Formation Traversal
 */
export class FormationMovement implements MovementStrategy {
  public readonly name = 'FormationMovement';
  private direction: number = 1;
  private speed: number;
  private dropDistance: number;
  private minX: number;
  private maxX: number;

  constructor(speed: number = 40, dropDistance: number = 18, minX: number = 20, maxX: number = 780) {
    this.speed = speed;
    this.dropDistance = dropDistance;
    this.minX = minX;
    this.maxX = maxX;
  }

  public setSpeed(newSpeed: number): void {
    this.speed = newSpeed;
  }

  public update(entity: IMovable, dt: number): void {
    entity.x += this.direction * this.speed * dt;

    if (entity.x + entity.width >= this.maxX) {
      this.direction = -1;
      entity.y += this.dropDistance;
    } else if (entity.x <= this.minX) {
      this.direction = 1;
      entity.y += this.dropDistance;
    }
  }
}

/**
 * Sinusoidal Zig-Zag Lateral Sweep
 */
export class ZigZagMovement implements MovementStrategy {
  public readonly name = 'ZigZagMovement';
  private time: number = 0;
  private baseSpeedY: number;
  private frequency: number;
  private amplitude: number;
  private initialX: number | null = null;

  constructor(baseSpeedY: number = 25, frequency: number = 3.5, amplitude: number = 60) {
    this.baseSpeedY = baseSpeedY;
    this.frequency = frequency;
    this.amplitude = amplitude;
  }

  public update(entity: IMovable, dt: number): void {
    if (this.initialX === null) {
      this.initialX = entity.x;
    }
    this.time += dt;
    entity.y += this.baseSpeedY * dt;
    entity.x = this.initialX + Math.sin(this.time * this.frequency) * this.amplitude;
  }
}

/**
 * High-Speed Parabolic Dive Attack
 */
export class DiveAttack implements MovementStrategy {
  public readonly name = 'DiveAttack';
  private time: number = 0;
  private diveSpeed: number;
  private pullUpY: number;
  private targetX: number = 400;

  constructor(diveSpeed: number = 180, pullUpY: number = 540) {
    this.diveSpeed = diveSpeed;
    this.pullUpY = pullUpY;
  }

  public update(entity: IMovable, dt: number, target?: { x: number; y: number }): void {
    this.time += dt;
    if (target) {
      this.targetX = target.x;
    }

    // Ease toward player X while diving
    const dx = this.targetX - entity.x;
    entity.x += dx * 1.8 * dt;
    entity.y += this.diveSpeed * dt;

    if (entity.y >= this.pullUpY) {
      // Loop back up to sky
      entity.y = -40;
      entity.x = Math.random() * 700 + 50;
    }
  }
}

/**
 * Angular Homing Vector Tracking Target
 */
export class TrackingAttack implements MovementStrategy {
  public readonly name = 'TrackingAttack';
  private trackingSpeed: number;

  constructor(trackingSpeed: number = 120) {
    this.trackingSpeed = trackingSpeed;
  }

  public update(entity: IMovable, dt: number, target?: { x: number; y: number }): void {
    if (!target) return;
    const dx = target.x - (entity.x + entity.width / 2);
    const dy = target.y - (entity.y + entity.height / 2);
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      entity.vx = (dx / dist) * this.trackingSpeed;
      entity.vy = (dy / dist) * this.trackingSpeed;
      entity.x += entity.vx * dt;
      entity.y += entity.vy * dt;
    }
  }
}

/**
 * Orbital Trajectory Surrounding Center Point
 */
export class OrbitMovement implements MovementStrategy {
  public readonly name = 'OrbitMovement';
  private angle: number;
  private orbitSpeed: number;
  private radius: number;
  private centerX: number;
  private centerY: number;

  constructor(radius: number = 85, orbitSpeed: number = 2.0, initialAngle: number = 0) {
    this.radius = radius;
    this.orbitSpeed = orbitSpeed;
    this.angle = initialAngle;
    this.centerX = 400;
    this.centerY = 140;
  }

  public update(entity: IMovable, dt: number, center?: { x: number; y: number }): void {
    if (center) {
      this.centerX = center.x;
      this.centerY = center.y;
    }
    this.angle += this.orbitSpeed * dt;
    entity.x = this.centerX + Math.cos(this.angle) * this.radius - entity.width / 2;
    entity.y = this.centerY + Math.sin(this.angle) * (this.radius * 0.45) - entity.height / 2;
  }
}

/**
 * Swarm Flocking Movement with Oscillating Wave
 */
export class SwarmMovement implements MovementStrategy {
  public readonly name = 'SwarmMovement';
  private time: number = 0;
  private offsetPhase: number;

  constructor(offsetPhase: number = Math.random() * Math.PI * 2) {
    this.offsetPhase = offsetPhase;
  }

  public update(entity: IMovable, dt: number): void {
    this.time += dt;
    entity.x += Math.sin(this.time * 4 + this.offsetPhase) * 45 * dt;
    entity.y += Math.cos(this.time * 2 + this.offsetPhase) * 15 * dt;
  }
}
