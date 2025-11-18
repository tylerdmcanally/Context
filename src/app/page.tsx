import { adminDb } from '@/lib/firebase-admin';
import StoryReader from '@/components/story/StoryReader';
import { Story } from '@/types/story';
import { getTodayDateString } from '@/lib/utils/date';
import Link from 'next/link';
import Button from '@/components/ui/Button';

async function getTodaysStory(): Promise<Story | null> {
  try {
    const today = getTodayDateString();
    const storyDoc = await adminDb.collection('stories').doc(today).get();
    
    if (!storyDoc.exists) {
      return null;
    }
    
    const data = storyDoc.data();
    if (data?.status !== 'published') {
      return null;
    }
    
    return {
      id: data.id || today,
      publishedDate: data.publishedDate || today,
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
    console.error('Failed to fetch today\'s story:', error);
    return null;
  }
}

export default async function Home() {
  const story = await getTodaysStory();

  if (!story) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-serif font-semibold mb-6 text-black tracking-tight">Welcome to Context</h1>
        <p className="text-lg text-black/70 mb-12 leading-relaxed max-w-xl mx-auto">
          Today's story is being prepared. Check back soon!
        </p>
        <Link href="/archive">
          <button className="px-6 py-3 bg-black text-white font-medium hover:bg-black/80 transition-colors">
            Browse Archive
          </button>
        </Link>
      </div>
    );
  }

  return <StoryReader story={story} />;
}
