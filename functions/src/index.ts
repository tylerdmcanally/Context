import * as admin from 'firebase-admin';

admin.initializeApp();

// Export scheduled functions
export { newsAggregation } from './scheduled/newsAggregation';
export { candidateGeneration } from './scheduled/generateCandidates';
export { autoSelect } from './scheduled/autoSelect';

