import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, getFreePosition, isFreePositioned } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { selectedIdsOf } from '@/builder/selection';
import { clientDeltaToCanvas, overlaySpaceFromElements, parentLocalToOverlay, rectToParentLocal } from './coordinates';
import { computeAlignmentGuides, type GuideBox } from './guides';
import { useCanvasEngine } from './CanvasEngineContext';
import { requestOverlayMeasure } from './useOverlayBox';
import { preserveNavbarFlowSlot } from './navbarSlot';

function localBox(node: HTMLElement): GuideBox {
  return {
    id: node.dataset.canvasNode || '',
    x: node.offsetLeft,
    y: node.offsetTop,
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
}

export function useFreePositionDrag(nodeId: string, enabled: boolean, options?: { group?: boolean }) {
  const { setGuides, setInteracting, zoom, liveGeometryRef, overlayRef } = useCanvasEngine();
  const originRef = useRef<{
    x: number;
    y: number;
    additive: boolean;
    already: boolean;
    kind: 'element' | 'container' | 'navbar' | 'section' | 'footer' | 'page';
    items: Array<{ id: string; startX: number; startY: number }>;
  } | null>(null);
  const lastRef = useRef<Array<{ id: string; x: number; y: number }>>([]);
  const groupMode = Boolean(options?.group);

  const beginMove = (
    clientX: number,
    clientY: number,
    keys?: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean },
    current?: { clientX: number; clientY: number }
  ) => {
    if (!enabled) return false;
    const store = useBuilderStore.getState();
    const page = store.getActivePage();
    if (!page) return false;
    const sections = normalizePageSections(page.sections, page.id);
    const found = findNode(sections, nodeId);
    if (nodeId !== 'navbar' && (!found || found.node.locked)) return false;

    const additive = Boolean(keys?.shiftKey || keys?.metaKey || keys?.ctrlKey);
    const currentIds = selectedIdsOf(store.editor);
    const already = currentIds.includes(nodeId);
    const kind = (found?.kind || (nodeId === 'navbar' ? 'navbar' : 'element')) as NonNullable<typeof originRef.current>['kind'];

    if (!groupMode) {
      if (additive) {
        store.selectNode(nodeId, kind, 'toggle');
        if (already) return false;
      } else if (!already) {
        store.selectNode(nodeId, kind, 'replace');
      }
    }

    const sourceIds = groupMode || (!additive && already) ? currentIds : [nodeId];
    const groupIds = sourceIds.filter((id) => {
      if (id === 'navbar') return nodeId === 'navbar';
      const loc = findNode(sections, id);
      return Boolean(loc && isFreePositioned(loc.node) && !loc.node.locked);
    });
    const moveIds = groupIds.length ? groupIds : [nodeId];

    const items = moveIds.map((id) => {
      const node = document.querySelector(`[data-canvas-node="${id}"]`) as HTMLElement | null;
      const loc = findNode(sections, id);
      const stored = loc ? getFreePosition(loc.node) : { x: node?.offsetLeft || 0, y: node?.offsetTop || 0 };
      const startX = node ? node.offsetLeft : stored.x;
      const startY = node ? node.offsetTop : stored.y;
      liveGeometryRef.current[id] = { left: startX, top: startY };
      return { id, startX, startY };
    });

    originRef.current = { x: clientX, y: clientY, additive, already, kind, items };
    lastRef.current = items.map((item) => ({ id: item.id, x: item.startX, y: item.startY }));
    setInteracting(true);

    let frame = 0;
    let latest: { clientX: number; clientY: number } | null = current || null;

    const applyMove = (point: { clientX: number; clientY: number }) => {
      const origin = originRef.current;
      if (!origin) return;
      const delta = clientDeltaToCanvas(point.clientX - origin.x, point.clientY - origin.y, zoom);
      const primary = origin.items.find((item) => item.id === nodeId) || origin.items[0];
      let deltaX = delta.x;
      let deltaY = delta.y;
      const moving = document.querySelector(`[data-canvas-node="${primary.id}"]`) as HTMLElement | null;
      const parent = moving?.offsetParent as HTMLElement | null;
      if (moving && parent) {
        const nodeKind = moving.dataset.canvasKind || 'element';
        const siblings: GuideBox[] = Array.from(parent.querySelectorAll(`[data-canvas-kind="${nodeKind}"]`))
          .filter((child) => {
            const el = child as HTMLElement;
            return !origin.items.some((entry) => entry.id === el.dataset.canvasNode) && !moving.contains(el) && !el.contains(moving);
          })
          .map((child) => localBox(child as HTMLElement));
        const parentBox: GuideBox = {
          id: parent.dataset.canvasNode || 'parent',
          x: 0,
          y: 0,
          width: parent.clientWidth,
          height: parent.clientHeight,
        };
        const overlay = overlayRef.current;
        const pageRoot = document.getElementById('canvas-root');
        const space = overlay ? overlaySpaceFromElements(parent, overlay) : null;
        const pageBox =
          pageRoot && space
            ? { id: 'canvas-root', ...rectToParentLocal(pageRoot.getBoundingClientRect(), space.parent) }
            : null;
        const snapped = computeAlignmentGuides(
          { id: primary.id, x: primary.startX + delta.x, y: primary.startY + delta.y, width: moving.offsetWidth, height: moving.offsetHeight },
          pageBox ? [...siblings, parentBox] : siblings,
          pageBox || parentBox,
          { snapToGrid: true, grid: 8 }
        );
        deltaX = snapped.x - primary.startX;
        deltaY = snapped.y - primary.startY;
        if (space) {
          setGuides(
            snapped.guides.map((guide) => ({
              ...guide,
              position: parentLocalToOverlay(guide.position, guide.axis, space),
            }))
          );
        } else {
          const factor = (zoom || 100) / 100;
          setGuides(snapped.guides.map((guide) => ({ ...guide, position: guide.position * factor })));
        }
      }

      const nextItems = origin.items.map((item) => ({ id: item.id, x: item.startX + deltaX, y: item.startY + deltaY }));
      lastRef.current = nextItems;
      for (const item of nextItems) {
        liveGeometryRef.current[item.id] = { left: item.x, top: item.y };
        const node = document.querySelector(`[data-canvas-node="${item.id}"]`) as HTMLElement | null;
        if (!node) continue;
        preserveNavbarFlowSlot(node);
        node.style.position = 'absolute';
        node.style.left = `${Math.round(item.x)}px`;
        node.style.top = `${Math.round(item.y)}px`;
      }
      requestOverlayMeasure();
    };

    const onMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      latest = { clientX: moveEvent.clientX, clientY: moveEvent.clientY };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (latest) applyMove(latest);
      });
    };

    const onUp = () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (latest) applyMove(latest);
      const origin = originRef.current;
      const last = lastRef.current;
      lastRef.current = [];
      originRef.current = null;
      latest = null;
      for (const item of origin?.items || []) delete liveGeometryRef.current[item.id];
      setInteracting(false);
      setGuides([]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (!origin) return;
      const moved = last.some((item) => {
        const start = origin.items.find((entry) => entry.id === item.id);
        return start && (Math.round(item.x) !== Math.round(start.startX) || Math.round(item.y) !== Math.round(start.startY));
      });
      if (!moved) {
        if (!groupMode && !origin.additive && origin.already) {
          useBuilderStore.getState().selectNode(nodeId, origin.kind, 'replace');
        }
        return;
      }
      const pageNow = useBuilderStore.getState().getActivePage();
      if (!pageNow) return;
      const sectionsNow = normalizePageSections(pageNow.sections, pageNow.id);
      useBuilderStore.getState().updateFreePositions(
        last.map((item) => {
          const latestNode = findNode(sectionsNow, item.id);
          const currentPos = latestNode ? getFreePosition(latestNode.node) : { x: item.x, y: item.y };
          return { id: item.id, position: { ...currentPos, x: item.x, y: item.y } };
        })
      );
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    if (current) applyMove(current);
    return true;
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    if (!enabled) return;
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    beginMove(event.clientX, event.clientY, event);
  };

  return { onPointerDown, beginMove };
}
