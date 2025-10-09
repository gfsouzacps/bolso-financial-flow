import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransacoes } from '@/contexts/ContextoTransacao';
import { CategoriaInvestimento } from '@/types/transacao';

interface ModalDetalheInvestimentoProps {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
  categoria: CategoriaInvestimento | null;
}

export function ModalDetalheInvestimento({ aberto, onAbertoChange, categoria }: ModalDetalheInvestimentoProps) {
  const [novoObjetivo, setNovoObjetivo] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [valorMovimentacao, setValorMovimentacao] = useState('');
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'receita' | 'despesa'>('receita');
  const [descricaoMovimentacao, setDescricaoMovimentacao] = useState('');
  const { transacoes, atualizarCategoriaInvestimento, adicionarTransacao } = useTransacoes();

  useEffect(() => {
    if (aberto) {
      setNovoObjetivo('');
      setNovoNome('');
      setValorMovimentacao('');
      setTipoMovimentacao('receita');
      setDescricaoMovimentacao('');
    }
  }, [aberto, categoria]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const tratarAtualizacaoObjetivo = () => {
    if (!categoria || !novoObjetivo) return;
    
    atualizarCategoriaInvestimento(categoria.id, {
      ...categoria,
      objetivo: parseFloat(novoObjetivo)
    });
    
    setNovoObjetivo('');
  };

  const tratarAtualizacaoNome = () => {
    if (!categoria || !novoNome) return;
    
    atualizarCategoriaInvestimento(categoria.id, {
      ...categoria,
      nome: novoNome.trim()
    });
    
    setNovoNome('');
  };

  const tratarAdicaoMovimentacao = () => {
    if (!categoria || !valorMovimentacao || !descricaoMovimentacao) return;

    const valor = parseFloat(valorMovimentacao);
    
    adicionarTransacao({
      descricao: descricaoMovimentacao,
      valor,
      tipo: tipoMovimentacao,
      data: new Date(),
      carteiraId: '3', // Carteira de investimentos (hardcoded)
      usuarioId: '1', // Usuário atual (hardcoded)
      categoriaId: categoria.id
    });

    const novoAtual = tipoMovimentacao === 'receita' 
      ? categoria.atual + valor 
      : categoria.atual - valor;

    atualizarCategoriaInvestimento(categoria.id, {
      ...categoria,
      atual: Math.max(0, novoAtual)
    });

    setValorMovimentacao('');
    setDescricaoMovimentacao('');
    setTipoMovimentacao('receita');
  };

  const transacoesDaCategoria = transacoes.filter(t => 
    t.carteiraId === '3' && // Carteira de investimentos
    t.categoriaId === categoria?.id
  );

  if (!categoria) return null;

  return (
    <Dialog open={aberto} onOpenChange={onAbertoChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{categoria.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Editar Nome */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Nome da Categoria</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="novoNome">Novo Nome</Label>
                <Input
                  id="novoNome"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder={categoria.nome}
                />
              </div>
              <Button onClick={tratarAtualizacaoNome} disabled={!novoNome}>
                Atualizar Nome
              </Button>
            </div>
          </div>

          {/* Editar Meta */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Meta da Categoria</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="novoObjetivo">Nova Meta (R$)</Label>
                <Input
                  id="novoObjetivo"
                  type="number"
                  value={novoObjetivo}
                  onChange={(e) => setNovoObjetivo(e.target.value)}
                  placeholder={`Atual: ${formatarMoeda(categoria.objetivo)}`}
                  min="0"
                  step="0.01"
                />
              </div>
              <Button onClick={tratarAtualizacaoObjetivo} disabled={!novoObjetivo}>
                Atualizar Meta
              </Button>
            </div>
          </div>

          {/* Adicionar Movimentação */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Nova Movimentação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="descricaoMovimentacao">Descrição</Label>
                <Input
                  id="descricaoMovimentacao"
                  value={descricaoMovimentacao}
                  onChange={(e) => setDescricaoMovimentacao(e.target.value)}
                  placeholder="Ex: Depósito mensal"
                />
              </div>
              <div>
                <Label htmlFor="valorMovimentacao">Valor (R$)</Label>
                <Input
                  id="valorMovimentacao"
                  type="number"
                  value={valorMovimentacao}
                  onChange={(e) => setValorMovimentacao(e.target.value)}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="tipoMovimentacao">Tipo</Label>
                <Select value={tipoMovimentacao} onValueChange={(valor: 'receita' | 'despesa') => setTipoMovimentacao(valor)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Entrada</SelectItem>
                    <SelectItem value="despesa">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={tratarAdicaoMovimentacao} 
                disabled={!valorMovimentacao || !descricaoMovimentacao}
                className="mt-6"
              >
                Adicionar
              </Button>
            </div>
          </div>
          
          {/* Extrato */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Extrato de Movimentações</h3>
            {transacoesDaCategoria.length > 0 ? (
              <div className="border rounded-lg">
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
                    {transacoesDaCategoria.map((transacao) => (
                      <TableRow key={transacao.id}>
                        <TableCell>
                          {transacao.data.toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{transacao.descricao}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transacao.tipo === 'receita' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transacao.tipo === 'receita' ? 'Entrada' : 'Saída'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                            {transacao.tipo === 'receita' ? '+' : '-'}{formatarMoeda(transacao.valor)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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