export interface ShipStats {
  armor: number; // 0 - 100
  speed: number; // 0 - 100
  fireRate: number; // 0 - 100
  shield: number; // 0 - 100
}

export interface ShipAbility {
  id: string;
  name: string;
  triggerKey: string; // 'SPACE', 'Q', 'E', 'SHIFT', 'PASSIVE'
  description: string;
  mechanic: string;
}

export interface ShipModel {
  id: string;
  name: string;
  classTag: string;
  hullColor: string;
  glowColor: string;
  cost: number;
  unlocked: boolean;
  stats: ShipStats;
  ability: ShipAbility;
  description: string;
}

// Backward-compatible alias
export type ShipSkin = ShipModel;

export interface PlayerProfile {
  totalXp: number;
  availableXp: number;
  level: number;
  rankName: string;
  fireRateLevel: number; // 1 to 5
  thrusterLevel: number; // 1 to 5
  quantumPiercing: boolean;
  startingShield: boolean;
  rebaseSlowMoUnlocked: boolean;
  activeSkinId: string;
  unlockedSkins: string[];
}

export class Store {
  private static instance: Store;
  private static STORAGE_KEY = 'git_invaders_player_profile';

  public profile: PlayerProfile = {
    totalXp: 500, // Starting bonus for demo
    availableXp: 500,
    level: 1,
    rankName: 'Junior Contributor',
    fireRateLevel: 1,
    thrusterLevel: 1,
    quantumPiercing: false,
    startingShield: false,
    rebaseSlowMoUnlocked: false,
    activeSkinId: 'compiler_delta',
    unlockedSkins: ['compiler_delta', 'cyan'],
  };

