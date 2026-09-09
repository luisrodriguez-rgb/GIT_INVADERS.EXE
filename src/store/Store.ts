import { BossBlueprint, BossCodexEntry, RepositoryArtifact } from '../github/Types';

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
  secondaryColor?: string;
  paletteDescription?: string;
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
  bossCodex: BossCodexEntry[];
  artifacts: RepositoryArtifact[];
}

export class Store {
  private static instance: Store;
  private static STORAGE_KEY = 'git_invaders_player_profile';

  public profile: PlayerProfile = {
    totalXp: 0,
    availableXp: 0,
    level: 1,
    rankName: 'JUNIOR_DEV',
    fireRateLevel: 1,
    thrusterLevel: 1,
    quantumPiercing: false,
    startingShield: false,
    rebaseSlowMoUnlocked: false,
    activeSkinId: 'cyber_falcon',
    unlockedSkins: [
      'cyber_falcon',
      'phantom_violet',
      'solar_gold',
      'emerald_glitch',
      'neon_overdrive',
      'quantum_wing',
      'quantum_citadel',
      'codebreaker_x',
      'hyper_void',
      'solar_flare',
    ],
    bossCodex: [],
    artifacts: [],
  };

  public readonly SKINS: ShipModel[] = [
    {
      id: 'cyber_falcon',
      name: 'CYBER FALCON',
      classTag: 'Interceptor | Equilibrada',
      hullColor: '#00e5ff',
      glowColor: '#38bdf8',
      cost: 0,
      unlocked: true,
      stats: { armor: 60, speed: 70, fireRate: 60, shield: 50 }, // 6/10, 7/10, 6/10, 5/10
      ability: {
        id: 'compiler_burst',
        name: 'COMPILER BURST',
        triggerKey: 'SPACE',
        description: 'Dispara una ráfaga de 3 proyectiles de precisión.',
        mechanic: 'Ráfaga de precisión de 3 pulsos',
      },
      description: 'Fuselaje triangular interceptor con reactores duales cyan. La nave de ingeniería equilibrada.',
    },
    {
      id: 'phantom_violet',
      name: 'PHANTOM VIOLET',
      classTag: 'Sigilo / Velocidad',
      hullColor: '#8b5cf6',
      glowColor: '#c084fc',
      cost: 400,
      unlocked: true,
      stats: { armor: 40, speed: 100, fireRate: 70, shield: 30 }, // 4/10, 10/10, 7/10, 3/10
      ability: {
        id: 'git_stash',
        name: 'GIT STASH',
        triggerKey: 'E',
        description: 'Fase de intangibilidad temporal e inmunidad total a proyectiles.',
        mechanic: 'Intangibilidad de fase 3.5s',
      },
      description: 'Silueta de flecha invertida con baja firma térmica para infiltración y evasivas críticas.',
    },
    {
      id: 'solar_gold',
      name: 'SOLAR GOLD',
      classTag: 'Acorazada / Asedio Pesado',
      hullColor: '#f59e0b',
      glowColor: '#fbbf24',
      cost: 600,
      unlocked: true,
      stats: { armor: 100, speed: 30, fireRate: 40, shield: 80 }, // 10/10, 3/10, 4/10, 8/10
      ability: {
        id: 'merge_shield',
        name: 'MERGE BURST',
        triggerKey: 'E',
        description: 'Absorbe impactos frontales y desata una onda de choque cinética demoledora.',
        mechanic: 'Onda de choque por absorción',
      },
      description: 'Armadura pesada de aleación solar reforzada con ariete frontal y triple tobera de empuje.',
    },
    {
      id: 'emerald_glitch',
      name: 'EMERALD GLITCH',
      classTag: 'Experimental / Clones',
      hullColor: '#10b981',
      glowColor: '#a3e635',
      cost: 800,
      unlocked: true,
      stats: { armor: 50, speed: 80, fireRate: 60, shield: 50 }, // 5/10, 8/10, 6/10, 5/10
      ability: {
        id: 'branch_split',
        name: 'BRANCH SPLIT',
        triggerKey: 'E',
        description: 'Despliega 2 drones tácticos que replican el fuego de armas de la nave.',
        mechanic: 'Drones de apoyo dual 5s',
      },
      description: 'Fuselaje fractal asimétrico con tres estelas vectoriales y plasma verde radiactivo.',
    },
    {
      id: 'neon_overdrive',
      name: 'NEON OVERDRIVE',
      classTag: 'Asalto Rápido / Hiperdash',
      hullColor: '#ff0055',
      glowColor: '#ff7700',
      cost: 1000,
      unlocked: true,
      stats: { armor: 40, speed: 90, fireRate: 90, shield: 20 }, // 4/10, 9/10, 9/10, 2/10
      ability: {
        id: 'git_rebase',
        name: 'GIT REBASE',
        triggerKey: 'Q',
        description: 'Carga de velocidad hipercinética con embate frontal penetrante.',
        mechanic: 'Embate penetrante hiperveloz',
      },
      description: 'Cohete dragster con tobera colosal de sobreaceleración inmediata para embates frontales.',
    },
    {
      id: 'quantum_wing',
      name: 'QUANTUM WING',
      classTag: 'Perforación / Plasma',
      hullColor: '#06b6d4',
      glowColor: '#6366f1',
      cost: 1100,
      unlocked: true,
      stats: { armor: 50, speed: 70, fireRate: 60, shield: 60 }, // 5/10, 7/10, 6/10, 6/10
      ability: {
        id: 'quantum_pierce',
        name: 'QUANTUM PIERCE',
        triggerKey: 'SPACE',
        description: 'Dispara rayos de plasma cuántico perforantes continuos.',
        mechanic: 'Láser perforante continuo',
      },
      description: 'Trimarán cuántico con alas flotantes desconectadas por levitación magnética.',
    },
    {
      id: 'quantum_citadel',
      name: 'QUANTUM CITADEL',
      classTag: 'Defensa / Drones',
      hullColor: '#2563eb',
      glowColor: '#e2e8f0',
      cost: 1200,
      unlocked: true,
      stats: { armor: 70, speed: 60, fireRate: 70, shield: 90 }, // 7/10, 6/10, 7/10, 9/10
      ability: {
        id: 'octo_protocol',
        name: 'OCTO PROTOCOL',
        triggerKey: 'E',
        description: 'Genera un enjambre de 8 micro-drones de intercepción orbital activa.',
        mechanic: '8 drones orbitales defensivos',
      },
      description: 'Plato toroidal acorazado con 4 estabilizadores orbitales en rotación y domo de mando.',
    },
    {
      id: 'codebreaker_x',
      name: 'CODEBREAKER // X',
      classTag: 'Dreadnought / Cañón Colosal',
      hullColor: '#ec4899',
      glowColor: '#7c3aed',
      cost: 1500,
      unlocked: true,
      stats: { armor: 100, speed: 50, fireRate: 100, shield: 90 }, // 10/10, 5/10, 10/10, 9/10
      ability: {
        id: 'force_push',
        name: 'GIT PUSH --FORCE',
        triggerKey: 'SHIFT',
        description: 'Desata el rayo colosal destructor de kernels que barre la pantalla.',
        mechanic: 'Superláser de aniquilación global',
      },
      description: 'Crucero pesado en cruz X con 4 alas divergentes y torre de mando escalonada.',
    },
    {
      id: 'hyper_void',
      name: 'VOID STALKER',
      classTag: 'Sigilo / Asesino Táctico',
      hullColor: '#ef4444',
      glowColor: '#f59e0b',
      secondaryColor: '#ffffff',
      paletteDescription: 'Obsidiana Mate + Carmesí + Oro Prisma',
      cost: 1400,
      unlocked: true,
      stats: { armor: 40, speed: 95, fireRate: 80, shield: 40 },
      ability: {
        id: 'temporal_rift',
        name: 'TEMPORAL RIFT',
        triggerKey: 'E',
        description: 'Crea una fractura temporal que ralentiza proyectiles enemigos un 80% y te teletransporta.',
        mechanic: 'Ralentización temporal + traslación',
      },
      description: 'Aguja furtiva de titanio obsidiana con hojas de ataque invertidas y óptica carmesí.',
    },
    {
      id: 'solar_flare',
      name: 'SOLAR PHOENIX',
      classTag: 'Plasma / Fénix Termonuclear',
      hullColor: '#ea580c',
      glowColor: '#facc15',
      secondaryColor: '#06b6d4',
      paletteDescription: 'Naranja Solar + Amarillo Fénix + Cian Ion',
      cost: 1600,
      unlocked: true,
      stats: { armor: 60, speed: 85, fireRate: 85, shield: 70 },
      ability: {
        id: 'supernova_rebirth',
        name: 'SUPERNOVA NOVA',
        triggerKey: 'SPACE',
        description: 'Descarga un estallido omnidireccional de plasma que calcina proyectiles e invasores.',
        mechanic: 'Estallido solar omnidireccional',
      },
      description: 'Caza de plumaje aerodinámico triple con reactores de combustión solar y blindaje compuesto dorado.',
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
    const id = this.profile.activeSkinId;
    let found = this.SKINS.find((s) => s.id === id);
    if (!found) {
      if (id === 'compiler_delta' || id === 'cyan') found = this.SKINS.find((s) => s.id === 'cyber_falcon');
      else if (id === 'merge_hammer' || id === 'gold') found = this.SKINS.find((s) => s.id === 'solar_gold');
      else if (id === 'branch_runner' || id === 'emerald') found = this.SKINS.find((s) => s.id === 'emerald_glitch');
      else if (id === 'rebase_01' || id === 'neon') found = this.SKINS.find((s) => s.id === 'neon_overdrive');
      else if (id === 'octo_core' || id === 'quantum_wing') found = this.SKINS.find((s) => s.id === 'quantum_citadel');
    }
    return found || this.SKINS[0];
  }

  public recordBossDefeated(blueprint: BossBlueprint): void {
    if (!this.profile.bossCodex) {
      this.profile.bossCodex = [];
    }
    const existing = this.profile.bossCodex.find(
      (e) => e.archetype === blueprint.archetype && e.mutation === (blueprint.mutation || 'OVERCLOCKED')
    );
    if (!existing) {
      this.profile.bossCodex.push({
        archetype: blueprint.archetype,
        title: blueprint.archetypeData.title,
        codeNumber: blueprint.archetypeData.codeNumber,
        seed: blueprint.genome.seed,
        mutation: blueprint.mutation || 'OVERCLOCKED',
        secondaryMutation: blueprint.secondaryMutation,
        language: blueprint.language,
        repoName: blueprint.repoName,
        defeatedAt: Date.now(),
        threatLevel: blueprint.threatIndex,
      });
      this.saveProfile();
    }
  }

  public grantRepositoryArtifact(repoId: string, repoName: string, langName: string): RepositoryArtifact {
    if (!this.profile.artifacts) {
      this.profile.artifacts = [];
    }
    const found = this.profile.artifacts.find((a) => a.repoId === repoId);
    if (found) return found;

    const newArtifact: RepositoryArtifact = {
      repoId,
      name: `ARTEFACTO // ${repoName.toUpperCase()}`,
      bonusXpPct: 5,
      bonusPerk: `COMPILADOR ${langName.toUpperCase()}`,
      unlockedAt: Date.now(),
      flavorText: `Núcleo de código estabilizado del repositorio ${repoName}. Otorga +5% XP en todas las misiones.`,
    };

    this.profile.artifacts.push(newArtifact);
    this.saveProfile();
    return newArtifact;
  }

  public getArtifact(repoId: string): RepositoryArtifact | undefined {
    return this.profile.artifacts?.find((a) => a.repoId === repoId);
  }

  private loadProfile(): void {
    try {
      const saved = localStorage.getItem(Store.STORAGE_KEY);
      if (saved) {
        this.profile = { ...this.profile, ...JSON.parse(saved) };
        if (!this.profile.bossCodex) this.profile.bossCodex = [];
        if (!this.profile.artifacts) this.profile.artifacts = [];
      }
      // Ensure all 8 ships in SKINS are unlocked
      const allShipIds = this.SKINS.map((s) => s.id);
      this.profile.unlockedSkins = Array.from(new Set([...(this.profile.unlockedSkins || []), ...allShipIds]));
    } catch {}
    this.updateRankAndLevel();
  }


  public saveProfile(): void {
    try {
      localStorage.setItem(Store.STORAGE_KEY, JSON.stringify(this.profile));
    } catch {}
  }
}
