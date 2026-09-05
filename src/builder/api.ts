import websiteApi from '@/api/website';
import type { SaveStatus } from './types';

export interface CanvasPagePayload {
  pages: unknown[];
  activePageId: string | null;
  templateId?: string;
  builderMeta?: Record<string, unknown>;
}

export interface CanvasSavePayload {
  name?: string;
  status?: string;
  content: CanvasPagePayload;
}

export const canvasApi = {
  loadWebsite: (id: string) => websiteApi.getWebsiteById(id),

  saveWebsite: (id: string, payload: CanvasSavePayload) => websiteApi.updateWebsite(id, payload),

  publishWebsite: (id: string, data: { subdomain?: string; customDomain?: string }) =>
    websiteApi.publishWebsite(id, data),

  listPages: (content: { pages?: unknown[] } | undefined) => content?.pages || [],
};

export function statusLabel(status: SaveStatus): string {
  switch (status) {
    case 'saving':
      return 'Saving';
    case 'saved':
      return 'Saved';
    case 'error':
      return 'Saving error';
    case 'publishing':
      return 'Publishing';
    case 'published':
      return 'Published';
    case 'publish-error':
      return 'Publishing error';
    default:
      return 'Draft';
  }
}
