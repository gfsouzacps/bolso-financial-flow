import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransacoes } from '@/contexts/ContextoTransacao';

interface ModalCategoriaInvestimentoProps {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
}

export function ModalCategoriaInvestimento({ aberto, onAbertoChange }: ModalCategoriaInvestimentoProps) {
  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const { adicionarCategoriaInvestimento } = useTransacoes();

  const tratarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !objetivo) return;

    adicionarCategoriaInvestimento({
      nome: nome.trim(),
      objetivo: parseFloat(objetivo),
      cor: 'bg-blue-500', // TODO: Permitir que o usuário escolha a cor
    });

    setNome('');
    setObjetivo('');
    onAbertoChange(false);
  };

  return (
    <Dialog open={aberto} onOpenChange={onAbertoChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Categoria de Investimento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={tratarSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Viagem, Carro Novo..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">Meta (R$)</Label>
            <Input
              id="goal"
              type="number"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              placeholder="Ex: 10000"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onAbertoChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}