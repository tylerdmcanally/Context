import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storyId, percentComplete, completed, audioPositionSeconds, userId } = body;
    
    // Get user ID from request body (client should send it)
    // TODO: In production, verify auth token from headers instead
    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'Missing userId or storyId' },
        { status: 400 }
      );
    }
    
    const progressData: any = {
      storyId,
      percentComplete,
      completed: completed || false,
      lastUpdated: new Date(),
    };
    
    if (completed) {
      progressData.completedAt = new Date();
    }
    
    if (audioPositionSeconds !== undefined) {
      progressData.audioPositionSeconds = audioPositionSeconds;
    }
    
    await adminDb
      .collection('readingProgress')
      .doc(userId)
      .collection('progress')
      .doc(storyId)
      .set(progressData, { merge: true });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save reading progress:', error);
    return NextResponse.json(
      { error: 'Failed to save reading progress' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get('storyId');
    const userId = searchParams.get('userId');
    
    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'Missing userId or storyId' },
        { status: 400 }
      );
    }
    
    const progressDoc = await adminDb
      .collection('readingProgress')
      .doc(userId)
      .collection('progress')
      .doc(storyId)
      .get();
    
    if (!progressDoc.exists) {
      return NextResponse.json({ success: true, progress: null });
    }
    
    const data = progressDoc.data();
    return NextResponse.json({ success: true, progress: data });
  } catch (error) {
    console.error('Failed to get reading progress:', error);
    return NextResponse.json(
      { error: 'Failed to get reading progress' },
      { status: 500 }
    );
  }
}

