export type GamePhase =
  | 'BOOT'
  | 'MENU'
  | 'PLAYING'
  | 'BOSS_ALERT'
  | 'BOSS_FIGHT'
  | 'GAMEOVER'
  | 'VICTORY';

export class GameState {
  public phase: GamePhase = 'BOOT';
  public score: number = 0;
  public highScore: number = 0;
  public xp: number = 0;
  public currentWave: number = 1;
  public totalWaves: number = 4;
  public commitsPurged: number = 0;
  public prsMerged: number = 0;
  public issuesClosed: number = 0;
  public streakCount: number = 0;
  public streakMultiplier: number = 1.0;

  private static HIGH_SCORE_KEY = 'git_invaders_high_score';

  constructor() {
    this.loadHighScore();
  }

  public addScore(basePoints: number): void {
    const points = Math.round(basePoints * this.streakMultiplier);
    this.score += points;
    this.xp += points;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  public incrementStreak(): void {
    this.streakCount++;
    this.streakMultiplier = Math.min(4.0, 1.0 + Math.floor(this.streakCount / 5) * 0.5);
  }

  public resetStreak(): void {
    this.streakCount = 0;
    this.streakMultiplier = 1.0;
  }

  public reset(): void {
    this.score = 0;
    this.xp = 0;
    this.currentWave = 1;
    this.commitsPurged = 0;
    this.prsMerged = 0;
    this.issuesClosed = 0;
    this.streakCount = 0;
    this.streakMultiplier = 1.0;
  }

  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem(GameState.HIGH_SCORE_KEY);
      if (saved) this.highScore = parseInt(saved, 10) || 0;
    } catch {}
  }

  private saveHighScore(): void {
    try {
      localStorage.setItem(GameState.HIGH_SCORE_KEY, this.highScore.toString());
    } catch {}
  }
}
