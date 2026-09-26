import { useMemo, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import useBuilderStore from '@/store/useBuilderStore';
import { ELEMENT_CATALOG, PREBUILT_CATALOG, footerFromCatalog, navbarFromCatalog } from '@/builder/catalog';
import { findNode, isFreePositioned } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { parseDragId, resolveDropAction, type BuilderDragData, type CanvasDragData, type PaletteDragData } from '@/builder/dnd';
import { calculateDropPosition, calculatedDropToTarget, canDrop, closestSibling, indexAlongAxis, refineElementDrop, sameCalculatedDrop, sortCanvasCollisions, type CalculatedDrop, type DropOver, type DropSource, type SiblingRect } from '@/builder/canvas/drop';
import { clientPointInElement } from '@/builder/canvas/coordinates';
import { CanvasDndContext, type CanvasDndState } from './CanvasDndContext';

function descendantNodeIds(nodeId?: string): Set<string> {
  const ids = new Set<string>();
  if (!nodeId) return ids;
  const root = document.querySelector(`[data-canvas-node="${nodeId}"]`);
  if (!root) return ids;
  root.querySelectorAll('[data-canvas-node]').forEach((node) => {
    const id = (node as HTMLElement).dataset.canvasNode;
    if (id && id !== nodeId) ids.add(id);
  });
  return ids;
}

function readSiblingRects(parentId: string): SiblingRect[] {
  return Array.from(document.querySelectorAll(`[data-canvas-parent="${parentId}"]`))
    .map((node) => {
      const el = node as HTMLElement;
      const rect = el.getBoundingClientRect();
      return {
        id: el.dataset.canvasNode || '',
        index: Number(el.dataset.canvasIndex || 0),
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          height: rect.height,
          width: rect.width,
        },
      };
    })
    .filter((item) => item.id)
    .sort((a, b) => a.index - b.index);
}

const collisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  const fallback = pointerHits.length ? pointerHits : rectIntersection(args);
  const parsed = parseDragId(String(args.active.id));
  const source = sourceFromActive(
    (args.active.data.current || null) as BuilderDragData | null,
    parsed && 'kind' in parsed ? parsed.kind : undefined,
    parsed && 'nodeId' in parsed ? parsed.nodeId : undefined
  );
  if (!source) return fallback;
  const sorted = sortCanvasCollisions(
    fallback,
    args.droppableRects,
    source,
    String(args.active.id),
    descendantNodeIds(source.nodeId)
  );
  return sorted.length ? sorted : fallback;
};

function OverlayCard({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-900">{title}</p>
      {subtitle ? <p className="text-[10px] uppercase tracking-wide text-slate-400">{subtitle}</p> : null}
    </div>
  );
}

function pointerFromEvent(event: DragOverEvent | DragEndEvent) {
  const activator = event.activatorEvent as PointerEvent | MouseEvent | undefined;
  if (!activator) return null;
  return {
    x: activator.clientX + event.delta.x,
    y: activator.clientY + event.delta.y,
  };
}

function sourceFromActive(active: BuilderDragData | null, parsedKind?: string, parsedId?: string): DropSource | null {
  if (!active) return null;
  if ('itemKind' in active) {
    const item = active as PaletteDragData;
    return {
      source: 'elements-panel',
      kind: item.itemKind === 'prebuilt' ? 'prebuilt' : item.itemKind === 'container' ? 'container' : item.itemKind === 'footer' ? 'footer' : item.itemKind === 'navbar' ? 'navbar' : 'element',
      type: item.elementType || item.itemKind,
      elementType: item.elementType,
    };
  }
  if ('nodeId' in active) {
    const item = active as CanvasDragData;
    return {
      source: item.source === 'layer' ? 'layers' : 'canvas',
      kind: item.kind,
      type: item.type,
      nodeId: item.nodeId || parsedId,
      parentId: item.parentId,
      index: item.index,
      locked: item.locked,
    };
  }
  return parsedKind && parsedId
    ? { source: 'canvas', kind: parsedKind as DropSource['kind'], nodeId: parsedId }
    : null;
}

