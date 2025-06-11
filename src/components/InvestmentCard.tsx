
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Investment {
  id: string;
  name: string;
  amount: number;
  goal?: number;
  dueDate?: Date;
}

// Mock data para demonstração
const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Reserva de Emergência',
    amount: 5000.00,
    goal: 10000.00,
  },
  {
    id: '2',
    name: 'Viagem Férias',
    amount: 1200.00,
    goal: 3000.00,
    dueDate: new Date('2024-12-01'),
  },
  {
    id: '3',
    name: 'Investimento Longo Prazo',
    amount: 2500.00,
  },
];

export function InvestmentCard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getProgressPercentage = (current: number, goal?: number) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Investimentos
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Novo
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockInvestments.map((investment) => (
          <div key={investment.id} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">{investment.name}</h4>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(investment.amount)}
              </span>
            </div>
            
            {investment.goal && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Meta: {formatCurrency(investment.goal)}</span>
                  <span>{getProgressPercentage(investment.amount, investment.goal).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${getProgressPercentage(investment.amount, investment.goal)}%` }}
                  />
                </div>
              </div>
            )}
            
            {investment.dueDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Vencimento: {format(investment.dueDate, "dd MMM yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        ))}
        
        {mockInvestments.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <p>Nenhum investimento cadastrado</p>
            <p className="text-sm mt-1">Comece criando seu primeiro investimento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
