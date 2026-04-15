import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Picker = ({
  label,
  value,
  onValueChange,
  items = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  style,
  accessibilityLabel,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(1);

  const selectedItem = items.find(item => item.value === value);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const handleSelect = (itemValue) => {
    onValueChange(itemValue);
    setModalVisible(false);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label} accessibilityLabel={`${label} label`}>
          {label}
        </Text>
      )}
      <AnimatedPressable
        style={[
          styles.picker,
          error && styles.errorPicker,
          disabled && styles.disabledPicker,
          animatedStyle
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label || 'Picker'}
        accessibilityRole="button"
        accessibilityHint={`Opens picker to select ${label || 'an option'}`}
        accessibilityState={{ disabled }}
      >
        <Text
          style={[
            styles.pickerText,
            !selectedItem && styles.placeholderText,
            disabled && styles.disabledText
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </AnimatedPressable>
      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                accessibilityLabel="Close picker"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.value === value }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.selectedOptionText
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: colors.textDark,
    marginBottom: SPACING.xs,
  },
  picker: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    // Add shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  errorPicker: {
    borderColor: colors.error,
  },
  disabledPicker: {
    backgroundColor: colors.disabled,
  },
  pickerText: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    flex: 1,
  },
  placeholderText: {
    color: colors.textLight,
  },
  disabledText: {
    color: colors.textLight,
  },
  arrow: {
    ...TYPOGRAPHY.body,
    color: colors.textLight,
    marginLeft: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: colors.error,
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
  },
  closeButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...TYPOGRAPHY.h2,
    color: colors.textLight,
  },
  option: {
    minHeight: 44,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.surfaceElevated,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primaryLight,
    fontWeight: '600',
  },
  checkmark: {
    ...TYPOGRAPHY.h3,
    color: colors.primaryLight,
    marginLeft: SPACING.sm,
  },
});

