/**
 * Complete Internationalization (i18n) Engine for GIT_INVADERS.EXE
 * Provides seamless runtime switching between English (en) and Spanish (es).
 * Persists user preference to localStorage. Zero external dependencies. Zero emojis.
 */

export type LanguageCode = 'en' | 'es';

export interface TranslationDictionary {
  // Header & Cabinet
  headerTitle: string;
  headerBadge: string;
  btnPause: string;
  btnResume: string;
  btnLobby: string;
  themeCyberCyan: string;
  themeMatrix: string;
  themeGithubLight: string;
  themeCyberpunk: string;
  themeAmber: string;
  btnCrt: string;
  btnAudioOn: string;
  btnAudioOff: string;
  btnLang: string;

  // Navigation Tabs
  tabHangar: string;
  tabPlay: string;
  tabStore: string;
  tabProfile: string;
  tabStats: string;
  tabSettings: string;

  // Hangar Deck
  hangarStationDocked: string;
  hangarSystemsReady: string;
  hangarPilotCommand: string;
  hangarTelemetryActive: string;
  hangarShipCallout: string;
  hangarBlaster: string;
  hangarThruster: string;
  hangarDeflector: string;
  hangarOnline: string;
  hangarOffline: string;
  hangarTargetRepo: string;
  hangarCommits: string;
  hangarPrs: string;
  hangarIssues: string;
  hangarContributors: string;
  hangarLanguages: string;
  hangarThreatLevel: string;
  hangarBriefing: string;
  hangarRoadmap: string;
  hangarTechModifiers: string;
  hangarStartMission: string;
  hangarXp: string;
  hangarCredits: string;
  hangarSystemsUniverse: string;

  // Encounter Wave Types
  waveCommitSquadron: string;
  waveArmoredPr: string;
  waveIssueBug: string;
  waveTitanBreach: string;
  formationGrid: string;
  formationVChevron: string;
  formationDiamond: string;
  formationSwarm: string;
  formationPincer: string;

  // Play Modes Tab
  playModesTitle: string;
  playModesSub: string;
  modeCampaignTitle: string;
  modeCampaignDesc: string;
  modeCitadelTitle: string;
  modeCitadelDesc: string;
  modeChaosTitle: string;
  modeChaosDesc: string;
  btnLaunchOperation: string;

  // Profile Dossier
  profileDossierTitle: string;
  profileServiceRecord: string;
  profileCallSign: string;
  profileLeadArchitect: string;
  profileClearance: string;
  profileCareerAdvancement: string;
  profileEquippedHull: string;
  profileBlasterCadence: string;
  profileThrustAgility: string;
  profileDeflectorShield: string;
  profileQuantumPierce: string;
  profileLocked: string;
  profileReady: string;
  profileOpenEngineering: string;
  profileFleetInventory: string;

  // Engineering Bay / Store
  storeTitle: string;
  storeEngineeringBay: string;
  storeTabShips: string;
  storeTabModules: string;
  storeTabCosmetics: string;
  storeHologramSpec: string;
  storeActiveHull: string;
  storeEquipShip: string;
  storeEquipped: string;
  storeUpgradeFireRate: string;
  storeUpgradeThrusters: string;
  storeUpgradeShields: string;
  storeUpgradeOverdrive: string;
  storeLevel: string;
  storeMaxLevel: string;
  storeCost: string;
  storeFree: string;
  storeBuy: string;
  storeApplyTheme: string;
  storeActiveTheme: string;
  storeReturnHangar: string;
  storeFooterTagline: string;

  // Statistics Tab
  statsTitle: string;
  statsTelemetryLogs: string;
  statsPurgedCommits: string;
  statsMergedPrs: string;
  statsClosedIssues: string;
  statsHighScore: string;
  statsBossesDefeated: string;
  statsCombatAccuracy: string;

