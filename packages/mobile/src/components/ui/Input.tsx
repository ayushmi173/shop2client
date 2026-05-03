import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  size = 'md',
  variant = 'default',
  multiline,
  value,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const isPassword = secureTextEntry !== undefined;
  const hasValue = value && value.length > 0;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing.md,
          minHeight: 44,
          fontSize: fontSize.sm,
        };
      case 'lg':
        return {
          paddingVertical: spacing.lg + 2,
          paddingHorizontal: spacing.xl,
          minHeight: 60,
          fontSize: fontSize.lg,
        };
      default:
        return {
          paddingVertical: spacing.md + 2,
          paddingHorizontal: spacing.lg,
          minHeight: 54,
          fontSize: fontSize.base,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Animated border color
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.secondary[200], colors.primary[500]],
  });

  // Animated background
  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.secondary[50], colors.white],
  });

  // Animated shadow opacity for focus
  const shadowOpacity = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {props.placeholder && (
            <Text style={styles.optionalBadge}>
              {/* Can add "Required" or "Optional" badge here */}
            </Text>
          )}
        </View>
      )}
      
      {/* Input container with animated styles */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error[500] : borderColor,
            backgroundColor: error ? colors.error[50] : backgroundColor,
            minHeight: multiline ? 120 : sizeStyles.minHeight,
          },
          multiline && styles.multilineContainer,
          Platform.OS !== 'web' && {
            shadowOpacity: error ? 0 : shadowOpacity,
          },
        ]}
      >
        {/* Left icon */}
        {leftIcon && (
          <View style={[styles.iconContainer, styles.leftIcon]}>
            <View style={[
              styles.iconBackground,
              isFocused && styles.iconBackgroundFocused,
            ]}>
              <Ionicons
                name={leftIcon}
                size={18}
                color={isFocused ? colors.primary[600] : colors.secondary[400]}
              />
            </View>
          </View>
        )}
        
        {/* Text input */}
        <TextInput
          style={[
            styles.input,
            { 
              paddingVertical: sizeStyles.paddingVertical,
              paddingLeft: leftIcon ? spacing.xs : sizeStyles.paddingHorizontal,
              paddingRight: (isPassword || rightIcon) ? spacing.xs : sizeStyles.paddingHorizontal,
              fontSize: sizeStyles.fontSize,
            },
            multiline && styles.multilineInput,
          ]}
          placeholderTextColor={colors.secondary[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          multiline={multiline}
          value={value}
          {...props}
        />
        
        {/* Password toggle */}
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
            hitSlop={12}
          >
            <View style={styles.iconBackground}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.secondary[500]}
              />
            </View>
          </Pressable>
        )}
        
        {/* Right icon */}
        {rightIcon && !isPassword && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.iconContainer}
            disabled={!onRightIconPress}
            hitSlop={12}
          >
            <View style={styles.iconBackground}>
              <Ionicons
                name={rightIcon}
                size={18}
                color={colors.secondary[500]}
              />
            </View>
          </Pressable>
        )}
      </Animated.View>
      
      {/* Error message */}
      {error && (
        <Animated.View style={styles.messageContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={14} color={colors.error[600]} />
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
      
      {/* Hint message */}
      {hint && !error && (
        <View style={styles.messageContainer}>
          <View style={styles.hintIconContainer}>
            <Ionicons name="information-circle-outline" size={14} color={colors.secondary[500]} />
          </View>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  optionalBadge: {
    fontSize: fontSize.xs,
    color: colors.secondary[400],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease',
      },
      ios: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    paddingLeft: spacing.md,
    paddingRight: 0,
  },
  iconBackground: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackgroundFocused: {
    backgroundColor: colors.primary[100],
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontWeight: fontWeight.regular,
    lineHeight: Platform.OS === 'ios' ? undefined : 22,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
    lineHeight: 22,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  errorIconContainer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintIconContainer: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.error[600],
    fontWeight: fontWeight.medium,
  },
  hintText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.secondary[500],
  },
});
