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
  private animFrameId: number | null = null;
  private shipCanvas: HTMLCanvasElement | null = null;
  private shipCtx: CanvasRenderingContext2D | null = null;
  private bossCanvas: HTMLCanvasElement | null = null;
  private bossCtx: CanvasRenderingContext2D | null = null;
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
     VIEW: PILOT HANGAR DECK (PERFECT NO-OVERLAP GRID)
     ---------------------------------------------------- */
  private renderHangarView(): string {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();
    const dna = this.getSelectedDNA();
    const bossBlueprint = BossGenerator.generateFromDNA(dna);
    const archetypeData = bossBlueprint.archetypeData;
    const mutation = bossBlueprint.mutation || 'CORRUPTED';
    const genome = bossBlueprint.genome;
    const directives = bossBlueprint.directives;

    // 1. Mis Naves Vertical List (All 8 Ships)
    const fleetVerticalHtml = this.store.SKINS.map((skin) => {
      const isEquipped = prof.activeSkinId === skin.id && !this.isProceduralActive;
      return `
        <div class="fleet-ship-card ${isEquipped ? 'equipped' : ''}" data-skin="${Security.escapeHtml(skin.id)}">
          <canvas class="mini-ship-thumb" width="46" height="32" data-skin-id="${Security.escapeHtml(skin.id)}"></canvas>
          <div class="ship-info-col">
            <div class="ship-title-row">
              <span class="ship-card-name">${Security.escapeHtml(skin.name)}</span>
              ${isEquipped ? '<span class="equipped-tag-pill">EQUIPADA</span>' : ''}
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

    // Genome Ratings
    const threatVal = genome.ratings?.threat || Math.min(99, Math.max(70, Math.round(dna.threatLevel * 0.95 + 10)));
    const complexityVal = genome.ratings?.complexity || Math.min(99, Math.max(65, Math.round(dna.contributors * 4 + 40)));
    const swarmVal = genome.ratings?.swarm || Math.min(99, Math.max(60, Math.round(dna.issues * 1.5 + 40)));
    const armorVal = genome.ratings?.armor || Math.min(99, Math.max(75, Math.round(dna.pullRequests * 1.2 + 55)));
    const attackVal = genome.ratings?.attack || Math.min(99, Math.max(70, Math.round(dna.commits / 30 + 45)));
    const phasesVal = genome.phases || Math.min(5, Math.max(3, bossBlueprint.phases.length));

    return `
      <div class="hangar-master-layout">

        <!-- ==============================================
             TOP DECK: 3 MAIN COLUMNS
             ============================================== -->
        <div class="hangar-top-deck-grid">

          <!-- 1. LEFT COLUMN: MIS NAVES (8 FLEET SHIPS) -->
          <aside class="hangar-left-col">
            <div class="col-section-header">
              <span>MIS NAVES (${this.store.SKINS.length})</span>
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
                <span class="proc-title">NAVE PROCEDURAL</span>
                <span class="proc-tag">DNA &rarr; NAVE REPOSITORIO</span>
                <span class="proc-sub">Forjada de /${Security.escapeHtml(dna.name)}</span>
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
                <div class="center-ship-class">${this.isProceduralActive ? 'Nave Forjada por ADN de Código' : Security.escapeHtml(activeSkin.classTag)}</div>
              </div>
              <div class="center-level-badge">
                <span class="lvl-txt">NIVEL ${prof.level}</span>
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

            <!-- Main Stage & Specs Side-by-Side (Full Height) -->
            <div class="holo-stage-and-specs-row">
              <!-- 3D Platform Viewport with Left/Right Chevrons -->
              <div class="holo-platform-viewport">
                <button class="stage-chevron-btn left" id="btnPrevShip" title="Nave anterior">&lt;</button>
                <canvas id="lobbyShipCanvas" width="480" height="260" class="holo-stage-canvas"></canvas>
                <button class="stage-chevron-btn right" id="btnNextShip" title="Siguiente nave">&gt;</button>
              </div>

              <!-- Side Specs & Special Ability Box -->
              <div class="ship-specs-sidebar">
                <div class="spec-stat-row">
                  <div class="spec-label-line">
                    <span class="spec-name">BLINDAJE</span>
                    <span class="spec-val">${armor10}/10</span>
                  </div>
                  <div class="spec-track">
                    <div class="spec-fill cyan" style="width: ${activeSkin.stats.armor}%;"></div>
                  </div>
                </div>

                <div class="spec-stat-row">
                  <div class="spec-label-line">
                    <span class="spec-name">VELOCIDAD</span>
                    <span class="spec-val">${speed10}/10</span>
                  </div>
                  <div class="spec-track">
                    <div class="spec-fill cyan-bright" style="width: ${activeSkin.stats.speed}%;"></div>
                  </div>
                </div>

                <div class="spec-stat-row">
                  <div class="spec-label-line">
                    <span class="spec-name">CADENCIA</span>
                    <span class="spec-val">${cadence10}/10</span>
                  </div>
                  <div class="spec-track">
                    <div class="spec-fill pink" style="width: ${activeSkin.stats.fireRate}%;"></div>
                  </div>
                </div>

                <div class="spec-stat-row">
                  <div class="spec-label-line">
                    <span class="spec-name">ESCUDO</span>
                    <span class="spec-val">${shield10}/10</span>
                  </div>
                  <div class="spec-track">
                    <div class="spec-fill orange" style="width: ${activeSkin.stats.shield}%;"></div>
                  </div>
                </div>

                <!-- Habilidad Especial Card -->
                <div class="special-ability-card">
                  <div class="ability-card-title">HABILIDAD ESPECIAL</div>
                  <div class="ability-content-row">
                    <div class="ability-icon-circle">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#00e5ff" stroke-width="2">
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
                    <span>VER DETALLE EN TIENDA</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 3. RIGHT COLUMN: BOSS ENCOUNTER & GENOME -->
          <aside class="hangar-right-col">
            <!-- Top Card: Próximo Encuentro Boss -->
            <div class="boss-encounter-card">
              <div class="boss-card-top-header">
                <span class="boss-header-label">PRÓXIMO ENCUENTRO</span>
                <span class="boss-type-badge">BOSS</span>
              </div>

              <div class="boss-title-block">
                <div class="boss-card-title">${Security.escapeHtml(archetypeData.title)}</div>
                <div class="boss-canonical-slug">/${Security.escapeHtml(dna.name)}</div>
              </div>

              <!-- Boss Canvas Portrait -->
              <div class="boss-portrait-box">
                <canvas id="bossPortraitCanvas" width="260" height="110" class="boss-canvas-elem"></canvas>
              </div>

              <!-- Archetype Tags -->
              <div class="boss-tags-row">
                <span class="tag-pill archetype">ARQUETIPO ${Security.escapeHtml(archetypeData.codeNumber)}</span>
                <span class="tag-pill mutation">MUTACIÓN ${Security.escapeHtml(mutation)}</span>
                <span class="tag-pill language">LENGUAJE ${Security.escapeHtml(dna.primaryLanguage.toUpperCase())} HEAVY</span>
              </div>

              <!-- Boss Concept Quote -->
              <div class="boss-concept-quote">
                "${Security.escapeHtml(archetypeData.conceptQuote)}"
              </div>

              <button class="boss-info-full-btn" id="btnViewBossInfo">
                <div class="btn-icon-label-group">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>VER INFO COMPLETA</span>
                </div>
                <span class="chevron-arrow">&gt;</span>
              </button>
            </div>

            <!-- Bottom Card: Boss Genome -->
            <div class="boss-genome-card">
              <div class="genome-header-line">
                <span class="genome-title">BOSS GENOME</span>
                <span class="genome-seed-chip">SEED #${Security.escapeHtml(genome.seed)}</span>
              </div>

              <div class="genome-sub-identity">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#00e5ff" stroke-width="2">
                  <path d="M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6"/>
                </svg>
                <div class="genome-id-text">
                  <b>${Security.escapeHtml(archetypeData.title)}</b>
                  <span class="genome-tags-meta">// ${Security.escapeHtml(mutation)} // ${Security.escapeHtml(dna.primaryLanguage.toUpperCase())} HEAVY</span>
                </div>
              </div>

              <!-- 6 Rating Bars -->
              <div class="genome-ratings-grid">
                <div class="g-rating-row">
                  <span class="g-lbl">AMENAZA</span>
                  <div class="g-track"><div class="g-fill" style="width: ${threatVal}%;"></div></div>
                  <span class="g-val">${threatVal}</span>
                </div>
                <div class="g-rating-row">
                  <span class="g-lbl">COMPLEJIDAD</span>
                  <div class="g-track"><div class="g-fill" style="width: ${complexityVal}%;"></div></div>
                  <span class="g-val">${complexityVal}</span>
                </div>
                <div class="g-rating-row">
                  <span class="g-lbl">ENJAMBRE</span>
                  <div class="g-track"><div class="g-fill" style="width: ${swarmVal}%;"></div></div>
                  <span class="g-val">${swarmVal}</span>
                </div>
                <div class="g-rating-row">
                  <span class="g-lbl">BLINDAJE</span>
                  <div class="g-track"><div class="g-fill" style="width: ${armorVal}%;"></div></div>
                  <span class="g-val">${armorVal}</span>
                </div>
                <div class="g-rating-row">
                  <span class="g-lbl">ATAQUE</span>
                  <div class="g-track"><div class="g-fill" style="width: ${attackVal}%;"></div></div>
                  <span class="g-val">${attackVal}</span>
                </div>
                <div class="g-rating-row">
                  <span class="g-lbl">FASES</span>
                  <div class="g-track"><div class="g-fill" style="width: ${(phasesVal / 5) * 100}%;"></div></div>
                  <span class="g-val">${phasesVal}</span>
                </div>
              </div>

              <button class="inspect-genome-cta-btn" id="btnInspectGenome">
                <div class="btn-icon-label-group">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 15c6.667-6 13.333 0 20-6M2 9c6.667 6 13.333 0 20 6"/>
                  </svg>
                  <span>INSPECCIONAR GENOME</span>
                </div>
                <span class="chevron-arrow">&gt;</span>
              </button>
            </div>
          </aside>

        </div>

        <!-- ==============================================
             BOTTOM DECK: DIRECTIVAS & RECOMPENSAS TOTALES
             ============================================== -->
        <div class="hangar-bottom-deck-row">
          <!-- Directivas Box -->
          <div class="mission-directives-box">
            <div class="directives-header-line">
              <span class="dir-header-title">DIRECTIVAS DE MISIÓN &amp; RECOMPENSAS</span>
              <span class="bounties-pill">BOUNTIES</span>
            </div>

            <div class="directives-three-cards-row">
              <!-- Directive 1 -->
              <div class="directive-box-card">
                <div class="dir-tag-badge cyan">[W1] DEPURACIÓN DE COMMITS</div>
                <div class="dir-desc-text">
                  ${directives[0]?.description || 'Erradica la vanguardia de cazas sin pérdida crítica de búnkeres.'}
                </div>
                <div class="dir-rewards-line">
                  <span class="r-stars">+150 STARS</span>
                  <span class="r-exp">+200 EXP</span>
                </div>
                <div class="dir-footer-pill">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#00e5ff" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>RECOMPENSA</span>
                </div>
              </div>

              <!-- Directive 2 -->
              <div class="directive-box-card">
                <div class="dir-tag-badge cyan">[W2] INTERCEPTACIÓN DE PRs</div>
                <div class="dir-desc-text">
                  ${directives[1]?.description || 'Ruptura del flanco blindado en menos de 45 segundos con fuego sostenido.'}
                </div>
                <div class="dir-rewards-line">
                  <span class="r-stars">+300 STARS</span>
                  <span class="r-exp">+400 EXP</span>
                </div>
                <div class="dir-footer-pill">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#00e5ff" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>PERK: REPARACIÓN KERNEL</span>
                </div>
              </div>

              <!-- Directive 3 (Boss) -->
              <div class="directive-box-card boss-card">
                <div class="dir-tag-badge magenta">[BOSS] ERRADICACIÓN DE ARQUETIPO</div>
                <div class="dir-desc-text">
                  Neutraliza el núcleo en su fase terminal con el modificador activo.
                </div>
                <div class="dir-rewards-line">
                  <span class="r-stars">+800 STARS</span>
                  <span class="r-exp">+1,200 EXP</span>
                </div>
                <div class="dir-footer-pill gold">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fbbf24" stroke-width="2">
                    <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"/>
                  </svg>
                  <span>EMBLEMA DE ARQUETIPO</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recompensas Totales & Main CTA Button -->
          <div class="total-rewards-and-cta-card">
            <div class="tot-rewards-title">RECOMPENSAS TOTALES</div>

            <div class="tot-rewards-list">
              <div class="tot-item stars">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="#fbbf24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span class="tot-k">STARS</span>
                <span class="tot-v">+800</span>
              </div>
              <div class="tot-item exp">
                <span class="xp-mini-box">[XP]</span>
                <span class="tot-k">EXP</span>
                <span class="tot-v">+1,200</span>
              </div>
              <div class="tot-item module">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#00e5ff" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <div class="tot-module-text">
                  <span class="mod-k">MÓDULO STACK</span>
                  <span class="mod-v">${Security.escapeHtml(dna.primaryLanguage)}: Tracking Estricto</span>
                </div>
              </div>
              <div class="tot-item artifact">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#38bdf8" stroke-width="2">
                  <polygon points="12 2 2 9 12 22 22 9 12 2"></polygon>
                </svg>
                <div class="tot-module-text">
                  <span class="mod-k">ARTEFACTO</span>
                  <span class="mod-v">Núcleo Estabilizado</span>
                </div>
              </div>
            </div>

            <!-- Giant Launch Mission CTA -->
            <button class="dominant-launch-cta-btn" id="btnDominantStartMission">
              <span class="play-arrow-glyph">&#9654;</span> COMENZAR MISIÓN
            </button>
          </div>
        </div>

      </div>
    `;
  }

  /* ----------------------------------------------------
     VIEW 2: PLAY (MISIÓN)
     ---------------------------------------------------- */
  private renderPlayView(): string {
    const dna = this.getSelectedDNA();
    const t = I18n.getInstance().t;
    return `
      <div class="lobby-subview-wrapper">
        <div class="subview-header-row">
          <span class="subview-headline">${t.playModesTitle}</span>
          <span class="subview-subheadline">${t.playModesSub}</span>
        </div>

        <div class="play-modes-grid-container">
          <!-- Mode 1: Repository Campaign -->
          <div class="mode-selection-card" id="playModeRepoCard">
            <div class="mode-card-badge cyan">CAMPAÑA</div>
            <div class="mode-card-title">${t.modeCampaignTitle}</div>
            <div class="mode-card-desc">
              ${t.modeCampaignDesc.replace('{repo}', Security.escapeHtml(dna.name))}
            </div>
            <button class="mode-launch-cta-btn" id="btnLaunchRepoMode">${t.btnLaunchOperation}</button>
          </div>

          <!-- Mode 2: Profile Arcade -->
          <div class="mode-selection-card" id="playModeProfileCard">
            <div class="mode-card-badge green">ARCADE</div>
            <div class="mode-card-title">PROFILE ARCADE</div>
            <div class="mode-card-desc">
              Convierte tus commits, ramas y actividad en un combate de defensa de código galáctico.
            </div>
            <button class="mode-launch-cta-btn" id="btnLaunchProfileMode">${t.btnLaunchOperation}</button>
          </div>

          <!-- Mode 3: Chaos Max Mode -->
          <div class="mode-selection-card" id="playModeChaosCard">
            <div class="mode-card-badge red">HARDCORE</div>
            <div class="mode-card-title">${t.modeChaosTitle}</div>
            <div class="mode-card-desc">
              ${t.modeChaosDesc}
            </div>
            <button class="mode-launch-cta-btn" id="btnLaunchChaosMode">${t.btnLaunchOperation}</button>
          </div>

          <!-- Mode 4: Citadel Universe Gauntlet -->
          <div class="mode-selection-card" id="playModeCitadelCard">
            <div class="mode-card-badge purple">GAUNTLET</div>
            <div class="mode-card-title">${t.modeCitadelTitle}</div>
            <div class="mode-card-desc">
              ${t.modeCitadelDesc}
            </div>
            <button class="mode-launch-cta-btn" id="btnLaunchCitadelMode">${t.btnLaunchOperation}</button>
          </div>
        </div>

        <div style="display: flex; justify-content: center; margin-top: 14px;">
          <button class="terminal-open-btn" id="btnOpenAdvancedTerminal">
            [ ABRIR TERMINAL AVANZADA DE REPOSITORIOS ]
          </button>
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
  }

  private startAnimations(): void {
    this.stopAnimations();
    const renderLoop = () => {
      this.animTime += 0.025;
      if (this.activeTab === 'HANGAR') {
        this.drawHoloShipPlatform();
        this.drawBossPortrait();
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
          hasShield: this.store.profile.startingShield,
          isOverdrive: false,
          isThrusting: true,
        }
      );
    } else {
      Sprites.drawPlayer(
        ctx,
        shipX,
        shipY,
        shipW,
        shipH,
        this.store.profile.startingShield,
        false,
        activeSkin.hullColor,
        activeSkin.glowColor,
        t,
        1.0,
        true,
        activeSkin.id
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
        skin.id
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
      this.modals?.showBossCodex(this.store.profile.bossCodex || []);
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

      // Boss Info Full Button
      const btnBossInfo = this.container.querySelector('#btnViewBossInfo');
      btnBossInfo?.addEventListener('click', () => {
        const dna = this.getSelectedDNA();
        const blueprint = BossGenerator.generateFromDNA(dna);
        SFX.playPowerup();
        this.modals?.showWhyThisBoss(blueprint);
      });

      // Inspect Genome Button
      const btnGenome = this.container.querySelector('#btnInspectGenome');
      btnGenome?.addEventListener('click', () => {
        const dna = this.getSelectedDNA();
        const blueprint = BossGenerator.generateFromDNA(dna);
        SFX.playPowerup();
        this.modals?.showBossDnaCard(blueprint);
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
