import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';

interface SelectorRowProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
  onPress: () => void;
  showChevron?: boolean;
}

export const SelectorRow = memo(function SelectorRow({
  icon,
  title,
  detail,
  onPress,
  showChevron = true,
}: SelectorRowProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrapper}>{icon}</View>

      {/* Text */}
      <View style={styles.textWrapper}>
        <Typography variant="bodySemibold">{title}</Typography>
        <Typography variant="small" color={theme.colors.textSecondary}>
          {detail}
        </Typography>
      </View>

      {/* Chevron */}
      {showChevron && (
        <Typography variant="body" color={theme.colors.neutral[400]}>
          ›
        </Typography>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  } as ViewStyle,
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } as ViewStyle,
  textWrapper: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
});
