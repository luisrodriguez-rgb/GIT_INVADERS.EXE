import { Store, ShipModel } from '../store/Store';
import { Sprites } from '../rendering/Sprites';
import { ShipComposer } from '../rendering/ShipComposer';
import { GameMode, RepositoryDNA } from '../github/Types';
import { DataSynthesizer } from '../github/DataSynthesizer';
import { ThemeManager, THEMES, ThemeId } from '../themes/ThemeManager';
import { AudioEngine } from '../audio/AudioEngine';
import { SFX } from '../audio/SFX';
import { Security } from '../utils/Security';
import { I18n } from '../i18n/I18n';
import { BossGenerator, ARCHETYPE_DATABASE } from '../procedural/BossGenerator';
import { Modals } from './Modals';
import { CodexModal } from './CodexModal';

export type LobbyTab = 'HANGAR' | 'PLAY' | 'STORE' | 'PROFILE' | 'STATS' | 'SETTINGS';

export class Lobby {
  private container: HTMLElement;
  private onStartGameCallback: (mode?: GameMode, dna?: RepositoryDNA) => void;
  private onOpenStoreCallback: () => void;
  private onOpenTerminalCallback: () => void;
  private store: Store;
  private themeManager: ThemeManager;
  private audioEngine: AudioEngine;
  private modals: Modals | null = null;
  private codexModal: CodexModal | null = null;
  private animFrameId: number | null = null;
  private shipCanvas: HTMLCanvasElement | null = null;
  private shipCtx: CanvasRenderingContext2D | null = null;
  private bossCanvas: HTMLCanvasElement | null = null;
  private bossCtx: CanvasRenderingContext2D | null = null;
  private radarCanvas: HTMLCanvasElement | null = null;
  private radarCtx: CanvasRenderingContext2D | null = null;
  private animTime: number = 0;
  private selectedRepoId: string = 'infra_service';
  private isProceduralActive: boolean = false;
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

