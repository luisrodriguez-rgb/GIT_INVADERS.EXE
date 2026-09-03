export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'text' | 'ring';
  text?: string;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private pool: Particle[] = [];

  public update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        if (this.pool.length < 500) this.pool.push(p);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.type === 'spark') {
        p.vx *= 0.94; // Drag
        p.vy *= 0.94;
      } else if (p.type === 'text') {
        p.vy -= 12 * dt; // Upward drift
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alpha = Math.max(0, p.life / p.maxLife);

      if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else if (p.type === 'text' && p.text) {
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillText(p.text, p.x, p.y);
      } else if (p.type === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2;
        const currentRadius = p.size * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  public emitExplosion(x: number, y: number, color: string = '#00ff66', count: number = 24): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 180;
      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3 + Math.random() * 0.4,
        maxLife: 0.7,
        size: 2 + Math.random() * 3,
        color,
        type: 'spark',
      });
    }

    // Shockwave ring
    this.addParticle({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.35,
      maxLife: 0.35,
      size: 40,
      color,
      type: 'ring',
    });
  }

  public emitText(x: number, y: number, text: string, color: string = '#00e5ff'): void {
    this.addParticle({
      x,
      y,
      vx: (Math.random() - 0.5) * 30,
      vy: -40,
      life: 0.8,
      maxLife: 0.8,
      size: 11,
      color,
      type: 'text',
      text,
    });
  }

  private addParticle(p: Particle): void {
    if (this.particles.length > 400) return; // Particle limit for optimal 60 FPS
    this.particles.push(p);
  }

  public clear(): void {
    this.particles = [];
  }
}
