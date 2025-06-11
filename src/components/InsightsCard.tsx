
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTransactions } from '@/contexts/TransactionContext';

interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info';
  message: string;
  icon: React.ReactNode;
}

export function InsightsCard() {
  const { getExpenseTotal, getIncomeTotal } = useTransactions();

  // Mock insights baseados nos dados reais
  const generateInsights = (): Insight[] => {
    const expense = getExpenseTotal();
    const income = getIncomeTotal();
    const savings = income - expense;
    
    const insights: Insight[] = [];

    // Insight sobre economia
    if (savings > 0) {
      insights.push({
        id: '1',
        type: 'success',
        message: `Parabéns! Você economizou ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savings)} este período!`,
        icon: <CheckCircle className="h-4 w-4" />
      });
    }

    // Insight sobre maiores gastos
    if (expense > 0) {
      insights.push({
        id: '2',
        type: 'info',
        message: `Seus gastos totalizaram ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)} neste período.`,
        icon: <TrendingUp className="h-4 w-4" />
      });
    }

    // Insight de alerta (simulado)
    if (expense > income * 0.8) {
      insights.push({
        id: '3',
        type: 'warning',
        message: 'Atenção: Seus gastos estão próximos da sua receita total.',
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }

    // Insights adicionais simulados
    insights.push({
      id: '4',
      type: 'info',
      message: 'Seu maior gasto este mês foi com Supermercado.',
      icon: <TrendingUp className="h-4 w-4" />
    });

    return insights.slice(0, 3); // Limita a 3 insights
  };

  const insights = generateInsights();

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-income border-l-income bg-income/5';
      case 'warning':
        return 'text-expense border-l-expense bg-expense/5';
      default:
        return 'text-primary border-l-primary bg-primary/5';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Seus Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-3 rounded-lg border-l-4 ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {insight.icon}
              </div>
              <p className="text-sm leading-relaxed">
                {insight.message}
              </p>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Insights aparecerão aqui</p>
            <p className="text-xs mt-1">Adicione mais transações para obter análises</p>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            💡 Insights gerados automaticamente com base nas suas transações
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
