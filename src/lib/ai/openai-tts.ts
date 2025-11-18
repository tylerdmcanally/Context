import OpenAI from 'openai';
import { adminStorage } from '@/lib/firebase-admin';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAudio(
  text: string,
  storyId: string
): Promise<string> {
  console.log(`Generating audio for story ${storyId}...`);
  
  try {
    // Generate audio with OpenAI
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'echo',
      input: text,
      speed: 1.0,
    });
    
    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(`audio/${storyId}.mp3`);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });
    
    // Make file publicly readable
    await file.makePublic();
    
    // Get public URL
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/audio/${storyId}.mp3`;
    
    console.log(`Audio generated: ${audioUrl}`);
    return audioUrl;
  } catch (error) {
    console.error('Failed to generate audio:', error);
    throw error;
  }
}

