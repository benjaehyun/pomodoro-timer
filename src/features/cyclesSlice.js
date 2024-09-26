import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { saveCycles, getCycles } from '../utils/indexedDB';

const initialState = {
  cycles: [],
  status: 'idle',
  error: null
};

export const fetchCycles = createAsyncThunk('cycles/fetchCycles', async () => {
  try {
    const response = await axios.get('/api/cycles');
    await saveCycles(response.data);
    return response.data;
  } catch (error) {
    // If network request fails, try to get data from IndexedDB
    const cycles = await getCycles();
    if (cycles) return cycles;
    throw error;
  }
});

export const addCycle = createAsyncThunk('cycles/addCycle', async (cycle, { getState }) => {
  try {
    const response = await axios.post('/api/cycles', cycle);
    const updatedCycles = [...getState().cycles.cycles, response.data];
    await saveCycles(updatedCycles);
    return response.data;
  } catch (error) {
    // If network request fails, add to local IndexedDB
    const cycles = await getCycles();
    const updatedCycles = [...cycles, { ...cycle, _id: Date.now().toString() }];
    await saveCycles(updatedCycles);
    return cycle;
  }
});

const cyclesSlice = createSlice({
  name: 'cycles',
  initialState,
  reducers: {
    updateCycleOrder(state, action) {
      state.cycles = action.payload;
      saveCycles(action.payload);  // Update IndexedDB
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCycles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCycles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cycles = action.payload;
      })
      .addCase(fetchCycles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCycle.fulfilled, (state, action) => {
        state.cycles.push(action.payload);
      });
  }
});

export const { updateCycleOrder } = cyclesSlice.actions;
export default cyclesSlice.reducer;