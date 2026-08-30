import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; isMock: boolean; error?: string }>;
  loginWithGithub: () => Promise<{ success: boolean; isMock: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Popup-based sign-in can hang indefinitely (e.g. Cross-Origin-Opener-Policy
// blocking Firebase's popup.closed detection, or a blocked/never-opened
// popup) rather than rejecting, so race it against a hard timeout to
// guarantee the caller's catch block always runs.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Sign-in timed out')), ms)),
  ]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active mock session first
    const savedMockUser = localStorage.getItem('devtrace_mock_user');
    if (savedMockUser) {
      try {
        setUser(JSON.parse(savedMockUser));
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse mock user:', e);
        localStorage.removeItem('devtrace_mock_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await withTimeout(signInWithPopup(auth, googleProvider), 15000);
      localStorage.removeItem('devtrace_mock_user');
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 }
      });
      return { success: true, isMock: false };
    } catch (err: any) {
      console.warn('Firebase Google Auth error, activating mock fallback:', err);
      const mockUser = {
        uid: 'mock-google-user',
        email: 'saitriveni@devtrace.io',
        displayName: 'Triveni',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Triveni',
        emailVerified: true,
      };
      localStorage.setItem('devtrace_mock_user', JSON.stringify(mockUser));
      setUser(mockUser as any);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      return { success: true, isMock: true, error: err.message };
    }
  };

  const loginWithGithub = async () => {
    try {
      await withTimeout(signInWithPopup(auth, githubProvider), 15000);
      localStorage.removeItem('devtrace_mock_user');
      confetti({
        particleCount: 140,
        spread: 70,
        origin: { y: 0.6 }
      });
      return { success: true, isMock: false };
    } catch (err: any) {
      console.warn('Firebase GitHub Auth error, activating mock fallback:', err);
      // Link to Google by using the same user email but marked as github connected
      const mockUser = {
        uid: 'mock-github-user',
        email: 'saitriveni@devtrace.io',
        displayName: 'Triveni',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TriveniGitHub',
        emailVerified: true,
      };
      localStorage.setItem('devtrace_mock_user', JSON.stringify(mockUser));
      setUser(mockUser as any);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      return { success: true, isMock: true, error: err.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('devtrace_mock_user');
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error('Logout Error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
