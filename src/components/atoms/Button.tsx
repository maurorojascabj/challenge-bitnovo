import React, { memo } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/theme';
import { Typography } from './Typography';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button = memo(function Button({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const handlePress = async () => {
    if (isDisabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.neutral[0] : theme.colors.primary[500]}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
          <Typography variant="bodySemibold" color={getTextColor(variant, isDisabled)}>
            {label}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
});

function getTextColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) return theme.colors.textDisabled;
  switch (variant) {
    case 'primary':
      return theme.colors.neutral[0];
    case 'secondary':
      return theme.colors.primary[500];
    case 'ghost':
      return theme.colors.primary[500];
    case 'danger':
      return theme.colors.neutral[0];
  }
}

const styles = StyleSheet.create<{
  base: ViewStyle;
  primary: ViewStyle;
  secondary: ViewStyle;
  ghost: ViewStyle;
  danger: ViewStyle;
  disabled: ViewStyle;
  fullWidth: ViewStyle;
  content: ViewStyle;
  iconWrapper: ViewStyle;
}>({
  base: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primary: {
    backgroundColor: theme.colors.primary[500],
    ...theme.shadows.button,
  },
  secondary: {
    backgroundColor: theme.colors.neutral[0],
    borderWidth: 1.5,
    borderColor: theme.colors.primary[500],
  },
  ghost: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 1.5,
    borderColor: theme.colors.neutral[200],
  },
  danger: {
    backgroundColor: theme.colors.danger[500],
  },
  disabled: {
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 0,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
