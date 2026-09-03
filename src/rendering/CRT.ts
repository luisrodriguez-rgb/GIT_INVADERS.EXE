export class CRTEffects {
  private trauma: number = 0;
  private hitFlashTimer: number = 0;
  private flashColor: string = 'rgba(255, 255, 255, 0.3)';
  public scanlinesEnabled: boolean = true;
  public bloomEnabled: boolean = true;

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public triggerFlash(color: string = 'rgba(255, 255, 255, 0.35)', duration: number = 0.08): void {
    this.flashColor = color;
    this.hitFlashTimer = duration;
  }

  public update(dt: number): { offsetX: number; offsetY: number; rotation: number } {
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= dt;
    }

    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 1.5);
      const shake = this.trauma * this.trauma; // Non-linear response
      const maxOffset = 14;
      const offsetX = (Math.random() * 2 - 1) * maxOffset * shake;
      const offsetY = (Math.random() * 2 - 1) * maxOffset * shake;
      const rotation = (Math.random() * 2 - 1) * 0.03 * shake;
      return { offsetX, offsetY, rotation };
    }

    return { offsetX: 0, offsetY: 0, rotation: 0 };
  }

  public renderPost(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Hit flash
    if (this.hitFlashTimer > 0) {
      ctx.save();
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // Subtle scanlines overlay
    if (this.scanlinesEnabled) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1.2);
      }
      ctx.restore();
    }
  }
}
