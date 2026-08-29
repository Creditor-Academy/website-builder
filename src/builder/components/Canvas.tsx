import { memo, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Copy, Trash2, ChevronUp } from 'lucide-react';
import { NavbarPreview } from '@/components/preview/NavbarPreview';
import { FooterPreview } from '@/components/preview/FooterPreview';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { sanitizeHTML } from '@/utils/sanitize';
import useBuilderStore from '@/store/useBuilderStore';
import { cn } from '@/lib/utils';
import { normalizePageSections } from '@/builder/adapter';
import { DEVICE_WIDTHS, type CanvasContainer, type CanvasElement, type CanvasSection, type DeviceId, type NodeKind } from '@/builder/types';
import { resolveStyles, stylesToCss } from '@/builder/styles';
import { sortByOrder } from '@/builder/tree';
import { DropZone } from './DropZone';
import { CanvasElementView } from './CanvasPrimitives';

function useIsSelected(id: string) {
  return useBuilderStore((state) => state.editor.selectedNodeId === id);
}

function chromeColor(kind: NodeKind) {
  if (kind === 'section') return 'bg-blue-600';
  if (kind === 'container') return 'bg-violet-600';
  return 'bg-sky-600';
}

function NodeFrame({
  id,
  kind,
  name,
  hidden,
  previewMode,
  children,
  className,
  style,
  onSelectParent,
}: {
  id: string;
  kind: NodeKind;
  name: string;
  hidden?: boolean;
  previewMode: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onSelectParent?: () => void;
}) {
  const selected = useIsSelected(id);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);

  return (
    <div
      data-canvas-node={id}
      data-canvas-kind={kind}
      data-canvas-name={name}
      className={cn('canvas-node relative', selected && !previewMode && 'is-selected', hidden && 'opacity-40', className)}
      style={style}
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
            selected ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          )}
        >
          <span>{name}</span>
          {selected && (
            <span className="ml-1 flex items-center gap-0.5">
              {onSelectParent && (
                <button type="button" className="rounded p-0.5 hover:bg-white/20" onClick={(event) => { event.stopPropagation(); onSelectParent(); }}>
                  <ChevronUp className="h-3 w-3" />
                </button>
              )}
              <button type="button" className="rounded p-0.5 hover:bg-white/20" onClick={(event) => { event.stopPropagation(); duplicateCanvasNode(id); }}>
                <Copy className="h-3 w-3" />
              </button>
              <button type="button" className="rounded p-0.5 hover:bg-white/20" onClick={(event) => { event.stopPropagation(); deleteCanvasNode(id); }}>
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

const CanvasElementNode = memo(function CanvasElementNode({
  element,
  device,
  previewMode,
  onSelectParent,
}: {
  element: CanvasElement;
  device: DeviceId;
  previewMode: boolean;
  onSelectParent: () => void;
}) {
  const visible = element.visibility?.[device] !== false;
  if (!visible && previewMode) return null;
  const css = stylesToCss(resolveStyles(element.styles, element.responsiveStyles, device));
  return (
    <NodeFrame
      id={element.id}
      kind="element"
      name={element.name || element.type}
      hidden={!visible}
      previewMode={previewMode}
      onSelectParent={onSelectParent}
    >
      <CanvasElementView element={element} css={css} />
    </NodeFrame>
  );
});

const CanvasContainerNode = memo(function CanvasContainerNode({
  container,
  device,
  previewMode,
  onSelectParent,
}: {
  container: CanvasContainer;
  device: DeviceId;
  previewMode: boolean;
  onSelectParent: () => void;
}) {
  const visible = container.visibility?.[device] !== false;
  if (!visible && previewMode) return null;
  const css = stylesToCss(resolveStyles(container.styles, container.responsiveStyles, device));
  const children = sortByOrder(container.children || []);

  return (
    <NodeFrame
      id={container.id}
      kind="container"
      name={container.name || 'Container'}
      hidden={!visible}
      previewMode={previewMode}
      onSelectParent={onSelectParent}
      style={css}
    >
      {!previewMode && (
        <DropZone parentId={container.id} parentKind="container" index={0} edge="inside" accepts={['text', 'image', 'button', 'icon', 'video', 'divider', 'form', 'pdf']} empty={children.length === 0} />
      )}
      {children.map((element, index) => (
        <div key={element.id}>
          {!previewMode && (
            <DropZone parentId={container.id} parentKind="container" index={index} edge="before" accepts={['text', 'image', 'button', 'icon', 'video', 'divider', 'form', 'pdf']} />
          )}
          <CanvasElementNode
            element={element}
            device={device}
            previewMode={previewMode}
            onSelectParent={() => useBuilderStore.getState().selectNode(container.id, 'container')}
          />
        </div>
      ))}
    </NodeFrame>
  );
});

const CanvasSectionNode = memo(function CanvasSectionNode({
  section,
  index,
  device,
  previewMode,
  isAlternate,
}: {
  section: CanvasSection;
  index: number;
  device: DeviceId;
  previewMode: boolean;
  isAlternate: boolean;
}) {
  const selectNode = useBuilderStore((state) => state.selectNode);
  const updateSection = useBuilderStore((state) => state.updateSection);
  const visible = section.visible !== false && section.visibility?.[device] !== false;
  if (!visible && previewMode) return null;
  const css = stylesToCss(resolveStyles(section.styles, section.responsiveStyles, device));
  const isCanvas = section.kind === 'canvas' && (section.children || []).length > 0;

  return (
    <NodeFrame
      id={section.id}
      kind="section"
      name={section.name || section.type}
      hidden={!visible}
      previewMode={previewMode}
      style={isCanvas ? css : undefined}
      className={cn(!previewMode && 'cursor-pointer')}
    >
      {isCanvas ? (
        sortByOrder(section.children || []).map((container) => (
          <CanvasContainerNode
            key={container.id}
            container={container}
            device={device}
            previewMode={previewMode}
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
    </NodeFrame>
  );
});

export function BuilderCanvas() {
  const page = useBuilderStore((state) => state.getActivePage());
  const editor = useBuilderStore((state) => state.editor);
  const updateNavbar = useBuilderStore((state) => state.updateNavbar);
  const updateFooter = useBuilderStore((state) => state.updateFooter);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const setZoom = useBuilderStore((state) => state.setZoom);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(800);

  const sections = useMemo(
    () => (page ? normalizePageSections(page.sections, page.id) : []),
    [page]
  );

  useEffect(() => {
    if (scrollRef.current && page?.id) scrollRef.current.scrollTo({ top: 0 });
  }, [page?.id]);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height;
      if (height) setContentHeight(height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [page?.id, editor.device]);

  if (!page) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white">
        <p className="text-slate-400">Select a page to start editing</p>
      </div>
    );
  }

  const zoom = (editor.zoom || 100) / 100;
  const frameWidth = DEVICE_WIDTHS[editor.device] || DEVICE_WIDTHS.desktop;
  const globalStyles = page.globalStyles || {};
  const previewMode = editor.previewMode;

  const fitCanvas = () => {
    const width = scrollRef.current?.clientWidth || frameWidth;
    const next = Math.floor(((width - 64) / frameWidth) * 100);
    setZoom(Math.max(25, Math.min(100, next)));
  };

  return (
    <div
      ref={scrollRef}
      id="tour-canvas"
      className={cn('relative z-0 isolate h-full w-full overflow-auto bg-[hsl(var(--builder-panel))]', previewMode && 'is-preview')}
      onClick={() => {
        if (!previewMode) selectNode(null);
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
        .canvas-edit:not(.is-preview) [data-canvas-node]:hover:not(:has([data-canvas-node]:hover)):not(.is-selected) {
          outline: 1px dashed #38bdf8;
          outline-offset: 2px;
        }
        .canvas-edit:not(.is-preview) [data-canvas-node]:hover:not(:has([data-canvas-node]:hover)):not(.is-selected) > .canvas-node-label {
          opacity: 1;
        }
        .canvas-edit:not(.is-preview) [data-canvas-node].is-selected {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
        .canvas-edit:not(.is-preview) [data-canvas-kind="container"].is-selected { outline-color: #7c3aed; }
        .canvas-edit:not(.is-preview) [data-canvas-kind="element"].is-selected { outline-color: #0284c7; }
        .canvas-edit:not(.is-preview) [data-canvas-kind="navbar"].is-selected,
        .canvas-edit:not(.is-preview) [data-canvas-kind="footer"].is-selected { outline-color: #0f172a; }
      `),
        }}
      />

      <div className="flex justify-center px-4 py-6" style={{ minWidth: frameWidth * zoom + 48 }}>
        <div style={{ width: frameWidth * zoom, height: contentHeight * zoom }}>
          <div
            id="canvas-root"
            ref={frameRef}
            className={cn(
              'canvas-edit light-canvas mx-auto overflow-x-hidden rounded-xl bg-white shadow-elevated',
              previewMode && 'is-preview'
            )}
            style={{
              width: frameWidth,
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              backgroundColor: globalStyles.backgroundColor || '#ffffff',
            }}
            data-fit-canvas="true"
          >
            <div
              data-canvas-node="navbar"
              data-canvas-kind="navbar"
              className="canvas-node"
              onClick={(event) => {
                if (previewMode) return;
                event.stopPropagation();
                selectNode('navbar', 'navbar');
              }}
            >
              <NavbarPreview config={page.navbar} isEditing={!previewMode} onUpdate={updateNavbar} />
            </div>

            {sections.map((section, index) => (
              <div key={section.id}>
                {!previewMode && (
                  <DropZone parentId={page.id} parentKind="page" index={index} edge="before" accepts={['section']} />
                )}
                <CanvasSectionNode
                  section={section}
                  index={index}
                  device={editor.device || 'desktop'}
                  previewMode={previewMode}
                  isAlternate={index % 2 === 0}
                />
              </div>
            ))}

            {sections.length === 0 && (
              <div className="flex h-[40vh] items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="text-lg font-medium">No sections yet</p>
                  <p className="text-sm">Add an element or prebuilt section from the left panel</p>
                </div>
              </div>
            )}

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
              <FooterPreview config={page.footer} isEditing={!previewMode} onUpdate={updateFooter} />
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="hidden" data-canvas-fit onClick={fitCanvas} aria-hidden />
    </div>
  );
}
