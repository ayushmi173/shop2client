'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocationSuggestions } from '@/lib/hooks/use-location-suggestions';
import type { Profession } from '@/types';

export interface FilterBarFilters {
  search: string;
  professionSlug: string;
  minRating: string;
  availableNow: boolean;
  isVerified: string;
  sortBy: string;
  /** Optional coordinates when user selects an address (for distance-based search) */
  latitude?: number;
  longitude?: number;
}

export interface LocationSuggestion {
  city: string;
  workerCount: number;
}

export interface FilterBarProps {
  filters: FilterBarFilters;
  onFiltersChange: (filters: FilterBarFilters) => void;
  professions?: Profession[];
  resultCount?: number;
  /** Cities from current worker results (for "X workers in Y" suggestions) */
  resultLocationSuggestions?: LocationSuggestion[];
  onClearFilters?: () => void;
  activeFilterCount?: number;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'trustScore', label: 'Trust Score' },
  { value: 'rating', label: 'Rating' },
  { value: 'distance', label: 'Distance' },
  { value: 'price', label: 'Price' },
  { value: 'experience', label: 'Experience' },
];

export function FilterBar({
  filters,
  onFiltersChange,
  professions = [],
  resultCount,
  resultLocationSuggestions = [],
  onClearFilters,
  activeFilterCount = 0,
  className,
}: FilterBarProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { apiSuggestions, staticSuggestions, isLoading } = useLocationSuggestions(filters.search, {
    enabled: suggestionsOpen,
  });

  const update = (partial: Partial<FilterBarFilters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const searchLower = filters.search.trim().toLowerCase();
  const resultCitiesFiltered = resultLocationSuggestions.filter((r) =>
    r.city.toLowerCase().includes(searchLower),
  ).slice(0, 5);

  const hasSuggestions =
    resultCitiesFiltered.length > 0 ||
    apiSuggestions.length > 0 ||
    staticSuggestions.length > 0 ||
    isLoading;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLocation = (displayName: string, latLng?: { latitude: number; longitude: number }) => {
    update({
      search: displayName,
      latitude: latLng?.latitude,
      longitude: latLng?.longitude,
    });
    setSuggestionsOpen(false);
  };

  return (
    <div
      className={cn(
        'sticky top-0 z-10 bg-[#F8FAFC] border-b border-slate-200/80 shadow-sm',
        className,
      )}
    >
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]" ref={containerRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <Input
              type="search"
              placeholder="Search address or city..."
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                  setSuggestionsOpen(false);
                }
              }}
              className="pl-9 h-10 rounded-xl border-slate-200 bg-white shadow-sm"
              aria-label="Search workers by city"
              aria-expanded={suggestionsOpen && hasSuggestions}
              aria-haspopup="listbox"
              role="combobox"
            />

            {/* Location suggestions dropdown – real-time addresses & places */}
            {suggestionsOpen && hasSuggestions && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg z-20 max-h-[320px] overflow-y-auto py-1"
                role="listbox"
              >
                {resultCitiesFiltered.length > 0 && (
                  <div className="px-3 py-1.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      In your results
                    </p>
                    {resultCitiesFiltered.map(({ city, workerCount }) => (
                      <button
                        key={city}
                        type="button"
                        role="option"
                        className="w-full flex items-center gap-2 px-2 py-2 text-left text-sm rounded-lg hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                        onClick={() => selectLocation(city)}
                      >
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{city}</span>
                        <span className="text-slate-500 text-xs ml-auto">
                          {workerCount} worker{workerCount !== 1 ? 's' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {(resultCitiesFiltered.length > 0 && (apiSuggestions.length > 0 || isLoading || staticSuggestions.length > 0)) && (
                  <div className="border-t border-slate-100 my-1" />
                )}
                {isLoading && (
                  <div className="px-3 py-2 text-sm text-slate-500">Searching addresses…</div>
                )}
                {!isLoading && apiSuggestions.length > 0 && (
                  <div className="px-3 py-1.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      Addresses & places
                    </p>
                    {apiSuggestions.map((item, idx) => (
                      <button
                        key={`${item.displayName}-${idx}`}
                        type="button"
                        role="option"
                        className="w-full flex items-center gap-2 px-2 py-2 text-left text-sm rounded-lg hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                        onClick={() =>
                          selectLocation(
                            item.displayName,
                            item.latitude != null && item.longitude != null
                              ? { latitude: item.latitude, longitude: item.longitude }
                              : undefined,
                          )
                        }
                      >
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{item.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
                {!isLoading && apiSuggestions.length === 0 && staticSuggestions.length > 0 && (
                  <div className="px-3 py-1.5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                      {filters.search.trim() ? 'Popular cities' : 'Suggestions'}
                    </p>
                    {staticSuggestions.map((city) => (
                      <button
                        key={city}
                        type="button"
                        role="option"
                        className="w-full flex items-center gap-2 px-2 py-2 text-left text-sm rounded-lg hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                        onClick={() => selectLocation(city)}
                      >
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.professionSlug}
              onChange={(e) => update({ professionSlug: e.target.value })}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm min-w-[140px]"
            >
              <option value="">All Services</option>
              {professions.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={filters.minRating}
              onChange={(e) => update({ minRating: e.target.value })}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm min-w-[120px]"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+</option>
              <option value="4">4+</option>
              <option value="3.5">3.5+</option>
              <option value="3">3+</option>
            </select>

            <label className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.availableNow}
                onChange={(e) => update({ availableNow: e.target.checked })}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Available Now
              </span>
            </label>

            <select
              value={filters.isVerified}
              onChange={(e) => update({ isVerified: e.target.value })}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm min-w-[120px]"
            >
              <option value="">All Workers</option>
              <option value="true">Verified only</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => update({ sortBy: e.target.value })}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm min-w-[130px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {activeFilterCount > 0 && onClearFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-slate-600 hover:text-slate-900"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {resultCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-slate-700">{resultCount}</span> workers found
          </p>
        )}
      </div>
    </div>
  );
}
