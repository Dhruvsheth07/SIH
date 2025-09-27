import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SOSRequest, SOSState } from '../../types';

// Async thunks
export const sendSOSRequest = createAsyncThunk(
  'sos/sendSOSRequest',
  async (sosData: { userId: string; location: { latitude: number; longitude: number; address?: string }; message: string; emergencyType: 'medical' | 'accident' | 'other' }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sosRequest: SOSRequest = {
        id: Date.now().toString(),
        userId: sosData.userId,
        location: sosData.location,
        timestamp: new Date().toISOString(),
        status: 'sent',
        message: sosData.message,
        emergencyType: sosData.emergencyType,
      };
      
      return sosRequest;
    } catch (error) {
      return rejectWithValue('Failed to send SOS request');
    }
  }
);

export const fetchSOSHistory = createAsyncThunk(
  'sos/fetchSOSHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock SOS history
      const mockHistory: SOSRequest[] = [
        {
          id: '1',
          userId,
          location: {
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'New Delhi, India',
          },
          timestamp: '2024-01-10T14:30:00Z',
          status: 'resolved',
          message: 'Medical emergency - chest pain',
          emergencyType: 'medical',
        },
        {
          id: '2',
          userId,
          location: {
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'New Delhi, India',
          },
          timestamp: '2024-01-05T09:15:00Z',
          status: 'resolved',
          message: 'Accident on highway',
          emergencyType: 'accident',
        },
      ];
      
      return mockHistory;
    } catch (error) {
      return rejectWithValue('Failed to fetch SOS history');
    }
  }
);

export const updateSOSStatus = createAsyncThunk(
  'sos/updateSOSStatus',
  async (data: { id: string; status: SOSRequest['status'] }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return data;
    } catch (error) {
      return rejectWithValue('Failed to update SOS status');
    }
  }
);

const initialState: SOSState = {
  isActive: false,
  currentRequest: null,
  history: [],
  isLoading: false,
  error: null,
};

const sosSlice = createSlice({
  name: 'sos',
  initialState,
  reducers: {
    activateSOS: (state) => {
      state.isActive = true;
    },
    deactivateSOS: (state) => {
      state.isActive = false;
      state.currentRequest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRequest: (state, action: PayloadAction<SOSRequest | null>) => {
      state.currentRequest = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send SOS request
      .addCase(sendSOSRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendSOSRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRequest = action.payload;
        state.history.unshift(action.payload);
        state.error = null;
      })
      .addCase(sendSOSRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch SOS history
      .addCase(fetchSOSHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSOSHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
        state.error = null;
      })
      .addCase(fetchSOSHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update SOS status
      .addCase(updateSOSStatus.fulfilled, (state, action) => {
        const request = state.history.find(r => r.id === action.payload.id);
        if (request) {
          request.status = action.payload.status;
        }
        if (state.currentRequest && state.currentRequest.id === action.payload.id) {
          state.currentRequest.status = action.payload.status;
        }
      });
  },
});

export const { activateSOS, deactivateSOS, clearError, setCurrentRequest } = sosSlice.actions;
export default sosSlice.reducer;
