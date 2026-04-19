import { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const Toast = ({ message, type = 'success', visible, onHide, duration = 3000 }) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      console.log('[Toast] Showing toast:', { message, type });
      // Show toast
      translateY.value = withSpring(SPACING.xl, {
        damping: 15,
        stiffness: 100,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideToast = () => {
    translateY.value = withTiming(-100, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    
    // Call onHide after animation completes
    setTimeout(() => {
      if (onHide && typeof onHide === 'function') {
        onHide();
      }
    }, 250);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.success;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  if (!visible && translateY.value === -100) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        animatedStyle,
      ]}
      pointerEvents="box-none"
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 999,
    zIndex: 999999,
  },
  icon: {
    fontSize: 20,
    color: colors.white,
    marginRight: SPACING.sm,
    fontWeight: 'bold',
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.white,
    flex: 1,
    fontWeight: '600',
  },
});
