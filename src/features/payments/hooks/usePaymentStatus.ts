import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { subscribeToOrder } from '../ws/paymentSocket';
import { useOrderStore } from '@/store/useOrderStore';
import { COMPLETED_STATUSES, OrderStatus } from '../types';

/**
 * Subscribes to realtime payment status for a given order identifier.
 * Automatically navigates to the success screen when the payment is completed.
 * Cleans up the WebSocket connection on unmount.
 */
export function usePaymentStatus(identifier: string | undefined): void {
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const subscriptionRef = useRef<ReturnType<typeof subscribeToOrder> | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const subscription = subscribeToOrder(identifier);
    subscriptionRef.current = subscription;

    const unsubscribe = subscription.onStatus((event) => {
      const status = event.status as OrderStatus;
      updateStatus(status);

      if (COMPLETED_STATUSES.includes(status)) {
        subscription.close();
        router.replace('/success');
      }
    });

    return () => {
      unsubscribe();
      subscription.close();
    };
  }, [identifier, updateStatus]);
}
