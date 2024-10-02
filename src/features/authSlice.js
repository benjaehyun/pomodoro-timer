import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import { fetchConfigurations, setQuickAccessConfigurations, resetToDefaultQuickAccess, defaultQuickAccessConfigurations } from './timerSlice';


export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const registrationData = {
        ...userData, 
        quickAccessConfigurations: defaultQuickAccessConfigurations
      }; 

      const response = await api.register(registrationData);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      // console.error('Registration error:', error.response);
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
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  dispatch(resetToDefaultQuickAccess());
});

// export const fetchUserData = createAsyncThunk(
//   'auth/fetchUserData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No token found');
      
//       const response = await api.getMe(token);
//       return response.data;
//     } catch (error) {
//       localStorage.removeItem('token'); // Clear token on fetch failure
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const checkAndFetchUserData = createAsyncThunk(
  'auth/checkAndFetchUserData',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null; // No token, remain in anonymous state
    }
    try {
      const response = await api.getMe();
      return response.data;
    } catch (error) {
      localStorage.removeItem('token'); // Clear invalid token
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// const user = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(checkAndFetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isLoggedIn = true;
          state.user = action.payload;
        }
        // If payload is null, remain in anonymous state
      })
      .addCase(checkAndFetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;