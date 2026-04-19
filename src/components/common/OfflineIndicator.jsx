import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useNetwork } from '../../contexts/NetworkContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

/**
 * Offline Indicator Component
 * Displays a banner when the device is offline or briefly when back online
 */
export const OfflineIndicator = () => {
  const { isConnected } = useNetwork();
  const { t } = useLanguage();
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const previousConnectionState = useRef(null);
  const isInitialMount = useRef(true);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-50);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousConnectionState.current = isConnected;
      return;
    }

    // Check if connection state changed
    if (previousConnectionState.current === isConnected) {
      return;
    }

    // If just came back online, show the "Back online" banner briefly
    if (isConnected && previousConnectionState.current === false) {
      setShowOnlineBanner(true);
      
      // Animate in
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
      
      // Hide after 3 seconds
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(-50, { duration: 300 });
        setTimeout(() => setShowOnlineBanner(false), 300);
      }, 3000);
    }

    previousConnectionState.current = isConnected;
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Show offline banner (persistent)
  if (!isConnected) {
    return (
      <View style={[styles.container, styles.offlineContainer]}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.text}>{t('offline.indicator')}</Text>
      </View>
    );
  }

  // Show "back online" banner (temporary)
  if (showOnlineBanner) {
    return (
      <Animated.View style={[styles.container, styles.onlineContainer, animatedStyle]}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.text}>{t('network.backOnline')}</Text>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
  },
  offlineContainer: {
    backgroundColor: colors.warning,
  },
  onlineContainer: {
    backgroundColor: colors.success,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    ...TYPOGRAPHY.caption,
    color: colors.white,
    fontWeight: '600',
  },
});
