import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Alert } from 'react-native';
import { TrackingInput } from '../../src/components/tracking/TrackingInput';
import { SubmissionDetails } from '../../src/components/tracking/SubmissionDetails';
import { ErrorMessage } from '../../src/components/common/ErrorMessage';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
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
    Alert.alert(
      t('common.delete'),
      `${t('tracking.removeCodeConfirm') || 'Remove this tracking code?'}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await draftService.removeTrackingCode(code);
            setSavedCodes(prev => prev.filter(c => c !== code));
          },
        },
      ]
    );
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
});
