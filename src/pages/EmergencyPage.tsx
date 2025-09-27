import React from 'react';
import { useTranslation } from 'react-i18next';

const EmergencyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t('sos.title')}
        </h1>
        <p className="text-gray-600">
          Emergency SOS module will be implemented here with GPS and SMS capabilities.
        </p>
      </div>
    </div>
  );
};

export default EmergencyPage;
