import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme/spacing';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: colors.success[100], text: colors.success[700] },
  warning: { bg: colors.warning[100], text: colors.warning[600] },
  error: { bg: colors.error[100], text: colors.error[600] },
  info: { bg: colors.primary[100], text: colors.primary[700] },
  neutral: { bg: colors.secondary[100], text: colors.secondary[700] },
};

export function Badge({
  label,
  variant = 'neutral',
  size = 'sm',
  icon,
  style,
}: BadgeProps) {
  const colorScheme = variantColors[variant];

  return (
    <View
      style={[
        styles.container,
        size === 'sm' ? styles.small : styles.medium,
        { backgroundColor: colorScheme.bg },
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.smallText : styles.mediumText,
          { color: colorScheme.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: borderRadius.full,
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontWeight: fontWeight.medium,
  },
  smallText: {
    fontSize: fontSize.xs,
  },
  mediumText: {
    fontSize: fontSize.sm,
  },
});