function overFromEvent(event: DragOverEvent | DragEndEvent, pageId?: string): DropOver | null {
  const over = event.over;
  if (!over) return null;
  const parsed = parseDragId(String(over.id));
  const data = (over.data.current || {}) as CanvasDragData;
  const rect = {
    top: over.rect.top,
    bottom: over.rect.top + over.rect.height,
    left: over.rect.left,
    right: over.rect.left + over.rect.width,
    height: over.rect.height,
    width: over.rect.width,
  };

  if (parsed?.origin === 'drop') {
    return {
      id: parsed.parentId,
      kind: parsed.parentKind,
      index: parsed.index,
      parentId: parsed.parentId,
      parentKind: parsed.parentKind,
      childCount: 0,
      rect,
    };
  }

  if (parsed && (parsed.origin === 'node' || parsed.origin === 'layer')) {
    return {
      id: parsed.nodeId,
      kind: parsed.kind,
      type: data.type,
      index: data.index ?? 0,
      parentId: data.parentId || (parsed.kind === 'section' ? pageId || '' : parsed.nodeId),
      parentKind: data.parentKind || (parsed.kind === 'element' ? 'container' : parsed.kind === 'container' ? 'section' : 'page'),
      childCount: data.childCount ?? 0,
      locked: data.locked,
      rect,
    };
  }

  return null;
}

function finalizeDrop(pointer: { x: number; y: number }, over: DropOver, source: DropSource): CalculatedDrop | null {
  const siblings = readSiblingRects(over.id);
  let calculated = calculateDropPosition(pointer, over, source, { siblings });
  if (!calculated) return null;

  const elementLike = source.kind === 'element' || Boolean(source.elementType);
  if (elementLike && over.kind !== 'element') {
    let containers: SiblingRect[] = [];
    if (over.kind === 'container') {
      containers = [{ id: over.id, index: over.index, rect: over.rect }];
    } else if (over.kind === 'section') {
      containers = siblings;
    } else if (over.kind === 'page') {
      const section = closestSibling(pointer, siblings);
      containers = section ? readSiblingRects(section.id) : [];
    }
    if (containers.length) {
      const elementsByContainer: Record<string, SiblingRect[]> = {};
      containers.forEach((container) => {
        elementsByContainer[container.id] = readSiblingRects(container.id);
      });
      calculated = refineElementDrop(calculated, pointer, containers, elementsByContainer);
    }
  }

  if (source.kind === 'container' && over.kind === 'section' && siblings.length) {
    const insert = indexAlongAxis(pointer, siblings);
    if (insert) {
      calculated = {
        targetId: insert.targetId,
        parentId: over.id,
        parentKind: 'section',
        position: insert.edge,
        index: insert.index,
        edge: insert.edge,
        accepts: ['container'],
      };
    }
  }

  if ((source.kind === 'section' || source.kind === 'prebuilt') && over.kind === 'page' && siblings.length) {
    const insert = indexAlongAxis(pointer, siblings);
    if (insert) {
      calculated = {
        targetId: insert.targetId,
        parentId: over.id,
        parentKind: 'page',
        position: insert.edge,
        index: insert.index,
        edge: insert.edge,
        accepts: ['section'],
      };
    }
  }

  return calculated;
}

