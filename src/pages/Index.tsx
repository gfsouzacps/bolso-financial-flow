
import { TransactionProvider } from '@/contexts/TransactionContext';
import { Header } from '@/components/Header';
import { UserSelector } from '@/components/UserSelector';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionFilters } from '@/components/TransactionFilters';
import { TransactionList } from '@/components/TransactionList';
import { FinancialChart } from '@/components/FinancialChart';
import { InvestmentCard } from '@/components/InvestmentCard';
import { InsightsCard } from '@/components/InsightsCard';
import { RecurringExpensesCard } from '@/components/RecurringExpensesCard';
import { TransactionModal } from '@/components/TransactionModal';

const Index = () => {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
          <Header />
          <UserSelector />
          <BalanceCard />
          
          {/* Layout responsivo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2 order-1 lg:order-1">
              <TransactionFilters />
              <TransactionList />
            </div>
            <div className="lg:col-span-1 order-2 lg:order-2">
              <FinancialChart />
            </div>
          </div>
          
          {/* Seção de Gastos Recorrentes */}
          <div className="mb-6 sm:mb-8">
            <RecurringExpensesCard />
          </div>
          
          {/* Seção de Investimentos e Insights - empilhados em mobile */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <InvestmentCard />
            <InsightsCard />
          </div>
          
          <TransactionModal />
        </div>
      </div>
    </TransactionProvider>
  );
};

export default Index;
