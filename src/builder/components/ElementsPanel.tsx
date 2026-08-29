import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useBuilderStore from '@/store/useBuilderStore';
import { CATALOG_CATEGORIES, ELEMENT_CATALOG, PREBUILT_CATALOG, type CatalogItem } from '@/builder/catalog';

export function ElementsPanel() {
  const addCanvasElement = useBuilderStore((state) => state.addCanvasElement);
  const addCanvasContainer = useBuilderStore((state) => state.addCanvasContainer);
  const addCanvasSection = useBuilderStore((state) => state.addCanvasSection);
  const [query, setQuery] = useState('');

  const items = useMemo(() => [...ELEMENT_CATALOG, ...PREBUILT_CATALOG], []);
  const grouped = CATALOG_CATEGORIES.map((category) => ({
    name: category,
    items: items.filter((item) => {
      const matchesCategory = item.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    }),
  })).filter((group) => group.items.length > 0);

  const handleAdd = (item: CatalogItem) => {
    if (item.kind === 'element' && item.elementType) {
      addCanvasElement(item.elementType);
      return;
    }
    if (item.kind === 'container') {
      addCanvasContainer();
      return;
    }
    if (item.createPrebuilt) {
      addCanvasSection(item.createPrebuilt());
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex h-12 shrink-0 items-center border-b border-slate-100 px-4">
        <h2 className="text-sm font-semibold text-slate-900">Add</h2>
      </div>
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find an element..."
            className="h-9 rounded-lg border-transparent bg-slate-100 pl-9 pr-8 text-xs shadow-none"
          />
          {query && (
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setQuery('')}>
              <X className="h-3.5 w-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1" id="tour-elements-list">
        <div className="space-y-4 px-2 pb-4">
          {grouped.map((group) => (
            <div key={group.name}>
              <h3 className="mb-1 px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                <span className="border-b-2 border-slate-800 px-1">{group.name}</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-white p-2.5 text-left hover:shadow-[0_4px_4px_-2px_rgba(8,12,22,0.28)]"
                  >
                    <div className="flex w-full min-w-0 items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0F172A] text-white">
                        <item.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </div>
                      <p className="truncate text-xs font-medium text-slate-800">{item.name}</p>
                    </div>
                    <p className="line-clamp-2 text-[10px] leading-snug text-slate-400">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
