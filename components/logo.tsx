import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'w-6 h-6 rounded-md', icon: 'w-3.5 h-3.5', text: 'text-sm' },
    md: { container: 'w-9 h-9 rounded-xl', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { container: 'w-12 h-12 rounded-xl border-2', icon: 'w-6 h-6', text: 'text-2xl' },
    xl: { container: 'w-16 h-16 rounded-2xl border-2', icon: 'w-8 h-8', text: 'text-3xl' },
  };

  const { container, icon, text } = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center justify-center ${container}`}>
        {/* Outer glowing ambient layer */}
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-primary to-accent opacity-30 blur-[6px]" />
        
        {/* Main shape background */}
        <div 
          className={`relative w-full h-full bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-md border border-white/20 overflow-hidden ${container}`}
        >
          {/* Internal diagonal accent (glass reflection) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <svg
            className={`${icon} text-white drop-shadow-sm`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sophisticated Data Stack / Pulse abstract logo */}
            <path d="M12 3L3 8L12 13L21 8L12 3Z" fill="currentColor" fillOpacity="0.9"/>
            <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 16L12 21L21 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {showText && <span className={`font-black tracking-tight ${text}`}>InnoPulse</span>}
    </div>
  );
}
