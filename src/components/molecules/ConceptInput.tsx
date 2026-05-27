import React, { memo } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';

const MAX_LENGTH = 140;

interface ConceptInputProps {
  value: string;
  onChange: (text: string) => void;
  error?: string;
}

export const ConceptInput = memo(function ConceptInput({
  value,
  onChange,
  error,
}: ConceptInputProps) {
  return (
    <View style={styles.container}>
      <Typography variant="smallSemibold" color={theme.colors.textSecondary} style={styles.label}>
        Concepto (opcional)
      </Typography>
      <View style={[styles.inputWrapper, error ? styles.inputError : styles.inputDefault]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          maxLength={MAX_LENGTH}
          multiline
          numberOfLines={3}
          placeholder="Añade una descripción..."
          placeholderTextColor={theme.colors.neutral[300]}
          style={styles.input}
          textAlignVertical="top"
          selectionColor={theme.colors.primary[500]}
        />
        <Typography
          variant="caption"
          color={value.length >= MAX_LENGTH ? theme.colors.danger[500] : theme.colors.textSecondary}
          align="right"
          style={styles.counter}
        >
          {value.length}/{MAX_LENGTH}
        </Typography>
      </View>
      {error ? (
        <Typography variant="caption" color={theme.colors.danger[500]}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: theme.spacing.xs,
  } as ViewStyle,
  label: {
    marginBottom: theme.spacing.xxs,
  } as TextStyle,
  inputWrapper: {
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  } as ViewStyle,
  inputDefault: {
    borderColor: theme.colors.border,
  } as ViewStyle,
  inputError: {
    borderColor: theme.colors.danger[500],
  } as ViewStyle,
  input: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    minHeight: 72,
    padding: 0,
  } as TextStyle,
  counter: {
    marginTop: theme.spacing.xs,
  } as TextStyle,
});
