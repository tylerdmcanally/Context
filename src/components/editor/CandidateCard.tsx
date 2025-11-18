'use client';

import { StoryCandidate } from '@/types/story';
import Button from '../ui/Button';

interface CandidateCardProps {
  candidate: StoryCandidate;
  onSelect: () => void;
  disabled?: boolean;
}

export default function CandidateCard({ candidate, onSelect, disabled }: CandidateCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{candidate.headline}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Score: {candidate.coverageScore.toFixed(1)}</span>
            <span>
              Sources: {candidate.sourceCountLeft + candidate.sourceCountCenter + candidate.sourceCountRight}
            </span>
            <span>
              Bias: L:{candidate.sourceCountLeft} C:{candidate.sourceCountCenter} R:{candidate.sourceCountRight}
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-300">
          #{candidate.candidateNum}
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{candidate.summary}</p>

      <div className="bg-gray-50 rounded p-3 mb-4">
        <p className="text-sm text-gray-600 italic">{candidate.rationale}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {candidate.articles.length} articles
        </div>
        <Button
          onClick={onSelect}
          disabled={disabled}
          variant="primary"
        >
          Select This Story
        </Button>
      </div>
    </div>
  );
}

