import { NormalizedGameData, SampleCommit, SamplePR, SampleIssue, GitHubMetrics, RepositoryDNA, GameDNA } from './Types';
import { DataNormalizer } from './Normalizer';
import { BossGenerator } from '../procedural/BossGenerator';

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
   * Generates dedicated CODEBASE.UNIVERSE Citadela architectural defense mode
   */
  public static generateCitadelUniverseMode(): NormalizedGameData {
    const metrics: GitHubMetrics = {
      totalCommits: 3840,
      pullRequests: 142,
      openIssues: 58,
      contributors: 18,
      languages: ['TypeScript', 'WebGL', 'AST', 'Rust', 'Tree-sitter'],
      primaryLanguage: 'TypeScript',
      streakDays: 120,
      recentActivityScore: 96,
      repoCount: 8,
      stars: 4890,
    };

    const commits: SampleCommit[] = [
      { sha: '0x9C48', message: 'feat: 2.5D Citadel World Generator & Tree-sitter AST', author: 'luisrodriguez-rgb' },
      { sha: '0x7F21', message: 'perf: 90%+ Token Savings with Codebase-Memory-MCP', author: 'luisrodriguez-rgb' },
      { sha: '0x5D3B', message: 'sim: Tarjan SCC Cyclic Wormhole & Blast Radius Cascade', author: 'luisrodriguez-rgb' },
      { sha: '0x3E19', message: 'feat: Dijkstra Trace Path GPS animated flight trajectory', author: 'luisrodriguez-rgb' },
      { sha: '0x2A04', message: 'sync: Git Time Machine historical commit-by-commit replay', author: 'luisrodriguez-rgb' },
      { sha: '0x1C88', message: 'refactor: decouple God-Class Megastructure into 8 biomes', author: 'luisrodriguez-rgb' },
    ];

    const prs: SamplePR[] = [
      { number: 108, title: 'PR #108: Architectural Intelligence Platform v2.5 GA', author: 'luisrodriguez-rgb' },
      { number: 94, title: 'PR #94: Betweenness Centrality Beacons & Skyward Conduits', author: 'luisrodriguez-rgb' },
      { number: 72, title: 'PR #72: Universal Ingestion Matrix (40+ Ecosystems)', author: 'luisrodriguez-rgb' },
    ];

    const issues: SampleIssue[] = [
      { number: 95, title: 'ALERT #95: God-Class Megastructure detected in core/renderer.ts' },
      { number: 63, title: 'HAZARD #63: Cyclic Wormhole feedback loop in state bus' },
      { number: 41, title: 'INCIDENT #41: Downstream blast radius cascade across 41 callers' },
    ];

    const data = DataNormalizer.normalize(
      'citadel',
      'luisrodriguez-rgb/CODEBASE.UNIVERSE',
      'luisrodriguez-rgb',
      'CODEBASE.UNIVERSE',
      metrics,
      commits,
      prs,
      issues
    );

    // Customize Citadel Boss Blueprint
    data.bossBlueprint.coreName = 'CITADEL_CORE // GOD-CLASS MEGASTRUCTURE';
    data.bossBlueprint.language = 'TypeScript / AST Citadela';
    data.bossBlueprint.languageColor = '#38bdf8';
    data.bossBlueprint.threatIndex = 95;
    data.bossBlueprint.cannons = 5;
    data.bossBlueprint.shieldLayers = 4;
    data.bossBlueprint.phases = [
      {
        phaseNumber: 1,
        name: 'PHASE 01: PERIMETER CONDUITS [STORAGE & POWER]',
        hpThresholdPercent: 100,
        attackPattern: 'salvo',
        speedMultiplier: 1.1,
        description: 'Multi-directional blast radius energy packets dispatched along dependency paths.',
      },
      {
        phaseNumber: 2,
        name: 'PHASE 02: TARJAN CYCLIC WORMHOLE',
        hpThresholdPercent: 65,
        attackPattern: 'merge_matrix_lasers',
        speedMultiplier: 1.45,
        description: 'Circular dependency deadlocks manifest as intersecting crossfire laser beams.',
      },
      {
        phaseNumber: 3,
        name: 'PHASE 03: GOD-CLASS OVERDRIVE CASCADE',
        hpThresholdPercent: 30,
        attackPattern: 'cicd_overdrive_bombers',
        speedMultiplier: 1.85,
        description: '41 direct dependent modules overload. Blast radius bombers dropped en masse.',
      },
    ];

    return data;
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

  public static readonly REPO_PRESETS: RepositoryDNA[] = [
    // 01. THE COMMIT CORE
    {
      id: 'alpha_project',
      name: 'alpha-project',
      author: 'core-team',
      description: 'THE COMMIT CORE // High velocity continuous integration',
      commits: 3840,
      pullRequests: 18,
      issues: 12,
      contributors: 5,
      threatLevel: 80,
      threatRating: 'HIGH',
      languages: [
        { name: 'TS', pct: 60, color: '#38bdf8' },
        { name: 'JS', pct: 40, color: '#facc15' },
      ],
      primaryLanguage: 'TypeScript',
      accentColor: '#ff0055',
      bossCoreName: 'THE COMMIT CORE',
    },
    // 02. THE FORTRESS
    {
      id: 'mobile_app',
      name: 'mobile-app',
      author: 'collab-team',
      description: 'THE FORTRESS // Heavy PR review & impenetrable defense',
      commits: 1250,
      pullRequests: 95,
      issues: 24,
      contributors: 14,
      threatLevel: 75,
      threatRating: 'CRITICAL',
      languages: [
        { name: 'PYTHON', pct: 50, color: '#3b82f6' },
        { name: 'REACT', pct: 30, color: '#00e5ff' },
        { name: 'DJANGO', pct: 20, color: '#10b981' },
      ],
      primaryLanguage: 'Python',
      accentColor: '#00e5ff',
      bossCoreName: 'THE FORTRESS',
    },
    // 03. THE ISSUE SWARM
    {
      id: 'bug_hunter',
      name: 'bug-hunter',
      author: 'system-debug',
      description: 'THE ISSUE SWARM // Living biomechanical bug cluster',
      commits: 890,
      pullRequests: 14,
      issues: 142,
      contributors: 3,
      threatLevel: 85,
      threatRating: 'CRITICAL',
      languages: [
        { name: 'GO', pct: 45, color: '#06b6d4' },
        { name: 'RUST', pct: 35, color: '#ef4444' },
        { name: 'C++', pct: 20, color: '#ec4899' },
      ],
      primaryLanguage: 'Go',
      accentColor: '#a855f7',
      bossCoreName: 'THE ISSUE SWARM',
    },
    // 04. THE DEPENDENCY HYDRA
    {
      id: 'infra_service',
      name: 'infra-service',
      author: 'cloud-mesh',
      description: 'THE DEPENDENCY HYDRA // Complex multi-module dependency nexus',
      commits: 1650,
      pullRequests: 32,
      issues: 28,
      contributors: 8,
      threatLevel: 78,
      threatRating: 'HIGH',
      languages: [
        { name: 'NODE', pct: 45, color: '#10b981' },
        { name: 'TS', pct: 35, color: '#38bdf8' },
        { name: 'PYTHON', pct: 20, color: '#3b82f6' },
      ],
      primaryLanguage: 'TypeScript',
      accentColor: '#10b981',
      bossCoreName: 'THE DEPENDENCY HYDRA',
    },
    // 05. THE MERGE CONFLICT
    {
      id: 'feature_branch',
      name: 'feature-branch',
      author: 'git-merge',
      description: 'THE MERGE CONFLICT // Bifurcated HEAD vs branch reality',
      commits: 1420,
      pullRequests: 64,
      issues: 35,
      contributors: 9,
      threatLevel: 70,
      threatRating: 'ELEVATED',
      languages: [
        { name: 'HTML', pct: 40, color: '#ff5252' },
        { name: 'CSS', pct: 35, color: '#7c4dff' },
        { name: 'JS', pct: 25, color: '#ffd600' },
      ],
      primaryLanguage: 'JavaScript',
      accentColor: '#ff5252',
      bossCoreName: 'THE MERGE CONFLICT',
    },
    // 06. THE CONTRIBUTOR OVERLORD
    {
      id: 'open_source',
      name: 'open-source',
      author: 'community',
      description: 'THE CONTRIBUTOR OVERLORD // Distributed community armada',
      commits: 2400,
      pullRequests: 88,
      issues: 45,
      contributors: 64,
      threatLevel: 82,
      threatRating: 'CRITICAL',
      languages: [
        { name: 'RUST', pct: 45, color: '#ef4444' },
        { name: 'PYTHON', pct: 35, color: '#3b82f6' },
        { name: 'GO', pct: 20, color: '#06b6d4' },
      ],
      primaryLanguage: 'Rust',
      accentColor: '#c084fc',
      bossCoreName: 'THE CONTRIBUTOR OVERLORD',
    },
    // 07. THE BRANCHLORD
    {
      id: 'feature_universe',
      name: 'feature-universe',
      author: 'git-flow',
      description: 'THE BRANCHLORD // Multi-branching timeline dreadnought',
      commits: 1980,
      pullRequests: 52,
      issues: 31,
      contributors: 7,
      threatLevel: 74,
      threatRating: 'HIGH',
      languages: [
        { name: 'TS', pct: 50, color: '#38bdf8' },
        { name: 'JS', pct: 30, color: '#facc15' },
        { name: 'CSS', pct: 20, color: '#00e5ff' },
      ],
      primaryLanguage: 'TypeScript',
      accentColor: '#fbbf24',
      bossCoreName: 'THE BRANCHLORD',
    },
    // 08. THE REBASE PHANTOM
    {
      id: 'legacy_system',
      name: 'legacy-system',
      author: 'ancient-kernel',
      description: 'THE REBASE PHANTOM // Stealth crimson needle & history rewrite',
      commits: 4200,
      pullRequests: 22,
      issues: 19,
      contributors: 4,
      threatLevel: 88,
      threatRating: 'CRITICAL',
      languages: [
        { name: 'C++', pct: 55, color: '#ec407a' },
        { name: 'ASM', pct: 30, color: '#f59e0b' },
        { name: 'C', pct: 15, color: '#94a3b8' },
      ],
      primaryLanguage: 'C++',
      accentColor: '#ef4444',
      bossCoreName: 'THE REBASE PHANTOM',
    },
    // 09. THE SECURITY SENTINEL
    {
      id: 'enterprise',
      name: 'enterprise',
      author: 'corp-shield',
      description: 'THE SECURITY SENTINEL // Zero-trust encrypted cyber-aegis',
      commits: 2100,
      pullRequests: 42,
      issues: 26,
      contributors: 12,
      threatLevel: 80,
      threatRating: 'HIGH',
      languages: [
        { name: 'JAVA', pct: 50, color: '#ff9100' },
        { name: 'SPRING', pct: 30, color: '#10b981' },
        { name: 'KOTLIN', pct: 20, color: '#ab47bc' },
      ],
      primaryLanguage: 'Java',
      accentColor: '#38bdf8',
      bossCoreName: 'THE SECURITY SENTINEL',
    },
    // 10. THE CODE ABYSS
    {
      id: 'monolith',
      name: 'monolith',
      author: 'megastructure',
      description: 'THE CODE ABYSS // Cosmic gravitational code singularity',
      commits: 8800,
      pullRequests: 320,
      issues: 280,
      contributors: 38,
      threatLevel: 98,
      threatRating: 'CHAOS_MAX',
      languages: [
        { name: 'RUST', pct: 35, color: '#ef4444' },
        { name: 'TS', pct: 30, color: '#38bdf8' },
        { name: 'C++', pct: 20, color: '#ec407a' },
        { name: 'ASM', pct: 15, color: '#f59e0b' },
      ],
      primaryLanguage: 'Rust',
      accentColor: '#ff007f',
      bossCoreName: 'THE CODE ABYSS',
    },
    // Classics & Community Favorites
    {
      id: 'sketion',
      name: 'sketion',
      author: 'luisrodriguez-rgb',
      description: 'Autonomous Visual Composition & Architecture Engine',
      commits: 342,
      pullRequests: 28,
      issues: 13,
      contributors: 4,
      threatLevel: 82,
      threatRating: 'CRITICAL',
      languages: [
        { name: 'TS', pct: 58, color: '#38bdf8' },
        { name: 'JS', pct: 24, color: '#facc15' },
        { name: 'CSS', pct: 12, color: '#00e5ff' },
        { name: 'HTML', pct: 6, color: '#f97316' },
      ],
      primaryLanguage: 'TypeScript',
      accentColor: '#00e5ff',
      bossCoreName: 'SKETION CORE',
    },
    {
      id: 'singularity',
      name: 'SINGULARITY_CORE',
      author: 'SYSTEM_ANOMALY',
      description: 'Quantum Spacetime Compiler & Memory Singularity',
      commits: 9999,
      pullRequests: 482,
      issues: 731,
      contributors: 48,
      threatLevel: 96,
      threatRating: 'CHAOS_MAX',
      languages: [
        { name: 'RUST', pct: 60, color: '#ef4444' },
        { name: 'TS', pct: 25, color: '#38bdf8' },
        { name: 'ASM', pct: 15, color: '#a855f7' },
      ],
      primaryLanguage: 'Rust',
      accentColor: '#ff007f',
      bossCoreName: 'SINGULARITY REACTOR',
    },
    {
      id: 'codebase_universe',
      name: 'CODEBASE.UNIVERSE',
      author: 'luisrodriguez-rgb',
      description: '2.5D Living Architectural Codebase Citadel',
      commits: 3840,
      pullRequests: 142,
      issues: 58,
      contributors: 18,
      threatLevel: 78,
      threatRating: 'HIGH',
      languages: [
        { name: 'TS', pct: 65, color: '#38bdf8' },
        { name: 'WEBGL', pct: 20, color: '#10b981' },
        { name: 'AST', pct: 15, color: '#fbbf24' },
      ],
      primaryLanguage: 'TypeScript',
      accentColor: '#38bdf8',
      bossCoreName: 'CITADEL MEGASTRUCTURE',
    },
    {
      id: 'linux',
      name: 'torvalds/linux',
      author: 'torvalds',
      description: 'The Linux Kernel Monolithic Megastructure',
      commits: 1100000,
      pullRequests: 840,
      issues: 120,
      contributors: 14000,
      threatLevel: 88,
      threatRating: 'CRITICAL',
      languages: [
        { name: 'C', pct: 85, color: '#94a3b8' },
        { name: 'ASM', pct: 10, color: '#f59e0b' },
        { name: 'MAKE', pct: 5, color: '#64748b' },
      ],
      primaryLanguage: 'C',
      accentColor: '#ffd600',
      bossCoreName: 'MONOLITH KERNEL',
    },
    {
      id: 'space_invaders',
      name: 'GIT_INVADERS.EXE',
      author: 'luisrodriguez-rgb',
      description: 'GitHub Activity Arcade Engine & CRT Simulator',
      commits: 1482,
      pullRequests: 48,
      issues: 39,
      contributors: 3,
      threatLevel: 65,
      threatRating: 'ELEVATED',
      languages: [
        { name: 'TS', pct: 72, color: '#38bdf8' },
        { name: 'CSS', pct: 22, color: '#00e5ff' },
        { name: 'HTML', pct: 6, color: '#f97316' },
      ],
      primaryLanguage: 'TypeScript',
      accentColor: '#10b981',
      bossCoreName: 'COMPILER CORE MK-IV',
    },
  ];

  public static generateFromDNA(dna: RepositoryDNA): NormalizedGameData {
    const metrics: GitHubMetrics = {
      totalCommits: dna.commits,
      pullRequests: dna.pullRequests,
      openIssues: dna.issues,
      contributors: dna.contributors,
      languages: dna.languages.map((l: { name: string }) => l.name),
      primaryLanguage: dna.primaryLanguage,
      streakDays: 45,
      recentActivityScore: dna.threatLevel,
      repoCount: 6,
      stars: 1200,
    };

    const commits: SampleCommit[] = [
      { sha: '0x3F9A', message: `feat(${dna.name}): initial kernel build`, author: dna.author },
      { sha: '0x8B22', message: `refactor: optimize AST tree-sitter bindings`, author: dna.author },
      { sha: '0x1C7E', message: `hotfix: thread deadlock in memory cache`, author: dna.author },
    ];

    const prs: SamplePR[] = [
      { number: dna.pullRequests, title: `PR #${dna.pullRequests}: Zero-Day Security Protocol`, author: dna.author },
      { number: Math.max(1, dna.pullRequests - 1), title: `PR #${Math.max(1, dna.pullRequests - 1)}: Decouple Core Dependencies`, author: dna.author },
    ];

    const issues: SampleIssue[] = [
      { number: dna.issues, title: `ALERT #${dna.issues}: Memory leak in async pipeline` },
      { number: Math.max(1, dna.issues - 1), title: `ISSUE #${Math.max(1, dna.issues - 1)}: Cyclic dependency warning` },
    ];

    const data = DataNormalizer.normalize(
      'repository',
      `${dna.author}/${dna.name}`,
      dna.author,
      dna.name,
      metrics,
      commits,
      prs,
      issues
    );

    data.threatLevel = dna.threatLevel;
    data.threatRating = dna.threatRating;
    data.bossBlueprint = BossGenerator.generateFromDNA(dna);

    return data;
  }

  /**
   * Synthesizes unified GameDNA - the central single source of truth
   * connecting RepositoryDNA -> ShipDNA -> WaveDNA -> BossDNA -> AudioDNA
   */
  public static synthesizeGameDNA(repo: RepositoryDNA): GameDNA {
    const threatRatio = repo.threatLevel / 100;
    const waveData = DataSynthesizer.generateFromDNA(repo);

    return {
      version: '2.0.0',
      seed: `${repo.author}/${repo.name}@${repo.commits}`,
      repository: repo,
      ship: {
        hullType: (repo.commits + repo.pullRequests) % 4,
        wingType: (repo.issues + repo.contributors) % 4,
        engineType: Math.min(3, Math.max(1, (repo.contributors % 3) + 1)),
        armor: Math.min(6, Math.max(2, Math.floor(repo.pullRequests / 5) + 2)),
        speed: Math.min(100, Math.max(40, Math.round(50 + (repo.commits / 200) * 20))),
        fireRate: Math.min(100, Math.max(50, Math.round(60 + threatRatio * 35))),
        primaryColor: repo.accentColor || '#00e5ff',
        secondaryColor: repo.languages[0]?.color || '#38bdf8',
        accentColor: repo.languages[1]?.color || '#0369a1',
      },
      waves: {
        totalWaves: waveData.totalWaves,
        formations: waveData.waveFormations,
        speedBase: waveData.enemySpeedBase,
        dropSpeed: waveData.enemyDropSpeed,
        prRatio: waveData.prArmoredRatio,
        issueRatio: waveData.issueBomberRatio,
        conflictRatio: 0.1,
        dependencyRatio: 0.15,
      },
      boss: waveData.bossBlueprint,
      audio: {
        bpm: Math.round(105 + threatRatio * 25),
        baseFrequency: 120 + threatRatio * 40,
        aggression: repo.threatLevel,
        scaleType: repo.primaryLanguage === 'Python' ? 'dorian' : 'minor_pentatonic',
      },
    };
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
