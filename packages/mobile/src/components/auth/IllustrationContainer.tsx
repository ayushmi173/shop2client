import React from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../../theme/spacing';

interface IllustrationContainerProps {
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

/**
 * IllustrationContainer - A placeholder for vector illustrations
 * 
 * Replace the Ionicons with your actual illustrations:
 * - SVG: Use react-native-svg
 * - Lottie: Use lottie-react-native
 * 
 * Example with Lottie:
 * <LottieView source={require('./animation.json')} autoPlay loop />
 */
export const IllustrationContainer: React.FC<IllustrationContainerProps> = ({
  icon,
  gradient,
  size = 'md',
  animated = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!animated) return;

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animated]);

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return { container: 120, icon: 50, glow: 150 };
      case 'lg':
        return { container: 200, icon: 90, glow: 250 };
      default:
        return { container: 160, icon: 70, glow: 200 };
    }
  };

  const sizeConfig = getSizeConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: floatAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* Outer glow */}
      <View
        style={[
          styles.glow,
          {
            width: sizeConfig.glow,
            height: sizeConfig.glow,
            backgroundColor: `${gradient[0]}15`,
          },
        ]}
      />
      
      {/* Middle ring */}
      <View
        style={[
          styles.ring,
          {
            width: sizeConfig.container + 30,
            height: sizeConfig.container + 30,
            backgroundColor: `${gradient[1]}20`,
          },
        ]}
      />

      {/* Main container */}
      <View
        style={[
          styles.mainContainer,
          {
            width: sizeConfig.container,
            height: sizeConfig.container,
            backgroundColor: gradient[0],
          },
        ]}
      >
        {/* Gradient overlay effect */}
        <View
          style={[
            styles.gradientOverlay,
            { backgroundColor: gradient[1] },
          ]}
        />

        {/* Decorative shapes */}
        <View style={[styles.shape, styles.shape1, { backgroundColor: `${gradient[1]}40` }]} />
        <View style={[styles.shape, styles.shape2, { backgroundColor: `${gradient[0]}60` }]} />

        {/* 
          ILLUSTRATION PLACEHOLDER
          Replace this Ionicons with your actual illustration:
          
          For SVG:
          <YourSvgComponent width={sizeConfig.icon} height={sizeConfig.icon} />
          
          For Lottie:
          <LottieView 
            source={require('./your-animation.json')} 
            autoPlay 
            loop 
            style={{ width: sizeConfig.icon * 1.5, height: sizeConfig.icon * 1.5 }}
          />
        */}
        <Ionicons
          name={icon}
          size={sizeConfig.icon}
          color="white"
          style={styles.icon}
        />
      </View>

      {/* Floating accent dots */}
      <View style={[styles.accentDot, styles.dot1, { backgroundColor: gradient[1] }]} />
      <View style={[styles.accentDot, styles.dot2, { backgroundColor: gradient[0] }]} />
      <View style={[styles.accentDot, styles.dot3, { backgroundColor: `${gradient[1]}80` }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: spacing.xl,
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
  },
  mainContainer: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 40,
        elevation: 20,
      },
    }),
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    opacity: 0.5,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  shape: {
    position: 'absolute',
    borderRadius: 999,
  },
  shape1: {
    width: 60,
    height: 60,
    top: -10,
    right: -10,
  },
  shape2: {
    width: 40,
    height: 40,
    bottom: 10,
    left: -5,
  },
  icon: {
    zIndex: 1,
  },
  accentDot: {
    position: 'absolute',
    borderRadius: 999,
  },
  dot1: {
    width: 12,
    height: 12,
    top: 20,
    right: 30,
  },
  dot2: {
    width: 8,
    height: 8,
    bottom: 30,
    left: 20,
  },
  dot3: {
    width: 6,
    height: 6,
    top: 60,
    left: 10,
  },
});

export default IllustrationContainer;
