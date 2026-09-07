export interface ShipSkin {
  id: string;
  name: string;
  hullColor: string;
  glowColor: string;
  cost: number;
  unlocked: boolean;
  description?: string;
}

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
    activeSkinId: 'cyan',
    unlockedSkins: ['cyan'],
  };

  public readonly SKINS: ShipSkin[] = [
    { id: 'cyan', name: 'Compiler Delta', hullColor: '#00e5ff', glowColor: '#38bdf8', cost: 0, unlocked: true, description: 'Interceptor balanceado con reactores de plasma gemelos.' },
    { id: 'purple', name: 'Phantom Violet', hullColor: '#c084fc', glowColor: '#a855f7', cost: 400, unlocked: false, description: 'Caza de sigilo con envergadura extendida y canones de antimateria.' },
    { id: 'amber', name: 'Solar Gold', hullColor: '#fbbf24', glowColor: '#f59e0b', cost: 600, unlocked: false, description: 'Acorazado pesado de triple tobera con blindaje reforzado.' },
    { id: 'matrix', name: 'Emerald Glitch', hullColor: '#00ff66', glowColor: '#10b981', cost: 800, unlocked: false, description: 'Caza experimental de ala invertida con estabilizadores de flujo.' },
    { id: 'cyberpunk', name: 'Neon Overdrive', hullColor: '#ff007f', glowColor: '#ec4899', cost: 1000, unlocked: false, description: 'Nave de asalto rapido con cuatro puntos duros de anclaje frontal.' },
    { id: 'quantum_citadel', name: 'Quantum Citadel', hullColor: '#6366f1', glowColor: '#22d3ee', cost: 1500, unlocked: false, description: 'Fortaleza orbital con ocho paneles de titanio y deflectores pesados.' },
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
