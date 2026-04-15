import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Clamp,
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    type: 'welcome',
    title: 'Welcome to InnoVoice',
    subtitle: 'Your Voice, Your Campus',
    description: 'Empowering students to speak up and make a difference at CTU Daanbantayan Campus.',
    features: [
      '📝 Report incidents & suggestions',
      '🔍 Track your submissions',
      '🔒 Stay anonymous if you prefer',
      '⚡ Get quick responses from SSG',
    ],
  },
  {
    id: '2',
    icon: '📢',
    title: 'Make Your Voice Heard',
    subtitle: 'Report What Matters',
    description: 'Share concerns about academics, facilities, student life, or anything affecting our campus community.',
    highlights: [
      { emoji: '🎓', text: 'Academic Issues' },
      { emoji: '🏢', text: 'Facilities & Safety' },
      { emoji: '🎉', text: 'Events & Activities' },
      { emoji: '💡', text: 'Suggestions' },
    ],
  },
  {
    id: '3',
    icon: '🔍',
    title: 'Track Your Impact',
    subtitle: 'Stay Updated',
    description: 'Every submission gets a unique tracking code. Watch as your concerns are reviewed, prioritized, and resolved.',
    steps: [
      { step: '1', text: 'Submit your report' },
      { step: '2', text: 'Get tracking code' },
      { step: '3', text: 'Monitor progress' },
      { step: '4', text: 'See resolution' },
    ],
  },
  {
    id: '4',
    icon: '🔒',
    title: 'Your Privacy Matters',
    subtitle: 'Anonymous or Identified',
    description: 'Choose to submit anonymously or include your details for follow-up. Either way, your voice is valued.',
    privacyFeatures: [
      '✓ Anonymous submissions protected',
      '✓ Optional contact information',
      '✓ Secure data handling',
      '✓ No judgment, just action',
    ],
  },
];

export const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const handleScroll = (event) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderSlide = ({ item }) => {
    if (item.type === 'welcome') {
      return (
        <View style={styles.slide}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/ssg-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeTitle}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.featuresContainer}>
            {item.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.slide}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {item.highlights && (
          <View style={styles.highlightsContainer}>
            {item.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightCard}>
                <Text style={styles.highlightEmoji}>{highlight.emoji}</Text>
                <Text style={styles.highlightText}>{highlight.text}</Text>
              </View>
            ))}
          </View>
        )}

        {item.steps && (
          <View style={styles.stepsContainer}>
            {item.steps.map((stepItem, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{stepItem.step}</Text>
                </View>
                <Text style={styles.stepText}>{stepItem.text}</Text>
              </View>
            ))}
          </View>
        )}

        {item.privacyFeatures && (
          <View style={styles.privacyContainer}>
            {item.privacyFeatures.map((feature, index) => (
              <View key={index} style={styles.privacyItem}>
                <Text style={styles.privacyText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, idx) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (idx - 1) * SCREEN_WIDTH,
              idx * SCREEN_WIDTH,
              (idx + 1) * SCREEN_WIDTH,
            ];

            const width = interpolate(
              scrollX.value,
              inputRange,
              [8, 24, 8],
              Clamp
            );

            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.3, 1, 0.3],
              Clamp
            );

            return {
              width,
              opacity,
            };
          });

          return (
            <Animated.View
              key={idx}
              style={[styles.dot, animatedStyle]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <Pagination />
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
  },
  skipText: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  logoContainer: {
    width: 140,
    height: 140,
    marginBottom: SPACING.lg,
    backgroundColor: colors.white,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    color: colors.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 100,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 28,
    color: colors.textDark,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    ...TYPOGRAPHY.h3,
    color: colors.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  featuresContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  featureItem: {
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  featureText: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    fontSize: 16,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  highlightCard: {
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 12,
    width: (SCREEN_WIDTH - SPACING.xl * 2 - SPACING.sm) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  highlightText: {
    ...TYPOGRAPHY.caption,
    color: colors.textDark,
    textAlign: 'center',
    fontWeight: '600',
  },
  stepsContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    ...TYPOGRAPHY.body,
    color: colors.white,
    fontWeight: 'bold',
  },
  stepText: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    flex: 1,
  },
  privacyContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  privacyItem: {
    backgroundColor: colors.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  privacyText: {
    ...TYPOGRAPHY.body,
    color: colors.textDark,
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: {
    ...TYPOGRAPHY.body,
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
