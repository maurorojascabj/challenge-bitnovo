import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

import { Loader } from '@/components/atoms/Loader';
import { Typography } from '@/components/atoms/Typography';
import { QRCard } from '@/components/molecules/QRCard';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { theme } from '@/theme';

import { FiatKey } from '@/constants/currencies';
import { formatAmountWithSymbol } from '@/utils';
import { usePaymentStatus } from '@/features/payments/hooks/usePaymentStatus';
import { useOrderStore } from '@/store/useOrderStore';

import BitnovoLogo from '@/assets/svg/Bitnovo-logo.svg';
import InfoCircleIcon from '@/assets/svg/info-circle.svg';

export default function QRPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderStore((s) => s.order);

  // Realtime status — navigates to /success on completion
  usePaymentStatus(id);

  const webUrl = order?.web_url;

  const amountLabel = (() => {
    if (order == null || order.fiat_amount == null) return '';
    const fiatKey = (order.fiat?.toLowerCase() ?? 'eur') as FiatKey;
    return formatAmountWithSymbol(String(order.fiat_amount), fiatKey);
  })();

  return (
    <>
      <HeaderBar showBack />
      <ScreenContainer backgroundColor={theme.colors.primary[500]} padded={false}>
        {webUrl ? (
          <View style={styles.container}>
            {/* Info banner */}
            <View style={styles.banner}>
              <InfoCircleIcon width={24} height={24} />
              <Typography
                variant="small"
                color={theme.colors.textPrimary}
                style={styles.bannerText}
              >
                Escanea el QR y serás redirigido a la pasarela de pago de Bitnovo Pay.
              </Typography>
            </View>

            {/* QR code with Bitnovo logo */}
            <QRCard value={webUrl} size={260} logo={<BitnovoLogo width={80} height={29} />} />

            {/* Amount */}
            {order && (
              <Typography variant="h1" align="center" color={theme.colors.neutral[0]}>
                {amountLabel}
              </Typography>
            )}

            {/* Subtitle */}
            <Typography
              variant="small"
              color={theme.colors.surface}
              align="center"
              style={styles.subtitle}
            >
              Esta pantalla se actualizará automáticamente.
            </Typography>
          </View>
        ) : (
          <Loader fullScreen />
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.xl,
  } as ViewStyle,
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.buttonDisabledBg,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    width: '100%',
  } as ViewStyle,
  bannerText: {
    flex: 1,
  } as TextStyle,
  subtitle: {
    maxWidth: 320,
  } as TextStyle,
});
