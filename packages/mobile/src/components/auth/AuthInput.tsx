import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme/spacing';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  error,
  icon,
  isPassword = false,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedBorder = useRef(new Animated.Value(0)).current;
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  const hasValue = value && value.length > 0;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(animatedBorder, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = animatedBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border.light, colors.primary[500]],
  });

  const labelTop = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -10],
  });

  const labelFontSize = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text.tertiary, colors.primary[600]],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? colors.error[500] : borderColor,
          },
          isFocused && styles.inputContainerFocused,
        ]}
      >
        {/* Floating label */}
        <Animated.Text
          style={[
            styles.floatingLabel,
            {
              top: labelTop,
              fontSize: labelFontSize,
              color: error ? colors.error[500] : labelColor,
              backgroundColor: isFocused || hasValue ? colors.white : 'transparent',
            },
          ]}
        >
          {label}
        </Animated.Text>

        {/* Icon */}
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={isFocused ? colors.primary[500] : colors.secondary[400]}
            />
          </View>
        )}

        {/* Input */}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            isPassword && styles.inputWithPassword,
          ]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="transparent"
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
            hitSlop={8}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.secondary[400]}
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Error message */}
      {error && (
        <Animated.View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.error[500]} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    minHeight: 56,
    ...Platform.select({
      web: {
        transitionProperty: 'border-color, box-shadow',
        transitionDuration: '0.2s',
      },
      default: {},
    }),
  },
  inputContainerFocused: {
    backgroundColor: colors.white,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 4px ${colors.primary[100]}`,
      },
      default: {
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  floatingLabel: {
    position: 'absolute',
    left: spacing.lg,
    paddingHorizontal: spacing.xs,
    fontWeight: fontWeight.medium,
    zIndex: 1,
  },
  iconContainer: {
    paddingLeft: spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithPassword: {
    paddingRight: spacing.xl,
  },
  passwordToggle: {
    position: 'absolute',
    right: spacing.lg,
    padding: spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error[500],
  },
});

export default AuthInput;
