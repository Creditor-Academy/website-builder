import apiClient from './client';

const toParams = (scope = {}) => {
  if (scope.websiteId) return { website_id: scope.websiteId };
  if (scope.scope === 'GLOBAL') return { scope: 'GLOBAL' };
  return undefined;
};

const toUploadScope = (scope = {}) => {
  const payload = {};
  if (scope.websiteId) payload.website_id = scope.websiteId;
  else if (scope.scope === 'GLOBAL') payload.scope = 'GLOBAL';
  return payload;
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
  deleteAsset: (id, scope = {}) => apiClient.delete(`/assets/${id}`, { params: toParams(scope) }),
  setVisibleAssets: (assetIds) => apiClient.put('/assets/visibility', { asset_ids: assetIds }),
};

export default assetApi;