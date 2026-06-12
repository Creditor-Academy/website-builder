import client from './client.js';

export const getAuditLogs = async (params = {}) => {
  const { data } = await client.get('/audit', { params });
  return data;
};
