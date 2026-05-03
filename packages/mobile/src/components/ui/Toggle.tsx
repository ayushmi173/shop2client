import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight } from '../../theme/spacing';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Toggle({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = 'md',
  style,
}: ToggleProps) {
  const trackWidth = size === 'sm' ? 44 : 52;
  const trackHeight = size === 'sm' ? 24 : 28;
  const thumbSize = size === 'sm' ? 20 : 24;
  const thumbOffset = size === 'sm' ? 2 : 2;

  const translateX = value
    ? trackWidth - thumbSize - thumbOffset * 2
    : 0;

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      {(label || description) && (
        <View style={styles.labelContainer}>
          {label && (
            <Text style={[styles.label, disabled && styles.disabled]}>
              {label}
            </Text>
          )}
          {description && (
            <Text style={[styles.description, disabled && styles.disabled]}>
              {description}
            </Text>
          )}
        </View>
      )}
      
      <View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
          },
          value ? styles.trackActive : styles.trackInactive,
          disabled && styles.trackDisabled,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    justifyContent: 'center',
    padding: 2,
  },
  trackActive: {
    backgroundColor: colors.success[500],
  },
  trackInactive: {
    backgroundColor: colors.secondary[300],
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
