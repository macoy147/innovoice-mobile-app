import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useToast, ToastProvider } from '../../src/contexts/ToastContext';
import { useApp } from '../../src/contexts/AppContext';
import { draftService } from '../../src/services/draftService';
import { useNetwork } from '../../src/contexts/NetworkContext';
import apiService from '../../src/services/api';
import { Picker } from '../../src/components/common/Picker';
import { Button } from '../../src/components/common/Button';
import { DraftsList } from '../../src/components/drafts/DraftsList';
import { SuccessModal } from '../../src/components/submission/SuccessModal';
import { PrivacyPolicyModal } from '../../src/components/common/PrivacyPolicyModal';
import { TermsOfUseModal } from '../../src/components/common/TermsOfUseModal';
import { ConfirmDialog } from '../../src/components/common/ConfirmDialog';
import { colors } from '../../src/styles/colors';
import { TYPOGRAPHY } from '../../src/styles/typography';
import { SPACING } from '../../src/styles/spacing';
import { hapticFeedback } from '../../src/utils/haptics';
import Constants from 'expo-constants';
import { validateSubmissionForm } from '../../src/utils/validation';

export default function SettingsScreen() {
  const { currentLanguage, setLanguage, availableLanguages, t } = useLanguage();
  const { isConnected } = useNetwork();
  const { showToast } = useToast();
  const { draftCount, refreshDrafts } = useApp();
  const router = useRouter();
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [successTrackingCode, setSuccessTrackingCode] = useState('');
  const [successAiData, setSuccessAiData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clearAllConfirmVisible, setClearAllConfirmVisible] = useState(false);

  const LANGUAGE_OPTIONS = availableLanguages.map(lang => ({
    label: lang.nativeName,
    value: lang.code
  }));

  const handleLanguageChange = (language) => {
    try {
      hapticFeedback.selection();
      setLanguage(language);
      showToast(t('common.success'), 'success');
    } catch (error) {
      showToast(t('errors.submissionFailed'), 'error');
    }
  };

  const handleViewDrafts = () => {
    if (draftCount === 0) {
      showToast(t('drafts.empty'), 'info');
      return;
    }
    setShowDraftsModal(true);
  };

  const handleEditDraft = (draft) => {
    setShowDraftsModal(false);
    router.replace({ pathname: '/', params: { editDraftId: draft.id, _editTs: Date.now().toString() } });
  };

  const handleSubmitDraft = async (draft) => {
    if (!isConnected) {
      showToast(t('errors.network'), 'error');
      return;
    }
    const validationErrors = validateSubmissionForm(draft);
    if (Object.keys(validationErrors).length > 0) {
      showToast(t('errors.required'), 'error');
      return;
    }
    try {
      const payload = {
        category: draft.category,
        title: draft.title,
        content: draft.content,
        isAnonymous: draft.isAnonymous ?? true,
      };
      if (!draft.isAnonymous && draft.submitter) {
        payload.submitter = {
          name: draft.submitter.name || '',
          studentId: draft.submitter.studentId || '',
          email: draft.submitter.email || '',
          contactNumber: draft.submitter.contactNumber || '',
          program: draft.submitter.program || '',
          yearLevel: draft.submitter.yearLevel || '',
          wantsFollowUp: Boolean(draft.submitter.wantsFollowUp),
        };
      }
      const photoB64 = draft.photo?.base64;
      if (photoB64) {
        payload.image = photoB64.startsWith('data:') ? photoB64 : `data:image/jpeg;base64,${photoB64}`;
      }
      const response = await apiService.createSubmission(payload);
      if (response.success) {
        await draftService.deleteDraft(draft.id);
        await refreshDrafts();
        setShowDraftsModal(false);
        setSuccessTrackingCode(response.data.trackingCode);
        setSuccessAiData({
          priority: response.data.priority,
          reason: response.data.aiPriorityReason,
          analyzed: response.data.aiAnalyzed,
        });
        setShowSuccessModal(true);
      } else if (response.validationErrors?.length > 0) {
        // Show the first specific field error so the user knows what to fix
        const firstError = response.validationErrors[0];
        showToast(firstError.message || t('errors.validationFailed'), 'error');
      } else {
        showToast(response.error || t('errors.submissionFailed'), 'error');
      }
    } catch (err) {
      showToast(err.message || t('errors.submissionFailed'), 'error');
    }
  };

  const handleClearDrafts = () => {
    if (draftCount === 0) {
      showToast(t('drafts.empty'), 'info');
      return;
    }
    setClearAllConfirmVisible(true);
  };

  const confirmClearAll = async () => {
    try {
      await draftService.clearAllDrafts();
      await refreshDrafts();
      showToast(t('drafts.empty'), 'success');
    } catch (error) {
      showToast(t('errors.submissionFailed'), 'error');
    } finally {
      setClearAllConfirmVisible(false);
    }
  };

  const cancelClearAll = () => {
    setClearAllConfirmVisible(false);
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Picker
            label={t('settings.selectLanguage')}
            value={currentLanguage}
            onValueChange={handleLanguageChange}
            items={LANGUAGE_OPTIONS}
            accessibilityLabel={t('settings.selectLanguage')}
          />
        </View>

        {/* Drafts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.drafts')}</Text>
          <View style={styles.draftInfo}>
            <Text style={styles.draftCount}>
              {t('drafts.count', { count: draftCount })}
            </Text>
            {draftCount > 0 && (
              <View style={styles.draftButtons}>
                <Button
                  title={t('settings.viewDrafts')}
                  onPress={handleViewDrafts}
                  variant="outline"
                  style={styles.draftButton}
                />
                <Button
                  title={t('common.delete')}
                  onPress={handleClearDrafts}
                  variant="outline"
                  style={styles.draftButton}
                />
              </View>
            )}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>{t('app.name')}</Text>
            <Text style={styles.aboutSubtitle}>
              {t('app.tagline')}
            </Text>
            <Text style={styles.aboutVersion}>{t('settings.version')} {appVersion}</Text>
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => setShowPrivacyModal(true)}
            accessibilityLabel={t('settings.privacyPolicy')}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>{t('settings.privacyPolicy')}</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => setShowTermsModal(true)}
            accessibilityLabel={t('settings.termsOfUse')}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>{t('settings.termsOfUse')}</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 CTU Daanbantayan Campus
          </Text>
          <Text style={styles.footerText}>
            Supreme Student Government
          </Text>
        </View>
      </ScrollView>

      {/* Drafts Modal */}
      <Modal
        visible={showDraftsModal}
        animationType="slide"
        onRequestClose={() => { refreshDrafts(); setShowDraftsModal(false); }}
      >
        <ToastProvider>
          <View style={styles.draftsModalContainer}>
            <View style={styles.draftsModalHeader}>
              <Text style={styles.draftsModalTitle}>{t('drafts.title')}</Text>
              <TouchableOpacity
                onPress={() => { refreshDrafts(); setShowDraftsModal(false); }}
                style={styles.draftsModalClose}
                accessibilityLabel={t('common.close')}
                accessibilityRole="button"
              >
                <Text style={styles.draftsModalCloseText}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
            <DraftsList
              onEditDraft={handleEditDraft}
              onSubmitDraft={handleSubmitDraft}
              onDraftDeleted={refreshDrafts}
            />
          </View>
        </ToastProvider>
      </Modal>

      {/* Success Modal (draft submission) */}
      <SuccessModal
        visible={showSuccessModal}
        trackingCode={successTrackingCode}
        aiData={successAiData}
        onClose={() => setShowSuccessModal(false)}
        onViewTracking={() => {
          setShowSuccessModal(false);
          router.push('/(tabs)/track');
        }}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Terms of Use Modal */}
      <TermsOfUseModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Clear All Drafts Confirmation Dialog */}
      <ConfirmDialog
        visible={clearAllConfirmVisible}
        title={t('drafts.delete')}
        message={t('drafts.deleteConfirm')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmClearAll}
        onCancel={cancelClearAll}
        destructive
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: colors.textDark,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    marginBottom: SPACING.md,
  },
  draftInfo: {
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 8,
  },
  draftCount: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    marginBottom: SPACING.md,
  },
  draftButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  draftButton: {
    flex: 1,
  },
  aboutContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  aboutTitle: {
    ...TYPOGRAPHY.h2,
    color: colors.primary,
    marginBottom: SPACING.xs,
  },
  aboutSubtitle: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  aboutVersion: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.md,
  },
  aboutDescription: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: {
    ...TYPOGRAPHY.body,
    color: colors.primary,
  },
  linkArrow: {
    ...TYPOGRAPHY.h3,
    color: colors.textLight,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    textAlign: 'center',
  },
  draftsModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  draftsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  draftsModalTitle: {
    ...TYPOGRAPHY.h2,
    color: colors.textDark,
  },
  draftsModalClose: {
    padding: SPACING.sm,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftsModalCloseText: {
    ...TYPOGRAPHY.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
