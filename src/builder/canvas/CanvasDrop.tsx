import { useDndMonitor } from '@dnd-kit/core';
import { useCanvasDndState } from '@/builder/components/CanvasDndContext';
import { dropLabel, type CalculatedDrop } from './drop';
import { useCanvasEngine } from './CanvasEngineContext';

function indicatorStyle(drop: CalculatedDrop, overlay: HTMLElement | null) {
  const target = document.querySelector(`[data-canvas-node="${drop.targetId}"]`) as HTMLElement | null;
  if (!target || !overlay) return null;
  const overlayRect = overlay.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const top = rect.top - overlayRect.top;
  const left = rect.left - overlayRect.left;
  if (drop.edge === 'inside') {
    return {
      top,
      left,
      width: rect.width,
      height: rect.height,
      inside: true,
    };
  }
  const y = drop.edge === 'before' ? top : top + rect.height;
  return {
    top: y - 1,
    left,
    width: rect.width,
    height: 2,
    inside: false,
  };
}

export function CanvasDrop() {
  const { dropIndicator, dropValid } = useCanvasDndState();
  const { overlayRef, previewMode } = useCanvasEngine();
  useDndMonitor({});
  if (previewMode || !dropIndicator) return null;
  const layout = indicatorStyle(dropIndicator, overlayRef.current);
  if (!layout) return null;
  const label = dropLabel(dropIndicator, dropValid);
  const line = dropValid ? 'bg-sky-500' : 'bg-rose-500';
  const ring = dropValid ? 'border-sky-400/80 bg-sky-400/5' : 'border-rose-400/80 bg-rose-400/5';

  if (layout.inside) {
    return (
      <div
        className={`pointer-events-none absolute z-30 rounded-lg border-2 border-dashed ${ring}`}
        style={{ top: layout.top, left: layout.left, width: layout.width, height: layout.height }}
      >
        <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F172A] shadow-sm">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{ top: layout.top, left: layout.left, width: layout.width }}
    >
      <div className={`h-0.5 w-full rounded-full ${line}`} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F172A] shadow-sm">
        {label}
      </div>
    </div>
  );
}

export type { CalculatedDrop };
