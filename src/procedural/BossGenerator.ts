import {
  BossBlueprint,
  BossPhaseConfig,
  RepositoryDNA,
  BossArchetype,
  BossMutation,
  BossArchetypeData,
  GitHubMetrics,
  BehaviorMatrixEntry,
  BossGenome,
  MissionDirective,
  MissionReward,
} from '../github/Types';

export const ARCHETYPE_DATABASE: Record<BossArchetype, BossArchetypeData> = {
  commit_core: {
    archetype: 'commit_core',
    codeNumber: '01',
    title: 'THE COMMIT CORE',
    canonicalRepo: '/alpha-project',
    profileDescription: 'High commit velocity and rapid continuous integration codebase.',
    specialStatName: 'SPAWN',
    specialStatValue: 90,
    baseHpRating: 80,
    shieldRating: 60,
    attackRating: 80,
    speedRating: 50,
    abilities: [
      { id: 'commit_storm', name: 'LLUVIA DE COMMITS', icon: '[*]', description: 'Barrage of rapid mini-commit projectiles scaled to commit volume.' },
      { id: 'history_pulse', name: 'DRONES DE HISTORIAL', icon: '(O)', description: 'Circular orbital drones releasing kinetic shockwave rings.' },
      { id: 'commit_replication', name: 'LÁSER CENTRAL', icon: '<|>', description: 'Core thermal beam charging and replicating new commit invaders.' },
    ],
    conceptQuote: 'Cada commit fortalece su núcleo. No dejes que se compile.',
    finalPhaseName: 'HISTORY OVERFLOW',
  },
  the_fortress: {
    archetype: 'the_fortress',
    codeNumber: '02',
    title: 'THE FORTRESS',
    canonicalRepo: '/mobile-app',
    profileDescription: 'Massive collaborative pull-request repository with defensive code review barriers.',
    specialStatName: 'DEFENSA',
    specialStatValue: 100,
    baseHpRating: 70,
    shieldRating: 100,
    attackRating: 50,
    speedRating: 30,
    abilities: [
      { id: 'pr_deflector', name: 'ESCUDO DEFLECTOR', icon: '[#]', description: 'Heavy rotating armor deflectors absorbing and reflecting frontal shots.' },
      { id: 'pr_turrets', name: 'TORRETA DE PRs', icon: '<T>', description: 'Autonomous PR turrets firing independent interlocking laser beams.' },
      { id: 'merge_barrier', name: 'BARRERA DE MERGE', icon: '===', description: 'Deployable horizontal energy wall that shields the central PR core.' },
    ],
    conceptQuote: 'No todo PR es una victoria. Algunos se defienden hasta el final.',
    finalPhaseName: 'MERGE LOCK',
  },
  issue_swarm: {
    archetype: 'issue_swarm',
    codeNumber: '03',
    title: 'THE ISSUE SWARM',
    canonicalRepo: '/bug-hunter',
    profileDescription: 'High bug-density tracker manifesting as a living biomechanical swarm.',
    specialStatName: 'ENJAMBRE',
    specialStatValue: 100,
    baseHpRating: 60,
    shieldRating: 40,
    attackRating: 80,
    speedRating: 90,
    abilities: [
      { id: 'bug_bomb', name: 'BOMBAS DE BUGS', icon: '(!)', description: 'Homing bio-mechanical cluster bombs tracking player coordinates.' },
      { id: 'swarm_attack', name: 'ENJAMBRE', icon: '{~}', description: 'Erratic multi-target scatter attack from articulated bio-tentacles.' },
      { id: 'error_cascade', name: 'TRACKING', icon: '>>>', description: 'Chained rapid strikes escalating on drone destruction.' },
    ],
    conceptQuote: 'Un issue no es un problema... hasta que se multiplica.',
    finalPhaseName: 'CRITICAL BUG',
  },
  dependency_hydra: {
    archetype: 'dependency_hydra',
    codeNumber: '04',
    title: 'THE DEPENDENCY HYDRA',
    canonicalRepo: '/infra-service',
    profileDescription: 'Interlocking multi-module dependency tree with interconnected head nodes.',
    specialStatName: 'COMPLEJIDAD',
    specialStatValue: 100,
    baseHpRating: 80,
    shieldRating: 70,
    attackRating: 70,
    speedRating: 50,
    abilities: [
      { id: 'dependency_chain', name: 'CADENA DE DEPENDENCIAS', icon: '-o-', description: 'Energy tether linking nodes that grants high damage reduction.' },
      { id: 'node_explosion', name: 'EXPLOSIÓN DE NODOS', icon: '<*>', description: 'Detonating dependency sub-nodes release high-velocity kinetic shards.' },
      { id: 'dependency_spawn', name: 'SPAWN MASIVO', icon: '[+]', description: 'Spawns autonomous child dependency drones into flanking orbits.' },
    ],
    conceptQuote: 'Una dependencia lleva a otra, y a otra, y a otra...',
    finalPhaseName: 'DEPENDENCY HELL',
  },
  merge_conflict: {
    archetype: 'merge_conflict',
    codeNumber: '05',
    title: 'THE MERGE CONFLICT',
    canonicalRepo: '/feature-branch',
    profileDescription: 'Bifurcated entity torn between <<<<<<< HEAD and >>>>>>> branch realities.',
    specialStatName: 'CONFLICTO',
    specialStatValue: 100,
    baseHpRating: 70,
    shieldRating: 70,
    attackRating: 70,
    speedRating: 60,
    abilities: [
      { id: 'branch_split', name: 'DIVISIÓN DE RAMAS', icon: '<\>', description: 'Chassis splits temporarily into two independent dual-phase hulls.' },
      { id: 'conflict_laser', name: 'CONFLICTO DE LÍNEAS', icon: '><', description: 'Crossing diagonal X-beam laser grid carving intersecting danger zones.' },
      { id: 'merge_explosion', name: 'EXPLOSIÓN DE MERGE', icon: '{X}', description: 'Re-convergence of split hulls detonates a violent shockwave.' },
    ],
    conceptQuote: 'Dos caminos. Un solo destino. El conflicto es inevitable.',
    finalPhaseName: 'UNRESOLVED',
  },
  contributor_overlord: {
    archetype: 'contributor_overlord',
    codeNumber: '06',
    title: 'THE CONTRIBUTOR OVERLORD',
    canonicalRepo: '/open-source',
    profileDescription: 'Flagship carrier commanding a distributed community fleet of open-source craft.',
    specialStatName: 'FLOTA',
    specialStatValue: 100,
    baseHpRating: 70,
    shieldRating: 60,
    attackRating: 70,
    speedRating: 60,
    abilities: [
      { id: 'collaborator_drones', name: 'DRONES COLABORADORES', icon: '[O]', description: 'Deploys support craft that provide covering fire and repair shielding.' },
      { id: 'xp_harvest', name: 'RECOLECCIÓN DE XP', icon: '[$]', description: 'Siphons energy from destroyed craft to bolster flagship defenses.' },
      { id: 'community_wave', name: 'LLUVIA DE RECURSOS', icon: '^^^', description: 'Synchronized cross-screen armada salvo sweeping the combat area.' },
    ],
    conceptQuote: 'Más colaboradores, más poder. La comunidad nunca olvida.',
    finalPhaseName: 'OPEN SOURCE ARMY',
  },
  branchlord: {
    archetype: 'branchlord',
    codeNumber: '07',
    title: 'THE BRANCHLORD',
    canonicalRepo: '/feature-universe',
    profileDescription: 'Fractal multi-winged dreadnought embodying alternate Git branch timelines.',
    specialStatName: 'RAMIFICACIÓN',
    specialStatValue: 100,
    baseHpRating: 70,
    shieldRating: 60,
    attackRating: 80,
    speedRating: 70,
    abilities: [
      { id: 'multi_branch', name: 'MULTI-BRANCH', icon: '-<', description: 'Fires splitting branch projectiles that branch into secondary angles.' },
      { id: 'replication', name: 'REPLICACIÓN', icon: ':=:', description: 'Creates holographic decoys mirroring boss trajectories.' },
      { id: 'branch_fusion', name: 'FUSIÓN', icon: '>|<', description: 'Draws converging energy branches back into the core to restore integrity.' },
    ],
    conceptQuote: 'Cada rama es una posibilidad. Todas juntas, una amenaza.',
    finalPhaseName: 'BRANCH COLLAPSE',
  },
  rebase_phantom: {
    archetype: 'rebase_phantom',
    codeNumber: '08',
    title: 'THE REBASE PHANTOM',
    canonicalRepo: '/legacy-system',
    profileDescription: 'Stealth obsidian-crimson interceptor built on ancient, rewritten legacy code.',
    specialStatName: 'SIGILO',
    specialStatValue: 100,
    baseHpRating: 80,
    shieldRating: 50,
    attackRating: 90,
    speedRating: 90,
    abilities: [
      { id: 'quantum_dash', name: 'DASH CUÁNTICO', icon: '->|', description: 'Instant phantom teleportation across the arena leaving glitch traps.' },
      { id: 'history_rewrite', name: 'REESCRITURA DE HISTORIA', icon: '<--', description: 'Alters past damage logs to restore a fraction of lost hull shields.' },
      { id: 'legacy_delete', name: 'BORRADO DE REGISTROS', icon: '[X]', description: 'Fires massive, dense legacy kinetic bolts destroying player cover.' },
    ],
    conceptQuote: 'El pasado no se borra... se reescribe.',
    finalPhaseName: 'FORCE REBASE',
  },
  security_sentinel: {
    archetype: 'security_sentinel',
    codeNumber: '09',
    title: 'THE SECURITY SENTINEL',
    canonicalRepo: '/enterprise',
    profileDescription: 'Heavy cyber-aegis fortress enforcing zero-trust encryption protocols.',
    specialStatName: 'SEGURIDAD',
    specialStatValue: 100,
    baseHpRating: 80,
    shieldRating: 90,
    attackRating: 60,
    speedRating: 40,
    abilities: [
      { id: 'firewall', name: 'FIREWALLS', icon: '[|]', description: 'Generates impenetrable laser barricades blocking blaster fire.' },
      { id: 'encryption', name: 'ENCRIPTACIÓN', icon: '[K]', description: 'Activates temporary invulnerability aura with digital lock icon.' },
      { id: 'counterattack', name: 'CONTRATAQUES', icon: '<=>', description: 'Absorbs player laser energy and retaliates with amplified pulses.' },
    ],
    conceptQuote: 'No todo es código. Algunos repositorios tienen secretos.',
    finalPhaseName: 'BREACH DETECTED',
  },
  code_abyss: {
    archetype: 'code_abyss',
    codeNumber: '10',
    title: 'THE CODE ABYSS',
    canonicalRepo: '/monolith',
    profileDescription: 'Cosmic gravitational singularity born from infinite architectural complexity.',
    specialStatName: 'SINGULARIDAD',
    specialStatValue: 100,
    baseHpRating: 90,
    shieldRating: 80,
    attackRating: 90,
    speedRating: 60,
    abilities: [
      { id: 'repo_collapse', name: 'COLAPSO DE REPOSITORIO', icon: '(@)', description: 'Singularity distortion pulling projectiles and starfield towards core.' },
      { id: 'reality_rewrite', name: 'RUPTURA DE REALIDAD', icon: '/?/', description: 'Alters projectile flight physics and warps laser trajectory angles.' },
      { id: 'singularity_pulse', name: 'SINGULARITY PULSE', icon: '((!))', description: 'Massive concentric screen-clearing gravity shockwave.' },
    ],
    conceptQuote: 'El repositorio ha alcanzado el límite. Ahora es un universo.',
    finalPhaseName: 'SYSTEM LIMIT',
  },
};

