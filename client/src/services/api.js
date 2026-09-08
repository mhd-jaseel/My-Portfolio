import axios from 'axios';

// Normalize API base URL:
// In local development, defaults to '/api' (proxied by Vite to localhost:5000).
// In production (Vercel), uses VITE_API_URL ensuring proper '/api' prefix without duplication.
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/+$/, '');
  // If user provided https://my-backend.com without /api, append /api
  if (!clean.endsWith('/api')) {
    return `${clean}/api`;
  }
  return clean;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Authorization Bearer token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized and has stored token, clear local state
    if (error.response?.status === 401 && localStorage.getItem('admin_token')) {
      // Only clear if on admin route/endpoint
      if (error.config?.url?.includes('/admin')) {
        localStorage.removeItem('admin_token');
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
