import { Typography } from '@/components/atoms/Typography';
import { theme } from '@/theme';
import React, { memo } from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ShareRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  selected?: boolean;
}

export const ShareRow = memo(function ShareRow({
  icon,
  label,
  onPress,
  trailing,
  selected = false,
}: ShareRowProps) {
  const rowStyle = [styles.row, selected ? styles.rowSelected : styles.rowDefault];

  const inner = (
    <>
      {icon}
      <Typography variant="body" color={theme.colors.textPrimary} style={styles.label}>
        {label}
      </Typography>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={rowStyle} onPress={onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={rowStyle}>{inner}</View>;
});

const styles = StyleSheet.create<{
  row: ViewStyle;
  rowDefault: ViewStyle;
  rowSelected: ViewStyle;
  label: TextStyle;
  trailing: ViewStyle;
}>({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
  },
  rowDefault: {
    borderColor: theme.colors.border,
  },
  rowSelected: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary[500],
  },
  label: {
    flex: 1,
  },
  trailing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
