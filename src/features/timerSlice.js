import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  timeRemaining: 25 * 60,
  cycles: [
    { id: 'default-1', label: 'Focus', duration: 25 * 60, note: 'Time to concentrate!' },
    { id: 'default-2', label: 'Break', duration: 5 * 60, note: 'Take a short break.' },
  ],
  currentCycleId: 'default-1',
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
      state.timeRemaining = state.cycles.find(cycle => cycle.id === state.currentCycleId).duration;
    },
    tickTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        const currentIndex = state.cycles.findIndex(cycle => cycle.id === state.currentCycleId);
        const nextIndex = (currentIndex + 1) % state.cycles.length;
        state.currentCycleId = state.cycles[nextIndex].id;
        state.timeRemaining = state.cycles[nextIndex].duration;
      }
    },
    addCycle: (state, action) => {
      state.cycles.push(action.payload);
    },
    updateCycle: (state, action) => {
      const index = state.cycles.findIndex(cycle => cycle.id === action.payload.id);
      if (index !== -1) {
        state.cycles[index] = action.payload;
        if (state.currentCycleId === action.payload.id) {
          state.timeRemaining = Math.min(state.timeRemaining, action.payload.duration);
        }
      }
    },
    reorderCycles: (state, action) => {
      state.cycles = action.payload;
    },
    deleteCycle: (state, action) => {
      const deletedIndex = state.cycles.findIndex(cycle => cycle.id === action.payload);
      state.cycles = state.cycles.filter(cycle => cycle.id !== action.payload);

      if (state.cycles.length > 0) {
        if (state.currentCycleId === action.payload) {
          // If deleting current cycle, move to the next (or first if deleting the last)
          const nextIndex = deletedIndex >= state.cycles.length ? 0 : deletedIndex;
          state.currentCycleId = state.cycles[nextIndex].id;
          state.timeRemaining = state.cycles[nextIndex].duration;
        } else if (!state.cycles.find(cycle => cycle.id === state.currentCycleId)) {
          // If current cycle no longer exists (edge case), set to first cycle
          state.currentCycleId = state.cycles[0].id;
          state.timeRemaining = state.cycles[0].duration;
        }
      } else {
        // If all cycles are deleted
        state.currentCycleId = null;
        state.timeRemaining = 0;
        state.isRunning = false;
      }
    },
    setCurrentCycle: (state, action) => {
      state.currentCycleId = action.payload;
      state.timeRemaining = state.cycles.find(cycle => cycle.id === action.payload).duration;
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