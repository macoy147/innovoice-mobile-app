import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const StatusHistory = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status History</Text>
      
      <View style={styles.timeline}>
        {history.map((item, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineMarker}>
              <View style={styles.timelineDot} />
              {index < history.length - 1 && <View style={styles.timelineLine} />}
            </View>
            
            <View style={styles.timelineContent}>
              <StatusBadge status={item.status} size="small" />
              
              <Text style={styles.date} accessibilityLabel={`Date: ${formatDate(item.changedAt)}`}>
                {formatDate(item.changedAt)}
              </Text>
              
              {item.notes && (
                <Text style={styles.notes} accessibilityLabel={`Notes: ${item.notes}`}>
                  {item.notes}
                </Text>
              )}
              
              {item.changedBy && (
                <Text style={styles.changedBy} accessibilityLabel={`Changed by: ${item.changedBy}`}>
                  Updated by: {item.changedBy}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    marginBottom: SPACING.md,
  },
  timeline: {
    paddingLeft: SPACING.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: SPACING.xs,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: SPACING.md,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginTop: SPACING.xs,
  },
  notes: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    marginTop: SPACING.xs,
  },
  changedBy: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
});
