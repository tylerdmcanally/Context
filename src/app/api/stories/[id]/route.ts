import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Story } from '@/types/story';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const storyDoc = await adminDb.collection('stories').doc(id).get();
    
    if (!storyDoc.exists) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }
    
    const data = storyDoc.data();
    const story: Story = {
      id: data?.id || id,
      publishedDate: data?.publishedDate || id,
      headline: data?.headline,
      subheadline: data?.subheadline,
      content: data?.content,
      audioUrl: data?.audioUrl,
      wordCount: data?.wordCount,
      readTimeMinutes: data?.readTimeMinutes,
      sourceList: data?.sourceList || [],
      selectionMethod: data?.selectionMethod,
      selectedCandidateNum: data?.selectedCandidateNum,
      createdAt: data?.createdAt?.toDate() || new Date(),
      publishedAt: data?.publishedAt?.toDate() || new Date(),
      status: data?.status,
    };
    
    return NextResponse.json({ success: true, story });
  } catch (error) {
    console.error('Failed to get story:', error);
    return NextResponse.json(
      { error: 'Failed to get story' },
      { status: 500 }
    );
  }
}

