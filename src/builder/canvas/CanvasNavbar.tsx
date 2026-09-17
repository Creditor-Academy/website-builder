import { cn } from '@/lib/utils';
import useBuilderStore from '@/store/useBuilderStore';
import { NavbarPreview } from '@/components/preview/NavbarPreview';
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
  const { setHoveredNodeId, liveGeometryRef } = useCanvasEngine();
  const selected = selectedId === 'navbar';
  const styles = (navbar?.styles || {}) as { position?: string; left?: string; top?: string; width?: string };
  const live = liveGeometryRef.current.navbar;
  const free = styles.position === 'absolute' || Boolean(live);
  const { onPointerDown } = useFreePositionDrag('navbar', !previewMode);

  if (!navbar) return null;

  return (
    <div
      data-canvas-node="navbar"
      data-canvas-kind="navbar"
      data-canvas-name="Navbar"
      className={cn('canvas-node', free ? 'absolute' : 'relative', selected && !previewMode && 'is-selected', !previewMode && 'cursor-move')}
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
      onPointerDown={(event) => {
        if (previewMode) return;
        if ((event.target as HTMLElement).closest('[data-navbar-item]')) return;
        onPointerDown(event);
      }}
      onPointerOver={(event) => {
        if (previewMode) return;
        event.stopPropagation();
        setHoveredNodeId('navbar');
      }}
      onClick={(event) => {
        if (previewMode) return;
        event.stopPropagation();
        if ((event.target as HTMLElement).closest('[data-navbar-item]')) return;
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
    </div>
  );
}
