import { useState, useCallback } from 'react';
import { createPayment } from '../api/paymentsApi';
import { useOrderStore } from '@/store/useOrderStore';
import { CreatePaymentRequest, AppError } from '../types';

interface UseCreatePaymentResult {
  isLoading: boolean;
  error: AppError | null;
  submit: (input: CreatePaymentRequest) => Promise<string | null>;
}

/**
 * Encapsulates payment creation: calls the API, stores the result and
 * returns the order identifier for routing.
 */
export function useCreatePayment(): UseCreatePaymentResult {
  const setOrder = useOrderStore((s) => s.setOrder);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const submit = useCallback(
    async (input: CreatePaymentRequest): Promise<string | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const order = await createPayment(input);
        setOrder(order);
        return order.identifier;
      } catch (err) {
        setError(err as AppError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setOrder]
  );

  return { isLoading, error, submit };
}
