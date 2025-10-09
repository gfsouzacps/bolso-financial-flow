import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Calendar, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTransacoes } from '@/contexts/ContextoTransacao';
import { ModalCategoriaInvestimento } from '@/components/ModalCategoriaInvestimento';
import { ModalDetalheInvestimento } from '@/components/ModalDetalheInvestimento';
import { CategoriaInvestimento } from '@/types/transacao';

export function CardInvestimento() {
  const { categoriasInvestimento } = useTransacoes();
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [mostrarModalDetalhe, setMostrarModalDetalhe] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaInvestimento | null>(null);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const calcularProgresso = (atual: number, objetivo: number) => {
    return Math.min((atual / objetivo) * 100, 100);
  };

  const tratarCliqueCategoria = (categoria: CategoriaInvestimento) => {
    setCategoriaSelecionada(categoria);
    setMostrarModalDetalhe(true);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Investimentos
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMostrarModalCriar(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoriasInvestimento.map((investimento) => (
            <div 
              key={investimento.id} 
              className="p-3 sm:p-4 border rounded-lg space-y-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => tratarCliqueCategoria(investimento)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-medium text-sm sm:text-base">{investimento.nome}</h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {investimento.criadoEm.toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Meta:</span>
                    <span className="text-xs sm:text-sm font-medium">{formatarMoeda(investimento.objetivo)}</span>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-primary">
                    {formatarMoeda(investimento.atual)}
                  </span>
                </div>
                
                <Progress 
                  value={calcularProgresso(investimento.atual, investimento.objetivo)} 
                  className="h-2"
                />
                
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    {calcularProgresso(investimento.atual, investimento.objetivo).toFixed(1)}% da meta
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {categoriasInvestimento.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma categoria de investimento</p>
              <p className="text-xs mt-1">Clique no + para criar sua primeira categoria</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ModalCategoriaInvestimento 
        aberto={mostrarModalCriar} 
        onAbertoChange={setMostrarModalCriar} 
      />
      
      <ModalDetalheInvestimento
        aberto={mostrarModalDetalhe}
        onAbertoChange={setMostrarModalDetalhe}
        categoria={categoriaSelecionada}
      />
    </>
  );
}