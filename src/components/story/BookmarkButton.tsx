'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

interface BookmarkButtonProps {
  storyId: string;
}

export default function BookmarkButton({ storyId }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    checkBookmark();
  }, [user, storyId]);

  const checkBookmark = async () => {
    if (!user) return;

    try {
      const bookmarkDoc = await getDoc(
        doc(db, 'bookmarks', user.id, 'bookmarkedStories', storyId)
      );
      setIsBookmarked(bookmarkDoc.exists());
    } catch (error) {
      console.error('Failed to check bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const bookmarkRef = doc(db, 'bookmarks', user.id, 'bookmarkedStories', storyId);
      
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        setIsBookmarked(false);
      } else {
        await setDoc(bookmarkRef, {
          storyId,
          bookmarkedAt: new Date(),
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isBookmarked ? '🔖' : '🔖'}
    </button>
  );
}

