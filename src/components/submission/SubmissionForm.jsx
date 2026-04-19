import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CategorySelector } from './CategorySelector';
import { PhotoPicker } from './PhotoPicker';
import { SubmitterInfoForm } from './SubmitterInfoForm';
import { SuccessModal } from './SuccessModal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useNetwork } from '../../contexts/NetworkContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import { validateSubmissionForm } from '../../utils/validation';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';
import { hapticFeedback } from '../../utils/haptics';

// --- Animated card wrapper for staggered entrance ---
const AnimatedCard = ({ children, index, style }) => {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = 150 + index * 120;
    translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 120 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// --- Step indicator component ---
const StepIndicator = ({ stepNumber, label, isActive, isCompleted }) => (
  <View style={stepStyles.step}>
    <View
      style={[
        stepStyles.circle,
        isActive && stepStyles.circleActive,
        isCompleted && stepStyles.circleCompleted,
      ]}
    >
      {isCompleted ? (
        <FontAwesome name="check" size={12} color={colors.white} />
      ) : (
        <Text
          style={[
            stepStyles.circleText,
            (isActive || isCompleted) && stepStyles.circleTextActive,
          ]}
        >
          {stepNumber}
        </Text>
      )}
    </View>
    <Text style={[stepStyles.label, isActive && stepStyles.labelActive]}>{label}</Text>
  </View>
);

const stepStyles = StyleSheet.create({
  step: { alignItems: 'center', flex: 1 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  circleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  circleCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  circleText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  circleTextActive: {
    color: colors.white,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  labelActive: {
    color: colors.white,
    fontWeight: '600',
  },
});

export const SubmissionForm = ({
  initialData,
  onSubmitSuccess,
  onSaveDraft,
  shouldValidate = false
}) => {
  const { isConnected } = useNetwork();
  const { t } = useLanguage();
  const router = useRouter();
  
  // Refs for scrolling to error fields
  const scrollViewRef = useRef(null);
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const submitterInfoRef = useRef(null);

  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    title: initialData?.title || '',
    content: initialData?.content || '',
    isAnonymous: initialData?.isAnonymous ?? true,
    submitter: {
      name: initialData?.submitter?.name || '',
      studentId: initialData?.submitter?.studentId || '',
      email: initialData?.submitter?.email || '',
      contactNumber: initialData?.submitter?.contactNumber || '',
      program: initialData?.submitter?.program || '',
      yearLevel: initialData?.submitter?.yearLevel || '',
    },
    photo: initialData?.photo || null,
  });

  // Sync form when initialData changes (e.g. loading a draft for editing)
  useEffect(() => {
    setFormData({
      category: initialData?.category || '',
      title: initialData?.title || '',
      content: initialData?.content || '',
      isAnonymous: initialData?.isAnonymous ?? true,
      submitter: {
        name: initialData?.submitter?.name || '',
        studentId: initialData?.submitter?.studentId || '',
        email: initialData?.submitter?.email || '',
        contactNumber: initialData?.submitter?.contactNumber || '',
        program: initialData?.submitter?.program || '',
        yearLevel: initialData?.submitter?.yearLevel || '',
      },
      photo: initialData?.photo || null,
    });
    setErrors({});
    setSubmitError(null);
  }, [initialData]);

  // Trigger validation when shouldValidate flag is set (from draft submission)
  useEffect(() => {
    if (shouldValidate && initialData) {
      const validationErrors = validateSubmissionForm(initialData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        scrollToFirstError(validationErrors);
      }
    }
  }, [shouldValidate, initialData]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [aiData, setAiData] = useState(null);

  const hasCategory = Boolean(formData.category);
  const hasDetails = Boolean(formData.title && formData.content);
  const hasEvidence = Boolean(formData.photo);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmitterChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      submitter: {
        ...prev.submitter,
        [field]: value
      }
    }));
    // Clear error for this field
    if (errors[`submitter.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`submitter.${field}`]: null
      }));
    }
  };

  const handlePhotoSelected = (photo) => {
    setFormData(prev => ({
      ...prev,
      photo
    }));
  };

  const handlePhotoRemoved = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }));
  };

  const scrollToFirstError = (validationErrors) => {
    // Determine which field has the first error and scroll to it
    const errorFields = Object.keys(validationErrors);
    if (errorFields.length === 0) return;

    const firstError = errorFields[0];
    let targetRef = null;

    // Map error field to ref
    if (firstError === 'category') {
      targetRef = categoryRef;
    } else if (firstError === 'title') {
      targetRef = titleRef;
    } else if (firstError === 'content') {
      targetRef = contentRef;
    } else if (firstError.startsWith('submitter.')) {
      targetRef = submitterInfoRef;
    }

    // Scroll to the field with error
    if (targetRef?.current && scrollViewRef?.current) {
      targetRef.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({
            y: y - 20, // Offset to show field clearly
            animated: true,
          });
        },
        () => {
          // Fallback if measureLayout fails
          console.log('Failed to measure layout for scroll');
        }
      );
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    hapticFeedback.medium();

    // Validate form
    const validationErrors = validateSubmissionForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      hapticFeedback.warning();
      
      // Scroll to first error field
      scrollToFirstError(validationErrors);
      return;
    }

    if (!isConnected) {
      setSubmitError(t('errors.network'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Build payload to match backend and web app: category, title, content, isAnonymous, submitter?, image (base64)
      const payload = {
        category: formData.category,
        title: formData.title,
        content: formData.content,
        isAnonymous: formData.isAnonymous,
      };
      if (!formData.isAnonymous && formData.submitter) {
        payload.submitter = {
          name: formData.submitter.name || '',
          studentId: formData.submitter.studentId || '',
          email: formData.submitter.email || '',
          contactNumber: formData.submitter.contactNumber || '',
          program: formData.submitter.program || '',
          yearLevel: formData.submitter.yearLevel || '',
          wantsFollowUp: Boolean(formData.submitter.wantsFollowUp),
        };
      }
      // Backend expects "image" as base64 string (same as web app), not "photo" object
      if (formData.photo?.base64) {
        payload.image = `data:image/jpeg;base64,${formData.photo.base64}`;
      }

      const response = await apiService.createSubmission(payload);

      if (response.success) {
        hapticFeedback.success();
        setTrackingCode(response.data.trackingCode);
        setAiData({
          priority: response.data.priority,
          reason: response.data.aiPriorityReason,
          analyzed: response.data.aiAnalyzed
        });
        setShowSuccessModal(true);
        // Clear form
        setFormData({
          category: '',
          title: '',
          content: '',
          isAnonymous: true,
          submitter: {
            name: '',
            studentId: '',
            email: '',
            contactNumber: '',
            program: '',
            yearLevel: '',
          },
          photo: null,
        });
        setErrors({});

        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.trackingCode);
        }
      } else if (response.validationErrors?.length > 0) {
        // Map server-side field errors to form field errors
        const fieldErrors = {};
        response.validationErrors.forEach(({ field, message }) => {
          if (field) fieldErrors[field] = message;
        });
        setErrors(fieldErrors);
        setSubmitError(t('errors.validationFailed'));
        hapticFeedback.warning();
      } else {
        setSubmitError(response.error || response.message || t('errors.submissionFailed'));
      }
    } catch (error) {
      setSubmitError(error.message || t('errors.submissionFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft) {
      await onSaveDraft(formData);
      // Reset the form so the user can start a new report
      setFormData({
        category: '',
        title: '',
        content: '',
        isAnonymous: true,
        submitter: {
          name: '',
          studentId: '',
          email: '',
          contactNumber: '',
          program: '',
          yearLevel: '',
        },
        photo: null,
      });
      setErrors({});
      setSubmitError(null);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleViewTracking = () => {
    setShowSuccessModal(false);
    router.push('/(tabs)/track');
  };

  // Determine which step is "active" for the stepper
  // Step 0: Category, Step 1: Details (title + content), Step 2: Submit
  const currentStep = !hasCategory ? 0 : !hasDetails ? 1 : 2;

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      {/* ── Gradient Hero Header ── */}
      <LinearGradient
        colors={[colors.backgroundSecondary, colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <Text style={styles.heroTitle}>{t('submission.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('app.tagline')}</Text>

        {/* Enhanced stepper */}
        <View style={styles.stepperRow}>
          <StepIndicator
            stepNumber={1}
            label={t('submission.stepCategory')}
            isActive={currentStep === 0}
            isCompleted={currentStep > 0}
          />
          <View style={[styles.stepConnector, currentStep > 0 && styles.stepConnectorActive]} />
          <StepIndicator
            stepNumber={2}
            label={t('submission.stepDetails')}
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
          />
          <View style={[styles.stepConnector, currentStep > 1 && styles.stepConnectorActive]} />
          <StepIndicator
            stepNumber={3}
            label={t('submission.stepSubmit')}
            isActive={currentStep === 2}
            isCompleted={false}
          />
        </View>
      </LinearGradient>

      {!isConnected && (
        <ErrorMessage
          message={t('offline.message')}
        />
      )}

      {/* ── Report Details Card ── */}
      <AnimatedCard index={0} style={styles.card}>
        <View 
          ref={categoryRef}
          style={styles.cardTitleRow}
        >
          <FontAwesome name="file-text" size={18} color={colors.primary} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>{t('submission.reportDetails')}</Text>
        </View>
        <Text style={styles.cardHint}>
          {t('submission.reportDetailsHint')}
        </Text>

        <CategorySelector
          value={formData.category}
          onValueChange={(value) => handleFieldChange('category', value)}
          error={errors.category}
        />

        <View ref={titleRef}>
          <Input
            label={`${t('submission.reportTitle')} `}
            value={formData.title}
            onChangeText={(text) => handleFieldChange('title', text)}
            placeholder={t('submission.titlePlaceholder')}
            error={errors.title}
            maxLength={200}
            accessibilityLabel={t('submission.reportTitle')}
          />
          <Text style={styles.helperText}>
            {t('submission.titleHint')}
          </Text>
        </View>

        <View ref={contentRef}>
          <Input
            label={`${t('submission.content')} `}
            value={formData.content}
            onChangeText={(text) => handleFieldChange('content', text)}
            placeholder={t('submission.contentPlaceholder')}
            error={errors.content}
            multiline={true}
            numberOfLines={6}
            maxLength={2000}
            accessibilityLabel={t('submission.content')}
          />
          <Text style={styles.helperText}>
            {t('submission.contentHint')}
          </Text>
        </View>
      </AnimatedCard>

      {/* ── Photo Evidence Card ── */}
      <AnimatedCard index={1} style={styles.card}>
        <View style={styles.cardTitleRow}>
          <FontAwesome name="camera" size={18} color={colors.primary} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>{t('submission.photoEvidence')}</Text>
        </View>
        <Text style={styles.cardHint}>
          {t('submission.photoEvidenceHint')}
        </Text>

        <PhotoPicker
          photo={formData.photo}
          onPhotoSelected={handlePhotoSelected}
          onPhotoRemoved={handlePhotoRemoved}
          error={errors.photo}
        />
      </AnimatedCard>

      {/* ── Anonymous Toggle Card ── */}
      <AnimatedCard index={2} style={[
        styles.anonymousContainer,
        formData.isAnonymous && styles.anonymousContainerActive,
      ]}>
        <View style={styles.anonymousHeader}>
          <View style={styles.anonymousLeft}>
            <View style={[
              styles.anonymousIconCircle,
              formData.isAnonymous && styles.anonymousIconCircleActive,
            ]}>
              <FontAwesome
                name={formData.isAnonymous ? 'shield' : 'user'}
                size={16}
                color={formData.isAnonymous ? colors.white : colors.textLight}
              />
            </View>
            <View style={styles.anonymousTextGroup}>
              <Text style={styles.anonymousLabel}>{t('submission.anonymous')}</Text>
              <Text style={styles.anonymousHint}>
                {formData.isAnonymous
                  ? t('submitter.info')
                  : t('submission.identified')}
              </Text>
            </View>
          </View>
          <Switch
            value={formData.isAnonymous}
            onValueChange={(value) => handleFieldChange('isAnonymous', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
            accessibilityLabel={t('submission.anonymous')}
            accessibilityRole="switch"
          />
        </View>
      </AnimatedCard>

      <View ref={submitterInfoRef}>
        <SubmitterInfoForm
          values={formData.submitter}
          errors={errors}
          onChange={handleSubmitterChange}
          isAnonymous={formData.isAnonymous}
        />
      </View>

      {/* ── Enhanced Summary Card ── */}
      <AnimatedCard index={3} style={styles.summaryCard}>
        <View style={styles.cardTitleRow}>
          <FontAwesome name="list-alt" size={18} color={colors.primary} style={styles.cardIcon} />
          <Text style={styles.summaryTitle}>{t('submission.beforeSubmit')}</Text>
        </View>

        <View style={styles.summaryRow}>
          <FontAwesome
            name={formData.category ? 'check-circle' : 'circle-o'}
            size={14}
            color={formData.category ? colors.success : colors.textLight}
            style={styles.summaryIcon}
          />
          <Text style={styles.summaryLabel}>{t('submission.categoryLabel')}: </Text>
          <Text style={styles.summaryValue}>
            {formData.category ? t(`categories.${formData.category}`) : t('submission.notSelected')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome
            name="info-circle"
            size={14}
            color={colors.info}
            style={styles.summaryIcon}
          />
          <Text style={styles.summaryLabel}>{t('submission.sharingMode')}: </Text>
          <Text style={styles.summaryValue}>
            {formData.isAnonymous ? t('submission.anonymous') : t('submission.withMyDetails')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <FontAwesome
            name={hasEvidence ? 'check-circle' : 'circle-o'}
            size={14}
            color={hasEvidence ? colors.success : colors.textLight}
            style={styles.summaryIcon}
          />
          <Text style={styles.summaryLabel}>{t('submission.photoAttached')}: </Text>
          <Text style={styles.summaryValue}>
            {hasEvidence ? t('common.yes') : t('common.no')}
          </Text>
        </View>
      </AnimatedCard>

      <Text style={styles.aiHint}>
        {t('submission.aiHint')}
      </Text>

      {submitError && (
        <ErrorMessage
          message={submitError}
          onRetry={handleSubmit}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={isSubmitting ? t('submission.submitting') : t('common.submit')}
          onPress={handleSubmit}
          variant="primary"
          pill
          gradient
          icon={<FontAwesome name="paper-plane" size={16} color={colors.white} />}
          loading={isSubmitting}
          disabled={!isConnected || isSubmitting}
          style={styles.submitButton}
          accessibilityLabel={t('common.submit')}
        />

        <Button
          title={t('submission.saveDraft')}
          onPress={handleSaveDraft}
          variant="outline"
          pill
          icon={<FontAwesome name="bookmark-o" size={16} color={colors.primary} />}
          disabled={!formData.title?.trim() && !formData.content?.trim()}
          style={styles.draftButton}
          accessibilityLabel={t('submission.saveDraft')}
        />
      </View>

      <SuccessModal
        visible={showSuccessModal}
        trackingCode={trackingCode}
        aiData={aiData}
        onClose={handleCloseSuccessModal}
        onViewTracking={handleViewTracking}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 48,
  },
  // ── Gradient Hero ──
  heroGradient: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg + 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    ...TYPOGRAPHY.h1,
    color: colors.white,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: SPACING.lg,
  },
  // ── Stepper ──
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepConnector: {
    height: 2,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 15, // vertically center with the circle
    borderRadius: 1,
  },
  stepConnectorActive: {
    backgroundColor: colors.success,
  },
  // ── Cards (accent left border) ──
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
    marginLeft: 26, // align with title text (icon width + margin)
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  // ── Anonymous Toggle ──
  anonymousContainer: {
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
  anonymousContainerActive: {
    borderLeftColor: colors.success,
    borderColor: 'rgba(22, 163, 74, 0.25)',
  },
  anonymousHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  anonymousIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  anonymousIconCircleActive: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  anonymousTextGroup: {
    flex: 1,
  },
  anonymousLabel: {
    ...TYPOGRAPHY.label,
    color: colors.textDark,
    marginBottom: 2,
  },
  anonymousHint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
  },
  // ── Summary Card ──
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  summaryTitle: {
    ...TYPOGRAPHY.label,
    color: colors.textDark,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  summaryIcon: {
    marginRight: SPACING.sm,
    width: 16,
    textAlign: 'center',
  },
  summaryLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: colors.textLight,
  },
  summaryValue: {
    ...TYPOGRAPHY.caption,
    fontWeight: '400',
    color: colors.textMedium,
  },
  // ── Misc ──
  aiHint: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  submitButton: {
    width: '100%',
  },
  draftButton: {
    width: '100%',
  },
});
