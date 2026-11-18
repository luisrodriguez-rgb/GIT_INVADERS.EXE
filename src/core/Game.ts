import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Entity } from '../entities/Entity';
import { Bunker } from '../entities/Bunker';
import { Boss } from '../entities/Boss';
import { IssueBomber } from '../entities/IssueBomber';
import { ConflictFragment } from '../entities/MergeConflict';
import { MysteryOctocat } from '../entities/MysteryOctocat';
import { HotfixInterceptor } from '../entities/HotfixInterceptor';
import { TechDebtJuggernaut } from '../entities/TechDebtJuggernaut';
import { PipelineTurret } from '../entities/PipelineTurret';
import { ParticleSystem } from '../rendering/Particles';
import { CRTEffects } from '../rendering/CRT';
import { Renderer } from '../rendering/Renderer';
import { GameState } from './GameState';
import { GameLoop } from './GameLoop';
import { CollisionSystem } from './CollisionSystem';
import { NormalizedGameData, GameMode, RepositoryDNA } from '../github/Types';
import { GitHubClient } from '../github/GitHubClient';
import { DataSynthesizer } from '../github/DataSynthesizer';
import { EnemyFactory } from '../procedural/EnemyFactory';
import { Lobby } from '../ui/Lobby';
import { Terminal } from '../ui/Terminal';
import { HUD } from '../ui/HUD';
import { Modals } from '../ui/Modals';
import { StoreModal } from '../ui/StoreModal';
import { Store } from '../store/Store';
import { AudioEngine } from '../audio/AudioEngine';
import { SFX } from '../audio/SFX';
import { Music } from '../audio/Music';

export class Game {
  public canvas: HTMLCanvasElement;
  public renderer: Renderer;
  public loop: GameLoop;
  public state: GameState;
  public particles: ParticleSystem;
  public crt: CRTEffects;

  public player: Player;
  public projectiles: Projectile[] = [];
  public enemies: Entity[] = [];
  public bunkers: Bunker[] = [];
  public boss: Boss | null = null;

  public gameData: NormalizedGameData | null = null;

  public lobby: Lobby;
  public terminal: Terminal;
  public hud: HUD;
  public modals: Modals;
  public storeModal: StoreModal;

  public isPaused: boolean = false;

