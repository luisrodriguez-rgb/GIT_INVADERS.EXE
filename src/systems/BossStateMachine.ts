/**
 * Boss Finite State Machine (FSM)
 * Formally orchestrates Boss phase transitions, visual moods, and tactical combat cycles.
 */

export type BossState =
  | 'IDLE'
  | 'ENTER'
  | 'ATTACK'
  | 'ENRAGED'
  | 'PHASE_2'
  | 'CRITICAL'
  | 'DESTROYED';

export interface BossStateContext {
  hp: number;
  maxHp: number;
  currentPhase: number;
  x: number;
  y: number;
  playerCombo?: number;
  shieldDestroyed?: boolean;
}

export class BossStateMachine {
  private currentState: BossState = 'ENTER';
  private stateTimer: number = 0;
  private onStateChangeCallback?: (from: BossState, to: BossState) => void;

  constructor(initialState: BossState = 'ENTER') {
    this.currentState = initialState;
  }

  public get state(): BossState {
    return this.currentState;
  }

  public get timer(): number {
    return this.stateTimer;
  }

  public onStateChange(cb: (from: BossState, to: BossState) => void): void {
    this.onStateChangeCallback = cb;
  }

  public setState(newState: BossState): void {
    if (this.currentState === newState) return;
    const prev = this.currentState;
    this.currentState = newState;
    this.stateTimer = 0;
    this.onStateChangeCallback?.(prev, newState);
  }

  public update(dt: number, context: BossStateContext): void {
    this.stateTimer += dt;
    const hpRatio = context.hp / context.maxHp;

    switch (this.currentState) {
      case 'ENTER':
        // Warp down into combat position
        if (context.y < 90) {
          context.y += 45 * dt;
        } else {
          this.setState('ATTACK');
        }
        break;

      case 'ATTACK':
        if (context.hp <= 0) {
          this.setState('DESTROYED');
        } else if (hpRatio <= 0.25) {
          this.setState('CRITICAL');
        } else if (
          (hpRatio <= 0.7 && (context.playerCombo || 0) > 5 && context.shieldDestroyed) ||
          (hpRatio <= 0.55 && context.currentPhase < 2)
        ) {
          this.setState('PHASE_2');
        } else if (hpRatio <= 0.75 && this.stateTimer > 10) {
          this.setState('ENRAGED');
        }
        break;

      case 'ENRAGED':
        if (context.hp <= 0) {
          this.setState('DESTROYED');
        } else if (hpRatio <= 0.25) {
          this.setState('CRITICAL');
        } else if (this.stateTimer > 8) {
          this.setState('ATTACK');
        }
        break;

      case 'PHASE_2':
        if (context.hp <= 0) {
          this.setState('DESTROYED');
        } else if (hpRatio <= 0.25) {
          this.setState('CRITICAL');
        } else if (this.stateTimer > 15) {
          this.setState('ATTACK');
        }
        break;

      case 'CRITICAL':
        if (context.hp <= 0) {
          this.setState('DESTROYED');
        }
        break;

      case 'DESTROYED':
        // Exploding state, will despawn after countdown
        break;
    }
  }
}
