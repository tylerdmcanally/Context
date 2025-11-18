'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Button from '../ui/Button';

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b border-white/10 bg-black sticky top-0 z-50 backdrop-blur-sm bg-black/95">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-serif font-semibold text-white tracking-tight hover:opacity-70 transition-opacity">
            Context
          </Link>
          
          <nav className="flex items-center gap-8">
            <Link href="/archive" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Archive
            </Link>
            
            {!loading && user && (
              <>
                <Link href="/library" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                  Library
                </Link>
                
                {user.role === 'editor' && (
                  <Link href="/editor" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                    Editor
                  </Link>
                )}
                
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <Link 
                    href="/settings" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium text-white group-hover:bg-white/30 transition-colors">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:block">
                      {user.email?.split('@')[0] || 'Profile'}
                    </span>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="text-sm font-medium text-white/60 hover:text-white transition-colors px-2"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
            
            {!loading && !user && (
              <>
                <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
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

