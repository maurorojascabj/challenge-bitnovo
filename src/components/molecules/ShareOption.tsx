import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';

interface ShareOptionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export const ShareOption = memo(function ShareOption({
  icon,
  label,
  onPress,
}: ShareOptionProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.container}>
      <View style={styles.iconCircle}>{icon}</View>
      <Typography variant="caption" align="center" color={theme.colors.textSecondary}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    minWidth: 72,
  } as ViewStyle,
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
  } as ViewStyle,
});
