import apiClient from './client';

const formsApi = {
  submitForm: (data) => apiClient.post('/forms/submit', data),
  getUserSubmissions: (params) => apiClient.get(`/forms/submissions`, { params }),
  getStats: (params) => apiClient.get(`/forms/stats`, { params }),
  markAsRead: (formId) => apiClient.patch(`/forms/${formId}/read`),
  deleteSubmission: (formId) => apiClient.delete(`/forms/${formId}`),
};

export default formsApi;
