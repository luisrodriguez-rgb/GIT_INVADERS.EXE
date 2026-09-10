/**
 * GIT_INVADERS.EXE // SHIP DNA
 * Parametric design generator that sculpts physical geometry, mechanical families,
 * and materials directly from ship stats and repository genetics.
 */

import { ShipSkin } from '../../store/Store';

export type HullFamily =
  | 'delta_interceptor'
  | 'ramjet_dragster'
  | 'forward_swept'
  | 'quantum_trimaran'
  | 'hammerhead_ram'
  | 'x_dreadnought'
  | 'fractal_asymmetric'
  | 'toroidal_ring'
  | 'stealth_dagger'
  | 'phoenix_swept'
  | 'delta'
  | 'needle'
  | 'dreadnought'
  | 'ring'
  | 'fractal';

export type WingFamily =
  | 'delta_wings'
  | 'flared_dragster'
  | 'forward_switchblade'
  | 'detached_magnetic'
  | 'heavy_prow'
  | 'quad_x'
  | 'fractal_shards'
  | 'orbital_ring'
  | 'dagger_wings'
  | 'phoenix_wings'
  | 'sweep'
  | 'split'
  | 'fold'
  | 'delta'
  | 'floating'
  | 'orbital';

export type EngineFamily = 'twin_ion' | 'quad_plasma' | 'heavy_thruster' | 'warp_ring' | 'singular_afterburner';
export type WeaponFamily = 'dual_laser' | 'plasma_spread' | 'heavy_cannon' | 'quantum_beam' | 'distributed_array';
export type MaterialFamily = 'stealth_matte' | 'titanium_brushed' | 'gold_armor' | 'cyber_neon' | 'corrupted_alloy';

export interface ShipVisualDNA {
  id: string;
  name: string;
  hullFamily: HullFamily;
  wingFamily: WingFamily;
  engineFamily: EngineFamily;
  weaponFamily: WeaponFamily;
  materialFamily: MaterialFamily;

  // Physical structural parameters translated from stats
  plateThickness: number; // 1 to 4 px
  bevelWidth: number;     // 1 to 3 px
  wingSweep: number;      // 0.2 to 0.9 (angle & sharpness)
  engineCount: number;    // 1 to 4
  engineRadius: number;   // 3 to 9 px
  weaponCount: number;    // 1 to 4
  rivetDensity: number;   // 0 (sleek) to 8 (heavy industrial)

  // Multi-Tone Color & Lighting Palette
  hullBaseColor: string;
  hullHighlightColor: string;
  hullShadowColor: string;
  plateFillColor: string;
  accentColor: string;
  secondaryAccentColor: string;
  tertiaryDecalColor: string;
  engineGlowColor: string;
  cockpitGlassColor: string;
  cockpitRefractColor: string;
}

