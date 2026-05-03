import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../../theme/spacing';
import { makeCall, formatPhone } from '../../lib/utils';

interface CallButtonProps {
  phone: string;
  variant?: 'primary' | 'secondary' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  showPhone?: boolean;
  label?: string;
  style?: ViewStyle;
}

export function CallButton({
  phone,
  variant = 'primary',
  size = 'md',
  showPhone = false,
  label,
  style,
}: CallButtonProps) {
  const handlePress = async () => {
    try {
      await makeCall(phone);
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const iconSize = size === 'sm' ? 18 : size === 'md' ? 22 : 26;

  if (variant === 'floating') {
    return (
      <TouchableOpacity
        style={[styles.floating, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons name="call" size={24} color={colors.white} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`${size}Size`],
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons
        name="call"
        size={iconSize}
        color={variant === 'primary' ? colors.white : colors.success[600]}
      />
      
      {(showPhone || label) && (
        <View style={styles.textContainer}>
          {label && (
            <Text
              style={[
                styles.label,
                variant === 'primary' ? styles.labelLight : styles.labelDark,
              ]}
            >
              {label}
            </Text>
          )}
          {showPhone && (
            <Text
              style={[
                styles.phone,
                variant === 'primary' ? styles.phoneLight : styles.phoneDark,
              ]}
            >
              {formatPhone(phone)}
            </Text>
          )}
        </View>
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

  // Variants
  primary: {
    backgroundColor: colors.success[500],
  },
  secondary: {
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[200],
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

  // Floating
  floating: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },

  textContainer: {
    alignItems: 'flex-start',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  labelLight: {
    color: colors.white,
  },
  labelDark: {
    color: colors.success[700],
  },
  phone: {
    fontSize: fontSize.xs,
  },
  phoneLight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  phoneDark: {
    color: colors.success[600],
  },
});
