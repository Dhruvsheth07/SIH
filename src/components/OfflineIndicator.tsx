import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../hooks/redux';
import { WifiIcon } from '@heroicons/react/24/outline';

const OfflineIndicator: React.FC = () => {
  const { t } = useTranslation();
  const { isOnline } = useAppSelector((state) => state.app);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-yellow-500 text-white px-4 py-2 text-center">
      <div className="flex items-center justify-center space-x-2">
        <WifiIcon className="h-5 w-5" />
        <span className="font-medium">
          {t('common.offline')} - {t('common.lastSync')}: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
