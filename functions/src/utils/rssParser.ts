import Parser from 'rss-parser';
import { BiasRating } from '../shared/shared-algorithms';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'description', 'content:encoded']
  }
});

export interface RSSSource {
  name: string;
  url: string;
  bias: BiasRating;
  tier: number;
}

export interface Article {
  guid: string;
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  source: string;
  sourceBias: BiasRating;
  sourceTier: number;
  aggregatedAt: Date;
}

export const RSS_SOURCES: RSSSource[] = [
  { name: 'Reuters World', url: 'https://www.reuters.com/rssfeed/worldNews', bias: 'center', tier: 1 },
  { name: 'Reuters US', url: 'https://www.reuters.com/rssfeed/domesticNews', bias: 'center', tier: 1 },
  { name: 'AP Top News', url: 'https://apnews.com/apf-topnews', bias: 'center', tier: 1 },
  { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml', bias: 'center', tier: 2 },
  { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', bias: 'lean-left', tier: 2 },
  { name: 'Guardian US', url: 'https://www.theguardian.com/us-news/rss', bias: 'left', tier: 2 },
  { name: 'NYT Homepage', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', bias: 'lean-left', tier: 2 },
  { name: 'WSJ World', url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', bias: 'lean-right', tier: 2 },
  { name: 'Fox News', url: 'http://feeds.foxnews.com/foxnews/politics', bias: 'right', tier: 2 },
  { name: 'Politico', url: 'https://www.politico.com/rss/politics08.xml', bias: 'center', tier: 3 },
  { name: 'The Hill', url: 'https://thehill.com/rss/syndicator/19109', bias: 'center', tier: 3 },
  { name: 'The Atlantic', url: 'https://www.theatlantic.com/feed/all/', bias: 'lean-left', tier: 3 },
  { name: 'National Review', url: 'https://www.nationalreview.com/feed/', bias: 'right', tier: 3 },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', bias: 'center', tier: 2 },
];

export async function aggregateNews(): Promise<Article[]> {
  const allArticles: Article[] = [];
  
  for (const source of RSS_SOURCES) {
    try {
      console.log(`Fetching from ${source.name}...`);
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
      console.log(`✓ Fetched ${articles.length} articles from ${source.name}`);
      
    } catch (error) {
      console.error(`✗ Failed to fetch ${source.name}:`, error);
    }
  }
  
  console.log(`Total articles aggregated: ${allArticles.length}`);
  return allArticles;
}

export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  const unique: Article[] = [];
  
  for (const article of articles) {
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

