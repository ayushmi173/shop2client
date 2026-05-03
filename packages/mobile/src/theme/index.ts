export * from './colors';
export * from './spacing';
export * from './ThemeContext';

import { colors } from './colors';
import { spacing, borderRadius, fontSize, fontWeight, lineHeight, shadows } from './spacing';

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  lineHeight,
  shadows,
};

export type Theme = typeof theme;
