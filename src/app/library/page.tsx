'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { formatStoryDate } from '@/lib/utils/date';
import Loading from '@/components/ui/Loading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PaywallBanner from '@/components/ui/PaywallBanner';
import { Story } from '@/types/story';

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryContent />
    </ProtectedRoute>
  );
}

function LibraryContent() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      const bookmarksSnapshot = await getDocs(
        collection(db, 'bookmarks', user.id, 'bookmarkedStories')
      );

      const bookmarkData = await Promise.all(
        bookmarksSnapshot.docs.map(async (doc) => {
          const bookmark = doc.data();
          // Fetch story details
          const storyDoc = await getDocs(
            query(collection(db, 'stories'), where('__name__', '==', bookmark.storyId))
          );
          if (!storyDoc.empty) {
            const storyData = storyDoc.docs[0].data();
            return {
              ...bookmark,
              story: {
                id: bookmark.storyId,
                headline: storyData.headline,
                publishedDate: storyData.publishedDate,
                readTimeMinutes: storyData.readTimeMinutes,
              },
            };
          }
          return null;
        })
      );

      setBookmarks(bookmarkData.filter(Boolean));
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Library</h1>
      
      {bookmarks.length === 0 ? (
        <p className="text-gray-600">You haven't bookmarked any stories yet.</p>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark.storyId}
              href={`/story/${bookmark.storyId}`}
              className="block border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <time className="text-sm text-gray-500">
                {formatStoryDate(bookmark.story.publishedDate)}
              </time>
              <h2 className="text-2xl font-bold mt-2 mb-2">{bookmark.story.headline}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{bookmark.story.readTimeMinutes} min read</span>
                <span>Bookmarked {formatStoryDate(bookmark.bookmarkedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