  // Settings Tab
  settingsTitle: string;
  settingsSub: string;
  settingsAudioGroup: string;
  settingsMasterVolume: string;
  settingsMusicVolume: string;
  settingsSfxVolume: string;
  settingsVisualGroup: string;
  settingsActiveTheme: string;
  settingsCrtIntensity: string;
  settingsLanguageGroup: string;
  settingsInterfaceLanguage: string;
  settingsKeybindsTitle: string;
  settingsKeyMove: string;
  settingsKeyFire: string;
  settingsKeyRebase: string;
  settingsKeyStash: string;
  settingsKeyPush: string;
  settingsKeyPause: string;

  // Desktop Footer Buttons
  footerKeyMove: string;
  footerKeyFire: string;
  footerKeyRebase: string;
  footerKeyStash: string;
  footerKeyPush: string;
  footerKeyPause: string;

  // HUD & Combat Feedback
  hudWave: string;
  hudScore: string;
  hudStreak: string;
  hudLives: string;
  hudOverdrive: string;
  hudOverdriveReady: string;
  hudRebaseLocked: string;
  hudRebaseReady: string;
  hudRebaseActive: string;
  hudStashReady: string;
  hudStashActive: string;
  hudShieldActive: string;
  hudBossAlert: string;
  hudBossPhase: string;

  // Combat Floating Alerts
  combatRebaseSlowMo: string;
  combatRebaseDash: string;
  combatStashPhase: string;
  combatMergeBurst: string;
  combatBranchSplit: string;
  combatOctoProtocol: string;
  combatShieldEngaged: string;

  // Enemy Tactical Badges
  enemyPrStatusOpen: string;
  enemyPrStatusMerged: string;
  enemyPrStatusMerging: string;

  // Modals (Pause, Victory, Game Over, Boss Alert)
  modalPauseTitle: string;
  modalPauseSub: string;
  modalResumeBtn: string;
  modalOpenStoreBtn: string;
  modalAbortBtn: string;

  modalGameOverTitle: string;
  modalGameOverSub: string;
  modalRetryBtn: string;

  modalVictoryTitle: string;
  modalVictorySub: string;
  modalNextSectorBtn: string;

  modalBossAnalysisTitle: string;
  modalBossDirective: string;
  modalEngageBossBtn: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    headerTitle: 'GIT_INVADERS.EXE',
    headerBadge: 'v2.5 PRO',
    btnPause: 'PAUSE [ESC]',
    btnResume: 'RESUME [ESC]',
    btnLobby: 'LOBBY',
    themeCyberCyan: 'CYBER CYAN',
    themeMatrix: 'MATRIX PHOSPHOR',
    themeGithubLight: 'GITHUB LIGHT',
    themeCyberpunk: 'CYBERPUNK NEON',
    themeAmber: 'AMBER CRT',
    btnCrt: 'CRT FX',
    btnAudioOn: 'AUDIO: ON',
    btnAudioOff: 'AUDIO: OFF',
    btnLang: 'LANG: EN',

    tabHangar: 'HANGAR',
    tabPlay: 'PLAY',
    tabStore: 'STORE',
    tabProfile: 'PROFILE',
    tabStats: 'STATS',
    tabSettings: 'SETTINGS',

    hangarStationDocked: 'STATION DOCKED',
    hangarSystemsReady: 'SYSTEMS READY',
    hangarPilotCommand: 'PILOT COMMAND // HANGAR DECK',
    hangarTelemetryActive: 'SUB-ORBITAL GITHUB TELEMETRY STATION • ACTIVE',
    hangarShipCallout: 'SHIP:',
    hangarBlaster: 'BLASTER:',
    hangarThruster: 'THRUSTER:',
    hangarDeflector: 'DEFLECTOR:',
    hangarOnline: 'ONLINE',
    hangarOffline: 'OFFLINE',
    hangarTargetRepo: 'TARGET REPOSITORY // DNA',
    hangarCommits: 'COMMITS',
    hangarPrs: 'PRs',
    hangarIssues: 'ISSUES',
    hangarContributors: 'CONTRIBUTORS',
    hangarLanguages: 'LANGUAGES',
    hangarThreatLevel: 'THREAT LEVEL',
    hangarBriefing: 'TACTICAL MISSION BRIEFING',
    hangarRoadmap: 'ENCOUNTER ROADMAP & TECH DIRECTIVES',
    hangarTechModifiers: 'TECH MODIFIERS:',
    hangarStartMission: 'START MISSION',
    hangarXp: 'XP',
    hangarCredits: 'CREDITS',
    hangarSystemsUniverse: 'SYSTEMS: CODEBASE.UNIVERSE ONLINE',

