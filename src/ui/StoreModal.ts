import { Store, ShipSkin } from '../store/Store';
import { SFX } from '../audio/SFX';
import { Sprites } from '../rendering/Sprites';

export class StoreModal {
  private overlay: HTMLElement;
  private store: Store;
  private onCloseCallback?: () => void;
  private animFrameId: number | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;
  private previewCtx: CanvasRenderingContext2D | null = null;
  private animTime: number = 0;
  private activeStoreTab: string = 'UPGRADES';

  constructor(overlay: HTMLElement) {
    this.overlay = overlay;
    this.store = Store.getInstance();
  }

  public show(onClose?: () => void): void {
    this.onCloseCallback = onClose;
    this.overlay.style.display = 'flex';
    this.render();
    this.startShipAnimation();
  }

  public hide(): void {
    this.overlay.style.display = 'none';
    this.stopShipAnimation();
    this.onCloseCallback?.();
  }

  public render(): void {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();

    const fireRateCosts = [250, 600, 1200, 2500, 'MAX'];
    const thrusterCosts = [200, 500, 1000, 2000, 'MAX'];

    const fireCost = fireRateCosts[prof.fireRateLevel - 1];
    const thrustCost = thrusterCosts[prof.thrusterLevel - 1];

    const octocatSvg = `
      <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle;">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;

    // Calculate dynamic stats
    const baseSpeed = 6.0 + prof.thrusterLevel * 0.75;
    const baseFireRate = 4.0 + prof.fireRateLevel * 0.6;
    const baseShield = prof.startingShield ? 4.5 : 2.5;

    let itemsContent = '';

    if (this.activeStoreTab === 'SKINS') {
      let skinsHtml = '';
      this.store.SKINS.forEach((skin: ShipSkin) => {
        const isUnlocked = prof.unlockedSkins.includes(skin.id);
        const isEquipped = prof.activeSkinId === skin.id;

        skinsHtml += `
          <div class="store-item-card ${isEquipped ? 'item-equipped' : ''}">
            <div class="store-item-icon" style="background: ${skin.hullColor}22; border-color: ${skin.hullColor}; color: ${skin.hullColor};">
              [SKN]
            </div>
            <div class="store-item-details">
              <div class="store-item-header">
                <span class="store-item-name">${skin.name.toUpperCase()}</span>
                <span class="store-item-level">${isEquipped ? 'EQUIPPED' : isUnlocked ? 'OWNED' : `${skin.cost} XP`}</span>
              </div>
              <div class="store-item-desc">${skin.description || 'Special cybernetic hull telemetry.'}</div>
            </div>
            <button class="store-action-btn ${isEquipped ? 'btn-equipped' : isUnlocked ? 'btn-buy' : 'btn-buy'}" data-skin="${skin.id}">
              ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : 'BUY'}
            </button>
          </div>
        `;
      });
      itemsContent = skinsHtml;
    } else {
      // Default: UPGRADES / SHIPS / POWER-UPS
      itemsContent = `
        <!-- Blaster Overclock -->
        <div class="store-item-card">
          <div class="store-item-icon cyan-tint">
            [WPN]
          </div>
          <div class="store-item-details">
            <div class="store-item-header">
              <span class="store-item-name">BLASTER OVERCLOCK</span>
              <span class="store-item-level">LVL ${prof.fireRateLevel}</span>
            </div>
            <div class="store-item-desc">+12% fire rate per level</div>
          </div>
          <button class="store-action-btn ${prof.fireRateLevel >= 5 ? 'btn-max' : 'btn-buy'}" id="buyFireRateBtn">
            ${prof.fireRateLevel >= 5 ? 'MAX' : `$ ${fireCost}`}
          </button>
        </div>

        <!-- Thrust Velocity -->
        <div class="store-item-card">
          <div class="store-item-icon green-tint">
            [ENG]
          </div>
          <div class="store-item-details">
            <div class="store-item-header">
              <span class="store-item-name">THRUST SPEED</span>
              <span class="store-item-level">LVL ${prof.thrusterLevel}</span>
            </div>
            <div class="store-item-desc">+15% movement speed</div>
          </div>
          <button class="store-action-btn ${prof.thrusterLevel >= 5 ? 'btn-max' : 'btn-buy'}" id="buyThrusterBtn">
            ${prof.thrusterLevel >= 5 ? 'MAX' : `$ ${thrustCost}`}
          </button>
        </div>

