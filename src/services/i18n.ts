import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import paTranslations from '../locales/pa.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  pa: {
    translation: paTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Language names for display
    lng: 'en',
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // React i18next options
    react: {
      useSuspense: false,
    },
  });

// Language configuration
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const changeLanguage = (languageCode: string) => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('i18nextLng', languageCode);
};

export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

export const getLanguageName = (code: string) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.nativeName : code;
};

export default i18n;
