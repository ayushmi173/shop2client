/**
 * Real-time location/address search.
 * Uses Photon (Komoot) by default (free, no key). Optional Google Places when API key is set.
 */

export interface LocationSuggestionItem {
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
}

const PHOTON_API = 'https://photon.komoot.io/api/';
const MIN_QUERY_LENGTH = 2;

/** Build display string from Photon feature properties */
function formatPhotonDisplayName(props: {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}): string {
  const parts = [
    props.name || props.street,
    props.city,
    props.state,
    props.country,
  ].filter(Boolean);
  return parts.join(', ') || 'Unknown';
}

/**
 * Fetch real-time location suggestions from Photon (OSM-based, free, no API key).
 * Returns addresses and places worldwide.
 */
export async function fetchLocationSuggestions(
  query: string,
  limit = 8,
): Promise<LocationSuggestionItem[]> {
  const q = query.trim();
  if (q.length < MIN_QUERY_LENGTH) return [];

  const params = new URLSearchParams({
    q,
    limit: String(limit),
    lang: 'en',
  });

  const res = await fetch(`${PHOTON_API}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as {
    features?: Array<{
      properties?: {
        name?: string;
        street?: string;
        city?: string;
        state?: string;
        country?: string;
      };
      geometry?: { coordinates?: [number, number] };
    }>;
  };

  const features = data.features ?? [];
  return features.map((f) => {
    const props = f.properties ?? {};
    const coords = f.geometry?.coordinates;
    return {
      displayName: formatPhotonDisplayName(props),
      city: props.city,
      state: props.state,
      country: props.country,
      latitude: coords ? coords[1] : undefined,
      longitude: coords ? coords[0] : undefined,
    };
  });
}

/** Static list for "popular" when input is empty or as fallback */
export const SUGGESTED_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'New Delhi',
  'Gurgaon',
  'Noida',
  'Chandigarh',
] as const;

export function getMatchingCities(query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...SUGGESTED_CITIES].slice(0, limit);
  return SUGGESTED_CITIES.filter((city) => city.toLowerCase().includes(q)).slice(0, limit);
}
