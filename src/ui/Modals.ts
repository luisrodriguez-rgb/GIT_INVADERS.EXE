import { BossBlueprint } from '../github/Types';
import { GameState } from '../core/GameState';
import { Store } from '../store/Store';
import { SFX } from '../audio/SFX';
import { Sprites } from '../rendering/Sprites';
import { I18n } from '../i18n/I18n';
import { ARCHETYPE_DATABASE } from '../procedural/BossGenerator';

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
    const t = I18n.getInstance().t;
    this.overlay.style.display = 'flex';
    this.overlay.innerHTML = `
      <div class="modal-card pause-modal">
        <div class="pause-header">
          <span class="pause-led"></span>
          <h2>${t.modalPauseTitle}</h2>
          <span class="pause-sub">${t.modalPauseSub}</span>
        </div>

        <div class="pause-stats-grid">
          <div class="p-card">
            <span class="p-lbl">${t.hudScore}</span>
            <span class="p-val val-green">${state.score.toLocaleString()}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">${t.hudWave}</span>
            <span class="p-val val-cyan">${state.currentWave} / ${state.totalWaves}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">${t.hangarCommits}</span>
            <span class="p-val">${state.commitsPurged}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">${t.hangarPrs}</span>
            <span class="p-val val-purple">${state.prsMerged}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">${t.hangarIssues}</span>
            <span class="p-val val-red">${state.issuesClosed}</span>
          </div>
          <div class="p-card">
            <span class="p-lbl">${t.hudStreak}</span>
            <span class="p-val val-yellow">${state.streakMultiplier.toFixed(1)}x</span>
          </div>
        </div>

        <div class="pause-actions">
          <button class="launch-btn" id="resumeBtn">${t.modalResumeBtn}</button>
          <button class="store-nav-btn" id="pauseStoreBtn">${t.modalOpenStoreBtn}</button>
          <button class="abort-btn" id="abortBtn">${t.modalAbortBtn}</button>
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

    const archetypeKey = blueprint.archetype || 'commit_core';
    const archetypeData = blueprint.archetypeData || ARCHETYPE_DATABASE[archetypeKey] || ARCHETYPE_DATABASE.commit_core;
    const modifierTitle = blueprint.modifierTitle || `${archetypeData.title} // BASE ARCHETYPE`;

    const octocatSvg = `
      <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 6px; color: #ff0055;">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;

    const renderRatingBlocks = (percent: number, color: string) => {
      const totalBlocks = 10;
      const filled = Math.round((percent / 100) * totalBlocks);
      let html = '<div class="rating-bar-blocks">';
      for (let i = 0; i < totalBlocks; i++) {
        const isF = i < filled;
        html += `<span class="rating-block ${isF ? 'is-filled' : 'is-empty'}" style="${isF ? `background: ${color}; box-shadow: 0 0 5px ${color};` : 'background: rgba(255,255,255,0.08);'}"></span>`;
      }
      html += '</div>';
      return html;
    };

    this.overlay.innerHTML = `
      <div class="modal-card boss-blueprint-modal" style="max-width: 580px;">
        <!-- Header Brand Bar -->
        <div class="report-header" style="border-bottom-color: rgba(255, 0, 85, 0.25); margin-bottom: 6px;">
          <div class="report-brand" style="color: #ff0055; display: flex; align-items: center; font-weight: 800;">
            ${octocatSvg}
            <span>GIT_INVADERS.EXE // CODE BOSS DATABASE</span>
          </div>
          <div class="target-badge" style="color: #00e5ff; border-color: rgba(0, 229, 255, 0.4); background: rgba(0, 229, 255, 0.1);">
            TARGET: ${blueprint.repoName}
          </div>
        </div>

        <!-- Boss Code & Archetype Title -->
        <div class="boss-infographic-header" style="text-align: left; padding: 4px 6px; margin-bottom: 4px;">
          <div style="font-size: 1.15rem; font-weight: 900; color: #ffffff; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center;">
            <span>${archetypeData.codeNumber}. ${archetypeData.title}</span>
            <span style="font-size: 0.72rem; color: #38bdf8; font-family: var(--font-mono);">${archetypeData.canonicalRepo}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
            LENGUAJES: <b style="color: ${blueprint.languageColor};">${blueprint.language}</b> // MOD: <b style="color: #f43f5e;">${blueprint.mutation || 'STANDARD'}</b>
          </div>
        </div>

        <!-- Animated Boss Canvas Stage -->
        <div class="boss-canvas-container" style="display: flex; justify-content: center; align-items: center; background: radial-gradient(circle, rgba(255,0,85,0.14) 0%, rgba(0,0,0,0.5) 75%); border: 1px solid rgba(255, 0, 85, 0.3); border-radius: 6px; padding: 8px; margin: 4px 0;">
          <canvas id="bossDetectedCanvas" width="240" height="110"></canvas>
        </div>

        <!-- Stat Bars Grid (Matching Infographic) -->
        <div class="boss-infographic-stats" style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; padding: 8px 12px; margin: 6px 0; display: flex; flex-direction: column; gap: 5px;">
          <div class="stat-rating-row" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-family: var(--font-mono);">
            <span style="color: #94a3b8; width: 90px;">HP</span>
            ${renderRatingBlocks(archetypeData.baseHpRating, '#ef4444')}
          </div>
          <div class="stat-rating-row" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-family: var(--font-mono);">
            <span style="color: #94a3b8; width: 90px;">ESCUDOS</span>
            ${renderRatingBlocks(archetypeData.shieldRating, '#00e5ff')}
          </div>
          <div class="stat-rating-row" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-family: var(--font-mono);">
            <span style="color: #94a3b8; width: 90px;">ATAQUE</span>
            ${renderRatingBlocks(archetypeData.attackRating, '#facc15')}
          </div>
          <div class="stat-rating-row" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-family: var(--font-mono);">
            <span style="color: #94a3b8; width: 90px;">VELOCIDAD</span>
            ${renderRatingBlocks(archetypeData.speedRating, '#38bdf8')}
          </div>
          <div class="stat-rating-row" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; font-family: var(--font-mono);">
            <span style="color: #a855f7; font-weight: 800; width: 90px;">${archetypeData.specialStatName}</span>
            ${renderRatingBlocks(archetypeData.specialStatValue, '#c084fc')}
          </div>
        </div>

        <!-- Abilities Row -->
        <div class="boss-abilities-box" style="margin: 4px 0;">
          <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px;">ATAQUES DE ARQUETIPO:</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
            ${archetypeData.abilities
              .map(
                (ab) => `
              <div class="ability-card" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 4px; padding: 5px; text-align: center;" title="${ab.description}">
                <div style="font-size: 0.8rem; color: #00e5ff; font-family: var(--font-mono); margin-bottom: 2px;">${ab.icon}</div>
                <div style="font-size: 0.65rem; font-weight: 800; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ab.name}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Concept Quote Box -->
        <div class="boss-concept-quote" style="background: rgba(255, 0, 85, 0.08); border-left: 3px solid #ff0055; padding: 6px 10px; font-size: 0.72rem; font-style: italic; color: #cbd5e1; margin: 6px 0; font-family: var(--font-mono);">
          "${archetypeData.conceptQuote}"
        </div>

        <!-- Launch Button -->
        <div class="blueprint-actions" style="margin-top: 6px;">
          <button class="launch-btn" id="engageBossBtn" style="background: linear-gradient(135deg, #ff0055, #c026d3); border: none; padding: 11px; font-weight: 800; font-family: var(--font-mono); width: 100%; cursor: pointer; border-radius: 4px; color: #fff; letter-spacing: 1px; font-size: 0.88rem;">INICIAR COMBATE // ENGAGE REPOSITORY [SPACE]</button>
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
          Sprites.drawBoss(
            ctx,
            canvas.width / 2 - 45,
            canvas.height / 2 - 32,
            90,
            64,
            2,
            t,
            blueprint.languageColor || '#ff0055',
            blueprint.archetype || blueprint.chassisType || 'commit_core'
          );
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
    const t = I18n.getInstance().t;
    this.overlay.style.display = 'flex';
    const isNewRecord = state.score >= state.highScore && state.score > 0;
    const isVictory = outcome === 'ACCOMPLISHED';

    this.overlay.innerHTML = `
      <div class="modal-card mission-report-card">
        <div class="report-header">
          <span class="report-brand">GIT_INVADERS.EXE</span>
          <span class="report-status ${isVictory ? 'status-cleared' : 'status-term'}">
            ${isVictory ? t.modalVictoryTitle : t.modalGameOverTitle}
          </span>
        </div>

        <div class="report-title-row">
          <h2 class="${isVictory ? 'text-green' : 'text-cyan'}">
            ${isVictory ? t.modalVictoryTitle : t.modalGameOverTitle}
          </h2>
          <div class="target-badge">[+] TARGET: ${state.currentWave > 0 ? 'sketion' : 'CORE'}</div>
        </div>

        <div class="report-grid-two-col">
          <!-- Left Column: Core Stats -->
          <div class="report-col-left">
            <div class="r-metric">
              <span class="r-label">${t.hudScore}:</span>
              <span class="r-val val-cyan">
                ${state.score.toLocaleString()}
                ${isNewRecord ? '<span class="new-record-pill">[ NEW RECORD! ]</span>' : ''}
              </span>
            </div>
            <div class="r-metric">
              <span class="r-label">${t.hangarCommits}:</span>
              <span class="r-val">${state.commitsPurged}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">${t.hangarPrs}:</span>
              <span class="r-val val-purple">${state.prsMerged}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">${t.hangarIssues}:</span>
              <span class="r-val val-red">${state.issuesClosed}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">${t.hudWave}:</span>
              <span class="r-val">${state.currentWave} / ${state.totalWaves}</span>
            </div>
          </div>

          <!-- Right Column: Performance & Unlocks -->
          <div class="report-col-right">
            <div class="r-subhead">PERFORMANCE:</div>
            <div class="r-metric">
              <span class="r-label">${t.hudStreak}:</span>
              <span class="r-val val-yellow">x${state.streakMultiplier.toFixed(1)}</span>
            </div>
            <div class="r-metric">
              <span class="r-label">${t.hangarXp}:</span>
              <span class="r-val val-green">+${state.xp.toLocaleString()} XP</span>
            </div>
            <div class="r-metric">
              <span class="r-label">${t.hangarThreatLevel}:</span>
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
            ${isVictory ? t.modalNextSectorBtn : t.modalRetryBtn}
          </button>
          <button class="secondary-report-btn" id="reportSecondaryBtn">
            ${isVictory ? t.storeTitle : t.btnLobby}
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

  /**
   * Displays the Boss DNA / Genome Card modal with deterministic seed and multidimensional matrix.
   */
  public showBossDnaCard(blueprint: BossBlueprint): void {
    const genome = blueprint.genome;
    const archetypeData = blueprint.archetypeData;
    const matrix = genome.behaviorMatrix;

    this.overlay.style.display = 'flex';
    this.overlay.innerHTML = `
      <div class="modal-card boss-dna-card-modal" style="max-width: 540px; font-family: var(--font-mono);">
        <div class="report-header" style="border-bottom-color: rgba(0, 229, 255, 0.3); margin-bottom: 8px;">
          <div class="report-brand" style="color: #00e5ff; font-weight: 900; letter-spacing: 1px;">
            <span>GIT_INVADERS.EXE // BOSS GENOME TELEMETRY</span>
          </div>
          <div class="target-badge" style="color: #ffd600; border-color: #ffd600; background: rgba(255, 214, 0, 0.1);">
            SEED: #${genome.seed}
          </div>
        </div>

        <div style="font-size: 1.05rem; font-weight: 900; color: #ffffff; letter-spacing: 1px; margin-bottom: 2px;">
          ${archetypeData.codeNumber}. ${archetypeData.title}
        </div>
        <div style="font-size: 0.74rem; color: #38bdf8; margin-bottom: 10px;">
          MUTATION: <b style="color: #f43f5e;">${blueprint.mutation || 'STANDARD'}</b> // STACK: <b style="color: ${blueprint.languageColor};">${blueprint.language.toUpperCase()} HEAVY</b>
        </div>

        <!-- Genome Stats Specs Table -->
        <div style="background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; padding: 8px 12px; margin-bottom: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 0.72rem;">
          <div><span style="color: #94a3b8;">AMENAZA:</span> <b style="color: #ef4444;">${genome.ratings.threat}</b></div>
          <div><span style="color: #94a3b8;">COMPLEJIDAD:</span> <b style="color: #38bdf8;">${genome.ratings.complexity}</b></div>
          <div><span style="color: #94a3b8;">ENJAMBRE:</span> <b style="color: #c084fc;">${genome.ratings.swarm}</b></div>
          <div><span style="color: #94a3b8;">BLINDAJE:</span> <b style="color: #00e5ff;">${genome.ratings.armor}</b></div>
          <div><span style="color: #94a3b8;">ATAQUE:</span> <b style="color: #facc15;">${genome.ratings.attack}</b></div>
          <div><span style="color: #94a3b8;">FASES:</span> <b style="color: #4ade80;">${genome.phases}</b></div>
        </div>

        <!-- Multidimensional Behavior Matrix -->
        <div style="font-size: 0.68rem; color: #94a3b8; font-weight: 800; letter-spacing: 1px; margin-bottom: 6px;">
          MATRIZ DE COMPORTAMIENTO PROCEDURAL (2+ DIMENSIONES):
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; font-size: 0.72rem;">
          <div style="background: rgba(15, 23, 42, 0.7); border-left: 3px solid #00e5ff; padding: 4px 8px; border-radius: 2px;">
            <b style="color: #00e5ff;">[VISUAL]:</b> ${matrix.visual}
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border-left: 3px solid #ef4444; padding: 4px 8px; border-radius: 2px;">
            <b style="color: #ef4444;">[COMBAT]:</b> ${matrix.combat}
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border-left: 3px solid #a855f7; padding: 4px 8px; border-radius: 2px;">
            <b style="color: #a855f7;">[SPAWN]:</b> ${matrix.spawn}
          </div>
          <div style="background: rgba(15, 23, 42, 0.7); border-left: 3px solid #facc15; padding: 4px 8px; border-radius: 2px;">
            <b style="color: #facc15;">[AUDIO]:</b> ${matrix.audio} (${genome.audioBpm} BPM)
          </div>
        </div>

        <button class="launch-btn" id="closeDnaCardBtn" style="background: rgba(0, 229, 255, 0.2); border: 1px solid #00e5ff; color: #00e5ff; padding: 8px; width: 100%; border-radius: 4px; font-weight: 800; cursor: pointer;">
          CERRAR TELEMETRÍA [ESC]
        </button>
      </div>
    `;

    const closeBtn = this.overlay.querySelector('#closeDnaCardBtn');
    const handleClose = () => {
      this.hide();
      window.removeEventListener('keydown', handleKey);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleClose();
      }
    };
    closeBtn?.addEventListener('click', handleClose);
    window.addEventListener('keydown', handleKey);
  }

  public hide(): void {
    this.overlay.style.display = 'none';
  }
}
