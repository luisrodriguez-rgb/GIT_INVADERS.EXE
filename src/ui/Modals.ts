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
          <button class="store-nav-btn" id="pauseStoreBtn">OPEN GIT_STORE.EXE [SYS]</button>
          <button class="abort-btn" id="abortBtn">ABORT TO LOBBY</button>
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
    let bossAnimId: number | null = null;

    const octocatSvg = `
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 6px; color: #ff0055;">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;

    this.overlay.innerHTML = `
      <div class="modal-card boss-blueprint-modal">
        <div class="report-header" style="border-bottom-color: rgba(255, 0, 85, 0.2); margin-bottom: 4px;">
          <div class="report-brand" style="color: #ff0055; display: flex; align-items: center;">
            ${octocatSvg}
            <span>GIT_INVADERS.EXE</span>
          </div>
          <div class="target-badge" style="color: #ff0055; border-color: rgba(255, 0, 85, 0.4); background: rgba(255, 0, 85, 0.1);">
            REPO: ${blueprint.coreName}
          </div>
        </div>

        <div class="blueprint-header-warning">
          <span class="warning-triangle">▲</span>
          <h2>CODE BOSS DETECTED</h2>
          <span class="warning-triangle">▲</span>
        </div>
        <div class="boss-name-sub">${blueprint.coreName}</div>

        <!-- Animated Boss Canvas Stage -->
        <div class="boss-canvas-container" style="display: flex; justify-content: center; align-items: center; background: radial-gradient(circle, rgba(255,0,85,0.12) 0%, rgba(0,0,0,0.4) 70%); border: 1px solid rgba(255, 0, 85, 0.25); border-radius: 6px; padding: 6px; margin: 4px 0;">
          <canvas id="bossDetectedCanvas" width="220" height="120"></canvas>
        </div>

        <div class="boss-briefing-grid">
          <div class="boss-stats-col">
            <div class="col-title">REPOSITORY STATS:</div>
            <div class="b-stat-row"><span>COMMITS</span> <b>${blueprint.statsDisplay.commits}</b></div>
            <div class="b-stat-row"><span>CONTRIBUTORS</span> <b>${blueprint.statsDisplay.contributors}</b></div>
            <div class="b-stat-row"><span>PRs</span> <b>${blueprint.statsDisplay.pullRequests}</b></div>
            <div class="b-stat-row"><span>ISSUES</span> <b>${blueprint.statsDisplay.issues}</b></div>
            
            <div class="col-title" style="margin-top: 4px;">LANGUAGES:</div>
            <div class="boss-lang-bars">
              <div class="l-bar-row">
                <span class="l-name">TS</span>
                <div class="l-track"><div class="l-fill" style="width: 58%; background: #38bdf8;"></div></div>
              </div>
              <div class="l-bar-row">
                <span class="l-name">JS</span>
                <div class="l-track"><div class="l-fill" style="width: 24%; background: #facc15;"></div></div>
              </div>
              <div class="l-bar-row">
                <span class="l-name">CSS</span>
                <div class="l-track"><div class="l-fill" style="width: 12%; background: #00e5ff;"></div></div>
              </div>
              <div class="l-bar-row">
                <span class="l-name">HTML</span>
                <div class="l-track"><div class="l-fill" style="width: 6%; background: #f97316;"></div></div>
              </div>
            </div>
          </div>

          <div class="boss-phases-col">
            <div class="col-title">BOSS PHASES:</div>
            <div class="phase-item"><span>1.</span> CORE BREACH</div>
            <div class="phase-item"><span>2.</span> DEPENDENCY HELL</div>
            <div class="phase-item"><span>3.</span> MERGE CONFLICT</div>
            <div class="phase-item"><span>4.</span> FINAL PUSH</div>

            <div class="boss-health-preview">
              <div class="hp-label">
                <span>${blueprint.coreName}</span>
                <span class="val-pink">100%</span>
              </div>
              <div class="hp-track-preview">
                <div class="hp-fill-preview"></div>
              </div>
            </div>

            <div class="boss-briefing-alert">
              PREPARE FOR COMBAT // THIS REPOSITORY HAS EVOLVED... THE CODE BOSS IS READY.
            </div>
          </div>
        </div>

        <div class="blueprint-actions" style="margin-top: 6px;">
          <button class="launch-btn" id="engageBossBtn" style="background: linear-gradient(135deg, #ff0055, #c026d3); border: none; padding: 10px; font-weight: 800; font-family: var(--font-mono); width: 100%; cursor: pointer; border-radius: 4px; color: #fff;">ENGAGE REPOSITORY CORE [SPACE]</button>
        </div>
      </div>
    `;

    // Start boss preview animation
    const canvas = this.overlay.querySelector('#bossDetectedCanvas') as HTMLCanvasElement | null;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let t = 0;
        const renderBossLoop = () => {
          t += 0.03;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Subtle tech grid
          ctx.strokeStyle = 'rgba(255, 0, 85, 0.08)';
          ctx.lineWidth = 1;
          for (let x = 0; x <= canvas.width; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y <= canvas.height; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
          Sprites.drawBoss(ctx, canvas.width / 2 - 40, canvas.height / 2 - 30, 80, 60, 2, t, blueprint.languageColor || '#ff0055');
          bossAnimId = requestAnimationFrame(renderBossLoop);
        };
        bossAnimId = requestAnimationFrame(renderBossLoop);
      }
    }

    const btn = this.overlay.querySelector('#engageBossBtn');
    const handleAction = () => {
      if (bossAnimId !== null) cancelAnimationFrame(bossAnimId);
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

  public showGameOver(state: GameState, onRetry: () => void, onLobby?: () => void): void {
    this.renderMissionReport(state, 'TERMINATED', onRetry, onLobby);
  }

  public showVictory(
    state: GameState,
    _blueprint: BossBlueprint,
    onContinue: () => void,
    onStore: () => void
  ): void {
    this.renderMissionReport(state, 'ACCOMPLISHED', onContinue, onStore);
  }

  private renderMissionReport(
    state: GameState,
    outcome: 'TERMINATED' | 'ACCOMPLISHED',
    onPrimary: () => void,
    onSecondary?: () => void
  ): void {
    this.overlay.style.display = 'flex';
    const isNewRecord = state.score >= state.highScore && state.score > 0;
    const isVictory = outcome === 'ACCOMPLISHED';

    this.overlay.innerHTML = `
      <div class="modal-card mission-report-card">
        <div class="report-header">
          <span class="report-brand">GIT_INVADERS.EXE</span>
          <span class="report-status ${isVictory ? 'status-cleared' : 'status-term'}">
            ${isVictory ? 'MISSION COMPLETE // SECURED' : 'MISSION TERMINATED'}
          </span>
        </div>

        <div class="report-title-row">
          <h2 class="${isVictory ? 'text-green' : 'text-cyan'}">
            ${isVictory ? 'MISSION ACCOMPLISHED' : 'MISSION TERMINATED'}
          </h2>
          <div class="target-badge">[+] TARGET: ${state.currentWave > 0 ? 'sketion' : 'CORE'}</div>
        </div>

        <div class="report-grid-two-col">
          <!-- Left Column: Core Stats -->
          <div class="report-col-left">
            <div class="r-metric">
              <span class="r-label">SCORE:</span>
              <span class="r-val val-cyan">
                ${state.score.toLocaleString()}
                ${isNewRecord ? '<span class="new-record-pill">[ NEW RECORD! ]</span>' : ''}
              </span>
            </div>
            <div class="r-metric">
              <span class="r-label">COMMITS DESTROYED:</span>
              <span class="r-val">${state.commitsPurged}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">PRs MERGED:</span>
              <span class="r-val val-purple">${state.prsMerged}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">ISSUES DESTROYED:</span>
              <span class="r-val val-red">${state.issuesClosed}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">WAVES CLEARED:</span>
              <span class="r-val">${state.currentWave} / ${state.totalWaves}</span>
            </div>
          </div>

          <!-- Right Column: Performance & Unlocks -->
          <div class="report-col-right">
            <div class="r-subhead">PERFORMANCE:</div>
            <div class="r-metric">
              <span class="r-label">BEST COMBO:</span>
              <span class="r-val val-yellow">x${state.streakMultiplier.toFixed(1)}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">XP EARNED:</span>
              <span class="r-val val-green">+${state.xp.toLocaleString()} XP</span>
            </div>
            <div class="r-metric">
              <span class="r-label">THREAT REDUCTION:</span>
              <span class="r-val val-cyan">${Math.min(100, Math.round((state.currentWave / state.totalWaves) * 82))}%</span>
            </div>

            <div class="r-subhead" style="margin-top: 8px;">UNLOCKED:</div>
            <div class="report-badges-row">
              <span class="badge-pill badge-gold">MULTI-SHOT</span>
              <span class="badge-pill badge-green">SHIELD</span>
              <span class="badge-pill badge-purple">STREAK x3</span>
            </div>
          </div>
        </div>

        <div class="report-actions-row">
          <button class="primary-report-btn" id="reportPrimaryBtn">
            ${isVictory ? 'RETURN TO HANGAR [SPACE]' : 'RETRY MISSION [SPACE]'}
          </button>
          <button class="secondary-report-btn" id="reportSecondaryBtn">
            ${isVictory ? 'VISIT GIT_STORE.EXE' : 'HANGAR'}
          </button>
        </div>

        <div class="report-footer-note">> MISSION DATA SAVED TO LOCAL STORAGE</div>
      </div>
    `;

    const primaryBtn = this.overlay.querySelector('#reportPrimaryBtn');
    const secondaryBtn = this.overlay.querySelector('#reportSecondaryBtn');

    const handleAction = () => {
      this.hide();
      window.removeEventListener('keydown', handleKey);
      onPrimary();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };

    primaryBtn?.addEventListener('click', handleAction);
    secondaryBtn?.addEventListener('click', () => {
      this.hide();
      window.removeEventListener('keydown', handleKey);
      onSecondary?.();
    });
    window.addEventListener('keydown', handleKey);
  }

  public hide(): void {
    this.overlay.style.display = 'none';
  }
}
