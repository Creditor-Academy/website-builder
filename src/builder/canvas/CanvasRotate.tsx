import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { RotateCw } from 'lucide-react';
import { RiDragMove2Fill } from 'react-icons/ri';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, getFreePosition, isFreePositioned } from '@/builder/tree';
import { isLayoutSurface } from '@/builder/freeMove';
import { normalizePageSections } from '@/builder/adapter';
import { useCanvasEngine } from './CanvasEngineContext';
import { useFreePositionDrag } from './CanvasDrag';
import { requestOverlayMeasure, useOverlayBox } from './useOverlayBox';
import { bottomHandlePositions } from './handles';
import { parseRotation, rotationDelta, snapRotation } from './rotation';

export function CanvasRotate() {
  const { previewMode, overlayRef, setInteracting, liveGeometryRef } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedIds = useBuilderStore((state) => state.editor.selectedNodeIds);
  const selectedKind = useBuilderStore((state) => state.editor.selectedKind);
  const page = useBuilderStore((state) => state.getActivePage());
  const box = useOverlayBox(selectedId);
  const dragRef = useRef<{
    origin: { x: number; y: number };
    center: { x: number; y: number };
    start: number;
    last: number;
  } | null>(null);

  const { onPointerDown: onMovePointerDown } = useFreePositionDrag(
    selectedId || '',
    Boolean(!previewMode && selectedId && (selectedIds?.length || 0) <= 1)
  );

  const location = page && selectedId ? findNode(normalizePageSections(page.sections, page.id), selectedId) : null;
  const free = Boolean(location && isFreePositioned(location.node));

  if (previewMode || !selectedId || !box || !location || location.node.locked) return null;
  if ((selectedIds?.length || 0) > 1) return null;
  if (selectedKind !== 'element' && selectedKind !== 'container') return null;
  if (!free) return null;
  if (isLayoutSurface(location.node)) return null;

  const toOverlay = (clientX: number, clientY: number) => {
    const overlay = overlayRef.current?.getBoundingClientRect();
    if (!overlay) return { x: clientX, y: clientY };
    return { x: clientX - overlay.left, y: clientY - overlay.top };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const node = document.querySelector(`[data-canvas-node="${selectedId}"]`) as HTMLElement | null;
    const current = getFreePosition(location.node);
    const start = current.rotation ?? parseRotation(node?.style.transform || String(location.node.styles?.transform || ''));
    dragRef.current = {
      origin: { x: event.clientX, y: event.clientY },
      center: { x: box.left + box.width / 2, y: box.top + box.height / 2 },
      start,
      last: start,
    };
    setInteracting(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    const applyMove = (moveEvent: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const next = snapRotation(drag.start + rotationDelta(drag.center, toOverlay(drag.origin.x, drag.origin.y), toOverlay(moveEvent.clientX, moveEvent.clientY)), moveEvent.shiftKey);
      drag.last = next;
      liveGeometryRef.current[selectedId] = {
        left: liveGeometryRef.current[selectedId]?.left ?? current.x,
        top: liveGeometryRef.current[selectedId]?.top ?? current.y,
        width: liveGeometryRef.current[selectedId]?.width,
        height: liveGeometryRef.current[selectedId]?.height,
        rotation: next,
      };
      if (node) node.style.transform = `rotate(${next}deg)`;
      requestOverlayMeasure();
    };

    const onMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();
      applyMove(moveEvent);
    };

    const onUp = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      delete liveGeometryRef.current[selectedId];
      setInteracting(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!drag) return;
      useBuilderStore.getState().updateFreePosition(selectedId, {
        ...current,
        rotation: drag.last,
      });
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
  };

  const pos = bottomHandlePositions(box);

  return (
    <>
      <button
        type="button"
        data-canvas-rotate={selectedId}
        aria-label="Rotate"
        title="Drag to rotate"
        className="pointer-events-auto absolute z-50 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md cursor-grab active:cursor-grabbing"
        style={{ left: pos.rotate.left, top: pos.rotate.top }}
        onPointerDown={onPointerDown}
        onClick={(event) => event.stopPropagation()}
      >
        <RotateCw className="h-4 w-4" />
      </button>
      <button
        type="button"
        data-canvas-move={selectedId}
        aria-label="Move"
        title="Drag to move"
        className="pointer-events-auto absolute z-50 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-md bg-slate-900 text-white shadow-md cursor-grab active:cursor-grabbing"
        style={{ left: pos.move.left, top: pos.move.top }}
        onPointerDown={onMovePointerDown}
        onClick={(event) => event.stopPropagation()}
      >
        <RiDragMove2Fill className="h-5 w-5" />
      </button>
    </>
  );
}
