import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { theme } from '@/theme';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { Typography } from '@/components/atoms/Typography';
import { Loader } from '@/components/atoms/Loader';
import { QRCard } from '@/components/molecules/QRCard';

import { useOrderStore } from '@/store/useOrderStore';
import { usePaymentStatus } from '@/features/payments/hooks/usePaymentStatus';

export default function QRPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderStore((s) => s.order);

  // Realtime status — navigates to /success on completion
  usePaymentStatus(id);

  const webUrl = order?.web_url;

  return (
    <>
      <HeaderBar title="Código QR" showBack />
      <ScreenContainer>
        <View style={styles.container}>
          {webUrl ? (
            <>
              <QRCard value={webUrl} size={240} />

              <View style={styles.info}>
                {order && (
                  <Typography variant="h2" align="center" color={theme.colors.primary[500]}>
                    {order.fiat_amount} {order.fiat}
                  </Typography>
                )}
                <Typography variant="body" color={theme.colors.textSecondary} align="center">
                  Escanea el código QR para completar el pago
                </Typography>
                <Typography variant="caption" color={theme.colors.neutral[400]} align="center">
                  La pantalla se actualizará automáticamente al recibir el pago.
                </Typography>
              </View>
            </>
          ) : (
            <Loader fullScreen />
          )}
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  } as ViewStyle,
  info: {
    alignItems: 'center',
    gap: theme.spacing.md,
    maxWidth: 320,
  } as ViewStyle,
});
