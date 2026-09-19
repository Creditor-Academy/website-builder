import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Film,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Play,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  getCuratedStockPhotos,
  getPopularStockVideos,
  searchStockPhotos,
  searchStockVideos,
} from '@/api/stock';
import {
  videoFileUrl,
  videoName,
  videoThumb,
  videoThumbnails,
  type PexelsMediaType,
  type PexelsOrientation,
  type PexelsPhoto,
  type PexelsPhotoFilters,
  type PexelsSize,
  type PexelsVideo,
  type PexelsVideoFilters,
} from '@/api/pexels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { dashboardSearchInputClass } from '@/components/dashboard/DashboardPageShell';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const ORIENTATIONS: { id: '' | PexelsOrientation; label: string }[] = [
  { id: '', label: 'Any' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'square', label: 'Square' },
];

const SIZES: { id: '' | PexelsSize; label: string }[] = [
  { id: '', label: 'Any size' },
  { id: 'large', label: 'Large' },
  { id: 'medium', label: 'Medium' },
  { id: 'small', label: 'Small' },
];

const COLORS = [
  { id: 'white', swatch: '#ffffff' },
  { id: 'black', swatch: '#111827' },
  { id: 'gray', swatch: '#9ca3af' },
  { id: 'red', swatch: '#ef4444' },
  { id: 'orange', swatch: '#f97316' },
  { id: 'yellow', swatch: '#eab308' },
  { id: 'green', swatch: '#22c55e' },
  { id: 'turquoise', swatch: '#14b8a6' },
  { id: 'blue', swatch: '#3b82f6' },
  { id: 'violet', swatch: '#8b5cf6' },
  { id: 'pink', swatch: '#ec4899' },
] as const;

const MEDIA_TYPES: { id: PexelsMediaType; label: string }[] = [
  { id: 'images', label: 'Images' },
  { id: 'videos', label: 'Videos' },
];

const CATEGORIES: { id: string; label: string }[] = [
  { id: '', label: 'All Images' },
  { id: 'nature', label: 'Nature' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'people', label: 'People' },
  { id: 'office', label: 'Office' },
  { id: 'food', label: 'Food' },
  { id: 'technology', label: 'Technology' },
  { id: 'texture', label: 'Texture' },
];

function photoName(photo: PexelsPhoto) {
  return (photo.alt || `Photo by ${photo.photographer}`).slice(0, 80);
}

function photoUrl(photo: PexelsPhoto) {
  return photo.src.large || photo.src.medium || photo.src.original;
}

function photoSrc(photo: PexelsPhoto) {
  return photo.src.medium || photo.src.small || photo.src.large;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, Math.round(seconds % 60));
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function cardAspect(photo: { width: number; height: number }, compact?: boolean) {
  const ratio = photo.width / Math.max(photo.height, 1);
  const min = compact ? 0.82 : 0.62;
  const max = compact ? 1.35 : 1.7;
  const clamped = Math.min(max, Math.max(min, ratio));
  return `${clamped} / 1`;
}

type StockPreview =
  | { kind: 'image'; photo: PexelsPhoto }
  | { kind: 'video'; video: PexelsVideo };

function VideoThumb({ video, className }: { video: PexelsVideo; className?: string }) {
  const sources = useMemo(() => videoThumbnails(video), [video]);
  const [index, setIndex] = useState(0);
  const src = sources[Math.min(index, Math.max(0, sources.length - 1))];
  if (!src) {
    return <div className={cn('h-full w-full bg-slate-800', className)} />;
  }
  return (
    <img
      src={src}
      alt={videoName(video)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setIndex((current) => (current < sources.length - 1 ? current + 1 : current))}
    />
  );
}

function SelectBadge({ selected, onToggle }: { selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={selected ? 'Deselect' : 'Select'}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        'absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-sm',
        selected ? 'bg-emerald-500 text-white' : 'bg-white/90 text-slate-500'
      )}
    >
      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={2.75} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />}
    </button>
  );
}

function pillClass(active: boolean) {
  return cn(
    'shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:px-3 sm:text-xs',
    'min-h-8 touch-manipulation',
    active ? 'bg-[#111827] text-white' : 'bg-white text-[#6b7280] hover:bg-slate-50'
  );
}

const filterScrollClass =
  'flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible';

