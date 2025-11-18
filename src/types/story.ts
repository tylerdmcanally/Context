import type { BiasRating as SharedBiasRating } from '@/lib/news/shared-algorithms';

export type BiasRating = SharedBiasRating;

export interface Source {
  name: string;
  bias: BiasRating;
  url: string;
}

export interface Story {
  id: string;
  publishedDate: string;
  headline: string;
  subheadline?: string;
  content: string;
  audioUrl?: string;
  wordCount: number;
  readTimeMinutes: number;
  sourceList: Source[];
  selectionMethod: 'manual' | 'auto';
  selectedCandidateNum: 1 | 2 | 3;
  createdAt: Date;
  publishedAt: Date;
  status: 'draft' | 'published';
}

export interface StoryCandidate {
  candidateNum: 1 | 2 | 3;
  headline: string;
  summary: string;
  coverageScore: number;
  sourceCountLeft: number;
  sourceCountCenter: number;
  sourceCountRight: number;
  rationale: string;
  articles: Array<{
    title: string;
    source: string;
    url: string;
    bias: BiasRating;
  }>;
}

export interface Article {
  guid: string;
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  content?: string;
  source: string;
  sourceBias: BiasRating;
  sourceTier: number;
  aggregatedAt: Date;
}

