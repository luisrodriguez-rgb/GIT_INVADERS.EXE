import './style.css';
import { Game } from './core/Game';
import { AudioEngine } from './audio/AudioEngine';
import { ThemeManager, ThemeId } from './themes/ThemeManager';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const termContainer = document.getElementById('terminalOverlay') as HTMLElement;
  const hudContainer = document.getElementById('hudContainer') as HTMLElement;
  const modalContainer = document.getElementById('modalOverlay') as HTMLElement;

  if (!canvas || !termContainer || !hudContainer || !modalContainer) {
    console.error('Core DOM elements missing for GIT_INVADERS.EXE');
    return;
  }

  const game = new Game(canvas, termContainer, hudContainer, modalContainer);

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

  // Header Store Button
  const storeBtn = document.getElementById('storeBtn');
  storeBtn?.addEventListener('click', () => {
    game.openStore();
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

  // CRT scanlines toggle button in header
  const crtToggle = document.getElementById('crtToggle');
  crtToggle?.addEventListener('click', () => {
    game.crt.scanlinesEnabled = !game.crt.scanlinesEnabled;
    crtToggle.classList.toggle('active', game.crt.scanlinesEnabled);
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
});
