'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLocationSuggestions, getMatchingCities, type LocationSuggestionItem } from '@/lib/location-suggestions';
import { useDebouncedValue } from './use-debounced-value';

const DEBOUNCE_MS = 350;

export interface UseLocationSuggestionsResult {
  /** Real-time suggestions from API (addresses & places) */
  apiSuggestions: LocationSuggestionItem[];
  /** Static matching cities (when query is short or as fallback) */
  staticSuggestions: string[];
  isLoading: boolean;
}

/**
 * Returns real-time location/address suggestions for the given search query.
 * Debounces input and fetches from Photon (OSM) for exact address search.
 */
export function useLocationSuggestions(
  query: string,
  options?: { enabled?: boolean },
): UseLocationSuggestionsResult {
  const enabled = options?.enabled ?? true;
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS);

  const [apiSuggestions, setApiSuggestions] = useState<LocationSuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const staticSuggestions = getMatchingCities(query, 6);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setApiSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await fetchLocationSuggestions(q, 8);
      setApiSuggestions(results);
    } catch {
      setApiSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, enabled, fetchSuggestions]);

  return {
    apiSuggestions,
    staticSuggestions,
    isLoading,
  };
}