export class BossGenerator {
  /**
   * Classifies repository DNA into one of the 10 Code Boss archetypes.
   */
  public static classifyArchetype(
    dna: RepositoryDNA | { name: string; commits: number; pullRequests: number; issues: number; contributors: number; languages: Array<{ name: string }> },
    threatLevel: number = 50
  ): BossArchetype {
    const nameLower = dna.name.toLowerCase();

    // Direct canonical repository keyword checks
    if (nameLower.includes('alpha-project') || nameLower.includes('commit-core')) return 'commit_core';
    if (nameLower.includes('mobile-app') || nameLower.includes('fortress')) return 'the_fortress';
    if (nameLower.includes('bug-hunter') || nameLower.includes('issue-swarm')) return 'issue_swarm';
    if (nameLower.includes('infra-service') || nameLower.includes('dependency-hydra')) return 'dependency_hydra';
    if (nameLower.includes('feature-branch') || nameLower.includes('merge-conflict')) return 'merge_conflict';
    if (nameLower.includes('open-source') || nameLower.includes('contributor-overlord')) return 'contributor_overlord';
    if (nameLower.includes('feature-universe') || nameLower.includes('branchlord')) return 'branchlord';
    if (nameLower.includes('legacy-system') || nameLower.includes('rebase-phantom')) return 'rebase_phantom';
    if (nameLower.includes('enterprise') || nameLower.includes('security-sentinel')) return 'security_sentinel';
    if (nameLower.includes('monolith') || nameLower.includes('singularity') || nameLower.includes('code-abyss') || nameLower.includes('citadel')) return 'code_abyss';

    // Evaluation scores based on GitHub metrics
    const langNames = dna.languages.map(l => l.name.toLowerCase());
    const isLegacyLang = langNames.some(l => ['c', 'c++', 'assembly', 'fortran', 'makefile'].includes(l));
    const isEnterpriseLang = langNames.some(l => ['java', 'spring', 'kotlin', 'c#', '.net'].includes(l));

    const scores: Record<BossArchetype, number> = {
      commit_core: (dna.commits / 800) * 35,
      the_fortress: (dna.pullRequests / 35) * 30 + (dna.pullRequests > 20 ? 15 : 0),
      issue_swarm: (dna.issues / 30) * 30 + (dna.issues > 15 ? 15 : 0),
      dependency_hydra: (dna.languages.length >= 3 ? 20 : 0) + (langNames.includes('typescript') || langNames.includes('javascript') ? 15 : 0),
      merge_conflict: nameLower.includes('conflict') || nameLower.includes('branch') ? 40 : 10,
      contributor_overlord: (dna.contributors / 6) * 35,
      branchlord: nameLower.includes('universe') || nameLower.includes('sketion') ? 35 : 15,
      rebase_phantom: (isLegacyLang ? 45 : 0) + (dna.commits > 2500 ? 15 : 0),
      security_sentinel: (isEnterpriseLang ? 45 : 0) + (threatLevel > 75 ? 15 : 0),
      code_abyss: (dna.commits > 4000 ? 40 : 0) + (dna.languages.length >= 4 ? 25 : 0) + (threatLevel >= 85 ? 20 : 0),
    };

    let bestArchetype: BossArchetype = 'commit_core';
    let maxScore = -1;

    for (const [arch, score] of Object.entries(scores) as [BossArchetype, number][]) {
      if (score > maxScore) {
        maxScore = score;
        bestArchetype = arch;
      }
    }

    return bestArchetype;
  }

