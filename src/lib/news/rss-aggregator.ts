import Parser from 'rss-parser';
import { RSS_SOURCES } from '@/config/rss-sources';
import { Article } from '@/types/story';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'description', 'content:encoded']
  }
});

export async function aggregateNews(): Promise<Article[]> {
  const allArticles: Article[] = [];
  
  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      
      const articles = feed.items.map(item => ({
        guid: item.guid || item.link || `${source.name}-${item.title}`,
        title: item.title || '',
        link: item.link || '',
        pubDate: new Date(item.pubDate || item.isoDate || Date.now()),
        description: item.contentSnippet || item.description || '',
        source: source.name,
        sourceBias: source.bias,
        sourceTier: source.tier,
        aggregatedAt: new Date(),
      }));
      
      allArticles.push(...articles);
      
    } catch (error) {
      console.error(`✗ Failed to fetch ${source.name}:`, error);
      // Continue with other sources
    }
  }
  
  return allArticles;
}

// Deduplicate articles by similarity
export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  const unique: Article[] = [];
  
  for (const article of articles) {
    // Create a normalized key from title (lowercase, remove punctuation)
    const key = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
    
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }
  
  return unique;
}

// Filter articles by date (only recent articles)
export function filterRecentArticles(articles: Article[], hoursAgo: number = 24): Article[] {
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return articles.filter(article => article.pubDate >= cutoff);
}

