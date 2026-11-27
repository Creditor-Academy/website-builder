import { AlignHorizontalSpaceAround, ArrowDown, ArrowUp, Copy, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

  const isFooter = selectedKind === 'footer' || selectedId === 'footer';
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
      {!isFooter && (
        <>
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
      {location?.node.type === 'icon' && !multi && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 rounded px-2 py-1 text-slate-700 hover:bg-slate-100 text-xs font-medium"
              title="Edit Icon (URL or preset)"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>Edit Icon</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 shadow-xl border-slate-200 z-50 bg-white" sideOffset={8}>
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Icon URL (SVG / Image)</label>
                <input
                  type="text"
                  placeholder="https://... or data:image/..."
                  value={String(location.node.content?.url || '')}
                  onChange={(e) => {
                    useBuilderStore.getState().updateCanvasNode(selectedId, {
                      content: { ...location.node.content, url: e.target.value }
                    });
                  }}
                  className="w-full h-8 px-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Lucide Name</label>
                <input
                  type="text"
                  placeholder="Sparkles, Heart, Star, Check..."
                  value={String(location.node.content?.icon || 'Sparkles')}
                  onChange={(e) => {
                    useBuilderStore.getState().updateCanvasNode(selectedId, {
                      content: { ...location.node.content, icon: e.target.value }
                    });
                  }}
                  className="w-full h-8 px-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-50"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-700">Size</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={12}
                    max={256}
                    value={Number(location.node.content?.size || 28)}
                    onChange={(e) => {
                      const sz = Number(e.target.value) || 28;
                      useBuilderStore.getState().updateCanvasNode(selectedId, {
                        content: { ...location.node.content, size: sz }
                      });
                      useBuilderStore.getState().updateCanvasStyles(selectedId, {
                        width: `${sz}px`,
                        height: `${sz}px`
                      });
                    }}
                    className="w-16 h-7 px-2 text-xs rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-400">px</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Presets</label>
                <div className="flex flex-wrap gap-1">
                  {['Sparkles', 'Star', 'Heart', 'Check', 'Search', 'ArrowRight'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="px-2 py-0.5 text-[10px] rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                      onClick={() => {
                        useBuilderStore.getState().updateCanvasNode(selectedId, {
                          content: { ...location.node.content, icon: p, url: '' }
                        });
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
        disabled={locked || selectedId === 'navbar' || selectedId === 'navbar-logo'}
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
        </>
      )}
      <button
        type="button"
        className="rounded p-1.5 text-rose-500 hover:bg-rose-50"
        title="Delete"
        disabled={locked}
        onClick={() => {
          if (isFooter) {
            deleteCanvasNode('footer');
            return;
          }
          if (multi) deleteCanvasNodes(selectedIds);
          else deleteCanvasNode(selectedId);
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
