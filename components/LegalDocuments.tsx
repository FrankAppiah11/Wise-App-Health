/**
 * WISE Legal Documents - Privacy Policy & Terms of Service
 * 
 * Branded in-app modal with full legal content
 * Consistent with WISE app features:
 * - Symptom tracking & clinical assessments
 * - Gemini AI integration
 * - PDF export
 * - Supabase auth (email verification + phone 2FA)
 * - Membership tiers
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Shield, FileText, ChevronDown, Lock, Heart, Brain, Phone, Mail, Database } from 'lucide-react';

type DocumentType = 'privacy' | 'terms';

interface LegalModalProps {
  document: DocumentType;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

// ============================================================================
// PRIVACY POLICY CONTENT
// ============================================================================

const PrivacyPolicy: React.FC = () => (
  <div className="space-y-8 text-brand-purple/80 font-medium text-sm leading-relaxed">

    <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-2xl p-5">
      <p className="text-xs font-black text-brand-purple uppercase tracking-widest mb-2">Last Updated: February 16, 2026</p>
      <p>WISE (Women Informed Strong Engaged) is committed to protecting your health data with the highest standards of privacy and security. This policy explains what we collect, how we use it, and the choices you have.</p>
    </div>

    {/* Section 1 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <Heart size={18} className="text-brand-pink shrink-0" />
        1. Who We Are
      </h3>
      <p>WISE is a women's reproductive health application developed under the clinical guidance of Dr. Leslie Appiah, MD. We are a digital health platform — <strong className="text-brand-purple">not a medical provider</strong> — and the information collected is used solely to support your health education and symptom awareness journey.</p>
      <p>For privacy inquiries, contact us at: <strong className="text-brand-purple">privacy@wisehealth.app</strong></p>
    </section>

    {/* Section 2 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <Database size={18} className="text-brand-pink shrink-0" />
        2. Information We Collect
      </h3>

      <div className="space-y-4">
        <div className="bg-white border border-brand-purple/10 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-black text-brand-purple uppercase tracking-wider">2.1 Account Information</p>
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>Full name and email address (required for account creation)</li>
            <li>Phone number (required only if you enable two-factor authentication)</li>
            <li>Age (optional, used to improve symptom assessments)</li>
            <li>Encrypted password (we never store plain-text passwords)</li>
          </ul>
        </div>

        <div className="bg-white border border-brand-purple/10 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-black text-brand-purple uppercase tracking-wider">2.2 Health & Symptom Data</p>
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>Symptom survey responses (pain levels, menstrual flow, mood, energy)</li>
            <li>Cycle tracking data (period start/end dates, cycle length)</li>
            <li>Assessment results and clinical triage outputs</li>
            <li>Medications and healthcare provider notes you enter</li>
            <li>Daily symptom log entries you create</li>
          </ul>
          <p className="text-xs text-brand-purple/60 mt-2 font-bold">⚠ This constitutes <em>sensitive health information</em> and is treated with the highest level of protection.</p>
        </div>

        <div className="bg-white border border-brand-purple/10 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-black text-brand-purple uppercase tracking-wider">2.3 Technical Data</p>
          <ul className="space-y-1 list-disc list-inside text-sm">
            <li>Device type, browser, and operating system</li>
            <li>IP address and general geographic location (country/state only)</li>
            <li>App usage patterns and feature interactions</li>
            <li>Error logs for improving app reliability</li>
          </ul>
        </div>

        <div className="bg-white border border-brand-purple/10 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-black text-brand-purple uppercase tracking-wider">2.4 Anonymous Users</p>
          <p className="text-sm">If you use WISE without creating an account, we assign an anonymous device identifier. This lets your data persist on your device. You can delete this at any time by clearing app data or creating a full account.</p>
        </div>
      </div>
    </section>

    {/* Section 3 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <Brain size={18} className="text-brand-pink shrink-0" />
        3. How We Use Your Data
      </h3>
      <div className="space-y-3">
        {[
          { title: 'Symptom Assessment', desc: 'Your survey responses power our clinical analysis engine to generate differential diagnoses and triage recommendations.' },
          { title: 'AI-Powered Insights', desc: 'Anonymized symptom data is processed through Google Gemini AI to generate personalized health explanations, doctor prep questions, and pattern insights. Your data is not used to train Google\'s models.' },
          { title: 'Cycle & Pattern Tracking', desc: 'Your logged data is analyzed locally and on our secure servers to identify symptom patterns, predict cycle dates, and surface trends.' },
          { title: 'PDF Report Generation', desc: 'Clinical reports are generated on-demand using your data and downloaded directly to your device. Reports are not stored on our servers after generation unless you explicitly save them.' },
          { title: 'Account Security', desc: 'Your email address is used for account verification and password resets. Your phone number (if provided) is used solely for two-factor authentication SMS codes.' },
          { title: 'Service Improvements', desc: 'Aggregated, de-identified data may be used to improve clinical accuracy, add new conditions, and enhance assessment quality.' },
        ].map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-1.5 h-1.5 bg-brand-pink rounded-full mt-2 shrink-0" />
            <div>
              <span className="font-black text-brand-purple">{item.title}: </span>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Section 4 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <Lock size={18} className="text-brand-pink shrink-0" />
        4. Data Security
      </h3>
      <p>We take the security of your health data seriously and implement the following protections:</p>
      <div className="grid grid-cols-1 gap-3">
        {[
          { icon: '🔐', title: 'Encrypted Storage', desc: 'All data stored in Supabase with AES-256 encryption at rest' },
          { icon: '🔒', title: 'Secure Transport', desc: 'All data transmitted over TLS 1.3 encrypted connections (HTTPS only)' },
          { icon: '🛡️', title: 'Row-Level Security', desc: 'Database policies ensure users can only access their own data' },
          { icon: '📱', title: 'Two-Factor Auth', desc: 'Optional SMS-based 2FA for accounts with sensitive health data' },
          { icon: '✅', title: 'Email Verification', desc: 'All accounts require email verification before access is granted' },
          { icon: '🔑', title: 'Password Hashing', desc: 'Passwords are hashed using bcrypt — we cannot retrieve your password' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-white border border-brand-purple/10 rounded-xl p-3">
            <span className="text-lg">{item.icon}</span>
            <div>
              <p className="font-black text-brand-purple text-xs">{item.title}</p>
              <p className="text-xs text-brand-purple/60">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Section 5 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <Phone size={18} className="text-brand-pink shrink-0" />
        5. Third-Party Services
      </h3>
      <p>WISE uses the following third-party providers. Each is bound by their own privacy policies:</p>
      <div className="space-y-3">
        {[
          {
            name: 'Supabase', role: 'Database, Authentication & Storage', use: 'Stores your account info, health data, and session tokens. Supabase is SOC 2 Type II certified.',
            link: 'supabase.com/privacy'
          },
          {
            name: 'Google Gemini AI', role: 'AI-Powered Explanations & Insights', use: 'Processes anonymized symptom data to generate plain-language health explanations. Data is not used to train AI models per Google\'s API terms.',
            link: 'ai.google.dev/terms'
          },
          {
            name: 'Twilio', role: 'SMS Two-Factor Authentication', use: 'Sends verification codes to your phone when 2FA is enabled. Only your phone number is shared, and only for authentication purposes.',
            link: 'twilio.com/legal/privacy'
          },
          {
            name: 'Vercel', role: 'App Hosting & Delivery', use: 'Serves the WISE application. Vercel may log IP addresses for security and performance purposes.',
            link: 'vercel.com/legal/privacy-policy'
          },
        ].map((tp, i) => (
          <div key={i} className="bg-white border border-brand-purple/10 rounded-2xl p-4 space-y-1">
            <div className="flex justify-between items-start">
              <p className="font-black text-brand-purple text-sm">{tp.name}</p>
              <span className="text-xs text-brand-pink font-bold">{tp.role}</span>
            </div>
            <p className="text-xs text-brand-purple/70">{tp.use}</p>
            <p className="text-xs text-brand-purple/40 font-bold">{tp.link}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-brand-purple/60">We do <strong>never</strong> sell your health data to advertisers, data brokers, or insurance companies.</p>
    </section>

    {/* Section 6 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <Mail size={18} className="text-brand-pink shrink-0" />
        6. Your Rights
      </h3>
      <p>You have the following rights regarding your personal data:</p>
      <div className="space-y-2">
        {[
          { right: 'Access', desc: 'Request a copy of all data we hold about you' },
          { right: 'Correction', desc: 'Update or correct any inaccurate information' },
          { right: 'Deletion', desc: 'Request permanent deletion of your account and all associated health data' },
          { right: 'Portability', desc: 'Export your symptom logs and assessment history in JSON or PDF format' },
          { right: 'Opt-Out', desc: 'Disable AI features or anonymous analytics at any time in Settings' },
          { right: 'Withdraw Consent', desc: 'Close your account at any time — your data will be deleted within 30 days' },
        ].map((r, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="bg-brand-pink/20 text-brand-purple font-black text-xs px-2 py-0.5 rounded-lg shrink-0 mt-0.5">{r.right}</span>
            <p className="text-sm">{r.desc}</p>
          </div>
        ))}
      </div>
      <p>To exercise any right, email <strong className="text-brand-purple">privacy@wisehealth.app</strong> with the subject line matching your request. We respond within 30 days.</p>
    </section>

    {/* Section 7 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">7. Data Retention</h3>
      <div className="space-y-2 text-sm">
        <p><strong className="text-brand-purple">Active Accounts:</strong> Data retained for the duration of your account.</p>
        <p><strong className="text-brand-purple">Deleted Accounts:</strong> All personal data permanently deleted within 30 days of account deletion.</p>
        <p><strong className="text-brand-purple">Anonymous Users:</strong> Data retained for 12 months from last app use, then purged.</p>
        <p><strong className="text-brand-purple">Legal Holds:</strong> We may retain data longer if required by law or active legal proceedings.</p>
      </div>
    </section>

    {/* Section 8 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">8. Children's Privacy</h3>
      <p>WISE is designed for users aged 13 and older. We do not knowingly collect data from children under 13. If you believe a child under 13 has created an account, contact us immediately at <strong className="text-brand-purple">privacy@wisehealth.app</strong> and we will delete the account.</p>
    </section>

    {/* Section 9 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">9. Changes to This Policy</h3>
      <p>We may update this Privacy Policy periodically. When we make material changes, we will notify you via email and in-app notification at least 14 days before the change takes effect. Continued use of WISE after that date constitutes acceptance of the updated policy.</p>
    </section>

    <div className="bg-brand-purple text-white p-6 rounded-2xl space-y-2">
      <p className="font-black text-sm">Questions about your privacy?</p>
      <p className="text-white/80 text-xs">Contact our Data Protection team at <strong>privacy@wisehealth.app</strong></p>
      <p className="text-white/60 text-xs">WISE Health Inc. · Atlanta, GA · United States</p>
    </div>
  </div>
);

// ============================================================================
// TERMS OF SERVICE CONTENT
// ============================================================================

const TermsOfService: React.FC = () => (
  <div className="space-y-8 text-brand-purple/80 font-medium text-sm leading-relaxed">

    <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-2xl p-5">
      <p className="text-xs font-black text-brand-purple uppercase tracking-widest mb-2">Last Updated: February 16, 2026</p>
      <p>These Terms of Service govern your use of the WISE application and all associated services. By creating an account or using WISE, you agree to these terms. Please read them carefully.</p>
    </div>

    {/* Section 1 */}
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-serif font-black text-brand-purple">
        <FileText size={18} className="text-brand-pink shrink-0" />
        1. About WISE
      </h3>
      <p>WISE (Women Informed Strong Engaged) is a digital health education platform designed to help women understand and track their reproductive health symptoms. WISE provides:</p>
      <ul className="space-y-1 list-disc list-inside ml-2">
        <li>Symptom assessment and differential analysis</li>
        <li>Menstrual cycle and symptom tracking</li>
        <li>AI-powered health explanations via Google Gemini</li>
        <li>Clinical report generation for provider visits</li>
        <li>Educational content about gynecological conditions</li>
      </ul>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4">
        <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-2">⚠ Critical Medical Disclaimer</p>
        <p className="text-sm text-red-700">WISE is an <strong>educational tool only</strong>. It does not provide medical diagnoses, treatment, or professional medical advice. All assessments are informational only. Always consult a licensed healthcare provider for any medical concerns. In an emergency, call 911 or go to your nearest emergency room immediately.</p>
      </div>
    </section>

    {/* Section 2 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">2. Eligibility</h3>
      <p>To use WISE, you must:</p>
      <ul className="space-y-1 list-disc list-inside ml-2">
        <li>Be at least <strong className="text-brand-purple">13 years of age</strong></li>
        <li>Have the legal capacity to enter into a binding agreement</li>
        <li>Not be prohibited from using the service under applicable law</li>
        <li>Provide accurate and truthful registration information</li>
      </ul>
      <p>If you are under 18, you represent that you have obtained parental or guardian consent to use WISE.</p>
    </section>

    {/* Section 3 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">3. Account Registration & Security</h3>
      <div className="space-y-3">
        <p><strong className="text-brand-purple">Email Verification:</strong> All accounts require email verification before full access is granted. You must provide a valid, accessible email address.</p>
        <p><strong className="text-brand-purple">Two-Factor Authentication:</strong> We strongly recommend enabling phone-based 2FA given the sensitive nature of health data. You are responsible for maintaining access to your registered phone number.</p>
        <p><strong className="text-brand-purple">Account Security:</strong> You are responsible for maintaining the confidentiality of your password and all activity under your account. Notify us immediately at support@wisehealth.app if you suspect unauthorized access.</p>
        <p><strong className="text-brand-purple">One Account Per Person:</strong> You may not create multiple accounts or share your account credentials with others.</p>
      </div>
    </section>

    {/* Section 4 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">4. Membership Plans & Billing</h3>

      <div className="space-y-3">
        <div className="bg-white border border-brand-purple/10 rounded-2xl p-4">
          <p className="font-black text-brand-purple text-xs uppercase tracking-wider mb-2">Free Tier</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Basic symptom assessment (limited assessments per month)</li>
            <li>General health education content</li>
            <li>Basic cycle tracking</li>
            <li>No credit card required</li>
          </ul>
        </div>

        <div className="bg-white border border-brand-pink/30 rounded-2xl p-4">
          <p className="font-black text-brand-purple text-xs uppercase tracking-wider mb-2">WISE+ (Paid Membership)</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Unlimited symptom assessments</li>
            <li>Full AI-powered explanations and insights</li>
            <li>PDF clinical report generation and export</li>
            <li>Advanced pattern analysis and cycle predictions</li>
            <li>Priority customer support</li>
          </ul>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong className="text-brand-purple">Billing:</strong> Paid memberships are billed monthly or annually as selected at checkout. Prices are displayed in USD and subject to applicable taxes.</p>
          <p><strong className="text-brand-purple">Cancellation:</strong> You may cancel your membership at any time. Access continues until the end of your current billing period. No partial refunds for unused time.</p>
          <p><strong className="text-brand-purple">Refunds:</strong> We offer a 7-day money-back guarantee for new paid memberships. Contact support@wisehealth.app within 7 days of your first charge.</p>
          <p><strong className="text-brand-purple">Price Changes:</strong> We will provide 30 days' notice of any price increases via email.</p>
        </div>
      </div>
    </section>

    {/* Section 5 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">5. Acceptable Use</h3>
      <p>You agree to use WISE only for lawful, personal health education purposes. You may not:</p>
      <div className="space-y-2">
        {[
          'Use WISE to diagnose, treat, or provide medical advice to others',
          'Share, sell, or transfer your account to another person',
          'Attempt to reverse-engineer, scrape, or extract data from WISE',
          'Upload false, misleading, or fraudulent health information',
          'Use WISE for commercial purposes without written consent',
          'Interfere with or disrupt WISE servers or infrastructure',
          'Attempt to circumvent any security or access control measures',
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-red-400 font-black text-xs mt-0.5 shrink-0">✕</span>
            <p className="text-sm">{item}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Section 6 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">6. AI Features & Limitations</h3>
      <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-2xl p-4 space-y-3">
        <p>WISE uses Google Gemini AI to generate health explanations and insights. You acknowledge that:</p>
        <ul className="space-y-2 list-disc list-inside text-sm">
          <li>AI-generated content is <strong className="text-brand-purple">informational only</strong> and may not be accurate in all cases</li>
          <li>AI explanations do not constitute professional medical advice</li>
          <li>You should verify any AI-generated information with a qualified healthcare provider</li>
          <li>WISE is not responsible for decisions made based solely on AI-generated content</li>
          <li>AI content quality may vary and is subject to the limitations of large language models</li>
        </ul>
      </div>
    </section>

    {/* Section 7 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">7. Your Health Data</h3>
      <p>You retain full ownership of all health data you enter into WISE. By using WISE, you grant us a limited license to process your data to provide the service. We do not sell, share, or use your health data for advertising. See our Privacy Policy for full details on data handling.</p>
      <p><strong className="text-brand-purple">Accuracy:</strong> You are responsible for the accuracy of information you enter. Inaccurate symptom data may result in inaccurate assessment outputs. WISE assessments should not be used as the sole basis for any medical decision.</p>
    </section>

    {/* Section 8 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">8. PDF Reports & Provider Sharing</h3>
      <p>WISE allows you to generate and share clinical summary PDF reports. You acknowledge that:</p>
      <ul className="space-y-1 list-disc list-inside ml-2 text-sm">
        <li>Reports are informational summaries, not official medical records</li>
        <li>Healthcare providers may not recognize or rely on WISE reports for clinical decisions</li>
        <li>You are responsible for deciding what information to share with your providers</li>
        <li>Shared report links expire after 30 days for security</li>
      </ul>
    </section>

    {/* Section 9 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">9. Intellectual Property</h3>
      <p>All content within WISE — including the clinical assessment algorithms, educational content, brand assets, conditions database, and AI prompts — is the intellectual property of WISE Health Inc. and protected by copyright law. You may not reproduce, distribute, or create derivative works without written permission.</p>
      <p>The clinical conditions database and assessment criteria were developed under the guidance of <strong className="text-brand-purple">Dr. Leslie Appiah, MD</strong> and are evidence-based references, not proprietary medical formulations.</p>
    </section>

    {/* Section 10 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">10. Limitation of Liability</h3>
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2">
        <p className="text-sm text-red-800"><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW,</strong> WISE Health Inc., its officers, directors, employees, and clinical advisors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of WISE, including but not limited to:</p>
        <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
          <li>Medical decisions made based on WISE assessments</li>
          <li>Delays in seeking medical treatment</li>
          <li>Reliance on AI-generated health content</li>
          <li>Data loss due to technical failures</li>
          <li>Unauthorized access to your account</li>
        </ul>
        <p className="text-sm text-red-800 font-bold">Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim.</p>
      </div>
    </section>

    {/* Section 11 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">11. Termination</h3>
      <p><strong className="text-brand-purple">By You:</strong> You may delete your account at any time through Settings → Account → Delete Account. All your data will be permanently deleted within 30 days.</p>
      <p><strong className="text-brand-purple">By WISE:</strong> We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or cause harm to other users or the platform.</p>
    </section>

    {/* Section 12 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">12. Governing Law & Disputes</h3>
      <p>These Terms are governed by the laws of the <strong className="text-brand-purple">State of Georgia, United States</strong>. Any disputes will be resolved through binding arbitration in Atlanta, Georgia, except for claims that may be brought in small claims court.</p>
    </section>

    {/* Section 13 */}
    <section className="space-y-3">
      <h3 className="text-base font-serif font-black text-brand-purple">13. Changes to Terms</h3>
      <p>We may modify these Terms at any time. We will notify you of material changes via email and in-app notification at least 14 days before they take effect. Continued use after that date constitutes acceptance.</p>
    </section>

    <div className="bg-brand-purple text-white p-6 rounded-2xl space-y-2">
      <p className="font-black text-sm">Questions about these Terms?</p>
      <p className="text-white/80 text-xs">Contact us at <strong>legal@wisehealth.app</strong></p>
      <p className="text-white/60 text-xs">WISE Health Inc. · Atlanta, GA · United States</p>
    </div>
  </div>
);

