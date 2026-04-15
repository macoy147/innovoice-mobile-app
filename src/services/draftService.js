import StorageService from './storage';

/**
 * Generate a simple UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Draft Service - Manages draft submissions
 * Provides CRUD operations for draft incident reports
 */
class DraftService {
  /**
   * Create a new draft
   * @param {Object} draftData - Draft data
   * @param {string} draftData.category - Category
   * @param {string} draftData.title - Title
   * @param {string} draftData.content - Content
   * @param {boolean} draftData.isAnonymous - Anonymous flag
   * @param {Object|null} draftData.submitter - Submitter info
   * @param {Object|null} draftData.photo - Photo data
   * @returns {Promise<Object>} Created draft with ID and timestamps
   */
  async createDraft(draftData) {
    try {
      const now = new Date().toISOString();
      
      const draft = {
        id: generateUUID(),
        category: draftData.category || '',
        title: draftData.title || '',
        content: draftData.content || '',
        isAnonymous: draftData.isAnonymous !== undefined ? draftData.isAnonymous : true,
        submitter: draftData.submitter || {
          name: '',
          studentId: '',
          email: '',
          contactNumber: '',
          program: '',
          yearLevel: '',
          wantsFollowUp: false,
        },
        photo: draftData.photo || null,
        createdAt: now,
        updatedAt: now,
      };

      await StorageService.saveDraft(draft);
      return draft;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw new Error('Failed to create draft');
    }
  }

  /**
   * Update an existing draft
   * @param {string} draftId - Draft ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated draft
   */
  async updateDraft(draftId, updates) {
    try {
      const drafts = await StorageService.getDrafts();
      const draftIndex = drafts.findIndex(d => d.id === draftId);

      if (draftIndex === -1) {
        throw new Error('Draft not found');
      }

      const updatedDraft = {
        ...drafts[draftIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await StorageService.saveDraft(updatedDraft);
      return updatedDraft;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw new Error('Failed to update draft');
    }
  }

  /**
   * Delete a draft
   * @param {string} draftId - Draft ID
   * @returns {Promise<void>}
   */
  async deleteDraft(draftId) {
    try {
      await StorageService.removeDraft(draftId);
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw new Error('Failed to delete draft');
    }
  }

  /**
   * Get a specific draft by ID
   * @param {string} draftId - Draft ID
   * @returns {Promise<Object|null>} Draft object or null if not found
   */
  async getDraft(draftId) {
    try {
      const drafts = await StorageService.getDrafts();
      return drafts.find(d => d.id === draftId) || null;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  /**
   * Get all drafts
   * @returns {Promise<Array>} Array of draft objects, sorted by updatedAt (newest first)
   */
  async getAllDrafts() {
    try {
      const drafts = await StorageService.getDrafts();
      
      // Sort by updatedAt, newest first
      return drafts.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    } catch (error) {
      console.error('Error getting all drafts:', error);
      return [];
    }
  }

  /**
   * Get draft count
   * @returns {Promise<number>} Number of drafts
   */
  async getDraftCount() {
    try {
      const drafts = await StorageService.getDrafts();
      return drafts.length;
    } catch (error) {
      console.error('Error getting draft count:', error);
      return 0;
    }
  }

  /**
   * Clear all drafts
   * @returns {Promise<void>}
   */
  async clearAllDrafts() {
    try {
      await StorageService.clearDrafts();
    } catch (error) {
      console.error('Error clearing all drafts:', error);
      throw new Error('Failed to clear all drafts');
    }
  }

  /**
   * Check if a draft is empty (has no meaningful content)
   * @param {Object} draft - Draft object
   * @returns {boolean} True if draft is empty
   */
  isDraftEmpty(draft) {
    return (
      !draft.title?.trim() &&
      !draft.content?.trim() &&
      !draft.category &&
      !draft.photo
    );
  }

  /**
   * Validate draft data before saving
   * @param {Object} draftData - Draft data to validate
   * @returns {Object} Validation result { isValid: boolean, errors: Array }
   */
  validateDraft(draftData) {
    const errors = [];

    // Category validation
    const validCategories = ['academic', 'administrative', 'extracurricular', 'general'];
    if (draftData.category && !validCategories.includes(draftData.category)) {
      errors.push('Invalid category');
    }

    // Title length validation
    if (draftData.title && draftData.title.length > 200) {
      errors.push('Title exceeds 200 characters');
    }

    // Content length validation
    if (draftData.content && draftData.content.length > 2000) {
      errors.push('Content exceeds 2000 characters');
    }

    // Submitter validation if not anonymous
    if (!draftData.isAnonymous && draftData.submitter) {
      const { email, yearLevel } = draftData.submitter;
      
      // Email format validation (basic)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
      }

      // Year level validation
      const validYearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
      if (yearLevel && !validYearLevels.includes(yearLevel)) {
        errors.push('Invalid year level');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format draft for display (e.g., in a list)
   * @param {Object} draft - Draft object
   * @returns {Object} Formatted draft info
   */
  formatDraftForDisplay(draft) {
    const titlePreview = draft.title || 'Untitled Draft';
    const contentPreview = draft.content 
      ? draft.content.substring(0, 100) + (draft.content.length > 100 ? '...' : '')
      : 'No content';
    
    const updatedDate = new Date(draft.updatedAt);
    const now = new Date();
    const diffMs = now - updatedDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeAgo;
    if (diffMins < 1) {
      timeAgo = 'Just now';
    } else if (diffMins < 60) {
      timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    return {
      id: draft.id,
      titlePreview,
      contentPreview,
      category: draft.category,
      hasPhoto: !!draft.photo,
      timeAgo,
      updatedAt: draft.updatedAt,
    };
  }

  /**
   * Save a draft (alias for createDraft for backward compatibility)
   * @param {Object} draftData - Draft data
   * @returns {Promise<Object>} Created draft
   */
  async saveDraft(draftData) {
    return this.createDraft(draftData);
  }

  /**
   * Save a tracking code
   * @param {string} trackingCode - Tracking code to save
   * @returns {Promise<void>}
   */
  async saveTrackingCode(trackingCode) {
    try {
      await StorageService.saveTrackingCode(trackingCode);
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
      return await StorageService.getSavedTrackingCodes();
    } catch (error) {
      console.error('Error getting saved tracking codes:', error);
      return [];
    }
  }

  /**
   * Remove a tracking code
   * @param {string} trackingCode - Tracking code to remove
   * @returns {Promise<void>}
   */
  async removeTrackingCode(trackingCode) {
    try {
      await StorageService.removeTrackingCode(trackingCode);
    } catch (error) {
      console.error('Error removing tracking code:', error);
      throw new Error('Failed to remove tracking code');
    }
  }
}

// Export singleton instance
const draftService = new DraftService();
export { draftService };
export default draftService;
