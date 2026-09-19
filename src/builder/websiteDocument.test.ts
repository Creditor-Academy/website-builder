import { describe, expect, it } from 'vitest';
import {
  isRevisionConflict,
  mapWebsiteFromApi,
  mapWebsiteStatus,
  toWebsiteSavePayload,
} from './websiteDocument';

describe('website document contract', () => {
  it('normalizes status casing from the API', () => {
    expect(mapWebsiteStatus('DRAFT')).toBe('Draft');
    expect(mapWebsiteStatus('Published')).toBe('Published');
    expect(mapWebsiteStatus('deleted')).toBe('DELETED');
    expect(mapWebsiteStatus('ARCHIVED')).toBe('DELETED');
  });

  it('sends revision and schemaVersion on save', () => {
    const payload = toWebsiteSavePayload({
      id: 'site-1',
      name: 'Campus',
      status: 'Draft',
      lastEdited: '2026-09-19',
      revision: 4,
      activePageId: 'home',
      templateId: 'blank',
      pages: [{ id: 'home', name: 'Home', sections: [] }],
    });
    expect(payload.revision).toBe(4);
    expect(payload.status).toBe('Draft');
    expect((payload.content as { schemaVersion: number }).schemaVersion).toBe(2);
  });

  it('maps revision from GET website payloads', () => {
    const website = mapWebsiteFromApi({
      id: 'site-1',
      name: 'Campus',
      status: 'PUBLISHED',
      revision: 7,
      content: { pages: [{ id: 'home', sections: [] }], activePageId: 'home' },
    });
    expect(website.revision).toBe(7);
    expect(website.status).toBe('Published');
  });

  it('detects 409 revision conflicts', () => {
    expect(isRevisionConflict({ response: { status: 409 } })).toBe(true);
    expect(isRevisionConflict({ response: { status: 400 } })).toBe(false);
  });
});
