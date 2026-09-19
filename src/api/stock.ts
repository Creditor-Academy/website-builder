import assetApi from '@/api/assets';
import {
  getCuratedPexelsPhotos,
  getPopularPexelsVideos,
  searchPexelsPhotos,
  searchPexelsVideos,
  type PexelsPhoto,
  type PexelsPhotoFilters,
  type PexelsSearchResponse,
  type PexelsVideo,
  type PexelsVideoFile,
  type PexelsVideoFilters,
  type PexelsVideoSearchResponse,
} from '@/api/pexels';

export type StockMediaItem = {
  name: string;
  url: string;
  media: 'image' | 'video';
  provider?: string;
  providerId?: string | number;
};

type StockSearchParams = {
  query?: string;
  page?: number;
  per_page?: number;
  media_type?: string;
  type?: string;
  orientation?: string;
  size?: string;
  color?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

function pickNumber(...values: unknown[]): number {
  for (const value of values) {
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

function unwrapPayload(data: unknown): Record<string, unknown> {
  const root = asRecord(data);
  const nested = asRecord(root.data);
  return Object.keys(nested).length ? { ...root, ...nested } : root;
}

export function mapStockPhoto(raw: unknown): PexelsPhoto {
  const item = asRecord(raw);
  const srcRaw = asRecord(item.src);
  const url = pickString(
    item.url,
    item.download_url,
    item.downloadUrl,
    item.src_large,
    srcRaw.large,
    srcRaw.large2x,
    srcRaw.original,
    srcRaw.medium,
    item.preview_url,
    item.previewUrl,
    item.image
  );
  const src = {
    original: pickString(srcRaw.original, url),
    large2x: pickString(srcRaw.large2x, srcRaw.large, url),
    large: pickString(srcRaw.large, url),
    medium: pickString(srcRaw.medium, srcRaw.large, url),
    small: pickString(srcRaw.small, srcRaw.medium, url),
    portrait: pickString(srcRaw.portrait, srcRaw.large, url),
    landscape: pickString(srcRaw.landscape, srcRaw.large, url),
    tiny: pickString(srcRaw.tiny, srcRaw.small, url),
  };
  return {
    id: pickNumber(item.id, item.provider_id, item.providerId) || Date.now(),
    width: pickNumber(item.width) || 1200,
    height: pickNumber(item.height) || 800,
    url: pickString(item.page_url, item.pageUrl, item.url, url),
    photographer: pickString(item.photographer, asRecord(item.user).name, item.author, 'Stock'),
    photographer_url: pickString(item.photographer_url, item.photographerUrl, asRecord(item.user).url, ''),
    alt: pickString(item.alt, item.alt_text, item.name, item.title, 'Stock photo'),
    src,
  };
}

export function mapStockVideo(raw: unknown): PexelsVideo {
  const item = asRecord(raw);
  const filesRaw = Array.isArray(item.video_files) ? item.video_files : Array.isArray(item.videoFiles) ? item.videoFiles : [];
  const files: PexelsVideoFile[] = filesRaw.map((file) => {
    const record = asRecord(file);
    return {
      id: pickNumber(record.id) || 0,
      quality: pickString(record.quality, 'hd'),
      file_type: pickString(record.file_type, record.fileType, 'video/mp4'),
      width: pickNumber(record.width) || undefined,
      height: pickNumber(record.height) || undefined,
      link: pickString(record.link, record.url),
    };
  });
  const fallbackUrl = pickString(item.download_url, item.downloadUrl, item.url, item.preview_url);
  if (!files.length && fallbackUrl) {
    files.push({ id: 0, quality: 'hd', file_type: 'video/mp4', link: fallbackUrl });
  }
  const pictures = Array.isArray(item.video_pictures) ? item.video_pictures : Array.isArray(item.videoPictures) ? item.videoPictures : [];
  return {
    id: pickNumber(item.id, item.provider_id, item.providerId) || Date.now(),
    width: pickNumber(item.width) || 1280,
    height: pickNumber(item.height) || 720,
    duration: pickNumber(item.duration) || 0,
    url: pickString(item.page_url, item.pageUrl, item.url, fallbackUrl),
    image: pickString(item.image, item.preview_url, item.previewUrl, item.thumbnail),
    user: {
      id: pickNumber(asRecord(item.user).id) || 0,
      name: pickString(asRecord(item.user).name, item.photographer, item.author, 'Stock'),
      url: pickString(asRecord(item.user).url, ''),
    },
    video_files: files,
    video_pictures: pictures.map((picture, index) => {
      const record = asRecord(picture);
      return {
        id: pickNumber(record.id) || index,
        picture: pickString(record.picture, record.url),
        nr: pickNumber(record.nr) || index,
      };
    }),
  };
}

export function normalizeStockSearchResponse(data: unknown, mediaType: 'images' | 'videos'): {
  photos: PexelsPhoto[];
  videos: PexelsVideo[];
  total: number;
  next?: string;
} {
  const payload = unwrapPayload(data);
  const photosRaw = Array.isArray(payload.photos) ? payload.photos : [];
  const videosRaw = Array.isArray(payload.videos) ? payload.videos : [];
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.results)
      ? payload.results
      : [];

  const photos = photosRaw.length
    ? photosRaw.map(mapStockPhoto)
    : items
        .filter((item) => {
          const record = asRecord(item);
          const kind = pickString(record.media_type, record.type, record.kind).toLowerCase();
          return !kind || kind === 'photo' || kind === 'image' || kind === 'images';
        })
        .map(mapStockPhoto);

  const videos = videosRaw.length
    ? videosRaw.map(mapStockVideo)
    : items
        .filter((item) => {
          const record = asRecord(item);
          const kind = pickString(record.media_type, record.type, record.kind).toLowerCase();
          return kind === 'video' || kind === 'videos';
        })
        .map(mapStockVideo);

  const total = pickNumber(payload.total_results, payload.total, payload.count) || (mediaType === 'videos' ? videos.length : photos.length);
  const next = pickString(payload.next_page, payload.nextPage) || undefined;
  return { photos, videos, total, next };
}

async function searchBackendStock(params: StockSearchParams) {
  const response = await assetApi.searchStock(params);
  return response.data;
}

export async function searchStockPhotos(
  query: string,
  options: PexelsPhotoFilters = {}
): Promise<PexelsSearchResponse> {
  try {
    const data = await searchBackendStock({
      query,
      page: options.page || 1,
      per_page: options.perPage || 8,
      media_type: 'photo',
      type: 'photo',
      orientation: options.orientation || undefined,
      size: options.size || undefined,
      color: options.color || undefined,
    });
    const mapped = normalizeStockSearchResponse(data, 'images');
    return {
      page: options.page || 1,
      per_page: options.perPage || 8,
      total_results: mapped.total,
      next_page: mapped.next,
      photos: mapped.photos,
    };
  } catch {
    return searchPexelsPhotos(query, options);
  }
}

export async function getCuratedStockPhotos(
  options: { page?: number; perPage?: number } = {}
): Promise<PexelsSearchResponse> {
  try {
    return await searchStockPhotos('photo', options);
  } catch {
    return getCuratedPexelsPhotos(options);
  }
}

export async function searchStockVideos(
  query: string,
  options: PexelsVideoFilters = {}
): Promise<PexelsVideoSearchResponse> {
  try {
    const data = await searchBackendStock({
      query,
      page: options.page || 1,
      per_page: options.perPage || 8,
      media_type: 'video',
      type: 'video',
      orientation: options.orientation || undefined,
      size: options.size || undefined,
    });
    const mapped = normalizeStockSearchResponse(data, 'videos');
    return {
      page: options.page || 1,
      per_page: options.perPage || 8,
      total_results: mapped.total,
      next_page: mapped.next,
      videos: mapped.videos,
    };
  } catch {
    return searchPexelsVideos(query, options);
  }
}

export async function getPopularStockVideos(
  options: { page?: number; perPage?: number } = {}
): Promise<PexelsVideoSearchResponse> {
  try {
    return await searchStockVideos('nature', options);
  } catch {
    return getPopularPexelsVideos(options);
  }
}
