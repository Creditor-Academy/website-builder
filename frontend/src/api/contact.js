import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1/contact",
  withCredentials: true,
});

const contactApi = {
  // ─── Public Contact Submission ───────────────────────────────────────────────────

  /** POST /contact/submit — public endpoint for submitting contact forms */
  submitContactForm: (data) => API.post("/submit", data),

  // ─── Authenticated Contact Management ─────────────────────────────────────────────

  /** GET /contact/submissions — get all contact submissions for logged-in user */
  getContactSubmissions: (params) => API.get("/submissions", { params }),

  /** GET /contact/submissions/:id — get a single contact submission */
  getContactSubmissionById: (id) => API.get(`/submissions/${id}`),

  /** PATCH /contact/submissions/:id — update contact submission status */
  updateContactSubmission: (id, data) => API.patch(`/submissions/${id}`, data),

  /** DELETE /contact/submissions/:id — delete a contact submission */
  deleteContactSubmission: (id) => API.delete(`/submissions/${id}`),

  /** GET /contact/stats — get contact submission stats for the user */
  getContactStats: (params) => API.get("/stats", { params }),
};

export default contactApi;