export function CanvasDndProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<BuilderDragData | null>(null);
  const [dropIndicator, setDropIndicator] = useState<CalculatedDrop | null>(null);
  const [dropValid, setDropValid] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const value = useMemo<CanvasDndState>(
    () => ({ isDragging: Boolean(active), active, dropIndicator, dropValid }),
    [active, dropIndicator, dropValid]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActive((event.active.data.current || null) as BuilderDragData | null);
    useBuilderStore.getState().setEditorState({ isDragging: true });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const page = useBuilderStore.getState().getActivePage();
    const pointer = pointerFromEvent(event);
    const parsed = parseDragId(String(event.active.id));
    const source = sourceFromActive((event.active.data.current || active) as BuilderDragData | null, parsed && 'kind' in parsed ? parsed.kind : undefined, parsed && 'nodeId' in parsed ? parsed.nodeId : undefined);
    const over = overFromEvent(event, page?.id);
    if (!pointer || !source || !over || !page) {
      setDropIndicator(null);
      setDropValid(true);
      return;
    }
    const sections = normalizePageSections(page.sections, page.id);
    const calculated = finalizeDrop(pointer, over, source);
    if (!calculated) {
      setDropIndicator(null);
      setDropValid(true);
      return;
    }
    const valid = canDrop(sections, source, calculated);
    setDropValid(valid);
    setDropIndicator((current) => (sameCalculatedDrop(current, calculated) ? current : calculated));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active: activeItem, over } = event;
    const page = useBuilderStore.getState().getActivePage();
    const parsed = parseDragId(String(activeItem.id));
    const source = sourceFromActive((activeItem.data.current || active) as BuilderDragData | null, parsed && 'kind' in parsed ? parsed.kind : undefined, parsed && 'nodeId' in parsed ? parsed.nodeId : undefined);
    const store = useBuilderStore.getState();
    const pointer = pointerFromEvent(event);
    const overNow = overFromEvent(event, page?.id);
    const calculated =
      pointer && source && overNow ? finalizeDrop(pointer, overNow, source) : dropIndicator;
    setActive(null);
    setDropIndicator(null);
    setDropValid(true);
    store.setEditorState({ isDragging: false });
    if (!page) return;

    if (source?.kind !== 'footer' && source?.kind !== 'navbar') {
      if (calculated && source && !canDrop(normalizePageSections(page.sections, page.id), source, calculated)) {
        return;
      }

      if (source?.kind === 'element' || source?.nodeId) {
        const found = source.nodeId
          ? findNode(normalizePageSections(page.sections, page.id), source.nodeId)
          : null;
        if (source.kind === 'element' || source.kind === 'container' || (found && isFreePositioned(found.node))) return;
      }
    }

    const target = calculated ? calculatedDropToTarget(calculated) : null;
    const action = resolveDropAction(
      String(activeItem.id),
      over ? String(over.id) : null,
      activeItem.data.current,
      over?.data.current,
      page.id,
      target
    );
    if (!action) {
      if (calculated && source?.nodeId) {
        store.moveCanvasNode(source.nodeId, calculatedDropToTarget(calculated));
      }
      return;
    }

    if (action.type === 'navbar') {
      const catalog = [...ELEMENT_CATALOG, ...PREBUILT_CATALOG].find((item) => item.id === action.catalogId);
      const preset = catalog?.createNavbar?.() || navbarFromCatalog(action.catalogId);
      store.updateNavbar({ ...preset, id: page.navbar?.id || preset.id });
      store.selectNode('navbar', 'navbar');
      return;
    }
    if (action.type === 'footer') {
      const preset = footerFromCatalog(action.catalogId);
      store.updateFooter({ ...preset, id: page.footer?.id || preset.id });
      store.selectNode('footer', 'footer');
      return;
    }
    if (action.type === 'move') {
      store.moveCanvasNode(action.nodeId, action.target);
      store.selectNode(action.nodeId);
      return;
    }
    if (action.type === 'palette') {
      const catalog = [...ELEMENT_CATALOG, ...PREBUILT_CATALOG].find((item) => item.id === action.item.catalogId);
      if (catalog?.kind === 'navbar') {
        const preset = catalog.createNavbar?.() || navbarFromCatalog(catalog.id);
        store.updateNavbar({ ...preset, id: page.navbar?.id || preset.id });
        store.selectNode('navbar', 'navbar');
        return;
      }
      if (catalog?.kind === 'footer') {
        const preset = catalog.createFooter?.() || footerFromCatalog(catalog.id);
        store.updateFooter({ ...preset, id: page.footer?.id || preset.id });
        store.selectNode('footer', 'footer');
        return;
      }
      const dropTarget = action.target || target;
      const pointer = pointerFromEvent(event);
      const zoom = store.editor.zoom || 100;
      const containerId =
        dropTarget?.parentKind === 'container'
          ? dropTarget.parentId
          : (document.querySelector(`[data-canvas-kind="container"]`) as HTMLElement | null)?.dataset.canvasNode;
      const containerEl = containerId
        ? (document.querySelector(`[data-canvas-node="${containerId}"]`) as HTMLElement | null)
        : null;
      const at =
        pointer && containerEl ? clientPointInElement(pointer.x, pointer.y, containerEl, zoom) : undefined;
      store.addPaletteItem(
        {
          ...action.item,
          catalogId: catalog?.id || action.item.catalogId,
        },
        dropTarget,
        catalog?.createPrebuilt?.(),
        at
      );
    }
  };

  const overlay = (() => {
    if (!active) return null;
    if ('itemKind' in active) {
      const item = active as PaletteDragData;
      return <OverlayCard title={item.name} subtitle={item.itemKind} />;
    }
    if ('nodeId' in active) {
      const item = active as CanvasDragData;
      return <OverlayCard title={item.name} subtitle={item.kind} />;
    }
    return null;
  })();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      autoScroll={{ threshold: { x: 0.12, y: 0.18 }, acceleration: 12 }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={() => {
        setActive(null);
        setDropIndicator(null);
        setDropValid(true);
        useBuilderStore.getState().setEditorState({ isDragging: false });
      }}
      onDragEnd={handleDragEnd}
    >
      <CanvasDndContext.Provider value={value}>
        {children}
        <DragOverlay dropAnimation={null} zIndex={200}>{overlay}</DragOverlay>
      </CanvasDndContext.Provider>
    </DndContext>
  );
}
