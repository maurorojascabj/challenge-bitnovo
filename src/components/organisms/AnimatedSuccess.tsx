import React, { memo, useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/theme';

interface AnimatedSuccessProps {
  size?: number;
}

export const AnimatedSuccess = memo(function AnimatedSuccess({ size = 120 }: AnimatedSuccessProps) {
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  useEffect(() => {
    // Circle appears first
    circleOpacity.value = withTiming(1, { duration: 200 });
    circleScale.value = withSequence(
      withTiming(1.15, { duration: 350, easing: Easing.out(Easing.back(1.5)) }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    // Check mark fades in slightly after
    checkOpacity.value = withDelay(250, withTiming(1, { duration: 300 }));
    checkScale.value = withDelay(
      250,
      withSequence(
        withTiming(1.2, { duration: 250, easing: Easing.out(Easing.back(2)) }),
        withSpring(1, { damping: 10, stiffness: 180 })
      )
    );
  }, [circleOpacity, circleScale, checkOpacity, checkScale]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Animated.View
        style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, circleStyle]}
      />
      <Animated.View style={[styles.checkWrapper, checkStyle]}>
        <View style={styles.checkmark}>
          <View style={styles.checkLeft} />
          <View style={styles.checkRight} />
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  circle: {
    position: 'absolute',
    backgroundColor: theme.colors.success[100],
    borderWidth: 3,
    borderColor: theme.colors.success[500],
  } as ViewStyle,
  checkWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  checkmark: {
    width: 48,
    height: 36,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  } as ViewStyle,
  checkLeft: {
    position: 'absolute',
    left: 0,
    bottom: 2,
    width: 18,
    height: 4,
    backgroundColor: theme.colors.success[500],
    borderRadius: 2,
    transform: [{ rotate: '45deg' }, { translateX: 4 }, { translateY: -6 }],
  } as ViewStyle,
  checkRight: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 30,
    height: 4,
    backgroundColor: theme.colors.success[500],
    borderRadius: 2,
    transform: [{ rotate: '-50deg' }, { translateX: -4 }, { translateY: -8 }],
  } as ViewStyle,
});
