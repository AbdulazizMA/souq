import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  ar: {
    common: arCommon,
  },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('selectedLanguage');
  
  if (!savedLanguage) {
    // Default to Arabic if device locale is Arabic, otherwise English
    savedLanguage = Localization.locale.startsWith('ar') ? 'ar' : 'en';
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    debug: __DEV__,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });
};

export const changeLanguage = async (language: string) => {
  await AsyncStorage.setItem('selectedLanguage', language);
  i18n.changeLanguage(language);
};

export const isRTL = () => i18n.language === 'ar';

initI18n();

export default i18n; 