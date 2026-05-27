import React from 'react';
import { router } from 'expo-router';
import { SelectorModal } from '@/components/organisms/SelectorModal';
import { FIAT_CURRENCY_LIST, FiatKey } from '@/constants/currencies';
import { usePaymentStore } from '@/store/usePaymentStore';

/**
 * Fiat currency selector — presented as a modal route.
 * Reads/writes the Zustand payment store's fiatKey.
 */
export default function FiatSelectorScreen() {
  const setFiatKey = usePaymentStore((s) => s.setFiatKey);

  const handleSelect = (item: (typeof FIAT_CURRENCY_LIST)[number]) => {
    setFiatKey(item.key as FiatKey);
    router.back();
  };

  return (
    <SelectorModal
      visible
      items={FIAT_CURRENCY_LIST}
      title="Selecciona una divisa"
      onSelect={handleSelect}
      onClose={() => router.back()}
    />
  );
}
