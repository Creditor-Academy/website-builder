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
import { builderWebsiteToTemplatePayload, templateToBuilderWebsite } from '@/lib/templateBuilder';

let _saveTimer: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 800;
const MAX_HISTORY = 50;

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
    scope?: 'GLOBAL' | 'WEBSITE';
    websiteId?: string;
    isGlobal?: boolean;
    ownerName?: string;
}

type AssetScope = {
    websiteId?: string;
};

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
    builderMeta?: any;
    sourceTemplateId?: string;
    institution?: any;
    institution_id?: string;
    owner_id?: string;
    settings?: any;
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

export interface TemplateEditorState {
    id: string;
    name: string;
    description: string;
    category: string;
    image?: string | null;
    scope?: 'GLOBAL' | 'INSTITUTION';
}

export interface BuilderStore {
    websites: Website[];
    activeWebsiteId: string | null;
    activePageId: string | null;
    editor: EditorState;
    globalAssets: Asset[];
    websiteAssetsByWebsiteId: Record<string, Asset[]>;
    history: Page[][];
    historyIndex: number;
    templateEditor: TemplateEditorState | null;

    setWebsites: (websites: Website[]) => void;
    startTemplateEditing: (template: any) => void;
    stopTemplateEditing: () => void;
    fetchWebsites: (institutionId?: string, isAdmin?: boolean) => Promise<void>;
    fetchAssets: (scope?: AssetScope) => Promise<void>;
    createWebsite: (name: string, template?: string, institutionId?: string) => Promise<string>;
    updateWebsite: (id: string, updates: Partial<Website>) => Promise<void>;
    selectWebsite: (id: string) => Promise<void>;
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
    uploadAsset: (file: File, scope?: AssetScope) => Promise<void>;
    importAssetFromUrl: (name: string, url: string, scope?: AssetScope) => Promise<void>;
    deleteAsset: (id: string, scope?: AssetScope) => Promise<void>;
    getScopedAssets: (websiteId?: string) => Asset[];
    getActiveWebsite: () => Website | undefined;
    getActivePage: () => Page | null;
    updateCurrentPage: (updates: Partial<Page>) => void;
    updateAllPagesGlobalStyles: (globalStyles: Record<string, any>) => void;
    applyPaletteToAllPages: (palette: { primary: string; secondary: string; accent: string; background: string; text: string; alternate: string; alternateText: string; name: string }) => void;
    applyFXToAllPages: (fx: { radius: string; shadow: string; animation: string; glass?: boolean }) => void;
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
            globalAssets: [],
            websiteAssetsByWebsiteId: {},
            history: [],
            historyIndex: -1,
            templateEditor: null,

            // Actions
            setWebsites: (websites) => set({ websites }),

            startTemplateEditing: (template) => {
                const templateWebsite = templateToBuilderWebsite(template);
                set((state) => ({
                    websites: [
                        ...state.websites.filter((website) => website.id !== templateWebsite.id),
                        templateWebsite,
                    ],
                    activeWebsiteId: templateWebsite.id,
                    activePageId: templateWebsite.activePageId,
                    history: [templateWebsite.pages],
                    historyIndex: 0,
                    templateEditor: {
                        id: template.id,
                        name: template.name,
                        description: template.description || '',
                        category: template.category || 'General',
                        image: template.image || null,
                        scope: template.scope,
                    },
                    editor: {
                        ...state.editor,
                        selectedSectionId: null,
                        selectedComponentId: null,
                        showLeftPanel: true,
                        showRightPanel: false,
                        previewMode: false,
                    }
                }));
            },

            stopTemplateEditing: () => set({ templateEditor: null }),

            fetchAssets: async (scope = {}) => {
                try {
                    const { default: assetApi } = await import('../api/assets');
                    const response = await assetApi.listAssets(scope);
                    const assets = response.data.assets || [];

                    if (scope.websiteId) {
                        set((state) => ({
                            websiteAssetsByWebsiteId: {
                                ...state.websiteAssetsByWebsiteId,
                                [scope.websiteId as string]: assets,
                            }
                        }));
                        return;
                    }

                    set({ globalAssets: assets });
                } catch (error) {
                    console.error('Failed to fetch assets from backend:', error);
                }
            },

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
                        publishedUrl: w.content?.builderMeta?.publishedUrl || undefined,
                        builderMeta: w.content?.builderMeta || undefined,
                        sourceTemplateId: w.source_template_id || w.content?.sourceTemplateId || undefined,
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
                const isLocalTemplate = Boolean(TEMPLATE_MAP[template]);
                const templateFn = TEMPLATE_MAP[template] || TEMPLATE_MAP.blank;
                const homePage = templateFn();
                const initialContent = {
                    pages: [homePage],
                    activePageId: homePage.id,
                    templateId: template
                };
                const createPayload: Record<string, unknown> = {
                    name,
                    ...(institutionId ? { institution_id: institutionId } : {})
                };

