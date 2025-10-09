import { AlternadorTema } from './AlternadorTema';
import { useAutenticacao } from '@/contexts/ContextoAutenticacao';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { usuario, sair } = useAutenticacao();

  const tratarLogout = () => {
    sair();
  };

  return (
    <header className="flex items-center justify-between mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Controle Financeiro
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas finanças de forma inteligente
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {usuario && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{usuario.nome}</span>
          </div>
        )}
        
        <AlternadorTema />
        
        <Button
          variant="outline"
          size="sm"
          onClick={tratarLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
}