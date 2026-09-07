import { Store } from '../store/Store';
import { Sprites } from '../rendering/Sprites';
import { GameMode, RepositoryDNA } from '../github/Types';
import { DataSynthesizer } from '../github/DataSynthesizer';
import { WaveGenerator } from '../procedural/WaveGenerator';
import { ThemeManager, THEMES, ThemeId } from '../themes/ThemeManager';
import { AudioEngine } from '../audio/AudioEngine';
import { SFX } from '../audio/SFX';
import { Security } from '../utils/Security';

export type LobbyTab = 'HANGAR' | 'PLAY' | 'STORE' | 'PROFILE' | 'STATS' | 'SETTINGS';

export class Lobby {
  private container: HTMLElement;
  private onStartGameCallback: (mode?: GameMode, dna?: RepositoryDNA) => void;
  private onOpenStoreCallback: () => void;
  private onOpenTerminalCallback: () => void;
  private store: Store;
  private themeManager: ThemeManager;
  private audioEngine: AudioEngine;
  private animFrameId: number | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;
  private previewCtx: CanvasRenderingContext2D | null = null;
  private animTime: number = 0;
  private selectedRepoId: string = 'sketion';
  public activeTab: LobbyTab = 'HANGAR';

  constructor(
    container: HTMLElement,
    onStartGame: (mode?: GameMode, dna?: RepositoryDNA) => void,
    onOpenStore: () => void,
    onOpenTerminal: () => void
  ) {
    this.container = container;
    this.onStartGameCallback = onStartGame;
    this.onOpenStoreCallback = onOpenStore;
    this.onOpenTerminalCallback = onOpenTerminal;
    this.store = Store.getInstance();
    this.themeManager = ThemeManager.getInstance();
    this.audioEngine = AudioEngine.getInstance();
    this.render();
  }

  public show(): void {
    this.container.style.display = 'flex';
    this.render();
    if (this.activeTab === 'HANGAR') {
      this.startShipAnimation();
    }
  }

  public hide(): void {
    this.container.style.display = 'none';
    this.stopShipAnimation();
  }

  public getSelectedDNA(): RepositoryDNA {
    const found = DataSynthesizer.REPO_PRESETS.find((r) => r.id === this.selectedRepoId);
    return found || DataSynthesizer.REPO_PRESETS[0];
  }

