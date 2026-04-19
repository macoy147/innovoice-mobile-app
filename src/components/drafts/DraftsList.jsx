import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { draftService } from '../../services/draftService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Category icons matching the CategorySelector
const CATEGORY_ICONS = {
  academic: '📚',
  administrative: '🏛️',
  extracurricular: '🎭',
  general: '💡',
};

const DraftCard = ({ draft, onEdit, onDelete, onSubmit, t }) => {
  const categoryIcon = draft.category ? CATEGORY_ICONS[draft.category] : '📝';
  
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryIcon}>{categoryIcon}</Text>
          <Text style={styles.categoryText}>{draft.category ? t(`categories.${draft.category}`) : t('submission.category')}</Text>
        </View>
        <Text style={styles.date}>{formatDate(draft.createdAt)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {draft.title || t('submission.reportTitle')}
      </Text>

      <Text style={styles.content} numberOfLines={3}>
        {draft.content || t('submission.content')}
      </Text>

      {draft.photo && (
        <View style={styles.photoIndicator}>
          <Ionicons name="image" size={16} color={colors.textLight} style={{ marginRight: 4 }} />
          <Text style={styles.photoText}>{t('submission.addPhoto')}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        <Button
          title={t('common.edit')}
          onPress={() => onEdit(draft)}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title={t('common.submit')}
          onPress={() => onSubmit(draft)}
          variant="primary"
          style={styles.actionButton}
        />
        <TouchableOpacity
          onPress={() => onDelete(draft.id)}
          style={styles.deleteButton}
          accessibilityLabel={t('common.delete')}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const DraftsList = ({ onEditDraft, onSubmitDraft, onDraftDeleted }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      const allDrafts = await draftService.getAllDrafts();
      setDrafts(allDrafts);
    } catch (err) {
      setError(t('errors.submissionFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (draft) => {
    if (onEditDraft) {
      onEditDraft(draft);
    }
  };

  const handleSubmit = (draft) => {
    if (onSubmitDraft) {
      onSubmitDraft(draft);
    }
  };

  const handleDelete = (draftId) => {
    setDraftToDelete(draftId);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!draftToDelete) return;

    try {
      await draftService.deleteDraft(draftToDelete);
      setDrafts(prev => prev.filter(d => d.id !== draftToDelete));
      if (onDraftDeleted) onDraftDeleted();
      showToast(t('common.success'), 'success');
    } catch (err) {
      showToast(t('errors.submissionFailed'), 'error');
    } finally {
      setDeleteConfirmVisible(false);
      setDraftToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setDraftToDelete(null);
  };

  if (loading) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDrafts} />;
  }

  if (drafts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color={colors.textLight} />
        <Text style={styles.emptyTitle}>{t('drafts.empty')}</Text>
        <Text style={styles.emptyText}>
          {t('offline.message')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('drafts.title')}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{drafts.length}</Text>
        </View>
      </View>

      <FlatList
        data={drafts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DraftCard
            draft={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            t={t}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title={t('drafts.delete')}
        message={t('drafts.deleteConfirm')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        destructive
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: colors.textDark,
    marginRight: SPACING.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    marginBottom: SPACING.xs,
  },
  content: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  photoText: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: colors.textDark,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});
