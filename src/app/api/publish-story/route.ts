import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { storyId } = await req.json();
    
    if (!storyId) {
      return NextResponse.json(
        { error: 'Missing storyId' },
        { status: 400 }
      );
    }
    
    // Update story status to published
    await adminDb.collection('stories').doc(storyId).update({
      status: 'published',
      publishedAt: new Date(),
    });
    
    // TODO: Send email notifications to subscribers
    // TODO: Send push notifications
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to publish story:', error);
    return NextResponse.json(
      { error: 'Failed to publish story' },
      { status: 500 }
    );
  }
}

