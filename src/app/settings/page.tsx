'use client';

import { useState } from 'react';
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
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to open portal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
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
            {user.subscriptionTier === 'premium' && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={loading}
              >
                Manage Subscription
              </Button>
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

