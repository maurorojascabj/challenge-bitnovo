import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '@/theme';

interface QRCardProps {
  value: string;
  size?: number;
  logo?: React.ReactNode;
}

export const QRCard = memo(function QRCard({ value, size = 220, logo }: QRCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <QRCode
          value={value || 'https://bitnovo.com'}
          size={size}
          color={theme.colors.primary[900]}
          backgroundColor={theme.colors.neutral[0]}
          quietZone={12}
          ecl="H"
        />
        {logo && (
          <View style={[StyleSheet.absoluteFillObject, styles.logoOverlay]}>
            <View style={styles.logoBg}>{logo}</View>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create<{
  card: ViewStyle;
  logoOverlay: ViewStyle;
  logoBg: ViewStyle;
}>({
  card: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.neutral[0],
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBg: {
    backgroundColor: theme.colors.neutral[0],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xs,
  },
});
