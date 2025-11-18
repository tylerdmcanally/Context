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
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requireEditor && user.role !== 'editor') {
        router.push('/');
      }
    }
  }, [user, loading, requireEditor, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  if (requireEditor && user.role !== 'editor') {
    return null;
  }

  return <>{children}</>;
}

