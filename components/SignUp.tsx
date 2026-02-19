import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Logo } from './Logo';
import { Tagline } from '../App';
import { clerkAppearance } from '../clerkTheme';

interface SignUpProps {
  onSignUp: () => void;
  onSwitchToLogin?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  return (
    <div className="min-h-screen bg-brand-purple flex flex-col p-8 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col justify-center max-sm mx-auto w-full space-y-8">
        <header className="space-y-4">
          <Logo variant="full" size="md" color="pink" />
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-black tracking-tight leading-tight pt-4 text-white">
              Create your <br /><span className="text-brand-pink">Secure Account</span>
            </h2>
            <p className="text-sm font-sans text-white font-medium">
              Your data is processed according to clinical privacy standards.
            </p>
          </div>
        </header>

        <div className="flex justify-center">
          <ClerkSignUp
            appearance={clerkAppearance}
            signInUrl=""
            forceRedirectUrl=""
            fallbackRedirectUrl=""
          />
        </div>

        <div className="space-y-10 text-center">
          <p className="text-xs font-sans text-white">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-white font-black hover:underline transition-all"
            >
              Sign In
            </button>
          </p>
          <Tagline />
        </div>
      </div>
    </div>
  );
};
