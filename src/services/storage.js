import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  DRAFTS: '@innovoice:drafts',
  LANGUAGE: '@innovoice:language',
  TRACKING_CODES: '@innovoice:savedTrackingCodes',
  LAST_SYNC: '@innovoice:lastSync',
  ONBOARDING_COMPLETED: '@innovoice:onboardingCompleted',
};

/**
 * Storage Service - Wrapper for AsyncStorage operations
 * Handles drafts, language preferences, and tracking codes
 */
class StorageService {
  // ==================== DRAFTS ====================

  /**
   * Save a draft to local storage
   * @param {Object} draft - Draft object to save
   * @returns {Promise<void>}
   */
  async saveDraft(draft) {
    try {
      console.log('[Storage] Saving draft:', draft.id);
      const drafts = await this.getDrafts();
      const existingIndex = drafts.findIndex(d => d.id === draft.id);

      if (existingIndex >= 0) {
        drafts[existingIndex] = draft;
        console.log('[Storage] Updated existing draft at index:', existingIndex);
      } else {
        drafts.push(draft);
        console.log('[Storage] Added new draft, total drafts:', drafts.length);
      }

      const draftsJson = JSON.stringify(drafts);
      console.log('[Storage] Draft JSON size:', draftsJson.length, 'characters');
      
      await AsyncStorage.setItem(STORAGE_KEYS.DRAFTS, draftsJson);
      console.log('[Storage] Draft saved successfully');
    } catch (error) {
      console.error('[Storage] Error saving draft:', error);
      console.error('[Storage] Error details:', {
        message: error.message,
        stack: error.stack,
        draftId: draft?.id
      });
      throw new Error('Failed to save draft: ' + error.message);
    }
  }

  /**
   * Get all drafts from local storage
   * @returns {Promise<Array>} Array of draft objects
   */
  async getDrafts() {
    try {
      const draftsJson = await AsyncStorage.getItem(STORAGE_KEYS.DRAFTS);
      return draftsJson ? JSON.parse(draftsJson) : [];
    } catch (error) {
      console.error('Error getting drafts:', error);
      return [];
    }
  }

  /**
   * Remove a specific draft from local storage
   * @param {string} draftId - ID of the draft to remove
   * @returns {Promise<void>}
   */
  async removeDraft(draftId) {
    try {
      const drafts = await this.getDrafts();
      const filteredDrafts = drafts.filter(d => d.id !== draftId);
      await AsyncStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(filteredDrafts));
    } catch (error) {
      console.error('Error removing draft:', error);
      throw new Error('Failed to remove draft');
    }
  }

  /**
   * Clear all drafts from local storage
   * @returns {Promise<void>}
   */
  async clearDrafts() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing drafts:', error);
      throw new Error('Failed to clear drafts');
    }
  }

  // ==================== LANGUAGE ====================

  /**
   * Save language preference
   * @param {string} lang - Language code (en, tl, ceb)
   * @returns {Promise<void>}
   */
  async saveLanguage(lang) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error('Error saving language:', error);
      throw new Error('Failed to save language preference');
    }
  }

  /**
   * Get saved language preference
   * @returns {Promise<string>} Language code or 'en' as default
   */
  async getLanguage() {
    try {
      const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return lang || 'en';
    } catch (error) {
      console.error('Error getting language:', error);
      return 'en';
    }
  }

  // ==================== TRACKING CODES ====================

  /**
   * Save a tracking code to the saved list
   * @param {string} code - Tracking code to save
   * @returns {Promise<void>}
   */
  async saveTrackingCode(code) {
    try {
      const codes = await this.getSavedTrackingCodes();

      // Avoid duplicates
      if (!codes.includes(code)) {
        codes.unshift(code); // Add to beginning
        await AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CODES, JSON.stringify(codes));
      }
    } catch (error) {
      console.error('Error saving tracking code:', error);
      throw new Error('Failed to save tracking code');
    }
  }

  /**
   * Get all saved tracking codes
   * @returns {Promise<Array<string>>} Array of tracking codes
   */
  async getSavedTrackingCodes() {
    try {
      const codesJson = await AsyncStorage.getItem(STORAGE_KEYS.TRACKING_CODES);
      return codesJson ? JSON.parse(codesJson) : [];
    } catch (error) {
      console.error('Error getting tracking codes:', error);
      return [];
    }
  }

  /**
   * Remove a tracking code from the saved list
   * @param {string} code - Tracking code to remove
   * @returns {Promise<void>}
   */
  async removeTrackingCode(code) {
    try {
      const codes = await this.getSavedTrackingCodes();
      const filteredCodes = codes.filter(c => c !== code);
      await AsyncStorage.setItem(STORAGE_KEYS.TRACKING_CODES, JSON.stringify(filteredCodes));
    } catch (error) {
      console.error('Error removing tracking code:', error);
      throw new Error('Failed to remove tracking code');
    }
  }

  // ==================== SYNC ====================

  /**
   * Save last sync timestamp
   * @param {string} timestamp - ISO 8601 timestamp
   * @returns {Promise<void>}
   */
  async saveLastSync(timestamp) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
    } catch (error) {
      console.error('Error saving last sync:', error);
    }
  }

  /**
   * Get last sync timestamp
   * @returns {Promise<string|null>} ISO 8601 timestamp or null
   */
  async getLastSync() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  }

  // ==================== UTILITY ====================

  // ==================== ONBOARDING ====================

  /**
   * Mark onboarding as completed
   * @returns {Promise<void>}
   */
  async setOnboardingCompleted() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  }

  /**
   * Check if onboarding has been completed
   * @returns {Promise<boolean>}
   */
  async isOnboardingCompleted() {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  // ==================== UTILITY ====================

  /**
   * Clear all app data from storage
   * @returns {Promise<void>}
   */
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.DRAFTS,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.TRACKING_CODES,
        STORAGE_KEYS.LAST_SYNC,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
      ]);
    } catch (error) {
      console.error('Error clearing all storage:', error);
      throw new Error('Failed to clear storage');
    }
  }
}

// Export singleton instance
export default new StorageService();
