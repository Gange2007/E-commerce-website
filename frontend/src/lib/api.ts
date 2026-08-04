import api from './axios';
import type { Product, ProductInput, Order, ShippingAddress, AdminStats } from '@/types';

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Users ─────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Partial<{ name: string; phone: string; address: object }>) =>
    api.put('/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', data),
};

// ── Products ──────────────────────────────────────────
export const productAPI = {
  getAll: (params?: Record<string, string | number>) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getFilters: (category?: string) =>
    api.get('/products/filters', { params: category ? { category } : {} }),
create: (data: Partial<ProductInput>) => api.post('/products', data),
  update: (id: string, data: Partial<ProductInput>) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  addReview: (id: string, data: { rating: number; comment: string }) =>
    api.post(`/products/${id}/reviews`, data),
};

// ── Categories ────────────────────────────────────────
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; description?: string; image?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: object) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ── Orders ────────────────────────────────────────────
export const orderAPI = {
  create: (data: {
    orderItems: { product: string; name: string; image: string; price: number; quantity: number }[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  }) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getAll: (params?: Record<string, string | number>) =>
    api.get('/orders', { params }),
  updateStatus: (id: string, orderStatus: string) =>
    api.put(`/orders/${id}/status`, { orderStatus }),
};

// ── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: Record<string, string | number>) =>
    api.get('/admin/users', { params }),
  updateUser: (id: string, data: { role?: string; isActive?: boolean }) =>
    api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};
