import { aggregateNews, deduplicateArticles, Article } from './rssParser';
import { clusterArticles } from './clustering';
import { scoreStories } from './scoring';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface StoryCandidate {
  candidateNum: 1 | 2 | 3;
  headline: string;
  summary: string;
  coverageScore: number;
  sourceCountLeft: number;
  sourceCountCenter: number;
  sourceCountRight: number;
  rationale: string;
  articles: Array<{
    title: string;
    source: string;
    url: string;
    bias: string;
  }>;
}

async function generateCandidateSummary(articles: Article[]): Promise<string> {
  const prompt = `
You are creating a 500-word preview for an editor to decide if this should be today's story.

Articles on this topic:
${articles.slice(0, 10).map(a => `- ${a.title} (${a.source} - ${a.sourceBias})`).join('\n')}

Write a compelling 500-word summary that includes:
1. What happened (2-3 sentences)
2. Why it matters
3. Different perspectives being discussed
4. Why this would make a good story for readers

Keep it conversational and engaging.
  `;
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        { role: 'user', content: prompt }
      ],
    });
    
    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Failed to generate summary:', error);
    return `Summary for ${articles[0].title} with ${articles.length} sources...`;
  }
}

export async function generateCandidates(): Promise<StoryCandidate[]> {
  console.log('Starting candidate generation...');
  
  const rawArticles = await aggregateNews();
  const uniqueArticles = deduplicateArticles(rawArticles);
  
  // Filter to recent articles (last 24 hours)
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentArticles = uniqueArticles.filter(a => a.pubDate >= cutoff);
  
  const clusters = clusterArticles(recentArticles);
  const scoredClusters = scoreStories(clusters);
  
  const candidates: StoryCandidate[] = [];
  
  // Candidate 1: Highest coverage
  if (scoredClusters.length > 0) {
    const top = scoredClusters[0];
    candidates.push({
      candidateNum: 1,
      headline: top.mainHeadline,
      summary: await generateCandidateSummary(top.stories),
      coverageScore: top.score,
      sourceCountLeft: top.biasDistribution.left + top.biasDistribution.leanLeft,
      sourceCountCenter: top.biasDistribution.center,
      sourceCountRight: top.biasDistribution.right + top.biasDistribution.leanRight,
      rationale: `This story has the highest coverage with ${top.coverageCount} sources reporting.`,
      articles: top.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  }
  
  // Candidate 2: High significance but lower coverage
  const tier1Clusters = scoredClusters.filter(c => 
    c.stories.some(s => s.sourceTier === 1) && c.coverageCount >= 5 && c.coverageCount < 15
  );
  
  if (tier1Clusters.length > 0) {
    const significant = tier1Clusters[0];
    candidates.push({
      candidateNum: 2,
      headline: significant.mainHeadline,
      summary: await generateCandidateSummary(significant.stories),
      coverageScore: significant.score,
      sourceCountLeft: significant.biasDistribution.left + significant.biasDistribution.leanLeft,
      sourceCountCenter: significant.biasDistribution.center,
      sourceCountRight: significant.biasDistribution.right + significant.biasDistribution.leanRight,
      rationale: `This story is being covered by tier-1 sources but hasn't broken into mainstream yet.`,
      articles: significant.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  } else if (scoredClusters.length > 1) {
    const second = scoredClusters[1];
    candidates.push({
      candidateNum: 2,
      headline: second.mainHeadline,
      summary: await generateCandidateSummary(second.stories),
      coverageScore: second.score,
      sourceCountLeft: second.biasDistribution.left + second.biasDistribution.leanLeft,
      sourceCountCenter: second.biasDistribution.center,
      sourceCountRight: second.biasDistribution.right + second.biasDistribution.leanRight,
      rationale: `Alternative story with ${second.coverageCount} sources.`,
      articles: second.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  }
  
  // Candidate 3: Deep dive option
  if (scoredClusters.length > 2) {
    const deepDive = scoredClusters[2];
    candidates.push({
      candidateNum: 3,
      headline: deepDive.mainHeadline,
      summary: await generateCandidateSummary(deepDive.stories),
      coverageScore: deepDive.score,
      sourceCountLeft: deepDive.biasDistribution.left + deepDive.biasDistribution.leanLeft,
      sourceCountCenter: deepDive.biasDistribution.center,
      sourceCountRight: deepDive.biasDistribution.right + deepDive.biasDistribution.leanRight,
      rationale: `Alternative story with ${deepDive.coverageCount} sources.`,
      articles: deepDive.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  }
  
  return candidates;
}

