import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { initializeDatabase } from './services/database';
import './services/i18n';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HealthRecordsPage from './pages/HealthRecordsPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import VideoConsultationPage from './pages/VideoConsultationPage';
import MedicineStockPage from './pages/MedicineStockPage';
import EmergencyPage from './pages/EmergencyPage';
import ProfilePage from './pages/ProfilePage';

// Import components
import Layout from './components/Layout';
import SOSButton from './components/SOSButton';
import OfflineIndicator from './components/OfflineIndicator';

// Import hooks
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { setOnlineStatus, setInitialized } from './store/slices/appSlice';

function AppContent() {
  const dispatch = useAppDispatch();
  const { isOnline, isInitialized } = useAppSelector((state) => state.app);

  useEffect(() => {
    // Initialize database
    const initApp = async () => {
      try {
        await initializeDatabase();
        dispatch(setInitialized(true));
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch(setInitialized(true)); // Continue anyway
      }
    };

    initApp();

    // Listen for online/offline events
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <OfflineIndicator />
        
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="health-records" element={<HealthRecordsPage />} />
            <Route path="symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="video-consultation" element={<VideoConsultationPage />} />
            <Route path="medicine-stock" element={<MedicineStockPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        {/* SOS Button - always visible */}
        <SOSButton />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;