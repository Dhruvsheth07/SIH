import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginWithPassword, verifyAadhaar } from '../store/slices/authSlice';
import LanguageSelector from '../components/LanguageSelector';
import { setLanguage } from '../store/slices/appSlice';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.app);

  const [step, setStep] = useState<'login' | 'aadhaar'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarName, setAadhaarName] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !password.trim()) return;

    try {
      await dispatch(loginWithPassword({ phoneNumber, password })).unwrap();
      setStep('aadhaar');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarNumber.trim() || !aadhaarName.trim()) return;

    try {
      await dispatch(verifyAadhaar({
        aadhaarNumber,
        name: aadhaarName,
      })).unwrap();
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Aadhaar verification failed:', error);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage));
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('common.appName', 'Patient Portal')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.loginSubtitle', 'Access your health records and connect with doctors')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Login Step */}
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t('auth.phoneNumber')}
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t('auth.enterPhoneNumber')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('auth.password')}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.enterPassword')}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !phoneNumber.trim() || !password.trim()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </button>
              </div>
            </form>
          )}


          {/* Aadhaar Verification Step */}
          {step === 'aadhaar' && (
            <form onSubmit={handleAadhaarSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('auth.aadhaarVerification')}
                </h3>
              </div>

              <div>
                <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                  Aadhaar Number
                </label>
                <div className="mt-1">
                  <input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="Enter 12-digit Aadhaar number"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="aadhaarName" className="block text-sm font-medium text-gray-700">
                  Full Name (as on Aadhaar)
                </label>
                <div className="mt-1">
                  <input
                    id="aadhaarName"
                    name="aadhaarName"
                    type="text"
                    required
                    value={aadhaarName}
                    onChange={(e) => setAadhaarName(e.target.value)}
                    placeholder="Enter your full name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a demo. In the real app, you would:
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Upload Aadhaar card image</li>
                    <li>Take a selfie for face verification</li>
                    <li>OCR will extract details from Aadhaar</li>
                    <li>Face verification will match selfie with Aadhaar photo</li>
                  </ul>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !aadhaarNumber.trim() || !aadhaarName.trim()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('common.loading') : t('auth.verifyAadhaar', 'Verify Aadhaar')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
