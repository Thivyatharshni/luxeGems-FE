import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL && import.meta.env.PROD) {
    console.error('CRITICAL: VITE_API_URL is not defined in production!');
}

const API_BASE = API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            // 401 Unauthorized: Clear session and redirect to login
            if (response.status === 401 && !error.config.url.includes('/auth/')) {
                // Don't redirect if it's a public GET request (like products list)
                // or if specifically requested to skip redirect
                const isPublicGet = error.config.method === 'get' &&
                    (error.config.url.includes('/products') ||
                        error.config.url.includes('/categories') ||
                        error.config.url.includes('/cms/'));

                if (!isPublicGet && !error.config.skipRedirect) {
                    window.location.href = '/login';
                }
            }

            // 409 Conflict: Special handling for Price Lock Expired
            if (response.status === 409) {
                // This will be handled by the feature logic or a global modal via Redux
                console.warn('Price Lock Expired or Inventory Conflict');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
