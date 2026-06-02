import axios from 'axios';

// Base API URL. Production must not fall back to localhost in the browser.
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
export const API_ORIGIN = API_URL.startsWith('http') ? API_URL.replace(/\/api\/?$/, '') : '';

export const getAPIImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`;
  return url;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Admin Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error structures
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = error.response?.data?.message;

    if (!message) {
      message = error.response
        ? `Server error (${error.response.status}). Please try again.`
        : `Cannot connect to backend at ${API_URL}. Make sure the server is running.`;
    }

    console.error('API Error:', message, {
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    return Promise.reject(message);
  }
);

export default api;
