import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  timeRemaining: 1500, // 25 minutes in seconds
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeRemaining = 1500;
    },
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
  },
});

export const { startTimer, pauseTimer, resetTimer, decrementTimer } = timerSlice.actions;

export default timerSlice.reducer;