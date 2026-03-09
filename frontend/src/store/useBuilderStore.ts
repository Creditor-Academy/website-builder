import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';
import {
    getDefaultPage,
    createFeaturesPage,
    createServicesPage,
    createPricingPage,
    createContactPage,
    createAboutPage
} from '@/lib/defaultPageData';

interface BuilderStore {
    // State
    websites: any[];
    activeWebsiteId: string | null;
    activePageId: string | null;
    editor: {
        selectedSectionId: string | null;
        selectedComponentId: string | null;
        editMode: string;
        isDragging: boolean;
        zoom: number;
        showGrid: boolean;
        previewMode: boolean;
        showLeftPanel: boolean;
        showRightPanel: boolean;
    };
    history: any[];
    historyIndex: number;

    // Actions
    setWebsites: (websites: any[]) => void;
    initializeSampleWebsites: () => void;
    createWebsite: (name: string, template?: string) => string;
    selectWebsite: (id: string) => void;
    deleteWebsite: (id: string) => void;
    setActivePage: (pageId: string) => void;
    addPage: (pageData: any) => void;
    updateWebsite: (id: string, updates: any) => void;
    updateWebsitePages: (pages: any[]) => void;
    getActiveWebsite: () => any;
    getActivePage: () => any;
    updateCurrentPage: (updates: any) => void;
    setSelectedSection: (id: string | null) => void;
    setSelectedComponent: (id: string | null) => void;
    setEditMode: (mode: string) => void;
    setDragging: (isDragging: boolean) => void;
    setZoom: (zoom: number) => void;
    toggleGrid: () => void;
    setPreviewMode: (previewMode: boolean) => void;
    toggleLeftPanel: () => void;
    toggleRightPanel: () => void;
    addToHistory: (state: any) => void;
    undo: () => void;
    redo: () => void;
}

type BuilderStorePersist = (
    set: any,
    get: any,
    api: any
) => BuilderStore;

