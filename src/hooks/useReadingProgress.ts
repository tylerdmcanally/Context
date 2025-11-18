'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ReadingProgress } from '@/types/user';

export function useReadingProgress(storyId: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !storyId) {
      setLoading(false);
      return;
    }

    loadProgress();
  }, [user, storyId]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      const progressDoc = await getDoc(
        doc(db, 'readingProgress', user.id, 'progress', storyId)
      );

      if (progressDoc.exists()) {
        const data = progressDoc.data();
        setProgress({
          storyId,
          percentComplete: data.percentComplete || 0,
          completed: data.completed || false,
          completedAt: data.completedAt?.toDate(),
          audioPositionSeconds: data.audioPositionSeconds,
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        });
      }
    } catch (error) {
      console.error('Failed to load reading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (
    percentComplete: number,
    completed?: boolean,
    audioPositionSeconds?: number
  ) => {
    if (!user) return;

    try {
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

      await setDoc(
        doc(db, 'readingProgress', user.id, 'progress', storyId),
        progressData,
        { merge: true }
      );

      setProgress({
        storyId,
        percentComplete,
        completed: completed || false,
        completedAt: completed ? new Date() : progress?.completedAt,
        audioPositionSeconds,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Failed to update reading progress:', error);
    }
  };

  return {
    progress,
    loading,
    updateProgress,
  };
}