                if (isLocalTemplate) {
                    createPayload.content = initialContent;
                } else {
                    createPayload.template_id = template;
                }

                try {
                    const { default: websiteApi } = await import('../api/website');
                    const response = await websiteApi.createWebsite(createPayload);
                    
                    const w = response.data.website;
                    const persistedContent = w.content || initialContent;
                    const newWebsite: Website = {
                        id: w.id,
                        name: w.name,
                        lastEdited: w.updated_at || w.created_at,
                        status: w.status,
                        pages: persistedContent.pages || initialContent.pages,
                        activePageId: persistedContent.activePageId || initialContent.activePageId,
                        templateId: persistedContent.templateId || template,
                        builderMeta: persistedContent.builderMeta,
                        sourceTemplateId: w.source_template_id || persistedContent.sourceTemplateId || undefined
                    };

                    set((state) => ({
                        websites: [...state.websites, newWebsite],
                        activeWebsiteId: w.id,
                        activePageId: newWebsite.activePageId,
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
                                    templateId: website.templateId,
                                    builderMeta: website.builderMeta
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Failed to update website on backend:", error);
                    }
                }
            },

            saveActiveWebsite: async () => {
                if (_saveTimer) clearTimeout(_saveTimer);
                _saveTimer = setTimeout(async () => {
                const state = get();
                const activeId = state.activeWebsiteId;
                if (!activeId) return;
                
                const website = state.websites.find(w => w.id === activeId);
                if (!website) return;
                
                try {
                    if (state.templateEditor && state.templateEditor.id === activeId) {
                        const { default: templateApi } = await import('../api/templates');
                        await templateApi.updateWebsiteTemplate(
                            state.templateEditor.id,
                            builderWebsiteToTemplatePayload(website, state.templateEditor)
                        );
                        return;
                    }

                    const { default: websiteApi } = await import('../api/website');
                    await websiteApi.updateWebsite(activeId, {
                        name: website.name,
                        status: website.status,
                        content: {
                            pages: website.pages,
                            activePageId: website.activePageId,
                            templateId: website.templateId,
                            builderMeta: website.builderMeta
                        }
                    });
                } catch (error) {
                    console.error("Auto-save failed:", error);
                }
                }, SAVE_DEBOUNCE_MS);
            },

            selectWebsite: async (id) => {
                let website = get().websites.find(w => w.id === id);
                if (!website) {
                    // Fetch from backend if not in local store
                    try {
                        const { default: websiteApi } = await import('../api/website');
                        const response = await websiteApi.getWebsiteById(id);
                        const w = response.data?.website || response.data;
                        if (w) {
                            website = {
                                id: w.id,
                                name: w.name,
                                status: w.status,
                                lastEdited: w.updated_at || w.created_at,
                                pages: w.content?.pages || [],
                                activePageId: w.content?.activePageId || null,
                                templateId: w.content?.templateId || 'blank',
                                publishedUrl: w.content?.builderMeta?.publishedUrl || undefined,
                                builderMeta: w.content?.builderMeta || undefined,
                                sourceTemplateId: w.source_template_id || w.content?.sourceTemplateId || undefined,
                                institution: w.institution,
                                institution_id: w.institution_id,
                                owner_id: w.owner_id,
                                settings: w.settings
                            };
                            set((state) => ({ websites: [...state.websites, website!] }));
                        }
                    } catch (error) {
                        console.error("Failed to fetch website:", error);
                    }
                }
                if (website) {
                    set({
                        activeWebsiteId: id,
                        activePageId: website.activePageId || website.pages[0]?.id,
                        history: [website.pages],
                        historyIndex: 0
                    });
                } else {
                    set({ templateEditor: null });
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

                let newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(newPages);
                if (newHistory.length > MAX_HISTORY) {
                    newHistory = newHistory.slice(newHistory.length - MAX_HISTORY);
                }

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
                globalAssets: [
                    {
                        ...asset,
                        id: uuidv4(),
                        date: new Date().toISOString(),
                        size: asset.size || '0.5 MB'
                    },
                    ...state.globalAssets
                ]
            })),

            uploadAsset: async (file, scope = {}) => {
                try {
                    const { default: assetApi } = await import('../api/assets');
                    const response = await assetApi.uploadAsset(file, scope);
                    const asset = response.data.asset;

                    if (scope.websiteId) {
                        set((state) => ({
                            websiteAssetsByWebsiteId: {
                                ...state.websiteAssetsByWebsiteId,
                                [scope.websiteId as string]: [
                                    asset,
                                    ...(state.websiteAssetsByWebsiteId[scope.websiteId as string] || []),
                                ],
                            }
                        }));
                        return;
                    }

                    set((state) => ({ globalAssets: [asset, ...state.globalAssets] }));
                } catch (error) {
                    console.error('Failed to upload asset:', error);
                    throw error;
                }
            },

