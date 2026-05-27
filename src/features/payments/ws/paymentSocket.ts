import { z } from 'zod';
import { WebSocketClient } from '@/services/websocket/WebSocketClient';
import { config } from '@/constants/config';
import { PaymentStatusEvent } from '../types';

// ─── Zod schema to harden incoming WS frames ──────────────────────────────────

const PaymentEventSchema = z.object({
  status: z.string(),
  identifier: z.string().optional(),
});

type RawPaymentEvent = z.infer<typeof PaymentEventSchema>;

// ─── Domain subscription ──────────────────────────────────────────────────────

export interface PaymentSubscription {
  onStatus: (cb: (event: PaymentStatusEvent) => void) => () => void;
  close: () => void;
}

/**
 * Opens a WebSocket connection for the given order identifier.
 * URL shape: wss://payments.pre-bnvo.com/ws/merchant/{identifier}/
 */
export function subscribeToOrder(identifier: string): PaymentSubscription {
  const url = `${config.wsUrl}${identifier}/`;
  const client = new WebSocketClient<RawPaymentEvent>({
    maxRetries: 5,
    baseDelay: 1_000,
    maxDelay: 30_000,
  });

  // The Bitnovo WS doesn't accept custom headers via URL — device ID is in the
  // HTTP upgrade handshake. RN WebSocket accepts a `headers` third param.
  // We pass it as a protocol/header bag for maximum compatibility.
  client.connect(url, { 'X-Device-Id': config.deviceId });

  const onStatus = (cb: (event: PaymentStatusEvent) => void): (() => void) => {
    return client.onMessage((raw) => {
      const parsed = PaymentEventSchema.safeParse(raw);
      if (!parsed.success) return;

      cb({
        status: parsed.data.status as PaymentStatusEvent['status'],
        identifier: parsed.data.identifier ?? identifier,
      });
    });
  };

  const close = () => client.disconnect();

  return { onStatus, close };
}
