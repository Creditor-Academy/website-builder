import { memo, useCallback, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ChevronUp, Lock } from 'lucide-react';
import { RiDragMove2Fill } from 'react-icons/ri';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import type { CanvasContainer, CanvasElement, CanvasSection, DeviceId, NodeKind } from '@/builder/types';
import { resolveStyles, stylesToCss } from '@/builder/styles';
import { sortByOrder, isFreePositioned } from '@/builder/tree';
import { isLayoutSurface } from '@/builder/freeMove';
import { DRAG_THRESHOLD } from '@/builder/selection';
import { canvasDragId, ELEMENT_ACCEPTS, type CanvasDragData } from '@/builder/dnd';
import { DropZone } from '@/builder/components/DropZone';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { useCanvasEngine } from './CanvasEngineContext';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { useFreePositionDrag } from './CanvasDrag';
import { useCanvasDndState } from '@/builder/components/CanvasDndContext';

function chromeColor(kind: NodeKind) {
  if (kind === 'section') return 'bg-blue-600';
  if (kind === 'container') return 'bg-violet-600';
  return 'bg-sky-600';
}

function isFormFieldTarget(target: EventTarget | null) {
  const node = target as HTMLElement | null;
  return Boolean(node?.closest?.('input, textarea, select, option, label, [data-canvas-form-field]'));
}

export const CanvasNodeFrame = memo(function CanvasNodeFrame({
  id,
  kind,
  name,
  type,
  hidden,
  locked,
  previewMode,
  children,
  className,
  style,
  onSelectParent,
  parentId,
  parentKind,
  index,
  pageId,
  childCount,
  dragDisabled,
}: {
  id: string;
  kind: NodeKind;
  name: string;
  type?: string;
  hidden?: boolean;
  locked?: boolean;
  previewMode: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onSelectParent?: () => void;
  parentId?: string;
  parentKind?: NodeKind;
  index?: number;
  pageId?: string;
  childCount?: number;
  dragDisabled?: boolean;
}) {
  const selectedIds = useBuilderStore((state) => state.editor.selectedNodeIds);
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selected = Boolean(selectedIds?.includes(id) || selectedId === id);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const { hoveredNodeId, setHoveredNodeId, liveGeometryRef, clickSuppressRef } = useCanvasEngine();
  const live = liveGeometryRef.current[id];
  const mergedStyle = live
    ? {
        ...style,
        position: 'absolute' as const,
        left: Math.round(live.left),
        top: Math.round(live.top),
        ...(live.width != null ? { width: Math.round(live.width), minWidth: Math.round(live.width), maxWidth: Math.round(live.width) } : {}),
        ...(live.height != null ? { height: Math.round(live.height), minHeight: Math.round(live.height), maxHeight: Math.round(live.height) } : {}),
        ...(live.rotation != null ? { transform: `rotate(${live.rotation}deg)` } : {}),
      }
    : style;
  const { isDragging } = useCanvasDndState();
  const multiSelected = Boolean(selected && (selectedIds?.length || 0) > 1);
  const showMoveHandle = !previewMode && !locked && selected && !multiSelected;
  const slideObject = kind === 'element' || kind === 'container';
  const positioned = style?.position === 'absolute' || Boolean(live);
  const { onPointerDown: onFreeMove, beginMove } = useFreePositionDrag(
    id,
    Boolean(slideObject && !previewMode && !locked && !dragDisabled),
    { group: multiSelected }
  );
  const sectionDragEnabled = !previewMode && !locked && !dragDisabled && !slideObject;
  const { attributes, listeners, setNodeRef: setDragRef, isDragging: nodeDragging } = useDraggable({
    id: canvasDragId(kind, id),
    data: {
      source: 'canvas',
      nodeId: id,
      kind,
      type: type || kind,
      name,
      parentId,
      index,
      pageId,
      locked,
      childCount,
      parentKind,
    } satisfies CanvasDragData,
    disabled: !sectionDragEnabled,
  });
  const { setNodeRef: setDropRef } = useDroppable({
    id: canvasDragId(kind, id),
    data: {
      source: 'canvas',
      nodeId: id,
      kind,
      type: type || kind,
      name,
      parentId,
      index,
      pageId,
      locked,
      childCount,
      parentKind,
    } satisfies CanvasDragData,
    disabled: previewMode || !isDragging,
  });

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef]
  );

  return (
    <div
      ref={setRefs}
      data-canvas-node={id}
      data-canvas-kind={kind}
      data-canvas-name={name}
      data-canvas-parent={parentId || ''}
      data-canvas-index={index ?? 0}
      data-canvas-children={childCount ?? 0}
      className={cn(
        'canvas-node',
        positioned ? 'absolute' : 'relative',
        selected && !previewMode && 'is-selected',
        hoveredNodeId === id && !selected && !previewMode && 'is-hovered',
        hidden && 'opacity-40',
        nodeDragging && 'opacity-40',
        !previewMode && !locked && 'cursor-pointer',
        slideObject && !previewMode && !locked && 'touch-none select-none',
        selected && slideObject && !previewMode && !locked && 'cursor-grab active:cursor-grabbing',
        'overflow-visible',
        className
      )}
      style={mergedStyle}
      onPointerOver={(event) => {
        if (previewMode) return;
        event.stopPropagation();
        setHoveredNodeId(id);
      }}
      onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
        if (previewMode || locked || dragDisabled || !slideObject) return;
        if (event.button !== 0) return;
        if ((event.target as HTMLElement).closest('[data-canvas-move], [data-canvas-resize], [data-canvas-rotate], video, iframe, button')) return;
        if (isFormFieldTarget(event.target)) return;
        const additive = event.shiftKey || event.metaKey || event.ctrlKey;
        if (!selected && !additive) {
          selectNode(id, kind, 'replace');
        }
        if (selected) event.preventDefault();
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
      }}
      onContextMenu={(event) => {
        if (previewMode) return;
        event.preventDefault();
        event.stopPropagation();
        if (!selected) selectNode(id, kind, 'replace');
      }}
      onClick={(event) => {
        if (previewMode) return;
        event.stopPropagation();
        if (clickSuppressRef.current) {
          clickSuppressRef.current = false;
          return;
        }
        if ((event.target as HTMLElement).closest('[data-canvas-move], video, iframe')) return;
        if (isFormFieldTarget(event.target)) return;
        const additive = event.shiftKey || event.metaKey || event.ctrlKey;
        selectNode(id, kind, additive ? 'toggle' : 'replace');
      }}
    >
      {!previewMode && !multiSelected && (
        <div
          className={cn(
            'canvas-node-label pointer-events-none absolute -top-6 left-0 z-20 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white',
            chromeColor(kind),
            selected || hoveredNodeId === id ? 'opacity-100' : 'opacity-0',
            (selected || hoveredNodeId === id) && 'pointer-events-auto'
          )}
        >
          <span>{name}</span>
          {locked && <Lock className="h-3 w-3 opacity-80" />}
          {selected && onSelectParent && (
            <button type="button" className="rounded p-0.5 hover:bg-white/20" aria-label="Select parent" title="Select parent" onClick={(event) => { event.stopPropagation(); onSelectParent(); }}>
              <ChevronUp className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      {children}
      {showMoveHandle && !(slideObject && positioned) && (
        <button
          type="button"
          data-canvas-move={id}
          className="absolute left-1/2 top-full z-30 mt-2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm cursor-grab active:cursor-grabbing"
          aria-label={`Move ${name}`}
          title="Drag to move"
          {...(sectionDragEnabled ? attributes : {})}
          {...(sectionDragEnabled ? listeners : {})}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (dragDisabled) return;
            if (slideObject) {
              onFreeMove(event);
              return;
            }
            listeners.onPointerDown?.(event);
          }}
        >
          <RiDragMove2Fill className="h-5 w-5" />
        </button>
      )}
    </div>
  );
});

