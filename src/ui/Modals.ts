import { BossBlueprint } from '../github/Types';
import { GameState } from '../core/GameState';
import { Store } from '../store/Store';
import { SFX } from '../audio/SFX';

export class Modals {
  private overlay: HTMLElement;

  constructor(overlay: HTMLElement) {
    this.overlay = overlay;
  }

  public showPause(
    state: GameState,
    onResume: () => void,
    onStore: () => void,
    onAbort: () => void
  ): void {
    this.overlay.style.display = 'flex';
    this.overlay.innerHTML = `
      <div class="modal-card pause-modal">
        <div class="pause-header">
          <span class="pause-led"></span>
          <h2>SYSTEM PAUSED</h2>
          <span class="pause-sub">KERNEL EXECUTION FROZEN</span>
        </div>

        <div class="pause-stats-grid">
          <div class="p-card">
            <span class="p-lbl">CURRENT SCORE</span>
            <span class="p-val val-green">${state.score.toLocaleString()}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">ACTIVE WAVE</span>
            <span class="p-val val-cyan">${state.currentWave} / ${state.totalWaves}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">COMMITS PURGED</span>
            <span class="p-val">${state.commitsPurged}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">PRs MERGED</span>
            <span class="p-val val-purple">${state.prsMerged}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">ISSUES SQUASHED</span>
            <span class="p-val val-red">${state.issuesClosed}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">STREAK MULTIPLIER</span>
            <span class="p-val val-yellow">${state.streakMultiplier.toFixed(1)}x</span>
          </div>
        </div>

        <div class="pause-actions">
          <button class="launch-btn" id="resumeBtn">RESUME MISSION [ESC / P]</button>
          <button class="store-nav-btn" id="pauseStoreBtn">OPEN GIT_STORE.EXE ⚡</button>
          <button class="abort-btn" id="abortBtn">ABORT TO TERMINAL</button>
        </div>
      </div>
    `;

    const resumeBtn = this.overlay.querySelector('#resumeBtn');
    const storeBtn = this.overlay.querySelector('#pauseStoreBtn');
    const abortBtn = this.overlay.querySelector('#abortBtn');

    resumeBtn?.addEventListener('click', () => {
      this.hide();
      onResume();
    });

    storeBtn?.addEventListener('click', () => {
      onStore();
    });

    abortBtn?.addEventListener('click', () => {
      this.hide();
      onAbort();
    });
  }

  public showBossBlueprint(blueprint: BossBlueprint, onEngage: () => void): void {
    this.overlay.style.display = 'flex';
    const threatBar = '█'.repeat(Math.round(blueprint.threatIndex / 10)) + '░'.repeat(10 - Math.round(blueprint.threatIndex / 10));

    this.overlay.innerHTML = `
      <div class="modal-card boss-blueprint-modal">
        <div class="blueprint-header">
          <span class="warning-icon">⚠</span>
          <h2>CODE BOSS DETECTED</h2>
          <span class="warning-icon">⚠</span>
        </div>

        <div class="blueprint-card">
          <div class="blueprint-title">${blueprint.coreName}</div>
          <div class="blueprint-grid">
            <div class="bp-row">
              <span class="bp-label">TARGET REPO:</span>
              <span class="bp-val bp-cyan">${blueprint.repoName}</span>
            </div>
            <div class="bp-row">
              <span class="bp-label">PRIMARY LANGUAGE:</span>
              <span class="bp-val" style="color: ${blueprint.languageColor}; font-weight: bold;">
                ${blueprint.language}
              </span>
            </div>
            <div class="bp-row">
              <span class="bp-label">COMMITS:</span>
              <span class="bp-val">${blueprint.statsDisplay.commits} <span class="bp-sub">→ HP: ${blueprint.maxHp}</span></span>
            </div>
            <div class="bp-row">
              <span class="bp-label">CONTRIBUTORS:</span>
              <span class="bp-val">${blueprint.statsDisplay.contributors} <span class="bp-sub">→ CANNONS: ${blueprint.cannons}-WAY</span></span>
            </div>
            <div class="bp-row">
              <span class="bp-label">PULL REQUESTS:</span>
              <span class="bp-val">${blueprint.statsDisplay.pullRequests} <span class="bp-sub">→ SHIELD LAYERS: ${blueprint.shieldLayers}</span></span>
            </div>
            <div class="bp-row">
              <span class="bp-label">OPEN ISSUES:</span>
              <span class="bp-val">${blueprint.statsDisplay.issues} <span class="bp-sub">→ BUG BOMBERS: ENGAGED</span></span>
            </div>
            <div class="bp-row">
              <span class="bp-label">THREAT INDEX:</span>
              <span class="bp-val bp-pink">[${threatBar}] ${blueprint.threatIndex}%</span>
            </div>
          </div>
        </div>

        <div class="blueprint-actions">
          <button class="launch-btn" id="engageBossBtn">ENGAGE REPOSITORY CORE [SPACE]</button>
        </div>
      </div>
    `;

    const btn = this.overlay.querySelector('#engageBossBtn');
    const handleAction = () => {
      this.hide();
      window.removeEventListener('keydown', handleKey);
      onEngage();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };

    btn?.addEventListener('click', handleAction);
    window.addEventListener('keydown', handleKey);
  }

