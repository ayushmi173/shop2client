'use client';

import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { getWorkerCoords } from '@/lib/worker-coords';
import type { WorkerListItem } from '@/types';

import 'leaflet/dist/leaflet.css';

export { getWorkerCoords };

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]; // India
const DEFAULT_ZOOM = 5;

function createMarkerIcon(isSelected: boolean) {
  return L.divIcon({
    html: `<span class="inline-flex items-center justify-center rounded-full shadow-lg transition-transform ${
      isSelected ? 'scale-125 bg-primary text-white ring-4 ring-primary/40' : 'bg-white text-primary border-2 border-primary'
    }" style="width: 40px; height: 40px;"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></span>`,
    className: 'border-0 bg-transparent',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
}

function FitBounds({ workers }: { workers: WorkerListItem[] }) {
  const map = useMap();
  const coords = useMemo(() => workers.map((w) => getWorkerCoords(w)).filter(Boolean) as { lat: number; lng: number }[], [workers]);

  useEffect(() => {
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView([coords[0].lat, coords[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(coords.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, coords]);

  return null;
}

export interface WorkersMapLeafletProps {
  workers: WorkerListItem[];
  selectedWorkerId: string | null;
  onSelectWorker: (workerId: string) => void;
  className?: string;
}

export function WorkersMapLeaflet({
  workers,
  selectedWorkerId,
  onSelectWorker,
  className,
}: WorkersMapLeafletProps) {
  const workersWithCoords = useMemo(
    () => workers.map((w) => ({ worker: w, coords: getWorkerCoords(w) })).filter((x) => x.coords != null) as { worker: WorkerListItem; coords: { lat: number; lng: number } }[],
    [workers],
  );

  const center = useMemo((): [number, number] => {
    if (workersWithCoords.length === 0) return DEFAULT_CENTER;
    const first = workersWithCoords[0].coords;
    return [first.lat, first.lng];
  }, [workersWithCoords]);

  if (workersWithCoords.length === 0) {
    return null;
  }

  return (
    <div className={cn('h-full w-full rounded-2xl overflow-hidden shadow-md leaflet-container-custom', className)}>
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full rounded-2xl"
        scrollWheelZoom
        style={{ minHeight: 280 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds workers={workers} />
        {workersWithCoords.map(({ worker, coords }) => (
          <Marker
            key={worker.id}
            position={[coords.lat, coords.lng]}
            icon={createMarkerIcon(selectedWorkerId === worker.id)}
            eventHandlers={{
              click: () => onSelectWorker(worker.id),
            }}
          >
            <Popup>
              <div className="text-sm font-medium">
                {worker.user.firstName} {worker.user.lastName}
              </div>
              <div className="text-xs text-gray-500">
                {worker.professions.find((p) => p.isPrimary)?.name ?? worker.professions[0]?.name}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
