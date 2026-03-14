import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
    getDefaultPage,
    getBusinessPage,
    getPortfolioPage,
    getEcommercePage,
    getConsultantPage,
    getAgenciesPage,
    getCoachPage
} from '@/lib/defaultPageData';

const TEMPLATE_MAP: Record<string, () => any> = {
    blank: getDefaultPage,
    business: getBusinessPage,
    portfolio: getPortfolioPage,
    ecommerce: getEcommercePage,
    consultant: getConsultantPage,
    agencies: getAgenciesPage,
    coaching: getCoachPage,
};

export interface Website {
    id: string;
    name: string;
    lastEdited: string;
    status: string;
    pages: any[];
    activePageId: string;
    templateId?: string;
}

export interface BuilderState {
    websites: Website[];
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
        tour: {
            isActive: boolean;
            step: number;
            isFinished: boolean;
        };
    };
    history: any[][];
    historyIndex: number;

    setWebsites: (websites: Website[]) => void;
    createWebsite: (name: string, template?: string) => string;
    updateWebsite: (id: string, updates: any) => void;
    selectWebsite: (id: string) => void;
    deleteWebsite: (id: string) => void;
    setActivePage: (pageId: string) => void;
    addPage: (pageData: any) => void;
    duplicatePage: (pageId: string) => void;
    deletePage: (pageId: string) => void;
    updatePageSEO: (pageId: string, seoUpdates: any) => void;
    updateWebsitePages: (newPages: any[]) => void;
    addSection: (section: any, index?: number) => void;
    updateSection: (sectionId: string, updates: any) => void;
    deleteSection: (sectionId: string) => void;
    reorderSections: (ids: string[]) => void;
    addComponent: (sectionId: string, component: any) => void;
    updateComponent: (sectionId: string, componentId: string, updates: any) => void;
    deleteComponent: (sectionId: string, componentId: string) => void;
    getActiveWebsite: () => Website | undefined;
    getActivePage: () => any | null;
    updateCurrentPage: (updates: any) => void;
    updateNavbar: (updates: any) => void;
    updateFooter: (updates: any) => void;
    setEditorState: (updates: any) => void;
    setTourState: (updates: any) => void;
    selectSection: (id: string | null) => void;
    selectComponent: (id: string | null) => void;
    undo: () => void;
    redo: () => void;
}

export const useBuilderStore = create<BuilderState>()(
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
            tour: {
                isActive: false,
                step: 0,
                isFinished: false,
            },
        },

        history: [],
        historyIndex: -1,

        // Actions
        setWebsites: (websites) => set({ websites }),

        createWebsite: (name, template = 'blank') => {
            const id = uuidv4();
            const templateFn = TEMPLATE_MAP[template] || TEMPLATE_MAP.blank;
            const homePage = templateFn();
            const newWebsite = {
                id,
                name,
                lastEdited: new Date().toISOString(),
                status: 'Draft',
                pages: [homePage],
                activePageId: homePage.id,
                templateId: template,
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

        updateWebsite: (id, updates) => set((state) => ({
            websites: state.websites.map(w => w.id === id ? { ...w, ...updates } : w)
        })),

        selectWebsite: (id) => {
            let website = get().websites.find(w => w.id === id);
            
            // If website doesn't exist and we have an ID, create a default one
            if (!website && id) {
                const defaultPage = getDefaultPage();
                website = {
                    id,
                    name: defaultPage.name,
                    lastEdited: new Date().toISOString(),
                    status: 'active',
                    pages: [defaultPage],
                    activePageId: defaultPage.id,
                    templateId: 'blank'
                };
                
                set((state) => ({
                    websites: [...state.websites, website],
                    activeWebsiteId: id,
                    activePageId: defaultPage.id,
                    history: [website.pages],
                    historyIndex: 0,
                    editor: {
                        ...state.editor,
                        tour: {
                            ...state.editor.tour,
                            isActive: true, // Start tour for new websites
                            step: 0,
                            isFinished: false
                        }
                    }
                }));
            } else if (website) {
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
        
        setTourState: (updates) => set((state) => ({
            editor: { 
                ...state.editor, 
                tour: { ...state.editor.tour, ...updates } 
            }
        })),

        selectSection: (id) => set((state) => ({
            editor: { ...state.editor, selectedSectionId: id, selectedComponentId: null, showRightPanel: !!id }
        })),

        selectComponent: (id) => set((state) => ({
            editor: { ...state.editor, selectedComponentId: id, showRightPanel: !!id }
        })),

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
    })
);

export default useBuilderStore;
