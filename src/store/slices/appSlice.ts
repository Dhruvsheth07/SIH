import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  language: string;
  isOnline: boolean;
  lastSyncAt: string | null;
  isInitialized: boolean;
}

const initialState: AppState = {
  language: 'en',
  isOnline: navigator.onLine,
  lastSyncAt: null,
  isInitialized: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLastSyncAt: (state, action: PayloadAction<string>) => {
      state.lastSyncAt = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setLanguage, setOnlineStatus, setLastSyncAt, setInitialized } = appSlice.actions;
export default appSlice.reducer;
