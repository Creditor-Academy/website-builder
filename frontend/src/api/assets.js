import apiClient from './client';

const toParams = (scope = {}) => (
  scope.websiteId ? { website_id: scope.websiteId } : undefined
);

const assetApi = {
  listAssets: (scope = {}) => apiClient.get('/assets', { params: toParams(scope) }),
  uploadAsset: (file, scope = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    if (scope.websiteId) {
      formData.append('website_id', scope.websiteId);
    }

    return apiClient.post('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  importAssetFromUrl: (data, scope = {}) => apiClient.post('/assets/import-url', {
    ...data,
    ...(scope.websiteId ? { website_id: scope.websiteId } : {}),
  }),
  deleteAsset: (id, scope = {}) => apiClient.delete(`/assets/${id}`, { params: toParams(scope) }),
};

export default assetApi;