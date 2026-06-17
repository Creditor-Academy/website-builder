import apiClient from './client';

const institutionApi = {
  create: (data) => apiClient.post('/organizations', data),
  list: () => apiClient.get('/organizations'),
  getDetailedList: () => apiClient.get('/organizations/detailed'),
  getById: (id) => apiClient.get(`/organizations/${id}`),
  update: (id, data) => apiClient.put(`/organizations/${id}`, data),
  delete: (id) => apiClient.delete(`/organizations/${id}`)
};

export default institutionApi;
