import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Symptom, SymptomCheckResult, SymptomCheckerState } from '../../types';

// Async thunks
export const analyzeSymptoms = createAsyncThunk(
  'symptomChecker/analyzeSymptoms',
  async (symptoms: Symptom[], { rejectWithValue }) => {
    try {
      // Simulate AI analysis - in real app, this would use TensorFlow.js
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI analysis results
      const result: SymptomCheckResult = {
        id: Date.now().toString(),
        symptoms,
        possibleConditions: [
          {
            name: 'Common Cold',
            probability: 0.7,
            description: 'Viral infection affecting the upper respiratory tract',
            recommendations: [
              'Rest and stay hydrated',
              'Use saline nasal drops',
              'Take over-the-counter pain relievers if needed',
              'Consult a doctor if symptoms worsen'
            ]
          },
          {
            name: 'Allergic Rhinitis',
            probability: 0.3,
            description: 'Allergic reaction causing nasal inflammation',
            recommendations: [
              'Avoid known allergens',
              'Use antihistamines',
              'Consider nasal corticosteroids',
              'Consult an allergist if symptoms persist'
            ]
          }
        ],
        generalAdvice: [
          'Monitor your symptoms closely',
          'Get adequate rest',
          'Stay hydrated',
          'Avoid close contact with others if contagious'
        ],
        urgencyLevel: symptoms.some(s => s.severity === 'severe') ? 'high' : 'low',
        createdAt: new Date().toISOString(),
      };
      
      return result;
    } catch (error) {
      return rejectWithValue('Failed to analyze symptoms');
    }
  }
);

const initialState: SymptomCheckerState = {
  currentSymptoms: [],
  results: [],
  isLoading: false,
  error: null,
};

const symptomCheckerSlice = createSlice({
  name: 'symptomChecker',
  initialState,
  reducers: {
    addSymptom: (state, action: PayloadAction<Symptom>) => {
      state.currentSymptoms.push(action.payload);
    },
    removeSymptom: (state, action: PayloadAction<string>) => {
      state.currentSymptoms = state.currentSymptoms.filter(s => s.id !== action.payload);
    },
    updateSymptom: (state, action: PayloadAction<Symptom>) => {
      const index = state.currentSymptoms.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.currentSymptoms[index] = action.payload;
      }
    },
    clearCurrentSymptoms: (state) => {
      state.currentSymptoms = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeSymptoms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeSymptoms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results.unshift(action.payload);
        state.error = null;
      })
      .addCase(analyzeSymptoms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addSymptom,
  removeSymptom,
  updateSymptom,
  clearCurrentSymptoms,
  clearError,
  clearResults,
} = symptomCheckerSlice.actions;
export default symptomCheckerSlice.reducer;
