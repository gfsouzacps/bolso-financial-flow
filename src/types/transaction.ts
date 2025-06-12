
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  walletId: string;
  userId: string;
  categoryId?: string; // Para categorias de investimento
  recurrence?: {
    type: 'none' | 'monthly' | 'weekly' | 'yearly' | 'custom';
    repetitions?: number;
    endDate?: Date;
    isInfinite?: boolean; // Para recorrência sem fim
  };
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  goal: number;
  current: number;
  color: string;
  createdAt: Date;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  walletId: string;
  userId: string;
  categoryId?: string;
  recurrence?: {
    type: 'none' | 'monthly' | 'weekly' | 'yearly' | 'custom';
    repetitions?: number;
    endDate?: Date;
    isInfinite?: boolean;
  };
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense' | 'all';
  walletId?: string;
  userId?: string;
}
