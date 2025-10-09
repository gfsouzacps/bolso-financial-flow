import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTransacoes } from '@/contexts/ContextoTransacao';
import { cn } from '@/lib/utils';

export function ListaTransacoes() {
  const { obterTransacoesFiltradas, carteiras, usuarios } = useTransacoes();
  const transacoes = obterTransacoesFiltradas();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const obterNomeCarteira = (carteiraId: string) => {
    return carteiras.find(c => c.id === carteiraId)?.nome || 'Carteira';
  };

  const obterUsuario = (usuarioId: string) => {
    return usuarios.find(u => u.id === usuarioId);
  };

  if (transacoes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm mt-1">Ajuste os filtros ou adicione uma nova transação</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {transacoes.map((transacao) => {
            const usuario = obterUsuario(transacao.usuarioId);
            return (
              <div key={transacao.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    transacao.tipo === 'receita' ? 'bg-income/10' : 'bg-expense/10'
                  )}>
                    {transacao.tipo === 'receita' ? (
                      <ArrowUp className="h-4 w-4 text-income" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-expense" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transacao.descricao}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {usuario && (
                          <>
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className={cn("text-white text-xs", usuario.cor)}>
                                {usuario.nome.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{usuario.nome}</span>
                          </>
                        )}
                      </div>
                      <span>•</span>
                      <span>{obterNomeCarteira(transacao.carteiraId)}</span>
                      <span>•</span>
                      <span>
                        {format(transacao.data, "dd MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    transacao.tipo === 'receita' ? 'text-income' : 'text-expense'
                  )}>
                    {transacao.tipo === 'receita' ? '+' : '-'}{formatarMoeda(transacao.valor)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}