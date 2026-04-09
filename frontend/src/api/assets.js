import apiClient from './client';

const assetApi = {
  listAssets: () => apiClient.get('/assets'),
  uploadAsset: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  importAssetFromUrl: (data) => apiClient.post('/assets/import-url', data),
  deleteAsset: (id) => apiClient.delete(`/assets/${id}`),
};

export default assetApi;