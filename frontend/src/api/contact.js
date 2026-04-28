import apiClient from "./client";

const API = apiClient;

const contactApi = {
  // ─── Public Contact Submission ───────────────────────────────────────────────────

  /** POST /contact/submit — public endpoint for submitting contact forms */
  submitContactForm: (data) => API.post("/contact/submit", data),

  // ─── Authenticated Contact Management ─────────────────────────────────────────────

  /** GET /contact/submissions — get all contact submissions for logged-in user */
  getContactSubmissions: (params) => API.get("/contact/submissions", { params }),

  /** GET /contact/submissions/:id — get a single contact submission */
  getContactSubmissionById: (id) => API.get(`/contact/submissions/${id}`),

  /** PATCH /contact/submissions/:id — update contact submission status */
  updateContactSubmission: (id, data) => API.patch(`/contact/submissions/${id}`, data),

  /** DELETE /contact/submissions/:id — delete a contact submission */
  deleteContactSubmission: (id) => API.delete(`/contact/submissions/${id}`),

  /** GET /contact/stats — get contact submission stats for the user */
  getContactStats: (params) => API.get("/contact/stats", { params }),
};

export default contactApi;