const useBuilderStore = create<BuilderStore>()(
    persist(
        (set, get) => ({
            // State
            websites: [], // Array of website objects { id, name, lastEdited, status, pages: [] }
            activeWebsiteId: null,
            activePageId: null,

            editor: {
                selectedSectionId: null,
                selectedComponentId: null,
                editMode: 'content',
                isDragging: false,
                zoom: 100,
                showGrid: false,
                previewMode: false,
                showLeftPanel: true,
                showRightPanel: false,
            },

            history: [],
            historyIndex: -1,

            // Actions
            setWebsites: (websites) => set({ websites }),

            initializeSampleWebsites: () => {
                const sampleWebsites = [
                    {
                        id: 'sample-1',
                        name: 'Business Website',
                        lastEdited: new Date().toISOString(),
                        status: 'Draft',
                        pages: [getDefaultPage()]
                    },
                    {
                        id: 'sample-2', 
                        name: 'Portfolio Site',
                        lastEdited: new Date().toISOString(),
                        status: 'Draft',
                        pages: [getDefaultPage()]
                    }
                ];
                set({ websites: sampleWebsites });
            },

            createWebsite: (name, template = 'blank') => {
                const id = uuidv4();
                const homePage = getDefaultPage();
                const newWebsite = {
                    id,
                    name,
                    lastEdited: new Date().toISOString(),
                    status: 'Draft',
                    pages: [homePage],
                    activePageId: homePage.id,
                };

                set((state) => ({
                    websites: [...state.websites, newWebsite],
                    activeWebsiteId: id,
                    activePageId: homePage.id,
                    history: [newWebsite.pages],
                    historyIndex: 0,
                }));
                return id;
            },

            selectWebsite: (id) => {
                const website = get().websites.find(w => w.id === id);
                if (website) {
                    set({
                        activeWebsiteId: id,
                        activePageId: website.activePageId || website.pages[0].id,
                        history: [website.pages],
                        historyIndex: 0
                    });
                }
            },

            deleteWebsite: (id) => set((state) => ({
                websites: state.websites.filter(w => w.id !== id),
                activeWebsiteId: state.activeWebsiteId === id ? null : state.activeWebsiteId
            })),

            updateWebsite: (id, updates) => set((state) => ({
                websites: state.websites.map(w => 
                    w.id === id ? { ...w, ...updates, lastEdited: new Date().toISOString() } : w
                )
            })),

            // Page Actions
            setActivePage: (pageId) => set({ activePageId: pageId }),

            addPage: (pageData) => {
                const { activeWebsiteId, websites } = get();
                if (!activeWebsiteId) return;

                const newPage = {
                    id: uuidv4(),
                    name: pageData.name || 'New Page',
                    slug: pageData.slug || '/new-page',
                    sections: pageData.sections || [],
                    meta: {
                        title: pageData.name || 'New Page',
                        description: ''
                    },
                    navbar: websites.find(w => w.id === activeWebsiteId).pages[0].navbar,
                    footer: websites.find(w => w.id === activeWebsiteId).pages[0].footer,
                    globalStyles: websites.find(w => w.id === activeWebsiteId).pages[0].globalStyles,
                };

                const website = websites.find(w => w.id === activeWebsiteId);
                const newPages = [...website.pages, newPage];
                get().updateWebsitePages(newPages);
                set({ activePageId: newPage.id });
            },

            duplicatePage: (pageId) => {
                const website = get().getActiveWebsite();
                const page = website.pages.find(p => p.id === pageId);
                if (!page) return;

                const newPage = {
                    ...page,
                    id: uuidv4(),
                    name: `${page.name} (Copy)`,
                    slug: `${page.slug}-copy`,
                };

                get().updateWebsitePages([...website.pages, newPage]);
            },

            deletePage: (pageId) => {
                const website = get().getActiveWebsite();
                if (website.pages.length <= 1) return; // Don't delete last page

                const newPages = website.pages.filter(p => p.id !== pageId);
                const nextActiveId = website.activePageId === pageId ? newPages[0].id : website.activePageId;

                set((state) => ({
                    activePageId: nextActiveId,
                    websites: state.websites.map(w =>
                        w.id === state.activeWebsiteId ? { ...w, pages: newPages, activePageId: nextActiveId } : w
                    )
                }));
            },

            updatePageSEO: (pageId, seoUpdates) => {
                const website = get().getActiveWebsite();
                const newPages = website.pages.map(p =>
                    p.id === pageId ? { ...p, meta: { ...p.meta, ...seoUpdates } } : p
                );
                get().updateWebsitePages(newPages);
            },

            updateWebsitePages: (newPages) => {
                const { activeWebsiteId, websites, history, historyIndex } = get();
                if (!activeWebsiteId) return;

                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(newPages);

                set((state) => ({
                    websites: state.websites.map(w =>
                        w.id === activeWebsiteId ? { ...w, pages: newPages, lastEdited: new Date().toISOString() } : w
                    ),
                    history: newHistory,
                    historyIndex: newHistory.length - 1
                }));
            },

            // Section Actions
            addSection: (section, index) => {
                const { activePageId } = get();
                const page = get().getActivePage();
                if (!page) return;

                const newSections = [...page.sections];
                const targetIndex = index ?? newSections.length;
                newSections.splice(targetIndex, 0, section);

                get().updateCurrentPage({ sections: newSections });
            },

            updateSection: (sectionId, updates) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.map(s =>
                    s.id === sectionId ? { ...s, ...updates } : s
                );

                get().updateCurrentPage({ sections: newSections });
            },

            deleteSection: (sectionId) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.filter(s => s.id !== sectionId);
                get().updateCurrentPage({ sections: newSections });
            },

            reorderSections: (ids) => {
                const page = get().getActivePage();
                if (!page) return;

                const sectionMap = new Map(page.sections.map(s => [s.id, s]));
                const newSections = ids.map(id => sectionMap.get(id)).filter(Boolean);

                get().updateCurrentPage({ sections: newSections });
            },

            // Component Actions
            addComponent: (sectionId, component) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.map(s => {
                    if (s.id === sectionId) {
                        return {
                            ...s,
                            components: [...(s.components || []), {
                                id: uuidv4(),
                                ...component,
                                position: component.position || { x: 0, y: 0 },
                                style: component.style || {}
                            }]
                        };
                    }
                    return s;
                });

                get().updateCurrentPage({ sections: newSections });
            },

            updateComponent: (sectionId, componentId, updates) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.map(s => {
                    if (s.id === sectionId) {
                        return {
                            ...s,
                            components: (s.components || []).map(c =>
                                c.id === componentId ? { ...c, ...updates } : c
                            )
                        };
                    }
                    return s;
                });

                get().updateCurrentPage({ sections: newSections });
            },

            deleteComponent: (sectionId, componentId) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.map(s => {
                    if (s.id === sectionId) {
                        return {
                            ...s,
                            components: (s.components || []).filter(c => c.id !== componentId)
                        };
                    }
                    return s;
                });

                get().updateCurrentPage({ sections: newSections });
            },

            // Helper Getters
            getActiveWebsite: () => {
                const { websites, activeWebsiteId } = get();
                return websites.find(w => w.id === activeWebsiteId);
            },

            getActivePage: () => {
                const website = get().getActiveWebsite();
                if (!website) return null;
                return website.pages.find(p => p.id === get().activePageId) || website.pages[0];
            },

            updateCurrentPage: (updates) => {
                const website = get().getActiveWebsite();
                const activePageId = get().activePageId;
                if (!website || !activePageId) return;

                const newPages = website.pages.map(p =>
                    p.id === activePageId ? { ...p, ...updates } : p
                );

                get().updateWebsitePages(newPages);
            },

            updateNavbar: (updates) => {
                const page = get().getActivePage();
                if (!page) return;
                get().updateCurrentPage({ navbar: { ...page.navbar, ...updates } });
            },

            updateFooter: (updates) => {
                const page = get().getActivePage();
                if (!page) return;
                get().updateCurrentPage({ footer: { ...page.footer, ...updates } });
            },

            // Editor Actions
            setEditorState: (updates) => set((state) => ({
                editor: { ...state.editor, ...updates }
            })),

            selectSection: (id) => set((state) => ({
                editor: { ...state.editor, selectedSectionId: id, selectedComponentId: null, showRightPanel: !!id }
            })),

            selectComponent: (id) => set((state) => ({
                editor: { ...state.editor, selectedComponentId: id, showRightPanel: !!id }
            })),

            // Additional editor methods for interface compatibility
            setSelectedSection: (id) => set((state) => ({
                editor: { ...state.editor, selectedSectionId: id, selectedComponentId: null, showRightPanel: !!id }
            })),

            setSelectedComponent: (id) => set((state) => ({
                editor: { ...state.editor, selectedComponentId: id, showRightPanel: !!id }
            })),

            setEditMode: (mode) => set((state) => ({
                editor: { ...state.editor, editMode: mode }
            })),

            setDragging: (isDragging) => set((state) => ({
                editor: { ...state.editor, isDragging }
            })),

            setZoom: (zoom) => set((state) => ({
                editor: { ...state.editor, zoom }
            })),

            toggleGrid: () => set((state) => ({
                editor: { ...state.editor, showGrid: !state.editor.showGrid }
            })),

            setPreviewMode: (previewMode) => set((state) => ({
                editor: { ...state.editor, previewMode }
            })),

            toggleLeftPanel: () => set((state) => ({
                editor: { ...state.editor, showLeftPanel: !state.editor.showLeftPanel }
            })),

            toggleRightPanel: () => set((state) => ({
                editor: { ...state.editor, showRightPanel: !state.editor.showRightPanel }
            })),

            addToHistory: (pages) => set((state) => {
                const newHistory = state.history.slice(0, state.historyIndex + 1);
                newHistory.push(pages);
                return {
                    history: newHistory,
                    historyIndex: newHistory.length - 1
                };
            }),

            // Undo/Redo
            undo: () => {
                const { history, historyIndex, activeWebsiteId } = get();
                if (historyIndex <= 0) return;

                const prevPages = history[historyIndex - 1];
                set((state) => ({
                    historyIndex: historyIndex - 1,
                    websites: state.websites.map(w =>
                        w.id === activeWebsiteId ? { ...w, pages: prevPages } : w
                    )
                }));
            },

            redo: () => {
                const { history, historyIndex, activeWebsiteId } = get();
                if (historyIndex >= history.length - 1) return;

                const nextPages = history[historyIndex + 1];
                set((state) => ({
                    historyIndex: historyIndex + 1,
                    websites: state.websites.map(w =>
                        w.id === activeWebsiteId ? { ...w, pages: nextPages } : w
                    )
                }));
            }
        }),
        {
            name: 'website-builder-storage',
            partialize: (state) => ({ websites: state.websites }),
        }
    )
);

export default useBuilderStore;
