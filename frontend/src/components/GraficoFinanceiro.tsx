import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTransacoes } from '@/contexts/ContextoTransacao';

export function GraficoFinanceiro() {
  const { obterTotalReceitas, obterTotalDespesas } = useTransacoes();

  const receitas = obterTotalReceitas();
  const despesas = obterTotalDespesas();

  const dados = [
    {
      name: 'Entradas',
      value: receitas,
      color: 'hsl(var(--income))',
    },
    {
      name: 'Saídas',
      value: despesas,
      color: 'hsl(var(--expense))',
    },
  ];

  const formatarMoeda = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const TooltipPersonalizado = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatarMoeda(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (receitas === 0 && despesas === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhuma transação para exibir</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Visão Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-72 lg:h-64 xl:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {dados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<TooltipPersonalizado />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Entradas</p>
            <p className="text-base sm:text-lg font-semibold text-income">{formatarMoeda(receitas)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Saídas</p>
            <p className="text-base sm:text-lg font-semibold text-expense">{formatarMoeda(despesas)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}