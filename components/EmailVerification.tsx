
import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { Tagline } from '../App';
import authService from '../services/authService';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onVerified, onResend }) => {
  const CODE_LENGTH = 8;
  const [code, setCode] = useState(Array(8).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (index: number, value: string) => {
    setError('');
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== CODE_LENGTH) return;

    setIsVerifying(true);
    setError('');

    try {
      const { error: verifyError } = await (await import('../supabaseClient')).supabase.auth.verifyOtp({
        email,
        token: enteredCode,
        type: 'signup',
      });

      if (verifyError) {
        setError(verifyError.message || 'Invalid verification code. Please try again.');
      } else {
        onVerified();
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendClick = async () => {
    setIsResending(true);
    setError('');
    setCode(Array(CODE_LENGTH).fill(''));

    try {
      const result = await authService.resendEmailVerification(email);
      if (!result.success) {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
      onResend();
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend verification email.');
    } finally {
      setTimeout(() => setIsResending(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-purple flex flex-col p-8 animate-in slide-in-from-right-10 duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-10">
        <div className="text-center space-y-6">
          <Logo variant="full" size="md" className="mx-auto" color="pink" />
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-serif font-black text-white leading-tight">Verify Email</h2>
            <div className="space-y-2">
              <p className="text-sm text-white/80 font-bold leading-relaxed">
                We've sent a verification code to
              </p>
              <p className="text-base text-white font-black underline underline-offset-8 decoration-brand-pink/50">
                {email}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`flex justify-center gap-2 ${error ? 'animate-bounce' : ''}`}>
            {code.map((digit, idx) => (
              <input 
                key={idx}
                id={`code-${idx}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleInput(idx, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-10 h-14 bg-white border rounded-xl text-xl font-black text-center focus:outline-none transition-all ${
                  error 
                  ? 'border-red-500 text-red-500 ring-4 ring-red-500/10' 
                  : 'border-white/10 focus:ring-4 focus:ring-brand-pink text-black shadow-inner'
                }`}
                maxLength={1}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-red-400 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}

          <button 
            onClick={handleVerify}
            disabled={isVerifying || !code.every(d => d !== '')}
            className="w-full py-5 bg-brand-pink text-brand-black font-sans font-black rounded-3xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 hover:bg-white"
          >
            {isVerifying ? <Loader2 className="animate-spin text-brand-purple" /> : <CheckCircle2 size={20} />}
            {isVerifying ? "Verifying..." : "Confirm Verification"}
          </button>

          <button 
            onClick={handleResendClick}
            disabled={isResending}
            className="w-full py-4 bg-white/10 text-white/60 font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:text-white transition-all disabled:opacity-30"
          >
            {isResending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
            {isResending ? "Sending New Code..." : "I didn't receive a code"}
          </button>
        </div>

        <div className="p-6 bg-brand-sky/20 border border-brand-sky/30 rounded-3xl flex gap-3 shadow-inner">
          <Mail size={20} className="text-white shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/90 font-black uppercase tracking-[0.1em] leading-relaxed">
            Check your email inbox (and spam folder) for the verification code from WISE.
          </p>
        </div>
        
        <div className="pt-6">
          <Tagline />
        </div>
      </div>
    </div>
  );
};
