import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';

interface DividerProps {
  marginVertical?: number;
}

export const Divider = memo(function Divider({ marginVertical = theme.spacing.lg }: DividerProps) {
  return <View style={[styles.divider, { marginVertical }]} />;
});

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  } as ViewStyle,
});
