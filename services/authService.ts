/**
 * WISE Authentication Service
 * 
 * Features:
 * - Email/password signup with verification
 * - Phone 2FA via SMS
 * - Session management
 * - Password reset
 * 
 * Supabase Auth Configuration Required:
 * 1. Enable Email Provider (Settings → Auth → Providers)
 * 2. Enable Phone Provider with Twilio (Settings → Auth → Providers)
 * 3. Configure email templates (Settings → Auth → Email Templates)
 * 4. Set Site URL and Redirect URLs
 */

import { supabase } from '../supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  age?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PhoneVerificationData {
  phone: string;
  token: string; // 6-digit code
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasVerifiedEmail: boolean;
  has2FAEnabled: boolean;
}

// ============================================================================
// SIGNUP & EMAIL VERIFICATION
// ============================================================================

/**
 * Sign up a new user with email verification
 */
export async function signUp(data: SignupData): Promise<{
  success: boolean;
  user?: User;
  error?: string;
  needsEmailVerification?: boolean;
}> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          age: data.age,
        },
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user account' };
    }

    // Check if email confirmation is required
    const needsEmailVerification = !authData.session;

    return {
      success: true,
      user: authData.user,
      needsEmailVerification,
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'An unexpected error occurred during signup' };
  }
}

/**
 * Resend email verification
 */
export async function resendEmailVerification(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, error: 'Failed to resend verification email' };
  }
}

/**
 * Verify email with token (called when user clicks link in email)
 */
export async function verifyEmail(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, error: 'Failed to verify email' };
  }
}

// ============================================================================
// LOGIN & LOGOUT
// ============================================================================

/**
 * Sign in with email and password
 */
export async function signIn(data: LoginData): Promise<{
  success: boolean;
  session?: Session;
  error?: string;
  needsEmailVerification?: boolean;
}> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      // Check if email not verified
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Please verify your email before signing in',
          needsEmailVerification: true,
        };
      }
      return { success: false, error: error.message };
    }

    if (!authData.session) {
      return { success: false, error: 'Failed to create session' };
    }

    return {
      success: true,
      session: authData.session,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'An unexpected error occurred during sign in' };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

// ============================================================================
// PHONE 2FA (Two-Factor Authentication)
// ============================================================================

/**
 * Enroll phone number for 2FA
 * Sends SMS with verification code
 */
export async function enrollPhone2FA(phone: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Update user metadata with phone
    const { data: user, error: updateError } = await supabase.auth.updateUser({
      phone,
    });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Supabase will automatically send SMS verification code
    return { success: true };
  } catch (error) {
    console.error('Phone enrollment error:', error);
    return { success: false, error: 'Failed to enroll phone number' };
  }
}

/**
 * Verify phone number with SMS code
 */
export async function verifyPhone2FA(data: PhoneVerificationData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      phone: data.phone,
      token: data.token,
      type: 'sms',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Phone verification error:', error);
    return { success: false, error: 'Failed to verify phone number' };
  }
}

/**
 * Send 2FA code to registered phone
 */
export async function send2FACode(phone: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Send 2FA code error:', error);
    return { success: false, error: 'Failed to send verification code' };
  }
}

/**
 * Verify 2FA code during login
 */
export async function verify2FACode(phone: string, code: string): Promise<{
  success: boolean;
  session?: Session;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.session) {
      return { success: false, error: 'Failed to create session' };
    }

    return {
      success: true,
      session: data.session,
    };
  } catch (error) {
    console.error('2FA verification error:', error);
    return { success: false, error: 'Failed to verify 2FA code' };
  }
}

/**
 * Disable 2FA for current user
 */
export async function disable2FA(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Remove phone from user metadata
    const { error } = await supabase.auth.updateUser({
      phone: undefined,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Disable 2FA error:', error);
    return { success: false, error: 'Failed to disable 2FA' };
  }
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to send password reset email' };
  }
}

/**
 * Update password (after reset or while logged in)
 */
export async function updatePassword(newPassword: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'Failed to update password' };
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<{
  session: Session | null;
  user: User | null;
}> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Get session error:', error);
      return { session: null, user: null };
    }

    return {
      session: data.session,
      user: data.session?.user ?? null,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, user: null };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get user error:', error);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Check if user has verified email
 */
export async function hasVerifiedEmail(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.email_confirmed_at != null;
}

/**
 * Check if user has 2FA enabled
 */
export async function has2FAEnabled(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.phone != null && user?.phone_confirmed_at != null;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (session: Session | null, user: User | null) => void
) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session, session?.user ?? null);
  });
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  fullName?: string;
  age?: number;
  phone?: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.fullName,
        age: updates.age,
      },
      phone: updates.phone,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Format phone number for Supabase
 * Requires E.164 format: +1234567890
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+1'): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (!phone.startsWith('+')) {
    return `${countryCode}${cleaned}`;
  }
  
  return `+${cleaned}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (US)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Signup & Email Verification
  signUp,
  resendEmailVerification,
  verifyEmail,
  
  // Login & Logout
  signIn,
  signOut,
  
  // Phone 2FA
  enrollPhone2FA,
  verifyPhone2FA,
  send2FACode,
  verify2FACode,
  disable2FA,
  
  // Password Reset
  sendPasswordResetEmail,
  updatePassword,
  
  // Session Management
  getCurrentSession,
  getCurrentUser,
  hasVerifiedEmail,
  has2FAEnabled,
  onAuthStateChange,
  
  // Profile
  updateUserProfile,
  
  // Utilities
  formatPhoneNumber,
  isValidEmail,
  isValidPhone,
  validatePassword,
};
