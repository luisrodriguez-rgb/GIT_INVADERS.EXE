import { NormalizedGameData, SampleCommit, SamplePR, SampleIssue, GitHubMetrics } from './Types';
import { DataNormalizer } from './Normalizer';

export class DataSynthesizer {
  /**
   * Generates instant CHAOS MODE dataset (No GitHub needed, maximum intensity)
   */
  public static generateChaosMode(): NormalizedGameData {
    const metrics: GitHubMetrics = {
      totalCommits: 9999,
      pullRequests: 482,
      openIssues: 731,
      contributors: 48,
      languages: ['TypeScript', 'Rust', 'C++', 'Python', 'Go', 'Assembly'],
      primaryLanguage: 'TypeScript',
      streakDays: 365,
      recentActivityScore: 100,
      repoCount: 6,
      stars: 42000,
    };

    const commits: SampleCommit[] = [
      { sha: '0x99FF', message: 'fatal: recursive thread deadlock in core', author: 'CHAOS_DAEMON' },
      { sha: '0x88EE', message: 'feat: quantum event horizon bridge', author: 'NEO_COMPILER' },
      { sha: '0x77DD', message: 'hotfix: infinite loop in particle spacetime', author: 'ROOT' },
      { sha: '0x66CC', message: 'refactor: wipe legacy spacetime reality', author: 'VOID' },
      { sha: '0x55BB', message: 'merge: branch singular into origin/main', author: 'MATRIX' },
      { sha: '0x44AA', message: 'perf: overclock CPU register pipelines 400%', author: 'KERNEL' },
    ];

    const prs: SamplePR[] = [
      { number: 482, title: 'PR #482: Merge Singularity Engine into Master', author: 'ARCHITECT' },
      { number: 481, title: 'PR #481: Zero-Day Memory Armor Protocols', author: 'CYBER_SEC' },
      { number: 480, title: 'PR #480: Hyper-Drive Thread Scheduler v9', author: 'SYS_ADMIN' },
    ];

    const issues: SampleIssue[] = [
      { number: 731, title: 'ISSUE #731: Core containment breach in memory stack' },
      { number: 730, title: 'ISSUE #730: Unhandled promise rejection in reality.ts' },
      { number: 729, title: 'ISSUE #729: Infinite recursion bomb detected' },
    ];

    return DataNormalizer.normalize(
      'chaos',
      'CHAOS // MAX OVERDRIVE',
      'SYSTEM_ANOMALY',
      'SINGULARITY_CORE',
      metrics,
      commits,
      prs,
      issues
    );
  }

  /**
   * Generates a curated or procedural fallback for any username/repo if rate-limited
   */
  public static generateFallback(username: string, repoInput?: string): NormalizedGameData {
    const cleanUser = username.trim().toLowerCase();
    const repoName = repoInput ? repoInput.split('/').pop() || 'core-engine' : 'sketion';

    // Curated high-detail profile for user luisrodriguez-rgb
    if (cleanUser.includes('luis') || cleanUser.includes('rgb')) {
      const metrics: GitHubMetrics = {
        totalCommits: 1420,
        pullRequests: 58,
        openIssues: 24,
        contributors: 6,
        languages: ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
        primaryLanguage: 'TypeScript',
        streakDays: 45,
        recentActivityScore: 88,
        repoCount: 5,
        stars: 340,
      };

      const commits: SampleCommit[] = [
        { sha: 'a1b2c3', message: 'feat: add procedural vector canvas renderer', author: 'luisrodriguez-rgb' },
        { sha: 'd4e5f6', message: 'fix: optimize 60fps game loop interpolation', author: 'luisrodriguez-rgb' },
        { sha: '789abc', message: 'refactor: decouple data normalizer pipeline', author: 'luisrodriguez-rgb' },
        { sha: '123def', message: 'feat: Web Audio API chiptune synthesizer', author: 'luisrodriguez-rgb' },
      ];

      const prs: SamplePR[] = [
        { number: 42, title: 'PR #42: Dynamic Boss Blueprint Generator', author: 'luisrodriguez-rgb' },
        { number: 41, title: 'PR #41: CRT Shader and Phosphor Bloom', author: 'luisrodriguez-rgb' },
      ];

      const issues: SampleIssue[] = [
        { number: 18, title: 'ISSUE #18: Bug bomb tracking velocity calibration' },
        { number: 17, title: 'ISSUE #17: Particle emitter memory recycle pool' },
      ];

      return DataNormalizer.normalize(
        repoInput ? 'repository' : 'profile',
        repoInput ? `${username}/${repoName}` : username,
        username,
        repoName,
        metrics,
        commits,
        prs,
        issues
      );
    }

    // Curated profile for torvalds
    if (cleanUser.includes('torvalds')) {
      const metrics: GitHubMetrics = {
        totalCommits: 8500,
        pullRequests: 120,
        openIssues: 95,
        contributors: 350,
        languages: ['C', 'Assembly', 'Shell'],
        primaryLanguage: 'C',
        streakDays: 90,
        recentActivityScore: 92,
        repoCount: 4,
        stars: 185000,
      };

      const commits: SampleCommit[] = [
        { sha: 'f94a12', message: 'Linux 6.12 release candidate merge', author: 'torvalds' },
        { sha: 'c28e90', message: 'x86/entry: clean up syscall dispatch table', author: 'torvalds' },
        { sha: '107b53', message: 'mm/page_alloc: optimize slab fragmentation', author: 'torvalds' },
      ];

      const prs: SamplePR[] = [
        { number: 104, title: 'PR #104: Rust kernel subsystem integration', author: 'torvalds' },
      ];

      const issues: SampleIssue[] = [
        { number: 88, title: 'ISSUE #88: Memory barrier inconsistency on ARM64' },
      ];

      return DataNormalizer.normalize(
        repoInput ? 'repository' : 'profile',
        repoInput ? `${username}/${repoName}` : username,
        username,
        repoInput ? repoName : 'linux',
        metrics,
        commits,
        prs,
        issues
      );
    }

    // Procedural generation for any other generic handle/repo
    const hash = this.hashString(username + (repoName || ''));
    const totalCommits = 250 + (hash % 1800);
    const pullRequests = 10 + (hash % 60);
    const openIssues = 5 + (hash % 40);
    const contributors = 1 + (hash % 12);
    const languages = ['TypeScript', 'JavaScript', 'Python', 'Rust'];
    const primaryLanguage = languages[hash % languages.length];

    const metrics: GitHubMetrics = {
      totalCommits,
      pullRequests,
      openIssues,
      contributors,
      languages,
      primaryLanguage,
      streakDays: 7 + (hash % 30),
      recentActivityScore: 40 + (hash % 50),
      repoCount: 4,
      stars: 12 + (hash % 500),
    };

    const commits: SampleCommit[] = [
      { sha: (hash + 1).toString(16).slice(0, 6), message: `feat(${repoName}): initial core release`, author: username },
      { sha: (hash + 2).toString(16).slice(0, 6), message: `fix: handle edge case in state store`, author: username },
      { sha: (hash + 3).toString(16).slice(0, 6), message: `refactor: clean up async pipeline`, author: username },
    ];

    const prs: SamplePR[] = [
      { number: 12, title: `PR #12: Upgrade dependency graph & build`, author: username },
    ];

    const issues: SampleIssue[] = [
      { number: 8, title: `ISSUE #8: Crash on rapid input sequence` },
    ];

    return DataNormalizer.normalize(
      repoInput ? 'repository' : 'profile',
      repoInput ? `${username}/${repoName}` : username,
      username,
      repoName,
      metrics,
      commits,
      prs,
      issues
    );
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
