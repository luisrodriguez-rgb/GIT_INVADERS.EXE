import { GameState } from '../core/GameState';
import { Player } from '../entities/Player';
import { Boss } from '../entities/Boss';
import { NormalizedGameData } from '../github/Types';
import { Store } from '../store/Store';
import { I18n } from '../i18n/I18n';
import { ViewMode, ZoneId } from '../rendering/ZoneEnvironmentRenderer';

export class HUD {
  private container: HTMLElement;
  private initialized: boolean = false;

  // Cached DOM references (Zero innerHTML thrashing at 60 FPS)
  private repoEl!: HTMLElement;
  private zoneEl!: HTMLElement;
  private waveEl!: HTMLElement;
  private scoreEl!: HTMLElement;
  private streakEl!: HTMLElement;
  private livesEl!: HTMLElement;

  // Boss HUD elements
  private bossBarEl!: HTMLElement;
  private bossNameEl!: HTMLElement;
  private bossPhaseEl!: HTMLElement;
  private bossHpFillEl!: HTMLElement;
  private bossHpTextEl!: HTMLElement;
  private bossAdaptiveEl!: HTMLElement;
  private bossModulesEl!: HTMLElement;
  private bossPhasePills: HTMLElement[] = [];

  // Bottom Stats
  private commitsEl!: HTMLElement;
  private prsEl!: HTMLElement;
  private issuesEl!: HTMLElement;
  private xpEl!: HTMLElement;
  private levelEl!: HTMLElement;

  // Flight & Ability Buttons
  private loopBtnEl!: HTMLElement;
  private loopValEl!: HTMLElement;
  private viewBtnEl!: HTMLElement;
  private viewValEl!: HTMLElement;
  private boostBtnEl!: HTMLElement;
  private boostValEl!: HTMLElement;
  private missileBtnEl!: HTMLElement;
  private missilePips: HTMLElement[] = [];

