import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { StatusBadge } from './StatusBadge';
import { StatusHistory } from './StatusHistory';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SubmissionDetails = ({ submission }) => {
  const { t } = useLanguage();
  const [lightboxVisible, setLightboxVisible] = useState(false);

  if (!submission) {
    return null;
  }

  const PRIORITY_CONFIG = {
    low: { label: t('priorities.low'), color: colors.priorityLow },
    medium: { label: t('priorities.medium'), color: colors.priorityMedium },
    high: { label: t('priorities.high'), color: colors.priorityHigh },
    urgent: { label: t('priorities.urgent'), color: colors.priorityUrgent },
  };

  const priorityConfig = PRIORITY_CONFIG[submission.priority] || PRIORITY_CONFIG.low;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.trackingCode} accessibilityLabel={`Tracking code: ${submission.trackingCode}`}>
          {submission.trackingCode}
        </Text>
        <StatusBadge status={submission.status} size="large" />
      </View>

      {/* Category and Priority */}
      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>{t('submission.category')}</Text>
          <Text style={styles.metaValue}>{t(`categories.${submission.category}`)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>{t('tracking.priority')}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityConfig.color + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityConfig.color }]}>
              {priorityConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* AI Analysis */}
      {submission.aiAnalyzed && (
        <View style={styles.aiBadgeContainer}>
          <View style={styles.aiBadgeHeader}>
            <Text style={styles.aiBadgeIcon}>✨</Text>
            <Text style={styles.aiBadgeTitle}>{t('submission.aiAnalysis') || 'AI Priority Analysis'}</Text>
          </View>
          <Text style={styles.aiPriorityTag}>{submission.priority?.toUpperCase() || 'NORMAL'}</Text>
          {submission.aiPriorityReason && (
            <Text style={styles.aiReasonText}>{submission.aiPriorityReason}</Text>
          )}
        </View>
      )}

      {/* Submission Date */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('tracking.submittedAt')}</Text>
        <Text style={styles.sectionValue} accessibilityLabel={`${t('tracking.submittedAt')}: ${formatDate(submission.createdAt || submission.submittedAt)}`}>
          {formatDate(submission.createdAt || submission.submittedAt)}
        </Text>
      </View>

      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('submission.reportTitle')}</Text>
        <Text style={styles.title} accessibilityLabel={`${t('submission.reportTitle')}: ${submission.title}`}>
          {submission.title}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('submission.content')}</Text>
        <Text style={styles.content} accessibilityLabel={`${t('submission.content')}: ${submission.content}`}>
          {submission.content}
        </Text>
      </View>

      {/* Photo Evidence */}
      {submission.imageUrl && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('submission.addPhoto')}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLightboxVisible(true)}
            accessibilityLabel={t('submission.addPhoto')}
            accessibilityHint={t('common.tapToEnlarge') || 'Tap to view full size'}
          >
            <Image
              source={{ uri: submission.imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageOverlayText}>Tap to enlarge</Text>
            </View>
          </TouchableOpacity>

          {/* Lightbox Modal */}
          <Modal
            visible={lightboxVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setLightboxVisible(false)}
          >
            <SafeAreaView style={styles.lightboxContainer}>
              <TouchableOpacity
                style={styles.lightboxClose}
                onPress={() => setLightboxVisible(false)}
                accessibilityLabel={t('common.close')}
                accessibilityRole="button"
              >
                <Text style={styles.lightboxCloseText}>✕</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: submission.imageUrl }}
                style={styles.lightboxImage}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </SafeAreaView>
          </Modal>
        </View>
      )}

      {/* Submitter Information */}
      {!submission.isAnonymous && submission.submitter && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('submitter.info')}</Text>
          <View style={styles.submitterInfo}>
            <InfoRow label={t('submitter.name')} value={submission.submitter.name} />
            <InfoRow label={t('submitter.studentId')} value={submission.submitter.studentId} />
            <InfoRow label={t('submitter.email')} value={submission.submitter.email} />
            <InfoRow label={t('submitter.contactNumber')} value={submission.submitter.contactNumber} />
            <InfoRow label={t('submitter.program')} value={submission.submitter.program || submission.submitter.course} />
            <InfoRow label={t('submitter.yearLevel')} value={submission.submitter.yearLevel} />
          </View>
        </View>
      )}

      {submission.isAnonymous && (
        <View style={styles.anonymousNotice}>
          <Text style={styles.anonymousText}>
            ℹ️ {t('submission.anonymous')}
          </Text>
        </View>
      )}

      {/* Status History */}
      {submission.statusHistory && submission.statusHistory.length > 0 && (
        <StatusHistory history={submission.statusHistory} />
      )}
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue} accessibilityLabel={`${label}: ${value}`}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  trackingCode: {
    ...TYPOGRAPHY.h2,
    color: colors.primary,
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  metaItem: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 8,
  },
  metaLabel: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.xs,
  },
  metaValue: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
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
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    color: colors.textLight,
    marginBottom: SPACING.xs,
  },
  sectionValue: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
  },
  content: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  submitterInfo: {
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  infoLabel: {
    ...TYPOGRAPHY.body,
    color: colors.textLight,
    width: 100,
  },
  infoValue: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    flex: 1,
  },
  anonymousNotice: {
    backgroundColor: colors.infoLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  anonymousText: {
    ...TYPOGRAPHY.body,
    color: colors.info,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: SPACING.xs,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  imageOverlayText: {
    ...TYPOGRAPHY.caption,
    color: colors.white,
  },
  lightboxContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxClose: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxCloseText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  lightboxImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
});
