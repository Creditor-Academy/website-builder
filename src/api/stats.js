import apiClient from './client';

const statsApi = {
  getDashboardStats: (params) => apiClient.get('/stats/dashboard', { params })
};

export default statsApi;
