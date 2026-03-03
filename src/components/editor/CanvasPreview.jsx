import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { NavbarPreview } from '@/components/preview/NavbarPreview';
import { FooterPreview } from '@/components/preview/FooterPreview';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

export function CanvasPreview() {
  const { state, selectSection, updateSectionContent, updateNavbar, updateFooter } = useBuilder();
  const { page, editor } = state;

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
    if (!editor.previewMode) {
      selectSection(null);
      selectComponent(null);
    }
  };

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin bg-[hsl(var(--builder-panel))] w-full max-w-full overflow-x-hidden"
      onClick={handleCanvasClick}
    >
      {/* FIXED FULL-WIDTH CANVAS */}
      <div
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
            .map(section => (
              <div
                key={section.id}
                onClick={(e) => handleSectionClick(section.id, e)}
                className={`relative transition-all duration-200 ${!editor.previewMode ? 'cursor-pointer' : ''
                  } ${editor.selectedSectionId === section.id && !editor.previewMode
                    ? 'ring-2 ring-primary ring-inset'
                    : ''
                  }`}
              >
                <SectionRenderer
                  section={section}
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
                    <div className="absolute top-2 left-2 z-10 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                      {section.name}
                    </div>
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
