import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en_translation.json';
import es from './locales/es_translation.json';
import zh from './locales/zh_translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
