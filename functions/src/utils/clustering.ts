import { Article } from './rssParser';

export interface StoryCluster {
  stories: Article[];
  mainHeadline: string;
  coverageCount: number;
  biasDistribution: {
    left: number;
    leanLeft: number;
    center: number;
    leanRight: number;
    right: number;
  };
}

export function clusterArticles(articles: Article[]): StoryCluster[] {
  const clusters = new Map<string, Article[]>();
  
  for (const article of articles) {
    const keywords = extractKeywords(article.title);
    const clusterKey = keywords.sort().join('-');
    
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(article);
  }
  
  return Array.from(clusters.values())
    .filter(stories => stories.length >= 3)
    .map(stories => ({
      stories,
      mainHeadline: stories[0].title,
      coverageCount: stories.length,
      biasDistribution: calculateBiasDistribution(stories),
    }))
    .sort((a, b) => b.coverageCount - a.coverageCount);
}

function extractKeywords(title: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
}

function calculateBiasDistribution(articles: Article[]) {
  const distribution = {
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
    }
  }
  
  return distribution;
}

