'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-center text-white">Pricing</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-white/10 rounded-lg p-6 bg-white/5">
          <h2 className="text-2xl font-serif font-semibold mb-4 text-white">Free</h2>
          <div className="text-3xl font-semibold mb-6 text-white">$0<span className="text-lg text-white/60">/month</span></div>
          <ul className="space-y-3 mb-6 text-white/80">
            <li>✓ Daily stories (M/W/F only)</li>
            <li>✗ Audio narration</li>
            <li>✗ Bookmarks</li>
            <li>✗ Full archive</li>
          </ul>
          {!user && (
            <Link href="/signup">
              <Button variant="outline" className="w-full">Sign Up</Button>
            </Link>
          )}
        </div>
        
        <div className="border-2 border-white rounded-lg p-6 bg-white/10">
          <h2 className="text-2xl font-serif font-semibold mb-4 text-white">Premium</h2>
          <div className="text-3xl font-semibold mb-6 text-white">$4.99<span className="text-lg text-white/60">/month</span></div>
          <ul className="space-y-3 mb-6 text-white/80">
            <li>✓ Daily stories (all 7 days)</li>
            <li>✓ Audio narration</li>
            <li>✓ Bookmarks</li>
            <li>✓ Full archive</li>
            <li>✓ Weekend deep dives</li>
          </ul>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? 'Loading...' : user?.subscriptionTier === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-center text-white/60">
        <p>14-day free trial included with signup</p>
      </div>
    </div>
  );
}

