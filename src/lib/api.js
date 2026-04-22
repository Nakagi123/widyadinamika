// src/lib/api.js
import axios from 'axios';

// ==================== CONFIGURATION ====================
// Vite uses import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ==================== AXIOS INSTANCE ====================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ==================== INTERCEPTORS ====================
// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan';
    return Promise.reject({ ...error, message });
  }
);

// ==================== AUTH SERVICES ====================
export const authService = {
  register: (username, password) => 
    api.post('/auth/register', { username, password }),
  
  registerKasir: (username, password) => 
    api.post('/auth/register-kasir', { username, password }),
  
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const userResponse = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      return { ...response, user: userResponse.data };
    }
    return response;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== PRODUCT SERVICES ====================
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// ==================== CART SERVICES ====================
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.patch(`/cart/${productId}`, { quantity }),
  removeCartItem: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// ==================== PAYMENT SERVICES ====================
export const paymentService = {
  checkout: (items, paymentMethod) => api.post('/payment/checkout', { items, paymentMethod }),
  getMyOrders: () => api.get('/payment/orders'),
  getKasirOrders: (status = null) => {
    const params = status ? { status } : {};
    return api.get('/payment/kasir/orders', { params });
  },
  confirmCashPayment: (orderId, status) => api.patch(`/payment/kasir/confirm/${orderId}`, { status }),
};

// ==================== HELPER UTILITIES ====================
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default api;