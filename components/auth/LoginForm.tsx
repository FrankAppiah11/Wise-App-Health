/**
 * Login Form Component
 * 
 * Features:
 * - Email/password login
 * - 2FA verification flow
 * - Password reset link
 * - WISE branding
 */

import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle, Shield } from 'lucide-react';
import authService from '../../services/authService';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onNeedsEmailVerification?: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToSignup,
  onNeedsEmailVerification,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({ general: 'Please enter email and password' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signIn(formData);

      if (result.success) {
        // Check if user has 2FA enabled
        const user = await authService.getCurrentUser();
        if (user?.phone && user?.phone_confirmed_at) {
          // User has 2FA - show 2FA verification
          setUserPhone(user.phone);
          setShow2FA(true);
          
          // Send 2FA code
          await authService.send2FACode(user.phone);
        } else {
          // No 2FA - login complete
          onSuccess?.();
        }
      } else {
        if (result.needsEmailVerification) {
          onNeedsEmailVerification?.(formData.email);
        } else {
          setErrors({ general: result.error || 'Login failed' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setErrors({ twoFactor: 'Please enter the 6-digit code' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.verify2FACode(userPhone, twoFactorCode);

      if (result.success) {
        onSuccess?.();
      } else {
        setErrors({ twoFactor: result.error || 'Invalid code' });
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      setErrors({ twoFactor: 'Verification failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend2FA = async () => {
    setIsLoading(true);
    try {
      await authService.send2FACode(userPhone);
      alert('New code sent to your phone!');
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // 2FA Verification Screen
  if (show2FA) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-brand-purple" />
          </div>
          <h2 className="text-2xl font-serif font-black text-brand-purple">Two-Factor Authentication</h2>
          <p className="text-sm text-brand-purple/60 font-medium mt-2">
            Enter the code sent to {userPhone}
          </p>
        </div>

        <form onSubmit={handleVerify2FA} className="space-y-6">
          {errors.twoFactor && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{errors.twoFactor}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
              6-Digit Code
            </label>
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-6 py-4 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none text-center text-2xl font-bold tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || twoFactorCode.length !== 6}
            className="w-full px-6 py-4 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResend2FA}
              disabled={isLoading}
              className="text-sm text-brand-pink font-bold hover:underline disabled:opacity-50"
            >
              Resend Code
            </button>
            <br />
            <button
              type="button"
              onClick={() => setShow2FA(false)}
              className="text-sm text-brand-purple/60 font-medium hover:underline"
            >
              Use different account
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Login Screen
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-black text-brand-purple">Welcome Back</h2>
        <p className="text-sm text-brand-purple/60 font-medium mt-2">Sign in to continue to WISE</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{errors.general}</p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none font-medium"
              placeholder="you@example.com"
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none font-medium"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <a href="/auth/forgot-password" className="text-sm text-brand-pink font-bold hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Switch to Signup */}
        <div className="text-center pt-4">
          <p className="text-sm text-brand-purple/60 font-medium">
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
      </form>
    </div>
  );
};

export default LoginForm;
