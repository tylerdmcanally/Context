'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Loading from '../ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEditor?: boolean;
}

export default function ProtectedRoute({ children, requireEditor }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure about the auth state
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (requireEditor && user.role !== 'editor') {
        router.push('/');
        return;
      }
    }
  }, [user, loading, requireEditor, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (requireEditor && user.role !== 'editor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}

