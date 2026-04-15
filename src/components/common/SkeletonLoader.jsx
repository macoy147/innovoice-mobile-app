import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';

export const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 4, style }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.6, 0.3]
    );

    return {
      opacity,
    };
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </View>
  );
};

export const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <SkeletonLoader width="60%" height={24} style={styles.title} />
      <SkeletonLoader width="100%" height={16} style={styles.line} />
      <SkeletonLoader width="100%" height={16} style={styles.line} />
      <SkeletonLoader width="80%" height={16} style={styles.line} />
      <View style={styles.footer}>
        <SkeletonLoader width={80} height={32} borderRadius={16} />
        <SkeletonLoader width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );
};

export const SkeletonList = ({ count = 3 }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    marginBottom: SPACING.md,
  },
  line: {
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
});