  public showGameOver(state: GameState, onRetry: () => void): void {
    this.overlay.style.display = 'flex';
    this.overlay.innerHTML = `
      <div class="modal-card gameover-modal glitch-screen">
        <div class="gameover-title">SYSTEM COMPROMISED</div>
        <div class="gameover-sub">KERNEL PANIC: SEGMENTATION FAULT // INVASION OVERRUN</div>

        <div class="panic-terminal-log">
          <div>[CRITICAL] Stack trace: 0x7FFF004B in GitKernel.sys</div>
          <div>[ALERT] Bunkers breached. Defense matrix offline.</div>
          <div>[INFO] Preserving ${state.xp.toLocaleString()} XP to Local Storage...</div>
        </div>

        <div class="report-stats">
          <div class="r-row"><span>FINAL SCORE:</span> <b>${state.score.toLocaleString()}</b></div>
          <div class="r-row"><span>COMMITS PURGED:</span> <b>${state.commitsPurged}</b></div>
          <div class="r-row"><span>PRs MERGED:</span> <b>${state.prsMerged}</b></div>
          <div class="r-row"><span>ISSUES SQUASHED:</span> <b>${state.issuesClosed}</b></div>
          <div class="r-row"><span>TOTAL XP EARNED:</span> <b class="val-green">+${state.xp.toLocaleString()} XP</b></div>
        </div>

        <div class="modal-actions">
          <button class="launch-btn" id="retryBtn">RETRY DEFENSE [SPACE]</button>
        </div>
      </div>
    `;

    const btn = this.overlay.querySelector('#retryBtn');
    const handleAction = () => {
      this.hide();
      window.removeEventListener('keydown', handleKey);
      onRetry();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };

    btn?.addEventListener('click', handleAction);
    window.addEventListener('keydown', handleKey);
  }

  public showVictory(
    state: GameState,
    blueprint: BossBlueprint,
    onContinue: () => void,
    onStore: () => void
  ): void {
    this.overlay.style.display = 'flex';

    const store = Store.getInstance();
    const rank = store.profile.rankName;
    const targetXp = state.xp;

    this.overlay.innerHTML = `
      <div class="modal-card victory-modal victory-pop">
        <div class="victory-header">
          <span class="victory-badge">🏆</span>
          <h2>REPOSITORY SECURED!</h2>
        </div>
        <div class="victory-sub">${blueprint.coreName} PERMANENTLY NEUTRALIZED</div>

        <div class="dev-rank-card rank-pulse">
          <div class="rank-label">CURRENT DEVELOPER RANK</div>
          <div class="rank-value">${rank}</div>
        </div>

        <div class="xp-counter-card">
          <div class="xp-counter-label">MISSION XP REWARDS</div>
          <div class="xp-counter-number" id="xpTickNumber">0</div>
          <div class="xp-progress-hint">+100% REPO COMPLETION BONUS</div>
        </div>

        <div class="report-stats">
          <div class="r-row"><span>FINAL SCORE:</span> <b>${state.score.toLocaleString()}</b></div>
          <div class="r-row"><span>COMMITS PURGED:</span> <b>${state.commitsPurged}</b></div>
          <div class="r-row"><span>PRs MERGED:</span> <b>${state.prsMerged}</b></div>
          <div class="r-row"><span>ISSUES CLOSED:</span> <b>${state.issuesClosed}</b></div>
        </div>

        <div class="modal-actions victory-actions">
          <button class="launch-btn" id="victoryBtn">CONTINUE [SPACE]</button>
          <button class="store-nav-btn" id="victoryStoreBtn">VISIT GIT_STORE.EXE ⚡</button>
        </div>
      </div>
    `;

    // Dynamic XP Counter Animation
    const xpEl = this.overlay.querySelector('#xpTickNumber');
    if (xpEl && targetXp > 0) {
      let current = 0;
      const step = Math.max(1, Math.round(targetXp / 35));
      const interval = setInterval(() => {
        current += step;
        if (current >= targetXp) {
          current = targetXp;
          clearInterval(interval);
          SFX.playPowerup();
        } else {
          if (current % (step * 3) === 0) SFX.playShieldHit();
        }
        xpEl.textContent = `+${current.toLocaleString()} XP`;
      }, 30);
    }

    const contBtn = this.overlay.querySelector('#victoryBtn');
    const storeBtn = this.overlay.querySelector('#victoryStoreBtn');

    const handleAction = () => {
      this.hide();
      window.removeEventListener('keydown', handleKey);
      onContinue();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };

    contBtn?.addEventListener('click', handleAction);
    storeBtn?.addEventListener('click', () => {
      this.hide();
      onStore();
    });
    window.addEventListener('keydown', handleKey);
  }

  public hide(): void {
    this.overlay.style.display = 'none';
  }
}
