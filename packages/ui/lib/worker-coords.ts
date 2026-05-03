import type { WorkerListItem } from '@/types';

export function getWorkerCoords(worker: WorkerListItem): { lat: number; lng: number } | null {
  const lat = worker.location?.latitude ?? worker.latitude;
  const lng = worker.location?.longitude ?? worker.longitude;
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }
  return null;
}
