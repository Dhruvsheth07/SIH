import React from 'react';
import { useTranslation } from 'react-i18next';

const MedicineStockPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t('medicineStock.title')}
        </h1>
        <p className="text-gray-600">
          Medicine Stock & Prescriptions module will be implemented here with offline caching.
        </p>
      </div>
    </div>
  );
};

export default MedicineStockPage;
