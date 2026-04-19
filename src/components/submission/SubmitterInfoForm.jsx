import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Input } from '../common/Input';
import { Picker } from '../common/Picker';
import { useLanguage } from '../../contexts/LanguageContext';
import { YEAR_LEVELS, PROGRAMS } from '../../utils/constants';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const SubmitterInfoForm = ({
  values,
  errors,
  onChange,
  isAnonymous
}) => {
  const { t } = useLanguage();

  // Animate expand / collapse when toggling anonymous
  const heightProgress = useSharedValue(isAnonymous ? 0 : 1);
  const opacity = useSharedValue(isAnonymous ? 0 : 1);

  useEffect(() => {
    heightProgress.value = withTiming(isAnonymous ? 0 : 1, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withTiming(isAnonymous ? 0 : 1, {
      duration: 250,
      easing: Easing.out(Easing.quad),
    });
  }, [isAnonymous]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 0.95 + 0.05 * heightProgress.value }],
  }));

  if (isAnonymous) {
    return null;
  }

  const yearLevelItems = YEAR_LEVELS.map(levelObj => ({
    label: levelObj.label,
    value: levelObj.value,
  }));

  const programItems = PROGRAMS.map(programObj => ({
    label: programObj.label,
    value: programObj.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {/* Card header — matches other cards */}
      <View style={styles.cardTitleRow}>
        <FontAwesome name="id-card" size={18} color={colors.primary} style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{t('submitter.info')}</Text>
      </View>
      <Text style={styles.cardHint}>
        {t('submission.identified')}
      </Text>

      <Input
        label={`${t('submitter.name')} *`}
        value={values.name}
        onChangeText={(text) => onChange('name', text)}
        placeholder={t('submitter.name')}
        error={errors.name}
        autoCapitalize="words"
        accessibilityLabel={t('submitter.name')}
      />

      <Input
        label={`${t('submitter.studentId')} *`}
        value={values.studentId}
        onChangeText={(text) => onChange('studentId', text)}
        placeholder={t('submitter.studentId')}
        error={errors.studentId}
        keyboardType="default"
        autoCapitalize="characters"
        accessibilityLabel={t('submitter.studentId')}
      />

      <Input
        label={`${t('submitter.email')} *`}
        value={values.email}
        onChangeText={(text) => onChange('email', text)}
        placeholder={t('submitter.email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel={t('submitter.email')}
      />

      <Input
        label={`${t('submitter.contactNumber')} *`}
        value={values.contactNumber}
        onChangeText={(text) => onChange('contactNumber', text)}
        placeholder={t('submitter.contactNumber')}
        error={errors.contactNumber}
        keyboardType="phone-pad"
        accessibilityLabel={t('submitter.contactNumber')}
      />

      <Picker
        label={`${t('submitter.program')} *`}
        value={values.program}
        onValueChange={(value) => onChange('program', value)}
        items={programItems}
        placeholder={t('submitter.program')}
        error={errors.program}
        accessibilityLabel={t('submitter.program')}
      />

      <Picker
        label={`${t('submitter.yearLevel')} *`}
        value={values.yearLevel}
        onValueChange={(value) => onChange('yearLevel', value)}
        items={yearLevelItems}
        placeholder={t('submitter.yearLevel')}
        error={errors.yearLevel}
        accessibilityLabel={t('submitter.yearLevel')}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardIcon: {
    marginRight: SPACING.sm,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
  },
  cardHint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.md,
    marginLeft: 26,
  },
});
