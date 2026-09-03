/**
 * LocalStorage caching layer with TTL to protect GitHub API limits
 */
export class GitHubCache {
  private static PREFIX = 'git_invaders_cache_';
  private static DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes

  public static get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.PREFIX + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      const now = Date.now();
      if (now > item.expiry) {
        localStorage.removeItem(this.PREFIX + key);
        return null;
      }
      return item.value as T;
    } catch {
      return null;
    }
  }

  public static set<T>(key: string, value: T, ttlMs: number = this.DEFAULT_TTL_MS): void {
    try {
      const item = {
        value,
        expiry: Date.now() + ttlMs,
      };
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
}