    waveCommitSquadron: 'COMMIT SQUADRON',
    waveArmoredPr: 'ARMORED PR FLANK',
    waveIssueBug: 'ISSUE BUG BOMBERS',
    waveTitanBreach: 'TITAN BREACH',
    formationGrid: 'FORMATION: GRID',
    formationVChevron: 'FORMATION: V-CHEVRON',
    formationDiamond: 'FORMATION: DIAMOND',
    formationSwarm: 'FORMATION: SWARM',
    formationPincer: 'FORMATION: PINCER',

    playModesTitle: 'TACTICAL SIMULATION MATRIX // FLIGHT OPERATIONS',
    playModesSub: 'SELECT COMBAT CAMPAIGN PARAMETERS',
    modeCampaignTitle: 'REPOSITORY DEFENSE CAMPAIGN',
    modeCampaignDesc: 'Engage procedural attack waves synthesized from active repository commit history, pull request cruisers, and bug swarms.',
    modeCitadelTitle: 'CODEBASE CITADEL RUN',
    modeCitadelDesc: 'Navigate deep monolithic codebase architecture biomes. Face extreme complexity density and class god-objects.',
    modeChaosTitle: 'HYPER-CHAOS OVERDRIVE',
    modeChaosDesc: 'Maximum aggression survival drill. Unbounded threat levels, rapid fire cadence, and continuous enemy reinforcements.',
    btnLaunchOperation: 'LAUNCH OPERATION',

    profileDossierTitle: 'PILOT DOSSIER // SERVICE RECORD',
    profileServiceRecord: 'SERVICE RECORD',
    profileCallSign: 'CALL SIGN:',
    profileLeadArchitect: 'LEAD ARCHITECT',
    profileClearance: 'CLEARANCE LVL',
    profileCareerAdvancement: 'CAREER ADVANCEMENT:',
    profileEquippedHull: 'EQUIPPED HULL:',
    profileBlasterCadence: 'BLASTER CADENCE:',
    profileThrustAgility: 'THRUST AGILITY:',
    profileDeflectorShield: 'DEFLECTOR SHIELD:',
    profileQuantumPierce: 'QUANTUM PIERCE:',
    profileLocked: 'LOCKED',
    profileReady: 'READY',
    profileOpenEngineering: '[ OPEN SHIP ENGINEERING BAY / UPGRADES ]',
    profileFleetInventory: 'PILOT FLEET INVENTORY',

    storeTitle: 'GIT_STORE.EXE',
    storeEngineeringBay: 'SHIP ENGINEERING BAY',
    storeTabShips: '[ SHIPS ]',
    storeTabModules: '[ MODULES ]',
    storeTabCosmetics: '[ COSMETICS ]',
    storeHologramSpec: 'HOLOGRAPHIC HULL SPECIFICATION // ARSENAL TELEMETRY',
    storeActiveHull: 'ACTIVE HULL',
    storeEquipShip: '[ EQUIP SHIP ]',
    storeEquipped: '[ EQUIPPED ]',
    storeUpgradeFireRate: 'BLASTER FIRE RATE',
    storeUpgradeThrusters: 'THRUST AGILITY',
    storeUpgradeShields: 'DEFLECTOR SHIELD GENERATOR',
    storeUpgradeOverdrive: 'GIT PUSH OVERDRIVE CHARGE',
    storeLevel: 'LVL',
    storeMaxLevel: 'MAX LEVEL REACHED',
    storeCost: 'COST:',
    storeFree: 'FREE',
    storeBuy: 'UPGRADE',
    storeApplyTheme: 'APPLY',
    storeActiveTheme: 'ACTIVE',
    storeReturnHangar: 'RETURN TO HANGAR',
    storeFooterTagline: 'GIT_INVADERS.EXE // ARSENAL DOCKED • SECURE HARDWARE MATRIX',

