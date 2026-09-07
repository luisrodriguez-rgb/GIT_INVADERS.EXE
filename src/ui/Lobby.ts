import { Store } from '../store/Store';
import { Sprites } from '../rendering/Sprites';
import { GameMode, RepositoryDNA } from '../github/Types';
import { DataSynthesizer } from '../github/DataSynthesizer';

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
            <div class="deck-columns-split">
              <!-- Center Column: Pilot Console & Ship Viewport -->
              <div class="pilot-console-card">
                <div class="section-badge">PILOT CONSOLE</div>

                <div class="ship-hologram-stage">
                  <div class="stage-reticle tl"></div>
                  <div class="stage-reticle tr"></div>
                  <div class="stage-reticle bl"></div>
                  <div class="stage-reticle br"></div>
                  <canvas id="lobbyShipCanvas" width="220" height="120" class="stage-canvas"></canvas>
                </div>

                <div class="ship-identity-line">
                  <div class="ship-callsign">SHIP: ${activeSkin.name.toUpperCase()}</div>
                  <div class="pilot-level-tag">LVL ${prof.level} - ${prof.rankName.toUpperCase()}</div>
                </div>

                <!-- Fast Skins Selector -->
                <div class="fast-skins-row">
                  ${skinsHtml}
                </div>
              </div>

              <!-- Right Column: Target Repository & DNA Matrix -->
              <div class="target-repo-card">
                <div class="section-badge">TARGET REPOSITORY</div>

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
                    <span class="threat-val text-red">${dna.threatLevel}%</span>
                  </div>
                  ${threatBarHtml}
                </div>
              </div>
            </div>

            <!-- Dominant Hero Action Button -->
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