    const modalEl = document.getElementById('modalOverlay');
    if (modalEl) {
      this.modals = new Modals(modalEl);
      this.codexModal = new CodexModal(modalEl);
    }
    I18n.getInstance().subscribe(() => {
      if (this.container.style.display !== 'none') {
        this.render();
      }
    });
    this.render();
  }

  public show(): void {
    this.container.style.display = 'flex';
    this.render();
    if (this.activeTab === 'HANGAR') {
      this.startAnimations();
    }
  }

  public hide(): void {
    this.container.style.display = 'none';
    this.stopAnimations();
  }

  public getSelectedDNA(): RepositoryDNA {
    const found = DataSynthesizer.REPO_PRESETS.find((r) => r.id === this.selectedRepoId);
    return found || DataSynthesizer.REPO_PRESETS.find((r) => r.id === 'infra_service') || DataSynthesizer.REPO_PRESETS[0];
  }

  public render(): void {
    const prof = this.store.profile;
    const dna = this.getSelectedDNA();

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
        <!-- TOP NAVIGATION BAR -->
        <header class="lobby-header-bar">
          <!-- Left Branding -->
          <div class="brand-group">
            <svg class="octocat-logo-svg" viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <div class="brand-text-col">
              <div class="brand-main-title">GIT_INVADERS.EXE</div>
              <div class="brand-sub-title">CODE REPOSITORIES. REAL BATTLES.</div>
            </div>
          </div>

          <!-- Center Navigation Tabs -->
          <nav class="nav-tabs-pill-row">
            <button class="nav-tab-pill ${this.activeTab === 'HANGAR' ? 'active' : ''}" id="navHangarBtn">
              HANGAR
            </button>
            <button class="nav-tab-pill ${this.activeTab === 'PLAY' ? 'active' : ''}" id="navPlayBtn">
              MISIÓN
            </button>
            <button class="nav-tab-pill" id="navStoreBtn">
              TIENDA
            </button>
            <button class="nav-tab-pill" id="navCodexBtn">
              CÓDICE
            </button>
            <button class="nav-tab-pill ${this.activeTab === 'STATS' ? 'active' : ''}" id="navStatsBtn">
              ESTADÍSTICAS
            </button>
          </nav>

          <!-- Right Status & Settings -->
          <div class="header-status-group">
            <!-- Active Repo Pill -->
            <div class="repo-pill-badge" id="lobbyRepoPillBtn" title="Click para cambiar repositorio activo">
              <span class="repo-code-icon">&lt;/&gt;</span>
              <div class="repo-text-stack">
                <span class="repo-slug">/${Security.escapeHtml(dna.name)}</span>
                <span class="repo-status-label"><span class="green-status-dot"></span> REPOSITORY ACTIVE</span>
              </div>
              <select class="hidden-repo-picker" id="lobbyRepoSelect">
                ${DataSynthesizer.REPO_PRESETS.map((r) => `
                  <option value="${Security.escapeHtml(r.id)}" ${r.id === this.selectedRepoId ? 'selected' : ''}>
                    /${Security.escapeHtml(r.name)} - ${Security.escapeHtml(r.bossCoreName || r.description)}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Stars Pill -->
            <div class="stars-badge-pill">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#fbbf24" style="flex-shrink:0;">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span class="badge-num">${prof.availableXp.toLocaleString()}</span>
              <span class="badge-lbl">STARS</span>
            </div>

            <!-- XP Pill -->
            <div class="xp-badge-pill">
              <span class="xp-tag">[XP]</span>
              <span class="badge-num">${prof.totalXp.toLocaleString()}</span>
              <span class="badge-lbl">EXP</span>
            </div>

            <!-- Settings Cog -->
            <button class="settings-cog-btn" id="navSettingsBtn" title="Configuración">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>
        </header>

        <!-- MAIN VIEW BODY -->
        <main class="lobby-viewport-body">
          ${centerDeckHtml}
        </main>

        <!-- FOOTER BAR -->
        <footer class="lobby-footer-bar">
          <div class="footer-left">
            <span class="footer-ver">GIT_INVADERS.EXE v2.5.0</span>
            <span class="footer-divider">//</span>
            <span class="footer-universe">CODEBASE.UNIVERSE</span>
          </div>
          <div class="footer-center">
            Cada repositorio es un universo. Cada commit, una amenaza.
          </div>
          <div class="footer-right">
            <span class="api-online-tag"><span class="green-status-dot"></span> GITHUB API ONLINE</span>
            <span class="arcade-tag"><span class="tech-icon-bracket">[</span>MODO ARCADE<span class="tech-icon-bracket">]</span></span>
          </div>
        </footer>
      </div>
    `;

    this.bindEvents();
    if (this.activeTab === 'HANGAR') {
      this.initCanvases();
      this.drawMiniThumbs();
      this.startAnimations();
    }
  }

  /* ----------------------------------------------------
     VIEW: PILOT HANGAR DECK (COMBAT FIRST // 3-ZONE HIERARCHY)
     ---------------------------------------------------- */
  private renderHangarView(): string {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();
    const dna = this.getSelectedDNA();
    const bossBlueprint = BossGenerator.generateFromDNA(dna);
    const archetypeData = bossBlueprint.archetypeData;
    const mutation = bossBlueprint.mutation || 'CORRUPTED';
    const genome = bossBlueprint.genome;
    const diagnostics = ShipComposer.getDiagnostics(1.0, prof.startingShield);
    const t = I18n.getInstance().t;

    // 1. Mis Naves Vertical List (All 8 Ships)
    const fleetVerticalHtml = this.store.SKINS.map((skin) => {
      const isEquipped = prof.activeSkinId === skin.id && !this.isProceduralActive;
      return `
        <div class="fleet-ship-card ${isEquipped ? 'equipped' : ''}" data-skin="${Security.escapeHtml(skin.id)}">
          <canvas class="mini-ship-thumb" width="46" height="32" data-skin-id="${Security.escapeHtml(skin.id)}"></canvas>
          <div class="ship-info-col">
            <div class="ship-title-row">
              <span class="ship-card-name">${Security.escapeHtml(skin.name)}</span>
              ${isEquipped ? `<span class="equipped-tag-pill">${t.hangarEquipped}</span>` : ''}
            </div>
            <span class="ship-card-class">${Security.escapeHtml(skin.classTag.split('|')[1]?.trim() || skin.classTag)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Ratings for active ship (out of 10)
    const armor10 = Math.round((activeSkin.stats.armor / 100) * 10);
    const speed10 = Math.round((activeSkin.stats.speed / 100) * 10);
    const cadence10 = Math.round((activeSkin.stats.fireRate / 100) * 10);
    const shield10 = Math.round((activeSkin.stats.shield / 100) * 10);

    const renderPips = (val10: number, color: string) => {
      let pips = '';
      for (let i = 1; i <= 10; i++) {
        pips += `<span class="stat-pip ${i <= val10 ? `filled ${color}` : ''}"></span>`;
      }
      return `<div class="stat-pips-strip">${pips}</div>`;
    };

    // Genome Ratings
    const threatVal = genome.ratings?.threat || Math.min(99, Math.max(70, Math.round(dna.threatLevel * 0.95 + 10)));
    const complexityVal = genome.ratings?.complexity || Math.min(99, Math.max(65, Math.round(dna.contributors * 4 + 40)));
    const swarmVal = genome.ratings?.swarm || Math.min(99, Math.max(60, Math.round(dna.issues * 1.5 + 40)));
    const armorVal = genome.ratings?.armor || Math.min(99, Math.max(75, Math.round(dna.pullRequests * 1.2 + 55)));
    const attackVal = genome.ratings?.attack || Math.min(99, Math.max(70, Math.round(dna.commits / 30 + 45)));

    return `
      <div class="hangar-master-layout">

        <!-- ==============================================
             TOP DECK: 3 MAIN COMBAT COLUMNS
             ============================================== -->
        <div class="hangar-top-deck-grid">

          <!-- 1. LEFT COLUMN: MIS NAVES (8 FLEET SHIPS) -->
          <aside class="hangar-left-col">
            <div class="col-section-header">
              <span>${t.hangarMyFleet} (${this.store.SKINS.length})</span>
            </div>
            <div class="fleet-cards-scroll-list">
              ${fleetVerticalHtml}
            </div>

            <!-- NAVE PROCEDURAL TOGGLE CARD -->
            <div class="procedural-ship-box ${this.isProceduralActive ? 'equipped' : ''}" id="btnProceduralShip">
              <div class="proc-icon-box">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00e5ff" stroke-width="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
              <div class="proc-text-col">
                <span class="proc-title">${t.hangarProceduralShip}</span>
                <span class="proc-tag">DNA &rarr; ${t.hangarTargetRepo}</span>
                <span class="proc-sub">/${Security.escapeHtml(dna.name)}</span>
              </div>
            </div>
          </aside>

          <!-- 2. CENTER COLUMN: 3D HOLOGRAPHIC STAGE & SPECS -->
          <section class="hangar-center-col">
            <!-- Active Ship Header Line -->
            <div class="center-ship-header">
              <div class="ship-hex-badge">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00e5ff" stroke-width="2">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                  <circle cx="12" cy="12" r="3" fill="#00e5ff"></circle>
                </svg>
              </div>
              <div class="center-title-col">
                <div class="center-ship-name">${this.isProceduralActive ? `PROCEDURAL // ${Security.escapeHtml(dna.name.toUpperCase())}` : Security.escapeHtml(activeSkin.name)}</div>
                <div class="center-ship-class">${this.isProceduralActive ? t.hangarProceduralDesc : Security.escapeHtml(activeSkin.classTag)}</div>
              </div>
              <div class="center-level-badge">
                <span class="lvl-txt">${t.profileClearance} ${prof.level}</span>
                <div class="lvl-pips">
                  <span class="pip filled"></span>
                  <span class="pip filled"></span>
                  <span class="pip filled"></span>
                  <span class="pip filled"></span>
                  <span class="pip filled"></span>
                  <span class="pip filled"></span>
                </div>
              </div>
            </div>

            <!-- Main Stage & Specs Side-by-Side -->
            <div class="holo-stage-and-specs-row">
              <!-- 3D Platform Viewport with Left/Right Chevrons -->
              <div class="holo-platform-viewport">
                <button class="stage-chevron-btn left" id="btnPrevShip" title="Nave anterior">&lt;</button>
                <canvas id="lobbyShipCanvas" width="480" height="260" class="holo-stage-canvas"></canvas>
                <button class="stage-chevron-btn right" id="btnNextShip" title="Siguiente nave">&gt;</button>
              </div>

              <!-- Side Specs & Special Ability Box -->
              <div class="ship-specs-sidebar">
                <div class="telemetry-specs-group">
                  <div class="spec-stat-row">
                    <div class="spec-label-line">
                      <span class="spec-name">${t.hangarArmor}</span>
                      <span class="spec-val">${armor10}/10</span>
                    </div>
                    ${renderPips(armor10, 'cyan')}
                  </div>

                  <div class="spec-stat-row">
                    <div class="spec-label-line">
                      <span class="spec-name">${t.hangarSpeed}</span>
                      <span class="spec-val">${speed10}/10</span>
                    </div>
                    ${renderPips(speed10, 'cyan-bright')}
                  </div>

                  <div class="spec-stat-row">
                    <div class="spec-label-line">
                      <span class="spec-name">${t.hangarFireRate}</span>
                      <span class="spec-val">${cadence10}/10</span>
                    </div>
                    ${renderPips(cadence10, 'pink')}
                  </div>

                  <div class="spec-stat-row">
                    <div class="spec-label-line">
                      <span class="spec-name">${t.hangarShield}</span>
                      <span class="spec-val">${shield10}/10</span>
                    </div>
                    ${renderPips(shield10, 'orange')}
                  </div>
                </div>

                <!-- Habilidad Especial Card -->
                <div class="special-ability-card">
                  <div class="ability-card-title">${t.hangarSpecialAbility} [${Security.escapeHtml(activeSkin.ability.triggerKey)}]</div>
                  <div class="ability-content-row">
                    <div class="ability-icon-circle">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#00e5ff" stroke-width="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div class="ability-text-block">
                      <div class="ability-name">${Security.escapeHtml(activeSkin.ability.name)}</div>
                      <div class="ability-desc">${Security.escapeHtml(activeSkin.ability.description)}</div>
                    </div>
                  </div>
                  <button class="ability-detail-btn" id="btnAbilityDetail">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>${Security.escapeHtml(diagnostics.summary)}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. RIGHT COLUMN: BOSS ENCOUNTER & QUICK DOSSIER -->
          <aside class="hangar-right-col">
            <!-- Top Card: Próximo Encuentro Boss -->
            <div class="boss-encounter-card">
              <div class="boss-card-top-header">
                <span class="boss-header-label">${t.hangarNextEncounter}</span>
                <span class="boss-type-badge">THREAT ${threatVal}</span>
              </div>

              <div class="boss-title-block">
                <div class="boss-card-title">${Security.escapeHtml(archetypeData.title)}</div>
                <div class="boss-canonical-slug">/${Security.escapeHtml(dna.name)}</div>
              </div>

              <!-- Boss Canvas Portrait -->
              <div class="boss-portrait-box">
                <canvas id="bossPortraitCanvas" width="260" height="95" class="boss-canvas-elem"></canvas>
              </div>

              <!-- Archetype Tags -->
              <div class="boss-tags-row">
                <span class="tag-pill archetype">${t.hangarArchetype} ${Security.escapeHtml(archetypeData.codeNumber)}</span>
                <span class="tag-pill mutation">${Security.escapeHtml(mutation)}</span>
                <span class="tag-pill language">${Security.escapeHtml(dna.primaryLanguage.toUpperCase())} HEAVY</span>
              </div>

              <!-- Boss Concept Quote -->
              <div class="boss-concept-quote">
                "${Security.escapeHtml(archetypeData.conceptQuote)}"
              </div>

              <div style="display: flex; gap: 4px; margin-top: 2px;">
                <button class="boss-info-full-btn" id="btnInspectGenome" style="flex: 1;">
                  <div class="btn-icon-label-group">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6"/>
                    </svg>
                    <span>${t.hangarGenome}</span>
                  </div>
                  <span class="chevron-arrow">&gt;</span>
                </button>
                <button class="boss-info-full-btn" id="btnHangarCodex" style="flex: 1; border-color: rgba(244, 63, 94, 0.4); color: #f43f5e;">
                  <div class="btn-icon-label-group">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    <span>${t.hangarCodex}</span>
                  </div>
                  <span class="chevron-arrow">&gt;</span>
                </button>
              </div>
            </div>

            <!-- Bottom Card: Boss Genome Quick Spec -->
            <div class="boss-genome-card">
              <div class="genome-header-line">
                <span class="genome-title">${t.hangarTacticalMatrix}</span>
                <span class="genome-seed-chip">SEED #${Security.escapeHtml(genome.seed)}</span>
              </div>

              <!-- 4 Chunky Matrix Bars -->
              <div class="genome-ratings-grid">
                <div class="g-rating-row">
                  <div class="g-rating-header">
                    <span class="g-lbl">${t.hangarComplexity}</span>
                    <span class="g-val cyan">${complexityVal}%</span>
                  </div>
                  <div class="g-track"><div class="g-fill cyan" style="width: ${complexityVal}%;"></div></div>
                </div>

                <div class="g-rating-row">
                  <div class="g-rating-header">
                    <span class="g-lbl">${t.hangarSwarm}</span>
                    <span class="g-val green">${swarmVal}%</span>
                  </div>
                  <div class="g-track"><div class="g-fill green" style="width: ${swarmVal}%;"></div></div>
                </div>

                <div class="g-rating-row">
                  <div class="g-rating-header">
                    <span class="g-lbl">${t.hangarArmor}</span>
                    <span class="g-val orange">${armorVal}%</span>
                  </div>
                  <div class="g-track"><div class="g-fill orange" style="width: ${armorVal}%;"></div></div>
                </div>

                <div class="g-rating-row">
                  <div class="g-rating-header">
                    <span class="g-lbl">${t.hangarAttack}</span>
                    <span class="g-val pink">${attackVal}%</span>
                  </div>
                  <div class="g-track"><div class="g-fill pink" style="width: ${attackVal}%;"></div></div>
                </div>
              </div>

              <button class="inspect-genome-cta-btn" id="btnHangarDirectives">
                <div class="btn-icon-label-group">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>${t.hangarDirectivesBounties} (3)</span>
                </div>
                <span class="chevron-arrow">&gt;</span>
              </button>
            </div>
          </aside>

        </div>

        <!-- ==============================================
             BOTTOM DECK: HERO DEPLOY ACTION & UTILITY BAR
             ============================================== -->
        <div class="hangar-bottom-deck-row" style="height: auto; display: flex; gap: 8px; align-items: stretch;">
          <!-- Giant Hero Deploy Button -->
          <button class="deploy-hero-action-btn" id="btnDominantStartMission">
            <div class="deploy-btn-inner">
              <span class="deploy-play-icon">&#9654;</span>
              <div class="deploy-text-block">
                <span class="deploy-title-main">${t.hangarDeployBattle}</span>
                <span class="deploy-sub-meta">${Security.escapeHtml(archetypeData.title)} // ${t.hangarThreatLevel}: ${threatVal}/100 // ${Security.escapeHtml(dna.primaryLanguage.toUpperCase())} HEAVY</span>
              </div>
            </div>
            <div class="recommended-ship-chip">${t.hangarRecommendedShip}: ${this.isProceduralActive ? 'PROCEDURAL' : Security.escapeHtml(activeSkin.name)}</div>
          </button>

          <!-- Quick Actions Bar -->
          <div class="hangar-quick-actions-bar">
            <button class="quick-action-pill-btn" id="btnQuickDirectives" title="Directivas de misión">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>${t.hangarBriefing.split(' ')[0] || 'DIRECTIVAS'}</span>
            </button>
            <button class="quick-action-pill-btn magenta" id="btnQuickCodex" title="Base de datos Codex">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              <span>${t.hangarCodex}</span>
            </button>
            <button class="quick-action-pill-btn" id="btnQuickStore" title="Tienda de mejoras">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>${t.tabStore}</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 2: PLAY (MISIÓN) - TACTICAL WAR ROOM
     ---------------------------------------------------- */
  private renderPlayView(): string {
    const dna = this.getSelectedDNA();
    const bossBlueprint = BossGenerator.generateFromDNA(dna);
    const archetypeData = bossBlueprint.archetypeData;
    const activeSkin = this.store.getActiveSkin();
    const prof = this.store.profile;
    const threatVal = bossBlueprint.threatIndex || Math.min(99, Math.max(70, Math.round(dna.threatLevel * 0.95 + 10)));
    const t = I18n.getInstance().t;

    return `
      <div class="lobby-subview-wrapper tactical-mission-subview">
        <!-- 1. Top War Room Banner & Radar Telemetry -->
        <div class="tactical-deck-header">
          <div class="tactical-deck-title-col">
            <div class="tactical-badge-strip">
              <span class="tac-badge cyan"><span class="live-dot-pulse cyan"></span> SECTOR DE COMBATE SUB-ORBITAL</span>
              <span class="tac-badge orange">NIVEL DE AMENAZA: ${threatVal}/100 [CRÍTICO]</span>
              <span class="tac-badge purple">OP-HEX // ${Security.escapeHtml(dna.name.toUpperCase())}</span>
            </div>
            <h2 class="tactical-headline">CENTRO DE OPERACIONES TÁCTICAS & DESPLIEGUE</h2>
            <p class="tactical-subheadline">Configura los parámetros de inserción orbital, inspecciona el vector de avance de oleadas y ejecuta las operaciones de combate en el repositorio.</p>
          </div>

          <div class="tactical-actions-top">
            <button class="tactical-quick-btn terminal-style" id="btnOpenAdvancedTerminal" title="Abrir terminal BIOS de Git">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              <span>TERMINAL BIOS</span>
            </button>
            <button class="tactical-quick-btn repo-style" id="btnTacSwitchRepo" title="Cambiar repositorio objetivo">
              <span>REPO: /${Security.escapeHtml(dna.name)}</span>
            </button>
          </div>
        </div>

        <!-- 2. Split Workspace: Left Radar & Insertion Vector / Right 4 Operation Modes -->
        <div class="tactical-operations-grid">
          <!-- LEFT PANEL: TACTICAL ORBITAL RADAR & WAVE TELEMETRY -->
          <div class="tactical-radar-card">
            <div class="tac-card-header">
              <div class="tac-card-title-group">
                <span class="tac-section-num">01 //</span>
                <span class="tac-section-title">VECTOR DE INSERCIÓN & TRAYECTORIA DE OLEADAS</span>
              </div>
              <span class="tac-status-tag active">RADAR 60 FPS ACTIVO</span>
            </div>

            <!-- Radar Canvas Element -->
            <div class="tactical-radar-canvas-box">
              <canvas id="tacticalMissionRadarCanvas" width="340" height="170" class="tactical-radar-canvas"></canvas>
              <div class="radar-scanlines"></div>
              <div class="radar-target-reticle">OBJETIVO: /${Security.escapeHtml(dna.name)}</div>
            </div>

            <!-- Wave Sequence Telemetry Row -->
            <div class="wave-sequence-telemetry">
              <div class="seq-node">
                <div class="seq-step-badge green">W1</div>
                <div class="seq-info">
                  <span class="seq-name">COMMITS RECON</span>
                  <span class="seq-target">${Math.min(30, Math.round(dna.commits / 15 + 10))} Cazas Hex</span>
                </div>
              </div>
              <div class="seq-arrow">&rarr;</div>
              <div class="seq-node">
                <div class="seq-step-badge cyan">W2</div>
                <div class="seq-info">
                  <span class="seq-name">ASALTO PRs</span>
                  <span class="seq-target">${Math.min(8, Math.round(dna.pullRequests / 5 + 3))} Cruceros</span>
                </div>
              </div>
              <div class="seq-arrow">&rarr;</div>
              <div class="seq-node">
                <div class="seq-step-badge yellow">W3</div>
                <div class="seq-info">
                  <span class="seq-name">ENJAMBRE ISSUES</span>
                  <span class="seq-target">${Math.min(12, Math.round(dna.issues / 3 + 4))} Avispas</span>
                </div>
              </div>
              <div class="seq-arrow">&rarr;</div>
              <div class="seq-node boss">
                <div class="seq-step-badge red">BOSS</div>
                <div class="seq-info">
                  <span class="seq-name">${Security.escapeHtml(archetypeData.title.split('//')[0].trim())}</span>
                  <span class="seq-target">${archetypeData.codeNumber} // HP ${bossBlueprint.maxHp}</span>
                </div>
              </div>
            </div>

            <!-- Pilot Combat Status Line -->
            <div class="pilot-mission-readiness-strip">
              <div class="p-readiness-col">
                <span class="r-lbl">NAVE ASIGNADA:</span>
                <span class="r-val cyan">${Security.escapeHtml(activeSkin.name)}</span>
              </div>
              <div class="p-readiness-col">
                <span class="r-lbl">HABILIDAD:</span>
                <span class="r-val yellow">${Security.escapeHtml(activeSkin.ability.name)} [${activeSkin.ability.triggerKey}]</span>
              </div>
              <div class="p-readiness-col">
                <span class="r-lbl">DEFENSA:</span>
                <span class="r-val green">${prof.startingShield ? 'ESCUDO ACTIVO' : 'DEFLECTOR BASE'}</span>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL: 4 COMBAT MODES GRID -->
          <div class="tactical-modes-grid">
            <!-- MODE 1: CAMPAÑA DE REPOSITORIO (HERO DECK) -->
            <div class="tac-mode-card hero-campaign" id="playModeRepoCard">
              <div class="tac-mode-top-row">
                <div class="tac-mode-badge-pill cyan">MODO PRINCIPAL // CAMPAÑA</div>
                <span class="tac-mode-hotkey">[ENTER]</span>
              </div>
              <div class="tac-mode-headline">CAMPAÑA DE REPOSITORIO // ${Security.escapeHtml(dna.name.toUpperCase())}</div>
              <div class="tac-mode-stats-pills">
                <span class="m-pill"><b>${dna.commits}</b> COMMITS</span>
                <span class="m-pill"><b>${dna.pullRequests}</b> PRs</span>
                <span class="m-pill"><b>${dna.issues}</b> ISSUES</span>
                <span class="m-pill highlight" style="color: ${bossBlueprint.languageColor}; border-color: ${bossBlueprint.languageColor};">${Security.escapeHtml(dna.primaryLanguage.toUpperCase())}</span>
              </div>
              <div class="tac-mode-desc">
                Enfrenta la estructura procedural del repositorio. Las oleadas de invasores y el Code Boss <b>${Security.escapeHtml(archetypeData.title)}</b> son generados directamente por la telemetría real del código.
              </div>
              <button class="tac-launch-btn cyan" id="btnLaunchRepoMode">
                <span class="tac-play-triangle">&#9654;</span>
                <span>DESPLEGAR EN REPOSITORIO [ENTER]</span>
              </button>
            </div>

            <!-- MODE 2: PROFILE ARCADE -->
            <div class="tac-mode-card" id="playModeProfileCard">
              <div class="tac-mode-top-row">
                <div class="tac-mode-badge-pill green">ARCADE CLÁSICO</div>
                <span class="tac-mode-hotkey">[A]</span>
              </div>
              <div class="tac-mode-headline">PROFILE ARCADE // @luisrodriguez-rgb</div>
              <div class="tac-mode-desc">
                Oleadas ilimitadas de invasores con dificultad incremental exponencial basada en la actividad global de tu perfil de desarrollador. Ideal para records de puntuación.
              </div>
              <div class="tac-mode-footer">
                <button class="tac-launch-btn green" id="btnLaunchProfileMode">
                  <span>INICIAR PROFILE ARCADE [A]</span>
                </button>
              </div>
            </div>

            <!-- MODE 3: PROTOCOLO DE CAOS -->
            <div class="tac-mode-card chaos-border" id="playModeChaosCard">
              <div class="tac-mode-top-row">
                <div class="tac-mode-badge-pill red">HARDCORE // PESADILLA</div>
                <span class="tac-mode-hotkey">[C]</span>
              </div>
              <div class="tac-mode-headline">PROTOCOLO DE CAOS ABSOLUTO</div>
              <div class="tac-mode-desc">
                Sobrecarga de 9,999 commits, 482 PRs y 731 issues. Sin dependencias externas de red. Cadencia de fuego letal y balas enemigas en enjambre denso.
              </div>
              <div class="tac-mode-footer">
                <button class="tac-launch-btn red" id="btnLaunchChaosMode">
                  <span>[!] SOBRECARGA CAOS [C] [!]</span>
                </button>
              </div>
            </div>

            <!-- MODE 4: CITADEL UNIVERSE -->
            <div class="tac-mode-card citadel-border" id="playModeCitadelCard">
              <div class="tac-mode-top-row">
                <div class="tac-mode-badge-pill purple">GAUNTLET // ARQUITECTURA</div>
                <span class="tac-mode-hotkey">[U]</span>
              </div>
              <div class="tac-mode-headline">CODEBASE.UNIVERSE CITADEL</div>
              <div class="tac-mode-desc">
                Defiende los 8 biomas arquitectónicos del software frente a God-Class Monoliths y Tarjan Cyclic Wormholes con enlace neural Codebase-Memory-MCP.
              </div>
              <div class="tac-mode-footer">
                <button class="tac-launch-btn purple" id="btnLaunchCitadelMode">
                  <span>DEFENDER CIUDADELA [U]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 3: PROFILE
     ---------------------------------------------------- */
  private renderProfileView(): string {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();
    const nextRankXp = (prof.level + 1) * 2000;
    const xpPct = Math.min(100, Math.round((prof.totalXp / nextRankXp) * 100));
    const t = I18n.getInstance().t;

    return `
      <div class="lobby-subview-wrapper">
        <div class="subview-header-row">
          <span class="subview-headline">${t.profileDossierTitle}</span>
          <span class="subview-subheadline">${t.profileCallSign}: @luisrodriguez-rgb</span>
        </div>

        <div class="profile-layout-split">
          <div class="profile-left-dossier">
            <div class="pilot-badge-header">
              <img src="https://github.com/luisrodriguez-rgb.png" class="pilot-img-avatar" alt="Avatar" />
              <div>
                <div class="pilot-name-callsign">LUIS RODRIGUEZ // @luisrodriguez-rgb</div>
                <div class="pilot-rank-txt">NIVEL ${prof.level} &bull; ${Security.escapeHtml(prof.rankName.toUpperCase())}</div>
              </div>
            </div>

            <div class="profile-xp-meter">
              <div class="xp-label-line">
                <span>PROGRESO DE RANGO:</span>
                <span class="text-cyan">${prof.totalXp.toLocaleString()} / ${nextRankXp.toLocaleString()} EXP (${xpPct}%)</span>
              </div>
              <div class="xp-bar-slot"><div class="xp-bar-core" style="width: ${xpPct}%;"></div></div>
            </div>

            <div class="equipped-ship-dossier-card">
              <div class="eq-label">NAVE ACTIVA: ${Security.escapeHtml(activeSkin.name)}</div>
              <div class="eq-ability">${Security.escapeHtml(activeSkin.ability.name)} - ${Security.escapeHtml(activeSkin.ability.description)}</div>
            </div>
          </div>

          <div class="profile-right-stats">
            <div class="stats-box-title">ESTADO DE HARDWARE</div>
            <div class="stat-p-row"><span>CADENCIA DE DISPARO:</span> <b>NIVEL ${prof.fireRateLevel} / 5</b></div>
            <div class="stat-p-row"><span>PROPULSORES:</span> <b>NIVEL ${prof.thrusterLevel} / 5</b></div>
            <div class="stat-p-row"><span>ESCUDO DEFLECTOR:</span> <b>${prof.startingShield ? 'ONLINE' : 'OFFLINE'}</b></div>
            <div class="stat-p-row"><span>LÁSER CUÁNTICO:</span> <b>${prof.quantumPiercing ? 'ONLINE' : 'OFFLINE'}</b></div>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 4: STATS
     ---------------------------------------------------- */
  private renderStatsView(): string {
    const prof = this.store.profile;
    const highScore = parseInt(localStorage.getItem('git_invaders_high_score') || '0', 10);
    const t = I18n.getInstance().t;

    return `
      <div class="lobby-subview-wrapper">
        <div class="subview-header-row">
          <span class="subview-headline">${t.statsTitle} // TELEMETRÍA</span>
          <span class="subview-subheadline">ARCHIVOS DE COMBATE Y ESTADÍSTICAS</span>
        </div>

        <div class="stats-overview-grid">
          <div class="stat-overview-card">
            <span class="stat-num cyan">${highScore.toLocaleString()}</span>
            <span class="stat-lbl">${t.statsHighScore}</span>
          </div>
          <div class="stat-overview-card">
            <span class="stat-num purple">${prof.totalXp.toLocaleString()}</span>
            <span class="stat-lbl">EXPERIENCIA TOTAL</span>
          </div>
          <div class="stat-overview-card">
            <span class="stat-num gold">${prof.availableXp.toLocaleString()}</span>
            <span class="stat-lbl">ESTRELLAS DISPONIBLES</span>
          </div>
          <div class="stat-overview-card">
            <span class="stat-num cyan">${prof.level}</span>
            <span class="stat-lbl">NIVEL DE PILOTO</span>
          </div>
          <div class="stat-overview-card">
            <span class="stat-num green">${prof.unlockedSkins.length} / ${this.store.SKINS.length}</span>
            <span class="stat-lbl">NAVES EN HANGAR</span>
          </div>
          <div class="stat-overview-card">
            <span class="stat-num pink">${(prof.bossCodex || []).length} / 10</span>
            <span class="stat-lbl">JEFES DERROTADOS</span>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 5: SETTINGS
     ---------------------------------------------------- */
  private renderSettingsView(): string {
    const currentTheme = this.themeManager.currentTheme;
    const t = I18n.getInstance().t;
    const i18n = I18n.getInstance();
    const isMuted = this.audioEngine.isMuted;
    const currentVol = Math.round(this.audioEngine.masterVolume * 100);

    return `
      <div class="lobby-subview-wrapper">
        <div class="subview-header-row">
          <span class="subview-headline">${t.settingsTitle}</span>
          <span class="subview-subheadline">CONFIGURACIÓN DE AUDIO, PANTALLA Y CONTROLES</span>
        </div>

        <div class="settings-grid-layout">
          <div class="setting-item-box">
            <label>TEMA VISUAL:</label>
            <select class="setting-select-ctrl" id="settingsThemeSelect">
              ${(Object.keys(THEMES) as ThemeId[]).map((id) => `
                <option value="${id}" ${id === currentTheme.id ? 'selected' : ''}>${THEMES[id].name.toUpperCase()}</option>
              `).join('')}
            </select>
          </div>

          <div class="setting-item-box">
            <label>IDIOMA:</label>
            <select class="setting-select-ctrl" id="settingsLangSelect">
              <option value="es" ${i18n.currentLang === 'es' ? 'selected' : ''}>ESPAÑOL [ES]</option>
              <option value="en" ${i18n.currentLang === 'en' ? 'selected' : ''}>ENGLISH [EN]</option>
            </select>
          </div>

          <div class="setting-item-box">
            <label>ESTADO DE AUDIO:</label>
            <button class="settings-audio-btn ${isMuted ? 'muted' : ''}" id="settingsMuteToggleBtn">
              ${isMuted ? '[ AUDIO SILENCIADO ]' : '[ AUDIO ACTIVO ]'}
            </button>
          </div>

          <div class="setting-item-box">
            <label>VOLUMEN MASTER:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input type="range" class="setting-range-slider" id="settingsVolumeRange" min="0" max="100" value="${currentVol}" />
              <span id="settingsVolLabel" style="font-size: 0.75rem; font-weight: 800; width: 40px;">${currentVol}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
     CANVAS & ANIMATION ENGINE
     ---------------------------------------------------- */
  private initCanvases(): void {
    this.shipCanvas = this.container.querySelector('#lobbyShipCanvas') as HTMLCanvasElement;
    if (this.shipCanvas) {
      this.shipCtx = this.shipCanvas.getContext('2d');
    }
    this.bossCanvas = this.container.querySelector('#bossPortraitCanvas') as HTMLCanvasElement;
    if (this.bossCanvas) {
      this.bossCtx = this.bossCanvas.getContext('2d');
    }
    this.radarCanvas = this.container.querySelector('#tacticalMissionRadarCanvas') as HTMLCanvasElement;
    if (this.radarCanvas) {
      this.radarCtx = this.radarCanvas.getContext('2d');
    }
  }

  private startAnimations(): void {
    this.stopAnimations();
    const renderLoop = () => {
      this.animTime += 0.025;
      if (this.activeTab === 'HANGAR') {
        this.drawHoloShipPlatform();
        this.drawBossPortrait();
      } else if (this.activeTab === 'PLAY') {
        this.drawTacticalMissionRadar();
      }
      this.animFrameId = requestAnimationFrame(renderLoop);
    };
    this.animFrameId = requestAnimationFrame(renderLoop);
  }

  private stopAnimations(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Draws the stunning 3D isometric glowing circular hangar landing platform
   */
  private drawHoloShipPlatform(): void {
    if (!this.shipCanvas || !this.shipCtx) return;
    const ctx = this.shipCtx;
    const w = this.shipCanvas.width;
    const h = this.shipCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const platformY = h * 0.74;
    const t = this.animTime;
    const dna = this.getSelectedDNA();

    // 1. Cinematic Hangar Radial Lighting
    const radialGrad = ctx.createRadialGradient(centerX, platformY - 20, 10, centerX, platformY - 20, w * 0.45);
    radialGrad.addColorStop(0, 'rgba(0, 180, 255, 0.2)');
    radialGrad.addColorStop(0.5, 'rgba(0, 90, 200, 0.06)');
    radialGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Perspective Floor Grid Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = -w * 0.5; x <= w * 1.5; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(centerX + (x - centerX) * 0.35, platformY - 20);
      ctx.stroke();
    }
    ctx.restore();

    // 3. 3D Glowing Circular Platform Discs
    const radiusX = Math.min(160, w * 0.36);
    const radiusY = Math.min(42, h * 0.16);

    // Outer Glow Disc
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, platformY, radiusX + 8, radiusY + 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner Neon Ring with rotating segment dashes
    ctx.beginPath();
    ctx.ellipse(centerX, platformY, radiusX * 0.78, radiusY * 0.78, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 8]);
    ctx.lineDashOffset = -t * 20;
    ctx.stroke();
    ctx.setLineDash([]);

    // Core Center Pad
    ctx.beginPath();
    ctx.ellipse(centerX, platformY, radiusX * 0.42, radiusY * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();

    // 4. Draw Ship Hovering Above Platform with Animated Thrusters
    const activeSkin = this.store.getActiveSkin();
    const shipW = 116;
    const shipH = 84;
    const shipX = centerX - shipW / 2;
    const shipY = platformY - radiusY - 38 + Math.sin(t * 2.2) * 5;

    // Animated Thruster Plumes
    ctx.save();
    const flameH = 26 + Math.sin(t * 18) * 8;
    const plumeGrad = ctx.createLinearGradient(centerX, shipY + shipH * 0.7, centerX, shipY + shipH * 0.7 + flameH);
    plumeGrad.addColorStop(0, '#ffffff');
    plumeGrad.addColorStop(0.25, activeSkin.hullColor || '#00e5ff');
    plumeGrad.addColorStop(0.7, 'rgba(0, 140, 255, 0.4)');
    plumeGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');

    // Left Thruster
    ctx.fillStyle = plumeGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - 18, shipY + shipH * 0.72);
    ctx.lineTo(centerX - 14, shipY + shipH * 0.72 + flameH);
    ctx.lineTo(centerX - 10, shipY + shipH * 0.72);
    ctx.fill();

    // Right Thruster
    ctx.beginPath();
    ctx.moveTo(centerX + 10, shipY + shipH * 0.72);
    ctx.lineTo(centerX + 14, shipY + shipH * 0.72 + flameH);
    ctx.lineTo(centerX + 18, shipY + shipH * 0.72);
    ctx.fill();
    ctx.restore();

    // Ship Vector Geometry
    if (this.isProceduralActive) {
      const repoDesign = ShipComposer.generateFromRepoDNA(dna);
      ShipComposer.render(
        ctx,
        centerX,
        shipY + shipH / 2,
        shipW,
        shipH,
        repoDesign,
        {
          time: t,
          hpRatio: 1.0,
          hasShield: false, // Pristine inspect view without shield obscuring hull
          isOverdrive: false,
          isThrusting: true,
        },
        {
          lod: 0,
          isHovering: true,
        }
      );
    } else {
      Sprites.drawPlayer(
        ctx,
        shipX,
        shipY,
        shipW,
        shipH,
        false, // Pristine inspect view without shield obscuring hull
        false,
        activeSkin.hullColor,
        activeSkin.glowColor,
        t,
        1.0,
        true,
        activeSkin.id,
        0,
        false,
        0
      );
    }
  }

  /**
   * Draws the Boss Portrait Canvas matching active repo DNA archetype
   */
  private drawBossPortrait(): void {
    if (!this.bossCanvas || !this.bossCtx) return;
    const ctx = this.bossCtx;
    const w = this.bossCanvas.width;
    const h = this.bossCanvas.height;

    ctx.clearRect(0, 0, w, h);

    const dna = this.getSelectedDNA();
    const bossBlueprint = BossGenerator.generateFromDNA(dna);
    const archetypeData = bossBlueprint.archetypeData;
    const t = this.animTime;

    // Ambient Boss Backlight
    const themeColor = dna.accentColor || '#10b981';
    const grad = ctx.createRadialGradient(w / 2, h / 2, 6, w / 2, h / 2, w * 0.45);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    grad.addColorStop(1, 'rgba(5, 10, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Digital Grid
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
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

    // Render Boss Archetype with generous proportion
    const bossW = 150;
    const bossH = 92;
    const bossX = w / 2 - bossW / 2;
    const bossY = h / 2 - bossH / 2 + Math.sin(t * 1.8) * 3;

    Sprites.drawBoss(
      ctx,
      bossX,
      bossY,
      bossW,
      bossH,
      2,
      t,
      themeColor,
      archetypeData.archetype
    );
  }

  /**
   * Draws the animated tactical mission radar & wave insertion path
   */
  private drawTacticalMissionRadar(): void {
    if (!this.radarCanvas || !this.radarCtx) return;
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;
    const t = this.animTime;
    const dna = this.getSelectedDNA();

    ctx.clearRect(0, 0, w, h);

    // 1. Dark CRT Cyber Space Backdrop
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.65);
    bgGrad.addColorStop(0, 'rgba(0, 35, 65, 0.45)');
    bgGrad.addColorStop(0.7, 'rgba(4, 12, 28, 0.88)');
    bgGrad.addColorStop(1, 'rgba(2, 6, 16, 0.96)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Coordinate Grid Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Rotating Radar Sweep Beam & Concentric Distance Rings
    const rx = w * 0.22;
    const ry = h * 0.52;
    const maxRadius = Math.min(w * 0.2, h * 0.44);

    for (let r = 1; r <= 3; r++) {
      ctx.beginPath();
      ctx.arc(rx, ry, (maxRadius / 3) * r, 0, Math.PI * 2);
      ctx.strokeStyle = r === 3 ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.14)';
      ctx.stroke();
    }

    // Sweep Angle
    const sweepAngle = (t * 2.4) % (Math.PI * 2);
    const sweepGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, maxRadius);
    sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
    sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.arc(rx, ry, maxRadius, sweepAngle - 0.45, sweepAngle);
    ctx.closePath();
    ctx.fill();

    // Radar Center Crosshair
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(rx - 2, ry - 2, 4, 4);

    // 4. Orbital Wave Insertion Trajectory (Curved Path)
    const p0 = { x: rx, y: ry };
    const p1 = { x: w * 0.45, y: h * 0.28 };
    const p2 = { x: w * 0.68, y: h * 0.72 };
    const p3 = { x: w * 0.88, y: h * 0.38 };

    // Animated dotted trajectory
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x - 15, p1.y, p1.x, p1.y, p1.x, p1.y);
    ctx.bezierCurveTo(p2.x - 15, p2.y, p2.x, p2.y, p2.x, p2.y);
    ctx.bezierCurveTo(p3.x - 15, p3.y, p3.x, p3.y, p3.x, p3.y);
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.lineDashOffset = -t * 24;
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // 5. Waypoints along trajectory
    const nodes = [
      { pt: p0, label: 'INSERCIÓN', color: '#00e5ff' },
      { pt: p1, label: 'W1: RECON', color: '#10b981' },
      { pt: p2, label: 'W2: PR FLANK', color: '#38bdf8' },
      { pt: p3, label: 'BOSS CORE', color: '#f43f5e' },
    ];

    nodes.forEach((n, idx) => {
      const pulse = Math.sin(t * 4 + idx) * 3 + 4;
      ctx.beginPath();
      ctx.arc(n.pt.x, n.pt.y, pulse + 2, 0, Math.PI * 2);
      ctx.fillStyle = n.color === '#f43f5e' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(0, 229, 255, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.pt.x, n.pt.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      // Waypoint text
      ctx.font = '8px monospace';
      ctx.fillStyle = n.color;
      ctx.fillText(n.label, n.pt.x - 22, n.pt.y - 7);
    });

    // 6. Coordinates & Sub-orbital HUD overlay
    ctx.fillStyle = 'rgba(0, 229, 255, 0.75)';
    ctx.font = '7.5px monospace';
    ctx.fillText(`COORDS: LAT 37°46'N // LNG 122°24'W`, 8, 12);
    ctx.fillText(`ALT: 382.4 KM // VEL: 7.66 KM/S`, 8, 22);
    ctx.fillText(`TARGET: /${dna.name.toUpperCase()}`, w - 160, 12);

    ctx.restore();
  }


  /**
   * Renders mini ship thumbnails for left roster and horizontal strip
   */
  private drawMiniThumbs(): void {
    const thumbs = this.container.querySelectorAll('canvas[data-skin-id]') as NodeListOf<HTMLCanvasElement>;
    thumbs.forEach((canvas) => {
      const skinId = canvas.getAttribute('data-skin-id');
      if (!skinId) return;
      const skin = this.store.SKINS.find((s) => s.id === skinId);
      if (!skin) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      Sprites.drawPlayer(
        ctx,
        3,
        2,
        w - 6,
        h - 4,
        false,
        false,
        skin.hullColor,
        skin.glowColor,
        0,
        1.0,
        false,
        skin.id,
        0,
        false,
        0
      );
    });
  }

  /* ----------------------------------------------------
     EVENT BINDINGS & USER INTERACTIONS
     ---------------------------------------------------- */
  private bindEvents(): void {
    // 1. Top Navigation Pills
    const navHangar = this.container.querySelector('#navHangarBtn');
    navHangar?.addEventListener('click', () => {
      this.activeTab = 'HANGAR';
      SFX.playLaser('player');
      this.render();
    });

    const navPlay = this.container.querySelector('#navPlayBtn');
    navPlay?.addEventListener('click', () => {
      this.activeTab = 'PLAY';
      SFX.playLaser('player');
      this.render();
      this.stopAnimations();
    });

    const navStore = this.container.querySelector('#navStoreBtn');
    navStore?.addEventListener('click', () => {
      SFX.playPowerup();
      this.onOpenStoreCallback();
    });

    const navCodex = this.container.querySelector('#navCodexBtn');
    navCodex?.addEventListener('click', () => {
      SFX.playPowerup();
      this.codexModal?.show();
    });

    const navStats = this.container.querySelector('#navStatsBtn');
    navStats?.addEventListener('click', () => {
      this.activeTab = 'STATS';
      SFX.playLaser('player');
      this.render();
      this.stopAnimations();
    });

    const navSettings = this.container.querySelector('#navSettingsBtn');
    navSettings?.addEventListener('click', () => {
      this.activeTab = 'SETTINGS';
      SFX.playLaser('player');
      this.render();
      this.stopAnimations();
    });

    // 2. Active Repo Pill & Selector
    const repoPillBtn = this.container.querySelector('#lobbyRepoPillBtn');
    const repoSelect = this.container.querySelector('#lobbyRepoSelect') as HTMLSelectElement | null;
    repoPillBtn?.addEventListener('click', () => {
      repoSelect?.focus();
    });
    repoSelect?.addEventListener('change', (e) => {
      this.selectedRepoId = (e.target as HTMLSelectElement).value;
      SFX.playPowerup();
      this.render();
    });

    // 3. Hangar Interactivity
    if (this.activeTab === 'HANGAR') {
      // Ship Roster Clicks (Left Column & Horizontal Strip)
      const shipCards = this.container.querySelectorAll('[data-skin]');
      shipCards.forEach((card) => {
        card.addEventListener('click', () => {
          const skinId = card.getAttribute('data-skin');
          if (skinId) {
            this.isProceduralActive = false;
            this.store.equipSkin(skinId);
            SFX.playPowerup();
            this.render();
          }
        });
      });

      // Chevron Navigation Buttons (< and >)
      const btnPrev = this.container.querySelector('#btnPrevShip');
      btnPrev?.addEventListener('click', () => {
        const skins = this.store.SKINS;
        const currIdx = skins.findIndex((s) => s.id === this.store.profile.activeSkinId);
        const prevIdx = (currIdx - 1 + skins.length) % skins.length;
        this.store.equipSkin(skins[prevIdx].id);
        SFX.playLaser('player');
        this.render();
      });

      const btnNext = this.container.querySelector('#btnNextShip');
      btnNext?.addEventListener('click', () => {
        const skins = this.store.SKINS;
        const currIdx = skins.findIndex((s) => s.id === this.store.profile.activeSkinId);
        const nextIdx = (currIdx + 1) % skins.length;
        this.store.equipSkin(skins[nextIdx].id);
        SFX.playLaser('player');
        this.render();
      });

      // Procedural Ship Card
      const btnProc = this.container.querySelector('#btnProceduralShip');
      btnProc?.addEventListener('click', () => {
        this.isProceduralActive = true;
        SFX.playPowerup();
        this.render();
      });

      // Boss Info / Codex Button in Hangar
      const btnHangarCodex = this.container.querySelector('#btnHangarCodex');
      btnHangarCodex?.addEventListener('click', () => {
        SFX.playPowerup();
        this.codexModal?.show('boss_dependency_hydra');
      });

      const btnQuickCodex = this.container.querySelector('#btnQuickCodex');
      btnQuickCodex?.addEventListener('click', () => {
        SFX.playPowerup();
        this.codexModal?.show();
      });

      // Inspect Genome Button
      const btnGenome = this.container.querySelector('#btnInspectGenome');
      btnGenome?.addEventListener('click', () => {
        const dna = this.getSelectedDNA();
        const blueprint = BossGenerator.generateFromDNA(dna);
        SFX.playPowerup();
        this.modals?.showBossDnaCard(blueprint);
      });

      // Directives Buttons
      const btnDirectives = this.container.querySelector('#btnHangarDirectives');
      btnDirectives?.addEventListener('click', () => {
        const dna = this.getSelectedDNA();
        const blueprint = BossGenerator.generateFromDNA(dna);
        SFX.playPowerup();
        this.modals?.showBossBlueprint(blueprint, () => {
          this.hide();
          this.onStartGameCallback('repository', this.getSelectedDNA());
        });
      });

      const btnQuickDirectives = this.container.querySelector('#btnQuickDirectives');
      btnQuickDirectives?.addEventListener('click', () => {
        const dna = this.getSelectedDNA();
        const blueprint = BossGenerator.generateFromDNA(dna);
        SFX.playPowerup();
        this.modals?.showBossBlueprint(blueprint, () => {
          this.hide();
          this.onStartGameCallback('repository', this.getSelectedDNA());
        });
      });

      const btnQuickStore = this.container.querySelector('#btnQuickStore');
      btnQuickStore?.addEventListener('click', () => {
        SFX.playPowerup();
        this.onOpenStoreCallback();
      });

      // Ability Detail Button
      const btnAbility = this.container.querySelector('#btnAbilityDetail');
      btnAbility?.addEventListener('click', () => {
        SFX.playPowerup();
        this.onOpenStoreCallback();
      });

      // Dominant Start Mission Button
      const btnStart = this.container.querySelector('#btnDominantStartMission');
      btnStart?.addEventListener('click', () => {
        this.hide();
        this.onStartGameCallback('repository', this.getSelectedDNA());
      });
    }

    // 4. Play Subview Events
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

      const btnTacSwitch = this.container.querySelector('#btnTacSwitchRepo');
      btnTacSwitch?.addEventListener('click', () => {
        const select = this.container.querySelector('#lobbyRepoSelect') as HTMLSelectElement | null;
        select?.focus();
      });
    }

    // 5. Settings Events
    if (this.activeTab === 'SETTINGS') {
      const themeSelect = this.container.querySelector('#settingsThemeSelect') as HTMLSelectElement | null;
      themeSelect?.addEventListener('change', (e) => {
        const themeId = (e.target as HTMLSelectElement).value as ThemeId;
        this.themeManager.setTheme(themeId);
        SFX.playPowerup();
      });

      const langSelect = this.container.querySelector('#settingsLangSelect') as HTMLSelectElement | null;
      langSelect?.addEventListener('change', (e) => {
        const lang = (e.target as HTMLSelectElement).value as 'en' | 'es';
        I18n.getInstance().setLanguage(lang);
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
    }
  }
}
