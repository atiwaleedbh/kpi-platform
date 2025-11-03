import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// KPI API
export const kpiAPI = {
  getAll: (params) => api.get('/kpis', { params }),
  getById: (id) => api.get(`/kpis/${id}`),
  create: (data) => api.post('/kpis', data),
  update: (id, data) => api.put(`/kpis/${id}`, data),
  delete: (id) => api.delete(`/kpis/${id}`),
  getStats: (id) => api.get(`/kpis/${id}/stats`)
};

// Metric API
export const metricAPI = {
  getAll: (params) => api.get('/metrics', { params }),
  getById: (id) => api.get(`/metrics/${id}`),
  create: (data) => api.post('/metrics', data),
  update: (id, data) => api.put(`/metrics/${id}`, data),
  delete: (id) => api.delete(`/metrics/${id}`),
  getByKPI: (kpiId, params) => api.get(`/metrics/kpi/${kpiId}`, { params }),
  bulkCreate: (metrics) => api.post('/metrics/bulk', { metrics })
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getTrends: (params) => api.get('/dashboard/trends', { params }),
  getPerformance: () => api.get('/dashboard/performance')
};

export default api;
