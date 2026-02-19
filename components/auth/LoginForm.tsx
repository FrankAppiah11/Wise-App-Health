import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { clerkAppearance } from '../../clerkTheme';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onNeedsEmailVerification?: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
}) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-black text-white">Welcome Back</h2>
        <p className="text-sm text-white/60 font-medium mt-2">Sign in to continue to WISE</p>
      </div>

      <div className="flex justify-center">
        <SignIn
          appearance={clerkAppearance}
          signUpUrl=""
          forceRedirectUrl=""
          fallbackRedirectUrl=""
        />
      </div>

      <div className="text-center pt-6">
        <p className="text-sm text-white/60 font-medium">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-brand-pink font-bold hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
