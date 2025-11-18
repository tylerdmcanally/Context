'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const router = useRouter();

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    setPortalError(null);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Unable to open billing portal');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError('Billing portal unavailable. Please try again.');
      }
    } catch (error) {
      console.error('Failed to open portal:', error);
      setPortalError('Could not open Stripe portal. Try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-semibold mb-8 text-white">Settings</h1>
      
      <div className="space-y-6">
        <div className="border border-white/10 rounded-lg p-6 bg-white/5">
          <h2 className="text-xl font-serif font-semibold mb-4 text-white">Account</h2>
          <div className="space-y-2 text-white/80">
            <p><strong className="text-white">Email:</strong> {user.email}</p>
            <p><strong className="text-white">Subscription:</strong> {user.subscriptionTier}</p>
            {user.subscriptionTier === 'trial' && (
              <p className="text-sm text-white/60 mt-2">
                Trial expires: {user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt).toLocaleDateString() : 'N/A'}
              </p>
            )}
            {user.subscriptionTier === 'premium' && user.stripeCustomerId && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={loading}
                className="mt-4"
              >
                {loading ? 'Loading...' : 'Manage Subscription'}
              </Button>
            )}
            {portalError && (
              <p className="text-sm text-red-300 mt-3">{portalError}</p>
            )}
          </div>
        </div>
        
        <div className="border border-white/10 rounded-lg p-6 bg-white/5">
          <h2 className="text-xl font-serif font-semibold mb-4 text-white">Preferences</h2>
          <p className="text-white/60">Preferences coming soon...</p>
        </div>
        
        <div className="border border-white/10 rounded-lg p-6 bg-white/5">
          <Button variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

