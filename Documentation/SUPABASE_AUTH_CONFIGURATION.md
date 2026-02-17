# Supabase Authentication Configuration Guide

## 🔐 Complete Setup for Email Verification + Phone 2FA

This guide shows you how to configure Supabase to enable:
1. ✅ Email verification on signup
2. ✅ Phone/SMS two-factor authentication
3. ✅ Password reset emails
4. ✅ Custom email templates

---

## 📋 Prerequisites

- Supabase project created
- Access to Supabase Dashboard
- Twilio account (for SMS/Phone 2FA)

---

## 🚀 Step-by-Step Configuration

### Part 1: Email Provider Setup (5 minutes)

#### 1. Enable Email Provider

1. Go to: https://supabase.com/dashboard
2. Select your **WISE** project
3. Navigate to: **Authentication** → **Providers**
4. Find **Email** provider
5. Toggle **Enable Email provider** → **ON**
6. Click **Save**

#### 2. Configure Email Settings

1. In the same screen, scroll to **Email Auth Settings**
2. Set these options:

```
✅ Enable email confirmations: ON
✅ Secure email change: ON  
✅ Double confirm email changes: ON (recommended)
```

3. **Confirmation Email Settings:**
   - **Confirm email:** `ON`
   - **Confirmation URL:** `{{ .SiteURL }}/auth/verify-email?token={{ .TokenHash }}`

4. Click **Save**

---

### Part 2: Email Templates (10 minutes)

#### 1. Customize Signup Confirmation Email

1. Navigate to: **Authentication** → **Email Templates**
2. Select **Confirm signup**
3. Replace with this template:

```html
<h2>Welcome to WISE!</h2>
<p>Hi {{ .Email }},</p>
<p>Thanks for signing up for WISE - your personal women's health companion.</p>
<p>Please verify your email address to complete your registration:</p>
<p><a href="{{ .ConfirmationURL }}">Verify Email Address</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>This link expires in 24 hours.</p>
<br>
<p>If you didn't create this account, you can safely ignore this email.</p>
<p>Best,<br>The WISE Team</p>
```

4. Click **Save**

#### 2. Customize Password Reset Email

1. Select **Reset password**
2. Replace with this template:

```html
<h2>Reset Your WISE Password</h2>
<p>Hi {{ .Email }},</p>
<p>We received a request to reset your password for your WISE account.</p>
<p>Click the link below to choose a new password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>Or copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>This link expires in 1 hour.</p>
<br>
<p>If you didn't request this, you can safely ignore this email. Your password won't change.</p>
<p>Best,<br>The WISE Team</p>
```

3. Click **Save**

---

### Part 3: Site URL Configuration (2 minutes)

#### 1. Set Site URL

1. Navigate to: **Authentication** → **URL Configuration**
2. Set **Site URL:**
   - Development: `http://localhost:3001`
   - Production: `https://your-wise-app.com`

#### 2. Set Redirect URLs

Add these **Redirect URLs** (one per line):

```
http://localhost:3001/auth/verify-email
http://localhost:3001/auth/reset-password
http://localhost:3001/auth/callback
https://your-wise-app.com/auth/verify-email
https://your-wise-app.com/auth/reset-password
https://your-wise-app.com/auth/callback
```

3. Click **Save**

---

### Part 4: Phone/SMS Provider Setup (15 minutes)

#### 1. Get Twilio Credentials

**First, create a Twilio account:**

1. Go to: https://www.twilio.com/try-twilio
2. Sign up for free trial (free $15 credit)
3. Verify your email and phone
4. Complete Twilio setup wizard

**Get your credentials:**

1. Go to Twilio Console: https://console.twilio.com/
2. Copy these values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)
3. Get a phone number:
   - Click **Phone Numbers** → **Manage** → **Buy a number**
   - Choose a number with **SMS** capability
   - Buy number (free on trial)
4. Copy your **Twilio phone number** (format: +12345678901)

#### 2. Enable Phone Provider in Supabase

1. Back to Supabase Dashboard
2. Navigate to: **Authentication** → **Providers**
3. Find **Phone** provider
4. Toggle **Enable Phone provider** → **ON**

#### 3. Configure Twilio Integration

In the Phone provider settings, add:

```
Twilio Account SID: AC... (your Account SID)
Twilio Auth Token: your-auth-token
Twilio Phone Number: +1... (your Twilio number)
```

#### 4. Phone Auth Settings

Set these options:

```
✅ Enable phone confirmations: ON
✅ Phone OTP length: 6
✅ Phone OTP expiry: 60 (seconds)
```

5. Click **Save**

#### 5. SMS Template (Optional)

Customize the SMS message template:

1. In Phone provider settings, find **SMS Template**
2. Default template:
   ```
   Your WISE verification code is: {{ .Code }}
   ```

3. Or customize:
   ```
   WISE: Your verification code is {{ .Code }}. Valid for 1 minute. Do not share this code.
   ```

4. Click **Save**

---

### Part 5: Security Settings (5 minutes)

#### 1. Rate Limiting (Prevent Abuse)

1. Navigate to: **Authentication** → **Rate Limits**
2. Set recommended limits:

```
Email signups per hour: 10
Password resets per hour: 5
SMS sends per hour: 5
```

3. Click **Save**

#### 2. Password Requirements

1. Navigate to: **Authentication** → **Policies**
2. Set password requirements:

