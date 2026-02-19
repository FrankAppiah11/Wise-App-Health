export const clerkAppearance = {
  variables: {
    colorPrimary: '#6B2D8B',
    colorTextOnPrimaryBackground: '#FFFFFF',
    colorBackground: 'transparent',
    colorInputBackground: '#FFFFFF',
    colorInputText: '#1A1A2E',
    borderRadius: '1rem',
    fontFamily: 'inherit',
  },
  elements: {
    rootBox: 'w-full',
    card: 'bg-transparent shadow-none p-0 w-full',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    socialButtonsBlockButton:
      'bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-2xl py-3 font-bold',
    socialButtonsBlockButtonText: 'text-white font-bold',
    dividerLine: 'bg-white/20',
    dividerText: 'text-white/60',
    formFieldLabel: 'text-[10px] font-black text-white uppercase tracking-widest',
    formFieldInput:
      'bg-white border-0 rounded-2xl py-4 pl-4 pr-4 text-sm text-brand-black font-bold placeholder:text-brand-purple/40 focus:ring-2 focus:ring-brand-pink',
    formButtonPrimary:
      'bg-white text-brand-black font-black rounded-3xl py-4 shadow-lg hover:bg-brand-pink hover:text-white transition-all uppercase tracking-wider text-sm',
    footerAction: 'hidden',
    footer: 'hidden',
    identityPreview: 'bg-white/10 border border-white/20 rounded-2xl',
    identityPreviewText: 'text-white font-bold',
    identityPreviewEditButton: 'text-brand-pink hover:text-white',
    formFieldAction: 'text-brand-pink font-bold hover:text-white',
    alert: 'bg-red-500/20 border border-red-400/30 rounded-2xl text-red-200',
    alertText: 'text-red-200 font-medium text-sm',
    otpCodeFieldInput:
      'bg-white border-0 rounded-xl text-xl font-black text-center focus:ring-2 focus:ring-brand-pink',
  },
} as const;
