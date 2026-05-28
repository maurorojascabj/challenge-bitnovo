import { useOrderStore } from '@/store/useOrderStore';
import { useCallback, useState } from 'react';
import { createPayment } from '../api/paymentsApi';
import { AppError, CreatePaymentRequest } from '../types';

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
        // The create endpoint may omit fiat_amount in its response.
        // Enrich with the value the user entered so the share screen can display it.
        const enrichedOrder = {
          ...order,
          fiat_amount: order.fiat_amount ?? input.expected_output_amount,
          fiat: order.fiat ?? input.fiat,
        };
        setOrder(enrichedOrder);
        return enrichedOrder.identifier;
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
