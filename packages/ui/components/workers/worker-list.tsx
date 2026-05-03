'use client';

import { useEffect, useRef } from 'react';
import { WorkerCard } from './worker-card';
import type { WorkerListItem } from '@/types';

export interface WorkerListProps {
  workers: WorkerListItem[];
  selectedWorkerId: string | null;
  onSelectWorker: (workerId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onContact?: (worker: WorkerListItem) => void;
  className?: string;
}

function WorkerCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 animate-pulse">
      <div className="flex gap-5">
        <div className="w-20 h-20 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-100" />
            <div className="h-6 w-20 rounded-full bg-slate-100" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="h-2 bg-slate-100 rounded w-1/2" />
          <div className="flex gap-2 pt-4">
            <div className="h-9 w-24 rounded-xl bg-slate-100" />
            <div className="h-9 w-28 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkerList({
  workers,
  selectedWorkerId,
  onSelectWorker,
  isLoading,
  emptyMessage = 'No workers found. Try adjusting your filters.',
  onContact,
  className,
}: WorkerListProps) {
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedWorkerId && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedWorkerId]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <WorkerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div
        className={className}
        role="status"
        aria-label="No results"
      >
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <div className="text-5xl mb-4" aria-hidden>
            🔍
          </div>
          <h3 className="font-semibold text-lg text-slate-800 mb-2">No workers found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} role="list">
      <div className="space-y-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            ref={selectedWorkerId === worker.id ? selectedRef : null}
            role="listitem"
          >
            <WorkerCard
              worker={worker}
              variant="list"
              isSelected={selectedWorkerId === worker.id}
              onSelect={() => onSelectWorker(worker.id)}
              onContact={onContact ? () => onContact(worker) : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
