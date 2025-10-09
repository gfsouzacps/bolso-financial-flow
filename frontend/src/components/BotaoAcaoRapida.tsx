import { useState } from 'react';
import { Plus, Minus, RefreshCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BotaoAcaoRapidaProps {
  onCliqueDespesa: () => void;
  onCliqueReceita: () => void;
  onCliqueRecorrente: () => void;
}

export function BotaoAcaoRapida({ 
  onCliqueDespesa, 
  onCliqueReceita, 
  onCliqueRecorrente 
}: BotaoAcaoRapidaProps) {
  const [estaAberto, setEstaAberto] = useState(false);

  const alternarAbertura = () => setEstaAberto(!estaAberto);

  const tratarAcao = (acao: () => void) => {
    acao();
    setEstaAberto(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {estaAberto && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setEstaAberto(false)}
        />
      )}
      
      {/* Opções de Ação Rápida */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-3 transition-all duration-300",
        estaAberto ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {/* Recorrente */}
        <Button
          size="lg"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg bg-purple-500 hover:bg-purple-600 text-white"
          onClick={() => tratarAcao(onCliqueRecorrente)}
        >
          <RefreshCcw className="h-5 w-5" />
        </Button>
        
        {/* Receita */}
        <Button
          size="lg"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
          onClick={() => tratarAcao(onCliqueReceita)}
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        {/* Despesa */}
        <Button
          size="lg"
          variant="secondary"
          className="h-12 w-12 rounded-full shadow-lg bg-red-500 hover:bg-red-600 text-white"
          onClick={() => tratarAcao(onCliqueDespesa)}
        >
          <Minus className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Botão Principal */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-transform duration-300",
          estaAberto && "rotate-45"
        )}
        onClick={alternarAbertura}
      >
        {estaAberto ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}