
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTransactions } from '@/contexts/TransactionContext';

export function FinancialChart() {
  const { getIncomeTotal, getExpenseTotal } = useTransactions();

  const income = getIncomeTotal();
  const expense = getExpenseTotal();

  const data = [
    {
      name: 'Entradas',
      value: income,
      color: 'hsl(var(--income))',
    },
    {
      name: 'Saídas',
      value: expense,
      color: 'hsl(var(--expense))',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (income === 0 && expense === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>Nenhuma transação para exibir</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Entradas</p>
            <p className="text-lg font-semibold text-income">{formatCurrency(income)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Saídas</p>
            <p className="text-lg font-semibold text-expense">{formatCurrency(expense)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
