import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchHealthRecords } from '../store/slices/healthRecordsSlice';
import { fetchDoctors } from '../store/slices/videoConsultationSlice';
import { fetchMedicineStock } from '../store/slices/medicineStockSlice';
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  VideoCameraIcon, 
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { records, isLoading: recordsLoading } = useAppSelector((state) => state.healthRecords);
  const { doctors, consultations } = useAppSelector((state) => state.videoConsultation);
  const { medicines, prescriptions } = useAppSelector((state) => state.medicineStock);
  const { isOnline } = useAppSelector((state) => state.app);

  useEffect(() => {
    if (user) {
      // Fetch initial data
      dispatch(fetchHealthRecords(user.id));
      dispatch(fetchDoctors());
      dispatch(fetchMedicineStock());
    }
  }, [dispatch, user]);

  const recentRecords = records.slice(0, 3);
  const upcomingConsultations = consultations.filter(c => c.status === 'scheduled').slice(0, 2);
  const recentPrescriptions = prescriptions.slice(0, 2);

  const quickActions = [
    {
      name: t('navigation.healthRecords'),
      href: '/health-records',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      count: records.length,
    },
    {
      name: t('navigation.symptomChecker'),
      href: '/symptom-checker',
      icon: BeakerIcon,
      color: 'bg-green-500',
    },
    {
      name: t('navigation.videoConsultation'),
      href: '/video-consultation',
      icon: VideoCameraIcon,
      color: 'bg-purple-500',
      count: consultations.length,
    },
    {
      name: t('navigation.medicineStock'),
      href: '/medicine-stock',
      icon: CubeIcon,
      color: 'bg-orange-500',
      count: prescriptions.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('common.welcome', 'Welcome')}, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isOnline ? t('common.online') : t('common.offline')} • {t('common.lastSync')}: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              onClick={() => navigate(action.href)}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <div className={`${action.color} p-3 rounded-md inline-flex`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                  {action.count !== undefined && (
                    <p className="text-sm text-gray-500">{action.count} items</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Health Records */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {t('healthRecords.title')}
            </h3>
            {recordsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">{t('common.loading')}</p>
              </div>
            ) : recentRecords.length > 0 ? (
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.title}</p>
                        <p className="text-sm text-gray-500">{record.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!record.synced && (
                        <ClockIcon className="h-4 w-4 text-yellow-500 mr-2" />
                      )}
                      {record.synced && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/health-records')}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  {t('common.view')} {t('common.all')}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">{t('healthRecords.noRecords')}</p>
                <button
                  onClick={() => navigate('/health-records')}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  {t('healthRecords.addRecord')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {t('videoConsultation.myAppointments')}
            </h3>
            {upcomingConsultations.length > 0 ? (
              <div className="space-y-3">
                {upcomingConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(consultation.scheduledAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(consultation.scheduledAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {consultation.status}
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/video-consultation')}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  {t('common.view')} {t('common.all')}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <VideoCameraIcon className="h-12 w-12 text-gray-300 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">{t('videoConsultation.noAppointments')}</p>
                <button
                  onClick={() => navigate('/video-consultation')}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  {t('videoConsultation.bookAppointment')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-4" />
          <div>
            <h3 className="text-lg font-medium text-red-900">
              {t('sos.title')}
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {t('sos.emergencyDescription', 'In case of emergency, use the red SOS button in the bottom right corner')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
