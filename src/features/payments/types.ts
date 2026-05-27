import { FiatCurrency } from '@/constants/currencies';

// ─── API request / response ───────────────────────────────────────────────────

export interface CreatePaymentRequest {
  expected_output_amount: number;
  fiat: FiatCurrency;
  notes?: string;
}

export interface Order {
  identifier: string;
  web_url: string;
  fiat: FiatCurrency;
  fiat_amount: number;
  status: OrderStatus;
  notes?: string;
  created_at?: string;
  expired_time?: string;
}

// ─── Order status ─────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'NW' // New
  | 'PE' // Pending
  | 'AC' // Accepted (partial payment received)
  | 'CO' // Completed
  | 'CA' // Cancelled
  | 'EX' // Expired
  | 'OC'; // Overpaid/completed

export const COMPLETED_STATUSES: OrderStatus[] = ['CO', 'OC'];
export const TERMINAL_STATUSES: OrderStatus[] = ['CO', 'OC', 'CA', 'EX'];

// ─── WebSocket events ─────────────────────────────────────────────────────────

export interface PaymentStatusEvent {
  status: OrderStatus;
  identifier: string;
}

// ─── App error ───────────────────────────────────────────────────────────────

export interface AppError {
  code: string;
  message: string;
  status?: number;
  raw?: unknown;
}