        <!-- Quantum Pierce -->
        <div class="store-item-card">
          <div class="store-item-icon purple-tint">
            [AMP]
          </div>
          <div class="store-item-details">
            <div class="store-item-header">
              <span class="store-item-name">QUANTUM PIERCE</span>
              <span class="store-item-level">LVL ${prof.quantumPiercing ? 1 : 0}</span>
            </div>
            <div class="store-item-desc">Penetrates shields & armor</div>
          </div>
          <button class="store-action-btn ${prof.quantumPiercing ? 'btn-max' : prof.availableXp >= 1800 ? 'btn-buy' : 'btn-locked'}" id="buyPiercingBtn">
            ${prof.quantumPiercing ? 'OWNED' : prof.availableXp >= 1800 ? '1,800 XP' : 'LOCKED'}
          </button>
        </div>

        <!-- Stash Shield -->
        <div class="store-item-card">
          <div class="store-item-icon blue-tint">
            [SHD]
          </div>
          <div class="store-item-details">
            <div class="store-item-header">
              <span class="store-item-name">STASH SHIELD</span>
              <span class="store-item-level">LVL ${prof.startingShield ? 1 : 0}</span>
            </div>
            <div class="store-item-desc">Temporary invulnerability protocol</div>
          </div>
          <button class="store-action-btn ${prof.startingShield ? 'btn-max' : prof.availableXp >= 1200 ? 'btn-buy' : 'btn-locked'}" id="buyShieldBtn">
            ${prof.startingShield ? 'OWNED' : prof.availableXp >= 1200 ? '1,200 XP' : 'LOCKED'}
          </button>
        </div>

        <!-- Git Drone / Tactical Rebase -->
        <div class="store-item-card">
          <div class="store-item-icon pink-tint">
            [CLK]
          </div>
          <div class="store-item-details">
            <div class="store-item-header">
              <span class="store-item-name">GIT REBASE PROTOCOL</span>
              <span class="store-item-level">LVL ${prof.rebaseSlowMoUnlocked ? 1 : 0}</span>
            </div>
            <div class="store-item-desc">Slows enemies & fire rate by 60%</div>
          </div>
          <button class="store-action-btn ${prof.rebaseSlowMoUnlocked ? 'btn-max' : prof.availableXp >= 2200 ? 'btn-buy' : 'btn-locked'}" id="buyRebaseBtn">
            ${prof.rebaseSlowMoUnlocked ? 'OWNED' : prof.availableXp >= 2200 ? '2,200 XP' : 'LOCKED'}
          </button>
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
            <button class="store-header-tab tab-active">GIT_STORE.EXE</button>
          </div>
          <div class="store-credits-display">
            <span class="credits-label">CREDITS</span>
            <span class="credits-amount">${prof.availableXp.toLocaleString()}</span>
          </div>
        </div>

        <!-- Store Sub Navigation Tabs -->
        <div class="store-sub-nav">
          <button class="sub-nav-chip ${this.activeStoreTab === 'SHIPS' ? 'chip-active' : ''}" data-tab="UPGRADES">[ SHIPS ]</button>
          <button class="sub-nav-chip ${this.activeStoreTab === 'UPGRADES' ? 'chip-active' : ''}" data-tab="UPGRADES">[ UPGRADES ]</button>
          <button class="sub-nav-chip ${this.activeStoreTab === 'SKINS' ? 'chip-active' : ''}" data-tab="SKINS">[ SKINS ]</button>
          <button class="sub-nav-chip ${this.activeStoreTab === 'POWER-UPS' ? 'chip-active' : ''}" data-tab="UPGRADES">[ POWER-UPS ]</button>
          <button class="sub-nav-chip ${this.activeStoreTab === 'MISC' ? 'chip-active' : ''}" data-tab="UPGRADES">[ MISC ]</button>
        </div>

