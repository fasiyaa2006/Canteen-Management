import axios from 'axios';

// Normalize API URL to handle with/without trailing slashes and /api suffix
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  url = url.trim().replace(/\/+$/, ''); // remove trailing slash
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout to allow Render free tier wakeups
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getAllUsers: () => api.get('/users'),
};

export const menuApi = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  create: (item) => api.post('/menu', item),
  update: (id, item) => api.put(`/menu/${id}`, item),
  toggleAvailability: (id) => api.patch(`/menu/${id}/toggle-availability`),
  delete: (id) => api.delete(`/menu/${id}`),
};

export const orderApi = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
};

export default api;
