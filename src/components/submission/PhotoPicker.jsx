import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import imageService from '../../services/imageService';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { hapticFeedback } from '../../utils/haptics';

export const PhotoPicker = ({ 
  photo, 
  onPhotoSelected, 
  onPhotoRemoved,
  maxSizeBytes = 2 * 1024 * 1024, // 2MB
  error 
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleCameraPress = async () => {
    try {
      setLoading(true);
      setLocalError(null);
      const result = await imageService.pickFromCamera();
      
      if (result) {
        const isValid =
          result.fileSize != null
            ? result.fileSize <= maxSizeBytes
            : await imageService.validateImageSize(result.uri, maxSizeBytes);
        if (!isValid) {
          const errorMsg = t('errors.photoTooLarge');
          setLocalError(errorMsg);
          showToast(errorMsg, 'error');
          return;
        }
        hapticFeedback.light();
        onPhotoSelected(result);
        showToast(t('common.success'), 'success');
      }
    } catch (err) {
      const errorMsg = err.message || t('errors.submissionFailed');
      setLocalError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryPress = async () => {
    try {
      setLoading(true);
      setLocalError(null);
      const result = await imageService.pickFromGallery();
      
      if (result) {
        const isValid =
          result.fileSize != null
            ? result.fileSize <= maxSizeBytes
            : await imageService.validateImageSize(result.uri, maxSizeBytes);
        if (!isValid) {
          const errorMsg = t('errors.photoTooLarge');
          setLocalError(errorMsg);
          showToast(errorMsg, 'error');
          return;
        }
        hapticFeedback.light();
        onPhotoSelected(result);
        showToast(t('common.success'), 'success');
      }
    } catch (err) {
      const errorMsg = err.message || t('errors.submissionFailed');
      setLocalError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      t('submission.removePhoto'),
      t('drafts.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => {
            onPhotoRemoved();
            setLocalError(null);
          }
        },
      ]
    );
  };

  const displayError = error || localError;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('submission.addPhoto')}</Text>
      <Text style={styles.hint}>{t('submission.photoMaxSize')}</Text>

      {photo ? (
        <View style={styles.photoContainer}>
          <Image 
            source={{ uri: photo.uri }} 
            style={styles.photo}
            resizeMode="cover"
            accessibilityLabel={t('submission.addPhoto')}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemovePhoto}
            accessibilityLabel={t('submission.removePhoto')}
            accessibilityRole="button"
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
          {photo.fileSize && (
            <Text style={styles.fileSize}>
              {(photo.fileSize / 1024 / 1024).toFixed(2)} MB
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title={t('submission.takePhoto')}
            onPress={handleCameraPress}
            variant="outline"
            loading={loading}
            style={styles.button}
            accessibilityLabel={t('submission.takePhoto')}
          />
          <Button
            title={t('submission.choosePhoto')}
            onPress={handleGalleryPress}
            variant="outline"
            loading={loading}
            style={styles.button}
            accessibilityLabel={t('submission.choosePhoto')}
          />
        </View>
      )}

      {displayError && (
        <ErrorMessage message={displayError} />
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
  hint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photo: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundSecondary,
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: colors.error,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  fileSize: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    padding: SPACING.sm,
    backgroundColor: colors.backgroundSecondary,
  },
});
