import React, { memo, useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';

type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide?: () => void;
  duration?: number;
}

export const Toast = memo(function Toast({
  message,
  type = 'error',
  visible,
  onHide,
  duration = 3000,
}: ToastProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 250 }),
        withDelay(duration, withTiming(0, { duration: 300 }))
      );
      translateY.value = withSequence(
        withTiming(0, { duration: 250 }),
        withDelay(duration, withTiming(-20, { duration: 300 }))
      );

      const timer = setTimeout(() => onHide?.(), duration + 550);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const bgColor = {
    error: theme.colors.danger[500],
    success: theme.colors.success[500],
    info: theme.colors.primary[500],
  }[type];

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }, animStyle]}>
      <Typography variant="smallSemibold" color={theme.colors.neutral[0]}>
        {message}
      </Typography>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    zIndex: 9999,
    ...theme.shadows.modal,
  } as ViewStyle,
});
