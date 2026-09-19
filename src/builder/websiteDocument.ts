import websiteApi from '@/api/website';
import { normalizePageSections } from './adapter';
import { SCHEMA_VERSION } from './types';

export type WebsiteStatus = 'Draft' | 'Published' | 'DELETED';

export interface WebsiteRecord {
  id: string;
  name: string;
  lastEdited: string;
  status: WebsiteStatus;
  pages: any[];
  activePageId: string | null;
  templateId?: string;
  publishedUrl?: string;
  customDomain?: string;
  subdomain?: string;
  builderMeta?: Record<string, unknown>;
  sourceTemplateId?: string;
  institution?: unknown;
  institution_id?: string;
  owner_id?: string;
  settings?: unknown;
  revision?: number;
}

export function mapWebsiteStatus(status: unknown): WebsiteStatus {
  const value = String(status || 'Draft').toUpperCase();
  if (value === 'PUBLISHED') return 'Published';
  if (value === 'DELETED') return 'DELETED';
  return 'Draft';
}

export function isRevisionConflict(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('response' in error)) return false;
  return (error as { response?: { status?: number } }).response?.status === 409;
}

export function mapWebsitePages(rawPages: unknown): any[] {
  if (!Array.isArray(rawPages)) return [];
  return rawPages.map((page) => {
    const record = page && typeof page === 'object' ? (page as Record<string, unknown>) : {};
    const id = String(record.id || '');
    return {
      ...record,
      schemaVersion: typeof record.schemaVersion === 'number' ? record.schemaVersion : SCHEMA_VERSION,
      sections: normalizePageSections(record.sections as unknown[], id),
    };
  });
}

export function toWebsiteContent(website: Pick<WebsiteRecord, 'pages' | 'activePageId' | 'templateId' | 'builderMeta' | 'sourceTemplateId'>) {
  return {
    schemaVersion: SCHEMA_VERSION,
    pages: mapWebsitePages(website.pages),
    activePageId: website.activePageId,
    templateId: website.templateId,
    builderMeta: website.builderMeta,
    sourceTemplateId: website.sourceTemplateId,
  };
}

export function toWebsiteSavePayload(
  website: WebsiteRecord,
  options: { includeContent?: boolean } = {}
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: website.name,
    status: website.status,
  };
  if (typeof website.revision === 'number') {
    payload.revision = website.revision;
  }
  if (options.includeContent !== false) {
    payload.content = toWebsiteContent(website);
  }
  return payload;
}

export function mapWebsiteFromApi(raw: any, existing?: WebsiteRecord | null): WebsiteRecord {
  const content = raw?.content && typeof raw.content === 'object' ? raw.content : {};
  const backendPages = mapWebsitePages(content.pages);
  const pages = backendPages.length > 0 ? backendPages : existing?.pages || [];

  return {
    id: raw.id,
    name: raw.name,
    status: mapWebsiteStatus(raw.status),
    lastEdited: raw.updated_at || raw.created_at || existing?.lastEdited || new Date().toISOString(),
    pages,
    activePageId: content.activePageId || pages[0]?.id || existing?.activePageId || null,
    templateId: content.templateId || existing?.templateId || 'blank',
    publishedUrl: content.builderMeta?.publishedUrl || existing?.publishedUrl,
    subdomain: content.builderMeta?.subdomain || existing?.subdomain,
    customDomain: content.builderMeta?.customDomain || existing?.customDomain,
    builderMeta: content.builderMeta || existing?.builderMeta,
    sourceTemplateId: raw.source_template_id || content.sourceTemplateId || existing?.sourceTemplateId,
    institution: raw.institution ?? existing?.institution,
    institution_id: raw.institution_id ?? existing?.institution_id,
    owner_id: raw.owner_id ?? existing?.owner_id,
    settings: raw.settings ?? existing?.settings,
    revision: typeof raw.revision === 'number' ? raw.revision : existing?.revision ?? 1,
  };
}

export function revisionFromSaveResponse(response: any, fallback?: number): number | undefined {
  const website = response?.data?.website || response?.data;
  if (typeof website?.revision === 'number') return website.revision;
  if (typeof fallback === 'number') return fallback + 1;
  return undefined;
}

export async function patchWebsiteDocument(id: string, payload: Record<string, unknown>) {
  try {
    return await websiteApi.updateWebsite(id, payload);
  } catch (error) {
    if (!isRevisionConflict(error)) throw error;
    const latest = await websiteApi.getWebsiteById(id);
    const website = latest.data?.website || latest.data;
    return websiteApi.updateWebsite(id, {
      ...payload,
      revision: website?.revision,
    });
  }
}
