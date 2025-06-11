
import { TransactionProvider } from '@/contexts/TransactionContext';
import { Header } from '@/components/Header';
import { UserSelector } from '@/components/UserSelector';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionFilters } from '@/components/TransactionFilters';
import { TransactionList } from '@/components/TransactionList';
import { FinancialChart } from '@/components/FinancialChart';
import { TransactionModal } from '@/components/TransactionModal';

const Index = () => {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Header />
          <UserSelector />
          <BalanceCard />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <TransactionFilters />
              <TransactionList />
            </div>
            <div className="lg:col-span-1">
              <FinancialChart />
            </div>
          </div>
          
          <TransactionModal />
        </div>
      </div>
    </TransactionProvider>
  );
};

export default Index;