  /**
   * Derives tactical mutation modifier based on metrics.
   */
  public static deriveMutation(
    dna: { commits: number; pullRequests: number; issues: number; contributors: number; threatLevel?: number },
    threatLevel: number = 50
  ): BossMutation {
    const threat = dna.threatLevel ?? threatLevel;
    if (threat >= 90) return 'UNSTABLE';
    if (dna.issues > 40) return 'CORRUPTED';
    if (dna.commits > 2500) return 'OVERCLOCKED';
    if (dna.pullRequests > 50) return 'SECURED';
    if (dna.contributors > 15) return 'DISTRIBUTED';
    if (dna.issues > 20 && dna.pullRequests > 20) return 'RECURSIVE';
    if (dna.commits > 1200) return 'LEGACY';
    return 'FORKED';
  }

  public static readonly MUTATION_BEHAVIOR_MATRIX: Record<BossMutation, BehaviorMatrixEntry> = {
    OVERCLOCKED: {
      visual: 'Núcleo de reactor hiperacelerado con conductos de ventilación incandescente',
      combat: '+35% velocidad de proyectiles y +40% cadencia de fuego sostenido',
      spawn: 'Despliegue de drones escolta en ráfagas de alta frecuencia',
      audio: 'Arpegio sintetizado a tempo extremo (148 BPM)',
    },
    RECURSIVE: {
      visual: 'Silueta fractal con desfasaje holográfico y estela de ecos temporales',
      combat: 'Los proyectiles emiten réplicas retardadas a 0.8s en cascada',
      spawn: 'Submódulos réplica que imitan los ángulos del jugador',
      audio: 'Eco de retardo estéreo con modulación armónica',
    },
    CORRUPTED: {
      visual: 'Aberración cromática glitch con polígonos de casco desfragmentados',
      combat: 'Dispersión balística caótica con trayectorias sinusoidales impredecibles',
      spawn: 'Minas de error volátiles que detonan por proximidad',
      audio: 'Sintetizador desafinado (-140 cents) con ruido estático bitcrush',
    },
    FORKED: {
      visual: 'Chasis bifurcado simétrico con conductos de energía gemelos',
      combat: 'Ráfagas dobles en abanico cruzado que convergen en el centro',
      spawn: 'Despliegue bilateral simultáneo de drones por las bandas',
      audio: 'Pulsos rítmicos alternantes en canales estéreo',
    },
    UNSTABLE: {
      visual: 'Arcos de plasma radiante y chispas de sobrecarga electromagnética',
      combat: 'Impactos críticos con onda de choque de daño en área expandida',
      spawn: 'Subrutinas kamikaze de alta aceleración frontal',
      audio: 'Barridos de filtro resonante con caídas de sub-graves',
    },
    SECURED: {
      visual: 'Proyección de barrera cibernética hexagonal y mamparos reforzados',
      combat: 'Placas deflectoras rotatorias + Pulso EMP si el jugador usa escudo',
      spawn: 'Pilares de soporte blindados que transfieren regeneración al núcleo',
      audio: 'Compás industrial metronómico rígido (122 BPM) con puerta de ruido',
    },
    LEGACY: {
      visual: 'Placas de obsidiana monolítica con filamentos ámbar de código fósil',
      combat: 'Proyectiles de gran calibre cinético + Teleport de History Rewind',
      spawn: 'Centinelas pesados de baja cadencia con blindaje denso',
      audio: 'Bajos oscuros y lentos a tempo ominoso (96 BPM)',
    },
    DISTRIBUTED: {
      visual: 'Nodos satélite descentralizados enlazados por flujo cuántico',
      combat: 'Red de disipación de daño compartida + Fuego cruzado divergente',
      spawn: 'Generación continua de submódulos auxiliares en órbita',
      audio: 'Percusión polirrítmica multicapa con bajo sincopado',
    },
  };

