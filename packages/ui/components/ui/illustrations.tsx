'use client';

import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

// Hero Illustration - Worker finding services
export function HeroIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-auto', className)}
    >
      <defs>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="skinTone" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>

      {/* Background Elements */}
      <circle cx="400" cy="100" r="60" fill="#E0E7FF" opacity="0.5" />
      <circle cx="80" cy="300" r="40" fill="#D1FAE5" opacity="0.5" />
      <circle cx="450" cy="350" r="30" fill="#FEF3C7" opacity="0.5" />

      {/* Phone Frame */}
      <rect x="180" y="50" width="140" height="280" rx="20" fill="#1F2937" />
      <rect x="188" y="58" width="124" height="264" rx="16" fill="white" />
      
      {/* Phone Screen Content */}
      <rect x="195" y="70" width="110" height="20" rx="4" fill="#E0E7FF" />
      <circle cx="210" cy="80" r="6" fill="url(#heroGrad1)" />
      
      {/* Worker Cards on Phone */}
      <rect x="195" y="100" width="110" height="50" rx="6" fill="#F3F4F6" />
      <circle cx="215" cy="125" r="12" fill="url(#heroGrad1)" />
      <rect x="235" y="115" width="50" height="6" rx="2" fill="#9CA3AF" />
      <rect x="235" y="125" width="35" height="4" rx="2" fill="#D1D5DB" />
      <circle cx="290" cy="125" r="8" fill="#FCD34D" />
      
      <rect x="195" y="160" width="110" height="50" rx="6" fill="#F3F4F6" />
      <circle cx="215" cy="185" r="12" fill="url(#heroGrad2)" />
      <rect x="235" y="175" width="50" height="6" rx="2" fill="#9CA3AF" />
      <rect x="235" y="185" width="35" height="4" rx="2" fill="#D1D5DB" />
      <circle cx="290" cy="185" r="8" fill="#FCD34D" />

      <rect x="195" y="220" width="110" height="50" rx="6" fill="#F3F4F6" />
      <circle cx="215" cy="245" r="12" fill="#F59E0B" />
      <rect x="235" y="235" width="50" height="6" rx="2" fill="#9CA3AF" />
      <rect x="235" y="245" width="35" height="4" rx="2" fill="#D1D5DB" />
      <circle cx="290" cy="245" r="8" fill="#FCD34D" />

      {/* CTA Button */}
      <rect x="195" y="280" width="110" height="30" rx="8" fill="url(#heroGrad1)" />
      <text x="250" y="300" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">Book Now</text>

      {/* Person using phone */}
      <ellipse cx="120" cy="320" rx="60" ry="20" fill="#E5E7EB" opacity="0.5" />
      
      {/* Body */}
      <path d="M100 220 Q80 280 90 320 L150 320 Q160 280 140 220 Z" fill="url(#heroGrad1)" />
      
      {/* Head */}
      <circle cx="120" cy="180" r="35" fill="#FBBF24" />
      <circle cx="110" cy="175" r="4" fill="#1F2937" />
      <circle cx="130" cy="175" r="4" fill="#1F2937" />
      <path d="M112 190 Q120 198 128 190" stroke="#1F2937" strokeWidth="2" fill="none" />
      
      {/* Hair */}
      <path d="M85 165 Q90 140 120 135 Q150 140 155 165" fill="#4B5563" />
      
      {/* Arms */}
      <path d="M100 230 Q60 250 75 280 Q85 290 95 280 Q110 250 105 235" fill="#FBBF24" />
      <path d="M140 230 Q175 245 175 270" stroke="#FBBF24" strokeWidth="15" strokeLinecap="round" fill="none" />

      {/* Worker Illustration (right side) */}
      <ellipse cx="380" cy="320" rx="50" ry="15" fill="#E5E7EB" opacity="0.5" />
      
      {/* Worker Body */}
      <path d="M360 230 Q345 280 355 320 L405 320 Q415 280 400 230 Z" fill="url(#heroGrad2)" />
      
      {/* Worker Head */}
      <circle cx="380" cy="195" r="30" fill="#FBBF24" />
      <circle cx="372" cy="190" r="3" fill="#1F2937" />
      <circle cx="388" cy="190" r="3" fill="#1F2937" />
      <path d="M374 205 Q380 210 386 205" stroke="#1F2937" strokeWidth="2" fill="none" />
      
      {/* Hard Hat */}
      <path d="M350 180 Q350 160 380 155 Q410 160 410 180" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
      <rect x="345" y="178" width="70" height="8" rx="2" fill="#F59E0B" />
      
      {/* Tool */}
      <rect x="420" y="240" width="40" height="12" rx="2" fill="#9CA3AF" />
      <rect x="430" y="252" width="20" height="50" rx="2" fill="#78716C" />
      
      {/* Connection Line */}
      <path d="M175 200 Q250 150 350 200" stroke="url(#heroGrad1)" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
      
      {/* Stars/Sparkles */}
      <path d="M320 80 L323 90 L333 90 L325 96 L328 106 L320 100 L312 106 L315 96 L307 90 L317 90 Z" fill="#FCD34D" />
      <path d="M100 120 L102 127 L109 127 L103 131 L105 138 L100 134 L95 138 L97 131 L91 127 L98 127 Z" fill="#FCD34D" />
    </svg>
  );
}

