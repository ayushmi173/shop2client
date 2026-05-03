import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { fontSize, fontWeight } from '../../theme/spacing';
import { getInitials } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  imageUrl?: string | null;
  firstName: string;
  lastName?: string;
  size?: AvatarSize;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
  style?: ViewStyle;
}

const sizes: Record<AvatarSize, number> = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
};

const fontSizes: Record<AvatarSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 24,
  xl: 32,
};

export function Avatar({
  imageUrl,
  firstName,
  lastName,
  size = 'md',
  showOnlineIndicator = false,
  isOnline = false,
  style,
}: AvatarProps) {
  const dimension = sizes[size];
  const textSize = fontSizes[size];
  const initials = getInitials(firstName, lastName);

  const containerStyle = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { borderRadius: dimension / 2 }]}
        />
      ) : (
        <View style={[styles.placeholder, { borderRadius: dimension / 2 }]}>
          <Text style={[styles.initials, { fontSize: textSize }]}>
            {initials}
          </Text>
        </View>
      )}
      
      {showOnlineIndicator && (
        <View
          style={[
            styles.indicator,
            isOnline ? styles.online : styles.offline,
            {
              width: dimension * 0.25,
              height: dimension * 0.25,
              borderRadius: dimension * 0.125,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary[700],
    fontWeight: fontWeight.semibold,
  },
  indicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.white,
  },
  online: {
    backgroundColor: colors.success[500],
  },
  offline: {
    backgroundColor: colors.secondary[400],
  },
});
