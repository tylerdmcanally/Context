import { adminDb } from '@/lib/firebase-admin';
import StoryReader from '@/components/story/StoryReader';
import { Story } from '@/types/story';
import { notFound } from 'next/navigation';

async function getStory(id: string): Promise<Story | null> {
  try {
    const storyDoc = await adminDb.collection('stories').doc(id).get();
    
    if (!storyDoc.exists) {
      return null;
    }
    
    const data = storyDoc.data();
    if (data?.status !== 'published') {
      return null;
    }
    
    return {
      id: data.id || id,
      publishedDate: data.publishedDate || id,
      headline: data.headline,
      subheadline: data.subheadline,
      content: data.content,
      audioUrl: data.audioUrl,
      wordCount: data.wordCount,
      readTimeMinutes: data.readTimeMinutes,
      sourceList: data.sourceList || [],
      selectionMethod: data.selectionMethod,
      selectedCandidateNum: data.selectedCandidateNum,
      createdAt: data.createdAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate() || new Date(),
      status: data.status,
    };
  } catch (error) {
    console.error('Failed to fetch story:', error);
    return null;
  }
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);

  if (!story) {
    notFound();
  }

  return <StoryReader story={story} />;
}

