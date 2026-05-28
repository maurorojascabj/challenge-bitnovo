import axiosClient from '@/services/http/axiosClient';
import { CreatePaymentRequest, Order } from '../types';

const ORDERS_PATH = '/orders/';

/**
 * Creates a new payment order.
 * Uses multipart/form-data as required by the Bitnovo API.
 */
export async function createPayment(input: CreatePaymentRequest): Promise<Order> {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
  const CRLF = '\r\n';
  const fields: [string, string][] = [
    ['expected_output_amount', String(input.expected_output_amount)],
    ['fiat', input.fiat],
    ...(input.notes ? [['notes', input.notes] as [string, string]] : []),
  ];
  const body =
    fields
      .map(
        ([name, value]) =>
          `--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}`
      )
      .join(CRLF) + `${CRLF}--${boundary}--${CRLF}`;

  const { data } = await axiosClient.post<Order>(ORDERS_PATH, body, {
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
  });
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