  // Input states
  private keys: Record<string, boolean> = {};
  private waveMovementDirection: number = 1;
  private waveStepTimer: number = 0;
  private waveDropPending: boolean = false;
  private invaderFireTimer: number = 2.0;
  private edgeCooldown: number = 0;
  private mysterySpawnTimer: number = 12.0;
  private lockedTarget: Entity | null = null;
  private boostToggle: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    lobbyContainer: HTMLElement,
    terminalContainer: HTMLElement,
    hudContainer: HTMLElement,
    modalContainer: HTMLElement
  ) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
    this.state = new GameState();
    this.particles = new ParticleSystem();
    this.crt = new CRTEffects();

    this.player = new Player(this.renderer.width / 2 - 22, 505);

    this.lobby = new Lobby(
      lobbyContainer,
      (targetMode?: GameMode, dna?: RepositoryDNA) => {
        if (dna) {
          this.gameData = DataSynthesizer.generateFromDNA(dna);
          this.lobby.hide();
          this.startCampaign();
        } else {
          this.openMissionSelect(targetMode);
        }
      },
      () => {
        this.openStore();
      },
      () => {
        this.openMissionSelect();
      }
    );

    this.terminal = new Terminal(
      terminalContainer,
      this.onLaunchGame.bind(this),
      () => {
        this.returnToLobby();
      }
    );

    this.hud = new HUD(hudContainer);
    this.modals = new Modals(modalContainer);
    this.storeModal = new StoreModal(modalContainer);

    this.loop = new GameLoop(this.update.bind(this), this.render.bind(this));

    this.bindInputs();
    this.initBunkers();

    // Start in Pilot Lobby / Dashboard mode
    this.state.phase = 'LOBBY';
    this.terminal.hide();
    this.lobby.show();
    this.loop.start();
  }

  private initBunkers(): void {
    this.bunkers = [];
    const isCitadel = this.gameData?.sourceType === 'citadel';
    const labels = isCitadel
      ? ['STORAGE', 'POWER', 'API HUB', 'CORE']
      : ['.gitignore', 'docs/', 'lockfile', 'tests/'];
    const count = 4;
    const spacing = this.renderer.width / (count + 1);
    const by = Math.max(380, this.renderer.height - 175);

    for (let i = 1; i <= count; i++) {
      const bx = i * spacing - 32;
      this.bunkers.push(new Bunker(bx, by, labels[i - 1]));
    }
  }

  private bindInputs(): void {
    window.addEventListener('resize', () => {
      this.renderer.resize();
      if (this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') {
        this.initBunkers();
      }
    });

    window.addEventListener('keydown', (e) => {
      // Audio engine auto unlock
      AudioEngine.getInstance().init();

      // Prevent browser default window scrolling on game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) {
        e.preventDefault();
      }

      // Pause toggle
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') {
          e.preventDefault();
          this.togglePause();
          return;
        }
      }

      this.keys[e.code] = true;

      if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
        if (e.code === 'Space') {
          this.fireBlaster();
        } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          this.triggerOverdrive();
        } else if (e.code === 'KeyQ') {
          this.triggerRebase();
        } else if (e.code === 'KeyE') {
          this.triggerStash();
        } else if (e.code === 'KeyC') {
          this.triggerLoop();
        } else if (e.code === 'KeyF') {
          this.triggerMissiles();
        } else if (e.code === 'KeyV') {
          this.toggleViewMode();
        } else if (e.code === 'KeyZ') {
          this.triggerZoneCycle();
        }

        // Tactical combat test keys (DEV only)
        if ((import.meta as any).env?.DEV) {
          if (e.shiftKey && e.code === 'KeyB' && this.state.phase === 'PLAYING') {
            this.triggerBossAlert();
          } else if (e.shiftKey && e.code === 'KeyK' && this.state.phase === 'BOSS_FIGHT' && this.boss) {
            this.boss.takeDamage(999999);
          }
        }
      }

      // Visual feedback on arcade footer buttons
      this.updateKeyFeedback(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.updateKeyFeedback(e.code, false);
    });

    // Wire interactive click events for footer arcade buttons
    document.getElementById('cmdFire')?.addEventListener('click', () => this.fireBlaster());
    document.getElementById('cmdLoop')?.addEventListener('click', () => this.triggerLoop());
    document.getElementById('cmdMissile')?.addEventListener('click', () => this.triggerMissiles());
    document.getElementById('cmdView')?.addEventListener('click', () => this.toggleViewMode());
    document.getElementById('cmdRebase')?.addEventListener('click', () => this.triggerRebase());
    document.getElementById('cmdStash')?.addEventListener('click', () => this.triggerStash());
    document.getElementById('cmdPush')?.addEventListener('click', () => this.triggerOverdrive());
    document.getElementById('cmdPause')?.addEventListener('click', () => this.togglePause());

    // Wire delegation for in-game canvas HUD power & flight buttons
    const hudContainer = document.getElementById('hudContainer');
    hudContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('#hudBtnRebase')) {
        this.triggerRebase();
      } else if (target.closest('#hudBtnStash')) {
        this.triggerStash();
      } else if (target.closest('#hudBtnPush')) {
        this.triggerOverdrive();
      } else if (target.closest('#hudBtnLoop')) {
        this.triggerLoop();
      } else if (target.closest('#hudBtnMissile')) {
        this.triggerMissiles();
      } else if (target.closest('#hudBtnView')) {
        this.toggleViewMode();
      } else if (target.closest('#hudZoneVal')) {
        this.triggerZoneCycle();
      } else if (target.closest('#hudBtnBoost')) {
        this.boostToggle = !this.boostToggle;
      }
    });

    // Resize listener
    window.addEventListener('resize', () => {
      this.renderer.resize();
    });
  }

  private updateKeyFeedback(code: string, isPressed: boolean): void {
    const keyMap: Record<string, string> = {
      Space: 'cmdFire',
      KeyC: 'cmdLoop',
      KeyF: 'cmdMissile',
      KeyV: 'cmdView',
      KeyQ: 'cmdRebase',
      KeyE: 'cmdStash',
      ShiftLeft: 'cmdPush',
      ShiftRight: 'cmdPush',
      Escape: 'cmdPause',
      KeyP: 'cmdPause',
      KeyA: 'cmdMove',
      KeyD: 'cmdMove',
      KeyW: 'cmdMove',
      KeyS: 'cmdMove',
      ArrowLeft: 'cmdMove',
      ArrowRight: 'cmdMove',
      ArrowUp: 'cmdMove',
      ArrowDown: 'cmdMove',
    };
    const btnId = keyMap[code];
    if (btnId) {
      const btn = document.getElementById(btnId);
      if (btn) {
        if (isPressed) {
          btn.classList.add('key-pressed');
        } else {
          btn.classList.remove('key-pressed');
        }
      }
    }
  }

  public fireBlaster(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      const shots = this.player.tryShoot();
      this.projectiles.push(...shots);
    }
  }

  public triggerOverdrive(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      const activated = this.player.activateOverdrive();
      if (activated) {
        this.crt.addTrauma(0.9);
        this.crt.triggerFlash('rgba(255, 0, 128, 0.75)', 0.35);
        SFX.playExplosion('boss');
        this.particles.emitText(this.player.centerX, this.player.y - 45, '> git push --force origin main', '#ff007f');
        this.particles.emitText(this.player.centerX, this.player.y - 25, 'FORCE PUSH ACCEPTED // REWRITING REMOTE HISTORY', '#ffffff');

        // Screen clearing compiler wipe
        for (const enemy of this.enemies) {
          if (enemy.isAlive) {
            enemy.isAlive = false;
            this.particles.emitExplosion(enemy.centerX, enemy.centerY, '#ff007f', 16);
            this.state.addScore(enemy.scoreValue);
            this.state.commitsPurged++;
            this.state.incrementStreak();
          }
        }

        if (this.boss && this.boss.isAlive) {
          this.boss.takeDamage(200);
          this.particles.emitExplosion(this.boss.centerX, this.boss.centerY, '#ff007f', 35);
        }

        // Clear all enemy bullets
        for (const p of this.projectiles) {
          if (p.owner === 'enemy') {
            p.isAlive = false;
            this.particles.emitExplosion(p.centerX, p.centerY, '#00e5ff', 4);
          }
        }
      }
    }
  }

  public triggerRebase(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      const rebasing = this.player.triggerAbilityQ();
      if (rebasing) {
        this.crt.addTrauma(0.25);
        const msg = this.player.isRebaseDashing
          ? 'GIT REBASE: HYPER-DASH ENGAGED!'
          : 'GIT REBASE: SLOW-MO (3.5s)';
        this.particles.emitText(this.player.centerX, this.player.y - 30, msg, '#ff0055');
      }
    }
  }

  public triggerLoop(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      if (this.player.triggerLoop()) {
        this.crt.addTrauma(0.18);
        this.particles.emitText(this.player.centerX, this.player.y - 26, 'EVASIVE LOOP [INVULNERABLE]', '#38bdf8');
      }
    }
  }

  public triggerMissiles(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      const target = this.findPriorityTarget();
      const missiles = this.player.fireHomingMissiles(target, this.renderer.width / 2, 110);
      if (missiles.length > 0) {
        this.projectiles.push(...missiles);
        this.crt.addTrauma(0.2);
        this.particles.emitText(this.player.centerX, this.player.y - 24, 'FOX-2 // MISSILE LOCK', '#ef4444');
      }
    }
  }

  public toggleViewMode(): void {
    const mode = this.renderer.toggleViewMode();
    SFX.playPowerup();
    if (this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') {
      this.particles.emitText(
        this.player.centerX,
        this.player.y - 30,
        mode === 'ANGLED_25D' ? 'VIEW: 2.5D HORIZON' : 'VIEW: TOP-DOWN RADAR',
        '#00e5ff'
      );
    }
  }

  public triggerZoneCycle(): void {
    const nextZone = this.renderer.cycleZone();
    SFX.playPowerup();
    if (this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') {
      const label = this.renderer.zoneRenderer.getZoneLabel(nextZone);
      this.particles.emitText(this.renderer.width / 2 - 90, 95, `ZONE SWITCH // ${label}`, '#38bdf8');
    }
  }

  public triggerStash(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      const res = this.player.triggerAbilityE(this.renderer.width);
      if (res) {
        if (res.projectiles && res.projectiles.length > 0) {
          this.projectiles.push(...res.projectiles);
        }
        if (res.type === 'falcon_overclock') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'COMPILER OVERCLOCK (4.0s)', '#00e5ff');
        } else if (res.type === 'stash_active') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'GIT STASH: INTANGIBLE PHASE (3.5s)', '#c084fc');
        } else if (res.type === 'merge_burst') {
          this.crt.addTrauma(0.4);
          this.particles.emitText(this.player.centerX, this.player.y - 35, 'MERGE BURST // KINETIC SHOCKWAVE', '#fbbf24');
        } else if (res.type === 'branch_split') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'BRANCH SPLIT: DUAL DRONES DEPLOYED', '#10b981');
        } else if (res.type === 'rebase_dash') {
          this.crt.addTrauma(0.25);
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'GIT REBASE: HYPER-DASH ENGAGED!', '#ff0055');
        } else if (res.type === 'quantum_salvo') {
          this.crt.addTrauma(0.25);
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'QUANTUM PIERCE // LANCE SALVO', '#06b6d4');
        } else if (res.type === 'octo_protocol') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'OCTO PROTOCOL: 8 DEFENSE DRONES ACTIVE', '#38bdf8');
        } else if (res.type === 'codebreaker_lance') {
          this.crt.addTrauma(0.35);
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'CODEBREAKER // KERNEL BEAM', '#ec4899');
        } else if (res.type === 'temporal_rift') {
          this.crt.addTrauma(0.3);
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'TEMPORAL RIFT // 80% TIME SLOW', '#ef4444');
        } else if (res.type === 'supernova_nova') {
          this.crt.addTrauma(0.65);
          this.crt.triggerFlash('rgba(250, 204, 21, 0.35)', 0.25);
          this.particles.emitText(this.player.centerX, this.player.y - 34, 'SUPERNOVA NOVA // 360° BLAST', '#facc15');
        } else if (res.type === 'dna_overload') {
          this.crt.addTrauma(0.3);
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'DNA OVERLOAD // SALVO', '#00e5ff');
        } else if (res.type === 'shield_up') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'STASH SHIELD ENGAGED', '#10b981');
        }
      }
    }
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      Music.stop();
      this.modals.showPause(
        this.state,
        () => {
          this.isPaused = false;
          Music.start();
        },
        () => {
          this.openStore();
        },
        () => {
          this.isPaused = false;
          this.returnToLobby();
        }
      );
    } else {
      this.modals.hide();
      Music.start();
    }
  }

  public openMissionSelect(mode?: GameMode): void {
    const combatControls = document.getElementById('combatControls');
    if (combatControls) combatControls.style.display = 'none';
    this.lobby.hide();
    this.state.phase = 'BOOT';
    this.terminal.show(mode);
  }

  public openStore(): void {
    const wasPlaying = this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT';
    if (wasPlaying) {
      this.isPaused = true;
      Music.stop();
    }

    this.storeModal.show(() => {
      this.player.applyStoreUpgrades();
      if (this.state.phase === 'LOBBY') {
        this.lobby.render();
      } else if (wasPlaying && this.isPaused) {
        this.togglePause(); // Resume
      }
    });
  }

  public async onLaunchGame(mode: GameMode, input: string): Promise<void> {
    AudioEngine.getInstance().init();
    this.terminal.clearLogs();
    this.terminal.addLog(`ANALYZING GITHUB REPOSITORY TELEMETRY...`, 'text-cyan');

    try {
      if (mode === 'citadel') {
        this.terminal.addLog(`CONNECTING TO CODEBASE.UNIVERSE ARCHITECTURAL BRIDGE...`, 'text-cyan');
        this.terminal.addLog(`INGESTING 8 BIOMES // TREE-SITTER AST PARSER ACTIVE...`, 'text-cyan');
        this.terminal.addLog(`CODEBASE-MEMORY-MCP: 90%+ TOKEN REDUCTION SYNCHRONIZED`, 'text-green');
        this.terminal.addLog(`CITADELA STATUS: 88% [HEALTHY] // SCANNING GOD-CLASSES...`, 'text-green');
        this.gameData = DataSynthesizer.generateCitadelUniverseMode();
      } else if (mode === 'chaos') {
        this.terminal.addLog(`SYNTHESIZING CHAOS PROTOCOL (9999 COMMITS)...`, 'text-pink');
        this.gameData = DataSynthesizer.generateChaosMode();
      } else if (mode === 'repository') {
        if (input.toLowerCase().includes('codebase.universe')) {
          this.terminal.addLog(`RECOGNIZED TARGET: CODEBASE.UNIVERSE CITADEL REPO!`, 'text-cyan');
          this.gameData = DataSynthesizer.generateCitadelUniverseMode();
        } else {
          this.gameData = await GitHubClient.fetchRepository(input || 'luisrodriguez-rgb/CODEBASE.UNIVERSE', (msg) => {
            this.terminal.addLog(msg);
          });
        }
      } else {
        this.gameData = await GitHubClient.fetchProfile(input || 'luisrodriguez-rgb', (msg) => {
          this.terminal.addLog(msg);
        });
      }

      this.terminal.addLog(`THREAT LEVEL: ${this.gameData.threatLevel}% [${this.gameData.threatRating}]`, 'text-green');
      this.terminal.addLog(`PRIMARY LANGUAGE: ${this.gameData.primaryLanguage}`);
      this.terminal.addLog(`INITIALIZING COMPILER DEFENSE SYSTEMS IN 1s...`, 'text-cyan');

      setTimeout(() => {
        this.startCampaign();
      }, 1200);
    } catch (err: any) {
      this.terminal.addLog(`ERROR: ${err.message || err}`, 'text-pink');
      this.terminal.addLog(`Rerouting to offline procedural generator...`);
      this.gameData = DataSynthesizer.generateFallback(input || 'luisrodriguez-rgb');
      setTimeout(() => {
        this.startCampaign();
      }, 1200);
    }
  }

  private startCampaign(): void {
    if (!this.gameData) return;

    this.terminal.hide();
    this.state.reset();
    this.state.repoName = this.gameData.repoName;
    this.state.totalWaves = this.gameData.totalWaves;
    this.state.currentWave = 1;
    this.state.directives = (this.gameData.bossBlueprint.directives || []).map((d) => ({ ...d, isCompleted: false }));
    this.state.phase = 'PLAYING';
    this.isPaused = false;
    this.boostToggle = false;
    this.mysterySpawnTimer = 11.0;
    const combatControls = document.getElementById('combatControls');
    if (combatControls) combatControls.style.display = 'flex';

    this.renderer.resize();
    this.renderer.zoneRenderer.clearManualZone();
    this.player.reset(this.renderer.width / 2 - 24, Math.max(460, this.renderer.height - 110));
    this.initBunkers();
    this.projectiles = [];
    this.particles.clear();
    this.boss = null;
    this.lockedTarget = null;

    Music.setBpm(105 + (this.gameData.threatLevel / 100) * 25);
    Music.start();

    this.spawnWave(1);
  }

  private spawnWave(waveNum: number): void {
    if (!this.gameData) return;
    this.state.waveElapsed = 0;
    this.enemies = EnemyFactory.createWave(waveNum - 1, this.gameData, {
      width: this.renderer.width,
      height: this.renderer.height,
    });
    this.waveMovementDirection = 1;
    this.waveStepTimer = 0;
    this.waveDropPending = false;
    this.invaderFireTimer = 1.8;

    const isCitadel = this.gameData.sourceType === 'citadel';
    const citadelBiomeNames = [
      'BIOME 01: STORAGE BUNKER & PERSISTENCE',
      'BIOME 02: POWER GRID & EVENT BUS',
      'BIOME 03: UI METROPOLIS [DOM TREES]',
      'BIOME 04: CORE CITADEL [GOD-CLASS ALERT]',
    ];
    const waveTitle = isCitadel
      ? (citadelBiomeNames[waveNum - 1] || `BIOME 0${waveNum}: CITADELA SECTOR`)
      : `WAVE 0${waveNum}: ${this.gameData.repoName.toUpperCase()}`;

    this.particles.emitText(
      this.renderer.width / 2 - 50,
      140,
      waveTitle,
      this.gameData.languageColor
    );
  }

  private triggerBossAlert(): void {
    if (!this.gameData) return;
    this.state.phase = 'BOSS_ALERT';
    Music.stop();
    SFX.playBossWarning();

    this.modals.showBossBlueprint(this.gameData.bossBlueprint, () => {
      this.engageBossFight();
    });
  }

  public triggerBossFight(): void {
    if (!this.gameData) return;
    this.engageBossFight();
  }

  private engageBossFight(): void {
    if (!this.gameData) return;
    this.state.phase = 'BOSS_FIGHT';
    this.boss = new Boss(
      this.renderer.width / 2 - 70,
      70,
      this.gameData.bossBlueprint
    );
    this.enemies = [];
    this.projectiles = [];

    if (this.gameData.bossBlueprint.genome) {
      Music.applyBossGenome(this.gameData.bossBlueprint.genome);
    } else {
      Music.setBpm(145);
    }
    Music.start();
  }

  private findPriorityTarget(): Entity | null {
    if (this.state.phase === 'BOSS_FIGHT' && this.boss && this.boss.isAlive) {
      return this.boss;
    }
    const alive = this.enemies.filter((e) => e.isAlive);
    if (alive.length === 0) return null;

    let best: Entity | null = null;
    let bestScore = Infinity;
    for (const e of alive) {
      const dist = Math.hypot(e.centerX - this.player.centerX, e.centerY - this.player.centerY);
      const priorityBias =
        e instanceof MysteryOctocat
          ? 0.45
          : e instanceof IssueBomber && e.isDiving
          ? 0.55
          : e instanceof HotfixInterceptor
          ? 0.65
          : e instanceof PipelineTurret
          ? 0.7
          : e instanceof TechDebtJuggernaut
          ? 0.75
          : 1.0;
      const weighted = dist * priorityBias;
      if (weighted < bestScore) {
        bestScore = weighted;
        best = e;
      }
    }
    return best;
  }

  private evaluateDirectives(event: 'wave_1_clear' | 'wave_2_clear' | 'boss_defeated'): void {
    if (event === 'wave_1_clear') {
      const dir = this.state.directives.find((d) => d.id === 'dir_w1');
      if (dir && !dir.isCompleted && this.bunkers.some((b) => b.getIntegrity() > 0)) {
        dir.isCompleted = true;
        this.state.bonusStars += 150;
        this.state.xp += 200;
        this.state.unlockedPerks.push('DIRECTIVA W1 (+150 STARS)');
        SFX.playPowerup();
        this.particles.emitText(this.renderer.width / 2 - 90, 180, 'DIRECTIVA W1 CUMPLIDA // +150 STARS +200 EXP', '#fbbf24');
      }
    } else if (event === 'wave_2_clear') {
      const dir = this.state.directives.find((d) => d.id === 'dir_w2');
      if (dir && !dir.isCompleted && this.state.waveElapsed <= 45) {
        dir.isCompleted = true;
        this.state.bonusStars += 300;
        this.state.xp += 400;
        this.state.unlockedPerks.push('REPARACIÓN KERNEL');
        if (this.player.lives < this.player.maxLives) {
          this.player.lives++;
        }
        this.player.hasShield = true;
        SFX.playPowerup();
        this.particles.emitText(this.renderer.width / 2 - 110, 180, 'DIRECTIVA W2 CUMPLIDA // REPARACIÓN KERNEL!', '#10b981');
      }
    } else if (event === 'boss_defeated') {
      const dir = this.state.directives.find((d) => d.id === 'dir_boss');
      if (dir && !dir.isCompleted) {
        dir.isCompleted = true;
        this.state.bonusStars += 400;
        this.state.xp += 600;
        this.state.unlockedPerks.push('EMBLEMA ARQUETIPO');
      }
    }
  }

  private update(dt: number): void {
    const isBoss = this.state.phase === 'BOSS_FIGHT';
    this.renderer.updateStars(dt, this.state.currentWave, isBoss, this.player.isBoosting);
    this.particles.update(dt);

    if (this.state.phase === 'BOOT' || this.state.phase === 'LOBBY' || this.isPaused) return;

    this.state.waveElapsed += dt;

    // Tactical slow-mo factor: Temporal Rift (80%) or Git Rebase (65%)
    const enemyDt =
      this.player.temporalRiftTimer > 0
        ? dt * 0.2
        : this.player.isRebasing
        ? dt * 0.35
        : dt;

    // 1. 2.5D Player Movement & Boost
    let inX = 0;
    let inY = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) inX -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) inX += 1;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) inY -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) inY += 1;

    this.player.inputX = inX;
    this.player.inputY = inY;
    this.player.isBoosting = Boolean(this.keys['ArrowUp'] || this.keys['KeyW'] || this.boostToggle);

    this.player.update(dt, { width: this.renderer.width, height: this.renderer.height });

    // Check Phantom Violet Stash exit burst
    const exitBurst = this.player.consumeStashExitBurst();
    if (exitBurst.length > 0) {
      this.projectiles.push(...exitBurst);
      this.particles.emitText(this.player.centerX, this.player.y - 25, 'STASH POP // DAGGER FAN', '#c084fc');
    }

    // Auto-fire while holding space
    if (this.keys['Space'] && (this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT')) {
      const shots = this.player.tryShoot();
      if (shots.length > 0) this.projectiles.push(...shots);
    }

    // 2. Projectiles Update (Enemy projectiles slow down in Rebase / Temporal Rift mode)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const pDt = p.owner === 'player' ? dt : enemyDt;
      p.update(pDt, { width: this.renderer.width, height: this.renderer.height });
      if (!p.isAlive) {
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Invaders Wave Motion + Mystery Octocat Flyby
    if (this.state.phase === 'PLAYING') {
      this.updateInvaders(enemyDt);

      this.mysterySpawnTimer -= dt;
      if (this.mysterySpawnTimer <= 0) {
        this.mysterySpawnTimer = 18 + Math.random() * 10;
        const fromLeft = Math.random() < 0.5;
        const startX = fromLeft ? -54 : this.renderer.width + 6;
        const speed = fromLeft ? 145 : -145;
        this.enemies.push(new MysteryOctocat(startX, 42, speed));
        this.particles.emitText(this.renderer.width / 2 - 75, 58, 'ALERT // MYSTERY OCTOCAT DETECTED', '#c084fc');
      }
    }

    // 4. Boss Update & Attack with Adaptive Memory
    if (this.state.phase === 'BOSS_FIGHT' && this.boss && this.boss.isAlive) {
      this.boss.trackPlayer(this.player.centerX, this.player.hasShield, this.renderer.width, dt);
      this.boss.update(enemyDt, { width: this.renderer.width, height: this.renderer.height });
      const bossShots = this.boss.tryAttack(this.player.centerX);
      if (bossShots.length > 0) {
        this.projectiles.push(...bossShots);
      }
    }

    // Update target-lock reticle
    this.lockedTarget = this.findPriorityTarget();

    // 5. Collision Resolution
    CollisionSystem.resolve(
      this.player,
      this.projectiles,
      this.enemies,
      this.bunkers,
      this.boss,
      this.particles,
      this.crt,
      this.state
    );

    // Check Boss Defeat (Triggered when boss HP drops to 0)
    if (this.state.phase === 'BOSS_FIGHT' && this.boss && !this.boss.isAlive) {
      this.state.phase = 'VICTORY';
      this.evaluateDirectives('boss_defeated');
      Music.stop();
      SFX.playExplosion('boss');
      SFX.playPowerup();

      const bossCenterX = this.boss.centerX;
      const bossCenterY = this.boss.centerY;
      const bossBlueprint = this.boss.blueprint;

      for (let ring = 0; ring < 3; ring++) {
        setTimeout(() => {
          this.particles.emitExplosion(
            bossCenterX + (Math.random() * 50 - 25),
            bossCenterY + (Math.random() * 30 - 15),
            ring % 2 === 0 ? '#00e5ff' : '#ff0055',
            45
          );
        }, ring * 220);
      }

      const store = Store.getInstance();
      store.addXp(this.state.xp + this.state.bonusStars);
      store.recordBossDefeated(bossBlueprint);
      const repoId = this.gameData?.repoName?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'sketion';
      store.grantRepositoryArtifact(repoId, this.gameData?.repoName || 'sketion', bossBlueprint.language);

      setTimeout(() => {
        this.modals.showVictory(
          this.state,
          bossBlueprint,
          () => {
            this.returnToLobby();
          },
          () => {
            this.openStore();
          }
        );
      }, 750);
    }

    // 6. Check Player Death
    if (!this.player.isAlive && this.state.phase !== 'GAMEOVER') {
      this.state.phase = 'GAMEOVER';
      Music.stop();
      Store.getInstance().addXp(this.state.xp + this.state.bonusStars);
      this.modals.showGameOver(
        this.state,
        () => {
          this.startCampaign();
        },
        () => {
          this.returnToLobby();
        }
      );
    }

    // 7. Update HUD
    this.hud.update(
      this.state,
      this.player,
      this.boss,
      this.gameData,
      this.renderer.viewMode,
      this.renderer.zoneRenderer.currentZone
    );
  }

  private updateInvaders(dt: number): void {
    const aliveEnemies = this.enemies.filter((e) => e.isAlive);
    const formationEnemies = aliveEnemies.filter((e) => !(e instanceof MysteryOctocat));

    // Wave Cleared Check (MysteryOctocat flyby shouldn't block wave transition)
    if (formationEnemies.length === 0) {
      if (this.state.currentWave === 1) this.evaluateDirectives('wave_1_clear');
      if (this.state.currentWave === 2) this.evaluateDirectives('wave_2_clear');

      if (this.state.currentWave < this.state.totalWaves) {
        this.state.currentWave++;
        this.spawnWave(this.state.currentWave);
      } else {
        this.triggerBossAlert();
      }
      return;
    }

    // Rhythm speed scales as enemy count dwindles
    const baseSpeed = this.gameData?.enemySpeedBase || 60;
    const speedMultiplier = 1.0 + (1 - formationEnemies.length / 40) * 1.5;
    const currentSpeed = baseSpeed * speedMultiplier;

    let hitEdge = false;
    for (const enemy of aliveEnemies) {
      if (enemy instanceof MysteryOctocat) {
        enemy.update(dt, { width: this.renderer.width, height: this.renderer.height });
        continue;
      }

      if (enemy instanceof IssueBomber) {
        enemy.targetPlayerX = this.player.centerX;
        enemy.targetPlayerY = this.player.centerY;
      } else if (enemy instanceof PipelineTurret) {
        enemy.targetX = this.player.centerX;
      }

      const isIndependent =
        (enemy instanceof IssueBomber && enemy.isDiving) || enemy instanceof ConflictFragment;

      if (!isIndependent) {
        enemy.vx = currentSpeed * this.waveMovementDirection;
      }
      enemy.update(dt, { width: this.renderer.width, height: this.renderer.height });

      if (!isIndependent) {
        if (
          (enemy.x < 15 && this.waveMovementDirection < 0) ||
          (enemy.x + enemy.width > this.renderer.width - 15 && this.waveMovementDirection > 0)
        ) {
          hitEdge = true;
        }

        if (enemy.y + enemy.height >= this.player.y + this.player.height) {
          this.player.lives = 0;
          this.player.isAlive = false;
        }
      }
    }

    if (hitEdge && this.edgeCooldown <= 0) {
      this.edgeCooldown = 0.45;
      this.waveMovementDirection *= -1;
      const dropAmount = this.gameData?.enemyDropSpeed || 16;
      for (const enemy of formationEnemies) {
        if (!(enemy instanceof IssueBomber && enemy.isDiving) && !(enemy instanceof ConflictFragment)) {
          enemy.y += dropAmount;
        }
      }
    }

    if (this.edgeCooldown > 0) {
      this.edgeCooldown -= dt;
    }

    // Invader return fire (tailored per enemy archetype)
    this.invaderFireTimer -= dt;
    if (this.invaderFireTimer <= 0) {
      this.invaderFireTimer = 1.2 + Math.random() * 1.2;
      const shooter = formationEnemies[Math.floor(Math.random() * formationEnemies.length)];
      if (shooter) {
        SFX.playLaser('enemy');
        if (shooter instanceof PipelineTurret) {
          const dx = this.player.centerX - shooter.centerX;
          const dy = Math.max(80, this.player.centerY - shooter.centerY);
          const norm = Math.hypot(dx, dy) || 1;
          const speed = 290;
          const vx = (dx / norm) * speed;
          const vy = (dy / norm) * speed;
          this.projectiles.push(
            new Projectile(shooter.centerX - 6, shooter.y + shooter.height, vx, vy, 'enemy', 'laser', 20, '#38bdf8'),
            new Projectile(shooter.centerX + 4, shooter.y + shooter.height, vx, vy, 'enemy', 'laser', 20, '#38bdf8')
          );
        } else if (shooter instanceof TechDebtJuggernaut) {
          for (const spreadX of [-75, 0, 75]) {
            this.projectiles.push(
              new Projectile(shooter.centerX - 4, shooter.y + shooter.height, spreadX, 230, 'enemy', 'plasma', 25, '#eab308')
            );
          }
        } else {
          this.projectiles.push(
            new Projectile(shooter.centerX - 2, shooter.y + shooter.height, 0, 240, 'enemy', 'laser', 20, '#ef4444')
          );
        }
      }
    }
  }

  private render(): void {
    const shake = this.crt.update(0.016);
    this.renderer.render(
      this.player,
      this.enemies.filter((e) => e.isAlive),
      this.projectiles,
      this.bunkers,
      this.boss,
      this.particles,
      this.crt,
      shake,
      this.lockedTarget
    );
  }

  public returnToLobby(): void {
    Music.stop();
    this.isPaused = false;
    this.state.phase = 'LOBBY';
    const combatControls = document.getElementById('combatControls');
    if (combatControls) combatControls.style.display = 'none';
    this.terminal.hide();
    this.modals.hide();
    this.storeModal.hide();
    this.player.applyStoreUpgrades();
    this.lobby.show();
  }

  public returnToTerminal(): void {
    this.returnToLobby();
  }
}
