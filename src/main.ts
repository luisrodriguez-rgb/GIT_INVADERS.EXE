import './style.css';
import { Game } from './core/Game';
import { AudioEngine } from './audio/AudioEngine';
import { ThemeManager, ThemeId } from './themes/ThemeManager';
import { I18n } from './i18n/I18n';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const lobbyContainer = document.getElementById('lobbyOverlay') as HTMLElement;
  const termContainer = document.getElementById('terminalOverlay') as HTMLElement;
  const hudContainer = document.getElementById('hudContainer') as HTMLElement;
  const modalContainer = document.getElementById('modalOverlay') as HTMLElement;

  if (!canvas || !lobbyContainer || !termContainer || !hudContainer || !modalContainer) {
    console.error('Core DOM elements missing for GIT_INVADERS.EXE');
    return;
  }

  const game = new Game(canvas, lobbyContainer, termContainer, hudContainer, modalContainer);
  (window as any).__game = game;

  // Header Lobby Button
  const lobbyBtn = document.getElementById('lobbyBtn');
  lobbyBtn?.addEventListener('click', () => {
    game.returnToLobby();
  });

  // Theme Dropdown Selector (Matrix, Light, Cyberpunk, Cyan, Amber)
  const themeSelect = document.getElementById('themeSelect') as HTMLSelectElement | null;
  const themeManager = ThemeManager.getInstance();

  if (themeSelect) {
    themeSelect.value = themeManager.currentTheme.id;
    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = (e.target as HTMLSelectElement).value as ThemeId;
      themeManager.setTheme(selectedTheme);
    });
  }

  // Header Pause Button
  const pauseBtn = document.getElementById('pauseBtn');
  pauseBtn?.addEventListener('click', () => {
    game.togglePause();
  });


  // Mobile virtual controls
  const btnLeft = document.getElementById('btnLeft');
  const btnRight = document.getElementById('btnRight');
  const btnFire = document.getElementById('btnFire');
  const btnRebase = document.getElementById('btnRebase');
  const btnStash = document.getElementById('btnStash');
  const btnOverdrive = document.getElementById('btnOverdrive');

  const triggerKey = (code: string, pressed: boolean) => {
    window.dispatchEvent(new KeyboardEvent(pressed ? 'keydown' : 'keyup', { code }));
  };

  btnLeft?.addEventListener('touchstart', (e) => { e.preventDefault(); triggerKey('ArrowLeft', true); });
  btnLeft?.addEventListener('touchend', (e) => { e.preventDefault(); triggerKey('ArrowLeft', false); });
  btnLeft?.addEventListener('mousedown', () => triggerKey('ArrowLeft', true));
  btnLeft?.addEventListener('mouseup', () => triggerKey('ArrowLeft', false));

  btnRight?.addEventListener('touchstart', (e) => { e.preventDefault(); triggerKey('ArrowRight', true); });
  btnRight?.addEventListener('touchend', (e) => { e.preventDefault(); triggerKey('ArrowRight', false); });
  btnRight?.addEventListener('mousedown', () => triggerKey('ArrowRight', true));
  btnRight?.addEventListener('mouseup', () => triggerKey('ArrowRight', false));

  btnFire?.addEventListener('touchstart', (e) => { e.preventDefault(); triggerKey('Space', true); });
  btnFire?.addEventListener('touchend', (e) => { e.preventDefault(); triggerKey('Space', false); });
  btnFire?.addEventListener('mousedown', () => triggerKey('Space', true));
  btnFire?.addEventListener('mouseup', () => triggerKey('Space', false));

  btnRebase?.addEventListener('click', () => triggerKey('KeyQ', true));
  btnStash?.addEventListener('click', () => triggerKey('KeyE', true));
  btnOverdrive?.addEventListener('click', () => triggerKey('ShiftLeft', true));

  // CRT intensity multi-tier toggle button in header (OFF, LOW, MEDIUM, HIGH)
  const crtToggle = document.getElementById('crtToggle');
  if (crtToggle) {
    crtToggle.textContent = `CRT: ${game.crt.intensity}`;
    crtToggle.classList.add('active');
  }
  crtToggle?.addEventListener('click', () => {
    const newIntensity = game.crt.cycleIntensity();
    if (crtToggle) {
      crtToggle.textContent = `CRT: ${newIntensity}`;
      crtToggle.classList.toggle('active', newIntensity !== 'OFF');
    }
    const scanlineEl = document.querySelector('.crt-scanline-overlay') as HTMLElement;
    if (scanlineEl) {
      scanlineEl.style.display = newIntensity !== 'OFF' ? 'block' : 'none';
      scanlineEl.style.opacity = newIntensity === 'LOW' ? '0.25' : newIntensity === 'HIGH' ? '0.7' : '0.45';
    }
  });

  // Audio mute toggle
  const audioToggle = document.getElementById('audioToggle');
  audioToggle?.addEventListener('click', () => {
    const isMuted = AudioEngine.getInstance().toggleMute();
    if (audioToggle) {
      audioToggle.textContent = isMuted ? 'AUDIO: MUTED' : 'AUDIO: ON';
      audioToggle.classList.toggle('muted', isMuted);
    }
  });

  // Language Toggle Button & Dynamic Chrome Translation
  const i18n = I18n.getInstance();
  const langToggleBtn = document.getElementById('langToggleBtn');

  const updateChromeTranslations = () => {
    const t = i18n.t;
    if (langToggleBtn) {
      langToggleBtn.textContent = t.btnLang;
    }
    if (lobbyBtn) {
      lobbyBtn.textContent = t.btnLobby;
    }
    if (pauseBtn) {
      pauseBtn.textContent = t.btnPause;
    }

    // Theme selector option names
    if (themeSelect) {
      const optMap: Record<string, string> = {
        cyan: t.themeCyberCyan,
        matrix: t.themeMatrix,
        light: t.themeGithubLight,
        cyberpunk: t.themeCyberpunk,
        amber: t.themeAmber,
      };
      Array.from(themeSelect.options).forEach((opt) => {
        if (optMap[opt.value]) {
          opt.textContent = optMap[opt.value];
        }
      });
    }

    // Footer desktop keybindings
    const setLbl = (id: string, text: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    setLbl('lblKeyMove', t.footerKeyMove);
    setLbl('lblKeyFire', t.footerKeyFire);
    setLbl('lblKeyRebase', t.footerKeyRebase);
    setLbl('lblKeyStash', t.footerKeyStash);
    setLbl('lblKeyPush', t.footerKeyPush);
    setLbl('lblKeyPause', t.footerKeyPause);
  };

  langToggleBtn?.addEventListener('click', () => {
    i18n.toggleLanguage();
    updateChromeTranslations();
  });

  i18n.subscribe(() => {
    updateChromeTranslations();
  });

  // Run initial translation setup
  updateChromeTranslations();
});
