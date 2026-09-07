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
    return Math.min(max, Math.max(min, parsed));
  }
}
