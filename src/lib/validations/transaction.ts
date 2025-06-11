
import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(100, 'Descrição muito longa'),
  amount: z.number().positive('Valor deve ser positivo').max(999999.99, 'Valor muito alto'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Tipo é obrigatório',
  }),
  date: z.date({
    required_error: 'Data é obrigatória',
  }),
  walletId: z.string().min(1, 'Carteira é obrigatória'),
  userId: z.string().min(1, 'Usuário é obrigatório'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
