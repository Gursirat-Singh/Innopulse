import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', text: 'text-sm' },
    md: { container: 'w-10 h-10', text: 'text-xl' },
    lg: { container: 'w-14 h-14', text: 'text-2xl' },
    xl: { container: 'w-20 h-20', text: 'text-3xl' },
  };

  const { container, text } = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex flex-shrink-0 items-center justify-center ${container}`}>
        <Image 
           src="/logo.png" 
           alt="InnoPulse Logo" 
           fill 
           className="object-contain" 
           sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      {showText && <span className={`font-black tracking-tight ${text}`}>InnoPulse</span>}
    </div>
  );
}
