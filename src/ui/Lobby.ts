import { Store } from '../store/Store';
import { Sprites } from '../rendering/Sprites';
import { GameMode, RepositoryDNA } from '../github/Types';
import { DataSynthesizer } from '../github/DataSynthesizer';
import { WaveGenerator } from '../procedural/WaveGenerator';

export class Lobby {
  private container: HTMLElement;
  private onStartGameCallback: (mode?: GameMode, dna?: RepositoryDNA) => void;
  private onOpenStoreCallback: () => void;
  private onOpenTerminalCallback: () => void;
  private store: Store;
  private animFrameId: number | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;
  private previewCtx: CanvasRenderingContext2D | null = null;
  private animTime: number = 0;
  private selectedRepoId: string = 'sketion';
  public activeTab: string = 'HANGAR';

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
    this.render();
  }

  public show(): void {
    this.container.style.display = 'flex';
    this.render();
    this.startShipAnimation();
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
    const activeSkin = this.store.getActiveSkin();
    const dna = this.getSelectedDNA();

    // Skin chips for quick customization
    let skinsHtml = '';
    this.store.SKINS.forEach((skin) => {
      const isUnlocked = prof.unlockedSkins.includes(skin.id);
      const isEquipped = prof.activeSkinId === skin.id;

      skinsHtml += `
        <button class="skin-chip-mini ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}" 
                data-skin="${skin.id}" 
                title="${skin.name} ${isEquipped ? '(EQUIPADA)' : isUnlocked ? '(DESBLOQUEADA)' : `(${skin.cost} XP)`}">
          <span class="dot" style="background: ${skin.hullColor};"></span>
          <span>${skin.name.toUpperCase()}</span>
        </button>
      `;
    });

    // Language bars
    let langBarsHtml = '';
    dna.languages.forEach((l) => {
      langBarsHtml += `
        <div class="dna-lang-row">
          <span class="lang-code">${l.name}</span>
          <div class="lang-track">
            <div class="lang-fill" style="width: ${l.pct}%; background: ${l.color};"></div>
          </div>
        </div>
      `;
    });

    // Threat level bar
    const threatPct = dna.threatLevel;
    const threatBarHtml = `
      <div class="threat-track">
        <div class="threat-fill" style="width: ${threatPct}%;"></div>
      </div>
    `;

    // Dropdown options
    const repoOptionsHtml = DataSynthesizer.REPO_PRESETS.map((r) => `
      <option value="${r.id}" ${r.id === this.selectedRepoId ? 'selected' : ''}>
        ${r.name} (${r.threatLevel}% THREAT)
      </option>
    `).join('');

    const langMods = WaveGenerator.getLanguageModifiers(dna.primaryLanguage);

    this.container.innerHTML = `
      <div class="lobby-frame-window">
        <!-- Top App Bar -->
        <div class="lobby-app-bar">
          <div class="app-branding">
            <div class="octocat-icon">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <div class="brand-text">
              <span class="brand-title">GIT_INVADERS.EXE</span>
              <span class="brand-sub">GITHUB ACTIVITY ARCADE ENGINE</span>
            </div>
          </div>
          <div class="app-meta">
            <span class="meta-tag">v2.0 PRO</span>
            <span class="meta-status"><span class="status-dot"></span> LIVE • ONLINE</span>
          </div>
        </div>

        <!-- Main Body: Sidebar + Dashboard Panels -->
        <div class="lobby-content-layout">
          <!-- Left Navigation Sidebar -->
          <div class="lobby-sidebar">
            <button class="nav-tab-btn ${this.activeTab === 'HANGAR' ? 'active' : ''}" id="navHangarBtn">
              <span class="tab-icon">▶</span> HANGAR
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'PLAY' ? 'active' : ''}" id="navPlayBtn">
              <span class="tab-icon">►</span> PLAY
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'STORE' ? 'active' : ''}" id="navStoreBtn">
              <span class="tab-icon">■</span> STORE
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'PROFILE' ? 'active' : ''}" id="navProfileBtn">
              <span class="tab-icon">▲</span> PROFILE
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'STATS' ? 'active' : ''}" id="navStatsBtn">
              <span class="tab-icon">●</span> STATS
            </button>
            <button class="nav-tab-btn ${this.activeTab === 'SETTINGS' ? 'active' : ''}" id="navSettingsBtn">
              <span class="tab-icon">⚙</span> SETTINGS
            </button>
            <button class="nav-tab-btn nav-exit-btn" id="navExitBtn">
              <span class="tab-icon">✕</span> EXIT
            </button>
          </div>

          <!-- Central + Right Work Area -->
          <div class="lobby-main-deck">
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
                  <canvas id="lobbyShipCanvas" width="240" height="120" class="stage-canvas"></canvas>
                </div>

                <div class="ship-identity-line">
                  <div class="ship-callsign">SHIP: ${activeSkin.name.toUpperCase()}</div>
                  <div class="pilot-level-tag">LVL ${prof.level} - ${prof.rankName.toUpperCase()}</div>
                </div>

                <!-- Fast Skins Selector -->
                <div class="fast-skins-row">
                  ${skinsHtml}
                </div>

                <!-- Hardware Upgrades Telemetry -->
                <div class="pilot-hardware-strip">
                  <div class="hw-cell"><span>BLASTER:</span> <b>LVL ${this.store.upgrades.blasterLevel}</b></div>
                  <div class="hw-cell"><span>THRUSTER:</span> <b>LVL ${this.store.upgrades.speedLevel}</b></div>
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
                  ${threatBarHtml}
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
                    <span class="node-title">${dna.bossCoreName}</span>
                    <span class="node-sub">TITAN BREACH // ${dna.contributors} DRONES</span>
                  </div>
                </div>
              </div>

              <!-- Active Stack Modifiers & Keybindings Banner -->
              <div class="tactical-sub-banner">
                <div class="mod-pill-group">
                  <span class="pill-label">TECH MODIFIERS:</span>
                  <span class="pill-badge text-cyan">${dna.primaryLanguage.toUpperCase()} // ${langMods.speedMultiplier > 1 ? '+15% SPD & FIRE' : 'STANDARD SPEED'}</span>
                  ${langMods.hasDroneSupport ? '<span class="pill-badge text-green">PYTHON // DRONE SWARM</span>' : ''}
                  ${langMods.armorBonus > 0 ? '<span class="pill-badge text-yellow">C++/RUST // +1 SHIELD</span>' : ''}
                  ${langMods.bunkerIntegrityRatio > 1 ? '<span class="pill-badge text-purple">HTML/CSS // +30% BUNKERS</span>' : ''}
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
                <span class="ticker-text">${dna.commits.toLocaleString()} Commits synthesized • ${dna.pullRequests} Pull Requests converted to Armored Cruisers • Target Boss: ${dna.bossCoreName}</span>
              </div>
            </div>

            <!-- Bottom: Dominant Hero Action Button -->
            <div class="hero-launch-section">
              <button class="dominant-start-btn" id="lobbyDominantStartBtn">
                <span class="play-icon">▶</span> START MISSION
              </button>
            </div>

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
                  CREDITS <b>${prof.availableXp.toLocaleString()}</b>
                </div>
              </div>

              <div class="connected-systems-badge">
                <span>CONNECTED SYSTEMS:</span>
                <span class="system-tag text-cyan">CODEBASE.UNIVERSE</span>
                <span class="system-status-indicator text-green">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.initCanvas();
  }

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
      this.drawHoloShip();
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

    const shipX = w / 2 - 22;
    const shipY = h / 2 - 16 + Math.sin(this.animTime * 2.5) * 4;

    const activeSkin = this.store.getActiveSkin();
    const prof = this.store.profile;

    Sprites.drawPlayer(
      ctx,
      shipX,
      shipY,
      44,
      34,
      prof.startingShield,
      false,
      activeSkin.hullColor,
      activeSkin.glowColor
    );
  }

  private bindEvents(): void {
    // Dominant Start Mission Button
    const startBtn = this.container.querySelector('#lobbyDominantStartBtn');
    startBtn?.addEventListener('click', () => {
      this.hide();
      this.onStartGameCallback('repository', this.getSelectedDNA());
    });

    // Repository Selector Dropdown
    const repoSelect = this.container.querySelector('#lobbyRepoSelect') as HTMLSelectElement | null;
    repoSelect?.addEventListener('change', (e) => {
      this.selectedRepoId = (e.target as HTMLSelectElement).value;
      this.render();
      this.startShipAnimation();
    });

    // Skin Quick Chips
    const skinChips = this.container.querySelectorAll('.skin-chip-mini');
    skinChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const skinId = chip.getAttribute('data-skin');
        if (skinId) {
          if (this.store.profile.unlockedSkins.includes(skinId)) {
            this.store.equipSkin(skinId);
            this.render();
            this.startShipAnimation();
          } else {
            this.onOpenStoreCallback();
          }
        }
      });
    });

    // Sidebar navigation tabs
    const navHangar = this.container.querySelector('#navHangarBtn');
    navHangar?.addEventListener('click', () => {
      this.activeTab = 'HANGAR';
      this.render();
      this.startShipAnimation();
    });

    const navPlay = this.container.querySelector('#navPlayBtn');
    navPlay?.addEventListener('click', () => {
      this.onOpenTerminalCallback();
    });

    const navStore = this.container.querySelector('#navStoreBtn');
    navStore?.addEventListener('click', () => {
      this.onOpenStoreCallback();
    });

    const navProfile = this.container.querySelector('#navProfileBtn');
    navProfile?.addEventListener('click', () => {
      this.onOpenStoreCallback();
    });

    const navStats = this.container.querySelector('#navStatsBtn');
    navStats?.addEventListener('click', () => {
      this.onOpenTerminalCallback();
    });

    const navSettings = this.container.querySelector('#navSettingsBtn');
    navSettings?.addEventListener('click', () => {
      const themeSelect = document.getElementById('themeSelect');
      themeSelect?.focus();
    });

    const navExit = this.container.querySelector('#navExitBtn');
    navExit?.addEventListener('click', () => {
      this.onOpenTerminalCallback();
    });
  }
}
