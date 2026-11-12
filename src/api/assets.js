import apiClient from './client';

const toParams = (scope = {}) => {
  if (scope.websiteId) return { website_id: scope.websiteId, scope: 'WEBSITE' };
  if (scope.scope === 'GLOBAL') return { scope: 'GLOBAL' };
  if (scope.scope === 'USER') return { scope: 'USER' };
  return undefined;
};

const toUploadScope = (scope = {}) => {
  const payload = {};
  if (scope.websiteId) {
    payload.website_id = scope.websiteId;
    payload.scope = 'WEBSITE';
  } else if (scope.scope === 'GLOBAL') {
    payload.scope = 'GLOBAL';
  } else if (scope.scope === 'USER') {
    payload.scope = 'USER';
  }
  return payload;
};

const isWebsiteMissingError = (error) => {
  const message = String(error?.response?.data?.message || error?.response?.data?.error || error?.message || '').toLowerCase();
  const status = error?.response?.status;
  return status === 404 || message.includes('website not found') || message.includes('site not found');
};

const assetApi = {
  listAssets: (scope = {}) => apiClient.get('/assets', { params: toParams(scope) }),
  uploadAsset: (file, scope = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(toUploadScope(scope)).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return apiClient.post('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  importAssetFromUrl: (data, scope = {}) => apiClient.post('/assets/import-url', {
    ...data,
    ...toUploadScope(scope),
  }),
  searchStock: (params) => apiClient.get('/assets/stock/search', { params }),
  importStock: (data, scope = {}) => apiClient.post('/assets/stock/import', {
    ...data,
    ...toUploadScope(scope),
  }),
  deleteAsset: (id, scope = {}) => apiClient.delete(`/assets/${id}`, { params: toParams(scope) }),
  setVisibleAssets: (assetIds) => apiClient.put('/assets/visibility', { asset_ids: assetIds }),
};

export { isWebsiteMissingError };
export default assetApi;