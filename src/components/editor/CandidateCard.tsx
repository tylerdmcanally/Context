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
    <div className="border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-serif font-semibold mb-2 text-white">{candidate.headline}</h3>
          <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
            <span>Score: {candidate.coverageScore.toFixed(1)}</span>
            <span>
              Sources: {candidate.sourceCountLeft + candidate.sourceCountCenter + candidate.sourceCountRight}
            </span>
            <span>
              Bias: L:{candidate.sourceCountLeft} C:{candidate.sourceCountCenter} R:{candidate.sourceCountRight}
            </span>
          </div>
        </div>
        <div className="text-2xl font-semibold text-white/40">
          #{candidate.candidateNum}
        </div>
      </div>

      <p className="text-white/80 mb-4 whitespace-pre-wrap">{candidate.summary}</p>

      <div className="bg-white/5 rounded p-3 mb-4 border border-white/10">
        <p className="text-sm text-white/60 italic">{candidate.rationale}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-white/50">
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

