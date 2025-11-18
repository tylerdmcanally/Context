'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StoryEditor from '@/components/editor/StoryEditor';
import PublishControls from '@/components/editor/PublishControls';
import Loading from '@/components/ui/Loading';
import { getTodayDateString } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  return (
    <ProtectedRoute requireEditor>
      <ReviewContent />
    </ProtectedRoute>
  );
}

function ReviewContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const storyId = getTodayDateString();

  useEffect(() => {
    loadStory();
  }, []);

  const loadStory = async () => {
    try {
      // Fetch story from Firestore or API
      const response = await fetch(`/api/stories/${storyId}`);
      if (response.ok) {
        const data = await response.json();
        setStory(data.story);
      }
    } catch (error) {
      console.error('Failed to load story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (headline: string, content: string) => {
    // TODO: Persist story edits to Firestore
  };

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/publish-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to publish:', error);
    }
  };

  const handleGenerateAudio = async () => {
    if (!story) return;

    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId,
          content: story.content,
        }),
      });

      if (response.ok) {
        // Reload story to get audio URL
        loadStory();
      }
    } catch (error) {
      console.error('Failed to generate audio:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p>Story not found. Please select a candidate first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Review Story</h1>
      
      <StoryEditor
        storyId={storyId}
        headline={story.headline}
        content={story.content}
        onSave={handleSave}
      />
      
      <div className="mt-8">
        <PublishControls
          storyId={storyId}
          onPublish={handlePublish}
          onGenerateAudio={handleGenerateAudio}
        />
      </div>
    </div>
  );
}

