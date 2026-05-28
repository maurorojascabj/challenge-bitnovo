import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { router } from 'expo-router';

import { theme } from '@/theme';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import TickCircleIcon from '@/assets/svg/tick-circle.svg';

import { useOrderStore } from '@/store/useOrderStore';

export default function PaymentSuccessScreen() {
  const order = useOrderStore((s) => s.order);
  const clearOrder = useOrderStore((s) => s.clearOrder);

  const handleNewPayment = () => {
    clearOrder();
    router.replace('/');
  };

  return (
    <>
      <HeaderBar showLogo />
      <ScreenContainer>
        <View style={styles.container}>
          {/* Success icon */}
          <TickCircleIcon width={120} height={120} />

          {/* Text */}
          <View style={styles.textBlock}>
            <Typography variant="h2" align="center">
              ¡Pago recibido!
            </Typography>

            {order && (
              <Typography variant="h1" align="center" color={theme.colors.primary[500]}>
                {order.fiat_amount} {order.fiat}
              </Typography>
            )}

            <Typography variant="body" color={theme.colors.textSecondary} align="center">
              La transacción se ha completado correctamente.{'\n'}Gracias por usar Bitnovo Pay.
            </Typography>
          </View>

          {/* CTA */}
          <Button
            label="Crear nuevo pago"
            onPress={handleNewPayment}
            fullWidth
            style={styles.cta}
          />
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
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.xxxl,
  } as ViewStyle,
  textBlock: {
    alignItems: 'center',
    gap: theme.spacing.md,
  } as ViewStyle,
  cta: {
    marginTop: theme.spacing.lg,
  } as ViewStyle,
});
