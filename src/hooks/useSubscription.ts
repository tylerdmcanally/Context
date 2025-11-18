'use client';

import { useAuth } from './useAuth';
import { hasDevPremiumAccess } from '@/lib/dev-helpers';

export function useSubscription() {
  const { user } = useAuth();

  const isPremium = user?.subscriptionTier === 'premium';
  const isTrial = user?.subscriptionTier === 'trial';
  const isFree = user?.subscriptionTier === 'free';
  const devBypassActive = hasDevPremiumAccess(user?.email ?? null);

  const effectivePremium = isPremium || devBypassActive;
  const effectiveTrial = isTrial || devBypassActive;

  const canAccessStory = (date: Date): boolean => {
    if (!user) return false;

    if (effectivePremium || effectiveTrial) return true;

    if (isFree && !devBypassActive) {
      const dayOfWeek = date.getDay();
      // Free users get M/W/F (1, 3, 5)
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    }

    return false;
  };

  const canAccessAudio = (): boolean => {
    return effectivePremium || effectiveTrial;
  };

  const canBookmark = (): boolean => {
    return effectivePremium || effectiveTrial;
  };

  const canAccessArchive = (): boolean => {
    return effectivePremium || effectiveTrial;
  };

  return {
    tier: devBypassActive ? 'premium' : user?.subscriptionTier || 'free',
    isPremium: effectivePremium,
    isTrial: effectiveTrial,
    isFree: isFree && !devBypassActive,
    devBypassActive,
    canAccessStory,
    canAccessAudio,
    canBookmark,
    canAccessArchive,
  };
}

