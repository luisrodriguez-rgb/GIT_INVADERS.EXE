/**
 * GIT_INVADERS.EXE // 2.5D MULTI-LAYER ZONE ENVIRONMENT RENDERER
 * Every single zone renders as a rich 2.5D horizon & altitude-layered world:
 * - Atmospheric horizon sky & twinkling zenith stars (in 2.5D view)
 * - Shimmering ocean / plasma sea with Mode-7 cyber perspective overlays in tech zones
 * - 8-layer elevation-stacked 2.5D islands, coral atolls, volcanic calderas, glaciers & citadels
 * - Animated Allied Naval Carriers & V-wakes
 * - Volumetric 3-tier clouds with dark terrain shadows cast below
 *
 * Zones (Wave 1..N + Boss):
 * - Z01: ARCHIPELAGO_DIGITAL (Archipiélago Tropical Zafiro)
 * - Z02: CORAL_ATOLL_LAGOON (Atolón Coralino Turquesa)
 * - Z03: VOLCANIC_OBSIDIAN_SEA (Mar de Obsidiana Volcánica)
 * - Z04: CYBER_GLACIER_FJORD (Fiordo Glacial Cibernético)
 * - Z05: VERDANT_CANYON_DELTA (Delta de Cañones Esmeralda)
 * - Z06: ATMOS_CYBER_GRID (Archipiélago Ciber-Metrópolis con grilla Mode-7)
 * - Z07: DEPENDENCY_NEBULA (Archipiélago Nebulosa de Cristal)
 * - Z08: CORE_BREACH_HORIZON (Horizonte de Núcleo Carmesí - Boss Arena)
 */

export type ZoneId =
  | 'ARCHIPELAGO_DIGITAL'
  | 'CORAL_ATOLL_LAGOON'
  | 'VOLCANIC_OBSIDIAN_SEA'
  | 'CYBER_GLACIER_FJORD'
  | 'VERDANT_CANYON_DELTA'
  | 'ATMOS_CYBER_GRID'
  | 'DEPENDENCY_NEBULA'
  | 'CORE_BREACH_HORIZON';

export type ViewMode = 'ANGLED_25D' | 'TOP_DOWN';

interface MaritimeBiomeConfig {
  skyStops: [string, string, string, string];
  seaStopsAngled: [string, string, string, string];
  seaStopsTop: [string, string, string];
  horizonGlow: string;
  sparkleColor: string;
  layerColors: Array<{ scale: number; color: string; stroke: string }>;
  highlightFoliage: string;
  peakBeaconColor: string;
  cyberGridColor?: string;
  nebulaTint?: string;
  bossVortexTint?: string;
}

interface IslandNode {
  xNorm: number;
  yOffset: number;
  scale: number;
  seed: number;
  layers: HTMLCanvasElement[];
}

interface NavalCarrier {
  xNorm: number;
  yOffset: number;
  speedMult: number;
  hullColor: string;
  deckAccent: string;
}

interface CloudCluster {
  xNorm: number;
  yOffset: number;
  speedMult: number;
  scale: number;
  sprite: HTMLCanvasElement;
  shadowSprite: HTMLCanvasElement;
}

interface ParallaxStar {
  xNorm: number;
  yNorm: number;
  size: number;
  layer: number;
  brightness: number;
  twinklePhase: number;
}

interface SeaSparkle {
  xNorm: number;
  yNorm: number;
  w: number;
  speed: number;
  alpha: number;
}

export const ALL_ZONES: ZoneId[] = [
  'ARCHIPELAGO_DIGITAL',
  'CORAL_ATOLL_LAGOON',
  'VOLCANIC_OBSIDIAN_SEA',
  'CYBER_GLACIER_FJORD',
  'VERDANT_CANYON_DELTA',
  'ATMOS_CYBER_GRID',
  'DEPENDENCY_NEBULA',
  'CORE_BREACH_HORIZON',
];

