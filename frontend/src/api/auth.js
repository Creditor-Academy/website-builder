import apiClient from './client';

export const loginUser = (data) => apiClient.post('/auth/login', data);
export const registerUser = (data) => apiClient.post('/auth/register', data);
export const logoutUser = () => apiClient.get('/auth/logout');
export const forgotPassword = (email) => apiClient.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => apiClient.post('/auth/reset-password', { token, password });
export const verifyEmail = (token) => apiClient.get('/auth/email-verification', { params: { token } });
export const googleLogin = (token) => apiClient.post('/auth/google', { token });