export class ShipDNAGenerator {
  public static fromSkin(skin: ShipSkin): ShipVisualDNA {
    const armor = skin.stats.armor;
    const speed = skin.stats.speed;
    const fireRate = skin.stats.fireRate;

    // 1. Plate thickness & bevel from Armor
    let plateThickness = 1.5;
    let bevelWidth = 1.2;
    let rivetDensity = 2;
    if (armor > 80) {
      plateThickness = 3.5;
      bevelWidth = 2.4;
      rivetDensity = 8;
    } else if (armor > 60) {
      plateThickness = 2.5;
      bevelWidth = 1.8;
      rivetDensity = 5;
    } else if (armor > 30) {
      plateThickness = 2.0;
      bevelWidth = 1.4;
      rivetDensity = 3;
    }

    // 2. Wing sweep & profile from Speed
    let wingSweep = 0.5;
    if (speed > 80) wingSweep = 0.85;
    else if (speed > 60) wingSweep = 0.70;
    else if (speed < 35) wingSweep = 0.30;

    // 3. Weapon layout from Fire Rate
    let weaponCount = 2;
    if (fireRate > 80) weaponCount = 4;
    else if (fireRate < 35) weaponCount = 1;

    // 4. Determine exclusive design families for each ship
    let hullFamily: HullFamily = 'delta_interceptor';
    let wingFamily: WingFamily = 'delta_wings';
    let engineFamily: EngineFamily = 'twin_ion';
    let weaponFamily: WeaponFamily = 'dual_laser';
    let materialFamily: MaterialFamily = 'titanium_brushed';

    switch (skin.id) {
      case 'cyber_falcon':
      case 'compiler_delta':
      case 'cyan':
        hullFamily = 'delta_interceptor';
        wingFamily = 'delta_wings';
        engineFamily = 'twin_ion';
        weaponFamily = 'dual_laser';
        materialFamily = 'titanium_brushed';
        break;

      case 'neon_overdrive':
      case 'red':
        hullFamily = 'ramjet_dragster';
        wingFamily = 'flared_dragster';
        engineFamily = 'singular_afterburner';
        weaponFamily = 'plasma_spread';
        materialFamily = 'cyber_neon';
        break;

      case 'phantom_violet':
      case 'purple':
        hullFamily = 'forward_swept';
        wingFamily = 'forward_switchblade';
        engineFamily = 'twin_ion';
        weaponFamily = 'dual_laser';
        materialFamily = 'stealth_matte';
        break;

      case 'quantum_wing':
        hullFamily = 'quantum_trimaran';
        wingFamily = 'detached_magnetic';
        engineFamily = 'warp_ring';
        weaponFamily = 'quantum_beam';
        materialFamily = 'cyber_neon';
        break;

      case 'solar_gold':
      case 'gold':
        hullFamily = 'hammerhead_ram';
        wingFamily = 'heavy_prow';
        engineFamily = 'heavy_thruster';
        weaponFamily = 'heavy_cannon';
        materialFamily = 'gold_armor';
        break;

      case 'codebreaker_x':
      case 'codebreaker':
      case 'codebreaker____x':
      case 'codebreaker___x':
      case 'dreadnought':
        hullFamily = 'x_dreadnought';
        wingFamily = 'quad_x';
        engineFamily = 'quad_plasma';
        weaponFamily = 'heavy_cannon';
        materialFamily = 'stealth_matte';
        break;

      case 'emerald_glitch':
      case 'green':
        hullFamily = 'fractal_asymmetric';
        wingFamily = 'fractal_shards';
        engineFamily = 'warp_ring';
        weaponFamily = 'quantum_beam';
        materialFamily = 'corrupted_alloy';
        break;

      case 'quantum_citadel':
        hullFamily = 'toroidal_ring';
        wingFamily = 'orbital_ring';
        engineFamily = 'quad_plasma';
        weaponFamily = 'distributed_array';
        materialFamily = 'titanium_brushed';
        break;

      case 'hyper_void':
      case 'void_stalker':
      case 'void':
        hullFamily = 'stealth_dagger';
        wingFamily = 'dagger_wings';
        engineFamily = 'twin_ion';
        weaponFamily = 'dual_laser';
        materialFamily = 'stealth_matte';
        break;

      case 'solar_flare':
      case 'solar_phoenix':
      case 'phoenix':
        hullFamily = 'phoenix_swept';
        wingFamily = 'phoenix_wings';
        engineFamily = 'singular_afterburner';
        weaponFamily = 'plasma_spread';
        materialFamily = 'cyber_neon';
        break;
    }

    // Curated Multi-Tone Palettes (Zero boring mono-color repetition)
    const palettes: Record<string, {
      hullBase: string;
      hullHighlight: string;
      hullShadow: string;
      plateFill: string;
      accent: string;
      secondaryAccent: string;
      tertiaryDecal: string;
      glow: string;
      glass: string;
    }> = {
      cyber_falcon: {
        hullBase: '#0a1c2e',
        hullHighlight: '#183f66',
        hullShadow: '#030a12',
        plateFill: '#0e263d',
        accent: '#00e5ff',
        secondaryAccent: '#38bdf8',
        tertiaryDecal: '#f59e0b',
        glow: '#38bdf8',
        glass: 'rgba(0, 229, 255, 0.45)',
      },
      neon_overdrive: {
        hullBase: '#260512',
        hullHighlight: '#4a0b25',
        hullShadow: '#0d0206',
        plateFill: '#330718',
        accent: '#ff0055',
        secondaryAccent: '#ff7700',
        tertiaryDecal: '#ffea00',
        glow: '#ff7700',
        glass: 'rgba(255, 119, 0, 0.5)',
      },
      phantom_violet: {
        hullBase: '#140824',
        hullHighlight: '#2c124d',
        hullShadow: '#08020f',
        plateFill: '#1d0c33',
        accent: '#a855f7',
        secondaryAccent: '#00f5ff',
        tertiaryDecal: '#c084fc',
        glow: '#c084fc',
        glass: 'rgba(168, 85, 247, 0.45)',
      },
      quantum_wing: {
        hullBase: '#041a22',
        hullHighlight: '#0a3748',
        hullShadow: '#010a0e',
        plateFill: '#082836',
        accent: '#06b6d4',
        secondaryAccent: '#6366f1',
        tertiaryDecal: '#e0e7ff',
        glow: '#6366f1',
        glass: 'rgba(99, 102, 241, 0.45)',
      },
      solar_gold: {
        hullBase: '#241804',
        hullHighlight: '#473009',
        hullShadow: '#0d0801',
        plateFill: '#362406',
        accent: '#f59e0b',
        secondaryAccent: '#fbbf24',
        tertiaryDecal: '#ef4444',
        glow: '#fbbf24',
        glass: 'rgba(251, 191, 36, 0.45)',
      },
      codebreaker_x: {
        hullBase: '#1b0720',
        hullHighlight: '#3a1044',
        hullShadow: '#0a020d',
        plateFill: '#260a2d',
        accent: '#ec4899',
        secondaryAccent: '#10b981',
        tertiaryDecal: '#7c3aed',
        glow: '#7c3aed',
        glass: 'rgba(236, 72, 153, 0.45)',
      },
      emerald_glitch: {
        hullBase: '#051b11',
        hullHighlight: '#0d3925',
        hullShadow: '#010b07',
        plateFill: '#0a291a',
        accent: '#10b981',
        secondaryAccent: '#facc15',
        tertiaryDecal: '#38bdf8',
        glow: '#a3e635',
        glass: 'rgba(16, 185, 129, 0.45)',
      },
      quantum_citadel: {
        hullBase: '#0c152b',
        hullHighlight: '#1c2e59',
        hullShadow: '#040712',
        plateFill: '#142245',
        accent: '#3b82f6',
        secondaryAccent: '#f8fafc',
        tertiaryDecal: '#f59e0b',
        glow: '#e2e8f0',
        glass: 'rgba(59, 130, 246, 0.45)',
      },
      hyper_void: {
        hullBase: '#090a10',
        hullHighlight: '#181b2a',
        hullShadow: '#020305',
        plateFill: '#111422',
        accent: '#ef4444',
        secondaryAccent: '#f59e0b',
        tertiaryDecal: '#ffffff',
        glow: '#ef4444',
        glass: 'rgba(239, 68, 68, 0.5)',
      },
      void_stalker: {
        hullBase: '#090a10',
        hullHighlight: '#181b2a',
        hullShadow: '#020305',
        plateFill: '#111422',
        accent: '#ef4444',
        secondaryAccent: '#f59e0b',
        tertiaryDecal: '#ffffff',
        glow: '#ef4444',
        glass: 'rgba(239, 68, 68, 0.5)',
      },
      solar_flare: {
        hullBase: '#260e04',
        hullHighlight: '#4a1f09',
        hullShadow: '#0e0501',
        plateFill: '#381606',
        accent: '#ea580c',
        secondaryAccent: '#facc15',
        tertiaryDecal: '#06b6d4',
        glow: '#f97316',
        glass: 'rgba(250, 204, 21, 0.5)',
      },
      solar_phoenix: {
        hullBase: '#260e04',
        hullHighlight: '#4a1f09',
        hullShadow: '#0e0501',
        plateFill: '#381606',
        accent: '#ea580c',
        secondaryAccent: '#facc15',
        tertiaryDecal: '#06b6d4',
        glow: '#f97316',
        glass: 'rgba(250, 204, 21, 0.5)',
      },
    };

    const normKey = (skin.id || '').toLowerCase().replace(/[\s\/\-]+/g, '_');
    const p = palettes[skin.id] || palettes[normKey] || palettes.cyber_falcon;
    const accent = (skin as any).primaryColor || (skin as any).hullColor || p.accent;
    const glow = (skin as any).trailColor || (skin as any).glowColor || p.glow;

    return {
      id: skin.id,
      name: skin.name,
      hullFamily,
      wingFamily,
      engineFamily,
      weaponFamily,
      materialFamily,
      plateThickness,
      bevelWidth,
      wingSweep,
      engineCount: engineFamily === 'quad_plasma' ? 4 : engineFamily === 'heavy_thruster' ? 3 : engineFamily === 'singular_afterburner' ? 1 : 2,
      engineRadius: engineFamily === 'singular_afterburner' ? 8.5 : engineFamily === 'heavy_thruster' ? 6.5 : engineFamily === 'quad_plasma' ? 4.0 : 4.5,
      weaponCount,
      rivetDensity,
      hullBaseColor: (skin as any).baseColor || p.hullBase,
      hullHighlightColor: (skin as any).detailColor || p.hullHighlight,
      hullShadowColor: p.hullShadow,
      plateFillColor: p.plateFill,
      accentColor: accent,
      secondaryAccentColor: p.secondaryAccent,
      tertiaryDecalColor: p.tertiaryDecal,
      engineGlowColor: glow,
      cockpitGlassColor: p.glass,
      cockpitRefractColor: '#ffffff',
    };
  }

