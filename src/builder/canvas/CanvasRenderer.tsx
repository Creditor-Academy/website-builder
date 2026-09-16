import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FooterPreview } from '@/components/preview/FooterPreview';
import { CanvasNavbar } from './CanvasNavbar';
import { sanitizeHTML } from '@/utils/sanitize';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import { sortByOrder } from '@/builder/tree';
import { collectFlowElements, growSurfacesToFit, MIN_CANVAS_HEIGHT } from '@/builder/freeMove';
import { applyManyFreePositions } from '@/builder/documentOps';
import { explodePrebuiltSections } from '@/builder/prebuiltToCanvas';
import { canvasDragId, type CanvasDragData } from '@/builder/dnd';
import { createBlankCanvasSection } from '@/builder/defaults';
import { DEVICE_WIDTHS, type CanvasSection } from '@/builder/types';
import { useCanvasEngine } from './CanvasEngineContext';
import { CanvasSectionNode } from './CanvasNode';
import { useCanvasDndState } from '@/builder/components/CanvasDndContext';
import { zoomFactor } from './coordinates';

export const CanvasRenderer = memo(function CanvasRenderer({
  pageId,
  sections,
  navbar,
  footer,
  globalStyles,
}: {
  pageId: string;
  sections: CanvasSection[];
  navbar: any;
  footer: any;
  globalStyles: Record<string, unknown>;
}) {
  const { previewMode, device, zoom, frameRef, setHoveredNodeId } = useCanvasEngine();
  const { isDragging } = useCanvasDndState();
  const promotedPageRef = useRef<string | null>(null);
  const grownPageRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (previewMode) return;
    if (sections.length === 0) {
      const page = useBuilderStore.getState().getActivePage();
      if (page) {
        useBuilderStore.getState().updateCurrentPage({
          sections: [createBlankCanvasSection(pageId, 0)],
        });
      }
      return;
    }
    const exploded = explodePrebuiltSections(sections, pageId);
    if (exploded) {
      const page = useBuilderStore.getState().getActivePage();
      if (page) {
        useBuilderStore.getState().updateCurrentPage({ sections: exploded });
      }
      grownPageRef.current = pageId;
      return;
    }
    if (grownPageRef.current !== pageId) {
      const grown = growSurfacesToFit(sections);
      const taller = grown.some((section, index) => {
        const next = parseFloat(String(section.styles.minHeight || 0));
        const current = parseFloat(String(sections[index]?.styles.minHeight || 0));
        return next > current + 0.5;
      });
      grownPageRef.current = pageId;
      if (taller) {
        useBuilderStore.getState().updateCurrentPage({ sections: grown });
        return;
      }
    }
    if (promotedPageRef.current === `${pageId}:blocks`) return;
    const flow = collectFlowElements(sections);
    if (!flow.length) {
      promotedPageRef.current = `${pageId}:blocks`;
      return;
    }
    const factor = zoomFactor(zoom);
    const items = flow.flatMap((item) => {
      const node = document.querySelector(`[data-canvas-node="${item.id}"]`) as HTMLElement | null;
      const parent = document.querySelector(`[data-canvas-node="${item.containerId}"]`) as HTMLElement | null;
      if (!node || !parent) return [];
      const nodeRect = node.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      return [{
        id: item.id,
        position: {
          x: (nodeRect.left - parentRect.left) / factor,
          y: (nodeRect.top - parentRect.top) / factor,
          width: nodeRect.width / factor,
          height: nodeRect.height / factor,
        },
      }];
    });
    if (!items.length) return;
    const page = useBuilderStore.getState().getActivePage();
    if (!page) return;
    promotedPageRef.current = `${pageId}:blocks`;
    useBuilderStore.getState().updateCurrentPage({
      sections: applyManyFreePositions(page, device, items),
    });
  }, [pageId, sections, previewMode, device, zoom]);
  const updateFooter = useBuilderStore((state) => state.updateFooter);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const { setNodeRef } = useDroppable({
    id: canvasDragId('page', pageId),
    data: {
      source: 'canvas',
      nodeId: pageId,
      kind: 'page',
      type: 'page',
      name: 'Page',
      pageId,
      childCount: sections.length,
    } satisfies CanvasDragData,
    disabled: previewMode || !isDragging,
  });

  const setFrameRef = useCallback(
    (node: HTMLDivElement | null) => {
      frameRef.current = node;
      setNodeRef(node);
    },
    [frameRef, setNodeRef]
  );

  return (
    <div
      id="canvas-root"
      ref={setFrameRef}
      className={cn('canvas-edit light-canvas absolute left-0 top-0 overflow-visible rounded-xl bg-white shadow-elevated', previewMode && 'is-preview')}
      data-fit-canvas="true"
      data-canvas-node={pageId}
      data-canvas-kind="page"
      onPointerLeave={() => setHoveredNodeId(null)}
      style={{
        width: DEVICE_WIDTHS[device] || DEVICE_WIDTHS.desktop,
        minHeight: `${MIN_CANVAS_HEIGHT}px`,
        transform: `scale(${(zoom || 100) / 100})`,
        transformOrigin: 'top left',
        backgroundColor: String(globalStyles.backgroundColor || '#ffffff'),
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(`
        #canvas-root {
          --theme-primary: ${globalStyles.primaryColor || '#3b82f6'};
          --theme-secondary: ${globalStyles.secondaryColor || '#8b5cf6'};
          --theme-accent: ${globalStyles.accentColor || '#06b6d4'};
          --theme-bg: ${globalStyles.backgroundColor || '#ffffff'};
          --theme-text: ${globalStyles.textColor || '#0f172a'};
          --theme-bg-alt: ${globalStyles.alternateBackground || '#f8fafc'};
          --theme-text-alt: ${globalStyles.alternateTextColor || '#0f172a'};
          --radius: ${globalStyles.borderRadius || '12px'};
          --shadow: ${globalStyles.shadows === 'pronounced' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : globalStyles.shadows === 'subtle' ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'};
          --animation-speed: ${globalStyles.animations ? '0.3s' : '0s'};
        }
        .canvas-edit:not(.is-preview) [data-canvas-node].is-hovered:not(.is-selected) {
          box-shadow: 0 0 0 2px #38bdf8;
        }
      `),
        }}
      />

      <CanvasNavbar navbar={navbar} previewMode={previewMode} />

      {sortByOrder(sections).map((section, index) => (
        <CanvasSectionNode
          key={section.id}
          section={section}
          index={index}
          pageId={pageId}
          device={device}
          previewMode={previewMode}
          isAlternate={index % 2 === 0}
        />
      ))}

      {footer ? (
        <div
          data-canvas-node="footer"
          data-canvas-kind="footer"
          className="canvas-node"
          onClick={(event) => {
            if (previewMode) return;
            event.stopPropagation();
            selectNode('footer', 'footer');
          }}
        >
          <FooterPreview config={footer} isEditing={!previewMode} onUpdate={updateFooter} />
        </div>
      ) : null}
    </div>
  );
});
