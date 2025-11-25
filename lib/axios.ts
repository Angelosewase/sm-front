import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add token from cookie
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find((c) =>
        c.trim().startsWith('accessToken='),
      );
      if (tokenCookie) {
        const rawValue = tokenCookie.trim().split('=').slice(1).join('=');
        const decodedToken = decodeURIComponent(rawValue || '');
        if (decodedToken) {
          const normalizedToken = decodedToken.replace(/^Bearer\s+/i, '');
          config.headers.Authorization = `Bearer ${normalizedToken}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear cookies and redirect to login
      if (typeof window !== 'undefined') {
        document.cookie = 'accessToken=; Max-Age=0; path=/;';
        document.cookie = 'user=; Max-Age=0; path=/;';
        document.cookie = 'school=; Max-Age=0; path=/;';
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
