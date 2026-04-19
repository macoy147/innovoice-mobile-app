import React, { createContext, useContext, useState, useEffect } from 'react';
import { draftService } from '../services/draftService';
import StorageService from '../services/storage';
import apiService from '../services/api';
import { API_CONFIG } from '../config/api.config';

/**
 * App Context
 * Provides global app state and configuration
 */

const AppContext = createContext({
  config: {},
  drafts: [],
  draftCount: 0,
  addDraft: () => { },
  updateDraft: () => { },
  removeDraft: () => { },
  getDrafts: () => { },
  refreshDrafts: () => { },
});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [drafts, setDrafts] = useState([]);
  const [draftCount, setDraftCount] = useState(0);

  // App configuration
  const config = {
    apiBaseUrl: API_CONFIG.baseURL,
    maxPhotoSize: 2 * 1024 * 1024, // 2MB in bytes
    supportedLanguages: ['en', 'tl', 'ceb'],
    categories: [
      { value: 'academic', label: 'Academic' },
      { value: 'administrative', label: 'Administrative' },
      { value: 'extracurricular', label: 'Extracurricular' },
      { value: 'general', label: 'General' },
    ],
    yearLevels: [
      { value: '1st Year', label: '1st Year' },
      { value: '2nd Year', label: '2nd Year' },
      { value: '3rd Year', label: '3rd Year' },
      { value: '4th Year', label: '4th Year' },
    ],
    programs: [
      { value: 'BSIT', label: 'BSIT' },
      { value: 'BSHM', label: 'BSHM' },
      { value: 'BSIE', label: 'BSIE' },
      { value: 'BSFi', label: 'BSFi' },
      { value: 'BIT - Computer Technology', label: 'BIT - Computer Technology' },
      { value: 'BIT - Automotive', label: 'BIT - Automotive' },
      { value: 'BIT - Electronics', label: 'BIT - Electronics' },
      { value: 'BSED-MATH', label: 'BSED-MATH' },
      { value: 'BEED', label: 'BEED' },
      { value: 'BTLED-HE', label: 'BTLED-HE' },
    ],
    statusColors: {
      submitted: '#3b82f6', // blue
      under_review: '#f59e0b', // amber
      forwarded: '#8b5cf6', // purple
      action_taken: '#10b981', // green
      resolved: '#059669', // emerald
      rejected: '#ef4444', // red
    },
    priorityColors: {
      low: '#6b7280', // gray
      medium: '#f59e0b', // amber
      high: '#f97316', // orange
      urgent: '#ef4444', // red
    },
  };

  // Load drafts on mount
  useEffect(() => {
    refreshDrafts();
  }, []);

  /**
   * Refresh drafts from storage
   */
  const refreshDrafts = async () => {
    try {
      console.log('AppContext.refreshDrafts() - Starting');
      const allDrafts = await draftService.getAllDrafts();
      console.log('AppContext.refreshDrafts() - Got drafts:', allDrafts.length);
      setDrafts(allDrafts);
      setDraftCount(allDrafts.length);
      console.log('AppContext.refreshDrafts() - State updated');
    } catch (error) {
      console.error('Error refreshing drafts:', error);
    }
  };

  /**
   * Add a new draft
   * @param {Object} draftData - Draft data
   * @returns {Promise<Object>} Created draft
   */
  const addDraft = async (draftData) => {
    try {
      const newDraft = await draftService.createDraft(draftData);
      await refreshDrafts();
      return newDraft;
    } catch (error) {
      console.error('Error adding draft:', error);
      throw error;
    }
  };

  /**
   * Update an existing draft
   * @param {string} draftId - Draft ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated draft
   */
  const updateDraft = async (draftId, updates) => {
    try {
      const updatedDraft = await draftService.updateDraft(draftId, updates);
      await refreshDrafts();
      return updatedDraft;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
  };

  /**
   * Remove a draft
   * @param {string} draftId - Draft ID
   * @returns {Promise<void>}
   */
  const removeDraft = async (draftId) => {
    try {
      await draftService.deleteDraft(draftId);
      await refreshDrafts();
    } catch (error) {
      console.error('Error removing draft:', error);
      throw error;
    }
  };

  /**
   * Get all drafts
   * @returns {Array} Array of drafts
   */
  const getDrafts = () => {
    return drafts;
  };

  const value = {
    config,
    drafts,
    draftCount,
    addDraft,
    updateDraft,
    removeDraft,
    getDrafts,
    refreshDrafts,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
