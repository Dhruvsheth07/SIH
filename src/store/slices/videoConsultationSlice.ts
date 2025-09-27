import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Doctor, TimeSlot, Consultation, VideoConsultationState } from '../../types';

// Async thunks
export const fetchDoctors = createAsyncThunk(
  'videoConsultation/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock doctors data
      const mockDoctors: Doctor[] = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          specialty: 'General Medicine',
          experience: 10,
          rating: 4.8,
          availableSlots: [],
          profileImage: '/images/doctor1.jpg',
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          specialty: 'Cardiology',
          experience: 15,
          rating: 4.9,
          availableSlots: [],
          profileImage: '/images/doctor2.jpg',
        },
        {
          id: '3',
          name: 'Dr. Priya Sharma',
          specialty: 'Pediatrics',
          experience: 8,
          rating: 4.7,
          availableSlots: [],
          profileImage: '/images/doctor3.jpg',
        },
      ];
      
      return mockDoctors;
    } catch (error) {
      return rejectWithValue('Failed to fetch doctors');
    }
  }
);

export const fetchAvailableSlots = createAsyncThunk(
  'videoConsultation/fetchAvailableSlots',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock available slots
      const mockSlots: TimeSlot[] = [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '09:30',
          isAvailable: true,
          doctorId,
        },
        {
          id: '2',
          date: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '10:30',
          isAvailable: true,
          doctorId,
        },
        {
          id: '3',
          date: new Date().toISOString().split('T')[0],
          startTime: '14:00',
          endTime: '14:30',
          isAvailable: false,
          doctorId,
        },
      ];
      
      return mockSlots;
    } catch (error) {
      return rejectWithValue('Failed to fetch available slots');
    }
  }
);

export const bookConsultation = createAsyncThunk(
  'videoConsultation/bookConsultation',
  async (bookingData: { doctorId: string; slotId: string; patientId: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const consultation: Consultation = {
        id: Date.now().toString(),
        patientId: bookingData.patientId,
        doctorId: bookingData.doctorId,
        scheduledAt: new Date().toISOString(),
        status: 'scheduled',
        meetingId: `meeting_${Date.now()}`,
      };
      
      return consultation;
    } catch (error) {
      return rejectWithValue('Failed to book consultation');
    }
  }
);

export const startVideoCall = createAsyncThunk(
  'videoConsultation/startVideoCall',
  async (consultationId: string, { rejectWithValue }) => {
    try {
      // Simulate starting video call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { consultationId, isInCall: true };
    } catch (error) {
      return rejectWithValue('Failed to start video call');
    }
  }
);

export const endVideoCall = createAsyncThunk(
  'videoConsultation/endVideoCall',
  async (consultationId: string, { rejectWithValue }) => {
    try {
      // Simulate ending video call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { consultationId, isInCall: false };
    } catch (error) {
      return rejectWithValue('Failed to end video call');
    }
  }
);

const initialState: VideoConsultationState = {
  doctors: [],
  consultations: [],
  currentConsultation: null,
  isInCall: false,
  isLoading: false,
  error: null,
};

const videoConsultationSlice = createSlice({
  name: 'videoConsultation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConsultation: (state, action: PayloadAction<Consultation | null>) => {
      state.currentConsultation = action.payload;
    },
    updateConsultationStatus: (state, action: PayloadAction<{ id: string; status: Consultation['status'] }>) => {
      const consultation = state.consultations.find(c => c.id === action.payload.id);
      if (consultation) {
        consultation.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch available slots
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        const doctor = state.doctors.find(d => d.id === action.meta.arg);
        if (doctor) {
          doctor.availableSlots = action.payload;
        }
      })
      // Book consultation
      .addCase(bookConsultation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bookConsultation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.consultations.unshift(action.payload);
        state.error = null;
      })
      .addCase(bookConsultation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start video call
      .addCase(startVideoCall.fulfilled, (state, action) => {
        state.isInCall = action.payload.isInCall;
        const consultation = state.consultations.find(c => c.id === action.payload.consultationId);
        if (consultation) {
          consultation.status = 'in_progress';
          state.currentConsultation = consultation;
        }
      })
      // End video call
      .addCase(endVideoCall.fulfilled, (state, action) => {
        state.isInCall = action.payload.isInCall;
        const consultation = state.consultations.find(c => c.id === action.payload.consultationId);
        if (consultation) {
          consultation.status = 'completed';
        }
        state.currentConsultation = null;
      });
  },
});

export const { clearError, setCurrentConsultation, updateConsultationStatus } = videoConsultationSlice.actions;
export default videoConsultationSlice.reducer;
