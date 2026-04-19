import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Button } from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';
import { hapticFeedback } from '../../utils/haptics';

export const SuccessModal = ({
  visible,
  trackingCode,
  aiData,
  onClose,
  onViewTracking
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      iconScale.value = 0;
      iconScale.value = withSpring(1, { damping: 12, stiffness: 150 });
    }
  }, [visible]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handleCopyCode = async () => {
    if (!trackingCode) return;
    await Clipboard.setStringAsync(trackingCode);
    hapticFeedback.light();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <FontAwesome name="check-circle" size={48} color={colors.success} />
          </Animated.View>

          <Text style={styles.title}>{t('submission.success')}</Text>

          <Text style={styles.message}>
            {t('submission.saveCode')}
          </Text>

          <TouchableOpacity
            style={styles.trackingCodeContainer}
            onPress={handleCopyCode}
            activeOpacity={0.8}
            accessibilityLabel={`${t('submission.trackingCode')}: ${trackingCode}. ${t('submission.tapToCopy')}`}
            accessibilityRole="button"
          >
            <Text style={styles.trackingCodeLabel}>{t('submission.trackingCode')}</Text>
            <Text style={styles.trackingCode}>{trackingCode}</Text>
            <Text style={styles.trackingCodeHint}>
              {copied ? t('submission.copied') : t('submission.tapToCopy')}
            </Text>
          </TouchableOpacity>

          {aiData && aiData.analyzed && (
            <View style={styles.aiBadgeContainer}>
              <View style={styles.aiBadgeHeader}>
                <Text style={styles.aiBadgeIcon}>✨</Text>
                <Text style={styles.aiBadgeTitle}>{t('submission.aiAnalysis')}</Text>
              </View>
              <Text style={styles.aiPriorityTag}>{aiData.priority?.toUpperCase() || 'NORMAL'}</Text>
              {aiData.reason && (
                <Text style={styles.aiReasonText}>{aiData.reason}</Text>
              )}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={t('tracking.title')}
              onPress={onViewTracking}
              variant="primary"
              style={styles.button}
              accessibilityLabel={t('tracking.title')}
            />
            <Button
              title={t('common.close')}
              onPress={onClose}
              variant="outline"
              style={styles.button}
              accessibilityLabel={t('common.close')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: colors.textDark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  trackingCodeContainer: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trackingCodeLabel: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  trackingCode: {
    ...TYPOGRAPHY.h3,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  trackingCodeHint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  aiBadgeContainer: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  aiBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  aiBadgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  aiBadgeTitle: {
    ...TYPOGRAPHY.label,
    color: '#94A3B8',
  },
  aiPriorityTag: {
    ...TYPOGRAPHY.h3,
    color: '#38BDF8',
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  aiReasonText: {
    ...TYPOGRAPHY.caption,
    color: '#CBD5E1',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  button: {
    width: '100%',
  },
});