    statsTitle: 'PILOT PERFORMANCE TELEMETRY // STATISTICAL SUMMARY',
    statsTelemetryLogs: 'MISSION FLIGHT RECORDER LOGS',
    statsPurgedCommits: 'PURGED COMMITS',
    statsMergedPrs: 'MERGED PULL REQUESTS',
    statsClosedIssues: 'RESOLVED ISSUES',
    statsHighScore: 'RECORD HIGH SCORE',
    statsBossesDefeated: 'CORES DESTROYED',
    statsCombatAccuracy: 'TARGETING ACCURACY',

    settingsTitle: 'SYSTEM CONFIGURATION // HARDWARE PREFERENCES',
    settingsSub: 'CONFIGURE LOCAL ARCADE OPERATIONAL PARAMETERS',
    settingsAudioGroup: 'SYNTHESIZER & AUDIO MATRIX',
    settingsMasterVolume: 'MASTER VOLUME',
    settingsMusicVolume: 'CHIPTUNE BGM',
    settingsSfxVolume: 'SFX LASER SYNTH',
    settingsVisualGroup: 'VISUAL TERMINAL & CRT EMULATION',
    settingsActiveTheme: 'COLOR PALETTE MATRIX',
    settingsCrtIntensity: 'CRT PHOSPHOR SCANLINE DENSITY',
    settingsLanguageGroup: 'LOCALIZATION & LANGUAGE',
    settingsInterfaceLanguage: 'INTERFACE LANGUAGE',
    settingsKeybindsTitle: 'TACTICAL KEYBINDING PROTOCOLS',
    settingsKeyMove: 'Movement Navigation',
    settingsKeyFire: 'Blaster Primary Cannon',
    settingsKeyRebase: 'Git Rebase (Tactical Slow-Mo)',
    settingsKeyStash: 'Git Stash (Phase Shielding)',
    settingsKeyPush: 'Git Push (Screen Overdrive Bomb)',
    settingsKeyPause: 'Tactical Pause / Hangar Menu',

    footerKeyMove: 'Move',
    footerKeyFire: 'Blaster Fire',
    footerKeyRebase: 'Git Rebase',
    footerKeyStash: 'Git Stash',
    footerKeyPush: 'Git Push --Force',
    footerKeyPause: 'Pause',

    hudWave: 'WAVE',
    hudScore: 'SCORE',
    hudStreak: 'STREAK',
    hudLives: 'LIVES',
    hudOverdrive: 'OVERDRIVE',
    hudOverdriveReady: 'READY [SHIFT]',
    hudRebaseLocked: 'LOCKED',
    hudRebaseReady: 'READY [Q]',
    hudRebaseActive: 'ACTIVE',
    hudStashReady: 'READY [E]',
    hudStashActive: 'SHIELD ACTIVE',
    hudShieldActive: 'SHIELD ACTIVE',
    hudBossAlert: 'CRITICAL WARNING // CLASS GOD-OBJECT DETECTED',
    hudBossPhase: 'PHASE',

