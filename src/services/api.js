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



import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import * as idb from './indexedDB';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function offlineFirst(onlineOperation, offlineOperation) {
  if (navigator.onLine) {
    try {
      const result = await onlineOperation();
      return result;
    } catch (error) {
      console.error('Online operation failed:', error);
      if (error.response && error.response.status === 401) {
        throw error; // pass auth errors downstream and handle them there and maintain error msg
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