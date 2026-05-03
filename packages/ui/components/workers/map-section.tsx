'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWorkerCoords } from '@/lib/worker-coords';
import type { WorkerListItem } from '@/types';

const WorkersMapLeaflet = dynamic(
  () => import('./workers-map-leaflet').then((m) => ({ default: m.WorkersMapLeaflet })),
  { ssr: false, loading: () => <MapSectionSkeleton /> },
);

export interface MapSectionProps {
  workers: WorkerListItem[];
  selectedWorkerId: string | null;
  onSelectWorker: (workerId: string) => void;
  className?: string;
}

function MapSectionSkeleton() {
  return (
    <div className="h-full min-h-[280px] rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center">
      <span className="text-sm text-slate-500">Loading map…</span>
    </div>
  );
}

/** Get mock pin position (percent) when lat/lng not provided */
function getPinPosition(index: number, total: number): { left: number; top: number } {
  if (total <= 0) return { left: 50, top: 50 };
  const spread = 32;
  const step = total > 1 ? spread / (total - 1) : 0;
  const x = 20 + (index * step) % spread;
  const y = 25 + (index * 11) % 45;
  return { left: Math.min(75, x), top: Math.min(70, y) };
}

function MockMapSection({
  workers,
  selectedWorkerId,
  onSelectWorker,
  className,
}: MapSectionProps) {
  return (
    <div
      className={cn(
        'relative h-full min-h-[280px] rounded-2xl overflow-hidden shadow-md bg-slate-100',
        'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px]',
        className,
      )}
      aria-label="Map showing worker locations"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/80 to-indigo-50/30" />
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgb(148_163_184/0.15)_1px,transparent_0)] [background-size:20px_20px]" />

      {workers.map((worker, index) => {
        const coords = getWorkerCoords(worker);
        const pos = coords
          ? { left: 50 + (coords.lng - 78) * 2, top: 50 - (coords.lat - 21) * 2 }
          : getPinPosition(index, workers.length);
        const isSelected = selectedWorkerId === worker.id;

        return (
          <button
            key={worker.id}
            type="button"
            onClick={() => onSelectWorker(worker.id)}
            className={cn(
              'absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full',
            )}
            style={{ left: `${Math.min(90, Math.max(10, pos.left))}%`, top: `${Math.min(85, Math.max(10, pos.top))}%` }}
            aria-label={`${worker.user.firstName} - Show on list`}
            aria-pressed={isSelected}
          >
            <MapPin
              className={cn(
                'w-9 h-9 drop-shadow-md transition-transform duration-200',
                isSelected
                  ? 'text-primary fill-primary scale-125'
                  : 'text-primary fill-white hover:scale-110',
              )}
            />
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-xs text-slate-500 shadow-sm">
        Map · Pins show worker locations
      </div>
    </div>
  );
}

export function MapSection(props: MapSectionProps) {
  const { workers } = props;
  const workersWithCoords = workers.filter((w) => getWorkerCoords(w) != null);

  if (workersWithCoords.length > 0) {
    return (
      <div className={cn('h-full min-h-[280px]', props.className)}>
        <WorkersMapLeaflet
          workers={workers}
          selectedWorkerId={props.selectedWorkerId}
          onSelectWorker={props.onSelectWorker}
          className="h-full w-full"
        />
      </div>
    );
  }

  return <MockMapSection {...props} />;
}
