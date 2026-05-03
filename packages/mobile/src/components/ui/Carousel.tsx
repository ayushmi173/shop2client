import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showPagination?: boolean;
  paginationPosition?: 'inside' | 'outside';
  containerStyle?: object;
  slideStyle?: object;
  gap?: number;
  sideMargin?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  autoPlayInterval = 4000,
  showPagination = true,
  paginationPosition = 'inside',
  containerStyle,
  slideStyle,
  gap = spacing.md,
  sideMargin = spacing.lg,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Animated values for pagination dots
  const dotAnimations = useRef(
    React.Children.map(children, () => new Animated.Value(0)) || []
  ).current;

  const slideWidth = SCREEN_WIDTH - sideMargin * 2;
  const totalSlides = React.Children.count(children);

  // Animate dots when active index changes
  useEffect(() => {
    dotAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === activeIndex ? 1 : 0,
        friction: 8,
        tension: 100,
        useNativeDriver: false,
      }).start();
    });
  }, [activeIndex, dotAnimations]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (scrollViewRef.current && index >= 0 && index < totalSlides) {
        scrollViewRef.current.scrollTo({
          x: index * (slideWidth + gap),
          animated: true,
        });
      }
    },
    [slideWidth, gap, totalSlides]
  );

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && totalSlides > 1 && !isUserScrolling) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % totalSlides;
        scrollToIndex(nextIndex);
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, activeIndex, totalSlides, scrollToIndex, isUserScrolling]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (slideWidth + gap));
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalSlides) {
      setActiveIndex(newIndex);
    }
  };

  const handleScrollBeginDrag = () => {
    setIsUserScrolling(true);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleScrollEndDrag = () => {
    // Resume auto-play after user stops scrolling
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  };

  const handleDotPress = (index: number) => {
    scrollToIndex(index);
  };

  const renderPagination = () => {
    if (!showPagination || totalSlides <= 1) return null;

    return (
      <View
        style={[
          styles.paginationContainer,
          paginationPosition === 'outside' && styles.paginationOutside,
        ]}
      >
        {React.Children.map(children, (_, index) => {
          const animValue = dotAnimations[index];
          
          return (
            <Pressable
              key={index}
              onPress={() => handleDotPress(index)}
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 28],
                    }),
                    backgroundColor: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 1)'],
                    }),
                    transform: [
                      {
                        scale: animValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.1],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={Platform.OS !== 'web'}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={slideWidth + gap}
        snapToAlignment="start"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: sideMargin },
        ]}
      >
        {React.Children.map(children, (child, index) => (
          <Animated.View
            key={index}
            style={[
              styles.slide,
              { width: slideWidth, marginRight: index < totalSlides - 1 ? gap : 0 },
              slideStyle,
            ]}
          >
            {child}
          </Animated.View>
        ))}
      </ScrollView>
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    gap: spacing.xs,
  },
  paginationOutside: {
    position: 'relative',
    bottom: 0,
    marginTop: spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default Carousel;
