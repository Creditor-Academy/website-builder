import { useMemo } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, isFreePositioned } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { useCanvasEngine } from './CanvasEngineContext';

export function CanvasGuides() {
  const { guides, overlayRef, previewMode, interacting } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const page = useBuilderStore((state) => state.getActivePage());
  const selectedIsFree = useMemo(() => {
    if (!page || !selectedId) return interacting;
    const found = findNode(normalizePageSections(page.sections, page.id), selectedId);
    return Boolean(found?.kind === 'element' || found?.kind === 'container' || (found && isFreePositioned(found.node)));
  }, [page, selectedId, interacting]);

  if (previewMode || !interacting || !selectedIsFree || !guides.length || !overlayRef.current) return null;

  return (
    <>
      {guides.map((guide) =>
        guide.axis === 'x' ? (
          <div
            key={`x-${guide.type}-${guide.position}`}
            className="pointer-events-none absolute z-40 w-px bg-fuchsia-400"
            style={{ left: guide.position, top: 0, bottom: 0 }}
          />
        ) : (
          <div
            key={`y-${guide.type}-${guide.position}`}
            className="pointer-events-none absolute z-40 h-px bg-fuchsia-400"
            style={{ top: guide.position, left: 0, right: 0 }}
          />
        )
      )}
    </>
  );
}
