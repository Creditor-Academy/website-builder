import { Copy, Image as ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { useCanvasEngine } from './CanvasEngineContext';
import { useOverlayBox } from './useOverlayBox';
import { isNavbarNodeId, navbarLinkId } from './CanvasNavbar';
import { toolbarPosition } from './toolbar';

export function CanvasToolbar() {
  const { previewMode, editingNodeId } = useCanvasEngine();
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectedKind = useBuilderStore((state) => state.editor.selectedKind);
  const page = useBuilderStore((state) => state.getActivePage());
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const addCanvasContainer = useBuilderStore((state) => state.addCanvasContainer);
  const addCanvasElement = useBuilderStore((state) => state.addCanvasElement);
  const box = useOverlayBox(selectedId);

  const location = page && selectedId ? findNode(normalizePageSections(page.sections, page.id), selectedId) : null;
  const locked = Boolean(location?.node.locked);
  const isText = selectedKind === 'element' && location && 'type' in location.node && location.node.type === 'text';
  const isImage = selectedKind === 'element' && location && 'type' in location.node && location.node.type === 'image';

  const pos = box ? toolbarPosition(box) : null;

  const navbarLink = navbarLinkId(selectedId);
  const isNavbar = selectedKind === 'navbar' || isNavbarNodeId(selectedId);

  if (previewMode || !selectedId || !pos || editingNodeId) return null;

  return (
    <div
      className="pointer-events-auto absolute z-40 flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white px-1 py-0.5 shadow-md"
      style={{ left: pos.left, top: pos.top, transform: pos.transform }}
      onClick={(event) => event.stopPropagation()}
    >
      {(isText || isNavbar) && (
        <button type="button" className="rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Edit" onClick={() => useBuilderStore.getState().setEditorState({ showRightPanel: true })}>
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
      {isImage && (
        <button type="button" className="rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Replace" onClick={() => useBuilderStore.getState().setEditorState({ showRightPanel: true })}>
          <ImageIcon className="h-3.5 w-3.5" />
        </button>
      )}
      {selectedKind === 'section' && (
        <button type="button" className="rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Add container" disabled={locked} onClick={() => addCanvasContainer()}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
      {selectedKind === 'container' && (
        <button type="button" className="rounded p-1.5 text-slate-600 hover:bg-slate-100" title="Add text" disabled={locked} onClick={() => addCanvasElement('text')}>
          <Plus className="h-3.5 w-3.5" />
        </button>
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
        onClick={() => deleteCanvasNode(selectedId)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
