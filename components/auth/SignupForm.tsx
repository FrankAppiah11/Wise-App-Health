/**
 * Signup Form Component
 *
 * Authentication is now handled by Clerk's <SignUp /> component.
 * This file re-exports the main SignUp for backward compatibility.
 */

import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { clerkAppearance } from '@/clerkTheme';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
}) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-black text-brand-purple">Create Account</h2>
        <p className="text-sm text-brand-purple/60 font-medium mt-2">Join WISE to track your health</p>
      </div>

      <div className="flex justify-center">
        <ClerkSignUp
          appearance={clerkAppearance}
          signInUrl=""
          forceRedirectUrl=""
          fallbackRedirectUrl=""
        />
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-brand-purple/60 font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-brand-pink font-bold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
