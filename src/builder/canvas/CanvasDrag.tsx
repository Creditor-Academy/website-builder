import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, getFreePosition } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { clientDeltaToCanvas } from './coordinates';
import { computeAlignmentGuides, type GuideBox } from './guides';
import { useCanvasEngine } from './CanvasEngineContext';
import { requestOverlayMeasure } from './useOverlayBox';
import { growOffsetParents } from '@/builder/freeMove';

function localBox(node: HTMLElement): GuideBox {
  return {
    id: node.dataset.canvasNode || '',
    x: node.offsetLeft,
    y: node.offsetTop,
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
}

export function useFreePositionDrag(nodeId: string, enabled: boolean) {
  const { setGuides, setInteracting, zoom, liveGeometryRef, viewportRef } = useCanvasEngine();
  const originRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (event: ReactPointerEvent) => {
    if (!enabled) return;
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const page = useBuilderStore.getState().getActivePage();
    if (!page) return;
    const found = findNode(normalizePageSections(page.sections, page.id), nodeId);
    if (nodeId !== 'navbar' && (!found || found.node.locked)) return;

    const node = document.querySelector(`[data-canvas-node="${nodeId}"]`) as HTMLElement | null;
    const stored = found ? getFreePosition(found.node) : { x: node?.offsetLeft || 0, y: node?.offsetTop || 0 };
    const startX = node ? node.offsetLeft : stored.x;
    const startY = node ? node.offsetTop : stored.y;
    originRef.current = { x: event.clientX, y: event.clientY, startX, startY };
    lastRef.current = { x: startX, y: startY };
    liveGeometryRef.current[nodeId] = { left: startX, top: startY };
    setInteracting(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    useBuilderStore.getState().selectNode(nodeId, found?.kind || 'navbar');

    const onMove = (moveEvent: PointerEvent) => {
      const origin = originRef.current;
      if (!origin) return;
      const delta = clientDeltaToCanvas(moveEvent.clientX - origin.x, moveEvent.clientY - origin.y, zoom);
      let nextX = origin.startX + delta.x;
      let nextY = origin.startY + delta.y;
      const moving = document.querySelector(`[data-canvas-node="${nodeId}"]`) as HTMLElement | null;
      const parent = moving?.offsetParent as HTMLElement | null;
      if (moving && parent) {
        const kind = moving.dataset.canvasKind || 'element';
        const siblings: GuideBox[] = Array.from(parent.querySelectorAll(`[data-canvas-kind="${kind}"]`))
          .filter((child) => {
            const el = child as HTMLElement;
            return el.dataset.canvasNode !== nodeId && !moving.contains(el) && !el.contains(moving);
          })
          .map((child) => localBox(child as HTMLElement));
        const snapped = computeAlignmentGuides(
          { id: nodeId, x: nextX, y: nextY, width: moving.offsetWidth, height: moving.offsetHeight },
          siblings,
          undefined,
          { snapToGrid: true, grid: 8 }
        );
        nextX = snapped.x;
        nextY = snapped.y;
        const factor = (zoom || 100) / 100;
        setGuides(snapped.guides.map((guide) => ({ ...guide, position: guide.position * factor })));
      }
      lastRef.current = { x: nextX, y: nextY };
      liveGeometryRef.current[nodeId] = { left: nextX, top: nextY };
      if (moving) {
        moving.style.position = 'absolute';
        moving.style.left = `${Math.round(nextX)}px`;
        moving.style.top = `${Math.round(nextY)}px`;
        growOffsetParents(moving);
        const scroller = viewportRef.current;
        if (scroller) {
          const rect = moving.getBoundingClientRect();
          const view = scroller.getBoundingClientRect();
          if (rect.right > view.right - 32) scroller.scrollLeft += rect.right - view.right + 32;
          if (rect.left < view.left + 32) scroller.scrollLeft += rect.left - view.left - 32;
        }
      }
      requestOverlayMeasure();
    };

    const onUp = () => {
      const origin = originRef.current;
      const last = lastRef.current;
      lastRef.current = null;
      originRef.current = null;
      delete liveGeometryRef.current[nodeId];
      setInteracting(false);
      setGuides([]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!origin || !last) return;
      if (Math.round(last.x) === Math.round(origin.startX) && Math.round(last.y) === Math.round(origin.startY)) {
        return;
      }
      const pageNow = useBuilderStore.getState().getActivePage();
      const latest = pageNow ? findNode(normalizePageSections(pageNow.sections, pageNow.id), nodeId) : null;
      const current = latest ? getFreePosition(latest.node) : { x: origin.startX, y: origin.startY };
      useBuilderStore.getState().updateFreePosition(nodeId, {
        ...current,
        x: last.x,
        y: last.y,
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return { onPointerDown };
}
