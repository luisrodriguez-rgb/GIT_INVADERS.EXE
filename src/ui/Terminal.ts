import { GameMode } from '../github/Types';

export class Terminal {
  private container: HTMLElement;
  private onLaunchCallback: (mode: GameMode, input: string) => void;
  private onBackToLobbyCallback?: () => void;

  constructor(
    container: HTMLElement,
    onLaunch: (mode: GameMode, input: string) => void,
    onBackToLobby?: () => void
  ) {
    this.container = container;
    this.onLaunchCallback = onLaunch;
    this.onBackToLobbyCallback = onBackToLobby;
    this.render();
  }

  public setOnBackToLobby(cb: () => void): void {
    this.onBackToLobbyCallback = cb;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="terminal-card">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="terminal-title">GIT_INVADERS.EXE // BIOS v2.4.0</div>
          <div class="terminal-header-actions">
            <button class="terminal-back-btn" id="termBackToLobbyBtn" title="Return to Lobby">[< VOLVER AL LOBBY]</button>
            <div class="terminal-clock" id="termClock">ACTIVE</div>
          </div>
        </div>

        <div class="terminal-body">
          <pre class="ascii-banner">
  ██████╗ ██╗████████╗   ██╗███╗   ██╗██╗   ██╗ █████╗ ██████╗ ███████╗██████╗ ███████╗
 ██╔════╝ ██║╚══██╔══╝   ██║████╗  ██║██║   ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝
 ██║  ███╗██║   ██║      ██║██╔██╗ ██║██║   ██║███████║██║  ██║█████╗  ██████╔╝███████╗
 ██║   ██║██║   ██║      ██║██║╚██╗██║╚██╗ ██╔╝██╔══██║██║  ██║██╔══╝  ██╔══██╗╚════██║
 ╚██████╔╝██║   ██║██╗   ██║██║ ╚████║ ╚████╔╝ ██║  ██║██████╔╝███████╗██║  ██║███████║
  ╚═════╝ ╚═╝   ╚═╝╚═╝   ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝
          </pre>

          <div class="mode-tabs">
            <button class="tab-btn active" data-mode="profile">1. PROFILE MODE</button>
            <button class="tab-btn" data-mode="repository">2. REPOSITORY MODE</button>
            <button class="tab-btn chaos-tab" data-mode="chaos">3. CHAOS MODE</button>
            <button class="tab-btn citadel-tab" data-mode="citadel">4. CODEBASE.UNIVERSE [CITADEL]</button>
          </div>

          <div class="mode-content" id="modeContent">
            <!-- Dynamically populated below -->
          </div>

          <div class="terminal-logs" id="terminalLogs">
            <div class="log-line text-cyan">> SYSTEM BOOT INITIALIZED...</div>
            <div class="log-line">> WAITING FOR GITHUB TARGET PARAMETERS...</div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.selectTab('profile');
  }

