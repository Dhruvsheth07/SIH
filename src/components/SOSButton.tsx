import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { activateSOS, deactivateSOS, sendSOSRequest } from '../store/slices/sosSlice';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const SOSButton: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isActive, isLoading } = useAppSelector((state) => state.sos);
  const { user } = useAppSelector((state) => state.auth);
  const { isOnline } = useAppSelector((state) => state.app);

  const [showModal, setShowModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState<'medical' | 'accident' | 'other'>('medical');
  const [message, setMessage] = useState('');

  const handleSOSActivation = () => {
    if (!isActive) {
      setShowModal(true);
    } else {
      dispatch(deactivateSOS());
    }
  };

  const handleSOSSubmit = async () => {
    if (!user) return;

    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: 'Location obtained', // In real app, reverse geocode this
      };

      // Send SOS request
      await dispatch(sendSOSRequest({
        userId: user.id,
        location,
        message: message || 'Emergency assistance needed',
        emergencyType,
      })).unwrap();

      dispatch(activateSOS());
      setShowModal(false);
      setMessage('');
    } catch (error) {
      console.error('Failed to send SOS request:', error);
      
      // Fallback to SMS if online request fails
      if (isOnline) {
        // Show error message
        alert(t('errors.sosFailed'));
      } else {
        // Send SMS fallback
        const smsMessage = `SOS: ${emergencyType} emergency. Location: ${navigator.geolocation ? 'Location services enabled' : 'Location unavailable'}. Message: ${message || 'Emergency assistance needed'}`;
        const smsUrl = `sms:?body=${encodeURIComponent(smsMessage)}`;
        window.open(smsUrl);
        
        dispatch(activateSOS());
        setShowModal(false);
        setMessage('');
      }
    }
  };

  const handleSOSDeactivation = () => {
    dispatch(deactivateSOS());
  };

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={handleSOSActivation}
        disabled={isLoading}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 ${
          isActive
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-red-500 hover:bg-red-600'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center justify-center h-full">
          {isActive ? (
            <XMarkIcon className="h-8 w-8 text-white" />
          ) : (
            <ExclamationTriangleIcon className="h-8 w-8 text-white" />
          )}
        </div>
      </button>

      {/* SOS Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t('sos.activateSOS')}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* Emergency Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t('sos.emergencyType')}
                        </label>
                        <select
                          value={emergencyType}
                          onChange={(e) => setEmergencyType(e.target.value as any)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="medical">{t('sos.medical')}</option>
                          <option value="accident">{t('sos.accident')}</option>
                          <option value="other">{t('sos.other')}</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {t('sos.message')}
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t('sos.enterMessage')}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Location Status */}
                      <div className="text-sm text-gray-600">
                        <p>{t('sos.location')}: {navigator.geolocation ? t('sos.gettingLocation') : t('sos.locationError')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSOSSubmit}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isLoading ? t('common.loading') : t('sos.activateSOS')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOS Active Indicator */}
      {isActive && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 animate-pulse" />
            <span className="font-medium">{t('sos.sosActive')}</span>
            <button
              onClick={handleSOSDeactivation}
              className="ml-2 text-red-200 hover:text-white"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
