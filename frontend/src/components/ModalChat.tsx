import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTransacoes } from '@/contexts/ContextoTransacao';

interface TransacaoAnalisada {
  valor: number;
  descricao: string;
  categoriaId?: string;
  tipo: 'receita' | 'despesa';
  naturezaTransacao: 'pontual' | 'recorrente' | 'ambiguo';
}

export function ModalChat() {
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [estaProcessando, setEstaProcessando] = useState(false);
  const [transacaoAnalisada, setTransacaoAnalisada] = useState<TransacaoAnalisada | null>(null);
  const [carteiraSelecionada, setCarteiraSelecionada] = useState<string>('');
  const [eAmbiguo, setEAmbiguo] = useState(false);
  
  const { categoriasTransacao, carteiras, adicionarTransacao, usuarioAtual } = useTransacoes();

  const analisarMensagemTransacao = (texto: string): TransacaoAnalisada | null => {
    const valorCorrespondente = texto.match(/(\d+(?:[.,]\d+)?)\s*(?:reais?|r\$|R\$)?/i);
    
    if (!valorCorrespondente) return null;

    const valor = parseFloat(valorCorrespondente[1].replace(',', '.'));
    
    const eReceita = /ganhei|recebi|salário|entrada|freelance/i.test(texto);
    const tipo = eReceita ? 'receita' : 'despesa';
    
    const eRecorrente = /mensal|todo mês|mensalmente|recorrente|sempre|vitalício|assinatura/i.test(texto);
    const ePontual = /hoje|pontual|única|único|agora|uma vez/i.test(texto);
    
    let naturezaTransacao: 'pontual' | 'recorrente' | 'ambiguo' = 'ambiguo';
    if (eRecorrente) naturezaTransacao = 'recorrente';
    else if (ePontual) naturezaTransacao = 'pontual';
    
    let descricao = '';
    const aposPreposicao = texto.match(/(?:no|na|em|para|com|da|do)\s+([^0-9]+)/i);
    if (aposPreposicao) {
      descricao = aposPreposicao[1].trim();
    } else {
      const palavras = texto.split(' ').filter(palavra => !palavra.match(/\d/) && palavra.length > 2);
      descricao = palavras[0] || 'Transação';
    }

    let categoriaId = '';
    const mapaCategorias = {
      'restaurante': ['restaurante', 'outback', 'mcdonald', 'burger', 'pizza', 'comida'],
      'supermercado': ['supermercado', 'mercado', 'extra', 'carrefour', 'pão de açúcar'],
      'transporte': ['uber', 'taxi', 'combustível', 'gasolina', 'posto'],
      'lazer': ['cinema', 'teatro', 'show', 'balada', 'diversão', 'netflix'],
      'saúde': ['farmácia', 'médico', 'hospital', 'remédio'],
      'educação': ['escola', 'curso', 'livro', 'faculdade'],
      'moradia': ['aluguel', 'condomínio', 'luz', 'água', 'internet'],
      'salário': ['salário', 'pagamento', 'trabalho'],
      'outras receitas': ['freelance', 'extra', 'bônus']
    };

    const textoMinusculo = texto.toLowerCase();
    for (const [nomeCategoria, palavrasChave] of Object.entries(mapaCategorias)) {
      if (palavrasChave.some(palavraChave => textoMinusculo.includes(palavraChave))) {
        const categoria = categoriasTransacao.find(c => 
          c.nome.toLowerCase().includes(nomeCategoria) && 
          (c.tipo === tipo || c.tipo === 'ambos')
        );
        if (categoria) categoriaId = categoria.id;
        break;
      }
    }

    return {
      valor,
      descricao: descricao.charAt(0).toUpperCase() + descricao.slice(1),
      categoriaId,
      tipo,
      naturezaTransacao
    };
  };

  const tratarEnvioMensagem = async () => {
    if (!mensagem.trim()) return;

    setEstaProcessando(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analisado = analisarMensagemTransacao(mensagem);
    if (analisado) {
      setTransacaoAnalisada(analisado);
      setEAmbiguo(analisado.naturezaTransacao === 'ambiguo');
    } else {
      alert('Não consegui entender a transação. Tente algo como "gastei 50 reais no supermercado"');
    }
    
    setEstaProcessando(false);
  };

  const tratarSelecaoTipoTransacao = (naturezaTransacao: 'pontual' | 'recorrente') => {
    if (transacaoAnalisada) {
      setTransacaoAnalisada({
        ...transacaoAnalisada,
        naturezaTransacao
      });
      setEAmbiguo(false);
    }
  };

  const tratarConfirmacaoTransacao = () => {
    if (!transacaoAnalisada || !carteiraSelecionada || !usuarioAtual) return;

    const transacaoBase = {
      descricao: transacaoAnalisada.descricao,
      valor: transacaoAnalisada.valor,
      tipo: transacaoAnalisada.tipo,
      data: new Date(),
      carteiraId: carteiraSelecionada,
      usuarioId: usuarioAtual.id,
      categoriaTransacaoId: transacaoAnalisada.categoriaId,
    };

    if (transacaoAnalisada.naturezaTransacao === 'recorrente') {
      adicionarTransacao({
        ...transacaoBase,
        recorrencia: {
          tipo: 'monthly',
          eInfinito: true
        }
      });
    } else {
      adicionarTransacao(transacaoBase);
    }

    setMensagem('');
    setTransacaoAnalisada(null);
    setCarteiraSelecionada('');
    setEAmbiguo(false);
    setAberto(false);
  };

  const obterNomeCategoria = (categoriaId?: string) => {
    const categoria = categoriasTransacao.find(c => c.id === categoriaId);
    return categoria?.nome || 'Não categorizado';
  };

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Movimentação por Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!transacaoAnalisada ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Digite sua movimentação em linguagem natural:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: paguei 55,90 da netflix"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && tratarEnvioMensagem()}
                    disabled={estaProcessando}
                  />
                  <Button 
                    onClick={tratarEnvioMensagem} 
                    disabled={!mensagem.trim() || estaProcessando}
                    size="icon"
                  >
                    {estaProcessando ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p><strong>Exemplos:</strong></p>
                <p>• "paguei 55,90 da netflix mensal"</p>
                <p>• "gastei 50 reais no supermercado hoje"</p>
                <p>• "recebi 100 reais de freelance"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {eAmbiguo ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <h3 className="font-medium mb-2">Preciso esclarecer uma coisa:</h3>
                    <p className="text-sm mb-4">
                      Identifiquei o pagamento de <strong>R$ {transacaoAnalisada.valor.toFixed(2)}</strong> para <strong>{transacaoAnalisada.descricao}</strong>. 
                      Este é um gasto recorrente que se repete todo mês ou foi um pagamento único?
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => tratarSelecaoTipoTransacao('recorrente')}
                        variant="outline"
                        size="sm"
                      >
                        É Recorrente
                      </Button>
                      <Button 
                        onClick={() => tratarSelecaoTipoTransacao('pontual')}
                        variant="outline"
                        size="sm"
                      >
                        Pagamento Único
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-2">Transação identificada:</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Descrição:</strong> {transacaoAnalisada.descricao}</p>
                      <p><strong>Valor:</strong> R$ {transacaoAnalisada.valor.toFixed(2)}</p>
                      <p><strong>Tipo:</strong> {transacaoAnalisada.tipo === 'receita' ? 'Entrada' : 'Saída'}</p>
                      <p><strong>Categoria:</strong> {obterNomeCategoria(transacaoAnalisada.categoriaId)}</p>
                      <p><strong>Natureza:</strong> {transacaoAnalisada.naturezaTransacao === 'recorrente' ? 'Recorrente (mensal)' : 'Pontual'}</p>
                      <p><strong>Data:</strong> Hoje</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Selecione a carteira:
                    </label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={carteiraSelecionada}
                      onChange={(e) => setCarteiraSelecionada(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {carteiras.filter(c => c.nome !== 'Investimentos').map(carteira => (
                        <option key={carteira.id} value={carteira.id}>
                          {carteira.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setTransacaoAnalisada(null)}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button 
                      onClick={tratarConfirmacaoTransacao}
                      disabled={!carteiraSelecionada}
                      className="flex-1"
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}