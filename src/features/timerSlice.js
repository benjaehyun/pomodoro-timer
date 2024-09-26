import { createSlice } from '@reduxjs/toolkit';

const defaultConfigurations = [
  {
    id: 'classic-pomodoro',
    name: 'Classic Pomodoro',
    cycles: [
      { id: 'classic-1', label: 'Focus', duration: 25 * 60, note: 'Time to concentrate!' },
      { id: 'classic-2', label: 'Short Break', duration: 5 * 60, note: 'Take a quick breather.' },
      { id: 'classic-3', label: 'Focus', duration: 25 * 60, note: 'Back to work!' },
      { id: 'classic-4', label: 'Short Break', duration: 5 * 60, note: 'Another short break.' },
      { id: 'classic-5', label: 'Focus', duration: 25 * 60, note: 'Keep pushing!' },
      { id: 'classic-6', label: 'Short Break', duration: 5 * 60, note: 'Almost there!' },
      { id: 'classic-7', label: 'Focus', duration: 25 * 60, note: 'Final stretch!' },
      { id: 'classic-8', label: 'Long Break', duration: 25 * 60, note: "You've earned a longer break!" },
    ],
  },
  {
    id: '52-17-focus',
    name: '52/17 Focus',
    cycles: [
      { id: '52-17-1', label: 'Focus', duration: 52 * 60, note: 'Extended focus period.' },
      { id: '52-17-2', label: 'Break', duration: 17 * 60, note: 'Longer break to recharge.' },
      { id: '52-17-3', label: 'Focus', duration: 52 * 60, note: 'Back to deep work.' },
      { id: '52-17-4', label: 'Break', duration: 17 * 60, note: 'Another refreshing break.' },
      { id: '52-17-5', label: 'Focus', duration: 52 * 60, note: 'Last focus session.' },
      { id: '52-17-6', label: 'Long Break', duration: 25 * 60, note: 'Extended break after productive work!' },
    ],
  },
  {
    id: '90-minute-focus',
    name: '90-Minute Deep Focus',
    cycles: [
      { id: '90-1', label: 'Deep Focus', duration: 90 * 60, note: 'Extended deep work session.' },
      { id: '90-2', label: 'Break', duration: 20 * 60, note: 'Substantial break to recharge.' },
      { id: '90-3', label: 'Deep Focus', duration: 90 * 60, note: 'Another round of deep work.' },
      { id: '90-4', label: 'Long Break', duration: 35 * 60, note: 'Major break after intense focus!' },
    ],
  },
];

const initialState = {
  isRunning: false,
  timeRemaining: 25 * 60,
  cycles: defaultConfigurations[0].cycles,
  currentCycleId: defaultConfigurations[0].cycles[0].id,
  configurations: defaultConfigurations,
  currentConfigId: defaultConfigurations[0].id,
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
    setConfiguration: (state, action) => {
      const config = state.configurations.find(c => c.id === action.payload);
      if (config) {
        state.currentConfigId = config.id;
        state.cycles = config.cycles;
        state.currentCycleId = config.cycles[0].id;
        state.timeRemaining = config.cycles[0].duration;
        state.isRunning = false;
      }
    },
    addConfiguration: (state, action) => {
      state.configurations.push(action.payload);
    },
    updateConfiguration: (state, action) => {
      const index = state.configurations.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.configurations[index] = action.payload;
        if (state.currentConfigId === action.payload.id) {
          state.cycles = action.payload.cycles;
          state.currentCycleId = action.payload.cycles[0].id;
          state.timeRemaining = action.payload.cycles[0].duration;
        }
      }
    },
    deleteConfiguration: (state, action) => {
      state.configurations = state.configurations.filter(c => c.id !== action.payload);
      if (state.currentConfigId === action.payload) {
        const defaultConfig = state.configurations[0];
        state.currentConfigId = defaultConfig.id;
        state.cycles = defaultConfig.cycles;
        state.currentCycleId = defaultConfig.cycles[0].id;
        state.timeRemaining = defaultConfig.cycles[0].duration;
      }
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
  setCurrentCycle,
  setConfiguration,
  addConfiguration,
  updateConfiguration,
  deleteConfiguration,
} = timerSlice.actions;

export default timerSlice.reducer;