const MARITIME_BIOMES: Record<ZoneId, MaritimeBiomeConfig> = {
  ARCHIPELAGO_DIGITAL: {
    skyStops: ['#071426', '#0c2d57', '#1d5fa3', '#7dd3fc'],
    seaStopsAngled: ['#38bdf8', '#0284c7', '#0e4a86', '#07224d'],
    seaStopsTop: ['#0b3b75', '#0e4e92', '#082c5a'],
    horizonGlow: 'rgba(186, 230, 253, 0.58)',
    sparkleColor: '224, 242, 254',
    highlightFoliage: 'rgba(134, 239, 172, 0.55)',
    peakBeaconColor: '#00e5ff',
    layerColors: [
      { scale: 1.32, color: 'rgba(13, 148, 136, 0.25)', stroke: 'rgba(45, 212, 191, 0.35)' },
      { scale: 1.20, color: 'rgba(20, 184, 166, 0.38)', stroke: 'rgba(94, 234, 212, 0.45)' },
      { scale: 1.11, color: 'rgba(224, 242, 254, 0.45)', stroke: 'rgba(255, 255, 255, 0.65)' },
      { scale: 1.00, color: '#eab308', stroke: '#fde047' },
      { scale: 0.88, color: '#14532d', stroke: '#166534' },
      { scale: 0.72, color: '#15803d', stroke: '#16a34a' },
      { scale: 0.54, color: '#22c55e', stroke: '#4ade80' },
      { scale: 0.30, color: '#475569', stroke: '#cbd5e1' },
    ],
  },
  CORAL_ATOLL_LAGOON: {
    skyStops: ['#081c2b', '#0e415e', '#14b8a6', '#a5f3fc'],
    seaStopsAngled: ['#67e8f9', '#06b6d4', '#0891b2', '#0e4f68'],
    seaStopsTop: ['#0e7490', '#06b6d4', '#164e63'],
    horizonGlow: 'rgba(165, 243, 252, 0.6)',
    sparkleColor: '236, 254, 255',
    highlightFoliage: 'rgba(110, 231, 183, 0.55)',
    peakBeaconColor: '#2dd4bf',
    layerColors: [
      { scale: 1.34, color: 'rgba(45, 212, 191, 0.28)', stroke: 'rgba(94, 234, 212, 0.4)' },
      { scale: 1.22, color: 'rgba(244, 114, 182, 0.26)', stroke: 'rgba(251, 182, 206, 0.45)' },
      { scale: 1.12, color: 'rgba(255, 255, 255, 0.52)', stroke: 'rgba(255, 255, 255, 0.72)' },
      { scale: 1.00, color: '#fde047', stroke: '#fef08a' },
      { scale: 0.86, color: '#0d9488', stroke: '#14b8a6' },
      { scale: 0.70, color: '#10b981', stroke: '#34d399' },
      { scale: 0.52, color: '#4ade80', stroke: '#86efac' },
      { scale: 0.28, color: '#f8fafc', stroke: '#e2e8f0' },
    ],
  },
  VOLCANIC_OBSIDIAN_SEA: {
    skyStops: ['#0f0612', '#2d0c1e', '#7c2d12', '#fb923c'],
    seaStopsAngled: ['#f97316', '#7c2d12', '#1e1b2e', '#090910'],
    seaStopsTop: ['#18121e', '#291722', '#09060d'],
    horizonGlow: 'rgba(251, 146, 60, 0.58)',
    sparkleColor: '253, 186, 116',
    highlightFoliage: 'rgba(249, 115, 22, 0.45)',
    peakBeaconColor: '#ef4444',
    layerColors: [
      { scale: 1.32, color: 'rgba(239, 68, 68, 0.22)', stroke: 'rgba(249, 115, 22, 0.35)' },
      { scale: 1.20, color: 'rgba(30, 27, 46, 0.55)', stroke: 'rgba(245, 158, 11, 0.38)' },
      { scale: 1.11, color: 'rgba(251, 146, 60, 0.45)', stroke: 'rgba(253, 186, 116, 0.65)' },
      { scale: 1.00, color: '#27272a', stroke: '#52525b' },
      { scale: 0.88, color: '#18181b', stroke: '#3f3f46' },
      { scale: 0.72, color: '#451a03', stroke: '#b45309' },
      { scale: 0.52, color: '#7f1d1d', stroke: '#ef4444' },
      { scale: 0.28, color: '#f97316', stroke: '#fde047' },
    ],
  },
  CYBER_GLACIER_FJORD: {
    skyStops: ['#020a18', '#082f49', '#0369a1', '#bae6fd'],
    seaStopsAngled: ['#7dd3fc', '#0369a1', '#0c3559', '#041428'],
    seaStopsTop: ['#082c4c', '#0b416e', '#03152a'],
    horizonGlow: 'rgba(186, 230, 253, 0.65)',
    sparkleColor: '240, 249, 255',
    highlightFoliage: 'rgba(186, 230, 253, 0.55)',
    peakBeaconColor: '#38bdf8',
    layerColors: [
      { scale: 1.32, color: 'rgba(56, 189, 248, 0.22)', stroke: 'rgba(125, 211, 252, 0.4)' },
      { scale: 1.20, color: 'rgba(14, 165, 233, 0.32)', stroke: 'rgba(186, 230, 253, 0.5)' },
      { scale: 1.11, color: 'rgba(240, 249, 255, 0.55)', stroke: '#ffffff' },
      { scale: 1.00, color: '#334155', stroke: '#64748b' },
      { scale: 0.88, color: '#0284c7', stroke: '#38bdf8' },
      { scale: 0.72, color: '#7dd3fc', stroke: '#bae6fd' },
      { scale: 0.54, color: '#e0f2fe', stroke: '#ffffff' },
      { scale: 0.30, color: '#ffffff', stroke: '#38bdf8' },
    ],
  },
  VERDANT_CANYON_DELTA: {
    skyStops: ['#0d1321', '#1d3557', '#457b9d', '#f4a261'],
    seaStopsAngled: ['#2ec4b6', '#0f766e', '#115e59', '#042f2e'],
    seaStopsTop: ['#0f4c4c', '#115e59', '#062c2b'],
    horizonGlow: 'rgba(244, 162, 97, 0.5)',
    sparkleColor: '204, 251, 241',
    highlightFoliage: 'rgba(163, 230, 53, 0.45)',
    peakBeaconColor: '#f59e0b',
    layerColors: [
      { scale: 1.32, color: 'rgba(16, 185, 129, 0.22)', stroke: 'rgba(52, 211, 153, 0.35)' },
      { scale: 1.20, color: 'rgba(217, 119, 6, 0.3)', stroke: 'rgba(251, 191, 36, 0.42)' },
      { scale: 1.11, color: 'rgba(204, 251, 241, 0.45)', stroke: '#ffffff' },
      { scale: 1.00, color: '#b45309', stroke: '#f59e0b' },
      { scale: 0.88, color: '#92400e', stroke: '#d97706' },
      { scale: 0.72, color: '#15803d', stroke: '#22c55e' },
      { scale: 0.54, color: '#78350f', stroke: '#fbbf24' },
      { scale: 0.30, color: '#d97706', stroke: '#fef08a' },
    ],
  },
  ATMOS_CYBER_GRID: {
    skyStops: ['#040b1e', '#0c244d', '#0284c7', '#67e8f9'],
    seaStopsAngled: ['#22d3ee', '#0369a1', '#0f172a', '#060d1f'],
    seaStopsTop: ['#0c2344', '#0e3463', '#06142b'],
    horizonGlow: 'rgba(34, 211, 238, 0.62)',
    sparkleColor: '165, 243, 252',
    highlightFoliage: 'rgba(34, 211, 238, 0.48)',
    peakBeaconColor: '#00e5ff',
    cyberGridColor: 'rgba(0, 229, 255, 0.16)',
    layerColors: [
      { scale: 1.32, color: 'rgba(6, 182, 212, 0.24)', stroke: 'rgba(34, 211, 238, 0.45)' },
      { scale: 1.20, color: 'rgba(14, 116, 144, 0.42)', stroke: 'rgba(56, 189, 248, 0.5)' },
      { scale: 1.11, color: 'rgba(165, 243, 252, 0.42)', stroke: '#67e8f9' },
      { scale: 1.00, color: '#1e293b', stroke: '#38bdf8' },
      { scale: 0.88, color: '#0f172a', stroke: '#06b6d4' },
      { scale: 0.72, color: '#164e63', stroke: '#22d3ee' },
      { scale: 0.54, color: '#334155', stroke: '#7dd3fc' },
      { scale: 0.30, color: '#00e5ff', stroke: '#ffffff' },
    ],
  },
  DEPENDENCY_NEBULA: {
    skyStops: ['#090518', '#1e1040', '#6d28d9', '#c084fc'],
    seaStopsAngled: ['#a855f7', '#4c1d95', '#1e1b4b', '#090618'],
    seaStopsTop: ['#241152', '#371b75', '#110729'],
    horizonGlow: 'rgba(192, 132, 252, 0.6)',
    sparkleColor: '233, 213, 255',
    highlightFoliage: 'rgba(52, 211, 153, 0.45)',
    peakBeaconColor: '#34d399',
    nebulaTint: 'rgba(168, 85, 247, 0.18)',
    layerColors: [
      { scale: 1.32, color: 'rgba(168, 85, 247, 0.24)', stroke: 'rgba(192, 132, 252, 0.4)' },
      { scale: 1.20, color: 'rgba(16, 185, 129, 0.25)', stroke: 'rgba(52, 211, 153, 0.45)' },
      { scale: 1.11, color: 'rgba(233, 213, 255, 0.45)', stroke: '#f3e8ff' },
      { scale: 1.00, color: '#3b0764', stroke: '#a855f7' },
      { scale: 0.88, color: '#064e3b', stroke: '#10b981' },
      { scale: 0.72, color: '#047857', stroke: '#34d399' },
      { scale: 0.54, color: '#6b21a8', stroke: '#c084fc' },
      { scale: 0.30, color: '#38bdf8', stroke: '#e0f2fe' },
    ],
  },
  CORE_BREACH_HORIZON: {
    skyStops: ['#14040a', '#3b0718', '#be123c', '#fda4af'],
    seaStopsAngled: ['#fb7185', '#9f1239', '#310816', '#0d0207'],
    seaStopsTop: ['#380919', '#5c0e26', '#17030a'],
    horizonGlow: 'rgba(251, 113, 133, 0.65)',
    sparkleColor: '254, 205, 211',
    highlightFoliage: 'rgba(250, 204, 21, 0.4)',
    peakBeaconColor: '#facc15',
    bossVortexTint: 'rgba(244, 63, 94, 0.24)',
    layerColors: [
      { scale: 1.32, color: 'rgba(244, 63, 94, 0.25)', stroke: 'rgba(251, 113, 133, 0.45)' },
      { scale: 1.20, color: 'rgba(136, 19, 55, 0.45)', stroke: 'rgba(244, 63, 94, 0.5)' },
      { scale: 1.11, color: 'rgba(254, 215, 170, 0.45)', stroke: '#fde047' },
      { scale: 1.00, color: '#1c1917', stroke: '#f59e0b' },
      { scale: 0.88, color: '#292524', stroke: '#78716c' },
      { scale: 0.72, color: '#4c0519', stroke: '#e11d48' },
      { scale: 0.54, color: '#881337', stroke: '#fb7185' },
      { scale: 0.30, color: '#facc15', stroke: '#ffffff' },
    ],
  },
};