export const CanvasElementNode = memo(function CanvasElementNode({
  element,
  device,
  previewMode,
  onSelectParent,
  parentId,
  index,
}: {
  element: CanvasElement;
  device: DeviceId;
  previewMode: boolean;
  onSelectParent: () => void;
  parentId: string;
  index: number;
}) {
  const { editingNodeId, setEditingNodeId } = useCanvasEngine();
  const updateCanvasNode = useBuilderStore((state) => state.updateCanvasNode);
  const visible = element.visibility?.[device] !== false;
  if (!visible && previewMode) return null;
  const editing = editingNodeId === element.id;
  const css = stylesToCss(resolveStyles(element.styles, element.responsiveStyles, device));
  const free = Boolean(element.properties?.placement === 'absolute' || element.styles?.position === 'absolute');
  return (
    <CanvasNodeFrame
      id={element.id}
      kind="element"
      type={element.type}
      name={element.name || element.type}
      hidden={!visible}
      locked={element.locked}
      previewMode={previewMode}
      onSelectParent={onSelectParent}
      parentId={parentId}
      parentKind="container"
      index={index}
      childCount={0}
      dragDisabled={editing}
      style={free ? { ...css, position: 'absolute' } : undefined}
    >
      <div
        data-canvas-content
        className={free ? 'h-full w-full overflow-hidden' : undefined}
        style={free ? { width: '100%', height: '100%', boxSizing: 'border-box' } : css}
        onDoubleClick={(event) => {
          if (previewMode || element.locked || element.type !== 'text') return;
          event.stopPropagation();
          setEditingNodeId(element.id);
        }}
      >
        <CanvasElementRenderer
          element={element}
          css={{
            ...css,
            position: 'relative',
            left: undefined,
            top: undefined,
            ...(free ? { width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', boxSizing: 'border-box' } : {}),
          }}
          editing={editing}
          editingCanvas={!previewMode}
          onSaveText={(html) => {
            updateCanvasNode(element.id, { content: { ...element.content, text: html } });
            setEditingNodeId(null);
          }}
          onCancelEdit={() => setEditingNodeId(null)}
        />
      </div>
    </CanvasNodeFrame>
  );
});

export const CanvasContainerNode = memo(function CanvasContainerNode({
  container,
  device,
  previewMode,
  onSelectParent,
  parentId,
  index,
}: {
  container: CanvasContainer;
  device: DeviceId;
  previewMode: boolean;
  onSelectParent: () => void;
  parentId: string;
  index: number;
}) {
  const visible = container.visibility?.[device] !== false;
  if (!visible && previewMode) return null;
  const css = stylesToCss(resolveStyles(container.styles, container.responsiveStyles, device));
  const children = sortByOrder(container.children || []);
  const free = Boolean(container.properties?.placement === 'absolute' || container.styles?.position === 'absolute');
  const surface = isLayoutSurface(container) || !isFreePositioned(container);

  if (surface) {
    return (
      <div
        data-canvas-node={container.id}
        data-canvas-kind="container"
        data-canvas-surface="true"
        data-canvas-parent={parentId}
        data-canvas-index={index}
        data-canvas-children={children.length}
        className={cn('relative w-full overflow-visible', !visible && 'opacity-40')}
        style={{ ...css, position: 'relative', width: css.width || '100%' }}
      >
        {!previewMode && children.length === 0 && (
          <DropZone parentId={container.id} parentKind="container" index={0} edge="inside" accepts={ELEMENT_ACCEPTS} empty />
        )}
        {children.map((element, elementIndex) => (
          <CanvasElementNode
            key={element.id}
            element={element}
            device={device}
            previewMode={previewMode}
            parentId={container.id}
            index={elementIndex}
            onSelectParent={onSelectParent}
          />
        ))}
      </div>
    );
  }

  return (
    <CanvasNodeFrame
      id={container.id}
      kind="container"
      type="container"
      name={container.name || 'Container'}
      hidden={!visible}
      locked={container.locked}
      previewMode={previewMode}
      onSelectParent={onSelectParent}
      parentId={parentId}
      parentKind="section"
      index={index}
      childCount={children.length}
      style={free ? { ...css, position: 'absolute' } : { ...css, position: 'relative', width: css.width || '100%' }}
    >
      {!previewMode && children.length === 0 && (
        <DropZone parentId={container.id} parentKind="container" index={0} edge="inside" accepts={ELEMENT_ACCEPTS} empty />
      )}
      {children.map((element, elementIndex) => (
        <CanvasElementNode
          key={element.id}
          element={element}
          device={device}
          previewMode={previewMode}
          parentId={container.id}
          index={elementIndex}
          onSelectParent={() => useBuilderStore.getState().selectNode(container.id, 'container')}
        />
      ))}
    </CanvasNodeFrame>
  );
});

export const CanvasSectionNode = memo(function CanvasSectionNode({
  section,
  index,
  device,
  previewMode,
  isAlternate,
  pageId,
}: {
  section: CanvasSection;
  index: number;
  device: DeviceId;
  previewMode: boolean;
  isAlternate: boolean;
  pageId: string;
}) {
  const selectNode = useBuilderStore((state) => state.selectNode);
  const updateSection = useBuilderStore((state) => state.updateSection);
  const visible = section.visible !== false && section.visibility?.[device] !== false;
  if (!visible && previewMode) return null;
  const css = stylesToCss(resolveStyles(section.styles, section.responsiveStyles, device));
  const isCanvas = section.kind === 'canvas' && (section.children || []).length > 0;
  const containers = sortByOrder(section.children || []);

  return (
    <CanvasNodeFrame
      id={section.id}
      kind="section"
      type={section.type}
      name={section.name || section.type}
      hidden={!visible}
      locked={section.locked}
      previewMode={previewMode}
      parentId={pageId}
      parentKind="page"
      index={index}
      pageId={pageId}
      childCount={containers.length}
      style={{
        ...css,
        position: 'relative',
        minHeight: css.minHeight || '800px',
        ...(isCanvas ? { padding: 0 } : {}),
      }}
    >
      {isCanvas ? (
        containers.map((container, containerIndex) => (
          <CanvasContainerNode
            key={container.id}
            container={container}
            device={device}
            previewMode={previewMode}
            parentId={section.id}
            index={containerIndex}
            onSelectParent={() => selectNode(section.id, 'section')}
          />
        ))
      ) : (
        <SectionRenderer
          section={section}
          idx={index}
          isAlternate={isAlternate}
          isSelected={false}
          isEditing={!previewMode}
          onContentChange={(field, value) => {
            updateSection(section.id, { content: { ...section.content, [field]: value } });
          }}
        />
      )}
    </CanvasNodeFrame>
  );
});
