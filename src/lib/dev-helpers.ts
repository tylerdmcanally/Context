const devPremiumEnabled =
  process.env.NEXT_PUBLIC_ENABLE_DEV_PREMIUM_ACCESS === 'true';

const devPremiumAllowlist = process.env.NEXT_PUBLIC_DEV_PREMIUM_EMAILS
  ?.split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean) ?? [];

export function isDevEnvironment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function hasDevPremiumAccess(userEmail?: string | null): boolean {
  if (!isDevEnvironment() || !devPremiumEnabled) {
    return false;
  }

  if (devPremiumAllowlist.length === 0) {
    return true;
  }

  if (!userEmail) {
    return false;
  }

  return devPremiumAllowlist.includes(userEmail.toLowerCase());
}

