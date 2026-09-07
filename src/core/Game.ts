import { Player } from '../entities/Player';
import { Projectile } from '../entities/Projectile';
import { Entity } from '../entities/Entity';
import { Bunker } from '../entities/Bunker';
import { Boss } from '../entities/Boss';
import { IssueBomber } from '../entities/IssueBomber';
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

    for (let i = 1; i <= count; i++) {
      const bx = i * spacing - 32;
      const by = 430; // Elevated so bunkers don't crowd the player
      this.bunkers.push(new Bunker(bx, by, labels[i - 1]));
    }
  }

  private bindInputs(): void {
    window.addEventListener('keydown', (e) => {
      // Audio engine auto unlock
      AudioEngine.getInstance().init();

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
          e.preventDefault();
          this.fireBlaster();
        } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
          this.triggerOverdrive();
        } else if (e.code === 'KeyQ') {
          this.triggerRebase();
        } else if (e.code === 'KeyE') {
          this.triggerStash();
        }

        // Tactical combat test keys
        if (e.shiftKey && e.code === 'KeyB' && this.state.phase === 'PLAYING') {
          this.triggerBossAlert();
        } else if (e.shiftKey && e.code === 'KeyK' && this.state.phase === 'BOSS_FIGHT' && this.boss) {
          this.boss.takeDamage(999999);
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
    document.getElementById('cmdRebase')?.addEventListener('click', () => this.triggerRebase());
    document.getElementById('cmdStash')?.addEventListener('click', () => this.triggerStash());
    document.getElementById('cmdPush')?.addEventListener('click', () => this.triggerOverdrive());
    document.getElementById('cmdPause')?.addEventListener('click', () => this.togglePause());

    // Wire delegation for in-game canvas HUD power buttons
    const hudContainer = document.getElementById('hudContainer');
    hudContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('#hudBtnRebase')) {
        this.triggerRebase();
      } else if (target.closest('#hudBtnStash')) {
        this.triggerStash();
      } else if (target.closest('#hudBtnPush')) {
        this.triggerOverdrive();
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
      KeyQ: 'cmdRebase',
      KeyE: 'cmdStash',
      ShiftLeft: 'cmdPush',
      ShiftRight: 'cmdPush',
      Escape: 'cmdPause',
      KeyP: 'cmdPause',
      KeyA: 'cmdMove',
      KeyD: 'cmdMove',
      ArrowLeft: 'cmdMove',
      ArrowRight: 'cmdMove',
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

  public triggerStash(): void {
    if ((this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT') && !this.isPaused) {
      AudioEngine.getInstance().init();
      const res = this.player.triggerAbilityE();
      if (res) {
        if (res.type === 'stash_active') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'GIT STASH: INTANGIBLE PHASE (3.5s)', '#c084fc');
        } else if (res.type === 'merge_burst' && res.projectile) {
          this.projectiles.push(res.projectile);
          this.crt.addTrauma(0.4);
          this.particles.emitText(this.player.centerX, this.player.y - 35, 'MERGE BURST // KINETIC SHOCKWAVE', '#fbbf24');
        } else if (res.type === 'branch_split') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'BRANCH SPLIT: DUAL DRONES DEPLOYED', '#10b981');
        } else if (res.type === 'octo_protocol') {
          this.particles.emitText(this.player.centerX, this.player.y - 30, 'OCTO PROTOCOL: 8 DEFENSE DRONES ACTIVE', '#38bdf8');
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
    this.state.totalWaves = this.gameData.totalWaves;
    this.state.currentWave = 1;
    this.state.phase = 'PLAYING';
    this.isPaused = false;
    const combatControls = document.getElementById('combatControls');
    if (combatControls) combatControls.style.display = 'flex';

    this.player.reset(this.renderer.width / 2 - 22, 505);
    this.initBunkers();
    this.projectiles = [];
    this.particles.clear();
    this.boss = null;

    Music.setBpm(105 + (this.gameData.threatLevel / 100) * 25);
    Music.start();

    this.spawnWave(1);
  }

  private spawnWave(waveNum: number): void {
    if (!this.gameData) return;
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

    Music.setBpm(145);
    Music.start();
  }

  private update(dt: number): void {
    this.renderer.updateStars(dt);
    this.particles.update(dt);

    if (this.state.phase === 'BOOT' || this.state.phase === 'LOBBY' || this.isPaused) return;

    // Tactical slow-mo factor from GIT REBASE
    const enemyDt = this.player.isRebasing ? dt * 0.35 : dt;

    // 1. Player Movement & Updates
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.vx = -this.player.speed;
    } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.vx = this.player.speed;
    } else {
      this.player.vx = 0;
    }

    this.player.update(dt, { width: this.renderer.width, height: this.renderer.height });

    // Auto-fire while holding space
    if (this.keys['Space'] && (this.state.phase === 'PLAYING' || this.state.phase === 'BOSS_FIGHT')) {
      const shots = this.player.tryShoot();
      if (shots.length > 0) this.projectiles.push(...shots);
    }

    // 2. Projectiles Update (Enemy projectiles slow down in Rebase mode)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const pDt = p.owner === 'player' ? dt : enemyDt;
      p.update(pDt, { width: this.renderer.width, height: this.renderer.height });
      if (!p.isAlive) {
        this.projectiles.splice(i, 1);
      }
    }

    // 3. Invaders Wave Motion
    if (this.state.phase === 'PLAYING') {
      this.updateInvaders(enemyDt);
    }

    // 4. Boss Update & Attack
    if (this.state.phase === 'BOSS_FIGHT' && this.boss && this.boss.isAlive) {
      this.boss.update(enemyDt, { width: this.renderer.width, height: this.renderer.height });
      const bossShots = this.boss.tryAttack(this.player.centerX);
      if (bossShots.length > 0) {
        this.projectiles.push(...bossShots);
      }
    }

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
      Music.stop();
      SFX.playExplosion('boss');
      SFX.playPowerup();

      // Emit dramatic celebratory fireworks and screen shake
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

      Store.getInstance().addXp(this.state.xp);

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
      Store.getInstance().addXp(this.state.xp);
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
    this.hud.update(this.state, this.player, this.boss, this.gameData);
  }

  private updateInvaders(dt: number): void {
    const aliveEnemies = this.enemies.filter((e) => e.isAlive);

    // Wave Cleared Check
    if (aliveEnemies.length === 0) {
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
    const speedMultiplier = 1.0 + (1 - aliveEnemies.length / 40) * 1.5;
    const currentSpeed = baseSpeed * speedMultiplier;

    let hitEdge = false;
    for (const enemy of aliveEnemies) {
      if (enemy instanceof IssueBomber) {
        enemy.targetPlayerX = this.player.centerX;
        enemy.targetPlayerY = this.player.centerY;
      }
      enemy.vx = currentSpeed * this.waveMovementDirection;
      enemy.update(dt, { width: this.renderer.width, height: this.renderer.height });

      if (
        (enemy.x < 15 && this.waveMovementDirection < 0) ||
        (enemy.x + enemy.width > this.renderer.width - 15 && this.waveMovementDirection > 0)
      ) {
        hitEdge = true;
      }

      // Only marching formation invaders breach the defense line
      const isDivingBug = enemy instanceof IssueBomber && enemy.isDiving;
      if (!isDivingBug && enemy.y + enemy.height >= this.player.y + this.player.height) {
        this.player.lives = 0;
        this.player.isAlive = false;
      }
    }

    if (hitEdge && this.edgeCooldown <= 0) {
      this.edgeCooldown = 0.45;
      this.waveMovementDirection *= -1;
      const dropAmount = this.gameData?.enemyDropSpeed || 16;
      for (const enemy of aliveEnemies) {
        if (!(enemy instanceof IssueBomber && enemy.isDiving)) {
          enemy.y += dropAmount;
        }
      }
    }

    if (this.edgeCooldown > 0) {
      this.edgeCooldown -= dt;
    }

    // Invader return fire
    this.invaderFireTimer -= dt;
    if (this.invaderFireTimer <= 0) {
      this.invaderFireTimer = 1.2 + Math.random() * 1.2;
      const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      if (shooter) {
        SFX.playLaser('enemy');
        this.projectiles.push(
          new Projectile(shooter.centerX - 2, shooter.y + shooter.height, 0, 240, 'enemy', 'laser', 20, '#ef4444')
        );
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
      shake
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
