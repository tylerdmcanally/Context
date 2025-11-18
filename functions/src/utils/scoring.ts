import { StoryCluster } from './clustering';

export interface ScoredCluster extends StoryCluster {
  score: number;
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
    };
  }).sort((a, b) => b.score - a.score);
}

function calculateCoverageScore(cluster: StoryCluster): number {
  return Math.min(cluster.coverageCount / 20, 1) * 100;
}

function calculateVelocityScore(cluster: StoryCluster): number {
  const now = Date.now();
  const recentArticles = cluster.stories.filter(article => {
    const hoursSince = (now - article.pubDate.getTime()) / (1000 * 60 * 60);
    return hoursSince < 12;
  });
  
  return (recentArticles.length / cluster.stories.length) * 100;
}

function calculateSignificanceScore(cluster: StoryCluster): number {
  const tier1Count = cluster.stories.filter(s => s.sourceTier === 1).length;
  const tier2Count = cluster.stories.filter(s => s.sourceTier === 2).length;
  
  const weightedScore = (tier1Count * 3 + tier2Count * 2) / cluster.stories.length;
  return Math.min(weightedScore / 3, 1) * 100;
}

function calculateBalanceScore(cluster: StoryCluster): number {
  const { left, leanLeft, center, leanRight, right } = cluster.biasDistribution;
  const total = left + leanLeft + center + leanRight + right;
  
  if (total === 0) return 0;
  
  const mean = 1 / 5;
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
  
  return Math.max(0, (1 - variance * 5)) * 100;
}

