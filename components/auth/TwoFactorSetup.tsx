/**
 * Two-Factor Authentication Setup Component
 * 
 * Allows users to enable phone-based 2FA
 */

import React, { useState } from 'react';
import { Shield, Phone, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import authService from '../../services/authService';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<'intro' | 'phone' | 'verify' | 'success'>('intro');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnrollPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authService.isValidPhone(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = authService.formatPhoneNumber(phone);
      const result = await authService.enrollPhone2FA(formattedPhone);

      if (result.success) {
        setStep('verify');
      } else {
        setError(result.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Phone enrollment error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = authService.formatPhoneNumber(phone);
      const result = await authService.verifyPhone2FA({
        phone: formattedPhone,
        token: verificationCode,
      });

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Intro Screen
  if (step === 'intro') {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto">
            <Shield size={48} className="text-brand-purple" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-black text-brand-purple">Enable Two-Factor Authentication</h2>
            <p className="text-sm text-brand-purple/70 font-medium">
              Add an extra layer of security to your account
            </p>
          </div>

          <div className="bg-brand-grey/30 p-6 rounded-2xl text-left space-y-4">
            <div className="flex items-start gap-3">
              <Lock size={20} className="text-brand-purple shrink-0 mt-1" />
              <div>
                <p className="font-bold text-brand-purple text-sm">Enhanced Security</p>
                <p className="text-xs text-brand-purple/60 mt-1">Protect your health data with SMS verification</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-brand-purple shrink-0 mt-1" />
              <div>
                <p className="font-bold text-brand-purple text-sm">SMS Verification</p>
                <p className="text-xs text-brand-purple/60 mt-1">Receive a code via text each time you sign in</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-brand-grey/30 text-brand-purple rounded-2xl font-bold text-sm hover:bg-brand-grey/50 transition-all"
            >
              Maybe Later
            </button>
            <button
              onClick={() => setStep('phone')}
              className="flex-1 px-6 py-3 bg-brand-purple text-white rounded-2xl font-bold text-sm hover:bg-brand-pink hover:text-brand-black transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phone Entry Screen
  if (step === 'phone') {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-black text-brand-purple">Enter Your Phone Number</h2>
          <p className="text-sm text-brand-purple/60 font-medium mt-2">
            We'll send you a verification code
          </p>
        </div>

        <form onSubmit={handleEnrollPhone} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-12 pr-4 py-4 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none font-medium text-lg tracking-wider"
                placeholder="(555) 123-4567"
                autoFocus
              />
            </div>
            <p className="text-xs text-brand-purple/50 font-medium">
              U.S. phone numbers only. Standard SMS rates may apply.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="flex-1 px-6 py-3 bg-brand-grey/30 text-brand-purple rounded-2xl font-bold text-sm hover:bg-brand-grey/50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className="flex-1 px-6 py-3 bg-brand-purple text-white rounded-2xl font-bold text-sm hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Verification Screen
  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-black text-brand-purple">Enter Verification Code</h2>
          <p className="text-sm text-brand-purple/60 font-medium mt-2">
            Code sent to {phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
              6-Digit Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-6 py-4 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none text-center text-2xl font-bold tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full px-6 py-4 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Enable 2FA'
            )}
          </button>
        </form>
      </div>
    );
  }

  // Success Screen
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-black text-brand-purple">2FA Enabled!</h2>
          <p className="text-sm text-brand-purple/70 font-medium">
            Your account is now more secure
          </p>
        </div>

        <div className="bg-brand-purple/5 p-6 rounded-2xl">
          <p className="text-xs text-brand-purple/70 font-medium">
            From now on, you'll receive a verification code via SMS each time you sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
