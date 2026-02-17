import React, { useState } from 'react';
import { Logo } from './Logo';
import { Tagline } from '../App';
import { Mail, Lock, User, ChevronRight, ShieldCheck, Loader2, AlertCircle, Phone } from 'lucide-react';
import authService from '../services/authService';

interface SignUpProps {
  onSignUp: (name: string, email: string, phone: string) => void;
  onSwitchToLogin?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setError('');

    const passwordCheck = authService.validatePassword(password);
    if (!passwordCheck.isValid) {
      setError(passwordCheck.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signUp({
        email,
        password,
        fullName: name,
        phone: phone || undefined,
      });

      if (result.success) {
        onSignUp(name, email, phone);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-purple flex flex-col p-8 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col justify-center max-sm mx-auto w-full space-y-10">
        <header className="space-y-4">
          <Logo variant="full" size="md" color="pink" />
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-black tracking-tight leading-tight pt-4 text-white">Create your <br/><span className="text-brand-pink">Secure Account</span></h2>
            <p className="text-sm font-sans text-white font-medium">Your data is processed according to clinical privacy standards.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-300 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-sans font-black text-white uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple transition-colors" size={18} />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-white border border-white/10 rounded-2xl py-4 font-sans pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all placeholder:text-brand-purple/40 text-brand-black font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-sans font-black text-white uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple transition-colors" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-white border border-white/10 rounded-2xl py-4 font-sans pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all placeholder:text-brand-purple/40 text-brand-black font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-sans font-black text-white uppercase tracking-widest ml-1">Phone Number <span className="opacity-60">(optional)</span></label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple transition-colors" size={18} />
              <input 
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(555) 000-0000"
                className="w-full bg-white border border-white/10 rounded-2xl py-4 font-sans pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all placeholder:text-brand-purple/40 text-brand-black font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-sans font-black text-white uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple transition-colors" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-white/10 rounded-2xl py-4 font-sans pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all placeholder:text-brand-purple/40 text-brand-black font-bold"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <button 
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all bg-white border-transparent text-brand-black`}
            >
              {agreed && <ShieldCheck size={12} className="text-brand-purple" />}
            </button>
            <p className="text-[10px] font-sans text-white leading-relaxed font-medium">
              I agree to the <span className="text-white underline underline-offset-2 font-black">Privacy Policy</span> and <span className="text-white underline underline-offset-2 font-black">Terms of Service</span>.
            </p>
          </div>

          <button 
            type="submit"
            disabled={!agreed || isLoading}
            className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-lg flex items-center justify-center gap-2 group transition-all active:scale-95 disabled:opacity-50 hover:bg-brand-pink"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Create Account <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="space-y-10 text-center">
          <p className="text-xs font-sans text-white">
            Already have an account?{' '}
            <button type="button" onClick={onSwitchToLogin} className="text-white font-black hover:underline transition-all">
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