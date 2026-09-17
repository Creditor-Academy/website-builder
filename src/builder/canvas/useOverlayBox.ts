import { useCallback, useLayoutEffect, useState } from 'react';
import { useCanvasEngine } from './CanvasEngineContext';

export const OVERLAY_MEASURE_EVENT = 'canvas-overlay-measure';

export function requestOverlayMeasure() {
  window.dispatchEvent(new Event(OVERLAY_MEASURE_EVENT));
}

export interface OverlayBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function measureOverlayBox(nodeId: string | null, overlay: HTMLElement | null): OverlayBox | null {
  if (!nodeId || !overlay) return null;
  const node = document.querySelector(`[data-canvas-node="${nodeId}"]`) as HTMLElement | null;
  if (!node) return null;
  const overlayRect = overlay.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  return {
    left: rect.left - overlayRect.left,
    top: rect.top - overlayRect.top,
    width: rect.width,
    height: rect.height,
  };
}

function sameBox(a: OverlayBox | null, b: OverlayBox | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

export function useOverlayBox(nodeId: string | null) {
  const { overlayRef, previewMode, zoom, interacting, viewportRef } = useCanvasEngine();
  const [box, setBox] = useState<OverlayBox | null>(null);

  const measure = useCallback(() => {
    if (previewMode) {
      setBox((current) => (current ? null : current));
      return;
    }
    const next = measureOverlayBox(nodeId, overlayRef.current);
    setBox((current) => (sameBox(current, next) ? current : next));
  }, [nodeId, overlayRef, previewMode]);

  useLayoutEffect(() => {
    measure();
    if (!nodeId || previewMode) return;
    const node = document.querySelector(`[data-canvas-node="${nodeId}"]`);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure());
    if (node && resizeObserver) resizeObserver.observe(node);
    const mutationObserver = typeof MutationObserver === 'undefined' ? null : new MutationObserver(() => measure());
    if (node && mutationObserver) mutationObserver.observe(node, { attributes: true, attributeFilter: ['style', 'class'] });
    const scroller = viewportRef.current;
    scroller?.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener(OVERLAY_MEASURE_EVENT, measure);
    let frame = 0;
    if (interacting) {
      const tick = () => {
        measure();
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      scroller?.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      window.removeEventListener(OVERLAY_MEASURE_EVENT, measure);
      cancelAnimationFrame(frame);
    };
  }, [interacting, measure, nodeId, previewMode, viewportRef, zoom]);

  return box;
}
