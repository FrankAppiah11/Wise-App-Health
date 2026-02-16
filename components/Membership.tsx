import React, { useState } from 'react';
import { ChevronLeft, Check, Sparkles, Star, Zap, Shield } from 'lucide-react';
import { Tagline } from '../App';

interface MembershipProps {
  onBack: () => void;
  onSelect: (planId: string) => void;
}

const PlanCard = ({ 
  title, 
  priceMonthly, 
  priceYearly, 
  isPopular = false, 
  features, 
  icon: Icon,
  buttonLabel,
  onSelect 
}: any) => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const renderTitle = (text: string) => {
    const parts = text.split(/(WISE)/g);
    return parts.map((part, i) => 
      part === 'WISE' ? <span key={i} className="text-brand-brightPink">WISE</span> : part
    );
  };

  return (
    <div className={`relative p-8 rounded-[3rem] border transition-all duration-500 hover:scale-[1.01] bg-white/10 shadow-xl ${
      isPopular 
        ? 'border-white/40' 
        : 'border-white/10 hover:border-white/30'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-brand-purple text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg z-20 border border-white/20">
          Popular Choice
        </div>
      )}

      <div className="space-y-6">
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <div className={`flex items-center justify-center ${isPopular ? 'text-brand-brightPink' : 'text-white'}`}>
              <Icon size={32} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-serif font-black text-white">
                ${billing === 'yearly' ? priceYearly : priceMonthly}
                <span className="text-xs font-sans text-white/60 font-bold">/{billing === 'yearly' ? 'yr' : 'mo'}</span>
              </p>
              <button 
                onClick={() => setBilling(billing === 'yearly' ? 'monthly' : 'yearly')}
                className="text-[9px] font-black text-white underline underline-offset-4 uppercase tracking-widest hover:opacity-80 mt-1 transition-opacity"
              >
                Switch to {billing === 'yearly' ? 'Monthly' : 'Yearly'}
              </button>
            </div>
          </div>
          <h3 className="text-xl font-serif font-black text-white leading-tight uppercase tracking-tight">
            {renderTitle(title)}
          </h3>
        </header>

        <div className="h-px bg-white/20 w-full"></div>

        <ul className="space-y-4">
          {features.map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <Check size={14} className="text-white mt-1 shrink-0" />
              <span className="text-sm font-sans font-bold text-white leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <button 
          onClick={onSelect}
          className={`w-full py-5 rounded-2xl font-sans font-black text-xs uppercase tracking-widest transition-all ${
            isPopular 
              ? 'bg-brand-gold text-brand-black shadow-lg hover:bg-white hover:text-brand-purple' 
              : 'bg-white/20 text-white hover:bg-white hover:text-brand-purple'
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export const Membership: React.FC<MembershipProps> = ({ onBack, onSelect }) => {
  return (
    <div className="flex flex-col min-h-full bg-brand-purple pb-10 animate-in fade-in duration-700">
      <div className="px-8 pt-12 pb-10 space-y-6 relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-all p-2 -ml-4">
          <ChevronLeft size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Back to Results</span>
        </button>
        <div className="space-y-3">
          <h1 className="text-3xl font-serif font-black text-white leading-tight">Elevate Your <br/><span className="text-white opacity-80">Health Experience</span></h1>
          <p className="text-[13px] font-sans font-bold text-white leading-relaxed font-medium">
            Choose the level of clinical support that best fits your reproductive wellness journey.
          </p>
        </div>
      </div>

      <div className="px-6 space-y-8 relative z-10">
        <PlanCard 
          title="WISE Membership"
          priceYearly="99"
          priceMonthly="12"
          isPopular={true}
          icon={Star}
          buttonLabel="CHOOSE WISE MEMBERSHIP"
          features={[
            "#1 top condition by likelihood",
            "Personalized Reproductive Roadmap",
            "Evidence-based management guidelines",
            "WISE Doctor Visit Preparation Tool"
          ]}
          onSelect={() => onSelect('level2')}
        />

        <PlanCard 
          title="WISE Experience"
          priceYearly="179"
          priceMonthly="19"
          icon={Zap}
          buttonLabel="CHOOSE WISE EXPERIENCE"
          features={[
            "Includes Membership features, plus:",
            "WISE Reminder Tracker for recommendations",
            "WISE Curated Well educational content",
            "Psychosocial and lifestyle supportive content"
          ]}
          onSelect={() => onSelect('level3')}
        />

        <PlanCard 
          title="WISE Ultimate"
          priceYearly="399"
          priceMonthly="39"
          icon={Sparkles}
          buttonLabel="CHOOSE WISE ULTIMATE"
          features={[
            "Includes Experience features, plus:",
            "Quarterly live Q&A with experts",
            "Direct Messaging access"
          ]}
          onSelect={() => onSelect('level4')}
        />

        <div className="pt-10 flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white">
            <Shield size={16} />
            <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em]">Encrypted Clinical Grade Payment</span>
          </div>
          <p className="text-[10px] text-white opacity-70 text-center px-8 font-medium">
            Payments are processed securely. You can cancel or upgrade your membership tier at any time.
          </p>
        </div>
        
        <div className="pt-12">
          <Tagline />
        </div>
      </div>
    </div>
  );
};