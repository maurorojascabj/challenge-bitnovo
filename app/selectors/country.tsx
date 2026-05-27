import React from 'react';
import { router } from 'expo-router';
import { SelectorModal } from '@/components/organisms/SelectorModal';
import { COUNTRY_LIST } from '@/constants/countries';
import { useCountrySelectionStore } from '@/store/useCountrySelectionStore';

/**
 * Country selector — presented as a modal route.
 * Writes the selected country to the transient useCountrySelectionStore
 * so the parent screen (WhatsApp share) can read it.
 */
export default function CountrySelectorScreen() {
  const setSelected = useCountrySelectionStore((s) => s.setSelected);

  const handleSelect = (item: (typeof COUNTRY_LIST)[number]) => {
    setSelected(item);
    router.back();
  };

  return (
    <SelectorModal
      visible
      items={COUNTRY_LIST}
      title="Seleccionar país"
      onSelect={handleSelect}
      onClose={() => router.back()}
    />
  );
}
