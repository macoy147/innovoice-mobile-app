import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    color: '#374151',
    backgroundColor: '#f3f4f6',
  },
  under_review: {
    label: 'Under Review',
    color: '#92400e',
    backgroundColor: '#fef3c7',
  },
  forwarded: {
    label: 'Forwarded',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
  },
  action_taken: {
    label: 'Action Taken',
    color: '#5b21b6',
    backgroundColor: '#ede9fe',
  },
  resolved: {
    label: 'Resolved',
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
  rejected: {
    label: 'Rejected',
    color: '#991b1b',
    backgroundColor: '#fee2e2',
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
