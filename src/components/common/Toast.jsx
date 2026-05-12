import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const Toast = ({ message, type = 'success', visible, onHide, duration = 3000 }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible && opacity._value === 0) {
    return null;
  }

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.success,
          icon: 'check-circle',
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          icon: 'exclamation-circle',
        };
      case 'warning':
        return {
          backgroundColor: colors.warning,
          icon: 'exclamation-triangle',
        };
      case 'info':
        return {
          backgroundColor: colors.info,
          icon: 'info-circle',
        };
      default:
        return {
          backgroundColor: colors.success,
          icon: 'check-circle',
        };
    }
  };

  const toastStyle = getToastStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: toastStyle.backgroundColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <FontAwesome name={toastStyle.icon} size={20} color={colors.white} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.white,
    flex: 1,
    fontWeight: '600',
  },
});
