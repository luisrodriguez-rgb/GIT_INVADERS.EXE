import { Entity } from './Entity';

export class Bunker extends Entity {
  public label: string;
  public grid: boolean[][];
  public cols: number = 12;
  public rows: number = 8;
  public cellWidth: number;
  public cellHeight: number;
  public initialCells: number = 0;

  constructor(x: number, y: number, label: string = '.gitignore') {
    const width = 64;
    const height = 44;
    super(x, y, width, height);
    this.label = label;
    this.cellWidth = width / this.cols;
    this.cellHeight = height / this.rows;

    // Initialize solid arch shape
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        // Hollow out bottom center for classic bunker arch
        if (r >= this.rows - 3 && c >= 4 && c <= 7) {
          this.grid[r][c] = false;
        } else {
          this.grid[r][c] = true;
          this.initialCells++;
        }
      }
    }
  }

  public getRemainingCells(): number {
    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) count++;
      }
    }
    return count;
  }

  public getIntegrity(): number {
    if (this.initialCells === 0) return 0;
    return this.getRemainingCells() / this.initialCells;
  }

  public update(_dt: number, _bounds: { width: number; height: number }): void {
    // Static bunker
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const integrity = this.getIntegrity();

    let bunkerColor = '#10b981'; // Healthy green
    if (integrity <= 0.3) {
      bunkerColor = '#ef4444'; // Critical red
    } else if (integrity <= 0.65) {
      bunkerColor = '#f59e0b'; // Degraded yellow
    }

    ctx.fillStyle = bunkerColor;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          ctx.fillRect(
            this.x + c * this.cellWidth,
            this.y + r * this.cellHeight,
            this.cellWidth - 0.5,
            this.cellHeight - 0.5
          );
        }
      }
    }

    // Label & Integrity Bar below bunker
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    if (integrity <= 0) {
      ctx.fillStyle = '#ef4444';
      ctx.fillText('[ CORRUPTED ]', this.centerX, this.y + this.height + 11);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(this.label, this.centerX, this.y + this.height + 10);

      // Segmented integrity bar
      const barW = 44;
      const barH = 3;
      const barX = this.centerX - barW / 2;
      const barY = this.y + this.height + 14;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(barX, barY, barW, barH);

      ctx.fillStyle = bunkerColor;
      ctx.fillRect(barX, barY, barW * integrity, barH);
    }

    ctx.restore();
  }

  /**
   * Checks collision with a projectile and erodes cells within impact radius
   */
  public checkImpact(px: number, py: number, radius: number = 6): boolean {
    if (
      px < this.x - radius ||
      px > this.x + this.width + radius ||
      py < this.y - radius ||
      py > this.y + this.height + radius
    ) {
      return false;
    }

    let hit = false;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          const cx = this.x + c * this.cellWidth + this.cellWidth / 2;
          const cy = this.y + r * this.cellHeight + this.cellHeight / 2;
          const dist = Math.hypot(px - cx, py - cy);

          if (dist <= radius + this.cellWidth) {
            this.grid[r][c] = false;
            hit = true;
          }
        }
      }
    }

    return hit;
  }
}
