import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  Platform,
  ViewToken,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthButton } from '../src/components/auth';
import { colors } from '../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../src/theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  accentColor: string;
  shapes: { type: 'circle' | 'square' | 'triangle'; color: string; position: { top?: number; left?: number; right?: number; bottom?: number } }[];
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'people',
    title: 'Find Local Workers',
    subtitle: 'Connect with trusted service professionals in your neighborhood. Quality help is just a tap away.',
    accentColor: colors.primary[500],
    shapes: [
      { type: 'circle', color: colors.primary[200], position: { top: 20, left: 30 } },
      { type: 'square', color: colors.warning[200], position: { top: 80, right: 40 } },
      { type: 'triangle', color: colors.error[200], position: { bottom: 40, left: 50 } },
    ],
  },
  {
    id: '2',
    icon: 'calendar',
    title: 'Easy Booking',
    subtitle: 'Schedule appointments with real-time availability. No more waiting for callbacks.',
    accentColor: '#10B981',
    shapes: [
      { type: 'circle', color: '#D1FAE5', position: { top: 30, right: 40 } },
      { type: 'square', color: colors.primary[200], position: { bottom: 60, left: 30 } },
      { type: 'triangle', color: colors.warning[200], position: { top: 90, left: 60 } },
    ],
  },
  {
    id: '3',
    icon: 'shield-checkmark',
    title: 'Verified & Trusted',
    subtitle: 'Every worker is background-verified and rated by the community.',
    accentColor: colors.warning[500],
    shapes: [
      { type: 'circle', color: colors.warning[200], position: { top: 40, left: 40 } },
      { type: 'square', color: colors.primary[200], position: { top: 100, right: 30 } },
      { type: 'triangle', color: '#D1FAE5', position: { bottom: 30, right: 60 } },
    ],
  },
];

const ONBOARDING_KEY = 'hasSeenOnboarding';

// Floating Shape Component
const FloatingShape = ({ 
  type, 
  color, 
  position,
  delay = 0,
}: { 
  type: 'circle' | 'square' | 'triangle'; 
  color: string; 
  position: any;
  delay?: number;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(floatAnim, { toValue: -8, duration: 2000, useNativeDriver: true }),
            Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
          ]),
          Animated.timing(rotateAnim, { toValue: 1, duration: 6000, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shapeStyle = () => {
    switch (type) {
      case 'circle':
        return {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: color,
        };
      case 'square':
        return {
          width: 20,
          height: 20,
          backgroundColor: 'transparent',
          borderWidth: 3,
          borderColor: color,
        };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeftWidth: 12,
          borderRightWidth: 12,
          borderBottomWidth: 20,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View
      style={[
        styles.floatingShape,
        position,
        shapeStyle(),
        {
          transform: [
            { translateY: floatAnim },
            ...(type === 'square' ? [{ rotate }] : []),
          ],
        },
      ]}
    />
  );
};

// Illustration Component
const OnboardingIllustration = ({ 
  icon, 
  accentColor, 
  shapes,
  scrollX,
  index,
}: { 
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string; 
  shapes: OnboardingSlide['shapes'];
  scrollX: Animated.Value;
  index: number;
}) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.illustrationContainer, { transform: [{ scale }], opacity }]}>
      {/* Floating shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape 
          key={i} 
          type={shape.type} 
          color={shape.color} 
          position={shape.position}
          delay={i * 200}
        />
      ))}
      
      {/* Main illustration circle */}
      <View style={[styles.mainCircle, { backgroundColor: `${accentColor}15` }]}>
        <View style={[styles.innerCircle, { backgroundColor: `${accentColor}25` }]}>
          <View style={[styles.iconContainer, { backgroundColor: accentColor }]}>
            <Ionicons name={icon} size={48} color={colors.white} />
          </View>
        </View>
      </View>
      
      {/* Person silhouettes */}
      <View style={styles.personsContainer}>
        <View style={[styles.person, styles.personLeft]}>
          <View style={[styles.personHead, { backgroundColor: '#FFD4A3' }]} />
          <View style={[styles.personBody, { backgroundColor: accentColor }]} />
        </View>
        <View style={[styles.person, styles.personRight]}>
          <View style={[styles.personHead, { backgroundColor: '#C4A77D' }]} />
          <View style={[styles.personBody, { backgroundColor: colors.secondary[400] }]} />
        </View>
      </View>
    </Animated.View>
  );
};

// Slide Component
const OnboardingSlideComponent = ({ 
  item, 
  index,
  scrollX,
}: { 
  item: OnboardingSlide; 
  index: number;
  scrollX: Animated.Value;
}) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 0, 50],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.slide}>
      <OnboardingIllustration 
        icon={item.icon}
        accentColor={item.accentColor}
        shapes={item.shapes}
        scrollX={scrollX}
        index={index}
      />

      <Animated.View style={[styles.textContainer, { transform: [{ translateY }], opacity }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

// Pagination Dot Component
const PaginationDot = ({ index, scrollX }: { index: number; scrollX: Animated.Value }) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const width = scrollX.interpolate({
    inputRange,
    outputRange: [8, 24, 8],
    extrapolate: 'clamp',
  });

  const backgroundColor = scrollX.interpolate({
    inputRange,
    outputRange: [colors.secondary[300], colors.primary[600], colors.secondary[300]],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        { width, backgroundColor },
      ]}
    />
  );
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {}
    router.replace('/auth/signup');
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item, index }) => (
          <OnboardingSlideComponent
            item={item}
            index={index}
            scrollX={scrollX}
          />
        )}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Pagination */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        {/* CTA Button */}
        <AuthButton
          title={isLastSlide ? 'Get Started' : 'Next'}
          onPress={handleNext}
          icon={isLastSlide ? 'arrow-forward' : 'chevron-forward'}
          iconPosition="right"
        />

        {/* Login link */}
        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: spacing.xl,
    zIndex: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.08,
  },
  illustrationContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingShape: {
    position: 'absolute',
  },
  mainCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      },
    }),
  },
  personsContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    gap: 60,
  },
  person: {
    alignItems: 'center',
  },
  personLeft: {},
  personRight: {},
  personHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 2,
  },
  personBody: {
    width: 28,
    height: 36,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing['2xl'],
    gap: spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: fontSize.base,
    color: colors.primary[600],
    fontWeight: fontWeight.semibold,
  },
});
