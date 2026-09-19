import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import { DEVICE_WIDTHS } from '@/builder/types';
import { CANVAS_HEIGHT_HANDLE, MIN_CANVAS_HEIGHT } from '@/builder/freeMove';
import { useCanvasEngine } from './CanvasEngineContext';

const CANVAS_GUTTER = 32;

export function CanvasViewport({ children }: { children: ReactNode }) {
  const { previewMode, viewportRef, scalerRef, frameRef, zoom, device, interacting, setHoveredNodeId, clickSuppressRef } = useCanvasEngine();
  const selectNode = useBuilderStore((state) => state.selectNode);
  const setZoom = useBuilderStore((state) => state.setZoom);
  const pageId = useBuilderStore((state) => state.getActivePage()?.id);
  const zoomAnchorRef = useRef<{ canvasX: number; canvasY: number; clientX: number; clientY: number } | null>(null);
  const gestureStartZoomRef = useRef(100);
  const [contentHeight, setContentHeight] = useState(800);

  const fittedKeyRef = useRef<string | null>(null);

  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);

  useEffect(() => {
    if (viewportRef.current && pageId) viewportRef.current.scrollTo({ top: 0 });
  }, [pageId, viewportRef]);

  useEffect(() => {
    if (previewMode || !selectedId) return;
    const scroller = viewportRef.current;
    if (!scroller) return;
    const frame = window.requestAnimationFrame(() => {
      const node = scroller.querySelector(`[data-canvas-node="${selectedId}"]`) as HTMLElement | null;
      if (!node) return;
      const scrollerRect = scroller.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const visible = nodeRect.bottom > scrollerRect.top + 24 && nodeRect.top < scrollerRect.bottom - 24;
      if (visible) return;
      const nextTop = nodeRect.top - scrollerRect.top + scroller.scrollTop - 24;
      scroller.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [previewMode, selectedId, viewportRef]);

  useLayoutEffect(() => {
    if (!pageId) return;
    const key = `${pageId}:${device}`;
    const applyFit = () => {
      if (fittedKeyRef.current === key) return;
      const node = viewportRef.current;
      if (!node) return;
      const width = node.clientWidth;
      if (width < 80) return;
      const frame = DEVICE_WIDTHS[useBuilderStore.getState().editor.device] || DEVICE_WIDTHS.desktop;
      const next = Math.max(25, Math.min(100, Math.floor(((width - CANVAS_GUTTER * 2) / frame) * 100)));
      const current = useBuilderStore.getState().editor.zoom || 100;
      fittedKeyRef.current = key;
      if (Math.abs(current - next) >= 1) {
        useBuilderStore.getState().setZoom(next);
      }
    };
    applyFit();
    const frame = requestAnimationFrame(applyFit);
    const timeout = window.setTimeout(applyFit, 120);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pageId, device, viewportRef]);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const syncSize = () => {
      const height = Math.max(node.offsetHeight, parseFloat(node.style.minHeight || '') || 0, MIN_CANVAS_HEIGHT) + CANVAS_HEIGHT_HANDLE;
      setContentHeight((current) => (Math.abs(current - height) < 0.5 ? current : height));
    };
    const observer = new ResizeObserver(syncSize);
    observer.observe(node);
    syncSize();
    let frame = 0;
    if (interacting) {
      const tick = () => {
        syncSize();
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pageId, device, frameRef, interacting]);

  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current;
    const scroller = viewportRef.current;
    const scaler = scalerRef.current;
    if (!anchor || !scroller || !scaler) return;
    zoomAnchorRef.current = null;
    const nextZoom = (zoom || 100) / 100;
    const nextRect = scaler.getBoundingClientRect();
    scroller.scrollLeft += nextRect.left + anchor.canvasX * nextZoom - anchor.clientX;
    scroller.scrollTop += nextRect.top + anchor.canvasY * nextZoom - anchor.clientY;
  }, [scalerRef, viewportRef, zoom]);

  useEffect(() => {
    const scroller = viewportRef.current;
    if (!scroller) return;

    const applyZoom = (nextPercent: number, clientX: number, clientY: number) => {
      const current = useBuilderStore.getState().editor.zoom || 100;
      const next = Math.max(25, Math.min(200, nextPercent));
      if (Math.abs(next - current) < 0.05) return;
      const scaler = scalerRef.current;
      const oldZoom = current / 100;
      if (scaler) {
        const rect = scaler.getBoundingClientRect();
        zoomAnchorRef.current = {
          canvasX: (clientX - rect.left) / oldZoom,
          canvasY: (clientY - rect.top) / oldZoom,
          clientX,
          clientY,
        };
      }
      useBuilderStore.getState().setZoom(next);
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const current = useBuilderStore.getState().editor.zoom || 100;
      const pixels = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * 800 : event.deltaY;
      applyZoom(current * Math.exp(-pixels * 0.0015), event.clientX, event.clientY);
    };

    const onGestureStart = (event: Event) => {
      event.preventDefault();
      gestureStartZoomRef.current = useBuilderStore.getState().editor.zoom || 100;
    };

    const onGestureChange = (event: Event) => {
      event.preventDefault();
      const scale = (event as Event & { scale?: number }).scale;
      if (!scale) return;
      const gesture = event as Event & { clientX?: number; clientY?: number };
      applyZoom(gestureStartZoomRef.current * scale, gesture.clientX ?? 0, gesture.clientY ?? 0);
    };

    scroller.addEventListener('wheel', onWheel, { passive: false, capture: true });
    scroller.addEventListener('gesturestart', onGestureStart as EventListener, { passive: false });
    scroller.addEventListener('gesturechange', onGestureChange as EventListener, { passive: false });
    return () => {
      scroller.removeEventListener('wheel', onWheel, { capture: true });
      scroller.removeEventListener('gesturestart', onGestureStart as EventListener);
      scroller.removeEventListener('gesturechange', onGestureChange as EventListener);
    };
  }, [pageId, scalerRef, viewportRef]);

  const zoomScale = (zoom || 100) / 100;
  const frameWidth = DEVICE_WIDTHS[device] || DEVICE_WIDTHS.desktop;
  const scaledWidth = frameWidth * zoomScale;
  const scaledHeight = contentHeight * zoomScale;

  const fitCanvas = () => {
    const width = viewportRef.current?.clientWidth || frameWidth;
    const next = Math.max(25, Math.min(100, Math.floor(((width - CANVAS_GUTTER * 2) / frameWidth) * 100)));
    fittedKeyRef.current = `${pageId}:${device}`;
    setZoom(next);
    viewportRef.current?.scrollTo({ left: 0, top: 0 });
  };

  return (
    <div
      ref={viewportRef}
      id="tour-canvas"
      className={cn('relative z-0 isolate h-full w-full overflow-auto bg-[hsl(var(--builder-panel))]', previewMode && 'is-preview')}
      onClick={() => {
        if (previewMode) return;
        if (clickSuppressRef.current) {
          clickSuppressRef.current = false;
          return;
        }
        selectNode(null);
        setHoveredNodeId(null);
      }}
    >
      <div
        className="flex justify-center py-12"
        style={{
          boxSizing: 'border-box',
          minWidth: `max(100%, ${scaledWidth + CANVAS_GUTTER * 2}px)`,
        }}
      >
        <div
          ref={scalerRef}
          className="relative shrink-0 overflow-visible"
          style={{
            width: scaledWidth,
            height: scaledHeight,
            marginLeft: CANVAS_GUTTER,
            marginRight: CANVAS_GUTTER,
          }}
        >
          {children}
        </div>
      </div>
      <button type="button" className="hidden" data-canvas-fit onClick={fitCanvas} aria-hidden />
    </div>
  );
}