  private rebaseBtnEl!: HTMLElement;
  private rebaseValEl!: HTMLElement;
  private stashBtnEl!: HTMLElement;
  private stashKeyEl!: HTMLElement;
  private stashValEl!: HTMLElement;
  private pushBtnEl!: HTMLElement;
  private pushValEl!: HTMLElement;
  private pushFillEl!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  private initDOM(): void {
    const t = I18n.getInstance().t;
    const octocatSvg = `
      <svg height="15" width="15" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle; margin-right: 5px; color: #00e5ff;">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    `;

    this.container.innerHTML = `
      <div class="hud-top">
        <div class="hud-brand-repo">
          <div class="hud-brand-title">${octocatSvg} <span>GIT_INVADERS.EXE</span></div>
          <div class="hud-repo-tag">REPO: <span class="hud-cyan" id="hudRepoVal">sketion</span> <span class="hud-zone-chip" id="hudZoneVal">Z01</span></div>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudWave}</span>
          <span class="hud-val" id="hudWaveVal">1/3</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudScore}</span>
          <span class="hud-val hud-cyan" id="hudScoreVal">000000</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudStreak}</span>
          <span class="hud-val hud-yellow" id="hudStreakVal">1.0x</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">${t.hudLives}</span>
          <span class="hud-val hud-cyan" id="hudLivesVal">▲ ▲ ▲</span>
        </div>
      </div>

      <div class="boss-hud-bar" id="hudBossBar" style="display: none;">
        <div class="boss-hud-title">
          <span id="hudBossName" style="font-weight: 800;">CORE</span>
          <span class="boss-modules-tag" id="hudBossModules">PYLONS: 3/3</span>
          <span class="boss-phase-badge" id="hudBossPhase">PHASE 1</span>
        </div>
        <div class="boss-hp-track">
          <div class="boss-hp-fill" id="hudBossHpFill" style="width: 100%;"></div>
        </div>
        <div class="boss-phases-strip" id="hudBossPhasesStrip">
          <span class="bp-step" data-p="1">1. CORE BREACH</span>
          <span class="bp-step" data-p="2">2. DEPENDENCY HELL</span>
          <span class="bp-step" data-p="3">3. MERGE CONFLICT</span>
          <span class="bp-step" data-p="4">4. FINAL PUSH</span>
        </div>
        <div class="boss-hp-text" id="hudBossHpText">HP: 100%</div>
        <div class="boss-adaptive-alert" id="hudBossAdaptive" style="display: none;"></div>
      </div>

      <div class="hud-bottom">
        <div class="hud-stats-group">
          <div class="hud-stat"><span class="hud-tag">${t.hangarCommits}:</span> <b id="hudCommitsVal">0</b></div>
          <div class="hud-stat"><span class="hud-tag">${t.hangarPrs}:</span> <b id="hudPrsVal">0</b></div>
          <div class="hud-stat"><span class="hud-tag">${t.hangarIssues}:</span> <b id="hudIssuesVal">0</b></div>
          <div class="hud-stat"><span class="hud-tag">${t.hangarXp}:</span> <b id="hudXpVal">0</b></div>
          <div class="hud-stat rank-badge-tag"><span id="hudLevelVal">${t.storeLevel} 1</span></div>
        </div>

        <div class="hud-powers-group">
          <button class="power-slot flight-slot" id="hudBtnLoop" title="Acrobacia Evasiva 360° [C]">
            <span class="power-key">[C] LOOP:</span>
            <span class="power-val" id="hudLoopVal">RDY</span>
          </button>

          <button class="power-slot flight-slot" id="hudBtnView" title="Cambiar Vista 2.5D / Top-Down [V]">
            <span class="power-key">[V] VIEW:</span>
            <span class="power-val" id="hudViewVal">2.5D</span>
          </button>

          <button class="power-slot flight-slot" id="hudBtnBoost" title="Postcombustión [W / ↑]">
            <span class="power-key">[W] BOOST:</span>
            <span class="power-val" id="hudBoostVal">OFF</span>
          </button>

          <button class="power-slot missile-slot" id="hudBtnMissile" title="Disparar Misiles Teledirigidos [F]">
            <span class="power-key">[F] MSL</span>
            <span class="missile-pips-row" id="hudMissilePips">
              <span class="m-pip filled"></span>
              <span class="m-pip filled"></span>
              <span class="m-pip filled"></span>
              <span class="m-pip filled"></span>
              <span class="m-pip filled"></span>
              <span class="m-pip filled"></span>
            </span>
          </button>

          <button class="power-slot" id="hudBtnRebase" title="Git Rebase Chrono Slow-Mo [Q]">
            <span class="power-key">[Q] REBASE:</span>
            <span class="power-val" id="hudRebaseVal">LOCKED</span>
          </button>

          <button class="power-slot" id="hudBtnStash" title="Habilidad Especial de Nave [E]">
            <span class="power-key" id="hudStashKey">[E] SKILL:</span>
            <span class="power-val" id="hudStashVal">RDY</span>
          </button>

          <button class="overdrive-meter-box" id="hudBtnPush" title="Git Push --Force Overdrive [SHIFT]">
            <div class="overdrive-label">
              <span>PUSH --FORCE</span>
              <span id="hudPushVal">0%</span>
            </div>
            <div class="overdrive-track">
              <div class="overdrive-fill" id="hudPushFill" style="width: 0%"></div>
            </div>
          </button>
        </div>
      </div>
    `;

    this.repoEl = this.container.querySelector('#hudRepoVal')!;
    this.zoneEl = this.container.querySelector('#hudZoneVal')!;
    this.waveEl = this.container.querySelector('#hudWaveVal')!;
    this.scoreEl = this.container.querySelector('#hudScoreVal')!;
    this.streakEl = this.container.querySelector('#hudStreakVal')!;
    this.livesEl = this.container.querySelector('#hudLivesVal')!;

    this.bossBarEl = this.container.querySelector('#hudBossBar')!;
    this.bossNameEl = this.container.querySelector('#hudBossName')!;
    this.bossModulesEl = this.container.querySelector('#hudBossModules')!;
    this.bossPhaseEl = this.container.querySelector('#hudBossPhase')!;
    this.bossHpFillEl = this.container.querySelector('#hudBossHpFill')!;
    this.bossHpTextEl = this.container.querySelector('#hudBossHpText')!;
    this.bossAdaptiveEl = this.container.querySelector('#hudBossAdaptive')!;
    this.bossPhasePills = Array.from(this.container.querySelectorAll('#hudBossPhasesStrip .bp-step'));

    this.commitsEl = this.container.querySelector('#hudCommitsVal')!;
    this.prsEl = this.container.querySelector('#hudPrsVal')!;
    this.issuesEl = this.container.querySelector('#hudIssuesVal')!;
    this.xpEl = this.container.querySelector('#hudXpVal')!;
    this.levelEl = this.container.querySelector('#hudLevelVal')!;

    this.loopBtnEl = this.container.querySelector('#hudBtnLoop')!;
    this.loopValEl = this.container.querySelector('#hudLoopVal')!;
    this.viewBtnEl = this.container.querySelector('#hudBtnView')!;
    this.viewValEl = this.container.querySelector('#hudViewVal')!;
    this.boostBtnEl = this.container.querySelector('#hudBtnBoost')!;
    this.boostValEl = this.container.querySelector('#hudBoostVal')!;
    this.missileBtnEl = this.container.querySelector('#hudBtnMissile')!;
    this.missilePips = Array.from(this.container.querySelectorAll('#hudMissilePips .m-pip'));

    this.rebaseBtnEl = this.container.querySelector('#hudBtnRebase')!;
    this.rebaseValEl = this.container.querySelector('#hudRebaseVal')!;
    this.stashBtnEl = this.container.querySelector('#hudBtnStash')!;
    this.stashKeyEl = this.container.querySelector('#hudStashKey')!;
    this.stashValEl = this.container.querySelector('#hudStashVal')!;
    this.pushBtnEl = this.container.querySelector('#hudBtnPush')!;
    this.pushValEl = this.container.querySelector('#hudPushVal')!;
    this.pushFillEl = this.container.querySelector('#hudPushFill')!;

    this.initialized = true;
  }

