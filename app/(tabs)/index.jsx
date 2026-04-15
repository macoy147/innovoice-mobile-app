import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SubmissionForm } from '../../src/components/submission/SubmissionForm';
import { useNetwork } from '../../src/contexts/NetworkContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useToast } from '../../src/contexts/ToastContext';
import { useApp } from '../../src/contexts/AppContext';
import { draftService } from '../../src/services/draftService';
import { colors } from '../../src/styles/colors';
import { SPACING } from '../../src/styles/spacing';

export default function SubmissionScreen() {
  const { isConnected } = useNetwork();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { refreshDrafts } = useApp();
  const params = useLocalSearchParams();
  const [initialData, setInitialData] = useState(null);
  const [editDraftId, setEditDraftId] = useState(null);

  // Handle deep link parameters (QR code) and edit draft from Settings
  useEffect(() => {
    if (params.editDraftId) {
      setEditDraftId(params.editDraftId);
      draftService.getDraft(params.editDraftId).then((draft) => {
        if (draft) setInitialData(draft);
      });
      return;
    }
    // Only clear editing state when navigating with explicit params (e.g. QR code deep link).
    // When params are empty (tab refocus), preserve editDraftId so in-progress edits aren't lost.
    if (params.category) {
      setEditDraftId(null);
      const validCategories = ['academic', 'administrative', 'extracurricular', 'general'];
      if (validCategories.includes(params.category)) {
        setInitialData({
          category: params.category,
          title: params.title || '',
          content: params.content || '',
        });
      } else {
        setInitialData(null);
      }
    }
  // _editTs is a unique timestamp that ensures the effect re-runs even when
  // editing the same draft ID consecutively (otherwise React skips re-execution).
  }, [params.category, params.title, params.content, params.editDraftId, params._editTs]);

  const handleSubmitSuccess = async (trackingCode) => {
    // Save tracking code for later reference
    try {
      await draftService.saveTrackingCode(trackingCode);
    } catch (error) {
      console.error('Failed to save tracking code:', error);
    }
    if (editDraftId) {
      try {
        await draftService.deleteDraft(editDraftId);
        await refreshDrafts();
      } catch (e) {
        console.error('Failed to delete draft after submit:', e);
      }
      setEditDraftId(null);
    }
    setInitialData(null);
  };

  const handleSaveDraft = async (formData) => {
    try {
      // If we're editing an existing draft, update it; otherwise create new
      if (editDraftId) {
        await draftService.updateDraft(editDraftId, formData);
        await refreshDrafts();
        showToast(t('submission.draftUpdated'), 'success');
        // Clear edit state after successful update
        setEditDraftId(null);
        setInitialData(null);
      } else {
        await draftService.saveDraft(formData);
        await refreshDrafts();
        showToast(t('submission.draftSaved'), 'success');
      }
    } catch (error) {
      showToast(t('errors.submissionFailed'), 'error');
    }
  };

  return (
    <View style={styles.container}>
      <SubmissionForm
        initialData={initialData}
        onSubmitSuccess={handleSubmitSuccess}
        onSaveDraft={handleSaveDraft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
