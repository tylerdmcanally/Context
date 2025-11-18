'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';

interface AuthContextValue {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      setFirebaseUser(fbUser);

      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (!isMounted) return;

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            subscriptionTier: data.subscriptionTier || 'free',
            subscriptionEndsAt: data.subscriptionEndsAt?.toDate() || new Date(),
            stripeCustomerId: data.stripeCustomerId,
            role: data.role,
            preferences: data.preferences || {
              emailNotifications: true,
              readingFontSize: 'medium',
            },
          });
        } else {
          const newUser: User = {
            id: fbUser.uid,
            email: fbUser.email || '',
            createdAt: new Date(),
            subscriptionTier: 'trial',
            subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            preferences: {
              emailNotifications: true,
              readingFontSize: 'medium',
            },
          };

          await setDoc(doc(db, 'users', fbUser.uid), {
            ...newUser,
            createdAt: new Date(),
            subscriptionEndsAt: new Date(newUser.subscriptionEndsAt),
          });

          if (!isMounted) return;
          setUser(newUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);

        if (!isMounted) return;
        const fallbackUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          createdAt: new Date(),
          subscriptionTier: 'free',
          subscriptionEndsAt: new Date(),
          preferences: {
            emailNotifications: true,
            readingFontSize: 'medium',
          },
        };
        setUser(fallbackUser);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      firebaseUser,
      loading,
      signIn: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      signUp: async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
      },
      signOut: async () => {
        await firebaseSignOut(auth);
      },
    }),
    [user, firebaseUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

