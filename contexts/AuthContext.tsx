/**
 * Auth Context - Clerk Integration
 *
 * Wraps Clerk's hooks to provide a consistent auth interface
 * throughout the WISE app.
 */

import React, { createContext, useContext } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';

interface AuthContextType {
  userId: string | null;
  fullName: string | null;
  email: string | null;
  imageUrl: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn, isLoaded: isAuthLoaded } = useClerkAuth();
  const { signOut: clerkSignOut } = useClerk();

  const isLoading = !isUserLoaded || !isAuthLoaded;

  const handleSignOut = async () => {
    await clerkSignOut();
  };

  return (
    <AuthContext.Provider
      value={{
        userId: user?.id ?? null,
        fullName: user?.fullName ?? null,
        email: user?.primaryEmailAddress?.emailAddress ?? null,
        imageUrl: user?.imageUrl ?? null,
        isAuthenticated: !!isSignedIn,
        isLoading,
        signOut: handleSignOut,
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
