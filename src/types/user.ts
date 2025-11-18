export type SubscriptionTier = 'trial' | 'free' | 'premium';

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  subscriptionTier: SubscriptionTier;
  subscriptionEndsAt: Date;
  stripeCustomerId?: string;
  role?: 'editor';
  preferences: {
    emailNotifications: boolean;
    readingFontSize: 'small' | 'medium' | 'large';
  };
}

export interface ReadingProgress {
  storyId: string;
  percentComplete: number;
  completed: boolean;
  completedAt?: Date;
  audioPositionSeconds?: number;
  lastUpdated: Date;
}

export interface Bookmark {
  storyId: string;
  bookmarkedAt: Date;
  note?: string;
}