// ============================================================================
// MODAL WRAPPER
// ============================================================================

export const LegalModal: React.FC<LegalModalProps> = ({
  document,
  onClose,
  onAccept,
  showAcceptButton = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      if (isBottom) setHasScrolledToBottom(true);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const isPrivacy = document === 'privacy';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-purple/80 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              {isPrivacy
                ? <Shield size={20} className="text-white" />
                : <FileText size={20} className="text-white" />
              }
            </div>
            <div>
              <h2 className="text-lg font-serif font-black text-white">
                {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <p className="text-white/60 text-xs font-bold">WISE Health Inc. · Last updated Feb 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Tab pills (show if both available) */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-brand-purple/10 bg-brand-grey/20 shrink-0">
          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isPrivacy
              ? 'bg-brand-purple text-white'
              : 'bg-transparent text-brand-purple/40'
          }`}>
            Privacy Policy
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            !isPrivacy
              ? 'bg-brand-purple text-white'
              : 'bg-transparent text-brand-purple/40'
          }`}>
            Terms of Service
          </div>
        </div>

        {/* Scroll indicator */}
        {showAcceptButton && !hasScrolledToBottom && (
          <div className="flex items-center gap-2 px-6 py-2 bg-brand-pink/10 border-b border-brand-pink/20 shrink-0">
            <ChevronDown size={14} className="text-brand-pink animate-bounce" />
            <p className="text-xs font-bold text-brand-pink">Please scroll to read the full document</p>
          </div>
        )}

        {/* Scrollable Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {isPrivacy ? <PrivacyPolicy /> : <TermsOfService />}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-brand-purple/10 bg-white shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-brand-grey/30 text-brand-purple rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-brand-grey/50 transition-all"
          >
            Close
          </button>
          {showAcceptButton && onAccept && (
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
              className="flex-1 px-4 py-3 bg-brand-purple text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {hasScrolledToBottom ? 'I Accept' : 'Scroll to Accept'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// INLINE LINK COMPONENT - drop-in replacement for the SignUp.tsx text
// ============================================================================

interface LegalLinksProps {
  agreed: boolean;
  onToggle: () => void;
}

export const LegalLinks: React.FC<LegalLinksProps> = ({ agreed, onToggle }) => {
  const [openDoc, setOpenDoc] = useState<DocumentType | null>(null);

  return (
    <>
      <div className="flex items-start gap-3 pt-2">
        <button
          type="button"
          onClick={onToggle}
          className="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all bg-white border-transparent text-brand-black shrink-0"
        >
          {agreed && <Shield size={12} className="text-brand-purple" />}
        </button>
        <p className="text-[10px] font-sans text-white leading-relaxed font-medium">
          I agree to the{' '}
          <button
            type="button"
            onClick={() => setOpenDoc('privacy')}
            className="text-brand-pink underline underline-offset-2 font-black hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
          {' '}and{' '}
          <button
            type="button"
            onClick={() => setOpenDoc('terms')}
            className="text-brand-pink underline underline-offset-2 font-black hover:text-white transition-colors"
          >
            Terms of Service
          </button>
          .
        </p>
      </div>

      {openDoc && (
        <LegalModal
          document={openDoc}
          onClose={() => setOpenDoc(null)}
        />
      )}
    </>
  );
};

export default LegalModal;
