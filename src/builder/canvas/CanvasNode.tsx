import { memo, useCallback, type CSSProperties, type ReactNode } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { ChevronUp, Copy, EyeOff, GripVertical, Lock, Trash2, Unlock } from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import type { CanvasContainer, CanvasElement, CanvasSection, DeviceId, NodeKind } from '@/builder/types';
import { resolveStyles, stylesToCss } from '@/builder/styles';
import { sortByOrder } from '@/builder/tree';
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
  const selected = useBuilderStore((state) => state.editor.selectedNodeId === id);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);
  const updateCanvasNode = useBuilderStore((state) => state.updateCanvasNode);
  const { hoveredNodeId, setHoveredNodeId, liveGeometryRef } = useCanvasEngine();
  const live = liveGeometryRef.current[id];
  const mergedStyle = live
    ? {
        ...style,
        position: 'absolute' as const,
        left: Math.round(live.left),
        top: Math.round(live.top),
        ...(live.width != null ? { width: Math.round(live.width), minWidth: Math.round(live.width), maxWidth: Math.round(live.width) } : {}),
        ...(live.height != null ? { height: Math.round(live.height), minHeight: Math.round(live.height), maxHeight: Math.round(live.height) } : {}),
      }
    : style;
  const { isDragging } = useCanvasDndState();
  const slideObject = kind === 'element' || kind === 'container';
  const positioned = style?.position === 'absolute' || Boolean(live);
  const { onPointerDown: onFreeMove } = useFreePositionDrag(id, Boolean(slideObject && !previewMode && !locked && !dragDisabled));
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
    disabled: previewMode || locked || dragDisabled || slideObject,
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
        slideObject && !previewMode && !locked && 'cursor-move',
        className
      )}
      style={mergedStyle}
      {...(!previewMode && !locked && !dragDisabled && !slideObject ? attributes : {})}
      {...(!previewMode && !locked && !dragDisabled && !slideObject ? listeners : {})}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (previewMode || locked || dragDisabled) return;
        if (slideObject) {
          onFreeMove(event);
          return;
        }
        listeners.onPointerDown?.(event);
      }}
      onPointerOver={(event) => {
        if (previewMode) return;
        event.stopPropagation();
        setHoveredNodeId(id);
      }}
      onClick={(event) => {
        if (previewMode) return;
        event.stopPropagation();
        selectNode(id, kind);
      }}
    >
      {!previewMode && (
        <div
          className={cn(
            'canvas-node-label pointer-events-none absolute -top-6 left-0 z-20 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white',
            chromeColor(kind),
            selected || hoveredNodeId === id ? 'opacity-100' : 'opacity-0',
            selected && 'pointer-events-auto'
          )}
        >
          {!locked && (
            <button
              type="button"
              className="rounded p-0.5 hover:bg-white/20"
              aria-label={`Move ${name}`}
              title="Move"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => {
                event.stopPropagation();
                if (slideObject) {
                  onFreeMove(event);
                  return;
                }
                listeners.onPointerDown?.(event);
              }}
            >
              <GripVertical className="h-3 w-3" />
            </button>
          )}
          <span>{name}</span>
          {locked && <Lock className="h-3 w-3 opacity-80" />}
          {selected && (
            <span className="ml-1 flex items-center gap-0.5">
              {onSelectParent && (
                <button type="button" className="rounded p-0.5 hover:bg-white/20" aria-label="Select parent" title="Select parent" onClick={(event) => { event.stopPropagation(); onSelectParent(); }}>
                  <ChevronUp className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                className="rounded p-0.5 hover:bg-white/20"
                aria-label={locked ? `Unlock ${name}` : `Lock ${name}`}
                title={locked ? 'Unlock' : 'Lock'}
                onClick={(event) => {
                  event.stopPropagation();
                  updateCanvasNode(id, { locked: !locked });
                }}
              >
                {locked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              </button>
              <button
                type="button"
                className="rounded p-0.5 hover:bg-white/20"
                aria-label={`Hide ${name}`}
                title="Hide"
                onClick={(event) => {
                  event.stopPropagation();
                  updateCanvasNode(id, kind === 'section' ? { visible: false } : { visibility: { desktop: false, tablet: false, mobile: false } });
                }}
              >
                <EyeOff className="h-3 w-3" />
              </button>
              <button type="button" className="rounded p-0.5 hover:bg-white/20" aria-label={`Duplicate ${name}`} title="Duplicate" disabled={locked} onClick={(event) => { event.stopPropagation(); if (!locked) duplicateCanvasNode(id); }}>
                <Copy className="h-3 w-3" />
              </button>
              <button type="button" className="rounded p-0.5 hover:bg-white/20" aria-label={`Delete ${name}`} title="Delete" disabled={locked} onClick={(event) => { event.stopPropagation(); if (!locked) deleteCanvasNode(id); }}>
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
      {children}
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
      style={{ ...css, position: 'relative', minHeight: css.minHeight || '800px' }}
      className={cn(!previewMode && 'cursor-pointer')}
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
