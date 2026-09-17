import useBuilderStore from '@/store/useBuilderStore';
import { useCanvasEngine } from './CanvasEngineContext';
import { useOverlayBox } from './useOverlayBox';

function selectedRing(kind: string | null) {
  if (kind === 'container') return 'ring-violet-600';
  if (kind === 'element') return 'ring-sky-600';
  if (kind === 'section') return 'ring-blue-600';
  return 'ring-slate-900';
}

export function CanvasSelection() {
  const { previewMode, hoveredNodeId } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedKind = useBuilderStore((state) => state.editor.selectedKind);
  const selectedBox = useOverlayBox(previewMode ? null : selectedId);
  const hoverId = !previewMode && hoveredNodeId && hoveredNodeId !== selectedId ? hoveredNodeId : null;
  const hoverBox = useOverlayBox(hoverId);

  return (
    <>
      {selectedBox && selectedKind && selectedKind !== 'page' && (
        <div
          className={`pointer-events-none absolute rounded-sm ring-2 ${selectedRing(selectedKind)}`}
          style={selectedBox}
        />
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
