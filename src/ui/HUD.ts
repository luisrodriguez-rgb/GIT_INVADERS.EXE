import { GameState } from '../core/GameState';
import { Player } from '../entities/Player';
import { Boss } from '../entities/Boss';
import { NormalizedGameData } from '../github/Types';
import { Store } from '../store/Store';
import { I18n } from '../i18n/I18n';

export class HUD {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public update(
    gameState: GameState,
    player: Player,
    boss: Boss | null,
    gameData: NormalizedGameData | null
  ): void {
    const i18n = I18n.getInstance();
    const t = i18n.t;
    const livesIcons = '▲ '.repeat(Math.max(0, player.lives));
    const overdrivePercent = Math.min(100, Math.round(player.overdriveCharge));
    const isOverdriveReady = overdrivePercent >= 100;

    const store = Store.getInstance();
    const prof = store.profile;

    // Power status badges
    const hasRebase = prof.rebaseSlowMoUnlocked;
    const rebaseReady = hasRebase && player.rebaseCooldown <= 0;
    const rebaseStatusText = !hasRebase
      ? t.hudRebaseLocked
      : player.isRebasing
      ? `${t.hudRebaseActive} (${player.rebaseTimer.toFixed(1)}s)`
      : rebaseReady
      ? t.hudRebaseReady
      : `${Math.ceil(player.rebaseCooldown)}s`;

    const stashReady = player.stashCooldown <= 0 && !player.hasShield;
    const stashStatusText = player.hasShield
      ? t.hudShieldActive
      : stashReady
      ? t.hudStashReady
      : `${Math.ceil(player.stashCooldown)}s`;

    let bossHtml = '';
    if (boss && boss.isAlive) {
      const hpPercent = Math.max(0, Math.round((boss.hp / boss.maxHp) * 100));
      const phaseColor = boss.currentPhase === 3 ? '#ef4444' : boss.blueprint.languageColor;
      bossHtml = `
        <div class="boss-hud-bar">
          <div class="boss-hud-title">
            <span style="color: ${phaseColor}; font-weight: 700;">${boss.blueprint.coreName}</span>
            <span class="boss-phase-badge">PHASE ${boss.currentPhase} // ${boss.blueprint.phases[boss.currentPhase - 1]?.name || ''}</span>
          </div>
          <div class="boss-hp-track">
            <div class="boss-hp-fill" style="width: ${hpPercent}%; background: ${phaseColor};"></div>
          </div>
          <div class="boss-hp-text">HP: ${boss.hp} / ${boss.maxHp} (${hpPercent}%)</div>
        </div>
      `;
    }

    const octocatSvg = `
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 6px; color: #00e5ff;">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;

    const paddedScore = gameState.score.toString().padStart(6, '0');

    this.container.innerHTML = `
      <div class="hud-top">
        <div class="hud-brand-repo">
          <div class="hud-brand-title">${octocatSvg} <span>GIT_INVADERS.EXE</span></div>
          <div class="hud-repo-tag">REPO: <span class="hud-cyan">${gameData?.repoName || 'sketion'}</span></div>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudWave}</span>
          <span class="hud-val">${gameState.currentWave}/${gameState.totalWaves}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudScore}</span>
          <span class="hud-val hud-cyan">${paddedScore}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudStreak}</span>
          <span class="hud-val hud-yellow">${gameState.streakMultiplier.toFixed(1)}x</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudLives}</span>
          <span class="hud-val hud-cyan">${livesIcons}</span>
        </div>
      </div>

      ${bossHtml}

      <div class="hud-bottom">
        <div class="hud-stats-group">
          <div class="hud-stat">
            <span class="hud-tag">${t.hangarCommits}:</span> <b>${gameState.commitsPurged}</b>
          </div>
          <div class="hud-stat">
            <span class="hud-tag">${t.hangarPrs}:</span> <b>${gameState.prsMerged}</b>
          </div>
          <div class="hud-stat">
            <span class="hud-tag">${t.hangarIssues}:</span> <b>${gameState.issuesClosed}</b>
          </div>
          <div class="hud-stat">
            <span class="hud-tag">${t.hangarXp}:</span> <b>${gameState.xp.toLocaleString()}</b>
          </div>
          <div class="hud-stat rank-badge-tag">
            <span>${t.storeLevel} ${prof.level}</span>
          </div>
        </div>

        <div class="hud-powers-group">
          <!-- Tactical Power [Q]: Rebase -->
          <button class="power-slot ${rebaseReady ? 'power-ready' : ''} ${player.isRebasing ? 'power-active' : ''}" id="hudBtnRebase" title="Trigger Rebase Slow-Mo [Q]">
            <span class="power-key">[Q] REBASE:</span>
            <span class="power-val">${rebaseStatusText}</span>
          </button>

          <!-- Tactical Power [E]: Stash -->
          <button class="power-slot ${stashReady ? 'power-ready' : ''} ${player.hasShield ? 'power-active' : ''}" id="hudBtnStash" title="Deploy Stash Shield [E]">
            <span class="power-key">[E] STASH:</span>
            <span class="power-val">${stashStatusText}</span>
          </button>

          <!-- Overdrive Bar -->
          <button class="overdrive-meter-box ${isOverdriveReady ? 'overdrive-ready' : ''}" id="hudBtnPush" title="Trigger Git Push Overdrive [SHIFT]">
            <div class="overdrive-label">
              <span>GIT PUSH --FORCE</span>
              <span class="${isOverdriveReady ? 'ready-pulse' : ''}">${isOverdriveReady ? t.hudOverdriveReady : `${overdrivePercent}%`}</span>
            </div>
            <div class="overdrive-track">
              <div class="overdrive-fill ${isOverdriveReady ? 'overdrive-ready' : ''}" style="width: ${overdrivePercent}%"></div>
            </div>
          </button>
        </div>
      </div>
    `;
  }
}
