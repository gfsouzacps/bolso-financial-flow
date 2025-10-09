import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTransacoes } from '@/contexts/ContextoTransacao';
import { cn } from '@/lib/utils';

export function SeletorUsuario() {
  const { usuarios, filtros, atualizarFiltros } = useTransacoes();

  const tratarAlternanciaUsuario = (usuarioId: string) => {
    if (filtros.usuarioId === usuarioId) {
      // Se já está selecionado, remove o filtro (mostra todos)
      atualizarFiltros({ usuarioId: undefined });
    } else {
      // Seleciona o usuário específico
      atualizarFiltros({ usuarioId });
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
      <span className="text-sm font-medium">Exibindo transações de:</span>
      <div className="flex gap-2">
        <Button
          variant={!filtros.usuarioId ? "default" : "outline"}
          size="sm"
          onClick={() => atualizarFiltros({ usuarioId: undefined })}
          className="flex items-center gap-2"
        >
          Todos
        </Button>
        {usuarios.map((usuario) => (
          <Button
            key={usuario.id}
            variant={filtros.usuarioId === usuario.id ? "default" : "outline"}
            size="sm"
            onClick={() => tratarAlternanciaUsuario(usuario.id)}
            className="flex items-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className={cn("text-white text-xs", usuario.cor)}>
                {usuario.nome.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {usuario.nome}
          </Button>
        ))}
      </div>
    </div>
  );
}