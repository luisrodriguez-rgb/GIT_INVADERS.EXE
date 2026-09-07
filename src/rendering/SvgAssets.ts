/**
 * Centralized SVG asset library for GIT_INVADERS.EXE
 * Provides high-DPI vector paths, glyphs, and helper renderers for Canvas and DOM.
 * Zero external asset dependencies.
 */

export class SvgAssets {
  public static readonly OCTOCAT_PATH =
    'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';

  public static readonly GIT_PULL_REQUEST_PATH =
    'M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-1.25 2.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm9.75 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-1.25 2.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm-8.5-4.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zm0 6a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-1.25 2.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z';

  public static readonly GIT_COMMIT_PATH =
    'M10.5 8a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.45 0a3.998 3.998 0 00-7.9 0H0v1.5h4.05a3.998 3.998 0 007.9 0H16V8h-4.05z';

  public static readonly GIT_BRANCH_PATH =
    'M11.75 2.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-1.25 2.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm-8 4.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-1.25 2.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm9.25-1.5a.75.75 0 01.75.75v1.25a2.25 2.25 0 01-2.25 2.25h-4.5a.75.75 0 010-1.5h4.5a.75.75 0 00.75-.75V8.5a.75.75 0 01.75-.75zm-6.5-6a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z';

  public static readonly ISSUE_BUG_PATH =
    'M4.75 4a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5A.75.75 0 004.75 4zm6.5 0a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM8 0a4 4 0 00-3.9 3.12 3.5 3.5 0 00-2.35 3.3v.08H.75a.75.75 0 000 1.5h1V9a3.5 3.5 0 001.27 2.72L1.22 13.53a.75.75 0 101.06 1.06l2.12-2.12A4.47 4.47 0 008 13.5c1.33 0 2.54-.58 3.37-1.5l2.41 2.41a.75.75 0 001.06-1.06l-2.05-2.05A3.5 3.5 0 0014 9V8h1a.75.75 0 000-1.5h-1V6.5a3.5 3.5 0 00-2.1-3.2A4 4 0 008 0zm-2.5 4.5A2.5 2.5 0 018 2a2.5 2.5 0 012.5 2.5V5h-5v-.5zM3.25 7.5a2 2 0 012-2h5.5a2 2 0 012 2v1.5a3.5 3.5 0 01-7 0v-1.5z';

  /**
   * Generates an SVG string representation for use in DOM headers, chips and cards
   */
  public static getSvg(
    path: string,
    size: number = 16,
    color: string = 'currentColor',
    viewBox: string = '0 0 16 16'
  ): string {
    return `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="${color}" style="vertical-align: middle;">
      <path fill-rule="evenodd" d="${path}"></path>
    </svg>`;
  }

  /**
   * Renders any SVG path directly onto a Canvas2D context with high DPI and transformations
   */
  public static renderPathToCanvas(
    ctx: CanvasRenderingContext2D,
    pathString: string,
    x: number,
    y: number,
    size: number,
    color: string,
    alpha: number = 1.0
  ): void {
    ctx.save();
    ctx.translate(x, y);
    const scale = size / 16;
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;

    if (typeof Path2D !== 'undefined') {
      const p = new Path2D(pathString);
      ctx.fill(p);
    }
    ctx.restore();
  }
}
