export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateCandidatesResponse {
  candidates: Array<{
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
      bias: string;
    }>;
  }>;
}

export interface GenerateStoryRequest {
  candidate: any;
  storyId: string;
}

export interface GenerateStoryResponse {
  storyId: string;
  content: string;
}

export interface GenerateAudioRequest {
  storyId: string;
  content: string;
}

export interface GenerateAudioResponse {
  audioUrl: string;
}

export interface PublishStoryRequest {
  storyId: string;
}

export interface ReadingProgressRequest {
  storyId: string;
  percentComplete: number;
  completed?: boolean;
  audioPositionSeconds?: number;
}

