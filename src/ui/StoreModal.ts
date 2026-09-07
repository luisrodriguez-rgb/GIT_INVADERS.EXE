import { Store, ShipModel } from '../store/Store';
import { SFX } from '../audio/SFX';
import { Sprites } from '../rendering/Sprites';
import { ThemeManager, THEMES, ThemeId } from '../themes/ThemeManager';

export class StoreModal {
  private overlay: HTMLElement;
  private store: Store;
  private themeManager: ThemeManager;
  private onCloseCallback?: () => void;
  private animFrameId: number | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;
  private previewCtx: CanvasRenderingContext2D | null = null;
  private animTime: number = 0;
  private activeStoreTab: 'SHIPS' | 'MODULES' | 'COSMETICS' = 'SHIPS';
  private selectedShipIndex: number = 0;

  constructor(overlay: HTMLElement) {
    this.overlay = overlay;
    this.store = Store.getInstance();
    this.themeManager = ThemeManager.getInstance();
  }

  public show(onClose?: () => void): void {
    this.onCloseCallback = onClose;
    const currentSkinId = this.store.profile.activeSkinId;
    const foundIdx = this.store.SKINS.findIndex((s) => s.id === currentSkinId);
    this.selectedShipIndex = foundIdx >= 0 ? foundIdx : 0;
    this.overlay.style.display = 'flex';
    this.render();
    this.startShipAnimation();
  }

  public hide(): void {
    this.overlay.style.display = 'none';
    this.stopShipAnimation();
    this.onCloseCallback?.();
  }

  private renderStatBar(val: number, max: number = 100): string {
    const filled = Math.min(10, Math.max(0, Math.round((val / max) * 10)));
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  }