    combatRebaseSlowMo: 'GIT REBASE: SLOW-MO ENGAGED',
    combatRebaseDash: 'GIT REBASE: HYPER-DASH ENGAGED',
    combatStashPhase: 'GIT STASH: INTANGIBLE PHASE (3.5s)',
    combatMergeBurst: 'MERGE BURST // KINETIC SHOCKWAVE',
    combatBranchSplit: 'BRANCH SPLIT: DUAL DRONES DEPLOYED',
    combatOctoProtocol: 'OCTO PROTOCOL: 8 DEFENSE DRONES ACTIVE',
    combatShieldEngaged: 'DEFLECTOR SHIELD ENGAGED',

    enemyPrStatusOpen: 'STATUS: OPEN',
    enemyPrStatusMerged: 'STATUS: MERGED',
    enemyPrStatusMerging: 'STATUS: MERGING',

    modalPauseTitle: 'SYSTEM PAUSED',
    modalPauseSub: 'KERNEL EXECUTION FROZEN',
    modalResumeBtn: 'RESUME MISSION [ESC / P]',
    modalOpenStoreBtn: 'OPEN GIT_STORE.EXE [SYS]',
    modalAbortBtn: 'ABORT TO LOBBY',

    modalGameOverTitle: 'CRITICAL FAILURE // HULL BREACHED',
    modalGameOverSub: 'CORE SYSTEMS TERMINATED BY INVADER CODEBASE',
    modalRetryBtn: 'RETRY MISSION [SPACE]',

    modalVictoryTitle: 'MISSION ACCOMPLISHED // REPO SECURED',
    modalVictorySub: 'ALL HOSTILE REPOSITORIES AND CORES ELIMINATED',
    modalNextSectorBtn: 'CONTINUE TO HANGAR [SPACE]',

