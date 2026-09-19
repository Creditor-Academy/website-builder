import apiClient from './client';

function mapSubmission(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const isRead = raw.is_read ?? raw.isRead ?? (raw.status === 'read' || raw.status === 'replied');
  const status = raw.status || (isRead ? 'read' : 'unread');
  return {
    ...raw,
    status,
    is_read: Boolean(isRead),
    createdAt: raw.createdAt || raw.created_at,
    website: raw.website || (raw.website_id ? { id: raw.website_id, name: raw.website_name } : undefined),
  };
}

const formsApi = {
  submitForm: (data) => apiClient.post('/forms/submit', data),
  getUserSubmissions: (params) => apiClient.get(`/forms/submissions`, { params }).then((res) => {
    const payload = res.data;
    const rows = payload?.data || payload?.submissions || payload;
    if (Array.isArray(rows)) {
      return { ...res, data: { ...payload, data: rows.map(mapSubmission) } };
    }
    return res;
  }),
  getStats: (params) => apiClient.get(`/forms/stats`, { params }),
  markAsRead: (formId) => apiClient.patch(`/forms/${formId}/read`),
  deleteSubmission: (formId) => apiClient.delete(`/forms/${formId}`),
};

export default formsApi;
