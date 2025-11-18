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
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');
      
      if (!isMounted) return;
      
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          console.log('Fetching user document from Firestore...');
          // Fetch user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!isMounted) return;
          
          if (userDoc.exists()) {
            console.log('User document found in Firestore');
            const userData = userDoc.data();
            const userObj: User = {
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
            };
            console.log('Setting user:', userObj.email);
            setUser(userObj);
          } else {
            console.log('User document not found, creating new one...');
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
            if (!isMounted) return;
            console.log('Created new user document, setting user:', newUser.email);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (!isMounted) return;
          // Still set basic user info even if Firestore fails
          const fallbackUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            createdAt: new Date(),
            subscriptionTier: 'free',
            subscriptionEndsAt: new Date(),
            preferences: {
              emailNotifications: true,
              readingFontSize: 'medium',
            },
          };
          console.log('Using fallback user data:', fallbackUser.email);
          setUser(fallbackUser);
        }
      } else {
        console.log('No Firebase user, setting user to null');
        setUser(null);
      }
      
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
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

