import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { theme } from '@/theme';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { AmountInput } from '@/components/molecules/AmountInput';
import { ConceptInput } from '@/components/molecules/ConceptInput';
import { SelectorRow } from '@/components/molecules/SelectorRow';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { Toast } from '@/components/organisms/Toast';
import { SelectorModal } from '@/components/organisms/SelectorModal';

import {
  createPaymentSchema,
  CreatePaymentFormValues,
} from '@/features/payments/schemas/createPayment.schema';
import { useCreatePayment } from '@/features/payments/hooks/useCreatePayment';

import {
  FIAT_CURRENCIES,
  FIAT_CURRENCY_LIST,
  FiatKey,
  FiatCurrency,
} from '@/constants/currencies';

export default function CreatePaymentScreen() {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { isLoading, error, submit } = useCreatePayment();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: { amount: '', fiat: 'EUR', concept: '' },
    mode: 'onChange',
  });

  const selectedFiat = watch('fiat') as FiatCurrency;
  const selectedFiatKey = selectedFiat.toLowerCase() as FiatKey;
  const currency = FIAT_CURRENCIES[selectedFiatKey];

  const onSubmit = useCallback(
    async (values: CreatePaymentFormValues) => {
      const rawAmount = values.amount.replace(/[^\d,.]/, '').replace(',', '.');
      const identifier = await submit({
        expected_output_amount: parseFloat(rawAmount),
        fiat: values.fiat,
        notes: values.concept,
      });
      if (identifier) {
        router.push(`/share/${identifier}`);
      }
    },
    [submit]
  );

  const amount = watch('amount');
  const isContinueEnabled = amount.trim().length > 0 && !isLoading;

  return (
    <>
      <HeaderBar title="Solicitar pago" />
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
                currency={selectedFiat}
                symbol={currency.symbol}
                error={errors.amount?.message}
              />
            )}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <View style={styles.formSection}>
          {/* Currency selector */}
          <SelectorRow
            icon={<currency.icon width={28} height={28} />}
            title={currency.title}
            detail={currency.details}
            onPress={() => setShowCurrencyModal(true)}
          />

          {/* Concept input */}
          <View style={styles.conceptWrapper}>
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

      {/* Currency selector modal */}
      <SelectorModal
        visible={showCurrencyModal}
        items={FIAT_CURRENCY_LIST}
        title="Selecciona una divisa"
        onSelect={(item) => setValue('fiat', item.details as FiatCurrency, { shouldValidate: true })}
        onClose={() => setShowCurrencyModal(false)}
      />

      {/* Error toast */}
      <Toast
        message={error?.message ?? ''}
        type="error"
        visible={!!error}
      />
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
  conceptWrapper: {
    marginTop: theme.spacing.sm,
  } as ViewStyle,
  footer: {
    paddingVertical: theme.spacing.xl,
    marginTop: 'auto',
  } as ViewStyle,
});
