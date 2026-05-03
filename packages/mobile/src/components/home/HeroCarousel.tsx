import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Carousel } from '../ui/Carousel';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme/spacing';

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: () => void;
  gradient: string[];
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  accentIcon?: keyof typeof Ionicons.glyphMap;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: '1',
    title: 'Find Trusted Workers',
    subtitle: 'Connect with verified professionals near you',
    buttonText: 'Explore',
    buttonAction: () => router.push('/workers'),
    gradient: ['#6366F1', '#8B5CF6'],
    icon: 'people',
    iconBg: '#E0E7FF',
    accentIcon: 'star',
  },
  {
    id: '2',
    title: '24/7 Emergency',
    subtitle: 'Urgent repairs? Get help anytime',
    buttonText: 'Find Now',
    buttonAction: () => router.push('/workers'),
    gradient: ['#EC4899', '#F43F5E'],
    icon: 'flash',
    iconBg: '#FCE7F3',
    accentIcon: 'time',
  },
  {
    id: '3',
    title: 'Start Earning',
    subtitle: 'Register your skills today',
    buttonText: 'Join Free',
    buttonAction: () => router.push('/worker/register'),
    gradient: ['#06B6D4', '#0EA5E9'],
    icon: 'wallet',
    iconBg: '#CFFAFE',
    accentIcon: 'trending-up',
  },
  {
    id: '4',
    title: '100% Verified',
    subtitle: 'All workers are background checked',
    buttonText: 'Learn More',
    buttonAction: () => router.push('/workers'),
    gradient: ['#10B981', '#059669'],
    icon: 'shield-checkmark',
    iconBg: '#D1FAE5',
    accentIcon: 'checkmark-done',
  },
];

// Animated floating element
const FloatingElement = ({ 
  children, 
  delay = 0,
  range = 10,
}: { 
  children: React.ReactNode; 
  delay?: number;
  range?: number;
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -range,
          duration: 2000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// Glass button with press animation
const GlassButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.glassButton}
      >
        <Text style={styles.buttonText}>{title}</Text>
        <View style={styles.buttonArrow}>
          <Ionicons name="arrow-forward" size={14} color={colors.white} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Icon display with decorations
const IconDisplay = ({
  icon,
  accentIcon,
  iconBg,
  gradient,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  accentIcon?: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  gradient: string[];
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.iconDisplayWrapper}>
      {/* Background glow */}
      <View style={[styles.iconGlow, { backgroundColor: `${gradient[1]}40` }]} />
      
      {/* Main icon container */}
      <Animated.View
        style={[
          styles.iconContainer,
          { backgroundColor: `${iconBg}40`, transform: [{ scale: pulseAnim }] },
        ]}
      >
        <View style={[styles.iconInner, { backgroundColor: `${iconBg}60` }]}>
          <Ionicons name={icon} size={36} color={gradient[0]} />
        </View>
      </Animated.View>

      {/* Accent decorations */}
      {accentIcon && (
        <FloatingElement delay={300} range={8}>
          <View style={[styles.accentBadge, { backgroundColor: gradient[1] }]}>
            <Ionicons name={accentIcon} size={12} color={colors.white} />
          </View>
        </FloatingElement>
      )}

      {/* Floating dots */}
      <FloatingElement delay={0} range={6}>
        <View style={[styles.floatingDot, styles.dot1, { backgroundColor: gradient[0] }]} />
      </FloatingElement>
      <FloatingElement delay={500} range={8}>
        <View style={[styles.floatingDot, styles.dot2, { backgroundColor: gradient[1] }]} />
      </FloatingElement>
      <FloatingElement delay={1000} range={5}>
        <View style={[styles.floatingDot, styles.dot3, { backgroundColor: iconBg }]} />
      </FloatingElement>
    </View>
  );
};

export const HeroCarousel: React.FC = () => {
  return (
    <Carousel
      autoPlay
      autoPlayInterval={5000}
      showPagination
      paginationPosition="inside"
    >
      {BANNER_SLIDES.map((slide) => (
        <Pressable
          key={slide.id}
          onPress={slide.buttonAction}
          style={styles.slideContainer}
        >
          <View style={[styles.slide, { backgroundColor: slide.gradient[0] }]}>
            {/* Gradient overlay */}
            <View
              style={[styles.gradientOverlay, { backgroundColor: slide.gradient[1] }]}
            />

            {/* Abstract background shapes */}
            <View style={styles.shapesContainer}>
              <View style={[styles.shape, styles.shape1, { backgroundColor: `${slide.gradient[1]}50` }]} />
              <View style={[styles.shape, styles.shape2, { backgroundColor: `${slide.gradient[0]}30` }]} />
              <View style={[styles.shape, styles.shape3, { backgroundColor: `${slide.gradient[1]}25` }]} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <GlassButton title={slide.buttonText} onPress={slide.buttonAction} />
              </View>

              {/* Icon Display */}
              <IconDisplay
                icon={slide.icon}
                accentIcon={slide.accentIcon}
                iconBg={slide.iconBg}
                gradient={slide.gradient}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </Carousel>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
  },
  slide: {
    height: 180,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.6,
  },
  shapesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  shape: {
    position: 'absolute',
    borderRadius: 999,
  },
  shape1: {
    width: 150,
    height: 150,
    top: -50,
    right: -20,
  },
  shape2: {
    width: 100,
    height: 100,
    bottom: -30,
    left: -20,
  },
  shape3: {
    width: 60,
    height: 60,
    top: 80,
    right: 100,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  buttonArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDisplayWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.7,
  },
  dot1: {
    width: 8,
    height: 8,
    top: 5,
    left: 5,
  },
  dot2: {
    width: 6,
    height: 6,
    bottom: 10,
    right: 0,
  },
  dot3: {
    width: 5,
    height: 5,
    bottom: 5,
    left: 15,
  },
});

export default HeroCarousel;
