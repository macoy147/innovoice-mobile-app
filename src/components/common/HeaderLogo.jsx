import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const HeaderLogo = ({ title }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/ssg-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    fontWeight: 'bold',
  },
});