  private bindEvents(): void {
    const tabs = this.container.querySelectorAll('.tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = (tab as HTMLElement).dataset.mode as GameMode;
        this.selectTab(mode);
      });
    });

    const backBtn = this.container.querySelector('#termBackToLobbyBtn');
    backBtn?.addEventListener('click', () => {
      this.onBackToLobbyCallback?.();
    });
  }

  public selectTab(mode: GameMode): void {
    const content = this.container.querySelector('#modeContent');
    if (!content) return;

    if (mode === 'profile') {
      content.innerHTML = `
        <div class="input-row">
          <label>GITHUB USERNAME:</label>
          <div class="input-wrapper">
            <span class="prompt-sym">@</span>
            <input type="text" id="targetInput" value="luisrodriguez-rgb" placeholder="e.g. luisrodriguez-rgb, torvalds, shadcn" />
            <button class="launch-btn" id="launchBtn">INITIALIZE INVASION [ENTER]</button>
          </div>
        </div>
        <div class="quick-tags">
          <span>QUICK TARGETS:</span>
          <button class="tag-btn" data-val="luisrodriguez-rgb">luisrodriguez-rgb</button>
          <button class="tag-btn" data-val="torvalds">torvalds</button>
          <button class="tag-btn" data-val="shadcn">shadcn</button>
        </div>
      `;
    } else if (mode === 'repository') {
      content.innerHTML = `
        <div class="input-row">
          <label>TARGET REPOSITORY:</label>
          <div class="input-wrapper">
            <span class="prompt-sym">repo/</span>
            <input type="text" id="targetInput" value="luisrodriguez-rgb/CODEBASE.UNIVERSE" placeholder="owner/repository" />
            <button class="launch-btn" id="launchBtn">ENGAGE REPO BOSS [ENTER]</button>
          </div>
        </div>
        <div class="quick-tags">
          <span>QUICK REPOS:</span>
          <button class="tag-btn" data-val="luisrodriguez-rgb/CODEBASE.UNIVERSE">luisrodriguez-rgb/CODEBASE.UNIVERSE</button>
          <button class="tag-btn" data-val="luisrodriguez-rgb/sketion">luisrodriguez-rgb/sketion</button>
          <button class="tag-btn" data-val="torvalds/linux">torvalds/linux</button>
        </div>
      `;
    } else if (mode === 'chaos') {
      content.innerHTML = `
        <div class="chaos-box">
          <div class="chaos-desc">
            <span class="text-pink font-bold">WARNING: MAXIMUM CHAOS PROTOCOL.</span><br/>
            Zero GitHub dependencies. Instant procedural overdrive. 9,999 commits, 482 PRs, 731 issues.
          </div>
          <button class="launch-btn chaos-launch" id="launchBtn">[!] INITIATE CHAOS INVASION [!]</button>
        </div>
      `;
    } else if (mode === 'citadel') {
      content.innerHTML = `
        <div class="citadel-mode-box">
          <div class="citadel-desc">
            <span class="text-cyan font-bold">[CODEBASE.UNIVERSE // ARCHITECTURAL INTELLIGENCE]</span><br/>
            Defend the 8 architectural biomes against God-Class Monoliths and Tarjan Cyclic Wormholes.
          </div>
          <div class="citadel-biomes-grid">
            <span class="biome-pill b-core">1. CORE CITADEL</span>
            <span class="biome-pill b-ui">2. UI METROPOLIS</span>
            <span class="biome-pill b-power">3. POWER GRID</span>
            <span class="biome-pill b-storage">4. STORAGE BUNKER</span>
            <span class="biome-pill b-api">5. API GATEWAY</span>
            <span class="biome-pill b-labs">6. RESEARCH LABS</span>
            <span class="biome-pill b-hazard">7. HAZARD ZONE</span>
            <span class="biome-pill b-ruins">8. RUINS</span>
          </div>
          <div class="citadel-mcp-line">
            <span class="text-green">[AI CONTEXT BRIDGE ACTIVE]</span> Codebase-Memory-MCP (90%+ Token Savings Connected)
          </div>
          <button class="launch-btn citadel-launch-btn" id="launchBtn">[ DEFEND CODEBASE.UNIVERSE CITADEL ]</button>
        </div>
      `;
    }

    // Attach listeners
    const launchBtn = content.querySelector('#launchBtn');
    const targetInput = content.querySelector('#targetInput') as HTMLInputElement | null;

    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        const val = targetInput ? targetInput.value.trim() : '';
        this.onLaunchCallback(mode, val);
      });
    }

    if (targetInput) {
      targetInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.onLaunchCallback(mode, targetInput.value.trim());
        }
      });
    }

    const tagBtns = content.querySelectorAll('.tag-btn');
    tagBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = (btn as HTMLElement).dataset.val;
        if (targetInput && val) {
          targetInput.value = val;
          this.onLaunchCallback(mode, val);
        }
      });
    });
  }

  public addLog(message: string, colorClass: string = ''): void {
    const logs = this.container.querySelector('#terminalLogs');
    if (!logs) return;

    const line = document.createElement('div');
    line.className = `log-line ${colorClass}`;
    line.textContent = `> ${message}`;
    logs.appendChild(line);
    logs.scrollTop = logs.scrollHeight;
  }

  public clearLogs(): void {
    const logs = this.container.querySelector('#terminalLogs');
    if (logs) logs.innerHTML = '';
  }

  public hide(): void {
    this.container.style.display = 'none';
  }

  public show(mode?: GameMode): void {
    this.container.style.display = 'flex';
    if (mode) {
      const tabs = this.container.querySelectorAll('.tab-btn');
      tabs.forEach((t) => {
        t.classList.toggle('active', (t as HTMLElement).dataset.mode === mode);
      });
      this.selectTab(mode);
    }
  }
}
