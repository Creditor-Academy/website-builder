import { memo, useCallback, useLayoutEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FooterPreview } from '@/components/preview/FooterPreview';
import { CanvasNavbar } from './CanvasNavbar';
import { sanitizeHTML } from '@/utils/sanitize';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import { sortByOrder, stripLeadingEmptySections, stripPlaceholderSections, findNode } from '@/builder/tree';
import { collectFlowElements, flattenImplicitContainerBoxes, growSurfacesToFit, MIN_CANVAS_HEIGHT } from '@/builder/freeMove';
import { applyManyFreePositions } from '@/builder/documentOps';
import { explodePrebuiltSections } from '@/builder/prebuiltToCanvas';
import { canvasDragId, type CanvasDragData } from '@/builder/dnd';
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
    const withoutPlaceholders = stripPlaceholderSections(sections);
    if (withoutPlaceholders.length !== sections.length) {
      const page = useBuilderStore.getState().getActivePage();
      if (page) {
        const selectedId = useBuilderStore.getState().editor.selectedNodeId;
        useBuilderStore.getState().updateCurrentPage({ sections: withoutPlaceholders });
        if (selectedId && selectedId !== 'navbar' && selectedId !== 'footer' && !findNode(withoutPlaceholders, selectedId)) {
          useBuilderStore.getState().selectNode(null);
        }
      }
      return;
    }
    if (sections.length === 0) return;
    const flattened = flattenImplicitContainerBoxes(sections);
    if (flattened !== sections) {
      const page = useBuilderStore.getState().getActivePage();
      if (page) {
        const selectedId = useBuilderStore.getState().editor.selectedNodeId;
        useBuilderStore.getState().updateCurrentPage({ sections: flattened });
        if (selectedId && selectedId !== 'navbar' && selectedId !== 'footer' && !findNode(flattened, selectedId)) {
          const firstElement = flattened[0]?.children?.[0]?.children?.[0]?.id;
          if (firstElement) useBuilderStore.getState().selectNode(firstElement, 'element');
          else useBuilderStore.getState().selectNode(null);
        }
      }
      return;
    }
    const withoutLeadingEmpty = stripLeadingEmptySections(sections);
    if (withoutLeadingEmpty.length !== sections.length) {
      const page = useBuilderStore.getState().getActivePage();
      if (page) {
        useBuilderStore.getState().updateCurrentPage({ sections: withoutLeadingEmpty });
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
      className={cn(
        'canvas-edit light-canvas absolute left-0 top-0 overflow-visible rounded-xl bg-white shadow-elevated transition-all duration-200',
        !previewMode && 'select-none',
        previewMode && 'is-preview',
        device !== 'desktop' && 'border border-slate-300/80 shadow-2xl ring-1 ring-slate-900/10'
      )}
      data-fit-canvas="true"
      data-canvas-node={pageId}
      data-canvas-kind="page"
      data-device={device}
      onPointerLeave={() => setHoveredNodeId(null)}
      onDragStart={(event) => {
        if (!previewMode) event.preventDefault();
      }}
      onClick={(event) => {
        if (previewMode) return;
        const target = event.target as HTMLElement;
        if (target.closest('#nb-hamburger, .nb-ham')) return;
        if (target.closest('video, iframe')) return;
        if (target.closest('a, button, [href]')) event.preventDefault();
      }}
      onSubmit={(event) => {
        if (!previewMode) event.preventDefault();
      }}
      style={{
        width: DEVICE_WIDTHS[device] || DEVICE_WIDTHS.desktop,
        minHeight: `${Math.max(
          MIN_CANVAS_HEIGHT,
          parseFloat(String(globalStyles.canvasMinHeight || 0)) || 0,
          ...sections.map((section) => parseFloat(String(section.styles?.minHeight || 0)) || 0)
        )}px`,
        transform: `scale(${(zoom || 100) / 100})`,
        transformOrigin: 'top left',
        backgroundColor: String(globalStyles.backgroundColor || '#ffffff'),
        transition: 'width 0.25s ease',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(`
        #canvas-root {
          container-type: inline-size;
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
        .canvas-edit:not(.is-preview) a,
        .canvas-edit:not(.is-preview) [data-canvas-content] button {
          pointer-events: none;
        }
        .canvas-edit:not(.is-preview) [data-canvas-kind="navbar"] a,
        .canvas-edit:not(.is-preview) [data-canvas-kind="navbar"] [contenteditable] {
          pointer-events: auto;
          user-select: text;
          cursor: text;
        }
        .canvas-edit:not(.is-preview) [data-canvas-kind="navbar"] [data-navbar-go] {
          pointer-events: auto;
          cursor: pointer;
          user-select: none;
        }
        .canvas-edit [data-canvas-kind="navbar"] #nb-hamburger,
        .canvas-edit [data-canvas-kind="navbar"] .nb-ham {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        .canvas-edit:not(.is-preview) [data-canvas-kind="footer"] [contenteditable],
        .canvas-edit:not(.is-preview) [data-canvas-kind="footer"] [data-footer-go] {
          pointer-events: auto;
          cursor: pointer;
        }
        .canvas-edit:not(.is-preview) [data-canvas-kind="footer"] [contenteditable] {
          cursor: text;
        }
        .canvas-edit:not(.is-preview) img {
          -webkit-user-drag: none;
          user-select: none;
        }
        .canvas-edit:not(.is-preview) input,
        .canvas-edit:not(.is-preview) textarea,
        .canvas-edit:not(.is-preview) select {
          pointer-events: none;
        }
        .canvas-edit:not(.is-preview) [data-canvas-form] input,
        .canvas-edit:not(.is-preview) [data-canvas-form] textarea,
        .canvas-edit:not(.is-preview) [data-canvas-form] select,
        .canvas-edit:not(.is-preview) [data-canvas-form] label {
          pointer-events: auto;
          user-select: text;
          -webkit-user-select: text;
          cursor: text;
        }

        /* ─── Cross-Device Preview Adaptations ─── */
        #canvas-root[data-device="mobile"] .container,
        #canvas-root[data-device="tablet"] .container {
          width: 100% !important;
          max-width: 100% !important;
          padding-left: 1.25rem !important;
          padding-right: 1.25rem !important;
        }

        #canvas-root[data-device="mobile"] {
          overflow-x: clip;
        }

        /* Grid single-column reflow on mobile */
        #canvas-root[data-device="mobile"] [class*="md:grid-cols-"],
        #canvas-root[data-device="mobile"] [class*="lg:grid-cols-"],
        #canvas-root[data-device="mobile"] [class*="sm:grid-cols-"] {
          grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
        }

        /* Grid two-column reflow on tablet for 3- and 4-column grids */
        #canvas-root[data-device="tablet"] [class*="lg:grid-cols-3"],
        #canvas-root[data-device="tablet"] [class*="lg:grid-cols-4"] {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        /* Flex row to column stacking on mobile */
        #canvas-root[data-device="mobile"] .md\:flex-row,
        #canvas-root[data-device="mobile"] .lg\:flex-row,
        #canvas-root[data-device="mobile"] .sm\:flex-row {
          flex-direction: column !important;
        }

        /* Fluid typography for simulated mobile view to prevent overflowing large headers */
        #canvas-root[data-device="mobile"] h1,
        #canvas-root[data-device="mobile"] [class*="text-5xl"],
        #canvas-root[data-device="mobile"] [class*="text-6xl"],
        #canvas-root[data-device="mobile"] [class*="text-7xl"] {
          font-size: clamp(1.85rem, 6.5vw, 2.35rem) !important;
          line-height: 1.15 !important;
          letter-spacing: -0.02em !important;
        }

        #canvas-root[data-device="mobile"] h2,
        #canvas-root[data-device="mobile"] [class*="text-4xl"] {
          font-size: clamp(1.45rem, 5vw, 1.85rem) !important;
          line-height: 1.2 !important;
        }

        #canvas-root[data-device="mobile"] p,
        #canvas-root[data-device="mobile"] [class*="text-xl"],
        #canvas-root[data-device="mobile"] [class*="text-2xl"] {
          font-size: clamp(0.925rem, 3.5vw, 1.05rem) !important;
          line-height: 1.5 !important;
        }

        /* Mobile button wrap and full-width adaptions */
        #canvas-root[data-device="mobile"] .hero-btn-group,
        #canvas-root[data-device="mobile"] .cta-buttons {
          flex-direction: column !important;
          width: 100% !important;
        }

        #canvas-root[data-device="mobile"] img {
          max-width: 100% !important;
          height: auto !important;
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