  public static fromSkinId(skinId: string, customHullColor?: string, customGlowColor?: string): ShipVisualDNA {
    const skins: Record<string, { id: string; name: string; armor: number; speed: number; fireRate: number; hullColor: string; glowColor: string }> = {
      cyber_falcon: { id: 'cyber_falcon', name: 'CYBER FALCON', armor: 60, speed: 70, fireRate: 60, hullColor: '#00e5ff', glowColor: '#38bdf8' },
      compiler_delta: { id: 'cyber_falcon', name: 'CYBER FALCON', armor: 60, speed: 70, fireRate: 60, hullColor: '#00e5ff', glowColor: '#38bdf8' },
      cyan: { id: 'cyber_falcon', name: 'CYBER FALCON', armor: 60, speed: 70, fireRate: 60, hullColor: '#00e5ff', glowColor: '#38bdf8' },
      phantom_violet: { id: 'phantom_violet', name: 'PHANTOM VIOLET', armor: 40, speed: 100, fireRate: 70, hullColor: '#a855f7', glowColor: '#c084fc' },
      purple: { id: 'phantom_violet', name: 'PHANTOM VIOLET', armor: 40, speed: 100, fireRate: 70, hullColor: '#a855f7', glowColor: '#c084fc' },
      solar_gold: { id: 'solar_gold', name: 'SOLAR GOLD', armor: 100, speed: 30, fireRate: 40, hullColor: '#f59e0b', glowColor: '#fbbf24' },
      gold: { id: 'solar_gold', name: 'SOLAR GOLD', armor: 100, speed: 30, fireRate: 40, hullColor: '#f59e0b', glowColor: '#fbbf24' },
      emerald_glitch: { id: 'emerald_glitch', name: 'EMERALD GLITCH', armor: 50, speed: 80, fireRate: 60, hullColor: '#10b981', glowColor: '#a3e635' },
      green: { id: 'emerald_glitch', name: 'EMERALD GLITCH', armor: 50, speed: 80, fireRate: 60, hullColor: '#10b981', glowColor: '#a3e635' },
      neon_overdrive: { id: 'neon_overdrive', name: 'NEON OVERDRIVE', armor: 40, speed: 90, fireRate: 90, hullColor: '#ff0055', glowColor: '#ff7700' },
      red: { id: 'neon_overdrive', name: 'NEON OVERDRIVE', armor: 40, speed: 90, fireRate: 90, hullColor: '#ff0055', glowColor: '#ff7700' },
      quantum_wing: { id: 'quantum_wing', name: 'QUANTUM WING', armor: 50, speed: 70, fireRate: 60, hullColor: '#06b6d4', glowColor: '#6366f1' },
      quantum_citadel: { id: 'quantum_citadel', name: 'QUANTUM CITADEL', armor: 70, speed: 60, fireRate: 70, hullColor: '#3b82f6', glowColor: '#e2e8f0' },
      codebreaker_x: { id: 'codebreaker_x', name: 'CODEBREAKER // X', armor: 100, speed: 50, fireRate: 100, hullColor: '#ec4899', glowColor: '#7c3aed' },
      codebreaker: { id: 'codebreaker_x', name: 'CODEBREAKER // X', armor: 100, speed: 50, fireRate: 100, hullColor: '#ec4899', glowColor: '#7c3aed' },
      codebreaker____x: { id: 'codebreaker_x', name: 'CODEBREAKER // X', armor: 100, speed: 50, fireRate: 100, hullColor: '#ec4899', glowColor: '#7c3aed' },
      codebreaker___x: { id: 'codebreaker_x', name: 'CODEBREAKER // X', armor: 100, speed: 50, fireRate: 100, hullColor: '#ec4899', glowColor: '#7c3aed' },
      dreadnought: { id: 'codebreaker_x', name: 'CODEBREAKER // X', armor: 100, speed: 50, fireRate: 100, hullColor: '#ec4899', glowColor: '#7c3aed' },
      hyper_void: { id: 'hyper_void', name: 'VOID STALKER', armor: 40, speed: 95, fireRate: 80, hullColor: '#ef4444', glowColor: '#f59e0b' },
      void_stalker: { id: 'hyper_void', name: 'VOID STALKER', armor: 40, speed: 95, fireRate: 80, hullColor: '#ef4444', glowColor: '#f59e0b' },
      void: { id: 'hyper_void', name: 'VOID STALKER', armor: 40, speed: 95, fireRate: 80, hullColor: '#ef4444', glowColor: '#f59e0b' },
      solar_flare: { id: 'solar_flare', name: 'SOLAR PHOENIX', armor: 60, speed: 85, fireRate: 85, hullColor: '#ea580c', glowColor: '#facc15' },
      solar_phoenix: { id: 'solar_flare', name: 'SOLAR PHOENIX', armor: 60, speed: 85, fireRate: 85, hullColor: '#ea580c', glowColor: '#facc15' },
      phoenix: { id: 'solar_flare', name: 'SOLAR PHOENIX', armor: 60, speed: 85, fireRate: 85, hullColor: '#ea580c', glowColor: '#facc15' },
    };

    const normalized = (skinId || '').toLowerCase().replace(/[\s\/\-]+/g, '_');
    const preset = skins[skinId] || skins[normalized] || skins.cyber_falcon;
    const skinMock: any = {
      id: preset.id,
      name: preset.name,
      hullColor: customHullColor || preset.hullColor,
      glowColor: customGlowColor || preset.glowColor,
      stats: {
        armor: preset.armor,
        speed: preset.speed,
        fireRate: preset.fireRate,
        shield: 50,
      },
    };
    return this.fromSkin(skinMock);
  }

