import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../features/timerSlice';
import cyclesReducer from '../features/cyclesSlice'

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    cycles: cyclesReducer,
  },
});