export type ParticleType = 'spark' | 'text' | 'ring' | 'code_fragment' | 'debris' | 'pixel';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: ParticleType;
  text?: string;
  rotation?: number;
  vRot?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private pool: Particle[] = [];

  private static readonly CODE_TOKENS = ['{ }', '< >', '//', 'git', 'PR', 'merge', '404', '#', 'OK', '+XP', '0x7F', 'COMMIT', 'null', 'void'];
  private static readonly COMMIT_TOKENS = ['commit', 'hash', '#', 'git', '0x7F', 'diff', 'HEAD'];
  private static readonly PR_TOKENS = ['PR', 'merge', '< >', '{ }', 'branch', 'approve', 'rebase'];
  private static readonly ISSUE_TOKENS = ['BUG', '404', '!', 'null', 'void', 'ERR', 'panic'];
  private static readonly BOSS_TOKENS = ['FATAL', 'ERROR', '500', 'CORE', 'BREACH', 'SEGFAULT', 'CRITICAL'];

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

      if (p.rotation !== undefined && p.vRot !== undefined) {
        p.rotation += p.vRot * dt;
      }

      if (p.type === 'spark' || p.type === 'debris') {
        p.vx *= 0.94; // Drag
        p.vy *= 0.94;
        p.vy += 15 * dt; // Gravity
      } else if (p.type === 'code_fragment') {
        p.vx *= 0.96;
        p.vy -= 8 * dt; // Light upward drift
      } else if (p.type === 'text') {
        p.vy -= 18 * dt; // Upward drift
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
      } else if (p.type === 'pixel') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
      } else if (p.type === 'code_fragment' && p.text) {
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillText(p.text, -ctx.measureText(p.text).width / 2, 4);
        ctx.restore();
      } else if (p.type === 'debris') {
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = alpha;
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
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
      size: 45,
      color,
      type: 'ring',
    });
  }

  /**
   * Emits semantic developer code fragments that disperse on hit/destruction
   */
  public emitCodeFragments(
    x: number,
    y: number,
    color: string = '#38bdf8',
    count: number = 5,
    category: 'commit' | 'pr' | 'issue' | 'boss' | 'general' = 'general'
  ): void {
    const tokenPool =
      category === 'commit'
        ? ParticleSystem.COMMIT_TOKENS
        : category === 'pr'
        ? ParticleSystem.PR_TOKENS
        : category === 'issue'
        ? ParticleSystem.ISSUE_TOKENS
        : category === 'boss'
        ? ParticleSystem.BOSS_TOKENS
        : ParticleSystem.CODE_TOKENS;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 25 + Math.random() * 85;
      const token = tokenPool[Math.floor(Math.random() * tokenPool.length)];

      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1.0,
        size: 10,
        color,
        type: 'code_fragment',
        text: token,
        rotation: (Math.random() - 0.5) * 0.5,
        vRot: (Math.random() - 0.5) * 3,
      });
    }
  }

  public emitDebris(x: number, y: number, color: string = '#ffffff', count: number = 6): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * 110;

      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        size: 3 + Math.random() * 3,
        color,
        type: 'debris',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 6,
      });
    }
  }

  public emitText(x: number, y: number, text: string, color: string = '#00e5ff'): void {
    this.addParticle({
      x,
      y,
      vx: (Math.random() - 0.5) * 25,
      vy: -45,
      life: 0.85,
      maxLife: 0.85,
      size: 11,
      color,
      type: 'text',
      text,
    });
  }

  private addParticle(p: Particle): void {
    if (this.particles.length > 500) return; // Particle limit for optimal 60 FPS
    this.particles.push(p);
  }

  public clear(): void {
    this.particles = [];
  }
}