```
Minimum password length: 8
Require uppercase: ON
Require lowercase: ON
Require numbers: ON
Require special characters: OFF (optional)
```

3. Click **Save**

---

## 🧪 Testing Your Configuration

### Test Email Verification

1. Start your WISE app: `npm run dev`
2. Go to signup page
3. Create a new account with your email
4. Check your email inbox
5. Click verification link
6. Should redirect to your app and verify email ✅

### Test Phone 2FA

1. Sign in to your account
2. Go to Security Settings (or wherever you put 2FA setup)
3. Click "Enable 2FA"
4. Enter your phone number
5. Receive SMS code (check phone)
6. Enter code
7. 2FA should be enabled ✅

### Test 2FA Login

1. Sign out
2. Sign in with email/password
3. Should prompt for SMS code
4. Check phone for code
5. Enter code
6. Should sign in successfully ✅

---

## 🐛 Troubleshooting

### Email Not Sending

**Issue:** Users not receiving signup confirmation emails

**Solutions:**
1. Check **Authentication** → **Email Templates** are enabled
2. Verify **Site URL** is correct
3. Check spam/junk folder
4. Try with different email provider (Gmail, etc.)
5. Check Supabase logs: **Logs** → **Auth Logs**

**Common Causes:**
- Site URL mismatch
- Email provider blocking
- Template errors

---

### SMS Not Sending

**Issue:** Users not receiving SMS verification codes

**Solutions:**
1. Verify Twilio credentials are correct
2. Check Twilio phone number is correct format (+1...)
3. Make sure phone number has SMS capability
4. Check Twilio console for error logs
5. Verify you have Twilio credits

**For Twilio Trial:**
- Only verified phone numbers can receive SMS
- Verify test numbers in Twilio Console first

**Check Twilio Logs:**
1. Go to: https://console.twilio.com/us1/monitor/logs/sms
2. Look for failed messages
3. Check error codes

**Common Error Codes:**
- `21211`: Invalid phone number
- `21408`: Permission denied (unverified number on trial)
- `21606`: Phone not capable of SMS

---

### 2FA Code Invalid

**Issue:** Verification code not working

**Solutions:**
1. Make sure code is entered within 60 seconds
2. Check for typos (zeros vs letter O)
3. Request new code
4. Verify phone number format is correct (+1...)
5. Check Supabase Auth logs

---

### Redirect URL Issues

**Issue:** After email verification, redirects to wrong page

**Solutions:**
1. Verify **Redirect URLs** include your callback URLs
2. Check **Site URL** matches your domain
3. For localhost, use `http://localhost:3001` (not 127.0.0.1)
4. Make sure URL matches exactly (no trailing slash if not configured)

---

## 📊 Environment Variables

Make sure your `.env.local` has:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL (for email links)
VITE_SITE_URL=http://localhost:3001  # or production URL
```

---

## 🔐 Security Best Practices

### Email Security

✅ **DO:**
- Use email confirmation for all signups
- Require email verification before full access
- Use secure email templates (no sensitive data)
- Set reasonable rate limits

❌ **DON'T:**
- Allow unverified users full access
- Include passwords in emails
- Allow unlimited email sends

### Phone/SMS Security

✅ **DO:**
- Use phone confirmation for all enrollments
- Rate limit SMS sends (prevent abuse)
- Use short-lived codes (60 seconds)
- Format phone numbers consistently (E.164)

❌ **DON'T:**
- Store plain text verification codes
- Allow unlimited SMS sends
- Accept invalid phone formats

### Password Security

✅ **DO:**
- Enforce strong password requirements
- Use secure password reset flow
- Expire reset links (1 hour)
- Hash passwords (Supabase does this)

❌ **DON'T:**
- Send passwords via email
- Allow weak passwords
- Store passwords in plain text

---

## 💰 Cost Considerations

### Supabase Costs

**Free Tier:**
- 50,000 monthly active users
- Unlimited email sends
- Perfect for MVP/testing

**Pro Tier ($25/mo):**
- Required for production
- Better support
- More auth features

### Twilio Costs

**Free Trial:**
- $15 credit
- ~500 SMS messages
- Verified numbers only

**Production:**
- ~$0.0075 per SMS (US)
- ~$1 per month for phone number
- 1,000 SMS = ~$8

**Estimate for 1,000 users:**
- If 50% enable 2FA = 500 users
- If each logs in 10x/month = 5,000 SMS
- Cost: ~$40/month for SMS

---

## ✅ Configuration Checklist

Before going live:

### Email
- [ ] Email provider enabled
- [ ] Email confirmations required
- [ ] Signup template customized
- [ ] Password reset template customized
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] Tested signup flow
- [ ] Tested password reset

### Phone/SMS
- [ ] Twilio account created
- [ ] Twilio credentials added to Supabase
- [ ] Phone provider enabled
- [ ] Phone confirmations required
- [ ] SMS template customized
- [ ] Tested phone enrollment
- [ ] Tested 2FA login flow
- [ ] Verified Twilio billing setup

### Security
- [ ] Rate limits configured
- [ ] Password requirements set
- [ ] Auth logs reviewed
- [ ] Error handling tested

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [E.164 Phone Format](https://www.twilio.com/docs/glossary/what-e164)

---

**Configuration Time:** ~30-40 minutes  
**Difficulty:** ⭐⭐ Moderate  
**Status:** Follow this guide step-by-step!

🎉 **Once configured, your WISE app will have enterprise-grade authentication!**
