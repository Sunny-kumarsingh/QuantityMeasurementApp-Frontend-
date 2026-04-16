import axios from 'axios';

const BASE_DOMAIN = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = `${BASE_DOMAIN}/api`;
const AUTH_BASE_URL = `${BASE_DOMAIN}/auth`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // sends cookie automatically
});

// ✅ Read token from cookie if localStorage doesn't have it
function getTokenFromCookie() {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='));

  return cookie ? cookie.substring('token='.length) : null;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => axios.post(`${AUTH_BASE_URL}/signup`, data, { withCredentials: true }),
  login: (creds) => axios.post(`${AUTH_BASE_URL}/login`, creds, { withCredentials: true }),
  logout: () => axios.post(`${AUTH_BASE_URL}/logout`, {}, { withCredentials: true }),
  getCurrentUser: () => axios.get(`${API_BASE_URL}/auth/me`, {
    withCredentials: true,
    
    headers: { Authorization: `Bearer ${getTokenFromCookie() || localStorage.getItem('token') || ''}` }
  }),
   getOAuthUrl: (provider = 'google') => 
    `${BASE_DOMAIN}/oauth2/authorization/${provider}`,
};

export const quantityAPI = {
  compare:  (data) => api.post('/quantities/compare', data),
  convert:  (data) => api.post('/quantities/convert', data),
  add:      (data) => api.post('/quantities/add', data),
  subtract: (data) => api.post('/quantities/subtract', data),
  multiply: (data) => api.post('/quantities/multiply', data),
  divide:   (data) => api.post('/quantities/divide', data),
  getUnits: ()     => api.get('/quantities/units'),
};

export const historyAPI = {
  getAll:         (limit = 50) => api.get(`/history?limit=${limit}`),
  getByOperation: (op)         => api.get(`/history/operation/${op}`),
  getByType:      (type)       => api.get(`/history/type/${type}`),
  getErrors:      ()           => api.get('/history/errors'),
  getCount:       (op)         => api.get(`/history/count/${op}`),
};

export default api;