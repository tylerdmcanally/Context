import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth';

export async function POST(req: Request) {
  try {
    const { storyId, percentComplete, completed, audioPositionSeconds } = await req.json();
    
    // Get user ID from request headers or auth token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // In production, verify the token properly
    // For now, we'll need to get userId from the request body or session
    const { userId } = await req.json();
    
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

