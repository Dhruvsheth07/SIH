import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import healthRecordsReducer from './slices/healthRecordsSlice';
import symptomCheckerReducer from './slices/symptomCheckerSlice';
import videoConsultationReducer from './slices/videoConsultationSlice';
import sosReducer from './slices/sosSlice';
import medicineStockReducer from './slices/medicineStockSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    healthRecords: healthRecordsReducer,
    symptomChecker: symptomCheckerReducer,
    videoConsultation: videoConsultationReducer,
    sos: sosReducer,
    medicineStock: medicineStockReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
