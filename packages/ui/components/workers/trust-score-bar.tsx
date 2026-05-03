'use client';

import { cn } from '@/lib/utils';

interface TrustScoreBarProps {
  score: number; // 0–10
  showLabel?: boolean;
  className?: string;
}

export function TrustScoreBar({
  score,
  showLabel = true,
  className,
}: TrustScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (score / 10) * 100));
  const isHigh = score >= 8;
  const isMid = score >= 5 && score < 8;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isHigh && 'bg-emerald-500',
            isMid && 'bg-amber-500',
            !isHigh && !isMid && 'bg-slate-400',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          Trust score {score.toFixed(1)}/10
        </span>
      )}
    </div>
  );
}
