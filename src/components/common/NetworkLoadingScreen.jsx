import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withTiming,
    Easing,
    withSequence,
} from 'react-native-reanimated';
import { useNetwork } from '../../contexts/NetworkContext';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

const { width, height } = Dimensions.get('window');

const PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    scale: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 2000,
    duration: Math.random() * 3000 + 2000,
}));

// Floating Particle Component
const Particle = ({ ix, iy, iscale, idelay, iduration }) => {
    const translateY = useSharedValue(iy);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(iy, { duration: 0 }),
                withTiming(iy - 100, { duration: iduration, easing: Easing.linear })
            ),
            -1,
            false
        );

        setTimeout(() => {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: iduration / 2 }),
                    withTiming(0, { duration: iduration / 2 })
                ),
                -1,
                false
            );
        }, idelay);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: iscale }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                { left: ix },
                animatedStyle,
            ]}
        />
    );
};

const SPEED_TIER_CONFIG = {
    fast: {
        stepMs: 280,
        messages: ['Loading resources...', 'Connecting to InnoVoice...', 'Preparing your experience...', 'Almost there...', 'Ready!'],
        statusLabel: 'Fast connection',
    },
    medium: {
        stepMs: 480,
        messages: ['Loading resources...', 'Connecting to server...', 'Preparing your experience...', 'Almost there...', 'Ready!'],
        statusLabel: 'Medium connection',
    },
    slow: {
        stepMs: 900,
        messages: ['Loading resources...', 'Connecting (slow network)...', 'Please wait...', 'Almost there...', 'Ready!'],
        statusLabel: 'Slow connection',
    },
};

export const NetworkLoadingScreen = ({ onLoadComplete }) => {
    const { isConnected, downloadSpeed = 0, speedTier = 'slow' } = useNetwork();
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');

    const logoScale = useSharedValue(0.5);
    const logoRotation = useSharedValue(0);
    const progressWidth = useSharedValue(0);
    const elementsOpacity = useSharedValue(0);

    const tier = speedTier in SPEED_TIER_CONFIG ? speedTier : 'slow';
    const config = SPEED_TIER_CONFIG[tier];

    useEffect(() => {
        elementsOpacity.value = withTiming(1, { duration: 600 });
        logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });
        logoScale.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(1.05, { duration: 1000 })
            ),
            -1,
            true
        );
        
        // Orbiting animation for the red ring
        logoRotation.value = withRepeat(
            withTiming(360, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    useEffect(() => {
        const loadingSteps = config.messages.map((text, i) => ({
            progress: ((i + 1) / config.messages.length) * 100,
            text,
        }));

        let currentStep = 0;
        const stepMs = !isConnected ? 1500 : config.stepMs;

        const interval = setInterval(() => {
            if (!isConnected && currentStep >= 2) {
                setLoadingText('Waiting for connection...');
                return;
            }

            if (currentStep < loadingSteps.length) {
                const { progress: nextProgress, text } = loadingSteps[currentStep];
                setProgress(nextProgress);
                setLoadingText(text);
                progressWidth.value = withTiming(nextProgress, { duration: 400, easing: Easing.out(Easing.ease) });
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (onLoadComplete) onLoadComplete();
                }, 600);
            }
        }, stepMs);

        return () => clearInterval(interval);
    }, [isConnected, tier]);

    const animatedStyles = {
        logo: useAnimatedStyle(() => ({
            transform: [{ scale: logoScale.value }],
        })),
        logoRing: useAnimatedStyle(() => ({
            transform: [{ rotate: `${logoRotation.value}deg` }],
        })),
        progress: useAnimatedStyle(() => ({
            width: `${progressWidth.value}%`,
        })),
        fade: useAnimatedStyle(() => ({
            opacity: elementsOpacity.value,
        })),
    };

    const connectionDotColor = tier === 'fast' ? colors.success : tier === 'medium' ? colors.warning : colors.error;
    const connectionLabel = !isConnected ? 'OFFLINE' : `${config.statusLabel.toUpperCase()}${downloadSpeed > 0 ? ` · ~${downloadSpeed.toFixed(1)} Mbps` : ''}`;

    return (
        <View style={styles.container}>
            {/* Dynamic Background */}
            <View style={[styles.orb, styles.orb1]} />
            <View style={[styles.orb, styles.orb2]} />

            {/* Particles Layer */}
            {PARTICLES.map((p) => (
                <Particle key={p.id} ix={p.x} iy={p.y} iscale={p.scale} idelay={p.delay} iduration={p.duration} />
            ))}

            {/* Main Content */}
            <View style={styles.content}>
                <Animated.View style={[styles.logoContainer, animatedStyles.logo]}>
                    <Animated.View style={[styles.logoRing, animatedStyles.logoRing]} />
                    <Image
                        source={require('../../../assets/images/ssg-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </Animated.View>

                <Animated.View style={[styles.textContainer, animatedStyles.fade]}>
                    <Text style={styles.title}>SSG InnoVoice</Text>
                    <Text style={styles.subtitle}>Speak Ideas. Spark Change.</Text>
                    <Text style={styles.campus}>CTU Daanbantayan Campus</Text>
                </Animated.View>

                {/* Progress Bar Area */}
                <Animated.View style={[styles.progressContainer, animatedStyles.fade]}>
                    <View style={styles.progressBarBg}>
                        <Animated.View style={[styles.progressBarFill, animatedStyles.progress]} />
                    </View>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>{loadingText}</Text>
                        <Text style={styles.progressPercentage}>{progress}%</Text>
                    </View>
                </Animated.View>

                {/* Connection Indicator — reflects real speed / offline */}
                <Animated.View style={[styles.connectionIndicator, animatedStyles.fade]}>
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, { backgroundColor: connectionDotColor }]} />
                        <View style={[styles.dot, { backgroundColor: connectionDotColor }]} />
                        <View style={[styles.dot, { backgroundColor: connectionDotColor }]} />
                    </View>
                    <Text style={styles.connectionText}>{connectionLabel}</Text>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundDark,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    orb: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.15,
    },
    orb1: {
        width: 600,
        height: 600,
        backgroundColor: colors.primary,
        top: -200,
        left: -200,
        transform: [{ scale: 1.2 }],
    },
    orb2: {
        width: 500,
        height: 500,
        backgroundColor: colors.primaryLight,
        bottom: -150,
        right: -150,
    },
    particle: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primaryLight,
        shadowColor: colors.primaryLight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 3,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: SPACING.xl,
        zIndex: 10,
    },
    logoContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        position: 'relative',
    },
    logoRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 80,
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: colors.primary,
        borderRightColor: colors.primary,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.white,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxxl,
    },
    title: {
        ...TYPOGRAPHY.heading1,
        color: colors.white,
        letterSpacing: 2,
        textShadowColor: 'rgba(220, 38, 38, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TYPOGRAPHY.heading4,
        color: colors.textMedium,
        marginBottom: SPACING.xs,
    },
    campus: {
        ...TYPOGRAPHY.bodySmall,
        color: colors.textLight,
        fontWeight: '500',
    },
    progressContainer: {
        width: '100%',
        maxWidth: 350,
        marginBottom: SPACING.xl,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: SPACING.sm,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        ...TYPOGRAPHY.caption,
        color: colors.textMedium,
    },
    progressPercentage: {
        ...TYPOGRAPHY.caption,
        color: colors.primaryLight,
        fontWeight: '700',
    },
    connectionIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginRight: SPACING.sm,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 2,
    },
    connectionText: {
        ...TYPOGRAPHY.caption,
        color: colors.textMedium,
        fontWeight: '600',
        letterSpacing: 1,
    },
});
