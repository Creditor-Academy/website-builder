import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { RiDragMove2Fill } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import useBuilderStore from '@/store/useBuilderStore';
import { NavbarPreview } from '@/components/preview/NavbarPreview';
import { DRAG_THRESHOLD } from '@/builder/selection';
import { useCanvasEngine } from './CanvasEngineContext';
import { useFreePositionDrag } from './CanvasDrag';

export function isNavbarNodeId(id: string | null | undefined): boolean {
  return id === 'navbar' || Boolean(id?.startsWith('navbar-'));
}

export function navbarLinkId(nodeId: string | null | undefined): string | null {
  if (!nodeId?.startsWith('navbar-link-')) return null;
  return nodeId.slice('navbar-link-'.length);
}

export function CanvasNavbar({
  navbar,
  previewMode,
}: {
  navbar: Record<string, unknown> | null;
  previewMode: boolean;
}) {
  const selectNode = useBuilderStore((state) => state.selectNode);
  const updateNavbar = useBuilderStore((state) => state.updateNavbar);
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const { setHoveredNodeId, liveGeometryRef, clickSuppressRef } = useCanvasEngine();
  const selected = isNavbarNodeId(selectedId);
  const styles = (navbar?.styles || {}) as { position?: string; left?: string; top?: string; width?: string; flowHeight?: string | number };
  const live = liveGeometryRef.current.navbar;
  const free = styles.position === 'absolute' || Boolean(live);
  const storedFlow = Math.round(parseFloat(String(styles.flowHeight || '')) || 0);
  const [flowHeight, setFlowHeight] = useState(storedFlow);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const { onPointerDown: onFreeMove, beginMove } = useFreePositionDrag('navbar', !previewMode);

  useLayoutEffect(() => {
    if (storedFlow && storedFlow !== flowHeight) setFlowHeight(storedFlow);
  }, [storedFlow, flowHeight]);

  useLayoutEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    if (free && flowHeight) return;
    const height = node.offsetHeight;
    if (height > 0 && Math.abs(height - flowHeight) > 0.5) setFlowHeight(height);
  }, [free, flowHeight, navbar]);

  if (!navbar) return null;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (previewMode) return;
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('[data-canvas-move], [data-canvas-resize], [data-navbar-go]')) return;
    if (target.closest('[contenteditable="true"]') && document.activeElement === target.closest('[contenteditable="true"]')) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const keys = { shiftKey: event.shiftKey, metaKey: event.metaKey, ctrlKey: event.ctrlKey };
    let dragging = false;

    const onMove = (moveEvent: PointerEvent) => {
      if (dragging) return;
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < DRAG_THRESHOLD) return;
      dragging = true;
      clickSuppressRef.current = true;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      beginMove(startX, startY, keys, { clientX: moveEvent.clientX, clientY: moveEvent.clientY });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  return (
    <>
      <div
        data-navbar-slot
        aria-hidden
        className="pointer-events-none w-full"
        style={{ height: free ? flowHeight : 0 }}
      />
      <div
        ref={hostRef}
        data-canvas-node="navbar"
        data-canvas-kind="navbar"
        data-canvas-name="Navbar"
        className={cn('canvas-node', free ? 'absolute' : 'relative', selected && !previewMode && 'is-selected', !previewMode && 'cursor-grab')}
        style={
          free
            ? {
                position: 'absolute',
                left: live ? Math.round(live.left) : styles.left || 0,
                top: live ? Math.round(live.top) : styles.top || 0,
                width: live?.width != null ? Math.round(live.width) : styles.width || '100%',
                zIndex: 20,
              }
            : { position: 'relative', width: '100%', zIndex: 20 }
        }
        onPointerDown={onPointerDown}
        onPointerOver={(event) => {
          if (previewMode) return;
          event.stopPropagation();
          setHoveredNodeId('navbar');
        }}
        onClick={(event) => {
          if (previewMode) return;
          event.stopPropagation();
          if (clickSuppressRef.current) {
            clickSuppressRef.current = false;
            return;
          }
          if ((event.target as HTMLElement).closest('[data-navbar-item], [data-canvas-move], [data-navbar-go]')) return;
          selectNode('navbar', 'navbar');
        }}
      >
        <NavbarPreview
          config={navbar}
          isEditing={!previewMode}
          selectedItemId={selectedId}
          onSelectItem={(id: string) => selectNode(id, 'navbar')}
          onUpdate={updateNavbar}
        />
        {selected && !previewMode && (
          <button
            type="button"
            data-canvas-move="navbar"
            className="absolute left-1/2 top-full z-30 mt-3.5 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm cursor-grab active:cursor-grabbing"
            aria-label="Move header"
            title="Drag to move header"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => {
              event.stopPropagation();
              onFreeMove(event);
            }}
          >
            <RiDragMove2Fill className="h-5 w-5" />
          </button>
        )}
      </div>
    </>
  );
}
