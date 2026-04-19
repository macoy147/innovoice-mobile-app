import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    color: colors.submitted,
    backgroundColor: '#f3f4f6',
  },
  under_review: {
    label: 'Under Review',
    color: colors.underReview,
    backgroundColor: colors.primaryLight,
  },
  forwarded: {
    label: 'Forwarded',
    color: colors.forwarded,
    backgroundColor: '#ede9fe',
  },
  action_taken: {
    label: 'Action Taken',
    color: colors.actionTaken,
    backgroundColor: colors.warningLight,
  },
  resolved: {
    label: 'Resolved',
    color: colors.resolved,
    backgroundColor: colors.successLight,
  },
  rejected: {
    label: 'Rejected',
    color: colors.rejected,
    backgroundColor: colors.errorLight,
  },
};

export const StatusBadge = ({ status, size = 'medium', style }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;
  
  const badgeStyles = [
    styles.badge,
    size === 'small' && styles.badgeSmall,
    size === 'large' && styles.badgeLarge,
    { backgroundColor: config.backgroundColor },
    style,
  ];

  const textStyles = [
    styles.text,
    size === 'small' && styles.textSmall,
    size === 'large' && styles.textLarge,
    { color: config.color },
  ];

  return (
    <View 
      style={badgeStyles}
      accessibilityLabel={`Status: ${config.label}`}
      accessibilityRole="text"
    >
      <Text style={textStyles}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  badgeLarge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 11,
  },
  textLarge: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
});
