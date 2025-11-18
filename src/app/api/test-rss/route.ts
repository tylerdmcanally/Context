import { NextResponse } from 'next/server';
import { aggregateNews, deduplicateArticles } from '@/lib/news/rss-aggregator';

export async function GET() {
  try {
    const articles = await aggregateNews();
    const unique = deduplicateArticles(articles);
    
    return NextResponse.json({
      success: true,
      totalArticles: articles.length,
      uniqueArticles: unique.length,
      sample: unique.slice(0, 5).map(a => ({
        title: a.title,
        source: a.source,
        pubDate: a.pubDate,
      })),
    });
  } catch (error) {
    console.error('RSS test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

