import { useEffect, useState } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, isFreePositioned } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import {
  MARQUEE_THRESHOLD,
  normalizeMarqueeBox,
  pruneNestedSelection,
  rectsIntersect,
  selectedIdsOf,
  type SelectionRect,
} from '@/builder/selection';
import { useCanvasEngine } from './CanvasEngineContext';
import { measureOverlayBox, requestOverlayMeasure } from './useOverlayBox';

function clientRect(el: DOMRect): SelectionRect {
  return { left: el.left, top: el.top, width: el.width, height: el.height };
}

function marqueeHits(root: HTMLElement, box: SelectionRect): string[] {
  const page = useBuilderStore.getState().getActivePage();
  const sections = page ? normalizePageSections(page.sections, page.id) : [];
  const ids: string[] = [];
  root.querySelectorAll('[data-canvas-kind="element"], [data-canvas-kind="container"]').forEach((node) => {
    const el = node as HTMLElement;
    const id = el.dataset.canvasNode;
    const kind = el.dataset.canvasKind;
    if (!id) return;
    if (kind === 'container') {
      const found = findNode(sections, id);
      if (!found || !isFreePositioned(found.node) || found.node.properties?.role === 'surface') return;
    }
    if (rectsIntersect(box, clientRect(el.getBoundingClientRect()))) ids.push(id);
  });
  return pruneNestedSelection(sections, ids);
}

function shouldStartMarquee(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  if (el.closest('[data-canvas-move], [data-canvas-resize], [data-canvas-rotate], [data-canvas-height-handle]')) return false;
  if (el.closest('[data-canvas-kind="navbar"], [data-canvas-kind="footer"]')) return false;
  if (el.closest('[data-canvas-kind="element"]')) return false;
  if (el.closest('[data-canvas-kind="container"]:not([data-canvas-surface])')) return false;
  return Boolean(
    el.closest('#canvas-root') ||
      el.closest('#tour-canvas') ||
      el.hasAttribute('data-fit-canvas')
  );
}

export function CanvasMarquee() {
  const { previewMode, overlayRef, frameRef, viewportRef, setInteracting, clickSuppressRef } = useCanvasEngine();
  const [box, setBox] = useState<SelectionRect | null>(null);
  const [hits, setHits] = useState<string[]>([]);

  useEffect(() => {
    if (previewMode) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    let origin: { x: number; y: number; additive: boolean } | null = null;
    let dragging = false;

    const overlayPoint = (clientX: number, clientY: number) => {
      const overlay = overlayRef.current;
      if (!overlay) return { x: clientX, y: clientY };
      const rect = overlay.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMove = (event: PointerEvent) => {
      if (!origin) return;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (!dragging && Math.hypot(dx, dy) < MARQUEE_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        setInteracting(true);
        clickSuppressRef.current = true;
      }
      const start = overlayPoint(origin.x, origin.y);
      const current = overlayPoint(event.clientX, event.clientY);
      const next = normalizeMarqueeBox(start.x, start.y, current.x, current.y);
      setBox(next);
      const root = frameRef.current;
      if (root) {
        setHits(marqueeHits(root, normalizeMarqueeBox(origin.x, origin.y, event.clientX, event.clientY)));
      }
      requestOverlayMeasure();
    };

    const onUp = (event: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const started = origin;
      origin = null;
      if (!dragging || !started) {
        dragging = false;
        setBox(null);
        setHits([]);
        return;
      }
      dragging = false;
      setInteracting(false);
      setBox(null);
      setHits([]);
      const root = frameRef.current;
      if (!root) return;
      const start = { x: started.x, y: started.y };
      const hits = marqueeHits(
        root,
        normalizeMarqueeBox(start.x, start.y, event.clientX, event.clientY)
      );
      const store = useBuilderStore.getState();
      if (!hits.length) {
        if (!started.additive) store.selectNode(null);
        return;
      }
      if (started.additive) {
        const merged = [...new Set([...selectedIdsOf(store.editor), ...hits])];
        store.selectNodes(merged);
        return;
      }
      store.selectNodes(hits);
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      if (!shouldStartMarquee(event.target)) return;
      origin = {
        x: event.clientX,
        y: event.clientY,
        additive: event.shiftKey || event.metaKey || event.ctrlKey,
      };
      dragging = false;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

    viewport.addEventListener('pointerdown', onDown);
    return () => {
      viewport.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [clickSuppressRef, frameRef, overlayRef, previewMode, setInteracting, viewportRef]);

  if (!box || box.width < 2 || box.height < 2) return null;

  return (
    <>
      {hits.map((id) => {
        const hitBox = measureOverlayBox(id, overlayRef.current);
        if (!hitBox) return null;
        return (
          <div
            key={id}
            className="pointer-events-none absolute rounded-sm ring-2 ring-sky-400/90"
            style={hitBox}
          />
        );
      })}
      <div
        className="pointer-events-none absolute z-50 border border-sky-500 bg-sky-500/10"
        style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
      />
    </>
  );
}
