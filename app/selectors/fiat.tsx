import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ListRenderItem,
} from 'react-native';
import { router } from 'expo-router';

import { HeaderBar } from '@/components/templates/HeaderBar';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { Typography } from '@/components/atoms/Typography';
import { theme } from '@/theme';
import { useDebounce } from '@/hooks/useDebounce';
import { FIAT_CURRENCY_LIST, FiatKey, CurrencyItem } from '@/constants/currencies';
import { usePaymentStore } from '@/store/usePaymentStore';

type CurrencyListItem = CurrencyItem & { key: FiatKey };

/**
 * Full-screen fiat currency selector.
 * Replaces the old bottom-sheet approach — navigated to via router.push('/selectors/fiat').
 */
export default function FiatSelectorScreen() {
  const fiatKey = usePaymentStore((s) => s.draft.fiatKey);
  const setFiatKey = usePaymentStore((s) => s.setFiatKey);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 150);

  const filtered = debouncedQuery
    ? FIAT_CURRENCY_LIST.filter(
        (item) =>
          item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.details.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : FIAT_CURRENCY_LIST;

  const handleSelect = useCallback(
    (key: FiatKey) => {
      setFiatKey(key);
      router.back();
    },
    [setFiatKey]
  );

  const renderItem: ListRenderItem<CurrencyListItem> = useCallback(
    ({ item }) => {
      const Icon = item.icon;
      const isSelected = item.key === fiatKey;

      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleSelect(item.key)}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Icon width={28} height={28} />
          </View>

          <View style={styles.rowText}>
            <Typography variant="bodySemibold">{item.title}</Typography>
            <Typography variant="small" color={theme.colors.textSecondary}>
              {item.details}
            </Typography>
          </View>

          {isSelected ? (
            <View style={styles.checkBox}>
              <Typography variant="bodySemibold" color={theme.colors.primary[500]}>
                ✓
              </Typography>
            </View>
          ) : (
            <Typography variant="body" color={theme.colors.neutral[300]}>
              ›
            </Typography>
          )}
        </TouchableOpacity>
      );
    },
    [fiatKey, handleSelect]
  );

  return (
    <>
      <HeaderBar title="Selecciona una divisa" showBack />
      <ScreenContainer padded={false}>
        {/* Search */}
        <View style={styles.searchWrapper}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar..."
            placeholderTextColor={theme.colors.neutral[400]}
            style={styles.searchInput}
            clearButtonMode="while-editing"
            autoCorrect={false}
            selectionColor={theme.colors.primary[500]}
          />
        </View>

        {/* List */}
        <FlatList
          data={filtered as CurrencyListItem[]}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Typography variant="bodySemibold" align="center" color={theme.colors.textSecondary}>
                No se encontraron divisas
              </Typography>
              <Typography variant="small" align="center" color={theme.colors.neutral[400]}>
                Prueba con otro término de búsqueda
              </Typography>
            </View>
          }
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.spacing.md,
  } as ViewStyle,
  searchInput: {
    height: 44,
    fontSize: 16,
    color: theme.colors.textPrimary,
  } as TextStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  } as ViewStyle,
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } as ViewStyle,
  rowText: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  checkBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  list: {
    flex: 1,
  } as ViewStyle,
  emptyState: {
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  } as ViewStyle,
});
