import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';
import { Button } from './Button';

/**
 * EmptyState Component
 * Displays when there's no content to show
 * Provides helpful messaging and optional action button
 */
export const EmptyState = ({
  icon = 'document-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="text">
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon} 
          size={64} 
          color={colors.textLight}
          accessibilityLabel={`${title} icon`}
        />
      </View>
      
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      
      {message && (
        <Text style={styles.message}>
          {message}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.actionButton}
          accessibilityLabel={actionLabel}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: colors.background,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
    opacity: 0.5,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    maxWidth: 300,
  },
  actionButton: {
    marginTop: SPACING.md,
    minWidth: 200,
  },
});
