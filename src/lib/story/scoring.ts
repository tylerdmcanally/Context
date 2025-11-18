import { StoryCluster } from './clustering';

export interface ScoredCluster extends StoryCluster {
  score: number;
  scoreBreakdown: {
    coverage: number;
    velocity: number;
    significance: number;
    balance: number;
  };
}

export function scoreStories(clusters: StoryCluster[]): ScoredCluster[] {
  return clusters.map(cluster => {
    const coverage = calculateCoverageScore(cluster);
    const velocity = calculateVelocityScore(cluster);
    const significance = calculateSignificanceScore(cluster);
    const balance = calculateBalanceScore(cluster);
    
    const score = (
      coverage * 0.4 +
      velocity * 0.2 +
      significance * 0.2 +
      balance * 0.2
    );
    
    return {
      ...cluster,
      score,
      scoreBreakdown: { coverage, velocity, significance, balance },
    };
  }).sort((a, b) => b.score - a.score);
}

function calculateCoverageScore(cluster: StoryCluster): number {
  // More sources = higher score
  // Cap at 20 sources for normalization
  return Math.min(cluster.coverageCount / 20, 1) * 100;
}

function calculateVelocityScore(cluster: StoryCluster): number {
  // How recent are the articles?
  const now = Date.now();
  const recentArticles = cluster.stories.filter(article => {
    const hoursSince = (now - article.pubDate.getTime()) / (1000 * 60 * 60);
    return hoursSince < 12; // Published in last 12 hours
  });
  
  return (recentArticles.length / cluster.stories.length) * 100;
}

function calculateSignificanceScore(cluster: StoryCluster): number {
  // Tier 1 sources (wire services) = higher weight
  const tier1Count = cluster.stories.filter(s => s.sourceTier === 1).length;
  const tier2Count = cluster.stories.filter(s => s.sourceTier === 2).length;
  
  const weightedScore = (tier1Count * 3 + tier2Count * 2) / cluster.stories.length;
  return Math.min(weightedScore / 3, 1) * 100;
}

function calculateBalanceScore(cluster: StoryCluster): number {
  // Better balance across political spectrum = higher score
  const { left, leanLeft, center, leanRight, right } = cluster.biasDistribution;
  const total = left + leanLeft + center + leanRight + right;
  
  if (total === 0) return 0;
  
  // Calculate variance - lower variance = better balance
  const mean = 1 / 5; // Equal distribution would be 0.2 each
  const leftPct = left / total;
  const leanLeftPct = leanLeft / total;
  const centerPct = center / total;
  const leanRightPct = leanRight / total;
  const rightPct = right / total;
  
  const variance = Math.pow(leftPct - mean, 2) +
                   Math.pow(leanLeftPct - mean, 2) +
                   Math.pow(centerPct - mean, 2) +
                   Math.pow(leanRightPct - mean, 2) +
                   Math.pow(rightPct - mean, 2);
  
  // Invert variance for score (lower variance = better)
  return Math.max(0, (1 - variance * 5)) * 100;
}

