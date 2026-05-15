import apiClient from './client';

// Auth token injection
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || 'null');
  const token = user?.token || user?.accessToken || user?.jwt;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ─── User List & Admin Management ───────────────────────────────────────────

/**
 * GET /users — List all users (Admin / Institution Admin only)
 * @param {Object} params - Query params: page, limit, role, status, search, etc.
 */
export const getUsers = (params) => apiClient.get('/users', { params });

/**
 * GET /users/:id — Get a single user by ID (Admin / Institution Admin only)
 * @param {string} id - User ID
 */
export const getUserById = (id) => apiClient.get(`/users/${id}`);

/**
 * POST /users — Create a new user (Admin / Institution Admin only)
 * @param {Object} data - { name, email, password, role, ... }
 */
export const createUser = (data) => apiClient.post('/users', data);

/**
 * PATCH /users/:id/role — Update a user's role (Admin only)
 * @param {string} id - User ID
 * @param {string} role - New role value
 */
export const updateUserRole = (id, role) => apiClient.patch(`/users/${id}/role`, { role });

/**
 * PATCH /users/:id/status — Suspend or reactivate a user (Admin / Institution Admin only)
 * @param {string} id - User ID
 * @param {boolean} active - true = active, false = suspended
 */
export const updateUserStatus = (id, active) => apiClient.patch(`/users/${id}/status`, { active });

/**
 * POST /users/:id/restore — Restore a deleted/deactivated user (Admin / Institution Admin only)
 * @param {string} id - User ID
 */
export const restoreUser = (id) => apiClient.post(`/users/${id}/restore`);

// ─── Own Profile ─────────────────────────────────────────────────────────────

/**
 * GET /users/me — Get own profile
 */
export const getProfile = async () => {
  const res = await apiClient.get('/users/me');
  return res.data;
};

/**
 * PUT /users/me — Update own profile name
 * @param {string} name - New display name
 */
export const updateUserProfile = async (name) => {
  try {
    const res = await apiClient.put('/users/me', { name });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * POST /users/me/change-password — Change own password
 * @param {string} oldPassword
 * @param {string} newPassword
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await apiClient.post('/users/me/change-password', { oldPassword, newPassword });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * DELETE /users/me — Deactivate own account
 * Sends a DELETE request to the backend; caller is responsible for clearing
 * localStorage and redirecting after this resolves.
 */
export const deactivateOwnAccount = async () => {
  try {
    const res = await apiClient.delete('/users/me');
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};