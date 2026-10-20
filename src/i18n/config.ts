import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ml from './locales/ml.json';
import ta from './locales/ta.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

const STORAGE_KEY = 'chilly_vendor_lang';

// Safe retrieval of stored language code (only code, nothing sensitive)
const getInitialLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((lang) => lang.code === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'en';
};

const initialLang = getInitialLanguage();

// Set initial html lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ml: { translation: ml },
      ta: { translation: ta },
      hi: { translation: hi },
      kn: { translation: kn },
    },
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Listen to language change to update html lang attribute and store code
i18n.on('languageChanged', (lng: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // Ignore storage errors
    }
  }
});

export default i18n;
