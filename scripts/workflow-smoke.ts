import {
  aggregateNews,
  deduplicateArticles,
  filterRecentArticles,
} from '../src/lib/news/rss-aggregator';
import {
  clusterArticles,
  scoreStories,
  SharedArticle,
} from '../functions/src/shared/shared-algorithms';

async function run() {
  console.log('Starting workflow smoke test...');

  const rawArticles = await aggregateNews();
  console.log(`Aggregated ${rawArticles.length} articles`);

  const unique = deduplicateArticles(rawArticles);
  console.log(`Unique after dedupe: ${unique.length}`);

  const recent = filterRecentArticles(unique, 24);
  console.log(`Recent (24h) articles: ${recent.length}`);

  const clusters = clusterArticles(recent as SharedArticle[]);
  console.log(`Cluster count: ${clusters.length}`);

  const scored = scoreStories(clusters);
  console.log(`Scored clusters: ${scored.length}`);

  if (scored.length > 0) {
    console.log(
      `Top candidate: ${scored[0].mainHeadline} (${scored[0].coverageCount} sources)`
    );
  }

  console.log('Workflow smoke test complete (story generation not included).');
}

run().catch((error) => {
  console.error('Workflow smoke test failed:', error);
  process.exit(1);
});

