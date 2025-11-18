import * as admin from 'firebase-admin';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null as any;

export async function autoSelectStory(candidate: any): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const storyId = today;
  
  console.log(`Auto-selecting candidate ${candidate.candidateNum} for story ${storyId}`);
  
  // Generate full story
  const prompt = `
You are writing today's story for Context, a daily news digest.

STORY SELECTED: ${candidate.headline}

SOURCES PROVIDED:
${candidate.articles.map((a: any, i: number) => `
SOURCE ${i + 1}: ${a.source} (${a.bias})
Title: ${a.title}
`).join('\n---\n')}

Write a 2,500-word story in the style of a knowledgeable professor explaining this news story. Include:
1. What happened
2. How we got here (background)
3. Multiple perspectives
4. Facts vs. speculation
5. Why this matters

Be conversational, engaging, and balanced.
  `;
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      { role: 'user', content: prompt }
    ],
  });
  
  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 200);
  
  // Generate audio
  let audioUrl = '';
  try {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'echo',
      input: content,
      speed: 1.0,
    });
    
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const bucket = admin.storage().bucket();
    const file = bucket.file(`audio/${storyId}.mp3`);
    
    await file.save(buffer, {
      metadata: { contentType: 'audio/mpeg' },
    });
    
    await file.makePublic();
    audioUrl = `https://storage.googleapis.com/${bucket.name}/audio/${storyId}.mp3`;
  } catch (error) {
    console.error('Failed to generate audio:', error);
  }
  
  // Save story
  await admin.firestore().collection('stories').doc(storyId).set({
    id: storyId,
    publishedDate: today,
    headline: candidate.headline,
    content,
    audioUrl,
    wordCount,
    readTimeMinutes,
    sourceList: candidate.articles.map((a: any) => ({
      name: a.source,
      bias: a.bias,
      url: a.url,
    })),
    selectionMethod: 'auto',
    selectedCandidateNum: candidate.candidateNum,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'published',
  });
  
  // Mark candidate as selected
  await admin.firestore()
    .collection('storyCandidates')
    .doc(today)
    .update({
      selectedCandidate: candidate.candidateNum,
      selectedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  
  console.log(`✓ Story ${storyId} auto-selected and published`);
}

