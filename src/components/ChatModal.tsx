
import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTransactions } from '@/contexts/TransactionContext';

interface ParsedTransaction {
  amount: number;
  description: string;
  categoryId?: string;
  type: 'income' | 'expense';
}

export function ChatModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTransaction, setParsedTransaction] = useState<ParsedTransaction | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  
  const { transactionCategories, wallets, addTransaction, currentUser } = useTransactions();

  const parseTransactionMessage = (text: string): ParsedTransaction | null => {
    // Regex simples para extrair valores monetários
    const amountMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:reais?|r\$|R\$)?/i);
    
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(',', '.'));
    
    // Identificar se é receita ou despesa
    const isIncome = /ganhei|recebi|salário|entrada/i.test(text);
    const type = isIncome ? 'income' : 'expense';
    
    // Extrair descrição (texto após "no" ou "em" ou antes do valor)
    let description = '';
    const afterPrep = text.match(/(?:no|na|em|para|com)\s+([^0-9]+)/i);
    if (afterPrep) {
      description = afterPrep[1].trim();
    } else {
      // Pegar a primeira palavra que não seja um número
      const words = text.split(' ').filter(word => !word.match(/\d/) && word.length > 2);
      description = words[0] || 'Transação';
    }

    // Identificar categoria baseada em palavras-chave
    let categoryId = '';
    const categoryMap = {
      'restaurante': ['restaurante', 'outback', 'mcdonald', 'burger', 'pizza', 'comida'],
      'supermercado': ['supermercado', 'mercado', 'extra', 'carrefour', 'pão de açúcar'],
      'transporte': ['uber', 'taxi', 'combustível', 'gasolina', 'posto'],
      'lazer': ['cinema', 'teatro', 'show', 'balada', 'diversão'],
      'saúde': ['farmácia', 'médico', 'hospital', 'remédio'],
      'educação': ['escola', 'curso', 'livro', 'faculdade'],
      'moradia': ['aluguel', 'condomínio', 'luz', 'água', 'internet']
    };

    const lowerText = text.toLowerCase();
    for (const [catName, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        const category = transactionCategories.find(c => 
          c.name.toLowerCase().includes(catName) && 
          (c.type === type || c.type === 'both')
        );
        if (category) categoryId = category.id;
        break;
      }
    }

    return {
      amount,
      description: description.charAt(0).toUpperCase() + description.slice(1),
      categoryId,
      type
    };
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);
    
    // Simular processamento de IA
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const parsed = parseTransactionMessage(message);
    if (parsed) {
      setParsedTransaction(parsed);
    } else {
      alert('Não consegui entender a transação. Tente algo como "gastei 50 reais no supermercado"');
    }
    
    setIsProcessing(false);
  };

  const handleConfirmTransaction = () => {
    if (!parsedTransaction || !selectedWallet || !currentUser) return;

    addTransaction({
      description: parsedTransaction.description,
      amount: parsedTransaction.amount,
      type: parsedTransaction.type,
      date: new Date(),
      walletId: selectedWallet,
      userId: currentUser.id,
      transactionCategoryId: parsedTransaction.categoryId,
    });

    // Reset
    setMessage('');
    setParsedTransaction(null);
    setSelectedWallet('');
    setOpen(false);
  };

  const getCategoryName = (categoryId?: string) => {
    const category = transactionCategories.find(c => c.id === categoryId);
    return category?.name || 'Não categorizado';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Gasto por Chat</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!parsedTransaction ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Digite seu gasto em linguagem natural:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: gastei 300 reais no outback"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!message.trim() || isProcessing}
                    size="icon"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p><strong>Exemplos:</strong></p>
                <p>• "gastei 50 reais no supermercado"</p>
                <p>• "paguei 300 no outback"</p>
                <p>• "recebi 100 reais"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Transação identificada:</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Descrição:</strong> {parsedTransaction.description}</p>
                  <p><strong>Valor:</strong> R$ {parsedTransaction.amount.toFixed(2)}</p>
                  <p><strong>Tipo:</strong> {parsedTransaction.type === 'income' ? 'Entrada' : 'Saída'}</p>
                  <p><strong>Categoria:</strong> {getCategoryName(parsedTransaction.categoryId)}</p>
                  <p><strong>Data:</strong> Hoje</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Selecione a carteira:
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {wallets.filter(w => w.name !== 'Investimentos').map(wallet => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setParsedTransaction(null)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button 
                  onClick={handleConfirmTransaction}
                  disabled={!selectedWallet}
                  className="flex-1"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
