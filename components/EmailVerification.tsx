
import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { Tagline } from '../App';

interface EmailVerificationProps {
  email: string;
  correctCode: string;
  onVerified: () => void;
  onResend: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ email, correctCode, onVerified, onResend }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(false);

  const handleInput = (index: number, value: string) => {
    setError(false);
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length === 4) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        if (enteredCode === correctCode) {
          onVerified();
        } else {
          setError(true);
        }
      }, 1200);
    }
  };

  const handleResendClick = () => {
    setIsResending(true);
    setError(false);
    setCode(['', '', '', '']);
    onResend();
    setTimeout(() => setIsResending(false), 2000);
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
                We've sent a 4-digit verification code to
              </p>
              <p className="text-base text-white font-black underline underline-offset-8 decoration-brand-pink/50">
                {email}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`flex justify-center gap-4 ${error ? 'animate-bounce' : ''}`}>
            {code.map((digit, idx) => (
              <input 
                key={idx}
                id={`code-${idx}`}
                type="number"
                value={digit}
                onChange={(e) => handleInput(idx, e.target.value)}
                className={`w-16 h-20 bg-white border rounded-2xl text-2xl font-black text-center focus:outline-none transition-all ${
                  error 
                  ? 'border-red-500 text-red-500 ring-4 ring-red-500/10' 
                  : 'border-white/10 focus:ring-4 focus:ring-brand-pink text-black shadow-inner'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-red-400 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14} /> The code you entered is incorrect.
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
          <CheckCircle2 size={20} className="text-white shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/90 font-black uppercase tracking-[0.1em] leading-relaxed">
            Note: For this demo, look for the code in the system notification at the top of your screen.
          </p>
        </div>
        
        <div className="pt-6">
          <Tagline />
        </div>
      </div>
    </div>
  );
};