    modalBossAnalysisTitle: 'TARGET ACQUIRED // CORE BLUEPRINT DETECTED',
    modalBossDirective: 'TACTICAL DIRECTIVE: NEUTRALIZE GOD-CLASS CORE',
    modalEngageBossBtn: 'ENGAGE BOSS FIGHT [SPACE]',
  },

  es: {
    headerTitle: 'GIT_INVADERS.EXE',
    headerBadge: 'v2.5 PRO',
    btnPause: 'PAUSA [ESC]',
    btnResume: 'REANUDAR [ESC]',
    btnLobby: 'HANGAR',
    themeCyberCyan: 'CIAN CIBER',
    themeMatrix: 'FÓSFORO MATRIX',
    themeGithubLight: 'GITHUB CLARO',
    themeCyberpunk: 'NEÓN CYBERPUNK',
    themeAmber: 'ÁMBAR CRT',
    btnCrt: 'EFECTO CRT',
    btnAudioOn: 'AUDIO: ON',
    btnAudioOff: 'AUDIO: OFF',
    btnLang: 'IDIOMA: ES',

    tabHangar: 'HANGAR',
    tabPlay: 'JUGAR',
    tabStore: 'TIENDA',
    tabProfile: 'PERFIL',
    tabStats: 'MÉTRICAS',
    tabSettings: 'AJUSTES',

    hangarStationDocked: 'ESTACIÓN ACOPLADA',
    hangarSystemsReady: 'SISTEMAS LISTOS',
    hangarPilotCommand: 'COMANDO DE PILOTO // PLATAFORMA HANGAR',
    hangarTelemetryActive: 'ESTACIÓN DE TELEMETRÍA SUB-ORBITAL GITHUB • ACTIVA',
    hangarShipCallout: 'NAVE:',
    hangarBlaster: 'LÁSER:',
    hangarThruster: 'PROPULSOR:',
    hangarDeflector: 'DEFLECTOR:',
    hangarOnline: 'EN LÍNEA',
    hangarOffline: 'APAGADO',
    hangarTargetRepo: 'REPOSITORIO OBJETIVO // ADN',
    hangarCommits: 'COMMITS',
    hangarPrs: 'PULL REQUESTS',
    hangarIssues: 'ISSUES',
    hangarContributors: 'COLABORADORES',
    hangarLanguages: 'LENGUAJES',
    hangarThreatLevel: 'NIVEL DE AMENAZA',
    hangarBriefing: 'INFORME TÁCTICO DE MISIÓN',
    hangarRoadmap: 'HOJA DE RUTA Y DIRECTIVAS TÉCNICAS',
    hangarTechModifiers: 'MODIFICADORES TÉCNICOS:',
    hangarStartMission: 'INICIAR MISIÓN',
    hangarXp: 'XP',
    hangarCredits: 'CRÉDITOS',
    hangarSystemsUniverse: 'SISTEMAS: CODEBASE.UNIVERSE EN LÍNEA',

    waveCommitSquadron: 'ESCUADRÓN DE COMMITS',
    waveArmoredPr: 'FLANCO BLINDADO PR',
    waveIssueBug: 'BOMBARDEROS DE BUGS',
    waveTitanBreach: 'BRECHA DE TITÁN',
    formationGrid: 'FORMACIÓN: REJILLA',
    formationVChevron: 'FORMACIÓN: V-CHEVRON',
    formationDiamond: 'FORMACIÓN: DIAMANTE',
    formationSwarm: 'FORMACIÓN: ENJAMBRE',
    formationPincer: 'FORMACIÓN: PINZA',

    playModesTitle: 'MATRIZ DE SIMULACIÓN TÁCTICA // OPERACIONES',
    playModesSub: 'SELECCIONA LOS PARÁMETROS DE COMBATE',
    modeCampaignTitle: 'CAMPAÑA DE DEFENSA DE REPOSITORIO',
    modeCampaignDesc: 'Enfréntate a oleadas generadas a partir del historial activo de commits, cruceros PR y enjambres de bugs.',
    modeCitadelTitle: 'INCURSIÓN EN LA CIUDADELA',
    modeCitadelDesc: 'Navega por biomas de código monolítico. Enfréntate a alta densidad de complejidad y clases dios.',
    modeChaosTitle: 'HIPER-CAOS SOBRECARGADO',
    modeChaosDesc: 'Entrenamiento de supervivencia al límite. Amenaza máxima, cadencia de fuego acelerada y refuerzos continuos.',
    btnLaunchOperation: 'LANZAR OPERACIÓN',

    profileDossierTitle: 'DOSIER DEL PILOTO // HOJA DE SERVICIO',
    profileServiceRecord: 'HOJA DE SERVICIO',
    profileCallSign: 'DISTINTIVO:',
    profileLeadArchitect: 'ARQUITECTO PRINCIPAL',
    profileClearance: 'RANGO DE ACCESO',
    profileCareerAdvancement: 'AVANCE DE CARRERA:',
    profileEquippedHull: 'CASCO EQUIPADO:',
    profileBlasterCadence: 'CADENCIA DE LÁSER:',
    profileThrustAgility: 'AGILIDAD DE GIRO:',
    profileDeflectorShield: 'ESCUDO DEFLECTOR:',
    profileQuantumPierce: 'PERFORACIÓN CUÁNTICA:',
    profileLocked: 'BLOQUEADO',
    profileReady: 'LISTO',
    profileOpenEngineering: '[ ABRIR HANGAR DE INGENIERÍA / MEJORAS ]',
    profileFleetInventory: 'FLOTA DISPONIBLE DEL PILOTO',

    storeTitle: 'GIT_STORE.EXE',
    storeEngineeringBay: 'HANGAR DE INGENIERÍA NAVAL',
    storeTabShips: '[ NAVES ]',
    storeTabModules: '[ MÓDULOS ]',
    storeTabCosmetics: '[ APARIENCIAS ]',
    storeHologramSpec: 'ESPECIFICACIÓN HOLOGRÁFICA // TELEMETRÍA DEL ARSENAL',
    storeActiveHull: 'CASCO ACTIVO',
    storeEquipShip: '[ EQUIPAR NAVE ]',
    storeEquipped: '[ EQUIPADA ]',
    storeUpgradeFireRate: 'CADENCIA DE DISPARO LÁSER',
    storeUpgradeThrusters: 'PROPULSIÓN Y AGILIDAD',
    storeUpgradeShields: 'GENERADOR DE ESCUDO DEFLECTOR',
    storeUpgradeOverdrive: 'SOBRECARGA GIT PUSH',
    storeLevel: 'NIVEL',
    storeMaxLevel: 'NIVEL MÁXIMO ALCANZADO',
    storeCost: 'COSTE:',
    storeFree: 'GRATIS',
    storeBuy: 'MEJORAR',
    storeApplyTheme: 'APLICAR',
    storeActiveTheme: 'ACTIVO',
    storeReturnHangar: 'VOLVER AL HANGAR',
    storeFooterTagline: 'GIT_INVADERS.EXE // ARSENAL ACOPLADO • MATRIZ SEGURA',

    statsTitle: 'TELEMETRÍA DEL PILOTO // RESUMEN ESTADÍSTICO',
    statsTelemetryLogs: 'REGISTROS DE LA CAJA NEGRA DE VUELO',
    statsPurgedCommits: 'COMMITS PURGADOS',
    statsMergedPrs: 'PULL REQUESTS FUSIONADOS',
    statsClosedIssues: 'ISSUES RESUELTOS',
    statsHighScore: 'PUNTUACIÓN RÉCORD',
    statsBossesDefeated: 'NÚCLEOS DESTRUIDOS',
    statsCombatAccuracy: 'PRECISIÓN DE TIRO',

    settingsTitle: 'CONFIGURACIÓN // PARÁMETROS DEL SISTEMA',
    settingsSub: 'CONFIGURA TUS PREFERENCIAS DE ARCADE LOCAL',
    settingsAudioGroup: 'SINTETIZADOR Y MATRIZ DE AUDIO',
    settingsMasterVolume: 'VOLUMEN MAESTRO',
    settingsMusicVolume: 'MÚSICA BGM CHIPTUNE',
    settingsSfxVolume: 'EFECTOS DE DISPARO LÁSER',
    settingsVisualGroup: 'PANTALLA TERMINAL Y EMULACIÓN CRT',
    settingsActiveTheme: 'PALETA DE COLOR DE MATRIZ',
    settingsCrtIntensity: 'DENSIDAD DE LÍNEAS DE ESCANEO CRT',
    settingsLanguageGroup: 'LOCALIZACIÓN E IDIOMA',
    settingsInterfaceLanguage: 'IDIOMA DE INTERFAZ',
    settingsKeybindsTitle: 'PROTOCOLOS DE ASIGNACIÓN DE TECLAS',
    settingsKeyMove: 'Navegación / Movimiento',
    settingsKeyFire: 'Cañón Láser Principal',
    settingsKeyRebase: 'Git Rebase (Cámara Lenta Táctica)',
    settingsKeyStash: 'Git Stash (Escudo Intangible)',
    settingsKeyPush: 'Git Push (Bomba de Sobrecarga Global)',
    settingsKeyPause: 'Pausa Táctica / Menú de Hangar',

    footerKeyMove: 'Mover',
    footerKeyFire: 'Disparar',
    footerKeyRebase: 'Git Rebase',
    footerKeyStash: 'Git Stash',
    footerKeyPush: 'Git Push --Force',
    footerKeyPause: 'Pausa',

    hudWave: 'OLEADA',
    hudScore: 'PUNTOS',
    hudStreak: 'RACHA',
    hudLives: 'VIDAS',
    hudOverdrive: 'SOBRECARGA',
    hudOverdriveReady: 'LISTA [SHIFT]',
    hudRebaseLocked: 'BLOQUEADO',
    hudRebaseReady: 'LISTO [Q]',
    hudRebaseActive: 'ACTIVO',
    hudStashReady: 'LISTO [E]',
    hudStashActive: 'ESCUDO ACTIVO',
    hudShieldActive: 'ESCUDO ACTIVO',
    hudBossAlert: 'ALERTA CRÍTICA // CLASE DIOS DETECTADA',
    hudBossPhase: 'FASE',

    combatRebaseSlowMo: 'GIT REBASE: CÁMARA LENTA ACTIVA',
    combatRebaseDash: 'GIT REBASE: HIPER-IMPULSO ACTIVO',
    combatStashPhase: 'GIT STASH: FASE INTANGIBLE (3.5s)',
    combatMergeBurst: 'ONDA DE CHOQUE // FUSIÓN CINÉTICA',
    combatBranchSplit: 'DIVISIÓN DE RAMA: 2 DRONES DESPLEGADOS',
    combatOctoProtocol: 'PROTOCOLO OCTO: 8 DRONES DE DEFENSA ACTIVOS',
    combatShieldEngaged: 'ESCUDO DEFLECTOR ACTIVADO',

    enemyPrStatusOpen: 'ESTADO: ABIERTO',
    enemyPrStatusMerged: 'ESTADO: FUSIONADO',
    enemyPrStatusMerging: 'ESTADO: FUSIONANDO',

    modalPauseTitle: 'SISTEMA EN PAUSA',
    modalPauseSub: 'EJECUCIÓN DEL KERNEL CONGELADA',
    modalResumeBtn: 'REANUDAR MISIÓN [ESC / P]',
    modalOpenStoreBtn: 'ABRIR GIT_STORE.EXE [SYS]',
    modalAbortBtn: 'ABORTAR AL HANGAR',

    modalGameOverTitle: 'FALLO CRÍTICO // CASCO DESTRUIDO',
    modalGameOverSub: 'SISTEMAS PRINCIPALES DESTRUIDOS POR EL CÓDIGO INVASOR',
    modalRetryBtn: 'REINTENTAR MISIÓN [ESPACIO]',

    modalVictoryTitle: 'MISIÓN CUMPLIDA // REPOSITORIO ASEGURADO',
    modalVictorySub: 'TODOS LOS NÚCLEOS Y CÓDIGO HOSTIL FUERON ELIMINADOS',
    modalNextSectorBtn: 'CONTINUAR AL HANGAR [ESPACIO]',

    modalBossAnalysisTitle: 'OBJETIVO DETECTADO // ANÁLISIS DEL NÚCLEO',
    modalBossDirective: 'DIRECTIVA TÁCTICA: NEUTRALIZAR NÚCLEO DE CLASE DIOS',
    modalEngageBossBtn: 'INICIAR COMBATE DE JEFE [ESPACIO]',
  },
};

