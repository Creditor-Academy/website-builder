import React, { useEffect, useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import websiteApi from '@/api/website';
import { History, RotateCcw, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface VersionRecord {
  id: string;
  kind: 'draft' | 'published';
  label: string;
  createdAt: string;
  updatedAt?: string;
  snapshot: {
    pages: any[];
    activePageId: string | null;
    templateId: string;
  };
}

export function VersionHistoryPanel() {
  const { state } = useBuilder();
  const store = useBuilderStore();
  const { activeWebsite } = state;
  const [versions, setVersions] = useState<VersionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWebsite?.id) return;
    setLoading(true);
    websiteApi.getVersions(activeWebsite.id)
      .then((res: any) => setVersions(res.data?.versions || []))
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [activeWebsite?.id]);

  const handleRestore = (version: VersionRecord) => {
    if (!activeWebsite) return;
    setRestoring(version.id);
    try {
      // Restore pages from snapshot into the store
      const website = store.getActiveWebsite();
      if (website) {
        store.updateWebsite(activeWebsite.id, {
          pages: version.snapshot.pages,
          activePageId: version.snapshot.activePageId || version.snapshot.pages[0]?.id || null,
        });
        store.setActivePage(version.snapshot.activePageId || version.snapshot.pages[0]?.id || null);
      }
    } finally {
      setRestoring(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white animate-in fade-in duration-300">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Version History</h2>
        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
          <History className="w-4 h-4" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <History className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">No versions saved yet.</p>
              <p className="text-[10px] text-slate-400">Versions are created when you publish.</p>
            </div>
          ) : (
            versions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((version, index) => (
                <div
                  key={version.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary/20 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{version.label}</span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Latest</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(version.createdAt)}
                      </div>
                    </div>
                    <Badge
                      variant={version.kind === 'published' ? 'default' : 'outline'}
                      className="text-[9px]"
                    >
                      {version.kind}
                    </Badge>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    {version.snapshot.pages.length} page{version.snapshot.pages.length !== 1 ? 's' : ''}
                  </div>

                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs rounded-xl"
                      disabled={restoring === version.id}
                      onClick={() => handleRestore(version)}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      {restoring === version.id ? 'Restoring...' : 'Restore this version'}
                    </Button>
                  )}
                </div>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