  public update(
    gameState: GameState,
    player: Player,
    boss: Boss | null,
    gameData: NormalizedGameData | null,
    viewMode: ViewMode = 'ANGLED_25D',
    zoneId: ZoneId = 'ARCHIPELAGO_DIGITAL'
  ): void {
    if (!this.initialized) {
      this.initDOM();
    }

    const t = I18n.getInstance().t;
    const store = Store.getInstance();
    const prof = store.profile;
    const skin = player.activeSkin;

    // Top HUD Telemetry
    this.repoEl.textContent = gameData?.repoName || 'sketion';
    const zoneShort: Record<ZoneId, string> = {
      ARCHIPELAGO_DIGITAL: '[Z] Z01: ARCHIPELAGO',
      CORAL_ATOLL_LAGOON: '[Z] Z02: CORAL ATOLL',
      VOLCANIC_OBSIDIAN_SEA: '[Z] Z03: VOLCANIC SEA',
      CYBER_GLACIER_FJORD: '[Z] Z04: GLACIER FJORD',
      VERDANT_CANYON_DELTA: '[Z] Z05: CANYON DELTA',
      ATMOS_CYBER_GRID: '[Z] Z06: CYBER GRID',
      DEPENDENCY_NEBULA: '[Z] Z07: NEBULA',
      CORE_BREACH_HORIZON: '[Z] Z08: CORE BREACH',
    };
    this.zoneEl.textContent = zoneShort[zoneId] || '[Z] Z01';
    this.waveEl.textContent = `${gameState.currentWave}/${gameState.totalWaves}`;
    this.scoreEl.textContent = gameState.score.toString().padStart(6, '0');
    this.streakEl.textContent = `${gameState.streakMultiplier.toFixed(1)}x`;
    this.livesEl.textContent = '▲ '.repeat(Math.max(0, player.lives)).trim() || '0';

    // Boss Telemetry & 4-Phase Tracker
    if (boss && boss.isAlive) {
      this.bossBarEl.style.display = 'block';
      const hpPercent = Math.max(0, Math.round((boss.hp / boss.maxHp) * 100));
      const phaseColor =
        boss.currentPhase >= 4
          ? '#ff0055'
          : boss.currentPhase === 3
          ? '#ef4444'
          : boss.currentPhase === 2
          ? '#f59e0b'
          : boss.blueprint.languageColor;

      this.bossNameEl.textContent = boss.blueprint.coreName;
      this.bossNameEl.style.color = phaseColor;

      const aliveMods =
        (boss.leftModuleAlive ? 1 : 0) + (boss.rightModuleAlive ? 1 : 0) + (boss.auxModuleAlive ? 1 : 0);
      this.bossModulesEl.textContent = `MODS: ${aliveMods}/3`;

      const phaseName = boss.blueprint.phases[boss.currentPhase - 1]?.name || 'FINAL PUSH';
      this.bossPhaseEl.textContent = `PHASE ${boss.currentPhase}/4 // ${phaseName}`;

      this.bossHpFillEl.style.width = `${hpPercent}%`;
      this.bossHpFillEl.style.background = phaseColor;
      this.bossHpTextEl.textContent = `HP: ${Math.max(0, Math.round(boss.hp))} / ${boss.maxHp} (${hpPercent}%)`;

      this.bossPhasePills.forEach((pill) => {
        const pNum = Number(pill.getAttribute('data-p'));
        pill.classList.toggle('active', pNum === boss.currentPhase);
        pill.classList.toggle('cleared', pNum < boss.currentPhase);
      });

      if (boss.activeAdaptiveNotice) {
        this.bossAdaptiveEl.style.display = 'block';
        this.bossAdaptiveEl.textContent = `[AI_TELEMETRY] ${boss.activeAdaptiveNotice}`;
      } else {
        this.bossAdaptiveEl.style.display = 'none';
      }
    } else {
      this.bossBarEl.style.display = 'none';
    }

    // Bottom Stats
    this.commitsEl.textContent = String(gameState.commitsPurged);
    this.prsEl.textContent = String(gameState.prsMerged);
    this.issuesEl.textContent = String(gameState.issuesClosed);
    this.xpEl.textContent = gameState.xp.toLocaleString();
    this.levelEl.textContent = `${t.storeLevel} ${prof.level}`;

    // Flight Controls Status
    const loopReady = player.loopCooldown <= 0 && !player.isLooping;
    this.loopValEl.textContent = player.isLooping ? 'ACTIVE' : loopReady ? 'RDY' : `${Math.ceil(player.loopCooldown)}s`;
    this.loopBtnEl.classList.toggle('power-ready', loopReady);
    this.loopBtnEl.classList.toggle('power-active', player.isLooping);

    this.viewValEl.textContent = viewMode === 'ANGLED_25D' ? '2.5D' : 'TOP';
    this.viewBtnEl.classList.toggle('power-active', viewMode === 'TOP_DOWN');

    this.boostValEl.textContent = player.isBoosting ? 'ON' : 'OFF';
    this.boostBtnEl.classList.toggle('power-active', player.isBoosting);

    this.missileBtnEl.classList.toggle('power-ready', player.missileAmmo >= 2);
    this.missilePips.forEach((pip, idx) => {
      pip.classList.toggle('filled', idx < player.missileAmmo);
    });

    // Rebase [Q]
    const hasRebase = prof.rebaseSlowMoUnlocked || skin.id === 'neon_overdrive' || skin.id === 'rebase_01';
    const rebaseReady = hasRebase && player.rebaseCooldown <= 0;
    this.rebaseValEl.textContent = !hasRebase
      ? t.hudRebaseLocked
      : player.isRebasing
      ? `${player.rebaseTimer.toFixed(1)}s`
      : rebaseReady
      ? 'RDY'
      : `${Math.ceil(player.rebaseCooldown)}s`;
    this.rebaseBtnEl.classList.toggle('power-ready', rebaseReady);
    this.rebaseBtnEl.classList.toggle('power-active', player.isRebasing);

    // Ship Unique Ability [E]
    this.stashKeyEl.textContent = `[E] ${skin.ability.name.split(' ')[0]}:`;
    let eReady = false;
    let eActive = false;
    let eText = 'RDY';
    if (skin.id === 'phantom_violet' || skin.id === 'purple') {
      eActive = player.isStashed;
      eReady = player.stashCooldown <= 0 && !eActive;
      eText = eActive ? `${player.stashTimer.toFixed(1)}s` : eReady ? 'RDY' : `${Math.ceil(player.stashCooldown)}s`;
    } else if (skin.id === 'solar_gold' || skin.id === 'merge_hammer') {
      eReady = player.mergeCharge >= 40;
      eText = `${player.mergeCharge}%`;
    } else if (skin.id === 'emerald_glitch' || skin.id === 'branch_runner') {
      eActive = player.branchDronesActive;
      eReady = player.branchCooldown <= 0 && !eActive;
      eText = eActive ? `${player.branchDronesTimer.toFixed(1)}s` : eReady ? 'RDY' : `${Math.ceil(player.branchCooldown)}s`;
    } else if (skin.id === 'quantum_citadel' || skin.id === 'octo_core') {
      eActive = player.octoDronesCount > 0;
      eReady = player.octoCooldown <= 0;
      eText = eActive ? `${player.octoDronesCount} DRN` : eReady ? 'RDY' : `${Math.ceil(player.octoCooldown)}s`;
    } else if (skin.id === 'hyper_void' || skin.id === 'void_stalker') {
      eActive = player.temporalRiftTimer > 0;
      eReady = player.temporalRiftCooldown <= 0;
      eText = eActive ? `${player.temporalRiftTimer.toFixed(1)}s` : eReady ? 'RDY' : `${Math.ceil(player.temporalRiftCooldown)}s`;
    } else if (skin.id === 'solar_flare' || skin.id === 'solar_phoenix') {
      eReady = player.supernovaCooldown <= 0;
      eText = eReady ? 'RDY' : `${Math.ceil(player.supernovaCooldown)}s`;
    } else if (skin.id === 'cyber_falcon' || skin.id === 'compiler_delta' || skin.id === 'cyan') {
      eActive = player.falconOverclockTimer > 0;
      eReady = player.falconCooldown <= 0;
      eText = eActive ? `${player.falconOverclockTimer.toFixed(1)}s` : eReady ? 'RDY' : `${Math.ceil(player.falconCooldown)}s`;
    } else if (skin.id === 'neon_overdrive' || skin.id === 'rebase_01') {
      eActive = player.isRebasing;
      eReady = player.rebaseCooldown <= 0;
      eText = eActive ? `${player.rebaseTimer.toFixed(1)}s` : eReady ? 'RDY' : `${Math.ceil(player.rebaseCooldown)}s`;
    } else {
      eReady = player.abilityECooldown <= 0;
      eText = eReady ? 'RDY' : `${Math.ceil(player.abilityECooldown)}s`;
    }

    this.stashValEl.textContent = eText;
    this.stashBtnEl.classList.toggle('power-ready', eReady);
    this.stashBtnEl.classList.toggle('power-active', eActive);

    // Overdrive [SHIFT]
    const overdrivePercent = Math.min(100, Math.round(player.overdriveCharge));
    const isOverdriveReady = overdrivePercent >= 100;
    this.pushValEl.textContent = isOverdriveReady ? t.hudOverdriveReady : `${overdrivePercent}%`;
    this.pushValEl.classList.toggle('ready-pulse', isOverdriveReady);
    this.pushFillEl.style.width = `${overdrivePercent}%`;
    this.pushFillEl.classList.toggle('overdrive-ready', isOverdriveReady);
    this.pushBtnEl.classList.toggle('overdrive-ready', isOverdriveReady);
  }
}
