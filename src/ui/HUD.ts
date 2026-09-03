import { GameState } from '../core/GameState';
import { Player } from '../entities/Player';
import { Boss } from '../entities/Boss';
import { NormalizedGameData } from '../github/Types';
import { Store } from '../store/Store';

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
    const livesIcons = '▲ '.repeat(Math.max(0, player.lives));
    const overdrivePercent = Math.min(100, Math.round(player.overdriveCharge));
    const isOverdriveReady = overdrivePercent >= 100;

    const store = Store.getInstance();
    const prof = store.profile;

    // Power status badges
    const hasRebase = prof.rebaseSlowMoUnlocked;
    const rebaseReady = hasRebase && player.rebaseCooldown <= 0;
    const rebaseStatusText = !hasRebase
      ? 'STORE LOCKED'
      : player.isRebasing
      ? `ACTIVE (${player.rebaseTimer.toFixed(1)}s)`
      : rebaseReady
      ? 'READY [Q]'
      : `${Math.ceil(player.rebaseCooldown)}s`;

    const stashReady = player.stashCooldown <= 0 && !player.hasShield;
    const stashStatusText = player.hasShield
      ? 'SHIELD ACTIVE'
      : stashReady
      ? 'READY [E]'
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

    this.container.innerHTML = `
      <div class="hud-top">
        <div class="hud-item">
          <span class="hud-label">TARGET REPO</span>
          <span class="hud-val hud-cyan">${gameData?.repoName || 'SINGULARITY'}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">WAVE</span>
          <span class="hud-val">${gameState.currentWave} / ${gameState.totalWaves}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">SCORE</span>
          <span class="hud-val hud-green">${gameState.score.toLocaleString()}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">HIGH SCORE</span>
          <span class="hud-val hud-yellow">${gameState.highScore.toLocaleString()}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">STREAK</span>
          <span class="hud-val hud-yellow">${gameState.streakMultiplier.toFixed(1)}x</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">LIVES</span>
          <span class="hud-val hud-pink">${livesIcons}</span>
        </div>
      </div>

      ${bossHtml}

      <div class="hud-bottom">
        <div class="hud-stats-group">
          <div class="hud-stat">
            <span class="hud-tag">COMMITS:</span> <b>${gameState.commitsPurged}</b>
          </div>
          <div class="hud-stat">
            <span class="hud-tag">PRs:</span> <b>${gameState.prsMerged}</b>
          </div>
          <div class="hud-stat">
            <span class="hud-tag">ISSUES:</span> <b>${gameState.issuesClosed}</b>
          </div>
          <div class="hud-stat">
            <span class="hud-tag">XP:</span> <b>${gameState.xp.toLocaleString()}</b>
          </div>
          <div class="hud-stat rank-badge-tag">
            <span>LVL ${prof.level}</span>
          </div>
        </div>

        <div class="hud-powers-group">
          <!-- Tactical Power [Q]: Rebase -->
          <div class="power-slot ${rebaseReady ? 'power-ready' : ''} ${player.isRebasing ? 'power-active' : ''}">
            <span class="power-key">[Q] REBASE:</span>
            <span class="power-val">${rebaseStatusText}</span>
          </div>

          <!-- Tactical Power [E]: Stash -->
          <div class="power-slot ${stashReady ? 'power-ready' : ''} ${player.hasShield ? 'power-active' : ''}">
            <span class="power-key">[E] STASH:</span>
            <span class="power-val">${stashStatusText}</span>
          </div>

          <!-- Overdrive Bar -->
          <div class="overdrive-meter-box">
            <div class="overdrive-label">
              <span>GIT PUSH --FORCE</span>
              <span class="${isOverdriveReady ? 'ready-pulse' : ''}">${isOverdriveReady ? 'READY [SHIFT]' : `${overdrivePercent}%`}</span>
            </div>
            <div class="overdrive-track">
              <div class="overdrive-fill ${isOverdriveReady ? 'overdrive-ready' : ''}" style="width: ${overdrivePercent}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
