import { GameMode } from '../github/Types';

export class Terminal {
  private container: HTMLElement;
  private onLaunchCallback: (mode: GameMode, input: string) => void;

  constructor(
    container: HTMLElement,
    onLaunch: (mode: GameMode, input: string) => void
  ) {
    this.container = container;
    this.onLaunchCallback = onLaunch;
    this.render();
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
          <div class="terminal-clock" id="termClock">ACTIVE</div>
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
            <button class="tab-btn chaos-tab" data-mode="chaos">3. CHAOS MODE [INSTANT]</button>
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
            <input type="text" id="targetInput" value="luisrodriguez-rgb/sketion" placeholder="owner/repository" />
            <button class="launch-btn" id="launchBtn">ENGAGE REPO BOSS [ENTER]</button>
          </div>
        </div>
        <div class="quick-tags">
          <span>QUICK REPOS:</span>
          <button class="tag-btn" data-val="luisrodriguez-rgb/sketion">luisrodriguez-rgb/sketion</button>
          <button class="tag-btn" data-val="torvalds/linux">torvalds/linux</button>
          <button class="tag-btn" data-val="facebook/react">facebook/react</button>
        </div>
      `;
    } else if (mode === 'chaos') {
      content.innerHTML = `
        <div class="chaos-box">
          <div class="chaos-desc">
            <span class="text-pink font-bold">WARNING: MAXIMUM CHAOS PROTOCOL.</span><br/>
            Zero GitHub dependencies. Instant procedural overdrive. 9,999 commits, 482 PRs, 731 issues.
          </div>
          <button class="launch-btn chaos-launch" id="launchBtn">⚡ INITIATE CHAOS INVASION ⚡</button>
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

  public show(): void {
    this.container.style.display = 'flex';
  }
}
