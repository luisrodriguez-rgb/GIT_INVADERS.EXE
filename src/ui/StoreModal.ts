import { Store } from '../store/Store';
import { SFX } from '../audio/SFX';

export class StoreModal {
  private overlay: HTMLElement;
  private store: Store;
  private onCloseCallback?: () => void;

  constructor(overlay: HTMLElement) {
    this.overlay = overlay;
    this.store = Store.getInstance();
  }

  public show(onClose?: () => void): void {
    this.onCloseCallback = onClose;
    this.overlay.style.display = 'flex';
    this.render();
  }

  public hide(): void {
    this.overlay.style.display = 'none';
    this.onCloseCallback?.();
  }

  public render(): void {
    const prof = this.store.profile;
    const activeSkin = this.store.getActiveSkin();

    const fireRateCosts = [250, 600, 1200, 2500, 'MAX'];
    const thrusterCosts = [200, 500, 1000, 2000, 'MAX'];

    const fireCost = fireRateCosts[prof.fireRateLevel - 1];
    const thrustCost = thrusterCosts[prof.thrusterLevel - 1];

    let skinsHtml = '';
    this.store.SKINS.forEach((skin) => {
      const isUnlocked = prof.unlockedSkins.includes(skin.id);
      const isEquipped = prof.activeSkinId === skin.id;

      skinsHtml += `
        <div class="store-item ${isEquipped ? 'item-equipped' : ''}">
          <div class="skin-swatch" style="background: ${skin.hullColor}; box-shadow: 0 0 10px ${skin.glowColor};"></div>
          <div class="item-info">
            <div class="item-name">${skin.name}</div>
            <div class="item-desc">${isEquipped ? 'EQUIPPED' : isUnlocked ? 'UNLOCKED' : `${skin.cost} XP`}</div>
          </div>
          <button class="store-btn ${isEquipped ? 'btn-active' : ''}" data-skin="${skin.id}">
            ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : 'BUY'}
          </button>
        </div>
      `;
    });

    this.overlay.innerHTML = `
      <div class="modal-card store-modal">
        <div class="store-header">
          <div class="store-title-group">
            <span class="store-icon">⚡</span>
            <h2>GIT_STORE.EXE // UPGRADES & SKINS</h2>
          </div>
          <button class="store-close-btn" id="closeStoreBtn">✕</button>
        </div>

        <div class="store-wallet-bar">
          <div class="wallet-stat">
            <span class="wallet-label">AVAILABLE XP</span>
            <span class="wallet-val xp-highlight">${prof.availableXp.toLocaleString()} XP</span>
          </div>
          <div class="wallet-stat">
            <span class="wallet-label">RANK</span>
            <span class="wallet-val rank-highlight">LVL ${prof.level} // ${prof.rankName}</span>
          </div>
        </div>

        <div class="store-tabs-wrapper">
          <div class="store-section-title">COMPILER SHIP UPGRADES</div>
          <div class="store-grid">
            <!-- Blaster Fire Rate -->
            <div class="store-item">
              <div class="item-icon">🔫</div>
              <div class="item-info">
                <div class="item-name">Blaster Overclock (Lvl ${prof.fireRateLevel}/5)</div>
                <div class="item-desc">Reduces blaster cooldown by 12% per level.</div>
              </div>
              <button class="store-btn ${prof.fireRateLevel >= 5 ? 'btn-max' : ''}" id="buyFireRateBtn">
                ${prof.fireRateLevel >= 5 ? 'MAX' : `${fireCost} XP`}
              </button>
            </div>

            <!-- Thruster Speed -->
            <div class="store-item">
              <div class="item-icon">🚀</div>
              <div class="item-info">
                <div class="item-name">Thruster Velocity (Lvl ${prof.thrusterLevel}/5)</div>
                <div class="item-desc">Increases ship maneuver speed by 15% per level.</div>
              </div>
              <button class="store-btn ${prof.thrusterLevel >= 5 ? 'btn-max' : ''}" id="buyThrusterBtn">
                ${prof.thrusterLevel >= 5 ? 'MAX' : `${thrustCost} XP`}
              </button>
            </div>

            <!-- Quantum Piercing -->
            <div class="store-item">
              <div class="item-icon">⚡</div>
              <div class="item-info">
                <div class="item-name">Quantum Piercing Lasers</div>
                <div class="item-desc">Player blasters pierce through 1 enemy hitting a second!</div>
              </div>
              <button class="store-btn ${prof.quantumPiercing ? 'btn-max' : ''}" id="buyPiercingBtn">
                ${prof.quantumPiercing ? 'OWNED' : '1,800 XP'}
              </button>
            </div>

            <!-- Starting Shield -->
            <div class="store-item">
              <div class="item-icon">🛡</div>
              <div class="item-info">
                <div class="item-name">Stash Shield Protocol</div>
                <div class="item-desc">Spawn with an active GIT STASH emergency shield.</div>
              </div>
              <button class="store-btn ${prof.startingShield ? 'btn-max' : ''}" id="buyShieldBtn">
                ${prof.startingShield ? 'OWNED' : '1,200 XP'}
              </button>
            </div>

            <!-- Rebase Slow-Mo Power -->
            <div class="store-item">
              <div class="item-icon">⏳</div>
              <div class="item-info">
                <div class="item-name">Tactical [Q]: GIT REBASE -i</div>
                <div class="item-desc">Slows down enemy movement & bombs by 60% for 4s.</div>
              </div>
              <button class="store-btn ${prof.rebaseSlowMoUnlocked ? 'btn-max' : ''}" id="buyRebaseBtn">
                ${prof.rebaseSlowMoUnlocked ? 'OWNED' : '2,200 XP'}
              </button>
            </div>
          </div>

          <div class="store-section-title" style="margin-top: 14px;">HULL SKINS & PLASMA CORES</div>
          <div class="store-grid">
            ${skinsHtml}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const closeBtn = this.overlay.querySelector('#closeStoreBtn');
    closeBtn?.addEventListener('click', () => this.hide());

    // Buy Fire Rate
    const buyFireRate = this.overlay.querySelector('#buyFireRateBtn');
    buyFireRate?.addEventListener('click', () => {
      if (this.store.buyFireRate()) {
        SFX.playPowerup();
        this.render();
      }
    });

    // Buy Thruster
    const buyThruster = this.overlay.querySelector('#buyThrusterBtn');
    buyThruster?.addEventListener('click', () => {
      if (this.store.buyThruster()) {
        SFX.playPowerup();
        this.render();
      }
    });

    // Buy Piercing
    const buyPiercing = this.overlay.querySelector('#buyPiercingBtn');
    buyPiercing?.addEventListener('click', () => {
      if (this.store.buyQuantumPiercing()) {
        SFX.playPowerup();
        this.render();
      }
    });

    // Buy Starting Shield
    const buyShield = this.overlay.querySelector('#buyShieldBtn');
    buyShield?.addEventListener('click', () => {
      if (this.store.buyStartingShield()) {
        SFX.playPowerup();
        this.render();
      }
    });

    // Buy Rebase
    const buyRebase = this.overlay.querySelector('#buyRebaseBtn');
    buyRebase?.addEventListener('click', () => {
      if (this.store.buyRebaseSlowMo()) {
        SFX.playPowerup();
        this.render();
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
        }
      });
    });
  }
}
