import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ── Async Thunks ──────────────────────────────────────────────────────────────

// Fetch all machines from the backend
export const fetchMachines = createAsyncThunk(
  'machines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/machines');
      if (!res.ok) throw new Error('Failed to fetch machines');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Acknowledge a fault — sets machine status to 'idle'
export const acknowledgeFault = createAsyncThunk(
  'machines/acknowledgeFault',
  async (machineId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/machines/${machineId}/status`, {
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

// ── Slice ─────────────────────────────────────────────────────────────────────

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    items: [],
    status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedMachineId: null,
    filterStatus: 'all', // 'all' | 'running' | 'idle' | 'fault'
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

    // acknowledgeFault — optimistic update on pending, confirm on fulfilled
    builder
      .addCase(acknowledgeFault.pending, (state, action) => {
        // Immediately update UI before server responds
        const machine = state.items.find((m) => m.id === action.meta.arg);
        if (machine) {
          machine.status = 'idle';
          machine.lastUpdated = new Date().toISOString();
        }
      })
      .addCase(acknowledgeFault.fulfilled, (state, action) => {
        // Confirm with actual server data
        const index = state.items.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(acknowledgeFault.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectMachine, clearSelection, setFilterStatus, setSearchQuery } =
  machinesSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectAllMachines     = (state) => state.machines.items;
export const selectMachinesStatus  = (state) => state.machines.status;
export const selectMachinesError   = (state) => state.machines.error;
export const selectSelectedMachineId = (state) => state.machines.selectedMachineId;
export const selectFilterStatus    = (state) => state.machines.filterStatus;
export const selectSearchQuery     = (state) => state.machines.searchQuery;

// Returns machines filtered by status AND search query
export const selectFilteredMachines = (state) => {
  const { items, filterStatus, searchQuery } = state.machines;
  return items.filter((m) => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};

// Returns the full object of the selected machine
export const selectSelectedMachine = (state) => {
  const id = state.machines.selectedMachineId;
  return state.machines.items.find((m) => m.id === id) || null;
};

export default machinesSlice.reducer;
