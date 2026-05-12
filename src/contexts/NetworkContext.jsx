import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from '../config/api.config';
import { useToast } from './ToastContext';
import { I18n } from 'i18n-js';
import en from '../locales/en.json';
import tl from '../locales/tl.json';
import ceb from '../locales/ceb.json';
import StorageService from '../services/storage';

/**
 * Network Context
 * Provides network connectivity status and estimated download speed throughout the app.
 * Speed is used by the loading screen to show dynamic, connection-aware progress.
 */

const DEFAULT_SPEED = 2; // Mbps fallback
const FAST_MBPS = 5;
const MEDIUM_MBPS = 1;

function getTierFromMbps(mbps) {
  if (mbps >= FAST_MBPS) return 'fast';
  if (mbps >= MEDIUM_MBPS) return 'medium';
  return 'slow';
}

async function estimateSpeedFromFetch() {
  const url = `${API_CONFIG.baseURL.replace(/\/$/, '')}/?t=${Date.now()}`;
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeoutId);
    const elapsed = (Date.now() - start) / 1000;
    if (elapsed <= 0) return DEFAULT_SPEED;
    if (elapsed < 0.3) return 8;
    if (elapsed < 0.8) return 4;
    if (elapsed < 2) return 2;
    return 0.5;
  } catch {
    clearTimeout(timeoutId);
    return 0.5;
  }
}

const NetworkContext = createContext({
  isConnected: true,
  isInternetReachable: true,
  connectionType: 'unknown',
  downloadSpeed: DEFAULT_SPEED,
  speedTier: 'medium',
});

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ children }) => {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    isInternetReachable: true,
    connectionType: 'unknown',
    downloadSpeed: DEFAULT_SPEED,
    speedTier: getTierFromMbps(DEFAULT_SPEED),
  });
  const speedCheckDone = useRef(false);
  const previousConnectionState = useRef(true);
  const isInitialMount = useRef(true);
  const { showToast } = useToast();
  
  // Initialize i18n for translations
  const i18nRef = useRef(null);
  if (!i18nRef.current) {
    i18nRef.current = new I18n({ en, tl, ceb });
    i18nRef.current.defaultLocale = 'en';
    i18nRef.current.enableFallback = true;
  }
  
  // Load current language
  useEffect(() => {
    StorageService.getLanguage().then(lang => {
      if (lang && i18nRef.current) {
        i18nRef.current.locale = lang;
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newConnectionState = state.isConnected ?? true;
      
      setNetworkState(prev => {
        const next = {
          ...prev,
          isConnected: newConnectionState,
          isInternetReachable: state.isInternetReachable ?? true,
          connectionType: state.type || 'unknown',
        };
        const downlink = state.details?.downlink;
        if (typeof downlink === 'number' && downlink >= 0) {
          next.downloadSpeed = downlink;
          next.speedTier = getTierFromMbps(downlink);
        }
        return next;
      });

      // Show toast notifications for connection changes (skip initial mount)
      if (!isInitialMount.current && previousConnectionState.current !== newConnectionState) {
        const i18n = i18nRef.current;
        if (!newConnectionState) {
          // Connection lost
          showToast(i18n.t('network.offline'), 'error', 3000);
        } else {
          // Connection restored
          showToast(i18n.t('network.backOnline'), 'success', 3000);
        }
      }
      
      previousConnectionState.current = newConnectionState;

      if (__DEV__) {
        console.log('Network state changed:', {
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          type: state.type,
          downlink: state.details?.downlink,
        });
      }
    });

    NetInfo.fetch().then(state => {
      setNetworkState(prev => {
        const next = {
          ...prev,
          isConnected: state.isConnected ?? true,
          isInternetReachable: state.isInternetReachable ?? true,
          connectionType: state.type || 'unknown',
        };
        const downlink = state.details?.downlink;
        if (typeof downlink === 'number' && downlink >= 0) {
          next.downloadSpeed = downlink;
          next.speedTier = getTierFromMbps(downlink);
        }
        return next;
      });
      
      // Set initial connection state
      previousConnectionState.current = state.isConnected ?? true;
      isInitialMount.current = false;
    });

    return () => unsubscribe();
  }, [showToast]);

  useEffect(() => {
    if (speedCheckDone.current) return;
    if (!networkState.isConnected) return;
    speedCheckDone.current = true;
    estimateSpeedFromFetch().then(estimatedMbps => {
      setNetworkState(prev => {
        const useEstimated = prev.downloadSpeed == null || prev.downloadSpeed === DEFAULT_SPEED;
        const mbps = useEstimated ? estimatedMbps : prev.downloadSpeed;
        return {
          ...prev,
          downloadSpeed: mbps,
          speedTier: getTierFromMbps(mbps),
        };
      });
    });
  }, [networkState.isConnected]);

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContext;
