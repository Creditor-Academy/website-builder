import { useLayoutEffect } from 'react';
import { RiDragMove2Fill } from 'react-icons/ri';
import useBuilderStore from '@/store/useBuilderStore';
import { unionRects } from '@/builder/selection';
import { useCanvasEngine } from './CanvasEngineContext';
import { requestOverlayMeasure, useOverlayBox, useOverlayBoxes } from './useOverlayBox';
import { useFreePositionDrag } from './CanvasDrag';

function selectedRing(kind: string | null) {
  if (kind === 'container') return 'ring-violet-600';
  if (kind === 'element') return 'ring-sky-600';
  if (kind === 'section') return 'ring-blue-600';
  return 'ring-slate-900';
}

export function CanvasSelection() {
  const { previewMode, hoveredNodeId, editingNodeId } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedIds = useBuilderStore((state) => state.editor.selectedNodeIds || []);
  const selectedKind = useBuilderStore((state) => state.editor.selectedKind);
  const boxes = useOverlayBoxes(previewMode ? [] : selectedIds);
  const hoverId = !previewMode && hoveredNodeId && !selectedIds.includes(hoveredNodeId) ? hoveredNodeId : null;
  const hoverBox = useOverlayBox(hoverId);
  const group = selectedIds.length > 1 ? unionRects(Object.values(boxes)) : null;
  const single = selectedIds.length === 1 ? boxes[selectedIds[0]] : null;
  const { onPointerDown: onGroupMove } = useFreePositionDrag(
    selectedId || selectedIds[0] || '',
    Boolean(!previewMode && selectedIds.length > 1),
    { group: true }
  );

  useLayoutEffect(() => {
    if (selectedIds.length > 1) requestOverlayMeasure();
  }, [selectedIds]);

  if (previewMode) return null;

  return (
    <>
      {single && (
        <div
          className={`pointer-events-none absolute rounded-sm ring-2 ${selectedRing(selectedKind)}`}
          style={single}
        />
      )}
      {group && (
        <div
          className="pointer-events-none absolute rounded-sm ring-2 ring-sky-600"
          style={group}
        />
      )}
      {group && !editingNodeId && (
        <button
          type="button"
          data-canvas-move="group"
          className="pointer-events-auto absolute z-50 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-md bg-slate-900 text-white shadow-md cursor-grab active:cursor-grabbing"
          style={{ left: group.left + group.width / 2, top: group.top + group.height + 14 }}
          aria-label="Move selected items"
          title="Drag to move selected items"
          onPointerDown={onGroupMove}
          onClick={(event) => event.stopPropagation()}
        >
          <RiDragMove2Fill className="h-4 w-4" />
        </button>
      )}
      {hoverBox && (
        <div
          className="pointer-events-none absolute rounded-sm ring-1 ring-dashed ring-sky-400/80"
          style={hoverBox}
        />
      )}
    </>
  );
}
