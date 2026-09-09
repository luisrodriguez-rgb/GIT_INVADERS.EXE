/**
 * GIT_INVADERS.EXE // SHIP DAMAGE MAP
 * Defines discrete structural impact zones and health states for localized damage.
 */

export type DamageZoneId =
  | 'LEFT_WING'
  | 'RIGHT_WING'
  | 'COCKPIT'
  | 'ENGINE_LEFT'
  | 'ENGINE_RIGHT'
  | 'CORE'
  | 'WEAPON_LEFT'
  | 'WEAPON_RIGHT';

export type DamageState = 'clean' | 'scratched' | 'damaged' | 'critical' | 'destroyed';

export interface DamageZone {
  id: DamageZoneId;
  name: string;
  hp: number; // 0.0 to 1.0
  state: DamageState;
  impactCount: number;
}

export class DamageMap {
  public zones: Record<DamageZoneId, DamageZone>;

  constructor() {
    this.zones = {
      LEFT_WING: { id: 'LEFT_WING', name: 'Left Wing Assembly', hp: 1.0, state: 'clean', impactCount: 0 },
      RIGHT_WING: { id: 'RIGHT_WING', name: 'Right Wing Assembly', hp: 1.0, state: 'clean', impactCount: 0 },
      COCKPIT: { id: 'COCKPIT', name: 'Canopy & Avionics', hp: 1.0, state: 'clean', impactCount: 0 },
      ENGINE_LEFT: { id: 'ENGINE_LEFT', name: 'Port Thruster Nozzle', hp: 1.0, state: 'clean', impactCount: 0 },
      ENGINE_RIGHT: { id: 'ENGINE_RIGHT', name: 'Starboard Thruster Nozzle', hp: 1.0, state: 'clean', impactCount: 0 },
      CORE: { id: 'CORE', name: 'Reactor Hull Integrity', hp: 1.0, state: 'clean', impactCount: 0 },
      WEAPON_LEFT: { id: 'WEAPON_LEFT', name: 'Port Laser Hardpoint', hp: 1.0, state: 'clean', impactCount: 0 },
      WEAPON_RIGHT: { id: 'WEAPON_RIGHT', name: 'Starboard Laser Hardpoint', hp: 1.0, state: 'clean', impactCount: 0 },
    };
  }

  public getZoneState(id: DamageZoneId): DamageState {
    const hp = this.zones[id].hp;
    if (hp > 0.8) return 'clean';
    if (hp > 0.6) return 'scratched';
    if (hp > 0.35) return 'damaged';
    if (hp > 0.05) return 'critical';
    return 'destroyed';
  }

  /**
   * Updates all zones based on a global ship health ratio (0.0 to 1.0).
   * Outer armor and wings take degradation first, protecting the core and cockpit until critical.
   */
  public updateFromGlobalHealth(healthRatio: number): void {
    const h = Math.max(0, Math.min(1, healthRatio));

    // Outer wings degrade first
    this.zones.LEFT_WING.hp = Math.max(0, Math.min(1, (h - 0.2) / 0.8));
    this.zones.RIGHT_WING.hp = Math.max(0, Math.min(1, (h - 0.2) / 0.8));

    // Thrusters and weapons degrade next
    this.zones.ENGINE_LEFT.hp = Math.max(0, Math.min(1, (h - 0.3) / 0.7));
    this.zones.ENGINE_RIGHT.hp = Math.max(0, Math.min(1, (h - 0.3) / 0.7));
    this.zones.WEAPON_LEFT.hp = Math.max(0, Math.min(1, (h - 0.25) / 0.75));
    this.zones.WEAPON_RIGHT.hp = Math.max(0, Math.min(1, (h - 0.25) / 0.75));

    // Cockpit and core are heavily shielded
    this.zones.COCKPIT.hp = Math.max(0, Math.min(1, h / 0.85));
    this.zones.CORE.hp = h;

    for (const key of Object.keys(this.zones) as DamageZoneId[]) {
      this.zones[key].state = this.getZoneState(key);
    }
  }

  public registerImpact(zoneId: DamageZoneId, amount: number = 0.2): void {
    const zone = this.zones[zoneId];
    if (!zone) return;
    zone.hp = Math.max(0, zone.hp - amount);
    zone.impactCount++;
    zone.state = this.getZoneState(zoneId);
  }

  public reset(): void {
    for (const key of Object.keys(this.zones) as DamageZoneId[]) {
      this.zones[key].hp = 1.0;
      this.zones[key].state = 'clean';
      this.zones[key].impactCount = 0;
    }
  }
}
