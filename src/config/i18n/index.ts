import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from 'config/i18n/locales/en.translation.json'

export const languages = ['en']

i18n.use(initReactI18next).init({
  lng: languages[0],
  fallbackLng: languages[0],
  resources: {
    en: {
      translation: en,
    },
  },
  debug: false,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
