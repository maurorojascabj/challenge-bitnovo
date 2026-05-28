import React, { memo } from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';

interface LoaderProps {
  fullScreen?: boolean;
  color?: string;
  size?: 'small' | 'large';
}

export const Loader = memo(function Loader({
  fullScreen = false,
  color = theme.colors.primary[500],
  size = 'large',
}: LoaderProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  } as ViewStyle,
  fullScreen: {
    flex: 1,
  } as ViewStyle,
});
