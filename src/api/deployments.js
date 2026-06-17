import apiClient from './client';

const deploymentsApi = {
  getAll: (params) => apiClient.get('/deployments', { params }),
  getStats: () => apiClient.get('/deployments/stats'),
};

export default deploymentsApi;
