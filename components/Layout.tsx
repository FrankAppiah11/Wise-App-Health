
import React from 'react';
import { AppScreen } from '../types';
import { Logo } from './Logo';
import { Tagline } from '../App';
import { Home, ClipboardList, MessageSquare, Activity, User, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: AppScreen;
  setScreen: (s: AppScreen) => void;
}

const NavItem = ({ 
  screen, 
  icon: Icon, 
  label, 
  current, 
  onClick,
  isDark
}: { 
  screen: AppScreen; 
  icon: any; 
  label: string; 
  current: AppScreen; 
  onClick: (s: AppScreen) => void;
  isDark?: boolean;
}) => (
  <button
    onClick={() => onClick(screen)}
    className={`flex flex-col items-center justify-center w-full py-4 transition-all ${
      current === screen 
        ? (isDark ? 'text-white scale-110' : 'text-brand-purple scale-110') 
        : (isDark ? 'text-white/40 hover:text-white' : 'text-brand-purple/40 hover:text-brand-purple')
    }`}
  >
    <div className={`p-1 rounded-xl transition-all ${current === screen ? (isDark ? 'bg-white/10' : 'bg-brand-purple/10') : ''}`}>
      <Icon size={24} fill={current === screen ? "currentColor" : "none"} fillOpacity={0.1} />
    </div>
    <span className={`text-[11px] mt-1.5 font-sans font-black uppercase tracking-tighter ${current === screen ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, setScreen }) => {
  // Treatment of screens as dark or light
  const isDarkScreen = currentScreen === AppScreen.PROFILE || currentScreen === AppScreen.RESULTS;

  return (
    <div className={`flex flex-col min-h-[900px] h-full ${isDarkScreen ? 'bg-brand-purple' : 'bg-white'} max-w-md mx-auto relative overflow-hidden shadow-2xl transition-colors duration-500`}>
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-64 h-64 ${isDarkScreen ? 'bg-brand-pink/20' : 'bg-brand-pink/10'} rounded-full blur-[100px]`}></div>
        <div className={`absolute top-1/2 -right-20 w-64 h-64 ${isDarkScreen ? 'bg-brand-sky/20' : 'bg-brand-sky/10'} rounded-full blur-[100px]`}></div>
      </div>

      {/* Header */}
      <header className={`px-6 py-4 flex items-center justify-between z-10 sticky top-0 backdrop-blur-xl ${isDarkScreen ? 'bg-brand-purple/80 border-white/10' : 'bg-white/80 border-brand-purple/10'} border-b`}>
        <div className="flex items-center gap-3">
          <Logo variant="full" size="sm" color={isDarkScreen ? "pink" : "purple"} />
        </div>
        <button className={`p-2 rounded-full transition-colors border ${isDarkScreen ? 'bg-white/10 text-white/60 hover:text-white border-white/10' : 'bg-brand-purple/5 text-brand-purple/40 hover:text-brand-purple border-brand-purple/10'}`}>
          <Bell size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-4 relative z-0">
        {children}
      </main>

      {/* Bottom Nav & Tagline */}
      <div className={`mt-auto backdrop-blur-3xl border-t shadow-lg ${isDarkScreen ? 'bg-brand-purple/95 border-white/10' : 'bg-white border-brand-purple/10'}`}>
        <div className={`py-4 text-center border-b ${isDarkScreen ? 'border-white/5' : 'border-brand-purple/5'}`}>
            <Tagline />
        </div>
        <nav className="flex justify-around pb-safe">
            <NavItem screen={AppScreen.PROFILE} icon={Home} label="Home" current={currentScreen} onClick={setScreen} isDark={isDarkScreen} />
            <NavItem screen={AppScreen.SURVEY} icon={Activity} label="Track" current={currentScreen} onClick={setScreen} isDark={isDarkScreen} />
            <NavItem screen={AppScreen.RESULTS} icon={ClipboardList} label="Care" current={currentScreen} onClick={setScreen} isDark={isDarkScreen} />
            <NavItem screen={AppScreen.SUPPORT} icon={MessageSquare} label="Support" current={currentScreen} onClick={setScreen} isDark={isDarkScreen} />
            <NavItem screen={AppScreen.PROFILE} icon={User} label="Profile" current={currentScreen} onClick={setScreen} isDark={isDarkScreen} />
        </nav>
      </div>
    </div>
  );
};
