import { memo, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import * as Lucide from 'lucide-react';
import { Download, FileText, Pause, Play } from 'lucide-react';
import { sanitizeHTML } from '@/utils/sanitize';
import type { CanvasElement, FormField } from '@/builder/types';
import { stylesToCss } from '@/builder/styles';

function youtubeEmbed(url: string): string {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

function VideoDragEdges() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-10 h-[30%]" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-[30%]" />
      <div className="absolute left-0 top-[30%] z-10 h-[40%] w-[30%]" />
      <div className="absolute right-0 top-[30%] z-10 h-[40%] w-[30%]" />
    </>
  );
}

function VideoView({ element, css, editingCanvas }: { element: CanvasElement; css: CSSProperties; editingCanvas: boolean }) {
  const url = String(element.content.url || '');
  const embed = youtubeEmbed(url);
  const youtube = embed.includes('youtube.com');
  const [playing, setPlaying] = useState(false);

  const toggleFile = (event: ReactMouseEvent<HTMLVideoElement>) => {
    if (!editingCanvas) return;
    event.preventDefault();
    event.stopPropagation();
    const video = event.currentTarget;
    if (video.paused) void video.play();
    else video.pause();
  };

  const keepCenterPlayback = (event: ReactPointerEvent<HTMLVideoElement>) => {
    if (!editingCanvas) return;
    event.stopPropagation();
  };

  return (
    <div style={css} className="relative overflow-hidden bg-slate-900">
      {youtube ? (
        <iframe
          src={embed}
          title="Video"
          className="h-full min-h-[220px] w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <video
          src={url}
          controls={!editingCanvas}
          preload="metadata"
          className="h-full w-full"
          onPointerDown={keepCenterPlayback}
          onClick={toggleFile}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      {editingCanvas && !youtube && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg">
          {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6 fill-current" />}
        </div>
      )}
      {editingCanvas && <VideoDragEdges />}
    </div>
  );
}

export function isIconUrl(value?: unknown): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    /\.(svg|png|jpg|jpeg|webp|gif|ico)(\?.*)?$/i.test(trimmed)
  );
}

export function IconView({
  name,
  url,
  size,
  color,
  alt = 'Icon',
}: {
  name?: string;
  url?: string;
  size: number;
  color?: string;
  alt?: string;
}) {
  const iconSrc = (url && url.trim()) || (isIconUrl(name) ? name?.trim() : undefined);

  if (iconSrc) {
    const isSvg = /\.svg(\?.*)?$/i.test(iconSrc) || iconSrc.startsWith('data:image/svg+xml');

    if (isSvg && color) {
      return (
        <span
          role="img"
          aria-label={alt}
          className="inline-block shrink-0"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            maskImage: `url("${iconSrc}")`,
            WebkitMaskImage: `url("${iconSrc}")`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            backgroundColor: color,
            verticalAlign: 'middle',
          }}
        />
      );
    }

    return (
      <img
        src={iconSrc}
        alt={alt}
        width={size}
        height={size}
        className="inline-block shrink-0 object-contain"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          verticalAlign: 'middle',
        }}
        onError={(event) => {
          (event.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    );
  }

  const iconName = name || 'Sparkles';
  const Icon = (Lucide as unknown as Record<string, Lucide.LucideIcon>)[iconName] || Lucide.Sparkles;
  return <Icon size={size} color={color} className="shrink-0" />;
}

const FIELD_CLASS = 'select-text cursor-text rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900';

function keepFormFieldEvent(event: ReactPointerEvent | ReactMouseEvent) {
  if (!isFormFieldTarget(event.target)) return;
  event.stopPropagation();
}

function isFormFieldTarget(target: EventTarget | null) {
  const node = target as HTMLElement | null;
  return Boolean(node?.closest?.('input, textarea, select, option, label, [data-canvas-form-field]'));
}

