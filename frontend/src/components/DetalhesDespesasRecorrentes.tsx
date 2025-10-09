import { ArrowLeft, Trash2, Calendar, Clock, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTransacoes } from '@/contexts/ContextoTransacao';
import { ModalEditarDespesaRecorrente } from '@/components/ModalEditarDespesaRecorrente';
import { useState } from 'react';

interface DetalhesDespesasRecorrentesProps {
  aoVoltar: () => void;
}

export function DetalhesDespesasRecorrentes({ aoVoltar }: DetalhesDespesasRecorrentesProps) {
  const { obterDetalhesDespesasRecorrentes, removerDespesaRecorrente } = useTransacoes();
  const [despesaEmEdicao, setDespesaEmEdicao] = useState<string | null>(null);
  const despesasRecorrentes = obterDetalhesDespesasRecorrentes();

  const formatarMoeda = (valor: number) => {
    if (valor === Infinity) return 'Infinito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarDataFim = (dataFim?: Date, eInfinito?: boolean) => {
    if (eInfinito) return 'Vitalício';
    if (!dataFim) return 'Não definido';
    return format(dataFim, 'MM/yyyy', { locale: ptBR });
  };

  const tratarRemocaoDespesa = (despesaId: string) => {
    if (confirm('Tem certeza que deseja remover esta despesa recorrente?')) {
      removerDespesaRecorrente(despesaId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={aoVoltar}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Gastos a Prazo</h1>
      </div>

      {/* Lista de gastos recorrentes */}
      <div className="space-y-4">
        {despesasRecorrentes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum gasto recorrente encontrado</p>
                <p className="text-sm mt-1">Adicione transações com recorrência para acompanhar seus gastos fixos</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          despesasRecorrentes.map((despesa) => (
            <Card key={despesa.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{despesa.descricao}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Mensal: {formatarMoeda(despesa.valorMensal)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Até: {formatarDataFim(despesa.dataFim, despesa.eInfinito)}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-warning">
                        Total restante: {formatarMoeda(despesa.totalRestante)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDespesaEmEdicao(despesa.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => tratarRemocaoDespesa(despesa.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de Edição */}
      {despesaEmEdicao && (
        <ModalEditarDespesaRecorrente
          despesaId={despesaEmEdicao}
          aberto={!!despesaEmEdicao}
          onAbertoChange={(aberto) => !aberto && setDespesaEmEdicao(null)}
        />
      )}
    </div>
  );
}