/**
 * App Configuration
 * General app settings and constants
 */

export const APP_CONFIG = {
  appName: 'InnoVoice',
  appVersion: '1.0.0',
  
  // Photo settings
  maxPhotoSizeBytes: 2 * 1024 * 1024, // 2MB
  maxPhotoSizeMB: 2,
  imageQuality: 0.8,
  
  // Supported languages
  supportedLanguages: ['en', 'tl', 'ceb'],
  defaultLanguage: 'en',
  
  // Validation limits
  maxTitleLength: 200,
  maxContentLength: 2000,
  
  // Network
  networkCheckInterval: 5000, // 5 seconds
  
  // Storage keys
  storageKeys: {
    drafts: '@innovoice:drafts',
    language: '@innovoice:language',
    savedTrackingCodes: '@innovoice:savedTrackingCodes',
    lastSync: '@innovoice:lastSync',
  },
};

export default APP_CONFIG;
