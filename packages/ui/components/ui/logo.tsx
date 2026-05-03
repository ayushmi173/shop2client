'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  className?: string;
}

const sizes = {
  sm: { icon: 'w-7 h-7', text: 'text-lg', gap: 'gap-1.5' },
  md: { icon: 'w-9 h-9', text: 'text-xl', gap: 'gap-2' },
  lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-2.5' },
  xl: { icon: 'w-16 h-16', text: 'text-3xl', gap: 'gap-3' },
};

export function Logo({
  size = 'md',
  showText = true,
  variant = 'default',
  className,
}: LogoProps) {
  const sizeConfig = sizes[size];

  const textColor = {
    default: 'text-gray-900',
    white: 'text-white',
    dark: 'text-gray-900',
  };

  const accentColor = {
    default: 'text-primary',
    white: 'text-white',
    dark: 'text-primary',
  };

  return (
    <Link href="/" className={cn('flex items-center', sizeConfig.gap, className)}>
      {/* Logo Icon */}
      <div className={cn('relative', sizeConfig.icon)}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>
          
          {/* Main Circle */}
          <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />
          
          {/* Location Pin Shape */}
          <path
            d="M24 8C17.4 8 12 13.4 12 20C12 28.5 24 40 24 40C24 40 36 28.5 36 20C36 13.4 30.6 8 24 8Z"
            fill="white"
            fillOpacity="0.95"
          />
          
          {/* Inner Circle (Person/Worker symbol) */}
          <circle cx="24" cy="19" r="5" fill="url(#logoGradient)" />
          
          {/* Connection dots */}
          <circle cx="18" cy="26" r="2" fill="url(#accentGradient)" />
          <circle cx="30" cy="26" r="2" fill="url(#accentGradient)" />
          <circle cx="24" cy="30" r="2" fill="url(#accentGradient)" />
          
          {/* Connection lines */}
          <path
            d="M18 26L24 30L30 26"
            stroke="url(#accentGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className={cn('font-bold tracking-tight', sizeConfig.text)}>
          <span className={textColor[variant]}>Local</span>
          <span className={accentColor[variant]}>Connect</span>
        </div>
      )}
    </Link>
  );
}

// Favicon/App Icon version (simplified)
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
    >
      <defs>
        <linearGradient id="logoGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#logoGradientIcon)" />
      <path
        d="M24 10C18.5 10 14 14.5 14 20C14 27 24 38 24 38C24 38 34 27 34 20C34 14.5 29.5 10 24 10Z"
        fill="white"
      />
      <circle cx="24" cy="19" r="4" fill="url(#logoGradientIcon)" />
    </svg>
  );
}
