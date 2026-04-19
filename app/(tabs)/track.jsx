import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrackingInput } from '../../src/components/tracking/TrackingInput';
import { SubmissionDetails } from '../../src/components/tracking/SubmissionDetails';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { ConfirmDialog } from '../../src/components/common/ConfirmDialog';
import { useNetwork } from '../../src/contexts/NetworkContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { apiService } from '../../src/services/api';
import { draftService } from '../../src/services/draftService';
import { colors } from '../../src/styles/colors';
import { TYPOGRAPHY } from '../../src/styles/typography';
import { SPACING } from '../../src/styles/spacing';
import { hapticFeedback } from '../../src/utils/haptics';

export default function TrackingScreen() {
  const { isConnected } = useNetwork();
  const { t } = useLanguage();
  const [isSearching, setIsSearching] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState(null);
  const [savedCodes, setSavedCodes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);

  useEffect(() => {
    loadSavedCodes();
  }, []);

  const loadSavedCodes = async () => {
    try {
      const codes = await draftService.getSavedTrackingCodes();
      setSavedCodes(codes);
    } catch (err) {
      console.error('Failed to load saved codes:', err);
    }
  };

  const handleSearch = async (trackingCode) => {
    if (!isConnected) {
      setError(t('offline.message'));
      return;
    }

    setIsSearching(true);
    setError(null);
    setSubmission(null);

    try {
      const response = await apiService.trackSubmission(trackingCode);

      if (response.success) {
        setSubmission(response.data);
        // Save this tracking code if not already saved
        if (!savedCodes.includes(trackingCode)) {
          await draftService.saveTrackingCode(trackingCode);
          setSavedCodes(prev => [trackingCode, ...prev]);
        }
      } else {
        const reasonMessages = {
          deleted: t('tracking.codeDeleted'),
          not_found: t('tracking.codeNotFound'),
        };
        setError(reasonMessages[response.reason] || response.error || t('tracking.notFound'));
      }
    } catch (err) {
      setError(err.message || t('errors.network'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleRetry = () => {
    if (submission) {
      handleSearch(submission.trackingCode);
    }
  };

  const handleRefresh = async () => {
    if (!submission || !isConnected) return;
    
    setRefreshing(true);
    try {
      const response = await apiService.trackSubmission(submission.trackingCode);
      if (response.success) {
        setSubmission(response.data);
        setError(null);
      } else {
        const reasonMessages = {
          deleted: t('tracking.codeDeleted'),
          not_found: t('tracking.codeNotFound'),
        };
        setError(reasonMessages[response.reason] || response.error || t('tracking.notFound'));
      }
    } catch (err) {
      setError(err.message || t('errors.network'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleSavedCodePress = (code) => {
    handleSearch(code);
  };

  const handleRemoveCode = (code) => {
    hapticFeedback.warning();
    setCodeToDelete(code);
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteCode = async () => {
    if (!codeToDelete) return;

    try {
      console.log('Attempting to remove tracking code:', codeToDelete);
      await draftService.removeTrackingCode(codeToDelete);
      setSavedCodes(prev => prev.filter(c => c !== codeToDelete));
      hapticFeedback.success();
      console.log('Tracking code removed successfully');
    } catch (error) {
      console.error('Failed to remove tracking code:', error);
      hapticFeedback.error();
      if (error.message?.includes('verification failed')) {
        console.warn('Tracking code removal verification failed');
      }
      loadSavedCodes();
    } finally {
      setDeleteConfirmVisible(false);
      setCodeToDelete(null);
    }
  };

  const cancelDeleteCode = () => {
    setDeleteConfirmVisible(false);
    setCodeToDelete(null);
  };

  const handleBackToSavedCodes = () => {
    hapticFeedback.selection();
    setSubmission(null);
    setError(null);
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          enabled={!!submission && isConnected}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.title}>{t('tracking.title')}</Text>
      <Text style={styles.subtitle}>
        {t('tracking.enterCode')}
      </Text>

      {!isConnected && (
        <ErrorMessage
          message={t('offline.message')}
        />
      )}

      <TrackingInput
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      {submission && savedCodes.length > 0 && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToSavedCodes}
            accessibilityLabel={t('common.back') || 'Back to saved codes'}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <View style={styles.backButtonContent}>
              <View style={styles.backIconCircle}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
              </View>
              <View style={styles.backButtonTextContainer}>
                <Text style={styles.backButtonText}>
                  {t('tracking.backToSavedCodes') || 'Back to Saved Codes'}
                </Text>
                <Text style={styles.backButtonSubtext}>
                  {savedCodes.length} {savedCodes.length === 1 ? 'code' : 'codes'} saved
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Saved Tracking Codes */}
      {savedCodes.length > 0 && !submission && (
        <View style={styles.savedCodesContainer}>
          <Text style={styles.savedCodesTitle}>{t('tracking.savedCodes')}</Text>
          {savedCodes.slice(0, 5).map((code, index) => (
            <View key={index} style={styles.savedCodeRow}>
              <TouchableOpacity
                style={styles.savedCodeItem}
                onPress={() => handleSavedCodePress(code)}
                onLongPress={() => handleRemoveCode(code)}
                accessibilityLabel={`${t('tracking.search')} ${code}`}
                accessibilityHint={t('tracking.longPressToDelete') || 'Long press to delete'}
                accessibilityRole="button"
              >
                <Text style={styles.savedCodeText}>{code}</Text>
                <Text style={styles.savedCodeArrow}>→</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.savedCodeDeleteBtn}
                onPress={() => handleRemoveCode(code)}
                accessibilityLabel={t('common.delete')}
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.savedCodeDeleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {isSearching && (
        <LoadingSpinner message={t('common.loading')} />
      )}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={submission ? handleRetry : undefined}
        />
      )}

      {submission && (
        <SubmissionDetails submission={submission} />
      )}

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title={t('common.delete')}
        message={t('tracking.removeCodeConfirm') || 'Remove this tracking code?'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmDeleteCode}
        onCancel={cancelDeleteCode}
        destructive
      />
    </ScrollView>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: colors.textLight,
    marginBottom: SPACING.lg,
  },
  savedCodesContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  savedCodesTitle: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    marginBottom: SPACING.sm,
  },
  savedCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  savedCodeItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedCodeDeleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedCodeDeleteText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  savedCodeText: {
    ...TYPOGRAPHY.body,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  savedCodeArrow: {
    ...TYPOGRAPHY.h3,
    color: colors.textLight,
  },
  backButtonContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  backIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  backButtonTextContainer: {
    flex: 1,
  },
  backButtonText: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    fontWeight: '600',
    marginBottom: 2,
  },
  backButtonSubtext: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
  },
});
