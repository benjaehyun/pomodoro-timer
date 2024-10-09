import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import * as idb from '../services/indexedDB';
import { fetchConfigurations, setQuickAccessConfigurations, resetTimerState, defaultQuickAccessConfigurations } from './timerSlice';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const registrationData = {
        ...userData, 
        quickAccessConfigurations: defaultQuickAccessConfigurations
      };

      const response = await api.register(registrationData);
      localStorage.setItem('token', response.data.token);
      await idb.saveUser(response.data.user);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          return rejectWithValue({ message: error.response.data.errors[0] });
        } else if (error.response.data.message) {
          return rejectWithValue({ message: error.response.data.message });
        }
      }
      return rejectWithValue({ message: 'Registration failed. Please try again.' });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.login(credentials);
      localStorage.setItem('token', response.data.token);
      await idb.saveUser(response.data.user);
      
      await dispatch(fetchConfigurations());
      const userQuickAccess = response.data.user.quickAccessConfigurations;
      dispatch(setQuickAccessConfigurations(userQuickAccess));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  localStorage.removeItem('token');
  await idb.clearAllData();
  dispatch(resetTimerState());
});

export const checkAndFetchUserData = createAsyncThunk(
  'auth/checkAndFetchUserData',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; // No token, remain in anonymous state
    }
    try {
      let userData;
      if (navigator.onLine) {
        const response = await api.getMe();
        userData = response.data;
        await idb.saveUser(userData);

        const userQuickAccess = userData.quickAccessConfigurations;
        dispatch(setQuickAccessConfigurations(userQuickAccess));
      } else {
        userData = await idb.getUser();
      }
      return userData;
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      await idb.deleteUser();
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isOffline: !navigator.onLine,
  },
  reducers: {
    setOfflineStatus: (state, action) => {
      state.isOffline = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.error = action.payload.message;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      })
      .addCase(checkAndFetchUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAndFetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isLoggedIn = true;
          state.user = action.payload;
        }
        state.error = null;
      })
      .addCase(checkAndFetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { setOfflineStatus, clearError } = authSlice.actions;

export default authSlice.reducer;