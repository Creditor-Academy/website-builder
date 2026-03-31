import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // backend
  withCredentials: true
});

export const getUsers = (params) => API.get("/users", { params });
export const updateUserRole = (id, role) => API.patch(`/users/${id}/role`, { role });
export const updateUserStatus = (id, active) => API.patch(`/users/${id}/status`, { active });
export const restoreUser = (id) => API.post(`/users/${id}/restore`);
export const createUser = (data) => API.post("/users", data);