  public readonly SKINS: ShipModel[] = [
    {
      id: 'compiler_delta',
      name: 'Compiler Delta',
      classTag: 'ENGINEERING // CORE DEV',
      hullColor: '#00e5ff',
      glowColor: '#38bdf8',
      cost: 0,
      unlocked: true,
      stats: { armor: 60, speed: 60, fireRate: 60, shield: 50 },
      ability: {
        id: 'compiler_burst',
        name: 'COMPILER BURST',
        triggerKey: 'SPACE',
        description: 'Fires a 3-round precision plasma burst with tight spread.',
        mechanic: 'Tri-burst pulse cadence'
      },
      description: 'Fuselaje triangular con reactores duales cyan. La nave de ingenieria equilibrada.'
    },
    {
      id: 'phantom_violet',
      name: 'Phantom Violet',
      classTag: 'STEALTH // RECONNAISSANCE',
      hullColor: '#c084fc',
      glowColor: '#a855f7',
      cost: 400,
      unlocked: false,
      stats: { armor: 40, speed: 100, fireRate: 70, shield: 30 },
      ability: {
        id: 'git_stash',
        name: 'GIT STASH',
        triggerKey: 'E',
        description: 'Temporal phase cloak: intangible to bullets, cannot shoot while stashed.',
        mechanic: 'Phase intangibility 3.5s'
      },
      description: 'Silueta delgada y aerodinamica con baja firma termica. Ideal para infiltracion y evasivas.'
    },
    {
      id: 'merge_hammer',
      name: 'Merge Hammer',
      classTag: 'HEAVY SIEGE TANK',
      hullColor: '#fbbf24',
      glowColor: '#f59e0b',
      cost: 600,
      unlocked: false,
      stats: { armor: 100, speed: 30, fireRate: 40, shield: 80 },
      ability: {
        id: 'merge_shield',
        name: 'MERGE SHIELD / BURST',
        triggerKey: 'E',
        description: 'Frontal shield absorbs hits. When charged, releases massive MERGE BURST shockwave.',
        mechanic: 'Kinetic absorption wave'
      },
      description: 'Armadura de asedio reforzada y triple tobera pesada. Tanque espacial impenetrable.'
    },
    {
      id: 'branch_runner',
      name: 'Branch Runner',
      classTag: 'MULTI-VECTOR TACTICAL',
      hullColor: '#10b981',
      glowColor: '#34d399',
      cost: 800,
      unlocked: false,
      stats: { armor: 50, speed: 80, fireRate: 60, shield: 50 },
      ability: {
        id: 'branch_split',
        name: 'BRANCH SPLIT',
        triggerKey: 'E',
        description: 'Spawns 2 drone clones flanking the ship that mirror weapon fire, then branch merges back.',
        mechanic: 'Dual support drones 5s'
      },
      description: 'Fuselaje trifurcado con tres estelas vectoriales independientes. Domina el espacio con ramas simultaneas.'
    },
    {
      id: 'rebase_01',
      name: 'Rebase-01',
      classTag: 'AGGRESSIVE INTERCEPTOR',
      hullColor: '#ff0055',
      glowColor: '#ff3366',
      cost: 1000,
      unlocked: false,
      stats: { armor: 40, speed: 90, fireRate: 90, shield: 20 },
      ability: {
        id: 'git_rebase',
        name: 'GIT REBASE',
        triggerKey: 'Q',
        description: 'Accumulates energy during slow-motion, then executes an ultra-velocity penetrating dash.',
        mechanic: 'Piercing hyper-dash'
      },
      description: 'Nariz afilada con tobera central de sobreaceleracion. Ataque veloz y demoledor.'
    },
    {
      id: 'quantum_wing',
      name: 'Quantum Wing',
      classTag: 'EXPERIMENTAL WARPING CRAFT',
      hullColor: '#22d3ee',
      glowColor: '#6366f1',
      cost: 1200,
      unlocked: false,
      stats: { armor: 50, speed: 70, fireRate: 60, shield: 60 },
      ability: {
        id: 'quantum_pierce',
        name: 'QUANTUM PIERCE',
        triggerKey: 'PASSIVE',
        description: 'Plasma shots pierce clean through entire columns of enemies without dissipating.',
        mechanic: 'Infinite laser penetration'
      },
      description: 'Geometria asimetrica con puntas de ala flotantes y reactor gravitacional desvinculado.'
    },
    {
      id: 'octo_core',
      name: 'Octo-Core',
      classTag: 'LEGENDARY GUARDIAN',
      hullColor: '#38bdf8',
      glowColor: '#0284c7',
      cost: 1500,
      unlocked: false,
      stats: { armor: 70, speed: 60, fireRate: 70, shield: 90 },
      ability: {
        id: 'octo_protocol',
        name: 'OCTO PROTOCOL',
        triggerKey: 'E',
        description: 'Summons up to 8 rotating micro-drones around the ship that intercept incoming enemy projectiles.',
        mechanic: '8 orbital defense drones'
      },
      description: 'Nucleo circular con 8 nodos de contencion y alerones en forma de tentaculos. El bastion de GitHub.'
    },
    {
      id: 'codebreaker_x',
      name: 'Codebreaker // X',
      classTag: 'ULTIMATE DREADNOUGHT',
      hullColor: '#a855f7',
      glowColor: '#c084fc',
      cost: 2500,
      unlocked: false,
      stats: { armor: 100, speed: 60, fireRate: 100, shield: 90 },
      ability: {
        id: 'force_push',
        name: 'FORCE PUSH',
        triggerKey: 'SHIFT',
        description: 'Wipes remote history with a colossal screen-clearing beam obliterating enemy waves.',
        mechanic: 'Colossal compiler beam'
      },
      description: 'Placas de aleacion oscura, 6 puntos de anclaje y reactor hipercuantico. Una maquina de guerra total.'
    },
  ];

