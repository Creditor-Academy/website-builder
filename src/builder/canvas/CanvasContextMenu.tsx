import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Copy, CopyPlus, Clipboard, Lock, Unlock, Eye, EyeOff, Trash2, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { selectedIdsOf } from '@/builder/selection';
import type { NodeKind } from '@/builder/types';
import { useCanvasEngine } from './CanvasEngineContext';

export function CanvasContextMenu() {
  const { previewMode, viewportRef } = useCanvasEngine();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedIds = useBuilderStore((state) => state.editor.selectedNodeIds || []);
  const page = useBuilderStore((state) => state.getActivePage());
  const location = page && selectedId ? findNode(normalizePageSections(page.sections, page.id), selectedId) : null;
  const locked = Boolean(location?.node.locked);
  const hidden = location?.kind === 'section'
    ? location.node.visible === false
    : Boolean(location && 'visibility' in location.node && location.node.visibility?.desktop === false);

  useEffect(() => {
    if (previewMode) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const node = target.closest('[data-canvas-node]') as HTMLElement | null;
      const id = node?.dataset.canvasNode;
      const kind = node?.dataset.canvasKind as NodeKind | undefined;
      if (!id || !kind || kind === 'page') {
        setMenu(null);
        return;
      }
      event.preventDefault();
      const store = useBuilderStore.getState();
      if (!selectedIdsOf(store.editor).includes(id)) {
        store.selectNode(id, kind, 'replace');
      }
      setMenu({ x: event.clientX, y: event.clientY });
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-canvas-context-menu]')) return;
      setMenu(null);
    };

    viewport.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      viewport.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [previewMode, viewportRef]);

  if (previewMode || !menu || !selectedId) return null;

  const isFooter = selectedId === 'footer';
  const multi = selectedIds.length > 1;
  const store = useBuilderStore.getState();

  const menuNode = isFooter ? (
    <div
      data-canvas-context-menu
      className="pointer-events-auto fixed z-[80] min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
      style={{ left: menu.x, top: menu.y }}
      onClick={(event) => event.stopPropagation()}
    >
      <MenuItem icon={<Trash2 className="h-3.5 w-3.5" />} label="Delete" danger onClick={() => {
        store.deleteCanvasNode('footer');
        setMenu(null);
      }} />
    </div>
  ) : (
    <div
      data-canvas-context-menu
      className="pointer-events-auto fixed z-[80] min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
      style={{ left: menu.x, top: menu.y }}
      onClick={(event) => event.stopPropagation()}
    >
      <MenuItem icon={<CopyPlus className="h-3.5 w-3.5" />} label="Duplicate" disabled={locked} onClick={() => {
        if (multi) store.duplicateCanvasNodes(selectedIds);
        else store.duplicateCanvasNode(selectedId);
        setMenu(null);
      }} />
      <MenuItem icon={<Copy className="h-3.5 w-3.5" />} label="Copy" onClick={() => { store.copyCanvasNode(); setMenu(null); }} />
      <MenuItem icon={<Clipboard className="h-3.5 w-3.5" />} label="Paste" onClick={() => { store.pasteCanvasNode(); setMenu(null); }} />
      <div className="my-1 h-px bg-slate-100" />
      <MenuItem icon={<ArrowUp className="h-3.5 w-3.5" />} label="Bring forward" disabled={locked || multi} onClick={() => { store.shiftCanvasLayer(selectedId, 'forward'); setMenu(null); }} />
      <MenuItem icon={<ArrowDown className="h-3.5 w-3.5" />} label="Send backward" disabled={locked || multi} onClick={() => { store.shiftCanvasLayer(selectedId, 'backward'); setMenu(null); }} />
      <MenuItem icon={<ChevronsUp className="h-3.5 w-3.5" />} label="Bring to front" disabled={locked || multi} onClick={() => { store.shiftCanvasLayer(selectedId, 'front'); setMenu(null); }} />
      <MenuItem icon={<ChevronsDown className="h-3.5 w-3.5" />} label="Send to back" disabled={locked || multi} onClick={() => { store.shiftCanvasLayer(selectedId, 'back'); setMenu(null); }} />
      <div className="my-1 h-px bg-slate-100" />
      <MenuItem
        icon={locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
        label={locked ? 'Unlock' : 'Lock'}
        disabled={multi || !location}
        onClick={() => { if (location) store.updateCanvasNode(selectedId, { locked: !locked }); setMenu(null); }}
      />
      <MenuItem
        icon={hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        label={hidden ? 'Show' : 'Hide'}
        disabled={multi || !location}
        onClick={() => {
          if (!location) return;
          if (location.kind === 'section') store.updateCanvasNode(selectedId, { visible: hidden });
          else store.updateCanvasNode(selectedId, { visibility: { desktop: hidden, tablet: hidden, mobile: hidden } });
          setMenu(null);
        }}
      />
      <div className="my-1 h-px bg-slate-100" />
      <MenuItem icon={<Trash2 className="h-3.5 w-3.5" />} label="Delete" danger disabled={locked} onClick={() => {
        if (multi) store.deleteCanvasNodes(selectedIds);
        else store.deleteCanvasNode(selectedId);
        setMenu(null);
      }} />
    </div>
  );

  return createPortal(menuNode, document.body);
}

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] disabled:opacity-40 ${danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-50'}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