export function downloadPdfFromUrl(url: string, filename = 'document.pdf') {
  if (!url || typeof window === 'undefined') return;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return;

  const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  if (trimmedUrl.startsWith('data:') || trimmedUrl.startsWith('blob:')) {
    const link = document.createElement('a');
    link.href = trimmedUrl;
    link.download = cleanName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  fetch(trimmedUrl, { method: 'GET', mode: 'cors' })
    .then((res) => {
      if (!res.ok) throw new Error('Fetch failed');
      return res.blob();
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    })
    .catch(() => {
      const link = document.createElement('a');
      link.href = trimmedUrl;
      link.download = cleanName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

export function PdfView({
  element,
  css,
  editingCanvas = false,
}: {
  element: CanvasElement;
  css: CSSProperties;
  editingCanvas?: boolean;
}) {
  const title = String(element.content.title || 'PDF Resource');
  const description = String(element.content.description || '');
  const url = String(element.content.url || '').trim();
  const filename = String(element.content.filename || title || 'document.pdf');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (!url) return;
    setDownloading(true);
    try {
      downloadPdfFromUrl(url, filename);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <div
      style={css}
      data-pdf-element=""
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          <p className="truncate text-xs text-slate-500">
            {description || (url ? 'Click download to view or save file' : 'Add a PDF URL in properties')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          data-testid="pdf-download-button"
          disabled={!url || downloading}
          onClick={handleDownload}
          title={url ? `Download ${filename}` : 'Configure PDF URL in properties'}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>{downloading ? 'Downloading…' : 'Download PDF'}</span>
        </button>
      </div>
    </div>
  );
}

function FormView({ element, css }: { element: CanvasElement; css: CSSProperties }) {
  const fields = (element.content.fields as FormField[]) || [];
  const [values, setValues] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const setValue = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
  };

  return (
    <form
      data-canvas-form=""
      style={css}
      className="select-text"
      onSubmit={(event) => event.preventDefault()}
      onPointerDown={keepFormFieldEvent}
      onMouseDown={keepFormFieldEvent}
      onClick={keepFormFieldEvent}
    >
      {element.content.title ? (
        <p className="text-base font-semibold text-slate-900">{String(element.content.title)}</p>
      ) : null}
      {fields.map((field) => (
        <label key={field.id} data-canvas-form-field="" className="flex cursor-text select-text flex-col gap-1 text-sm text-slate-700">
          <span>
            {field.label}
            {field.required ? <span className="text-rose-500"> *</span> : null}
          </span>
          {field.type === 'checkbox' || field.type === 'consent' ? (
            <span className="flex items-center gap-2 font-normal">
              <input
                type="checkbox"
                checked={Boolean(checks[field.id])}
                onChange={(event) => setChecks((current) => ({ ...current, [field.id]: event.target.checked }))}
                className="cursor-pointer rounded border-slate-300"
              />
              {field.placeholder || field.label}
            </span>
          ) : field.type === 'dropdown' || field.type === 'multiselect' ? (
            <select
              value={values[field.id] ?? ''}
              onChange={(event) => setValue(field.id, event.target.value)}
              className={`h-10 ${FIELD_CLASS}`}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {(field.options || ['Option 1']).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'radio' ? (
            <span className="flex flex-wrap gap-3">
              {(field.options || ['Yes', 'No']).map((option) => (
                <span key={option} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name={field.id}
                    checked={values[field.id] === option}
                    onChange={() => setValue(field.id, option)}
                    className="cursor-pointer"
                  /> {option}
                </span>
              ))}
            </span>
          ) : field.type === 'file' ? (
            <input type="file" className="cursor-pointer text-xs" />
          ) : field.type === 'textarea' ? (
            <textarea
              value={values[field.id] ?? ''}
              onChange={(event) => setValue(field.id, event.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`min-h-24 resize-y py-2 ${FIELD_CLASS}`}
            />
          ) : (
            <input
              type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
              value={values[field.id] ?? ''}
              onChange={(event) => setValue(field.id, event.target.value)}
              placeholder={field.placeholder}
              className={`h-10 ${FIELD_CLASS}`}
            />
          )}
        </label>
      ))}
      <button type="button" className="mt-2 h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white">
        {String(element.content.submitLabel || 'Submit')}
      </button>
    </form>
  );
}

function InlineTextEditor({
  html,
  tag,
  css,
  onSave,
  onCancel,
}: {
  html: string;
  tag: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  css: CSSProperties;
  onSave: (next: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const initialRef = useRef(html);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const sanitized = sanitizeHTML(html);
    if (node.innerHTML === sanitized) return;
    node.innerHTML = sanitized;
    node.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [html]);

  const commit = (value: string) => onSave(sanitizeHTML(value));

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey && tag !== 'p') {
      event.preventDefault();
      commit(ref.current?.innerHTML || '');
      onCancel();
    }
  };

  const Tag = tag;
  return (
    <Tag
      ref={ref as never}
      contentEditable
      suppressContentEditableWarning
      style={css}
      className="outline-none ring-1 ring-sky-400/70"
      onInput={() => {
        if (ref.current) {
          commit(ref.current.innerHTML);
        }
      }}
      onBlur={(event) => {
        const next = ref.current?.innerHTML || initialRef.current;
        commit(next);
        const related = (event.relatedTarget || document.activeElement) as HTMLElement | null;
        const isToolbar = Boolean(
          related?.closest(
            '[data-text-toolbar], [data-radix-popper-content-wrapper], [data-radix-select-content], [role="listbox"], [role="dialog"], [data-radix-portal]'
          )
        );
        if (!isToolbar) {
          onCancel();
        }
      }}
      onKeyDown={onKeyDown}
      onClick={(event) => event.stopPropagation()}
    />
  );
}

export const CanvasElementView = memo(function CanvasElementView({
  element,
  css,
  editing = false,
  editingCanvas = false,
  onSaveText,
  onCancelEdit,
}: {
  element: CanvasElement;
  css: CSSProperties;
  editing?: boolean;
  editingCanvas?: boolean;
  onSaveText?: (html: string) => void;
  onCancelEdit?: () => void;
}) {
  switch (element.type) {
    case 'text': {
      const html = String(element.content.text || 'Edit this text');
      const Tag = (element.content.tag as 'p' | 'h1' | 'h2' | 'h3' | 'span') || 'p';
      if (editing && onSaveText && onCancelEdit) {
        return <InlineTextEditor html={html} tag={Tag} css={css} onSave={onSaveText} onCancel={onCancelEdit} />;
      }
      return <Tag style={css} dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} />;
    }
    case 'image':
      return (
        <img
          src={String(element.content.src || '')}
          alt={String(element.content.alt || '')}
          draggable={false}
          loading="lazy"
          decoding="async"
          style={css}
          className="block h-full w-full max-w-full object-cover"
        />
      );
    case 'button':
      return (
        <a
          href={String(element.content.href || '#')}
          target={String(element.content.target || '_self')}
          onClick={(event) => event.preventDefault()}
          style={css}
          className="inline-flex no-underline"
        >
          {String(element.content.label || 'Button')}
        </a>
      );
    case 'icon': {
      const iconUrl = typeof element.content.url === 'string' && element.content.url.trim()
        ? element.content.url.trim()
        : typeof element.content.src === 'string' && element.content.src.trim()
        ? element.content.src.trim()
        : undefined;
      const iconName = typeof element.content.icon === 'string' ? element.content.icon : 'Sparkles';
      const size = Number(element.content.size || 28);
      const color = typeof css.color === 'string' ? css.color : undefined;
      const alt = typeof element.content.alt === 'string' ? element.content.alt : 'Icon';

      return (
        <span style={css} className="inline-flex items-center justify-center">
          <IconView
            name={iconName}
            url={iconUrl}
            size={size}
            color={color}
            alt={alt}
          />
        </span>
      );
    }
    case 'video':
      return <VideoView element={element} css={css} editingCanvas={editingCanvas} />;
    case 'divider':
      return <hr style={{ ...css, border: 'none' }} />;
    case 'form':
      return <FormView element={element} css={css} />;
    case 'pdf':
      return <PdfView element={element} css={css} editingCanvas={editingCanvas} />;
    case 'html':
      return (
        <div
          style={css}
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(String(element.content.html || '')) }}
        />
      );
    case 'gallery': {
      const images = (element.content.images as Array<{ src?: string; alt?: string } | string>) || [];
      return (
        <div style={{ ...css, display: css.display || 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {images.map((image, index) => {
            const src = typeof image === 'string' ? image : String(image.src || '');
            const alt = typeof image === 'string' ? 'Gallery image' : String(image.alt || 'Gallery image');
            return <img key={`${src}-${index}`} src={src} alt={alt} className="h-32 w-full rounded-lg object-cover" />;
          })}
        </div>
      );
    }
    case 'social': {
      const links = (element.content.links as Array<{ network?: string; url?: string }>) || [];
      return (
        <div style={css} className="flex flex-wrap gap-3">
          {links.map((link, index) => (
            <a
              key={`${link.network}-${index}`}
              href={String(link.url || '#')}
              onClick={(event) => event.preventDefault()}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 no-underline"
            >
              {String(link.network || 'Link')}
            </a>
          ))}
        </div>
      );
    }
    default:
      return <div style={css}>{element.name}</div>;
  }
});