  /**
   * Deterministic 6-char hex seed derived from repository metrics.
   */
  public static generateSeed(dna: { name: string; commits: number; pullRequests: number; issues: number; contributors: number }): string {
    const raw = `${dna.name}_${dna.commits}_${dna.pullRequests}_${dna.issues}_${dna.contributors}`;
    let hash = 0x811c9dc5;
    for (let i = 0; i < raw.length; i++) {
      hash ^= raw.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return (hash >>> 8).toString(16).padStart(6, '0').slice(-6).toUpperCase();
  }

  /**
   * Generates procedural mission directives based on repository metrics.
   */
  public static generateDirectives(dna: RepositoryDNA, archetypeData: BossArchetypeData, mutation: BossMutation): MissionDirective[] {
    return [
      {
        id: 'dir_w1',
        waveTarget: 'W1',
        title: 'DEPURACIÓN DE COMMITS',
        description: `Eliminar la vanguardia de ${Math.min(30, 15 + Math.round(dna.commits / 200))} cazas sin perder escudos de búnker.`,
        rewardText: '+150 STARS // +200 EXP',
        isCompleted: false,
      },
      {
        id: 'dir_w2',
        waveTarget: 'W2',
        title: 'INTERCEPTACIÓN DE PRs',
        description: `Romper el flanco blindado en menos de 45 segundos con fuego continuo.`,
        rewardText: 'PERK: REPARACIÓN KERNEL',
        isCompleted: false,
      },
      {
        id: 'dir_boss',
        waveTarget: 'BOSS',
        title: `ERRADICACIÓN // ${archetypeData.title}`,
        description: `Neutralizar el núcleo en fase terminal (${mutation}) y estabilizar la rama.`,
        rewardText: `EMBLEMA: ${archetypeData.codeNumber}_${archetypeData.archetype.toUpperCase()}`,
        isCompleted: false,
      },
    ];
  }

  /**
   * Generates mission rewards and bounties.
   */
  public static generateRewards(dna: RepositoryDNA, primaryLangName: string): MissionReward[] {
    const starBounty = Math.round(350 + dna.threatLevel * 5.5);
    const perkName = primaryLangName.toLowerCase().includes('rust')
      ? 'BLINDAJE DE COSTO CERO (+25% Escudos)'
      : primaryLangName.toLowerCase().includes('python')
      ? 'DRONES SUBPROCESS (Soporte orbital)'
      : primaryLangName.toLowerCase().includes('type')
      ? 'TRACKING ESTRICTO (+15% Guía de láser)'
      : 'COMPILADOR DINÁMICO (+15% Cadencia)';

    return [
      {
        id: 'rew_stars',
        name: 'RECOMPENSA DE ESTRELLAS',
        type: 'currency',
        value: `+${starBounty} STARS`,
        icon: '[$]',
        description: 'Fondos transferidos directamente al Hangar de mejoras.',
      },
      {
        id: 'rew_perk',
        name: `MÓDULO ${primaryLangName.toUpperCase()}`,
        type: 'perk',
        value: perkName,
        icon: '[+]',
        description: 'Buff táctico de combate sincronizado con el stack tecnológico.',
      },
      {
        id: 'rew_artifact',
        name: `ARTEFACTO // ${dna.name.toUpperCase()}`,
        type: 'artifact',
        value: 'REPOSITORIO ESTABILIZADO',
        icon: '<*>',
        description: 'Fragmento de código limpio guardado en la base de datos de telemetría.',
      },
    ];
  }

  /**
   * Generates a fully procedural BossBlueprint directly from Repository DNA.
   */
  public static generateFromDNA(dna: RepositoryDNA): BossBlueprint {
    const archetype = this.classifyArchetype(dna, dna.threatLevel);
    const archetypeData = ARCHETYPE_DATABASE[archetype];
    const mutation = this.deriveMutation(dna, dna.threatLevel);
    const behaviorMatrix = this.MUTATION_BEHAVIOR_MATRIX[mutation];

    const primaryLang = dna.languages[0] || { name: 'TypeScript', color: '#38bdf8', pct: 100 };
    const langTag = `${primaryLang.name.toUpperCase()} HEAVY`;
    const modifierTitle = `${archetypeData.title} // ${mutation} // ${langTag}`;

    const seed = this.generateSeed(dna);

    // Audio parameters calibrated to mutation
    const audioBpm = mutation === 'OVERCLOCKED' ? 148 : mutation === 'LEGACY' ? 96 : mutation === 'SECURED' ? 122 : 126;
    const audioDetuneCents = mutation === 'CORRUPTED' ? -140 : 0;
    const audioDistortion = mutation === 'CORRUPTED' || mutation === 'UNSTABLE';

    // Boss Genome compilation
    const genome: BossGenome = {
      seed,
      hull: archetypeData.title,
      weapon: archetypeData.abilities[0]?.name || 'LÁSER CINÉTICO',
      movement: archetype === 'rebase_phantom' ? 'QUANTUM DASH' : archetype === 'issue_swarm' ? 'SINUOUS COIL' : archetype === 'code_abyss' ? 'SINGULARITY DRIFT' : 'ORBITAL WEAVE',
      shield: `${archetypeData.shieldRating}% DENSIDAD // ${Math.max(1, Math.round(archetypeData.shieldRating / 25))} CAPAS`,
      spawn: `${archetypeData.specialStatName} // CADENCIA ${archetypeData.specialStatValue}%`,
      phases: 4,
      audioBpm,
      audioDetuneCents,
      audioDistortion,
      primaryColor: primaryLang.color || '#00e5ff',
      secondaryColor: '#ff0055',
      glowColor: archetypeData.specialStatName === 'DEFENSA' ? '#00e5ff' : archetypeData.specialStatName === 'ENJAMBRE' ? '#ef4444' : '#c084fc',
      ratings: {
        threat: dna.threatLevel,
        complexity: Math.min(100, 40 + dna.languages.length * 15),
        swarm: archetypeData.specialStatValue,
        armor: archetypeData.shieldRating,
        attack: archetypeData.attackRating,
      },
      behaviorMatrix,
    };

    // Procedural directives & rewards
    const directives = this.generateDirectives(dna, archetypeData, mutation);
    const rewards = this.generateRewards(dna, primaryLang.name);

    // Base gameplay attributes mathematically calibrated to archetype ratings
    const hpFactor = archetypeData.baseHpRating / 100;
    const baseHp = Math.round(1200 + hpFactor * 1400 + Math.min(800, (dna.commits / 1000) * 300));
    const shieldLayers = Math.max(1, Math.min(4, Math.round(1 + (archetypeData.shieldRating / 100) * 3)));
    const cannons = Math.max(2, Math.min(6, Math.round(2 + (archetypeData.attackRating / 100) * 4)));
    const fireRateSeconds = Number(Math.max(0.65, 2.2 - (archetypeData.speedRating / 100) * 1.3).toFixed(2));

    const phases: BossPhaseConfig[] = [
      {
        phaseNumber: 1,
        name: 'CORE BREACH',
        hpThresholdPercent: 100,
        attackPattern: 'salvo',
        speedMultiplier: 1.0,
        description: 'Perimeter shields active. Defensive pattern analysis initialized.',
      },
      {
        phaseNumber: 2,
        name: archetypeData.abilities[0]?.name || 'TACTICAL OVERLOAD',
        hpThresholdPercent: 70,
        attackPattern: 'merge_matrix_lasers',
        speedMultiplier: 1.25,
        description: archetypeData.abilities[0]?.description || 'Dual flanking cannons deployed.',
      },
      {
        phaseNumber: 3,
        name: archetypeData.abilities[1]?.name || 'ERROR CASCADE',
        hpThresholdPercent: 40,
        attackPattern: 'cicd_overdrive_bombers',
        speedMultiplier: 1.55,
        description: archetypeData.abilities[1]?.description || 'Overdrive reactor pulsing.',
      },
      {
        phaseNumber: 4,
        name: archetypeData.finalPhaseName,
        hpThresholdPercent: 18,
        attackPattern: 'cicd_overdrive_bombers',
        speedMultiplier: 1.9,
        description: `Terminal phase: ${archetypeData.conceptQuote}`,
      },
    ];

    return {
      repoName: dna.name,
      coreName: dna.bossCoreName || `${dna.name.toUpperCase()} CORE`,
      language: primaryLang.name,
      languageColor: primaryLang.color || '#00e5ff',
      archetype,
      mutation,
      modifierTitle,
      archetypeData,
      genome,
      directives,
      rewards,
      chassisType: archetype,
      threatIndex: dna.threatLevel,
      maxHp: baseHp,
      cannons,
      shieldLayers,
      fireRateSeconds,
      phases,
      statsDisplay: {
        commits: dna.commits,
        contributors: dna.contributors,
        pullRequests: dna.pullRequests,
        issues: dna.issues,
        languagesCount: dna.languages.length,
      },
    };
  }

  /**
   * Helper to build blueprint from raw GitHubMetrics
   */
  public static generateFromMetrics(
    repoName: string,
    metrics: GitHubMetrics,
    threatLevel: number,
    primaryLangName: string = 'TypeScript',
    primaryLangColor: string = '#00e5ff'
  ): BossBlueprint {
    const rawDna: RepositoryDNA = {
      id: repoName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: repoName,
      author: 'GITHUB_USER',
      description: 'Dynamic GitHub Repository DNA',
      commits: metrics.totalCommits,
      pullRequests: metrics.pullRequests,
      issues: metrics.openIssues,
      contributors: metrics.contributors,
      threatLevel,
      threatRating: threatLevel >= 85 ? 'CRITICAL' : threatLevel >= 65 ? 'HIGH' : 'ELEVATED',
      languages: metrics.languages.map(l => ({ name: l, pct: 100 / metrics.languages.length, color: primaryLangColor })),
      primaryLanguage: primaryLangName,
      accentColor: primaryLangColor,
      bossCoreName: `${repoName.toUpperCase()} CORE`,
    };

    return this.generateFromDNA(rawDna);
  }
}
