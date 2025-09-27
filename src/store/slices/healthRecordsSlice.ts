import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HealthRecord, HealthRecordsState } from '../../types';

// Async thunks
export const fetchHealthRecords = createAsyncThunk(
  'healthRecords/fetchHealthRecords',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from your API
      const mockRecords: HealthRecord[] = [
        {
          id: '1',
          userId,
          type: 'consultation',
          title: 'General Checkup',
          description: 'Regular health checkup with Dr. Smith',
          date: '2024-01-15',
          doctorName: 'Dr. Smith',
          hospitalName: 'City Hospital',
          attachments: [],
          synced: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          userId,
          type: 'prescription',
          title: 'Blood Pressure Medication',
          description: 'Prescription for hypertension management',
          date: '2024-01-15',
          doctorName: 'Dr. Smith',
          hospitalName: 'City Hospital',
          attachments: ['prescription.pdf'],
          synced: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockRecords;
    } catch (error) {
      return rejectWithValue('Failed to fetch health records');
    }
  }
);

export const addHealthRecord = createAsyncThunk(
  'healthRecords/addHealthRecord',
  async (record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt' | 'synced'>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRecord: HealthRecord = {
        ...record,
        id: Date.now().toString(),
        synced: false, // Will be synced when online
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return newRecord;
    } catch (error) {
      return rejectWithValue('Failed to add health record');
    }
  }
);

export const syncHealthRecords = createAsyncThunk(
  'healthRecords/syncHealthRecords',
  async (unsyncedRecords: HealthRecord[], { rejectWithValue }) => {
    try {
      // Simulate API call to sync records
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark records as synced
      const syncedRecords = unsyncedRecords.map(record => ({
        ...record,
        synced: true,
        updatedAt: new Date().toISOString(),
      }));
      
      return syncedRecords;
    } catch (error) {
      return rejectWithValue('Failed to sync health records');
    }
  }
);

const initialState: HealthRecordsState = {
  records: [],
  isLoading: false,
  error: null,
  lastSyncAt: null,
};

const healthRecordsSlice = createSlice({
  name: 'healthRecords',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateRecord: (state, action: PayloadAction<HealthRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(record => record.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch health records
      .addCase(fetchHealthRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
        state.error = null;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add health record
      .addCase(addHealthRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addHealthRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records.unshift(action.payload);
        state.error = null;
      })
      .addCase(addHealthRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sync health records
      .addCase(syncHealthRecords.fulfilled, (state, action) => {
        state.records = state.records.map(record => {
          const syncedRecord = action.payload.find(synced => synced.id === record.id);
          return syncedRecord || record;
        });
        state.lastSyncAt = new Date().toISOString();
      });
  },
});

export const { clearError, updateRecord, deleteRecord } = healthRecordsSlice.actions;
export default healthRecordsSlice.reducer;
