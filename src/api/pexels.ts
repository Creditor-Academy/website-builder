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

export type PexelsVideoFile = {
  id: number;
  quality: string;
  file_type: string;
  width?: number;
  height?: number;
  link: string;
};

export type PexelsVideo = {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  image: string;
  user?: { id: number; name: string; url: string };
  video_files: PexelsVideoFile[];
  video_pictures?: { id: number; picture: string; nr: number }[];
};

export type PexelsVideoSearchResponse = {
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  videos: PexelsVideo[];
};

export type PexelsOrientation = 'landscape' | 'portrait' | 'square';
export type PexelsSize = 'large' | 'medium' | 'small';
export type PexelsMediaType = 'images' | 'videos';

export type PexelsPhotoFilters = {
  page?: number;
  perPage?: number;
  orientation?: PexelsOrientation | '';
  size?: PexelsSize | '';
  color?: string;
};

export type PexelsVideoFilters = {
  page?: number;
  perPage?: number;
  orientation?: PexelsOrientation | '';
  size?: PexelsSize | '';
};

const DEV_PROXY = '/pexels-api';
const PEXELS_PHOTO_HOST = 'https://api.pexels.com/v1';
const PEXELS_VIDEO_HOST = 'https://api.pexels.com/videos';

function pexelsPhotoBase() {
  return import.meta.env.DEV ? DEV_PROXY : PEXELS_PHOTO_HOST;
}

function pexelsVideoBase() {
  return import.meta.env.DEV ? `${DEV_PROXY}/videos` : PEXELS_VIDEO_HOST;
}

function pexelsHeaders(): HeadersInit {
  const key = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;
  if (import.meta.env.DEV) return {};
  if (!key) throw new Error('VITE_PEXELS_API_KEY is not set');
  return { Authorization: key };
}

async function pexelsFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: pexelsHeaders() });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body?.error === 'string' ? body.error : `Pexels request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
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

export function buildPexelsVideoSearchParams(query: string, options: PexelsVideoFilters = {}): URLSearchParams {
  const params = new URLSearchParams({
    query,
    page: String(options.page || 1),
    per_page: String(options.perPage || 8),
  });
  if (options.orientation) params.set('orientation', options.orientation);
  if (options.size) params.set('size', options.size);
  return params;
}

export async function searchPexelsPhotos(
  query: string,
  options: PexelsPhotoFilters = {}
): Promise<PexelsSearchResponse> {
  const params = buildPexelsSearchParams(query, options);
  return pexelsFetch<PexelsSearchResponse>(`${pexelsPhotoBase()}/search?${params}`);
}

export async function getCuratedPexelsPhotos(
  options: { page?: number; perPage?: number } = {}
): Promise<PexelsSearchResponse> {
  const params = new URLSearchParams({
    page: String(options.page || 1),
    per_page: String(options.perPage || 8),
  });
  return pexelsFetch<PexelsSearchResponse>(`${pexelsPhotoBase()}/curated?${params}`);
}

export async function searchPexelsVideos(
  query: string,
  options: PexelsVideoFilters = {}
): Promise<PexelsVideoSearchResponse> {
  const params = buildPexelsVideoSearchParams(query, options);
  return pexelsFetch<PexelsVideoSearchResponse>(`${pexelsVideoBase()}/search?${params}`);
}

export async function getPopularPexelsVideos(
  options: { page?: number; perPage?: number } = {}
): Promise<PexelsVideoSearchResponse> {
  const params = new URLSearchParams({
    page: String(options.page || 1),
    per_page: String(options.perPage || 8),
  });
  return pexelsFetch<PexelsVideoSearchResponse>(`${pexelsVideoBase()}/popular?${params}`);
}

export function videoFileUrl(video: PexelsVideo) {
  const files = video.video_files || [];
  const mp4 = files.filter((file) => (file.file_type || '').includes('mp4') || file.link.includes('.mp4'));
  const ranked = (mp4.length ? mp4 : files).slice().sort((a, b) => {
    const rank = (quality: string) => (quality === 'hd' ? 2 : quality === 'sd' ? 1 : 0);
    return rank(b.quality) - rank(a.quality);
  });
  return ranked[0]?.link || '';
}

export function videoName(video: PexelsVideo) {
  return `Video by ${video.user?.name || 'Pexels'}`.slice(0, 80);
}

export function videoThumbnails(video: PexelsVideo) {
  const frames = (video.video_pictures || [])
    .slice()
    .sort((a, b) => (a.nr ?? 0) - (b.nr ?? 0))
    .map((item) => item.picture)
    .filter(Boolean);
  const mid = frames[Math.min(1, Math.max(0, frames.length - 1))];
  return [...new Set([video.image, mid, ...frames].filter(Boolean))];
}

export function videoThumb(video: PexelsVideo) {
  return videoThumbnails(video)[0] || '';
}
