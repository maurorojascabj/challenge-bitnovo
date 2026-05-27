import React, { memo, useRef } from 'react';
import {
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';
import { FiatCurrency } from '@/constants/currencies';

interface AmountInputProps {
  value: string;
  onChange: (raw: string, masked: string) => void;
  currency: FiatCurrency;
  symbol: string;
  error?: string;
}

// Custom masks per currency using react-native-mask-input Mask arrays
// Each element is a string (literal) or RegExp (editable digit)
const digitMask = /\d/;

function buildEurMask(value: string): Mask {
  // Format: 0,00 €  → we build a simple decimal mask
  // react-native-mask-input Mask = Array<string | RegExp>
  const digits = value.replace(/\D/g, '');
  const len = Math.max(digits.length, 1);
  const intDigits = Math.max(len - 2, 1);
  const mask: Mask = [];
  for (let i = 0; i < intDigits; i++) mask.push(digitMask);
  mask.push(',');
  mask.push(digitMask);
  mask.push(digitMask);
  mask.push(' €');
  return mask;
}

function buildUsdMask(value: string): Mask {
  const digits = value.replace(/\D/g, '');
  const len = Math.max(digits.length, 1);
  const intDigits = Math.max(len - 2, 1);
  const mask: Mask = ['$ '];
  for (let i = 0; i < intDigits; i++) mask.push(digitMask);
  mask.push('.');
  mask.push(digitMask);
  mask.push(digitMask);
  return mask;
}

function buildGbpMask(value: string): Mask {
  const digits = value.replace(/\D/g, '');
  const len = Math.max(digits.length, 1);
  const intDigits = Math.max(len - 2, 1);
  const mask: Mask = ['£ '];
  for (let i = 0; i < intDigits; i++) mask.push(digitMask);
  mask.push('.');
  mask.push(digitMask);
  mask.push(digitMask);
  return mask;
}

export const AmountInput = memo(function AmountInput({
  value,
  onChange,
  currency,
  error,
}: AmountInputProps) {
  const inputRef = useRef<TextInput>(null);

  const getMask = (): Mask => {
    switch (currency) {
      case 'EUR':
        return buildEurMask(value);
      case 'USD':
        return buildUsdMask(value);
      case 'GBP':
        return buildGbpMask(value);
    }
  };

  const placeholder = currency === 'EUR' ? '0,00 €' : currency === 'USD' ? '$ 0.00' : '£ 0.00';

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
    >
      <MaskInput
        ref={inputRef}
        value={value}
        onChangeText={(masked, raw) => onChange(raw ?? '', masked)}
        mask={getMask()}
        keyboardType="decimal-pad"
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral[300]}
        textAlign="center"
        selectionColor={theme.colors.primary[500]}
        autoFocus
      />
      {error ? (
        <Typography variant="caption" color={theme.colors.danger[500]} align="center">
          {error}
        </Typography>
      ) : null}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create<{ container: ViewStyle; input: TextStyle }>({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  input: {
    fontSize: 52,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    minWidth: 120,
    ...(Platform.OS === 'ios' ? { lineHeight: 64 } : { includeFontPadding: false }),
  },
});
