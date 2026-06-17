import apiClient from './client';

const templateApi = {
  // ─── Website Templates ────────────────────────────────────────────────────

  /** GET /templates/websites — public, grouped by category */
  getWebsiteTemplates: (config) => apiClient.get('/templates/websites', config),

  /** GET /templates/websites/:id — admin only, full data */
  getWebsiteTemplateById: (id) => apiClient.get(`/templates/websites/${id}`),

  /** POST /templates/websites — admin only */
  createWebsiteTemplate: (data) => apiClient.post('/templates/websites', data),

  /** PATCH /templates/websites/:id — admin only */
  updateWebsiteTemplate: (id, data) => apiClient.patch(`/templates/websites/${id}`, data),

  /** DELETE /templates/websites/:id — soft delete, admin only */
  deleteWebsiteTemplate: (id) => apiClient.delete(`/templates/websites/${id}`),

  /** POST /templates/websites/:id/restore — admin only */
  restoreWebsiteTemplate: (id) => apiClient.post(`/templates/websites/${id}/restore`),
};

export default templateApi;