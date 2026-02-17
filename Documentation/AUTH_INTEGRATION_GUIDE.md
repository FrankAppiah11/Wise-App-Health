# Quick Auth Integration Guide

## 🚀 Get Email Verification + Phone 2FA Running

### Step 1: Install Auth Files (Already Done! ✅)

Files created:
```
services/authService.ts              ✅ Complete auth logic
contexts/AuthContext.tsx             ✅ Auth state management  
components/auth/SignupForm.tsx       ✅ Signup with email verification
components/auth/LoginForm.tsx        ✅ Login with 2FA support
components/auth/TwoFactorSetup.tsx   ✅ Enable 2FA
```

---

### Step 2: Configure Supabase (30 minutes)

Follow the **complete guide**: `SUPABASE_AUTH_CONFIGURATION.md`

**Quick checklist:**
1. ✅ Enable Email provider in Supabase
2. ✅ Set Site URL and Redirect URLs
3. ✅ Create Twilio account (for SMS)
4. ✅ Add Twilio credentials to Supabase
5. ✅ Enable Phone provider
6. ✅ Test email and SMS

---

### Step 3: Wrap App with AuthProvider (2 minutes)

**Edit `App.tsx`:**

```typescript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your existing app */}
    </AuthProvider>
  );
}
```

---

### Step 4: Create Auth Page (5 minutes)

**Create `pages/Auth.tsx`:**

```typescript
import React, { useState } from 'react';
import SignupForm from '../components/auth/SignupForm';
import LoginForm from '../components/auth/LoginForm';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 flex items-center justify-center p-6">
      {mode === 'login' ? (
        <LoginForm
          onSuccess={() => window.location.href = '/'}
          onSwitchToSignup={() => setMode('signup')}
        />
      ) : (
        <SignupForm
          onSuccess={() => setMode('login')}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </div>
  );
};
```

---

### Step 5: Add Routing (3 minutes)

**Update your router:**

```typescript
import { AuthPage } from './pages/Auth';

// In your router config:
<Route path="/auth" element={<AuthPage />} />
<Route path="/auth/verify-email" element={<EmailVerified />} />
```

---

### Step 6: Protect Your Routes (5 minutes)

**Create Protected Route wrapper:**

```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

// Use it:
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

### Step 7: Add 2FA Setup to Settings (5 minutes)

**In your Settings/Profile page:**

```typescript
import { useAuth } from '../contexts/AuthContext';
import TwoFactorSetup from '../components/auth/TwoFactorSetup';

function Settings() {
  const { has2FAEnabled } = useAuth();
  const [showSetup, setShowSetup] = useState(false);

  return (
    <div>
      {/* Other settings */}
      
      <div className="space-y-4">
        <h3>Security</h3>
        
        {!has2FAEnabled ? (
          <button onClick={() => setShowSetup(true)}>
            Enable Two-Factor Authentication
          </button>
        ) : (
          <p>✅ 2FA Enabled</p>
        )}
      </div>

      {showSetup && (
        <TwoFactorSetup
          onComplete={() => {
            setShowSetup(false);
            // Refresh auth state
          }}
          onCancel={() => setShowSetup(false)}
        />
      )}
    </div>
  );
}
```

---

### Step 8: Update Database Service (10 minutes)

**Replace anonymous IDs with user IDs:**

**Edit `services/db.ts`:**

```typescript
import { supabase } from '../supabaseClient';
import authService from './authService';

// OLD: getAnonymousId()
// NEW: getUserId()

export async function getUserId(): Promise<string> {
  const user = await authService.getCurrentUser();
  
  if (user) {
    return user.id; // Use authenticated user ID
  }
  
  // Fallback to anonymous for non-auth users
  return getAnonymousId();
}

// Update all functions to use getUserId()
export async function loadProfile(): Promise<UserProfile | null> {
  const userId = await getUserId();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId) // Use user_id instead of anonymous_id
    .single();
  
  // ...
}
```

---

### Step 9: Update Database Schema (IMPORTANT!)

**Add user_id column to tables:**

```sql
-- Run in Supabase SQL Editor

-- Add user_id to profiles
ALTER TABLE profiles 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add user_id to symptom_logs
ALTER TABLE symptom_logs 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add user_id to cycle_tracking
ALTER TABLE cycle_tracking 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update RLS policies to use user_id
CREATE POLICY "Users can only access own data"
ON profiles FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can only access own symptom logs"
ON symptom_logs FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can only access own cycle data"
ON cycle_tracking FOR ALL
USING (auth.uid() = user_id);
```

---

## 🎯 User Flow Examples

### New User Signup Flow

```
1. User visits /auth
   ↓
2. Clicks "Create Account"
   ↓
3. Fills form: email, password, name
   ↓
4. Submits → Supabase sends verification email
   ↓
5. Sees "Check Your Email" screen
   ↓
6. Checks email, clicks verification link
   ↓
7. Redirected to /auth/verify-email
   ↓
8. Sees "Email Verified!" message
   ↓
9. Clicks "Sign In"
   ↓
10. Enters email/password
    ↓
11. Signed in! → Redirected to dashboard
```

### Existing User Login with 2FA

```
1. User visits /auth
   ↓
2. Enters email/password
   ↓
3. System checks if 2FA enabled
   ↓
4. YES → Shows "Enter Code" screen
   ↓
5. Sends SMS to user's phone
   ↓
6. User checks phone, gets code: "123456"
   ↓
7. Enters code
   ↓
8. Verified! → Signed in → Dashboard
```

### Enable 2FA Flow

```
1. User goes to Settings
   ↓
2. Clicks "Enable 2FA"
   ↓
3. Sees benefits screen
   ↓
4. Clicks "Get Started"
   ↓
5. Enters phone number
   ↓
6. Clicks "Send Code"
   ↓
7. Receives SMS: "654321"
   ↓
8. Enters code
   ↓
9. Verified! → 2FA enabled ✅
```

---

## ✅ Testing Checklist

### Email Verification
- [ ] Signup creates account
- [ ] Email sent to inbox
- [ ] Click link verifies email
- [ ] Can sign in after verification
- [ ] Can resend verification email

### Phone 2FA
- [ ] Can enroll phone number
- [ ] SMS code received
- [ ] Code verifies phone
- [ ] 2FA required on next login
- [ ] Can disable 2FA

### Security
- [ ] Can't sign in with unverified email
- [ ] Invalid 2FA code rejected
- [ ] Expired codes don't work
- [ ] Rate limiting works

---

## 🐛 Common Issues

### "Email not verified"
**Solution:** User must click link in email before signing in

### "Invalid phone number"
**Solution:** Use E.164 format: +12345678901

### "SMS not received"
**Solution:** 
1. Check Twilio trial limits
2. Verify phone number in Twilio Console
3. Check Twilio logs for errors

### "Redirect URL not allowed"
**Solution:** Add URL to Supabase Auth → URL Configuration

---

## 📱 Next Features to Add

### Email Features
- [ ] Email change with verification
- [ ] Welcome email after verification
- [ ] Security alert emails

### Phone Features
- [ ] Backup codes for 2FA
- [ ] Multiple trusted devices
- [ ] Phone number change

### Security Features
- [ ] Session management
- [ ] Login history
- [ ] Suspicious activity alerts
- [ ] Account recovery

---

**Setup Time:** 1-2 hours (including Supabase config)  
**Difficulty:** ⭐⭐ Moderate  
**Result:** Enterprise-grade authentication! 🔐

**Next:** Follow `SUPABASE_AUTH_CONFIGURATION.md` to configure Supabase!
