'use client';

import { useState } from 'react';
import Button from '../ui/Button';

interface PublishControlsProps {
  storyId: string;
  onPublish: () => Promise<void>;
  onGenerateAudio: () => Promise<void>;
}

export default function PublishControls({ storyId, onPublish, onGenerateAudio }: PublishControlsProps) {
  const [publishing, setPublishing] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
    } finally {
      setPublishing(false);
    }
  };

  const handleGenerateAudio = async () => {
    setGeneratingAudio(true);
    try {
      await onGenerateAudio();
    } finally {
      setGeneratingAudio(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold mb-4">Publish Controls</h3>
      <div className="flex gap-4">
        <Button
          onClick={handleGenerateAudio}
          disabled={generatingAudio}
          variant="secondary"
        >
          {generatingAudio ? 'Generating...' : 'Generate Audio'}
        </Button>
        <Button
          onClick={handlePublish}
          disabled={publishing}
          variant="primary"
        >
          {publishing ? 'Publishing...' : 'Publish Story'}
        </Button>
      </div>
    </div>
  );
}

