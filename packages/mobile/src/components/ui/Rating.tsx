import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight } from '../../theme/spacing';

interface RatingProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  style?: ViewStyle;
}

const starSizes: Record<string, number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function Rating({
  rating,
  totalReviews,
  size = 'md',
  showCount = true,
  style,
}: RatingProps) {
  const starSize = starSizes[size];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stars}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Ionicons
            key={`full-${i}`}
            name="star"
            size={starSize}
            color={colors.warning[500]}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <Ionicons
            name="star-half"
            size={starSize}
            color={colors.warning[500]}
          />
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Ionicons
            key={`empty-${i}`}
            name="star-outline"
            size={starSize}
            color={colors.warning[500]}
          />
        ))}
      </View>
      
      <Text style={[styles.ratingText, styles[`${size}Text`]]}>
        {rating.toFixed(1)}
      </Text>
      
      {showCount && totalReviews !== undefined && (
        <Text style={[styles.countText, styles[`${size}Text`]]}>
          ({totalReviews})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  countText: {
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  smText: {
    fontSize: fontSize.xs,
  },
  mdText: {
    fontSize: fontSize.sm,
  },
  lgText: {
    fontSize: fontSize.base,
  },
});
