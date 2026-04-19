import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const ErrorMessage = ({ 
  message, 
  onRetry,
  style,
  showIcon = true,
}) => {
  if (!message) return null;

  return (
    <View 
      style={[styles.container, style]}
      accessibilityLabel="Error message"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.content}>
        {showIcon && (
          <Text style={styles.icon} accessibilityLabel="Error icon">⚠️</Text>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
          accessibilityLabel="Retry"
          accessibilityRole="button"
          accessibilityHint="Tap to retry the operation"
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderRadius: 8,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.error,
    flex: 1,
  },
  retryButton: {
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
    minHeight: 44,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: colors.error,
    borderRadius: 6,
  },
  retryText: {
    ...TYPOGRAPHY.button,
    color: colors.white,
  },
});
