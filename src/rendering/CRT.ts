export type CRTIntensity = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';

export class CRTEffects {
  private trauma: number = 0;
  private hitFlashTimer: number = 0;
  private flashColor: string = 'rgba(255, 255, 255, 0.3)';
  public intensity: CRTIntensity = 'MEDIUM';
  public scanlinesEnabled: boolean = true;
  public bloomEnabled: boolean = true;

  public cycleIntensity(): CRTIntensity {
    if (this.intensity === 'OFF') this.intensity = 'LOW';
    else if (this.intensity === 'LOW') this.intensity = 'MEDIUM';
    else if (this.intensity === 'MEDIUM') this.intensity = 'HIGH';
    else this.intensity = 'OFF';

    this.scanlinesEnabled = this.intensity !== 'OFF';
    return this.intensity;
  }

  public addTrauma(amount: number): void {
    if (this.intensity === 'OFF') return;
    const mult = this.intensity === 'LOW' ? 0.6 : this.intensity === 'MEDIUM' ? 1.0 : 1.4;
    this.trauma = Math.min(1.0, this.trauma + amount * mult);
  }

  public triggerFlash(color: string = 'rgba(255, 255, 255, 0.35)', duration: number = 0.08): void {
    if (this.intensity === 'OFF') return;
    this.flashColor = color;
    this.hitFlashTimer = duration;
  }

  public update(dt: number): { offsetX: number; offsetY: number; rotation: number } {
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
    }

    if (this.trauma > 0 && this.intensity !== 'OFF') {
      this.trauma = Math.max(0, this.trauma - dt * 1.5);
      const shake = this.trauma * this.trauma; // Non-linear response
      const maxOffset = this.intensity === 'LOW' ? 7 : this.intensity === 'HIGH' ? 22 : 14;
      const offsetX = (Math.random() * 2 - 1) * maxOffset * shake;
      const offsetY = (Math.random() * 2 - 1) * maxOffset * shake;
      const rotation = (Math.random() * 2 - 1) * 0.03 * shake;
      return { offsetX, offsetY, rotation };
    }

    return { offsetX: 0, offsetY: 0, rotation: 0 };
  }

  public renderPost(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.intensity === 'OFF') return;

    // Hit flash
    if (this.hitFlashTimer > 0) {
      ctx.save();
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // Scanlines overlay scaled by intensity
    if (this.scanlinesEnabled) {
      ctx.save();
      const alpha = this.intensity === 'LOW' ? 0.07 : this.intensity === 'HIGH' ? 0.22 : 0.12;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1.2);
      }
      ctx.restore();
    }
  }
}
