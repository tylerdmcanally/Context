import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { autoSelectStory } from '../utils/autoSelector';
import { sendEditorNotification } from '../utils/notifications';

export const autoSelect = functions.pubsub
  .schedule('50 8 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Checking for auto-select...');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const candidatesDoc = await admin.firestore()
        .collection('storyCandidates')
        .doc(today)
        .get();
      
      if (!candidatesDoc.exists) {
        console.error('No candidates found for today');
        return;
      }
      
      const data = candidatesDoc.data();
      
      if (data?.selectedCandidate) {
        console.log('Editor already selected story');
        return;
      }
      
      if (!data?.candidates || data.candidates.length === 0) {
        console.error('No candidates available for auto-select');
        return;
      }
      
      // Auto-select candidate 1
      console.log('No manual selection - auto-selecting candidate 1');
      await autoSelectStory(data.candidates[0]);
      
      // Send notification to editor
      const editorEmail = process.env.EDITOR_EMAIL || 'editor@example.com';
      await sendEditorNotification(
        editorEmail,
        `Story auto-selected and published: ${data.candidates[0].headline}`
      );
      
      console.log('✓ Auto-select completed');
      
    } catch (error) {
      console.error('Auto-select failed:', error);
      throw error;
    }
  });

