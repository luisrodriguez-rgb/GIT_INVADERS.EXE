export class GameLoop {
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private rafId: number = 0;
  private updateFn: (dt: number) => void;
  private renderFn: () => void;

  constructor(updateFn: (dt: number) => void, renderFn: () => void) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  private tick(timestamp: number): void {
    if (!this.isRunning) return;

    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Clamp dt to avoid physics glitches on tab defocus
    if (dt > 0.1) dt = 0.1;

    this.updateFn(dt);
    this.renderFn();

    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }
}
