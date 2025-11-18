'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '../ui/Button';

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b border-black/10 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-serif font-semibold text-black tracking-tight hover:opacity-70 transition-opacity">
            Context
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link href="/archive" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
              Archive
            </Link>
            
            {!loading && user && (
              <>
                <Link href="/library" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
                  Library
                </Link>
                
                {user.role === 'editor' && (
                  <Link href="/editor" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
                    Editor
                  </Link>
                )}
                
                <div className="flex items-center gap-4">
                  <Link href="/settings" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
                    {user.email?.split('@')[0] || 'Profile'}
                  </Link>
                  <button 
                    onClick={signOut}
                    className="text-sm font-medium text-black/70 hover:text-black transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
            
            {!loading && !user && (
              <>
                <Link href="/login" className="text-sm font-medium text-black/70 hover:text-black transition-colors">
                  Log In
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

