import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  timeRemaining: 25 * 60, // 25 minutes in seconds
  currentPhase: 'work', // 'work' or 'break'
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
};

const timerSlice = createSlice({
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
      state.timeRemaining = state.currentPhase === 'work' ? state.workDuration : state.breakDuration;
    },
    tickTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.currentPhase = state.currentPhase === 'work' ? 'break' : 'work';
        state.timeRemaining = state.currentPhase === 'work' ? state.workDuration : state.breakDuration;
      }
    },
    setWorkDuration: (state, action) => {
      state.workDuration = action.payload * 60;
      if (state.currentPhase === 'work') {
        state.timeRemaining = state.workDuration;
      }
    },
    setBreakDuration: (state, action) => {
      state.breakDuration = action.payload * 60;
      if (state.currentPhase === 'break') {
        state.timeRemaining = state.breakDuration;
      }
    },
  },
});

export const { 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  tickTimer, 
  setWorkDuration, 
  setBreakDuration 
} = timerSlice.actions;

export default timerSlice.reducer;