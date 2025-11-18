'use client';

import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '@/types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            createdAt: userData.createdAt?.toDate() || new Date(),
            subscriptionTier: userData.subscriptionTier || 'free',
            subscriptionEndsAt: userData.subscriptionEndsAt?.toDate() || new Date(),
            stripeCustomerId: userData.stripeCustomerId,
            role: userData.role,
            preferences: userData.preferences || {
              emailNotifications: true,
              readingFontSize: 'medium',
            },
          });
        } else {
          // Create user document if it doesn't exist
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            createdAt: new Date(),
            subscriptionTier: 'trial',
            subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            preferences: {
              emailNotifications: true,
              readingFontSize: 'medium',
            },
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUser,
            createdAt: new Date(),
            subscriptionEndsAt: new Date(newUser.subscriptionEndsAt),
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut,
  };
}

