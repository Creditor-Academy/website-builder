import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true
});

// Auth token injection
API.interceptors.request.use((config) => {
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
export const getUsers = (params) => API.get("/users", { params });

/**
 * GET /users/:id — Get a single user by ID (Admin / Institution Admin only)
 * @param {string} id - User ID
 */
export const getUserById = (id) => API.get(`/users/${id}`);

/**
 * POST /users — Create a new user (Admin / Institution Admin only)
 * @param {Object} data - { name, email, password, role, ... }
 */
export const createUser = (data) => API.post("/users", data);

/**
 * PATCH /users/:id/role — Update a user's role (Admin only)
 * @param {string} id - User ID
 * @param {string} role - New role value
 */
export const updateUserRole = (id, role) => API.patch(`/users/${id}/role`, { role });

/**
 * PATCH /users/:id/status — Suspend or reactivate a user (Admin / Institution Admin only)
 * @param {string} id - User ID
 * @param {boolean} active - true = active, false = suspended
 */
export const updateUserStatus = (id, active) => API.patch(`/users/${id}/status`, { active });

/**
 * POST /users/:id/restore — Restore a deleted/deactivated user (Admin / Institution Admin only)
 * @param {string} id - User ID
 */
export const restoreUser = (id) => API.post(`/users/${id}/restore`);

// ─── Own Profile ─────────────────────────────────────────────────────────────

/**
 * PUT /users/me — Update own profile name
 * @param {string} name - New display name
 */
export const updateUserProfile = async (name) => {
  try {
    const res = await API.put("/users/me", { name });
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
    const res = await API.delete("/users/me");
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};