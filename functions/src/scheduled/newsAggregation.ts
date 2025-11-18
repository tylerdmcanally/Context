import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { aggregateNews, deduplicateArticles } from '../utils/rssParser';

export const newsAggregation = functions.pubsub
  .schedule('0 4,6 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Starting news aggregation...');
    
    try {
      const articles = await aggregateNews();
      const unique = deduplicateArticles(articles);
      
      // Store in Firestore
      const batch = admin.firestore().batch();
      let batchCount = 0;
      
      unique.forEach(article => {
        const docRef = admin.firestore()
          .collection('rawArticles')
          .doc(article.guid);
        batch.set(docRef, {
          ...article,
          pubDate: admin.firestore.Timestamp.fromDate(article.pubDate),
          aggregatedAt: admin.firestore.Timestamp.fromDate(article.aggregatedAt),
        }, { merge: true });
        
        batchCount++;
        
        // Firestore batches are limited to 500 operations
        if (batchCount >= 500) {
          batch.commit();
          batchCount = 0;
        }
      });
      
      if (batchCount > 0) {
        await batch.commit();
      }
      
      console.log(`✓ Aggregated ${unique.length} unique articles`);
      
    } catch (error) {
      console.error('News aggregation failed:', error);
      throw error;
    }
  });

