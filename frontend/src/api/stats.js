import apiClient from './client';

const statsApi = {
  getDashboardStats: () => apiClient.get('/stats/dashboard')
};

export default statsApi;
