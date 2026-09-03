import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useBuilderStore from '@/store/useBuilderStore';
import { normalizePageSections } from '@/builder/adapter';
import { collectLayerTree } from '@/builder/tree';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { NodeKind } from '@/builder/types';

interface LayerNode {
  id: string;
  kind: NodeKind;
  type: string;
  name: string;
  visible: boolean;
  children: LayerNode[];
}

function LayerRow({
  node,
  depth,
  dragHandleProps,
  onMoveUp,
  onMoveDown,
}: {
  node: LayerNode;
  depth: number;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
  };
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const updateCanvasNode = useBuilderStore((state) => state.updateCanvasNode);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);
  const [open, setOpen] = useState(true);
  const selected = selectedId === node.id;
  const hasChildren = node.children.length > 0;
  const isChrome = node.kind === 'navbar' || node.kind === 'footer';

  return (
    <div>
      <div
        className={cn(
          'group relative flex items-start gap-0.5 rounded-md py-1 pr-1 text-[11px] cursor-pointer',
          selected ? 'bg-slate-100' : 'hover:bg-slate-50'
        )}
        style={{ paddingLeft: 6 + depth * 10 }}
        onClick={() => selectNode(node.id, node.kind)}
      >
        {dragHandleProps ? (
          <button
            type="button"
            className="mt-0.5 flex h-4 w-4 shrink-0 cursor-grab items-center justify-center rounded text-slate-300 hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
            onClick={(event) => event.stopPropagation()}
            {...dragHandleProps.attributes}
            {...dragHandleProps.listeners}
            aria-label="Reorder layer"
          >
            <GripVertical className="h-3 w-3" />
          </button>
        ) : null}
        {hasChildren ? (
          <button
            type="button"
            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-slate-400"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((value) => !value);
            }}
          >
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug text-slate-800 [overflow-wrap:anywhere]">{node.name}</p>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">{node.type}</p>
        </div>
        <div className={cn('absolute right-0.5 top-1 hidden items-center rounded-md shadow-sm group-hover:flex', selected ? 'bg-slate-100' : 'bg-slate-50')}>
          {(onMoveUp || onMoveDown) && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                disabled={!onMoveUp}
                onClick={(event) => {
                  event.stopPropagation();
                  onMoveUp?.();
                }}
                aria-label="Move layer up"
              >
                <ArrowUp className="h-3 w-3 text-slate-400" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                disabled={!onMoveDown}
                onClick={(event) => {
                  event.stopPropagation();
                  onMoveDown?.();
                }}
                aria-label="Move layer down"
              >
                <ArrowDown className="h-3 w-3 text-slate-400" />
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={(event) => event.stopPropagation()}>
                <MoreVertical className="h-3 w-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {!isChrome && (
                <DropdownMenuItem onClick={() => updateCanvasNode(node.id, node.kind === 'section' ? { visible: !node.visible } : { visibility: { desktop: !node.visible, tablet: !node.visible, mobile: !node.visible } })}>
                  {node.visible ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                  {node.visible ? 'Hide' : 'Show'}
                </DropdownMenuItem>
              )}
              {!isChrome && (
                <DropdownMenuItem onClick={() => duplicateCanvasNode(node.id)}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
              )}
              {node.kind !== 'navbar' && (
                <DropdownMenuItem className="text-destructive" onClick={() => deleteCanvasNode(node.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {open && hasChildren && node.children.map((child) => <LayerRow key={child.id} node={child} depth={depth + 1} />)}
    </div>
  );
}

function SortableLayerRow({
  node,
  onMoveUp,
  onMoveDown,
}: {
  node: LayerNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && 'relative z-50 opacity-40')}
    >
      <LayerRow
        node={node}
        depth={0}
        dragHandleProps={{ attributes, listeners }}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </div>
  );
}

export function LayersPanel() {
  const page = useBuilderStore((state) => state.getActivePage());
  const reorderSections = useBuilderStore((state) => state.reorderSections);
  const [query, setQuery] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const tree = useMemo(() => {
    if (!page) return [];
    return collectLayerTree(normalizePageSections(page.sections, page.id)) as unknown as LayerNode[];
  }, [page]);

  const navbarLayer: LayerNode | null = page?.navbar
    ? {
        id: 'navbar',
        kind: 'navbar',
        type: 'navbar',
        name: page.navbar.logo?.text || 'Header',
        visible: true,
        children: [],
      }
    : null;

  const footerLayer: LayerNode | null = page?.footer
    ? {
        id: 'footer',
        kind: 'footer',
        type: 'footer',
        name: page.footer.logo?.text || 'Footer',
        visible: true,
        children: [],
      }
    : null;

  const matchesQuery = (node: { name: string; type: string }) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return node.name.toLowerCase().includes(q) || node.type.toLowerCase().includes(q);
  };

  const filteredSections = tree.filter(matchesQuery);
  const showNavbar = Boolean(navbarLayer && matchesQuery(navbarLayer));
  const showFooter = Boolean(footerLayer && matchesQuery(footerLayer));
  const layerCount = tree.length + (navbarLayer ? 1 : 0) + (footerLayer ? 1 : 0);

  const moveSection = (id: string, direction: -1 | 1) => {
    if (!page) return;
    const ids = page.sections.map((section) => section.id);
    const index = ids.indexOf(id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= ids.length) return;
    reorderSections(arrayMove(ids, index, next));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!page) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = page.sections.map((section) => section.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    reorderSections(arrayMove(ids, oldIndex, newIndex));
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-100 px-4">
        <h2 className="text-sm font-semibold text-slate-900">Layers</h2>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{layerCount}</span>
      </div>
      <div className="px-3 py-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a layer..."
          className="h-9 rounded-lg border-transparent bg-slate-100 text-xs shadow-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {page && (
          <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {page.name}
          </div>
        )}
        {showNavbar && navbarLayer && <LayerRow node={navbarLayer} depth={0} />}
        {filteredSections.length ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredSections.map((node) => node.id)} strategy={verticalListSortingStrategy}>
              {filteredSections.map((node) => {
                const index = page?.sections.findIndex((section) => section.id === node.id) ?? -1;
                const last = (page?.sections.length || 1) - 1;
                return (
                  <SortableLayerRow
                    key={node.id}
                    node={node}
                    onMoveUp={index > 0 ? () => moveSection(node.id, -1) : undefined}
                    onMoveDown={index >= 0 && index < last ? () => moveSection(node.id, 1) : undefined}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        ) : null}
        {showFooter && footerLayer && <LayerRow node={footerLayer} depth={0} />}
        {!showNavbar && !filteredSections.length && !showFooter && (
          <div className="py-12 text-center">
            <Layers className="mx-auto mb-3 h-8 w-8 text-slate-200" />
            <p className="text-sm text-slate-500">No layers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
