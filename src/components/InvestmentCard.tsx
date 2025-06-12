
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function InvestmentCard() {
  // Dados simulados para os investimentos
  const investments = [
    {
      id: 1,
      name: 'Reserva de Emergência',
      current: 5000,
      goal: 10000,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Viagem Europa',
      current: 2500,
      goal: 8000,
      createdAt: '2024-02-01'
    },
    {
      id: 3,
      name: 'Carro Novo',
      current: 15000,
      goal: 35000,
      createdAt: '2024-03-10'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Investimentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {investments.map((investment) => (
          <div key={investment.id} className="p-3 sm:p-4 border rounded-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-medium text-sm sm:text-base">{investment.name}</h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(investment.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Meta:</span>
                  <span className="text-xs sm:text-sm font-medium">{formatCurrency(investment.goal)}</span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-primary">
                  {formatCurrency(investment.current)}
                </span>
              </div>
              
              <Progress 
                value={calculateProgress(investment.current, investment.goal)} 
                className="h-2"
              />
              
              <div className="text-right">
                <span className="text-xs text-muted-foreground">
                  {calculateProgress(investment.current, investment.goal).toFixed(1)}% da meta
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {investments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum investimento cadastrado</p>
            <p className="text-xs mt-1">Use o botão "Nova Transação" para criar um investimento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
