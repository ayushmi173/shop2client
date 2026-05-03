// Spacing scale (in pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// Font weights
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Line heights
export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Shadows - using elevation for native and boxShadow for web
import { Platform } from 'react-native';

const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number
) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`,
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation,
  };
};

export const shadows = {
  none: Platform.OS === 'web' 
    ? { boxShadow: 'none' }
    : { elevation: 0 },
  sm: createShadow(1, 2, 0.05, 1),
  md: createShadow(2, 4, 0.1, 3),
  lg: createShadow(4, 8, 0.15, 5),
  xl: createShadow(8, 16, 0.2, 8),
};
