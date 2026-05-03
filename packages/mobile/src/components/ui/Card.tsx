import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof spacing | 'none';
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'lg',
  onPress,
  style,
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    padding !== 'none' && { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [cardStyles, pressed && styles.pressed]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filled: {
    backgroundColor: colors.background.secondary,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
