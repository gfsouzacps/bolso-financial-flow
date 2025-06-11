
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  walletId: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  walletId: string;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: 'income' | 'expense' | 'all';
  walletId?: string;
}
