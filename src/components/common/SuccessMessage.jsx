import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const SuccessMessage = ({ 
  message, 
  style,
  showIcon = true,
}) => {
  if (!message) return null;

  return (
    <View 
      style={[styles.container, style]}
      accessibilityLabel="Success message"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        {showIcon && (
          <Text style={styles.icon} accessibilityLabel="Success icon">✓</Text>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.successLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    borderRadius: 8,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
    color: colors.success,
    fontWeight: 'bold',
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.success,
    flex: 1,
  },
});
