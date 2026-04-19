import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CATEGORIES } from '../../utils/constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';
import { hapticFeedback } from '../../utils/haptics';

// Category descriptions matching the web app
const CATEGORY_DESCRIPTIONS = {
  academic: 'Curriculum, teaching methods, learning resources, classroom facilities',
  administrative: 'Policies, procedures, enrollment, records, campus facilities',
  extracurricular: 'Events, student organizations, sports, clubs, activities',
  general: 'Overall campus life, welfare, safety, and other concerns',
};

const CATEGORY_ICONS = {
  academic: '📚',
  administrative: '🏛️',
  extracurricular: '🎭',
  general: '💡',
};

export const CategorySelector = ({ value, onValueChange, error }) => {
  const { t } = useLanguage();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);

  const categoryItems = CATEGORIES.map(category => ({
    label: t(`categories.${category.value}`),
    value: category.value,
    icon: CATEGORY_ICONS[category.value],
    description: CATEGORY_DESCRIPTIONS[category.value],
  }));

  const handleSelect = (itemValue) => {
    hapticFeedback.selection();
    onValueChange(itemValue);
  };

  const handleInfoPress = (item) => {
    hapticFeedback.light();
    setSelectedInfo(item);
    setShowInfoModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{t('submission.categoryLabel')}</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedInfo({ 
              label: 'All Categories', 
              description: 'Tap any category to see its description',
              showAll: true 
            });
            setShowInfoModal(true);
          }}
          style={styles.infoButton}
          accessibilityLabel="View category information"
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="info-circle" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        {t('submission.categoryPickHint')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categoryItems.map(item => {
          const isSelected = item.value === value;
          return (
            <View key={item.value} style={styles.chipWrapper}>
              <TouchableOpacity
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleSelect(item.value)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.chipIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chipInfoButton}
                onPress={() => handleInfoPress(item)}
                accessibilityLabel={`Info about ${item.label}`}
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome 
                  name="info-circle" 
                  size={14} 
                  color={isSelected ? colors.white : colors.textLight} 
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                {selectedInfo?.icon && (
                  <Text style={styles.modalIcon}>{selectedInfo.icon}</Text>
                )}
                <Text style={styles.modalTitle}>{selectedInfo?.label}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowInfoModal(false)}
                style={styles.modalCloseButton}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <FontAwesome name="times" size={20} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            {selectedInfo?.showAll ? (
              <ScrollView 
                style={styles.modalBodyScroll}
                contentContainerStyle={styles.modalBodyContent}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                nestedScrollEnabled={true}
              >
                <Text style={styles.allCategoriesIntro}>
                  Choose the category that best fits your report:
                </Text>
                {categoryItems.map((item, index) => (
                  <View 
                    key={item.value} 
                    style={[
                      styles.categoryInfoItem,
                      index === categoryItems.length - 1 && styles.categoryInfoItemLast
                    ]}
                  >
                    <View style={styles.categoryInfoHeader}>
                      <View style={styles.categoryIconBadge}>
                        <Text style={styles.categoryInfoIcon}>{item.icon}</Text>
                      </View>
                      <Text style={styles.categoryInfoLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.categoryInfoDescription}>
                      {item.description}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  {selectedInfo?.description}
                </Text>
                <Text style={styles.modalHint}>
                  This category is for reports related to {selectedInfo?.label.toLowerCase()}.
                </Text>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowInfoModal(false)}
              >
                <Text style={styles.modalButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: colors.textDark,
  },
  infoButton: {
    padding: SPACING.xs,
    borderRadius: 12,
  },
  hint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingRight: SPACING.lg,
  },
  chipWrapper: {
    position: 'relative',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.xl,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: SPACING.xs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipText: {
    ...TYPOGRAPHY.body,
    color: colors.textLight,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chipInfoButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -7 }],
    padding: 4,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: colors.error,
    marginTop: SPACING.xs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    height: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  modalIcon: {
    fontSize: 24,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    flex: 1,
  },
  modalCloseButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  modalBody: {
    padding: SPACING.lg,
    flex: 1,
  },
  modalBodyScroll: {
    flex: 1,
  },
  modalBodyContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  modalDescription: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  modalHint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  allCategoriesIntro: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    lineHeight: 22,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  categoryInfoItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryInfoItemLast: {
    marginBottom: SPACING.md,
  },
  categoryInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categoryIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfoIcon: {
    fontSize: 18,
  },
  categoryInfoLabel: {
    ...TYPOGRAPHY.label,
    color: colors.textDark,
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  categoryInfoDescription: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    lineHeight: 20,
    fontSize: 14,
    paddingLeft: 44,
  },
  modalFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    ...TYPOGRAPHY.body,
    color: colors.white,
    fontWeight: '600',
  },
});
