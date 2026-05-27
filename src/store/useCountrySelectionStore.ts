import { create } from 'zustand';
import { CountryItem } from '@/constants/countries';

interface CountrySelectionStore {
  selected: CountryItem | null;
  setSelected: (country: CountryItem) => void;
  clear: () => void;
}

export const useCountrySelectionStore = create<CountrySelectionStore>((set) => ({
  selected: null,
  setSelected: (country) => set({ selected: country }),
  clear: () => set({ selected: null }),
}));
