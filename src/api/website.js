import apiClient from './client';

const websiteApi = {
  getWebsites: (params) => apiClient.get('/websites', { params }),
  getWebsiteById: (id) => apiClient.get(`/websites/${id}`),
  createWebsite: (data) => apiClient.post('/websites', data),
  updateWebsite: (id, data) => apiClient.patch(`/websites/${id}`, data),
  getWebsitesAll: (params) => apiClient.get('/websites/all', { params }),
  deleteWebsite: (id) => apiClient.delete(`/websites/${id}`),
  restoreWebsite: (id) => apiClient.post(`/websites/${id}/restore`),
  duplicateWebsite: (id) => apiClient.post(`/websites/${id}/duplicate`),
  updateWebsiteSettings: (id, data) => apiClient.patch(`/websites/${id}/settings`, data),
  getVersions: (id) => apiClient.get(`/websites/${id}/versions`),
  publishWebsite: (id, data) => apiClient.post(`/websites/${id}/publish`, data),
  getDomains: (id) => apiClient.get(`/websites/${id}/domains`),
  addDomain: (id, domain) => apiClient.post(`/websites/${id}/domains`, { domain }),
  removeDomain: (id, domain) => apiClient.delete(`/websites/${id}/domains`, { data: { domain } }),
  verifyDomain: (id, domain) => apiClient.post(`/websites/${id}/domains/verify`, { domain }),
  getDeployments: (id) => apiClient.get(`/websites/${id}/deployments`),
  rollbackDeployment: (id, deploymentId) => apiClient.post(`/websites/${id}/deployments/rollback`, { deploymentId }),
  exportWebsite: (id) => apiClient.get(`/websites/${id}/export`, { responseType: 'blob' }),
};

export default websiteApi;