// Service Booking Illustration
export function BookingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-auto', className)}
    >
      <defs>
        <linearGradient id="bookGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        <linearGradient id="bookGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>

      {/* Background Circles */}
      <circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity="0.5" />
      <circle cx="420" cy="320" r="60" fill="#ECFEFF" opacity="0.5" />

      {/* Calendar/Booking Card */}
      <rect x="150" y="80" width="200" height="240" rx="16" fill="white" filter="drop-shadow(0 10px 30px rgba(0,0,0,0.1))" />
      
      {/* Calendar Header */}
      <rect x="150" y="80" width="200" height="50" rx="16" fill="url(#bookGrad1)" />
      <text x="250" y="112" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Book a Service</text>
      
      {/* Calendar Grid */}
      <g fill="#E5E7EB">
        {[0, 1, 2, 3, 4, 5, 6].map((col) =>
          [0, 1, 2, 3].map((row) => (
            <rect
              key={`${col}-${row}`}
              x={165 + col * 25}
              y={145 + row * 25}
              width="20"
              height="20"
              rx="4"
            />
          ))
        )}
      </g>
      
      {/* Selected Date */}
      <rect x="215" y="170" width="20" height="20" rx="4" fill="url(#bookGrad1)" />
      
      {/* Time Slots */}
      <rect x="165" y="260" width="55" height="25" rx="6" fill="#F3E8FF" />
      <text x="192" y="277" textAnchor="middle" fill="#8B5CF6" fontSize="10" fontWeight="500">9:00 AM</text>
      
      <rect x="230" y="260" width="55" height="25" rx="6" fill="url(#bookGrad1)" />
      <text x="257" y="277" textAnchor="middle" fill="white" fontSize="10" fontWeight="500">2:00 PM</text>
      
      <rect x="295" y="260" width="55" height="25" rx="6" fill="#F3E8FF" />
      <text x="322" y="277" textAnchor="middle" fill="#8B5CF6" fontSize="10" fontWeight="500">5:00 PM</text>

      {/* Confirm Button */}
      <rect x="165" y="295" width="170" height="35" rx="8" fill="url(#bookGrad2)" />
      <text x="250" y="318" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">Confirm Booking</text>

      {/* Floating Elements */}
      <g transform="translate(380, 100)">
        <circle r="40" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.1))" />
        <text y="5" textAnchor="middle" fontSize="30">📅</text>
      </g>

      <g transform="translate(80, 250)">
        <circle r="35" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.1))" />
        <text y="5" textAnchor="middle" fontSize="25">✅</text>
      </g>

      <g transform="translate(420, 180)">
        <circle r="30" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.1))" />
        <text y="5" textAnchor="middle" fontSize="22">⏰</text>
      </g>

      {/* Decorative Lines */}
      <path d="M350 120 Q400 140 380 100" stroke="url(#bookGrad1)" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />
      <path d="M80 180 Q60 220 80 250" stroke="url(#bookGrad2)" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />
    </svg>
  );
}

