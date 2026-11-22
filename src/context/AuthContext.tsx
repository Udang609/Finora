import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  type User as FirebaseUser,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { initFirebase, isFirebaseConfigured } from '../config/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  loginAnonymously: () => Promise<void>;
  updateDisplayName: (name: string, avatarUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const { auth } = initFirebase();
    const unsub = onAuthStateChanged(auth, (u: FirebaseUser | null) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  const loginAnonymously = useCallback(async () => {
    if (!configured) return;
    const { auth } = initFirebase();
    await signInAnonymously(auth);
  }, [configured]);

  const updateDisplayName = useCallback(async (name: string, avatarUrl?: string) => {
    if (!configured || !user) return;
    const { auth } = initFirebase();
    await updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: avatarUrl,
    });
    setUser({ ...user, displayName: name, photoURL: avatarUrl } as FirebaseUser);
  }, [configured, user]);

  const logout = useCallback(async () => {
    if (!configured) return;
    const { auth } = initFirebase();
    await firebaseSignOut(auth);
  }, [configured]);

  return (
    <AuthContext.Provider value={{ user, loading, loginAnonymously, updateDisplayName, logout, isConfigured: configured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};