import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Medicine, Prescription, MedicineStockState } from '../../types';

// Async thunks
export const fetchMedicineStock = createAsyncThunk(
  'medicineStock/fetchMedicineStock',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock medicine stock data
      const mockMedicines: Medicine[] = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          genericName: 'Acetaminophen',
          manufacturer: 'ABC Pharma',
          dosage: '500mg',
          form: 'tablet',
          stock: 100,
          price: 2.50,
          expiryDate: '2025-12-31',
          pharmacyId: 'pharmacy1',
        },
        {
          id: '2',
          name: 'Amoxicillin 250mg',
          genericName: 'Amoxicillin',
          manufacturer: 'XYZ Pharma',
          dosage: '250mg',
          form: 'capsule',
          stock: 50,
          price: 5.00,
          expiryDate: '2025-06-30',
          pharmacyId: 'pharmacy1',
        },
        {
          id: '3',
          name: 'Cough Syrup',
          genericName: 'Dextromethorphan',
          manufacturer: 'DEF Pharma',
          dosage: '15ml',
          form: 'syrup',
          stock: 25,
          price: 8.00,
          expiryDate: '2025-03-31',
          pharmacyId: 'pharmacy2',
        },
      ];
      
      return mockMedicines;
    } catch (error) {
      return rejectWithValue('Failed to fetch medicine stock');
    }
  }
);

export const fetchPrescriptions = createAsyncThunk(
  'medicineStock/fetchPrescriptions',
  async (patientId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock prescriptions data
      const mockPrescriptions: Prescription[] = [
        {
          id: '1',
          patientId,
          doctorId: 'doctor1',
          doctorName: 'Dr. Sarah Johnson',
          medicines: [
            {
              medicineId: '1',
              name: 'Paracetamol 500mg',
              dosage: '1 tablet',
              frequency: '3 times daily',
              duration: '5 days',
              instructions: 'Take with food',
            },
            {
              medicineId: '2',
              name: 'Amoxicillin 250mg',
              dosage: '1 capsule',
              frequency: '2 times daily',
              duration: '7 days',
              instructions: 'Take on empty stomach',
            },
          ],
          diagnosis: 'Upper respiratory tract infection',
          notes: 'Patient should rest and stay hydrated',
          issuedAt: '2024-01-15T10:00:00Z',
          validUntil: '2024-02-15T10:00:00Z',
        },
      ];
      
      return mockPrescriptions;
    } catch (error) {
      return rejectWithValue('Failed to fetch prescriptions');
    }
  }
);

export const fetchNearbyPharmacies = createAsyncThunk(
  'medicineStock/fetchNearbyPharmacies',
  async (location: { latitude: number; longitude: number }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock nearby pharmacies
      const mockPharmacies = [
        {
          id: 'pharmacy1',
          name: 'City Pharmacy',
          address: '123 Main Street, New Delhi',
          phone: '+91-9876543210',
          distance: 0.5,
          isOpen: true,
        },
        {
          id: 'pharmacy2',
          name: 'Health Plus Pharmacy',
          address: '456 Park Avenue, New Delhi',
          phone: '+91-9876543211',
          distance: 1.2,
          isOpen: true,
        },
        {
          id: 'pharmacy3',
          name: 'MediCare Pharmacy',
          address: '789 Central Road, New Delhi',
          phone: '+91-9876543212',
          distance: 2.1,
          isOpen: false,
        },
      ];
      
      return mockPharmacies;
    } catch (error) {
      return rejectWithValue('Failed to fetch nearby pharmacies');
    }
  }
);

export const syncMedicineStock = createAsyncThunk(
  'medicineStock/syncMedicineStock',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate sync with server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { lastSyncAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue('Failed to sync medicine stock');
    }
  }
);

const initialState: MedicineStockState = {
  medicines: [],
  prescriptions: [],
  nearbyPharmacies: [],
  isLoading: false,
  error: null,
  lastSyncAt: null,
};

const medicineStockSlice = createSlice({
  name: 'medicineStock',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateMedicineStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      const medicine = state.medicines.find(m => m.id === action.payload.id);
      if (medicine) {
        medicine.stock = action.payload.stock;
      }
    },
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch medicine stock
      .addCase(fetchMedicineStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicineStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicines = action.payload;
        state.error = null;
      })
      .addCase(fetchMedicineStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch prescriptions
      .addCase(fetchPrescriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prescriptions = action.payload;
        state.error = null;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch nearby pharmacies
      .addCase(fetchNearbyPharmacies.fulfilled, (state, action) => {
        state.nearbyPharmacies = action.payload;
      })
      // Sync medicine stock
      .addCase(syncMedicineStock.fulfilled, (state, action) => {
        state.lastSyncAt = action.payload.lastSyncAt;
      });
  },
});

export const { clearError, updateMedicineStock, addPrescription } = medicineStockSlice.actions;
export default medicineStockSlice.reducer;