  public render(): void {
    const prof = this.store.profile;

    let centerDeckHtml = '';
    switch (this.activeTab) {
      case 'PLAY':
        centerDeckHtml = this.renderPlayView();
        break;
      case 'PROFILE':
        centerDeckHtml = this.renderProfileView();
        break;
      case 'STATS':
        centerDeckHtml = this.renderStatsView();
        break;
      case 'SETTINGS':
        centerDeckHtml = this.renderSettingsView();
        break;
      case 'HANGAR':
      default:
        centerDeckHtml = this.renderHangarView();
        break;
    }

    this.container.innerHTML = `
      <div class="lobby-frame-window">
        <!-- Top App Bar: Station Status (Non-duplicated) -->
        <div class="lobby-app-bar">
          <div class="app-branding">
            <span class="status-dot"></span>
            <div class="brand-text">
              <span class="brand-title">PILOT COMMAND // HANGAR DECK</span>
              <span class="brand-sub">SUB-ORBITAL GITHUB TELEMETRY STATION • ACTIVE</span>
            </div>
          </div>
          <div class="app-meta">
            <span class="meta-tag">STATION DOCKED</span>
            <span class="meta-status"><span class="status-dot"></span> SYSTEMS READY</span>
          </div>
        </div>

        <!-- Main Body: Sidebar + Dashboard Panels -->
        <div class="lobby-content-layout">
          <!-- Left Navigation Sidebar -->
          <div class="lobby-sidebar">
            <button class="nav-tab-btn ${this.activeTab === 'HANGAR' ? 'active' : ''}" id="navHangarBtn">
              <span class="tab-icon">[H]</span> HANGAR
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'PLAY' ? 'active' : ''}" id="navPlayBtn">
              <span class="tab-icon">[P]</span> PLAY
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'STORE' ? 'active' : ''}" id="navStoreBtn">
              <span class="tab-icon">[$]</span> STORE
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'PROFILE' ? 'active' : ''}" id="navProfileBtn">
              <span class="tab-icon">[@]</span> PROFILE
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'STATS' ? 'active' : ''}" id="navStatsBtn">
              <span class="tab-icon">[#]</span> STATS
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'SETTINGS' ? 'active' : ''}" id="navSettingsBtn">
              <span class="tab-icon">[*]</span> SETTINGS
            </button>
          </div>

          <!-- Central Deck Area -->
          <div class="lobby-main-deck">
            ${centerDeckHtml}

            <!-- Bottom Telemetry & Status Bar -->
            <div class="lobby-deck-footer">
              <div class="xp-credits-group">
                <div class="xp-track-label">
                  <span>XP ${prof.totalXp.toLocaleString()} / ${((prof.level + 1) * 1000).toLocaleString()}</span>
                  <div class="xp-mini-track">
                    <div class="xp-mini-fill" style="width: ${Math.min(100, (prof.totalXp / ((prof.level + 1) * 1000)) * 100)}%;"></div>
                  </div>
                </div>
                <div class="credits-badge">
                  CREDITS <b>${prof.availableXp.toLocaleString()} XP</b>
                </div>
              </div>

              <div class="connected-systems-badge">
                <span>SYSTEMS:</span>
                <span class="system-tag text-cyan">CODEBASE.UNIVERSE</span>
                <span class="system-status-indicator text-green">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    if (this.activeTab === 'HANGAR') {
      this.initCanvas();
    }
  }

  /* ----------------------------------------------------
     VIEW 1: HANGAR DECK
     ---------------------------------------------------- */
  private renderHangarView(): string {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();
    const dna = this.getSelectedDNA();

    // Fast Skin Chips
    let skinsHtml = '';
    this.store.SKINS.forEach((skin) => {
      const isUnlocked = prof.unlockedSkins.includes(skin.id);
      const isEquipped = prof.activeSkinId === skin.id;

      skinsHtml += `
        <button class="skin-chip-mini ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}" 
                data-skin="${Security.escapeHtml(skin.id)}" 
                title="${Security.escapeHtml(skin.name)} ${isEquipped ? '(EQUIPPED)' : isUnlocked ? '(UNLOCKED)' : `(${skin.cost} XP)`}">
          <span class="dot" style="background: ${skin.hullColor};"></span>
          <span>${Security.escapeHtml(skin.name.toUpperCase())}</span>
        </button>
      `;
    });

    // Language bars
    let langBarsHtml = '';
    dna.languages.forEach((l) => {
      langBarsHtml += `
        <div class="dna-lang-row">
          <span class="lang-code">${Security.escapeHtml(l.name)}</span>
          <div class="lang-track">
            <div class="lang-fill" style="width: ${l.pct}%; background: ${l.color};"></div>
          </div>
        </div>
      `;
    });

    const repoOptionsHtml = DataSynthesizer.REPO_PRESETS.map((r) => `
      <option value="${Security.escapeHtml(r.id)}" ${r.id === this.selectedRepoId ? 'selected' : ''}>
        ${Security.escapeHtml(r.name)} (${r.threatLevel}% THREAT)
      </option>
    `).join('');

    const langMods = WaveGenerator.getLanguageModifiers(dna.primaryLanguage);

    return `
      <!-- Upper Split: Pilot Console + Target Repo -->
      <div class="deck-columns-split">
        <!-- Center Column: Pilot Console & Ship Viewport -->
        <div class="pilot-console-card">
          <div class="section-badge">PILOT CONSOLE // ARSENAL</div>

          <div class="ship-hologram-stage">
            <div class="stage-reticle tl"></div>
            <div class="stage-reticle tr"></div>
            <div class="stage-reticle bl"></div>
            <div class="stage-reticle br"></div>
            <canvas id="lobbyShipCanvas" width="240" height="110" class="stage-canvas"></canvas>
          </div>

          <div class="ship-identity-line">
            <div class="ship-callsign">SHIP: ${Security.escapeHtml(activeSkin.name.toUpperCase())}</div>
            <div class="pilot-level-tag">LVL ${prof.level} - ${Security.escapeHtml(prof.rankName.toUpperCase())}</div>
          </div>

          <!-- Fast Skins Selector -->
          <div class="fast-skins-row">
            ${skinsHtml}
          </div>

          <!-- Hardware Upgrades Telemetry -->
          <div class="pilot-hardware-strip">
            <div class="hw-cell"><span>BLASTER:</span> <b>LVL ${prof.fireRateLevel}</b></div>
            <div class="hw-cell"><span>THRUSTER:</span> <b>LVL ${prof.thrusterLevel}</b></div>
            <div class="hw-cell"><span>DEFLECTOR:</span> <b>${prof.startingShield ? 'ONLINE' : 'OFFLINE'}</b></div>
          </div>
        </div>

        <!-- Right Column: Target Repository & DNA Matrix -->
        <div class="target-repo-card">
          <div class="section-badge">TARGET REPOSITORY // DNA</div>

          <div class="repo-select-row">
            <span class="octo-mini">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </span>
            <select class="repo-dropdown" id="lobbyRepoSelect">
              ${repoOptionsHtml}
            </select>
          </div>

          <div class="repo-metrics-grid">
            <div class="m-cell"><span>COMMITS</span> <b>${dna.commits.toLocaleString()}</b></div>
            <div class="m-cell"><span>PRs</span> <b>${dna.pullRequests}</b></div>
            <div class="m-cell"><span>ISSUES</span> <b>${dna.issues}</b></div>
            <div class="m-cell"><span>CONTRIBUTORS</span> <b>${dna.contributors}</b></div>
          </div>

          <div class="dna-languages-block">
            <div class="block-title">LANGUAGES</div>
            <div class="lang-bars-stack">
              ${langBarsHtml}
            </div>
          </div>

          <div class="dna-threat-block">
            <div class="threat-title-row">
              <span>THREAT LEVEL</span>
              <span class="threat-val text-red">${dna.threatLevel}% (${dna.threatRating})</span>
            </div>
            <div class="threat-track">
              <div class="threat-fill" style="width: ${dna.threatLevel}%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section: Tactical Mission Intelligence & Encounter Roadmap -->
      <div class="tactical-intel-card">
        <div class="tactical-card-header">
          <div class="tac-header-left">
            <span class="tac-status-indicator"></span>
            <span class="tac-title">TACTICAL MISSION BRIEFING</span>
          </div>
          <span class="tac-meta">ENCOUNTER ROADMAP & TECH DIRECTIVES</span>
        </div>

        <div class="tactical-roadmap-grid">
          <div class="roadmap-node active">
            <div class="node-badge">W1</div>
            <div class="node-details">
              <span class="node-title">COMMIT SQUADRON</span>
              <span class="node-sub">FORMATION: GRID</span>
            </div>
          </div>
          <div class="roadmap-node">
            <div class="node-badge">W2</div>
            <div class="node-details">
              <span class="node-title">ARMORED PR FLANK</span>
              <span class="node-sub">FORMATION: DELTA WING</span>
            </div>
          </div>
          <div class="roadmap-node">
            <div class="node-badge">W3</div>
            <div class="node-details">
              <span class="node-title">ISSUE BUG BOMBERS</span>
              <span class="node-sub">FORMATION: DIVE ATTACK</span>
            </div>
          </div>
          <div class="roadmap-node boss-node">
            <div class="node-badge">BOSS</div>
            <div class="node-details">
              <span class="node-title">${Security.escapeHtml(dna.bossCoreName)}</span>
              <span class="node-sub">TITAN BREACH // ${dna.contributors} DRONES</span>
            </div>
          </div>
        </div>

        <!-- Active Stack Modifiers & Keybindings Banner -->
        <div class="tactical-sub-banner">
          <div class="mod-pill-group">
            <span class="pill-label">TECH MODIFIERS:</span>
            <span class="pill-badge text-cyan">${Security.escapeHtml(dna.primaryLanguage.toUpperCase())} // ${langMods.speedMultiplier > 1 ? '+15% SPD & FIRE' : 'STANDARD'}</span>
            ${langMods.hasDroneSupport ? '<span class="pill-badge text-green">PYTHON // DRONES</span>' : ''}
            ${langMods.armorBonus > 0 ? '<span class="pill-badge text-yellow">C++/RUST // SHIELD+</span>' : ''}
            ${langMods.bunkerIntegrityRatio > 1 ? '<span class="pill-badge text-purple">HTML/CSS // BUNKERS+</span>' : ''}
          </div>

          <div class="combat-keys-pill">
            <span class="key-tag"><kbd>SPACE</kbd> FIRE</span>
            <span class="key-tag"><kbd>Q</kbd> REBASE</span>
            <span class="key-tag"><kbd>E</kbd> STASH</span>
            <span class="key-tag"><kbd>SHIFT</kbd> PUSH</span>
          </div>
        </div>

        <!-- Live Telemetry Stream Ticker -->
        <div class="live-telemetry-strip">
          <span class="ticker-prefix">[GIT_FEED]</span>
          <span class="ticker-text">${dna.commits.toLocaleString()} Commits synthesized • ${dna.pullRequests} Pull Requests converted • Boss Target: ${Security.escapeHtml(dna.bossCoreName)}</span>
        </div>
      </div>

      <!-- Dominant Hero Action Button -->
      <div class="hero-launch-section">
        <button class="dominant-start-btn" id="lobbyDominantStartBtn">
          <span class="play-icon">▶</span> START MISSION
        </button>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 2: PLAY (OPERATIONAL MODE SELECTOR)
     ---------------------------------------------------- */
  private renderPlayView(): string {
    const dna = this.getSelectedDNA();
    return `
      <div class="lobby-subview-container">
        <div class="subview-header">
          <span class="subview-title">MISSION DEPLOYMENT BAY</span>
          <span class="subview-desc">SELECT OPERATIONAL VECTOR & TARGET REPOSITORY</span>
        </div>

        <div class="play-modes-grid">
          <!-- Mode 1: Repository Campaign -->
          <div class="play-mode-card" id="playModeRepoCard">
            <div class="play-mode-top">
              <span class="play-mode-tag cyan">CAMPAIGN</span>
              <span class="text-muted" style="font-size: 0.65rem;">TARGET: ${Security.escapeHtml(dna.name.toUpperCase())}</span>
            </div>
            <div class="play-mode-name">REPOSITORY CAMPAIGN</div>
            <div class="play-mode-desc">
              Procedural space assault generated directly from ${Security.escapeHtml(dna.name)}. Defend against commit squadrons, shield-bearing PRs, and neutralize ${Security.escapeHtml(dna.bossCoreName)}.
            </div>
            <button class="play-mode-launch-btn" id="btnLaunchRepoMode">[ LAUNCH CAMPAIGN ]</button>
          </div>

          <!-- Mode 2: Profile Arcade -->
          <div class="play-mode-card" id="playModeProfileCard">
            <div class="play-mode-top">
              <span class="play-mode-tag green">ARCADE</span>
              <span class="text-muted" style="font-size: 0.65rem;">PILOT REPOSITORIES</span>
            </div>
            <div class="play-mode-name">PROFILE ARCADE</div>
            <div class="play-mode-desc">
              Convert your own GitHub profile commits, contribution graphs, and repositories into an endless arcade defense simulation with scalable waves.
            </div>
            <button class="play-mode-launch-btn" id="btnLaunchProfileMode">[ LAUNCH PROFILE ARCADE ]</button>
          </div>

          <!-- Mode 3: Chaos Max Mode -->
          <div class="play-mode-card" id="playModeChaosCard">
            <div class="play-mode-top">
              <span class="play-mode-tag red">HARDCORE</span>
              <span class="text-muted" style="font-size: 0.65rem;">MAX THREAT LEVEL</span>
            </div>
            <div class="play-mode-name">CHAOS MAX MODE</div>
            <div class="play-mode-desc">
              Hyper-accelerated bullet-storm environment. Hostiles move at +60% velocity with relentless firing cadences and unpredictable dive formations.
            </div>
            <button class="play-mode-launch-btn" id="btnLaunchChaosMode">[ LAUNCH CHAOS MAX ]</button>
          </div>

          <!-- Mode 4: Citadel Universe Gauntlet -->
          <div class="play-mode-card" id="playModeCitadelCard">
            <div class="play-mode-top">
              <span class="play-mode-tag purple">GAUNTLET</span>
              <span class="text-muted" style="font-size: 0.65rem;">4 CITADEL BIOMES</span>
            </div>
            <div class="play-mode-name">CITADEL UNIVERSE</div>
            <div class="play-mode-desc">
              Assault the ultimate multi-language GitHub Citadel fortress. Defeat 4 procedural titan bosses back-to-back with persistent damage retention.
            </div>
            <button class="play-mode-launch-btn" id="btnLaunchCitadelMode">[ LAUNCH CITADEL GAUNTLET ]</button>
          </div>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 4px;">
          <button class="store-action-btn btn-buy" id="btnOpenAdvancedTerminal" style="padding: 6px 18px; font-size: 0.74rem;">
            [ OPEN ADVANCED REPOSITORY SELECTOR TERMINAL ]
          </button>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 3: PROFILE (PILOT DOSSIER)
     ---------------------------------------------------- */
  private renderProfileView(): string {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();
    const nextRankXp = (prof.level + 1) * 1000;
    const xpPct = Math.min(100, Math.round((prof.totalXp / nextRankXp) * 100));

    let fleetMiniHtml = '';
    this.store.SKINS.forEach((skin) => {
      const isUnlocked = prof.unlockedSkins.includes(skin.id);
      const isEquipped = prof.activeSkinId === skin.id;

      fleetMiniHtml += `
        <div class="fleet-ship-mini ${isEquipped ? 'equipped' : ''}">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="dot" style="background: ${skin.hullColor};"></span>
            <div>
              <b style="color: ${isEquipped ? '#00e5ff' : '#ffffff'};">${Security.escapeHtml(skin.name)}</b>
              <div style="font-size: 0.55rem; color: var(--text-muted);">${Security.escapeHtml(skin.classTag)}</div>
            </div>
          </div>
          <div>
            ${isEquipped 
              ? '<span class="text-green" style="font-weight: 800; font-size: 0.6rem;">EQUIPPED</span>' 
              : isUnlocked 
              ? `<button class="sub-nav-chip btn-equip-ship" data-skin="${Security.escapeHtml(skin.id)}">EQUIP</button>` 
              : `<button class="sub-nav-chip" data-skin="${Security.escapeHtml(skin.id)}" style="color: var(--text-muted);">${skin.cost} XP</button>`}
          </div>
        </div>
      `;
    });

    return `
      <div class="lobby-subview-container">
        <div class="subview-header">
          <span class="subview-title">PILOT DOSSIER // SERVICE RECORD</span>
          <span class="subview-desc">CALL SIGN: @luisrodriguez-rgb // LEAD ARCHITECT</span>
        </div>

        <div class="profile-dossier-layout">
          <!-- Left: Pilot Status & Hardware -->
          <div class="profile-identity-box">
            <div class="profile-rank-header">
              <img src="https://github.com/luisrodriguez-rgb.png" class="profile-pilot-avatar" alt="Luis Rodriguez" />
              <div class="profile-rank-info">
                <span class="profile-callsign">LUIS RODRIGUEZ // @luisrodriguez-rgb</span>
                <span class="profile-rank-title">CLEARANCE LVL ${prof.level} • ${Security.escapeHtml(prof.rankName.toUpperCase())}</span>
              </div>
            </div>

            <!-- XP Progress -->
            <div class="profile-xp-card">
              <div style="display: flex; justify-content: space-between; font-size: 0.65rem;">
                <span style="color: var(--text-muted);">CAREER ADVANCEMENT:</span>
                <span style="color: #00e5ff; font-weight: 800;">${prof.totalXp.toLocaleString()} / ${nextRankXp.toLocaleString()} XP (${xpPct}%)</span>
              </div>
              <div class="xp-bar-container">
                <div class="xp-bar-fill" style="width: ${xpPct}%;"></div>
              </div>
            </div>

            <!-- Equipped Ship Summary -->
            <div class="bay-ability-card" style="margin-top: 4px;">
              <div class="bay-ability-header">
                <span class="bay-ability-title">EQUIPPED HULL: ${Security.escapeHtml(activeSkin.name.toUpperCase())}</span>
                <span class="bay-ability-key">[ ${Security.escapeHtml(activeSkin.ability.triggerKey)} ]</span>
              </div>
              <div class="bay-ability-desc">${Security.escapeHtml(activeSkin.ability.description)}</div>
            </div>

            <!-- Hardware Overclock Stats -->
            <div class="pilot-hardware-strip" style="margin-top: 6px;">
              <div class="hw-cell"><span>BLASTER CADENCE:</span> <b>LVL ${prof.fireRateLevel} / 5</b></div>
              <div class="hw-cell"><span>THRUST AGILITY:</span> <b>LVL ${prof.thrusterLevel} / 5</b></div>
            </div>
            <div class="pilot-hardware-strip">
              <div class="hw-cell"><span>DEFLECTOR SHIELD:</span> <b>${prof.startingShield ? 'ACTIVE' : 'LOCKED'}</b></div>
              <div class="hw-cell"><span>QUANTUM PIERCE:</span> <b>${prof.quantumPiercing ? 'ACTIVE' : 'LOCKED'}</b></div>
            </div>

            <button class="store-action-btn btn-buy" id="btnProfileGoStore" style="margin-top: 6px;">
              [ OPEN SHIP ENGINEERING BAY / UPGRADES ]
            </button>
          </div>

          <!-- Right: Fleet Hangar Roster -->
          <div class="profile-fleet-box">
            <div style="font-size: 0.72rem; font-weight: 800; color: #00e5ff; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px;">
              PILOT FLEET INVENTORY (${prof.unlockedSkins.length} / ${this.store.SKINS.length} SHIPS)
            </div>
            <div class="fleet-ships-grid">
              ${fleetMiniHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 4: STATS (COMBAT TELEMETRY)
     ---------------------------------------------------- */
  private renderStatsView(): string {
    const prof = this.store.profile;
    const highScore = parseInt(localStorage.getItem('git_invaders_high_score') || '0', 10);

    return `
      <div class="lobby-subview-container">
        <div class="subview-header">
          <span class="subview-title">COMBAT TELEMETRY // CAREER RECORDS</span>
          <span class="subview-desc">SYSTEM ENGAGEMENT ARCHIVE & PURGE STATS</span>
        </div>

        <div class="stats-dossier-grid">
          <div class="stat-metric-card">
            <span class="metric-number cyan">${highScore.toLocaleString()}</span>
            <span class="metric-label">RECORD HIGH SCORE</span>
          </div>

          <div class="stat-metric-card">
            <span class="metric-number green">${prof.totalXp.toLocaleString()}</span>
            <span class="metric-label">TOTAL ACCUMULATED XP</span>
          </div>

          <div class="stat-metric-card">
            <span class="metric-number amber">${prof.availableXp.toLocaleString()}</span>
            <span class="metric-label">CURRENT SURPLUS CREDITS</span>
          </div>

          <div class="stat-metric-card">
            <span class="metric-number purple">${prof.level}</span>
            <span class="metric-label">PILOT CLEARANCE LEVEL</span>
          </div>

          <div class="stat-metric-card">
            <span class="metric-number cyan">${prof.unlockedSkins.length} / ${this.store.SKINS.length}</span>
            <span class="metric-label">SHIPS COMMISSIONED</span>
          </div>

          <div class="stat-metric-card">
            <span class="metric-number green">LVL ${prof.fireRateLevel + prof.thrusterLevel}</span>
            <span class="metric-label">HARDWARE OVERCLOCK SUM</span>
          </div>
        </div>

        <div class="tactical-intel-card" style="margin-top: 6px;">
          <div class="tactical-card-header">
            <span class="tac-title">COMBAT EFFICIENCY REPORT</span>
            <span class="tac-meta">ENGAGEMENT DIRECTIVES</span>
          </div>
          <div style="font-size: 0.65rem; color: var(--text-secondary); line-height: 1.4; padding: 4px 0;">
            Pilot record shows continuous active service. Neutralized commit hostiles generate raw experience points directly credited toward hull engineering, thruster agility, and weapon overclock modules.
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 5: SETTINGS (ENGINE CONFIGURATION)
     ---------------------------------------------------- */
  private renderSettingsView(): string {
    const currentTheme = this.themeManager.currentTheme;
    const themeOptionsHtml = (Object.keys(THEMES) as ThemeId[]).map((id) => `
      <option value="${id}" ${id === currentTheme.id ? 'selected' : ''}>
        ${Security.escapeHtml(THEMES[id].name.toUpperCase())}
      </option>
    `).join('');

    const isMuted = this.audioEngine.isMuted;
    const currentVol = Math.round(this.audioEngine.masterVolume * 100);

    return `
      <div class="lobby-subview-container">
        <div class="subview-header">
          <span class="subview-title">SYSTEM CONFIGURATION // ENGINE CONTROL</span>
          <span class="subview-desc">AUDIO, DISPLAY & CONTROLS CONFIGURATION</span>
        </div>

        <div class="settings-panel-grid">
          <!-- Display & Audio -->
          <div class="setting-card">
            <span class="setting-card-title">DISPLAY & HARDWARE AUDIO</span>

            <div class="setting-row">
              <label>PALETTE THEME:</label>
              <select class="setting-select" id="settingsThemeSelect">
                ${themeOptionsHtml}
              </select>
            </div>

            <div class="setting-row">
              <label>MASTER AUDIO:</label>
              <button class="sub-nav-chip" id="settingsMuteToggleBtn" style="color: ${isMuted ? '#ef4444' : '#10b981'};">
                ${isMuted ? '[ AUDIO: MUTED ]' : '[ AUDIO: ACTIVE ]'}
              </button>
            </div>

            <div class="setting-row">
              <label>MASTER VOLUME:</label>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="range" class="setting-range" id="settingsVolumeRange" min="0" max="100" value="${currentVol}" />
                <span id="settingsVolLabel" style="font-size: 0.65rem; font-weight: 800; width: 30px;">${currentVol}%</span>
              </div>
            </div>

            <div class="setting-row" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px;">
              <label style="color: #ef4444;">DATA PURGE:</label>
              <button class="sub-nav-chip" id="settingsResetDataBtn" style="border-color: #ef4444; color: #ef4444;">
                [ RESET CAREER DATA ]
              </button>
            </div>
          </div>

          <!-- Flight Controls & Keybindings Reference -->
          <div class="setting-card">
            <span class="setting-card-title">FLIGHT CONTROLS & BINDINGS</span>

            <table class="keybinds-table">
              <tr>
                <td>LATERAL THRUSTERS</td>
                <td><kbd>LEFT / RIGHT</kbd> OR <kbd>A / D</kbd></td>
              </tr>
              <tr>
                <td>PRIMARY BLASTER CANNON</td>
                <td><kbd>SPACEBAR</kbd></td>
              </tr>
              <tr>
                <td>GIT REBASE (CHRONO SLOW-MO)</td>
                <td><kbd>Q</kbd></td>
              </tr>
              <tr>
                <td>STASH SHIELD MATRIX</td>
                <td><kbd>E</kbd></td>
              </tr>
              <tr>
                <td>GIT PUSH (QUANTUM OVERDRIVE)</td>
                <td><kbd>SHIFT</kbd></td>
              </tr>
              <tr>
                <td>TACTICAL PAUSE & TERMINAL</td>
                <td><kbd>ESC</kbd> OR <kbd>P</kbd></td>
              </tr>
            </table>

            <div style="font-size: 0.58rem; color: var(--text-muted); margin-top: 6px; line-height: 1.3;">
              All keybindings are mapped directly to hardware keyboard listeners with zero latency. Touch controls are activated automatically on mobile viewports.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     CANVAS & ANIMATION
     ---------------------------------------------------- */
  private initCanvas(): void {
    this.previewCanvas = this.container.querySelector('#lobbyShipCanvas') as HTMLCanvasElement;
    if (this.previewCanvas) {
      this.previewCtx = this.previewCanvas.getContext('2d');
    }
  }

  private startShipAnimation(): void {
    this.stopShipAnimation();
    const renderLoop = () => {
      this.animTime += 0.025;
      if (this.activeTab === 'HANGAR') {
        this.drawHoloShip();
      }
      this.animFrameId = requestAnimationFrame(renderLoop);
    };
    this.animFrameId = requestAnimationFrame(renderLoop);
  }

  private stopShipAnimation(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private drawHoloShip(): void {
    if (!this.previewCanvas || !this.previewCtx) return;
    const ctx = this.previewCtx;
    const w = this.previewCanvas.width;
    const h = this.previewCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle holographic wireframe grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const shipW = 78;
    const shipH = 56;
    const shipX = w / 2 - shipW / 2;
    const shipY = h / 2 - shipH / 2 + Math.sin(this.animTime * 2.5) * 4;

    const activeSkin = this.store.getActiveSkin();
    const prof = this.store.profile;

    // Soft glow backdrop
    const grad = ctx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, 60);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
    ctx.fill();

    Sprites.drawPlayer(
      ctx,
      shipX,
      shipY,
      shipW,
      shipH,
      prof.startingShield,
      false,
      activeSkin.hullColor,
      activeSkin.glowColor,
      this.animTime,
      1.0,
      false,
      activeSkin.id
    );
  }

  /* ----------------------------------------------------
     EVENT BINDINGS
     ---------------------------------------------------- */
  private bindEvents(): void {
    // 1. Sidebar Navigation
    const navHangar = this.container.querySelector('#navHangarBtn');
    navHangar?.addEventListener('click', () => {
      this.activeTab = 'HANGAR';
      SFX.playLaser('player');
      this.render();
      this.startShipAnimation();
    });

    const navPlay = this.container.querySelector('#navPlayBtn');
    navPlay?.addEventListener('click', () => {
      this.activeTab = 'PLAY';
      SFX.playLaser('player');
      this.render();
      this.stopShipAnimation();
    });

    const navStore = this.container.querySelector('#navStoreBtn');
    navStore?.addEventListener('click', () => {
      this.onOpenStoreCallback();
    });

    const navProfile = this.container.querySelector('#navProfileBtn');
    navProfile?.addEventListener('click', () => {
      this.activeTab = 'PROFILE';
      SFX.playLaser('player');
      this.render();
      this.stopShipAnimation();
    });

    const navStats = this.container.querySelector('#navStatsBtn');
    navStats?.addEventListener('click', () => {
      this.activeTab = 'STATS';
      SFX.playLaser('player');
      this.render();
      this.stopShipAnimation();
    });

    const navSettings = this.container.querySelector('#navSettingsBtn');
    navSettings?.addEventListener('click', () => {
      this.activeTab = 'SETTINGS';
      SFX.playLaser('player');
      this.render();
      this.stopShipAnimation();
    });

    // 2. Hangar Events
    if (this.activeTab === 'HANGAR') {
      const startBtn = this.container.querySelector('#lobbyDominantStartBtn');
      startBtn?.addEventListener('click', () => {
        this.hide();
        this.onStartGameCallback('repository', this.getSelectedDNA());
      });

      const repoSelect = this.container.querySelector('#lobbyRepoSelect') as HTMLSelectElement | null;
      repoSelect?.addEventListener('change', (e) => {
        this.selectedRepoId = (e.target as HTMLSelectElement).value;
        this.render();
        this.startShipAnimation();
      });

      const skinChips = this.container.querySelectorAll('.skin-chip-mini');
      skinChips.forEach((chip) => {
        chip.addEventListener('click', () => {
          const skinId = chip.getAttribute('data-skin');
          if (skinId) {
            if (this.store.profile.unlockedSkins.includes(skinId)) {
              this.store.equipSkin(skinId);
              SFX.playPowerup();
              this.render();
              this.startShipAnimation();
            } else {
              this.onOpenStoreCallback();
            }
          }
        });
      });
    }

    // 3. Play View Events
    if (this.activeTab === 'PLAY') {
      const btnRepo = this.container.querySelector('#btnLaunchRepoMode');
      btnRepo?.addEventListener('click', () => {
        this.hide();
        this.onStartGameCallback('repository', this.getSelectedDNA());
      });

      const btnProfile = this.container.querySelector('#btnLaunchProfileMode');
      btnProfile?.addEventListener('click', () => {
        this.hide();
        this.onStartGameCallback('profile');
      });

      const btnChaos = this.container.querySelector('#btnLaunchChaosMode');
      btnChaos?.addEventListener('click', () => {
        this.hide();
        this.onStartGameCallback('chaos', this.getSelectedDNA());
      });

      const btnCitadel = this.container.querySelector('#btnLaunchCitadelMode');
      btnCitadel?.addEventListener('click', () => {
        this.hide();
        this.onStartGameCallback('citadel');
      });

      const btnTerminal = this.container.querySelector('#btnOpenAdvancedTerminal');
      btnTerminal?.addEventListener('click', () => {
        this.onOpenTerminalCallback();
      });
    }

    // 4. Profile View Events
    if (this.activeTab === 'PROFILE') {
      const equipBtns = this.container.querySelectorAll('.btn-equip-ship');
      equipBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const skinId = btn.getAttribute('data-skin');
          if (skinId) {
            this.store.equipSkin(skinId);
            SFX.playPowerup();
            this.render();
          }
        });
      });

      const goStoreBtn = this.container.querySelector('#btnProfileGoStore');
      goStoreBtn?.addEventListener('click', () => {
        this.onOpenStoreCallback();
      });
    }

    // 5. Settings View Events
    if (this.activeTab === 'SETTINGS') {
      const themeSelect = this.container.querySelector('#settingsThemeSelect') as HTMLSelectElement | null;
      themeSelect?.addEventListener('change', (e) => {
        const themeId = (e.target as HTMLSelectElement).value as ThemeId;
        this.themeManager.setTheme(themeId);
        SFX.playPowerup();
      });

      const muteBtn = this.container.querySelector('#settingsMuteToggleBtn');
      muteBtn?.addEventListener('click', () => {
        this.audioEngine.toggleMute();
        this.render();
      });

      const volRange = this.container.querySelector('#settingsVolumeRange') as HTMLInputElement | null;
      volRange?.addEventListener('input', (e) => {
        const val = parseInt((e.target as HTMLInputElement).value, 10);
        this.audioEngine.setVolume(val / 100);
        const label = this.container.querySelector('#settingsVolLabel');
        if (label) label.textContent = `${val}%`;
      });

      const resetBtn = this.container.querySelector('#settingsResetDataBtn');
      resetBtn?.addEventListener('click', () => {
        if (confirm('CONFIRM RESET: Purge all local pilot XP, unlocked skins, and high scores?')) {
          localStorage.removeItem('git_invaders_player_profile');
          localStorage.removeItem('git_invaders_high_score');
          location.reload();
        }
      });
    }
  }
}
