/**
 * Security & Sanitization Utilities
 * Prevents DOM-based XSS attacks from untrusted GitHub API payloads
 * and validates persisted local state.
 */

export class Security {
  /**
   * Escapes HTML entities to prevent script injection in innerHTML
   */
  public static escapeHtml(unsafe: string | null | undefined): string {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Validates and sanitizes integer values with safe boundaries
   */
  public static clampInt(value: unknown, fallback: number, min: number, max: number): number {
    const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (isNaN(parsed)) return fallback;
    return Math.min(max, Math.max(min, Math.trunc(parsed)));
  }

  /**
   * Validates and sanitizes finite numbers with safe boundaries
   */
  public static sanitizeNumber(val: unknown, fallback: number, min: number, max: number): number {
    const parsed = typeof val === 'number' ? val : Number(val);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
  }

  /**
   * Validates GitHub usernames and repository slugs against injection or path traversal
   */
  public static isValidGitHubIdentifier(val: string): boolean {
    if (!val || typeof val !== 'string') return false;
    return /^[a-zA-Z0-9._-]{1,100}$/.test(val.trim());
  }

  /**
   * Safely parses JSON while stripping prototype-pollution keys
   */
  public static safeJsonParse<T>(raw: string | null, fallback: T): T {
    if (!raw || typeof raw !== 'string') return fallback;
    try {
      const parsed = JSON.parse(raw, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return undefined;
        }
        return value;
      });
      if (parsed === null || typeof parsed !== 'object') return fallback;
      return parsed as T;
    } catch {
      return fallback;
    }
  }
}
