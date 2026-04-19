import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptic Feedback Utility
 * Provides consistent haptic feedback across the app
 * Gracefully handles platforms that don't support haptics
 */

export const hapticFeedback = {
  /**
   * Light impact - for subtle interactions
   * Use for: button taps, toggle switches
   */
  light: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      // Silently fail if haptics not supported
      console.log('Haptics not supported:', error);
    }
  },

  /**
   * Medium impact - for standard interactions
   * Use for: form submissions, photo selection
   */
  medium: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  },

  /**
   * Heavy impact - for significant interactions
   * Use for: successful submissions, important confirmations
   */
  heavy: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  },

  /**
   * Success notification - for successful operations
   * Use for: form submitted successfully, draft saved
   */
  success: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  },

  /**
   * Warning notification - for warnings
   * Use for: validation errors, offline mode
   */
  warning: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  },

  /**
   * Error notification - for errors
   * Use for: submission failed, network error
   */
  error: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  },

  /**
   * Selection changed - for picker/selector changes
   * Use for: category selection, language change
   */
  selection: async () => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.selectionAsync();
      }
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  },
};

/**
 * Check if haptics are supported on the current device
 */
export const isHapticsSupported = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};
