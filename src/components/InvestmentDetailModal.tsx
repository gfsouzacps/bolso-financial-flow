
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTransactions } from '@/contexts/TransactionContext';
import { InvestmentCategory } from '@/types/transaction';

interface InvestmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: InvestmentCategory | null;
}

export function InvestmentDetailModal({ open, onOpenChange, category }: InvestmentDetailModalProps) {
  const [newGoal, setNewGoal] = useState('');
  const { transactions, updateInvestmentCategory } = useTransactions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleUpdateGoal = () => {
    if (!category || !newGoal) return;
    
    updateInvestmentCategory(category.id, {
      ...category,
      goal: parseFloat(newGoal)
    });
    
    setNewGoal('');
  };

  // Filtrar transações relacionadas a esta categoria de investimento
  const categoryTransactions = transactions.filter(t => 
    t.walletId === '3' && // Carteira de investimentos
    t.investmentCategoryId === category?.id
  );

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{category.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Editar Meta */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Meta da Categoria</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="newGoal">Nova Meta (R$)</Label>
                <Input
                  id="newGoal"
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder={`Atual: ${formatCurrency(category.goal)}`}
                  min="0"
                  step="0.01"
                />
              </div>
              <Button onClick={handleUpdateGoal} disabled={!newGoal}>
                Atualizar
              </Button>
            </div>
          </div>
          
          {/* Extrato */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Extrato de Movimentações</h3>
            {categoryTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.date.toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma movimentação encontrada para esta categoria</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
