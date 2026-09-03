import { GitHubMetrics, NormalizedGameData, SampleCommit, SamplePR, SampleIssue } from './Types';
import { DataNormalizer } from './Normalizer';
import { GitHubCache } from './Cache';
import { DataSynthesizer } from './DataSynthesizer';

export class GitHubClient {
  private static BASE_URL = 'https://api.github.com';

  /**
   * Fetches GitHub profile data or falls back gracefully if rate-limited
   */
  public static async fetchProfile(
    username: string,
    onStatusUpdate?: (msg: string) => void
  ): Promise<NormalizedGameData> {
    const cleanUser = username.trim().replace(/^@/, '');
    const cacheKey = `user_${cleanUser}`;

    const cached = GitHubCache.get<NormalizedGameData>(cacheKey);
    if (cached) {
      onStatusUpdate?.(`[CACHE HIT] Loaded telemetry for ${cleanUser}`);
      return cached;
    }

    try {
      onStatusUpdate?.(`QUERYING GITHUB API: /users/${cleanUser}...`);
      const userRes = await fetch(`${this.BASE_URL}/users/${cleanUser}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!userRes.ok) {
        if (userRes.status === 403 || userRes.status === 429) {
          onStatusUpdate?.(`[RATE LIMIT EXCEEDED] Engaging procedural synthesis engine...`);
        } else {
          onStatusUpdate?.(`[HTTP ${userRes.status}] Synthesizing profile data for ${cleanUser}...`);
        }
        return DataSynthesizer.generateFallback(cleanUser);
      }

      const userData = await userRes.json();
      onStatusUpdate?.(`USER FOUND: ${userData.name || cleanUser} (${userData.public_repos} repos)`);

      // Fetch user repos to inspect activity
      onStatusUpdate?.(`SCANNING REPOSITORIES FOR ${cleanUser}...`);
      const reposRes = await fetch(
        `${this.BASE_URL}/users/${cleanUser}/repos?sort=pushed&per_page=8`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );

      let repos: any[] = [];
      if (reposRes.ok) {
        repos = await reposRes.json();
      }

      const languages: string[] = [];
      let totalStars = 0;
      let totalOpenIssues = 0;
      let targetRepoName = repos.length > 0 ? repos[0].name : 'main-repo';

      repos.forEach((r) => {
        totalStars += r.stargazers_count || 0;
        totalOpenIssues += r.open_issues_count || 0;
        if (r.language && !languages.includes(r.language)) {
          languages.push(r.language);
        }
      });

      const primaryLanguage = languages[0] || 'TypeScript';

      // Estimate commits and PRs based on repo count and activity
      const estCommits = Math.max(150, (userData.public_repos || 5) * 120);
      const estPRs = Math.max(8, Math.round((userData.public_repos || 5) * 4.5));
      const estContributors = Math.min(12, Math.max(1, Math.round(totalStars / 10) + 1));

      const metrics: GitHubMetrics = {
        totalCommits: estCommits,
        pullRequests: estPRs,
        openIssues: Math.max(4, totalOpenIssues),
        contributors: estContributors,
        languages,
        primaryLanguage,
        streakDays: Math.min(90, Math.max(7, (userData.public_repos || 2) * 5)),
        recentActivityScore: Math.min(100, 50 + (userData.public_repos || 2) * 4),
        repoCount: repos.length || 4,
        stars: totalStars,
      };

      const sampleCommits: SampleCommit[] = [
        { sha: '0x8f1a', message: `feat(${targetRepoName}): core architecture update`, author: cleanUser },
        { sha: '0x3e2b', message: `fix: optimize canvas render pass for 60fps`, author: cleanUser },
        { sha: '0x9c4d', message: `refactor: modularize data normalizer layer`, author: cleanUser },
      ];

      const samplePRs: SamplePR[] = [
        { number: 1, title: `PR #1: Upgrade dependencies to latest engine`, author: cleanUser },
        { number: 2, title: `PR #2: Implement Web Audio procedural sound`, author: cleanUser },
      ];

      const sampleIssues: SampleIssue[] = [
        { number: 1, title: `Issue #1: Memory leak in particle buffer` },
      ];

      const normalized = DataNormalizer.normalize(
        'profile',
        cleanUser,
        cleanUser,
        targetRepoName,
        metrics,
        sampleCommits,
        samplePRs,
        sampleIssues
      );

      GitHubCache.set(cacheKey, normalized);
      return normalized;
    } catch (err) {
      onStatusUpdate?.(`[NETWORK WARNING] Falling back to procedural profile for ${cleanUser}...`);
      return DataSynthesizer.generateFallback(cleanUser);
    }
  }

