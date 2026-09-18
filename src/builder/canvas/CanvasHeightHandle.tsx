import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { clampCanvasHeight, MIN_CANVAS_HEIGHT } from '@/builder/freeMove';
import { clientDeltaToCanvas } from './coordinates';
import { useCanvasEngine } from './CanvasEngineContext';
import { requestOverlayMeasure, useOverlayBox } from './useOverlayBox';

function applyLiveHeight(height: number) {
  const next = clampCanvasHeight(height);
  const root = document.getElementById('canvas-root') as HTMLElement | null;
  if (root) root.style.minHeight = `${next}px`;
  requestOverlayMeasure();
  return next;
}

function commitCanvasHeight(height: number) {
  const store = useBuilderStore.getState();
  const page = store.getActivePage();
  if (!page) return;
  const next = clampCanvasHeight(height);
  store.updateCurrentPage({
    globalStyles: { ...(page.globalStyles || {}), canvasMinHeight: next },
  });
  store.saveActiveWebsite();
}

export function CanvasHeightHandle() {
  const { previewMode, zoom, setInteracting, clickSuppressRef, viewportRef } = useCanvasEngine();
  const pageId = useBuilderStore((state) => state.getActivePage()?.id);
  const box = useOverlayBox(previewMode ? null : pageId || null);
  const dragRef = useRef<{ originY: number; startHeight: number; last: number } | null>(null);

  if (previewMode || !box) return null;

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const root = document.getElementById('canvas-root') as HTMLElement | null;
    const startHeight = root?.offsetHeight || box.height / Math.max(0.25, (zoom || 100) / 100) || MIN_CANVAS_HEIGHT;
    dragRef.current = { originY: event.clientY, startHeight, last: startHeight };
    clickSuppressRef.current = true;
    setInteracting(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      moveEvent.preventDefault();
      const delta = clientDeltaToCanvas(0, moveEvent.clientY - drag.originY, zoom);
      drag.last = applyLiveHeight(drag.startHeight + delta.y);
      const scroller = viewportRef.current;
      if (scroller) {
        const view = scroller.getBoundingClientRect();
        if (moveEvent.clientY > view.bottom - 48) scroller.scrollTop += 16;
        else if (moveEvent.clientY < view.top + 48) scroller.scrollTop -= 16;
      }
    };

    const onUp = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      setInteracting(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!drag) return;
      commitCanvasHeight(drag.last);
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
  };

  return (
    <button
      type="button"
      data-canvas-height-handle
      aria-label="Resize canvas height"
      title="Drag to make the canvas taller"
      className="pointer-events-auto absolute z-50 h-3 w-3 -translate-x-1/2 rounded-full bg-slate-900 shadow-md cursor-ns-resize"
      style={{ left: box.left + box.width / 2, top: box.top + box.height + 10 }}
      onPointerDown={onPointerDown}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
