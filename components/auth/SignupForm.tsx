/**
 * Signup Form Component
 * 
 * Features:
 * - Email/password signup
 * - Email verification required
 * - Password strength validation
 * - WISE branding
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import authService from '../services/authService';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!authService.isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation
    const passwordValidation = authService.validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Age validation
    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 120)) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        age: formData.age ? parseInt(formData.age) : undefined,
      });

      if (result.success) {
        setEmailToVerify(formData.email);
        setShowSuccess(true);
        
        // Call onSuccess after showing message
        setTimeout(() => {
          onSuccess?.();
        }, 3000);
      } else {
        setErrors({ general: result.error || 'Signup failed' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const result = await authService.resendEmailVerification(emailToVerify);
      if (result.success) {
        alert('Verification email sent! Please check your inbox.');
      } else {
        alert(result.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-black text-brand-purple">Check Your Email!</h2>
            <p className="text-sm text-brand-purple/70 font-medium">
              We've sent a verification link to:
            </p>
            <p className="text-brand-purple font-bold">{emailToVerify}</p>
          </div>

          <div className="bg-brand-grey/30 p-6 rounded-2xl text-left space-y-3">
            <p className="text-xs font-bold text-brand-purple/80 uppercase tracking-wider">Next Steps:</p>
            <ol className="text-sm text-brand-purple/70 space-y-2 list-decimal list-inside font-medium">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Return here to sign in</li>
            </ol>
          </div>

          <button
            onClick={handleResendVerification}
            disabled={isLoading}
            className="text-sm text-brand-pink font-bold hover:underline disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Didn\'t receive email? Resend'}
          </button>

          <button
            onClick={onSwitchToLogin}
            className="w-full px-6 py-3 bg-brand-purple text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-brand-pink hover:text-brand-black transition-all"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-black text-brand-purple">Create Account</h2>
        <p className="text-sm text-brand-purple/60 font-medium mt-2">Join WISE to track your health</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{errors.general}</p>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Full Name *
          </label>
          <div className="relative">
            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all font-medium ${
                errors.fullName
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-brand-purple/20 focus:border-brand-pink'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Email Address *
          </label>
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all font-medium ${
                errors.email
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-brand-purple/20 focus:border-brand-pink'
              }`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
        </div>

        {/* Age (Optional) */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Age (Optional)
          </label>
          <div className="relative">
            <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all font-medium ${
                errors.age
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-brand-purple/20 focus:border-brand-pink'
              }`}
              placeholder="Your age"
              min="13"
              max="120"
            />
          </div>
          {errors.age && <p className="text-xs text-red-500 font-medium">{errors.age}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Password *
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all font-medium ${
                errors.password
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-brand-purple/20 focus:border-brand-pink'
              }`}
              placeholder="Create a strong password"
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
          <p className="text-xs text-brand-purple/50 font-medium">
            At least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-purple uppercase tracking-wider">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/40" />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all font-medium ${
                errors.confirmPassword
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-brand-purple/20 focus:border-brand-pink'
              }`}
              placeholder="Re-enter your password"
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Switch to Login */}
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
      </form>
    </div>
  );
};

export default SignupForm;
