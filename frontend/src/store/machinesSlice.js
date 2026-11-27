import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchMachines = createAsyncThunk('machines/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE}/machines`);
    if (!res.ok) throw new Error('Failed to fetch machines');
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const acknowledgeFault = createAsyncThunk(
  'machines/acknowledgeFault',
  async (machineId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/machines/${machineId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'idle' }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to acknowledge fault');
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedMachineId: null,
    filterStatus: 'all',
    searchQuery: '',
  },
  reducers: {
    selectMachine(state, action) {
      state.selectedMachineId = action.payload;
    },
    clearSelection(state) {
      state.selectedMachineId = null;
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchMachines
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // acknowledgeFault — optimistic: update immediately on pending, confirm on fulfilled
    builder
      .addCase(acknowledgeFault.pending, (state, action) => {
        // Optimistic update: set status to 'idle' right away
        const machineId = action.meta.arg;
        const machine = state.items.find((m) => m.id === machineId);
        if (machine) {
          machine.status = 'idle';
          machine.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(acknowledgeFault.fulfilled, (state, action) => {
        // Confirm with server response
        const index = state.items.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(acknowledgeFault.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectMachine, clearSelection, setFilterStatus, setSearchQuery } =
  machinesSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllMachines = (state) => state.machines.items;
export const selectMachinesStatus = (state) => state.machines.status;
export const selectMachinesError = (state) => state.machines.error;
export const selectSelectedMachineId = (state) => state.machines.selectedMachineId;
export const selectFilterStatus = (state) => state.machines.filterStatus;
export const selectSearchQuery = (state) => state.machines.searchQuery;

export const selectFilteredMachines = (state) => {
  const { items, filterStatus, searchQuery } = state.machines;
  return items.filter((m) => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};

export const selectSelectedMachine = (state) => {
  const id = state.machines.selectedMachineId;
  return state.machines.items.find((m) => m.id === id) || null;
};

export default machinesSlice.reducer;
