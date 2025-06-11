import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, Wallet, TransactionFilters, User } from '@/types/transaction';

interface TransactionContextType {
  transactions: Transaction[];
  wallets: Wallet[];
  users: User[];
  filters: TransactionFilters;
  currentUser: User | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateFilters: (filters: Partial<TransactionFilters>) => void;
  setCurrentUser: (user: User) => void;
  getFilteredTransactions: () => Transaction[];
  getTotalBalance: () => number;
  getIncomeTotal: () => number;
  getExpenseTotal: () => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'Você', color: 'bg-blue-500' },
  { id: '2', name: 'Sua Esposa', color: 'bg-pink-500' },
];

const mockWallets: Wallet[] = [
  { id: '1', name: 'Carteira Principal', balance: 1250.00 },
  { id: '2', name: 'Investimentos', balance: 5000.00 },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salário',
    amount: 3500.00,
    type: 'income',
    date: new Date('2024-06-01'),
    walletId: '1',
    userId: '1'
  },
  {
    id: '2',
    description: 'Supermercado',
    amount: 250.00,
    type: 'expense',
    date: new Date('2024-06-05'),
    walletId: '1',
    userId: '2'
  },
  {
    id: '3',
    description: 'Freelance',
    amount: 800.00,
    type: 'income',
    date: new Date('2024-06-10'),
    walletId: '1',
    userId: '1'
  },
  {
    id: '4',
    description: 'Conta de luz',
    amount: 120.00,
    type: 'expense',
    date: new Date('2024-06-08'),
    walletId: '1',
    userId: '1'
  },
  {
    id: '5',
    description: 'Gasolina',
    amount: 180.00,
    type: 'expense',
    date: new Date('2024-06-11'),
    walletId: '1',
    userId: '2'
  },
];

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [wallets] = useState<Wallet[]>(mockWallets);
  const [users] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all'
  });

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const typeMatch = filters.type === 'all' || transaction.type === filters.type;
      const startDateMatch = !filters.startDate || transaction.date >= filters.startDate;
      const endDateMatch = !filters.endDate || transaction.date <= filters.endDate;
      const walletMatch = !filters.walletId || transaction.walletId === filters.walletId;
      const userMatch = !filters.userId || transaction.userId === filters.userId;

      return typeMatch && startDateMatch && endDateMatch && walletMatch && userMatch;
    });
  };

  const getTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const getIncomeTotal = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getExpenseTotal = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        wallets,
        users,
        currentUser,
        filters,
        addTransaction,
        updateFilters,
        setCurrentUser,
        getFilteredTransactions,
        getTotalBalance,
        getIncomeTotal,
        getExpenseTotal,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
