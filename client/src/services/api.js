import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8050/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (userData) => API.post('/users', userData);