// Worker Growth Illustration
export function GrowthIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-auto', className)}
    >
      <defs>
        <linearGradient id="growGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="growGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="250" cy="200" r="150" fill="#D1FAE5" opacity="0.3" />

      {/* Chart Background */}
      <rect x="100" y="100" width="300" height="200" rx="16" fill="white" filter="drop-shadow(0 10px 30px rgba(0,0,0,0.1))" />

      {/* Chart Grid */}
      <g stroke="#E5E7EB" strokeWidth="1">
        <line x1="130" y1="140" x2="130" y2="270" />
        <line x1="130" y1="270" x2="370" y2="270" />
        <line x1="130" y1="220" x2="370" y2="220" strokeDasharray="4,4" />
        <line x1="130" y1="170" x2="370" y2="170" strokeDasharray="4,4" />
      </g>

      {/* Rising Chart Bars */}
      <rect x="150" y="230" width="30" height="40" rx="4" fill="#D1FAE5" />
      <rect x="200" y="200" width="30" height="70" rx="4" fill="#A7F3D0" />
      <rect x="250" y="170" width="30" height="100" rx="4" fill="#6EE7B7" />
      <rect x="300" y="140" width="30" height="130" rx="4" fill="url(#growGrad1)" />
      <rect x="350" y="110" width="30" height="160" rx="4" fill="url(#growGrad1)" />

      {/* Arrow Up */}
      <path d="M340 90 L360 70 L380 90" stroke="url(#growGrad1)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <line x1="360" y1="70" x2="360" y2="100" stroke="url(#growGrad1)" strokeWidth="3" strokeLinecap="round" />

      {/* Stats Cards */}
      <g transform="translate(60, 320)">
        <rect width="100" height="60" rx="12" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.1))" />
        <text x="50" y="25" textAnchor="middle" fill="#10B981" fontSize="18" fontWeight="700">₹50K+</text>
        <text x="50" y="45" textAnchor="middle" fill="#6B7280" fontSize="10">Monthly Earnings</text>
      </g>

      <g transform="translate(200, 320)">
        <rect width="100" height="60" rx="12" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.1))" />
        <text x="50" y="25" textAnchor="middle" fill="#F59E0B" fontSize="18" fontWeight="700">4.9★</text>
        <text x="50" y="45" textAnchor="middle" fill="#6B7280" fontSize="10">Average Rating</text>
      </g>

      <g transform="translate(340, 320)">
        <rect width="100" height="60" rx="12" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.1))" />
        <text x="50" y="25" textAnchor="middle" fill="#8B5CF6" fontSize="18" fontWeight="700">200+</text>
        <text x="50" y="45" textAnchor="middle" fill="#6B7280" fontSize="10">Jobs Completed</text>
      </g>

      {/* Floating Elements */}
      <g transform="translate(80, 80)">
        <circle r="25" fill="url(#growGrad2)" />
        <text y="5" textAnchor="middle" fontSize="20">💰</text>
      </g>

      <g transform="translate(420, 150)">
        <circle r="25" fill="#E0E7FF" />
        <text y="5" textAnchor="middle" fontSize="20">📈</text>
      </g>
    </svg>
  );
}

