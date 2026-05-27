import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { AmountInput } from '@/components/molecules/AmountInput';
import { ConceptInput } from '@/components/molecules/ConceptInput';
import { Toast } from '@/components/organisms/Toast';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { theme } from '@/theme';

import { useCreatePayment } from '@/features/payments/hooks/useCreatePayment';
import {
  CreatePaymentFormValues,
  createPaymentSchema,
} from '@/features/payments/schemas/createPayment.schema';

import { FIAT_CURRENCIES } from '@/constants/currencies';
import { usePaymentStore } from '@/store/usePaymentStore';

export default function CreatePaymentScreen() {
  const fiatKey = usePaymentStore((s) => s.draft.fiatKey);
  const currencyTouched = usePaymentStore((s) => s.draft.currencyTouched);
  const currency = FIAT_CURRENCIES[fiatKey];

  const title = currencyTouched ? 'Importe a pagar' : 'Crear pago';

  const { isLoading, error, submit } = useCreatePayment();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: { amount: '', concept: '' },
    mode: 'onChange',
  });

  const amount = watch('amount');
  const isContinueEnabled = amount.trim().length > 0 && !isLoading;

  const onSubmit = useCallback(
    async (values: CreatePaymentFormValues) => {
      const rawAmount = values.amount.replace(/[^\d,.]/, '').replace(',', '.');
      const identifier = await submit({
        expected_output_amount: parseFloat(rawAmount),
        fiat: currency.details,
        notes: values.concept,
      });
      if (identifier) {
        router.push(`/share/${identifier}`);
      }
    },
    [submit, currency.details]
  );

  return (
    <>
      <HeaderBar
        title={title}
        rightElement={
          <TouchableOpacity
            onPress={() => router.push('/selectors/fiat')}
            style={styles.fiatChip}
            hitSlop={8}
            activeOpacity={0.7}
          >
            <Typography variant="bodySemibold" color={theme.colors.primary[500]}>
              {currency.details}
            </Typography>
            <Typography variant="caption" color={theme.colors.primary[500]}>
              {' ▼'}
            </Typography>
          </TouchableOpacity>
        }
      />
      <ScreenContainer scrollable>
        <View style={styles.amountSection}>
          <Typography variant="small" color={theme.colors.textSecondary} align="center">
            Introduce el importe
          </Typography>

          <Controller
            control={control}
            name="amount"
            render={({ field: { value, onChange } }) => (
              <AmountInput
                value={value}
                onChange={(_raw, masked) => onChange(masked)}
                currency={currency.details}
                symbol={currency.symbol}
                error={errors.amount?.message}
              />
            )}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <View style={styles.formSection}>
          {/* Concept input */}
          <Controller
            control={control}
            name="concept"
            render={({ field: { value, onChange } }) => (
              <ConceptInput
                value={value ?? ''}
                onChange={onChange}
                error={errors.concept?.message}
              />
            )}
          />
        </View>

        {/* Sticky submit */}
        <View style={styles.footer}>
          <Button
            label="Continuar"
            onPress={handleSubmit(onSubmit)}
            fullWidth
            disabled={!isContinueEnabled}
            isLoading={isLoading}
          />
        </View>
      </ScreenContainer>

      {/* Error toast */}
      <Toast message={error?.message ?? ''} type="error" visible={!!error} />
    </>
  );
}

const styles = StyleSheet.create({
  amountSection: {
    paddingTop: theme.spacing.xxl,
    alignItems: 'center',
  } as ViewStyle,
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  } as ViewStyle,
  formSection: {
    gap: theme.spacing.lg,
  } as ViewStyle,
  footer: {
    paddingVertical: theme.spacing.xl,
    marginTop: 'auto',
  } as ViewStyle,
  fiatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary[200],
    backgroundColor: theme.colors.primary[50],
  } as ViewStyle,
});
