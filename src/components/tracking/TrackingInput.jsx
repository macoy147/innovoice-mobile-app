import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { validateTrackingCode } from '../../utils/validation';
import { SPACING } from '../../styles/spacing';
import { hapticFeedback } from '../../utils/haptics';

export const TrackingInput = ({ onSearch, isSearching }) => {
  const { t } = useLanguage();
  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');

    const validationError = validateTrackingCode(trackingCode);
    if (validationError) {
      setError(validationError);
      hapticFeedback.warning();
      return;
    }

    hapticFeedback.medium();
    onSearch(trackingCode.trim().toUpperCase());
  };

  const handleChangeText = (text) => {
    setTrackingCode(text);
    if (error) {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label={t('tracking.enterCode')}
        value={trackingCode}
        onChangeText={handleChangeText}
        placeholder={t('tracking.codePlaceholder')}
        error={error}
        autoCapitalize="characters"
        maxLength={18}
        accessibilityLabel={t('tracking.enterCode')}
        accessibilityHint={t('tracking.enterCode')}
      />
      <Button
        title={isSearching ? t('common.loading') : t('tracking.search')}
        onPress={handleSearch}
        variant="primary"
        loading={isSearching}
        disabled={isSearching || !trackingCode.trim()}
        accessibilityLabel={t('tracking.search')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
});
