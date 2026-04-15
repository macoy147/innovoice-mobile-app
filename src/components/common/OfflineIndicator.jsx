import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../../contexts/NetworkContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

/**
 * Offline Indicator Component
 * Displays a banner when the device is offline
 */
export const OfflineIndicator = () => {
  const { isConnected } = useNetwork();
  const { t } = useLanguage();

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>{t('offline.indicator')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    ...TYPOGRAPHY.caption,
    color: colors.white,
    fontWeight: '600',
  },
});
