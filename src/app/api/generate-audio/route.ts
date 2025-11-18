import { NextResponse } from 'next/server';
import { generateAudio } from '@/lib/ai/openai-tts';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { storyId, content } = await req.json();
    
    if (!storyId || !content) {
      return NextResponse.json(
        { error: 'Missing storyId or content' },
        { status: 400 }
      );
    }
    
    // Generate audio
    const audioUrl = await generateAudio(content, storyId);
    
    // Update story with audio URL
    await adminDb.collection('stories').doc(storyId).update({
      audioUrl,
      audioGeneratedAt: new Date(),
    });
    
    return NextResponse.json({ success: true, audioUrl });
  } catch (error) {
    console.error('Failed to generate audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}