export class ZoneEnvironmentRenderer {
  private time: number = 0;
  private scrollY: number = 0;
  public viewMode: ViewMode = 'ANGLED_25D';
  public currentZone: ZoneId = 'ARCHIPELAGO_DIGITAL';
  public manualZone: ZoneId | null = null;

  private biomeIslands: Record<ZoneId, IslandNode[]> = {
    ARCHIPELAGO_DIGITAL: [],
    CORAL_ATOLL_LAGOON: [],
    VOLCANIC_OBSIDIAN_SEA: [],
    CYBER_GLACIER_FJORD: [],
    VERDANT_CANYON_DELTA: [],
    ATMOS_CYBER_GRID: [],
    DEPENDENCY_NEBULA: [],
    CORE_BREACH_HORIZON: [],
  };
  private carriers: NavalCarrier[] = [];
  private clouds: CloudCluster[] = [];
  private stars: ParallaxStar[] = [];
  private sparkles: SeaSparkle[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initAssets();
  }

  public toggleViewMode(): ViewMode {
    this.viewMode = this.viewMode === 'ANGLED_25D' ? 'TOP_DOWN' : 'ANGLED_25D';
    return this.viewMode;
  }

  public cycleZone(): ZoneId {
    const idx = ALL_ZONES.indexOf(this.currentZone);
    const nextZone = ALL_ZONES[(idx + 1) % ALL_ZONES.length];
    this.manualZone = nextZone;
    this.currentZone = nextZone;
    return nextZone;
  }