// Mobile App Illustration
export function MobileAppIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-auto', className)}
    >
      <defs>
        <linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* Glow Effect */}
      <ellipse cx="150" cy="380" rx="100" ry="20" fill="url(#appGrad)" opacity="0.2" />

      {/* Phone */}
      <rect x="75" y="30" width="150" height="320" rx="24" fill="#1F2937" />
      <rect x="83" y="38" width="134" height="304" rx="20" fill="white" />
      
      {/* Notch */}
      <rect x="115" y="42" width="70" height="6" rx="3" fill="#1F2937" />

      {/* App Header */}
      <rect x="83" y="55" width="134" height="50" fill="url(#appGrad)" />
      <circle cx="103" cy="80" r="12" fill="white" opacity="0.2" />
      <text x="150" y="78" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">LocalConnect</text>
      <text x="150" y="92" textAnchor="middle" fill="white" fontSize="8" opacity="0.8">Find Services</text>

      {/* Search Bar */}
      <rect x="93" y="115" width="114" height="30" rx="15" fill="#F3F4F6" />
      <circle cx="108" cy="130" r="6" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
      <line x1="112" y1="134" x2="116" y2="138" stroke="#9CA3AF" strokeWidth="1.5" />
      <text x="125" y="134" fill="#9CA3AF" fontSize="9">Search services...</text>

      {/* Service Cards */}
      <g transform="translate(93, 155)">
        <rect width="52" height="60" rx="8" fill="#EEF2FF" />
        <text x="26" y="30" textAnchor="middle" fontSize="20">🔧</text>
        <text x="26" y="50" textAnchor="middle" fill="#4F46E5" fontSize="8" fontWeight="500">Plumber</text>
      </g>

      <g transform="translate(155, 155)">
        <rect width="52" height="60" rx="8" fill="#FEF3C7" />
        <text x="26" y="30" textAnchor="middle" fontSize="20">⚡</text>
        <text x="26" y="50" textAnchor="middle" fill="#D97706" fontSize="8" fontWeight="500">Electrician</text>
      </g>

      <g transform="translate(93, 225)">
        <rect width="52" height="60" rx="8" fill="#D1FAE5" />
        <text x="26" y="30" textAnchor="middle" fontSize="20">🧹</text>
        <text x="26" y="50" textAnchor="middle" fill="#059669" fontSize="8" fontWeight="500">Cleaner</text>
      </g>

      <g transform="translate(155, 225)">
        <rect width="52" height="60" rx="8" fill="#FCE7F3" />
        <text x="26" y="30" textAnchor="middle" fontSize="20">🎨</text>
        <text x="26" y="50" textAnchor="middle" fill="#DB2777" fontSize="8" fontWeight="500">Painter</text>
      </g>

      {/* Bottom Navigation */}
      <rect x="83" y="300" width="134" height="42" fill="#F9FAFB" />
      <g fill="#9CA3AF">
        <circle cx="108" cy="318" r="8" fill="#EEF2FF" />
        <text x="108" y="322" textAnchor="middle" fontSize="10">🏠</text>
        <text x="108" y="335" textAnchor="middle" fontSize="6">Home</text>
      </g>
      <g fill="#9CA3AF">
        <circle cx="150" cy="318" r="8" fill="#EEF2FF" />
        <text x="150" y="322" textAnchor="middle" fontSize="10">🔍</text>
        <text x="150" y="335" textAnchor="middle" fontSize="6">Search</text>
      </g>
      <g fill="#9CA3AF">
        <circle cx="192" cy="318" r="8" fill="url(#appGrad)" />
        <text x="192" y="322" textAnchor="middle" fontSize="10">👤</text>
        <text x="192" y="335" textAnchor="middle" fontSize="6" fill="#4F46E5" fontWeight="500">Profile</text>
      </g>

      {/* Floating Notifications */}
      <g transform="translate(30, 100)">
        <rect width="60" height="40" rx="8" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.15))" />
        <text x="30" y="20" textAnchor="middle" fontSize="8" fill="#1F2937" fontWeight="500">New Job!</text>
        <text x="30" y="32" textAnchor="middle" fontSize="7" fill="#10B981">Accept →</text>
      </g>

      <g transform="translate(220, 180)">
        <rect width="55" height="35" rx="8" fill="white" filter="drop-shadow(0 4px 15px rgba(0,0,0,0.15))" />
        <text x="27" y="17" textAnchor="middle" fontSize="7" fill="#1F2937">Rating</text>
        <text x="27" y="28" textAnchor="middle" fontSize="9" fill="#F59E0B" fontWeight="600">⭐ 4.9</text>
      </g>
    </svg>
  );
}