  public render(): void {
    const prof = this.store.profile;
    const selectedShip = this.store.SKINS[this.selectedShipIndex] || this.store.SKINS[0];
    const isUnlocked = prof.unlockedSkins.includes(selectedShip.id);
    const isEquipped = prof.activeSkinId === selectedShip.id;

    const fireRateCosts = [250, 600, 1200, 2500, 'MAX'];
    const thrusterCosts = [200, 500, 1000, 2000, 'MAX'];
    const fireCost = fireRateCosts[prof.fireRateLevel - 1];
    const thrustCost = thrusterCosts[prof.thrusterLevel - 1];

    const octocatSvg = `
      <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle;">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;

    let mainContentHtml = '';

    if (this.activeStoreTab === 'SHIPS') {
      // Primary Request: Ship Engineering Bay Carousel
      const actionBtnText = isEquipped
        ? '[ EQUIPPED ]'
        : isUnlocked
        ? '[ EQUIP SHIP ]'
        : prof.availableXp >= selectedShip.cost
        ? `[ UNLOCK (${selectedShip.cost} XP) ]`
        : `[ LOCKED (${selectedShip.cost} XP) ]`;

      const actionBtnClass = isEquipped
        ? 'btn-equipped'
        : isUnlocked || prof.availableXp >= selectedShip.cost
        ? 'btn-buy'
        : 'btn-locked';

      mainContentHtml = `
        <div class="engineering-bay-container">
          <div class="bay-carousel-header">
            <button class="bay-nav-btn" id="bayPrevShipBtn">[ ◀ ]</button>
            <div class="bay-hologram-title">
              <span class="bay-hologram-label">SHIP HOLOGRAM [ 0${this.selectedShipIndex + 1} / 0${this.store.SKINS.length} ]</span>
              <span class="bay-ship-name">${selectedShip.name.toUpperCase()}</span>
              <span class="bay-ship-tag">${selectedShip.classTag}</span>
            </div>
            <button class="bay-nav-btn" id="bayNextShipBtn">[ ▶ ]</button>
          </div>

          <div class="bay-hologram-viewport">
            <canvas id="storeShipCanvas" width="340" height="150"></canvas>
          </div>

          <div class="bay-stats-card">
            <div class="bay-stat-line">
              <span class="bay-stat-name">ARMOR</span>
              <span class="bay-stat-blocks">${this.renderStatBar(selectedShip.stats.armor)}</span>
              <span class="bay-stat-val">${selectedShip.stats.armor}%</span>
            </div>
            <div class="bay-stat-line">
              <span class="bay-stat-name">SPEED</span>
              <span class="bay-stat-blocks">${this.renderStatBar(selectedShip.stats.speed)}</span>
              <span class="bay-stat-val">${selectedShip.stats.speed}%</span>
            </div>
            <div class="bay-stat-line">
              <span class="bay-stat-name">FIRE RATE</span>
              <span class="bay-stat-blocks">${this.renderStatBar(selectedShip.stats.fireRate)}</span>
              <span class="bay-stat-val">${selectedShip.stats.fireRate}%</span>
            </div>
            <div class="bay-stat-line">
              <span class="bay-stat-name">SHIELD</span>
              <span class="bay-stat-blocks">${this.renderStatBar(selectedShip.stats.shield)}</span>
              <span class="bay-stat-val">${selectedShip.stats.shield}%</span>
            </div>
          </div>

          <div class="bay-ability-card">
            <div class="bay-ability-header">
              <span class="bay-ability-title">ABILITY: ${selectedShip.ability.name}</span>
              <span class="bay-ability-key">[ ${selectedShip.ability.triggerKey} ]</span>
            </div>
            <div class="bay-ability-desc">${selectedShip.ability.description}</div>
          </div>

          <div class="bay-actions-row">
            <button class="bay-action-primary store-action-btn ${actionBtnClass}" id="bayShipActionBtn" data-skin="${selectedShip.id}">
              ${actionBtnText}
            </button>
            <button class="bay-action-upgrade" id="bayGoToModulesBtn">[ UPGRADE MODULES ]</button>
          </div>
        </div>
      `;
    } else if (this.activeStoreTab === 'MODULES') {
      // Hardware Overclocks
      mainContentHtml = `
        <div class="store-catalog-column" style="width: 100%; max-width: 640px; margin: 0 auto;">
          <!-- Blaster Overclock -->
          <div class="store-item-card">
            <div class="store-item-icon cyan-tint">[WPN]</div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">BLASTER OVERCLOCK</span>
                <span class="store-item-level">LVL ${prof.fireRateLevel} / 5</span>
              </div>
              <div class="store-item-desc">+12% weapon firing cadence per level</div>
            </div>
            <button class="store-action-btn ${prof.fireRateLevel >= 5 ? 'btn-max' : 'btn-buy'}" id="buyFireRateBtn">
              ${prof.fireRateLevel >= 5 ? 'MAX' : `$ ${fireCost}`}
            </button>
          </div>

          <!-- Thrust Velocity -->
          <div class="store-item-card">
            <div class="store-item-icon green-tint">[ENG]</div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">THRUST SPEED</span>
                <span class="store-item-level">LVL ${prof.thrusterLevel} / 5</span>
              </div>
              <div class="store-item-desc">+15% thruster acceleration and agility</div>
            </div>
            <button class="store-action-btn ${prof.thrusterLevel >= 5 ? 'btn-max' : 'btn-buy'}" id="buyThrusterBtn">
              ${prof.thrusterLevel >= 5 ? 'MAX' : `$ ${thrustCost}`}
            </button>
          </div>

          <!-- Quantum Pierce -->
          <div class="store-item-card">
            <div class="store-item-icon purple-tint">[AMP]</div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">QUANTUM PIERCE MODULE</span>
                <span class="store-item-level">LVL ${prof.quantumPiercing ? 1 : 0}</span>
              </div>
              <div class="store-item-desc">Penetrates shields & armor without dissipating</div>
            </div>
            <button class="store-action-btn ${prof.quantumPiercing ? 'btn-max' : prof.availableXp >= 1800 ? 'btn-buy' : 'btn-locked'}" id="buyPiercingBtn">
              ${prof.quantumPiercing ? 'OWNED' : prof.availableXp >= 1800 ? '1,800 XP' : 'LOCKED'}
            </button>
          </div>

          <!-- Stash Shield -->
          <div class="store-item-card">
            <div class="store-item-icon blue-tint">[SHD]</div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">STASH SHIELD MATRIX</span>
                <span class="store-item-level">LVL ${prof.startingShield ? 1 : 0}</span>
              </div>
              <div class="store-item-desc">Reinforced starting shield absorption barrier</div>
            </div>
            <button class="store-action-btn ${prof.startingShield ? 'btn-max' : prof.availableXp >= 1200 ? 'btn-buy' : 'btn-locked'}" id="buyShieldBtn">
              ${prof.startingShield ? 'OWNED' : prof.availableXp >= 1200 ? '1,200 XP' : 'LOCKED'}
            </button>
          </div>

          <!-- Git Rebase Protocol -->
          <div class="store-item-card">
            <div class="store-item-icon pink-tint">[CLK]</div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">GIT REBASE PROTOCOL</span>
                <span class="store-item-level">LVL ${prof.rebaseSlowMoUnlocked ? 1 : 0}</span>
              </div>
              <div class="store-item-desc">Temporal slow-motion overclock slowing hostiles by 65%</div>
            </div>
            <button class="store-action-btn ${prof.rebaseSlowMoUnlocked ? 'btn-max' : prof.availableXp >= 2200 ? 'btn-buy' : 'btn-locked'}" id="buyRebaseBtn">
              ${prof.rebaseSlowMoUnlocked ? 'OWNED' : prof.availableXp >= 2200 ? '2,200 XP' : 'LOCKED'}
            </button>
          </div>
        </div>
      `;
    } else {
      // Cosmetics & CRT Palettes
      const currentThemeId = this.themeManager.currentTheme.id;
      const themeKeys = Object.keys(THEMES) as ThemeId[];

      let themesHtml = '';
      themeKeys.forEach((key) => {
        const th = THEMES[key];
        const isActive = currentThemeId === key;
        themesHtml += `
          <div class="store-item-card ${isActive ? 'item-equipped' : ''}">
            <div class="store-item-icon" style="background: ${th.primaryAccent}22; border-color: ${th.primaryAccent}; color: ${th.primaryAccent};">
              [CRT]
            </div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">${th.name.toUpperCase()}</span>
                <span class="store-item-level">${isActive ? 'ACTIVE PALETTE' : 'UNLOCKED'}</span>
              </div>
              <div class="store-item-desc">Hardware CRT palette with ${Math.round(th.crtScanlineOpacity * 100)}% phosphor scanlines.</div>
            </div>
            <button class="store-action-btn ${isActive ? 'btn-equipped' : 'btn-buy'}" data-theme="${th.id}">
              ${isActive ? 'ACTIVE' : 'APPLY'}
            </button>
          </div>
        `;
      });

      mainContentHtml = `
        <div class="store-catalog-column" style="width: 100%; max-width: 640px; margin: 0 auto;">
          ${themesHtml}
        </div>
      `;
    }

    this.overlay.innerHTML = `
      <div class="panel-store-window">
        <!-- Top Title Bar -->
        <div class="store-panel-top">
          <div class="store-panel-tabs-left">
            <div class="store-octo-icon">${octocatSvg}</div>
            <button class="store-header-tab" id="storeReturnHangarBtn">GIT_INVADERS.EXE</button>
            <button class="store-header-tab tab-active">GIT_STORE.EXE // SHIP ENGINEERING BAY</button>
          </div>
          <div class="store-credits-display">
            <span class="credits-label">CREDITS</span>
            <span class="credits-amount">${prof.availableXp.toLocaleString()} XP</span>
          </div>
        </div>

        <!-- Store Sub Navigation Tabs (SHIPS, MODULES, COSMETICS) -->
        <div class="store-sub-nav">
          <button class="sub-nav-chip ${this.activeStoreTab === 'SHIPS' ? 'chip-active' : ''}" data-tab="SHIPS">[ SHIPS ]</button>
          <button class="sub-nav-chip ${this.activeStoreTab === 'MODULES' ? 'chip-active' : ''}" data-tab="MODULES">[ MODULES ]</button>
          <button class="sub-nav-chip ${this.activeStoreTab === 'COSMETICS' ? 'chip-active' : ''}" data-tab="COSMETICS">[ COSMETICS ]</button>
        </div>

        <!-- Main Body -->
        <div class="store-panel-body" style="display: flex; justify-content: center; align-items: flex-start; overflow-y: auto;">
          ${mainContentHtml}
        </div>

        <!-- Footer -->
        <div class="store-panel-footer">
          <div class="footer-tagline">
            ${octocatSvg}
            <span>UPGRADE. SURVIVE. COMMIT.</span>
          </div>
          <button class="store-exit-btn" id="closeStoreBtn">[ EXIT STORE ]</button>
        </div>
      </div>
    `;

    this.bindEvents();
    if (this.activeStoreTab === 'SHIPS') {
      this.initCanvas();
    }
  }

  private initCanvas(): void {
    this.previewCanvas = this.overlay.querySelector('#storeShipCanvas') as HTMLCanvasElement;
    if (this.previewCanvas) {
      this.previewCtx = this.previewCanvas.getContext('2d');
    }
  }

  private startShipAnimation(): void {
    this.stopShipAnimation();
    const renderLoop = () => {
      this.animTime += 0.025;
      if (this.activeStoreTab === 'SHIPS') {
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
    if (!this.previewCtx || !this.previewCanvas) return;
    const ctx = this.previewCtx;
    const w = this.previewCanvas.width;
    const h = this.previewCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Wireframe hologram grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 14;
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Holographic scanline beam
    const scanY = ((this.animTime * 35) % h);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.12)';
    ctx.fillRect(0, scanY - 1, w, 2);

    const floatY = Math.sin(this.animTime * 2.5) * 4;
    const centerX = w / 2;
    const centerY = h / 2 + floatY;

    // Glowing core halo
    const grad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, 75);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.32)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 75, 0, Math.PI * 2);
    ctx.fill();

    // Draw vector ship with its exact unique geometry preset
    const selectedShip = this.store.SKINS[this.selectedShipIndex] || this.store.SKINS[0];
    const prof = this.store.profile;

    Sprites.drawPlayer(
      ctx,
      centerX - 44,
      centerY - 32,
      88,
      64,
      selectedShip.stats.shield >= 50 || prof.startingShield,
      false,
      selectedShip.hullColor,
      selectedShip.glowColor,
      this.animTime,
      1.0,
      true,
      selectedShip.id
    );
  }

  private bindEvents(): void {
    const closeBtn = this.overlay.querySelector('#closeStoreBtn');
    closeBtn?.addEventListener('click', () => this.hide());

    const returnBtn = this.overlay.querySelector('#storeReturnHangarBtn');
    returnBtn?.addEventListener('click', () => this.hide());

    // Tab chips
    const chips = this.overlay.querySelectorAll('.sub-nav-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const tab = (chip as HTMLElement).dataset.tab as 'SHIPS' | 'MODULES' | 'COSMETICS';
        if (tab) {
          this.activeStoreTab = tab;
          this.render();
          this.startShipAnimation();
        }
      });
    });

    // Carousel buttons
    const prevBtn = this.overlay.querySelector('#bayPrevShipBtn');
    prevBtn?.addEventListener('click', () => {
      this.selectedShipIndex =
        (this.selectedShipIndex - 1 + this.store.SKINS.length) % this.store.SKINS.length;
      SFX.playLaser('player');
      this.render();
      this.startShipAnimation();
    });

    const nextBtn = this.overlay.querySelector('#bayNextShipBtn');
    nextBtn?.addEventListener('click', () => {
      this.selectedShipIndex = (this.selectedShipIndex + 1) % this.store.SKINS.length;
      SFX.playLaser('player');
      this.render();
      this.startShipAnimation();
    });

    // Primary action button (Equip / Unlock)
    const actionBtn = this.overlay.querySelector('#bayShipActionBtn');
    actionBtn?.addEventListener('click', () => {
      const skinId = (actionBtn as HTMLElement).dataset.skin;
      if (skinId && this.store.buyOrEquipSkin(skinId)) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Quick jump to modules
    const goToModulesBtn = this.overlay.querySelector('#bayGoToModulesBtn');
    goToModulesBtn?.addEventListener('click', () => {
      this.activeStoreTab = 'MODULES';
      this.render();
      this.startShipAnimation();
    });

    // Hardware Overclock Modules
    const buyFireRate = this.overlay.querySelector('#buyFireRateBtn');
    buyFireRate?.addEventListener('click', () => {
      if (this.store.buyFireRate()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    const buyThruster = this.overlay.querySelector('#buyThrusterBtn');
    buyThruster?.addEventListener('click', () => {
      if (this.store.buyThruster()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    const buyPiercing = this.overlay.querySelector('#buyPiercingBtn');
    buyPiercing?.addEventListener('click', () => {
      if (this.store.buyQuantumPiercing()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    const buyShield = this.overlay.querySelector('#buyShieldBtn');
    buyShield?.addEventListener('click', () => {
      if (this.store.buyStartingShield()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    const buyRebase = this.overlay.querySelector('#buyRebaseBtn');
    buyRebase?.addEventListener('click', () => {
      if (this.store.buyRebaseSlowMo()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Theme selector
    const themeBtns = this.overlay.querySelectorAll('[data-theme]');
    themeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const themeId = (btn as HTMLElement).dataset.theme as ThemeId;
        if (themeId) {
          this.themeManager.setTheme(themeId);
          SFX.playPowerup();
          this.render();
        }
      });
    });
  }
}
