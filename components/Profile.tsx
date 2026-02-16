import React from 'react';
import { UserProfile } from '../types';
import { Edit3, User as UserIcon, Mail, Phone, ChevronRight, UserPlus } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
  onComplete: () => void;
  onAdminLogin: () => void;
}

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const ContactInput = ({ label, icon: Icon, value, placeholder, type = "text", onChange }: any) => (
  <div className="bg-white border border-brand-purple/10 rounded-2xl p-5 flex flex-col gap-2 transition-all focus-within:ring-2 focus-within:ring-brand-pink shadow-md">
    <span className="text-[10px] font-black text-brand-black uppercase tracking-widest flex items-center gap-2">
      <Icon size={12} className="text-brand-pink" /> {label}
    </span>
    <input 
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        const val = type === 'tel' ? formatPhoneNumber(e.target.value) : e.target.value;
        onChange(val);
      }}
      className="bg-transparent text-base font-bold text-brand-black focus:outline-none w-full placeholder:text-brand-purple/30"
    />
  </div>
);

export const Profile: React.FC<ProfileProps> = ({ profile, updateProfile, onComplete }) => {
  return (
    <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 bg-brand-purple flex flex-col min-h-full">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-28 h-28 rounded-full p-1 bg-white/10 shadow-lg">
            <div className="w-full h-full rounded-full bg-white/20 overflow-hidden border-4 border-brand-purple">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <button className="absolute bottom-1 right-1 p-2.5 bg-white rounded-full border-2 border-brand-purple text-brand-purple shadow-xl hover:scale-110 transition-transform">
            <Edit3 size={16} />
          </button>
        </div>
        <h2 className="mt-6 text-2xl font-serif font-black text-white text-center leading-tight uppercase tracking-tight">
          {profile.name || 'Your Profile'}
        </h2>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
          <UserIcon size={18} className="text-white" /> Profile Details
        </h3>
        <div className="space-y-4">
          <ContactInput 
            label="Full Name" 
            icon={UserIcon} 
            value={profile.name} 
            placeholder="Jane Doe"
            onChange={(v: string) => updateProfile({ name: v })} 
          />
          <ContactInput 
            label="Email Address" 
            icon={Mail} 
            type="email"
            value={profile.email} 
            placeholder="jane@example.com"
            onChange={(v: string) => updateProfile({ email: v })} 
          />
          <ContactInput 
            label="Phone Number" 
            icon={Phone} 
            type="tel"
            value={profile.phone} 
            placeholder="(555) 000-0000"
            onChange={(v: string) => updateProfile({ phone: v })} 
          />
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onComplete}
          className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-xl flex items-center justify-center gap-2 group transition-all hover:scale-[1.02] active:scale-95 hover:bg-brand-pink hover:text-white"
        >
          <UserPlus size={20} />
          Continue
          <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};