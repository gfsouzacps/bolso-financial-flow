import { z } from 'zod';

const esquemaRecorrencia = z.object({
  tipo: z.enum(['none', 'monthly', 'weekly', 'yearly', 'custom']),
  repeticoes: z.number().positive().optional(),
  dataFim: z.date().optional(),
  eInfinito: z.boolean().optional(),
}).optional();

export const esquemaTransacao = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória').max(100, 'Descrição muito longa'),
  valor: z.number().positive('Valor deve ser positivo').max(999999.99, 'Valor muito alto'),
  tipo: z.enum(['receita', 'despesa'], {
    required_error: 'Tipo é obrigatório',
  }),
  data: z.date({
    required_error: 'Data é obrigatória',
  }),
  carteiraId: z.string().min(1, 'Carteira é obrigatória'),
  usuarioId: z.string().min(1, 'Usuário é obrigatório'),
  categoriaId: z.string().optional(),
  categoriaTransacaoId: z.string().optional(),
  recorrencia: esquemaRecorrencia,
});

export type DadosFormularioTransacao = z.infer<typeof esquemaTransacao>;