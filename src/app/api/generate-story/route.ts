import { NextResponse } from 'next/server';
import { generateStory } from '@/lib/ai/claude';
import { fetchMultipleArticlesServer } from '@/lib/news/article-fetcher-server';
import { adminDb } from '@/lib/firebase-admin';
import { countWords, calculateReadTime } from '@/lib/utils/text';
import { STORY_WORDS_PER_MINUTE } from '@/config/constants';

export async function POST(req: Request) {
  try {
    const { candidate, storyId } = await req.json();
    
    if (!candidate || !storyId) {
      return NextResponse.json(
        { error: 'Missing candidate or storyId' },
        { status: 400 }
      );
    }
    
    // Fetch full article content
    const urls = candidate.articles.map((a: any) => a.url);
    const contentMap = await fetchMultipleArticlesServer(urls);
    
    // Prepare articles with content
    const articlesWithContent = candidate.articles
      .map((a: any) => ({
        title: a.title,
        source: a.source,
        bias: a.bias,
        content: contentMap.get(a.url) || a.title + ' ' + (candidate.summary || ''),
      }))
      .filter((a: any) => a.content);
    
    // Generate story with Claude
    const content = await generateStory(articlesWithContent, candidate.headline);
    
    // Calculate metrics
    const wordCount = countWords(content);
    const readTimeMinutes = calculateReadTime(wordCount, STORY_WORDS_PER_MINUTE);
    
    // Save as draft
    await adminDb.collection('stories').doc(storyId).set({
      id: storyId,
      publishedDate: storyId,
      headline: candidate.headline,
      content,
      wordCount,
      readTimeMinutes,
      sourceList: candidate.articles.map((a: any) => ({
        name: a.source,
        bias: a.bias,
        url: a.url,
      })),
      selectionMethod: 'manual',
      selectedCandidateNum: candidate.candidateNum,
      status: 'draft',
      createdAt: new Date(),
    }, { merge: true });
    
    return NextResponse.json({ success: true, storyId, content });
  } catch (error) {
    console.error('Failed to generate story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}

