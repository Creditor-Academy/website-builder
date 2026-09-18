import { useMemo } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { normalizePageSections } from '@/builder/adapter';
import { CanvasEngine } from '@/builder/canvas/CanvasEngine';
import { CanvasViewport } from '@/builder/canvas/CanvasViewport';
import { CanvasRenderer } from '@/builder/canvas/CanvasRenderer';
import { CanvasOverlay } from '@/builder/canvas/CanvasOverlay';
import { CanvasKeyboard } from '@/builder/canvas/CanvasKeyboard';

export function BuilderCanvas() {
  const page = useBuilderStore((state) => state.getActivePage());
  const sections = useMemo(
    () => (page ? normalizePageSections(page.sections, page.id) : []),
    [page]
  );

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white">
        <p className="text-slate-400">Select a page to start editing</p>
      </div>
    );
  }

  return (
    <CanvasEngine>
      <CanvasKeyboard />
      <CanvasViewport>
        <CanvasRenderer
          pageId={page.id}
          sections={sections}
          navbar={page.navbar}
          footer={page.footer}
          globalStyles={page.globalStyles || {}}
        />
        <CanvasOverlay />
      </CanvasViewport>
    </CanvasEngine>
  );
}
