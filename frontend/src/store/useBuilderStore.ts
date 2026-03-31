import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';
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

export interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'file';
    url: string;
    size?: string;
    date: string;
}

export interface Page {
    id: string;
    name: string;
    slug: string;
    sections: any[];
    meta: { title: string; description: string };
    navbar: any;
    footer: any;
    globalStyles: any;
}

export interface Website {
    id: string;
    name: string;
    lastEdited: string;
    status: 'Draft' | 'Published';
    pages: Page[];
    activePageId: string | null;
    templateId?: string;
    publishedUrl?: string;
    customDomain?: string;
    subdomain?: string;
}

export interface EditorState {
    selectedSectionId: string | null;
    selectedComponentId: string | null;
    editMode: 'content' | 'style';
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
}

export interface BuilderStore {
    websites: Website[];
    activeWebsiteId: string | null;
    activePageId: string | null;
    editor: EditorState;
    assets: Asset[];
    history: Page[][];
    historyIndex: number;

    setWebsites: (websites: Website[]) => void;
    fetchWebsites: (institutionId?: string, isAdmin?: boolean) => Promise<void>;
    createWebsite: (name: string, template?: string, institutionId?: string) => Promise<string>;
    updateWebsite: (id: string, updates: Partial<Website>) => Promise<void>;
    selectWebsite: (id: string) => void;
    deleteWebsite: (id: string) => Promise<void>;
    setActivePage: (pageId: string) => void;
    addPage: (pageData: Partial<Page>) => void;
    duplicatePage: (pageId: string) => void;
    deletePage: (pageId: string) => void;
    saveActiveWebsite: () => Promise<void>;
    updatePageSEO: (pageId: string, seoUpdates: Partial<{ title: string; description: string }>) => void;
    updateWebsitePages: (newPages: Page[]) => void;
    addSection: (section: any, index?: number) => void;
    updateSection: (sectionId: string, updates: any) => void;
    deleteSection: (sectionId: string) => void;
    reorderSections: (ids: string[]) => void;
    addComponent: (sectionId: string, component: any) => void;
    updateComponent: (sectionId: string, componentId: string, updates: any) => void;
    deleteComponent: (sectionId: string, componentId: string) => void;
    addAsset: (asset: Omit<Asset, 'id' | 'date'>) => void;
    deleteAsset: (id: string) => void;
    getActiveWebsite: () => Website | undefined;
    getActivePage: () => Page | null;
    updateCurrentPage: (updates: Partial<Page>) => void;
    updateNavbar: (updates: any) => void;
    updateFooter: (updates: any) => void;
    setEditorState: (updates: Partial<EditorState>) => void;
    setTourState: (updates: Partial<EditorState['tour']>) => void;
    selectSection: (id: string | null) => void;
    selectComponent: (id: string | null) => void;
    undo: () => void;
    redo: () => void;
}