        <!-- Two Column Main Body -->
        <div class="store-panel-body">
          <!-- Left: Upgrades or Skins List -->
          <div class="store-catalog-column">
            ${itemsContent}
          </div>

          <!-- Right: Ship Showcase Card -->
          <div class="store-showcase-column">
            <div class="store-ship-card">
              <div class="ship-card-title">${activeSkin.name.toUpperCase()}</div>
              
              <div class="ship-card-viewport">
                <canvas id="storeShipCanvas" width="180" height="150"></canvas>
              </div>

              <div class="ship-card-stats">
                <div class="ship-stat-row">
                  <span class="stat-name">SPEED</span>
                  <span class="stat-val">${baseSpeed.toFixed(1)}</span>
                </div>
                <div class="ship-stat-row">
                  <span class="stat-name">FIRE RATE</span>
                  <span class="stat-val">${baseFireRate.toFixed(1)}</span>
                </div>
                <div class="ship-stat-row">
                  <span class="stat-name">SHIELD</span>
                  <span class="stat-val">${baseShield.toFixed(1)}</span>
                </div>
              </div>

              <button class="store-equip-badge">
                <span class="dot-equipped">●</span> EQUIPPED
              </button>
            </div>
          </div>
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
    this.initCanvas();
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
    if (!this.previewCtx || !this.previewCanvas) return;
    const ctx = this.previewCtx;
    const w = this.previewCanvas.width;
    const h = this.previewCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle cyan grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 15;
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

    // Hover float offset
    const floatY = Math.sin(this.animTime * 2.5) * 5;
    const centerX = w / 2;
    const centerY = h / 2 + floatY;

    // Glowing core back-halo
    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 50);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fill();

    // Draw vector player ship
    const activeSkin = this.store.getActiveSkin();
    const prof = this.store.profile;
    Sprites.drawPlayer(
      ctx,
      centerX - 22,
      centerY - 17,
      44,
      34,
      prof.startingShield,
      false,
      activeSkin.hullColor,
      activeSkin.glowColor
    );
  }

  private bindEvents(): void {
    const closeBtn = this.overlay.querySelector('#closeStoreBtn');
    closeBtn?.addEventListener('click', () => this.hide());

    const returnBtn = this.overlay.querySelector('#storeReturnHangarBtn');
    returnBtn?.addEventListener('click', () => this.hide());

    // Sub-nav chips
    const chips = this.overlay.querySelectorAll('.sub-nav-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const tab = (chip as HTMLElement).dataset.tab;
        if (tab) {
          this.activeStoreTab = tab;
          this.render();
          this.startShipAnimation();
        }
      });
    });

    // Buy Fire Rate
    const buyFireRate = this.overlay.querySelector('#buyFireRateBtn');
    buyFireRate?.addEventListener('click', () => {
      if (this.store.buyFireRate()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Buy Thruster
    const buyThruster = this.overlay.querySelector('#buyThrusterBtn');
    buyThruster?.addEventListener('click', () => {
      if (this.store.buyThruster()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Buy Piercing
    const buyPiercing = this.overlay.querySelector('#buyPiercingBtn');
    buyPiercing?.addEventListener('click', () => {
      if (this.store.buyQuantumPiercing()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Buy Starting Shield
    const buyShield = this.overlay.querySelector('#buyShieldBtn');
    buyShield?.addEventListener('click', () => {
      if (this.store.buyStartingShield()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Buy Rebase
    const buyRebase = this.overlay.querySelector('#buyRebaseBtn');
    buyRebase?.addEventListener('click', () => {
      if (this.store.buyRebaseSlowMo()) {
        SFX.playPowerup();
        this.render();
        this.startShipAnimation();
      }
    });

    // Skin buttons
    const skinBtns = this.overlay.querySelectorAll('[data-skin]');
    skinBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const skinId = (btn as HTMLElement).dataset.skin;
        if (skinId && this.store.buyOrEquipSkin(skinId)) {
          SFX.playPowerup();
          this.render();
          this.startShipAnimation();
        }
      });
    });
  }
}
