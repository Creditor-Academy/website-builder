import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    getBlankPage,
    getBusinessPage,
    getPortfolioPage,
    getEcommercePage,
    getConsultantPage,
    getAgenciesPage,
    getCoachPage
} from '@/lib/defaultPageData';
import { builderWebsiteToTemplatePayload, templateToBuilderWebsite } from '@/lib/templateBuilder';
import type { DeviceId, DropTarget, ElementType, FreePosition, NodeKind, SaveStatus } from '@/builder/types';
import { SCHEMA_VERSION } from '@/builder/types';
import type { PaletteDragData } from '@/builder/dnd';
import {
    addContainerToPage,
    addElementToPage,
    addItemAtDropTarget,
    addPrebuiltAtDropTarget,
    addSectionToPage,
    applyDelete,
    applyDeleteMany,
    applyDuplicate,
    applyDuplicateMany,
    applyMove,
    applyNodePatch,
    applyStylePatch,
    applyFreePosition,
    applyManyFreePositions,
    applyResize,
    applyLayerShift,
    copyNodesToClipboard,
    normalizeActiveSections,
    pasteClipboard,
    type CanvasClipboard,
    type LayerShift,
} from '@/builder/documentOps';
import { findNode, getSelectionAfterDelete } from '@/builder/tree';
import { readNavbarFlowHeight } from '@/builder/canvas/navbarSlot';
import { nextSelectedIds, resolveNodeKind, selectedIdsOf, selectionCanJoin, type SelectMode } from '@/builder/selection';
import { USE_WEBSITE_API } from '@/lib/localMode';
import {
    getStoredUserId,
    migrateLegacyBuilderStorage,
    pauseBuilderPersist,
    resumeBuilderPersist,
    userScopedBuilderStorage,
} from '@/lib/builderStorage';

export { USE_WEBSITE_API };

let _saveTimer: ReturnType<typeof setTimeout> | null = null;
const SAVE_DEBOUNCE_MS = 800;
const MAX_HISTORY = 50;

const TEMPLATE_MAP: Record<string, () => any> = {
    blank: getBlankPage,
    business: getBusinessPage,
    portfolio: getPortfolioPage,
    ecommerce: getEcommercePage,
    consultant: getConsultantPage,
    agencies: getAgenciesPage,
    coaching: getCoachPage,
};

function createLocalWebsite(id: string, name = 'Untitled website', template = 'blank'): Website {
    const templateFn = TEMPLATE_MAP[template] || TEMPLATE_MAP.blank;
    const homePage: Page = { ...templateFn(), schemaVersion: SCHEMA_VERSION };
    return {
        id,
        name,
        lastEdited: new Date().toISOString(),
        status: 'Draft',
        pages: [homePage],
        activePageId: homePage.id,
        templateId: template,
        owner_id: getStoredUserId() || undefined,
    };
}

export interface Asset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'file';
    url: string;
    size?: string;
    date: string;
    scope?: 'GLOBAL' | 'WEBSITE' | 'USER';
    websiteId?: string;
    isGlobal?: boolean;
    ownerId?: string;
    ownerName?: string;
}

type AssetScope = {
    websiteId?: string;
    scope?: 'GLOBAL' | 'WEBSITE' | 'USER';
};

function normalizeAsset(raw: any, uploadScope: AssetScope = {}): Asset {
    const asset: Asset = {
        id: raw.id,
        name: raw.name,
        type: raw.type,
        url: raw.url,
        size: raw.size,
        date: raw.date ?? raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
        scope: typeof raw.scope === 'string' ? raw.scope.toUpperCase() : raw.scope,
        websiteId: raw.websiteId ?? raw.website_id,
        isGlobal: raw.isGlobal ?? raw.is_global ?? raw.global,
        ownerId: raw.ownerId ?? raw.owner_id ?? raw.user_id ?? raw.created_by ?? raw.uploaded_by,
        ownerName: raw.ownerName ?? raw.owner_name,
    };

    if (uploadScope.scope === 'GLOBAL') {
        return { ...asset, scope: 'GLOBAL', isGlobal: true, websiteId: undefined };
    }

    if (uploadScope.scope === 'USER') {
        return { ...asset, scope: 'USER', isGlobal: false };
    }

    if (uploadScope.websiteId) {
        return { ...asset, scope: 'WEBSITE', websiteId: uploadScope.websiteId, isGlobal: false };
    }

    if (asset.scope === 'USER') {
        return { ...asset, scope: 'USER', isGlobal: false };
    }

    if (asset.scope === 'GLOBAL' || asset.isGlobal) {
        return { ...asset, scope: 'GLOBAL', isGlobal: true };
    }

    return asset;
}

function attachCurrentOwner(asset: Asset): Asset {
    if (asset.ownerId) return asset;
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user?.id) {
            return { ...asset, ownerId: user.id, ownerName: asset.ownerName ?? user.name };
        }
    } catch {
        /* ignore */
    }
    return asset;
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
    schemaVersion?: number;
}

