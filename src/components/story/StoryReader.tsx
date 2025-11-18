'use client';

import { useState, useEffect } from 'react';
import { Story } from '@/types/story';
import { useSubscription } from '@/hooks/useSubscription';
import AudioPlayer from './AudioPlayer';
import BookmarkButton from './BookmarkButton';
import SourcesList from './SourcesList';
import ProgressTracker from './ProgressTracker';
import PaywallBanner from '../ui/PaywallBanner';
import { formatStoryDateFull } from '@/lib/utils/date';
import { formatMarkdownToHtml } from '@/lib/utils/text';

interface StoryReaderProps {
  story: Story;
}

export default function StoryReader({ story }: StoryReaderProps) {
  const { canAccessAudio, canBookmark } = useSubscription();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasAudioAccess = canAccessAudio();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <ProgressTracker progress={scrollProgress} />

      <header className="mb-12">
        <time className="text-sm text-white/50 mb-4 block font-medium">
          {formatStoryDateFull(story.publishedDate)}
        </time>

        <h1 className="text-5xl font-serif font-semibold mt-2 mb-6 leading-tight text-white tracking-tight">
          {story.headline}
        </h1>

        {story.subheadline && (
          <p className="text-xl text-white/70 mb-8 leading-relaxed font-serif">{story.subheadline}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-white/60 font-medium">
            {story.readTimeMinutes} min read
          </span>

          {canBookmark() && <BookmarkButton storyId={story.id} />}
        </div>
      </header>

      {story.audioUrl && hasAudioAccess && (
        <AudioPlayer audioUrl={story.audioUrl} storyId={story.id} />
      )}

      {story.audioUrl && !hasAudioAccess && (
        <PaywallBanner
          message="Audio narration is available for Premium subscribers."
          feature="audio"
        />
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(story.content) }}
      />

      <SourcesList sources={story.sourceList} />
    </article>
  );
}

