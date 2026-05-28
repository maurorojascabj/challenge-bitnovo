import PayIcon from '@/assets/svg/pay.svg';
import { Typography } from '@/components/atoms/Typography';
import { theme } from '@/theme';
import React, { memo } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

interface PaymentSummaryCardProps {
  amount: string;
  symbol: string;
  subtitle: string;
}

export const PaymentSummaryCard = memo(function PaymentSummaryCard({
  amount,
  symbol,
  subtitle,
}: PaymentSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <PayIcon width={64} height={64} />
        <View style={styles.amountCol}>
          <Typography variant="body" color={theme.colors.textSecondary}>
            Solicitud de pago
          </Typography>
          <Typography variant="h1" color={theme.colors.textPrimary}>
            {amount} {symbol}
          </Typography>
        </View>
      </View>
      <Typography
        variant="small"
        color={theme.colors.textSecondary}
        align="center"
        style={styles.subtitle}
      >
        {subtitle}
      </Typography>
    </View>
  );
});

const styles = StyleSheet.create<{
  card: ViewStyle;
  topRow: ViewStyle;
  amountCol: ViewStyle;
  subtitle: TextStyle;
}>({
  card: {
    backgroundColor: theme.colors.backgroundCardPay,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  amountCol: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  subtitle: {
    marginTop: theme.spacing.md,
  },
});
