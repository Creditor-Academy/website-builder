import React, { createContext, useContext, useMemo } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { v4 as uuidv4 } from 'uuid';

const BuilderContext = createContext(undefined);

export function BuilderProvider({ children }) {
  const store = useBuilderStore();
  const activePage = store.getActivePage();
  const activeWebsite = store.getActiveWebsite();

  const selectedSection = store.editor.selectedSectionId && activePage?.sections
    ? activePage.sections.find((s) => s.id === store.editor.selectedSectionId) ?? null
    : null;

  const selectedComponent = store.editor.selectedComponentId && selectedSection?.components
    ? selectedSection.components.find((c) => c.id === store.editor.selectedComponentId) ?? null
    : null;

  const value = useMemo(() => ({
    state: {
      activeWebsite,
      page: activePage,
      editor: store.editor,
      history: store.history,
      historyIndex: store.historyIndex,
    },
    selectSection: store.selectSection,
    selectComponent: store.selectComponent,
    addSection: store.addSection,
    updateSection: store.updateSection,
    toggleSectionVisibility: (id) => {
      const section = activePage?.sections?.find(s => s.id === id);
      if (section) {
        store.updateSection(id, { visible: !section.visible });
      }
    },
    updateSectionContent: (id, content) => store.updateSection(id, { content }),
    deleteSection: store.deleteSection,
    updateNavbar: store.updateNavbar,
    updateFooter: store.updateFooter,
    updatePageSEO: store.updatePageSEO,
    duplicateSection: (id) => {
      const section = activePage?.sections?.find(s => s.id === id);
      if (section) {
        store.addSection({ ...section, id: uuidv4(), name: `${section.name} (Copy)` });
      }
    },
    reorderSections: store.reorderSections,
    moveSectionUp: (id) => {
      console.log("moveSectionUp called for ID:", id);
      const sections = activePage?.sections;
      if (!sections) { console.log("No sections found for active page."); return; }
      const index = sections.findIndex(s => s.id === id);
      if (index > 0) {
        console.log("Moving section up from index:", index);
        const newSections = [...sections];
        const [movedSection] = newSections.splice(index, 1);
        newSections.splice(index - 1, 0, movedSection);
        store.reorderSections(newSections.map(s => s.id));
        console.log("reorderSections dispatched with new order:", newSections.map(s => s.id));
      } else {
        console.log("Section is already at the top or not found.");
      }
    },
    moveSectionDown: (id) => {
      console.log("moveSectionDown called for ID:", id);
      const sections = activePage?.sections;
      if (!sections) { console.log("No sections found for active page."); return; }
      const index = sections.findIndex(s => s.id === id);
      if (index < sections.length - 1) {
        console.log("Moving section down from index:", index);
        const newSections = [...sections];
        const [movedSection] = newSections.splice(index, 1);
        newSections.splice(index + 1, 0, movedSection);
        store.reorderSections(newSections.map(s => s.id));
        console.log("reorderSections dispatched with new order:", newSections.map(s => s.id));
      } else {
        console.log("Section is already at the bottom or not found.");
      }
    },
    updateSectionStyles: (id, styleUpdates) => {
      const section = activePage?.sections?.find(s => s.id === id);
      if (section) {
        store.updateSection(id, { styles: { ...section.styles, ...styleUpdates } });
      }
    },
    setEditMode: (mode) => store.setEditorState({ editMode: mode }),
    setPreviewMode: (enabled) => store.setEditorState({ previewMode: enabled }),
    setLeftPanelVisible: (visible) => store.setEditorState({ showLeftPanel: visible }),
    setRightPanelVisible: (visible) => store.setEditorState({ showRightPanel: visible }),
    addComponent: store.addComponent,
    updateComponent: store.updateComponent,
    deleteComponent: store.deleteComponent,
    undo: store.undo,
    redo: store.redo,
    canUndo: store.historyIndex > 0,
    canRedo: store.historyIndex < store.history.length - 1,
    selectedSection,
    selectedComponent,
    pages: activeWebsite?.pages || [],
    setActivePage: store.setActivePage,
    createPage: (page) => store.addPage(page),
    addPage: (page) => store.addPage(page),
    duplicatePage: store.duplicatePage,
    deletePage: store.deletePage,
    updatePageName: (slug, name) => store.updateCurrentPage({ name })
  }), [store, activePage, activeWebsite, selectedSection, selectedComponent]);

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
