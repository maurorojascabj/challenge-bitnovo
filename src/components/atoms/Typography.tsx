import React, { memo } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { TypographyVariant } from '@/theme/typography';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export const Typography = memo(function Typography({
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
  ...rest
}: TypographyProps) {
  return (
    <Text
      style={[
        styles.base,
        theme.typography[variant],
        { color: color ?? theme.colors.textPrimary, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
