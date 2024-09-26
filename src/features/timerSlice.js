import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  timeRemaining: 25 * 60,
  cycles: [
    { id: 'default-1', label: 'Focus', duration: 25 * 60, note: 'Time to concentrate!' },
    { id: 'default-2', label: 'Break', duration: 5 * 60, note: 'Take a short break.' },
  ],
  currentCycleIndex: 0,
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
      state.timeRemaining = state.cycles[state.currentCycleIndex].duration;
    },
    tickTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.currentCycleIndex = (state.currentCycleIndex + 1) % state.cycles.length;
        state.timeRemaining = state.cycles[state.currentCycleIndex].duration;
      }
    },
    addCycle: (state, action) => {
      state.cycles.push(action.payload);
    },
    updateCycle: (state, action) => {
      const index = state.cycles.findIndex(cycle => cycle.id === action.payload.id);
      if (index !== -1) {
        state.cycles[index] = action.payload;
      }
    },
    reorderCycles: (state, action) => {
      state.cycles = action.payload;
    },
    deleteCycle: (state, action) => {
      state.cycles = state.cycles.filter(cycle => cycle.id !== action.payload);
      if (state.currentCycleIndex >= state.cycles.length) {
        state.currentCycleIndex = Math.max(0, state.cycles.length - 1);
      }
    },
    setCurrentCycle: (state, action) => {
      state.currentCycleIndex = action.payload;
      state.timeRemaining = state.cycles[action.payload].duration;
    },
  },
});

export const { 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  tickTimer, 
  addCycle,
  updateCycle,
  deleteCycle,
  reorderCycles,
  setCurrentCycle
} = timerSlice.actions;

export default timerSlice.reducer;