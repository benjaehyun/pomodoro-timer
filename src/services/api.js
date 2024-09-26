import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);

// Add more API calls as needed

export default api;