import { create } from 'zustand';
import { Order, OrderStatus } from '@/features/payments/types';

interface OrderStore {
  order: Order | null;
  setOrder: (order: Order) => void;
  updateStatus: (status: OrderStatus) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,

  setOrder: (order) => set({ order }),

  updateStatus: (status) => set((s) => (s.order ? { order: { ...s.order, status } } : {})),

  clearOrder: () => set({ order: null }),
}));
