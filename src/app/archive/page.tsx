import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import { Story } from '@/types/story';
import { formatStoryDate } from '@/lib/utils/date';

async function getStories(): Promise<Story[]> {
  try {
    const storiesSnapshot = await adminDb
      .collection('stories')
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(50)
      .get();
    
    return storiesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        publishedDate: data.publishedDate || doc.id,
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
    });
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return [];
  }
}

export default async function ArchivePage() {
  const stories = await getStories();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Archive</h1>
      
      {stories.length === 0 ? (
        <p className="text-gray-600">No stories available yet.</p>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/story/${story.id}`}
              className="block border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <time className="text-sm text-gray-500">
                {formatStoryDate(story.publishedDate)}
              </time>
              <h2 className="text-2xl font-bold mt-2 mb-2">{story.headline}</h2>
              {story.subheadline && (
                <p className="text-gray-600 mb-2">{story.subheadline}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{story.readTimeMinutes} min read</span>
                {story.audioUrl && <span>🎧 Audio available</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

