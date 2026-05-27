import { create } from 'zustand';
import { FiatKey, DEFAULT_FIAT } from '@/constants/currencies';

interface PaymentDraft {
  amount: string;
  fiatKey: FiatKey;
  concept: string;
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
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  draft: INITIAL_DRAFT,

  setAmount: (amount) => set((s) => ({ draft: { ...s.draft, amount } })),

  setFiatKey: (fiatKey) => set((s) => ({ draft: { ...s.draft, fiatKey } })),

  setConcept: (concept) => set((s) => ({ draft: { ...s.draft, concept } })),

  resetDraft: () => set({ draft: INITIAL_DRAFT }),
}));
