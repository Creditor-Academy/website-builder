import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, isFreePositioned } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { applyResizeDelta, boxToStylePatch, getResizeConfig, type Box, type ResizeHandle } from './resize';
import { clientDeltaToCanvas } from './coordinates';
import { useCanvasEngine } from './CanvasEngineContext';
import { requestOverlayMeasure, useOverlayBox } from './useOverlayBox';
import { growOffsetParents } from '@/builder/freeMove';

const HANDLE_POSITIONS: Record<ResizeHandle, string> = {
  'top-left': 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
  top: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize',
  'top-right': 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
  right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize',
  bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize',
  left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
};

function readStartBox(node: HTMLElement | null, fallback: Box, free: boolean): Box {
  if (!node) return fallback;
  return {
    x: free ? node.offsetLeft : fallback.x,
    y: free ? node.offsetTop : fallback.y,
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
}

function applyLiveBox(node: HTMLElement, box: Box, free: boolean) {
  const width = `${Math.round(box.width)}px`;
  const height = `${Math.round(box.height)}px`;
  node.style.boxSizing = 'border-box';
  node.style.width = width;
  node.style.height = height;
  node.style.minWidth = width;
  node.style.minHeight = height;
  node.style.maxWidth = width;
  node.style.maxHeight = height;
  if (free) {
    node.style.position = 'absolute';
    node.style.left = `${Math.round(box.x)}px`;
    node.style.top = `${Math.round(box.y)}px`;
  }
  const inner = node.querySelector(':scope > [data-canvas-content]') as HTMLElement | null;
  if (inner) {
    inner.style.boxSizing = 'border-box';
    inner.style.width = '100%';
    inner.style.height = '100%';
    inner.style.maxWidth = '100%';
    inner.style.maxHeight = '100%';
    inner.style.overflow = 'hidden';
  }
}

export function CanvasResize() {
  const { previewMode, setResizePreview, setInteracting, setGuides, liveGeometryRef } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedKind = useBuilderStore((state) => state.editor.selectedKind);
  const page = useBuilderStore((state) => state.getActivePage());
  const updateCanvasStyles = useBuilderStore((state) => state.updateCanvasStyles);
  const updateFreePosition = useBuilderStore((state) => state.updateFreePosition);
  const box = useOverlayBox(selectedId);
  const dragRef = useRef<{
    handle: ResizeHandle;
    start: Box;
    origin: { x: number; y: number };
    last: Box;
    free: boolean;
    kind: NonNullable<typeof selectedKind>;
    type?: string;
  } | null>(null);

  const location = page && selectedId ? findNode(normalizePageSections(page.sections, page.id), selectedId) : null;
  const free = Boolean(location && isFreePositioned(location.node)) || selectedId === 'navbar';
  const config = getResizeConfig(selectedKind || 'element', location && 'type' in location.node ? String(location.node.type) : undefined, free);

  if (previewMode || !selectedId || !box || !config.handles.length || location?.node.locked) return null;
  if (selectedKind === 'footer' || selectedKind === 'page') return null;
  if (selectedKind === 'navbar' && selectedId !== 'navbar') return null;

  const onPointerDown = (handle: ResizeHandle) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const zoomPercent = useBuilderStore.getState().editor.zoom || 100;
    const node = document.querySelector(`[data-canvas-node="${selectedId}"]`) as HTMLElement | null;
    const start = readStartBox(node, {
      x: 0,
      y: 0,
      width: box.width / ((zoomPercent || 100) / 100),
      height: box.height / ((zoomPercent || 100) / 100),
    }, free);
    if (free && !node && location) {
      start.x = parseFloat(String(location.node.styles.left || '0')) || 0;
      start.y = parseFloat(String(location.node.styles.top || '0')) || 0;
    }
    dragRef.current = {
      handle,
      start,
      last: start,
      origin: { x: event.clientX, y: event.clientY },
      free,
      kind: selectedKind || 'element',
      type: location && 'type' in location.node ? String(location.node.type) : undefined,
    };
    setInteracting(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const delta = clientDeltaToCanvas(moveEvent.clientX - drag.origin.x, moveEvent.clientY - drag.origin.y, zoomPercent);
      const next = applyResizeDelta(drag.start, drag.handle, delta, config);
      drag.last = next;
      setResizePreview({ nodeId: selectedId, box: next });
      liveGeometryRef.current[selectedId] = {
        left: next.x,
        top: next.y,
        width: next.width,
        height: next.height,
      };
      const moving = document.querySelector(`[data-canvas-node="${selectedId}"]`) as HTMLElement | null;
      if (moving) {
        applyLiveBox(moving, next, drag.free);
        growOffsetParents(moving);
      }
      requestOverlayMeasure();
    };

    const onUp = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      delete liveGeometryRef.current[selectedId];
      setInteracting(false);
      setGuides([]);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!drag) return;
      const next = drag.last;
      const patch = boxToStylePatch(next, drag.kind, drag.free);
      if (drag.free) {
        updateFreePosition(selectedId, {
          x: next.x,
          y: next.y,
          width: next.width,
          height: next.height,
        });
      } else {
        updateCanvasStyles(selectedId, patch);
      }
      setResizePreview(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
    >
      {config.handles.map((handle) => (
        <button
          key={handle}
          type="button"
          aria-label={`Resize ${handle}`}
          className={`pointer-events-auto absolute flex h-4 w-4 items-center justify-center ${HANDLE_POSITIONS[handle]}`}
          onPointerDown={onPointerDown(handle)}
          onClick={(event) => event.stopPropagation()}
        >
          <span className="h-2.5 w-2.5 rounded-sm border border-white bg-[#0F172A] shadow-sm" />
        </button>
      ))}
    </div>
  );
}
