/**
 * Email Verification is now handled by Clerk's built-in flow.
 * This component is kept as a stub for backward compatibility.
 */

import React from 'react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerified }) => {
  React.useEffect(() => {
    onVerified();
  }, [onVerified]);

  return null;
};
