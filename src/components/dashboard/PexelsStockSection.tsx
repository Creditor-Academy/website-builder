import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Heart, Image as ImageIcon, Loader2, X } from 'lucide-react';
import {
  getCuratedPexelsPhotos,
  searchPexelsPhotos,
  type PexelsOrientation,
  type PexelsPhoto,
  type PexelsPhotoFilters,
  type PexelsSize,
} from '@/api/pexels';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

const LICENSE_OPTIONS = [
  { id: '', label: 'Any use' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'personal', label: 'Personal' },
  { id: 'editorial', label: 'Editorial' },
] as const;

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

const CATEGORIES = [
  { id: '', label: 'All Images', count: '8,000+', preview: 'linear-gradient(135deg, #f5d0fe, #e0e7ff)' },
  { id: 'nature', label: 'Nature', count: '2.4k', preview: 'linear-gradient(135deg, #0f172a, #334155)' },
  { id: 'abstract', label: 'Abstract', count: '1.8k', preview: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' },
  { id: 'people', label: 'People', count: '1.2k', preview: 'linear-gradient(135deg, #1e293b, #64748b)' },
  { id: 'office', label: 'Office', count: '980', preview: 'linear-gradient(135deg, #ecfccb, #fef9c3)' },
  { id: 'food', label: 'Food', count: '760', preview: 'linear-gradient(135deg, #fff7ed, #fed7aa)' },
  { id: 'technology', label: 'Technology', count: '650', preview: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' },
  { id: 'texture', label: 'Texture', count: '520', preview: 'linear-gradient(135deg, #0ea5e9, #22c55e)' },
] as const;

function photoName(photo: PexelsPhoto) {
  return (photo.alt || `Photo by ${photo.photographer}`).slice(0, 80);
}

function photoUrl(photo: PexelsPhoto) {
  return photo.src.large || photo.src.medium || photo.src.original;
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

function formatCount(total: number) {
  if (total >= 1000) return `${Math.floor(total / 100) / 10}k`.replace('.0k', 'k');
  return String(total);
}

export function PexelsStockSection({
  query,
  importingId,
  onClearQuery,
  onAddToLibrary,
}: {
  query: string;
  importingId: string | null;
  onClearQuery?: () => void;
  onCopy?: (id: string, url: string) => void;
  onAddToLibrary: (photo: PexelsPhoto) => void | Promise<void>;
}) {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [license, setLicense] = useState('');
  const [category, setCategory] = useState('');
  const [orientation, setOrientation] = useState<'' | PexelsOrientation>('');
  const [size, setSize] = useState<'' | PexelsSize>('');
  const [color, setColor] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const term = query.trim();
  const searchQuery = [term, category].filter(Boolean).join(' ');
  const hasFilters = Boolean(orientation || size || color || license);
  const filterKey = `${searchQuery}|${orientation}|${size}|${color}|${license}`;

  const fetchPage = (nextPage: number) => {
    const options: PexelsPhotoFilters = {
      page: nextPage,
      perPage: PAGE_SIZE,
      orientation,
      size,
      color,
    };
    if (searchQuery || hasFilters) {
      return searchPexelsPhotos(searchQuery || 'photo', options);
    }
    return getCuratedPexelsPhotos({ page: nextPage, perPage: PAGE_SIZE });
  };

  const filterRef = useRef(filterKey);
  useEffect(() => {
    if (filterRef.current !== filterKey) {
      filterRef.current = filterKey;
      if (page !== 1) {
        setPage(1);
        return;
      }
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPage(page);
        if (cancelled) return;
        setPhotos(result.photos || []);
        setTotal(result.total_results || result.photos?.length || 0);
      } catch (err) {
        if (cancelled) return;
        setPhotos([]);
        setTotal(0);
        setError(err instanceof Error ? err.message : 'Could not load stock photos.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, term ? 400 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [filterKey, page, term]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const selectedPhotos = useMemo(
    () => photos.filter((photo) => selectedIds.has(String(photo.id))),
    [photos, selectedIds]
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
    setLicense('');
    setCategory('');
    setOrientation('');
    setSize('');
    setColor('');
    onClearQuery?.();
  };

  const applySelected = async () => {
    for (const photo of selectedPhotos) {
      await onAddToLibrary(photo);
    }
    setSelectedIds(new Set());
  };

  const pages = useMemo(() => {
    if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
    if (page <= 3) return [1, 2, 3, 'ellipsis', pageCount] as const;
    if (page >= pageCount - 2) return [1, 'ellipsis', pageCount - 2, pageCount - 1, pageCount] as const;
    return [1, 'ellipsis', page, 'ellipsis', pageCount] as const;
  }, [page, pageCount]);

  const compactPages = [page > 1 ? page - 1 : null, page, page < pageCount ? page + 1 : null].filter(
    (value): value is number => value != null
  );

  return (
    <div className="min-w-0 space-y-4 pb-24 sm:space-y-5 sm:pb-0">
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:rounded-[28px] sm:px-5 sm:py-4">
        <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-medium text-slate-400">Usage</p>
            <div className={filterScrollClass}>
              {LICENSE_OPTIONS.map((option) => (
                <button key={option.id || 'any-use'} type="button" onClick={() => setLicense(option.id)} className={pillClass(license === option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-medium text-slate-400">Orientation</p>
            <div className={filterScrollClass}>
              {ORIENTATIONS.map((option) => (
                <button key={option.id || 'any-shape'} type="button" onClick={() => setOrientation(option.id)} className={pillClass(orientation === option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0 md:col-span-2 lg:col-span-1">
            <p className="mb-2 text-[11px] font-medium text-slate-400">Size</p>
            <div className={filterScrollClass}>
              {SIZES.map((option) => (
                <button key={option.id || 'any-size'} type="button" onClick={() => setSize(option.id)} className={pillClass(size === option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-medium text-slate-400">Color</p>
            <div className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {COLORS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  title={option.id}
                  onClick={() => setColor(color === option.id ? '' : option.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center touch-manipulation"
                >
                  <span
                    className={cn(
                      'h-5 w-5 rounded-full border border-black/10',
                      color === option.id && 'ring-2 ring-[#111827] ring-offset-2'
                    )}
                    style={{ backgroundColor: option.swatch }}
                  />
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={clearFilters} className="self-start text-xs font-medium text-slate-400 hover:text-slate-700 sm:self-auto">
            Clear all filters
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="break-words text-lg font-semibold tracking-tight text-[#111827] sm:text-2xl">{total.toLocaleString()}+ results</p>
          {(term || category) && (
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
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
        </div>
        <p className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-400 sm:text-xs">
          Most Relevant
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 xl:grid-cols-8">
        {CATEGORIES.map((item) => {
          const active = category === item.id;
          return (
            <button
              key={item.id || 'all'}
              type="button"
              onClick={() => setCategory(item.id)}
              className="flex min-w-0 w-full flex-col rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-sm transition hover:shadow-md sm:p-2"
            >
              <div className="relative mb-1.5 aspect-[16/9] w-full overflow-hidden rounded-xl sm:mb-2" style={{ backgroundImage: item.preview, backgroundSize: 'cover' }}>
                {active && (
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-white text-[#111827] shadow">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] font-semibold text-[#111827] sm:text-sm">{item.label}</p>
              <p className="truncate text-[10px] text-slate-400 sm:text-[11px]">{item.id && category === item.id ? `${formatCount(total)}` : item.count}</p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-[#111827]" />
          <p className="text-sm font-medium">Loading stock photos…</p>
        </div>
      ) : error ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
          <ImageIcon className="h-8 w-8 opacity-40" />
          <p className="text-sm font-bold text-[#111827]">Stock photos unavailable</p>
          <p className="max-w-md text-xs text-slate-500">{error}. Add PEXELS_API_KEY to .env.local and restart the app.</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
          <p className="text-sm font-bold text-[#111827]">No photos match these filters</p>
          <p className="text-xs text-slate-500">Clear a filter or try another search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {photos.map((photo) => {
            const id = String(photo.id);
            const selected = selectedIds.has(id);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => toggleSelected(id)}
                className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100"
              >
                <img src={photo.src.landscape || photo.src.medium} alt={photo.alt || photoName(photo)} className="h-full w-full object-cover" />
                <span className="absolute left-2.5 bottom-2.5 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {photo.width} × {photo.height}
                </span>
                <span
                  className={cn(
                    'absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm',
                    selected && 'text-[#111827]'
                  )}
                >
                  <Heart className={cn('h-3.5 w-3.5', selected && 'fill-current')} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-center text-xs text-slate-400 sm:text-left">
          Showing {rangeStart}–{rangeEnd} of {total.toLocaleString()} assets
        </p>
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full text-xs text-slate-500 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <div className="flex items-center gap-1 sm:hidden">
            {compactPages.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPage(item)}
                className={cn(
                  'h-9 min-w-9 rounded-full px-2 text-xs font-semibold',
                  page === item ? 'bg-[#111827] text-white' : 'text-slate-500'
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            {pages.map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`e-${index}`} className="px-1 text-xs text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPage(item)}
                  className={cn(
                    'h-8 min-w-8 rounded-full px-2 text-xs font-semibold',
                    page === item ? 'bg-[#111827] text-white' : 'text-slate-500 hover:bg-slate-100'
                  )}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full text-xs text-slate-500 disabled:opacity-40"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="hidden w-full items-center justify-between gap-2 rounded-full bg-[#111827] px-2 py-1.5 text-white sm:flex sm:w-auto">
          <span className="px-2 text-[11px] font-medium">
            {selectedIds.size} item{selectedIds.size === 1 ? '' : 's'} ready for canvas
          </span>
          <Button
            type="button"
            disabled={selectedIds.size === 0 || Boolean(importingId)}
            onClick={() => void applySelected()}
            className="h-8 rounded-full bg-white px-3 text-[11px] font-semibold text-[#111827] hover:bg-slate-100"
          >
            {importingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Apply to Artboard'}
          </Button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur sm:hidden" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto flex max-w-lg items-center gap-2 rounded-full bg-[#111827] px-2 py-1.5 text-white">
          <span className="min-w-0 flex-1 truncate px-2 text-[11px] font-medium">
            {selectedIds.size} item{selectedIds.size === 1 ? '' : 's'} ready for canvas
          </span>
          <Button
            type="button"
            disabled={selectedIds.size === 0 || Boolean(importingId)}
            onClick={() => void applySelected()}
            className="h-8 shrink-0 rounded-full bg-white px-3 text-[11px] font-semibold text-[#111827] hover:bg-slate-100"
          >
            {importingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Apply'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { photoName, photoUrl };
