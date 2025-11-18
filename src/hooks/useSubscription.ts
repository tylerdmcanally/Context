'use client';

import { useAuth } from './useAuth';
import { SubscriptionTier } from '@/types/user';

export function useSubscription() {
  const { user } = useAuth();

  const isPremium = user?.subscriptionTier === 'premium';
  const isTrial = user?.subscriptionTier === 'trial';
  const isFree = user?.subscriptionTier === 'free';

  const canAccessStory = (date: Date): boolean => {
    if (!user) return false;
    
    if (isPremium || isTrial) return true;
    
    if (isFree) {
      const dayOfWeek = date.getDay();
      // Free users get M/W/F (1, 3, 5)
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    }
    
    return false;
  };

  const canAccessAudio = (): boolean => {
    return isPremium || isTrial;
  };

  const canBookmark = (): boolean => {
    return isPremium || isTrial;
  };

  const canAccessArchive = (): boolean => {
    return isPremium || isTrial;
  };

  return {
    tier: user?.subscriptionTier || 'free',
    isPremium,
    isTrial,
    isFree,
    canAccessStory,
    canAccessAudio,
    canBookmark,
    canAccessArchive,
  };
}

