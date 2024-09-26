import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../features/timerSlice';
import authReducer from '../features/authSlice'

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    auth: authReducer,
  },
});