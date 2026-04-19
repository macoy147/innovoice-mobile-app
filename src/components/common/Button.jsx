import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  pill = false,
  gradient = false,
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isGradient = gradient && (variant === 'primary') && !disabled;

  const buttonStyles = [
    styles.button,
    pill && styles.pillButton,
    variant === 'primary' && !isGradient && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'outline' && styles.outlineButton,
    variant === 'outline' && pill && styles.outlinePillButton,
    disabled && styles.disabledButton,
    isGradient && styles.gradientButtonOuter,
    style
  ];

  const textStyles = [
    styles.text,
    (variant === 'primary' || isGradient) && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
    textStyle
  ];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0.8, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 150 });
    }
  };

  const content = loading ? (
    <ActivityIndicator
      color={variant === 'primary' || isGradient ? colors.white : colors.primary}
      size="small"
    />
  ) : (
    <View style={styles.contentRow}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={textStyles}>{title}</Text>
    </View>
  );

  if (isGradient) {
    return (
      <AnimatedPressable
        style={[{ overflow: 'hidden', borderRadius: pill ? 9999 : 12 }, animatedStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        {...props}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, pill && styles.pillButton, styles.gradientInner]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      style={[buttonStyles, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {content}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pillButton: {
    borderRadius: 9999,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  outlinePillButton: {
    borderRadius: 9999,
  },
  gradientButtonOuter: {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  gradientInner: {
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButton: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: SPACING.sm,
  },
  text: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.textDark,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.textLight,
  },
});

