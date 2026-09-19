import apiClient from './client';
import { USE_WEBSITE_API } from '@/lib/localMode';

const ok = (data) => Promise.resolve({ data });

const websiteApi = {
  getWebsites: (params) =>
    USE_WEBSITE_API ? apiClient.get('/websites', { params }) : ok({ websites: [] }),
  getWebsiteById: (id) =>
    USE_WEBSITE_API ? apiClient.get(`/websites/${id}`) : ok({ website: null }),
  createWebsite: (data) =>
    USE_WEBSITE_API ? apiClient.post('/websites', data) : ok({ website: data }),
  updateWebsite: (id, data) =>
    USE_WEBSITE_API ? apiClient.patch(`/websites/${id}`, data) : ok({ website: { id, ...data } }),
  getWebsitesAll: (params) =>
    USE_WEBSITE_API ? apiClient.get('/websites/all', { params }) : ok({ websites: [] }),
  deleteWebsite: (id) =>
    USE_WEBSITE_API ? apiClient.delete(`/websites/${id}`) : ok({ ok: true }),
  restoreWebsite: (id) =>
    USE_WEBSITE_API ? apiClient.post(`/websites/${id}/restore`) : ok({ ok: true }),
  duplicateWebsite: (id) =>
    USE_WEBSITE_API ? apiClient.post(`/websites/${id}/duplicate`) : ok({ website: { id } }),
  updateWebsiteSettings: (id, data) =>
    USE_WEBSITE_API ? apiClient.patch(`/websites/${id}/settings`, data) : ok({ settings: data }),
  getVersions: (id) =>
    USE_WEBSITE_API ? apiClient.get(`/websites/${id}/versions`) : ok({ versions: [] }),
  publishWebsite: (id, data) =>
    USE_WEBSITE_API
      ? apiClient.post(`/websites/${id}/publish`, data)
      : ok({ website: { id, ...data } }),
  getDomains: (websiteId) =>
    USE_WEBSITE_API ? apiClient.get(`/domains/website/${websiteId}`) : ok({ domains: [] }),
  addDomain: (websiteId, domain) =>
    USE_WEBSITE_API
      ? apiClient.post(`/domains/website/${websiteId}/custom`, { domain })
      : ok({ domain }),
  addSubdomain: (websiteId, slug) =>
    USE_WEBSITE_API
      ? apiClient.post(`/domains/website/${websiteId}/subdomain`, { slug })
      : ok({ slug }),
  removeDomain: (domainId) =>
    USE_WEBSITE_API ? apiClient.delete(`/domains/${domainId}`) : ok({ ok: true }),
  verifyDomain: (domainId) =>
    USE_WEBSITE_API ? apiClient.post(`/domains/${domainId}/verify`) : ok({ ok: true }),
  getDeployments: (id) =>
    USE_WEBSITE_API ? apiClient.get(`/websites/${id}/deployments`) : ok({ deployments: [] }),
  rollbackDeployment: (id, deploymentId) =>
    USE_WEBSITE_API
      ? apiClient.post(`/websites/${id}/deployments/rollback`, { deploymentId })
      : ok({ ok: true }),
  exportWebsite: (id) =>
    USE_WEBSITE_API
      ? apiClient.get(`/websites/${id}/export`, { responseType: 'blob' })
      : ok(new Blob()),
};

export default websiteApi;
