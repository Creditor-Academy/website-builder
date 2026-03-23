import { useRef, useEffect } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { NavbarPreview } from '@/components/preview/NavbarPreview';
import { FooterPreview } from '@/components/preview/FooterPreview';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { JumpToTop } from '@/components/ui/JumpToTop';

export function CanvasPreview() {
  const { state, selectSection, updateSectionContent, updateNavbar, updateFooter } = useBuilder();
  const { page, editor } = state;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Reset scroll when page ID changes
  useEffect(() => {
    if (canvasRef.current && page?.id) {
      canvasRef.current.scrollTo(0, 0);
    }
  }, [page?.id]);

  if (!page) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-100">
        <p className="text-slate-400">Select a page to start editing</p>
      </div>
    );
  }

  const handleSectionClick = (sectionId, e) => {
    if (!editor.previewMode) {
      e.stopPropagation();
      selectSection(sectionId);
    }
  };

  const handleContentChange = (sectionId, field, value) => {
    const section = page.sections.find(s => s.id === sectionId);
    if (section) {
      updateSectionContent(sectionId, {
        ...section.content,
        [field]: value
      });
    }
  };

  const handleCanvasClick = () => {
    if (!editor.previewMode) selectSection(null);
  };

  const globalStyles = page?.globalStyles || {};

  return (
    <div
      ref={canvasRef}
      className="h-full overflow-y-auto scrollbar-thin bg-[hsl(var(--builder-panel))] w-full max-w-full overflow-x-hidden relative"
      onClick={handleCanvasClick}
    >
      <style dangerouslySetInnerHTML={{ __html: `
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
        .global-radius { border-radius: var(--radius) !important; }
        .global-shadow { box-shadow: var(--shadow) !important; }
        .global-transition { transition: all var(--animation-speed) ease !important; }
        
        ${globalStyles.shadows ? `
        #canvas-root [class*="shadow-"] {
          --tw-shadow: var(--shadow) !important;
          --tw-shadow-colored: var(--shadow) !important;
          box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;
        }
        ` : ''}
        
        ${globalStyles.borderRadius ? `
        #canvas-root [class*="rounded-"]:not(.rounded-full) {
          border-radius: var(--radius) !important;
        }
        ` : ''}
        
        ${!globalStyles.animations ? `
        #canvas-root *, #canvas-root [class*="transition"], #canvas-root [class*="duration-"] {
          transition: none !important;
          animation: none !important;
        }
        ` : ''}

        ${globalStyles.glassmorphism ? `
        .glass-effect, #canvas-root [class*="shadow-lg"], #canvas-root [class*="shadow-xl"], #canvas-root [style*="box-shadow"] {
          background: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
        }
        ` : ''}
      ` }} />
      <JumpToTop containerRef={canvasRef} className="absolute bottom-6 right-6" threshold={200} />
      {/* FIXED FULL-WIDTH CANVAS */}
      <div
        id="canvas-root"
        className="mx-auto shadow-elevated rounded-xl bg-[hsl(var(--canvas))] transition-colors duration-200 w-full max-w-full overflow-x-hidden"
      >
        <div className="light-canvas w-full max-w-full overflow-x-hidden">
          <NavbarPreview
            config={page.navbar}
            isEditing={!editor.previewMode}
            onUpdate={(updates) => updateNavbar(updates)}
          />

          {page.sections
            .filter(section => section.visible)
            .map((section, idx) => (
              <div
                key={section.id}
                id={section.id || section.type}
                onClick={(e) => handleSectionClick(section.id, e)}
                className={`relative transition-all duration-200 ${!editor.previewMode ? 'cursor-pointer' : ''
                  } ${editor.selectedSectionId === section.id && !editor.previewMode
                    ? 'ring-2 ring-primary ring-inset'
                    : ''
                  }`}
              >
                <SectionRenderer
                  section={section}
                  idx={idx}
                  isAlternate={idx % 2 === 0}
                  isSelected={editor.selectedSectionId === section.id}
                  isEditing={
                    editor.selectedSectionId === section.id &&
                    !editor.previewMode
                  }
                  onContentChange={(field, value) =>
                    handleContentChange(section.id, field, value)
                  }
                />

                {!editor.previewMode &&
                  editor.selectedSectionId === section.id && (
                    <>
                      <div className="absolute top-2 left-2 z-10 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg flex items-center gap-2">
                        {section.name}
                        <div id="tour-radial-menu" className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 cursor-help flex items-center justify-center">
                           <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>
                    </>
                  )}
              </div>
            ))}

          {/* EMPTY STATE */}
          {page.sections.filter(s => s.visible).length === 0 && (
            <div className="flex items-center justify-center h-[50vh] text-muted-foreground" style={{ backgroundColor: 'hsl(var(--builder-panel))' }}>
              <div className="text-center">
                <p className="text-lg font-medium">No visible sections</p>
                <p className="text-sm">Add sections from the left panel</p>
              </div>
            </div>
          )}

          <FooterPreview
            config={page.footer}
            isEditing={!editor.previewMode}
            onUpdate={(updates) => updateFooter(updates)}
          />
        </div>
      </div>


    </div>
  );
}
