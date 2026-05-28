import WhatsAppIcon from '@/assets/svg/whatsapp.svg';
import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { COUNTRIES } from '@/constants/countries';
import { useCountrySelectionStore } from '@/store/useCountrySelectionStore';
import { theme } from '@/theme';
import { router } from 'expo-router';
import React, { memo, useState } from 'react';
import { StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

const MAX_NUMBER_DIGIT = 10;

interface WhatsAppShareRowProps {
  onSend: (countryCode: string, phone: string) => void;
}

export const WhatsAppShareRow = memo(function WhatsAppShareRow({ onSend }: WhatsAppShareRowProps) {
  const selected = useCountrySelectionStore((s) => s.selected);
  const country = selected ?? COUNTRIES.espana;

  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);

  const isActive = phone.length > 0 || focused;

  const handleSend = () => {
    const sanitized = phone.replace(/\D/g, '');
    if (!sanitized) return;
    onSend(country.value, sanitized);
    setPhone('');
  };

  return (
    <View style={[styles.row, isActive ? styles.rowSelected : styles.rowDefault]}>
      {/* Icon */}
      <WhatsAppIcon width={24} height={24} />

      {/* Country chip */}
      <TouchableOpacity
        style={styles.countryChip}
        onPress={() => router.push('/selectors/country')}
        activeOpacity={0.7}
        hitSlop={8}
      >
        <Typography variant="body" style={styles.text}>{`${country.value} ▼`}</Typography>
      </TouchableOpacity>

      {/* Phone input */}
      <TextInput
        value={phone}
        onChangeText={setPhone}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="phone-pad"
        placeholder="300 678 9087"
        placeholderTextColor={theme.colors.neutral[300]}
        style={[styles.text, styles.input]}
        selectionColor={theme.colors.primary[500]}
        returnKeyType="done"
        onSubmitEditing={handleSend}
        maxLength={MAX_NUMBER_DIGIT}
      />

      {/* Send button */}
      <Button
        label="Enviar"
        onPress={handleSend}
        disabled={!phone.trim()}
        style={styles.sendButton}
      />
    </View>
  );
});

const styles = StyleSheet.create<{
  row: ViewStyle;
  rowDefault: ViewStyle;
  rowSelected: ViewStyle;
  countryChip: ViewStyle;
  text: TextStyle;
  input: TextStyle;
  sendButton: ViewStyle;
}>({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
  },
  rowDefault: {
    borderColor: theme.colors.border,
  },
  rowSelected: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary[500],
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  text: {
    fontSize: 14,
    fontFamily: theme.fontFamilies.regular,
    color: theme.colors.textPrimary,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  sendButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 0,
  },
});
