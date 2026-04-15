import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const LoadingSpinner = ({ 
  size = 'large', 
  color = colors.primary,
  message,
  fullScreen = false,
  style,
}) => {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={[containerStyle, style]} accessibilityLabel="Loading">
      <ActivityIndicator 
        size={size} 
        color={color}
        accessibilityLabel={message || 'Loading'}
      />
      {message && (
        <Text style={styles.message} accessibilityLiveRegion="polite">
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