  public clearManualZone(): void {
    this.manualZone = null;
  }

  public getZoneForState(waveIndex: number, isBossFight: boolean): ZoneId {
    if (this.manualZone) return this.manualZone;
    if (isBossFight) return 'CORE_BREACH_HORIZON';
    const cycle: ZoneId[] = [
      'ARCHIPELAGO_DIGITAL',
      'CORAL_ATOLL_LAGOON',
      'VOLCANIC_OBSIDIAN_SEA',
      'CYBER_GLACIER_FJORD',
      'VERDANT_CANYON_DELTA',
      'ATMOS_CYBER_GRID',
      'DEPENDENCY_NEBULA',
    ];
    return cycle[Math.max(0, waveIndex - 1) % cycle.length];
  }

  public getZoneLabel(zone: ZoneId): string {
    switch (zone) {
      case 'ARCHIPELAGO_DIGITAL':
        return 'ZONA 01 // ARCHIPIÉLAGO KERNEL';
      case 'CORAL_ATOLL_LAGOON':
        return 'ZONA 02 // ATOLÓN CORALINO';
      case 'VOLCANIC_OBSIDIAN_SEA':
        return 'ZONA 03 // MAR DE OBSIDIANA VOLCÁNICA';
      case 'CYBER_GLACIER_FJORD':
        return 'ZONA 04 // FIORDO GLACIAL CIBERNÉTICO';
      case 'VERDANT_CANYON_DELTA':
        return 'ZONA 05 // DELTA DE CAÑONES ESMERALDA';
      case 'ATMOS_CYBER_GRID':
        return 'ZONA 06 // ARCHIPIÉLAGO CIBER-METRÓPOLIS';
      case 'DEPENDENCY_NEBULA':
        return 'ZONA 07 // ARCHIPIÉLAGO NEBULOSA DE CRISTAL';
      case 'CORE_BREACH_HORIZON':
        return 'ZONA 08 // HORIZONTE DE NÚCLEO CARMESÍ';
    }
  }

