import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as syncService from '../services/sync';
import * as api from '../services/api';

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

export const defaultQuickAccessConfigurations = defaultConfigurations.map(config => config.id);

const customConfig = {
  id: 'custom',
  name: 'Custom',
  cycles: [],
};

// export const fetchConfigurations = createAsyncThunk(
//   'timer/fetchConfigurations',
//   async () => {
//     const configurations = await syncService.syncConfigurations();
//     return configurations;
//   }
// );

// this version goes straight to api call and doesn't use sync module
export const fetchConfigurations = createAsyncThunk(
  'timer/fetchConfigurations',
  async () => {
    const response = await api.getConfigurations();
    return response.data;
  }
);

export const saveConfigurationAsync = createAsyncThunk(
  'timer/saveConfigurationAsync',
  async (configuration) => {
    const savedConfig = await syncService.saveConfiguration(configuration);
    return savedConfig;
  }
);

export const deleteConfigurationAsync = createAsyncThunk(
  'timer/deleteConfigurationAsync',
  async (id) => {
    await syncService.deleteConfiguration(id);
    return id;
  }
);

// this version goes straight to api call and does not use sync module
// export const updateQuickAccessConfigurations = createAsyncThunk(
//   'timer/updateQuickAccessConfigurations',
//   async (quickAccessConfigurations) => {
//     const response = await api.updateQuickAccessConfigurations(quickAccessConfigurations);
//     return response.data.quickAccessConfigurations;
//   }
// );
export const updateQuickAccessConfigurations = createAsyncThunk(
  'timer/updateQuickAccessConfigurations',
  async (quickAccessConfigurations, { rejectWithValue, getState }) => {
    const { timer } = getState();
    // Only make the API call if there are actual changes
    if (JSON.stringify(quickAccessConfigurations) !== JSON.stringify(timer.visibleConfigurations)) {
      try {
        const response = await api.updateQuickAccessConfigurations(quickAccessConfigurations);
        return response.data.quickAccessConfigurations;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update quick access configurations');
      }
    } else {
      // If no changes, just return the current state
      return timer.visibleConfigurations;
    }
  }
);

