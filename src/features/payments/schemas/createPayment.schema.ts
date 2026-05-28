import { z } from 'zod';

import { parseAmount } from '@/utils';

export const createPaymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'El importe es obligatorio')
    .refine((v) => {
      const num = parseAmount(v);
      return !isNaN(num) && num > 0;
    }, 'El importe debe ser mayor que 0'),
  concept: z.string().max(140, 'El concepto no puede superar los 140 caracteres').optional(),
});

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
