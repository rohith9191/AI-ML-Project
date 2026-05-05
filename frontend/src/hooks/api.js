import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const exerciseApi = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  getStats: () => api.get('/stats'),
  getRecommendations: (params) => api.get('/recommendations', { params }),
  saveSession: (data) => api.post('/sessions', data),
  getHistory: (userId) => api.get(`/sessions/history/${userId}`),
  getAchievements: (userId) => api.get(`/achievements/${userId}`),
};

export default api;
