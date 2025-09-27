import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t('common.profile')}
        </h1>
        <p className="text-gray-600">
          User profile and settings will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
