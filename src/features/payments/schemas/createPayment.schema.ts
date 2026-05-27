import { z } from 'zod';

export const createPaymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'El importe es obligatorio')
    .refine((v) => {
      const num = parseFloat(v.replace(/[^0-9.,]/g, '').replace(',', '.'));
      return !isNaN(num) && num > 0;
    }, 'El importe debe ser mayor que 0'),
  concept: z.string().max(140, 'El concepto no puede superar los 140 caracteres').optional(),
});

export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
