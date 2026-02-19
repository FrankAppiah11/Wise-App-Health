import React, { useState } from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Logo } from './Logo';
import { Tagline } from '../App';
import { LegalLinks } from './LegalDocuments';
import { AlertCircle } from 'lucide-react';
import { clerkAppearance } from '@/clerkTheme';

interface SignUpProps {
  onSignUp: () => void;
  onSwitchToLogin?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [agreed, setAgreed] = useState(false);

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

        <LegalLinks agreed={agreed} onToggle={() => setAgreed(!agreed)} />

        {agreed ? (
          <div className="flex justify-center">
            <ClerkSignUp
              appearance={clerkAppearance}
              signInUrl=""
              forceRedirectUrl=""
              fallbackRedirectUrl=""
            />
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-3">
            <AlertCircle size={18} className="text-white/40 shrink-0 mt-0.5" />
            <p className="text-xs text-white/40 font-bold">
              Please accept the Privacy Policy and Terms of Service above to create your account.
            </p>
          </div>
        )}

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

        <div className="pt-8 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-start gap-3 mb-2">
              <AlertCircle size={14} className="text-white/60 shrink-0 mt-0.5" />
              <p className="text-[10px] font-sans font-black text-white uppercase tracking-widest">Medical Disclaimer</p>
            </div>
            <p className="text-[9px] font-sans text-white leading-relaxed text-justify font-medium">
              The WISE application is designed for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
