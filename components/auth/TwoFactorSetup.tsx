/**
 * Two-Factor Authentication Setup
 *
 * 2FA is now managed through Clerk's user settings.
 * Configure 2FA options in your Clerk Dashboard:
 * https://dashboard.clerk.com → User & Authentication → Multi-factor
 */

import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Shield, CheckCircle } from 'lucide-react';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  onComplete,
  onCancel,
}) => {
  const { user } = useUser();

  const hasTwoFactor = user?.twoFactorEnabled;

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <div className="text-center space-y-6">
        <div className={`w-20 h-20 ${hasTwoFactor ? 'bg-emerald-500/20' : 'bg-brand-purple/10'} rounded-full flex items-center justify-center mx-auto`}>
          {hasTwoFactor
            ? <CheckCircle size={48} className="text-emerald-500" />
            : <Shield size={48} className="text-brand-purple" />}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-black text-brand-purple">
            {hasTwoFactor ? '2FA Enabled' : 'Two-Factor Authentication'}
          </h2>
          <p className="text-sm text-brand-purple/70 font-medium">
            {hasTwoFactor
              ? 'Your account is secured with two-factor authentication.'
              : 'Two-factor authentication can be configured in your account security settings.'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-brand-grey/30 text-brand-purple rounded-2xl font-bold text-sm hover:bg-brand-grey/50 transition-all"
          >
            Close
          </button>
          {!hasTwoFactor && (
            <button
              onClick={() => user?.createPhoneNumber({ phoneNumber: '' })}
              className="flex-1 px-6 py-3 bg-brand-purple text-white rounded-2xl font-bold text-sm hover:bg-brand-pink hover:text-brand-black transition-all"
            >
              Set Up 2FA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
