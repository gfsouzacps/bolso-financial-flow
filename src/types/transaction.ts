
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  walletId: string;
  userId: string;
  recurrence?: {
    type: 'none' | 'monthly' | 'weekly' | 'yearly' | 'custom';
    repetitions?: number;
    endDate?: Date;
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

export interface TransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  walletId: string;
  userId: string;
  recurrence?: {
    type: 'none' | 'monthly' | 'weekly' | 'yearly' | 'custom';
    repetitions?: number;
    endDate?: Date;
  };
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense' | 'all';
  walletId?: string;
  userId?: string;
}