  private seededRand(seed: number): () => number {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  private initAssets(): void {
    if (this.initialized) return;
    this.initialized = true;

    for (let i = 0; i < 140; i++) {
      const layer = (i % 3) + 1;
      this.stars.push({
        xNorm: Math.random(),
        yNorm: Math.random(),
        size: layer === 1 ? 1.0 : layer === 2 ? 1.6 : 2.3,
        layer,
        brightness: 0.25 + layer * 0.22 + Math.random() * 0.2,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < 95; i++) {
      this.sparkles.push({
        xNorm: Math.random(),
        yNorm: Math.random(),
        w: 2 + Math.random() * 6,
        speed: 0.08 + Math.random() * 0.09,
        alpha: 0.14 + Math.random() * 0.3,
      });
    }

    // Pre-bake 8-slice 2.5D islands for all 8 zones
    const islandSeeds = [1047, 2903, 4519, 6827, 9103];
    const xPositions = [0.16, 0.78, 0.45, 0.85, 0.22];
    (Object.keys(MARITIME_BIOMES) as ZoneId[]).forEach((biomeKey, bIdx) => {
      const cfg = MARITIME_BIOMES[biomeKey];
      this.biomeIslands[biomeKey] = islandSeeds.map((seed, i) => ({
        xNorm: xPositions[(i + bIdx) % xPositions.length],
        yOffset: i / islandSeeds.length,
        scale: 0.85 + (i % 3) * 0.2,
        seed: seed + bIdx * 113,
        layers: this.buildStackedIslandLayers(seed + bIdx * 113, cfg),
      }));
    });

    this.carriers = [
      { xNorm: 0.32, yOffset: 0.18, speedMult: 0.22, hullColor: '#1e293b', deckAccent: '#38bdf8' },
      { xNorm: 0.68, yOffset: 0.64, speedMult: 0.18, hullColor: '#0f172a', deckAccent: '#f59e0b' },
    ];

    for (let i = 0; i < 9; i++) {
      const rand = this.seededRand(700 + i * 131);
      const puffs: Array<{ dx: number; dy: number; r: number }> = [];
      const count = 4 + Math.floor(rand() * 4);
      for (let p = 0; p < count; p++) {
        puffs.push({
          dx: (rand() - 0.5) * 54,
          dy: (rand() - 0.5) * 26,
          r: 12 + rand() * 14,
        });
      }
      const { sprite, shadowSprite } = this.buildCloudSprites(puffs);
      this.clouds.push({
        xNorm: rand(),
        yOffset: i / 9,
        speedMult: 0.8 + rand() * 0.55,
        scale: 0.75 + rand() * 0.55,
        sprite,
        shadowSprite,
      });
    }
  }

  private buildStackedIslandLayers(seed: number, biome: MaritimeBiomeConfig): HTMLCanvasElement[] {
    const rand = this.seededRand(seed);
    const size = 168;
    const cx = size / 2;
    const cy = size / 2;

    const lobes = 2 + Math.floor(rand() * 2);
    const lobeOffsets = Array.from({ length: lobes }, () => ({
      ox: (rand() - 0.5) * 34,
      oy: (rand() - 0.5) * 24,
      rx: 34 + rand() * 20,
      ry: 24 + rand() * 16,
    }));

    const numPoints = 22;
    const angles: number[] = [];
    const jitter: number[] = [];
    for (let p = 0; p < numPoints; p++) {
      angles.push((p / numPoints) * Math.PI * 2);
      jitter.push(0.78 + rand() * 0.42);
    }

    return biome.layerColors.map((cfg, lIdx) => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const g = c.getContext('2d');
      if (!g) return c;

      g.fillStyle = cfg.color;
      g.strokeStyle = cfg.stroke;
      g.lineWidth = lIdx <= 2 ? 1.5 : 1.1;

      for (const lobe of lobeOffsets) {
        g.beginPath();
        for (let p = 0; p < numPoints; p++) {
          const a = angles[p];
          const j = jitter[(p + lIdx * 3) % numPoints];
          const px = cx + lobe.ox + Math.cos(a) * lobe.rx * cfg.scale * j;
          const py = cy + lobe.oy + Math.sin(a) * lobe.ry * cfg.scale * j;
          if (p === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
        g.closePath();
        g.fill();
        g.stroke();
      }

      if (lIdx >= 4 && lIdx <= 6) {
        g.fillStyle = biome.highlightFoliage;
        for (let k = 0; k < 10; k++) {
          const a = rand() * Math.PI * 2;
          const dist = rand() * 24 * cfg.scale;
          const bx = cx + Math.cos(a) * dist;
          const by = cy + Math.sin(a) * dist * 0.75;
          g.fillRect(Math.round(bx), Math.round(by), 4, 3);
        }
      } else if (lIdx === 7) {
        g.fillStyle = biome.peakBeaconColor;
        g.beginPath();
        g.arc(cx, cy, 2.8, 0, Math.PI * 2);
        g.fill();
      }

      return c;
    });
  }

  private buildCloudSprites(puffs: Array<{ dx: number; dy: number; r: number }>): {
    sprite: HTMLCanvasElement;
    shadowSprite: HTMLCanvasElement;
  } {
    const w = 140;
    const h = 90;
    const sprite = document.createElement('canvas');
    sprite.width = w;
    sprite.height = h;
    const ctx = sprite.getContext('2d')!;

    const shadowSprite = document.createElement('canvas');
    shadowSprite.width = w;
    shadowSprite.height = h;
    const sctx = shadowSprite.getContext('2d')!;

    const cx = w / 2;
    const cy = h / 2;

    sctx.fillStyle = 'rgba(2, 10, 28, 0.34)';
    for (const p of puffs) {
      sctx.beginPath();
      sctx.arc(cx + p.dx, cy + p.dy, p.r, 0, Math.PI * 2);
      sctx.fill();
    }

    const tiers = [
      { dy: 5, color: 'rgba(148, 163, 184, 0.85)', scale: 1.02 },
      { dy: 0, color: 'rgba(226, 232, 240, 0.92)', scale: 0.95 },
      { dy: -5, color: 'rgba(255, 255, 255, 0.98)', scale: 0.82 },
    ];

    for (const tier of tiers) {
      ctx.fillStyle = tier.color;
      for (const p of puffs) {
        ctx.beginPath();
        ctx.arc(cx + p.dx, cy + p.dy + tier.dy, p.r * tier.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return { sprite, shadowSprite };
  }

  public update(dt: number, waveIndex: number, isBossFight: boolean, isBoosting: boolean = false): void {
    this.time += dt;
    this.currentZone = this.getZoneForState(waveIndex, isBossFight);
    const speedFactor = isBoosting ? 2.1 : 1.0;
    this.scrollY += dt * 0.14 * speedFactor;

    for (const s of this.stars) {
      s.yNorm += dt * (0.015 * s.layer) * speedFactor;
      if (s.yNorm > 1) {
        s.yNorm -= 1;
        s.xNorm = Math.random();
      }
    }

    for (const sp of this.sparkles) {
      sp.yNorm += dt * sp.speed * speedFactor;
      if (sp.yNorm > 1) {
        sp.yNorm -= 1;
        sp.xNorm = Math.random();
      }
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerNormX: number = 0.5
  ): void {
    const parallaxOffset = (playerNormX - 0.5) * -45;
    this.render25DWorldZone(ctx, width, height, parallaxOffset, this.currentZone);

    ctx.save();
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${this.getZoneLabel(this.currentZone)} // VIEW: ${this.viewMode === 'ANGLED_25D' ? '2.5D HORIZON' : 'TOP-DOWN'}`,
      14,
      height - 56
    );
    ctx.restore();
  }

  private render25DWorldZone(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    parallaxX: number,
    zone: ZoneId
  ): void {
    const cfg = MARITIME_BIOMES[zone] || MARITIME_BIOMES.ARCHIPELAGO_DIGITAL;
    const islands = this.biomeIslands[zone] || this.biomeIslands.ARCHIPELAGO_DIGITAL;
    const isAngled = this.viewMode === 'ANGLED_25D';
    const horizonY = isAngled ? h * 0.34 : 0;

    if (isAngled) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, cfg.skyStops[0]);
      skyGrad.addColorStop(0.55, cfg.skyStops[1]);
      skyGrad.addColorStop(0.88, cfg.skyStops[2]);
      skyGrad.addColorStop(1, cfg.skyStops[3]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY + 2);

      // Subtle atmospheric aurora or cyber-sky highlights
      if (cfg.nebulaTint) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const neb = ctx.createRadialGradient(w * 0.5 + parallaxX * 0.2, horizonY * 0.65, 10, w * 0.5, horizonY * 0.65, w * 0.45);
        neb.addColorStop(0, cfg.nebulaTint);
        neb.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = neb;
        ctx.fillRect(0, 0, w, horizonY);
        ctx.restore();
      } else if (cfg.bossVortexTint) {
        ctx.save();
        ctx.translate(w * 0.5 + parallaxX * 0.2, horizonY * 0.52);
        for (let r = 1; r <= 2; r++) {
          ctx.rotate(this.time * (r === 1 ? 0.5 : -0.7));
          ctx.strokeStyle = cfg.bossVortexTint;
          ctx.lineWidth = 2;
          ctx.setLineDash([14 * r, 10]);
          ctx.beginPath();
          ctx.arc(0, 0, 52 * r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let band = 0; band < 5; band++) {
        ctx.fillRect(0, horizonY - 12 - band * 14, w, 4);
      }

      for (const s of this.stars) {
        const sy = s.yNorm * horizonY * 0.68;
        const twinkle = 0.75 + Math.sin(this.time * 3 + s.twinklePhase) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness * 0.55 * twinkle})`;
        ctx.fillRect((s.xNorm * w + parallaxX * 0.1 * s.layer + w) % w, sy, s.size, s.size);
      }
    }

    const seaGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    if (isAngled) {
      seaGrad.addColorStop(0, cfg.seaStopsAngled[0]);
      seaGrad.addColorStop(0.18, cfg.seaStopsAngled[1]);
      seaGrad.addColorStop(0.55, cfg.seaStopsAngled[2]);
      seaGrad.addColorStop(1, cfg.seaStopsAngled[3]);
    } else {
      seaGrad.addColorStop(0, cfg.seaStopsTop[0]);
      seaGrad.addColorStop(0.5, cfg.seaStopsTop[1]);
      seaGrad.addColorStop(1, cfg.seaStopsTop[2]);
    }
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    if (isAngled) {
      ctx.fillStyle = cfg.horizonGlow;
      ctx.fillRect(0, horizonY - 1, w, 3);
    }

    // Optional Mode-7 perspective grid shimmer overlaid on cyber-ocean zones
    if (cfg.cyberGridColor && isAngled) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY, w, h - horizonY);
      ctx.clip();
      ctx.strokeStyle = cfg.cyberGridColor;
      ctx.lineWidth = 1;
      const vpX = w / 2 + parallaxX * 0.45;
      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(vpX + i * 28, horizonY);
        ctx.lineTo(vpX + i * 140, h);
        ctx.stroke();
      }
      const phase = (this.scrollY * 2.8) % 1;
      for (let r = 0; r < 10; r++) {
        const t = (r + phase) / 10;
        const gy = horizonY + Math.pow(t, 2.0) * (h - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }
      ctx.restore();
    }

    for (const sp of this.sparkles) {
      const sy = isAngled
        ? horizonY + Math.pow(sp.yNorm, 1.6) * (h - horizonY)
        : sp.yNorm * h;
      const sx = sp.xNorm * w + parallaxX * 0.35;
      const depthScale = isAngled ? 0.35 + sp.yNorm * 1.1 : 1.0;
      ctx.fillStyle = `rgba(${cfg.sparkleColor}, ${sp.alpha})`;
      ctx.fillRect(sx, sy, sp.w * depthScale, 1.5);
    }

    // Allied Naval Carriers & Trailing Wakes
    for (const ship of this.carriers) {
      const t = (ship.yOffset + this.scrollY * ship.speedMult) % 1.0;
      const sy = isAngled
        ? horizonY + 18 + Math.pow(t, 1.85) * (h - horizonY + 40)
        : -60 + t * (h + 120);
      const scale = isAngled ? 0.34 + t * 0.85 : 0.9;
      const sx = w * 0.5 + (ship.xNorm - 0.5) * w * (isAngled ? 0.42 + t * 0.8 : 1.0) + parallaxX * (0.45 + t * 0.4);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(scale, scale * (isAngled ? 0.72 : 1.0));

      const wakePulse = 0.28 + Math.sin(this.time * 6) * 0.08;
      ctx.fillStyle = `rgba(255, 255, 255, ${wakePulse})`;
      ctx.beginPath();
      ctx.moveTo(-6, 18);
      ctx.lineTo(-18, 48);
      ctx.lineTo(18, 48);
      ctx.lineTo(6, 18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = ship.hullColor;
      ctx.strokeStyle = ship.deckAccent;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(10, -10);
      ctx.lineTo(11, 20);
      ctx.lineTo(-11, 20);
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(-1, -18);
      ctx.lineTo(2, 16);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#334155';
      ctx.fillRect(5, -6, 4, 12);
      ctx.restore();
    }

    // 8-Layer Stacked Islands sorted back-to-front
    const projectedIslands = islands.map((isl) => {
      const t = (isl.yOffset + this.scrollY * 0.42) % 1.0;
      const sy = isAngled
        ? horizonY + 12 + Math.pow(t, 1.9) * (h - horizonY + 60)
        : -90 + t * (h + 180);
      const depthScale = isAngled ? (0.28 + Math.pow(t, 1.15) * 0.95) * isl.scale : isl.scale;
      const sx = w * 0.5 + (isl.xNorm - 0.5) * w * (isAngled ? 0.4 + t * 0.85 : 1.0) + parallaxX * (0.4 + t * 0.5);
      return { isl, sx, sy, depthScale };
    }).sort((a, b) => a.sy - b.sy);

    for (const item of projectedIslands) {
      const { isl, sx, sy, depthScale } = item;
      const drawSize = 168 * depthScale;
      const layerLift = (isAngled ? 3.8 : 2.3) * depthScale;
      const aspectY = isAngled ? 0.62 : 0.92;

      for (let l = 0; l < isl.layers.length; l++) {
        const layerCanvas = isl.layers[l];
        const ly = sy - l * layerLift;
        ctx.drawImage(
          layerCanvas,
          sx - drawSize / 2,
          ly - (drawSize * aspectY) / 2,
          drawSize,
          drawSize * aspectY
        );
      }
    }

    // Cloud Ground Shadows + Fluffy Volumetric Clouds
    const projectedClouds = this.clouds.map((cl) => {
      const t = (cl.yOffset + this.scrollY * cl.speedMult * 0.72) % 1.0;
      const sy = isAngled
        ? horizonY + 8 + Math.pow(t, 1.7) * (h - horizonY + 80)
        : -80 + t * (h + 160);
      const depthScale = isAngled ? (0.35 + t * 0.9) * cl.scale : cl.scale;
      const sx = w * 0.5 + (cl.xNorm - 0.5) * w * (isAngled ? 0.45 + t * 0.8 : 1.0) + parallaxX * (0.7 + t * 0.6);
      return { cl, sx, sy, depthScale };
    });

    for (const c of projectedClouds) {
      const cw = 140 * c.depthScale;
      const ch = 90 * c.depthScale * (isAngled ? 0.58 : 0.85);
      ctx.drawImage(
        c.cl.shadowSprite,
        c.sx - cw / 2 + 24 * c.depthScale,
        c.sy - ch / 2 + 34 * c.depthScale,
        cw,
        ch
      );
    }

    for (const c of projectedClouds) {
      const cw = 140 * c.depthScale;
      const ch = 90 * c.depthScale * (isAngled ? 0.68 : 0.92);
      ctx.drawImage(c.cl.sprite, c.sx - cw / 2, c.sy - ch / 2 - 18 * c.depthScale, cw, ch);
    }

    const vignetteGrad = ctx.createLinearGradient(0, 0, 0, h);
    vignetteGrad.addColorStop(0, 'rgba(3, 8, 22, 0.48)');
    vignetteGrad.addColorStop(0.25, 'rgba(3, 8, 22, 0.08)');
    vignetteGrad.addColorStop(0.75, 'rgba(3, 8, 22, 0.08)');
    vignetteGrad.addColorStop(1, 'rgba(3, 8, 22, 0.46)');
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, w, h);
  }
}
