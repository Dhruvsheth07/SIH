import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BeakerIcon, 
  VideoCameraIcon, 
  CubeIcon, 
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  currentPath: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: t('navigation.home'),
      href: '/dashboard',
      icon: HomeIcon,
      current: currentPath === '/dashboard',
    },
    {
      name: t('navigation.healthRecords'),
      href: '/health-records',
      icon: DocumentTextIcon,
      current: currentPath === '/health-records',
    },
    {
      name: t('navigation.symptomChecker'),
      href: '/symptom-checker',
      icon: BeakerIcon,
      current: currentPath === '/symptom-checker',
    },
    {
      name: t('navigation.videoConsultation'),
      href: '/video-consultation',
      icon: VideoCameraIcon,
      current: currentPath === '/video-consultation',
    },
    {
      name: t('navigation.medicineStock'),
      href: '/medicine-stock',
      icon: CubeIcon,
      current: currentPath === '/medicine-stock',
    },
    {
      name: t('navigation.emergency'),
      href: '/emergency',
      icon: ExclamationTriangleIcon,
      current: currentPath === '/emergency',
    },
    {
      name: t('common.profile'),
      href: '/profile',
      icon: UserIcon,
      current: currentPath === '/profile',
    },
  ];

  return (
    <nav className="mt-5 px-2">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={`${
                item.current
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200`}
            >
              <Icon
                className={`${
                  item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-6 w-6`}
                aria-hidden="true"
              />
              {item.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
