export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: Date;
  carteiraId: string;
  usuarioId: string;
  categoriaId?: string; // Para categorias de investimento
  categoriaTransacaoId?: string; // Para categorias de transação normais
  recorrencia?: {
    tipo: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semester' | 'yearly' | 'custom';
    repeticoes?: number;
    dataFim?: Date;
    eInfinito?: boolean;
  };
}

export interface Carteira {
  id: string;
  nome: string;
  saldo: number;
}

export interface Usuario {
  id: string;
  nome: string;
  avatar?: string;
  cor: string;
}

export interface CategoriaInvestimento {
  id: string;
  nome: string;
  objetivo: number;
  atual: number;
  cor: string;
  criadoEm: Date;
}

export interface CategoriaTransacao {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa' | 'ambos';
  cor: string;
}

export interface DadosFormularioTransacao {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: Date;
  carteiraId: string;
  usuarioId: string;
  categoriaId?: string;
  categoriaTransacaoId?: string;
  recorrencia?: {
    tipo: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semester' | 'yearly' | 'custom';
    repeticoes?: number;
    dataFim?: Date;
    eInfinito?: boolean;
  };
}

export interface FiltrosTransacao {
  dataInicio?: Date;
  dataFim?: Date;
  tipo?: 'receita' | 'despesa' | 'todos';
  carteiraId?: string;
  usuarioId?: string;
}

export interface DetalheDespesaRecorrente {
  id: string;
  descricao: string;
  valorMensal: number;
  dataFim?: Date;
  eInfinito?: boolean;
  totalRestante: number;
}
