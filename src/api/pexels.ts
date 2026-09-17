export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
};

export type PexelsSearchResponse = {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  photos: PexelsPhoto[];
};

export type PexelsOrientation = 'landscape' | 'portrait' | 'square';
export type PexelsSize = 'large' | 'medium' | 'small';

export type PexelsPhotoFilters = {
  page?: number;
  perPage?: number;
  orientation?: PexelsOrientation | '';
  size?: PexelsSize | '';
  color?: string;
};

const DEV_PROXY = '/pexels-api';
const PEXELS_HOST = 'https://api.pexels.com/v1';

function pexelsBase() {
  return import.meta.env.DEV ? DEV_PROXY : PEXELS_HOST;
}

function pexelsHeaders(): HeadersInit {
  const key = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;
  if (import.meta.env.DEV) return {};
  if (!key) throw new Error('VITE_PEXELS_API_KEY is not set');
  return { Authorization: key };
}

export function buildPexelsSearchParams(query: string, options: PexelsPhotoFilters = {}): URLSearchParams {
  const params = new URLSearchParams({
    query,
    page: String(options.page || 1),
    per_page: String(options.perPage || 8),
  });
  if (options.orientation) params.set('orientation', options.orientation);
  if (options.size) params.set('size', options.size);
  if (options.color) params.set('color', options.color);
  return params;
}

export async function searchPexelsPhotos(
  query: string,
  options: PexelsPhotoFilters = {}
): Promise<PexelsSearchResponse> {
  const params = buildPexelsSearchParams(query, options);
  const response = await fetch(`${pexelsBase()}/search?${params}`, {
    headers: pexelsHeaders(),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error === 'string' ? body.error : `Pexels request failed (${response.status})`;
    throw new Error(message);
  }
  return body as PexelsSearchResponse;
}

export async function getCuratedPexelsPhotos(
  options: { page?: number; perPage?: number } = {}
): Promise<PexelsSearchResponse> {
  const params = new URLSearchParams({
    page: String(options.page || 1),
    per_page: String(options.perPage || 8),
  });
  const response = await fetch(`${pexelsBase()}/curated?${params}`, {
    headers: pexelsHeaders(),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error === 'string' ? body.error : `Pexels request failed (${response.status})`;
    throw new Error(message);
  }
  return body as PexelsSearchResponse;
}
