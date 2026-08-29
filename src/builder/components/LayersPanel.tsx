import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Layers,
  MoreVertical,
  Trash2,
} from 'lucide-react';
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

function LayerRow({ node, depth }: { node: LayerNode; depth: number }) {
  const selectedId = useBuilderStore((state) => state.editor.selectedNodeId);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const updateCanvasNode = useBuilderStore((state) => state.updateCanvasNode);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);
  const [open, setOpen] = useState(true);
  const selected = selectedId === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md py-1 pr-1 text-[13px] cursor-pointer',
          selected ? 'bg-slate-100' : 'hover:bg-slate-50'
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={() => selectNode(node.id, node.kind)}
      >
        <button
          type="button"
          className="h-5 w-5 shrink-0 text-slate-400"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) setOpen((value) => !value);
          }}
        >
          {hasChildren ? (open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : <span className="inline-block w-3.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-800">{node.name}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">{node.type}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={(event) => event.stopPropagation()}>
              <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => updateCanvasNode(node.id, node.kind === 'section' ? { visible: !node.visible } : { visibility: { desktop: !node.visible, tablet: !node.visible, mobile: !node.visible } })}>
              {node.visible ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
              {node.visible ? 'Hide' : 'Show'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateCanvasNode(node.id)}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => deleteCanvasNode(node.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {open && hasChildren && node.children.map((child) => <LayerRow key={child.id} node={child} depth={depth + 1} />)}
    </div>
  );
}

export function LayersPanel() {
  const page = useBuilderStore((state) => state.getActivePage());
  const [query, setQuery] = useState('');

  const tree = useMemo(() => {
    if (!page) return [];
    return collectLayerTree(normalizePageSections(page.sections, page.id)) as unknown as LayerNode[];
  }, [page]);

  const filtered = tree.filter((node) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return node.name.toLowerCase().includes(q) || node.type.toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-100 px-4">
        <h2 className="text-sm font-semibold text-slate-900">Layers</h2>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-500">{tree.length}</span>
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
        {filtered.length ? (
          filtered.map((node) => <LayerRow key={node.id} node={node} depth={0} />)
        ) : (
          <div className="py-12 text-center">
            <Layers className="mx-auto mb-3 h-8 w-8 text-slate-200" />
            <p className="text-sm text-slate-500">No layers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