const initialState = {
  isRunning: false,
  timeRemaining: 25 * 60,
  cycles: defaultConfigurations[0].cycles,
  currentCycleId: defaultConfigurations[0].cycles[0].id,
  configurations: [...defaultConfigurations, customConfig],
  currentConfigId: defaultConfigurations[0].id,
  visibleConfigurations: defaultQuickAccessConfigurations // IDs of configurations visible in the selector
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

      // if this is the first cycle set it as current cycle
      if (state.cycles.length === 1) {
        state.currentCycleId = action.payload.id;
        state.timeRemaining = action.payload.duration;
      }

      // Update custom configuration
      if (state.currentConfigId === 'custom') {
        const customConfigIndex = state.configurations.findIndex(c => c.id === 'custom');
        if (customConfigIndex !== -1) {
          state.configurations[customConfigIndex].cycles = [...state.cycles];
        }
      }
    },
    // updateCycle: (state, action) => {
    //   const index = state.cycles.findIndex(cycle => cycle.id === action.payload.id);
    //   if (index !== -1) {
    //     state.cycles[index] = action.payload;
    //     // Update custom configuration
    //     if (state.currentConfigId === 'custom') {
    //       const customConfigIndex = state.configurations.findIndex(c => c.id === 'custom');
    //       if (customConfigIndex !== -1) {
    //         state.configurations[customConfigIndex].cycles = [...state.cycles];
    //       }
    //     }
    //   }
    // },
    updateCycle: (state, action) => {
      const index = state.cycles.findIndex(cycle => cycle.id === action.payload.id);
      if (index !== -1) {
        const oldCycle = state.cycles[index];
        state.cycles[index] = action.payload;
    
        // If this is the current cycle, update timeRemaining proportionally
        if (state.currentCycleId === action.payload.id) {
          const timeElapsed = oldCycle.duration - state.timeRemaining;
          const progress = timeElapsed / oldCycle.duration;
          state.timeRemaining = Math.round(action.payload.duration * (1 - progress));
    
          // Ensure timeRemaining is not negative
          state.timeRemaining = Math.max(state.timeRemaining, 0);
        }
    
        // Update custom configuration
        if (state.currentConfigId === 'custom') {
          const customConfigIndex = state.configurations.findIndex(c => c.id === 'custom');
          if (customConfigIndex !== -1) {
            state.configurations[customConfigIndex].cycles = [...state.cycles];
          }
        }
      }
    },
    reorderCycles: (state, action) => {
      state.cycles = action.payload;
      // Update custom configuration
      if (state.currentConfigId === 'custom') {
        const customConfigIndex = state.configurations.findIndex(c => c.id === 'custom');
        if (customConfigIndex !== -1) {
          state.configurations[customConfigIndex].cycles = [...state.cycles];
        }
      }
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
    
      // Update custom configuration
      if (state.currentConfigId === 'custom') {
        const customConfigIndex = state.configurations.findIndex(c => c.id === 'custom');
        if (customConfigIndex !== -1) {
          state.configurations[customConfigIndex].cycles = [...state.cycles];
        }
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
        state.cycles = [...config.cycles];
        state.currentCycleId = config.cycles.length > 0 ? config.cycles[0].id : null;
        state.timeRemaining = config.cycles.length > 0 ? config.cycles[0].duration : 0;
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
          state.cycles = [...action.payload.cycles];
          state.currentCycleId = action.payload.cycles.length > 0 ? action.payload.cycles[0].id : null;
          state.timeRemaining = action.payload.cycles.length > 0 ? action.payload.cycles[0].duration : 0;
        }
      }
    },
    deleteConfiguration: (state, action) => {
      state.configurations = state.configurations.filter(c => c.id !== action.payload);
      if (state.currentConfigId === action.payload) {
        const defaultConfig = state.configurations[0];
        state.currentConfigId = defaultConfig.id;
        state.cycles = [...defaultConfig.cycles];
        state.currentCycleId = defaultConfig.cycles.length > 0 ? defaultConfig.cycles[0].id : null;
        state.timeRemaining = defaultConfig.cycles.length > 0 ? defaultConfig.cycles[0].duration : 0;
      }
    },
    updateCurrentConfigurationToCustom: (state) => {
      if (state.currentConfigId !== 'custom') {
        const customConfig = state.configurations.find(c => c.id === 'custom');
        customConfig.cycles = [...state.cycles];
        state.currentConfigId = 'custom';
      }
      // Always update the custom configuration in the configurations array
      const customConfigIndex = state.configurations.findIndex(c => c.id === 'custom');
      if (customConfigIndex !== -1) {
        state.configurations[customConfigIndex].cycles = [...state.cycles];
      }
    },
    saveCustomConfiguration: (state, action) => {
      const { name } = action.payload;
      const newConfig = {
        id: `custom-${Date.now()}`,
        name,
        cycles: [...state.cycles],
      };
      state.configurations.push(newConfig);
      state.currentConfigId = newConfig.id;
    },
    // toggleConfigVisibility: (state, action) => {
    //   const configId = action.payload;
    //   const index = state.visibleConfigurations.indexOf(configId);
    //   if (index > -1) {
    //     state.visibleConfigurations.splice(index, 1);
    //   } else {
    //     state.visibleConfigurations.push(configId);
    //   }
    // },
    setQuickAccessConfigurations: (state, action) => {
      state.visibleConfigurations = action.payload;
    },
    resetToDefaultQuickAccess: (state) => {
      state.visibleConfigurations = defaultQuickAccessConfigurations;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchConfigurations.fulfilled, (state, action) => {
      //   // Merge fetched configurations with existing ones, prioritizing fetched ones
      //   const mergedConfigurations = [
      //     ...action.payload,
      //     ...state.configurations.filter(config => 
      //       !action.payload.some(fetchedConfig => fetchedConfig.id === config.id)
      //     )
      //   ];
      //   state.configurations = mergedConfigurations;
      // })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        const userConfigurations = action.payload;
        state.configurations = [
          ...defaultConfigurations,
          ...userConfigurations,
          customConfig
        ];
      })
      .addCase(saveConfigurationAsync.fulfilled, (state, action) => {
        const index = state.configurations.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.configurations[index] = action.payload;
        } else {
          state.configurations.push(action.payload);
        }
      })
      .addCase(deleteConfigurationAsync.fulfilled, (state, action) => {
        state.configurations = state.configurations.filter(c => c.id !== action.payload);
        state.visibleConfigurations = state.visibleConfigurations.filter(id => id !== action.payload);
        if (state.currentConfigId === action.payload) {
          const defaultConfig = state.configurations[0];
          state.currentConfigId = defaultConfig.id;
          state.cycles = [...defaultConfig.cycles];
          state.currentCycleId = defaultConfig.cycles.length > 0 ? defaultConfig.cycles[0].id : null;
          state.timeRemaining = defaultConfig.cycles.length > 0 ? defaultConfig.cycles[0].duration : 0;
        }
      })
      // .addCase(updateQuickAccessConfigurations.fulfilled, (state, action) => {
      //   state.visibleConfigurations = action.payload;
      // })
      .addCase(updateQuickAccessConfigurations.fulfilled, (state, action) => {
        state.visibleConfigurations = action.payload;
        state.error = null;
      })
      .addCase(updateQuickAccessConfigurations.rejected, (state, action) => {
        state.error = action.payload;
      });
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
  updateCurrentConfigurationToCustom,
  saveCustomConfiguration, 
  // toggleConfigVisibility,
  setQuickAccessConfigurations,
  resetToDefaultQuickAccess,
} = timerSlice.actions;

export default timerSlice.reducer;