import React, { memo, useRef, useState } from 'react';
import { StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Typography } from '@/components/atoms/Typography';
import { FIAT_CURRENCIES, FiatKey } from '@/constants/currencies';
import { theme } from '@/theme';
import { formatAmount, sanitizeInput } from '@/utils';

interface AmountInputProps {
  value: string;
  onChange: (raw: string) => void;
  currency: FiatKey;
  error?: string;
}

export const AmountInput = memo(function AmountInput({
  value,
  onChange,
  currency,
  error,
}: AmountInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const { symbol, symbolPosition, locale } = FIAT_CURRENCIES[currency];
  const placeholder = locale === 'es-ES' ? '0,00' : '0.00';
  const displayValue = focused ? value : formatAmount(value, currency);

  const valueColor = error ? theme.colors.danger[500] : theme.colors.primary[500];
  const symbolColor = error
    ? theme.colors.danger[500]
    : value
      ? theme.colors.primary[500]
      : theme.colors.placeholderAmount;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.wrapper}
    >
      <View style={[styles.row, !!error && styles.rowError]}>
        {symbolPosition === 'left' && (
          <Typography variant="h1" color={symbolColor}>
            {symbol}
          </Typography>
        )}

        <TextInput
          ref={inputRef}
          value={displayValue}
          onChangeText={(t) => onChange(sanitizeInput(t, currency))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholderAmount}
          style={[styles.input, { color: valueColor }]}
          selectionColor={theme.colors.primary[500]}
          autoFocus
        />

        {symbolPosition === 'right' && (
          <Typography variant="h1" color={symbolColor}>
            {symbol}
          </Typography>
        )}
      </View>

      {!!error && (
        <Typography variant="small" color={theme.colors.danger[500]} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create<{
  wrapper: ViewStyle;
  row: ViewStyle;
  rowError: ViewStyle;
  input: TextStyle;
  errorText: TextStyle;
}>({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary[500],
    paddingBottom: theme.spacing.xs,
  },
  rowError: {
    borderBottomColor: theme.colors.danger[500],
  },
  input: {
    fontSize: 40,
    fontFamily: theme.fontFamilies.bold,
    minWidth: 60,
    padding: 0,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
});
