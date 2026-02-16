import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  color?: 'white' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  variant = 'full',
  size = 'md',
  color = 'pink'
}) => {
  // The user explicitly requested WISE to be pink on all screens.
  const primaryColor = '#F9A8D4'; // Brand brightPink
  
  // outlineColor handles the icon strokes and the "BY CURATED WELL" tagline
  // On purple backgrounds (pink/white variants), use white. On white background (purple variant), use purple.
  const outlineColor = color === 'purple' ? '#6B54A7' : '#FFFFFF';
  
  const iconSizeClass = {
    sm: 'w-6 h-6',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }[size];

  const textSizeClass = {
    sm: { h1: 'text-xl', p: 'text-[6px]' },
    md: { h1: 'text-4xl', p: 'text-[5px]' },
    lg: { h1: 'text-6xl', p: 'text-[12px]' }
  }[size];

  const Icon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="38" stroke={outlineColor} strokeWidth="2.5" />
      
      {/* Crosshairs */}
      <line x1="8" y1="50" x2="25" y2="50" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="50" x2="92" y2="50" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="8" x2="50" y2="25" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="75" x2="50" y2="92" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Dial Ticks */}
      <line x1="26" y1="26" x2="31" y2="31" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="69" y1="69" x2="74" y2="74" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="69" y1="31" x2="74" y2="26" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="31" y1="69" x2="26" y2="74" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />

      {/* The Central Needle */}
      <path 
        d="M 50 4 L 59 45 L 50 96 L 41 45 Z" 
        fill={outlineColor} 
      />
      <line x1="50" y1="5" x2="50" y2="95" stroke={color === 'pink' || color === 'white' ? '#6B54A7' : '#FFFFFF'} strokeWidth="0.8" />

      {/* Right Leaf */}
      <path 
        d="M 50 50 C 65 35 85 45 68 70 C 60 60 55 55 50 50" 
        fill={outlineColor} 
      />
      
      {/* Left Leaf */}
      <path 
        d="M 50 55 C 30 65 25 80 42 90 C 48 85 50 75 50 55" 
        stroke={outlineColor} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* TM Text */}
      <text x="75" y="22" fill={outlineColor} fontSize="8" fontWeight="900" fontFamily="sans-serif">TM</text>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`${iconSizeClass} ${className}`}><Icon /></div>;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className={`${iconSizeClass} shrink-0`}>
        <Icon />
      </div>
      <div className="flex flex-col">
        <h1 className={`${textSizeClass.h1} font-serif font-black tracking-tight leading-[0.85]`} style={{ color: primaryColor }}>
          WISE
        </h1>
        <p className={`${textSizeClass.p} font-sans font-black uppercase tracking-[0.25em] mt-1 whitespace-nowrap`} style={{ color: outlineColor }}>
          BY CURATED WELL
        </p>
      </div>
    </div>
  );
};