export interface Website {
    id: string;
    name: string;
    lastEdited: string;
    status: 'Draft' | 'Published' | 'DELETED';
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
    selectedNodeId: string | null;
    selectedNodeIds: string[];
    selectedKind: NodeKind | null;
    hoveredNodeId: string | null;
    editMode: 'content' | 'style';
    isDragging: boolean;
    zoom: number;
    device: DeviceId;
    showGrid: boolean;
    previewMode: boolean;
    showLeftPanel: boolean;
    showRightPanel: boolean;
    saveStatus: SaveStatus;
    dropTarget: DropTarget | null;
    showComponentBar: boolean;
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

const INITIAL_EDITOR: EditorState = {
    selectedSectionId: null,
    selectedComponentId: null,
    selectedNodeId: null,
    selectedNodeIds: [],
    selectedKind: null,
    hoveredNodeId: null,
    editMode: 'content',
    isDragging: false,
    zoom: 100,
    device: 'desktop',
    showGrid: false,
    previewMode: false,
    showLeftPanel: true,
    showRightPanel: true,
    saveStatus: 'idle',
    dropTarget: null,
    showComponentBar: false,
    tour: {
        isActive: false,
        step: 0,
        isFinished: false,
    },
};

export function websitesForCurrentUser(websites: Website[], userId?: string | null): Website[] {
    if (!userId) return [];
    return websites.filter((site) => !site.owner_id || site.owner_id === userId);
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
    clipboard: CanvasClipboard | null;

    resetWorkspace: () => void;
    setWebsites: (websites: Website[]) => void;
    startTemplateEditing: (template: any) => void;
    stopTemplateEditing: () => void;
    fetchWebsites: (institutionId?: string, isAdmin?: boolean) => Promise<void>;
    fetchAssets: (scope?: AssetScope) => Promise<void>;
    createWebsite: (name: string, template?: string, institutionId?: string) => Promise<string>;
    updateWebsite: (id: string, updates: Partial<Website>) => Promise<void>;
    selectWebsite: (id: string) => Promise<void>;
    deleteWebsite: (id: string) => Promise<void>;
    restoreWebsite: (id: string) => Promise<void>;
    setActivePage: (pageId: string) => void;
    addPage: (pageData: Partial<Page>) => void;
    renamePage: (pageId: string, name: string) => void;
    setHomePage: (pageId: string) => void;
    duplicatePage: (pageId: string) => void;
    deletePage: (pageId: string) => void;
    saveActiveWebsite: () => Promise<void>;
    updatePageSEO: (pageId: string, seoUpdates: Partial<{ title: string; description: string }>) => void;
    updateWebsitePages: (newPages: Page[]) => void;
    addSection: (section: any, index?: number) => void;
    updateSection: (sectionId: string, updates: any) => void;
    deleteSection: (sectionId: string) => void;
    reorderSections: (ids: string[]) => void;
    addComponent: (sectionId: string, component: any) => string | null;
    updateComponent: (sectionId: string, componentId: string, updates: any, options?: { persist?: boolean }) => void;
    deleteComponent: (sectionId: string, componentId: string) => void;
    moveComponent: (fromSectionId: string, toSectionId: string, componentId: string, position?: { x: number; y: number }) => void;
    addAsset: (asset: Omit<Asset, 'id' | 'date'>) => void;
    uploadAsset: (file: File, scope?: AssetScope) => Promise<Asset>;
    importAssetFromUrl: (name: string, url: string, scope?: AssetScope) => Promise<Asset>;
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
    selectNode: (id: string | null, kind?: NodeKind | null, mode?: SelectMode) => void;
    selectNodes: (ids: string[]) => void;
    setDevice: (device: DeviceId) => void;
    setZoom: (zoom: number) => void;
    setSaveStatus: (status: SaveStatus) => void;
    setDropTarget: (target: DropTarget | null) => void;
    addCanvasElement: (type: ElementType, catalogId?: string) => string | null;
    addCanvasContainer: () => string | null;
    addCanvasSection: (section?: Record<string, unknown>) => string | null;
    updateCanvasNode: (id: string, patch: Record<string, unknown>) => void;
    updateCanvasStyles: (id: string, patch: Record<string, unknown>) => void;
    resizeCanvasNode: (id: string, patch: Record<string, unknown>) => void;
    updateFreePosition: (id: string, position: FreePosition) => void;
    updateFreePositions: (items: Array<{ id: string; position: FreePosition }>) => void;
    deleteCanvasNode: (id: string) => void;
    deleteCanvasNodes: (ids: string[]) => void;
    duplicateCanvasNode: (id: string) => string | null;
    duplicateCanvasNodes: (ids: string[]) => string[];
    moveCanvasNode: (id: string, target: DropTarget) => void;
    addPaletteItem: (item: PaletteDragData, target: DropTarget | null, prebuilt?: Record<string, unknown>, at?: { x: number; y: number }) => string | null;
    copyCanvasNode: (id?: string | null) => void;
    pasteCanvasNode: () => string | null;
    shiftCanvasLayer: (id: string, action: LayerShift) => void;
    undo: () => void;
    redo: () => void;
}

migrateLegacyBuilderStorage();

const useBuilderStore = create<BuilderStore>()(
    persist(
        (set, get) => ({
            // State
            websites: [],
            activeWebsiteId: null,
            activePageId: null,
            editor: { ...INITIAL_EDITOR },
            globalAssets: [],
            websiteAssetsByWebsiteId: {},
            history: [],
            historyIndex: -1,
            templateEditor: null,
            clipboard: null,

            resetWorkspace: () => set({
                websites: [],
                activeWebsiteId: null,
                activePageId: null,
                editor: { ...INITIAL_EDITOR },
                globalAssets: [],
                websiteAssetsByWebsiteId: {},
                history: [],
                historyIndex: -1,
                templateEditor: null,
                clipboard: null,
            }),

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
                        selectedNodeId: null,
                        selectedNodeIds: [],
                        selectedKind: null,
                        showLeftPanel: true,
                        showRightPanel: true,
                        previewMode: false,
                        saveStatus: 'idle',
                        device: 'desktop',
                        zoom: 100,
                        showComponentBar: false,
                    }
                }));
            },

            stopTemplateEditing: () => set({ templateEditor: null }),

            fetchAssets: async (scope = {}) => {
                try {
                    const { default: assetApi } = await import('../api/assets');
                    const response = await assetApi.listAssets(scope);
                    const assets = (response.data.assets || []).map((raw: any) => normalizeAsset(raw, scope));

                    if (scope.websiteId) {
                        set((state) => ({
                            websiteAssetsByWebsiteId: {
                                ...state.websiteAssetsByWebsiteId,
                                [scope.websiteId as string]: assets,
                            }
                        }));
                        return;
                    }

                    set((state) => {
                        const byId = new Map(state.globalAssets.map((asset) => [asset.id, asset]));
                        assets.forEach((asset: Asset) => {
                            const prev = byId.get(asset.id);
                            if (prev && (prev.scope === 'USER' || (!prev.isGlobal && prev.ownerId))) {
                                byId.set(asset.id, {
                                    ...asset,
                                    scope: 'USER',
                                    isGlobal: false,
                                    ownerId: prev.ownerId ?? asset.ownerId,
                                    ownerName: prev.ownerName ?? asset.ownerName,
                                });
                                return;
                            }
                            byId.set(asset.id, asset);
                        });
                        return { globalAssets: Array.from(byId.values()) };
                    });
                } catch (error) {
                    console.error('Failed to fetch assets from backend:', error);
                }
            },

            fetchWebsites: async (institutionId?: string, isAdmin = false) => {
                if (!USE_WEBSITE_API) return;

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
                    
                    const existingById = new Map(get().websites.map((site) => [site.id, site]));
                    const mapWebsite = (w: any) => {
                        const apiStatus = String(w.status || 'DRAFT').toUpperCase();
                        const uiStatus =
                            apiStatus === 'PUBLISHED' ? 'Published'
                            : apiStatus === 'DELETED' || apiStatus === 'ARCHIVED' ? 'DELETED'
                            : 'Draft';
                        const mapped = {
                            id: w.id,
                            name: w.name,
                            status: uiStatus,
                            lastEdited: w.updated_at || w.created_at,
                            pages: w.content?.pages || [],
                            activePageId: w.content?.activePageId || null,
                            templateId: w.content?.templateId || 'blank',
                            publishedUrl: w.content?.builderMeta?.publishedUrl || undefined,
                            subdomain: w.content?.builderMeta?.subdomain || undefined,
                            customDomain: w.content?.builderMeta?.customDomain || undefined,
                            builderMeta: w.content?.builderMeta || undefined,
                            sourceTemplateId: w.source_template_id || w.content?.sourceTemplateId || undefined,
                            institution: w.institution,
                            institution_id: w.institution_id,
                            owner_id: w.owner_id,
                            settings: w.settings
                        };
                        const existing = existingById.get(w.id);
                        if (existing?.pages?.length) {
                            return {
                                ...mapped,
                                pages: existing.pages,
                                activePageId: existing.activePageId || mapped.activePageId,
                                templateId: existing.templateId || mapped.templateId,
                                builderMeta: existing.builderMeta || mapped.builderMeta,
                            };
                        }
                        return mapped;
                    };

                    const activeWebsites = websitesFromBackend.map(mapWebsite);

                    // Also fetch deleted websites so the Deleted tab stays populated
                    let deletedWebsites: any[] = [];
                    try {
                        const deletedResponse = await websiteApi.getWebsites(
                            Object.assign(
                                institutionId ? { institution_id: institutionId } : {},
                                { status: 'DELETED' }
                            )
                        );
                        const rawDeleted = (deletedResponse.data && deletedResponse.data.websites) || [];
                        const deletedFromBackend = Array.isArray(rawDeleted) ? rawDeleted : (rawDeleted.websites || []);
                        deletedWebsites = deletedFromBackend.map(mapWebsite);
                    } catch {
                        // If the backend doesn't support status filter, just continue without deleted
                    }

                    // Merge: active + deleted, deduplicated by id
                    const deletedIds = new Set(deletedWebsites.map((w: any) => w.id));
                    const merged = [
                        ...activeWebsites.filter((w: any) => !deletedIds.has(w.id)),
                        ...deletedWebsites,
                    ];

                    set({ websites: merged });
                } catch (error) {
                    console.error("Failed to fetch websites from backend:", error);
                }
            },

            createWebsite: async (name, template = 'blank', institutionId?: string) => {
                if (!USE_WEBSITE_API) {
                    const newWebsite = createLocalWebsite(uuidv4(), name, template);
                    set((state) => ({
                        websites: [...state.websites, newWebsite],
                        activeWebsiteId: newWebsite.id,
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
                    return newWebsite.id;
                }

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
                    const backendPages = w.content?.pages;
                    const localPages = Array.isArray(backendPages) && backendPages.length > 0
                        ? backendPages
                        : initialContent.pages;
                    const newWebsite: Website = {
                        id: w.id,
                        name: w.name,
                        lastEdited: w.updated_at || w.created_at,
                        status: w.status,
                        pages: localPages,
                        activePageId: w.content?.activePageId || initialContent.activePageId,
                        templateId: w.content?.templateId || initialContent.templateId,
                        builderMeta: w.content?.builderMeta,
                        sourceTemplateId: w.source_template_id || w.content?.sourceTemplateId || undefined
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

                if (!USE_WEBSITE_API) return;
                
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
                set((state) => ({ editor: { ...state.editor, saveStatus: 'saving' } }));
                _saveTimer = setTimeout(async () => {
                const state = get();
                const activeId = state.activeWebsiteId;
                if (!activeId) return;
                
                const website = state.websites.find(w => w.id === activeId);
                if (!website) return;

                if (!USE_WEBSITE_API) {
                    set((current) => ({
                        websites: current.websites.map((w) =>
                            w.id === activeId ? { ...w, lastEdited: new Date().toISOString() } : w
                        ),
                        editor: { ...current.editor, saveStatus: 'saved' },
                    }));
                    return;
                }
                
                try {
                    if (state.templateEditor && state.templateEditor.id === activeId) {
                        const { default: templateApi } = await import('../api/templates');
                        await templateApi.updateWebsiteTemplate(
                            state.templateEditor.id,
                            builderWebsiteToTemplatePayload(website, state.templateEditor)
                        );
                        set((current) => ({ editor: { ...current.editor, saveStatus: 'saved' } }));
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
                    set((current) => ({ editor: { ...current.editor, saveStatus: 'saved' } }));
                } catch (error) {
                    console.error("Auto-save failed:", error);
                    set((current) => ({ editor: { ...current.editor, saveStatus: 'error' } }));
                }
                }, SAVE_DEBOUNCE_MS);
            },

            selectWebsite: async (id) => {
                let website = get().websites.find(w => w.id === id);
                if (!website) {
                    if (!USE_WEBSITE_API) {
                        website = createLocalWebsite(id);
                        set((state) => ({ websites: [...state.websites, website!] }));
                    } else {
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
                                subdomain: w.content?.builderMeta?.subdomain || undefined,
                                customDomain: w.content?.builderMeta?.customDomain || undefined,
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
                }
                if (website) {
                    const nextPageId = website.activePageId || website.pages[0]?.id;
                    if (get().activeWebsiteId === id && get().activePageId === nextPageId) {
                        return;
                    }
                    set({
                        activeWebsiteId: id,
                        activePageId: nextPageId,
                        history: [website.pages],
                        historyIndex: 0
                    });
                } else {
                    set({ templateEditor: null });
                }
            },

            deleteWebsite: async (id: string) => {
                if (USE_WEBSITE_API) {
                    try {
                        const { default: websiteApi } = await import('../api/website');
                        await websiteApi.deleteWebsite(id);
                    } catch (error) {
                        console.error("Failed to delete website from backend:", error);
                        return;
                    }
                }

                set((state) => {
                    const website = state.websites.find(w => w.id === id);
                    if (website && website.status !== 'DELETED') {
                        return {
                            websites: state.websites.map(w => w.id === id ? { ...w, status: 'DELETED' } : w),
                            activeWebsiteId: state.activeWebsiteId === id ? null : state.activeWebsiteId
                        };
                    }
                    return {
                        websites: state.websites.filter(w => w.id !== id),
                        activeWebsiteId: state.activeWebsiteId === id ? null : state.activeWebsiteId
                    };
                });
            },

            restoreWebsite: async (id: string) => {
                if (USE_WEBSITE_API) {
                    try {
                        const { default: websiteApi } = await import('../api/website');
                        await websiteApi.restoreWebsite(id);
                    } catch (error) {
                        console.error("Failed to restore website from backend:", error);
                        throw error;
                    }
                }

                set((state) => ({
                    websites: state.websites.map(w => w.id === id ? { ...w, status: 'Draft' } : w),
                }));
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

            renamePage: (pageId, name) => {
                const website = get().getActiveWebsite();
                if (!website || !name.trim()) return;
                const slug = `/${name.trim().toLowerCase().replace(/\s+/g, '-')}`;
                const newPages = website.pages.map((page) => {
                    if (page.id !== pageId) return page;
                    return {
                        ...page,
                        name: name.trim(),
                        slug: page.slug === '/' ? '/' : slug,
                        meta: { ...page.meta, title: name.trim() },
                    };
                });
                get().updateWebsitePages(newPages);
                get().saveActiveWebsite();
            },

            setHomePage: (pageId) => {
                const website = get().getActiveWebsite();
                if (!website) return;
                const nextHome = website.pages.find((page) => page.id === pageId);
                if (!nextHome) return;
                const previousHome = website.pages.find((page) => page.slug === '/');
                const newPages = website.pages.map((page) => {
                    if (page.id === pageId) return { ...page, slug: '/' };
                    if (previousHome && page.id === previousHome.id) {
                        const fallback = `/${page.name.toLowerCase().replace(/\s+/g, '-') || 'home'}`;
                        return { ...page, slug: fallback === '/' ? '/home' : fallback };
                    }
                    return page;
                });
                get().updateWebsitePages(newPages);
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

                const stamped = newPages.map((page) => ({
                    ...page,
                    schemaVersion: page.schemaVersion || SCHEMA_VERSION,
                }));

                let newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(stamped);
                if (newHistory.length > MAX_HISTORY) {
                    newHistory = newHistory.slice(newHistory.length - MAX_HISTORY);
                }

                set((state) => ({
                    websites: state.websites.map(w =>
                        w.id === activeWebsiteId ? { ...w, pages: stamped, lastEdited: new Date().toISOString() } : w
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
                const seen = new Set<string>();
                const ordered = ids
                    .map((id) => sectionMap.get(id))
                    .filter((section): section is NonNullable<typeof section> => {
                        if (!section || seen.has(section.id)) return false;
                        seen.add(section.id);
                        return true;
                    });
                const rest = page.sections.filter((section) => !seen.has(section.id));
                const newSections = [...ordered, ...rest].map((section, index) => ({
                    ...section,
                    order: index,
                }));

                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
            },

            addComponent: (sectionId, component) => {
                const page = get().getActivePage();
                if (!page) return null;
                const id = component.id || uuidv4();

                const newSections = page.sections.map(s => {
                    if (s.id === sectionId) {
                        return {
                            ...s,
                            components: [...(s.components || []), {
                                ...component,
                                id,
                                position: component.position || { x: 0, y: 0 },
                                style: component.style || {}
                            }]
                        };
                    }
                    return s;
                });

                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
                return id;
            },

            updateComponent: (sectionId, componentId, updates, options) => {
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
                if (options?.persist !== false) get().saveActiveWebsite();
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

            moveComponent: (fromSectionId, toSectionId, componentId, position) => {
                const page = get().getActivePage();
                if (!page) return;
                if (fromSectionId === toSectionId) {
                    if (position) get().updateComponent(fromSectionId, componentId, { position });
                    return;
                }

                let moved: Record<string, unknown> | null = null;
                const stripped = page.sections.map((section) => {
                    if (section.id !== fromSectionId) return section;
                    const components = section.components || [];
                    moved = components.find((component) => component.id === componentId) || null;
                    return { ...section, components: components.filter((component) => component.id !== componentId) };
                });
                if (!moved) return;

                const newSections = stripped.map((section) => {
                    if (section.id !== toSectionId) return section;
                    return {
                        ...section,
                        components: [
                            ...(section.components || []),
                            { ...moved, position: position || moved.position },
                        ],
                    };
                });

                get().updateCurrentPage({ sections: newSections });
                get().saveActiveWebsite();
                get().selectSection(toSectionId);
                get().selectComponent(componentId);
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
                    const asset = attachCurrentOwner(normalizeAsset(response.data.asset, scope));

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
                        return asset;
                    }

                    set((state) => ({ globalAssets: [asset, ...state.globalAssets.filter((item) => item.id !== asset.id)] }));
                    return asset;
                } catch (error) {
                    console.error('Failed to upload asset:', error);
                    throw error;
                }
            },

            importAssetFromUrl: async (name, url, scope = {}) => {
                try {
                    const { default: assetApi } = await import('../api/assets');
                    const response = await assetApi.importAssetFromUrl({ name, url }, scope);
                    const asset = attachCurrentOwner(normalizeAsset(response.data.asset, scope));

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
                        return asset;
                    }

                    set((state) => ({ globalAssets: [asset, ...state.globalAssets.filter((item) => item.id !== asset.id)] }));
                    return asset;
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
                if (websiteId) {
                    const websiteAssets = websiteAssetsByWebsiteId[websiteId] || [];
                    // Merge global assets in, deduplicating by id (website-scoped take priority)
                    const websiteIds = new Set(websiteAssets.map((a) => a.id));
                    const merged = [...websiteAssets, ...globalAssets.filter((a) => !websiteIds.has(a.id))];
                    return merged;
                }
                return globalAssets;
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
                editor: {
                    ...state.editor,
                    selectedSectionId: id,
                    selectedComponentId: null,
                    selectedNodeId: id,
                    selectedNodeIds: id ? [id] : [],
                    selectedKind: id ? 'section' : null,
                    showComponentBar: false,
                    showRightPanel: id ? true : state.editor.showRightPanel,
                }
            })),

            selectComponent: (id) => set((state) => ({
                editor: {
                    ...state.editor,
                    selectedComponentId: id,
                    selectedNodeId: id,
                    selectedNodeIds: id ? [id] : [],
                    selectedKind: id ? 'element' : state.editor.selectedKind,
                    showComponentBar: id ? state.editor.showComponentBar : false,
                    showRightPanel: !!id || state.editor.showRightPanel,
                }
            })),

            selectNode: (id, kind = null, mode = 'replace') => set((state) => {
                const page = get().getActivePage();
                const sections = page ? normalizeActiveSections(page) : [];
                const location = findNode(sections, id);
                const resolvedKind = kind || location?.kind || resolveNodeKind(sections, id || '', null);
                const currentIds = selectedIdsOf(state.editor);
                const canJoin = selectionCanJoin(state.editor.selectedKind, resolvedKind, currentIds.length);
                const ids = nextSelectedIds(currentIds, id, mode, canJoin);
                const primaryId = id && ids.includes(id) ? id : ids[ids.length - 1] || null;
                const primaryLocation = primaryId ? findNode(sections, primaryId) : null;
                const primaryKind = primaryId
                  ? (primaryId === id ? resolvedKind : primaryLocation?.kind || resolveNodeKind(sections, primaryId, null))
                  : null;
                return {
                    editor: {
                        ...state.editor,
                        selectedNodeId: primaryId,
                        selectedNodeIds: ids,
                        selectedKind: primaryId ? primaryKind : null,
                        selectedSectionId: primaryKind === 'section'
                            ? primaryId
                            : primaryLocation?.section?.id || (primaryKind === 'navbar' || primaryKind === 'footer' ? null : state.editor.selectedSectionId),
                        selectedComponentId: primaryLocation?.isFloating ? primaryId : null,
                        showRightPanel: true,
                    }
                };
            }),

            selectNodes: (ids) => set((state) => {
                const unique = [...new Set(ids.filter(Boolean))];
                const page = get().getActivePage();
                const sections = page ? normalizeActiveSections(page) : [];
                const primaryId = unique[unique.length - 1] || null;
                const location = primaryId ? findNode(sections, primaryId) : null;
                const primaryKind = primaryId ? location?.kind || resolveNodeKind(sections, primaryId, null) : null;
                return {
                    editor: {
                        ...state.editor,
                        selectedNodeId: primaryId,
                        selectedNodeIds: unique,
                        selectedKind: primaryKind,
                        selectedSectionId: primaryKind === 'section'
                            ? primaryId
                            : location?.section?.id || (primaryKind === 'navbar' || primaryKind === 'footer' ? null : state.editor.selectedSectionId),
                        selectedComponentId: location?.isFloating ? primaryId : null,
                        showRightPanel: true,
                    }
                };
            }),

            setDevice: (device) => set((state) => ({
                editor: { ...state.editor, device }
            })),

            setZoom: (zoom) => set((state) => ({
                editor: { ...state.editor, zoom: Math.max(25, Math.min(200, zoom)) }
            })),

            setSaveStatus: (status) => set((state) => ({
                editor: { ...state.editor, saveStatus: status }
            })),

            setDropTarget: (target) => set((state) => ({
                editor: { ...state.editor, dropTarget: target }
            })),

            addCanvasElement: (type, catalogId) => {
                const page = get().getActivePage();
                if (!page) return null;
                const result = addElementToPage(page, get().editor.selectedNodeId, type, catalogId);
                get().updateCurrentPage({ sections: result.sections });
                get().saveActiveWebsite();
                get().selectNode(result.selectId, result.selectKind);
                return result.selectId;
            },

            addCanvasContainer: () => {
                const page = get().getActivePage();
                if (!page) return null;
                const result = addContainerToPage(page, get().editor.selectedNodeId);
                get().updateCurrentPage({ sections: result.sections });
                get().saveActiveWebsite();
                get().selectNode(result.selectId, result.selectKind);
                return result.selectId;
            },

            addCanvasSection: (section) => {
                const page = get().getActivePage();
                if (!page) return null;
                const result = addSectionToPage(page, get().editor.selectedNodeId, section);
                get().updateCurrentPage({ sections: result.sections });
                get().saveActiveWebsite();
                get().selectNode(result.selectId, result.selectKind);
                return result.selectId;
            },

            updateCanvasNode: (id, patch) => {
                const page = get().getActivePage();
                if (!page) return;
                const found = findNode(normalizeActiveSections(page), id);
                if (found?.node.locked && !('locked' in patch) && !('visible' in patch) && !('visibility' in patch)) return;
                get().updateCurrentPage({ sections: applyNodePatch(page, id, patch) });
                get().saveActiveWebsite();
            },

            updateCanvasStyles: (id, patch) => {
                const page = get().getActivePage();
                if (!page) return;
                const found = findNode(normalizeActiveSections(page), id);
                if (found?.node.locked) return;
                get().updateCurrentPage({ sections: applyStylePatch(page, id, get().editor.device, patch) });
                get().saveActiveWebsite();
            },

            resizeCanvasNode: (id, patch) => {
                const page = get().getActivePage();
                if (!page) return;
                const found = findNode(normalizeActiveSections(page), id);
                if (found?.node.locked) return;
                get().updateCurrentPage({ sections: applyResize(page, id, get().editor.device, patch) });
                get().saveActiveWebsite();
            },

            updateFreePosition: (id, position) => {
                const page = get().getActivePage();
                if (!page) return;
                if (id === 'navbar' && page.navbar) {
                    const flowHeight = readNavbarFlowHeight(page.navbar.styles);
                    get().updateCurrentPage({
                        navbar: {
                            ...page.navbar,
                            styles: {
                                ...(page.navbar.styles || {}),
                                position: 'absolute',
                                left: `${Math.round(position.x)}px`,
                                top: `${Math.round(position.y)}px`,
                                ...(position.width != null ? { width: `${Math.round(position.width)}px` } : {}),
                                sticky: false,
                                ...(flowHeight ? { flowHeight } : {}),
                            },
                        },
                    });
                    get().saveActiveWebsite();
                    return;
                }
                const found = findNode(normalizeActiveSections(page), id);
                if (found?.node.locked) return;
                get().updateCurrentPage({ sections: applyFreePosition(page, id, get().editor.device, position) });
                get().saveActiveWebsite();
            },

            updateFreePositions: (items) => {
                const page = get().getActivePage();
                if (!page || !items.length) return;
                const navbarItem = items.find((item) => item.id === 'navbar');
                const others = items.filter((item) => item.id !== 'navbar');
                const patch: { navbar?: typeof page.navbar; sections?: ReturnType<typeof applyManyFreePositions> } = {};
                if (navbarItem && page.navbar) {
                    const flowHeight = readNavbarFlowHeight(page.navbar.styles);
                    patch.navbar = {
                        ...page.navbar,
                        styles: {
                            ...(page.navbar.styles || {}),
                            position: 'absolute',
                            left: `${Math.round(navbarItem.position.x)}px`,
                            top: `${Math.round(navbarItem.position.y)}px`,
                            ...(navbarItem.position.width != null ? { width: `${Math.round(navbarItem.position.width)}px` } : {}),
                            sticky: false,
                            ...(flowHeight ? { flowHeight } : {}),
                        },
                    };
                }
                if (others.length) {
                    patch.sections = applyManyFreePositions(page, get().editor.device, others);
                }
                if (!patch.navbar && !patch.sections) return;
                get().updateCurrentPage(patch);
                get().saveActiveWebsite();
            },

            deleteCanvasNode: (id) => {
                if (id === 'footer') {
                    const website = get().getActiveWebsite();
                    if (!website) return;
                    get().updateWebsitePages(website.pages.map((page) => ({ ...page, footer: null })));
                    get().saveActiveWebsite();
                    get().selectNode(null);
                    return;
                }
                const page = get().getActivePage();
                if (!page) return;
                if (id === 'navbar' && page.navbar) {
                    get().updateCurrentPage({ navbar: null });
                    get().saveActiveWebsite();
                    get().selectNode(null);
                    return;
                }
                if (id === 'navbar-logo' && page.navbar) {
                    get().updateNavbar({ logo: { text: '', imageUrl: '' } });
                    get().selectNode('navbar', 'navbar');
                    return;
                }
                if (id.startsWith('navbar-link-') && page.navbar) {
                    const linkId = id.slice('navbar-link-'.length);
                    get().updateNavbar({
                        links: (page.navbar.links || []).filter((link: { id: string }) => link.id !== linkId),
                    });
                    get().selectNode('navbar', 'navbar');
                    return;
                }
                const found = findNode(normalizeActiveSections(page), id);
                if (found?.node.locked) return;
                const remaining = selectedIdsOf(get().editor).filter((item) => item !== id);
                const next = applyDelete(page, id);
                if (!next) return;
                get().updateCurrentPage({ sections: next });
                get().saveActiveWebsite();
                if (remaining.length) {
                    get().selectNodes(remaining);
                    return;
                }
                const nextSelection = getSelectionAfterDelete(normalizeActiveSections(page), id);
                if (nextSelection) {
                    get().selectNode(nextSelection.id, nextSelection.kind);
                } else {
                    get().selectNode(null);
                }
            },

            deleteCanvasNodes: (ids) => {
                const unique = [...new Set(ids.filter(Boolean))];
                if (!unique.length) return;
                if (unique.length === 1) {
                    get().deleteCanvasNode(unique[0]);
                    return;
                }
                const page = get().getActivePage();
                if (!page) return;
                get().updateCurrentPage({ sections: applyDeleteMany(page, unique) });
                get().saveActiveWebsite();
                get().selectNode(null);
            },

            duplicateCanvasNode: (id) => {
                const ids = get().duplicateCanvasNodes([id]);
                return ids[0] || null;
            },

            duplicateCanvasNodes: (ids) => {
                const page = get().getActivePage();
                if (!page) return [];
                const unique = [...new Set(ids.filter(Boolean))];
                if (!unique.length) return [];
                if (unique.length === 1) {
                    const found = findNode(normalizeActiveSections(page), unique[0]);
                    if (found?.node.locked) return [];
                    const result = applyDuplicate(page, unique[0], get().editor.device);
                    if (!result) return [];
                    get().updateCurrentPage({ sections: result.sections });
                    get().saveActiveWebsite();
                    get().selectNode(result.newId);
                    return [result.newId];
                }
                const result = applyDuplicateMany(page, unique, get().editor.device);
                if (!result.newIds.length) return [];
                get().updateCurrentPage({ sections: result.sections });
                get().saveActiveWebsite();
                get().selectNodes(result.newIds);
                return result.newIds;
            },

            moveCanvasNode: (id, target) => {
                const page = get().getActivePage();
                if (!page) return;
                const next = applyMove(page, id, target);
                if (!next) return;
                get().updateCurrentPage({ sections: next });
                get().saveActiveWebsite();
            },

            addPaletteItem: (item, target, prebuilt, at) => {
                const page = get().getActivePage();
                if (!page) return null;
                const result = prebuilt
                    ? addPrebuiltAtDropTarget(page, prebuilt, target)
                    : addItemAtDropTarget(page, item, target, at);
                get().updateCurrentPage({ sections: result.sections });
                get().saveActiveWebsite();
                get().selectNode(result.selectId, result.selectKind);
                return result.selectId;
            },

            copyCanvasNode: (id) => {
                const page = get().getActivePage();
                if (!page) return;
                const selected = selectedIdsOf(get().editor);
                const ids = id && !selected.includes(id) ? [id] : (selected.length ? selected : id ? [id] : []);
                const clipboard = copyNodesToClipboard(page, ids);
                if (clipboard) set({ clipboard });
            },

            pasteCanvasNode: () => {
                const page = get().getActivePage();
                const clipboard = get().clipboard;
                if (!page || !clipboard) return null;
                const result = pasteClipboard(page, clipboard, get().editor.selectedNodeId, get().editor.device);
                if (!result) return null;
                get().updateCurrentPage({ sections: result.sections });
                get().saveActiveWebsite();
                if (result.selectIds?.length) get().selectNodes(result.selectIds);
                else get().selectNode(result.selectId, result.selectKind);
                return result.selectId;
            },

            shiftCanvasLayer: (id, action) => {
                const page = get().getActivePage();
                if (!page || !id) return;
                const next = applyLayerShift(page, id, action, get().editor.device);
                if (!next) return;
                get().updateCurrentPage({ sections: next });
                get().saveActiveWebsite();
            },

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
            storage: createJSONStorage(() => userScopedBuilderStorage),
            partialize: (state) => ({
                websites: state.websites,
                activeWebsiteId: state.activeWebsiteId,
                activePageId: state.activePageId,
                globalAssets: state.globalAssets,
                websiteAssetsByWebsiteId: state.websiteAssetsByWebsiteId,
            }),
        }
    )
);

let boundWorkspaceUserId: string | null | undefined = getStoredUserId();

function resetWorkspaceInMemory() {
    pauseBuilderPersist();
    try {
        useBuilderStore.getState().resetWorkspace();
    } finally {
        resumeBuilderPersist();
    }
}

export function resetBuilderWorkspace() {
    resetWorkspaceInMemory();
    boundWorkspaceUserId = getStoredUserId();
}

export async function bindBuilderWorkspace(userId: string | null) {
    if (boundWorkspaceUserId === userId) return;
    resetWorkspaceInMemory();
    boundWorkspaceUserId = userId;
    if (!userId) return;
    await useBuilderStore.persist.rehydrate();
}

export default useBuilderStore;
