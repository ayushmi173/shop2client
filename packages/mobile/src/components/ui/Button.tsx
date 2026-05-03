import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    styles[`${variant}Button`],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary[600]}
          size="small"
        />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyles}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.primary[600],
  },
  secondaryButton: {
    backgroundColor: colors.secondary[100],
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary[600],
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: colors.error[500],
  },

  // Sizes
  smSize: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  mdSize: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  lgSize: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },

  // Text
  text: {
    fontWeight: fontWeight.semibold,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.secondary[700],
  },
  outlineText: {
    color: colors.primary[600],
  },
  ghostText: {
    color: colors.primary[600],
  },
  dangerText: {
    color: colors.white,
  },

  // Text sizes
  smText: {
    fontSize: fontSize.sm,
  },
  mdText: {
    fontSize: fontSize.base,
  },
  lgText: {
    fontSize: fontSize.lg,
  },

  disabledText: {
    opacity: 0.7,
  },
});