  public static fromRepository(repoName: string, langColor: string, threat: number): ShipVisualDNA {
    const isHeavy = threat > 75;
    const isAgile = threat < 45;

    return {
      id: `proc_${repoName}`,
      name: `PROCEDURAL // ${repoName.toUpperCase()}`,
      hullFamily: isHeavy ? 'dreadnought' : isAgile ? 'needle' : 'delta',
      wingFamily: isHeavy ? 'fold' : isAgile ? 'split' : 'sweep',
      engineFamily: isHeavy ? 'heavy_thruster' : 'twin_ion',
      weaponFamily: isHeavy ? 'heavy_cannon' : 'plasma_spread',
      materialFamily: isHeavy ? 'gold_armor' : 'cyber_neon',
      plateThickness: isHeavy ? 3.2 : 2.0,
      bevelWidth: isHeavy ? 2.0 : 1.4,
      wingSweep: isAgile ? 0.8 : 0.5,
      engineCount: isHeavy ? 3 : 2,
      engineRadius: isHeavy ? 6 : 4.5,
      weaponCount: 2,
      rivetDensity: isHeavy ? 7 : 3,
      hullBaseColor: '#060f20',
      hullHighlightColor: '#122540',
      hullShadowColor: '#01050a',
      plateFillColor: '#0c1a2e',
      accentColor: langColor || '#00e5ff',
      secondaryAccentColor: '#38bdf8',
      tertiaryDecalColor: '#f59e0b',
      engineGlowColor: langColor || '#00e5ff',
      cockpitGlassColor: 'rgba(0, 229, 255, 0.3)',
      cockpitRefractColor: '#ffffff',
    };
  }
}