export function PexelsStockSection({
  query,
  importingId,
  onClearQuery,
  onAddToLibrary,
  layout = 'page',
  filtersOpen = true,
}: {
  query: string;
  importingId: string | null;
  onClearQuery?: () => void;
  onCopy?: (id: string, url: string) => void;
  onAddToLibrary: (item: { name: string; url: string; media: 'image' | 'video'; provider?: string; providerId?: string | number }) => void | Promise<void>;
  layout?: 'page' | 'panel';
  filtersOpen?: boolean;
}) {
  const [mediaType, setMediaType] = useState<PexelsMediaType>('images');
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [orientation, setOrientation] = useState<'' | PexelsOrientation>('');
  const [size, setSize] = useState<'' | PexelsSize>('');
  const [color, setColor] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<StockPreview | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadLockRef = useRef(false);
  const isPanel = layout === 'panel';
  const term = query.trim();
  const searchQuery = [term, category].filter(Boolean).join(' ');
  const isVideo = mediaType === 'videos';
  const hasFilters = Boolean(orientation || size || (!isPanel && !isVideo && color));
  const filterKey = `${mediaType}|${searchQuery}|${orientation}|${size}|${isPanel || isVideo ? '' : color}`;

  const fetchPage = async (nextPage: number) => {
    if (isVideo) {
      const options: PexelsVideoFilters = { page: nextPage, perPage: PAGE_SIZE, orientation, size };
      const result = searchQuery || orientation || size
        ? await searchStockVideos(searchQuery || 'nature', options)
        : await getPopularStockVideos({ page: nextPage, perPage: PAGE_SIZE });
      return { items: result.videos || [], total: result.total_results || result.videos?.length || 0, next: result.next_page };
    }
    const options: PexelsPhotoFilters = { page: nextPage, perPage: PAGE_SIZE, orientation, size, color: isPanel ? '' : color };
    const result = searchQuery || hasFilters
      ? await searchStockPhotos(searchQuery || 'photo', options)
      : await getCuratedStockPhotos({ page: nextPage, perPage: PAGE_SIZE });
    return { items: result.photos || [], total: result.total_results || result.photos?.length || 0, next: result.next_page };
  };

  const filterRef = useRef(filterKey);
  useEffect(() => {
    if (filterRef.current !== filterKey) {
      filterRef.current = filterKey;
      setPhotos([]);
      setVideos([]);
      setHasMore(true);
      setSelectedIds(new Set());
      if (page !== 1) {
        setPage(1);
        return;
      }
    }
    let cancelled = false;
    let started = false;
    loadLockRef.current = true;
    const timer = window.setTimeout(async () => {
      started = true;
      if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const result = await fetchPage(page);
        if (cancelled) return;
        const incoming = result.items;
        if (isVideo) {
          setVideos((current) => {
            if (page === 1) return incoming as PexelsVideo[];
            const seen = new Set(current.map((video) => video.id));
            return [...current, ...(incoming as PexelsVideo[]).filter((video) => !seen.has(video.id))];
          });
          setPhotos([]);
        } else {
          setPhotos((current) => {
            if (page === 1) return incoming as PexelsPhoto[];
            const seen = new Set(current.map((photo) => photo.id));
            return [...current, ...(incoming as PexelsPhoto[]).filter((photo) => !seen.has(photo.id))];
          });
          setVideos([]);
        }
        setTotal(result.total || incoming.length || 0);
        setHasMore(Boolean(result.next) && incoming.length > 0);
      } catch (err) {
        if (cancelled) return;
        if (page === 1) {
          setPhotos([]);
          setVideos([]);
          setTotal(0);
        }
        setHasMore(false);
        setError(err instanceof Error ? err.message : 'Could not load stock photos.');
      } finally {
        loadLockRef.current = false;
        if (!cancelled) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }, term && page === 1 ? 400 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (!started) loadLockRef.current = false;
    };
  }, [filterKey, page, term, isVideo]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || !hasMore || loading || loadingMore || loadLockRef.current) return;
        loadLockRef.current = true;
        setPage((current) => current + 1);
      },
      { rootMargin: '480px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, photos.length, videos.length]);

  const itemsCount = isVideo ? videos.length : photos.length;
  const selectedPhotos = useMemo(
    () => photos.filter((photo) => selectedIds.has(String(photo.id))),
    [photos, selectedIds]
  );
  const selectedVideos = useMemo(
    () => videos.filter((video) => selectedIds.has(String(video.id))),
    [videos, selectedIds]
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setCategory('');
    setOrientation('');
    setSize('');
    setColor('');
    onClearQuery?.();
  };

  const applySelected = async () => {
    if (isVideo) {
      for (const video of selectedVideos) {
        const url = videoFileUrl(video);
        if (url) await onAddToLibrary({ name: videoName(video), url, media: 'video', provider: 'pexels', providerId: video.id });
      }
    } else {
      for (const photo of selectedPhotos) {
        await onAddToLibrary({ name: photoName(photo), url: photoUrl(photo), media: 'image', provider: 'pexels', providerId: photo.id });
      }
    }
    setSelectedIds(new Set());
  };

  return (
    <div className={cn(!isPanel && 'min-w-0 space-y-3 pb-24', isPanel && 'flex h-full min-h-0 flex-col')}>
      <div className={cn(isPanel ? 'min-h-0 flex-1 space-y-3 overflow-y-auto p-3' : 'min-w-0 space-y-3')}>
      {(!isPanel || filtersOpen) && (
      <div className={cn('rounded-2xl bg-white px-3 py-3 sm:px-4 sm:py-3.5', isPanel && 'animate-in fade-in slide-in-from-top-2 duration-200')}>
        <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium text-slate-400">Type</p>
            <div className={filterScrollClass}>
              {MEDIA_TYPES.map((option) => (
                <button key={option.id} type="button" onClick={() => setMediaType(option.id)} className={pillClass(mediaType === option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {!isPanel && !isVideo && (
          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium text-slate-400">Color</p>
            <div className="inline-flex items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {COLORS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  title={option.id}
                  onClick={() => setColor(color === option.id ? '' : option.id)}
                  className="flex h-4 w-4 shrink-0 items-center justify-center touch-manipulation"
                >
                  <span
                    className={cn(
                      'h-4 w-4 rounded-full border border-slate-200 shadow-sm',
                      color === option.id && 'ring-2 ring-[#111827] ring-offset-1'
                    )}
                    style={{ backgroundColor: option.swatch }}
                  />
                </button>
              ))}
            </div>
          </div>
          )}
          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium text-slate-400">Orientation</p>
            <div className={filterScrollClass}>
              {ORIENTATIONS.map((option) => (
                <button key={option.id || 'any-shape'} type="button" onClick={() => setOrientation(option.id)} className={pillClass(orientation === option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className="mb-1.5 text-[11px] font-medium text-slate-400">Size</p>
            <div className={filterScrollClass}>
              {SIZES.map((option) => (
                <button key={option.id || 'any-size'} type="button" onClick={() => setSize(option.id)} className={pillClass(size === option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto shrink-0 text-xs font-medium text-slate-400 hover:text-slate-700"
          >
            Clear all filters
          </button>
        </div>
        <div className="min-w-0">
          <p className="mb-1.5 text-[11px] font-medium text-slate-400">Category</p>
          <div className={cn(filterScrollClass, 'gap-1.5')}>
            {CATEGORIES.map((item) => (
              <button
                key={item.id || 'all'}
                type="button"
                onClick={() => setCategory(item.id)}
                className={pillClass(category === item.id)}
              >
                {item.id === '' ? (isVideo ? 'All Videos' : 'All Images') : item.label}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
      )}

      {(term || category) && (
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <span className="shrink-0">Filtered for</span>
          {term && (
            <button type="button" onClick={onClearQuery} className="inline-flex min-h-8 max-w-full items-center gap-1 truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              <span className="truncate">“{term}”</span> <X className="h-3 w-3 shrink-0" />
            </button>
          )}
          {category && (
            <button type="button" onClick={() => setCategory('')} className="inline-flex min-h-8 max-w-full items-center gap-1 truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              <span className="truncate">“{category}”</span> <X className="h-3 w-3 shrink-0" />
            </button>
          )}
        </div>
      )}

      {loading && itemsCount === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-[#111827]" />
          <p className="text-sm font-medium">{isVideo ? 'Loading stock videos…' : 'Loading stock photos…'}</p>
        </div>
      ) : error && itemsCount === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 px-6 text-center">
          {isVideo ? <Film className="h-8 w-8 opacity-40" /> : <ImageIcon className="h-8 w-8 opacity-40" />}
          <p className="text-sm font-bold text-[#111827]">{isVideo ? 'Stock videos unavailable' : 'Stock photos unavailable'}</p>
          <p className="max-w-md text-xs text-slate-500">{error}. Add PEXELS_API_KEY to .env.local and restart the app.</p>
        </div>
      ) : itemsCount === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 text-center">
          <p className="text-sm font-bold text-[#111827]">No {isVideo ? 'videos' : 'photos'} match these filters</p>
          <p className="text-xs text-slate-500">Clear a filter or try another search term.</p>
        </div>
      ) : (
        <>
          <div className={cn(isPanel ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')}>
            {isVideo
              ? videos.map((video) => {
                  const id = String(video.id);
                  const selected = selectedIds.has(id);
                  const portrait = video.height > video.width;
                  return (
                    <div
                      key={`video-${video.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setPreview({ kind: 'video', video })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setPreview({ kind: 'video', video });
                        }
                      }}
                      className={cn(
                        'group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-100',
                        selected && 'ring-2 ring-emerald-500 ring-offset-2'
                      )}
                      style={{ aspectRatio: cardAspect(video, isPanel) }}
                    >
                      <VideoThumb
                        video={video}
                        className={cn('h-full w-full', portrait ? 'object-cover object-center' : 'object-cover')}
                      />
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className={cn('flex items-center justify-center rounded-full bg-white/90 text-[#111827] shadow', isPanel ? 'h-11 w-11' : 'h-9 w-9')}>
                          <Play className={cn('fill-current', isPanel ? 'h-5 w-5' : 'h-4 w-4')} />
                        </span>
                      </span>
                      <span className="absolute left-2.5 bottom-2.5 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {formatDuration(video.duration)} · {video.width} × {video.height}
                      </span>
                      <SelectBadge selected={selected} onToggle={() => toggleSelected(id)} />
                    </div>
                  );
                })
              : photos.map((photo) => {
              const id = String(photo.id);
              const selected = selectedIds.has(id);
              const portrait = photo.height > photo.width;
              return (
                <div
                  key={photo.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreview({ kind: 'image', photo })}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setPreview({ kind: 'image', photo });
                    }
                  }}
                  className={cn(
                    'group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-100',
                    selected && 'ring-2 ring-emerald-500 ring-offset-2'
                  )}
                  style={{ aspectRatio: cardAspect(photo, isPanel) }}
                >
                  <img
                    src={photoSrc(photo)}
                    alt={photo.alt || photoName(photo)}
                    loading="lazy"
                    decoding="async"
                    className={cn('h-full w-full', portrait ? 'object-cover object-center' : 'object-cover')}
                  />
                  <span className="absolute left-2.5 bottom-2.5 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {photo.width} × {photo.height}
                  </span>
                  <SelectBadge selected={selected} onToggle={() => toggleSelected(id)} />
                </div>
              );
            })}
          </div>
          <div ref={sentinelRef} className="h-8 w-full" aria-hidden />
          {loadingMore && (
            <div className="flex items-center justify-center gap-2 py-3 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-[#111827]" />
              <p className="text-xs font-medium">{isVideo ? 'Loading more videos…' : 'Loading more photos…'}</p>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-center text-xs text-slate-400 sm:text-left">
          Showing {itemsCount.toLocaleString()} of {total.toLocaleString()} {isVideo ? 'videos' : 'photos'}
        </p>
      </div>
      </div>

      {selectedIds.size > 0 && !preview && (
        isPanel ? (
          <div className="shrink-0 bg-white p-2">
            <div className="flex items-center gap-2 rounded-full bg-[#111827] px-2 py-1.5 text-white">
              <span className="min-w-0 flex-1 truncate px-2 text-[11px] font-medium">
                Add to assets {selectedIds.size}
              </span>
              <Button
                type="button"
                disabled={Boolean(importingId)}
                onClick={() => void applySelected()}
                className="h-8 shrink-0 rounded-full bg-white px-3 text-[11px] font-semibold text-[#111827] hover:bg-slate-100"
              >
                {importingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Add to assets'}
              </Button>
            </div>
          </div>
        ) : (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6">
          <div className="pointer-events-auto flex w-full max-w-lg items-center gap-2 rounded-full bg-[#111827] px-2 py-1.5 text-white shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="min-w-0 flex-1 truncate px-2 text-[11px] font-medium sm:text-xs">
              Add to assets {selectedIds.size}
            </span>
            <Button
              type="button"
              disabled={Boolean(importingId)}
              onClick={() => void applySelected()}
              className="h-8 shrink-0 rounded-full bg-white px-3 text-[11px] font-semibold text-[#111827] hover:bg-slate-100"
            >
              {importingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Add to assets'}
            </Button>
          </div>
        </div>
        )
      )}

      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent
          overlayClassName="z-[260]"
          className={cn(
            'z-[261] flex max-h-[min(92dvh,52rem)] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden p-0',
            'rounded-2xl border-0 bg-white shadow-2xl sm:max-w-4xl',
            '[&>button]:right-3 [&>button]:top-3 [&>button]:text-[#0F172A] [&>button]:hover:bg-slate-100',
            '[&>button>svg]:mr-0 [&>button>svg]:h-5 [&>button>svg]:w-5',
          )}
        >
          <DialogHeader className="shrink-0 px-4 py-3 pr-12 sm:px-5 sm:py-4">
            <DialogTitle className="truncate text-left text-sm font-semibold text-[#0F172A] sm:text-base">
              {preview?.kind === 'video'
                ? videoName(preview.video)
                : preview?.kind === 'image'
                  ? photoName(preview.photo)
                  : 'Stock preview'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 items-center justify-center bg-[#0F172A] p-3 sm:p-6">
            {preview?.kind === 'video' ? (
              <video
                key={preview.video.id}
                src={videoFileUrl(preview.video)}
                poster={videoThumb(preview.video)}
                controls
                autoPlay
                playsInline
                referrerPolicy="no-referrer"
                className="max-h-[min(58dvh,32rem)] w-full max-w-full rounded-lg bg-black sm:max-h-[min(68dvh,38rem)]"
              />
            ) : preview?.kind === 'image' ? (
              <img
                src={preview.photo.src.original || photoUrl(preview.photo)}
                alt={photoName(preview.photo)}
                className="max-h-[min(58dvh,32rem)] max-w-full rounded-lg object-contain sm:max-h-[min(68dvh,38rem)]"
              />
            ) : null}
          </div>

          {preview && (
            <div className="flex shrink-0 flex-col gap-3 bg-[#fcf8fa] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="min-w-0 truncate text-[11px] text-[#76777d] sm:text-xs">
                <span className="uppercase tracking-wider">{preview.kind === 'video' ? 'Video' : 'Image'}</span>
                <span className="mx-1">·</span>
                <span>
                  {preview.kind === 'video'
                    ? `${preview.video.width} × ${preview.video.height}`
                    : `${preview.photo.width} × ${preview.photo.height}`}
                </span>
                {preview.kind === 'video' && (
                  <>
                    <span className="mx-1">·</span>
                    <span>{formatDuration(preview.video.duration)}</span>
                  </>
                )}
              </p>
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[#c6c6cd] bg-white px-3 text-xs font-medium text-[#0F172A] hover:bg-[#eae7e9]"
                onClick={() => {
                  const url = preview.kind === 'video'
                    ? videoFileUrl(preview.video)
                    : preview.photo.src.original || photoUrl(preview.photo);
                  if (url) window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PexelsStockBrowser({
  query,
  onQueryChange,
  importingId,
  onAddToLibrary,
  onCopy,
  onClose,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  importingId: string | null;
  onAddToLibrary: (item: { name: string; url: string; media: 'image' | 'video' }) => void | Promise<void>;
  onCopy?: (id: string, url: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <div className="sticky top-0 z-20 shrink-0 bg-white px-4 pb-3 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#787778]" />
            <Input
              placeholder="Search stock photos and videos…"
              className={cn(dashboardSearchInputClass, 'h-9 rounded-full pl-9')}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close Pexels"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#0F172A] hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-5">
        <PexelsStockSection
          query={query}
          importingId={importingId}
          onClearQuery={() => onQueryChange('')}
          onCopy={onCopy}
          onAddToLibrary={onAddToLibrary}
        />
      </div>
    </div>
  );
}

export { photoName, photoUrl, videoFileUrl, videoName };