export class I18n {
  private static instance: I18n;
  public currentLang: LanguageCode = 'en';
  private static STORAGE_KEY = 'git_invaders_language';
  private listeners: Array<(lang: LanguageCode) => void> = [];

  private constructor() {
    this.loadSavedLanguage();
  }

  public static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }

  public get t(): TranslationDictionary {
    return TRANSLATIONS[this.currentLang];
  }

  public setLanguage(lang: LanguageCode): void {
    if (!TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    try {
      localStorage.setItem(I18n.STORAGE_KEY, lang);
    } catch {}

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Notify listeners
    this.listeners.forEach((fn) => fn(lang));
  }

  public toggleLanguage(): LanguageCode {
    const nextLang: LanguageCode = this.currentLang === 'en' ? 'es' : 'en';
    this.setLanguage(nextLang);
    return nextLang;
  }

  public subscribe(fn: (lang: LanguageCode) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private loadSavedLanguage(): void {
    try {
      const saved = localStorage.getItem(I18n.STORAGE_KEY) as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        this.currentLang = saved;
      } else {
        // Check browser language
        const browserLang = navigator.language?.slice(0, 2).toLowerCase();
        if (browserLang === 'es') {
          this.currentLang = 'es';
        }
      }
    } catch {}
    document.documentElement.lang = this.currentLang;
  }
}
