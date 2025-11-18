'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface StoryEditorProps {
  storyId: string;
  headline: string;
  content: string;
  onSave: (headline: string, content: string) => Promise<void>;
}

export default function StoryEditor({ storyId, headline: initialHeadline, content: initialContent, onSave }: StoryEditorProps) {
  const [headline, setHeadline] = useState(initialHeadline);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(headline, content);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Input
        label="Headline"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
      />
      
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 px-4 py-2 border border-white/20 rounded-lg bg-black text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40"
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

