import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/templates",
  withCredentials: true,
});

const templateApi = {
  // ─── Website Templates ────────────────────────────────────────────────────

  /** GET /templates/websites — public, grouped by category */
  getWebsiteTemplates: (params) => API.get("/websites", { params }),

  /** GET /templates/websites/:id — admin only, full data */
  getWebsiteTemplateById: (id) => API.get(`/websites/${id}`),

  /** POST /templates/websites — admin only */
  createWebsiteTemplate: (data) => API.post("/websites", data),

  /** PATCH /templates/websites/:id — admin only */
  updateWebsiteTemplate: (id, data) => API.patch(`/websites/${id}`, data),

  /** DELETE /templates/websites/:id — soft delete, admin only */
  deleteWebsiteTemplate: (id) => API.delete(`/websites/${id}`),

  /** POST /templates/websites/:id/restore — admin only */
  restoreWebsiteTemplate: (id) => API.post(`/websites/${id}/restore`),

  // ─── Section Templates ────────────────────────────────────────────────────

  /** GET /templates/sections — public, grouped by category */
  getSectionTemplates: (params) => API.get("/sections", { params }),

  /** GET /templates/sections/:id */
  getSectionTemplateById: (id) => API.get(`/sections/${id}`),

  /** POST /templates/sections — admin only */
  createSectionTemplate: (data) => API.post("/sections", data),

  /** PATCH /templates/sections/:id — admin only */
  updateSectionTemplate: (id, data) => API.patch(`/sections/${id}`, data),

  /** DELETE /templates/sections/:id — soft delete, admin only */
  deleteSectionTemplate: (id) => API.delete(`/sections/${id}`),

  /** POST /templates/sections/:id/restore */
  restoreSectionTemplate: (id) => API.post(`/sections/${id}/restore`),
};

export default templateApi;