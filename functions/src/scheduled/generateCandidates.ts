import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { generateCandidates } from '../utils/candidateGenerator';
import { sendEditorNotification } from '../utils/notifications';

export const candidateGeneration = functions.pubsub
  .schedule('30 6 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Generating story candidates...');
    
    try {
      const candidates = await generateCandidates();
      
      const today = new Date().toISOString().split('T')[0];
      await admin.firestore()
        .collection('storyCandidates')
        .doc(today)
        .set({
          date: today,
          candidates,
          generatedAt: admin.firestore.FieldValue.serverTimestamp(),
          selectedCandidate: null,
        });
      
      // Send email to editor
      const editorEmail = process.env.EDITOR_EMAIL || 'editor@example.com';
      await sendEditorNotification(
        editorEmail,
        `Today's story candidates are ready. Visit the editor dashboard to review.`
      );
      
      console.log('✓ Candidates ready for review');
      
    } catch (error) {
      console.error('Candidate generation failed:', error);
      throw error;
    }
  });