  private constructor() {
    this.loadProfile();
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public addXp(amount: number): void {
    this.profile.totalXp += amount;
    this.profile.availableXp += amount;
    this.updateRankAndLevel();
    this.saveProfile();
  }

  private updateRankAndLevel(): void {
    const xp = this.profile.totalXp;
    if (xp >= 16000) {
      this.profile.level = 7;
      this.profile.rankName = 'System Overlord';
    } else if (xp >= 10500) {
      this.profile.level = 6;
      this.profile.rankName = 'Architect';
    } else if (xp >= 6500) {
      this.profile.level = 5;
      this.profile.rankName = 'Tech Lead';
    } else if (xp >= 3500) {
      this.profile.level = 4;
      this.profile.rankName = 'Senior Developer';
    } else if (xp >= 1500) {
      this.profile.level = 3;
      this.profile.rankName = 'Developer';
    } else if (xp >= 500) {
      this.profile.level = 2;
      this.profile.rankName = 'Junior Developer';
    } else {
      this.profile.level = 1;
      this.profile.rankName = 'Intern';
    }
  }

  public buyFireRate(): boolean {
    const costs = [250, 600, 1200, 2500];
    const cost = costs[this.profile.fireRateLevel - 1];
    if (this.profile.fireRateLevel < 5 && cost && this.profile.availableXp >= cost) {
      this.profile.availableXp -= cost;
      this.profile.fireRateLevel++;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public buyThruster(): boolean {
    const costs = [200, 500, 1000, 2000];
    const cost = costs[this.profile.thrusterLevel - 1];
    if (this.profile.thrusterLevel < 5 && cost && this.profile.availableXp >= cost) {
      this.profile.availableXp -= cost;
      this.profile.thrusterLevel++;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public buyQuantumPiercing(): boolean {
    const cost = 1800;
    if (!this.profile.quantumPiercing && this.profile.availableXp >= cost) {
      this.profile.availableXp -= cost;
      this.profile.quantumPiercing = true;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public buyStartingShield(): boolean {
    const cost = 1200;
    if (!this.profile.startingShield && this.profile.availableXp >= cost) {
      this.profile.availableXp -= cost;
      this.profile.startingShield = true;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public buyRebaseSlowMo(): boolean {
    const cost = 2200;
    if (!this.profile.rebaseSlowMoUnlocked && this.profile.availableXp >= cost) {
      this.profile.availableXp -= cost;
      this.profile.rebaseSlowMoUnlocked = true;
      this.saveProfile();
      return true;
    }
    return false;
  }

  public buyOrEquipSkin(skinId: string): boolean {
    const skin = this.SKINS.find((s) => s.id === skinId);
    if (!skin) return false;

    if (this.profile.unlockedSkins.includes(skinId)) {
      this.profile.activeSkinId = skinId;
      this.saveProfile();
      return true;
    }

    if (this.profile.availableXp >= skin.cost) {
      this.profile.availableXp -= skin.cost;
      this.profile.unlockedSkins.push(skinId);
      this.profile.activeSkinId = skinId;
      this.saveProfile();
      return true;
    }

    return false;
  }

  public equipSkin(skinId: string): boolean {
    return this.buyOrEquipSkin(skinId);
  }

  public get upgrades() {
    return {
      blasterLevel: this.profile.fireRateLevel,
      speedLevel: this.profile.thrusterLevel,
      piercingLasers: this.profile.quantumPiercing,
      startingShield: this.profile.startingShield,
      rebaseUnlocked: this.profile.rebaseSlowMoUnlocked,
    };
  }

  public getActiveSkin(): ShipSkin {
    return this.SKINS.find((s) => s.id === this.profile.activeSkinId) || this.SKINS[0];
  }

  private loadProfile(): void {
    try {
      const saved = localStorage.getItem(Store.STORAGE_KEY);
      if (saved) {
        this.profile = { ...this.profile, ...JSON.parse(saved) };
      }
    } catch {}
    this.updateRankAndLevel();
  }

  public saveProfile(): void {
    try {
      localStorage.setItem(Store.STORAGE_KEY, JSON.stringify(this.profile));
    } catch {}
  }
}
