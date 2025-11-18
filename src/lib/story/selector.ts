import { StoryCandidate } from '@/types/story';
import {
  aggregateNews,
  deduplicateArticles,
  filterRecentArticles,
} from '@/lib/news/rss-aggregator';
import {
  clusterArticles,
  scoreStories,
} from '@/lib/news/shared-algorithms';
import { generateCandidateSummary } from '@/lib/ai/claude';

export async function generateCandidates(): Promise<StoryCandidate[]> {
  // 1. Aggregate news from RSS feeds
  const rawArticles = await aggregateNews();
  
  // 2. Deduplicate
  const uniqueArticles = deduplicateArticles(rawArticles);
  
  // 3. Filter to recent articles (last 24 hours)
  const recentArticles = filterRecentArticles(uniqueArticles, 24);
  
  // 4. Cluster similar stories
  const clusters = clusterArticles(recentArticles);
  
  // 5. Score clusters
  const scoredClusters = scoreStories(clusters);
  
  // 6. Generate 3 candidates
  const candidates: StoryCandidate[] = [];
  
  // Candidate 1: Highest coverage (consensus story)
  if (scoredClusters.length > 0) {
    const top = scoredClusters[0];
    const topArticles = top.stories.slice(0, 10).map(a => ({
      title: a.title,
      source: a.source,
      bias: a.sourceBias,
    }));
    candidates.push({
      candidateNum: 1,
      headline: top.mainHeadline,
      summary: await generateCandidateSummary(topArticles),
      coverageScore: top.score,
      sourceCountLeft: top.biasDistribution.left + top.biasDistribution.leanLeft,
      sourceCountCenter: top.biasDistribution.center,
      sourceCountRight: top.biasDistribution.right + top.biasDistribution.leanRight,
      rationale: `This story has the highest coverage with ${top.coverageCount} sources reporting. It's getting attention across the political spectrum.`,
      articles: top.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  }
  
  // Candidate 2: High significance but lower coverage (important-but-undercover)
  const tier1Clusters = scoredClusters.filter(c => 
    c.stories.some(s => s.sourceTier === 1) && c.coverageCount >= 5 && c.coverageCount < 15
  );
  
  if (tier1Clusters.length > 0) {
    const significant = tier1Clusters[0];
    const significantArticles = significant.stories.slice(0, 10).map(a => ({
      title: a.title,
      source: a.source,
      bias: a.sourceBias,
    }));
    candidates.push({
      candidateNum: 2,
      headline: significant.mainHeadline,
      summary: await generateCandidateSummary(significantArticles),
      coverageScore: significant.score,
      sourceCountLeft: significant.biasDistribution.left + significant.biasDistribution.leanLeft,
      sourceCountCenter: significant.biasDistribution.center,
      sourceCountRight: significant.biasDistribution.right + significant.biasDistribution.leanRight,
      rationale: `This story is being covered by tier-1 sources but hasn't broken into mainstream yet. Could be important.`,
      articles: significant.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  } else if (scoredClusters.length > 1) {
    // Fallback: use second highest scored cluster
    const second = scoredClusters[1];
    const secondArticles = second.stories.slice(0, 10).map(a => ({
      title: a.title,
      source: a.source,
      bias: a.sourceBias,
    }));
    candidates.push({
      candidateNum: 2,
      headline: second.mainHeadline,
      summary: await generateCandidateSummary(secondArticles),
      coverageScore: second.score,
      sourceCountLeft: second.biasDistribution.left + second.biasDistribution.leanLeft,
      sourceCountCenter: second.biasDistribution.center,
      sourceCountRight: second.biasDistribution.right + second.biasDistribution.leanRight,
      rationale: `Alternative story with ${second.coverageCount} sources. Different angle from the consensus.`,
      articles: second.stories.slice(0, 10).map(a => ({
        title: a.title,
        source: a.source,
        url: a.link,
        bias: a.sourceBias,
      })),
    });
  }
  
  // Candidate 3: Deep dive option (if no major breaking news)
  // For now, use 3rd highest scored cluster
  if (scoredClusters.length > 2) {
    const deepDive = scoredClusters[2];
    const deepDiveArticles = deepDive.stories.slice(0, 10).map(a => ({
      title: a.title,
      source: a.source,
      bias: a.sourceBias,
    }));
    candidates.push({
      candidateNum: 3,
      headline: deepDive.mainHeadline,
      summary: await generateCandidateSummary(deepDiveArticles),
      coverageScore: deepDive.score,
      sourceCountLeft: deepDive.biasDistribution.left + deepDive.biasDistribution.leanLeft,
      sourceCountCenter: deepDive.biasDistribution.center,
      sourceCountRight: deepDive.biasDistribution.right + deepDive.biasDistribution.leanRight,
      rationale: `Alternative story with ${deepDive.coverageCount} sources. Different angle from the consensus.`,
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

