'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { SlidersHorizontal, Map as MapIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterBar, type FilterBarFilters } from '@/components/workers/filter-bar';
import { WorkerList } from '@/components/workers/worker-list';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import type { WorkerListItem, Profession, PaginatedResponse } from '@/types';

const MapSection = dynamic(
  () => import('@/components/workers/map-section').then((m) => ({ default: m.MapSection })),
  { ssr: false, loading: () => <div className="min-h-[280px] rounded-2xl bg-slate-200 animate-pulse" /> },
);

const LOCATION_SEARCH_DEBOUNCE_MS = 400;

const defaultFilters: FilterBarFilters = {
  search: '',
  professionSlug: '',
  minRating: '',
  availableNow: false,
  isVerified: '',
  sortBy: 'trustScore',
  latitude: undefined,
  longitude: undefined,
};

export default function WorkersPage() {
  const searchParams = useSearchParams();
  const initialProfession = searchParams.get('profession') || '';

  const [filters, setFilters] = useState<FilterBarFilters>({
    ...defaultFilters,
    professionSlug: initialProfession,
  });

  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);

  const locationSearch = (filters.search || '').trim();
  const debouncedLocationSearch = useDebouncedValue(
    locationSearch,
    LOCATION_SEARCH_DEBOUNCE_MS,
  );

  const { data: professionsData } = useQuery({
    queryKey: ['professions'],
    queryFn: async () => {
      const response = await api.get<Profession[]>('/api/v1/professions');
      return response.data || [];
    },
  });

  const { data: workersData, isLoading, error } = useQuery({
    queryKey: [
      'workers',
      debouncedLocationSearch,
      filters.latitude,
      filters.longitude,
      filters.professionSlug,
      filters.minRating,
      filters.availableNow,
      filters.isVerified,
      filters.sortBy,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.professionSlug) params.append('professionSlug', filters.professionSlug);
      if (debouncedLocationSearch) {
        params.append('city', debouncedLocationSearch);
      }
      if (filters.latitude != null && filters.longitude != null) {
        params.append('latitude', String(filters.latitude));
        params.append('longitude', String(filters.longitude));
      }
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.availableNow) params.append('isAvailable', 'true');
      if (filters.isVerified) params.append('isVerified', filters.isVerified);
      params.append('sortBy', filters.sortBy);
      params.append('page', '1');
      params.append('limit', '20');

      const response = await api.get<PaginatedResponse<WorkerListItem>>(
        `/api/v1/workers/search?${params.toString()}`,
      );
      return response;
    },
  });

  const workers = workersData?.data || [];
  const meta = workersData?.meta;

  const resultLocationSuggestions = useMemo(() => {
    const byCity = new Map<string, number>();
    for (const w of workers) {
      const city = w.location?.city;
      if (city) byCity.set(city, (byCity.get(city) ?? 0) + 1);
    }
    return Array.from(byCity.entries())
      .map(([city, workerCount]) => ({ city, workerCount }))
      .sort((a, b) => b.workerCount - a.workerCount);
  }, [workers]);

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultFilters });
  }, []);

  const activeFilterCount = [
    filters.search,
    filters.professionSlug,
    filters.minRating,
    filters.availableNow,
    filters.isVerified,
  ].filter((v) => (typeof v === 'string' ? v !== '' : v === true)).length;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] flex-1 bg-[#F8FAFC]">
      {/* Mobile: Filters slide-over */}
      {showFiltersMobile && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setShowFiltersMobile(false)}
            aria-hidden
          />
          <aside className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white z-10">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFiltersMobile(false)}
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              professions={professionsData}
              resultCount={meta?.totalItems}
              resultLocationSuggestions={resultLocationSuggestions}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
              className="!static border-0 shadow-none bg-transparent"
            />
            </div>
          </aside>
        </>
      )}

      <div className="flex flex-1 min-h-0">
        {/* LEFT: Map (40%) - hidden on mobile unless toggled */}
        <section
          className={cn(
            'hidden lg:flex lg:w-[40%] flex-shrink-0 flex-col p-4 pl-6 min-h-0 lg:min-h-[420px]',
            showMapMobile && '!flex fixed inset-0 z-30 bg-[#F8FAFC] p-4 h-full',
          )}
          aria-label="Map"
        >
          {showMapMobile && (
            <div className="flex items-center justify-between mb-3 lg:hidden">
              <h3 className="font-semibold">Map</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMapMobile(false)}
                aria-label="Close map"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
          <div className="lg:flex lg:items-center lg:gap-2 lg:mb-2">
            <h2 className="hidden lg:block text-sm font-semibold text-slate-600">Map</h2>
            {locationSearch && (
              <span className="hidden lg:inline text-xs text-muted-foreground truncate">
                · {locationSearch}
              </span>
            )}
          </div>
          <div className="flex-1 min-h-[280px] lg:min-h-[360px] rounded-2xl overflow-hidden shadow-md">
            <MapSection
              workers={workers}
              selectedWorkerId={selectedWorkerId}
              onSelectWorker={setSelectedWorkerId}
              className="h-full"
            />
          </div>
        </section>

        {/* RIGHT: Results (60%) */}
        <section
          className="flex flex-col flex-1 min-w-0 min-h-0 bg-[#F8FAFC]"
          aria-label="Worker results"
        >
          {/* Sticky filter bar (desktop) */}
          <div className="hidden lg:block">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              professions={professionsData}
              resultCount={meta?.totalItems}
              resultLocationSuggestions={resultLocationSuggestions}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Mobile: Filter + Map toggles + result count */}
          <div className="lg:hidden flex flex-col gap-2 p-3 border-b border-slate-200 bg-white/80">
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
              onClick={() => setShowFiltersMobile(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-xs font-medium text-primary">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl"
              onClick={() => setShowMapMobile(true)}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Show Map
            </Button>
            </div>
            {meta != null && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-slate-700">{meta.totalItems}</span> workers found
              </p>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-4 pr-6">
            {error ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Failed to load workers. Please try again.
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : (
              <WorkerList
                workers={workers}
                selectedWorkerId={selectedWorkerId}
                onSelectWorker={setSelectedWorkerId}
                isLoading={isLoading}
                emptyMessage="Try adjusting your filters or search in a different area."
              />
            )}

            {/* Pagination - if backend supports it */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6 pb-4">
                <Button variant="outline" size="sm" disabled>
                  Load more
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
