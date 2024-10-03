import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response);
    return Promise.reject(error.response?.data || { message: 'An unexpected error occurred' });
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// user api
export const register = (userData) => api.post('/users/register', userData);
export const login = (credentials) => api.post('/users/login', credentials);
export const getMe = () => api.get('/users/me');
export const updateQuickAccessConfigurations = (quickAccessConfigurations) => 
  api.put('/users/quick-access', { quickAccessConfigurations });

// configuration api
export const getConfigurations = () => api.get('/configurations');
export const createConfiguration = (configData) => api.post('/configurations', configData);
export const updateConfiguration = (_id, configData) => api.put(`/configurations/${_id}`, configData);
export const deleteConfiguration = (_id) => api.delete(`/configurations/${_id}`);

export default api;