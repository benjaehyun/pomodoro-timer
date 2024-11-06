// import axios from 'axios';
// import { API_BASE_URL } from '../config/apiConfig';

// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// api.interceptors.response.use(
//   response => response,
//   error => {
//     console.error('API Error:', error.response);
//     return Promise.reject(error.response?.data || { message: 'An unexpected error occurred' });
//   }
// );

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // user api
// export const register = (userData) => api.post('/users/register', userData);
// export const login = (credentials) => api.post('/users/login', credentials);
// export const getMe = () => api.get('/users/me');
// export const updateQuickAccessConfigurations = (quickAccessConfigurations) => 
//   api.put('/users/quick-access', { quickAccessConfigurations });

// // configuration api
// export const getConfigurations = () => api.get('/configurations');
// export const createConfiguration = (configData) => api.post('/configurations', configData);
// export const updateConfiguration = (_id, configData) => api.put(`/configurations/${_id}`, configData);
// export const deleteConfiguration = (_id) => api.delete(`/configurations/${_id}`);

// export default api;

import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import * as idb from './indexedDB';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: process.env.NODE_ENV === 'production',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle offline scenario
    if (!navigator.onLine || error.message === 'Network Error') {
      console.log('Network error detected, falling back to offline mode');
      return Promise.reject({ offline: true, ...error });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // You might want to trigger a logout action here
    }

    return Promise.reject(error.response?.data || { message: 'An unexpected error occurred' });
  }
);

async function offlineFirst(onlineOperation, offlineOperation) {
  if (navigator.onLine) {
    try {
      const result = await onlineOperation();
      return result;
    } catch (error) {
      console.error('Online operation failed:', error);
      if (error.response && error.response.status === 401) {
        throw error; // Let the application handle authentication errors
      }
      console.log('Falling back to offline operation');
      return offlineOperation();
    }
  } else {
    console.log('Device is offline, using local data');
    return offlineOperation();
  }
}

// User API
export const register = (userData) => api.post('/users/register', userData);
export const login = (credentials) => api.post('/users/login', credentials);
export const getMe = () => offlineFirst(
  () => api.get('/users/me'),
  () => idb.getUser()
);

// Configuration API
export const getConfigurations = () => offlineFirst(
  async () => {
    const response = await api.get('/configurations');
    await Promise.all(response.data.map(config => idb.saveConfiguration(config)));
    return response;
  },
  async () => ({ data: await idb.getConfigurations() })
);

export const createConfiguration = (configData) => offlineFirst(
  async () => {
    const response = await api.post('/configurations', configData);
    await idb.saveConfiguration(response.data);
    return response;
  },
  async () => {
    const tempId = `local_${Date.now()}`;
    const config = { ...configData, _id: tempId, isLocalOnly: true };
    await idb.saveConfiguration(config);
    return { data: config };
  }
);

export const updateConfiguration = (_id, configData) => offlineFirst(
  async () => {
    const response = await api.put(`/configurations/${_id}`, configData);
    await idb.saveConfiguration(response.data);
    return response;
  },
  async () => {
    const config = { ...configData, _id, lastModified: new Date().toISOString() };
    if (config._id.startsWith('local_')) {
      config.isLocalOnly = true;
    }
    await idb.saveConfiguration(config);
    return { data: config };
  }
);

export const deleteConfiguration = (_id) => offlineFirst(
  async () => {
    await api.delete(`/configurations/${_id}`);
    await idb.deleteConfiguration(_id);
    return { data: { _id } };
  },
  async () => {
    await idb.deleteConfiguration(_id);
    return { data: { _id } };
  }
);

export const updateQuickAccessConfigurations = (quickAccessConfigurations) => offlineFirst(
  () => api.put('/users/quick-access', { quickAccessConfigurations }),
  async () => {
    const user = await idb.getUser();
    const updatedUser = { ...user, quickAccessConfigurations };
    await idb.saveUser(updatedUser);
    return { data: { quickAccessConfigurations } };
  }
);

export default api;