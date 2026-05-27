import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '@/theme';

interface QRCardProps {
  value: string;
  size?: number;
}

export const QRCard = memo(function QRCard({ value, size = 220 }: QRCardProps) {
  return (
    <View style={styles.card}>
      <QRCode
        value={value || 'https://bitnovo.com'}
        size={size}
        color={theme.colors.textPrimary}
        backgroundColor={theme.colors.neutral[0]}
        quietZone={12}
        ecl="M"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.neutral[0],
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as ViewStyle,
});
