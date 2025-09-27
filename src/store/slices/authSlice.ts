import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

// Async thunks
export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (credentials: { phoneNumber: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock password verification - in real app, this would call your API
      // For demo purposes, accept any password
      if (credentials.phoneNumber && credentials.password) {
        const mockUser: User = {
          id: '1',
          phoneNumber: credentials.phoneNumber,
          name: 'John Doe',
          aadhaarHash: 'encrypted_hash_123',
          isVerified: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        
        return mockUser;
      } else {
        return rejectWithValue('Invalid credentials');
      }
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

export const verifyAadhaar = createAsyncThunk(
  'auth/verifyAadhaar',
  async (aadhaarData: { aadhaarNumber: string; name: string }, { rejectWithValue }) => {
    try {
      // Simulate Aadhaar verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification success
      return {
        isVerified: true,
        aadhaarHash: `encrypted_${aadhaarData.aadhaarNumber}`,
      };
    } catch (error) {
      return rejectWithValue('Aadhaar verification failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear any stored tokens or session data
      localStorage.removeItem('authToken');
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login with Password
      .addCase(loginWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify Aadhaar
      .addCase(verifyAadhaar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyAadhaar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.aadhaarHash = action.payload.aadhaarHash;
          state.user.isVerified = action.payload.isVerified;
        }
        state.error = null;
      })
      .addCase(verifyAadhaar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
