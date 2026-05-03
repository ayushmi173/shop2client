'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvailabilityBadgeProps {
  available: boolean;
  className?: string;
}

export function AvailabilityBadge({ available, className }: AvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        available
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-slate-100 text-slate-600 border border-slate-200',
        className,
      )}
    >
      <Clock
        className={cn('w-3 h-3', available && 'text-emerald-500')}
        strokeWidth={2.5}
      />
      {available ? 'Available' : 'Not available'}
    </span>
  );
}
