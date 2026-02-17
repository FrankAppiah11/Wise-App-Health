/**
 * Auth Context Provider
 * 
 * Manages authentication state throughout the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasVerifiedEmail: boolean;
  has2FAEnabled: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVerifiedEmail, setHasVerifiedEmail] = useState(false);
  const [has2FAEnabled, setHas2FAEnabled] = useState(false);

  const refreshAuth = async () => {
    try {
      const { session: currentSession, user: currentUser } = await authService.getCurrentSession();
      setSession(currentSession);
      setUser(currentUser);

      if (currentUser) {
        setHasVerifiedEmail(currentUser.email_confirmed_at != null);
        setHas2FAEnabled(currentUser.phone != null && currentUser.phone_confirmed_at != null);
      } else {
        setHasVerifiedEmail(false);
        setHas2FAEnabled(false);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    refreshAuth().finally(() => setIsLoading(false));

    // Subscribe to auth changes
    const { data: subscription } = authService.onAuthStateChange((newSession, newUser) => {
      setSession(newSession);
      setUser(newUser);
      
      if (newUser) {
        setHasVerifiedEmail(newUser.email_confirmed_at != null);
        setHas2FAEnabled(newUser.phone != null && newUser.phone_confirmed_at != null);
      } else {
        setHasVerifiedEmail(false);
        setHas2FAEnabled(false);
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setHasVerifiedEmail(false);
    setHas2FAEnabled(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        hasVerifiedEmail,
        has2FAEnabled,
        signOut: handleSignOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
