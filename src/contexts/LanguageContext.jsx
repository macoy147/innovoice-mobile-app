import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import StorageService from '../services/storage';

// Import translations
import en from '../locales/en.json';
import tl from '../locales/tl.json';
import ceb from '../locales/ceb.json';

/**
 * Language Context
 * Provides multi-language support throughout the app
 */

const LanguageContext = createContext({
  currentLanguage: 'en',
  setLanguage: () => { },
  t: () => '',
  availableLanguages: [],
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [i18n] = useState(() => {
    const i18nInstance = new I18n({
      en,
      tl,
      ceb,
    });

    // Set default locale
    i18nInstance.defaultLocale = 'en';
    i18nInstance.enableFallback = true;

    return i18nInstance;
  });

  // Available languages
  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog' },
    { code: 'ceb', name: 'Bisaya', nativeName: 'Bisaya' },
  ];

  // Load saved language preference on mount
  useEffect(() => {
    loadLanguagePreference();
  }, []);

  // Update i18n locale synchronously during render so translations update instantly
  i18n.locale = currentLanguage;

  /**
   * Load language preference from storage
   */
  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await StorageService.getLanguage();

      if (savedLanguage && ['en', 'tl', 'ceb'].includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      } else {
        // Use device locale if available
        const deviceLocale = Localization.locale.split('-')[0];
        if (['en', 'tl', 'ceb'].includes(deviceLocale)) {
          setCurrentLanguage(deviceLocale);
        }
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  /**
   * Change language and persist preference
   * @param {string} languageCode - Language code (en, tl, ceb)
   */
  const setLanguage = async (languageCode) => {
    try {
      if (!['en', 'tl', 'ceb'].includes(languageCode)) {
        console.error('Invalid language code:', languageCode);
        return;
      }

      setCurrentLanguage(languageCode);
      await StorageService.saveLanguage(languageCode);

      if (__DEV__) {
        console.log('Language changed to:', languageCode);
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  /**
   * Translation function
   * @param {string} key - Translation key
   * @param {Object} params - Optional parameters for interpolation
   * @returns {string} Translated string
   */
  const t = (key, params = {}) => {
    return i18n.t(key, params);
  };

  const value = {
    currentLanguage,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
