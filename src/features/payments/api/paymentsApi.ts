import axiosClient from '@/services/http/axiosClient';
import { CreatePaymentRequest, Order } from '../types';

const ORDERS_PATH = '/orders/';

/**
 * Creates a new payment order.
 * Uses multipart/form-data as required by the Bitnovo API.
 */
export async function createPayment(input: CreatePaymentRequest): Promise<Order> {
  const form = new FormData();
  form.append('expected_output_amount', String(input.expected_output_amount));
  form.append('fiat', input.fiat);
  if (input.notes) {
    form.append('notes', input.notes);
  }

  const { data } = await axiosClient.post<Order>(ORDERS_PATH, form);
  return data;
}

/**
 * Fetches a payment order by identifier.
 * Used as a fallback if the WebSocket misses the final status event.
 */
export async function getPayment(identifier: string): Promise<Order> {
  const { data } = await axiosClient.get<Order>(`${ORDERS_PATH}${identifier}/`);
  return data;
}
