import { Article, BiasRating } from '@/types/story';

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

// Simple clustering by keyword similarity
export function clusterArticles(articles: Article[]): StoryCluster[] {
  const clusters = new Map<string, Article[]>();
  
  for (const article of articles) {
    // Extract key terms from title (simplified)
    const keywords = extractKeywords(article.title);
    const clusterKey = keywords.sort().join('-');
    
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(article);
  }
  
  // Convert to StoryCluster format
  return Array.from(clusters.values())
    .filter(stories => stories.length >= 3) // At least 3 sources
    .map(stories => ({
      stories,
      mainHeadline: stories[0].title,
      coverageCount: stories.length,
      biasDistribution: calculateBiasDistribution(stories),
    }))
    .sort((a, b) => b.coverageCount - a.coverageCount);
}

function extractKeywords(title: string): string[] {
  // Remove common words, extract key terms
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

// Enhanced clustering using title similarity
export function clusterArticlesBySimilarity(articles: Article[], similarityThreshold: number = 0.6): StoryCluster[] {
  const clusters: Article[][] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < articles.length; i++) {
    if (used.has(i)) continue;
    
    const cluster = [articles[i]];
    used.add(i);
    
    for (let j = i + 1; j < articles.length; j++) {
      if (used.has(j)) continue;
      
      const similarity = calculateTitleSimilarity(articles[i].title, articles[j].title);
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
    .map(stories => ({
      stories,
      mainHeadline: stories[0].title,
      coverageCount: stories.length,
      biasDistribution: calculateBiasDistribution(stories),
    }))
    .sort((a, b) => b.coverageCount - a.coverageCount);
}

function calculateTitleSimilarity(title1: string, title2: string): number {
  const words1 = new Set(title1.toLowerCase().split(/\s+/));
  const words2 = new Set(title2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