  /**
   * Fetches specific repository data
   */
  public static async fetchRepository(
    repoInput: string,
    onStatusUpdate?: (msg: string) => void
  ): Promise<NormalizedGameData> {
    const clean = repoInput.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
    const parts = clean.split('/');
    if (parts.length < 2) {
      throw new Error("Formato inválido. Usa 'usuario/repositorio'");
    }

    const [owner, repo] = parts;
    const cacheKey = `repo_${owner}_${repo}`;

    const cached = GitHubCache.get<NormalizedGameData>(cacheKey);
    if (cached) {
      onStatusUpdate?.(`[CACHE HIT] Loaded repo telemetry for ${owner}/${repo}`);
      return cached;
    }

    try {
      onStatusUpdate?.(`QUERYING REPO: /repos/${owner}/${repo}...`);
      const repoRes = await fetch(`${this.BASE_URL}/repos/${owner}/${repo}`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (!repoRes.ok) {
        onStatusUpdate?.(`[NOTICE] Synthesizing procedural telemetry for ${owner}/${repo}...`);
        return DataSynthesizer.generateFallback(owner, repo);
      }

      const repoData = await repoRes.json();
      onStatusUpdate?.(`REPO ACQUIRED: ${repoData.full_name} (${repoData.stargazers_count} stars)`);

      // Fetch recent commits
      onStatusUpdate?.(`SCANNING COMMITS FOR ${repo}...`);
      let commits: SampleCommit[] = [];
      try {
        const commitRes = await fetch(`${this.BASE_URL}/repos/${owner}/${repo}/commits?per_page=6`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (commitRes.ok) {
          const rawCommits = await commitRes.json();
          commits = rawCommits.map((c: any) => ({
            sha: (c.sha || '0x0000').slice(0, 6),
            message: (c.commit?.message || 'commit').split('\n')[0].slice(0, 45),
            author: c.commit?.author?.name || c.author?.login || owner,
          }));
        }
      } catch {}

      // Fetch pulls
      onStatusUpdate?.(`SCANNING PULL REQUESTS...`);
      let prs: SamplePR[] = [];
      try {
        const prRes = await fetch(`${this.BASE_URL}/repos/${owner}/${repo}/pulls?state=all&per_page=4`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });
        if (prRes.ok) {
          const rawPRs = await prRes.json();
          prs = rawPRs.map((p: any) => ({
            number: p.number,
            title: `PR #${p.number}: ${p.title.slice(0, 40)}`,
            author: p.user?.login || owner,
          }));
        }
      } catch {}

      const metrics: GitHubMetrics = {
        totalCommits: Math.max(180, (repoData.size || 500) / 2),
        pullRequests: Math.max(12, prs.length * 5),
        openIssues: repoData.open_issues_count || 10,
        contributors: Math.max(2, Math.min(25, Math.round((repoData.stargazers_count || 10) / 8))),
        languages: [repoData.language || 'TypeScript'],
        primaryLanguage: repoData.language || 'TypeScript',
        streakDays: 30,
        recentActivityScore: 75,
        repoCount: 1,
        stars: repoData.stargazers_count || 0,
      };

      const normalized = DataNormalizer.normalize(
        'repository',
        `${owner}/${repo}`,
        owner,
        repo,
        metrics,
        commits.length > 0 ? commits : undefined,
        prs.length > 0 ? prs : undefined
      );

      GitHubCache.set(cacheKey, normalized);
      return normalized;
    } catch {
      onStatusUpdate?.(`[NETWORK NOTICE] Generating simulated repo for ${owner}/${repo}...`);
      return DataSynthesizer.generateFallback(owner, repo);
    }
  }
}
