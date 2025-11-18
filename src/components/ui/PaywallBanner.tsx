'use client';

import Link from 'next/link';
import Button from './Button';

interface PaywallBannerProps {
  message: string;
  feature: string;
}

export default function PaywallBanner({ message, feature }: PaywallBannerProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 mb-12">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-serif font-semibold text-white mb-2">
            Premium Feature
          </h3>
          <p className="text-white/70 mb-4">{message}</p>
          <Link href="/pricing">
            <Button variant="primary" size="sm">
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

