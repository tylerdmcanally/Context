export type BiasRating =
  | 'left'
  | 'lean-left'
  | 'center'
  | 'lean-right'
  | 'right';

export interface SharedArticle {
  guid: string;
  title: string;
  link: string;
  pubDate: Date;
  source: string;
  sourceBias: BiasRating;
  sourceTier: number;
  description?: string;
  aggregatedAt?: Date;
  [key: string]: unknown;
}

export interface BiasDistribution {
  left: number;
  leanLeft: number;
  center: number;
  leanRight: number;
  right: number;
}

export interface StoryCluster<TArticle extends SharedArticle = SharedArticle> {
  stories: TArticle[];
  mainHeadline: string;
  coverageCount: number;
  biasDistribution: BiasDistribution;
}

export interface ScoreBreakdown {
  coverage: number;
  velocity: number;
  significance: number;
  balance: number;
}

export interface ScoredCluster<TArticle extends SharedArticle = SharedArticle>
  extends StoryCluster<TArticle> {
  score: number;
  scoreBreakdown: ScoreBreakdown;
}

export function clusterArticles<TArticle extends SharedArticle>(
  articles: TArticle[]
): StoryCluster<TArticle>[] {
  const clusters = new Map<string, TArticle[]>();

  for (const article of articles) {
    const keywords = extractKeywords(article.title);
    const clusterKey = keywords.sort().join('-');

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }

    clusters.get(clusterKey)!.push(article);
  }

  return Array.from(clusters.values())
    .filter((stories) => stories.length >= 3)
    .map((stories) => ({
      stories,
      mainHeadline: stories[0].title,
      coverageCount: stories.length,
      biasDistribution: calculateBiasDistribution(stories),
    }))
    .sort((a, b) => b.coverageCount - a.coverageCount);
}

export function clusterArticlesBySimilarity<TArticle extends SharedArticle>(
  articles: TArticle[],
  similarityThreshold = 0.6
): StoryCluster<TArticle>[] {
  const clusters: TArticle[][] = [];
  const used = new Set<number>();

  for (let i = 0; i < articles.length; i++) {
    if (used.has(i)) continue;

    const cluster = [articles[i]];
    used.add(i);

    for (let j = i + 1; j < articles.length; j++) {
      if (used.has(j)) continue;

      const similarity = calculateTitleSimilarity(
        articles[i].title,
        articles[j].title
      );

      if (similarity >= similarityThreshold) {
        cluster.push(articles[j]);
        used.add(j);
      }
    }

    if (cluster.length >= 3) {
      clusters.push(cluster);
    }
  }

  return clusters
    .map((stories) => ({
      stories,
      mainHeadline: stories[0].title,
      coverageCount: stories.length,
      biasDistribution: calculateBiasDistribution(stories),
    }))
    .sort((a, b) => b.coverageCount - a.coverageCount);
}

export function scoreStories<TArticle extends SharedArticle>(
  clusters: StoryCluster<TArticle>[]
): ScoredCluster<TArticle>[] {
  return clusters
    .map((cluster) => {
      const coverage = calculateCoverageScore(cluster);
      const velocity = calculateVelocityScore(cluster);
      const significance = calculateSignificanceScore(cluster);
      const balance = calculateBalanceScore(cluster);

      const score =
        coverage * 0.4 + velocity * 0.2 + significance * 0.2 + balance * 0.2;

      return {
        ...cluster,
        score,
        scoreBreakdown: { coverage, velocity, significance, balance },
      };
    })
    .sort((a, b) => b.score - a.score);
}

function extractKeywords(title: string): string[] {
  const stopWords = [
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
  ];

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
}

function calculateBiasDistribution<TArticle extends SharedArticle>(
  articles: TArticle[]
): BiasDistribution {
  const distribution: BiasDistribution = {
    left: 0,
    leanLeft: 0,
    center: 0,
    leanRight: 0,
    right: 0,
  };

  for (const article of articles) {
    switch (article.sourceBias) {
      case 'left':
        distribution.left++;
        break;
      case 'lean-left':
        distribution.leanLeft++;
        break;
      case 'center':
        distribution.center++;
        break;
      case 'lean-right':
        distribution.leanRight++;
        break;
      case 'right':
        distribution.right++;
        break;
      default:
        break;
    }
  }

  return distribution;
}

function calculateCoverageScore<TArticle extends SharedArticle>(
  cluster: StoryCluster<TArticle>
): number {
  return Math.min(cluster.coverageCount / 20, 1) * 100;
}

function calculateVelocityScore<TArticle extends SharedArticle>(
  cluster: StoryCluster<TArticle>
): number {
  const now = Date.now();
  const recentArticles = cluster.stories.filter((article) => {
    const hoursSince = (now - article.pubDate.getTime()) / (1000 * 60 * 60);
    return hoursSince < 12;
  });

  if (cluster.stories.length === 0) {
    return 0;
  }

  return (recentArticles.length / cluster.stories.length) * 100;
}

function calculateSignificanceScore<TArticle extends SharedArticle>(
  cluster: StoryCluster<TArticle>
): number {
  const tier1Count = cluster.stories.filter((s) => s.sourceTier === 1).length;
  const tier2Count = cluster.stories.filter((s) => s.sourceTier === 2).length;
  const weightedScore =
    (tier1Count * 3 + tier2Count * 2) / Math.max(cluster.stories.length, 1);

  return Math.min(weightedScore / 3, 1) * 100;
}

function calculateBalanceScore<TArticle extends SharedArticle>(
  cluster: StoryCluster<TArticle>
): number {
  const { left, leanLeft, center, leanRight, right } = cluster.biasDistribution;
  const total = left + leanLeft + center + leanRight + right;

  if (total === 0) return 0;

  const mean = 1 / 5;
  const leftPct = left / total;
  const leanLeftPct = leanLeft / total;
  const centerPct = center / total;
  const leanRightPct = leanRight / total;
  const rightPct = right / total;

  const variance =
    Math.pow(leftPct - mean, 2) +
    Math.pow(leanLeftPct - mean, 2) +
    Math.pow(centerPct - mean, 2) +
    Math.pow(leanRightPct - mean, 2) +
    Math.pow(rightPct - mean, 2);

  return Math.max(0, (1 - variance * 5)) * 100;
}

function calculateTitleSimilarity(title1: string, title2: string): number {
  const words1 = new Set(title1.toLowerCase().split(/\s+/));
  const words2 = new Set(title2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter((word) => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) {
    return 0;
  }

  return intersection.size / union.size;
}

