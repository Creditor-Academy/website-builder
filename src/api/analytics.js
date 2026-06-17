import apiClient from './client';

const analyticsApi = {
  getWebsiteAnalytics: (websiteId, period = '30d') =>
    apiClient.get(`/analytics/websites/${websiteId}`, { params: { period } }),
};

export default analyticsApi;