const useBuilderStore = create<BuilderStore>()(
    persist(
        (set, get) => ({
            // State
            websites: [],
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
            assets: [
                { id: '1', name: 'Coffee Shop', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', type: 'image', size: '1.2 MB', date: new Date().toISOString() },
                { id: '2', name: 'Modern Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', type: 'image', size: '0.8 MB', date: new Date().toISOString() },
                { id: '3', name: 'Team Meeting', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', type: 'image', size: '0.5 MB', date: new Date().toISOString() },
                { id: '4', name: 'Startup Laptop', url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80', type: 'image', size: '1.1 MB', date: new Date().toISOString() },
            ],
            history: [],
            historyIndex: -1,

            // Actions
            setWebsites: (websites) => set({ websites }),

            fetchWebsites: async (institutionId?: string, isAdmin = false) => {
                try {
                    const { default: websiteApi } = await import('../api/website');
                    let response;
                    
                    if (isAdmin) {
                        response = await websiteApi.getWebsitesAll(institutionId ? { institution_id: institutionId } : undefined);
                    } else {
                        response = await websiteApi.getWebsites(institutionId ? { institution_id: institutionId } : undefined);
                    }
                    
                    const rawWebsites = (response.data && response.data.websites) || [];
                    const websitesFromBackend = Array.isArray(rawWebsites) ? rawWebsites : (rawWebsites.websites || []);
                    
                    const websites = websitesFromBackend.map((w: any) => ({
                        id: w.id,
                        name: w.name,
                        status: w.status,
                        lastEdited: w.updated_at || w.created_at,
                        pages: w.content?.pages || [],
                        activePageId: w.content?.activePageId || null,
                        templateId: w.content?.templateId || 'blank',
                        institution: w.institution,
                        institution_id: w.institution_id,
                        owner_id: w.owner_id,
                        settings: w.settings
                    }));
                    
                    set({ websites });
                } catch (error) {
                    console.error("Failed to fetch websites from backend:", error);
                    set({ websites: [] });
                }
            },

            createWebsite: async (name, template = 'blank', institutionId?: string) => {
                const templateFn = TEMPLATE_MAP[template] || TEMPLATE_MAP.blank;
                const homePage = templateFn();
                const initialContent = {
                    pages: [homePage],
                    activePageId: homePage.id,
                    templateId: template
                };

                try {
                    const { default: websiteApi } = await import('../api/website');
                    const response = await websiteApi.createWebsite({ 
                                name, 
                                content: initialContent,
                                ...(institutionId ? { institution_id: institutionId } : {})
                            });
                    
                    const w = response.data.website;
                    const newWebsite: Website = {
                        id: w.id,
                        name: w.name,
                        lastEdited: w.updated_at || w.created_at,
                        status: w.status,
                        pages: initialContent.pages,
                        activePageId: initialContent.activePageId,
                        templateId: template
                    };

                    set((state) => ({
                        websites: [...state.websites, newWebsite],
                        activeWebsiteId: w.id,
                        activePageId: homePage.id,
                        history: [newWebsite.pages],
                        historyIndex: 0,
                        editor: {
                            ...state.editor,
                            tour: {
                                isActive: true,
                                step: 0,
                                isFinished: false,
                            }
                        }
                    }));
                    return w.id;
                } catch (error) {
                    console.error("Failed to create website on backend:", error);
                    throw error;
                }
            },

            updateWebsite: async (id, updates) => {
                set((state) => ({
                    websites: state.websites.map(w => w.id === id ? { ...w, ...updates } : w)
                }));
                
                // If the update includes content-affecting fields, sync to backend
                if (updates.pages || updates.activePageId || updates.name || updates.status) {
                    try {
                        const { default: websiteApi } = await import('../api/website');
                        const website = get().websites.find(w => w.id === id);
                        if (website) {
                            await websiteApi.updateWebsite(id, {
                                name: website.name,
                                status: website.status,
                                content: {
                                    pages: website.pages,
                                    activePageId: website.activePageId,
                                    templateId: website.templateId
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Failed to update website on backend:", error);
                    }
                }
            },

            saveActiveWebsite: async () => {
                const state = get();
                const activeId = state.activeWebsiteId;
                if (!activeId) return;
                
                const website = state.websites.find(w => w.id === activeId);
                if (!website) return;
                
                try {
                    const { default: websiteApi } = await import('../api/website');
                    await websiteApi.updateWebsite(activeId, {
                        name: website.name,
                        status: website.status,
                        content: {
                            pages: website.pages,
                            activePageId: website.activePageId,
                            templateId: website.templateId
                        }
                    });
                } catch (error) {
                    console.error("Auto-save failed:", error);
                }
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

            deleteWebsite: async (id: string) => {
                try {
                    const { default: websiteApi } = await import('../api/website');
                    await websiteApi.deleteWebsite(id);
                    set((state) => ({
                        websites: state.websites.filter(w => w.id !== id),
                        activeWebsiteId: state.activeWebsiteId === id ? null : state.activeWebsiteId
                    }));
                } catch (error) {
                    console.error("Failed to delete website from backend:", error);
                }
            },

            setActivePage: (pageId) => set({ activePageId: pageId }),

            addPage: (pageData) => {
                const { activeWebsiteId, websites } = get();
                if (!activeWebsiteId) return;

                const website = websites.find(w => w.id === activeWebsiteId);
                if (!website) return;

                const newPage: Page = {
                    id: uuidv4(),
                    name: pageData.name || 'New Page',
                    slug: pageData.slug || '/new-page',
                    sections: pageData.sections || [],
                    meta: {
                        title: pageData.name || 'New Page',
                        description: ''
                    },
                    navbar: website.pages[0].navbar,
                    footer: website.pages[0].footer,
                    globalStyles: website.pages[0].globalStyles,
                };

                const newPages = [...website.pages, newPage];
                get().updateWebsitePages(newPages);
                set({ activePageId: newPage.id });
                get().saveActiveWebsite();
            },

            duplicatePage: (pageId) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const page = website.pages.find(p => p.id === pageId);
                if (!page) return;

                const newPage = {
                    ...page,
                    id: uuidv4(),
                    name: `${page.name} (Copy)`,
                    slug: `${page.slug}-copy`,
                };

                get().updateWebsitePages([...website.pages, newPage]);
                get().saveActiveWebsite();
            },

            deletePage: (pageId) => {
                const website = get().getActiveWebsite();
                if (!website || website.pages.length <= 1) return;

                const newPages = website.pages.filter(p => p.id !== pageId);
                const nextActiveId = website.activePageId === pageId ? newPages[0].id : website.activePageId;

                set((state) => ({
                    activePageId: nextActiveId,
                    websites: state.websites.map(w =>
                        w.id === state.activeWebsiteId ? { ...w, pages: newPages, activePageId: nextActiveId } : w
                    )
                }));
                get().saveActiveWebsite();
            },

            updatePageSEO: (pageId, seoUpdates) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const newPages = website.pages.map(p =>
                    p.id === pageId ? { ...p, meta: { ...p.meta, ...seoUpdates } } : p
                );
                get().updateWebsitePages(newPages);
                get().saveActiveWebsite();
            },

            updateWebsitePages: (newPages) => {
                const { activeWebsiteId, history, historyIndex } = get();
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

            addSection: (section, index) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = [...page.sections];
                const targetIndex = index ?? newSections.length;
                newSections.splice(targetIndex, 0, section);

                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
            },

            updateSection: (sectionId, updates) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.map(s =>
                    s.id === sectionId ? { ...s, ...updates } : s
                );

                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
            },

            deleteSection: (sectionId) => {
                const page = get().getActivePage();
                if (!page) return;

                const newSections = page.sections.filter(s => s.id !== sectionId);
                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
            },

            reorderSections: (ids) => {
                const page = get().getActivePage();
                if (!page) return;

                const sectionMap = new Map(page.sections.map(s => [s.id, s]));
                const newSections = ids.map(id => sectionMap.get(id)).filter(Boolean);

                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
            },

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
                get().saveActiveWebsite();
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
                get().saveActiveWebsite();
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
                get().saveActiveWebsite();
            },

            addAsset: (asset) => set((state) => ({
                assets: [
                    {
                        ...asset,
                        id: uuidv4(),
                        date: new Date().toISOString(),
                        size: asset.size || '0.5 MB'
                    },
                    ...state.assets
                ]
            })),

            deleteAsset: (id) => set((state) => ({
                assets: state.assets.filter(a => a.id !== id)
            })),

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
                get().saveActiveWebsite();
            },

            updateFooter: (updates) => {
                const page = get().getActivePage();
                if (!page) return;
                get().updateCurrentPage({ footer: { ...page.footer, ...updates } });
                get().saveActiveWebsite();
            },

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
                get().saveActiveWebsite();
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
            partialize: (state) => ({ websites: state.websites, assets: state.assets }),
        }
    )
);

export default useBuilderStore;
