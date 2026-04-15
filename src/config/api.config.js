/**
 * API Configuration
 * Manages API endpoints and connection settings.
 *
 * - On device/emulator, "localhost" is the device itself, so we never use it for API.
 * - Default points to the Render-hosted SSG InnoVoice API.
 */
import { Platform } from 'react-native';

export const PRODUCTION_API_BASE_URL = 'https://ssg-innovoice.onrender.com';

const fromEnv = typeof process !== 'undefined' && process.env && process.env.API_BASE_URL;
const isLocalhost = (url) => !url || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
const API_BASE_URL = fromEnv && !isLocalhost(fromEnv) ? fromEnv : PRODUCTION_API_BASE_URL;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  createSubmission: '/api/suggestions',
  trackSubmission: (trackingCode) => `/api/suggestions/track/${trackingCode}`,
  uploadImage: '/api/upload', // If separate endpoint exists
};

export default API_CONFIG;
