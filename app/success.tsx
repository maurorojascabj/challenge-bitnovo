import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { router } from 'expo-router';

import { theme } from '@/theme';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import TickCircleGreenIcon from '@/assets/svg/tick-circle-green.svg';

import { useOrderStore } from '@/store/useOrderStore';

export default function PaymentSuccessScreen() {
  const clearOrder = useOrderStore((s) => s.clearOrder);

  const handleFinish = () => {
    clearOrder();
    router.replace('/');
  };

  return (
    <>
      <HeaderBar showLogo />
      <ScreenContainer
        stickyFooter={<Button label="Finalizar" variant="ghost" onPress={handleFinish} fullWidth />}
      >
        <View style={styles.container}>
          {/* Success icon */}
          <TickCircleGreenIcon width={120} height={120} />

          {/* Text */}
          <View style={styles.textBlock}>
            <Typography variant="h2" align="center">
              Pago recibido
            </Typography>

            <Typography variant="body" color={theme.colors.textSecondary} align="center">
              El pago se ha confirmado con éxito
            </Typography>
          </View>
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
});
