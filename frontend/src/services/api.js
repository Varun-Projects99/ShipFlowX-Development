import axios from 'axios';

const api = axios.create({
  baseURL: '', // Using Vite proxy in development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available
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

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, could trigger logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optional: redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
