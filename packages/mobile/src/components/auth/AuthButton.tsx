import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  View,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme/spacing';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  gradient?: string[];
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  gradient,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (isDisabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          fontSize: fontSize.sm,
          iconSize: 16,
        };
      case 'md':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          fontSize: fontSize.base,
          iconSize: 18,
        };
      default:
        return {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing['2xl'],
          fontSize: fontSize.lg,
          iconSize: 20,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary[100],
          textColor: colors.text.primary,
          borderWidth: 0,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary[600],
          borderWidth: 2,
          borderColor: colors.primary[600],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: colors.primary[600],
          borderWidth: 0,
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary[600],
          textColor: colors.white,
          borderWidth: 0,
          borderColor: 'transparent',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          styles.button,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            backgroundColor: variantStyles.backgroundColor,
            borderWidth: variantStyles.borderWidth,
            borderColor: variantStyles.borderColor,
          },
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.textColor} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeStyles.fontSize,
                  color: variantStyles.textColor,
                },
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transitionProperty: 'transform, opacity',
        transitionDuration: '0.15s',
      },
      default: {
        shadowColor: colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  disabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
      default: {},
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

export default AuthButton;
