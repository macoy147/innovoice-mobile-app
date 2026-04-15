import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  editable = true,
  style,
  inputStyle,
  accessibilityLabel,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const inputStyles = [
    styles.input,
    multiline && styles.multilineInput,
    !editable && styles.disabledInput,
    inputStyle
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [error ? colors.error : colors.border, error ? colors.error : colors.primary]
    );

    return {
      borderColor,
      borderWidth: error ? 2 : (focusProgress.value > 0 ? 2 : 1),
      shadowColor: colors.primary,
      shadowOpacity: focusProgress.value * 0.15,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: focusProgress.value * 2,
      transform: [{ scale: 1 + focusProgress.value * 0.01 }] // very subtle micro-scale
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: 200 });
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label} accessibilityLabel={`${label} label`}>
          {label}
        </Text>
      )}
      <AnimatedTextInput
        style={[inputStyles, animatedStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityLabel={accessibilityLabel || label || placeholder}
        accessibilityHint={error ? `Error: ${error}` : undefined}
        {...props}
      />
      {maxLength && (
        <Text style={styles.charCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
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
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    backgroundColor: colors.surface,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: colors.disabled,
    color: colors.textLight,
  },
  charCount: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: colors.error,
    marginTop: SPACING.xs,
  },
});

