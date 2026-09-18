import { AlignHorizontalSpaceAround, ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode, getFreePosition, isFreePositioned } from '@/builder/tree';
import { isLayoutSurface } from '@/builder/freeMove';
import { normalizePageSections } from '@/builder/adapter';
import { unionRects } from '@/builder/selection';
import { useCanvasEngine } from './CanvasEngineContext';
import { useOverlayBox, useOverlayBoxes } from './useOverlayBox';
import { navbarLinkId } from './CanvasNavbar';
import { toolbarPosition } from './toolbar';

type AlignMode = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

function alignSelected(ids: string[], mode: AlignMode) {
  const page = useBuilderStore.getState().getActivePage();
  if (!page || ids.length < 2) return;
  const sections = normalizePageSections(page.sections, page.id);
  const boxes = ids.flatMap((id) => {
    const node = document.querySelector(`[data-canvas-node="${id}"]`) as HTMLElement | null;
    const found = findNode(sections, id);
    if (!node || !found || found.node.locked || !isFreePositioned(found.node)) return [];
    return [{ id, x: node.offsetLeft, y: node.offsetTop, width: node.offsetWidth, height: node.offsetHeight }];
  });
  if (boxes.length < 2) return;
  const minX = Math.min(...boxes.map((box) => box.x));
  const maxRight = Math.max(...boxes.map((box) => box.x + box.width));
  const minY = Math.min(...boxes.map((box) => box.y));
  const maxBottom = Math.max(...boxes.map((box) => box.y + box.height));
  const centerX = (minX + maxRight) / 2;
  const middleY = (minY + maxBottom) / 2;
  useBuilderStore.getState().updateFreePositions(
    boxes.map((box) => {
      const found = findNode(sections, box.id);
      const current = found ? getFreePosition(found.node) : { x: box.x, y: box.y };
      let x = box.x;
      let y = box.y;
      if (mode === 'left') x = minX;
      if (mode === 'center') x = centerX - box.width / 2;
      if (mode === 'right') x = maxRight - box.width;
      if (mode === 'top') y = minY;
      if (mode === 'middle') y = middleY - box.height / 2;
      if (mode === 'bottom') y = maxBottom - box.height;
      return { id: box.id, position: { ...current, x, y } };
    })
  );
}

export function CanvasToolbar() {
  const { previewMode, editingNodeId, overlayRef } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedIds = useBuilderStore((state) => state.editor.selectedNodeIds || []);
  const selectedKind = useBuilderStore((state) => state.editor.selectedKind);
  const page = useBuilderStore((state) => state.getActivePage());
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);
  const duplicateCanvasNodes = useBuilderStore((state) => state.duplicateCanvasNodes);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const deleteCanvasNodes = useBuilderStore((state) => state.deleteCanvasNodes);
  const addCanvasContainer = useBuilderStore((state) => state.addCanvasContainer);
  const addCanvasElement = useBuilderStore((state) => state.addCanvasElement);
  const boxes = useOverlayBoxes(previewMode ? [] : selectedIds);
  const singleBox = useOverlayBox(selectedIds.length === 1 ? selectedId : null);
  const group = selectedIds.length > 1 ? unionRects(Object.values(boxes)) : null;
  const box = group || singleBox;
  const multi = selectedIds.length > 1;
  const overlay = overlayRef.current;

  const location = page && selectedId ? findNode(normalizePageSections(page.sections, page.id), selectedId) : null;
  const locked = Boolean(location?.node.locked);
  const navbarLink = navbarLinkId(selectedId);
  const canShiftLayer = Boolean(
    !multi &&
      selectedId &&
      selectedKind !== 'footer' &&
      selectedKind !== 'navbar' &&
      selectedId !== 'navbar' &&
      selectedId !== 'navbar-logo' &&
      !navbarLink
  );

  const pos = box
    ? toolbarPosition(box, overlay ? { width: overlay.clientWidth, height: overlay.clientHeight } : null)
    : null;

  if (previewMode || !selectedId || !pos || editingNodeId) return null;
  if (location && isLayoutSurface(location.node)) return null;

  return (
    <div
      className="pointer-events-auto absolute z-40 flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-1 py-0.5 shadow-md"
      style={{ left: pos.left, top: pos.top, transform: pos.transform }}
      onClick={(event) => event.stopPropagation()}
    >
      {multi && (
        <span className="px-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{selectedIds.length} selected</span>
      )}
      {canShiftLayer && (
        <>
          <button
            type="button"
            className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            title="Bring forward"
            disabled={locked}
            onClick={() => useBuilderStore.getState().shiftCanvasLayer(selectedId, 'forward')}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            title="Send backward"
            disabled={locked}
            onClick={() => useBuilderStore.getState().shiftCanvasLayer(selectedId, 'backward')}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </>
      )}
      {selectedKind === 'section' && !multi && (
        <button type="button" className="rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Add container" disabled={locked} onClick={() => addCanvasContainer()}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
      {selectedKind === 'container' && !multi && (
        <button type="button" className="rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Add text" disabled={locked} onClick={() => addCanvasElement('text')}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
      {multi && (
        <details className="relative">
          <summary className="list-none cursor-pointer rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Align">
            <AlignHorizontalSpaceAround className="h-3.5 w-3.5" />
          </summary>
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[120px] rounded-md border border-slate-200 bg-white py-1 shadow-md">
            {(['left', 'center', 'right', 'top', 'middle', 'bottom'] as AlignMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className="block w-full px-3 py-1 text-left text-[11px] capitalize text-slate-600 hover:bg-slate-50"
                onClick={() => alignSelected(selectedIds, mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </details>
      )}
      <button
        type="button"
        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
        title="Duplicate"
        disabled={locked || selectedKind === 'footer' || selectedId === 'navbar' || selectedId === 'navbar-logo'}
        onClick={() => {
          if (navbarLink && page?.navbar) {
            const links = page.navbar.links || [];
            const source = links.find((link: { id: string }) => link.id === navbarLink);
            if (!source) return;
            useBuilderStore.getState().updateNavbar({
              links: [...links, { ...source, id: `${source.id}-copy`, label: `${source.label} copy` }],
            });
            return;
          }
          if (multi) {
            duplicateCanvasNodes(selectedIds);
            return;
          }
          duplicateCanvasNode(selectedId);
        }}
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="rounded p-1.5 text-rose-500 hover:bg-rose-50"
        title="Delete"
        disabled={locked}
        onClick={() => {
          if (multi) deleteCanvasNodes(selectedIds);
          else deleteCanvasNode(selectedId);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
