export type ThemeId = 'matrix' | 'light' | 'cyberpunk' | 'cyan' | 'amber';

export interface ThemeColors {
  id: ThemeId;
  name: string;
  bgCabinet: string;
  bgScreen: string;
  primaryAccent: string;
  secondaryAccent: string;
  playerColor: string;
  laserColor: string;
  beamColor: string;
  invaderColor: string;
  prColor: string;
  issueColor: string;
  bunkerColor: string;
  crtScanlineOpacity: number;
}

export const THEMES: Record<ThemeId, ThemeColors> = {
  matrix: {
    id: 'matrix',
    name: 'Matrix Phosphor (Oscuro)',
    bgCabinet: '#020b04',
    bgScreen: '#010903',
    primaryAccent: '#00ff66',
    secondaryAccent: '#00b347',
    playerColor: '#00ff66',
    laserColor: '#57ff89',
    beamColor: '#00ff66',
    invaderColor: '#00e65c',
    prColor: '#10b981',
    issueColor: '#34d399',
    bunkerColor: '#00cc52',
    crtScanlineOpacity: 0.16,
  },
  light: {
    id: 'light',
    name: 'Modo Claro (GitHub Light)',
    bgCabinet: '#f0f2f5',
    bgScreen: '#0d1117',
    primaryAccent: '#1a7f37',
    secondaryAccent: '#0969da',
    playerColor: '#0969da',
    laserColor: '#1f883d',
    beamColor: '#8250df',
    invaderColor: '#1a7f37',
    prColor: '#8250df',
    issueColor: '#cf222e',
    bunkerColor: '#2da44e',
    crtScanlineOpacity: 0.04,
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon (Fucsia)',
    bgCabinet: '#0d061a',
    bgScreen: '#07030e',
    primaryAccent: '#ff007f',
    secondaryAccent: '#00f0ff',
    playerColor: '#00f0ff',
    laserColor: '#ff007f',
    beamColor: '#ff007f',
    invaderColor: '#ffd600',
    prColor: '#c084fc',
    issueColor: '#ff0055',
    bunkerColor: '#00f0ff',
    crtScanlineOpacity: 0.14,
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan (Azul)',
    bgCabinet: '#040b17',
    bgScreen: '#030813',
    primaryAccent: '#00e5ff',
    secondaryAccent: '#38bdf8',
    playerColor: '#00e5ff',
    laserColor: '#38bdf8',
    beamColor: '#ff007f',
    invaderColor: '#00ff66',
    prColor: '#a855f7',
    issueColor: '#ef4444',
    bunkerColor: '#10b981',
    crtScanlineOpacity: 0.12,
  },
  amber: {
    id: 'amber',
    name: 'Amber CRT (Terminal)',
    bgCabinet: '#120800',
    bgScreen: '#0a0400',
    primaryAccent: '#ffb000',
    secondaryAccent: '#ea580c',
    playerColor: '#ffb000',
    laserColor: '#ffd600',
    beamColor: '#ff8000',
    invaderColor: '#ffb000',
    prColor: '#f97316',
    issueColor: '#ef4444',
    bunkerColor: '#d97706',
    crtScanlineOpacity: 0.18,
  },
};

export class ThemeManager {
  private static instance: ThemeManager;
  public currentTheme: ThemeColors = THEMES.cyan;
  private static STORAGE_KEY = 'git_invaders_active_theme';

  private constructor() {
    this.loadSavedTheme();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public setTheme(themeId: ThemeId): void {
    if (!THEMES[themeId]) return;
    this.currentTheme = THEMES[themeId];
    document.body.setAttribute('data-theme', themeId);
    document.documentElement.style.setProperty('--scanline-opacity', String(this.currentTheme.crtScanlineOpacity));
    try {
      localStorage.setItem(ThemeManager.STORAGE_KEY, themeId);
    } catch {}
  }

  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem(ThemeManager.STORAGE_KEY) as ThemeId;
      if (saved && THEMES[saved]) {
        this.currentTheme = THEMES[saved];
      }
    } catch {}
    document.body.setAttribute('data-theme', this.currentTheme.id);
    document.documentElement.style.setProperty('--scanline-opacity', String(this.currentTheme.crtScanlineOpacity));
  }
}
