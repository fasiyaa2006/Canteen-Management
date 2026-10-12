import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