            importAssetFromUrl: async (name, url, scope = {}) => {
                try {
                    const { default: assetApi } = await import('../api/assets');
                    const response = await assetApi.importAssetFromUrl({ name, url }, scope);
                    const asset = response.data.asset;

                    if (scope.websiteId) {
                        set((state) => ({
                            websiteAssetsByWebsiteId: {
                                ...state.websiteAssetsByWebsiteId,
                                [scope.websiteId as string]: [
                                    asset,
                                    ...(state.websiteAssetsByWebsiteId[scope.websiteId as string] || []),
                                ],
                            }
                        }));
                        return;
                    }

                    set((state) => ({ globalAssets: [asset, ...state.globalAssets] }));
                } catch (error) {
                    console.error('Failed to import asset from URL:', error);
                    throw error;
                }
            },

            deleteAsset: async (id, scope = {}) => {
                try {
                    const { default: assetApi } = await import('../api/assets');
                    await assetApi.deleteAsset(id, scope);

                    if (scope.websiteId) {
                        set((state) => ({
                            websiteAssetsByWebsiteId: {
                                ...state.websiteAssetsByWebsiteId,
                                [scope.websiteId as string]: (state.websiteAssetsByWebsiteId[scope.websiteId as string] || []).filter(a => a.id !== id),
                            }
                        }));
                        return;
                    }

                    set((state) => ({ globalAssets: state.globalAssets.filter(a => a.id !== id) }));
                } catch (error) {
                    console.error('Failed to delete asset:', error);
                    throw error;
                }
            },

            getScopedAssets: (websiteId) => {
                const { globalAssets, websiteAssetsByWebsiteId } = get();
                return websiteId ? (websiteAssetsByWebsiteId[websiteId] || []) : globalAssets;
            },

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

            updateAllPagesGlobalStyles: (globalStyles) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const newPages = website.pages.map(p => ({ ...p, globalStyles: { ...(p.globalStyles || {}), ...globalStyles } }));
                get().updateWebsitePages(newPages);
            },

            applyPaletteToAllPages: (palette) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const clearSectionColors = (s: any) => ({
                    ...s,
                    styles: {
                        ...s.styles,
                        backgroundColor: undefined,
                        backgroundGradient: undefined,
                        headingColor: undefined,
                        paragraphColor: undefined,
                        buttonPrimaryBg: undefined,
                        buttonPrimaryText: undefined,
                        buttonSecondaryBg: undefined,
                        buttonSecondaryText: undefined,
                        useGradient: false
                    }
                });
                const newPages = website.pages.map(p => ({
                    ...p,
                    globalStyles: {
                        ...(p.globalStyles || {}),
                        primaryColor: palette.primary,
                        secondaryColor: palette.secondary,
                        accentColor: palette.accent,
                        backgroundColor: palette.background,
                        textColor: palette.text,
                        alternateBackground: palette.alternate,
                        alternateTextColor: palette.alternateText,
                        selectedPalette: palette.name
                    },
                    sections: (p.sections || []).map(clearSectionColors),
                    navbar: { ...(p.navbar || {}), styles: { ...((p.navbar as any)?.styles || {}), backgroundColor: undefined, textColor: undefined } },
                    footer: { ...(p.footer || {}), styles: { ...((p.footer as any)?.styles || {}), backgroundColor: undefined, textColor: undefined } }
                }));
                get().updateWebsitePages(newPages);
                get().saveActiveWebsite();
            },

            applyFXToAllPages: (fx) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const clearSectionFX = (s: any) => ({
                    ...s,
                    styles: { ...s.styles, borderRadius: undefined, shadows: undefined }
                });
                const newPages = website.pages.map(p => ({
                    ...p,
                    globalStyles: {
                        ...(p.globalStyles || {}),
                        borderRadius: fx.radius,
                        shadows: fx.shadow,
                        animations: fx.animation,
                        glassmorphism: fx.glass || false
                    },
                    sections: (p.sections || []).map(clearSectionFX)
                }));
                get().updateWebsitePages(newPages);
                get().saveActiveWebsite();
            },

            updateNavbar: (updates) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const newPages = website.pages.map(p => ({
                    ...p,
                    navbar: { ...(p.navbar || {}), ...updates }
                }));
                get().updateWebsitePages(newPages);
                get().saveActiveWebsite();
            },

            updateFooter: (updates) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const newPages = website.pages.map(p => ({
                    ...p,
                    footer: { ...(p.footer || {}), ...updates }
                }));
                get().updateWebsitePages(newPages);
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
            partialize: (state) => ({
                websites: state.websites,
                globalAssets: state.globalAssets,
                websiteAssetsByWebsiteId: state.websiteAssetsByWebsiteId,
            }),
        }
    )
);

export default useBuilderStore;
