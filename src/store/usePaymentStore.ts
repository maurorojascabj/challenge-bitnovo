import { create } from 'zustand';
import { FiatKey, DEFAULT_FIAT } from '@/constants/currencies';

interface PaymentDraft {
  amount: string;
  fiatKey: FiatKey;
  concept: string;
  currencyTouched: boolean;
}

interface PaymentStore {
  draft: PaymentDraft;
  setAmount: (amount: string) => void;
  setFiatKey: (fiatKey: FiatKey) => void;
  setConcept: (concept: string) => void;
  resetDraft: () => void;
}

const INITIAL_DRAFT: PaymentDraft = {
  amount: '',
  fiatKey: DEFAULT_FIAT,
  concept: '',
  currencyTouched: false,
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  draft: INITIAL_DRAFT,

  setAmount: (amount) => set((s) => ({ draft: { ...s.draft, amount } })),

  setFiatKey: (fiatKey) => set((s) => ({ draft: { ...s.draft, fiatKey, currencyTouched: true } })),

  setConcept: (concept) => set((s) => ({ draft: { ...s.draft, concept } })),

  resetDraft: () => set({ draft: INITIAL_DRAFT }),
}));
